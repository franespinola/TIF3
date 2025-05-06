import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextArea from '../NodeTextArea';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function CommentNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 120;
  const height = data?.height || 80;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  
  // Usar el hook de edición de nodos
  const onSave = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText, {
        ...data, 
        text: newText
      });
    }
  };
  
  const {
    isEditing, 
    value: text, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown 
  } = useNodeEditor(data?.text || "Comentario", onSave);

  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width, height },
    80, // min width
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

  // Crear path para la nube de comentario
  const createCloudPath = (width, height) => {
    const w = width;
    const h = height;
    
    // Factores de curvatura
    const curve = Math.min(w, h) / 4;
    
    return `
      M${curve},${h/4}
      Q0,${h/4} 0,${h/2}
      Q0,${3*h/4} ${curve},${3*h/4}
      Q${curve*2},${h} ${w/2},${h}
      Q${w-curve*2},${h} ${w-curve},${3*h/4}
      Q${w},${3*h/4} ${w},${h/2}
      Q${w},${h/4} ${w-curve},${h/4}
      Q${w-curve*1.5},0 ${w/2},0
      Q${curve*1.5},0 ${curve},${h/4}
    `;
  };

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="comment"
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
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <path
            d={createCloudPath(size.width, size.height)}
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
            padding: '12px',
          }}
        >
          {/* Componente para la entrada de texto */}
          <NodeTextArea
            value={text}
            isEditing={isEditing}
            onDoubleClick={handleDoubleClick}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            fontSize={fontSize}
            color={textColor}
          />
        </div>
      </div>
    </BaseNodeComponent>
  );
}