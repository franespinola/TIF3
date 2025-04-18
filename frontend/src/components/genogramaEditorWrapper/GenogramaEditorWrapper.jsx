import React, { useCallback, useState } from "react";
import ReactFlow, {
  // ReactFlowProvider, // Eliminar importación
  Background,
  Controls,
  MiniMap,
  addEdge
} from "reactflow";
import "reactflow/dist/style.css";

import nodeTypes from "../../nodeTypes";
import edgeTypes from "../../edgeTypes";
import Sidebar from "../sidebar/Sidebar";
import FreeDrawOverlay from "../drawing/FreeDrawOverlay";
import html2canvas from 'html2canvas';
import useGenogramaState from "../../hooks/useGenogramaState";
import MenuBar from "../menuBar/MenuBar";

function GenogramaEditorWrapper() {
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
    setNodes
  } = useGenogramaState();

  const [activeTool, setActiveTool] = useState(null);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const toggleTool = useCallback(tool => {
    setActiveTool(current => current === tool ? null : tool);
  }, []);

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

  return (
    // <ReactFlowProvider> // Eliminar Provider de aquí
      <>
        <MenuBar
          onImportJSON={onImportJSON}
          onExportJSON={onExportJSON}
          onExportCSV={onExportCSV}
          onExportPNG={onExportPNG}
          onExportJPG={onExportJPG}
        />
        <div style={{ display: "flex", height: "100vh" }}>
          <div
            id="flowWrapper"
            style={{ 
              flexGrow: 1,
              height: "100vh",
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
              // Habilitar conexiones para todos los nodos
              connectionMode="loose"
              connectionLineType="straight"
            >
              <MiniMap />
              <Controls />
              <Background gap={12} size={1} />
              {/* Overlay para dibujo libre */}
              <FreeDrawOverlay 
                selectedDrawingTool={activeTool}
                drawingColor={drawingColor}
                strokeWidth={strokeWidth}
                // Pasar estado y setters de React Flow
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
              />
            </ReactFlow>
          </div>
          
          <Sidebar
            onRelate={onRelate}
            onImportJSON={onImportJSON}
            onExportJSON={onExportJSON}
            onExportCSV={onExportCSV}
            onExportPNG={onExportPNG}
            onExportJPG={onExportJPG}
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
    // </ReactFlowProvider> // Eliminar Provider de aquí
  );
}

export default GenogramaEditorWrapper;
