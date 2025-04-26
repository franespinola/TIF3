import React from "react";
import MiniIcon from "../sidebar/MiniIcon";

/**
 * Componente que muestra la paleta de nodos de genograma arrastrables
 * Organizado en 2 columnas con mejor separación horizontal
 */
const GenogramNodePalette = ({ nodes }) => {
  // Contenedor principal con diseño de grid con mayor separación horizontal
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "calc(50% - 8px) calc(50% - 8px)", // Reducido el espacio entre columnas
    gap: "16px", // Reducida la separación horizontal
    width: "100%",
    padding: "2px" // Reducido el padding
  };

  // Estilos para los elementos del palette como botones
  const paletteItemStyle = {
    padding: "6px", // Reducido de 10px a 6px
    background: "#f1f5f9",
    cursor: "grab",
    borderRadius: "6px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    height: "100%",
    border: "1px solid #cbd5e1",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    userSelect: "none",
    margin: "1px" // Reducido de 2px a 1px
  };

  const labelStyle = {
    fontSize: "0.75rem", // Reducido ligeramente el tamaño de fuente
    marginTop: "3px", // Reducido el espacio superior
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    fontWeight: "500"
  };

  const sectionHeaderStyle = {
    fontSize: "1.1rem", // Reducido el tamaño del título
    fontWeight: "600",
    marginBottom: "8px", // Reducido el margen inferior
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "4px", // Reducido el padding inferior
    color: "#3b82f6",
    gridColumn: "1 / span 2" // El título ocupa ambas columnas
  };

  return (
    <div className="genogram-node-palette" style={{ marginBottom: "12px" }}> {/* Reducido el margen inferior */}
      <h3 style={sectionHeaderStyle}>Nodos de Genograma</h3>
      <div style={gridContainerStyle}>
        {nodes.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
            }
            style={{...paletteItemStyle}}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(-1px)"; // Reducido de -2px a -1px
              e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)"; // Reducido el sombreado
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
            }}
          >
            <MiniIcon type={item.type} />
            <span style={labelStyle}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenogramNodePalette;