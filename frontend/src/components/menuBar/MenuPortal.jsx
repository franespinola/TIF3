import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * MenuPortal - Renderiza children en una posición específica del viewport.
 * @param {ReactNode} children
 * @param {boolean} isOpen
 * @param {{ top: number, left: number }} position
 * @param {Function} onClickOutside - Callback opcional que se invoca cuando se hace clic fuera del menú
 * @param {number} closeDelay - Retraso en ms antes de cerrar el menú al salir (default: 300)
 */
const MenuPortal = ({ children, isOpen, position, onClickOutside, closeDelay = 300 }) => {
  const [portalContainer, setPortalContainer] = useState(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [mouseInsideMenu, setMouseInsideMenu] = useState(false);

  // Registramos este MenuPortal en un registro global de menús activos
  useEffect(() => {
    if (isOpen) {
      // Crear o obtener el registro global de menús activos
      if (!window._activeMenus) {
        window._activeMenus = new Set();
      }
      
      // Añadir una referencia a este menú y su callback de cierre
      const menuInfo = {
        ref: menuRef,
        onClose: onClickOutside
      };
      window._activeMenus.add(menuInfo);

      return () => {
        // Limpiamos la referencia cuando el componente se desmonta
        if (window._activeMenus) {
          window._activeMenus.delete(menuInfo);
        }
      };
    }
  }, [isOpen, onClickOutside]);

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
      // Solo cerramos si el clic fue fuera del menú
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

  // Al salir del menú, iniciamos un temporizador para cerrarlo
  const handleMouseLeave = () => {
    setMouseInsideMenu(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    
    closeTimerRef.current = setTimeout(() => {
      if (!mouseInsideMenu && typeof onClickOutside === 'function') {
        onClickOutside();
      }
    }, closeDelay);
  };

  // Al entrar al menú, cancelamos cualquier temporizador de cierre
  const handleMouseEnter = () => {
    setMouseInsideMenu(true);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Limpieza del temporizador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!isOpen || !portalContainer) return null;

  const dropdownStyle = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 10000,
  };

  return ReactDOM.createPortal(
    <div 
      ref={menuRef} 
      style={dropdownStyle} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>,
    portalContainer
  );
};

export default MenuPortal;