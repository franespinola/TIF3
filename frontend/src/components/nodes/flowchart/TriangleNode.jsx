import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function TriangleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  const direction = data?.direction || 'down'; // down, up, left, right
  
  // Usar el hook de edición de nodos
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel, {
        ...data,
        label: newLabel,
        text: newLabel // Para mantener consistencia
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
  } = useNodeEditor(data?.label || data?.text || "", onSave);

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

  // Calcular los puntos del triángulo según la dirección
  const getTrianglePoints = () => {
    const w = size.width;
    const h = size.height;
    
    switch (direction) {
      case 'up':
        return `${w/2},${strokeWidth} ${w-strokeWidth},${h-strokeWidth} ${strokeWidth},${h-strokeWidth}`;
      case 'left':
        return `${strokeWidth},${h/2} ${w-strokeWidth},${strokeWidth} ${w-strokeWidth},${h-strokeWidth}`;
      case 'right':
        return `${w-strokeWidth},${h/2} ${strokeWidth},${strokeWidth} ${strokeWidth},${h-strokeWidth}`;
      case 'down':
      default:
        return `${w/2},${h-strokeWidth} ${w-strokeWidth},${strokeWidth} ${strokeWidth},${strokeWidth}`;
    }
  };

  // Ajustar la posición del texto según la dirección del triángulo
  const getTextPosition = () => {
    switch (direction) {
      case 'up':
        return { paddingTop: '0', paddingBottom: '30%' };
      case 'left':
        return { paddingLeft: '0', paddingRight: '30%' };
      case 'right':
        return { paddingLeft: '30%', paddingRight: '0' };
      case 'down':
      default:
        return { paddingTop: '30%', paddingBottom: '0' };
    }
  };

  const textPosition = getTextPosition();

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="triangle"
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
        <svg width={size.width} height={size.height} style={{ position: 'absolute', top: 0, left: 0 }}>
          <polygon
            points={getTrianglePoints()}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
          />
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
            padding: '10px',
            ...textPosition,
            zIndex: 1
          }}
        >
          {/* Componente para la entrada de texto */}
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