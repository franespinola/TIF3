import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from '../../nodes/NodeTextInput';
import useNodeSize from '../../../hooks/useNodeSize';
import useNodeEditor from '../../../hooks/useNodeEditor';

const AdopcionNode = ({ data, id, selected }) => {
  // Usar el hook de edición de nodos
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel);
    }
  };
  
  const {
    isEditing, 
    value: label, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown 
  } = useNodeEditor(data?.label || "Adopción", onSave);
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef] = useNodeSize(
    id,
    data,
    { width: 120, height: 30 },
    80, // min width
    25  // min height
  );
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  // Preparar el contenido de la etiqueta para usar labelContent
  const labelContent = (
    <div style={{ 
      fontSize: 10, 
      marginTop: 2, 
      textAlign: "center",
      color: '#64748b',
      fontFamily: 'monospace',
      opacity: 0.7,
      textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
    }}>
      ID: {id}
    </div>
  );

  return (
    <BaseNodeComponent
      selected={selected}
      resizeHandleRef={resizeHandleRef}
      isConnectable={isConnectable}
      nodeStyles={{
        width: size.width,
        height: size.height,
        background: "#e5e7eb",
        border: "2px solid #4b5563",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
      labelContent={labelContent}
    >
      {/* Texto del nodo */}
      <NodeTextInput
        value={label}
        isEditing={isEditing}
        onDoubleClick={handleDoubleClick}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        labelStyle={{
          fontSize: 12,
          fontWeight: "bold",
          pointerEvents: 'none'
        }}
      />
    </BaseNodeComponent>
  );
};

export default AdopcionNode;