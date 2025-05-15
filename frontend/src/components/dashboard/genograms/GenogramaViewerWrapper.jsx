import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import nodeTypes from "../../../types/nodeTypes";
import edgeTypes from "../../../types/edgeTypes";
import useGenogramaState from "../../../hooks/useGenogramaState";
import { normalizeGenogram } from "../../../utils/normalizeGenogram";
import layoutWithDagre from "../../../utils/layoutWithDagre";

/**
 * GenogramaViewerWrapper - Componente para visualización (solo lectura) de genogramas
 */
function GenogramaViewerWrapper({ people, relationships, readOnly = true }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onExportPNG,
    onExportJPG
  } = useGenogramaState();

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Validar datos de entrada
      if (!Array.isArray(people) || !Array.isArray(relationships)) {
        throw new Error('Los datos de entrada deben ser arrays');
      }

      // Normalizar los datos recibidos
      const { nodes: normalizedNodes, edges: normalizedEdges } = normalizeGenogram({
        people,
        relationships
      });

      if (!normalizedNodes.length) {
        throw new Error('No se pudieron generar nodos a partir de los datos');
      }

      // Aplicar layout automático con dagre
      const laidOutNodes = layoutWithDagre(normalizedNodes, normalizedEdges);

      // Setear los nodos y aristas en el estado global del genograma
      setNodes(laidOutNodes);
      setEdges(normalizedEdges);

    } catch (error) {
      console.error("Error al procesar el genograma:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [people, relationships, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Error al cargar el genograma</p>
          <p>{error}</p>
        </div>
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
