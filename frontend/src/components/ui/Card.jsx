import React from 'react';

/**
 * Componente Card que sirve como contenedor para información estructurada
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Componente CardHeader para encabezados de Card
 */
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Componente CardTitle para títulos de Card
 */
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={`font-medium text-lg text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

/**
 * Componente CardContent para el contenido principal de Card
 */
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Componente CardFooter para pies de Card
 */
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-3 border-t border-gray-200 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};