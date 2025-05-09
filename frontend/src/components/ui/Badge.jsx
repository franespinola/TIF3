import React from 'react';

/**
 * Componente Badge para mostrar etiquetas de estado o categorías
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido del badge
 * @param {string} props.variant - Variante de estilo: 'default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'
 * @param {string} props.className - Clases adicionales para el badge
 */
export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  // Mapear variantes a clases de Tailwind
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-teal-100 text-teal-800'
  };

  // Clase base para todos los badges
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  // Combinar todas las clases
  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${className}
  `;

  return (
    <span 
      className={badgeClasses}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;