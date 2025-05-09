import React from 'react';

/**
 * Componente Button con diferentes variantes y tamaños
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del botón
 * @param {string} props.variant - Variante de estilo: 'primary', 'secondary', 'outline', 'ghost', 'danger'
 * @param {string} props.size - Tamaño del botón: 'sm', 'md', 'lg'
 * @param {ReactNode} props.icon - Icono opcional para mostrar junto al texto
 * @param {string} props.className - Clases adicionales para el botón
 * @param {boolean} props.isLoading - Indica si el botón está en estado de carga
 * @param {boolean} props.disabled - Indica si el botón está deshabilitado
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null,
  className = '',
  isLoading = false,
  disabled = false,
  ...props 
}) => {
  // Mapear variantes a clases de Tailwind
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  // Mapear tamaños a clases de Tailwind
  const sizeClasses = {
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5'
  };

  // Clase base para todos los botones
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none';
  
  // Combinar todas las clases
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
    </button>
  );
};

export default Button;