import React, { useState, useEffect, useRef } from "react";
import nodePalette from "./nodePalette";
import DrawingTools from "../drawing/DrawingTools";
import SmartGuidesConfig from "../guides/SmartGuidesConfig";
import RecordingControls from "../recording/RecordingControls";
import SidebarPanels from "./SidebarPanels";
import GenogramNodePalette from "../nodes/genogram/GenogramNodePalette";
import AnnotationToolPalette from "../drawing/AnnotationToolPalette";
import RelationshipManager from "../relationships/RelationshipManager";
import CollapseToggle from "./CollapseToggle";
import TooltipPortal from "./TooltipPortal";

const MENU_BAR_HEIGHT = 48;
const SUB_MENU_BAR_HEIGHT = 40;
const TOTAL_MENU_HEIGHT = MENU_BAR_HEIGHT + SUB_MENU_BAR_HEIGHT;

const SIDEBAR_COLLAPSED_WIDTH = 48; 
const SIDEBAR_EXPANDED_DESKTOP = 360; 
const SIDEBAR_EXPANDED_TABLET = 300;
const SIDEBAR_EXPANDED_MOBILE = 280;

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
  toggleClinicalTabs,
  isClinicalTabsOpen,
  showRelationEditor = true,
  onSidebarCollapse = {} 
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  const [activeDrawingTool, setActiveDrawingTool] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getExpandedWidth = () => {
    if (screenWidth <= 480) return SIDEBAR_EXPANDED_MOBILE;
    if (screenWidth <= 768) return SIDEBAR_EXPANDED_TABLET;
    return SIDEBAR_EXPANDED_DESKTOP;
  };

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

  useEffect(() => {
    if (selectedEdge) {
      setSource(selectedEdge.source);
      setTarget(selectedEdge.target);
      setRelType(selectedEdge.data?.relType || "matrimonio");
    }
  }, [selectedEdge]);

  useEffect(() => {
    let tooltipTimer = null;

    if (activeTooltip) {
      tooltipTimer = setTimeout(() => {
        const tooltipElement = document.getElementById(
          `tooltip-${activeTooltip}`
        );
        if (tooltipElement) {
          tooltipElement.style.opacity = "1";
          tooltipElement.style.transform = "translateY(-50%) translateX(0)";
        }
      }, 300); 
    }

    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, [activeTooltip]);

  const toggleSection = (section) => {
    if (collapsed) {
      setCollapsed(false);
      setExpandedSection(section);
    } else {
      if (expandedSection === section) {
        setExpandedSection(null);
      } else {
        setExpandedSection(section);
      }
    }
  };

  const genogramaNodes = nodePalette.filter((item) => !item.isDrawing);
  const drawingNodes = nodePalette.filter((item) => item.isDrawing);

  const handleDrawingToolSelect = (type) => {
    setActiveDrawingTool(type === activeDrawingTool ? "" : type);
  };

  const sidebarContainerStyle = {
    position: "fixed",
    top: `${TOTAL_MENU_HEIGHT}px`,
    bottom: "0",
    left: "0",
    width: collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${getExpandedWidth()}px`,
    transition: "width 0.3s ease",
    background: "#ffffff",
    overflowX: "hidden",
    overflowY: "auto",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    borderRight: "1px solid #e2e8f0",
    zIndex: 1000,
    display: "flex",
  };

  const iconsContainerStyle = {
    width: `${SIDEBAR_COLLAPSED_WIDTH}px`,
    height: "100%",
    borderRight: collapsed ? "none" : "1px solid #e2e8f0",
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    flexShrink: 0,
  };

  const contentContainerStyle = {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    backgroundColor: "#ffffff",
    display: collapsed ? "none" : "block",
    padding: screenWidth <= 768 ? "8px 10px" : "10px 12px",
  };

  const sectionStyle = (expanded) => ({
    padding: screenWidth <= 768 ? "6px" : "8px",
    borderRadius: "0",
    backgroundColor: expanded ? "#f1f5f9" : "transparent",
    transition: "all 0.2s ease",
  });

  const headerStyle = {
    fontSize: screenWidth <= 768 ? "14px" : "16px",
    fontWeight: "600",
    marginBottom: screenWidth <= 768 ? "12px" : "15px",
    color: "#1e40af",
  };

  const sidebarIconStyle = (isActive) => ({
    width: "36px", 
    height: "36px", 
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "6px auto", 
    cursor: "pointer",
    backgroundColor: isActive ? "#e0f2fe" : "transparent",
    color: isActive ? "#0ea5e9" : "#64748b",
    transition: "all 0.2s ease",
    position: "relative",
    border: isActive ? "1px solid #bae6fd" : "1px solid transparent",
  });

  const dividerStyle = {
    margin: "8px auto", 
    width: "70%", 
    height: "1px",
    backgroundColor: "#e2e8f0",
  };

  const handleTooltipShow = (id) => {
    setActiveTooltip(id);
  };

  const handleTooltipHide = () => {
    setActiveTooltip(null);
  };

  const SidebarIconButton = ({ id, icon, label, isActive, onClick }) => {
    const buttonRef = useRef(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [buttonRect, setButtonRect] = useState(null);

    const handleMouseEnter = () => {
      if (collapsed) {
        handleTooltipShow(id);

        if (buttonRef.current) {
          setButtonRect(buttonRef.current.getBoundingClientRect());
          setTimeout(() => setTooltipVisible(true), 300);
        }
      }
    };

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

  const renderSectionContent = () => {
    switch (expandedSection) {
      case "drawing":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Herramientas de dibujo</h2>
            <DrawingTools
              activeTool={activeTool}
              toggleTool={toggleTool}
              drawingColor={drawingColor}
              setDrawingColor={setDrawingColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
            />
          </div>
        );
      case "figuras":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Figuras</h2>
            <GenogramNodePalette 
              nodes={genogramaNodes} 
              activeDrawingTool={activeDrawingTool} 
              handleDrawingToolSelect={handleDrawingToolSelect}
            />
          </div>
        );
      case "diagramas":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Diagramas de flujo</h2>
            <AnnotationToolPalette
              nodes={drawingNodes}
              activeDrawingTool={activeDrawingTool}
              handleDrawingToolSelect={handleDrawingToolSelect}
            />
          </div>
        );
      case "relaciones":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Gestor de relaciones</h2>
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
          </div>
        );
      case "config":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Configuración</h2>
            <SmartGuidesConfig
              enableSmartGuides={enableSmartGuides}
              onToggleSmartGuides={onToggleSmartGuides}
              guideOptions={guideOptions}
              updateGuideOptions={updateGuideOptions}
            />
          </div>
        );
      case "grabacion":
        return (
          <div style={sectionStyle(true)}>
            <h2 style={headerStyle}>Grabación de audio</h2>
            <RecordingControls
              isRecording={isRecording}
              onRecordToggle={onRecordToggle}
              patientName={patientName}
              onPatientNameChange={onPatientNameChange}
            />
          </div>
        );
      default:
        return (
          <div
            style={{
              padding: screenWidth <= 768 ? "15px" : "20px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#64748b",
                fontSize: screenWidth <= 768 ? "13px" : "14px",
              }}
            >
              Selecciona una herramienta en el menú lateral para comenzar.
            </p>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBhdGggZD0iTTggMTRzMS41IDIgNCAyIDQtMiA0LTIiPjwvcGF0aD48bGluZSB4MT0iOSIgeTE9IjkiIHgyPSI5LjAxIiB5Mj0iOSI+PC9saW5lPjxsaW5lIHgxPSIxNSIgeTE9IjkiIHgyPSIxNS4wMSIgeTI9IjkiPjwvbGluZT48L3N2Zz4="
              alt="Selecciona una herramienta"
              style={{
                margin: "15px auto",
                opacity: 0.5,
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <SidebarPanels
              toggleClinicalTabs={toggleClinicalTabs}
              isClinicalTabsOpen={isClinicalTabsOpen}
            />
          </div>
        );
    }
  };

  return (
    <div style={sidebarContainerStyle}>
      <div style={iconsContainerStyle}>
        <div
          style={{
            padding: "8px 0",
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <CollapseToggle
            collapsed={collapsed}
            setCollapsed={(value) => {
              setCollapsed(value);
              onSidebarCollapse(value); 
            }}
          />
        </div>

        <SidebarIconButton
          id="drawing"
          isActive={expandedSection === "drawing"}
          onClick={() => toggleSection("drawing")}
          label="Herramientas de dibujo"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
          }
        />

        <SidebarIconButton
          id="figuras"
          isActive={expandedSection === "figuras"}
          onClick={() => toggleSection("figuras")}
          label="Símbolos de familia"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />

        <SidebarIconButton
          id="diagramas"
          isActive={expandedSection === "diagramas"}
          onClick={() => toggleSection("diagramas")}
          label="Formas y anotaciones"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="5" height="5" rx="1"></rect>
              <rect x="16" y="3" width="5" height="5" rx="1"></rect>
              <rect x="3" y="16" width="5" height="5" rx="1"></rect>
              <path d="M16 18h.01"></path>
              <path d="M21 18h.01"></path>
              <path d="M16 21h.01"></path>
              <path d="M21 21h.01"></path>
              <path d="M8 6h8"></path>
              <path d="M6 8v8"></path>
              <path d="M18 8v8"></path>
              <path d="M8 18h8"></path>
            </svg>
          }
        />

        {showRelationEditor && (
          <SidebarIconButton
            id="relaciones"
            isActive={expandedSection === "relaciones"}
            onClick={() => toggleSection("relaciones")}
            label="Relaciones familiares"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 19H5c-1 0-2-1-2-2v-1a3 3 0 0 1 6 0v1c0 1-1 2-2 2Z"></path>
                <path d="M16 19h-3c-1 0-2-1-2-2v-1a3 3 0 0 1 6 0v1c0 1-1 2-2 2Z"></path>
                <path d="M19 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"></path>
                <path d="M11 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"></path>
                <path d="M3 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"></path>
                <path d="M17.17 19.51c-.44-1.94-1.64-3.49-3.17-4.44"></path>
                <path d="M7 15.07c-1.53.95-2.72 2.5-3.17 4.44"></path>
                <path d="M16.41 7.38c-.34.2-.69.38-1.06.52"></path>
                <path d="M7.59 7.38c.34.2.69.38 1.06.52"></path>
              </svg>
            }
          />
        )}

        <SidebarIconButton
          id="config"
          isActive={expandedSection === "config"}
          onClick={() => toggleSection("config")}
          label="Configuración"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          }
        />

        <div style={dividerStyle}></div>

        <SidebarIconButton
          id="grabacion"
          isActive={expandedSection === "grabacion"}
          onClick={() => toggleSection("grabacion")}
          label="Grabación de audio"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isRecording ? "#ef4444" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
              {isRecording && <circle cx="12" cy="12" r="1" fill="#ef4444" />}
            </svg>
          }
        />

        <SidebarIconButton
          id="historia"
          isActive={isClinicalTabsOpen}
          onClick={toggleClinicalTabs}
          label="Historia Clínica"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isClinicalTabsOpen ? "#16a34a" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          }
        />
      </div>

      {!collapsed && (
        <div style={contentContainerStyle}>
          {renderSectionContent()}
        </div>
      )}

      <style>
        {`
          .sidebar-tooltip {
            position: absolute;
            left: calc(100% + 5px);
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(15, 23, 42, 0.9);
            color: white;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            white-space: nowrap;
            z-index: 100;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease, visibility 0.2s;
          }
          
          .sidebar-tooltip::before {
            content: "";
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: transparent rgba(15, 23, 42, 0.9) transparent transparent;
          }
          
          .sidebar-button:hover .sidebar-tooltip {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}

export default Sidebar;