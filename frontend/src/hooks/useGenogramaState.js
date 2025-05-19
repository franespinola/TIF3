// --- START OF FILE useGenogramaState.js ---

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
// Importar normalizeGenogram que omite hermanos/mellizos para el layout inicial
import { normalizeGenogram } from '../utils/normalizeGenogram';
// Importar las funciones de exportación de imágenes
import { exportAsPng, exportAsJpeg, exportAsCanvas } from '../utils/imageExport';
import genogramService from '../services/genogramService'; // Importación para guardar en la base de datos

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
    [nodes, setEdges, showToast]
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
          // Es un JSON estructurado: aplicar cálculos y layout mejorado
          const { nodes: structuralNodes, edges: structuralEdges } = normalizeGenogram(rawData);
          
          // Aplicar un layout mejorado con parámetros optimizados
          const laidOutNodes = layoutWithDagre(structuralNodes, structuralEdges, { 
            rankdir: "TB",     // Top to Bottom (de arriba hacia abajo)
            ranksep: 200,      // Mayor separación vertical entre generaciones
            nodesep: 150,      // Mayor separación horizontal entre nodos
            respectExistingPositions: false  // Forzar recálculo completo
          });
          
          setNodes(laidOutNodes);
          setEdges(structuralEdges);
          showToast("✔ Genograma estructurado importado con layout mejorado");
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

  const saveToDatabase = useCallback(async ({ genogramId = null, patientId, name, description, notes, thumbnail = null }) => {
    // Crear una copia profunda de nodos y aristas para asegurar que se guarden todas las propiedades
    const snapshot = {
      isSnapshot: true,
      nodes: nodes.map(n => ({ 
        ...n,
        // Asegurar que la posición se guarde correctamente
        position: { 
          x: n.position?.x || 0,
          y: n.position?.y || 0
        },
        // Asegurar que todos los datos se guarden
        data: { ...n.data }
      })),
      edges: edges.map(e => ({ ...e, data: { ...e.data } }))
    };

    const payload = {
      patient_id: patientId,
      name,
      description,
      notes,
      thumbnail,
      data: snapshot
    };

    try {
      let response;
      if (genogramId) {
        response = await genogramService.updateGenogram(genogramId, payload);
        showToast("✅ Genograma actualizado correctamente");
      } else {
        response = await genogramService.createGenogram(payload);
        showToast("✅ Genograma creado correctamente");
      }
      return response;
    } catch (error) {
      console.error("❌ Error al guardar genograma:", error);
      showToast("❌ Error al guardar genograma", false);
    }
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

  // Reemplazar función exportImage con las nuevas funciones de html-to-image
  const exportImage = useCallback(async (format = "png") => {
    // Usar el ID 'flowWrapper' que es el contenedor del editor de genograma
    const elementId = 'flowWrapper';
    const fileName = 'genograma';
    
    try {
      // Buscar el contenedor principal que incluye tanto el React Flow como el overlay de dibujo
      const flowWrapper = document.getElementById(elementId);
      if (!flowWrapper) {
        throw new Error("No se pudo encontrar el contenedor del diagrama");
      }
      
      // Guardar el estado original de visibilidad de elementos que queremos ocultar
      const elementsToHide = [
        document.querySelector(".react-flow__minimap"),
        document.querySelector(".react-flow__controls"),
        document.querySelector(".react-flow-smart-edge__guide"),
        document.querySelector(".react-flow__attribution"),
        document.querySelector(".navigation-panel")
      ].filter(Boolean);
      
      // Guardar visibilidad original
      const originalStates = elementsToHide.map(el => ({
        element: el,
        display: el.style.display
      }));
      
      // Ocultar temporalmente los elementos
      elementsToHide.forEach(el => {
        el.style.display = 'none';
      });
      
      // Opciones para la exportación de la imagen
      const options = {
        quality: format === 'jpeg' ? 0.9 : 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipAutoScale: true,
        fontEmbedCSS: true,
        filter: (node) => {
          return !node.classList?.contains('react-flow__minimap') &&
                 !node.classList?.contains('react-flow__controls') &&
                 !node.classList?.contains('react-flow-smart-edge__guide') &&
                 !node.classList?.contains('react-flow__attribution') &&
                 !node.classList?.contains('navigation-panel');
        }
      };
      
      // Exportar según el formato solicitado
      if (format === 'canvas') {
        // Para canvas, obtenemos el elemento y podemos manipularlo (por ejemplo, mostrarlo en un modal)
        const canvas = await exportAsCanvas(elementId, options);
        
        // Restaurar visibilidad original de los elementos
        originalStates.forEach(state => {
          state.element.style.display = state.display;
        });
        
        showToast(`✔ Canvas generado correctamente`);
        return canvas;
      } else if (format === 'jpeg') {
        await exportAsJpeg(elementId, fileName, options);
      } else {
        await exportAsPng(elementId, fileName, options);
      }
      
      // Restaurar visibilidad original de los elementos
      originalStates.forEach(state => {
        state.element.style.display = state.display;
      });
      
      showToast(`✔ Imagen ${format.toUpperCase()} exportada`);
    } catch (err) {
      showToast("❌ Error al exportar imagen", false);
      console.error("Error exportando imagen:", err);
    }
  }, [showToast]);

  const onExportPNG = useCallback(() => exportImage("png"), [exportImage]);
  const onExportJPG = useCallback(() => exportImage("jpeg"), [exportImage]);
  const onExportCanvas = useCallback(() => exportImage("canvas"), [exportImage]);

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
    onExportJPG,
    onExportCanvas,
    saveToDatabase
  };
}
// --- END OF FILE useGenogramaState.js ---