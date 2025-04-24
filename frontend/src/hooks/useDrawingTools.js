import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

// Tipos de formas que podemos dibujar
const SHAPE_TYPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TEXT: 'text',
  LINE: 'line',
  ARROW: 'arrow',
  NOTE: 'note',
};

/**
 * Hook personalizado para manejar las herramientas de dibujo
 * Usa nodos de React Flow en lugar de una capa separada
 */
export default function useDrawingTools() {
  // Herramienta seleccionada actualmente
  const [activeTool, setActiveTool] = useState(null);
  
  // Estado para mantener las formas dibujadas (como nodos de React Flow)
  const [drawingNodes, setDrawingNodes] = useState([]);
  const [drawingEdges, setDrawingEdges] = useState([]);

  /**
   * Alterna la selección de una herramienta (selección/deselección)
   */
  const toggleTool = useCallback((toolId) => {
    setActiveTool(current => current === toolId ? null : toolId);
  }, []);

  /**
   * Crea un nuevo nodo de dibujo en la posición especificada
   */
  const createDrawingNode = useCallback((type, position, data = {}) => {
    const id = `drawing-${type}-${nanoid(6)}`;
    
    let nodeData = {
      id,
      type: `drawing-${type}`,
      position,
      draggable: true,
      connectable: false,
      data: {
        ...data,
        isDrawing: true,
      }
    };
    
    setDrawingNodes(prev => [...prev, nodeData]);
    return id;
  }, []);

  /**
   * Crea una nueva línea o flecha
   */
  const createDrawingEdge = useCallback((type, source, target, data = {}) => {
    const id = `drawing-${type}-${nanoid(6)}`;
    
    const edgeData = {
      id,
      source,
      target,
      type: `drawing-${type}`,
      data: {
        ...data,
        isDrawing: true,
      }
    };
    
    setDrawingEdges(prev => [...prev, edgeData]);
    return id;
  }, []);

  /**
   * Maneja un clic en el área de dibujo
   */
  const handleCanvasClick = useCallback((event, position) => {
    if (!activeTool) return;
    
    switch (activeTool) {
      case SHAPE_TYPES.RECTANGLE:
        createDrawingNode(SHAPE_TYPES.RECTANGLE, position, {
          width: 100,
          height: 80,
          color: '#000000',
          fill: 'transparent'
        });
        break;
        
      case SHAPE_TYPES.CIRCLE:
        createDrawingNode(SHAPE_TYPES.CIRCLE, position, {
          radius: 40,
          color: '#000000',
          fill: 'transparent'
        });
        break;
        
      case SHAPE_TYPES.TEXT:
        const text = window.prompt('Ingrese texto:', '');
        if (text) {
          createDrawingNode(SHAPE_TYPES.TEXT, position, {
            text,
            fontSize: 16,
            color: '#000000'
          });
        }
        break;
        
      case SHAPE_TYPES.NOTE:
        const noteText = window.prompt('Ingrese nota:', '');
        if (noteText) {
          createDrawingNode(SHAPE_TYPES.NOTE, position, {
            text: noteText,
            width: 150,
            height: 100,
            color: '#000000',
            fill: '#FFFF88',
            border: '#E6C000'
          });
        }
        break;
        
      // Para línea y flecha, necesitamos un enfoque especial con nodos temporales
      case SHAPE_TYPES.LINE:
      case SHAPE_TYPES.ARROW:
        const sourceId = `drawing-source-${nanoid(6)}`;
        const targetId = `drawing-target-${nanoid(6)}`;
        
        // Crear nodos invisibles de origen y destino
        setDrawingNodes(prev => [
          ...prev,
          {
            id: sourceId,
            type: 'default',
            position,
            width: 1,
            height: 1,
            style: { opacity: 0, pointerEvents: 'none' }
          },
          {
            id: targetId,
            type: 'default',
            position: { x: position.x + 100, y: position.y + 100 },
            width: 1,
            height: 1,
            style: { opacity: 0, pointerEvents: 'none' }
          }
        ]);
        
        // Crear la línea o flecha entre estos nodos
        createDrawingEdge(
          activeTool === SHAPE_TYPES.ARROW ? 'arrow' : 'line',
          sourceId,
          targetId,
          { color: '#000000', strokeWidth: 2 }
        );
        break;
        
      default:
        break;
    }
  }, [activeTool, createDrawingNode, createDrawingEdge]);

  /**
   * Elimina un nodo o borde de dibujo
   */
  const deleteDrawingElement = useCallback((id) => {
    if (id.startsWith('drawing-edge-')) {
      setDrawingEdges(prev => prev.filter(edge => edge.id !== id));
    } else {
      setDrawingNodes(prev => prev.filter(node => node.id !== id));
    }
  }, []);

  /**
   * Limpia todos los elementos de dibujo
   */
  const clearDrawings = useCallback(() => {
    setDrawingNodes([]);
    setDrawingEdges([]);
  }, []);

  return {
    activeTool,
    toggleTool,
    drawingNodes,
    drawingEdges,
    setDrawingNodes, // Exponemos los setters para permitir actualizaciones externas
    setDrawingEdges, // Exponemos los setters para permitir actualizaciones externas
    handleCanvasClick,
    deleteDrawingElement,
    createDrawingNode,
    createDrawingEdge,
    clearDrawings,
    SHAPE_TYPES
  };
}