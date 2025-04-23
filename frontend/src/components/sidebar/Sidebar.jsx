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
  setStrokeWidth,
  enableSmartGuides,
  onToggleSmartGuides,
  guideOptions,
  updateGuideOptions,
  onExportDrawing
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  const [activeDrawingTool, setActiveDrawingTool] = useState("");
  const [showGuideSettings, setShowGuideSettings] = useState(false);

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

  // Ícono para expandir/colapsar configuraciones
  const expandIcon = (expanded) => (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      style={{ 
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <path 
        d="M7 10l5 5 5-5" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );

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
          
          {/* Smart Guides toggle con configuración avanzada */}
          <div style={{ 
            marginTop: '15px', 
            padding: '10px',
            background: enableSmartGuides ? '#e5f6ff' : '#f0f0f0',
            borderRadius: '8px',
            border: `1px solid ${enableSmartGuides ? '#3b82f6' : '#ccc'}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: enableSmartGuides ? '#3b82f6' : '#666'
              }}>
                Guías Inteligentes
              </h4>
              <button 
                onClick={() => setShowGuideSettings(!showGuideSettings)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  opacity: 0.7,
                  color: '#3b82f6'
                }}
              >
                {expandIcon(showGuideSettings)}
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}>
                <input
                  type="checkbox"
                  checked={enableSmartGuides}
                  onChange={onToggleSmartGuides}
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    accentColor: '#3b82f6' 
                  }}
                />
                {enableSmartGuides ? 'Activadas' : 'Desactivadas'}
              </label>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                (Tecla 'G')
              </span>
            </div>
            
            {/* Configuración avanzada de Smart Guides */}
            {enableSmartGuides && showGuideSettings && (
              <div style={{ 
                marginTop: '12px', 
                border: '1px solid #d1e0ff',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}>
                <h5 style={{ 
                  fontSize: '0.9rem', 
                  marginTop: 0, 
                  marginBottom: '10px', 
                  color: '#3b82f6'
                }}>
                  Configuración Avanzada
                </h5>
                
                {/* Opción de distribución equidistante */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#555'
                  }}>
                    <input
                      type="checkbox"
                      checked={guideOptions.detectDistribution}
                      onChange={(e) => updateGuideOptions('detectDistribution', e.target.checked)}
                      style={{ 
                        accentColor: '#3b82f6',
                        width: '14px',
                        height: '14px'
                      }}
                    />
                    Distribución equidistante
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    (Tecla 'D')
                  </span>
                </div>
                
                {/* Opción de ajuste automático */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#555'
                  }}>
                    <input
                      type="checkbox"
                      checked={guideOptions.enableSnapping}
                      onChange={(e) => updateGuideOptions('enableSnapping', e.target.checked)}
                      style={{ 
                        accentColor: '#3b82f6',
                        width: '14px',
                        height: '14px'
                      }}
                    />
                    Ajuste automático
                  </label>
                </div>
                
                {/* Opción de etiquetas de distancia */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#555'
                  }}>
                    <input
                      type="checkbox"
                      checked={guideOptions.showDistances}
                      onChange={(e) => updateGuideOptions('showDistances', e.target.checked)}
                      style={{ 
                        accentColor: '#3b82f6',
                        width: '14px',
                        height: '14px'
                      }}
                    />
                    Mostrar medidas
                  </label>
                </div>
                
                {/* Control de sensibilidad */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  marginBottom: '8px',
                  gap: '4px'
                }}>
                  <label style={{ 
                    fontSize: '0.9rem',
                    color: '#555',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Sensibilidad:</span>
                    <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                      {guideOptions.threshold}px
                    </span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={guideOptions.threshold}
                    onChange={(e) => updateGuideOptions('threshold', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#666'
                  }}>
                    <span>Preciso</span>
                    <span>Flexible</span>
                  </div>
                </div>
                
                {/* Control de umbral de ajuste */}
                {guideOptions.enableSnapping && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <label style={{ 
                      fontSize: '0.9rem',
                      color: '#555',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Umbral de ajuste:</span>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        {guideOptions.snapThreshold}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={guideOptions.snapThreshold}
                      onChange={(e) => updateGuideOptions('snapThreshold', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.7rem',
                      color: '#666'
                    }}>
                      <span>Suave</span>
                      <span>Fuerte</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!showGuideSettings && (
              <p style={{ 
                fontSize: '0.85rem', 
                color: '#4b5563', 
                marginTop: '8px',
                lineHeight: '1.3'
              }}>
                Las guías ayudan a alinear los nodos al arrastrarlos, mostrando líneas cuando se alinean con otros nodos.
              </p>
            )}
          </div>
          
          {/* Botón de exportar imagen */}
          {onExportDrawing && (
            <button
              onClick={onExportDrawing}
              style={{
                ...baseButtonStyle,
                background: '#4f46e5',
                color: 'white',
                marginTop: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Exportar Imagen
            </button>
          )}
          
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
