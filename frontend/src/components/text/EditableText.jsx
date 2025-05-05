import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente avanzado para edición de texto con soporte para múltiples estilos
 * Inspirado en las capacidades de formato de Lucidchart
 * Soporta todas las propiedades de la barra de formato (negrita, cursiva, subrayado, etc.)
 */
const EditableText = ({
  text,
  onChange,
  color = '#000000',
  fontSize = 12,
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  textAlign = 'center',
  bold = false,
  italic = false,
  underline = false,
  size,
  pointerEvents = 'none',
  autoFocus = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const inputRef = useRef(null);
  
  // Actualizar el valor cuando cambia el texto desde props
  useEffect(() => {
    setEditValue(text);
  }, [text]);
  
  // Auto-focus al entrar en modo edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Manejar el inicio de la edición
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  // Manejar cambios en el input
  const handleChange = (e) => {
    setEditValue(e.target.value);
  };
  
  // Manejar cuando se completa la edición
  const handleBlur = () => {
    finishEditing();
  };
  
  // Manejar teclas especiales durante la edición
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(text); // Restaurar valor original
      setIsEditing(false);
    }
  };
  
  // Función para finalizar la edición y guardar cambios
  const finishEditing = () => {
    setIsEditing(false);
    if (editValue !== text) {
      onChange(editValue);
    }
  };
  
  // Procesar propiedades booleanas para compatibilidad
  const processedFontWeight = bold === true ? 'bold' : (fontWeight || 'normal');
  const processedFontStyle = italic === true ? 'italic' : (fontStyle || 'normal');
  const processedTextDecoration = underline === true ? 'underline' : (textDecoration || 'none');
  
  // Parsear la alineación compuesta "vertical-horizontal"
  const parseAlignment = () => {
    // Si incluye un guión, es un formato compuesto (vertical-horizontal)
    if (textAlign && textAlign.includes('-')) {
      const [, horizontal] = textAlign.split('-');
      return horizontal || 'center';
    }
    return textAlign || 'center';
  };
  
  // Convertir fontSize a formato correcto
  const processFontSize = () => {
    if (typeof fontSize === 'string') {
      // Si es una cadena con 'pt', convertir a px (aproximadamente: 1pt = 1.333px)
      if (fontSize.endsWith('pt')) {
        return `${Math.round(parseFloat(fontSize) * 1.333)}px`;
      }
      return fontSize; // Ya está en formato correcto (px, em, rem, etc.)
    }
    // Si es un número, asumimos que son píxeles
    return `${fontSize}px`;
  };
  
  // Obtener los estilos del texto
  const getTextStyles = () => {
    const styles = {
      fontSize: processFontSize(),
      fontFamily,
      color: color,
      textAlign: parseAlignment(),
      fontWeight: processedFontWeight,
      fontStyle: processedFontStyle,
      textDecoration: processedTextDecoration,
      width: '100%',
      height: '100%',
      display: 'block',
      wordBreak: 'break-word',
      pointerEvents: 'auto',
      userSelect: 'none',
      padding: '4px'
    };
    
    // Si se proporciona un tamaño máximo, limitar el desbordamiento
    if (size) {
      styles.maxWidth = `${size}px`;
      styles.maxHeight = `${size}px`;
      styles.overflow = 'hidden';
      styles.margin = '0 auto'; // Centrar horizontalmente si hay ancho máximo
    }
    
    return styles;
  };
  
  // Obtener los estilos para el input de edición
  const getInputStyles = () => {
    const styles = {
      ...getTextStyles(),
      border: 'none',
      outline: 'none',
      resize: 'none',
      background: 'transparent',
      boxSizing: 'border-box',
      userSelect: 'text',
      overflow: 'auto'
    };
    
    return styles;
  };
  
  // Renderizado condicional basado en el estado de edición
  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={getInputStyles()}
        autoFocus={autoFocus}
      />
    );
  } else {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        style={getTextStyles()}
        title="Doble clic para editar"
      >
        {text || 'Doble clic para editar'}
      </div>
    );
  }
};

export default EditableText;