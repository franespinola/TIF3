import React from "react";
import MiniIcon from "../../sidebar/MiniIcon";
import usePaletteItemClick from "../../../hooks/usePaletteItemClick";

/**
 * Componente que muestra la paleta de nodos de genograma arrastrables
 * Con funcionalidad mejorada de clic para inserción directa como Lucidchart
 */
const GenogramNodePalette = ({ nodes, activeDrawingTool, handleDrawingToolSelect }) => {
  // Usar hook personalizado para manejar clic en ítems
  const handlePaletteItemClick = usePaletteItemClick(handleDrawingToolSelect);

  // Verificar si un tipo de herramienta está activo
  const isToolActive = (type) => {
    return activeDrawingTool === type;
  };

  // Contenedor principal con diseño flex para 4 columnas
  const gridContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    width: "100%",
    padding: "4px",
    maxHeight: "300px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 #f1f5f9",
  };

  // Agregamos CSS en JS para soporte responsive
  const getWidth = () => {
    if (window.innerWidth <= 480) return "calc(50% - 8px)"; // 2 columnas en móviles
    if (window.innerWidth <= 768) return "calc(33.33% - 8px)"; // 3 columnas en tablets
    return "calc(25% - 8px)"; // 4 columnas por defecto
  };

  // Estilos para los elementos del palette - Estilo consistente con AnnotationToolPalette
  const paletteItemStyle = (isActive) => ({
    padding: "8px", // Consistente con otras secciones
    background: isActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
    cursor: "pointer", // Cambio de grab a pointer para indicar que es clickeable
    borderRadius: "4px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease-in-out",
    border: isActive ? "1px dashed #94a3b8" : "1px solid transparent",
    boxShadow: "none",
    userSelect: "none",
    // Tamaño flexible basado en pantalla
    width: "calc(25% - 8px)", // 4 columnas por defecto
  });

  // Estilos para las etiquetas
  const labelStyle = (isActive) => ({
    fontSize: "0.75rem",
    marginTop: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    fontWeight: isActive ? "500" : "normal",
    color: isActive ? "#475569" : "#64748b"
  });

  const sectionHeaderStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "8px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "6px",
    color: "#475569",
    width: "100%"
  };

  return (
    <div className="genogram-node-palette" style={{ marginBottom: "14px" }}>
      <h3 style={sectionHeaderStyle}>Nodos de Genograma</h3>
      <div style={gridContainerStyle} className="genogram-node-container">
        {nodes.map((item, idx) => {
          const isActive = isToolActive(item.type);
          return (
            <div
              key={`genogram-${item.type}-${idx}`}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
              }
              onClick={() => handlePaletteItemClick(item)} // Usar la función del hook personalizado
              style={{
                ...paletteItemStyle(isActive),
                width: getWidth() // Aplicamos cálculo dinámico del ancho
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
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
      
      {/* Estilos CSS específicos para mejorar el scrollbar en diferentes navegadores */}
      <style dangerouslySetInnerHTML={{ __html: `
        .genogram-node-container::-webkit-scrollbar {
          width: 6px;
        }
        .genogram-node-container::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .genogram-node-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .genogram-node-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (max-width: 768px) {
          .genogram-node-container > div {
            width: calc(33.33% - 8px);
          }
        }
        @media (max-width: 480px) {
          .genogram-node-container > div {
            width: calc(50% - 8px);
          }
        }
      `}} />
    </div>
  );
};

export default GenogramNodePalette;