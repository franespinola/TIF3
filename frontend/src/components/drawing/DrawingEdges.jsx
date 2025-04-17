import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';

// Componente para líneas de dibujo
export function DrawingLineEdge({ id, data, sourceX, sourceY, targetX, targetY, selected }) {
  const { color = '#000000', strokeWidth = 2 } = data || {};
  
  const [edgePath] = getBezierPath({
    sourceX, 
    sourceY, 
    targetX, 
    targetY,
    curvature: 0 // Una línea recta
  });
  
  return (
    <g>
      <path
        id={id}
        d={edgePath}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeOpacity={1}
        style={{
          strokeDasharray: selected ? '5,5' : 'none',
        }}
      />
    </g>
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
  
  return (
    <g>
      {/* Línea principal */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={lineEndX}
        y2={lineEndY}
        stroke={color}
        strokeWidth={strokeWidth}
        style={{
          strokeDasharray: selected ? '5,5' : 'none',
        }}
      />
      
      {/* Punta de flecha */}
      <polygon
        points={`${tipX},${tipY} ${leftWingX},${leftWingY} ${rightWingX},${rightWingY}`}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
}