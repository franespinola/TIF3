import React, { useEffect } from 'react';

/**
 * Componente que muestra un tooltip avanzado para formas de diagrama de flujo.
 * Se muestra al hacer hover sobre una forma de diagrama de flujo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Si se debe mostrar el tooltip
 * @param {Object} props.data - Datos del nodo (tipo, texto, descripción)
 * @param {string} props.nodeType - Tipo de nodo de diagrama de flujo
 * @param {JSX.Element} props.preview - Vista previa del nodo (opcional)
 * @param {Object} props.debugInfo - Información de depuración (opcional)
 * @returns {JSX.Element} - Tooltip renderizado
 */
const FlowchartTooltip = ({ show, data, nodeType, preview, debugInfo = {} }) => {
  // Log de renderización
  useEffect(() => {
    console.log('🔵 TOOLTIP: Renderizando FlowchartTooltip', { show, nodeType, data, debugInfo });
    
    // Al montar
    if (show) {
      console.log('🔵 TOOLTIP: Montado y visible');
    }
    
    // Limpiar al desmontar
    return () => {
      console.log('🔵 TOOLTIP: Desmontando FlowchartTooltip');
    };
  }, [show, nodeType, data, debugInfo]);
  
  if (!show) {
    console.log('🟡 TOOLTIP: No se muestra (show=false)');
    return null;
  }
  
  // Configuración según el tipo de forma
  const shapeInfo = {
    oval: {
      bg: 'rgba(231, 245, 255, 0.98)',
      border: '2px solid #047857',
      titleBg: '#047857',
      title: 'Óvalo (Inicio/Fin)',
      description: 'Indica el inicio o fin de un proceso o diagrama de flujo.'
    },
    diamond: {
      bg: 'rgba(254, 242, 232, 0.98)',
      border: '2px solid #d97706',
      titleBg: '#d97706',
      title: 'Rombo (Decisión)',
      description: 'Representa una decisión o punto de bifurcación en el flujo.'
    },
    roundedRect: {
      bg: 'rgba(239, 246, 255, 0.98)',
      border: '2px solid #2563eb',
      titleBg: '#2563eb',
      title: 'Rectángulo Redondeado',
      description: 'Representa un proceso o una acción en el flujo.'
    },
    hexagon: {
      bg: 'rgba(254, 226, 226, 0.98)',
      border: '2px solid #dc2626',
      titleBg: '#dc2626',
      title: 'Hexágono',
      description: 'Indica una preparación o inicialización en el flujo.'
    },
    cylinder: {
      bg: 'rgba(236, 254, 255, 0.98)',
      border: '2px solid #0891b2',
      titleBg: '#0891b2',
      title: 'Cilindro (Base de Datos)',
      description: 'Representa almacenamiento de datos o una base de datos.'
    },
    document: {
      bg: 'rgba(254, 249, 195, 0.98)',
      border: '2px solid #ca8a04',
      titleBg: '#ca8a04',
      title: 'Documento',
      description: 'Representa un documento o reporte generado en el proceso.'
    },
    // Configuración por defecto
    default: {
      bg: 'rgba(243, 244, 246, 0.98)',
      border: '2px solid #4b5563',
      titleBg: '#4b5563',
      title: 'Forma de diagrama',
      description: 'Elemento utilizado en diagramas de flujo.'
    }
  };

  // Usar la configuración para el tipo o la configuración predeterminada
  const info = shapeInfo[nodeType?.toLowerCase()] || shapeInfo.default;
  
  // Datos a mostrar
  const title = info.title;
  const description = data?.description || info.description;
  const nodeText = data?.text || '';
  
  // Variable para controlar si mostrar la información de depuración
  const showDebugInfo = true; // En producción, cambiar a false
  
  // Generar timestamp para debugging
  const timestamp = new Date().toLocaleTimeString();
  
  return (
    <div 
      className="flowchart-tooltip"
      style={{
        display: 'block', // Aseguramos que sea visible con display block
        width: '250px',
        backgroundColor: info.bg,
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Hacemos la sombra más visible
        border: info.border,
        zIndex: 10000, // Un z-index muy alto para que aparezca sobre todo
        overflow: 'visible', // Aseguramos que la flecha sea visible
        opacity: 1, // Forzamos opacidad completa
        transition: 'none', // Desactivamos todas las transiciones para debugging
      }}
    >
      {/* Título del tooltip con el nombre de la forma */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: info.titleBg,
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px 8px 0 0', // Bordes redondeados solo arriba
      }}>
        <span>{title}</span>
        {/* Badge con el tipo de nodo */}
        <span style={{
          fontSize: '10px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          padding: '2px 5px',
          borderRadius: '10px',
        }}>{nodeType}</span>
      </div>
      
      {/* Contenido del tooltip */}
      <div style={{ padding: '10px 12px' }}>
        {/* Vista previa más grande del nodo (opcional) */}
        {preview && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '8px 0 12px',
            transform: 'scale(1.2)',
            transformOrigin: 'center center',
          }}>
            {preview}
          </div>
        )}
        
        {/* Descripción de la forma */}
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.5',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          {description}
        </div>
        
        {/* Texto del nodo si existe */}
        {nodeText && (
          <div style={{ 
            fontSize: '12px', 
            padding: '6px', 
            backgroundColor: 'rgba(255,255,255,0.5)', 
            borderRadius: '4px',
            border: '1px solid rgba(0,0,0,0.1)',
            marginTop: '6px'
          }}>
            <strong>Texto:</strong> {nodeText}
          </div>
        )}
        
        {/* Sección de depuración */}
        {showDebugInfo && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            fontSize: '11px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            border: '1px dashed rgba(0,0,0,0.2)',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            <div>ID: <span style={{ color: '#2563eb' }}>tooltip-{Math.random().toString(36).substring(7)}</span></div>
            <div>Tipo: <span style={{ color: '#059669' }}>{nodeType}</span></div>
            <div>Portal montado: <span style={{ color: debugInfo.isPortalMounted ? '#059669' : '#dc2626' }}>{debugInfo.isPortalMounted ? '✓' : '✗'}</span></div>
            <div>Posición: <span style={{ color: '#6366f1' }}>({debugInfo.position?.left}, {debugInfo.position?.top})</span></div>
            <div>Renderizado: <span style={{ color: '#059669' }}>{timestamp}</span></div>
          </div>
        )}
      </div>
      
      {/* Flecha izquierda del tooltip */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '-8px',
        width: '8px',
        height: '16px',
        overflow: 'visible', // Cambiado de 'hidden' a 'visible'
        pointerEvents: 'none', // Evitar que la flecha interfiera con eventos
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '-8px',
          width: '16px',
          height: '16px',
          transform: 'rotate(45deg)',
          backgroundColor: info.bg,
          border: info.border,
          borderTop: 'none',
          borderRight: 'none',
        }} />
      </div>
      
      {/* Indicador de debug */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        width: '10px',
        height: '10px',
        backgroundColor: 'red', // Punto rojo para verificar que el tooltip se está renderizando
        borderRadius: '50%',
        border: '1px solid white',
      }} />
    </div>
  );
};

export default FlowchartTooltip;