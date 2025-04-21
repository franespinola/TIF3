import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../hooks/useResizable';

const AdopcionNode = ({ data, id, selected }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "A");
    
    // Tamaño inicial del nodo
    const defaultSize = data?.size || 40;
    
    // Usar el hook de redimensionamiento - corregida la desestructuración para incluir setSize
    const [size, resizeHandleRef, isResizing, setSize] = useResizable(
      id,
      { width: defaultSize, height: defaultSize },
      30, // min size
      30  // min size
    );
    
    // Actualizar cuando cambia el tamaño en data
    useEffect(() => {
      if (data?.size !== undefined && !isResizing) {
        const newSize = data.size;
        if (size.width !== newSize || size.height !== newSize) {
          setSize({ width: newSize, height: newSize });
        }
      }
    }, [data?.size, isResizing, setSize, size.width, size.height]);

    // Determinar si los handles son conectables
    const isConnectable = data?.isConnectable !== false;
    
    // Estilo común para los handles para mayor tamaño y área de selección
    const handleStyle = {
      background: "#555",
      width: 8,
      height: 8,
      border: "2px solid #fff",
      borderRadius: "50%",
      zIndex: 5
    };
  
    const handleBlur = () => {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(id, label);
      }
    };
  
    return (
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div
          style={{
            width: size.width,
            height: size.height,
            borderRadius: "50%",
            background: "#e0f2fe",
            border: "2px dotted #4b5563",
            position: "relative",
          }}
        >
          <Handle
            type="target"
            position={Position.Top}
            id="t"
            style={{ ...handleStyle, top: -6 }}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            style={{ ...handleStyle, bottom: -6 }}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="l"
            style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="r"
            style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }}
            isConnectable={isConnectable}
          />
          
          {/* Control de redimensionamiento que solo aparece cuando el nodo está seleccionado */}
          {selected && (
            <div
              ref={resizeHandleRef}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                background: '#3b82f6',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                zIndex: 10
              }}
            />
          )}
        </div>
  
        {editing ? (
          <>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
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
            onDoubleClick={() => setEditing(true)}
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

export default AdopcionNode;