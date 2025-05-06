import React, { useEffect } from 'react';
import useResizable from '../../hooks/useResizable';

/**
 * Component that adds resize functionality to ReactFlow nodes
 * Utiliza el hook useResizable para la lógica de redimensionamiento
 * y agrega características adicionales como mantener la relación de aspecto
 */
const ResizableNode = ({
  id,
  children,
  width,
  height, 
  minWidth = 30,
  minHeight = 30,
  onResize,
  selected = false,
  forceAspectRatio = false,
  style = {},
}) => {
  // Usar el hook useResizable para la lógica básica de redimensionamiento
  const [size, handleRef, isResizing, setSize] = useResizable(
    id,
    { width, height },
    minWidth,
    minHeight
  );
  
  // Style for resize handle
  const resizeHandleStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: selected ? '#1a192b' : 'transparent',
    border: selected ? '1px solid white' : 'none',
    right: '-6px',
    bottom: '-6px',
    cursor: 'nwse-resize',
    zIndex: 10,
  };
  
  // Efecto para manejar cambios de dimensiones y mantener la relación de aspecto si es necesario
  useEffect(() => {
    if (isResizing && forceAspectRatio) {
      const aspectRatio = width / height;
      const newSize = { ...size };
      
      // Determinar qué dimensión ajustar basado en cuál cambió más
      const widthChanged = Math.abs(size.width - width) > Math.abs(size.height - height);
      
      if (widthChanged) {
        newSize.height = newSize.width / aspectRatio;
      } else {
        newSize.width = newSize.height * aspectRatio;
      }
      
      setSize(newSize);
    }
    
    // Llamar a la callback onResize si existe
    if (onResize && (size.width !== width || size.height !== height)) {
      onResize(size);
    }
  }, [size, isResizing, forceAspectRatio, width, height, onResize, setSize]);
  
  return (
    <div
      style={{
        position: 'relative',
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...style
      }}
    >
      {children}
      {selected && (
        <div
          className="resize-handle"
          style={resizeHandleStyle}
          ref={handleRef}
        />
      )}
    </div>
  );
};

export default ResizableNode;