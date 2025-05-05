import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useResizable from '../../../hooks/useResizable';

const FallecidoMNode = ({ data, id, selected }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "");
    
    // Tamaño inicial del nodo
    const defaultSize = data?.size || 60;
    
    // Usar el hook de redimensionamiento - corregida la desestructuración
    const [size, resizeHandleRef, isResizing, setSize] = useResizable(
      id,
      { width: defaultSize, height: defaultSize },
      40, // min size
      40  // min size
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
            background: "#fee2e2",
            border: "2px solid #7f1d1d",
            position: "relative",
          }}
        >
          {/* Handles con IDs específicos y mayor tamaño */}
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
  
          {/* Mostrar edad dentro del nodo */}
          {data.age != null && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: Math.max(14, size.width * 0.2),
              fontWeight: 'bold',
              color: '#7f1d1d',
              zIndex: 10 // Para asegurar que esté por encima de la cruz
            }}>
              {data.age}
            </div>
          )}
  
          {/* Cruz que cruce completamente el cuadrado */}
          <svg
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <line
              x1="0"
              y1="0"
              x2={size.width}
              y2={size.height}
              stroke="#7f1d1d"
              strokeWidth="2"
            />
            <line
              x1={size.width}
              y1="0"
              x2="0"
              y2={size.height}
              stroke="#7f1d1d"
              strokeWidth="2"
            />
          </svg>
          
          {/* Control de redimensionamiento que solo aparece cuando el nodo está seleccionado */}
          {selected && (
            <div
              ref={resizeHandleRef}
              style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                width: 10,
                height: 10,
                background: '#3b82f6',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                zIndex: 20 // Debe estar por encima de la cruz
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
                width: Math.max(size.width, 80) 
              }}
            />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>
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
              width: Math.max(size.width, 80)
            }}
          >
            <strong>ID: {id}</strong> <br />
            {label} <br />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>
                Edad: {data.age}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default FallecidoMNode;