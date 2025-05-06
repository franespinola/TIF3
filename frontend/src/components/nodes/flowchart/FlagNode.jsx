import React, { useEffect, useState } from 'react';
import ResizableNode from '../ResizableNode';
import EditableText from '../../text/EditableText';
import FlowchartNodeBase from './FlowchartNodeBase';

export default function FlagNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const [width, setWidth] = useState(data?.width || 80);
  const [height, setHeight] = useState(data?.height || 100);
  const stroke = data?.stroke || 'rgb(59, 130, 246)'; // Color azul estandarizado
  const fill = data?.fill || 'white';
  const strokeWidth = data?.strokeWidth || 1.5;
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

  // Calcular puntos para la forma de bandera
  const getFlagPoints = () => {
    const poleWidth = Math.min(height * 0.1, 10); // Ancho del mástil

    return {
      pole: `M${poleWidth/2},${strokeWidth} V${height-strokeWidth}`,
      flag: `
        M${poleWidth},${strokeWidth}
        H${width-strokeWidth}
        L${width-poleWidth},${height/2}
        L${width-strokeWidth},${height-strokeWidth}
        H${poleWidth}
        Z
      `
    };
  };

  const flagPaths = getFlagPoints();

  // Crear una vista previa para el tooltip
  const tooltipPreview = (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <path
        d={flagPaths.flag}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
      <path
        d={flagPaths.pole}
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
    >
      <ResizableNode
        width={width}
        height={height}
        minWidth={60}
        minHeight={60}
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
          {/* SVG de la bandera */}
          <svg 
            width="100%" 
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Bandera */}
            <path
              d={flagPaths.flag}
              stroke={stroke}
              strokeWidth={strokeWidth}
              fill={fill}
            />
            
            {/* Mástil */}
            <path
              d={flagPaths.pole}
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
              width: '90%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '10%' // Desplazamiento para evitar superposición con el mástil
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