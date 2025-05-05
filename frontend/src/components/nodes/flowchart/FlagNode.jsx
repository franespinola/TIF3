import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function FlagNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 60;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1;
  
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

  // Calcular puntos para la forma de bandera
  const getFlagPoints = () => {
    const w = size.width;
    const h = size.height;
    const poleWidth = Math.min(h * 0.1, 10); // Ancho del mástil

    return {
      pole: `M${poleWidth/2},${strokeWidth} V${h-strokeWidth}`,
      flag: `
        M${poleWidth},${strokeWidth}
        H${w-strokeWidth}
        L${w-poleWidth},${h/2}
        L${w-strokeWidth},${h-strokeWidth}
        H${poleWidth}
        Z
      `
    };
  };

  const flagPaths = getFlagPoints();

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
        {/* Bandera */}
        <path
          d={flagPaths.flag}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
        
        {/* Mástil */}
        <path
          d={flagPaths.pole}
          stroke={stroke}
          strokeWidth={strokeWidth * 2}
          fill="none"
        />
      </svg>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '90%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          marginLeft: '10%'
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