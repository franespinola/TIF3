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

  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(80, size + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta del nodo */}
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
      }}
      labelContent={labelContent}
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
        alignItems: "center",
        pointerEvents: 'none', // Asegura que no responda a eventos de mouse
      }}>
        {/* X dentro de la forma */}
        <div style={{ 
          position: "relative", 
          width: size * 0.6, 
          height: size * 0.6,
          pointerEvents: 'none'
        }}>
          {/* Línea diagonal \ */}
          <div style={{ 
            position: "absolute",
            width: "100%",
            height: 3,
            backgroundColor: "#000",
            top: "50%",
            transform: "rotate(45deg)",
            transformOrigin: "center",
            pointerEvents: 'none'
          }} />
          
          {/* Línea diagonal / */}
          <div style={{ 
            position: "absolute",
            width: "100%",
            height: 3,
            backgroundColor: "#000",
            top: "50%",
            transform: "rotate(-45deg)",
            transformOrigin: "center",
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    </BaseNodeComponent>
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

  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(80, size + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta del nodo */}
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
      }}
      labelContent={labelContent}
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
        alignItems: "center",
        pointerEvents: 'none'
      }}>
        {/* X dentro del círculo */}
        <div style={{ 
          position: "relative", 
          width: size * 0.6, 
          height: size * 0.6,
          pointerEvents: 'none'
        }}>
          {/* Línea diagonal \ */}
          <div style={{ 
            position: "absolute",
            width: "100%",
            height: 3,
            backgroundColor: "#000",
            top: "50%",
            transform: "rotate(45deg)",
            transformOrigin: "center",
            pointerEvents: 'none'
          }} />
          
          {/* Línea diagonal / */}
          <div style={{ 
            position: "absolute",
            width: "100%",
            height: 3,
            backgroundColor: "#000",
            top: "50%",
            transform: "rotate(-45deg)",
            transformOrigin: "center",
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    </BaseNodeComponent>
  );
};

export { FetoMuertoMujer };
export default FetoMuertoNode;