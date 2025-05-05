import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function TriangleNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1;
  const orientation = data?.orientation || 'down'; // down, up, left, right
  
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

  // Calcular puntos del triángulo según la orientación
  const getTrianglePoints = () => {
    const w = size.width;
    const h = size.height;
    
    switch(orientation) {
      case 'up':
        return [
          [w / 2, 0],       // top
          [w, h],           // bottom-right
          [0, h]            // bottom-left
        ].map(point => point.join(',')).join(' ');
        
      case 'right':
        return [
          [w, h / 2],       // right-middle
          [0, h],           // bottom-left
          [0, 0]            // top-left
        ].map(point => point.join(',')).join(' ');
        
      case 'left':
        return [
          [0, h / 2],       // left-middle
          [w, 0],           // top-right
          [w, h]            // bottom-right
        ].map(point => point.join(',')).join(' ');
        
      case 'down':
      default:
        return [
          [0, 0],           // top-left
          [w, 0],           // top-right
          [w / 2, h]        // bottom-middle
        ].map(point => point.join(',')).join(' ');
    }
  };

  // Ajustar posicionamiento del texto según la orientación
  const getTextPosition = () => {
    switch(orientation) {
      case 'up':
        return { paddingTop: '50%', paddingBottom: '10%' };
      case 'down':
        return { paddingTop: '10%', paddingBottom: '50%' };
      default:
        return {};
    }
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
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
          pointerEvents: 'none',
          ...getTextPosition()
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