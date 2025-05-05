import React from 'react';

/**
 * Componente reutilizable para entrada de texto multilínea en nodos
 * Mejorado con soporte para todas las propiedades de formato de texto
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
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  textAlign = 'left',
  bold = false,
  italic = false,
  underline = false,
}) {
  // Procesar las propiedades de estilo
  const processedFontWeight = bold ? 'bold' : fontWeight;
  const processedFontStyle = italic ? 'italic' : fontStyle;
  const processedTextDecoration = underline ? 'underline' : textDecoration;

  // Parsear textAlign cuando viene en formato compuesto (vertical-horizontal)
  const parseTextAlign = () => {
    if (textAlign && textAlign.includes('-')) {
      const [, horizontalAlign] = textAlign.split('-');
      return horizontalAlign || 'left';
    }
    return textAlign;
  };

  // Convertir fontSize si viene como '12pt' a píxeles
  const getFontSize = () => {
    if (typeof fontSize === 'string' && fontSize.endsWith('pt')) {
      return parseInt(fontSize, 10) + 'px';
    }
    return typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
  };

  // Estilos comunes para ambos modos (edición y visualización)
  const commonStyles = {
    width: '100%',
    height: '100%',
    fontSize: getFontSize(),
    fontFamily,
    color,
    fontWeight: processedFontWeight,
    fontStyle: processedFontStyle,
    textDecoration: processedTextDecoration,
    textAlign: parseTextAlign(),
    boxSizing: 'border-box',
    padding: 4,
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        style={{
          ...commonStyles,
          border: '1px solid #ccc',
          borderRadius: 3,
          resize: 'none',
          outline: 'none',
        }}
      />
    );
  } else {
    return (
      <div
        onDoubleClick={onDoubleClick}
        style={{
          ...commonStyles,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          cursor: 'text',
          overflow: 'auto',
          userSelect: 'none',
          backgroundColor: 'transparent',
        }}
      >
        {value}
      </div>
    );
  }
}

export default NodeTextArea;