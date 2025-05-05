import React, { useCallback, useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

const Hexagon = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 120,
    height: data.height || 60,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Preparación');

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
  
  // Calculate hexagon points
  const sideLength = height / 2; // H/2 for the horizontal sides
  const points = [
    [sideLength, 0], // top left
    [width - sideLength, 0], // top right
    [width, height / 2], // right
    [width - sideLength, height], // bottom right
    [sideLength, height], // bottom left
    [0, height / 2], // left
  ].map(point => point.join(',')).join(' ');

  // Vista previa para el tooltip
  const tooltipPreview = (
    <svg width={width * 0.7} height={height * 0.7} style={{ display: 'block' }}>
      <polygon
        points={[
          [sideLength * 0.7, 0], 
          [width * 0.7 - sideLength * 0.7, 0], 
          [width * 0.7, height * 0.7 / 2], 
          [width * 0.7 - sideLength * 0.7, height * 0.7], 
          [sideLength * 0.7, height * 0.7], 
          [0, height * 0.7 / 2]
        ].map(point => point.join(',')).join(' ')}
        fill={data.fill || 'white'}
        stroke={data.stroke || '#dc2626'}
        strokeWidth={data.strokeWidth || 1.5}
      />
    </svg>
  );

  return (
    <FlowchartNodeBase
      id={id}
      selected={selected}
      nodeType="hexagon"
      data={data}
      tooltipPreview={tooltipPreview}
      onResize={onResize}
      dimensions={dimensions}
      minWidth={60}
      minHeight={40}
      description="Indica una operación de preparación o inicialización en el proceso."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={60}
        minHeight={40}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <polygon
            points={points}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#dc2626'}
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
            padding: '10px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <EditableText
            text={text}
            onChange={onTextChange}
            color={data.textColor || '#000000'}
            fontSize={data.fontSize || 14}
            bold={data.bold}
            italic={data.italic}
            underline={data.underline}
            textAlign={data.textAlign || 'center'}
            size={Math.min(width * 0.8, height * 0.8)}
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
};

export default Hexagon;