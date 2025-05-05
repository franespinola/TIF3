import React, { useCallback, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import NodeResizeControl from '../NodeResizeControl';

const Document = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 140,
    height: data.height || 100,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Documento');

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
  
  // Crear el path para la forma de documento (rectángulo con borde ondulado abajo)
  const waveHeight = Math.min(15, height * 0.15);
  
  // Versión corregida: eliminando saltos de línea y asegurando formato correcto
  const documentPath = `M1,1 H${width - 1} V${height - waveHeight - 1} C${width * 0.75},${height - waveHeight * 0.5} ${width * 0.5},${height - waveHeight * 1.5} ${width * 0.25},${height - waveHeight * 0.5} C${width * 0.125},${height - 1} ${width * 0.0625},${height - waveHeight * 0.5} 1,${height - waveHeight - 1} Z`;

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
          <path
            d={documentPath}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#7C3AED'}
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
            padding: '15px',
            paddingBottom: waveHeight + 10, // Añadir más padding en la parte inferior
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
            size={Math.min(width, height - waveHeight) * 0.9}
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

export default Document;