import React from 'react';
import NodeHandles from './NodeHandles';
import ResizeHandle from './ResizeHandle';

/**
 * @typedef {Object} BaseNodeComponentProps
 * @property {React.ReactNode} children - Contenido del nodo
 * @property {boolean} selected - Si el nodo está seleccionado
 * @property {React.RefObject} resizeHandleRef - Referencia para el control de redimensionamiento
 * @property {boolean} [isConnectable=true] - Si el nodo permite conexiones
 * @property {Object} [nodeStyles={}] - Estilos adicionales para el nodo
 * @property {boolean} [showResizeHandle=true] - Si se muestra el control de redimensionamiento
 */

/**
 * Componente base para nodos que proporciona funcionalidad común
 * como handles y control de redimensionamiento. Puede ser utilizado como
 * base para todos los tipos de nodos, proporcionando una estructura consistente.
 * 
 * @param {BaseNodeComponentProps} props - Propiedades del componente 
 * @returns {JSX.Element} - Componente renderizado
 * 
 * @example
 * // Uso básico
 * <BaseNodeComponent selected={selected} resizeHandleRef={resizeHandleRef}>
 *   <svg width={100} height={80}>
 *     <rect x="0" y="0" width={100} height={80} fill="blue" />
 *   </svg>
 * </BaseNodeComponent>
 * 
 * @example
 * // Con estilos personalizados
 * <BaseNodeComponent 
 *   selected={selected} 
 *   resizeHandleRef={resizeHandleRef}
 *   nodeStyles={{ background: '#f0f0f0', padding: 5 }}
 * >
 *   <p>Contenido del nodo</p>
 * </BaseNodeComponent>
 */
function BaseNodeComponent({
  children,
  selected,
  resizeHandleRef,
  isConnectable = true,
  nodeStyles = {},
  showResizeHandle = true,
}) {
  const baseStyle = {
    position: 'relative',
    ...nodeStyles
  };
  
  return (
    <div style={baseStyle}>
      {children}
      
      {/* Handles reutilizables para conexiones */}
      <NodeHandles isConnectable={isConnectable} />
      
      {/* Control de redimensionamiento condicional */}
      {selected && showResizeHandle && (
        <ResizeHandle resizeHandleRef={resizeHandleRef} />
      )}
    </div>
  );
}

export default BaseNodeComponent;