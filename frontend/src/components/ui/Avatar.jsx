import React from 'react';

/**
 * Componente Avatar que muestra las iniciales del nombre en un círculo con color.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre completo para mostrar iniciales
 * @param {string} props.size - Tamaño del avatar: "xs", "sm", "md", "lg", "xl"
 * @param {string} props.className - Clases adicionales para el avatar
 * @returns {JSX.Element} - Componente Avatar renderizado
 */
export const Avatar = ({ name = '', size = 'md', className = '', ...props }) => {
  // Extraer las iniciales del nombre (hasta 2 caracteres)
  const getInitials = (name) => {
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '';
    
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Generar un color consistente basado en el nombre
  const getColorClass = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    // Simple hash para nombre
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  // Mapear tamaño a clases de CSS
  const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-sm',
    'lg': 'w-12 h-12 text-base',
    'xl': 'w-16 h-16 text-lg'
  };

  const initials = getInitials(name);
  const colorClass = getColorClass(name);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      className={`${colorClass} ${sizeClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar;