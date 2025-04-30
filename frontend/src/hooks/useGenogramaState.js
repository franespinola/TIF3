// --- START OF FILE useGenogramaState.js ---

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
// Importar normalizeGenogram que omite hermanos/mellizos para el layout inicial
import { normalizeGenogram } from '../utils/normalizeGenogram';
// Importar denormalizeGenogram para transformar la representación de ReactFlow a JSON estándar
import { denormalizeGenogram } from './denormalizeGenogram';

/**
 * Hook personalizado para manejar el estado del genograma.
 * MODIFICADO: onImportJSON ahora añade aristas visuales SOLO para relaciones
 * con un emotionalBond explícito que se desea visualizar (ej. conflicto, cercana).
 */
export default function useGenogramaState() {
  const { project } = useReactFlow();
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
       // --- Lógica de onRelate sin cambios ---
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
      if (sourceNode && targetNode && Math.abs(sourceNode.position.y - targetNode.position.y) < 100) { // Añadir chequeo sourceNode/targetNode
        if (sourceNode.position.x < targetNode.position.x) {
          sourceHandle = 'r'; targetHandle = 'l';
        } else {
          sourceHandle = 'l'; targetHandle = 'r';
        }
      } else if (sourceNode && targetNode && sourceNode.position.y < targetNode.position.y) { // Añadir chequeo sourceNode/targetNode
        sourceHandle = 'b'; targetHandle = 't';
      } else {
        sourceHandle = 't'; targetHandle = 'b';
      }
      setEdges((eds) => [
        ...eds.filter(
          (edge) => !(edge.source === source && edge.target === target) // Evitar duplicados simples
        ),
        {
          // Usar un ID más específico para evitar colisiones si se relaciona en ambos sentidos
          id: `rel-${source}-${target}-${relType}`,
          source, target, sourceHandle, targetHandle,
          type: "relationshipEdge",
          data: { relType },
        },
      ]);
      // Quitar el efecto de resaltado aquí, puede ser confuso si se aplica a muchos nodos
      // setNodes((nds) =>
      //   nds.map((node) =>
      //     node.id === source || node.id === target
      //       ? { ...node, style: { ...node.style, boxShadow: "0 0 0 4px rgba(59,130,246,0.5)" } }
      //       : node
      //   )
      // );
      showToast(`✔ Relación '${relType}' creada entre ${source} y ${target}`);
    },
    [nodes, setEdges, setNodes, showToast] // Asegurarse que nodes está en dependencias
  );


  const updateEdgeRelation = useCallback(
    (edgeId, newRelType) => {
       // --- Lógica de updateEdgeRelation sin cambios ---
      if (!edgeId) return;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            // Actualizar solo relType, mantener otros datos si existen
            return { ...edge, data: { ...(edge.data || {}), relType: newRelType } };
          }
          return edge;
        })
      );
      const edgeParts = edgeId.split('-');
      if (edgeParts.length >= 3) { // Ajustar split si el ID es más complejo
        const source = edgeParts[1];
        const target = edgeParts[2];
        showToast(`✔ Relación actualizada a '${newRelType}' entre ${source} y ${target}`);
      } else {
        showToast(`✔ Relación actualizada a '${newRelType}'`);
      }
       // --- Fin de lógica updateEdgeRelation ---
    },
    [setEdges, showToast]
  );

  const onDrop = useCallback(
     // --- Lógica de onDrop sin cambios ---
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
      const position = project({ x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top });
      const newNode = { id: String(idCounter), type: data.type, position, data: { label: data.label } };
      setNodes((nds) => nds.concat(newNode));
      setIdCounter((prev) => prev + 1);
    },
     // --- Fin de lógica onDrop ---
    [idCounter, setNodes, project]
  );

  const onDragOver = useCallback((event) => {
     // --- Lógica de onDragOver sin cambios ---
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
     // --- Fin de lógica onDragOver ---
  }, []);

  // IMPORT / EXPORT
  const onImportJSON = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target.result);

        if (!rawData || !Array.isArray(rawData.people) || !Array.isArray(rawData.relationships)) {
          showToast("JSON inválido: debe contener 'people' y 'relationships'", false);
          return;
        }

        // Verificar si los nodos tienen posiciones explícitas en el JSON
        const nodesWithPositions = rawData.people.filter(p => p.position && typeof p.position.x === 'number' && typeof p.position.y === 'number');
        const hasPreservedPositions = nodesWithPositions.length > 0;

        console.log(`Importando genograma: ${nodesWithPositions.length}/${rawData.people.length} nodos con posiciones explícitas.`);

        // --- PASO 1: Normalización y Layout Estructural para el genograma básico ---
        const { nodes: structuralNodes, edges: structuralEdges } = normalizeGenogram(rawData);

        // Si hay posiciones explícitas en el JSON, preservarlas durante el layout
        const laidOutNodes = layoutWithDagre(structuralNodes, structuralEdges, { 
          respectExistingPositions: true
        });

        // --- PASO 2: Restaurar posiciones explícitas del JSON original
        const updatedNodes = laidOutNodes.map(node => {
          // Buscar si este nodo tiene posición explícita en el JSON original
          const originalPerson = rawData.people.find(p => p.id === node.id);
          
          if (originalPerson && originalPerson.position && 
              typeof originalPerson.position.x === 'number' && 
              typeof originalPerson.position.y === 'number') {
            // Si tiene posición explícita, usarla (override del layout automático)
            return {
              ...node,
              position: {
                x: originalPerson.position.x,
                y: originalPerson.position.y
              }
            };
          }
          
          // En caso contrario, mantener la posición calculada por el layout
          return node;
        });

        // --- PASO 3: Procesar anotaciones y dibujos ---
        // Nodos adicionales para anotaciones (desde people con role=annotation)
        const annotationNodes = rawData.people
          .filter(person => person.role === "annotation" || person.attributes?.isAnnotation)
          .map(person => {
            // Crear un nodo de anotación con los estilos preservados
            return {
              id: person.id,
              type: person.annotationType || 'text', // Tipo por defecto: text
              // Preservar la posición exacta
              position: person.position || { x: 0, y: 0 },
              style: person.style || {}, // Mantener todos los estilos originales
              data: {
                ...(person.data || {}),
                label: person.name || '',
                notes: person.notes || ''
              },
              width: person.width || 150,
              height: person.height || 50,
              selected: person.selected || false,
              draggable: person.draggable !== false,
              selectable: person.selectable !== false
            };
          });

        // Nodos de dibujos libres desde la sección 'drawings'
        const drawingNodes = rawData.drawings ? 
          rawData.drawings.map(drawing => ({
            id: drawing.id,
            type: drawing.type || 'drawing',
            // Preservar la posición exacta
            position: drawing.position || { x: 0, y: 0 },
            style: drawing.style || {},
            data: drawing.data || {},
            width: drawing.width,
            height: drawing.height,
            selected: drawing.selected || false,
            draggable: drawing.draggable !== false,
            selectable: drawing.selectable !== false
          })) : 
          [];
        
        // Nodos de anotaciones desde la sección 'annotations'
        const annotationsFromSection = rawData.annotations ? 
          rawData.annotations.map(ann => ({
            id: ann.id,
            type: ann.type || 'text',
            // Preservar la posición exacta
            position: ann.position || { x: 0, y: 0 },
            style: ann.style || {},
            data: ann.data || {},
            width: ann.width,
            height: ann.height,
            selected: ann.selected || false,
            draggable: ann.draggable !== false,
            selectable: ann.selectable !== false
          })) : 
          [];

        // --- PASO 4: Crear Aristas Visuales para relaciones emocionales ---
        const visualRelationshipEdges = [];
        const originalRelationships = rawData.relationships;
        const laidOutNodeIds = new Set(updatedNodes.map(n => n.id));

        originalRelationships.forEach(rel => {
          if (!rel || !rel.id || !rel.source || !rel.target) return;

          // Si es una anotación o dibujo libre, procesarla como tal
          if (rel.type === "annotation" || rel.annotationType) {
            visualRelationshipEdges.push({
              id: rel.id || `annotation-edge-${rel.source}-${rel.target}`,
              source: rel.source,
              target: rel.target,
              type: rel.annotationType || 'drawingEdge',
              data: rel.data || { isAnnotation: true },
              style: rel.style || {
                stroke: rel.stroke || '#000000',
                strokeWidth: rel.strokeWidth || 2,
                strokeDasharray: rel.strokeDasharray
              }
            });
            return;
          }

          // Procesar relaciones emocionales significativas
          const bondsToVisualize = ['conflicto', 'cercana', 'distante', 'rota', 'violencia']; 
          const hasSignificantEmotionalBond = rel.emotionalBond && bondsToVisualize.includes(rel.emotionalBond);

          if (hasSignificantEmotionalBond) {
            if (laidOutNodeIds.has(rel.source) && laidOutNodeIds.has(rel.target)) {
              visualRelationshipEdges.push({
                id: rel.id, 
                source: rel.source,
                target: rel.target,
                type: 'relationshipEdge',
                data: {
                  relType: rel.emotionalBond,
                  notes: rel.notes || '',
                  startDate: rel.startDate,
                  endDate: rel.endDate
                }
              });
            }
          }
        });

        // --- PASO 5: Combinar todos los nodos y aristas y actualizar estado ---
        const allNodes = [
          ...updatedNodes,
          ...annotationNodes,
          ...drawingNodes,
          ...annotationsFromSection
        ];

        setNodes(allNodes);
        setEdges([...structuralEdges, ...visualRelationshipEdges]);

        // Ajustar idCounter para evitar colisiones
        let maxId = 0;
        allNodes.forEach((n) => {
          if (n && n.id) {
            const numericId = parseInt(n.id.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(numericId) && numericId > maxId) maxId = numericId;
          }
        });
        [...structuralEdges, ...visualRelationshipEdges].forEach(e => {
          if (e && e.id) {
            const numericId = parseInt(e.id.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(numericId) && numericId > maxId) maxId = numericId;
          }
        });
        setIdCounter(maxId + 1);

        showToast("✔ Genograma importado con anotaciones y estilos preservados");

      } catch (err) {
        showToast("❌ Error al procesar JSON: " + err.message, false);
        console.error("Error en onImportJSON:", err);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, showToast, setIdCounter]);

  const onExportJSON = useCallback(() => {
    // Utilizar denormalizeGenogram para transformar los nodos y aristas a formato estándar de genograma
    const genogramData = denormalizeGenogram(nodes, edges);
    
    // Exportar como archivo JSON
    const blob = new Blob([JSON.stringify(genogramData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; 
    link.download = "genograma.json"; 
    link.click();
    URL.revokeObjectURL(url);
    
    showToast("✅ Genograma exportado con formato correcto (people/relationships y anotaciones)");
  }, [nodes, edges, showToast]);

  const onExportCSV = useCallback(() => {
     // --- Lógica de onExportCSV sin cambios ---
    let csv = "type,id,label,x,y,source,target,relType\n";
    nodes.forEach((node) => { csv += `"node","${node.id}","${node.data.label}",${node.position.x},${node.position.y},,,\n`; });
    edges.forEach((edge) => { csv += `"edge","${edge.id}",,,,${edge.source},${edge.target},${edge.data?.relType || ""}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "genograma.csv"; link.click();
    showToast("✔ CSV exportado correctamente");
     // --- Fin de lógica onExportCSV ---
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
        // Asegurar capturar todo el contenido, incluso lo que está fuera de la vista
        width: flowWrapper.offsetWidth,
        height: flowWrapper.offsetHeight,
        // Mantener el fondo del canvas pero no los controles y minimapa
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
      
      showToast(`✔ Imagen ${format.toUpperCase()} exportada (diagrama completo con anotaciones)`);
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