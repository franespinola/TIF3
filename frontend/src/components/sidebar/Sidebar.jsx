import React, { useState } from "react";
import MiniIcon from "../miniIcon/MiniIcon";
import nodePalette from "../nodePalette/nodePalette";

function Sidebar({
  onRelate,
  onImportJSON,
  onExportJSON,
  onExportCSV,
  onExportPNG,
  onExportJPG,
}) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");

  const relationshipTypes = [
    "matrimonio",
    "divorcio",
    "cohabitacion",
    "compromiso",
    "conflicto",
    "violencia",
    "cercana",
    "distante",
    "rota",
  ];

  // Estilos generales del sidebar
  const sidebarContainerStyle = {
    width: "20vw",
    background: "#f9fafb",
    padding: "20px",
    borderLeft: "1px solid #e0e0e0",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.05)",
    overflowY: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#2c3e50",
  };

  const sectionHeaderStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "10px",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "5px",
    color: "#3b82f6",
  };

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
    transition: "transform 0.2s",
  };

  // Estilo para cada ítem de la leyenda
  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
  };

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

  return (
    <div style={sidebarContainerStyle}>
      <h3 style={sectionHeaderStyle}>Agregar nodo</h3>
      {nodePalette.map((item, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData(
              "application/reactflow",
              JSON.stringify(item)
            )
          }
          style={paletteItemStyle}
        >
          <MiniIcon type={item.type} />
          <span style={{ marginLeft: "8px" }}>{item.label}</span>
        </div>
      ))}

      <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
      <h4
        style={{
          ...sectionHeaderStyle,
          fontSize: "1rem",
          border: "none",
          marginBottom: "10px",
          paddingBottom: "0",
          color: "#3b82f6",
        }}
      >
        Crear relación
      </h4>
      <input
        placeholder="ID origen"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="ID destino"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={inputStyle}
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
      <button
        onClick={() => onRelate(source, target, relType)}
        style={{ ...baseButtonStyle, background: "#3b82f6", color: "white" }}
      >
        Relacionar
      </button>

      <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
      <h4
        style={{
          ...sectionHeaderStyle,
          fontSize: "1rem",
          border: "none",
          marginBottom: "10px",
          paddingBottom: "0",
          color: "#3b82f6",
        }}
      >
        Leyenda de relaciones
      </h4>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
        </svg>
        <span style={{ marginLeft: "8px" }}>Matrimonio</span>
      </div>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
          <line
            x1="45"
            y1="0"
            x2="35"
            y2="20"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="49"
            y1="0"
            x2="39"
            y2="20"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
        <span style={{ marginLeft: "8px" }}>Divorcio</span>
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
        <span style={{ marginLeft: "8px" }}>Cohabitación</span>
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
        <span style={{ marginLeft: "8px" }}>Compromiso</span>
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
        <span style={{ marginLeft: "8px" }}>Conflicto</span>
      </div>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path
            d="M10,10 L70,10"
            stroke="#ff0000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span style={{ marginLeft: "8px" }}>Violencia</span>
      </div>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,7 L70,7" stroke="#20c997" strokeWidth="3" />
          <path d="M10,13 L70,13" stroke="#20c997" strokeWidth="3" />
        </svg>
        <span style={{ marginLeft: "8px" }}>Relación cercana</span>
      </div>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <line
            x1="10"
            y1="10"
            x2="70"
            y2="10"
            stroke="#ff0000"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
        <span style={{ marginLeft: "8px" }}>Relación distante</span>
      </div>

      <div style={legendItemStyle}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="gray" strokeWidth="2" />
          <line x1="38" y1="5" x2="38" y2="15" stroke="gray" strokeWidth="3" />
          <line x1="42" y1="5" x2="42" y2="15" stroke="gray" strokeWidth="3" />
        </svg>
        <span style={{ marginLeft: "8px" }}>Relación rota</span>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
      <h4
        style={{
          ...sectionHeaderStyle,
          fontSize: "1rem",
          border: "none",
          marginBottom: "10px",
          paddingBottom: "0",
          color: "#3b82f6",
        }}
      >
        Importar/Exportar
      </h4>
      <input
        type="file"
        accept=".json"
        onChange={onImportJSON}
        style={inputStyle}
      />
      <button
        onClick={onExportJSON}
        style={{ ...baseButtonStyle, background: "#10b981", color: "white" }}
      >
        Exportar JSON
      </button>
      <button
        onClick={onExportCSV}
        style={{ ...baseButtonStyle, background: "#a855f7", color: "white" }}
      >
        Exportar CSV
      </button>
      <button
        onClick={onExportPNG}
        style={{ ...baseButtonStyle, background: "#0ea5e9", color: "white" }}
      >
        Exportar PNG
      </button>
      <button
        onClick={onExportJPG}
        style={{
          ...baseButtonStyle,
          background: "#ec4899",
          color: "white",
          marginBottom: "0",
        }}
      >
        Exportar JPG
      </button>
    </div>
  );
}

export default Sidebar;
