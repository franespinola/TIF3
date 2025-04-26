// --- START OF FILE useGenogramaState.js ---

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import layoutWithDagre from '../utils/layoutWithDagre';
// Importar normalizeGenogram que omite hermanos/mellizos para el layout inicial
import { normalizeGenogram } from '../utils/normalizeGenogram';

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

        // --- PASO 1: Normalización y Layout Estructural ---
        const { nodes: structuralNodes, edges: structuralEdges } = normalizeGenogram(rawData);
        const laidOutNodes = layoutWithDagre(structuralNodes, structuralEdges);

        // --- PASO 2: Crear Aristas Visuales SOLO para Emotional Bonds significativos ---
        const visualRelationshipEdges = [];
        const originalRelationships = rawData.relationships;
        const laidOutNodeIds = new Set(laidOutNodes.map(n => n.id));

        originalRelationships.forEach(rel => {
          if (!rel || !rel.id || !rel.source || !rel.target) return;

          // Definir QUÉ emotionalBonds queremos VISUALIZAR con una línea especial
          const bondsToVisualize = ['conflicto', 'cercana', 'distante', 'rota', 'violencia']; // Ajusta según tus necesidades
          const hasSignificantEmotionalBond = rel.emotionalBond && bondsToVisualize.includes(rel.emotionalBond);

          // *** CONDICION MODIFICADA ***
          // Añadir arista VISUAL solo si tiene un emotionalBond que queremos mostrar
          if (hasSignificantEmotionalBond) {
            if (laidOutNodeIds.has(rel.source) && laidOutNodeIds.has(rel.target)) {
              visualRelationshipEdges.push({
                id: rel.id, // Usar el ID original
                source: rel.source,
                target: rel.target,
                type: 'relationshipEdge', // Usar el componente visual
                data: {
                  relType: rel.emotionalBond, // Usar el emotionalBond como relType para el estilo
                  notes: rel.notes || '',
                  // otros datos...
                },
                 // zIndex: 1, // Opcional: si necesitas que esté por encima
              });
            } else {
              console.warn(`Relación visual (EmotionalBond) ${rel.id} omitida: nodos no existen post-layout.`);
            }
          }
          // Ya NO añadimos aristas por defecto para 'hermanos' o 'mellizos' aquí
        });

        // --- PASO 3: Actualizar Estado ---
        setNodes(laidOutNodes);
        // Combinar aristas estructurales con las (ahora más selectivas) visuales
        setEdges([...structuralEdges, ...visualRelationshipEdges]);

        // Ajustar idCounter (sin cambios)
        let maxId = 0;
        laidOutNodes.forEach((n) => {
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

        showToast("✔ Genograma importado y organizado");

      } catch (err) {
        showToast("❌ Error al procesar JSON: " + err.message, false);
        console.error("Error en onImportJSON:", err);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, showToast]); // Dependencias

  const onExportJSON = useCallback(() => {
    // Transformar de formato React Flow (nodes, edges) a formato de genograma (people, relationships)
    const people = nodes.map(node => {
      // Filtrar los nodos de tipo "familyNode" que son nodos auxiliares
      if (node.type === "familyNode") return null;
      
      // Extraer información básica del nodo
      const { id, type, data } = node;
      
      // Determinar género basado en el tipo de nodo
      let gender = null;
      if (type.includes('F') || type.includes('f')) {
        gender = 'F';
      } else if (type.includes('M') || type.includes('m')) {
        gender = 'M';
      }
      
      // Determinar si es fallecido
      const isDeceased = type.includes('fallecido') || type.includes('Fallecido');
      
      // Determinar si es paciente
      const isPatient = type === 'paciente';
      
      // Construir objeto de persona
      return {
        id,
        name: data.label || "",
        gender,
        generation: data.generation || 0,
        birthDate: data.birthDate || null,
        age: data.age || null,
        deathDate: data.deathDate || null,
        role: type,
        notes: data.notes || "",
        displayGroup: null,
        attributes: {
          isPatient,
          isDeceased,
          isPregnancy: type.includes('embarazo') || type.includes('pregnancy'),
          isAbortion: type.includes('aborto') || type.includes('abortion'),
          isAdopted: type.includes('adoptado') || type.includes('adopted'),
          abortionType: null,
          gestationalAge: null,
          ...(data.attributes || {})
        }
      };
    }).filter(Boolean); // Eliminar valores null
    
    // Transformar edges a relationships
    const relationships = edges.map(edge => {
      const { id, source, target, data = {} } = edge;
      
      // Determinar tipo de relación basado en el tipo de edge o en data.relType
      let type = "parentChild"; // Tipo por defecto
      let emotionalBond = null;
      let legalStatus = null;
      
      // Mapeo de relTypes a tipos de relaciones
      if (data.relType) {
        if (['matrimonio', 'cohabitacion', 'divorcio', 'separacion', 'compromiso'].includes(data.relType)) {
          type = "conyugal";
          legalStatus = data.relType;
        } else if (['conflicto', 'cercana', 'distante', 'rota', 'violencia'].includes(data.relType)) {
          emotionalBond = data.relType;
        } else if (data.relType === 'hermanos') {
          type = "hermanos";
        } else if (data.relType === 'mellizos') {
          type = "mellizos";
        }
      }
      
      // Si el ID contiene "parentChild" o edge.type es "childEdge", es una relación padre-hijo
      if (id.includes('parentChild') || edge.type === 'childEdge') {
        type = "parentChild";
      }
      
      return {
        id: id || `rel-${source}-${target}-${type}`,
        source,
        target,
        type,
        legalStatus,
        emotionalBond,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        notes: data.notes || ""
      };
    });
    
    // Crear objeto final para exportar
    const dataToExport = { 
      people, 
      relationships 
    };
    
    // Exportar como archivo JSON
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString; 
    link.download = "genograma.json"; 
    link.click();
    
    showToast("✅ Genograma exportado con formato correcto (people/relationships)");
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
    // Buscar el contenedor del flujo principal (excluye los controles, minimapa, etc.)
    const flowPane = document.querySelector(".react-flow__renderer");
    if (!flowPane) {
      showToast("❌ No se pudo encontrar el área del diagrama", false);
      return;
    }
    
    try {
      // Guardar el estado original de visibilidad de elementos que queremos ocultar
      const minimapElement = document.querySelector(".react-flow__minimap");
      const controlsElement = document.querySelector(".react-flow__controls");
      const smartGuidesElement = document.querySelector(".react-flow-smart-edge__guide");
      const attributionElement = document.querySelector(".react-flow__attribution");
      const backgroundElement = document.querySelector(".react-flow__background");
      
      // Guardar visibilidad original
      const originalStates = [];
      [minimapElement, controlsElement, smartGuidesElement, attributionElement].forEach(el => {
        if (el) {
          originalStates.push({
            element: el,
            display: el.style.display
          });
          el.style.display = 'none'; // Ocultar temporalmente
        }
      });
      
      // Capturar el diagrama completo, incluso las partes fuera de la vista
      const reactFlowInstance = document.querySelector(".react-flow");
      const nodesBounds = flowPane.getBoundingClientRect();
      
      // Asegurar que capture todo el diagrama completo
      const options = { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        scale: 2, // Mayor resolución
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        // Asegurar capturar todo el contenido, incluso lo que está fuera de la vista
        width: nodesBounds.width,
        height: nodesBounds.height,
        // Mantener el fondo del canvas pero no los controles y minimapa
        ignoreElements: (element) => {
          return element.classList && (
            element.classList.contains('react-flow__minimap') ||
            element.classList.contains('react-flow__controls') ||
            element.classList.contains('react-flow-smart-edge__guide') ||
            element.classList.contains('react-flow__attribution')
          );
        }
      };
      
      const html2canvas = await import('html2canvas').then(module => module.default);
      const canvas = await html2canvas(flowPane, options);
      
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
      
      showToast(`✔ Imagen ${format.toUpperCase()} exportada (solo diagrama)`);
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