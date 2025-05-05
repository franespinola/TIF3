import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function BracketNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 60;
  const height = data?.height || 100;
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 2;
  const type = data?.type || 'curly'; // curly, square, parenthesis
  
  // Usar el hook de edición de nodos si es necesario
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel);
    }
  };
  
  const { isEditing } = useNodeEditor(data?.label || "", onSave);

  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width, height },
    30, // min width
    50  // min height
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

  // Función para generar el path según el tipo de paréntesis/llave
  const getBracketPath = () => {
    const w = size.width;
    const h = size.height;
    const strokeOffset = strokeWidth / 2;
    
    switch(type) {
      case 'curly': // Llaves { }
        // Para llave de apertura {
        if (data?.variant === 'opening') {
          return `
            M${w - strokeOffset},${strokeOffset}
            Q${w/2},${strokeOffset} ${w/2},${h/4}
            T${strokeOffset},${h/2}
            T${w/2},${3*h/4}
            T${w - strokeOffset},${h - strokeOffset}
          `;
        } 
        // Para llave de cierre }
        else {
          return `
            M${strokeOffset},${strokeOffset}
            Q${w/2},${strokeOffset} ${w/2},${h/4}
            T${w - strokeOffset},${h/2}
            T${w/2},${3*h/4}
            T${strokeOffset},${h - strokeOffset}
          `;
        }
        
      case 'square': // Corchetes [ ]
        // Para corchete de apertura [
        if (data?.variant === 'opening') {
          return `
            M${w - strokeOffset},${strokeOffset}
            H${w/3}
            V${h - strokeOffset}
            H${w - strokeOffset}
          `;
        } 
        // Para corchete de cierre ]
        else {
          return `
            M${strokeOffset},${strokeOffset}
            H${2*w/3}
            V${h - strokeOffset}
            H${strokeOffset}
          `;
        }
        
      case 'parenthesis': // Paréntesis ( )
        // Para paréntesis de apertura (
        if (data?.variant === 'opening') {
          return `
            M${w - strokeOffset},${strokeOffset}
            Q${w/3},${h/4} ${w/3},${h/2}
            Q${w/3},${3*h/4} ${w - strokeOffset},${h - strokeOffset}
          `;
        } 
        // Para paréntesis de cierre )
        else {
          return `
            M${strokeOffset},${strokeOffset}
            Q${2*w/3},${h/4} ${2*w/3},${h/2}
            Q${2*w/3},${3*h/4} ${strokeOffset},${h - strokeOffset}
          `;
        }
        
      default:
        // Valor por defecto: llave de apertura
        return `
          M${w - strokeOffset},${strokeOffset}
          Q${w/2},${strokeOffset} ${w/2},${h/4}
          T${strokeOffset},${h/2}
          T${w/2},${3*h/4}
          T${w - strokeOffset},${h - strokeOffset}
        `;
    }
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
    >
      <svg width={size.width} height={size.height} style={{ overflow: 'visible' }}>
        <path
          d={getBracketPath()}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseNodeComponent>
  );
}