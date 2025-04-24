import React from "react";

/**
 * Componente que gestiona la creación y modificación de relaciones entre nodos
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
  // Estilos para inputs y selects
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const selectStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  // Estilos base para botones
  const baseButtonStyle = {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
  };

  const sectionHeaderStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "10px",
    border: "none",
    paddingBottom: "0",
    color: "#3b82f6",
  };

  return (
    <div className="relationship-manager">
      <h4 style={sectionHeaderStyle}>
        {selectedEdge ? "Modificar relación seleccionada" : "Crear relación"}
      </h4>
      <input
        placeholder="ID origen"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white'}}
        readOnly={selectedEdge !== null}
      />
      <input
        placeholder="ID destino"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white'}}
        readOnly={selectedEdge !== null}
      />
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