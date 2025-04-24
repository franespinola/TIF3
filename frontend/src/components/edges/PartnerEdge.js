import React from 'react';
import { getBezierPath, getSmoothStepPath } from 'reactflow';

/**
 * Componente para representar una conexión de pareja (relación conyugal)
 * que conecta a los padres con el nodo familia.
 */
const PartnerEdge = ({ 
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
  // Configurar estilo base según tipo de relación
  const relType = data?.relType || 'matrimonio';
  
  // Estilos por defecto basados en el tipo de relación
  let edgeStyle = {
    strokeWidth: 2,
    stroke: '#555',
    ...style,
  };
  
  // Estilos específicos según tipo de relación
  switch (relType) {
    case 'divorcio':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '5,5',
        stroke: '#f44336',
      };
      break;
    case 'separacion':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '5,5',
        stroke: '#ff9800',
      };
      break;
    default:
      break;
  }

  // Calcular path directo (línea recta) para relaciones conyugales
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

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

export default PartnerEdge;