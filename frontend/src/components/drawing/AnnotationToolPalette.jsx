import React from "react";
import MiniIcon from "../sidebar/MiniIcon";

/**
 * Componente que muestra la paleta de herramientas de anotación arrastrables
 * Organizado en 4 columnas con separación horizontal adecuada
 */
const AnnotationToolPalette = ({ nodes, activeDrawingTool, handleDrawingToolSelect }) => {
  // Verificar si un tipo de herramienta de anotación está activo
  const isToolActive = (type) => {
    return activeDrawingTool === type;
  };

  // Contenedor principal con diseño de grid de 4 columnas
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr", // 4 columnas de igual ancho
    columnGap: "15px", // Separación entre columnas (eje X) reducida
    rowGap: "12px", // Separación entre filas (eje Y) reducida
    width: "100%",
    padding: "3px",
    justifyContent: "center" // Centrar las columnas en el contenedor
  };

  // Estilos para los elementos del palette con estado activo
  const paletteItemStyle = (isActive) => ({
    padding: "6px", // Padding más reducido para adaptarse a 4 columnas
    background: isActive ? "#c7f9e2" : "#f1f5f9",
    cursor: "pointer",
    borderRadius: "5px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    border: isActive ? "2px solid #059669" : "1px solid #cbd5e1",
    boxShadow: isActive ? "0 0 8px rgba(16, 185, 129, 0.3)" : "0px 1px 3px rgba(0, 0, 0, 0.1)",
    transform: isActive ? "translateY(-2px)" : "none",
    height: "100%",
    userSelect: "none",
    margin: "1px" // Margen reducido para optimizar espacio
  });

  // Estilo para las etiquetas adaptado a 4 columnas (fuente más pequeña)
  const labelStyle = (isActive) => ({
    fontSize: "0.7rem", // Fuente más pequeña para adaptarse a 4 columnas
    marginTop: "2px", // Reducido el margen superior
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    fontWeight: isActive ? "600" : "500",
    color: isActive ? "#059669" : "inherit"
  });

  const sectionHeaderStyle = {
    fontSize: "1.1rem", // Ligeramente reducido
    fontWeight: "600",
    marginBottom: "8px", // Reducido margen
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "4px",
    color: "#3b82f6",
    gridColumn: "1 / span 4" // El título ocupa las 4 columnas
  };

  return (
    <div className="annotation-tool-palette" style={{ marginBottom: "14px" }}>
      <h3 style={sectionHeaderStyle}>Herramientas de Anotación</h3>
      <div style={gridContainerStyle}>
        {nodes.map((item, idx) => {
          const isActive = isToolActive(item.type);
          return (
            <div
              key={`drawing-${idx}`}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
              }
              onClick={() => handleDrawingToolSelect(item.type)}
              style={paletteItemStyle(isActive)}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(-1px)"; // Reducido de -2px a -1px
                  e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)"; // Efecto de sombra reducido
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <MiniIcon type={item.type} isActive={isActive} />
              <span style={labelStyle(isActive)}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnotationToolPalette;