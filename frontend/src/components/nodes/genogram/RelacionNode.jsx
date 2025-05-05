import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from '../NodeTextInput';
import useNodeSize from '../../../hooks/useNodeSize';
import useNodeEditor from '../../../hooks/useNodeEditor';

const RelacionNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "Relación", onSave);
  
  // Configuración de tamaño
  const defaultWidth = data?.width || 120;
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
  const tipo = data?.tipo || 'amistad';
  const intensidad = data?.intensidad || 'normal';
  
  // Determinar color basado en el tipo de relación
  let bgColor = "#e0f2fe"; // azul suave (amistad)
  let borderColor = "#0284c7"; // azul (amistad)
  
  if (tipo === 'conflicto') {
    bgColor = "#fee2e2"; // rojo suave
    borderColor = "#dc2626"; // rojo
  } else if (tipo === 'apoyo') {
    bgColor = "#dcfce7"; // verde suave
    borderColor = "#16a34a"; // verde
  } else if (tipo === 'amor') {
    bgColor = "#fecdd3"; // rosa suave
    borderColor = "#be185d"; // rosa
  }
  
  // Modificar el estilo según la intensidad
  let borderStyle = "solid";
  let borderWidth = 2;
  
  if (intensidad === 'fuerte') {
    borderWidth = 3;
  } else if (intensidad === 'débil') {
    borderStyle = "dashed";
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
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
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
        <div>Tipo: {tipo}</div>
        <div>Intensidad: {intensidad}</div>
        <div style={{ fontSize: 10 }}>ID: {id}</div>
      </div>
    </div>
  );
};

export default RelacionNode;