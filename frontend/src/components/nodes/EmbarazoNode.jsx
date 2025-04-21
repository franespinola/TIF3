import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from './NodeTextInput';
import useCircleNode from '../../hooks/useCircleNode';
import useNodeEditor from '../../hooks/useNodeEditor';

const EmbarazoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "E", onSave);
  
  // Tamaño inicial del nodo
  const defaultSize = data?.size || 40;
  
  // Usar el hook especializado para nodos circulares
  const [radius, size, resizeHandleRef, isResizing] = useCircleNode(
    id,
    { radius: defaultSize / 2 },
    defaultSize / 2,
    15 // min radius
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
          borderRadius: "50%",
          background: "#e0f2fe",
          border: "2px solid #0369a1",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Texto dentro del círculo */}
        <div style={{ 
          fontSize: Math.max(radius * 0.6, 10),
          fontWeight: "bold",
          color: "#0369a1"
        }}>
          {label}
        </div>
      </BaseNodeComponent>

      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 2, textAlign: "center" }}>
        {isEditing ? (
          <input
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ 
              textAlign: "center", 
              fontSize: 10, 
              width: Math.max(size.width, 40) 
            }}
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            <strong>ID: {id}</strong>
            {data.meses && <div>Meses: {data.meses}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbarazoNode;