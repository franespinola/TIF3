/**
 * Utilidades de estilo para componentes de nodos y bordes
 * Centraliza los estilos comunes para mejorar la consistencia visual
 */

// Estilos para los handles de conexión
export const getHandleStyle = (position = null) => {
  const baseStyle = {
    background: "#555",
    width: 8,
    height: 8,
    border: "2px solid #fff",
    borderRadius: "50%",
    zIndex: 5
  };
  
  if (position === 'top') {
    return { ...baseStyle, top: -6 };
  } else if (position === 'bottom') {
    return { ...baseStyle, bottom: -6 };
  } else if (position === 'left') {
    return { ...baseStyle, left: -6, top: '50%', transform: 'translateY(-50%)' };
  } else if (position === 'right') {
    return { ...baseStyle, right: -6, top: '50%', transform: 'translateY(-50%)' };
  }
  
  return baseStyle;
};

// Estilos para los controles de redimensionamiento
export const getResizeHandleStyle = (position = 'bottom-right') => {
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
  
  return {
    position: 'absolute',
    width: 10,
    height: 10,
    background: '#3b82f6',
    borderRadius: '50%',
    cursor: cursorStyle,
    zIndex: 10,
    ...positionStyle
  };
};

// Estilos para campos de texto
export const getTextInputStyle = () => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  textAlign: 'center',
  background: 'rgba(255,255,255,0.8)',
  border: '1px solid #ccc',
});

// Estilos para el texto dentro de nodos
export const getTextLabelStyle = () => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  textAlign: 'center',
  pointerEvents: 'all',
  userSelect: 'none',
});

// Estilos para áreas de texto
export const getTextAreaStyle = (fontSize = 16, color = '#000000') => ({
  width: '100%',
  height: '100%',
  fontSize,
  color,
  padding: 4,
  border: '1px solid #ccc',
  borderRadius: 3,
  resize: 'none',
  boxSizing: 'border-box',
});

// Estilo para el contenedor de texto
export const getTextViewStyle = (fontSize = 16, color = '#000000') => ({
  width: '100%',
  height: '100%',
  fontSize,
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
});