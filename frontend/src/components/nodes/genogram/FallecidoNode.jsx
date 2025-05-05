import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useNodeSize from '../../../hooks/useNodeSize';
import useNodeEditor from '../../../hooks/useNodeEditor';

const FallecidoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || `† ${data?.name || ''}`, onSave);
  
  // Configuración de tamaño
  const defaultWidth = data?.width || 100;
  const defaultHeight = data?.height || 50;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultWidth, height: defaultHeight },
    80, // min width
    40  // min height
  );
  
  // Datos adicionales
  const name = data?.name || '';
  const cause = data?.cause || '';
  const date = data?.date || '';
  
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
          background: "#f3f4f6",
          border: "2px solid #4b5563",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Contenido del nodo */}
        {isEditing ? (
          <input
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ 
              textAlign: "center", 
              width: "80%",
              fontSize: 14,
              padding: "4px"
            }}
          />
        ) : (
          <div 
            onDoubleClick={handleDoubleClick}
            style={{ 
              width: "100%", 
              textAlign: "center", 
              padding: "4px",
              cursor: "text"
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 14 }}>{label}</div>
            {cause && <div style={{ fontSize: 12 }}>Causa: {cause}</div>}
            {date && <div style={{ fontSize: 12 }}>Fecha: {date}</div>}
          </div>
        )}
      </BaseNodeComponent>
      
      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 2, textAlign: "center" }}>
        ID: {id}
      </div>
    </div>
  );
};

export default FallecidoNode;