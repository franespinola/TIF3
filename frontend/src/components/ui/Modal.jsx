import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * Componente Modal reutilizable
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {string} props.title - Título del modal (opcional)
 * @param {string} props.size - Tamaño del modal: 'sm', 'md', 'lg', 'xl' (opcional)
 */
const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  const modalRef = useRef(null);

  // Función para cerrar el modal al hacer clic fuera de él
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Función para cerrar el modal al presionar ESC
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Añadir eventos al abrir el modal y limpiarlos al cerrar
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll en el body
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; // Restaurar scroll
    };
  }, [isOpen, onClose]);

  // No renderizar nada si el modal está cerrado
  if (!isOpen) return null;

  // Configurar clases según el tamaño
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Renderizar el modal en un portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} overflow-hidden`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className={!title ? 'pt-5' : ''}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal; 