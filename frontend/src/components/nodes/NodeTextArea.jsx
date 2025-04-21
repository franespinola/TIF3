import React from 'react';

/**
 * Componente reutilizable para entrada de texto multilínea en nodos
 */
function NodeTextArea({
  value,
  isEditing,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyDown,
  fontSize = 16,
  color = '#000000',
}) {
  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
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
    );
  } else {
    return (
      <div
        onDoubleClick={onDoubleClick}
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
        {value}
      </div>
    );
  }
}

export default NodeTextArea;