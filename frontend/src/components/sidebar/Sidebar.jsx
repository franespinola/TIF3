import React, { useState, useEffect, useRef } from "react";
import nodePalette from "./nodePalette";
import DrawingTools from "../drawing/DrawingTools";
import SmartGuidesConfig from "../guides/SmartGuidesConfig";
import RecordingControls from "../recording/RecordingControls";
import SidebarPanels from "./SidebarPanels";
import GenogramNodePalette from "../nodes/GenogramNodePalette";
import AnnotationToolPalette from "../drawing/AnnotationToolPalette";
import RelationshipManager from "../relationships/RelationshipManager";
import RelationshipsLegend from "../relationships/RelationshipsLegend";
import ExportImageButton from "../visualization/ExportImageButton";
import CollapseToggle from "./CollapseToggle";
import TooltipPortal from "./TooltipPortal";

// Importar constantes para las alturas de las barras de menú
const MENU_BAR_HEIGHT = 48;
const SUB_MENU_BAR_HEIGHT = 40;
const TOTAL_MENU_HEIGHT = MENU_BAR_HEIGHT + SUB_MENU_BAR_HEIGHT;

/**
 * Componente principal del Sidebar que orquesta todos los subcomponentes de la barra lateral
 */
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
  onExportDrawing,
  toggleClinicalHistory,
  isClinicalHistoryOpen,
  toggleSessionNotes,
  isSessionNotesOpen,
  showRelationEditor = true,
  showRelationLegend = true,
  onSidebarCollapse = () => {} // Callback para avisar al componente padre del estado de colapso
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  const [activeDrawingTool, setActiveDrawingTool] = useState("");
  
  // Estado para manejar qué sección está expandida
  const [expandedSection, setExpandedSection] = useState(null);
  // Estado para tooltip activo
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Lista de tipos de relaciones disponibles
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

  // Actualizar campos si hay una conexión seleccionada
  useEffect(() => {
    if (selectedEdge) {
      setSource(selectedEdge.source);
      setTarget(selectedEdge.target);
      setRelType(selectedEdge.data?.relType || "matrimonio");
    }
  }, [selectedEdge]);

  // Efecto para agregar retraso al mostrar tooltip
  useEffect(() => {
    let tooltipTimer = null;
    
    if (activeTooltip) {
      // Usamos un setTimeout para aplicar la opacidad y transformación después de un breve retraso
      tooltipTimer = setTimeout(() => {
        const tooltipElement = document.getElementById(`tooltip-${activeTooltip}`);
        if (tooltipElement) {
          tooltipElement.style.opacity = '1';
          tooltipElement.style.transform = 'translateY(-50%) translateX(0)';
        }
      }, 300); // 300ms de retraso
    }
    
    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, [activeTooltip]);

  // Función para alternar expandir/colapsar secciones
  const toggleSection = (section) => {
    if (collapsed) {
      setCollapsed(false);
      setExpandedSection(section);
    } else {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  // Separar el palette en nodos de genograma y herramientas de anotación
  const genogramaNodes = nodePalette.filter(item => !item.isDrawing);
  const drawingNodes = nodePalette.filter(item => item.isDrawing);

  // Manejar la selección de herramientas de anotación
  const handleDrawingToolSelect = (type) => {
    setActiveDrawingTool(type === activeDrawingTool ? "" : type);
  };

  // Estilos generales del sidebar - Cambiado a la izquierda y aumentado el ancho
  const sidebarContainerStyle = {
    position: 'fixed',
    top: `${TOTAL_MENU_HEIGHT}px`, 
    bottom: '0',
    left: '0', 
    width: collapsed ? '60px' : '460px', // Aumentado de 380px a 420px para que quepan mejor las herramientas
    transition: 'width 0.3s ease',
    background: "#ffffff",
    overflowX: 'hidden',
    overflowY: 'auto',
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)", 
    borderRight: "1px solid #e2e8f0", 
    zIndex: 1000,
    display: 'flex',
  };

  // Estilo para el contenedor de iconos
  const iconsContainerStyle = {
    width: '60px',
    height: '100%',
    borderRight: collapsed ? 'none' : '1px solid #e2e8f0',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    flexShrink: 0,
  };

  // Estilo para el contenedor de contenido expandido
  const contentContainerStyle = {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#ffffff',
    display: collapsed ? 'none' : 'block',
    padding: '10px 15px',
  };

  // Estilo para secciones
  const sectionStyle = (expanded) => ({
    padding: '10px',
    borderRadius: '0',
    backgroundColor: expanded ? '#f1f5f9' : 'transparent',
    transition: 'all 0.2s ease',
  });

  // Estilo para cabecera de sección
  const sectionHeaderStyle = (expanded) => ({
    padding: '10px 15px',
    backgroundColor: expanded ? '#f1f5f9' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    borderLeft: expanded ? '3px solid #3b82f6' : '3px solid transparent',
    transition: 'all 0.2s ease',
    color: expanded ? '#3b82f6' : '#475569',
  });

  // Estilo para el contenido de las secciones
  const sectionContentStyle = {
    padding: '15px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
  };

  // Estilo para iconos en la barra lateral
  const sidebarIconStyle = (isActive) => ({
    width: '42px',
    height: '42px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px auto',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e0f2fe' : 'transparent',
    color: isActive ? '#0ea5e9' : '#64748b',
    transition: 'all 0.2s ease',
    position: 'relative',
    border: isActive ? '1px solid #bae6fd' : '1px solid transparent',
  });

  // Estilo para tooltip - Modificado para aparecer a la derecha en forma de burbuja
  const tooltipStyle = {
    position: 'absolute',
    left: '100%', // Mantiene posición a la derecha del icono
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '6px',
    marginLeft: '10px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 1100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    opacity: 0,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    transform: 'translateY(-50%) translateX(-5px)',
  };

  // Estilo para la flecha del tooltip
  const tooltipArrowStyle = {
    position: 'absolute',
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%) rotate(45deg)',
    width: '12px',
    height: '12px',
    backgroundColor: '#1e293b',
    zIndex: 1099,
  };

  // Separador para el sidebar
  const dividerStyle = {
    margin: '10px auto',
    width: '80%',
    height: '1px',
    backgroundColor: '#e2e8f0',
  };

  // Mostrar tooltip al pasar el mouse
  const handleTooltipShow = (id) => {
    setActiveTooltip(id);
  };

  // Ocultar tooltip al quitar el mouse
  const handleTooltipHide = () => {
    setActiveTooltip(null);
  };

  // Botón de sidebar con tooltip
  const SidebarIconButton = ({ id, icon, label, isActive, onClick }) => {
    // Referencia al elemento del botón para calcular su posición
    const buttonRef = useRef(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [buttonRect, setButtonRect] = useState(null);
    
    // Mostrar tooltip con retraso
    const handleMouseEnter = () => {
      if (collapsed) {
        handleTooltipShow(id);
        
        if (buttonRef.current) {
          setButtonRect(buttonRef.current.getBoundingClientRect());
          setTimeout(() => setTooltipVisible(true), 300);
        }
      }
    };
    
    // Ocultar tooltip
    const handleMouseLeave = () => {
      handleTooltipHide();
      setTooltipVisible(false);
    };
    
    return (
      <>
        <div
          ref={buttonRef}
          style={sidebarIconStyle(isActive)}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {icon}
        </div>
        
        {/* Renderizar el tooltip a través del portal */}
        {collapsed && (
          <TooltipPortal
            id={id}
            text={label}
            targetRect={buttonRect}
            visible={tooltipVisible && activeTooltip === id}
          />
        )}
      </>
    );
  };

  // Contenido dependiendo de la sección activa
  const renderSectionContent = () => {
    switch (expandedSection) {
      case 'drawing':
        return (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e40af' }}>
              Herramientas de dibujo
            </h2>
            <DrawingTools
              activeTool={activeTool}
              toggleTool={toggleTool}
              drawingColor={drawingColor}
              setDrawingColor={setDrawingColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
            />
          </>
        );
      case 'figuras':
        return (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e40af' }}>
              Figuras
            </h2>
            <GenogramNodePalette nodes={genogramaNodes} />
          </>
        );
      case 'diagramas':
        return (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e40af' }}>
              Diagramas de flujo
            </h2>
            <AnnotationToolPalette 
              nodes={drawingNodes} 
              activeDrawingTool={activeDrawingTool}
              handleDrawingToolSelect={handleDrawingToolSelect}
            />
          </>
        );
      case 'relaciones':
        return (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e40af' }}>
              Gestor de relaciones
            </h2>
            <RelationshipManager 
              source={source}
              target={target}
              relType={relType}
              setSource={setSource}
              setTarget={setTarget}
              setRelType={setRelType}
              onRelate={onRelate}
              updateEdgeRelation={updateEdgeRelation}
              selectedEdge={selectedEdge}
              relationshipTypes={relationshipTypes}
            />
            
            {showRelationLegend && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#64748b' }}>Leyenda de relaciones</h4>
                <RelationshipsLegend />
              </div>
            )}
          </>
        );
      case 'config':
        return (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1e40af' }}>
              Configuración
            </h2>
            <SmartGuidesConfig
              enableSmartGuides={enableSmartGuides}
              onToggleSmartGuides={onToggleSmartGuides}
              guideOptions={guideOptions}
              updateGuideOptions={updateGuideOptions}
            />
            
            {onExportDrawing && (
              <div style={{ marginTop: '15px' }}>
                <ExportImageButton onExportDrawing={onExportDrawing} />
              </div>
            )}
          </>
        );
      default:
        return (
          <>
            <RecordingControls 
              isRecording={isRecording}
              onRecordToggle={onRecordToggle}
              patientName={patientName}
              onPatientNameChange={onPatientNameChange}
            />
            
            <SidebarPanels 
              toggleClinicalHistory={toggleClinicalHistory}
              isClinicalHistoryOpen={isClinicalHistoryOpen}
              toggleSessionNotes={toggleSessionNotes}
              isSessionNotesOpen={isSessionNotesOpen}
            />
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Selecciona una herramienta en el menú lateral para comenzar.
              </p>
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBhdGggZD0iTTggMTRzMS41IDIgNCAyIDQtMiA0LTIiPjwvcGF0aD48bGluZSB4MT0iOSIgeTE9IjkiIHgyPSI5LjAxIiB5Mj0iOSI+PC9saW5lPjxsaW5lIHgxPSIxNSIgeTE9IjkiIHgyPSIxNS4wMSIgeTI9IjkiPjwvbGluZT48L3N2Zz4=" 
                alt="Selecciona una herramienta" 
                style={{ margin: '20px auto', opacity: 0.5 }}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div style={sidebarContainerStyle}>
      {/* Columna izquierda con iconos */}
      <div style={iconsContainerStyle}>
        {/* Botón para colapsar/expandir el sidebar */}
        <div style={{ 
          padding: '10px 0', 
          display: 'flex', 
          justifyContent: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <CollapseToggle 
            collapsed={collapsed} 
            setCollapsed={(value) => {
              setCollapsed(value);
              onSidebarCollapse(value); // Avisar al componente padre del estado de colapso
            }} 
          />
        </div>

        {/* Icono para herramientas de dibujo */}
        <SidebarIconButton
          id="drawing"
          isActive={expandedSection === 'drawing'}
          onClick={() => toggleSection('drawing')}
          label="Herramientas de dibujo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          }
        />

        {/* Icono para figuras */}
        <SidebarIconButton
          id="figuras"
          isActive={expandedSection === 'figuras'}
          onClick={() => toggleSection('figuras')}
          label="Figuras"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          }
        />

        {/* Icono para diagramas de flujo */}
        <SidebarIconButton
          id="diagramas"
          isActive={expandedSection === 'diagramas'}
          onClick={() => toggleSection('diagramas')}
          label="Diagramas de flujo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          }
        />

        {/* Icono para relaciones */}
        {showRelationEditor && (
          <SidebarIconButton
            id="relaciones"
            isActive={expandedSection === 'relaciones'}
            onClick={() => toggleSection('relaciones')}
            label="Relaciones"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <path d="M8 5l-5 7 5 7"></path>
                <path d="M16 5l5 7-5 7"></path>
              </svg>
            }
          />
        )}

        {/* Icono para configuración */}
        <SidebarIconButton
          id="config"
          isActive={expandedSection === 'config'}
          onClick={() => toggleSection('config')}
          label="Configuración"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          }
        />

        <div style={dividerStyle}></div>

        {/* Botón para historia clínica */}
        <SidebarIconButton
          id="historia"
          isActive={isClinicalHistoryOpen}
          onClick={toggleClinicalHistory}
          label="Historia Clínica"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isClinicalHistoryOpen ? "#16a34a" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
          }
        />

        {/* Botón para notas de sesión */}
        <SidebarIconButton
          id="notas"
          isActive={isSessionNotesOpen}
          onClick={toggleSessionNotes}
          label="Notas de Sesión"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isSessionNotesOpen ? "#2563eb" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
              <path d="M9 9h1M9 13h6M9 17h6"/>
            </svg>
          }
        />
      </div>

      {/* Columna derecha con contenido expandido - solo se muestra cuando no está colapsado */}
      {!collapsed && (
        <div style={contentContainerStyle}>
          {renderSectionContent()}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
