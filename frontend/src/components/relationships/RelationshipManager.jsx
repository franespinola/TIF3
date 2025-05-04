import React from "react";

/**
 * Componente que gestiona la creación y modificación de relaciones entre nodos
 * Optimizado para un sidebar más angosto
 */
const RelationshipManager = ({
  source,
  target,
  relType,
  setSource,
  setTarget,
  setRelType,
  onRelate,
  updateEdgeRelation,
  selectedEdge,
  relationshipTypes
}) => {
  // Estilos para inputs y selects - Reducción de tamaño y espaciado
  const inputStyle = {
    width: "100%",
    padding: "6px", // Reducido de 8px
    marginBottom: "8px", // Reducido de 10px
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.85rem" // Añadido tamaño de fuente más pequeño
  };

  const selectStyle = {
    width: "100%",
    padding: "6px", // Reducido de 8px
    marginBottom: "8px", // Reducido de 10px
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.85rem" // Añadido tamaño de fuente más pequeño
  };

  // Estilos base para botones - Reducción de tamaño y espaciado
  const baseButtonStyle = {
    width: "100%",
    padding: "7px", // Reducido de 8px
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "8px", // Reducido de 10px
    fontSize: "0.85rem" // Añadido tamaño de fuente más pequeño
  };

  const sectionHeaderStyle = {
    fontSize: "0.9rem", // Reducido de 1rem
    fontWeight: "600",
    marginBottom: "8px", // Reducido de 10px
    border: "none",
    paddingBottom: "0",
    color: "#3b82f6",
  };

  // Añadir un contenedor con flexbox para colocar inputs de origen y destino en línea
  const inlineContainerStyle = {
    display: 'flex',
    gap: '6px',
    marginBottom: '2px', // Espacio reducido entre la fila de inputs y el siguiente elemento
    width: '100%'
  };

  return (
    <div className="relationship-manager" style={{fontSize: '0.9rem'}}>
      <h4 style={sectionHeaderStyle}>
        {selectedEdge ? "Modificar relación seleccionada" : "Crear relación"}
      </h4>
      
      {/* Contenedor flexbox para inputs de origen y destino en línea */}
      <div style={inlineContainerStyle}>
        <input
          placeholder="ID origen"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white', flex: 1}}
          readOnly={selectedEdge !== null}
        />
        <input
          placeholder="ID destino"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white', flex: 1}}
          readOnly={selectedEdge !== null}
        />
      </div>
      
      <select
        value={relType}
        onChange={(e) => setRelType(e.target.value)}
        style={selectStyle}
      >
        {relationshipTypes.map((rel) => (
          <option key={rel} value={rel}>
            {rel}
          </option>
        ))}
      </select>
      
      {selectedEdge ? (
        <button
          onClick={() => {
            updateEdgeRelation(selectedEdge.id, relType);
          }}
          style={{ ...baseButtonStyle, background: "#10b981", color: "white" }}
        >
          Actualizar Relación
        </button>
      ) : (
        <button
          onClick={() => onRelate(source, target, relType)}
          style={{ ...baseButtonStyle, background: "#3b82f6", color: "white" }}
        >
          Relacionar
        </button>
      )}
    </div>
  );
};

export default RelationshipManager;