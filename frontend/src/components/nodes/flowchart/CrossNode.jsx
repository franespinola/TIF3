import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';

export default function CrossNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 60;
  const height = data?.height || 60;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 2;
  
  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width, height },
    40, // min width
    40  // min height
  );

  // Actualizar el tamaño cuando cambian los datos
  useEffect(() => {
    if (
      data?.width !== undefined &&
      data?.height !== undefined &&
      !isResizing
    ) {
      if (data.width !== size.width || data.height !== size.height) {
        setSize({
          width: data.width,
          height: data.height,
        });
      }
    }
  }, [data?.width, data?.height, isResizing, setSize, size.width, size.height]);

  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
        {/* Círculo de fondo */}
        <circle
          cx={size.width / 2}
          cy={size.height / 2}
          r={size.width / 2 - strokeWidth}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
        
        {/* Línea vertical */}
        <line
          x1={size.width / 2}
          y1={size.height * 0.2}
          x2={size.width / 2}
          y2={size.height * 0.8}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        
        {/* Línea horizontal */}
        <line
          x1={size.width * 0.2}
          y1={size.height / 2}
          x2={size.width * 0.8}
          y2={size.height / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    </BaseNodeComponent>
  );
}