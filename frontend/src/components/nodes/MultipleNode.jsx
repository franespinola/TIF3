import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useNodeSize from '../../hooks/useNodeSize';
import useNodeEditor from '../../hooks/useNodeEditor';

const MultipleNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "Múltiple", onSave);
  
  // Configuración de tamaño
  const defaultWidth = data?.width || 100;
  const defaultHeight = data?.height || 60;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultWidth, height: defaultHeight },
    80, // min width
    40  // min height
  );
  
  // Configuración específica para múltiples
  const cantidad = data?.cantidad || 2;
  const tipo = data?.tipo || 'gemelos';
  
  // Colores según el tipo
  let bgColor = "#dbeafe"; // azul suave para gemelos
  let borderColor = "#2563eb"; // azul para gemelos
  
  if (tipo === 'trillizos') {
    bgColor = "#fef9c3"; // amarillo suave
    borderColor = "#ca8a04"; // amarillo
  } else if (tipo === 'cuatrillizos') {
    bgColor = "#dcfce7"; // verde suave
    borderColor = "#16a34a"; // verde
  }
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  // Crear los círculos para representar los múltiples nacimientos
  const circles = [];
  const sizePerCircle = size.width / cantidad;
  
  for (let i = 0; i < cantidad; i++) {
    circles.push(
      <div
        key={`circle-${i}`}
        style={{
          width: Math.min(40, sizePerCircle - 10),
          height: Math.min(40, sizePerCircle - 10),
          borderRadius: '50%',
          background: bgColor,
          border: `2px solid ${borderColor}`,
          margin: '0 5px'
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        nodeStyles={{
          width: size.width,
          height: size.height,
          background: 'transparent',
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Contenido del nodo - círculos para representar múltiples */}
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}>
          {circles}
        </div>
      </BaseNodeComponent>
      
      {/* Etiqueta editable debajo */}
      <div style={{ marginTop: 4, textAlign: "center" }}>
        {isEditing ? (
          <input
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ 
              textAlign: "center", 
              fontSize: 12,
              width: Math.max(size.width, 80) 
            }}
          />
        ) : (
          <div 
            onDoubleClick={handleDoubleClick}
            style={{ 
              fontSize: 12,
              fontWeight: "bold",
              cursor: "text"
            }}
          >
            {label}
          </div>
        )}
        
        {/* Información adicional */}
        <div style={{ fontSize: 11 }}>
          {tipo.charAt(0).toUpperCase() + tipo.slice(1)} ({cantidad})
        </div>
        
        {/* Identificador del nodo */}
        <div style={{ fontSize: 10 }}>
          ID: {id}
        </div>
      </div>
    </div>
  );
};

export default MultipleNode;