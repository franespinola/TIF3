import React from 'react';

/**
 * Componente reutilizable para el control de redimensionamiento en nodos
 */
function ResizeHandle({ resizeHandleRef, position = 'bottom-right' }) {
  // Configuración de posicionamiento basada en la posición solicitada
  let positionStyle = {};
  
  switch (position) {
    case 'bottom-right':
      positionStyle = { bottom: -5, right: -5 };
      break;
    case 'bottom-left':
      positionStyle = { bottom: -5, left: -5 };
      break;
    case 'top-right':
      positionStyle = { top: -5, right: -5 };
      break;
    case 'top-left':
      positionStyle = { top: -5, left: -5 };
      break;
    default:
      positionStyle = { bottom: -5, right: -5 };
  }
  
  // Determinar el cursor según la posición
  let cursorStyle = 'nwse-resize';
  if (position === 'bottom-left' || position === 'top-right') {
    cursorStyle = 'nesw-resize';
  }
  
  return (
    <div
      ref={resizeHandleRef}
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        background: '#3b82f6',
        borderRadius: '50%',
        cursor: cursorStyle,
        zIndex: 10,
        ...positionStyle
      }}
    />
  );
}

export default ResizeHandle;