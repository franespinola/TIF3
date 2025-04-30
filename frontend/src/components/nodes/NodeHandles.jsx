import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Componente reutilizable para crear handles consistentes en todos los tipos de nodos
 */
function NodeHandles({ isConnectable = true }) {
  // Estilo mejorado para los handles con mejor visibilidad y efecto hover
  const handleStyle = {
    background: "#6b7280",
    width: 8,
    height: 8,
    border: "2px solid #fff",
    borderRadius: "50%",
    zIndex: 5,
    transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  };

  // Clase CSS para añadir el efecto hover sin modificar directamente el componente Handle
  const handleClassName = "node-handle";

  return (
    <>
      {/* Estilos para los handles en hover */}
      <style>
        {`
          .node-handle:hover {
            transform: scale(1.3) !important;
            background-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
            cursor: crosshair !important;
          }
        `}
      </style>
      
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        className={handleClassName}
        style={{ ...handleStyle, top: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b" 
        className={handleClassName}
        style={{ ...handleStyle, bottom: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="l"
        className={handleClassName}
        style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="r"
        className={handleClassName}
        style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default NodeHandles;