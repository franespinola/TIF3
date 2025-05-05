import React from 'react';
import BaseNodeComponent from '../../nodes/BaseNodeComponent';
import useNodeEditor from '../../../hooks/useNodeEditor';
import useSquareNode from '../../../hooks/useSquareNode';

const AbortoProvocadoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "AP", onSave);
  
  // Tamaño inicial del nodo
  const defaultSize = data?.size || 40;
  
  // Usar el hook para los nodos
  const [size, resizeHandleRef] = useSquareNode(
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
        {/* X grande negra sin fondo */}
        <div style={{ position: "relative", width: size, height: size }}>
          {/* Línea diagonal \ */}
          <div style={{ 
            position: "absolute",
            width: size * 1.2,
            height: 4,
            backgroundColor: "#000", // Cambiado a negro
            top: size / 2,
            left: -size * 0.1,
            transform: "rotate(45deg)",
            transformOrigin: "center"
          }} />
          
          {/* Línea diagonal / */}
          <div style={{ 
            position: "absolute",
            width: size * 1.2,
            height: 4,
            backgroundColor: "#000", // Cambiado a negro
            top: size / 2,
            left: -size * 0.1,
            transform: "rotate(-45deg)",
            transformOrigin: "center"
          }} />
        </div>
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

export default AbortoProvocadoNode;