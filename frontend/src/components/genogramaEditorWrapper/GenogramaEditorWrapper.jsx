import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";
import { addEdge } from "reactflow";
import nodeTypes from "../../nodeTypes";
import edgeTypes from "../../edgeTypes";
import Sidebar from "../sidebar/Sidebar";
import FreeDrawOverlay from "../drawing/FreeDrawOverlay";
import SmartGuidesOverlay from "../guides/SmartGuidesOverlay";
import EnhancedMinimap from "../navigation/EnhancedMinimap";
import ThemeVisualizer from "../visualization/ThemeVisualizer";
import SessionNotesPanel from "../sessionNotesPanel/SessionNotesPanel";
import ClinicalHistoryPanel from "../clinicalHistoryPanel/ClinicalHistoryPanel";
import html2canvas from 'html2canvas';
import useGenogramaState from "../../hooks/useGenogramaState";
import useSmartGuides from "../../hooks/useSmartGuides";
import MenuBar from "../menuBar/MenuBar";
import { transformToReactFlow } from "../../utils/transformToReactFlow";
import useRecorder from "../../hooks/useRecorder";
import layoutWithDagre from "../../utils/layoutWithDagre";

// Constante para la altura del MenuBar - asegúrate de que coincida con el height en MenuBar.jsx
const MENU_BAR_HEIGHT = 48;

// Estilos para los elementos fijos en la parte inferior
const FIXED_CONTROL_STYLES = {
  position: 'absolute', // Cambiado de 'fixed' a 'absolute' para que se posicione respecto al contenedor del canvas
  bottom: '20px',
  left: '20px',
  zIndex: 100,
  background: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '4px',
  padding: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
};

