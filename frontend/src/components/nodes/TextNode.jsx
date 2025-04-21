import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../hooks/useResizable';

export default function TextNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const fontSize = data?.fontSize || 16;
  const color = data?.color || '#000000';
  const defaultWidth = data?.width || 150;
  const defaultHeight = data?.height || 80;
  
  // Estado para editar el texto
  const [text, setText] = useState(data?.text || 'Texto');
  const [editing, setEditing] = useState(false);

  // Usar el hook de redimensionamiento - corregida la desestructuración
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width: defaultWidth, height: defaultHeight },
    100, // min width
    50   // min height
  );

  // Actualizar el tamaño cuando cambian los datos (y no estamos redimensionando)
  useEffect(() => {
    if (
      data?.width !== undefined &&
      data?.height !== undefined &&
      !isResizing
    ) {
      if (data.width !== size.width || data.height !== size.height) {
        setSize({
          width: data.width,
          height: data.height,
        });
      }
    }
  }, [data?.width, data?.height, isResizing, setSize, size.width, size.height]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (data?.onEdit) {
      data.onEdit(id, text);
    }
  };

  const handleKeyDown = (e) => {
    // Al presionar Enter sin Shift, guardamos
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(id, text);
      }
    }
  };

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
    <div
      style={{
        position: 'relative',
        padding: 5,
        width: size.width,
        height: size.height,
        border: selected
          ? '1px dashed #3b82f6'
          : '1px dashed transparent',
        borderRadius: 4,
        boxSizing: 'border-box',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '100%',
            fontSize: fontSize,
            color,
            padding: 4,
            border: '1px solid #ccc',
            borderRadius: 3,
            resize: 'none',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            fontSize: fontSize,
            color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'left',
            padding: 4,
            cursor: 'text',
            overflow: 'auto',
            fontFamily: 'Arial, sans-serif',
            userSelect: 'none',
            boxSizing: 'border-box',
          }}
        >
          {text}
        </div>
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
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
