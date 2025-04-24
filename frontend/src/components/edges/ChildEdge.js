import React from 'react';
import { getSmoothStepPath } from 'reactflow';

/**
 * Componente para representar una conexión padre-hijo desde el nodo familia
 * o directamente desde un padre (en el caso de familias monoparentales)
 */
const ChildEdge = ({ 
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  // Configurar estilo base
  let edgeStyle = {
    strokeWidth: 2,
    stroke: '#555',
    ...style,
  };
  
  // Para relaciones padre-hijo, usar una línea directa vertical o smoothstep
  // El estilo smoothstep da una curva suave que es ideal para estas conexiones
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10, // Radio de curvatura para las esquinas
  });

  return (
    <path
      id={id}
      style={edgeStyle}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

export default ChildEdge;