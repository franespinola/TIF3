// src/hooks/useTriangleNode.js
import { useState, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function useTriangleNode(
  nodeId,
  initialSize = { width: 40, height: 40 },
  minSize = 20
) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const { setNodes } = useReactFlow();

  const handleRef = useCallback(
    (el) => {
      if (!el) return;
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
          // throttle a ~60fps
          if (now - lastUpdate < FRAME_INTERVAL) return;
          lastUpdate = now;

          // For triangles, we want to maintain aspect ratio
          // and use the largest dimension for both width and height
          const xDiff = e.clientX - startX;
          const yDiff = e.clientY - startY;
          
          // Use the largest change to determine new size
          const maxDiff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
          const direction = Math.max(xDiff, yDiff) > 0 ? 1 : -1;
          
          const newSize = Math.max(minSize, startW + (maxDiff * direction));
          
          // defer a next tick para no bloquear ResizeObserver
          setTimeout(() => {
            setSize({ width: newSize, height: newSize });
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId
                  ? { 
                      ...n, 
                      data: { ...n.data, size: newSize },
                      width: newSize,
                      height: newSize
                    }
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

      el.addEventListener('mousedown', onMouseDown);
      return () => el.removeEventListener('mousedown', onMouseDown);
    },
    [nodeId, minSize, setNodes, size]
  );

  return [size, handleRef, isResizing, setSize];
}