import React, { useState, useCallback } from 'react';
import { Handle } from 'reactflow';

export default function DrawingCircleNode({ data, selected }) {
  const { radius = 40, color = '#000000', fill = 'transparent' } = data;
  
  const [circleRadius, setCircleRadius] = useState(radius);
  const [isResizing, setIsResizing] = useState(false);
  
  const handleResize = useCallback((e) => {
    if (!isResizing) return;
    
    // Calcular la distancia desde el centro del círculo
    const circleCenter = e.target.getBoundingClientRect();
    const centerX = circleCenter.left + circleCenter.width / 2;
    const centerY = circleCenter.top + circleCenter.height / 2;
    
    // Calcular el nuevo radio basado en la distancia desde el centro
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const newRadius = Math.max(20, Math.sqrt(dx * dx + dy * dy));
    
    setCircleRadius(newRadius);
  }, [isResizing]);
  
  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResizing);
  }, [handleResize]);
  
  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResizing);
  }, [handleResize]);
  
  const size = circleRadius * 2;
  
  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={circleRadius}
          cy={circleRadius}
          r={circleRadius - 2} // -2 para compensar el borde
          stroke={color}
          strokeWidth="2"
          fill={fill}
        />
      </svg>
      
      {/* Controlador de redimensión */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            background: '#3b82f6',
            borderRadius: '50%',
            cursor: 'nwse-resize',
            zIndex: 10
          }}
          onMouseDown={startResizing}
        />
      )}
    </div>
  );
}