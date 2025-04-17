import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
import { transformToReactFlow } from '../utils/transformToReactFlow';

/**
 * Hook personalizado para manejar el estado del genograma
 * Centraliza la gestión de nodos, aristas, relaciones, etc.
 */
export default function useGenogramaState() {
  // Estado inicial con un nodo paciente
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "paciente",
      position: { x: 250, y: 100 },
      data: { label: "Paciente" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [idCounter, setIdCounter] = useState(2);

  // Conectar nodos
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Editar etiqueta de un nodo
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

  // Mostrar notificación toast
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

  // Crear relación entre nodos
  const onRelate = useCallback(
    (source, target, relType) => {
      const sourceExists = nodes.some((n) => n.id === source);
      const targetExists = nodes.some((n) => n.id === target);
      
      if (!sourceExists || !targetExists) {
        showToast("❌ Uno o ambos IDs no existen.", false);
        return;
      }

      setEdges((eds) => [
        ...eds.filter(
          (edge) => !(edge.source === source && edge.target === target)
        ),
        {
          id: `${source}-${target}-${relType}`,
          source,
          target,
          type: "relationshipEdge",
          data: { relType },
        },
      ]);

      setNodes((nds) =>
        nds.map((node) =>
          node.id === source || node.id === target
            ? {
                ...node,
                style: {
                  ...node.style,
                  boxShadow: "0 0 0 4px rgba(59,130,246,0.5)",
                },
              }
            : node
        )
      );

      showToast(`✔ Relación '${relType}' creada entre ${source} y ${target}`);
    },
    [nodes, setEdges, setNodes, showToast]
  );

  // Arrastrar nodos al canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode = {
        id: String(idCounter),
        type: data.type,
        position,
        data: { label: data.label },
      };
      setNodes((nds) => nds.concat(newNode));
      setIdCounter((prev) => prev + 1);
    },
    [idCounter, setNodes]
  );

  // Permitir drop
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
  
        let finalNodes = [];
        let finalEdges = [];
  
        // 1) Ver si es "nuevo" o "viejo" formato
        if (rawData.people && rawData.relationships) {
          // Es el nuevo formato universal
          const { nodes, edges } = transformToReactFlow(rawData);
          finalNodes = nodes;
          finalEdges = edges;
        } else if (rawData.nodes && rawData.edges) {
          // Es el antiguo
          finalNodes = rawData.nodes;
          finalEdges = rawData.edges;
        } else {
          showToast("JSON inválido: no contiene people/relationships ni nodes/edges", false);
          return;
        }
  
        // 2) Aplico dagre layout
        const laidOutNodes = layoutWithDagre(finalNodes, finalEdges);
        setNodes(laidOutNodes);
        setEdges(finalEdges);
  
        // 3) Ajustar idCounter para evitar colisiones
        let maxId = 0;
        laidOutNodes.forEach((n) => {
          const numericId = parseInt(n.id.replace(/[^0-9]/g, ""), 10); 
          if (!isNaN(numericId) && numericId > maxId) {
            maxId = numericId;
          }
        });
        setIdCounter(maxId + 1);
        
        showToast("✔ Genograma importado correctamente");
      } catch (err) {
        showToast("❌ Error al leer JSON: " + err.message, false);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, showToast]);

  const onExportJSON = useCallback(() => {
    const dataToExport = { nodes, edges };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "genograma.json";
    link.click();
    showToast("✔ JSON exportado correctamente");
  }, [nodes, edges, showToast]);

  const onExportCSV = useCallback(() => {
    let csv = "type,id,label,x,y,source,target,relType\n";
    nodes.forEach((node) => {
      csv += `"node","${node.id}","${node.data.label}",${node.position.x},${node.position.y},,,\n`;
    });
    edges.forEach((edge) => {
      csv += `"edge","${edge.id}",,,,${edge.source},${edge.target},${
        edge.data?.relType || ""
      }\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "genograma.csv";
    link.click();
    showToast("✔ CSV exportado correctamente");
  }, [nodes, edges, showToast]);

  // Exportar como imagen
  const exportImage = useCallback(async (format = "png") => {
    const flowArea = document.querySelector(".react-flow");
    if (!flowArea) return;
    
    try {
      // Importa html2canvas dinámicamente
      const html2canvas = await import('html2canvas').then(module => module.default);
      const canvas = await html2canvas(flowArea);
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `genograma.${format}`;
      link.click();
      showToast(`✔ Imagen ${format.toUpperCase()} exportada correctamente`);
    } catch (err) {
      showToast("❌ Error al exportar imagen", false);
      console.error("Error exportando imagen:", err);
    }
  }, [showToast]);

  const onExportPNG = useCallback(() => {
    exportImage("png");
  }, [exportImage]);

  const onExportJPG = useCallback(() => {
    exportImage("jpeg");
  }, [exportImage]);

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
    onDrop,
    onDragOver,
    onImportJSON,
    onExportJSON,
    onExportCSV,
    onExportPNG,
    onExportJPG
  };
}