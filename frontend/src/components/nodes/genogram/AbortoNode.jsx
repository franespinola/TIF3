import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useCircleNode from '../../../hooks/useCircleNode';
import useNodeEditor from '../../../hooks/useNodeEditor';

const AbortoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "✖", onSave);
  
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

  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
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
          color: "#b45309", 
          padding: "2px 0",
          textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
        }}
      >
        {label}
      </div>
      
      {/* Información adicional si existe edad */}
      {data.age != null && (
        <div style={{ 
          fontSize: 10,
          textAlign: "center",
          color: '#78350f', 
          textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
        }}>
          Edad: {data.age}
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

  // Interfaz de edición
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
          width: Math.max(size.width, 40),
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
        showResizeHandle={false} // Ocultamos el manejador predeterminado
        nodeStyles={{
          width: size.width,
          height: size.height,
          borderRadius: "50%",
          background: "#fcd34d",
          border: "2px solid #b45309",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        labelContent={labelContent}
      >
        {/* Control de redimensionamiento personalizado en la posición correcta */}
        {selected && (
          <div 
            ref={resizeHandleRef}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              background: "#ffffff",
              border: "2px solid #b45309",
              borderRadius: "50%",
              cursor: "nwse-resize",
              zIndex: 10,
            }}
          />
        )}
      </BaseNodeComponent>
      
      {editingInterface}
    </>
  );
};

export default AbortoNode;