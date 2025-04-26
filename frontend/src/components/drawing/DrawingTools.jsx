import React from 'react';

export default function DrawingTools({ activeTool, toggleTool, drawingColor, setDrawingColor, strokeWidth, setStrokeWidth }) {
  // Colores para el tema principal
  const colors = {
    primary: '#4f46e5',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    danger: '#ef4444',
    light: '#f8fafc',
    dark: '#1e293b',
    activeGradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    inactiveGradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
  };

  // Estilos de contenedor principal
  const containerStyle = {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.03)',
    padding: '16px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
  };

  // Estilo para el encabezado con gradiente
  const headerStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    paddingBottom: '8px',
    borderBottom: `2px solid ${colors.primary}`,
  };

  // Contenedor para herramientas (con apariencia de paleta de pintura)
  const toolContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '18px',
    padding: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '10px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
  };

  // Estilo para los botones de herramienta
  const toolButtonStyle = (isActive) => ({
    backgroundColor: isActive ? colors.primary : colors.light,
    color: isActive ? '#fff' : colors.dark,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
    boxShadow: isActive 
      ? `0 0 0 2px ${colors.primary}, 0 4px 6px rgba(79, 70, 229, 0.3)` 
      : '0 2px 4px rgba(0, 0, 0, 0.06)',
    transform: isActive ? 'translateY(-2px)' : 'none',
    overflow: 'hidden',
  });

  // Estilo para seleccionar color
  const colorPickerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '10px',
    backgroundColor: colors.light,
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
  };

  // Estilo personalizado para el selector de color
  const colorPickerStyle = {
    WebkitAppearance: 'none',
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'transparent',
    boxShadow: '0 0 0 2px #fff, 0 0 0 3px #cbd5e1',
    overflow: 'hidden',
  };

  // Estilo para la etiqueta del color
  const colorLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: colors.dark,
    marginRight: '12px',
  };

  // Estilo para muestras de color predefinidas
  const colorSwatchesStyle = {
    display: 'flex',
    marginLeft: 'auto',
    gap: '6px',
  };

  // Colores predefinidos para elegir rápidamente
  const predefinedColors = ['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  // Estilo para el control deslizante de grosor
  const strokeWidthContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    backgroundColor: colors.light,
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
  };

  // Estilos para slider personalizado
  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
    marginTop: '8px',
  };

  // Estilo para la vista previa del grosor del trazo
  const strokePreviewStyle = {
    width: '60px',
    height: '30px',
    borderRadius: '4px',
    backgroundColor: '#f8fafc',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  // Vista previa de línea con el grosor actual
  const strokeLineStyle = {
    width: '70%',
    height: `${Math.min(strokeWidth, 20)}px`,
    backgroundColor: drawingColor,
    borderRadius: '4px',
  };

  // Estilo mejorado para indicador de valor
  const valueIndicatorStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: colors.primary,
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    marginLeft: 'auto',
  };

  // SVG personalizado para ícono de lápiz
  const PencilIcon = ({ isActive }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M15.5 5L18 7.5M12 21H21M3 21H7M12.2535 14.8879L6 21H3V18L9.29101 11.709C9.48044 11.5195 9.73481 11.4138 10 11.4138C10.2652 11.4138 10.5196 11.5195 10.709 11.709L12.2535 13.2535C12.4429 13.443 12.5487 13.6974 12.5487 13.9626C12.5487 14.2278 12.4429 14.4822 12.2535 14.6716V14.8879ZM16.2535 10.8879L18 9.21599L14.784 6L13.112 7.74701L14.6575 9.29251C14.8469 9.48194 15.1013 9.58768 15.3665 9.58768C15.6317 9.58768 15.886 9.48194 16.0755 9.29251L16.2535 10.8879Z"
        stroke={isActive ? "#fff" : "#1e293b"} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // SVG personalizado para ícono de selector
  const SelectIcon = ({ isActive }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M20.1825 11.6C20.7351 11.2962 21.0114 11.1443 21.0727 10.9338C21.1268 10.7482 21.0667 10.5441 20.9146 10.4188C20.7399 10.275 20.38 10.275 19.6601 10.275H15.0524C14.4269 10.275 14.1141 10.275 13.8916 10.3808C13.6956 10.4744 13.5393 10.6307 13.4458 10.8267C13.34 11.0492 13.34 11.362 13.34 11.9875V16.5955C13.34 17.3154 13.34 17.6754 13.4838 17.85C13.609 18.0022 13.813 18.0622 13.9986 18.0081C14.2091 17.9468 14.361 17.6705 14.6648 17.1179L15.5071 15.8333C16.4662 16.7175 17.7284 17.2499 19.1202 17.2499C22.0338 17.2499 24.3999 14.8838 24.3999 11.9702C24.3999 9.77866 23.0139 7.91659 21.0523 7.25081M11.29 6.74997C8.37642 6.74997 6.01025 9.11613 6.01025 12.0297C6.01025 14.2213 7.39627 16.0833 9.35785 16.7491M10.0399 12.3124C10.0399 12.9379 10.0399 13.2507 9.93411 13.4732C9.84059 13.6692 9.6843 13.8255 9.48829 13.919C9.26578 14.0248 8.95297 14.0248 8.32736 14.0248H3.71961C2.99973 14.0248 2.63979 14.0248 2.46514 13.8685C2.34 13.7433 2.27989 13.5393 2.33398 13.3537C2.39526 13.1431 2.67158 12.9912 3.2242 12.6875L4.08497 11.9666C3.15287 11.0743 2.6351 9.82782 2.6351 8.45465C2.6351 5.54106 5.00126 3.1749 7.91485 3.1749C10.1064 3.1749 11.9685 4.56091 12.6343 6.52248"
        stroke={isActive ? "#fff" : "#1e293b"} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // SVG personalizado para ícono de borrador
  const EraserIcon = ({ isActive }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M13.5001 20.5L9.5 20.5M20.5 9.5L14.5 3.5C13.8953 2.89543 12.9047 2.89543 12.3 3.5L3.5 12.3C2.89543 12.9047 2.89543 13.8953 3.5 14.5L9.5 20.5L20.5 9.5ZM20.5 9.5L14.5 15.5"
        stroke={isActive ? "#fff" : "#1e293b"} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // Función para crear un botón de color predefinido
  const ColorSwatch = ({ color }) => (
    <button
      onClick={() => setDrawingColor(color)}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: color,
        border: color === drawingColor ? `2px solid ${colors.primary}` : '2px solid white',
        boxShadow: color === drawingColor 
          ? `0 0 0 2px ${colors.primary}` 
          : '0 1px 2px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: color === drawingColor ? 'scale(1.2)' : 'scale(1)',
      }}
      aria-label={`Seleccionar color ${color}`}
    />
  );

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12.5L7.5 18L22 3.5" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 7L16.5 9.5" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 12L11.5 14.5" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Dibujo Libre
      </h3>

      {/* Contenedor de herramientas */}
      <div style={toolContainerStyle}>
        <button
          onClick={() => toggleTool('select')}
          style={toolButtonStyle(activeTool === 'select')}
          title="Seleccionar y mover elementos"
        >
          <SelectIcon isActive={activeTool === 'select'} />
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Seleccionar</span>
        </button>
        
        <button
          onClick={() => toggleTool('pen')}
          style={toolButtonStyle(activeTool === 'pen')}
          title="Dibujar a mano alzada"
        >
          <PencilIcon isActive={activeTool === 'pen'} />
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Lápiz</span>
        </button>
        
        <button
          onClick={() => toggleTool('eraser')}
          style={toolButtonStyle(activeTool === 'eraser')}
          title="Borrar elementos dibujados"
        >
          <EraserIcon isActive={activeTool === 'eraser'} />
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Borrador</span>
        </button>
      </div>

      {/* Selector de color con muestras predefinidas */}
      <div style={colorPickerContainerStyle}>
        <div style={colorLabelStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18.5C12 19.8807 10.8807 21 9.5 21C8.11929 21 7 19.8807 7 18.5C7 17.1193 8.11929 16 9.5 16C10.8807 16 12 17.1193 12 18.5Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 16L22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14.5 7.5L3 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 11L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 8L9.90869 7.09131C12.3778 4.62221 16.5376 4.6222 19.0067 7.09131L19.9154 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Color
        </div>
        <input 
          type="color" 
          value={drawingColor} 
          onChange={e => setDrawingColor(e.target.value)}
          style={colorPickerStyle}
          title="Seleccionar color personalizado"
        />
        <div style={colorSwatchesStyle}>
          {predefinedColors.map(color => (
            <ColorSwatch key={color} color={color} />
          ))}
        </div>
      </div>

      {/* Control de grosor de trazo */}
      <div style={strokeWidthContainerStyle}>
        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: colors.dark, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 16H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M6 8H18" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"/>
          </svg>
          Grosor
        </div>
        <div style={sliderContainerStyle}>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fino</span>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={strokeWidth} 
            onChange={e => setStrokeWidth(+e.target.value)}
            style={{
              flex: 1,
              height: '6px',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${strokeWidth * 2}%, #e2e8f0 ${strokeWidth * 2}%, #e2e8f0 100%)`,
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Grueso</span>
          <div style={strokePreviewStyle}>
            <div style={strokeLineStyle}></div>
          </div>
          <span style={valueIndicatorStyle}>{strokeWidth}px</span>
        </div>
      </div>
    </div>
  );
}