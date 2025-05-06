import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function HexagonNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 60;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
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
    80, // min width
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

  // Calcular puntos del hexágono
  const getHexagonPoints = () => {
    const w = size.width;
    const h = size.height;
    const cornerWidth = Math.min(w * 0.2, h * 0.4); // Ajustar esquinas según proporciones
    
    return [
      [cornerWidth, 0],              // top-left
      [w - cornerWidth, 0],          // top-right
      [w, h / 2],                    // right
      [w - cornerWidth, h],          // bottom-right
      [cornerWidth, h],              // bottom-left
      [0, h / 2]                     // left
    ].map(point => point.join(',')).join(' ');
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="hexagon"
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
        <svg 
          width={size.width} 
          height={size.height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <polygon
            points={getHexagonPoints()}
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
            padding: '0 25px',
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
              alignItems: 'center',
              pointerEvents: 'all'
            }}
          />
        </div>
      </div>
    </BaseNodeComponent>
  );
}