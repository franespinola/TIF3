import React, { useState, useRef } from 'react';
import MenuPortal from '../menuBar/MenuPortal';

/**
 * Componente de dropdown para selección de alineación de texto
 * Permite seleccionar alineación horizontal y vertical usando un grid 3x3 estilo Lucidchart
 */
const TextAlignmentDropdown = ({ activeAlignment = 'middle-center', onAlignmentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  
  // Matriz de alineaciones disponibles
  const alignmentOptions = [
    ['top-left', 'top-center', 'top-right'],
    ['middle-left', 'middle-center', 'middle-right'],
    ['bottom-left', 'bottom-center', 'bottom-right']
  ];
  
  // Obtener el ícono según la alineación actual
  const getAlignmentIcon = (alignment) => {
    const icons = {
      'top-left': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="14" y2="6" />
          <line x1="3" y1="12" x2="10" y2="12" />
          <line x1="3" y1="18" x2="12" y2="18" />
        </svg>
      ),
      'top-center': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="6" x2="19" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="7" y1="18" x2="17" y2="18" />
        </svg>
      ),
      'top-right': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="14" y1="12" x2="21" y2="12" />
          <line x1="12" y1="18" x2="21" y2="18" />
        </svg>
      ),
      'middle-left': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="8" x2="14" y2="8" />
          <line x1="3" y1="12" x2="10" y2="12" />
          <line x1="3" y1="16" x2="12" y2="16" />
        </svg>
      ),
      'middle-center': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="8" x2="19" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="7" y1="16" x2="17" y2="16" />
        </svg>
      ),
      'middle-right': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="8" x2="21" y2="8" />
          <line x1="14" y1="12" x2="21" y2="12" />
          <line x1="12" y1="16" x2="21" y2="16" />
        </svg>
      ),
      'bottom-left': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="10" x2="14" y2="10" />
          <line x1="3" y1="14" x2="10" y2="14" />
          <line x1="3" y1="18" x2="12" y2="18" />
        </svg>
      ),
      'bottom-center': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="10" x2="19" y2="10" />
          <line x1="8" y1="14" x2="16" y2="14" />
          <line x1="7" y1="18" x2="17" y2="18" />
        </svg>
      ),
      'bottom-right': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="10" x2="21" y2="10" />
          <line x1="14" y1="14" x2="21" y2="14" />
          <line x1="12" y1="18" x2="21" y2="18" />
        </svg>
      ),
      'justify': (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ),
    };
    
    return icons[alignment] || icons['middle-center'];
  };
  
  // Obtener etiqueta según la alineación
  const getAlignmentLabel = (alignment) => {
    const labels = {
      'top-left': 'Superior izquierda',
      'top-center': 'Superior centro',
      'top-right': 'Superior derecha',
      'middle-left': 'Medio izquierda',
      'middle-center': 'Centro',
      'middle-right': 'Medio derecha',
      'bottom-left': 'Inferior izquierda',
      'bottom-center': 'Inferior centro',
      'bottom-right': 'Inferior derecha',
      'justify': 'Justificado',
    };
    
    return labels[alignment] || 'Centro';
  };
  
  // Abrir el menú
  const handleButtonClick = (e) => {
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 2, left: rect.left });
    setIsOpen(!isOpen);
  };
  
  // Manejar selección de una alineación
  const handleAlignmentSelect = (alignment) => {
    setIsOpen(false);
    if (onAlignmentChange) {
      onAlignmentChange(alignment);
    }
  };
  
  return (
    <>
      <div
        ref={buttonRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: isOpen ? '#e2e8f0' : 'white',
        }}
        title={getAlignmentLabel(activeAlignment)}
        onClick={handleButtonClick}
      >
        {getAlignmentIcon(activeAlignment)}
      </div>
      
      {isOpen && (
        <MenuPortal
          isOpen={isOpen}
          position={menuPosition}
          onClickOutside={() => setIsOpen(false)}
        >
          <div style={{
            position: 'absolute',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            padding: '8px',
            width: '150px',
            zIndex: 1000,
          }}>
            <div style={{ fontSize: '12px', marginBottom: '8px', color: '#475569' }}>
              Alineación de texto
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '4px',
              margin: '0 auto',
              width: '90%',
            }}>
              {alignmentOptions.map((row, rowIndex) => (
                <div 
                  key={`row-${rowIndex}`} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '4px' 
                  }}
                >
                  {row.map((alignment) => (
                    <div
                      key={alignment}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        border: activeAlignment === alignment 
                          ? '2px solid #0284c7' 
                          : '1px solid #e2e8f0',
                        borderRadius: '4px',
                        backgroundColor: activeAlignment === alignment ? '#e0f2fe' : 'white',
                      }}
                      title={getAlignmentLabel(alignment)}
                      onClick={() => handleAlignmentSelect(alignment)}
                    >
                      {getAlignmentIcon(alignment)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Opción de justificado debajo del grid */}
            <div style={{
              marginTop: '8px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '8px',
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: activeAlignment === 'justify' ? '#e0f2fe' : 'transparent',
                }}
                onClick={() => handleAlignmentSelect('justify')}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px',
                  marginRight: '8px',
                }}>
                  {getAlignmentIcon('justify')}
                </div>
                <span style={{ fontSize: '12px' }}>Justificado</span>
              </div>
            </div>
          </div>
        </MenuPortal>
      )}
    </>
  );
};

export default TextAlignmentDropdown;