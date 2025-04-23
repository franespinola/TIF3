import React, { useState } from 'react';

/**
 * Componente que permite cambiar el modo de visualización del genograma
 * según diferentes temas y contextos clínicos.
 */
const ThemeVisualizer = ({ 
  onThemeChange, 
  currentTheme, 
  nodes, 
  edges, 
  setNodes, 
  setEdges 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Definición de los temas disponibles
  const themes = [
    { 
      id: 'default', 
      name: 'Estándar', 
      description: 'Visualización estándar del genograma',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h20v4H2zm0 14h20v4H2z"/>
          <path d="M6 7v10m4-10v10m4-10v10m4-10v10"/>
        </svg>
      )
    },
    { 
      id: 'relationships', 
      name: 'Relaciones', 
      description: 'Destaca las relaciones entre los miembros de la familia',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 22h4a2 2 0 0 0 2-2v-4m-6-2v8m0-8l-4-4m10 0h-6"/>
          <path d="M8 2H4a2 2 0 0 0-2 2v4m6 2V2m0 8 4 4M2 8h6"/>
          <path d="m9 15 6-6"/>
        </svg>
      ) 
    },
    { 
      id: 'clinical', 
      name: 'Clínico', 
      description: 'Resalta condiciones médicas y diagnósticos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/>
          <path d="M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
          <path d="M12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
          <path d="M12 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
        </svg>
      )
    },
    { 
      id: 'emotional', 
      name: 'Emocional', 
      description: 'Visualiza la dinámica emocional familiar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      )
    },
    { 
      id: 'timeline', 
      name: 'Cronológico', 
      description: 'Organiza el genograma según una línea temporal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      )
    }
  ];
  
  // Función para aplicar un tema
  const applyTheme = (themeId) => {
    // Guardar el tema actual
    const prevTheme = currentTheme;
    
    // Si seleccionamos el mismo tema, volver al predeterminado
    const newTheme = themeId === currentTheme ? 'default' : themeId;
    
    // Actualizar los nodos y bordes según el tema
    let updatedNodes = [...nodes];
    let updatedEdges = [...edges];
    
    switch(newTheme) {
      case 'relationships':
        // Resaltar las relaciones entre miembros
        updatedEdges = edges.map(edge => ({
          ...edge,
          style: {
            ...edge.style,
            strokeWidth: edge.data && edge.data.labelType ? 3 : 1,
            stroke: getRelationshipColor(edge.data?.labelType)
          },
          animated: edge.data && edge.data.labelType && edge.data.labelType !== 'normal'
        }));
        
        // Atenuar los nodos para destacar las relaciones
        updatedNodes = nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            opacity: 0.7
          }
        }));
        break;
        
      case 'clinical':
        // Resaltar nodos con datos clínicos
        updatedNodes = nodes.map(node => {
          const hasClinicalData = node.data && 
                                 node.data.clinicalData && 
                                 (node.data.clinicalData.diagnosis || 
                                  node.data.clinicalData.symptoms || 
                                  node.data.clinicalData.medications);
          
          return {
            ...node,
            style: {
              ...node.style,
              boxShadow: hasClinicalData ? '0 0 10px #ef4444' : 'none',
              border: hasClinicalData ? '2px solid #ef4444' : node.style?.border,
              opacity: hasClinicalData ? 1 : 0.6
            }
          };
        });
        break;
        
      case 'emotional':
        // Resaltar conexiones emocionales
        updatedEdges = edges.map(edge => {
          const isEmotional = edge.data && edge.data.labelType && 
                             ['positive', 'conflict', 'ambivalent'].includes(edge.data.labelType);
          
          return {
            ...edge,
            style: {
              ...edge.style,
              strokeWidth: isEmotional ? 3 : 1,
              stroke: isEmotional ? getRelationshipColor(edge.data.labelType) : edge.style?.stroke,
              opacity: isEmotional ? 1 : 0.5
            },
            animated: isEmotional
          };
        });
        break;
        
      case 'timeline':
        // Organizar nodos en línea temporal (simplificado)
        // En una implementación completa, se organizarían por edad/fecha
        break;
        
      default:
        // Restablecer a valores predeterminados
        updatedNodes = nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            boxShadow: 'none',
            border: node.style && node.style.borderDefault ? node.style.borderDefault : node.style?.border,
            opacity: 1
          }
        }));
        
        updatedEdges = edges.map(edge => ({
          ...edge,
          style: {
            ...edge.style,
            strokeWidth: edge.style?.strokeWidthDefault || 1,
            stroke: edge.style?.strokeDefault || edge.style?.stroke,
            opacity: 1
          },
          animated: edge.animatedDefault || false
        }));
    }
    
    // Actualizar el estado
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    onThemeChange(newTheme);
    
    // Cerrar el panel si lo pulsamos en móvil
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  // Función para obtener color según tipo de relación
  const getRelationshipColor = (type) => {
    switch(type) {
      case 'conflict': return '#ef4444';
      case 'positive': return '#22c55e';
      case 'neutral': return '#0ea5e9';
      case 'ambivalent': return '#eab308';
      default: return '#64748b';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 100,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      width: isOpen ? '250px' : 'auto',
      transition: 'all 0.3s ease'
    }}>
      <div 
        style={{
          padding: '10px 15px',
          backgroundColor: '#f8fafc',
          borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{
          fontWeight: 'bold',
          fontSize: '13px',
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 7h18m-18 5h18M4 17h16"/>
          </svg>
          {isOpen ? 'Modos de Visualización' : ''}
          {!isOpen && currentTheme !== 'default' && (
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              borderRadius: '10px',
              marginLeft: '5px'
            }}>
              {themes.find(t => t.id === currentTheme)?.name || 'Personalizado'}
            </span>
          )}
        </div>
        <button 
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div style={{ padding: '10px' }}>
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#64748b' }}>
            Seleccione un modo de visualización para cambiar la apariencia del genograma según el contexto.
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentTheme === theme.id ? '#e0f2fe' : '#f8fafc',
                  border: currentTheme === theme.id ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: currentTheme === theme.id ? '#0284c7' : '#f1f5f9',
                  color: currentTheme === theme.id ? 'white' : '#64748b'
                }}>
                  {theme.icon}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: currentTheme === theme.id ? 'bold' : 'normal',
                    fontSize: '13px',
                    color: currentTheme === theme.id ? '#0284c7' : '#334155'
                  }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {theme.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeVisualizer;