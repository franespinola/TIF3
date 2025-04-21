import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../hooks/useResizable';

export default function CircleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const initialRadius = data?.radius || 50;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 2;
  
  // Estado para editar la etiqueta
  const [label, setLabel] = useState(data?.label || "");
  const [editing, setEditing] = useState(false);
  const [radius, setRadius] = useState(initialRadius);

  // Usar el hook de redimensionamiento adaptado para círculos - corregida la desestructuración
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id,
    { width: initialRadius * 2, height: initialRadius * 2 },
    40, // min diameter
    40  // min diameter
  );

  // Actualizar el radio cuando cambia el tamaño
  useEffect(() => {
    // Calcular el nuevo radio basado en el menor de width/height
    // para mantener el círculo proporcional
    const newRadius = Math.min(size.width, size.height) / 2;
    if (newRadius !== radius) {
      setRadius(newRadius);
    }
  }, [size, radius]);

  // Actualizar el tamaño cuando cambia el radio en data
  useEffect(() => {
    if (data?.radius !== undefined && !isResizing) {
      const newRadius = data.radius;
      if (newRadius !== radius) {
        setRadius(newRadius);
        const diameter = newRadius * 2;
        // Actualizar el estado de tamaño para mantener sincronizado
        if (size.width !== diameter || size.height !== diameter) {
          // Actualizar dimensiones basadas en el nuevo radio
          const newSize = { width: diameter, height: diameter };
          // Usar el setSize de useResizable
          setSize(newSize);
        }
      }
    }
  }, [data?.radius, isResizing, radius, setSize, size.width, size.height]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (data?.onEdit) {
      data.onEdit(id, label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(id, label);
      }
    }
  };

  // Calcular el tamaño del SVG basado en el radio actual
  const svgSize = radius * 2;

  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;
  
  // Estilo común para los handles para mayor tamaño y área de selección
  const handleStyle = {
    background: "#555",
    width: 8,
    height: 8,
    border: "2px solid #fff",
    borderRadius: "50%",
    zIndex: 5
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={svgSize} height={svgSize}>
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
        id="t"
        style={{ ...handleStyle, top: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ ...handleStyle, bottom: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="l"
        style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="r"
        style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
      
      {/* Control de redimensionamiento que solo aparece cuando el nodo está seleccionado */}
      {selected && (
        <div
          ref={resizeHandleRef}
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
        />
      )}
    </div>
  );
}