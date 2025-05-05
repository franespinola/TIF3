import React, { useState } from 'react';
import NodeHandles from '../NodeHandles';
import ResizeHandle from '../ResizeHandle';
import NodeTooltip from '../NodeTooltip';

/**
 * @typedef {Object} BaseNodeComponentProps
 * @property {React.ReactNode} children - Contenido del nodo
 * @property {boolean} selected - Si el nodo está seleccionado
 * @property {React.RefObject} resizeHandleRef - Referencia para el control de redimensionamiento
 * @property {boolean} [isConnectable=true] - Si el nodo permite conexiones
 * @property {Object} [nodeStyles={}] - Estilos adicionales para el nodo
 * @property {boolean} [showResizeHandle=true] - Si se muestra el control de redimensionamiento
 * @property {Object} [data={}] - Datos del nodo para el tooltip
 * @property {string} [nodeType='default'] - Tipo de nodo
 * @property {boolean} [showTooltip=true] - Si se debe mostrar el tooltip al pasar el cursor
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
  data = {},
  nodeType = 'default',
  showTooltip = true,
}) {
  // Estado para controlar cuándo mostrar el tooltip
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  // Delay para mostrar/ocultar el tooltip para evitar parpadeos
  const tooltipTimerRef = React.useRef(null);
  
  const handleMouseEnter = () => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = setTimeout(() => setIsTooltipVisible(true), 300);
  };
  
  const handleMouseLeave = () => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = setTimeout(() => setIsTooltipVisible(false), 100);
  };
  
  // Limpiar temporizador al desmontar
  React.useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [tooltipTimerRef]);
  
  // Estilos base mejorados con sombras y transiciones
  const baseStyle = {
    position: 'relative',
    boxShadow: selected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    ...nodeStyles
  };
  
  // Añadir indicador de información adicional si hay datos
  const hasAdditionalInfo = data?.profession || data?.info || data?.age;
  
  return (
    <div 
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`node-component ${selected ? 'node-selected' : ''}`}
    >
      {children}
      
      {/* Indicador visual mejorado para información adicional */}
      {hasAdditionalInfo && showTooltip && (
        <div style={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: nodeType === 'masculino' ? '#2563eb' : 
                          nodeType === 'femenino' ? '#db2777' : 
                          nodeType === 'paciente' ? '#047857' : '#3b82f6',
          border: '2px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <span style={{ 
            color: 'white', 
            fontSize: '9px', 
            fontWeight: 'bold',
            lineHeight: 1 
          }}>i</span>
        </div>
      )}
      
      {/* Tooltip con información detallada */}
      {showTooltip && <NodeTooltip show={isTooltipVisible} data={data} nodeType={nodeType} />}
      
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