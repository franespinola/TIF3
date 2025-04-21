import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextArea from './NodeTextArea';
import useNodeSize from '../../hooks/useNodeSize';
import useNodeEditor from '../../hooks/useNodeEditor';

const AnotacionNode = ({ data, id, selected }) => {
  // Usar el hook de edición de nodos
  const onSave = (newText) => {
    if (data?.onEdit) {
      data.onEdit(id, newText);
    }
  };
  
  const {
    isEditing, 
    value: text, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown 
  } = useNodeEditor(data?.text || "Anotación", onSave);
  
  // Configuración de tamaño
  const defaultWidth = data?.width || 150;
  const defaultHeight = data?.height || 80;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultWidth, height: defaultHeight },
    100, // min width
    60  // min height
  );
  
  // Color personalizado del nodo
  const bgColor = data?.backgroundColor || "#fef3c7";
  const borderColor = data?.borderColor || "#d97706";
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      nodeStyles={{
        width: size.width,
        height: size.height,
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "8px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Título del nodo si existe */}
      {data?.title && (
        <div style={{ 
          fontWeight: "bold", 
          borderBottom: `1px solid ${borderColor}`, 
          marginBottom: "4px",
          paddingBottom: "4px",
          fontSize: "14px"
        }}>
          {data.title}
        </div>
      )}
      
      {/* Contenido principal del nodo */}
      <NodeTextArea
        value={text}
        isEditing={isEditing}
        onDoubleClick={handleDoubleClick}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        fontSize={12}
      />
      
      {/* ID discreto */}
      <div style={{ 
        position: "absolute", 
        bottom: "2px", 
        right: "4px", 
        fontSize: "8px", 
        opacity: 0.7 
      }}>
        ID: {id}
      </div>
    </BaseNodeComponent>
  );
};

export default AnotacionNode;