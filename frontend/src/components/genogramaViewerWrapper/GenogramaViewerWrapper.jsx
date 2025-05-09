import React, { useState, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import nodeTypes from "../../types/nodeTypes";
import edgeTypes from "../../types/edgeTypes";
import useGenogramaState from "../../hooks/useGenogramaState";
import { normalizeGenogram } from "../../utils/normalizeGenogram";
import layoutWithDagre from "../../utils/layoutWithDagre";

/**
 * GenogramaViewerWrapper - Componente para visualización (solo lectura) de genogramas
 * Versión simplificada del GenogramaEditorWrapper sin capacidades de edición
 */
function GenogramaViewerWrapper({ genogramId, readOnly = true }) {
  // Estados
  const [isLoading, setIsLoading] = useState(true);

  // Usar el hook de genograma pero solo para visualización
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onExportPNG,
    onExportJPG
  } = useGenogramaState();

  // Memorizar tipos de nodos y aristas para rendimiento
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  // Cargar datos del genograma al montar el componente
  useEffect(() => {
    const fetchGenogramData = async () => {
      try {
        setIsLoading(true);
        
        // Simular la carga de datos (en un entorno real, esto sería una petición API)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Buscar el archivo de genograma en la carpeta del paciente
        // Nota: En una implementación real, esto sería una llamada a API
        const mockGenogramData = {
          people: [
            { id: 'p1', name: 'Paciente', gender: 'M', generation: 2, attributes: { isPatient: true } },
            { id: 'p2', name: 'Madre', gender: 'F', generation: 1 },
            { id: 'p3', name: 'Padre', gender: 'M', generation: 1 },
            { id: 'p4', name: 'Hermana', gender: 'F', generation: 2 },
            { id: 'p5', name: 'Abuelo Paterno', gender: 'M', generation: 0 },
            { id: 'p6', name: 'Abuela Paterna', gender: 'F', generation: 0 }
          ],
          relationships: [
            { id: 'r1', source: 'p1', target: 'p2', type: 'parentChild' },
            { id: 'r2', source: 'p1', target: 'p3', type: 'parentChild' },
            { id: 'r3', source: 'p4', target: 'p2', type: 'parentChild' },
            { id: 'r4', source: 'p4', target: 'p3', type: 'parentChild' },
            { id: 'r5', source: 'p3', target: 'p5', type: 'parentChild' },
            { id: 'r6', source: 'p3', target: 'p6', type: 'parentChild' },
            { id: 'r7', source: 'p5', target: 'p6', type: 'conyugal', legalStatus: 'matrimonio' },
            { id: 'r8', source: 'p2', target: 'p3', type: 'conyugal', legalStatus: 'matrimonio' }
          ]
        };

        // Normalizar los datos para ReactFlow
        const { nodes: normalizedNodes, edges: normalizedEdges } = normalizeGenogram(mockGenogramData);

        // Aplicar layout con dagre para posicionar correctamente
        const laidOutNodes = layoutWithDagre(normalizedNodes, normalizedEdges);
        
        // Actualizar el estado con los nodos y aristas
        setNodes(laidOutNodes);
        setEdges(normalizedEdges);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar el genograma:", error);
        setIsLoading(false);
      }
    };

    fetchGenogramData();
  }, [genogramId, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      id="genogramViewer"
      style={{ 
        width: "100%", 
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <ReactFlow
        style={{
          width: "100%", 
          height: "100%", 
          background: "#f8f8f8" 
        }}
        nodes={nodes}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        fitView
        attributionPosition="bottom-right"
        maxZoom={2}
        minZoom={0.2}
        zoomOnDoubleClick={!readOnly}
        panOnDrag={true}
        zoomOnScroll={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={12} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable 
          pannable
        />
      </ReactFlow>
    </div>
  );
}

export default GenogramaViewerWrapper;