import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useNodeEditor from '../../hooks/useNodeEditor';
import useCircleNode from '../../hooks/useCircleNode';

const AbortoEspontaneoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "AE", onSave);
  
  // Tamaño inicial del nodo - aumentando tamaño a 40
  const defaultSize = data?.size || 40;
  
  // Usar el hook especializado para nodos circulares
  const [size, resizeHandleRef] = useCircleNode(
    id,
    defaultSize,
    20 // min size
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
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Círculo negro más grande */}
        <div style={{ 
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#000",
          position: "absolute",
        }} />
      </BaseNodeComponent>

      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 5, textAlign: "center" }}>
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
              width: Math.max(size, 40) 
            }}
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            <strong>{label}</strong>
            {data.info && <div>{data.info}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbortoEspontaneoNode;