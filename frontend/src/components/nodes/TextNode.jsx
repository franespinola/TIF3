import React, { useEffect } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextArea from './NodeTextArea';
import useResizable from '../../hooks/useResizable';
import useNodeEditor from '../../hooks/useNodeEditor';

export default function TextNode({ data, id, selected }) {
  // Valores por defecto si no se proporcionan en data
  const fontSize = data?.fontSize || 16;
  const color = data?.color || '#000000';
  const defaultWidth = data?.width || 150;
  const defaultHeight = data?.height || 80;
  
  // Usar el hook de edición de nodos
  const onSave = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText);
    }
  };
  
  const {
    isEditing, 
    value: text, 
    setValue: setText,
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
      />
    </BaseNodeComponent>
  );
}
