// --- START OF FILE useGenogramaState.js ---
// archivo para que se guarde el snapshopt del genograma y se pueda importar y exportar
// y para que se pueda editar el label de los nodos y las relaciones entre ellos

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
import { normalizeGenogram } from '../utils/normalizeGenogram';

export default function useGenogramaState() {
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [idCounter, setIdCounter] = useState(1);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      type: "relationshipEdge",
      data: { relType: "bezier" },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleEditLabel = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  }, [setNodes]);

  const showToast = useCallback((msg, success = true) => {
    const div = document.createElement("div");
    div.textContent = msg;
    Object.assign(div.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: success ? "#4ade80" : "#f87171",
      color: "white",
      padding: "8px 12px",
      borderRadius: "8px",
      zIndex: 9999,
    });
    document.body.appendChild(div);
    setTimeout(() => document.body.removeChild(div), 2500);
  }, []);

  const onRelate = useCallback((source, target, relType) => {
    const sourceExists = nodes.some((n) => n.id === source);
    const targetExists = nodes.some((n) => n.id === target);
    if (!sourceExists || !targetExists) {
      showToast("❌ Uno o ambos IDs no existen.", false);
      return;
    }
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);
    let sourceHandle = 'b';
    let targetHandle = 't';
    if (sourceNode && targetNode && Math.abs(sourceNode.position.y - targetNode.position.y) < 100) {
      if (sourceNode.position.x < targetNode.position.x) {
        sourceHandle = 'r'; targetHandle = 'l';
      } else {
        sourceHandle = 'l'; targetHandle = 'r';
      }
    } else if (sourceNode && targetNode && sourceNode.position.y < targetNode.position.y) {
      sourceHandle = 'b'; targetHandle = 't';
    } else {
      sourceHandle = 't'; targetHandle = 'b';
    }
    setEdges((eds) => [
      ...eds.filter((edge) => !(edge.source === source && edge.target === target)),
      {
        id: `rel-${source}-${target}-${relType}`,
        source, target, sourceHandle, targetHandle,
        type: "relationshipEdge",
        data: { relType },
      },
    ]);
    showToast(`✔ Relación '${relType}' creada entre ${source} y ${target}`);
  }, [nodes, setEdges, setNodes, showToast]);

  const updateEdgeRelation = useCallback((edgeId, newRelType) => {
    if (!edgeId) return;
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...(edge.data || {}), relType: newRelType } };
        }
        return edge;
      })
    );
    const edgeParts = edgeId.split('-');
    if (edgeParts.length >= 3) {
      const source = edgeParts[1];
      const target = edgeParts[2];
      showToast(`✔ Relación actualizada a '${newRelType}' entre ${source} y ${target}`);
    } else {
      showToast(`✔ Relación actualizada a '${newRelType}'`);
    }
  }, [setEdges, showToast]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
    const position = project({ x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top });
    const newNode = { id: String(idCounter), type: data.type, position, data: { label: data.label } };
    setNodes((nds) => nds.concat(newNode));
    setIdCounter((prev) => prev + 1);
  }, [idCounter, setNodes, project]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onImportJSON = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target.result);

        if (rawData.isSnapshot) {
          // Es un snapshot: restaurar directamente
          setNodes(rawData.nodes || []);
          setEdges(rawData.edges || []);
          showToast("✔ Snapshot importado correctamente");
        } else {
          // Es un JSON estructurado: aplicar cálculos y layout
          const { nodes: structuralNodes, edges: structuralEdges } = normalizeGenogram(rawData);
          const laidOutNodes = layoutWithDagre(structuralNodes, structuralEdges, { respectExistingPositions: true });
          setNodes(laidOutNodes);
          setEdges(structuralEdges);
          showToast("✔ Genograma estructurado importado con layout aplicado");
        }
      } catch (err) {
        showToast("❌ Error al importar JSON", false);
        console.error(err);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, showToast]);

  const onExportJSON = useCallback(() => {
    const snapshot = {
      isSnapshot: true,
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e }))
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "genograma_snapshot.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("✅ Snapshot exportado correctamente");
  }, [nodes, edges, showToast]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleEditLabel,
    onRelate,
    updateEdgeRelation,
    onDrop,
    onDragOver,
    onImportJSON,
    onExportJSON
  };
}

// --- END OF FILE useGenogramaState.js ---
