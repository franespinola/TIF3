import React, { useCallback, useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

const Oval = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 140,
    height: data.height || 80,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Inicio/Fin');

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
      <ellipse
        cx={width * 0.35}
        cy={height * 0.35}
        rx={width * 0.35 - 1}
        ry={height * 0.35 - 1}
        fill={data.fill || 'white'}
        stroke={data.stroke || '#047857'}
        strokeWidth={data.strokeWidth || 1.5}
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
      onResize={onResize}
      dimensions={dimensions}
      minWidth={80}
      minHeight={40}
      description="Indica el inicio o fin de un proceso o diagrama de flujo."
    >
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={80}
        minHeight={40}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2 - 1}
            ry={height / 2 - 1}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#047857'}
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

export default Oval;