import React, { useState } from 'react';

export default function DrawingNoteNode({ data, selected }) {
  const { 
    text = 'Nota', 
    width = 150, 
    height = 100, 
    fill = '#FFFF88', 
    border = '#E6C000' 
  } = data;
  
  const [content, setContent] = useState(text);
  
  const handleDoubleClick = () => {
    const newText = window.prompt('Editar nota:', content);
    if (newText !== null) {
      setContent(newText);
    }
  };
  
  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: fill,
        border: `1px solid ${border}`,
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        padding: '8px',
        overflow: 'auto',
        cursor: 'move',
        position: 'relative'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '14px',
        background: border,
        opacity: 0.4
      }} />
      
      <div style={{ 
        fontSize: '12px',
        marginTop: '8px',
        userSelect: 'none',
        wordBreak: 'break-word'
      }}>
        {content}
      </div>
      
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
        />
      )}
    </div>
  );
}