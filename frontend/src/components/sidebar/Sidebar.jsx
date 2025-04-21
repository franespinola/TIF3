import React, { useState, useEffect } from "react";
import MiniIcon from "./MiniIcon";
import nodePalette from "./nodePalette";
import DrawingTools from "./DrawingTools";

function Sidebar({
  onRelate,
  updateEdgeRelation,
  selectedEdge,
  isRecording,
  onRecordToggle,
  patientName,
  onPatientNameChange,
  activeTool,
  toggleTool,
  drawingColor,
  setDrawingColor,
  strokeWidth,
  setStrokeWidth
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  const [activeDrawingTool, setActiveDrawingTool] = useState("");

  // Actualizar campos si hay una conexión seleccionada
  useEffect(() => {
    if (selectedEdge) {
      setSource(selectedEdge.source);
      setTarget(selectedEdge.target);
      setRelType(selectedEdge.data?.relType || "matrimonio");
    }
  }, [selectedEdge]);

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
    width: collapsed ? '50px' : '20vw',
    transition: 'width 0.3s ease',
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

  // Estilos para los elementos del palette con estado activo
  const paletteItemStyle = (isDrawing = false, isActive = false) => ({
    padding: "10px",
    marginBottom: "8px",
    background: isActive ? "#c7f9e2" : isDrawing ? "#e5f7ed" : "#e5e7eb",
    cursor: isDrawing ? "pointer" : "grab",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
    border: isActive ? "2px solid #059669" : isDrawing ? "1px solid #10b981" : "none",
    boxShadow: isActive ? "0 0 8px rgba(16, 185, 129, 0.3)" : "none",
    transform: isActive ? "scale(1.02)" : "scale(1)",
  });

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

  // Separar el palette en nodos de genograma y herramientas de anotación
  const genogramaNodes = nodePalette.filter(item => !item.isDrawing);
  const drawingNodes = nodePalette.filter(item => item.isDrawing);

  // Base style for collapse toggle button
  const toggleButtonStyle = {
    background: 'linear-gradient(135deg, #e0e5ec, #f5f7fa)',
    border: '1px solid #ccd6e3',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, background 0.3s',
  };

  const toggleButtonAbsoluteStyle = {
    ...toggleButtonStyle,
    top: '4px',       // subir aún más para dejar espacio por encima
    left: '-16px',    // sobresalir medio píxel más
    zIndex: 1001,
  };
  // New arrow icon style for collapse toggle
  const arrowStyle = {
    transition: 'transform 0.3s ease-in-out',
    transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
    stroke: '#4f46e5',
    strokeWidth: 2,
    fill: 'none',
  };

  // Verificar si un tipo de herramienta de anotación está activo
  const isToolActive = (type) => {
    return activeDrawingTool === type;
  };

  // Manejar la selección de herramientas de anotación
  const handleDrawingToolSelect = (type) => {
    setActiveDrawingTool(type === activeDrawingTool ? "" : type);
  };

  return (
    <div style={sidebarContainerStyle}>
      {/* Collapse toggle button */}
      <div style={{ position: 'relative', padding: '8px' }}>
        <button onClick={() => setCollapsed(c => !c)} style={toggleButtonAbsoluteStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" style={arrowStyle}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      {/* Sidebar content hidden when collapsed */}
      {!collapsed && (
        <>
          {/* Input nombre paciente */}
          <input
            placeholder="Nombre Paciente"
            value={patientName}
            onChange={(e) => onPatientNameChange(e.target.value)}
            style={inputStyle}
          />
          {/* Botón de grabar/stop */}
          <button
            onClick={onRecordToggle}
            style={{
              ...baseButtonStyle,
              background: isRecording ? '#e53e3e' : '#38a169',
              color: 'white'
            }}
          >
            {isRecording ? 'Detener' : 'Grabar'}
          </button>
          <DrawingTools
            activeTool={activeTool}
            toggleTool={toggleTool}
            drawingColor={drawingColor}
            setDrawingColor={setDrawingColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          <h3 style={sectionHeaderStyle}>Nodos de Genograma</h3>
          {genogramaNodes.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
              }
              style={paletteItemStyle()}
            >
              <MiniIcon type={item.type} />
              <span style={{ marginLeft: "8px" }}>{item.label}</span>
            </div>
          ))}

          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          
          <h3 style={sectionHeaderStyle}>Herramientas de Anotación</h3>
          {drawingNodes.map((item, idx) => {
            const isActive = isToolActive(item.type);
            return (
              <div
                key={`drawing-${idx}`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("application/reactflow", JSON.stringify(item))
                }
                onClick={() => handleDrawingToolSelect(item.type)}
                style={paletteItemStyle(true, isActive)}
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
            {selectedEdge ? "Modificar relación seleccionada" : "Crear relación"}
          </h4>
          <input
            placeholder="ID origen"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white'}}
            readOnly={selectedEdge !== null}
          />
          <input
            placeholder="ID destino"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{...inputStyle, backgroundColor: selectedEdge ? '#f0f0f0' : 'white'}}
            readOnly={selectedEdge !== null}
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
          {selectedEdge ? (
            <button
              onClick={() => {
                updateEdgeRelation(selectedEdge.id, relType);
              }}
              style={{ ...baseButtonStyle, background: "#10b981", color: "white" }}
            >
              Actualizar Relación
            </button>
          ) : (
            <button
              onClick={() => onRelate(source, target, relType)}
              style={{ ...baseButtonStyle, background: "#3b82f6", color: "white" }}
            >
              Relacionar
            </button>
          )}

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

          {/* Distintos ejemplos de relaciones */}
          <div style={legendItemStyle}>
            <svg width="80" height="20">
              <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
            </svg>
            <span style={{ marginLeft: "8px" }}>Matrimonio</span>
          </div>
          <div style={legendItemStyle}>
            <svg width="80" height="20">
              <path d="M10,10 L70,10" stroke="black" strokeWidth="2" />
              <line x1="45" y1="0" x2="35" y2="20" stroke="black" strokeWidth="2" />
              <line x1="49" y1="0" x2="39" y2="20" stroke="black" strokeWidth="2" />
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
              <path d="M10,10 L70,10" stroke="#ff0000" strokeWidth="2" fill="none" />
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
        </>
      )}
    </div>
  );
}

export default Sidebar;
