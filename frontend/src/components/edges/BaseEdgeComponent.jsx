import React from "react";
import { getBezierPath } from "reactflow";

/**
 * Componente base reutilizable para bordes que maneja la funcionalidad común
 */
function BaseEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
  className = "",
  renderPath = null,
}) {
  // Calcular la ruta del borde por defecto con Bezier si no se proporciona una función personalizada
  const [edgePath] = renderPath 
    ? renderPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      })
    : getBezierPath({
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
      style={style}
      className={`react-flow__edge-path ${className}`}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}

export default BaseEdgeComponent;