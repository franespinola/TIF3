import { useState, useEffect } from 'react';
import useNodeSize from './useNodeSize';

/**
 * Hook especializado para gestionar nodos circulares
 * Maneja la relación entre radio y dimensiones del nodo
 * 
 * @param {string} id - ID del nodo
 * @param {object} data - Datos del nodo que pueden contener radio
 * @param {number} defaultRadius - Radio por defecto si no se proporciona en data
 * @param {number} minRadius - Radio mínimo permitido
 * @returns {array} - [radius, size, resizeHandleRef, isResizing]
 */
function useCircleNode(id, data, defaultRadius = 50, minRadius = 20) {
  const [radius, setRadius] = useState(data?.radius || defaultRadius);
  
  // Configurar tamaño inicial basado en el radio
  const initialDiameter = radius * 2;
  const minDiameter = minRadius * 2;
  
  // Utilizar useNodeSize para gestionar el tamaño
  const [size, resizeHandleRef, isResizing, updateSize] = useNodeSize(
    id,
    { width: initialDiameter, height: initialDiameter },
    { width: initialDiameter, height: initialDiameter },
    minDiameter,
    minDiameter
  );

  // Actualizar el radio cuando cambia el tamaño
  useEffect(() => {
    // Calcular el nuevo radio basado en el menor de width/height
    // para mantener el círculo proporcional
    const newRadius = Math.min(size.width, size.height) / 2;
    if (newRadius !== radius) {
      setRadius(newRadius);
    }
  }, [size, radius]);

  // Sincronizar con cambios de radio en data
  useEffect(() => {
    if (data?.radius !== undefined && !isResizing) {
      const newRadius = data.radius;
      if (newRadius !== radius) {
        setRadius(newRadius);
        const diameter = newRadius * 2;
        // Actualizar dimensiones basadas en el nuevo radio
        updateSize(diameter, diameter);
      }
    }
  }, [data?.radius, isResizing, radius, updateSize]);
  
  return [radius, size, resizeHandleRef, isResizing];
}

export default useCircleNode;