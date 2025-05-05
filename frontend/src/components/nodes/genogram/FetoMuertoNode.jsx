import React from 'react';
import BaseNodeComponent from '../../nodes/BaseNodeComponent';
import useNodeEditor from '../../../hooks/useNodeEditor';
import useSquareNode from '../../../hooks/useSquareNode';

// Componente principal FetoMuertoNode (cuadrado con X)
const FetoMuertoNode = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "FM", onSave);
  
  // Tamaño inicial del nodo (más pequeño que masculino/femenino)
  const defaultSize = data?.size || 35;
  
  // Usar el hook para nodos cuadrados
  const [size, resizeHandleRef] = useSquareNode(
    id,
    defaultSize,
    20 // min size
  );
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        }}
      >
        {/* Cuadrado con X adentro */}
        <div style={{ 
          width: size,
          height: size,
          backgroundColor: "white",
          border: "4px solid #000", // Contorno más grueso
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* X dentro de la forma */}
          <div style={{ position: "relative", width: size * 0.6, height: size * 0.6 }}>
            {/* Línea diagonal \ */}
            <div style={{ 
              position: "absolute",
              width: "100%",
              height: 3,
              backgroundColor: "#000",
              top: "50%",
              transform: "rotate(45deg)",
              transformOrigin: "center"
            }} />
            
            {/* Línea diagonal / */}
            <div style={{ 
              position: "absolute",
              width: "100%",
              height: 3,
              backgroundColor: "#000",
              top: "50%",
              transform: "rotate(-45deg)",
              transformOrigin: "center"
            }} />
          </div>
        </div>
      </BaseNodeComponent>

      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 5, textAlign: "center" }}>
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
              width: Math.max(size, 40) 
            }}
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            <strong>{label}</strong>
            {data.info && <div>{data.info}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// Nuevo componente FetoMuertoMujer (círculo con X)
const FetoMuertoMujer = ({ data, id, selected }) => {
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
  } = useNodeEditor(data?.label || "FMM", onSave);
  
  // Tamaño inicial del nodo (más pequeño que masculino/femenino)
  const defaultSize = data?.size || 35;
  
  // Usar el hook para nodos cuadrados (también funciona para círculos)
  const [size, resizeHandleRef] = useSquareNode(
    id,
    defaultSize,
    20 // min size
  );
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        }}
      >
        {/* Círculo con X adentro */}
        <div style={{ 
          width: size,
          height: size,
          backgroundColor: "white",
          border: "4px solid #000", // Contorno grueso
          borderRadius: "50%", // Forma circular
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* X dentro del círculo */}
          <div style={{ position: "relative", width: size * 0.6, height: size * 0.6 }}>
            {/* Línea diagonal \ */}
            <div style={{ 
              position: "absolute",
              width: "100%",
              height: 3,
              backgroundColor: "#000",
              top: "50%",
              transform: "rotate(45deg)",
              transformOrigin: "center"
            }} />
            
            {/* Línea diagonal / */}
            <div style={{ 
              position: "absolute",
              width: "100%",
              height: 3,
              backgroundColor: "#000",
              top: "50%",
              transform: "rotate(-45deg)",
              transformOrigin: "center"
            }} />
          </div>
        </div>
      </BaseNodeComponent>

      {/* Identificador del nodo */}
      <div style={{ fontSize: 10, marginTop: 5, textAlign: "center" }}>
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
              width: Math.max(size, 40) 
            }}
          />
        ) : (
          <div onDoubleClick={handleDoubleClick}>
            <strong>{label}</strong>
            {data.info && <div>{data.info}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export { FetoMuertoMujer };
export default FetoMuertoNode;