import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function CylinderNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 100;
  const height = data?.height || 80;
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
    70, // min width
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

  // Calcular dimensiones del cilindro
  const ellipseHeight = Math.min(size.height * 0.15, 15); // Altura de la elipse superior/inferior
  const cylinderHeight = size.height - ellipseHeight; // Altura del cuerpo del cilindro

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height}>
        {/* Elipse superior */}
        <ellipse
          cx={size.width / 2}
          cy={ellipseHeight / 2}
          rx={(size.width - strokeWidth) / 2}
          ry={ellipseHeight / 2 - strokeWidth / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        
        {/* Cuerpo del cilindro */}
        <rect
          x={strokeWidth / 2}
          y={ellipseHeight / 2}
          width={size.width - strokeWidth}
          height={cylinderHeight}
          fill={fill}
          stroke="none"
        />
        
        {/* Líneas laterales del cilindro */}
        <line
          x1={strokeWidth / 2}
          y1={ellipseHeight / 2}
          x2={strokeWidth / 2}
          y2={size.height - ellipseHeight / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <line
          x1={size.width - strokeWidth / 2}
          y1={ellipseHeight / 2}
          x2={size.width - strokeWidth / 2}
          y2={size.height - ellipseHeight / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        
        {/* Elipse inferior */}
        <ellipse
          cx={size.width / 2}
          cy={size.height - ellipseHeight / 2}
          rx={(size.width - strokeWidth) / 2}
          ry={ellipseHeight / 2 - strokeWidth / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
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
            pointerEvents: 'all',
            marginTop: ellipseHeight / 2 // Ajuste para centrar mejor el texto
          }}
        />
      </div>
    </BaseNodeComponent>
  );
}