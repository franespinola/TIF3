import React, { useEffect } from 'react';
import { Position } from 'reactflow';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useNodeEditor from '../../../hooks/useNodeEditor';
import useResizable from '../../../hooks/useResizable';

export default function RoundedRectNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 60;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const cornerRadius = data?.cornerRadius || 10;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  
  // Usar el hook de edición de nodos
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel, {
        ...data,
        label: newLabel
      });
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
    60, // min width
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

  // Limitar el radio de las esquinas basado en el tamaño del nodo
  const radius = Math.min(
    cornerRadius,
    Math.min(size.width, size.height) / 4
  );

  return (
    <BaseNodeComponent 
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="roundedRect"
      nodeStyles={{
        width: size.width,
        height: size.height,
        position: "relative"
      }}
    >
      <div style={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Definir el SVG del rectángulo redondeado para ocupar todo el espacio disponible */}
        <svg 
          width={size.width} 
          height={size.height} 
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={size.width - strokeWidth}
            height={size.height - strokeWidth}
            rx={radius}
            ry={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
          />
        </svg>
        
        {/* Componente modularizado para la entrada de texto */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '10px'
        }}>
          <NodeTextInput
            value={label}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            labelStyle={{
              color: textColor,
              fontSize: fontSize,
              textAlign: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </div>
      </div>
    </BaseNodeComponent>
  );
}