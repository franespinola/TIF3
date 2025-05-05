import React, { useState, useEffect } from 'react';
import ClinicalHistoryPanel from '../clinicalHistoryPanel/ClinicalHistoryPanel';
import SessionNotesPanel from '../sessionNotesPanel/SessionNotesPanel';

// Estilos para las pestañas inactivas
const tabStyle = {
  padding: '12px 16px',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  fontWeight: '600',
  color: '#64748b',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
};

// Estilos para la pestaña activa
const activeTabStyle = {
  ...tabStyle,
  borderBottom: '2px solid #0284c7',
  color: '#0284c7',
  backgroundColor: '#f0f9ff',
};

// Componente principal
const ClinicalTabsPanel = ({ selectedNode, onUpdateNode, isOpen, onClose, nodes, edges, patientName }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [isExiting, setIsExiting] = useState(false);
  const [visibility, setVisibility] = useState(isOpen);
  
  // Este efecto maneja la animación de entrada y salida del panel
  useEffect(() => {
    // Inserta estilos CSS para las animaciones
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes panelEnter {
        from {
          transform: translateX(440px);
          opacity: 0;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        }
        to {
          transform: translateX(0);
          opacity: 1;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        }
      }
      
      @keyframes panelExit {
        from {
          transform: translateX(0);
          opacity: 1;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        }
        to {
          transform: translateX(440px);
          opacity: 0;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        }
      }
      
      .panel-entering {
        animation: panelEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .panel-exiting {
        animation: panelExit 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Este efecto maneja la visualización/ocultamiento del panel con animación
  useEffect(() => {
    if (isOpen) {
      setVisibility(true);
      setIsExiting(false);
    } else if (visibility) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setVisibility(false);
      }, 250); // Duración de la animación de salida
      return () => clearTimeout(timer);
    }
  }, [isOpen, visibility]);

  // Función para manejar el cierre del panel con animación
  const handleClose = () => {
    setIsExiting(true);
    const timer = setTimeout(() => {
      onClose();
    }, 200); // Un poco menos que la duración de la animación para que se vea fluido
    return () => clearTimeout(timer);
  };

  // Si el panel no está visible, no renderizar nada
  if (!visibility) return null;

  // Estilo dinámico para el contenedor del panel, aplicando la clase de animación apropiada
  const dynamicPanelStyle = {
    position: 'fixed',
    top: '88px', // MenuBar (48px) + SubMenuBar (40px)
    right: 0,
    width: '440px',
    height: 'calc(100vh - 88px)',
    backgroundColor: '#f0f9ff',
    borderLeft: '1px solid #e0e7ff',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    boxSizing: 'border-box',
    overflow: 'hidden',
    className: isExiting ? 'panel-exiting' : 'panel-entering',
  };

  // Estilos para el contenedor de pestañas
  const tabHeaderContainerStyle = {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e7ff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    width: '100%',
    boxSizing: 'border-box',
  };

  // Estilos para el contenedor del contenido
  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: 0,
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div 
      style={dynamicPanelStyle}
      className={isExiting ? 'panel-exiting' : 'panel-entering'}
    >
      <div style={tabHeaderContainerStyle}>
        <div
          style={activeTab === 'history' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('history')}
          role="button"
          aria-selected={activeTab === 'history'}
          tabIndex={0}
        >
          <HistoryIcon />
          Historia Clínica
        </div>
        <div
          style={activeTab === 'notes' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('notes')}
          role="button"
          aria-selected={activeTab === 'notes'}
          tabIndex={0}
        >
          <NotesIcon />
          Notas de Sesión
        </div>
        <div 
          style={{
            marginLeft: 'auto',
            padding: '12px',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onClick={handleClose}
          title="Cerrar panel"
          role="button"
          aria-label="Cerrar panel"
          tabIndex={0}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>
      </div>
      <div style={contentStyle}>
        {activeTab === 'history' ? (
          <div className="tab-content history-content">
            <ClinicalHistoryPanel 
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode} 
              isOpen={true}
              patientName={patientName}
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>
        ) : (
          <div className="tab-content notes-content">
            <SessionNotesPanel 
              isOpen={true} 
              selectedNode={selectedNode}
              nodes={nodes}
              edges={edges}
              patientName={patientName}
              style={{
                position: 'relative',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Icono para la pestaña de Historia Clínica
const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

// Icono para la pestaña de Notas de Sesión
const NotesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
    <path d="M9 9h1M9 13h6M9 17h6"/>
  </svg>
);

export default ClinicalTabsPanel;
