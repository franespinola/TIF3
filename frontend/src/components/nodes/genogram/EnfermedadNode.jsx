import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useNodeSize from '../../../hooks/useNodeSize';
import useNodeEditor from '../../../hooks/useNodeEditor';

const EnfermedadNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "Enfermedad", onSave);
  
  // Configuración de tamaño
  const defaultWidth = data?.width || 130;
  const defaultHeight = data?.height || 40;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultWidth, height: defaultHeight },
    80, // min width
    30  // min height
  );
  
  // Extraer información adicional
  const tipo = data?.tipo || '';
  const severidad = data?.severidad || 'media';
  
  // Determinar color basado en severidad
  let bgColor = "#fee2e2"; // rojo suave (alta)
  let borderColor = "#dc2626"; // rojo (alta)
  
  if (severidad === 'baja') {
    bgColor = "#e0f2fe"; // azul suave
    borderColor = "#0284c7"; // azul
  } else if (severidad === 'media') {
    bgColor = "#fef9c3"; // amarillo suave
    borderColor = "#ca8a04"; // amarillo
  }
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        nodeStyles={{
          width: size.width,
          height: size.height,
          background: bgColor,
          border: `2px solid ${borderColor}`,
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Contenido del nodo */}
        <NodeTextInput
          value={label}
          isEditing={isEditing}
          onDoubleClick={handleDoubleClick}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          labelStyle={{
            fontSize: 13,
            fontWeight: "bold"
          }}
        />
      </BaseNodeComponent>
      
      {/* Información adicional debajo */}
      <div style={{ fontSize: 11, marginTop: 4, textAlign: "center" }}>
        {tipo && <div>Tipo: {tipo}</div>}
        <div>Severidad: {severidad}</div>
        <div style={{ fontSize: 10 }}>ID: {id}</div>
      </div>
    </div>
  );
};

export default EnfermedadNode;