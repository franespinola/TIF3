import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function TextNode({ data }) {
  // Valores por defecto si no se proporcionan en data
  const fontSize = data?.fontSize || 16;
  const color = data?.color || '#000000';
  const width = data?.width || 150;
  
  // Estado para editar el texto
  const [text, setText] = useState(data?.text || "Texto");
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
    if (e.key === 'Enter' && !e.shiftKey) {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(data.id, text);
      }
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      padding: '5px', 
      minWidth: width,
      border: '1px dashed transparent',
      borderRadius: '4px',
      // Añadir un borde sutil al pasar el ratón para ayudar a visualizar el área del nodo
      ':hover': {
        borderColor: '#ddd'  
      }
    }}>
      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            minHeight: '50px',
            fontSize: `${fontSize}px`,
            color,
            padding: '4px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            resize: 'both',
          }}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'left',
            padding: '4px',
            cursor: 'text',
            minHeight: '1em',
            fontFamily: 'Arial, sans-serif',
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