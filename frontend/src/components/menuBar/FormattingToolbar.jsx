import React, { useState, useRef, useEffect } from 'react';
import MenuPortal from './MenuPortal';
import TextAlignmentDropdown from '../text/TextAlignmentDropdown';

/**
 * FormattingToolbar - Barra de herramientas de formato estilo Lucidchart
 * Incluye selector de fuente, tamaño, opciones de formato, colores y alineación de texto
 */
const FormattingToolbar = ({
  selectedNode = null,
  updateNodeStyle,
}) => {
  // Estados para los diversos controles de formato
  const [textStyle, setTextStyle] = useState({
    fontFamily: 'Inter',
    fontSize: '10pt',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'middle-center', // Formato compuesto para el nuevo dropdown
    textColor: '#000000',
    fillColor: 'white',
    strokeColor: '#000000',
  });

  // Estados para menús desplegables
  const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  const [showTextStyleMenu, setShowTextStyleMenu] = useState(false);
  
  // Estados para posiciones de menús desplegables
  const [fontFamilyMenuPosition, setFontFamilyMenuPosition] = useState({ top: 0, left: 0 });
  const [fontSizeMenuPosition, setFontSizeMenuPosition] = useState({ top: 0, left: 0 });
  const [textColorPosition, setTextColorPosition] = useState({ top: 0, left: 0 });
  const [fillColorPosition, setFillColorPosition] = useState({ top: 0, left: 0 });
  const [strokeColorPosition, setStrokeColorPosition] = useState({ top: 0, left: 0 });
  const [textStyleMenuPosition, setTextStyleMenuPosition] = useState({ top: 0, left: 0 });

  // Referencias para los botones y menús
  const fontFamilyButtonRef = useRef(null);
  const fontFamilyMenuRef = useRef(null);
  const fontSizeButtonRef = useRef(null);
  const fontSizeMenuRef = useRef(null);
  const textColorButtonRef = useRef(null);
  const textColorPickerRef = useRef(null);
  const fillColorButtonRef = useRef(null);
  const fillColorPickerRef = useRef(null);
  const strokeColorButtonRef = useRef(null);
  const strokeColorPickerRef = useRef(null);
  const textStyleButtonRef = useRef(null);
  const textStyleMenuRef = useRef(null);

  // Opciones para los menús desplegables
  const fontFamilyOptions = [
    'Inter', 'Arial', 'Roboto', 'Helvetica', 'Times New Roman', 
    'Courier New', 'Georgia', 'Trebuchet MS', 'Verdana'
  ];
  
  const fontSizeOptions = [
    '8pt', '10pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '32pt'
  ];
  
  const colorOptions = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#A52A2A', '#800080', '#008080', '#808000', '#800000', '#008000', '#000080', '#808080',
    '#C0C0C0', '#FFC0CB', '#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#8B4513', '#7B68EE',
  ];
  
  const textStyleOptions = [
    { id: 'title', name: 'Título', style: { fontSize: '24pt', fontWeight: 'bold' } },
    { id: 'subtitle', name: 'Subtítulo', style: { fontSize: '18pt', fontWeight: 'normal' } },
    { id: 'body', name: 'Cuerpo', style: { fontSize: '12pt', fontWeight: 'normal' } },
    { id: 'caption', name: 'Pie', style: { fontSize: '10pt', fontStyle: 'italic' } },
  ];

  // Manejar cambio de alineación desde el dropdown
  const handleAlignmentChange = (alignment) => {
    setTextStyle(prev => ({ ...prev, textAlign: alignment }));
    if (selectedNode && updateNodeStyle) {
      updateNodeStyle(selectedNode.id, { textAlign: alignment });
    }
  };

  // Actualizar estado cuando cambia el nodo seleccionado
  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      // Tomamos los estilos del nodo seleccionado si existen
      const nodeData = selectedNode.data;
      
      // Convertir alineación antigua al nuevo formato si es necesario
      let textAlign = nodeData.textAlign || 'middle-center';
      if (textAlign && !textAlign.includes('-')) {
        // Si solo hay alineación horizontal, usar middle como vertical por defecto
        textAlign = `middle-${textAlign}`;
      }
      
      setTextStyle(prev => ({
        fontFamily: nodeData.fontFamily || prev.fontFamily,
        fontSize: nodeData.fontSize || prev.fontSize,
        fontWeight: nodeData.bold ? 'bold' : (nodeData.fontWeight || prev.fontWeight),
        fontStyle: nodeData.italic ? 'italic' : (nodeData.fontStyle || prev.fontStyle),
        textDecoration: nodeData.underline ? 'underline' : (nodeData.textDecoration || prev.textDecoration),
        textAlign: textAlign,
        textColor: nodeData.textColor || nodeData.color || prev.textColor,
        fillColor: nodeData.fillColor || nodeData.fill || prev.fillColor,
        strokeColor: nodeData.strokeColor || nodeData.stroke || prev.strokeColor,
      }));
    }
  }, [selectedNode]);

  // Cerrar otros menús cuando se abre uno nuevo
  const closeOtherMenus = (currentMenuRef) => {
    setShowFontFamilyMenu(currentMenuRef === fontFamilyMenuRef);
    setShowFontSizeMenu(currentMenuRef === fontSizeMenuRef);
    setShowTextColorPicker(currentMenuRef === textColorPickerRef);
    setShowFillColorPicker(currentMenuRef === fillColorPickerRef);
    setShowStrokeColorPicker(currentMenuRef === strokeColorPickerRef);
    setShowTextStyleMenu(currentMenuRef === textStyleMenuRef);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      borderRight: '1px solid #e2e8f0',
      marginRight: '16px',
      paddingRight: '16px',
      height: '32px'
    }}>
      {/* Selector de tipo de fuente */}
      <div
        ref={fontFamilyButtonRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          borderRadius: '4px',
          height: '28px',
          cursor: 'pointer',
          marginRight: '4px',
          border: '1px solid #e2e8f0',
          backgroundColor: showFontFamilyMenu ? '#e2e8f0' : 'white',
        }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setFontFamilyMenuPosition({ top: rect.bottom + 2, left: rect.left });
          setShowFontFamilyMenu(!showFontFamilyMenu);
          if (showFontFamilyMenu) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(fontFamilyMenuRef);
          }
        }}
      >
        <span style={{ 
          fontSize: '13px',
          fontFamily: textStyle.fontFamily,
          marginRight: '4px',
        }}>
          {textStyle.fontFamily}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {showFontFamilyMenu && (
          <MenuPortal
            isOpen={showFontFamilyMenu}
            position={fontFamilyMenuPosition}
            onClickOutside={() => setShowFontFamilyMenu(false)}
          >
            <div 
              ref={fontFamilyMenuRef} 
              style={{
                position: 'absolute',
                width: '200px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                maxHeight: '300px',
                overflow: 'auto',
                zIndex: 1000,
              }}
            >
              {fontFamilyOptions.map((font) => (
                <div
                  key={font}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontFamily: font,
                    backgroundColor: textStyle.fontFamily === font ? '#e0f2fe' : 'white',
                    borderLeft: textStyle.fontFamily === font ? '3px solid #0284c7' : '3px solid transparent',
                  }}
                  onClick={() => {
                    setTextStyle(prev => ({ ...prev, fontFamily: font }));
                    setShowFontFamilyMenu(false);
                    if (selectedNode && updateNodeStyle) {
                      updateNodeStyle(selectedNode.id, { fontFamily: font });
                    }
                  }}
                >
                  {font}
                </div>
              ))}
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Selector de tamaño de fuente */}
      <div
        ref={fontSizeButtonRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          borderRadius: '4px',
          height: '28px',
          cursor: 'pointer',
          marginRight: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: showFontSizeMenu ? '#e2e8f0' : 'white',
        }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setFontSizeMenuPosition({ top: rect.bottom + 2, left: rect.left });
          setShowFontSizeMenu(!showFontSizeMenu);
          if (showFontSizeMenu) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(fontSizeMenuRef);
          }
        }}
      >
        <span style={{ fontSize: '13px', marginRight: '4px' }}>
          {textStyle.fontSize}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {showFontSizeMenu && (
          <MenuPortal
            isOpen={showFontSizeMenu}
            position={fontSizeMenuPosition}
            onClickOutside={() => setShowFontSizeMenu(false)}
          >
            <div 
              ref={fontSizeMenuRef} 
              style={{
                position: 'absolute',
                width: '100px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                maxHeight: '300px',
                overflow: 'auto',
                zIndex: 1000,
              }}
            >
              {fontSizeOptions.map((size) => (
                <div
                  key={size}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    backgroundColor: textStyle.fontSize === size ? '#e0f2fe' : 'white',
                    borderLeft: textStyle.fontSize === size ? '3px solid #0284c7' : '3px solid transparent',
                    fontSize: '13px',
                  }}
                  onClick={() => {
                    setTextStyle(prev => ({ ...prev, fontSize: size }));
                    setShowFontSizeMenu(false);
                    if (selectedNode && updateNodeStyle) {
                      updateNodeStyle(selectedNode.id, { fontSize: size });
                    }
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Botones de formato: Negrita, Cursiva, Subrayado */}
      <div style={{ 
        display: 'flex', 
        marginRight: '8px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        overflow: 'hidden', 
      }}>
        {/* Botón de Negrita */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            backgroundColor: textStyle.fontWeight === 'bold' ? '#e2e8f0' : 'white',
            borderRight: '1px solid #e2e8f0',
          }}
          title="Negrita"
          onClick={() => {
            const newWeight = textStyle.fontWeight === 'bold' ? 'normal' : 'bold';
            setTextStyle(prev => ({ ...prev, fontWeight: newWeight }));
            if (selectedNode && updateNodeStyle) {
              updateNodeStyle(selectedNode.id, { fontWeight: newWeight, bold: newWeight === 'bold' });
            }
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>B</span>
        </div>

        {/* Botón de Cursiva */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            backgroundColor: textStyle.fontStyle === 'italic' ? '#e2e8f0' : 'white',
            borderRight: '1px solid #e2e8f0',
          }}
          title="Cursiva"
          onClick={() => {
            const newStyle = textStyle.fontStyle === 'italic' ? 'normal' : 'italic';
            setTextStyle(prev => ({ ...prev, fontStyle: newStyle }));
            if (selectedNode && updateNodeStyle) {
              updateNodeStyle(selectedNode.id, { fontStyle: newStyle, italic: newStyle === 'italic' });
            }
          }}
        >
          <span style={{ fontStyle: 'italic', fontSize: '15px' }}>I</span>
        </div>

        {/* Botón de Subrayado */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            backgroundColor: textStyle.textDecoration === 'underline' ? '#e2e8f0' : 'white',
          }}
          title="Subrayado"
          onClick={() => {
            const newDecoration = textStyle.textDecoration === 'underline' ? 'none' : 'underline';
            setTextStyle(prev => ({ ...prev, textDecoration: newDecoration }));
            if (selectedNode && updateNodeStyle) {
              updateNodeStyle(selectedNode.id, { 
                textDecoration: newDecoration,
                underline: newDecoration === 'underline'
              });
            }
          }}
        >
          <span style={{ textDecoration: 'underline', fontSize: '15px' }}>U</span>
        </div>
      </div>

      {/* Dropdown de alineación de texto con grilla 3x3 */}
      <div style={{ marginRight: '8px' }}>
        <TextAlignmentDropdown 
          activeAlignment={textStyle.textAlign}
          onAlignmentChange={handleAlignmentChange}
        />
      </div>

      {/* Selector de color de texto */}
      <div
        ref={textColorButtonRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          marginRight: '4px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: 'white',
          position: 'relative',
        }}
        title="Color de texto"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setTextColorPosition({ top: rect.bottom + 2, left: rect.left });
          setShowTextColorPicker(!showTextColorPicker);
          if (showTextColorPicker) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(textColorPickerRef);
          }
        }}
      >
        <div style={{
          width: '16px',
          height: '16px',
          backgroundColor: textStyle.textColor,
          borderRadius: '2px',
          border: '1px solid #e2e8f0',
        }} />

        {showTextColorPicker && (
          <MenuPortal
            isOpen={showTextColorPicker}
            position={textColorPosition}
            onClickOutside={() => setShowTextColorPicker(false)}
          >
            <div 
              ref={textColorPickerRef} 
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '8px',
                width: '172px',
                zIndex: 1000,
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '6px', color: '#475569' }}>Color de texto</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px',
              }}>
                {colorOptions.map((color) => (
                  <div
                    key={`text-${color}`}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: textStyle.textColor === color ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    }}
                    onClick={() => {
                      setTextStyle(prev => ({ ...prev, textColor: color }));
                      setShowTextColorPicker(false);
                      if (selectedNode && updateNodeStyle) {
                        updateNodeStyle(selectedNode.id, { textColor: color, color: color });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Selector de color de fondo */}
      <div
        ref={fillColorButtonRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          marginRight: '4px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: 'white',
          position: 'relative',
        }}
        title="Color de fondo"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setFillColorPosition({ top: rect.bottom + 2, left: rect.left });
          setShowFillColorPicker(!showFillColorPicker);
          if (showFillColorPicker) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(fillColorPickerRef);
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={textStyle.fillColor} stroke="currentColor" strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>

        {showFillColorPicker && (
          <MenuPortal
            isOpen={showFillColorPicker}
            position={fillColorPosition}
            onClickOutside={() => setShowFillColorPicker(false)}
          >
            <div 
              ref={fillColorPickerRef} 
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '8px',
                width: '172px',
                zIndex: 1000,
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '6px', color: '#475569' }}>Color de fondo</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px',
              }}>
                {colorOptions.map((color) => (
                  <div
                    key={`fill-${color}`}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: textStyle.fillColor === color ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    }}
                    onClick={() => {
                      setTextStyle(prev => ({ ...prev, fillColor: color }));
                      setShowFillColorPicker(false);
                      if (selectedNode && updateNodeStyle) {
                        updateNodeStyle(selectedNode.id, { fillColor: color, fill: color });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Selector de color de borde */}
      <div
        ref={strokeColorButtonRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          marginRight: '8px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: 'white',
          position: 'relative',
        }}
        title="Color de borde"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setStrokeColorPosition({ top: rect.bottom + 2, left: rect.left });
          setShowStrokeColorPicker(!showStrokeColorPicker);
          if (showStrokeColorPicker) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(strokeColorPickerRef);
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textStyle.strokeColor} strokeWidth="2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>

        {showStrokeColorPicker && (
          <MenuPortal
            isOpen={showStrokeColorPicker}
            position={strokeColorPosition}
            onClickOutside={() => setShowStrokeColorPicker(false)}
          >
            <div 
              ref={strokeColorPickerRef} 
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '8px',
                width: '172px',
                zIndex: 1000,
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '6px', color: '#475569' }}>Color de borde</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px',
              }}>
                {colorOptions.map((color) => (
                  <div
                    key={`stroke-${color}`}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: textStyle.strokeColor === color ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    }}
                    onClick={() => {
                      setTextStyle(prev => ({ ...prev, strokeColor: color }));
                      setShowStrokeColorPicker(false);
                      if (selectedNode && updateNodeStyle) {
                        updateNodeStyle(selectedNode.id, { strokeColor: color, stroke: color });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Botón de estilos de texto */}
      <div
        ref={textStyleButtonRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          borderRadius: '4px',
          height: '28px',
          cursor: 'pointer',
          border: '1px solid #e2e8f0',
          backgroundColor: showTextStyleMenu ? '#e2e8f0' : 'white',
        }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setTextStyleMenuPosition({ top: rect.bottom + 2, left: rect.left });
          setShowTextStyleMenu(!showTextStyleMenu);
          if (showTextStyleMenu) {
            closeOtherMenus(null);
          } else {
            closeOtherMenus(textStyleMenuRef);
          }
        }}
      >
        <span style={{ fontSize: '13px', marginRight: '4px' }}>T</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {showTextStyleMenu && (
          <MenuPortal
            isOpen={showTextStyleMenu}
            position={textStyleMenuPosition}
            onClickOutside={() => setShowTextStyleMenu(false)}
          >
            <div 
              ref={textStyleMenuRef} 
              style={{
                position: 'absolute',
                width: '160px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                zIndex: 1000,
              }}
            >
              {textStyleOptions.map((styleOption) => (
                <div
                  key={styleOption.id}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: styleOption.style.fontWeight,
                    fontSize: styleOption.style.fontSize ? 
                      styleOption.style.fontSize.replace('pt', '') / 12 + 'em' : 
                      'inherit',
                    fontStyle: styleOption.style.fontStyle || 'normal',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                  onClick={() => {
                    // Aplicamos todos los estilos de la opción
                    setTextStyle(prev => ({ 
                      ...prev, 
                      ...styleOption.style 
                    }));
                    setShowTextStyleMenu(false);
                    if (selectedNode && updateNodeStyle) {
                      updateNodeStyle(selectedNode.id, styleOption.style);
                    }
                  }}
                >
                  {styleOption.name}
                </div>
              ))}
            </div>
          </MenuPortal>
        )}
      </div>
    </div>
  );
};

export default FormattingToolbar;