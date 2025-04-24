import React from "react";
import MiniIcon from "../sidebar/MiniIcon";

/**
 * Componente que muestra la paleta de herramientas de anotación arrastrables
 */
const AnnotationToolPalette = ({ nodes, activeDrawingTool, handleDrawingToolSelect }) => {
  // Verificar si un tipo de herramienta de anotación está activo
  const isToolActive = (type) => {
    return activeDrawingTool === type;
  };

  // Estilos para los elementos del palette con estado activo
  const paletteItemStyle = (isActive) => ({
    padding: "10px",
    marginBottom: "8px",
    background: isActive ? "#c7f9e2" : "#e5f7ed",
    cursor: "pointer",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
    border: isActive ? "2px solid #059669" : "1px solid #10b981",
    boxShadow: isActive ? "0 0 8px rgba(16, 185, 129, 0.3)" : "none",
    transform: isActive ? "scale(1.02)" : "scale(1)",
  });

  const sectionHeaderStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "10px",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "5px",
    color: "#3b82f6",
  };

  return (
    <div className="annotation-tool-palette">
      <h3 style={sectionHeaderStyle}>Herramientas de Anotación</h3>
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
          >
            <MiniIcon type={item.type} isActive={isActive} />
            <span style={{ 
              marginLeft: "8px",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#059669" : "inherit"
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AnnotationToolPalette;