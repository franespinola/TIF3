import React, { useEffect, useState } from 'react';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

export default function ArrowNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const [width, setWidth] = useState(data?.width || 120);
  const [height, setHeight] = useState(data?.height || 60);
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
  const direction = data?.direction || 'right'; // right, left, up, down
  const textColor = data?.textColor || '#000000';
  const fontSize = data?.fontSize || 14;
  
  // Actualizar dimensiones cuando cambia data
  useEffect(() => {
    if (data?.width !== undefined && data?.width !== width) {
      setWidth(data.width);
    }
    if (data?.height !== undefined && data?.height !== height) {
      setHeight(data.height);
    }
  }, [data?.width, data?.height, width, height]);
  
  // Manejar los cambios de texto
  const onTextChange = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText);
    }
  };

  // Manejar el cambio de tamaño
  const handleResize = (newWidth, newHeight) => {
    setWidth(newWidth);
    setHeight(newHeight);
    
    if (data?.onResize) {
      data.onResize(id, newWidth, newHeight);
    }
  };

  // Función para generar el path de la flecha según la dirección
  const getArrowPath = () => {
    const arrowHeadSize = Math.min(width, height) * 0.25; // Tamaño de la cabeza de la flecha
    
    switch (direction) {
      case 'left':
        return {
          body: `M${width},${height/2} L${arrowHeadSize},${height/2}`,
          head: `M${arrowHeadSize*1.5},${height/4} L${strokeWidth},${height/2} L${arrowHeadSize*1.5},${3*height/4} Z`
        };
      case 'up':
        return {
          body: `M${width/2},${height} L${width/2},${arrowHeadSize}`,
          head: `M${width/4},${arrowHeadSize*1.5} L${width/2},${strokeWidth} L${3*width/4},${arrowHeadSize*1.5} Z`
        };
      case 'down':
        return {
          body: `M${width/2},${strokeWidth} L${width/2},${height-arrowHeadSize}`,
          head: `M${width/4},${height-arrowHeadSize*1.5} L${width/2},${height-strokeWidth} L${3*width/4},${height-arrowHeadSize*1.5} Z`
        };
      case 'right':
      default:
        return {
          body: `M${strokeWidth},${height/2} L${width-arrowHeadSize},${height/2}`,
          head: `M${width-arrowHeadSize*1.5},${height/4} L${width-strokeWidth},${height/2} L${width-arrowHeadSize*1.5},${3*height/4} Z`
        };
    }
  };

  const arrowPaths = getArrowPath();

  // Crear una vista previa para el tooltip
  const tooltipPreview = (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {/* Cuerpo de la flecha */}
      <path
        d={arrowPaths.body}
        stroke={stroke}
        strokeWidth={strokeWidth * 2}
        fill="none"
      />
      
      {/* Cabeza de la flecha */}
      <path
        d={arrowPaths.head}
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
      nodeType="arrow"
      data={data}
      tooltipPreview={tooltipPreview}
    >
      <ResizableNode
        width={width}
        height={height}
        minWidth={60}
        minHeight={30}
        onResize={handleResize}
        selected={selected}
      >
        <div style={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* SVG de la flecha */}
          <svg 
            width="100%" 
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Cuerpo de la flecha */}
            <path
              d={arrowPaths.body}
              stroke={stroke}
              strokeWidth={strokeWidth * 2}
              fill="none"
            />
            
            {/* Cabeza de la flecha */}
            <path
              d={arrowPaths.head}
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
              alignItems: 'center'
            }}
          >
            {/* Componente de texto editable */}
            <EditableText
              text={data?.text || data?.label || ''}
              onChange={onTextChange}
              color={textColor}
              fontSize={fontSize}
              bold={data?.bold}
              italic={data?.italic}
              underline={data?.underline}
              textAlign={data?.textAlign || 'center'}
              size={Math.min(width * 0.7, height * 0.7)}
              pointerEvents="auto"
            />
          </div>
        </div>
      </ResizableNode>
    </FlowchartNodeBase>
  );
}