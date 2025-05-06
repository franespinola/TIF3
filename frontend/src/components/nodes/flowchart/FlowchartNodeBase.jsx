import React, { useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import FlowchartTooltipPortal from './FlowchartTooltipPortal';

/**
 * Componente base para nodos de diagrama de flujo que incluye:
 * - Tooltip al hacer hover
 * - Handles para conexión en las 4 direcciones
 * - Estructura básica con contenido personalizable
 */
const FlowchartNodeBase = ({ 
  id, 
  selected, 
  nodeType, 
  data,
  children,
  tooltipPreview,
  description
}) => {
  // Referencia al nodo para posicionamiento del tooltip
  const nodeRef = useRef(null);
  
  // Estado para controlar si el tooltip es visible
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Estilo común para los handles
  const handleStyle = {
    background: '#555',
    width: 8,
    height: 8,
    border: '2px solid #fff',
    borderRadius: '50%',
    zIndex: 5
  };

  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <div 
      ref={nodeRef}
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* El contenido del nodo (pasado como children) */}
      {children}
      
      {/* Handles para conexión con nombres específicos */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ ...handleStyle, top: -4 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ ...handleStyle, bottom: -4 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ ...handleStyle, left: -4 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ ...handleStyle, right: -4 }}
        isConnectable={isConnectable}
      />

      {/* Tooltip portal */}
      <FlowchartTooltipPortal
        show={showTooltip && !selected} // No mostrar tooltip cuando el nodo está seleccionado
        data={{
          text: data?.text,
          description: description || data?.description
        }}
        nodeType={nodeType}
        preview={tooltipPreview}
        targetRef={nodeRef}
      />
    </div>
  );
};

export default FlowchartNodeBase;