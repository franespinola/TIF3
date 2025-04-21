import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

import nodeTypes from "../../nodeTypes";
import edgeTypes from "../../edgeTypes";
import Sidebar from "../sidebar/Sidebar";
import FreeDrawOverlay from "../drawing/FreeDrawOverlay";
import html2canvas from 'html2canvas';
import useGenogramaState from "../../hooks/useGenogramaState";
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

const FIXED_MINIMAP_STYLES = {
  position: 'absolute', // Cambiado de 'fixed' a 'absolute' para que se posicione respecto al contenedor del canvas
  bottom: '20px',
  right: '20px',
  zIndex: 100,
  background: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '4px',
  padding: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
};

function GenogramaEditorWrapper() {
  // Estado para la conexión seleccionada
  const [selectedEdge, setSelectedEdge] = useState(null);
  
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
    updateEdgeRelation
  } = useGenogramaState();

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
    };

    // Agregar el event listener
    window.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool]); // Dependencia: activeTool

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

  // Manejador para limpiar la selección al hacer clic en el fondo
  const handlePaneClick = useCallback(() => {
    setSelectedEdge(null);
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            deleteKeyCode={['Delete', 'Backspace']}
            selectionOnDrag={true}
            multiSelectionKeyCode={null}
            connectionMode="loose"
            connectionLineType="straight"
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
          >
            <Background gap={12} size={1} />
            
            {/* Panel fijo para los controles en la esquina inferior izquierda */}
            <Panel position="bottom-left" style={FIXED_CONTROL_STYLES}>
              <Controls showInteractive={false} />
            </Panel>
            
            {/* Panel fijo para el minimap en la esquina inferior derecha */}
            <Panel position="bottom-right" style={FIXED_MINIMAP_STYLES}>
              <MiniMap 
                nodeStrokeWidth={3}
                zoomable 
                pannable
              />
            </Panel>
            
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
          </ReactFlow>
        </div>
        
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
        />
      </div>
    </>
  );
}

export default GenogramaEditorWrapper;
