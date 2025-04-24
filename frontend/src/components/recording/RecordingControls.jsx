import React from "react";

/**
 * Componente que gestiona los controles de grabación de la sesión
 */
const RecordingControls = ({ 
  isRecording, 
  onRecordToggle, 
  patientName, 
  onPatientNameChange 
}) => {
  // Estilos para inputs
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  // Estilos base para botones
  const baseButtonStyle = {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
  };

  return (
    <div className="recording-controls">
      {/* Input nombre paciente */}
      <input
        placeholder="Nombre Paciente"
        value={patientName}
        onChange={(e) => onPatientNameChange(e.target.value)}
        style={inputStyle}
      />
      
      {/* Botón de grabar/stop */}
      <button
        onClick={onRecordToggle}
        style={{
          ...baseButtonStyle,
          background: isRecording ? '#e53e3e' : '#38a169',
          color: 'white'
        }}
      >
        {isRecording ? 'Detener' : 'Grabar'}
      </button>
    </div>
  );
};

export default RecordingControls;