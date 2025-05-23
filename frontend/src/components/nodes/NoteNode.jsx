import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../hooks/useResizable';

export default function NoteNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const defaultWidth = data?.width || 150;
  const defaultHeight = data?.height || 100;
  const color = data?.color || '#000000';
  const fill = data?.fill || '#FFFF88';
  const border = data?.border || '#E6C000';

  // Estado para editar el texto de la nota
  const [text, setText] = useState(data?.text || 'Nota');
  const [editing, setEditing] = useState(false);

  // Usar el hook de redimensionamiento - corregida la desestructuración
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id,
    { width: defaultWidth, height: defaultHeight },
    100, // min width
    70   // min height
  );

  // Actualizar el tamaño cuando cambian los datos
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
    if (e.key === 'Enter' && e.ctrlKey) {
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
        width: `${size.width}px`,
        height: editing ? 'auto' : `${size.height}px`,
        background: fill,
        border: `1px solid ${border}`,
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        padding: '20px 8px 8px 8px', // Padding extra arriba para la "banda" de la nota
        overflow: 'hidden',
        cursor: 'move',
      }}
    >
      {/* Cabecera de la nota adhesiva */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '14px',
          background: border,
          opacity: 0.4,
        }}
      />

      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: editing ? size.height - 30 : 'auto',
            minHeight: '70px',
            fontSize: '12px',
            color,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="Escriba su nota aquí"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: '12px',
            color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            height: '100%',
            overflow: 'hidden',
            userSelect: 'none',
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
            zIndex: 20,
          }}
        />
      )}
    </div>
  );
}
