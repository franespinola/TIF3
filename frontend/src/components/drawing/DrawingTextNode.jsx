import React, { useState } from 'react';

export default function DrawingTextNode({ data, selected }) {
  const { text = 'Texto', fontSize = 16, color = '#000000' } = data;
  const [content, setContent] = useState(text);
  
  const handleDoubleClick = () => {
    const newText = window.prompt('Editar texto:', content);
    if (newText !== null) {
      setContent(newText);
    }
  };
  
  return (
    <div 
      style={{ 
        padding: '8px',
        border: selected ? '1px dashed #3b82f6' : '1px solid transparent',
        borderRadius: '4px',
        cursor: 'move'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        style={{ 
          fontSize: `${fontSize}px`, 
          color, 
          userSelect: 'none',
          minWidth: '30px',
          minHeight: '20px'
        }}
      >
        {content}
      </div>
    </div>
  );
}