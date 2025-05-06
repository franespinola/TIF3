// --- START OF FILE useGenogramaState.js ---

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
// Importar normalizeGenogram que omite hermanos/mellizos para el layout inicial
import { normalizeGenogram } from '../utils/normalizeGenogram';

/**
 * Hook personalizado para manejar el estado del genograma.
 */
export default function useGenogramaState() {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [idCounter, setIdCounter] = useState(1);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "relationshipEdge",
        data: { relType: "bezier" },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleEditLabel = useCallback(
    (id, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

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

  const onRelate = useCallback(
    (source, target, relType) => {
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
        ...eds.filter(
          (edge) => !(edge.source === source && edge.target === target)
        ),
        {
          id: `rel-${source}-${target}-${relType}`,
          source, target, sourceHandle, targetHandle,
          type: "relationshipEdge",
          data: { relType },
        },
      ]);
      showToast(`✔ Relación '${relType}' creada entre ${source} y ${target}`);
    },
    [nodes, setEdges, setNodes, showToast]
  );

  const updateEdgeRelation = useCallback(
    (edgeId, newRelType) => {
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
    },
    [setEdges, showToast]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
      const position = screenToFlowPosition({ 
        x: event.clientX, 
        y: event.clientY 
      });
      
      // Crear ID único para el nuevo nodo
      const newNodeId = `${data.type}_${Date.now()}_${idCounter}`;
      
      // Crear el nodo manteniendo todos los datos originales (no solo el label)
      // y agregando initialEdit para activar la edición automáticamente
      const newNode = { 
        id: newNodeId, 
        type: data.type, 
        position, 
        data: { 
          ...data.data, // Incluir todos los datos originales
          label: data.label,
          initialEdit: true // Agregar flag para activar edición
        }
      };
      
      setNodes((nds) => nds.concat(newNode));
      setIdCounter((prev) => prev + 1);

      // Emitir el evento personalizado para activar la edición
      // Igual que en el método handleNodeClick de AnnotationToolPalette.jsx
      setTimeout(() => {
        // Seleccionar el nodo recién creado
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === newNodeId
              ? { ...node, selected: true }
              : { ...node, selected: false }
          )
        );
        
        // Emitir evento para activar la edición
        const editEvent = new CustomEvent('activateNodeEdit', { 
          detail: { nodeId: newNodeId } 
        });
        document.dispatchEvent(editEvent);
      }, 100);
    },
    [idCounter, setNodes, screenToFlowPosition]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // IMPORT / EXPORT
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

        // Ajustar idCounter para evitar colisiones
        let maxId = 0;
        rawData.nodes?.forEach((n) => {
          if (n && n.id) {
            const numericId = parseInt(n.id.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(numericId) && numericId > maxId) maxId = numericId;
          }
        });
        setIdCounter(maxId + 1);
      } catch (err) {
        showToast("❌ Error al importar JSON", false);
        console.error(err);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, showToast, setIdCounter]);

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

  const onExportCSV = useCallback(() => {
    let csv = "type,id,label,x,y,source,target,relType\n";
    nodes.forEach((node) => { csv += `"node","${node.id}","${node.data.label}",${node.position.x},${node.position.y},,,\n`; });
    edges.forEach((edge) => { csv += `"edge","${edge.id}",,,,${edge.source},${edge.target},${edge.data?.relType || ""}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "genograma.csv"; link.click();
    showToast("✔ CSV exportado correctamente");
  }, [nodes, edges, showToast]);

  const exportImage = useCallback(async (format = "png") => {
    // Buscar el contenedor principal que incluye tanto el React Flow como el overlay de dibujo
    const flowWrapper = document.getElementById('flowWrapper');
    if (!flowWrapper) {
      showToast("❌ No se pudo encontrar el contenedor del diagrama", false);
      return;
    }
    
    try {
      // Guardar el estado original de visibilidad de elementos que queremos ocultar
      const minimapElement = document.querySelector(".react-flow__minimap");
      const controlsElement = document.querySelector(".react-flow__controls");
      const smartGuidesElement = document.querySelector(".react-flow-smart-edge__guide");
      const attributionElement = document.querySelector(".react-flow__attribution");
      // Encontrar el panel de navegación
      const navigationPanel = document.querySelector(".navigation-panel");
      
      // Guardar visibilidad original
      const originalStates = [];
      [minimapElement, controlsElement, smartGuidesElement, attributionElement, navigationPanel].forEach(el => {
        if (el) {
          originalStates.push({
            element: el,
            display: el.style.display
          });
          el.style.display = 'none'; // Ocultar temporalmente
        }
      });
      
      // Asegurar que capture todo el diagrama completo incluyendo el dibujo libre
      const options = { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        scale: 2, // Mayor resolución
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        width: flowWrapper.offsetWidth,
        height: flowWrapper.offsetHeight,
        ignoreElements: (element) => {
          return element.classList && (
            element.classList.contains('react-flow__minimap') ||
            element.classList.contains('react-flow__controls') ||
            element.classList.contains('react-flow-smart-edge__guide') ||
            element.classList.contains('react-flow__attribution') ||
            element.classList.contains('navigation-panel')
          );
        }
      };
      
      const html2canvas = await import('html2canvas').then(module => module.default);
      const canvas = await html2canvas(flowWrapper, options);
      
      // Restaurar visibilidad original
      originalStates.forEach(state => {
        state.element.style.display = state.display;
      });
      
      // Exportar la imagen
      const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `genograma.${format}`;
      link.click();
      
      showToast(`✔ Imagen ${format.toUpperCase()} exportada`);
    } catch (err) {
      showToast("❌ Error al exportar imagen", false);
      console.error("Error exportando imagen:", err);
    }
  }, [showToast]);

  const onExportPNG = useCallback(() => exportImage("png"), [exportImage]);
  const onExportJPG = useCallback(() => exportImage("jpeg"), [exportImage]);

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
    onExportJSON,
    onExportCSV,
    onExportPNG,
    onExportJPG
  };
}
// --- END OF FILE useGenogramaState.js ---