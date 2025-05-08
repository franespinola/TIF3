import React from 'react';
import { exportCanvasAsImage } from './imageExport';

/**
 * Componente que proporciona botones para exportar un elemento como imagen
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.elementId - ID del elemento a exportar (por defecto: 'canvas-wrapper')
 * @param {string} props.fileName - Nombre del archivo sin extensión (por defecto: 'diagrama')
 * @param {Object} props.options - Opciones adicionales para la exportación
 * @returns {JSX.Element}
 */
const ExportButtons = ({ 
  elementId = 'canvas-wrapper', 
  fileName = 'diagrama', 
  options = {},
  className = ''
}) => {
  const handleExport = async (format) => {
    try {
      await exportCanvasAsImage(elementId, format, fileName, options);
    } catch (error) {
      console.error(`Error al exportar como ${format}:`, error);
      alert(`No se pudo exportar la imagen: ${error.message}`);
    }
  };

  const buttonStyle = {
    margin: '0 5px',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4285f4',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  return (
    <div className={`export-buttons ${className}`}>
      <button 
        onClick={() => handleExport('png')}
        style={buttonStyle}
        title="Exportar como PNG (mejor calidad)"
      >
        Exportar PNG
      </button>
      <button 
        onClick={() => handleExport('jpg')}
        style={buttonStyle}
        title="Exportar como JPG (tamaño más pequeño)"
      >
        Exportar JPG
      </button>
    </div>
  );
};

export default ExportButtons;