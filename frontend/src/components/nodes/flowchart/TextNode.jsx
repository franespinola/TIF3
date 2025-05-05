// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\nodes\flowchart\TextNode.jsx
import React, { useEffect } from 'react';
import BaseNodeComponent from '../../nodes/BaseNodeComponent';
import NodeTextArea from '../../nodes/NodeTextArea';
import useResizable from '../../../hooks/useResizable';
import useNodeEditor from '../../../hooks/useNodeEditor';

export default function TextNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  // Extendemos las propiedades para incluir todas las opciones de formato
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
  
  // Usar el hook de edición de nodos
  const onSave = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText);
    }
  };
  
  // Omitimos setValue (setText) de la desestructuración ya que no lo usamos
  const {
    isEditing, 
    value: text, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown: baseHandleKeyDown 
  } = useNodeEditor(data?.text || 'Texto', onSave);

  // Personalizar el manejo de teclas para permitir nuevas líneas con Shift+Enter
  const handleKeyDown = (e) => {
    // Al presionar Enter sin Shift, guardamos
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSave) {
        onSave(text);
      }
    } else {
      // Para otros casos, usar el manejador base
      baseHandleKeyDown(e);
    }
  };

  // Usar el hook de redimensionamiento
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width: defaultWidth, height: defaultHeight },
    100, // min width
    50   // min height
  );

  // Actualizar el tamaño cuando cambian los datos (y no estamos redimensionando)
  useEffect(() => {
    if (
      data?.width !== undefined &&
      data?.height !== undefined &&
      !isResizing
    ) {
      if (data.width !== size.width || data.height !== size.height) {
        setSize({
          width: data.width,
          height: data.height,
        });
      }
    }
  }, [data?.width, data?.height, isResizing, setSize, size.width, size.height]);

  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;
  
  const nodeStyles = {
    padding: 5,
    width: size.width,
    height: size.height,
    border: selected
      ? '1px dashed #3b82f6'
      : '1px dashed transparent',
    borderRadius: 4,
    boxSizing: 'border-box',
  };
  
  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      nodeStyles={nodeStyles}
    >
      {/* Componente modularizado para edición de texto multilínea */}
      <NodeTextArea
        value={text}
        isEditing={isEditing}
        onDoubleClick={handleDoubleClick}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        fontSize={fontSize}
        color={color}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fontStyle={fontStyle}
        textDecoration={textDecoration}
        textAlign={textAlign}
        bold={bold}
        italic={italic}
        underline={underline}
      />
    </BaseNodeComponent>
  );
}