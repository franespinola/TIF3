import React from 'react';
import BaseNodeComponent from '../../nodes/BaseNodeComponent';
import useNodeEditor from '../../../hooks/useNodeEditor';
import useTriangleNode from '../../../hooks/useTriangleNode';

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
  
  // Tamaño inicial del nodo (ajustado para ser más pequeño, como los nodos de feto)
  const defaultSize = data?.size || 35;
  
  // Usar el hook especializado para nodos triangulares (invertidos)
  const [size, resizeHandleRef] = useTriangleNode(
    id,
    { width: defaultSize, height: defaultSize },
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
          width: size.width,
          height: size.height,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Triángulo simple con contorno negro y fondo blanco */}
        <div style={{ 
          width: 0,
          height: 0,
          borderLeft: `${size.width / 2}px solid transparent`,
          borderRight: `${size.width / 2}px solid transparent`,
          borderBottom: `${size.height}px solid white`,
          filter: `drop-shadow(0px 0px 0px #000) drop-shadow(0px 0px 3px #000)`,
          position: "absolute",
          top: 0,
          zIndex: 1,
        }} />
        
        {/* Borde del triángulo */}
        <div style={{ 
          width: 0,
          height: 0,
          borderLeft: `${size.width / 2}px solid transparent`,
          borderRight: `${size.width / 2}px solid transparent`,
          borderBottom: `${size.height}px solid black`,
          position: "absolute",
          top: 0,
          zIndex: 0,
        }} />
      </BaseNodeComponent>

      {/* Etiqueta del nodo - Ahora debajo del nodo */}
      <div style={{ 
        fontSize: Math.max(size.width * 0.25, 10),
        fontWeight: "bold",
        color: "#000",
        marginTop: 5,
        textAlign: "center"
      }}>
        {label}
      </div>

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