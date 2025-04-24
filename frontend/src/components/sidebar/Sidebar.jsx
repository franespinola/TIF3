import React, { useState, useEffect } from "react";
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
  isSessionNotesOpen
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  const [activeDrawingTool, setActiveDrawingTool] = useState("");

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

  // Separar el palette en nodos de genograma y herramientas de anotación
  const genogramaNodes = nodePalette.filter(item => !item.isDrawing);
  const drawingNodes = nodePalette.filter(item => item.isDrawing);

  // Manejar la selección de herramientas de anotación
  const handleDrawingToolSelect = (type) => {
    setActiveDrawingTool(type === activeDrawingTool ? "" : type);
  };

  return (
    <div style={sidebarContainerStyle}>
      {/* Botón para colapsar/expandir el sidebar */}
      <CollapseToggle collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Sidebar content hidden when collapsed */}
      {!collapsed && (
        <>
          {/* Controles de grabación */}
          <RecordingControls 
            isRecording={isRecording}
            onRecordToggle={onRecordToggle}
            patientName={patientName}
            onPatientNameChange={onPatientNameChange}
          />

          {/* Paneles laterales */}
          <SidebarPanels 
            toggleClinicalHistory={toggleClinicalHistory}
            isClinicalHistoryOpen={isClinicalHistoryOpen}
            toggleSessionNotes={toggleSessionNotes}
            isSessionNotesOpen={isSessionNotesOpen}
          />

          {/* Herramientas de dibujo */}
          <DrawingTools
            activeTool={activeTool}
            toggleTool={toggleTool}
            drawingColor={drawingColor}
            setDrawingColor={setDrawingColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
          
          {/* Configuración de guías inteligentes */}
          <SmartGuidesConfig
            enableSmartGuides={enableSmartGuides}
            onToggleSmartGuides={onToggleSmartGuides}
            guideOptions={guideOptions}
            updateGuideOptions={updateGuideOptions}
          />
          
          {/* Botón para exportar imagen */}
          {onExportDrawing && (
            <ExportImageButton onExportDrawing={onExportDrawing} />
          )}
          
          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          
          {/* Paleta de nodos de genograma */}
          <GenogramNodePalette nodes={genogramaNodes} />

          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          
          {/* Paleta de herramientas de anotación */}
          <AnnotationToolPalette 
            nodes={drawingNodes} 
            activeDrawingTool={activeDrawingTool}
            handleDrawingToolSelect={handleDrawingToolSelect}
          />

          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          
          {/* Gestor de relaciones */}
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

          <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
          
          {/* Leyenda de relaciones */}
          <RelationshipsLegend />
        </>
      )}
    </div>
  );
}

export default Sidebar;