function GenogramaEditorWrapper() {
  // Estado para la conexión seleccionada
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Estados para los paneles laterales
  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);
  const [isSessionNotesOpen, setIsSessionNotesOpen] = useState(false);
  
  // Estado para los modos de visualización
  const [currentTheme, setCurrentTheme] = useState('default');
  
  // Configuración de Smart Guides
  const [enableSmartGuides, setEnableSmartGuides] = useState(true);
  const [guideOptions, setGuideOptions] = useState({
    threshold: 8,              // Distancia para activar las guías
    showDistances: true,       // Mostrar etiquetas de distancia
    enableSnapping: true,      // Activar ajuste automático
    snapThreshold: 5,          // Distancia para activar el snap
    detectDistribution: true   // Detectar distribución equidistante
  });
  
  // Usar nuestro hook personalizado para gestión del genograma
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleEditLabel,
    onRelate,
    onDrop,
    onDragOver,
    onImportJSON,
    onExportJSON,
    onExportCSV,
    onExportPNG,
    onExportJPG,
    setEdges,
    setNodes,
    updateEdgeRelation,
    updateNodeData
  } = useGenogramaState();
  
  // Hook para Smart Guides con opciones configurables
  const {
    guides,
    onNodeDrag,
    onNodeDragStop,
    showDistances
  } = useSmartGuides(guideOptions);

  const [patientName, setPatientName] = useState("");

  // Callback para procesar el resultado tras grabación
  const handleRecordingResult = useCallback((result) => {
    const genData = result.genogram.genogram_data;
    const { nodes: newNodes, edges: newEdges } = transformToReactFlow(genData);
    // Aplicar layout con dagre para ordenar nodos
    const laidOutNodes = layoutWithDagre(newNodes, newEdges);
    setNodes(laidOutNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  // Hook de grabación modularizado
  const { isRecording, toggleRecording } = useRecorder(patientName, handleRecordingResult);

  const [activeTool, setActiveTool] = useState(null);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const MAX_STROKE_WIDTH = 50; // Increased max width
  const MIN_STROKE_WIDTH = 1;

  const toggleTool = useCallback(tool => {
    setActiveTool(current => current === tool ? null : tool);
  }, []);
  
  // Función para alternar las guías inteligentes
  const toggleSmartGuides = useCallback(() => {
    setEnableSmartGuides(prev => !prev);
  }, []);
  
  // Función para actualizar opciones de guías
  const updateGuideOptions = useCallback((key, value) => {
    setGuideOptions(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Manejador personalizado para cambios en nodos que integra Smart Guides
  const handleNodesChange = useCallback((changes) => {
    // Aplicar cambios normales de nodos a través del hook de estado de genograma
    onNodesChange(changes);
  }, [onNodesChange]);

  // Añadir un event listener para la tecla Escape y +/- para grosor
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activeTool) {
        // Deseleccionar la herramienta activa
        setActiveTool(null);
      }
      // Increase stroke width with '+'
      if (event.key === '+') {
        setStrokeWidth(prev => Math.min(MAX_STROKE_WIDTH, prev + 1));
      }
      // Decrease stroke width with '-'
      if (event.key === '-') {
        setStrokeWidth(prev => Math.max(MIN_STROKE_WIDTH, prev - 1));
      }
      // Toggle Smart Guides with 'g'
      if (event.key === 'g') {
        toggleSmartGuides();
      }
      // Toggle distribution detection with 'd'
      if (event.key === 'd') {
        updateGuideOptions('detectDistribution', !guideOptions.detectDistribution);
      }
    };

    // Agregar el event listener
    window.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, toggleSmartGuides, guideOptions.detectDistribution, updateGuideOptions]); 

  const handleExportImage = useCallback(() => {
    const container = document.getElementById('flowWrapper');
    html2canvas(container).then(canvas => {
      const link = document.createElement('a');
      link.download = 'genograma_dibujo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }, []);

  // Manejador para conexiones que determina el tipo de conexión basado en los nodos
  const handleConnect = useCallback((params) => {
    // Encontrar los nodos de origen y destino
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    // Verificar si al menos uno de los nodos es un nodo de anotación
    const isAnnotationConnection = 
      (sourceNode && ['rectangle', 'circle', 'text', 'note'].includes(sourceNode.type)) || 
      (targetNode && ['rectangle', 'circle', 'text', 'note'].includes(targetNode.type));

    // Si es una conexión con un nodo de anotación, usar el tipo de borde annotationEdge
    if (isAnnotationConnection) {
      const newEdge = {
        ...params,
        type: 'annotationEdge',
        animated: true,
        data: {
          stroke: '#555',
          strokeWidth: 1.5,
          dashArray: '5,5',
        }
      };
      setEdges(eds => addEdge(newEdge, eds));
    } else {
      // Para los otros tipos de conexiones, usar el manejador existente
      onConnect(params);
    }
  }, [nodes, onConnect, setEdges]);

  // Manejador para la selección de Edge (conexión)
  const handleEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  }, []);
  
  // Manejador para la selección de Node (nodo)
  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
  }, []);

  // Manejador para limpiar la selección al hacer clic en el fondo
  const handlePaneClick = useCallback(() => {
    setSelectedEdge(null);
    setSelectedNode(null);
  }, []);
  
  // Manejador para actualizar datos del nodo
  const handleUpdateNode = useCallback((nodeId, data) => {
    updateNodeData(nodeId, data);
  }, [updateNodeData]);

  // Toggle para el panel de historia clínica
  const toggleClinicalHistoryPanel = useCallback(() => {
    setIsClinicalHistoryOpen(prev => !prev);
  }, []);
  
  // Toggle para el panel de notas de sesión
  const toggleSessionNotesPanel = useCallback(() => {
    setIsSessionNotesOpen(prev => !prev);
  }, []);

  return (
    <>
      <MenuBar
        onImportJSON={onImportJSON}
        onExportJSON={onExportJSON}
        onExportCSV={onExportCSV}
        onExportPNG={onExportPNG}
        onExportJPG={onExportJPG}
      />
      <div style={{ 
        display: "flex", 
        height: "100vh",
        paddingTop: `${MENU_BAR_HEIGHT}px` // Añadir espacio para el menú fijo
      }}>
        {/* Panel de Historia Clínica */}
        <ClinicalHistoryPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          isOpen={isClinicalHistoryOpen}
          onToggle={toggleClinicalHistoryPanel}
          patientName={patientName}
        />
        
        <div
          id="flowWrapper"
          style={{ 
            flexGrow: 1,
            height: "100%", // Cambiado de 100vh a 100% para ajustarse al contenedor padre
            position: "relative"
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: { ...node.data, onEdit: handleEditLabel },
            }))}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeDrag={enableSmartGuides ? onNodeDrag : undefined}
            onNodeDragStop={enableSmartGuides ? onNodeDragStop : undefined}
            fitView
            snapToGrid
            deleteKeyCode={['Delete', 'Backspace']}
            selectionOnDrag={true}
            multiSelectionKeyCode={null}
            connectionMode="loose"
            connectionLineType="straight"
            onEdgeClick={handleEdgeClick}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
          >
            <Background gap={12} size={1} />
            
            {/* Panel fijo para los controles en la esquina inferior izquierda */}
            <Panel position="bottom-left" style={FIXED_CONTROL_STYLES}>
              <Controls showInteractive={false} />
            </Panel>
            
            {/* Visualizador de Temas */}
            <ThemeVisualizer
              onThemeChange={setCurrentTheme}
              currentTheme={currentTheme}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
            />
            
            {/* Overlay para dibujo libre */}
            <FreeDrawOverlay 
              selectedDrawingTool={activeTool}
              drawingColor={drawingColor}
              strokeWidth={strokeWidth}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
            />
            
            {/* Overlay para guías inteligentes */}
            {enableSmartGuides && (
              <SmartGuidesOverlay guides={guides} showDistances={showDistances} />
            )}
            
            {/* Panel para control de Smart Guides */}
            <Panel position="top-right">
              <div style={{
                padding: '6px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: '6px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enableSmartGuides}
                      onChange={toggleSmartGuides}
                      style={{ marginRight: '5px' }}
                    />
                    Smart Guides {enableSmartGuides ? 'ON' : 'OFF'}
                  </label>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    (Press 'G')
                  </div>
                </div>
                
                {enableSmartGuides && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={guideOptions.detectDistribution}
                          onChange={(e) => updateGuideOptions('detectDistribution', e.target.checked)}
                          style={{ marginRight: '5px' }}
                        />
                        Distribución equidistante
                      </label>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        (Press 'D')
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '11px', marginRight: '5px' }}>
                        Sensibilidad:
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        value={guideOptions.threshold}
                        onChange={(e) => updateGuideOptions('threshold', parseInt(e.target.value))}
                        style={{ width: '80px', height: '6px' }}
                      />
                      <span style={{ fontSize: '10px', color: '#666', marginLeft: '5px' }}>
                        {guideOptions.threshold}px
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Panel>
            
            {/* Mini-mapa mejorado */}
            <EnhancedMinimap nodes={nodes} />
          </ReactFlow>
        </div>
        
        {/* Panel de Notas de Sesión */}
        <SessionNotesPanel
          isOpen={isSessionNotesOpen}
          onToggle={toggleSessionNotesPanel}
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          patientName={patientName}
        />
        
        <Sidebar
          onRelate={onRelate}
          updateEdgeRelation={updateEdgeRelation}
          selectedEdge={selectedEdge}
          onImportJSON={onImportJSON}
          onExportJSON={onExportJSON}
          onExportCSV={onExportCSV}
          onExportPNG={onExportPNG}
          onExportJPG={onExportJPG}
          isRecording={isRecording}
          onRecordToggle={toggleRecording}
          patientName={patientName}
          onPatientNameChange={setPatientName}
          activeTool={activeTool}
          toggleTool={toggleTool}
          drawingColor={drawingColor}
          setDrawingColor={setDrawingColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          onExportDrawing={handleExportImage}
          enableSmartGuides={enableSmartGuides}
          onToggleSmartGuides={toggleSmartGuides}
          guideOptions={guideOptions}
          updateGuideOptions={updateGuideOptions}
          // Añadir togglers para los paneles laterales
          toggleClinicalHistory={toggleClinicalHistoryPanel}
          isClinicalHistoryOpen={isClinicalHistoryOpen}
          toggleSessionNotes={toggleSessionNotesPanel}
          isSessionNotesOpen={isSessionNotesOpen}
        />
      </div>
    </>
  );
}

export default GenogramaEditorWrapper;
