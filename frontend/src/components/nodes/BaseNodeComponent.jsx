// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\nodes\BaseNodeComponent.jsx
import React, { useState } from 'react';
import NodeHandles from './NodeHandles';
import ResizeHandle from './ResizeHandle';
import NodeTooltip from './NodeTooltip';

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
 * @property {React.ReactNode} [labelContent=null] - Contenido de la etiqueta que se mostrará por fuera del nodo
 */

/**
 * Componente base para nodos que proporciona funcionalidad común
 * como handles y control de redimensionamiento.
 * 
 * @param {BaseNodeComponentProps} props - Propiedades del componente 
 * @returns {JSX.Element} - Componente renderizado
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
  labelContent = null,
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

  // Lógica para solo permitir selección en el borde
  const childrenWithPointerEvents = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        style: {
          ...child.props.style,
          pointerEvents: 'none' // Asegura que todos los hijos no respondan a clics para selección
        }
      });
    }
    return child;
  });
  
  // Estructura principal del nodo visual
  return (
    <>
      {/* El nodo visual principal - será el único elemento considerado para selección */}
      <div 
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`node-component ${selected ? 'node-selected' : ''}`}
        data-nodrag="true" // Evita que el arrastrar sobre el nodo mueva el canvas
      >
        {/* Contenido del nodo */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          {childrenWithPointerEvents}
        </div>
        
        {/* Indicador visual para información adicional */}
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
            pointerEvents: 'none',
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

      {/* Contenido de etiqueta separado completamente del nodo para no afectar la selección */}
      {labelContent && (
        <div
          style={{
            position: 'absolute',
            top: '100%', // Posicionado debajo del nodo
            left: '50%',
            transform: 'translateX(-50%)', // Centrado
            marginTop: '6px',
            pointerEvents: 'none', // No responde a eventos de mouse
            userSelect: 'none', // No se puede seleccionar el texto
            zIndex: -1, // Por detrás del nodo para evitar interferir con la selección
          }}
          className="node-label"
          data-nodrag="true"
        >
          {labelContent}
        </div>
      )}
    </>
  );
}

export default BaseNodeComponent;