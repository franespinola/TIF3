// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\nodes\flowchart\TextNode.jsx
import React from 'react';
import FlowchartNodeBase from './FlowchartNodeBase';
import EditableText from '../../text/EditableText';

export default function TextNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const fontSize = data?.fontSize || 16;
  const color = data?.textColor || data?.color || '#000000';
  const defaultWidth = data?.width || 150;
  const defaultHeight = data?.height || 80;
  const fontFamily = data?.fontFamily || 'Arial, sans-serif';
  const fontWeight = data?.fontWeight || 'normal';
  const fontStyle = data?.fontStyle || 'normal';
  const textDecoration = data?.textDecoration || 'none';
  const textAlign = data?.textAlign || 'left';
  
  // Soporte para formato boolean (para compatibilidad)
  const bold = data?.bold || false;
  const italic = data?.italic || false;
  const underline = data?.underline || false;
  
  // Handler for text edits
  const handleTextChange = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText);
    }
  };

  // Calculate effective styles
  const effectiveFontWeight = bold ? 'bold' : fontWeight;
  const effectiveFontStyle = italic ? 'italic' : fontStyle;
  const effectiveTextDecoration = underline ? 'underline' : textDecoration;

  const textStyle = {
    fontSize: `${fontSize}px`,
    color,
    fontFamily,
    fontWeight: effectiveFontWeight,
    fontStyle: effectiveFontStyle,
    textDecoration: effectiveTextDecoration,
    textAlign,
    width: '100%',
    height: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  };

  return (
    <FlowchartNodeBase
      id={id}
      selected={selected}
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
      data={data}
      className="text-node"
    >
      <EditableText
        text={data?.text || 'Texto'}
        onChange={handleTextChange}
        style={textStyle}
        multiline
      />
    </FlowchartNodeBase>
  );
}