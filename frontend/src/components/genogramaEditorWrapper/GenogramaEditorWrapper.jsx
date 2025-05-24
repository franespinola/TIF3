import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";
import { addEdge } from "reactflow";
import nodeTypes from "../../types/nodeTypes";
import edgeTypes from "../../types/edgeTypes";
import Sidebar from "../sidebar/Sidebar";
import FreeDrawOverlay from "../drawing/FreeDrawOverlay";
import SmartGuidesOverlay from "../guides/SmartGuidesOverlay";
import EnhancedMinimap from "../navigation/EnhancedMinimap";
import ThemeVisualizer from "../visualization/ThemeVisualizer";
import ClinicalTabsPanel from "../clinical/ClinicalTabsPanel/ClinicalTabsPanel";
import useGenogramaState from "../../hooks/useGenogramaState";
import useSmartGuides from "../../hooks/useSmartGuides";
import MenuBar from "../menuBar/MenuBar";
import SubMenuBar from "../menuBar/SubMenuBar";
import { transformToReactFlow } from "../../utils/transformToReactFlow";
import useRecorder from "../../hooks/useRecorder";
import layoutWithDagre from "../../utils/layoutWithDagre";
import { normalizeGenogram } from "../../utils/normalizeGenogram";
import genogramService from "../../services/genogramService";

// Constante para la altura del MenuBar - asegúrate de que coincida con el height en MenuBar.jsx
const MENU_BAR_HEIGHT = 48;
// Constante para la altura del SubMenuBar
const SUB_MENU_BAR_HEIGHT = 40;
// Altura total de la barra superior (MenuBar + SubMenuBar)
const TOTAL_MENU_HEIGHT = MENU_BAR_HEIGHT + SUB_MENU_BAR_HEIGHT;

