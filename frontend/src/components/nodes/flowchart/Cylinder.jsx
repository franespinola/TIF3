import React, { useCallback, useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import NodeResizeControl from '../NodeResizeControl';

const Cylinder = ({ id, data, selected }) => {
  const [dimensions, setDimensions] = useState({
    width: data.width || 140,
    height: data.height || 90,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data.text || data.label || 'Base de datos');

  useEffect(() => {
    // Actualizar texto cuando cambien los datos externos
    if (data?.text !== undefined && data.text !== text) {
      setText(data.text);
    } else if (data?.label !== undefined && data.label !== text) {
      setText(data.label);
    }
  }, [data?.text, data?.label, text]);

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
      // También actualizar label para mantener consistencia
      data.label = newText;
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

  // Obtener dimensiones
  const width = dimensions.width;
  const height = dimensions.height;
  
  // Parámetros para el cilindro
  const ellipseHeight = Math.min(height * 0.2, 20); // Altura de la elipse superior e inferior
  const cylinderBodyHeight = height - ellipseHeight; // Altura del cuerpo del cilindro

  // Obtener los estilos aplicables
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;

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
          {/* Cuerpo del cilindro */}
          <path
            d={`M 1,${ellipseHeight/2} 
                V ${height - ellipseHeight/2} 
                C 1,${height - ellipseHeight*0.1} ${width*0.25},${height} ${width/2},${height} 
                C ${width*0.75},${height} ${width-1},${height - ellipseHeight*0.1} ${width-1},${height - ellipseHeight/2} 
                V ${ellipseHeight/2} 
                C ${width-1},${ellipseHeight*0.1} ${width*0.75},0 ${width/2},0 
                C ${width*0.25},0 1,${ellipseHeight*0.1} 1,${ellipseHeight/2} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          
          {/* Elipse superior (para dar efecto 3D) */}
          <ellipse
            cx={width/2}
            cy={ellipseHeight/2}
            rx={width/2 - 1}
            ry={ellipseHeight/2}
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
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '15px',
            paddingTop: `${ellipseHeight}px`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <EditableText
            text={text}
            onChange={onTextChange}
            color={textColor}
            fontSize={fontSize || 12}
            bold={data?.bold}
            italic={data?.italic}
            underline={data?.underline}
            textAlign={data?.textAlign || 'center'}
            size={Math.min(width, height - ellipseHeight) * 0.9}
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

export default Cylinder;