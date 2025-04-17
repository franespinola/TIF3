import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function NoteNode({ data }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 150;
  const height = data?.height || 100;
  const color = data?.color || '#000000';
  const fill = data?.fill || '#FFFF88';
  const border = data?.border || '#E6C000';

  // Estado para editar el texto de la nota
  const [text, setText] = useState(data?.text || "Nota");
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (data?.onEdit) {
      data.onEdit(data.id, text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(data.id, text);
      }
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: `${width}px`,
        height: editing ? 'auto' : `${height}px`,
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
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '14px',
        background: border,
        opacity: 0.4,
      }} />

      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: editing ? height - 30 : 'auto',
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
      
      {/* Handles para permitir conexiones con los nodos */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555', width: 8, height: 8, zIndex: 10 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555', width: 8, height: 8, zIndex: 10 }} 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        style={{ background: '#555', width: 8, height: 8, zIndex: 10 }} 
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        style={{ background: '#555', width: 8, height: 8, zIndex: 10 }} 
      />
    </div>
  );
}