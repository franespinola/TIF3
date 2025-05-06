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

  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
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
            width: Math.max(size, 40),
            border: "1px solid #666",
            borderRadius: "3px",
            padding: "1px 3px"
          }}
        />
      ) : (
        <div 
          onDoubleClick={handleDoubleClick}
          style={{ 
            fontWeight: "bold", 
            textAlign: "center", 
            cursor: "text",
            color: "#000", 
            padding: "2px 0",
            fontSize: 10,
            textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          <strong>{label}</strong>
          {data.info && <div>{data.info}</div>}
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

  return (
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
        background: "transparent", // Sin fondo para permitir ver solo las líneas
      }}
      labelContent={labelContent}
    >
      {/* X grande negra sin fondo */}
      <div style={{ position: "relative", width: size, height: size, pointerEvents: 'none' }}>
        {/* Línea diagonal \ */}
        <div style={{ 
          position: "absolute",
          width: size * 1.2,
          height: 4,
          backgroundColor: "#000", // Cambiado a negro
          top: size / 2,
          left: -size * 0.1,
          transform: "rotate(45deg)",
          transformOrigin: "center",
          pointerEvents: 'none'
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
          transformOrigin: "center",
          pointerEvents: 'none'
        }} />
      </div>
    </BaseNodeComponent>
  );
};

export default AbortoProvocadoNode;