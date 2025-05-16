import React, { useState, useEffect } from "react";

/**
 * Componente mejorado que gestiona los controles de grabación de la sesión
 * con una interfaz más atractiva y moderna
 */
const RecordingControls = ({ 
  isRecording, 
  isProcessing,
  onRecordToggle, 
  patientName, 
  onPatientNameChange 
}) => {
  // Estado para mostrar animación de grabación
  const [recordingTime, setRecordingTime] = useState(0);
  // Estado para efecto de enfoque en input
  const [isFocused, setIsFocused] = useState(false);
  
  // Colores para el tema
  const colors = {
    primary: '#e11d48',
    secondary: '#10b981',
    light: '#f8fafc',
    dark: '#1e293b',
    accent: '#7c3aed',
    danger: '#ef4444',
    warning: '#f59e0b',
    border: '#e2e8f0',
    inputBg: '#ffffff',
    focusBorder: '#c026d3',
    recordRipple: 'rgba(225, 29, 72, 0.2)',
  };

  // Contenedor principal con estilo moderno
  const containerStyle = {
    backgroundColor: colors.light,
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.03)',
    padding: '16px',
    marginBottom: '20px',
    border: `1px solid ${colors.border}`,
    position: 'relative',
    overflow: 'hidden',
  };

  // Estilo para el encabezado con ícono
  const headerStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.accent,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    paddingBottom: '8px',
    borderBottom: `2px solid ${colors.accent}`,
  };

  // Estilo mejorado para el input con ancho reducido
  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '18px',
    display: 'flex',
    justifyContent: 'center', // Centrar el input
  };
  
  // Estilo para la etiqueta flotante
  const floatingLabelStyle = {
    position: 'absolute',
    left: '10px',
    fontSize: patientName ? '0.7rem' : '0.9rem',
    fontWeight: '500',
    color: patientName ? colors.accent : '#94a3b8',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
    top: patientName || isFocused ? '7px' : '50%',
    transform: patientName || isFocused 
      ? 'translateY(0)' 
      : 'translateY(-50%)',
    zIndex: 1,
    backgroundColor: patientName || isFocused ? colors.inputBg : 'transparent',
    padding: patientName || isFocused ? '0 5px' : '0',
  };

  // Estilo para el input con enfoque y ancho reducido
  const inputStyle = {
    width: '100%', // Reduciendo el ancho al 80%
    maxWidth: '300px', // Estableciendo un ancho máximo
    fontSize: '0.95rem',
    padding: patientName || isFocused ? '22px 12px 8px 12px' : '12px',
    border: `2px solid ${isFocused ? colors.focusBorder : colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.inputBg,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: isFocused ? `0 0 0 3px ${colors.focusBorder}30` : 'none',
  };

  // Estilo para el botón de grabación
  const recordButtonStyle = {
    width: '100%',
    padding: '14px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '4px',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    background: isRecording 
      ? `linear-gradient(45deg, ${colors.danger} 0%, ${colors.primary} 100%)` 
      : `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
    color: 'white',
    boxShadow: isRecording 
      ? `0 4px 12px ${colors.danger}60` 
      : `0 4px 12px ${colors.accent}40`,
    transform: isRecording ? 'scale(1.02)' : 'scale(1)',
  };

  // Estilo para el ícono de micrófono
  const micIconStyle = {
    position: 'relative',
    transition: 'all 0.3s ease',
    transform: isRecording ? 'scale(1.1)' : 'scale(1)',
  };

  // Timer para la animación de grabación
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Formato para mostrar el tiempo de grabación
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" 
            stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.35 9.64999V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.64999" 
            stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.61 6.43C11.51 6.1 12.49 6.1 13.39 6.43" 
            stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.2 8.55001C11.73 8.41001 12.28 8.41001 12.81 8.55001" 
            stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19V22" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Grabación de Sesión
      </h3>

      <div style={inputContainerStyle}>
        <label style={floatingLabelStyle}>
          Nombre del Paciente
        </label>
        <input
          value={patientName}
          onChange={(e) => onPatientNameChange(e.target.value)}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
        <button
        onClick={onRecordToggle}
        style={recordButtonStyle}
        disabled={patientName.trim().length === 0 || isProcessing}
        title={
          patientName.trim().length === 0 
            ? "Ingrese el nombre del paciente para grabar" 
            : isProcessing 
              ? "Procesando audio..." 
              : ""
        }
      >
        <div style={micIconStyle}>
          {isProcessing ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" fill="none" />
            </svg>
          ) : isRecording ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12H22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" 
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.35 9.64999V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.64999" 
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        
        {isProcessing ? (
          <span>Procesando audio...</span>
        ) : isRecording ? (
          <>
            <RecordingIndicator />
            <span>Grabando ({formatTime(recordingTime)})</span>
          </>
        ) : (
          <span>Iniciar Grabación</span>
        )}
      </button>

      {isRecording && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px dashed #ef4444',
          fontSize: '0.85rem',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 16.99V17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>La sesión se está grabando. Presione el botón para detener la grabación.</span>
        </div>
      )}
    </div>
  );
};

// Componente para el indicador de grabación (pulso)
const RecordingIndicator = () => (
  <div style={{
    position: 'relative',
    width: '12px',
    height: '12px',
  }}>
    <div style={{
      position: 'absolute',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#e11d48',
      animation: 'pulsate 1.5s ease-out infinite',
    }} />
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes pulsate {
        0% {
          transform: scale(0.8);
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `}} />
  </div>
);

export default RecordingControls;