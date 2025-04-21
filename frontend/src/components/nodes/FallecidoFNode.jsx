import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import ResizeHandle from './ResizeHandle';
import useCircleNode from '../../hooks/useCircleNode';
import useNodeEditor from '../../hooks/useNodeEditor';

const FallecidoFNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "", onSave);
  
  // Tamaño inicial del nodo
  const defaultSize = data?.size || 60;
  
  // Usar el hook especializado para nodos circulares
  const [radius, size, resizeHandleRef, isResizing] = useCircleNode(
    id,
    { radius: defaultSize / 2 },
    defaultSize / 2,
    20 // min radius
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
          background: "#fff1f2",
          border: "2px solid #be123c",
          position: "relative",
        }}
      >
        {/* Mostrar edad dentro del nodo */}
        {data.age != null && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: Math.max(14, size.width * 0.2),
            fontWeight: 'bold',
            color: '#be123c',
            zIndex: 10 // Para asegurar que esté por encima de la cruz
          }}>
            {data.age}
          </div>
        )}
  
        {/* Cruz centrada en el círculo */}
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
            stroke="#be123c"
            strokeWidth="2"
          />
          <line
            x1={size.width}
            y1="0"
            x2="0"
            y2={size.height}
            stroke="#be123c"
            strokeWidth="2"
          />
        </svg>
        
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
            fontSize: 10, 
            marginTop: 4,
            width: Math.max(size.width, 80)
          }}
        />
        {data.age != null && (
          <div style={{ 
            textAlign: "center", 
            fontSize: 10, 
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
            fontSize: 10,
            width: Math.max(size.width, 80)
          }}
        >
          <strong>ID: {id}</strong> <br />
          {label} <br />
          {data.age != null && (
            <div style={{ 
              textAlign: "center", 
              fontSize: 10, 
              marginTop: 4, 
              fontWeight: 'bold' 
            }}>
              Edad: {data.age}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FallecidoFNode;