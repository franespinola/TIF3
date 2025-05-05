import React from 'react';
import BaseNodeComponent from '../../nodes/BaseNodeComponent';
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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            fontWeight: "bold"
          }}
        />
      </BaseNodeComponent>
      
      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 2, textAlign: "center" }}>
        ID: {id}
      </div>
    </div>
  );
};

export default AdopcionNode;