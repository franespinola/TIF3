// src/hooks/useResizable.js
import { useState, useCallback, useEffect } from 'react';
import { useReactFlow } from 'reactflow';

export default function useResizable(
  nodeId,
  initialSize = { width: 100, height: 80 },
  minWidth = 30,
  minHeight = 30
) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const { setNodes } = useReactFlow();
  const [resizeElement, setResizeElement] = useState(null);

  // Separar el callback ref para evitar devolver una función de limpieza
  const handleRef = useCallback((el) => {
    if (el !== resizeElement) {
      setResizeElement(el);
    }
  }, [resizeElement]);

  // Manejar los eventos en un efecto separado
  useEffect(() => {
    if (!resizeElement) return;
    
    let lastUpdate = 0;
    const FRAME_INTERVAL = 1000 / 60; // 60 fps

    const onMouseDown = (e) => {
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = size.width;
      const startH = size.height;

      const onMouseMove = (e) => {
        const now = Date.now();
        // throttle a ~30fps (cada 33ms)
        if (now - lastUpdate < FRAME_INTERVAL) return;
        lastUpdate = now;

        const newW = Math.max(minWidth, startW + e.clientX - startX);
        const newH = Math.max(minHeight, startH + e.clientY - startY);

        // defer a next tick para no bloquear ResizeObserver
        setTimeout(() => {
          setSize({ width: newW, height: newH });
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, size: newW }, width: newW, height: newH }
                : n
            )
          );
        }, 0);
      };

      const onMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    resizeElement.addEventListener('mousedown', onMouseDown);
    
    // Función de limpieza que se ejecutará cuando el componente se desmonte
    return () => {
      if (resizeElement) {
        resizeElement.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, [resizeElement, nodeId, size, minWidth, minHeight, setNodes]);

  return [size, handleRef, isResizing, setSize];
}
