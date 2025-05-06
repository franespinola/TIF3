import React, { useCallback, useState } from 'react';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

export default function DiamondNode({ data, id, selected }) {
  // Estado para el texto y dimensiones
  const [dimensions, setDimensions] = useState({
    width: data?.width || 100,
    height: data?.height || 80,
  });
  const [text, setText] = useState(data?.text || data?.label || "");

  // Valores por defecto si no se proporcionan en data
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;

  // Callback para manejar el cambio de tamaño
  const onResize = useCallback((newDimensions) => {
    setDimensions(newDimensions);
    // Guardar el tamaño en data para que persista
    if (data) {
      data.width = newDimensions.width;
      data.height = newDimensions.height;
    }
  }, [data]);

  // Callback para manejar el cambio de texto
  const onTextChange = useCallback((newText) => {
    setText(newText);
    if (data) {
      data.text = newText;
      data.label = newText; // Sincronizar ambas propiedades para consistencia

      // Si hay una función onEdit, llamarla
      if (data.onEdit) {
        data.onEdit(id, newText, {
          ...data,
          text: newText,
          label: newText
        });
      }
    }
  }, [data, id]);

  const width = dimensions.width;
  const height = dimensions.height;

  // Vista previa para el tooltip
  const tooltipPreview = (
    <svg width={width * 0.7} height={height * 0.7} style={{ display: 'block' }}>
      <polygon
        points={`${width*0.7/2},0 ${width*0.7},${height*0.7/2} ${width*0.7/2},${height*0.7} 0,${height*0.7/2}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    </svg>
  );

  return (
    <FlowchartNodeBase
      id={id}
      selected={selected}
      nodeType="diamond"
      data={data}
      tooltipPreview={tooltipPreview}
      description="Representa una decisión en un diagrama de flujo."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={width}
        height={height}
        minWidth={60}
        minHeight={40}
        selected={selected}
      >
        <svg 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block' }}
        >
          <polygon
            points={`${width/2},0 ${width},${height/2} ${width/2},${height} 0,${height/2}`}
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
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <EditableText
            text={text}
            onChange={onTextChange}
            color={textColor}
            fontSize={fontSize}
            bold={data?.bold}
            italic={data?.italic}
            underline={data?.underline}
            textAlign={data?.textAlign || 'center'}
            size={Math.min(width * 0.7, height * 0.7)}
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
}