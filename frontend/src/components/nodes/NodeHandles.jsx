import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Componente reutilizable para crear handles consistentes en todos los tipos de nodos
 */
function NodeHandles({ isConnectable = true }) {
  // Estilo común para los handles para mayor tamaño y área de selección
  const handleStyle = {
    background: "#555",
    width: 8,
    height: 8,
    border: "2px solid #fff",
    borderRadius: "50%",
    zIndex: 5
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        style={{ ...handleStyle, top: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ ...handleStyle, bottom: -6 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="l"
        style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="r"
        style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default NodeHandles;