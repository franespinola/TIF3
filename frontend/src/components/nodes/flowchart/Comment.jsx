import React, { useCallback, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import NodeResizeControl from '../NodeResizeControl';

const Comment = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 160,
    height: data.height || 80,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || 'Comentario');

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
      // Si hay una función onEdit, llamarla
      if (data.onEdit) {
        data.onEdit(id, newText, {
          ...data,
          text: newText
        });
      }
    }
  }, [data, id]);

  // Obtener dimensiones
  const width = dimensions.width;
  const height = dimensions.height;
  
  // Obtener los estilos aplicables
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || '#F5F5F5';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  
  // Crear path para la forma de comentario (bocadillo)
  const pointerSize = Math.min(15, height * 0.2);
  const cornerRadius = Math.min(10, Math.min(width, height) * 0.1);
  
  // Path para el bocadillo de comentario
  const d = `
    M ${cornerRadius} 0
    L ${width - cornerRadius} 0
    Q ${width} 0 ${width} ${cornerRadius}
    L ${width} ${height - cornerRadius - pointerSize}
    Q ${width} ${height - pointerSize} ${width - cornerRadius} ${height - pointerSize}
    L ${width * 0.7} ${height - pointerSize}
    L ${width * 0.6} ${height}
    L ${width * 0.5} ${height - pointerSize}
    L ${cornerRadius} ${height - pointerSize}
    Q 0 ${height - pointerSize} 0 ${height - cornerRadius - pointerSize}
    L 0 ${cornerRadius}
    Q 0 0 ${cornerRadius} 0
  `;

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
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `calc(100% - ${pointerSize}px)`,
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
            fontSize={fontSize || 12}
            bold={data.bold}
            italic={data.italic || true}
            underline={data.underline}
            textAlign={data.textAlign || 'center'}
            size={Math.min(width, height - pointerSize) * 0.9}
            pointerEvents="auto"
          />
        </div>
      </ResizableNode>

      {/* Handles para conexión (solo algunos puntos estratégicos) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
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

export default Comment;