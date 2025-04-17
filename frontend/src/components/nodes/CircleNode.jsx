import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function CircleNode({ data }) {
  // Valores por defecto si no se proporcionan en data
  const radius = data?.radius || 50;
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

  // Calcular el tamaño del SVG basado en el radio
  const size = radius * 2;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={size} height={size}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth/2}
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
            borderRadius: '50%',
          }}
        />
      )}

      {/* Handles visibles para permitir conexiones */}
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