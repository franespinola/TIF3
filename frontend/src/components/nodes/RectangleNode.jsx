import React, { useEffect } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from './NodeTextInput';
import useResizable from '../../hooks/useResizable';
import useNodeEditor from '../../hooks/useNodeEditor';

export default function RectangleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 2;
  
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
    30, // min width
    30  // min height
  );

  // Actualizar el tamaño cuando cambian los datos
  useEffect(() => {
    if (data?.width !== undefined && data?.height !== undefined) {
      // Solo actualizar si no estamos en medio de una operación de redimensionamiento
      if (!isResizing) {
        const newWidth = data.width;
        const newHeight = data.height;
        // Use setSize desde useResizable para actualizar el estado local
        if (newWidth !== size.width || newHeight !== size.height) {
          setSize(prev => ({ 
            width: newWidth !== prev.width ? newWidth : prev.width,
            height: newHeight !== prev.height ? newHeight : prev.height
          }));
        }
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
        <rect
          x="0"
          y="0"
          width={size.width}
          height={size.height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
      </svg>
      
      {/* Componente modularizado para la entrada de texto */}
      <NodeTextInput
        value={label}
        isEditing={isEditing}
        onDoubleClick={handleDoubleClick}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </BaseNodeComponent>
  );
}