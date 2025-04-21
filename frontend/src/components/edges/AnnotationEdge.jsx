import React from "react";
import { getBezierPath } from "reactflow";
import BaseEdgeComponent from "./BaseEdgeComponent";

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
  
  // Preparar los estilos
  const edgeStyle = {
    stroke,
    strokeWidth,
    strokeDasharray: dashArray,
    ...style,
  };

  return (
    <BaseEdgeComponent
      id={id}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      style={edgeStyle}
      markerEnd={markerEnd}
      className={animated ? "animated" : ""}
      renderPath={getBezierPath}
    />
  );
}

export default AnnotationEdge;