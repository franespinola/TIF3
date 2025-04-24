import React from "react";
import MiniIcon from "../sidebar/MiniIcon";

/**
 * Componente que muestra la paleta de nodos de genograma arrastrables
 */
const GenogramNodePalette = ({ nodes }) => {
  // Estilos para los elementos del palette
  const paletteItemStyle = {
    padding: "10px",
    marginBottom: "8px",
    background: "#e5e7eb",
    cursor: "grab",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
  };

  const sectionHeaderStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "10px",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "5px",
    color: "#3b82f6",
  };

  return (
    <div className="genogram-node-palette">
      <h3 style={sectionHeaderStyle}>Nodos de Genograma</h3>
      {nodes.map((item, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
          }
          style={paletteItemStyle}
        >
          <MiniIcon type={item.type} />
          <span style={{ marginLeft: "8px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GenogramNodePalette;