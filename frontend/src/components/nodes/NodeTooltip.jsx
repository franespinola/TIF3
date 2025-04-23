import React from 'react';

/**
 * Componente que muestra un tooltip con información detallada sobre un nodo.
 * Se muestra al pasar el cursor sobre el nodo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Si se debe mostrar el tooltip
 * @param {Object} props.data - Datos del nodo (nombre, edad, profesión, info)
 * @param {string} props.nodeType - Tipo de nodo (masculino, femenino, etc.)
 * @returns {JSX.Element} - Tooltip renderizado
 */
const NodeTooltip = ({ show, data, nodeType = 'default' }) => {
  if (!show) return null;
  
  // Configuración de color según el tipo de nodo
  const colorScheme = {
    masculino: { bg: 'rgba(219, 234, 254, 0.95)', border: '2px solid #2563eb', titleBg: '#2563eb' },
    femenino: { bg: 'rgba(252, 231, 243, 0.95)', border: '2px solid #db2777', titleBg: '#db2777' },
    paciente: { bg: 'rgba(220, 252, 231, 0.95)', border: '2px solid #047857', titleBg: '#047857' },
    fallecido: { bg: 'rgba(229, 231, 235, 0.95)', border: '2px solid #4b5563', titleBg: '#4b5563' },
    embarazo: { bg: 'rgba(254, 240, 215, 0.95)', border: '2px solid #d97706', titleBg: '#d97706' },
    default: { bg: 'rgba(243, 244, 246, 0.95)', border: '2px solid #4b5563', titleBg: '#4b5563' }
  };
  
  // Usar la configuración para el tipo o la configuración predeterminada
  const colors = colorScheme[nodeType.toLowerCase()] || colorScheme.default;
  
  // Datos a mostrar
  const name = data?.name || data?.label || 'Nombre';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  
  // Determinar si hay información adicional para mostrar un icono de info
  const hasAdditionalInfo = profession || info;
  
  return (
    <div style={{
      position: 'absolute',
      top: '-80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px',
      maxWidth: '250px',
      backgroundColor: colors.bg,
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
      border: colors.border,
      zIndex: 10,
      overflow: 'hidden',
      opacity: 0,
      animation: 'fadeIn 0.2s forwards',
    }}>
      {/* Título del tooltip con el nombre */}
      <div style={{
        padding: '6px 10px',
        backgroundColor: colors.titleBg,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{name}</span>
        {age && <span>{age} años</span>}
      </div>
      
      {/* Contenido del tooltip */}
      <div style={{ padding: '8px 12px' }}>
        {profession && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '6px', 
            fontSize: '13px',
            gap: '5px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span><strong>Profesión:</strong> {profession}</span>
          </div>
        )}
        
        {info && (
          <div style={{ fontSize: '12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '5px', 
              marginBottom: '2px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginTop: '2px'}}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <strong>Información:</strong>
            </div>
            <div style={{ 
              marginLeft: '20px', 
              lineHeight: '1.3',
              color: '#4b5563'
            }}>
              {info}
            </div>
          </div>
        )}
        
        {!hasAdditionalInfo && (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            fontSize: '12px',
            fontStyle: 'italic',
            padding: '4px 0'
          }}>
            No hay información adicional
          </div>
        )}
      </div>
      
      {/* Flecha del tooltip */}
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '16px',
        height: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '0',
          width: '16px',
          height: '16px',
          transform: 'rotate(45deg)',
          backgroundColor: colors.bg,
          border: colors.border,
          borderTop: 'none',
          borderLeft: 'none',
        }} />
      </div>
      
      {/* Estilos internos para animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default NodeTooltip;