function GenogramaEditorWrapper({ initialData, genogramId, isEditMode = false }) {
  // Obtener el ID del genograma desde los parámetros de la URL como fallback
  const { id: paramGenogramId } = useParams();
  const effectiveGenogramId = genogramId || paramGenogramId;
  
  // Información del genograma que se está editando
  const [genogramInfo, setGenogramInfo] = useState({
    name: "",
    description: "",
    notes: "",
    patient_id: "",
    patientName: ""
  });
  
  // Indicador de carga
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para la conexión seleccionada
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Estado para controlar si el sidebar está colapsado
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Estados para los paneles laterales
  const [isClinicalTabsOpen, setIsClinicalTabsOpen] = useState(false);
  
  // Estados para la visibilidad de los paneles de visualización
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);
  const [showSmartGuidesConfigPanel, setShowSmartGuidesConfigPanel] = useState(false);
  const [showThemeVisualizer, setShowThemeVisualizer] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true); // Cambiado a true para que el minimapa aparezca por defecto
  const [showRelationEditor, setShowRelationEditor] = useState(false); // Nuevo estado para el editor de relaciones
  
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
    onExportCanvas,
    setEdges,
    setNodes,
    updateEdgeRelation,
    updateNodeData,
    saveToDatabase
  } = useGenogramaState();
    // Efecto para cargar los datos iniciales del genograma SOLO en modo creación
  useEffect(() => {
    // Solo procesar initialData si NO estamos en modo edición
    if (!isEditMode && initialData) {
      try {
        console.log('Processing initial data for NEW genogram:', initialData);
        
        // Determinar el formato de los datos recibidos
        if (initialData.nodes && initialData.edges) {
          // Si ya está en formato {nodes, edges}, usarlo directamente
          console.log('Datos recibidos en formato nodes/edges, aplicando directamente');
          
          // Aplicar layout automático con dagre
          const laidOutNodes = layoutWithDagre(initialData.nodes, initialData.edges);
          console.log('Nodes after layout:', laidOutNodes);

          // Setear los nodos y aristas en el estado global del genograma
          setNodes(laidOutNodes);
          setEdges(initialData.edges);
          
        } else if (initialData.people && initialData.relationships) {
          // Si está en formato {people, relationships}, normalizar primero
          // Validar que people y relationships sean arrays
          if (!Array.isArray(initialData.people) || !Array.isArray(initialData.relationships)) {
            console.error('People and relationships must be arrays:', initialData);
            return;
          }

          // Validar que cada persona tenga un ID
          const invalidPeople = initialData.people.filter(person => !person || !person.id);
          if (invalidPeople.length > 0) {
            console.error('Found people without IDs:', invalidPeople);
            return;
          }

          // Normalizar los datos recibidos
          const { nodes: normalizedNodes, edges: normalizedEdges } = normalizeGenogram(initialData);
          console.log('Normalized nodes:', normalizedNodes);
          console.log('Normalized edges:', normalizedEdges);

          if (!normalizedNodes.length) {
            console.warn('No nodes were generated from the initial data');
            return;
          }

          // Aplicar layout automático con dagre
          const laidOutNodes = layoutWithDagre(normalizedNodes, normalizedEdges);
          console.log('Nodes after layout:', laidOutNodes);

          // Setear los nodos y aristas en el estado global del genograma
          setNodes(laidOutNodes);
          setEdges(normalizedEdges);
        } else {
          console.error('Formato de datos no reconocido:', initialData);
          return;
        }
      } catch (error) {
        console.error("Error al procesar el genograma inicial:", error);
      }
    } else if (isEditMode) {
      console.log('En modo edición - los datos se cargarán desde la base de datos');
    } else {
      console.log('No initial data provided to GenogramaEditorWrapper');
    }
  }, [initialData, isEditMode, setNodes, setEdges]);
  
  // Función para actualizar los estilos visuales de un nodo
  const updateNodeStyle = useCallback((nodeId, styleProps) => {
    setNodes(nds => 
      nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...styleProps
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
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
  const { isRecording, isProcessing, toggleRecording } = useRecorder(patientName, handleRecordingResult);

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
    onNodesChange(changes);
  }, [onNodesChange]);

  // Añadir un event listener para la tecla Escape y +/- para grosor
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activeTool) {
        setActiveTool(null);
      }
      if (event.key === '+') {
        setStrokeWidth(prev => Math.min(MAX_STROKE_WIDTH, prev + 1));
      }
      if (event.key === '-') {
        setStrokeWidth(prev => Math.max(MIN_STROKE_WIDTH, prev - 1));
      }
      if (event.key === 'g') {
        toggleSmartGuides();
      }
      if (event.key === 'd') {
        updateGuideOptions('detectDistribution', !guideOptions.detectDistribution);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, toggleSmartGuides, guideOptions.detectDistribution, updateGuideOptions]); 

  // Manejador para conexiones que determina el tipo de conexión basado en los nodos
  const handleConnect = useCallback((params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    const isAnnotationConnection = 
      (sourceNode && ['rectangle', 'circle', 'text', 'note'].includes(sourceNode.type)) || 
      (targetNode && ['rectangle', 'circle', 'text', 'note'].includes(targetNode.type));

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
  
  // Toggle para el panel de pestañas clínicas
  const toggleClinicalTabs = useCallback(() => {
    setIsClinicalTabsOpen(prev => !prev);
  }, []);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);
  // Función para guardar el genograma actual
  const handleSaveGenogram = useCallback(() => {
    if (isLoading) {
      console.log('Guardado ya en proceso, ignorando...');
      return;
    }
    
    console.log('Iniciando guardado manual del genograma...');
    setIsLoading(true);
    
    // Llamar a la función saveToDatabase con los datos del genograma actual
    saveToDatabase({
      genogramId: effectiveGenogramId,
      patientId: genogramInfo.patient_id,
      name: genogramInfo.name,
      description: genogramInfo.description,
      notes: genogramInfo.notes,
      thumbnail: genogramInfo.thumbnail
    }).finally(() => {
      setIsLoading(false);
    });
  }, [effectiveGenogramId, genogramInfo, saveToDatabase, isLoading]);
  // Cargar los detalles del genograma si estamos en modo edición
  useEffect(() => {
    if (effectiveGenogramId && isEditMode) {
      console.log('Cargando genograma desde la base de datos, ID:', effectiveGenogramId);
      setIsLoading(true);
      genogramService.viewGenogram(effectiveGenogramId)        .then(response => {
          const data = response.data;
          console.log('=== DIAGNÓSTICO DE DATOS CARGADOS ===');
          console.log('Datos completos del genograma:', JSON.stringify(data, null, 2));
          console.log('data.data existe?', !!data.data);
          console.log('data.data:', data.data);
          
          if (data.data) {
            console.log('Tipo de data.data:', typeof data.data);
            console.log('data.data.nodes existe?', !!data.data.nodes);
            console.log('data.data.edges existe?', !!data.data.edges);
            console.log('data.data.isSnapshot:', data.data.isSnapshot);
          }
          
          console.log('data.nodes existe?', !!data.nodes);
          console.log('data.edges existe?', !!data.edges);
          console.log('=== FIN DIAGNÓSTICO ===');
          
          setGenogramInfo({
            name: data.name || "Genograma sin título",
            description: data.description || "",
            notes: data.notes || "",
            patient_id: data.patient_id || data.patientId, // Usar cualquiera de los dos campos disponibles
            patientName: data.patientName || "Paciente no disponible",
            thumbnail: data.thumbnail
          });
            // Cargar nodos y aristas del genograma si existen
          if (data.data && data.data.nodes && data.data.edges) {
            console.log('Cargando nodos y aristas del genograma desde backend (formato snapshot)');
            
            // Usar los datos exactamente como están guardados en la DB
            const savedNodes = data.data.nodes;
            const savedEdges = data.data.edges;
            
            console.log('Aplicando datos guardados sin modificaciones:', {
              nodes: savedNodes.length,
              edges: savedEdges.length
            });
            
            // Setear directamente los datos guardados para preservar el estado exacto
            setNodes(savedNodes);
            setEdges(savedEdges);
          } else if (data.data && data.data.people && data.data.relationships) {
            console.log('Cargando genograma en formato people/relationships, convirtiendo a nodes/edges');
            
            try {
              // Normalizar los datos del formato {people, relationships} al formato {nodes, edges}
              const { nodes: normalizedNodes, edges: normalizedEdges } = normalizeGenogram(data.data);
              console.log('Normalized nodes:', normalizedNodes.length);
              console.log('Normalized edges:', normalizedEdges.length);

              if (!normalizedNodes.length) {
                console.warn('No se generaron nodos desde los datos people/relationships');
                return;
              }

              // Aplicar layout automático con dagre
              const laidOutNodes = layoutWithDagre(normalizedNodes, normalizedEdges);
              console.log('Nodes after layout:', laidOutNodes.length);

              // Setear los nodos y aristas normalizados
              setNodes(laidOutNodes);
              setEdges(normalizedEdges);
            } catch (error) {
              console.error('Error al normalizar genograma people/relationships:', error);
            }
          } else if (data.nodes && data.edges) {
            // Fallback si los datos están en el nivel superior
            console.log('Usando datos de nivel superior (data.nodes, data.edges)');
            setNodes(data.nodes);
            setEdges(data.edges);
          } else if (data.people && data.relationships) {
            // Fallback si people/relationships están en el nivel superior
            console.log('Convirtiendo datos people/relationships de nivel superior');
            
            try {
              const { nodes: normalizedNodes, edges: normalizedEdges } = normalizeGenogram(data);
              console.log('Normalized nodes from top level:', normalizedNodes.length);
              console.log('Normalized edges from top level:', normalizedEdges.length);

              if (!normalizedNodes.length) {
                console.warn('No se generaron nodos desde los datos de nivel superior');
                return;
              }

              const laidOutNodes = layoutWithDagre(normalizedNodes, normalizedEdges);
              setNodes(laidOutNodes);
              setEdges(normalizedEdges);
            } catch (error) {
              console.error('Error al normalizar genograma de nivel superior:', error);
            }
          } else {
            console.warn('No se encontraron datos de nodos/aristas en el genograma');
            console.log('Estructura de datos disponible:', Object.keys(data.data || data));
            console.log('Revisando si hay datos en data.data:', data.data);
          }
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar los detalles del genograma:", error);
          setIsLoading(false);
          // Mostrar mensaje de error
          const div = document.createElement("div");
          div.textContent = "Error al cargar los datos del genograma";
          Object.assign(div.style, {
            position: "absolute",
            top: "60px",
            right: "10px",
            background: "#f87171",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            zIndex: 9999,
          });
          document.body.appendChild(div);
          setTimeout(() => document.body.removeChild(div), 3000);
        });
    }
  }, [effectiveGenogramId, isEditMode, setNodes, setEdges]);
  // Añadir manejador de eventos para el atajo de teclado Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detectar Ctrl+S (o Cmd+S en Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevenir el comportamiento por defecto del navegador
        if (!isLoading && genogramInfo.patient_id && isEditMode) {
          console.log('Guardado por atajo de teclado Ctrl+S');
          handleSaveGenogram();
        }
      }
    };    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSaveGenogram, isLoading, genogramInfo.patient_id, isEditMode]);
  
  // Añadir indicador visual de carga
  useEffect(() => {
    // Mostrar u ocultar el indicador de carga en la interfaz
    const loadingIndicator = document.getElementById('saving-indicator');
    
    if (isLoading) {
      if (!loadingIndicator) {
        const indicator = document.createElement('div');
        indicator.id = 'saving-indicator';
        indicator.textContent = 'Guardando...';
        Object.assign(indicator.style, {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#4ade80',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          zIndex: 9999,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(indicator);
      }
    } else {
      if (loadingIndicator) {
        document.body.removeChild(loadingIndicator);
      }
    }
  }, [isLoading]);

  return (
    <>
      <MenuBar
        onImportJSON={onImportJSON}
        onExportJSON={onExportJSON}
        onExportCSV={onExportCSV}
        onExportPNG={onExportPNG}
        onExportJPG={onExportJPG}
        onExportCanvas={onExportCanvas}
        onSaveGenogram={handleSaveGenogram}
        genogramInfo={genogramInfo}
        isLoading={isLoading}
        showNavigationPanel={showNavigationPanel}
        setShowNavigationPanel={setShowNavigationPanel}
        showSmartGuidesConfigPanel={showSmartGuidesConfigPanel}
        setShowSmartGuidesConfigPanel={setShowSmartGuidesConfigPanel}
        showThemeVisualizer={showThemeVisualizer}
        setShowThemeVisualizer={setShowThemeVisualizer}
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        showRelationEditor={showRelationEditor}
        setShowRelationEditor={setShowRelationEditor}
      />
      <SubMenuBar 
        onRelate={onRelate}
        updateEdgeRelation={updateEdgeRelation}
        selectedEdge={selectedEdge}
        setNodes={setNodes}
        setEdges={setEdges}
        edges={edges}
        selectedNode={selectedNode}
        updateNodeStyle={updateNodeStyle}
      />
      <div style={{ 
        display: "flex", 
        height: `calc(100vh - ${TOTAL_MENU_HEIGHT}px)`,
        position: "absolute", 
        top: `${TOTAL_MENU_HEIGHT}px`, 
        left: 0,
        right: 0,
        bottom: 0,
        boxSizing: "border-box",
        overflow: "hidden" 
      }}>
        <Sidebar
          onRelate={onRelate}
          updateEdgeRelation={updateEdgeRelation}
          updateNodeData={updateNodeData}
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          handleUpdateNode={handleUpdateNode}
          onUpdateNodeStyle={updateNodeStyle}
          onSetNodes={setNodes}
          collapsed={sidebarCollapsed}
          onSidebarCollapse={setSidebarCollapsed}          toggleClinicalTabs={toggleClinicalTabs}
          isClinicalTabsOpen={isClinicalTabsOpen}
          isRecording={isRecording}
          isProcessing={isProcessing}
          onRecordToggle={toggleRecording}
          patientName={patientName}
          onPatientNameChange={setPatientName}
          activeTool={activeTool}
          toggleTool={toggleTool}
          drawingColor={drawingColor}
          setDrawingColor={setDrawingColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          enableSmartGuides={enableSmartGuides}
          onToggleSmartGuides={toggleSmartGuides}
          guideOptions={guideOptions}
          updateGuideOptions={updateGuideOptions}
          onImportJSON={onImportJSON}
          onExportJSON={onExportJSON}
          onExportCSV={onExportCSV}
          showRelationEditor={showRelationEditor}
        />
        
        <div
          id="flowWrapper"
          style={{ 
            flexGrow: 1,
            display: "flex", 
            height: "100%",
            position: "relative",
            paddingRight: isClinicalTabsOpen ? "440px" : "0", 
            transition: "padding-right 0.3s ease", 
            boxSizing: "border-box",
            overflow: "hidden"
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            style={{
              width: "100%", 
              height: "100%", 
              background: "#f8f8f8",
              touchAction: "none"
            }}
            nodes={nodes.map((node) => ({
              ...node,
              data: { ...node.data, onEdit: handleEditLabel },
            }))}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
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
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={4}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnScroll={true}
            panOnDrag={true}
            preventScrolling={true}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#555' }
            }}
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Background gap={12} size={1} />
            
            <ThemeVisualizer
              onThemeChange={setCurrentTheme}
              currentTheme={currentTheme}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              isVisible={showThemeVisualizer}
            />
            
            <FreeDrawOverlay 
              selectedDrawingTool={activeTool}
              drawingColor={drawingColor}
              strokeWidth={strokeWidth}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
            />
            
            {/* Siempre renderizar SmartGuidesOverlay cuando está activado, sin importar si el panel es visible */}
            {enableSmartGuides && (
              <SmartGuidesOverlay guides={guides} showDistances={showDistances} isVisible={true} />
            )}
            
            <Panel position="top-right">
              <div style={{
                padding: '6px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: showSmartGuidesConfigPanel ? 'flex' : 'none',
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
            
            <EnhancedMinimap 
              nodes={nodes} 
              isVisible={showMinimap}
              showNavigationPanel={showNavigationPanel}
            />
          </ReactFlow>
        </div>
        
        <ClinicalTabsPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          isOpen={isClinicalTabsOpen}
          onClose={() => setIsClinicalTabsOpen(false)}
          patientName={patientName}
          nodes={nodes}
          edges={edges}
          style={{ right: 0 }} 
        />
      </div>
    </>
  );
}

export default GenogramaEditorWrapper;