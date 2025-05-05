import React, { useCallback, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import NodeResizeControl from '../NodeResizeControl';

const Table = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 160,
    height: data.height || 120,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Tabla');

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
  
  // Calcular dimensiones de las celdas de la tabla
  const headerHeight = height * 0.25;
  const cellWidth = width / 2;
  const rowCount = 3;
  const rowHeight = (height - headerHeight) / (rowCount - 1);

  return (
    <div style={{ position: 'relative' }}>
      <ResizableNode
        id={id}
        onResize={onResize}
        width={dimensions.width}
        height={dimensions.height}
        minWidth={100}
        minHeight={80}
        selected={selected}
      >
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* Marco de la tabla */}
          <rect
            x={1}
            y={1}
            width={width - 2}
            height={height - 2}
            fill={data.fill || 'white'}
            stroke={data.stroke || '#22C55E'}
            strokeWidth={data.strokeWidth || 1.5}
          />

          {/* Línea del encabezado */}
          <line
            x1={1}
            y1={headerHeight}
            x2={width - 1}
            y2={headerHeight}
            stroke={data.stroke || '#22C55E'}
            strokeWidth={data.strokeWidth || 1.5}
          />

          {/* Línea vertical que divide la tabla */}
          <line
            x1={cellWidth}
            y1={1}
            x2={cellWidth}
            y2={height - 1}
            stroke={data.stroke || '#22C55E'}
            strokeWidth={data.strokeWidth || 1.5}
          />

          {/* Líneas horizontales para las filas */}
          {Array.from({ length: rowCount - 1 }).map((_, i) => (
            <line
              key={`row-${i}`}
              x1={1}
              y1={headerHeight + rowHeight * (i + 1)}
              x2={width - 1}
              y2={headerHeight + rowHeight * (i + 1)}
              stroke={data.stroke || '#22C55E'}
              strokeWidth={data.strokeWidth * 0.7 || 1}
              opacity="0.7"
            />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${headerHeight}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <EditableText
            text={text}
            onChange={onTextChange}
            color={data.textColor || '#166534'}
            fontSize={data.fontSize || 12}
            bold={data.bold || true}
            italic={data.italic}
            underline={data.underline}
            textAlign={data.textAlign || 'center'}
            size={Math.min(width, headerHeight) * 0.9}
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
          minWidth={100}
          minHeight={80}
        />
      )}
    </div>
  );
};

export default Table;