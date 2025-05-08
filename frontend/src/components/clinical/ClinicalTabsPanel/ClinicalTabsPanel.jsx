import React, { useState, useEffect } from 'react';
import ClinicalHistoryPanel from '../clinicalHistoryPanel/ClinicalHistoryPanel';
import SessionNotesPanel from '../sessionNotesPanel/SessionNotesPanel';

// Estilos para las pestañas inactivas
const tabStyle = {
  padding: '12px 16px',
  cursor: 'pointer',
  borderBottom: '3px solid transparent', // Borde más grueso para mejor definición
  fontWeight: '600',
  color: '#475569', // Color de texto más oscuro para mayor contraste
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
};

// Estilos para la pestaña activa
const activeTabStyle = {
  ...tabStyle,
  borderBottom: '3px solid #0369a1', // Azul más oscuro y borde más grueso
  color: '#0369a1', // Texto más oscuro para mayor contraste
  backgroundColor: '#e0f2fe', // Color de fondo más sólido (menos transparente)
};

// Componente principal
const ClinicalTabsPanel = ({ selectedNode, onUpdateNode, isOpen, onClose, nodes, edges, patientName }) => {
  // Estados
  const [activeTab, setActiveTab] = useState('history');
  const [visible, setVisible] = useState(isOpen);
  
  // Manejar el cambio de isOpen con animación
  useEffect(() => {
    if (isOpen) {
      // Cuando se abre, primero hacer visible y luego aplicar transición
      setVisible(true);
    } else if (visible) {
      // Cuando se cierra, escuchar el fin de la transición antes de quitar del DOM
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // Esperar a que termine la transición
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  // Cierre inmediato al hacer clic en X
  const handleClose = () => {
    // Llamar inmediatamente al onClose para actualizar el estado en el componente padre
    onClose();
  };

  // No renderizar si no está visible
  if (!visible && !isOpen) return null;
  
  // Estilo base para el panel
  const panelStyle = {
    position: 'fixed',
    top: '88px',
    right: 0,
    width: '440px',
    height: 'calc(100vh - 88px)',
    backgroundColor: '#ffffff', // Fondo blanco sólido para mejor nitidez
    borderLeft: '1px solid #cbd5e1', // Borde más visible
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    boxSizing: 'border-box',
    overflow: 'hidden',
    transform: isOpen ? 'translateX(0)' : 'translateX(440px)',
    opacity: isOpen ? 1 : 0,
    boxShadow: isOpen ? '-3px 0 8px rgba(0, 0, 0, 0.15)' : 'none', // Sombra más definida
    transition: 'transform 300ms ease-out, opacity 300ms ease-out, box-shadow 300ms ease-out',
    willChange: 'transform, opacity', // Ayuda a optimizar la animación
    backfaceVisibility: 'hidden', // Reduce problemas de renderizado
    WebkitBackfaceVisibility: 'hidden',
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  // Estilos para el contenedor de pestañas
  const tabHeaderContainerStyle = {
    display: 'flex',
    backgroundColor: '#ffffff', // Blanco sólido para mejor contraste
    borderBottom: '2px solid #e2e8f0', // Borde más visible
    position: 'sticky',
    top: 0,
    zIndex: 10,
    width: '100%',
    boxSizing: 'border-box',
  };

  // Estilos para el contenedor del contenido con transición separada
  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: 0,
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 250ms ease-out',
    backgroundColor: '#f8fafc', // Fondo más claro y sólido
  };

  return (
    <div style={panelStyle}>
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
            color: '#475569', // Color más oscuro para mejor visibilidad
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
          onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

// Icono para la pestaña de Notas de Sesión
const NotesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
    <path d="M9 9h1M9 13h6M9 17h6"/>
  </svg>
);

export default ClinicalTabsPanel;
