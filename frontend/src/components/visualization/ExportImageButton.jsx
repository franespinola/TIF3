import React from "react";

/**
 * Componente que muestra el botón para exportar el genograma como imagen
 */
const ExportImageButton = ({ onExportDrawing }) => {
  // Estilos base para botones
  const baseButtonStyle = {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
    background: '#4f46e5',
    color: 'white',
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  return (
    <div className="export-image-button">
      <button
        onClick={onExportDrawing}
        style={baseButtonStyle}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        Exportar Imagen
      </button>
    </div>
  );
};

export default ExportImageButton;