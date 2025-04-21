import React from 'react';
import { getBezierPath } from 'reactflow';
import BaseEdgeComponent from '../edges/BaseEdgeComponent';

// Componente para líneas de dibujo
export function DrawingLineEdge({ id, data, sourceX, sourceY, targetX, targetY, selected }) {
  const { color = '#000000', strokeWidth = 2 } = data || {};
  
  const edgeStyle = {
    stroke: color,
    strokeWidth,
    strokeOpacity: 1,
    strokeDasharray: selected ? '5,5' : 'none',
  };
  
  return (
    <BaseEdgeComponent
      id={id}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      style={edgeStyle}
      renderPath={(params) => getBezierPath({
        ...params,
        curvature: 0 // Una línea recta
      })}
    />
  );
}

// Componente para flechas de dibujo
export function DrawingArrowEdge({ id, data, sourceX, sourceY, targetX, targetY, selected }) {
  const { color = '#000000', strokeWidth = 2 } = data || {};
  
  // Calcular la dirección de la flecha
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);
  
  // Calcular los puntos para la punta de flecha
  const arrowLength = 10;
  const arrowWidth = 6;
  
  const tipX = targetX;
  const tipY = targetY;
  
  // Calcular los puntos para las alas de la flecha
  const leftWingX = tipX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle);
  const leftWingY = tipY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle);
  
  const rightWingX = tipX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle);
  const rightWingY = tipY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle);
  
  // Reducir un poco la longitud de la línea para que no sobrepase la punta
  const lineEndX = targetX - 8 * Math.cos(angle);
  const lineEndY = targetY - 8 * Math.sin(angle);
  
  const edgeStyle = {
    stroke: color,
    strokeWidth,
    strokeDasharray: selected ? '5,5' : 'none',
  };
  
  return (
    <g>
      <line
        x1={sourceX}
        y1={sourceY}
        x2={lineEndX}
        y2={lineEndY}
        style={edgeStyle}
      />
      <polygon
        points={`${tipX},${tipY} ${leftWingX},${leftWingY} ${rightWingX},${rightWingY}`}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
}