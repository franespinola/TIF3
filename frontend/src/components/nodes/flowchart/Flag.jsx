import React, { useCallback, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

const Flag = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 100,
    height: data.height || 80,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || data.label || 'Bandera');

  // Obtener los estilos aplicables con valores por defecto consistentes
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;

  const onResize = useCallback((newDimensions) => {
    setDimensions(newDimensions);
    // Guardar el tamaño en data para que persista
    if (data) {
      data.width = newDimensions.width;
      data.height = newDimensions.height;
    }
    updateNodeInternals(id);
  }, [data, id, updateNodeInternals]);

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
  
  // Crear el path para la bandera
  const poleWidth = Math.min(width * 0.1, 10); // Ancho del mástil
  const flagPath = {
    pole: `M${poleWidth/2},1 V${height-1}`,
    flag: `M${poleWidth},${strokeWidth} H${width-strokeWidth} L${width-poleWidth},${height/2} L${width-strokeWidth},${height-strokeWidth} H${poleWidth} Z`
  };

  // Vista previa para el tooltip
  const tooltipPreview = (
    <svg width={width * 0.7} height={height * 0.7} style={{ display: 'block' }}>
      <path
        d={`M${poleWidth*0.7},${strokeWidth} H${width*0.7-strokeWidth} L${width*0.7-poleWidth*0.7},${height*0.7/2} L${width*0.7-strokeWidth},${height*0.7-strokeWidth} H${poleWidth*0.7} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d={`M${poleWidth*0.7/2},1 V${height*0.7-1}`}
        stroke={stroke}
        strokeWidth={strokeWidth * 2}
        fill="none"
      />
    </svg>
  );

  return (
    <FlowchartNodeBase
      id={id}
      selected={selected}
      nodeType="flag"
      data={data}
      tooltipPreview={tooltipPreview}
      onResize={onResize}
      dimensions={dimensions}
      minWidth={60}
      minHeight={60}
      description="Representa una bandera o indicador en el proceso."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={60}
        minHeight={60}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <path
            d={flagPath.flag}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={flagPath.pole}
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
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            paddingLeft: poleWidth + 10, // Añadir padding para evitar texto sobre el mástil
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
};

export default Flag;