import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useNodeEditor from '../../../hooks/useNodeEditor';
import useCircleNode from '../../../hooks/useCircleNode';

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
  
  // Tamaño inicial del nodo - aumentando tamaño a 55 (antes era 40)
  const defaultSize = data?.size || 55;
  
  // Usar el hook especializado para nodos circulares
  const [size, resizeHandleRef] = useCircleNode(
    id,
    defaultSize,
    35 // min size aumentado a 25 (antes era 20)
  );
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta del nodo */}
      <div 
        onDoubleClick={handleDoubleClick}
        style={{ 
          fontWeight: "bold", 
          textAlign: "center", 
          cursor: "text",
          color: "#1e3a8a", 
          padding: "2px 0",
          textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
        }}
      >
        {label}
      </div>
      
      {/* Info adicional si existe */}
      {data.info && (
        <div style={{ 
          fontSize: 10, 
          color: '#64748b',
          textAlign: 'center', 
          textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
        }}>
          {data.info}
        </div>
      )}
      
      {/* Identificador del nodo */}
      <div style={{ 
        fontSize: 9, 
        marginTop: 2, 
        textAlign: "center", 
        color: '#64748b',
        fontFamily: 'monospace',
        opacity: 0.7,
        textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
      }}>
        ID: {id}
      </div>
    </div>
  );

  // Interfaces para edición
  const editingInterface = isEditing ? (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        marginTop: '10px',
      }}
    >
      <input
        value={label}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{ 
          textAlign: "center", 
          fontSize: 10, 
          width: Math.max(size, 50),
          border: "1px solid #ccc",
          borderRadius: "3px",
          padding: "2px 4px"
        }}
      />
    </div>
  ) : null;

  return (
    <>
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
        labelContent={labelContent}
      >
        {/* Círculo negro más grande */}
        <div style={{ 
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#000",
          position: "absolute",
          pointerEvents: 'none'
        }} />
      </BaseNodeComponent>
      
      {editingInterface}
    </>
  );
};

export default AbortoEspontaneoNode;