import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function ArrowNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 60;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1;
  const direction = data?.direction || 'right'; // right, left, up, down
  
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
    60, // min width
    30  // min height
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

  // Función para generar el path de la flecha según la dirección
  const getArrowPath = () => {
    const w = size.width;
    const h = size.height;
    const arrowHeadSize = Math.min(w, h) * 0.25; // Tamaño de la cabeza de la flecha
    
    switch (direction) {
      case 'left':
        return {
          body: `M${w},${h/2} L${arrowHeadSize},${h/2}`,
          head: `M${arrowHeadSize*1.5},${h/4} L${strokeWidth},${h/2} L${arrowHeadSize*1.5},${3*h/4} Z`
        };
      case 'up':
        return {
          body: `M${w/2},${h} L${w/2},${arrowHeadSize}`,
          head: `M${w/4},${arrowHeadSize*1.5} L${w/2},${strokeWidth} L${3*w/4},${arrowHeadSize*1.5} Z`
        };
      case 'down':
        return {
          body: `M${w/2},${strokeWidth} L${w/2},${h-arrowHeadSize}`,
          head: `M${w/4},${h-arrowHeadSize*1.5} L${w/2},${h-strokeWidth} L${3*w/4},${h-arrowHeadSize*1.5} Z`
        };
      case 'right':
      default:
        return {
          body: `M${strokeWidth},${h/2} L${w-arrowHeadSize},${h/2}`,
          head: `M${w-arrowHeadSize*1.5},${h/4} L${w-strokeWidth},${h/2} L${w-arrowHeadSize*1.5},${3*h/4} Z`
        };
    }
  };

  const arrowPaths = getArrowPath();

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
        {/* Cuerpo de la flecha */}
        <path
          d={arrowPaths.body}
          stroke={stroke}
          strokeWidth={strokeWidth * 2}
          fill="none"
        />
        
        {/* Cabeza de la flecha */}
        <path
          d={arrowPaths.head}
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
          pointerEvents: 'none',
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
            padding: '0 10px',
            textAlign: 'center',
            pointerEvents: 'all'
          }}
        />
      </div>
    </BaseNodeComponent>
  );
}