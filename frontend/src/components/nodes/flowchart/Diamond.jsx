import React, { useCallback, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import NodeResizeControl from '../NodeResizeControl';

const Diamond = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 150,
    height: data.height || 100,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || '¿Decisión?');

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

  // Obtener dimensiones
  const width = dimensions.width;
  const height = dimensions.height;
  
  // Definir los puntos del diamante
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // Puntos del diamante
  const points = `${halfWidth},1 ${width - 1},${halfHeight} ${halfWidth},${height - 1} 1,${halfHeight}`;

  return (
    <div style={{ position: 'relative' }}>
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={80}
        minHeight={60}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          <polygon
            points={points}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#9D174D'}
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
            padding: '20px',
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
            size={Math.min(width, height) * 0.7} // Reducido para adaptarse mejor al diamante
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>

      {/* Handles para conexión */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      {/* Control de redimensionamiento */}
      {selected && (
        <NodeResizeControl
          position="bottom-right"
          onResize={onResize}
          initialWidth={dimensions.width}
          initialHeight={dimensions.height}
          minWidth={80}
          minHeight={60}
        />
      )}
    </div>
  );
};

export default Diamond;