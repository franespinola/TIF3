import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * MenuPortal - Renderiza children en una posición específica del viewport.
 * @param {ReactNode} children
 * @param {boolean} isOpen
 * @param {{ top: number, left: number }} position
 */
const MenuPortal = ({ children, isOpen, position }) => {
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    if (isOpen) {
      let container = document.getElementById('menu-portal-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'menu-portal-container';
        document.body.appendChild(container);
      }
      setPortalContainer(container);
    }
  }, [isOpen]);

  if (!isOpen || !portalContainer) return null;

  const dropdownStyle = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 10000,
  };

  return ReactDOM.createPortal(
    <div style={dropdownStyle}>{children}</div>,
    portalContainer
  );
};

export default MenuPortal;