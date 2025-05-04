import React, { useState } from 'react';
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

// Estilos para el contenedor principal del panel
const panelContainerStyle = {
  position: 'fixed',
  top: '88px', // MenuBar (48px) + SubMenuBar (40px)
  right: 0,
  width: '440px', // Aumentado a 440px para dar más espacio
  height: 'calc(100vh - 88px)',
  backgroundColor: '#f0f9ff',
  borderLeft: '1px solid #e0e7ff',
  boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 999,
  animation: 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  boxSizing: 'border-box', // Asegura que padding y border estén incluidos en el ancho
  overflow: 'hidden', // Evita desbordamiento horizontal
};

// Estilos para el contenedor de pestañas
const tabHeaderContainerStyle = {
  display: 'flex',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e0e7ff',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  width: '100%', // Asegurar que ocupe todo el ancho
  boxSizing: 'border-box', // Incluir padding y border en el ancho
};

// Estilos para el contenedor del contenido
const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden', // Evita scroll horizontal
  padding: 0,
  position: 'relative',
  width: '100%', // Asegurar que ocupe todo el ancho
  boxSizing: 'border-box', // Incluir padding y border en el ancho
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

// Componente principal
const ClinicalTabsPanel = ({ selectedNode, onUpdateNode, isOpen, onClose, nodes, edges, patientName }) => {
  const [activeTab, setActiveTab] = useState('history');
  
  // Si el panel no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div style={panelContainerStyle}>
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
            hover: { color: '#ef4444' }
          }}
          onClick={onClose}
          title="Cerrar panel"
          role="button"
          aria-label="Cerrar panel"
          tabIndex={0}
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
                position: 'relative', // Cambiamos position para que no use absolute
                top: 0,
                left: 0,
                width: '100%', // Usamos ancho completo del contenedor
                height: '100%',
                border: 'none' // Eliminamos bordes para evitar duplicados
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
                position: 'relative', // Cambiamos position para que no use absolute
                top: 0,
                right: 0,
                width: '100%', // Usamos ancho completo del contenedor
                height: '100%',
                border: 'none' // Eliminamos bordes para evitar duplicados
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalTabsPanel;
