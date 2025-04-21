import React from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import NodeTextInput from './NodeTextInput';
import useNodeSize from '../../hooks/useNodeSize';
import useNodeEditor from '../../hooks/useNodeEditor';

const MatrimonioNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "Matrimonio", onSave);
  
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
  const year = data?.year || '';
  const status = data?.status || 'activo';
  
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
          background: status === 'activo' ? "#dcfce7" : "#f3f4f6",
          border: `2px solid ${status === 'activo' ? "#16a34a" : "#9ca3af"}`,
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
        {year && <div>Año: {year}</div>}
        <div>Estado: {status}</div>
        <div style={{ fontSize: 10 }}>ID: {id}</div>
      </div>
    </div>
  );
};

export default MatrimonioNode;