import React from "react";
import { getBezierPath } from "reactflow";

/**
 * Componente para bordes de tipo anotación que conectan nodos con elementos de anotación
 */
function AnnotationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  // Configuración por defecto si no se proporciona en data
  const { stroke = "#555", strokeWidth = 1.5, animated = false, dashArray = "5,5" } = data || {};
  
  // Calcular la ruta del borde
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={{
        stroke,
        strokeWidth,
        strokeDasharray: dashArray,
        ...style,
      }}
      className={`react-flow__edge-path ${animated ? "animated" : ""}`}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}

export default AnnotationEdge;