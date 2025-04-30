import React from 'react';
import { Handle } from 'reactflow';

/**
 * Componente que representa un nodo familiar en forma de círculo con aristas.
 * Diseño minimalista y elegante para representar la unión familiar en genogramas.
 * Optimizado para el uso profesional en el ámbito médico.
 */
const FamilyNode = ({ data }) => {
  // Configuración de tamaño y colores
  const size = data.size || 32;
  const color = data.color || '#2563eb'; // Azul royal
  const secondaryColor = data.secondaryColor || '#f8fafc'; // Blanco hueso
  
  return (
    <div 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.2s ease',
      }}
      title="Punto de unión familiar"
    >
      {/* Círculo principal */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${secondaryColor} 0%, ${secondaryColor} 60%, ${color}80 100%)`,
        boxShadow: `0 0 0 2px ${color}, 0 0 8px rgba(37, 99, 235, 0.35)`,
        zIndex: 1,
      }}/>
      
      {/* Líneas de aristas internas */}
      <div style={{
        position: 'absolute',
        width: '70%',
        height: '70%',
        zIndex: 2,
      }}>
        {/* Línea vertical */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '0%',
          width: '1px',
          height: '100%',
          backgroundColor: `${color}90`,
          transform: 'translateX(-50%)',
        }}/>
        
        {/* Línea horizontal */}
        <div style={{
          position: 'absolute',
          left: '0%',
          top: '50%',
          width: '100%',
          height: '1px',
          backgroundColor: `${color}90`,
          transform: 'translateY(-50%)',
        }}/>
      </div>
      
      {/* Punto central */}
      <div style={{
        width: `${size/5}px`,
        height: `${size/5}px`,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: `0 0 4px ${color}`,
        zIndex: 3,
      }}/>
      
      {/* Handles para conectar con padres (arriba) */}
      <Handle
        type="target"
        position="top"
        id="t"
        style={{ 
          top: '-2px',
          background: color, 
          width: '7px', 
          height: '7px',
          border: `1px solid white`,
          zIndex: 10,
        }}
      />
      
      {/* Handles para conectar con hijos (abajo) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ 
          bottom: '-2px',
          background: color, 
          width: '7px', 
          height: '7px',
          border: `1px solid white`,
          zIndex: 10,
        }}
      />
      
      {/* Handles laterales */}
      <Handle
        type="source"
        position="right"
        id="r"
        style={{ 
          right: '-2px',
          background: color, 
          width: '7px', 
          height: '7px',
          border: `1px solid white`,
          zIndex: 10,
        }}
      />
      <Handle
        type="source"
        position="left"
        id="l"
        style={{ 
          left: '-2px',
          background: color, 
          width: '7px', 
          height: '7px',
          border: `1px solid white`,
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default FamilyNode;