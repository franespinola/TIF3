import React from "react";
import MiniIcon from "../sidebar/MiniIcon";
import usePaletteItemClick from "../../hooks/usePaletteItemClick";

/**
 * Componente que muestra la paleta de herramientas de anotación arrastrables
 * Con estilo inspirado en Lucidchart: más limpio y con mejor usabilidad
 */
const AnnotationToolPalette = ({ nodes, activeDrawingTool, handleDrawingToolSelect }) => {
  // Usar el hook personalizado para manejar clics en los elementos de la paleta
  const handlePaletteItemClick = usePaletteItemClick(handleDrawingToolSelect);
  
  // Verificar si un tipo de herramienta de anotación está activo
  const isToolActive = (type) => {
    return activeDrawingTool === type;
  };

  // Separar los nodos por categoría
  const basicNodes = nodes.filter(node => !node.category);
  const flowchartNodes = nodes.filter(node => node.category === 'flowchart');

  // Contenedor principal con flex-wrap para una disposición fluida
  const flowchartContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    width: "100%",
    maxHeight: "300px",
    overflowY: "auto",
    padding: "4px",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 #f1f5f9",
  };

  // Estilos para los elementos de la paleta al estilo Lucidchart: limpios sin efectos de botón
  const paletteItemStyle = (isActive) => ({
    padding: "8px",
    background: isActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
    cursor: "pointer",
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
    "@media (maxWidth: 768px)": {
      width: "calc(33.33% - 8px)", // 3 columnas en tablets
    },
    "@media (maxWidth: 480px)": {
      width: "calc(50% - 8px)", // 2 columnas en móviles
    },
  });

  // Agregamos CSS en JS para soporte responsive
  const getWidth = () => {
    if (window.innerWidth <= 480) return "calc(50% - 8px)"; // 2 columnas
    if (window.innerWidth <= 768) return "calc(33.33% - 8px)"; // 3 columnas
    return "calc(25% - 8px)"; // 4 columnas
  };

  // Estilo para las etiquetas
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

  // Estilos para los encabezados de sección
  const sectionHeaderStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "8px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "6px",
    color: "#475569",
    width: "100%",
    marginTop: "15px"
  };

  // Primer encabezado sin margen superior
  const firstSectionHeaderStyle = {
    ...sectionHeaderStyle,
    marginTop: 0
  };

  // Función para renderizar nodos en el contenedor flex
  const renderNodes = (nodeList) => {
    return nodeList.map((item, idx) => {
      const isActive = isToolActive(item.type);
      return (
        <div
          key={`drawing-${item.type}-${idx}`}
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
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)"; // Hover suave como solicitado
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
    });
  };

  return (
    <div className="annotation-tool-palette" style={{ marginBottom: "14px" }}>
      {/* Sección de herramientas básicas de anotación */}
      <h3 style={firstSectionHeaderStyle}>Herramientas de Anotación</h3>
      <div style={flowchartContainerStyle}>
        {renderNodes(basicNodes)}
      </div>

      {/* Sección de formas para diagramas de flujo con estilo Lucidchart */}
      <h3 style={sectionHeaderStyle}>Formas de Diagrama de Flujo</h3>
      <div style={flowchartContainerStyle} className="flowchart-shapes-container">
        {renderNodes(flowchartNodes)}
      </div>

      {/* Estilos CSS específicos para mejorar el scrollbar en diferentes navegadores */}
      <style dangerouslySetInnerHTML={{ __html: `
        .flowchart-shapes-container::-webkit-scrollbar {
          width: 6px;
        }
        .flowchart-shapes-container::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .flowchart-shapes-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .flowchart-shapes-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (max-width: 768px) {
          .flowchart-shapes-container > div {
            width: calc(33.33% - 8px);
          }
        }
        @media (max-width: 480px) {
          .flowchart-shapes-container > div {
            width: calc(50% - 8px);
          }
        }
      `}} />
    </div>
  );
};

export default AnnotationToolPalette;