import React, { useState, useCallback } from 'react';
import { Handle } from 'reactflow';

export default function DrawingRectangleNode({ data, selected }) {
  const { width = 100, height = 80, color = '#000000', fill = 'transparent' } = data;
  
  const [size, setSize] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  
  const handleResize = useCallback((e) => {
    if (!isResizing) return;
    
    const newWidth = Math.max(30, e.clientX - e.target.getBoundingClientRect().left);
    const newHeight = Math.max(30, e.clientY - e.target.getBoundingClientRect().top);
    
    setSize({ width: newWidth, height: newHeight });
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
  
  return (
    <div
      style={{
        position: 'relative',
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
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
            bottom: -5,
            right: -5,
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