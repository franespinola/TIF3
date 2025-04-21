import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../hooks/useResizable';

export default function RectangleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 2;
  
  // Estado para editar la etiqueta
  const [label, setLabel] = useState(data?.label || "");
  const [editing, setEditing] = useState(false);

  // Usar el hook de redimensionamiento - corregida la desestructuración para incluir setSize
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width, height },
    30, // min width
    30  // min height
  );

  // Actualizar el tamaño cuando cambian los datos
  useEffect(() => {
    if (data?.width !== undefined && data?.height !== undefined) {
      // Solo actualizar si no estamos en medio de una operación de redimensionamiento
      if (!isResizing) {
        const newWidth = data.width;
        const newHeight = data.height;
        // Use setSize desde useResizable para actualizar el estado local
        if (newWidth !== size.width || newHeight !== size.height) {
          // Asegurarse de que esto no crea un bucle infinito
          // comparando los valores actuales con los nuevos
          setSize(prev => ({ 
            width: newWidth !== prev.width ? newWidth : prev.width,
            height: newHeight !== prev.height ? newHeight : prev.height
          }));
        }
      }
    }
  }, [data?.width, data?.height, isResizing, setSize, size.width, size.height]);

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

  return (
    <div style={{ position: 'relative' }}>
      <svg width={size.width} height={size.height}>
        <rect
          x="0"
          y="0"
          width={size.width}
          height={size.height}
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

      {/* Handles con IDs específicos y mayor tamaño */}
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