import { useState, useEffect } from 'react';
import useNodeSize from './useNodeSize';

/**
 * Hook especializado para gestionar nodos cuadrados
 * Mantiene las proporciones cuadradas mientras se redimensiona
 * 
 * @param {string} id - ID del nodo
 * @param {number} defaultSize - Tamaño por defecto si no se proporciona en data
 * @param {number} minSize - Tamaño mínimo permitido
 * @returns {array} - [size, resizeHandleRef, isResizing]
 */
function useSquareNode(id, defaultSize = 50, minSize = 20) {
  const [size, setSize] = useState(defaultSize);
  
  // Utilizar useNodeSize para gestionar el tamaño
  const [nodeSize, resizeHandleRef, isResizing, updateSize] = useNodeSize(
    id,
    { width: defaultSize, height: defaultSize },
    { width: defaultSize, height: defaultSize },
    minSize,
    minSize
  );

  // Asegurar que el nodo sea siempre cuadrado
  useEffect(() => {
    if (isResizing) {
      // Calcular el tamaño como el máximo entre ancho y alto
      // para mantener el cuadrado proporcional
      const maxDimension = Math.max(nodeSize.width, nodeSize.height);
      if (maxDimension !== size) {
        setSize(maxDimension);
        // Mantener dimensiones cuadradas
        updateSize(maxDimension, maxDimension);
      }
    }
  }, [nodeSize, size, isResizing, updateSize]);

  return [size, resizeHandleRef, isResizing];
}

export default useSquareNode;