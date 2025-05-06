// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\nodes\flowchart\CircleNode.jsx
import React, { useState, useCallback, useEffect } from 'react';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

export default function CircleNode({ data, id, selected }) {
  // Estado para el texto y dimensiones
  const initialRadius = data?.radius || 50;
  const [radius, setRadius] = useState(initialRadius);
  const [text, setText] = useState(data?.text || data?.label || "");

  // Valores por defecto si no se proporcionan en data
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;

  // Callback para manejar el cambio de tamaño
  const onResize = useCallback((newDimensions) => {
    // En un círculo, queremos asegurarnos de que el ancho y alto sean iguales
    const minDimension = Math.min(newDimensions.width, newDimensions.height);
    const newSize = {
      width: minDimension,
      height: minDimension
    };
    
    // Calcular el radio basado en el tamaño
    const newRadius = minDimension / 2;
    setRadius(newRadius);
    
    // Guardar el tamaño en data para que persista
    if (data) {
      data.radius = newRadius;
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

  // Vista previa para el tooltip
  const tooltipPreview = (
    <svg width={radius * 1.4} height={radius * 1.4} style={{ display: 'block' }}>
      <circle
        cx={radius * 0.7}
        cy={radius * 0.7}
        r={radius * 0.7 - strokeWidth/2}
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
      nodeType="circle"
      data={data}
      tooltipPreview={tooltipPreview}
      description="Representa un punto de inicio, fin o conexión en un diagrama de flujo."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={radius * 2}
        height={radius * 2}
        minWidth={40}
        minHeight={40}
        selected={selected}
        forceAspectRatio={1} // Forzar relación de aspecto 1:1 para mantener forma circular
      >
        <svg 
          width={radius * 2} 
          height={radius * 2}
          style={{ display: 'block' }}
        >
          <circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth/2}
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
            padding: radius * 0.3,
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
            size={radius * 1.4}
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
}