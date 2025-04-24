import React from "react";

/**
 * Componente que gestiona los botones para mostrar/ocultar los paneles laterales
 */
const SidebarPanels = ({
  toggleClinicalHistory,
  isClinicalHistoryOpen,
  toggleSessionNotes,
  isSessionNotesOpen
}) => {
  // Estilo para botones de paneles laterales
  const lateralPanelButtonStyle = {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
    padding: '10px 12px',
    transition: 'all 0.2s',
  };

  const activePanelButtonStyle = {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    borderLeft: '3px solid #0284c7',
  };

  return (
    <div className="sidebar-panels" style={{ 
      marginTop: '15px',
      marginBottom: '15px', 
      padding: '10px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <h4 style={{ 
        fontSize: '1rem', 
        margin: '0 0 8px 0', 
        color: '#334155',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h18v18H3z" />
          <path d="M9 3v18" />
        </svg>
        Paneles Laterales
      </h4>
      
      {/* Botón para Historia Clínica */}
      <button
        onClick={toggleClinicalHistory}
        style={{
          ...lateralPanelButtonStyle,
          ...(isClinicalHistoryOpen ? activePanelButtonStyle : {
            backgroundColor: '#f1f5f9',
            color: '#475569'
          })
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        </svg>
        Historia Clínica
        {isClinicalHistoryOpen && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '12px', 
            backgroundColor: '#bae6fd', 
            color: '#0284c7',
            padding: '2px 6px',
            borderRadius: '12px'
          }}>
            Abierto
          </span>
        )}
      </button>
      
      {/* Botón para Notas de Sesión */}
      <button
        onClick={toggleSessionNotes}
        style={{
          ...lateralPanelButtonStyle,
          ...(isSessionNotesOpen ? activePanelButtonStyle : {
            backgroundColor: '#f1f5f9',
            color: '#475569'
          })
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
          <path d="M9 9h1M9 13h6M9 17h6"/>
        </svg>
        Notas de Sesión
        {isSessionNotesOpen && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '12px', 
            backgroundColor: '#bae6fd', 
            color: '#0284c7',
            padding: '2px 6px',
            borderRadius: '12px'
          }}>
            Abierto
          </span>
        )}
      </button>
    </div>
  );
};

export default SidebarPanels;