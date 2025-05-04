import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * Componente para renderizar tooltips en un portal fuera de la jerarquía del DOM
 * para evitar que sean cortados por contenedores con overflow hidden
 */
const TooltipPortal = ({ id, text, targetRect, visible }) => {
  const [portalContainer, setPortalContainer] = useState(null);

  // Crear un contenedor para el portal cuando el componente se monta
  useEffect(() => {
    // Buscar si ya existe un contenedor para los tooltips
    let container = document.getElementById('tooltip-portal-container');
    
    if (!container) {
      // Si no existe, crearlo y añadirlo al body
      container = document.createElement('div');
      container.id = 'tooltip-portal-container';
      container.style.position = 'fixed';
      container.style.zIndex = '10000'; // z-index alto para estar sobre todo
      container.style.pointerEvents = 'none'; // para que no interfiera con eventos
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Limpiar el contenedor cuando el componente se desmonte
    return () => {
      if (document.body.contains(container) && !container.childElementCount) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Si no hay contenedor o el tooltip no es visible, no renderizar nada
  if (!portalContainer || !visible || !targetRect) return null;

  // Posicionamiento del tooltip a la derecha del elemento target
  const tooltipStyle = {
    position: 'fixed',
    left: targetRect.right + 10,
    top: targetRect.top + targetRect.height / 2,
    transform: 'translateY(-50%)',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    zIndex: '10001',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };

  // Estilo para la flecha del tooltip
  const arrowStyle = {
    position: 'absolute',
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%) rotate(45deg)',
    width: '12px',
    height: '12px',
    backgroundColor: '#1e293b',
    zIndex: '-1',
  };

  // Usar createPortal para renderizar el tooltip fuera de la jerarquía del DOM
  return ReactDOM.createPortal(
    <div id={`tooltip-portal-${id}`} style={tooltipStyle}>
      {text}
      <div style={arrowStyle}></div>
    </div>,
    portalContainer
  );
};

export default TooltipPortal;