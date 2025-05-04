import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * MenuPortal - Renderiza children en una posición específica del viewport.
 * @param {ReactNode} children
 * @param {boolean} isOpen
 * @param {{ top: number, left: number }} position
 * @param {Function} onClickOutside - Callback opcional que se invoca cuando se hace clic fuera del menú
 */
const MenuPortal = ({ children, isOpen, position, onClickOutside }) => {
  const [portalContainer, setPortalContainer] = useState(null);
  const menuRef = useRef(null);

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

  // Efecto para manejar clicks fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic no fue dentro del menú
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        // Si se proporcionó un callback onClickOutside, llamarlo
        if (typeof onClickOutside === 'function') {
          onClickOutside();
        }
      }
    };

    // Agregamos el event listener solo cuando el menú está abierto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    // Limpieza: removemos el event listener cuando el componente se desmonta
    // o cuando el menú se cierra
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClickOutside]);

  if (!isOpen || !portalContainer) return null;

  const dropdownStyle = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 10000,
  };

  return ReactDOM.createPortal(
    <div style={dropdownStyle} ref={menuRef}>{children}</div>,
    portalContainer
  );
};

export default MenuPortal;