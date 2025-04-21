// src/hooks/useResizable.js
import { useState, useCallback } from 'react';
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

  const handleRef = useCallback(
    (el) => {
      if (!el) return;
      let lastUpdate = 0;
      const FRAME_INTERVAL = 1000 / 60; // 60 fps

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

      el.addEventListener('mousedown', onMouseDown);
      return () => el.removeEventListener('mousedown', onMouseDown);
    },
    [nodeId, minWidth, minHeight, setNodes]
  );

  return [size, handleRef, isResizing, setSize];
}
