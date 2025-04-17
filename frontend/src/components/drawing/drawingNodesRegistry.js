import DrawingRectangleNode from './DrawingRectangleNode';
import DrawingCircleNode from './DrawingCircleNode';
import DrawingTextNode from './DrawingTextNode';
import DrawingNoteNode from './DrawingNoteNode';
import { DrawingLineEdge, DrawingArrowEdge } from './DrawingEdges';

// Exportar los tipos de nodos de dibujo
export const drawingNodeTypes = {
  'drawing-rectangle': DrawingRectangleNode,
  'drawing-circle': DrawingCircleNode,
  'drawing-text': DrawingTextNode,
  'drawing-note': DrawingNoteNode,
};

// Exportar los tipos de bordes de dibujo
export const drawingEdgeTypes = {
  'drawing-line': DrawingLineEdge,
  'drawing-arrow': DrawingArrowEdge,
};