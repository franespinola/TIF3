import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function RectangleNode({ data }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 2;
  
  // Estado para editar la etiqueta
  const [label, setLabel] = useState(data?.label || "");
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (data?.onEdit) {
      data.onEdit(data.id, label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(data.id, label);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
      </svg>
      
      {editing ? (
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid #ccc',
          }}
        />
      ) : label ? (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            textAlign: 'center',
            pointerEvents: 'all',
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />
      )}

      {/* Handles visibles para permitir conexiones en todos los lados */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555', width: 8, height: 8 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555', width: 8, height: 8 }} 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        style={{ background: '#555', width: 8, height: 8 }} 
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        style={{ background: '#555', width: 8, height: 8 }} 
      />
    </div>
  );
}