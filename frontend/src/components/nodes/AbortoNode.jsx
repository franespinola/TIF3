import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from './NodeTextInput';
import ResizeHandle from './ResizeHandle';
import useCircleNode from '../../hooks/useCircleNode';
import useNodeEditor from '../../hooks/useNodeEditor';

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
            borderRadius: "50%",
            background: "#fcd34d",
            border: "2px solid #b45309",
            position: "relative",
          }}
        >
          {/* Control de redimensionamiento personalizado en la posición correcta */}
          {selected && (
            <ResizeHandle 
              resizeHandleRef={resizeHandleRef} 
              position="bottom-right"
            />
          )}
        </BaseNodeComponent>

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
                fontSize: 10, 
                marginTop: 4, 
                width: Math.max(size.width, 40) 
              }}
            />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4 }}>
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
              fontSize: 10, 
              width: Math.max(size.width, 50) 
            }}
          >
            <strong>ID: {id}</strong> <br />
            {label} <br />
            {data.age != null && <>Edad: {data.age}</>}
          </div>
        )}
      </div>
    );
  };
  
export default AbortoNode;