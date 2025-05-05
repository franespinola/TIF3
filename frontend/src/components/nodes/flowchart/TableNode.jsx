import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function TableNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 80;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1;
  const rows = data?.rows || 2;
  const columns = data?.columns || 3;
  
  // Usar el hook de edición de nodos
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel);
    }
  };
  
  const {
    isEditing, 
    value: label, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown 
  } = useNodeEditor(data?.label || "", onSave);

  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width, height },
    100, // min width
    60  // min height
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

  // Generar líneas para la tabla
  const generateTableLines = () => {
    const lines = [];
    const w = size.width;
    const h = size.height;
    
    // Líneas horizontales
    for (let i = 1; i < rows; i++) {
      const y = (h / rows) * i;
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={w}
          y2={y}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
    
    // Líneas verticales
    for (let i = 1; i < columns; i++) {
      const x = (w / columns) * i;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={h}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }
    
    return lines;
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size.width - strokeWidth}
          height={size.height - strokeWidth}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
        {generateTableLines()}
      </svg>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* El texto solo se muestra si es una tabla de una sola celda o si se está editando */}
        {(rows === 1 && columns === 1) && (
          <NodeTextInput
            value={label}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            labelStyle={{
              padding: '0 10px',
              textAlign: 'center',
              pointerEvents: 'all'
            }}
          />
        )}
      </div>
    </BaseNodeComponent>
  );
}