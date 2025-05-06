import React, { useEffect } from 'react';
import BaseNodeComponent from '../BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function BracketNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const width = data?.width || 60;
  const height = data?.height || 100;
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'transparent';
  const strokeWidth = data?.strokeWidth || 1.5;
  const type = data?.type || 'curly'; // curly, square, parenthesis
  const variant = data?.variant || 'opening'; // opening, closing
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  
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
        if (variant === 'opening') {
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
        if (variant === 'opening') {
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
        if (variant === 'opening') {
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

  // Calcular la posición del texto según el tipo de paréntesis/llave
  const getTextPosition = () => {
    // Para llaves y paréntesis, el texto va en el lado opuesto
    // Para corchetes, el texto va en el centro
    if (type === 'square') {
      return {
        left: '0',
        width: '100%',
        textAlign: 'center',
        padding: '0'
      };
    } else if ((type === 'curly' || type === 'parenthesis') && variant === 'opening') {
      return {
        left: '50%',
        width: '150%',
        textAlign: 'left',
        padding: '0 0 0 10px'
      };
    } else {
      return {
        left: '-100%',
        width: '150%',
        textAlign: 'right',
        padding: '0 10px 0 0'
      };
    }
  };

  const textPosition = getTextPosition();

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      data={data}
      nodeType="bracket"
      nodeStyles={{
        width: size.width,
        height: size.height,
        position: "relative"
      }}
    >
      <div style={{ 
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <svg 
          width={size.width} 
          height={size.height}
          style={{ overflow: 'visible' }}
        >
          <path
            d={getBracketPath()}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Contenedor para el texto */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: textPosition.left,
            width: textPosition.width,
            height: '100%',
            display: 'flex',
            justifyContent: textPosition.textAlign === 'center' ? 'center' : (textPosition.textAlign === 'left' ? 'flex-start' : 'flex-end'),
            alignItems: 'center',
            padding: textPosition.padding
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
              textAlign: textPosition.textAlign,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pointerEvents: 'all'
            }}
          />
        </div>
      </div>
    </BaseNodeComponent>
  );
}