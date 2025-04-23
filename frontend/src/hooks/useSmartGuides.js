import { useState, useCallback, useMemo } from 'react';
import { useReactFlow } from 'reactflow';

/**
 * Hook para implementar Smart Guides (guías inteligentes) al estilo LucidChart al mover nodos en React Flow
 * 
 * @param {Object} options - Opciones de configuración para el comportamiento de las guías
 * @param {number} options.threshold - Distancia en píxeles para activar las guías (default: 5)
 * @param {boolean} options.showDistances - Mostrar distancias entre nodos (default: true)
 * @param {boolean} options.enableSnapping - Activar ajuste automático a la guía (default: true)
 * @param {number} options.snapThreshold - Distancia para activar el snap (default: 5)
 * @param {boolean} options.detectDistribution - Detectar distribución equidistante (default: true)
 * @returns {Object} - Guías y funciones para manejarlas
 */
export default function useSmartGuides({
  threshold = 5,
  showDistances = true,
  enableSnapping = true,
  snapThreshold = 5,
  detectDistribution = true
} = {}) {
  // Estado para las guías detectadas
  const [guides, setGuides] = useState({
    horizontal: [], // Guías horizontales [{pos, start, end, distance, type}]
    vertical: [],   // Guías verticales [{pos, start, end, distance, type}]
    distances: []   // Guías de distribución equidistante
  });
  
  // Estado para el nodo que se está arrastrando
  const [draggingNode, setDraggingNode] = useState(null);
  
  // Acceso a React Flow
  const { getNodes } = useReactFlow();
  
  /**
   * Calcula los puntos de referencia de un nodo (centro, bordes)
   */
  const getNodeReferencePoints = useCallback((node) => {
    const { x, y, width = 0, height = 0 } = node.position ? 
      { ...node.position, width: node.width, height: node.height } : 
      { x: 0, y: 0, width: 0, height: 0 };
    
    return {
      center: {
        x: x + width / 2,
        y: y + height / 2
      },
      edges: {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height
      }
    };
  }, []);
  
  /**
   * Comprueba alineación entre dos nodos y genera guías
   */
  const checkAlignment = useCallback((movingNode, staticNode) => {
    if (!movingNode || !staticNode || movingNode.id === staticNode.id) return null;
    
    const movingPoints = getNodeReferencePoints(movingNode);
    const staticPoints = getNodeReferencePoints(staticNode);
    
    const result = {
      horizontal: [],
      vertical: []
    };
    
    // Comprobar alineación horizontal (Y)
    // 1. Centro con centro
    const centerYDiff = Math.abs(movingPoints.center.y - staticPoints.center.y);
    if (centerYDiff <= threshold) {
      result.horizontal.push({
        pos: staticPoints.center.y,
        start: Math.min(movingPoints.edges.left, staticPoints.edges.left),
        end: Math.max(movingPoints.edges.right, staticPoints.edges.right),
        distance: centerYDiff,
        type: 'center-center'
      });
    }
    
    // 2. Bordes superior con superior
    const topDiff = Math.abs(movingPoints.edges.top - staticPoints.edges.top);
    if (topDiff <= threshold) {
      result.horizontal.push({
        pos: staticPoints.edges.top,
        start: Math.min(movingPoints.edges.left, staticPoints.edges.left),
        end: Math.max(movingPoints.edges.right, staticPoints.edges.right),
        distance: topDiff,
        type: 'top-top'
      });
    }
    
    // 3. Bordes inferior con inferior
    const bottomDiff = Math.abs(movingPoints.edges.bottom - staticPoints.edges.bottom);
    if (bottomDiff <= threshold) {
      result.horizontal.push({
        pos: staticPoints.edges.bottom,
        start: Math.min(movingPoints.edges.left, staticPoints.edges.left),
        end: Math.max(movingPoints.edges.right, staticPoints.edges.right),
        distance: bottomDiff,
        type: 'bottom-bottom'
      });
    }
    
    // 4. Borde inferior con superior (para espaciado)
    const bottomTopDiff = Math.abs(movingPoints.edges.bottom - staticPoints.edges.top);
    if (bottomTopDiff <= threshold) {
      result.horizontal.push({
        pos: staticPoints.edges.top,
        start: Math.min(movingPoints.edges.left, staticPoints.edges.left),
        end: Math.max(movingPoints.edges.right, staticPoints.edges.right),
        distance: bottomTopDiff,
        type: 'bottom-top',
        isSpacing: true
      });
    }
    
    // 5. Borde superior con inferior (para espaciado)
    const topBottomDiff = Math.abs(movingPoints.edges.top - staticPoints.edges.bottom);
    if (topBottomDiff <= threshold) {
      result.horizontal.push({
        pos: staticPoints.edges.bottom,
        start: Math.min(movingPoints.edges.left, staticPoints.edges.left),
        end: Math.max(movingPoints.edges.right, staticPoints.edges.right),
        distance: topBottomDiff,
        type: 'top-bottom',
        isSpacing: true
      });
    }
    
    // Comprobar alineación vertical (X)
    // 1. Centro con centro
    const centerXDiff = Math.abs(movingPoints.center.x - staticPoints.center.x);
    if (centerXDiff <= threshold) {
      result.vertical.push({
        pos: staticPoints.center.x,
        start: Math.min(movingPoints.edges.top, staticPoints.edges.top),
        end: Math.max(movingPoints.edges.bottom, staticPoints.edges.bottom),
        distance: centerXDiff,
        type: 'center-center'
      });
    }
    
    // 2. Bordes izquierdo con izquierdo
    const leftDiff = Math.abs(movingPoints.edges.left - staticPoints.edges.left);
    if (leftDiff <= threshold) {
      result.vertical.push({
        pos: staticPoints.edges.left,
        start: Math.min(movingPoints.edges.top, staticPoints.edges.top),
        end: Math.max(movingPoints.edges.bottom, staticPoints.edges.bottom),
        distance: leftDiff,
        type: 'left-left'
      });
    }
    
    // 3. Bordes derecho con derecho
    const rightDiff = Math.abs(movingPoints.edges.right - staticPoints.edges.right);
    if (rightDiff <= threshold) {
      result.vertical.push({
        pos: staticPoints.edges.right,
        start: Math.min(movingPoints.edges.top, staticPoints.edges.top),
        end: Math.max(movingPoints.edges.bottom, staticPoints.edges.bottom),
        distance: rightDiff,
        type: 'right-right'
      });
    }
    
    // 4. Borde derecho con izquierdo (para espaciado)
    const rightLeftDiff = Math.abs(movingPoints.edges.right - staticPoints.edges.left);
    if (rightLeftDiff <= threshold) {
      result.vertical.push({
        pos: staticPoints.edges.left,
        start: Math.min(movingPoints.edges.top, staticPoints.edges.top),
        end: Math.max(movingPoints.edges.bottom, staticPoints.edges.bottom),
        distance: rightLeftDiff,
        type: 'right-left',
        isSpacing: true
      });
    }
    
    // 5. Borde izquierdo con derecho (para espaciado)
    const leftRightDiff = Math.abs(movingPoints.edges.left - staticPoints.edges.right);
    if (leftRightDiff <= threshold) {
      result.vertical.push({
        pos: staticPoints.edges.right,
        start: Math.min(movingPoints.edges.top, staticPoints.edges.top),
        end: Math.max(movingPoints.edges.bottom, staticPoints.edges.bottom),
        distance: leftRightDiff,
        type: 'left-right',
        isSpacing: true
      });
    }
    
    return result;
  }, [threshold, getNodeReferencePoints]);
  
  /**
   * Detecta distribución equidistante entre nodos (característica de Lucidchart)
   */
  const detectEquidistribution = useCallback((movingNode, allNodes) => {
    if (!detectDistribution || allNodes.length < 3) return [];
    
    const result = [];
    const movingPoints = getNodeReferencePoints(movingNode);
    
    // Agrupar nodos por alineación horizontal y vertical
    const horizontalAligned = [];
    const verticalAligned = [];
    
    // Valor de tolerancia para considerar nodos alineados para distribución
    const alignmentThreshold = threshold * 2;
    
    // Buscar nodos alineados horizontalmente (misma Y, diferentes X)
    allNodes.forEach(node => {
      if (node.id === movingNode.id) return;
      
      const nodePoints = getNodeReferencePoints(node);
      
      // Alineación horizontal (misma Y)
      const centerYDiff = Math.abs(movingPoints.center.y - nodePoints.center.y);
      if (centerYDiff <= alignmentThreshold) {
        horizontalAligned.push({
          id: node.id,
          x: nodePoints.center.x,
          y: nodePoints.center.y,
          width: node.width || 0
        });
      }
      
      // Alineación vertical (misma X)
      const centerXDiff = Math.abs(movingPoints.center.x - nodePoints.center.x);
      if (centerXDiff <= alignmentThreshold) {
        verticalAligned.push({
          id: node.id,
          x: nodePoints.center.x,
          y: nodePoints.center.y,
          height: node.height || 0
        });
      }
    });
    
    // Añadir el nodo en movimiento a los grupos de alineación
    horizontalAligned.push({
      id: movingNode.id,
      x: movingPoints.center.x,
      y: movingPoints.center.y,
      width: movingNode.width || 0
    });
    
    verticalAligned.push({
      id: movingNode.id,
      x: movingPoints.center.x,
      y: movingPoints.center.y,
      height: movingNode.height || 0
    });
    
    // Comprobar distribución equidistante en X (horizontal)
    if (horizontalAligned.length >= 3) {
      // Ordenar por X
      horizontalAligned.sort((a, b) => a.x - b.x);
      
      // Calcular diferencias entre nodos adyacentes
      const diffs = [];
      for (let i = 1; i < horizontalAligned.length; i++) {
        diffs.push(horizontalAligned[i].x - horizontalAligned[i-1].x);
      }
      
      // Comprobar si todas las diferencias son similares (distribución equidistante)
      const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
      const isEquidistant = diffs.every(diff => Math.abs(diff - avgDiff) <= threshold * 2);
      
      if (isEquidistant) {
        result.push({
          axis: 'x',
          positions: horizontalAligned.map(node => node.x),
          average: horizontalAligned[0].y,
          ids: horizontalAligned.map(node => node.id)
        });
      }
    }
    
    // Comprobar distribución equidistante en Y (vertical)
    if (verticalAligned.length >= 3) {
      // Ordenar por Y
      verticalAligned.sort((a, b) => a.y - b.y);
      
      // Calcular diferencias entre nodos adyacentes
      const diffs = [];
      for (let i = 1; i < verticalAligned.length; i++) {
        diffs.push(verticalAligned[i].y - verticalAligned[i-1].y);
      }
      
      // Comprobar si todas las diferencias son similares (distribución equidistante)
      const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
      const isEquidistant = diffs.every(diff => Math.abs(diff - avgDiff) <= threshold * 2);
      
      if (isEquidistant) {
        result.push({
          axis: 'y',
          positions: verticalAligned.map(node => node.y),
          average: verticalAligned[0].x,
          ids: verticalAligned.map(node => node.id)
        });
      }
    }
    
    return result;
  }, [detectDistribution, threshold, getNodeReferencePoints]);
  
  /**
   * Calcula el valor de ajuste (snap) para una posición si hay guías cercanas
   */
  const getSnapAdjustment = useCallback((dragPosition, currentGuides) => {
    if (!enableSnapping || !dragPosition) return { x: 0, y: 0 };
    
    const adjustment = { x: 0, y: 0 };
    
    // Buscar la guía vertical más cercana al umbral de snap
    const closestVertical = currentGuides.vertical
      .filter(g => g.distance <= snapThreshold)
      .sort((a, b) => a.distance - b.distance)[0];
      
    // Buscar la guía horizontal más cercana al umbral de snap
    const closestHorizontal = currentGuides.horizontal
      .filter(g => g.distance <= snapThreshold)
      .sort((a, b) => a.distance - b.distance)[0];
    
    if (closestVertical) {
      // Calcular el ajuste según el tipo de alineación
      if (closestVertical.type === 'center-center') {
        adjustment.x = closestVertical.pos - dragPosition.center.x;
      } else if (closestVertical.type === 'left-left') {
        adjustment.x = closestVertical.pos - dragPosition.edges.left;
      } else if (closestVertical.type === 'right-right') {
        adjustment.x = closestVertical.pos - dragPosition.edges.right;
      } else if (closestVertical.type === 'right-left') {
        adjustment.x = closestVertical.pos - dragPosition.edges.right;
      } else if (closestVertical.type === 'left-right') {
        adjustment.x = closestVertical.pos - dragPosition.edges.left;
      }
    }
    
    if (closestHorizontal) {
      // Calcular el ajuste según el tipo de alineación
      if (closestHorizontal.type === 'center-center') {
        adjustment.y = closestHorizontal.pos - dragPosition.center.y;
      } else if (closestHorizontal.type === 'top-top') {
        adjustment.y = closestHorizontal.pos - dragPosition.edges.top;
      } else if (closestHorizontal.type === 'bottom-bottom') {
        adjustment.y = closestHorizontal.pos - dragPosition.edges.bottom;
      } else if (closestHorizontal.type === 'bottom-top') {
        adjustment.y = closestHorizontal.pos - dragPosition.edges.bottom;
      } else if (closestHorizontal.type === 'top-bottom') {
        adjustment.y = closestHorizontal.pos - dragPosition.edges.top;
      }
    }
    
    return adjustment;
  }, [enableSnapping, snapThreshold]);
  
  /**
   * Maneja el evento onNodeDrag para actualizar guías
   */
  const onNodeDrag = useCallback((event, node) => {
    // Actualiza el nodo que se está arrastrando actualmente
    setDraggingNode(node);
    
    const allNodes = getNodes();
    const staticNodes = allNodes.filter(n => n.id !== node.id);
    
    // Preparar guías acumulativas
    const allGuides = {
      horizontal: [],
      vertical: [],
      distances: []
    };
    
    // Comprobar alineación con cada nodo estático
    for (const staticNode of staticNodes) {
      const alignment = checkAlignment(node, staticNode);
      if (alignment) {
        allGuides.horizontal.push(...alignment.horizontal);
        allGuides.vertical.push(...alignment.vertical);
      }
    }
    
    // Detectar distribución equidistante si está habilitado
    if (detectDistribution) {
      const equidistribution = detectEquidistribution(node, allNodes);
      allGuides.distances = equidistribution;
    }
    
    // Actualizar las guías detectadas
    setGuides(allGuides);
    
    // Calcular ajustes de snap si están habilitados
    if (enableSnapping) {
      const nodePoints = getNodeReferencePoints(node);
      const snapAdjustment = getSnapAdjustment(nodePoints, allGuides);
      
      return snapAdjustment;
    }
    
    return { x: 0, y: 0 };
  }, [getNodes, checkAlignment, detectEquidistribution, getNodeReferencePoints, getSnapAdjustment, enableSnapping, detectDistribution]);
  
  /**
   * Maneja el evento onNodeDragStop para limpiar las guías
   */
  const onNodeDragStop = useCallback(() => {
    setDraggingNode(null);
    setGuides({
      horizontal: [],
      vertical: [],
      distances: []
    });
  }, []);
  
  // Memoizar los resultados para evitar re-renderizados innecesarios
  const smartGuidesHelpers = useMemo(() => ({
    guides,
    draggingNode,
    onNodeDrag,
    onNodeDragStop,
    showDistances
  }), [guides, draggingNode, onNodeDrag, onNodeDragStop, showDistances]);
  
  return smartGuidesHelpers;
}