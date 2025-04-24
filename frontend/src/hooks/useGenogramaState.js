import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow'; // Importar useReactFlow
import layoutWithDagre from '../utils/layoutWithDagre';
import { transformToReactFlow } from '../utils/transformToReactFlow';
import { normalizeGenogram } from '../utils/normalizeGenogram';  // Importación corregida

/**
 * Hook personalizado para manejar el estado del genograma
 * Centraliza la gestión de nodos, aristas, relaciones, etc.
 */
export default function useGenogramaState() {
  const { project } = useReactFlow(); // Obtener la función project
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
    (params) => {
      // 1) Creamos la nueva arista usando tu tipo custom "relationshipEdge"
      // 2) Inicializamos data.relType para que luego updateEdgeRelation pueda sobreescribirlo
      const newEdge = {
        ...params,
        type: "relationshipEdge",          // usa tu RelationshipEdge
        data: { relType: "bezier" },   // relType por defecto
      };
  
      setEdges((eds) => addEdge(newEdge, eds));
    },
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

      // Obtener los nodos de origen y destino para determinar la mejor manera de conectarlos
      const sourceNode = nodes.find(n => n.id === source);
      const targetNode = nodes.find(n => n.id === target);
      
      // Determinar los handles de origen y destino basados en la posición relativa
      let sourceHandle = 'b'; // Por defecto, usar el handle inferior (bottom)
      let targetHandle = 't'; // Por defecto, usar el handle superior (top)
      
      // Si los nodos están a la misma altura, preferir conexión lateral
      if (Math.abs(sourceNode.position.y - targetNode.position.y) < 100) {
        if (sourceNode.position.x < targetNode.position.x) {
          // El origen está a la izquierda del destino
          sourceHandle = 'r'; // Handle derecho del nodo origen
          targetHandle = 'l'; // Handle izquierdo del nodo destino
        } else {
          // El origen está a la derecha del destino
          sourceHandle = 'l'; // Handle izquierdo del nodo origen
          targetHandle = 'r'; // Handle derecho del nodo destino
        }
      } else if (sourceNode.position.y < targetNode.position.y) {
        // El origen está arriba del destino, conexión vertical hacia abajo
        sourceHandle = 'b'; // Handle inferior del nodo origen
        targetHandle = 't'; // Handle superior del nodo destino
      } else {
        // El origen está abajo del destino, conexión vertical hacia arriba
        sourceHandle = 't'; // Handle superior del nodo origen
        targetHandle = 'b'; // Handle inferior del nodo destino
      }

      setEdges((eds) => [
        ...eds.filter(
          (edge) => !(edge.source === source && edge.target === target)
        ),
        {
          id: `${source}-${target}-${relType}`,
          source,
          target,
          sourceHandle,
          targetHandle,
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

  // Actualizar el tipo de relación de una conexión existente
  const updateEdgeRelation = useCallback(
    (edgeId, newRelType) => {
      if (!edgeId) return;
      
      setEdges((eds) => 
        eds.map((edge) => {
          if (edge.id === edgeId) {
            return {
              ...edge,
              data: { ...edge.data, relType: newRelType }
            };
          }
          return edge;
        })
      );
      
      // Extraer IDs de origen y destino del edge.id (formato "source-target-relType")
      const edgeParts = edgeId.split('-');
      if (edgeParts.length >= 2) {
        const [source, target] = edgeParts;
        showToast(`✔ Relación actualizada a '${newRelType}' entre ${source} y ${target}`);
      } else {
        showToast(`✔ Relación actualizada a '${newRelType}'`);
      }
    },
    [setEdges, showToast]
  );

  // Arrastrar nodos al canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      // Usar project para obtener las coordenadas correctas del grafo
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: String(idCounter),
        type: data.type,
        position, // Usar la posición proyectada
        data: { label: data.label },
      };
      setNodes((nds) => nds.concat(newNode));
      setIdCounter((prev) => prev + 1);
    },
    [idCounter, setNodes, project] // Añadir project a las dependencias
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
          // Es el nuevo formato universal - Usar la nueva estrategia de nodo-familia
          const { nodes, edges } = normalizeGenogram(rawData);
          finalNodes = nodes;
          finalEdges = edges;
        } else if (rawData.nodes && rawData.edges) {
          // Es el formato antiguo (ya procesado)
          finalNodes = rawData.nodes;
          finalEdges = rawData.edges;
        } else {
          showToast("JSON inválido: no contiene people/relationships ni nodes/edges", false);
          return;
        }
  
        // 2) Aplico dagre layout (ahora sin forzar posición Y por generación)
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