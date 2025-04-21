import { useState, useEffect } from 'react';
import useResizable from './useResizable';

/**
 * Hook personalizado para gestionar el tamaño de los nodos con sincronización
 * entre el estado local y los datos de props.
 * 
 * @param {string} id - ID del nodo
 * @param {object} data - Datos del nodo que pueden contener dimensiones (width, height)
 * @param {object} defaultSize - Tamaño por defecto {width, height}
 * @param {number} minWidth - Ancho mínimo permitido
 * @param {number} minHeight - Alto mínimo permitido
 * @returns {array} - [size, resizeHandleRef, isResizing, updateSize]
 */
function useNodeSize(id, data, defaultSize, minWidth = 30, minHeight = 30) {
  // Inicializar con tamaños de data o valores por defecto
  const initialWidth = data?.width || defaultSize.width;
  const initialHeight = data?.height || defaultSize.height;
  
  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width: initialWidth, height: initialHeight },
    minWidth,
    minHeight
  );
  
  // Función para actualizar el tamaño desde el exterior
  const updateSize = (newWidth, newHeight) => {
    if (!isResizing) {
      setSize({
        width: newWidth,
        height: newHeight
      });
    }
  };
  
  // Sincronizar con cambios externos en data
  useEffect(() => {
    if (data?.width !== undefined && data?.height !== undefined) {
      // Solo actualizar si no estamos en medio de una operación de redimensionamiento
      if (!isResizing) {
        const newWidth = data.width;
        const newHeight = data.height;
        
        // Actualizar solo si hay cambios reales
        if (newWidth !== size.width || newHeight !== size.height) {
          setSize(prev => ({ 
            width: newWidth !== prev.width ? newWidth : prev.width,
            height: newHeight !== prev.height ? newHeight : prev.height
          }));
        }
      }
    }
  }, [data?.width, data?.height, isResizing, setSize, size.width, size.height]);
  
  return [size, resizeHandleRef, isResizing, updateSize];
}

export default useNodeSize;