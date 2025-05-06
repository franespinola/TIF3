import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function DocumentNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  const waviness = data?.waviness || 10; // Qué tan ondulada es la parte inferior
  
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
    60, // min width
    70  // min height
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

  // Generar el path para la forma de documento
  const getDocumentPath = () => {
    const w = size.width;
    const h = size.height;
    const bottomY = h - waviness;
    
    return `
      M${strokeWidth},${strokeWidth}
      H${w - strokeWidth}
      V${bottomY}
      C${w * 0.75},${bottomY + waviness} ${w * 0.25},${bottomY - waviness} ${strokeWidth},${bottomY}
      Z
    `;
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="document"
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
          <path
            d={getDocumentPath()}
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
            height: `${(size.height - waviness) * 0.9}px`, // Ajustamos la altura para que el texto no invada la parte ondulada
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
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