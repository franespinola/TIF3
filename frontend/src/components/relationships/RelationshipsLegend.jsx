import React from "react";

/**
 * Componente que muestra la leyenda con los diferentes tipos de relaciones disponibles
 * Optimizado para un sidebar más angosto
 */
const RelationshipsLegend = () => {
  // Estilo para cada ítem de la leyenda - Reducido margen y tamaño
  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px", // Reducido de 8px
    flexWrap: "nowrap"
  };

  const sectionHeaderStyle = {
    fontSize: "14px", // Reducido de 16px
    fontWeight: "600",
    marginBottom: "8px", // Reducido de 12px
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "5px", // Reducido de 8px
    color: "#475569",
  };
  
  const legendTextStyle = {
    marginLeft: "6px", // Reducido de 8px
    fontSize: "12px", // Reducido de 13px
    color: "#475569",
    whiteSpace: "nowrap" // Evita que los textos se dividan en múltiples líneas
  };

  // Diseño en dos columnas para aprovechar mejor el espacio
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "5px",
    width: "100%"
  };

  return (
    <div className="relationships-legend" style={{ padding: "2px" }}>
      <h4 style={sectionHeaderStyle}>Leyenda de relaciones</h4>

      {/* Diseño en grid para mostrar las relaciones en dos columnas */}
      <div style={gridContainerStyle}>
        {/* Primera columna */}
        <div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path d="M5,10 L55,10" stroke="black" strokeWidth="2" /> {/* Ajustados los puntos para el nuevo ancho */}
            </svg>
            <span style={legendTextStyle}>Matrimonio</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path d="M5,10 L55,10" stroke="black" strokeWidth="2" /> {/* Ajustados los puntos */}
              <line x1="35" y1="0" x2="25" y2="20" stroke="black" strokeWidth="2" /> {/* Desplazados 10px a la izquierda */}
              <line x1="39" y1="0" x2="29" y2="20" stroke="black" strokeWidth="2" /> {/* Desplazados 10px a la izquierda */}
            </svg>
            <span style={legendTextStyle}>Divorcio</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path
                d="M5,10 L55,10"
                stroke="black"
                strokeWidth="2"
                strokeDasharray="4 4"
              /> {/* Ajustados los puntos */}
              <path
                d="M24,8 L30,2 L36,16 L24,16 Z" // Ajustado para el nuevo ancho
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <span style={legendTextStyle}>Cohabitación</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path
                d="M5,10 L55,10"
                stroke="black"
                strokeDasharray="6 3"
                strokeWidth="2"
              /> {/* Ajustados los puntos */}
            </svg>
            <span style={legendTextStyle}>Compromiso</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path
                d="M5,10 L15,0 L25,20 L35,0 L45,20 L55,10" // Ajustada la escala
                stroke="#800000"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span style={legendTextStyle}>Conflicto</span>
          </div>
        </div>
        
        {/* Segunda columna */}
        <div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path 
                d="M5,10 C15,3 25,17 35,10 C45,3 55,10" // Ajustada la escala
                stroke="#ff0000" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>
            <span style={legendTextStyle}>Violencia</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path d="M5,7 L55,7" stroke="#20c997" strokeWidth="2" /> {/* Ajustados los puntos */}
              <path d="M5,13 L55,13" stroke="#20c997" strokeWidth="2" /> {/* Ajustados los puntos */}
            </svg>
            <span style={legendTextStyle}>Cercana</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <line
                x1="5"
                y1="10"
                x2="55"
                y2="10"
                stroke="#888888"
                strokeWidth="2"
                strokeDasharray="6 6"
              /> {/* Ajustados los puntos */}
            </svg>
            <span style={legendTextStyle}>Distante</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="60" height="20"> {/* Reducido de 80 a 60 */}
              <path d="M5,10 L55,10" stroke="gray" strokeWidth="2" /> {/* Ajustados los puntos */}
              <line x1="28" y1="5" x2="28" y2="15" stroke="gray" strokeWidth="3" /> {/* Ajustado posición */}
              <line x1="32" y1="5" x2="32" y2="15" stroke="gray" strokeWidth="3" /> {/* Ajustado posición */}
            </svg>
            <span style={legendTextStyle}>Rota</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipsLegend;