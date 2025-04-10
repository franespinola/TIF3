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

  return (
    <div
      style={{
        width: "20vw",
        background: "#f3f4f6",
        padding: 10,
        borderLeft: "1px solid #ccc",
        overflowY: "auto",
      }}
    >
      <h3 className="font-bold mb-2">Agregar nodo</h3>
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
          style={{
            padding: 10,
            marginBottom: 8,
            background: "#e5e7eb",
            cursor: "grab",
            borderRadius: 6,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MiniIcon type={item.type} />
          <span>{item.label}</span>
        </div>
      ))}

      <hr className="my-4" />
      <h4>Crear relación</h4>
      <input
        placeholder="ID origen"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <input
        placeholder="ID destino"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />
      <select
        value={relType}
        onChange={(e) => setRelType(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {relationshipTypes.map((rel) => (
          <option key={rel} value={rel}>
            {rel}
          </option>
        ))}
      </select>
      <button
        onClick={() => onRelate(source, target, relType)}
        style={{
          width: "100%",
          background: "#3b82f6",
          color: "white",
          padding: 6,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Relacionar
      </button>

      <hr className="my-4" />
      <h4>Leyenda de relaciones</h4>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
        </svg>
        <span style={{ marginLeft: 8 }}>Matrimonio</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
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
        <span style={{ marginLeft: 8 }}>Divorcio</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path
            d="M10,10 L70,10"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M38,10 L40,6 L42,10 L42,14 L38,14 Z"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
        <span style={{ marginLeft: 8 }}>Cohabitación</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path
            d="M10,10 L70,10"
            stroke="black"
            strokeDasharray="6 3"
            strokeWidth="2"
          />
        </svg>
        <span style={{ marginLeft: 8 }}>Compromiso</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path
            d="M10,10 L20,0 L30,20 L40,0 L50,20 L60,0 L70,10"
            stroke="#800000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span style={{ marginLeft: 8 }}>Conflicto</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path
            d="M10,10 Q 15,0 20,10 Q 25,20 30,10 Q 35,0 40,10 
               Q 45,20 50,10 Q 55,0 60,10 Q 65,20 70,10"
            stroke="#ff0000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span style={{ marginLeft: 8 }}>Violencia</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path d="M10,7 L70,7" stroke="#20c997" strokeWidth="3" />
          <path d="M10,13 L70,13" stroke="#20c997" strokeWidth="3" />
        </svg>
        <span style={{ marginLeft: 8 }}>Relación cercana</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
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
        <span style={{ marginLeft: 8 }}>Relación distante</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <svg width="80" height="20">
          <path d="M10,10 L70,10" stroke="gray" strokeWidth="2" />
          <line x1="38" y1="5" x2="38" y2="15" stroke="gray" strokeWidth="3" />
          <line x1="42" y1="5" x2="42" y2="15" stroke="gray" strokeWidth="3" />
        </svg>
        <span style={{ marginLeft: 8 }}>Relación rota</span>
      </div>

      <hr className="my-4" />
      <h4>Importar/Exportar</h4>
      <input
        type="file"
        accept=".json"
        onChange={onImportJSON}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button
        onClick={onExportJSON}
        style={{
          width: "100%",
          background: "#10b981",
          color: "white",
          padding: 6,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 6,
        }}
      >
        Exportar JSON
      </button>
      <button
        onClick={onExportCSV}
        style={{
          width: "100%",
          background: "#a855f7",
          color: "white",
          padding: 6,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 6,
        }}
      >
        Exportar CSV
      </button>
      <button
        onClick={onExportPNG}
        style={{
          width: "100%",
          background: "#0ea5e9",
          color: "white",
          padding: 6,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 6,
        }}
      >
        Exportar PNG
      </button>
      <button
        onClick={onExportJPG}
        style={{
          width: "100%",
          background: "#ec4899",
          color: "white",
          padding: 6,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Exportar JPG
      </button>
    </div>
  );
}

export default Sidebar;
