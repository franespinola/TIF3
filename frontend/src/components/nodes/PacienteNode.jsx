import React, { useState, useEffect } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import ResizeHandle from './ResizeHandle';
import useCircleNode from '../../hooks/useCircleNode';
import useNodeEditor from '../../hooks/useNodeEditor';

const PacienteNode = ({ data, id, selected }) => {
  // Usar el hook de edición de nodos
  const onSave = (newLabel) => {
    if (data?.onEdit) {
      data.onEdit(id, newLabel);
    }
  };
  
  // Asegurarse de que se use el nombre y label del data
  const displayName = data?.name || data?.label || "";
  
  const {
    isEditing, 
    value: label, 
    handleDoubleClick, 
    handleChange, 
    handleBlur, 
    handleKeyDown 
  } = useNodeEditor(displayName, onSave);
  
  // Tamaño inicial del nodo (más grande que otros nodos para el paciente)
  const defaultSize = data?.size || 80;
  
  // Usar el hook especializado para nodos circulares
  const [radius, size, resizeHandleRef, isResizing] = useCircleNode(
    id,
    { radius: defaultSize / 2 },
    defaultSize / 2,
    25 // min radius
  );
  
  // Actualizar cuando cambia el tamaño en data
  useEffect(() => {
    if (data?.size !== undefined && !isResizing) {
      const newSize = data.size;
      if (size.width !== newSize || size.height !== newSize) {
        // Usando el hook useCircleNode que ya maneja esta sincronización
      }
    }
  }, [data?.size, isResizing]);
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        showResizeHandle={false} // Ocultamos el manejador predeterminado
        nodeStyles={{
          width: size.width,
          height: size.height,
          background: "#e0f7fa",
          borderRadius: Math.max(10, size.width * 0.125), // Escalar el radio de borde con el tamaño
          border: "3px solid #0288d1",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Mostrar edad dentro del nodo */}
        {(data.age != null) && (
          <div style={{ 
            fontSize: Math.max(16, size.width * 0.2),
            fontWeight: 'bold',
            color: '#000'
          }}>
            {data.age}
          </div>
        )}
        
        {/* Control de redimensionamiento personalizado en la posición correcta */}
        {selected && (
          <ResizeHandle 
            resizeHandleRef={resizeHandleRef} 
            position="bottom-right"
          />
        )}
      </BaseNodeComponent>

      {/* Label debajo */}
      {isEditing ? (
        <>
        <input
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ 
            textAlign: "center", 
            marginTop: 4, 
            width: Math.max(size.width, 100) 
          }}
        />
        {data.age != null && (
          <div style={{ 
            textAlign: "center", 
            marginTop: 4, 
            fontWeight: 'bold' 
          }}>
            Edad: {data.age}
          </div>
        )}
        </>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{ 
            marginTop: 4, 
            textAlign: "center",
            width: Math.max(size.width, 100)
          }}
        >
          <strong>{data?.name || label}</strong> <br />
          {data.age != null && (
            <div style={{ 
              textAlign: "center", 
              marginTop: 4, 
              fontWeight: 'bold' 
            }}>
              Edad: {data.age}
            </div>
          )}
          <div style={{ fontSize: 9, color: "#666" }}>ID: {id}</div>
        </div>
      )}
    </div>
  );
};

export default PacienteNode;