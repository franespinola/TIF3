import React, { useState, useEffect } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from './NodeTextInput';
import useResizable from '../../hooks/useResizable';
import useNodeEditor from '../../hooks/useNodeEditor';

export default function CircleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const initialRadius = data?.radius || 50;
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
  
  const [radius, setRadius] = useState(initialRadius);

  // Usar el hook de redimensionamiento adaptado para círculos
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id,
    { width: initialRadius * 2, height: initialRadius * 2 },
    40, // min diameter
    40  // min diameter
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

  // Actualizar el tamaño cuando cambia el radio en data
  useEffect(() => {
    if (data?.radius !== undefined && !isResizing) {
      const newRadius = data.radius;
      if (newRadius !== radius) {
        setRadius(newRadius);
        const diameter = newRadius * 2;
        // Actualizar el estado de tamaño para mantener sincronizado
        if (size.width !== diameter || size.height !== diameter) {
          // Actualizar dimensiones basadas en el nuevo radio
          const newSize = { width: diameter, height: diameter };
          // Usar el setSize de useResizable
          setSize(newSize);
        }
      }
    }
  }, [data?.radius, isResizing, radius, setSize, size.width, size.height]);

  // Calcular el tamaño del SVG basado en el radio actual
  const svgSize = radius * 2;

  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={svgSize} height={svgSize}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth/2}
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