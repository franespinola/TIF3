import React from 'react';
import { Handle } from 'reactflow';

/**
 * Componente que representa un nodo familiar, que actúa como punto de conexión
 * entre parejas y sus hijos. Este nodo es pequeño y discreto, sirviendo 
 * principalmente como punto de organización para el layout.
 */
const FamilyNode = ({ data }) => {
  const width = data.width || 20;
  const height = data.height || 20;
  
  return (
    <div style={{ 
      width: `${width}px`, 
      height: `${height}px`, 
      borderRadius: '50%',
      backgroundColor: 'rgba(150, 150, 150, 0.1)',  // Casi invisible
      border: '1px dashed rgba(150, 150, 150, 0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Handles para conectar con los padres (arriba) */}
      <Handle
        type="target"
        position="top"
        id="t"
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      {/* Handles para conectar con hijos (abajo) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      {/* Handles laterales */}
      <Handle
        type="source"
        position="right"
        id="r"
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      <Handle
        type="source"
        position="left"
        id="l"
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
    </div>
  );
};

export default FamilyNode;