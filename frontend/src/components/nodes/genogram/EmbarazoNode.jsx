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

  // Preparar el contenido de la etiqueta separado del nodo
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta del nodo */}
      <div style={{ 
        fontSize: Math.max(size.width * 0.25, 10),
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
      }}>
        {label}
      </div>

      {/* Identificador del nodo */}
      <div style={{ 
        fontSize: 10, 
        marginTop: 2, 
        textAlign: "center",
        color: '#64748b',
        fontFamily: 'monospace',
        opacity: 0.7,
        textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
      }}>
        ID: {id}
        {data.meses && <div>Meses: {data.meses}</div>}
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
        nodeStyles={{
          width: size.width,
          height: size.height,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        labelContent={labelContent}
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
          pointerEvents: 'none'
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
          pointerEvents: 'none'
        }} />
      </BaseNodeComponent>
      
      {editingInterface}
    </>
  );
};

export default EmbarazoNode;