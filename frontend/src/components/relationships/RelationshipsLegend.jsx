import React from "react";

/**
 * Componente que muestra la leyenda con los diferentes tipos de relaciones disponibles
 * Con tamaño de fuente ajustado para coincidir con la pestaña Relación
 */
const RelationshipsLegend = () => {
  // Estilo para cada ítem de la leyenda
  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  };

  const sectionHeaderStyle = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "8px",
    color: "#475569",
  };
  
  const legendTextStyle = {
    marginLeft: "8px",
    fontSize: "13px", // Tamaño de fuente consistente con la pestaña Relación
    color: "#475569",
  };

  return (
    <div className="relationships-legend" style={{ padding: "4px" }}>
      <h4 style={sectionHeaderStyle}>Leyenda de relaciones</h4>

      {/* Distintos ejemplos de relaciones */}
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
        </svg>
        <span style={legendTextStyle}>Matrimonio</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
          <line x1="45" y1="0" x2="35" y2="20" stroke="black" strokeWidth="2" />
          <line x1="49" y1="0" x2="39" y2="20" stroke="black" strokeWidth="2" />
        </svg>
        <span style={legendTextStyle}>Divorcio</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path
            d="M10,10 L70,10"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M34,8 L40,2 L46,8 L46,16 L34,16 Z"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
        <span style={legendTextStyle}>Cohabitación</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path
            d="M10,10 L70,10"
            stroke="black"
            strokeDasharray="6 3"
            strokeWidth="2"
          />
        </svg>
        <span style={legendTextStyle}>Compromiso</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path
            d="M10,10 L20,0 L30,20 L40,0 L50,20 L60,0 L70,10"
            stroke="#800000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span style={legendTextStyle}>Conflicto</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          {/* Línea ondulada para violencia */}
          <path 
            d="M10,10 C20,3 30,17 40,10 C50,3 60,17 70,10" 
            stroke="#ff0000" 
            strokeWidth="2" 
            fill="none" 
          />
        </svg>
        <span style={legendTextStyle}>Violencia</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,7 L70,7" stroke="#20c997" strokeWidth="2" />
          <path d="M10,13 L70,13" stroke="#20c997" strokeWidth="2" />
        </svg>
        <span style={legendTextStyle}>Relación cercana</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <line
            x1="10"
            y1="10"
            x2="70"
            y2="10"
            stroke="#888888"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
        <span style={legendTextStyle}>Relación distante</span>
      </div>
      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="gray" strokeWidth="2" />
          <line x1="38" y1="5" x2="38" y2="15" stroke="gray" strokeWidth="3" />
          <line x1="42" y1="5" x2="42" y2="15" stroke="gray" strokeWidth="3" />
        </svg>
        <span style={legendTextStyle}>Relación rota</span>
      </div>
    </div>
  );
};

export default RelationshipsLegend;