import React from 'react';

/**
 * Componente reutilizable para entrada de texto en nodos
 */
function NodeTextInput({
  value,
  isEditing,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyDown,
  labelStyle = {},
  inputStyle = {}
}) {
  // Estilos base para la entrada y el label
  const baseInputStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid #ccc',
    ...inputStyle
  };
  
  const baseLabelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    textAlign: 'center',
    pointerEvents: 'all',
    userSelect: 'none',
    ...labelStyle
  };
  
  const baseClickAreaStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  };
  
  // Renderizado condicional basado en el estado de edición y el valor
  if (isEditing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        style={baseInputStyle}
      />
    );
  } else if (value) {
    return (
      <div onDoubleClick={onDoubleClick} style={baseLabelStyle}>
        {value}
      </div>
    );
  } else {
    return (
      <div onDoubleClick={onDoubleClick} style={baseClickAreaStyle} />
    );
  }
}

export default NodeTextInput;