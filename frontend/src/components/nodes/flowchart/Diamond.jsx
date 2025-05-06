import React, { useCallback, useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

const Diamond = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 140,
    height: data.height || 80,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Decisión');

  const onResize = useCallback((newDimensions) => {
    setDimensions(newDimensions);
    data.width = newDimensions.width;
    data.height = newDimensions.height;
    updateNodeInternals(id);
  }, [data, id, updateNodeInternals]);

  const onTextChange = useCallback((newText) => {
    setText(newText);
    data.text = newText;
  }, [data]);

  const width = dimensions.width;
  const height = dimensions.height;

  // Vista previa para el tooltip
  const tooltipPreview = (
    <svg width={width * 0.7} height={height * 0.7} style={{ display: 'block' }}>
      <polygon
        points={`${width * 0.35},0 ${width * 0.7},${height * 0.35} ${width * 0.35},${height * 0.7} 0,${height * 0.35}`}
        fill={data.fill || 'white'}
        stroke={data.stroke || '#d97706'}
        strokeWidth={data.strokeWidth || 1.5}
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
      onResize={onResize}
      dimensions={dimensions}
      minWidth={70}
      minHeight={70}
      description="Representa una decisión o punto de bifurcación en el flujo."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={70}
        minHeight={70}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <polygon
            points={`${width/2},0 ${width},${height/2} ${width/2},${height} 0,${height/2}`}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#d97706'}
            strokeWidth={data.strokeWidth || 1.5}
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
            padding: '20px', // Mayor padding para evitar que el texto toque los bordes
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <EditableText
            text={text}
            onChange={onTextChange}
            color={data.textColor || '#000000'}
            fontSize={data.fontSize || 12}
            bold={data.bold}
            italic={data.italic}
            underline={data.underline}
            textAlign={data.textAlign || 'center'}
            size={Math.min(width, height) * 0.6} // Reducimos el tamaño para que no se salga
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
};

export default Diamond;