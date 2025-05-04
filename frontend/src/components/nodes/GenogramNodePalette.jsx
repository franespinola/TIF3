import React from "react";
import MiniIcon from "../sidebar/MiniIcon";

/**
 * Componente que muestra la paleta de nodos de genograma arrastrables
 * Optimizado para un sidebar más angosto
 */
const GenogramNodePalette = ({ nodes }) => {
  // Contenedor principal con diseño de grid más compacto
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "calc(50% - 5px) calc(50% - 5px)", // Reducido el espacio entre columnas
    gap: "10px", // Reducida la separación horizontal más
    width: "100%",
    padding: "1px" // Minimizado el padding
  };

  // Estilos para los elementos del palette como botones - Más compactos
  const paletteItemStyle = {
    padding: "5px", // Reducido más
    background: "#f1f5f9",
    cursor: "grab",
    borderRadius: "5px", // Reducido de 6px a 5px
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    height: "100%",
    border: "1px solid #cbd5e1",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Sombra más sutil
    userSelect: "none",
    margin: "0" // Eliminado el margen
  };

  const labelStyle = {
    fontSize: "0.7rem", // Reducido más el tamaño de fuente
    marginTop: "2px", // Reducido el espacio superior
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    fontWeight: "500"
  };

  const sectionHeaderStyle = {
    fontSize: "0.95rem", // Reducido más el tamaño del título
    fontWeight: "600",
    marginBottom: "6px", // Reducido el margen inferior
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "3px", // Reducido el padding inferior
    color: "#3b82f6",
    gridColumn: "1 / span 2" // El título ocupa ambas columnas
  };

  return (
    <div className="genogram-node-palette" style={{ marginBottom: "10px" }}> {/* Reducido más el margen inferior */}
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
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0px 1px 2px rgba(0, 0, 0, 0.1)";
            }}
          >
            <MiniIcon type={item.type} size={22} /> {/* Reducido el tamaño del ícono si MiniIcon acepta props de tamaño */}
            <span style={labelStyle}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenogramNodePalette;