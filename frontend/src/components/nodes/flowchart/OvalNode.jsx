import React, { useCallback, useState } from 'react';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

export default function OvalNode({ data, id, selected }) {
  // Estado para el texto y dimensiones
  const [dimensions, setDimensions] = useState({
    width: data?.width || 100,
    height: data?.height || 50,
  });
  const [text, setText] = useState(data?.text || data?.label || "");

  // Valores por defecto si no se proporcionan en data
  const stroke = data?.stroke || '#000000';
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1;
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
      <ellipse
        cx={width * 0.7 / 2}
        cy={height * 0.7 / 2}
        rx={width * 0.7 / 2 - strokeWidth}
        ry={height * 0.7 / 2 - strokeWidth}
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
      nodeType="oval"
      data={data}
      tooltipPreview={tooltipPreview}
      description="Representa inicio o fin en un diagrama de flujo."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={width}
        height={height}
        minWidth={60}
        minHeight={30}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2 - strokeWidth}
            ry={height / 2 - strokeWidth}
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
            size={Math.min(width * 0.8, height * 0.8)}
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
}