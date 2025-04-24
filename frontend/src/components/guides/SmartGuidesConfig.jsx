import React, { useState } from 'react';

/**
 * Componente para la configuración de las guías inteligentes, encapsulando todos los controles relacionados
 * con las guías que aparecen en el Sidebar
 */
function SmartGuidesConfig({ 
  enableSmartGuides, 
  onToggleSmartGuides, 
  guideOptions, 
  updateGuideOptions 
}) {
  const [showGuideSettings, setShowGuideSettings] = useState(false);

  // Ícono para expandir/colapsar configuraciones
  const expandIcon = (expanded) => (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      style={{ 
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <path 
        d="M7 10l5 5 5-5" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );

  return (
    <div style={{ 
      marginTop: '15px', 
      padding: '10px',
      background: enableSmartGuides ? '#e5f6ff' : '#f0f0f0',
      borderRadius: '8px',
      border: `1px solid ${enableSmartGuides ? '#3b82f6' : '#ccc'}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          color: enableSmartGuides ? '#3b82f6' : '#666'
        }}>
          Guías Inteligentes
        </h4>
        <button 
          onClick={() => setShowGuideSettings(!showGuideSettings)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            opacity: 0.7,
            color: '#3b82f6'
          }}
        >
          {expandIcon(showGuideSettings)}
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          fontSize: '0.95rem'
        }}>
          <input
            type="checkbox"
            checked={enableSmartGuides}
            onChange={onToggleSmartGuides}
            style={{ 
              width: '16px', 
              height: '16px', 
              accentColor: '#3b82f6' 
            }}
          />
          {enableSmartGuides ? 'Activadas' : 'Desactivadas'}
        </label>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>
          (Tecla 'G')
        </span>
      </div>
      
      {/* Configuración avanzada de Smart Guides */}
      {enableSmartGuides && showGuideSettings && (
        <div style={{ 
          marginTop: '12px', 
          border: '1px solid #d1e0ff',
          borderRadius: '6px',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.9rem',
        }}>
          <h5 style={{ 
            fontSize: '0.9rem', 
            marginTop: 0, 
            marginBottom: '10px', 
            color: '#3b82f6'
          }}>
            Configuración Avanzada
          </h5>
          
          {/* Opción de distribución equidistante */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              <input
                type="checkbox"
                checked={guideOptions.detectDistribution}
                onChange={(e) => updateGuideOptions('detectDistribution', e.target.checked)}
                style={{ 
                  accentColor: '#3b82f6',
                  width: '14px',
                  height: '14px'
                }}
              />
              Distribución equidistante
            </label>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>
              (Tecla 'D')
            </span>
          </div>
          
          {/* Opción de ajuste automático */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              <input
                type="checkbox"
                checked={guideOptions.enableSnapping}
                onChange={(e) => updateGuideOptions('enableSnapping', e.target.checked)}
                style={{ 
                  accentColor: '#3b82f6',
                  width: '14px',
                  height: '14px'
                }}
              />
              Ajuste automático
            </label>
          </div>
          
          {/* Opción de etiquetas de distancia */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              <input
                type="checkbox"
                checked={guideOptions.showDistances}
                onChange={(e) => updateGuideOptions('showDistances', e.target.checked)}
                style={{ 
                  accentColor: '#3b82f6',
                  width: '14px',
                  height: '14px'
                }}
              />
              Mostrar medidas
            </label>
          </div>
          
          {/* Control de sensibilidad */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            marginBottom: '8px',
            gap: '4px'
          }}>
            <label style={{ 
              fontSize: '0.9rem',
              color: '#555',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Sensibilidad:</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                {guideOptions.threshold}px
              </span>
            </label>
            <input
              type="range"
              min="2"
              max="15"
              value={guideOptions.threshold}
              onChange={(e) => updateGuideOptions('threshold', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: '#666'
            }}>
              <span>Preciso</span>
              <span>Flexible</span>
            </div>
          </div>
          
          {/* Control de umbral de ajuste */}
          {guideOptions.enableSnapping && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '4px'
            }}>
              <label style={{ 
                fontSize: '0.9rem',
                color: '#555',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Umbral de ajuste:</span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                  {guideOptions.snapThreshold}px
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={guideOptions.snapThreshold}
                onChange={(e) => updateGuideOptions('snapThreshold', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#666'
              }}>
                <span>Suave</span>
                <span>Fuerte</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!showGuideSettings && (
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#4b5563', 
          marginTop: '8px',
          lineHeight: '1.3'
        }}>
          Las guías ayudan a alinear los nodos al arrastrarlos, mostrando líneas cuando se alinean con otros nodos.
        </p>
      )}
    </div>
  );
}

export default SmartGuidesConfig;