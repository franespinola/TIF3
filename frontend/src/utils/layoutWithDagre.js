import dagre from "dagre";

/**
 * @typedef {Object} LayoutOptions
 * @property {string} [rankdir="TB"] - Dirección del layout ("TB", "LR", "BT", "RL").
 * @property {number} [ranksep=250] - Separación entre niveles (generaciones) - AUMENTADO DE 150 A 250.
 * @property {number} [nodesep=150] - Separación horizontal entre nodos.
 * @property {number} [defaultWidth=100] - Ancho por defecto de un nodo si no se especifica.
 * @property {number} [defaultHeight=100] - Alto por defecto de un nodo si no se especifica.
 */

/**
 * Calcula el layout de un grafo usando Dagre y actualiza la posición de cada nodo.
 * 
 * Esta versión mejorada utiliza explícitamente el valor de `generation` asociado a cada nodo
 * para asignar el `rank` en Dagre, asegurando que las generaciones se visualicen
 * correctamente en niveles horizontales distintos y con amplia separación.
 *
 * @param {Array<Object>} nodes - Array de nodos, donde cada uno debe tener la propiedad `id` y `data.generation`.
 * @param {Array<Object>} edges - Array de aristas, cada una con propiedades `source` y `target`.
 * @param {LayoutOptions} [options={}] - Opciones de configuración para personalizar el layout.
 * @returns {Array<Object>} - Los nodos actualizados con una propiedad `position` que indica su posición calculada.
 */
export default function layoutWithDagre(nodes, edges, options = {}) {
  const {
    rankdir = "TB",            // Top-to-Bottom por defecto
    ranksep = 250,             // AUMENTADO DE 150 A 250 - Mayor separación vertical entre generaciones
    nodesep = 150,             // Mayor separación horizontal entre nodos
    defaultWidth = 100,
    defaultHeight = 100,
    respectExistingPositions = false
  } = options;

  if (!Array.isArray(nodes)) {
    console.error("El parámetro 'nodes' debe ser un array.");
    return nodes;
  }
  if (!Array.isArray(edges)) {
    console.error("El parámetro 'edges' debe ser un array.");
    return nodes;
  }

  // Validar que haya nodos para procesar
  if (nodes.length === 0) {
    console.warn("No hay nodos para procesar en layoutWithDagre");
    return nodes;
  }

  const g = new dagre.graphlib.Graph();
  
  // Configurar el grafo con opciones mejoradas para visualización clara
  g.setGraph({ 
    rankdir,       // Dirección del layout
    ranksep,       // Espacio entre filas (generaciones)
    nodesep,       // Espacio entre columnas (entre miembros de la misma generación)
    marginx: 50,   // Margen externo horizontal
    marginy: 80,   // AUMENTADO DE 50 A 80 - Mayor margen vertical
    acyclicer: 'greedy',  // Algoritmo para eliminar ciclos
    ranker: 'network-simplex'  // Algoritmo para asignar rangos (generaciones)
  });
  
  g.setDefaultEdgeLabel(() => ({}));

  // Preparar un mapa de generaciones para organizar nodos horizontalmente por grupo familiar/relación
  const nodesByGeneration = new Map();
  const groupings = new Map();
  const familyNodeMap = new Map();   // Mapa para rastrear nodos familia
  const partnerConnections = new Map(); // Mapa para rastrear conexiones entre parejas
  
  // Primera pasada: agrupar por generación y recopilar información de grupos y relaciones
  nodes.forEach((node) => {
    if (!node.id) {
      console.warn("Nodo sin id detectado:", node);
      return;
    }
    
    // Obtener generación del nodo
    const generation = node.data?.generation;
    if (typeof generation !== 'number') {
      console.warn(`Nodo ${node.id} sin generación válida. Asignando 1.`);
      node.data = { ...node.data, generation: 1 };
    }
    
    // Agrupar por generación
    if (!nodesByGeneration.has(generation)) {
      nodesByGeneration.set(generation, []);
    }
    nodesByGeneration.get(generation).push(node);
    
    // Identificar grupos basados en displayGroup si está disponible
    const displayGroup = node.data?.displayGroup;
    if (displayGroup) {
      if (!groupings.has(displayGroup)) {
        groupings.set(displayGroup, []);
      }
      groupings.get(displayGroup).push(node.id);
    }
    
    // Identificar los nodos familia para posicionamiento especial
    if (node.type === 'familyNode') {
      familyNodeMap.set(node.id, node);
    }
  });
  
  // Identificar conexiones entre parejas y nodos familia para posicionamiento preciso
  edges.forEach(edge => {
    if (edge.data?.edgeType === 'partnerEdge') {
      // Verificar si el destino es un nodo familia
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode && targetNode.type === 'familyNode') {
        if (!partnerConnections.has(edge.target)) {
          partnerConnections.set(edge.target, []);
        }
        partnerConnections.get(edge.target).push(edge.source);
      }
    }
  });

  // Agregar los nodos al grafo con su rank basado en generation
  nodes.forEach((node) => {
    if (!node.id) return;
    
    const width = node.width || node.data?.width || defaultWidth;
    const height = node.height || node.data?.height || defaultHeight;
    
    // Crear configuración del nodo para Dagre
    const nodeConfig = { 
      width, 
      height,
      // Usar explícitamente generation como rank para Dagre
      rank: node.data?.generation || 1
    };
    
    g.setNode(node.id, nodeConfig);
  });

  // Filtrar aristas que podrían causar problemas en el layout
  const layoutEdges = edges.filter(edge => {
    // Omitir aristas específicamente marcadas para no afectar el layout
    if (edge.data?.omitFromLayout) {
      return false;
    }
    
    // Asegurarse que la arista tiene source y target válidos
    if (!edge.source || !edge.target) {
      console.warn("Edge inválido detectado:", edge);
      return false;
    }
    
    // Verificar que los nodos source y target existen
    const sourceExists = nodes.some(n => n.id === edge.source);
    const targetExists = nodes.some(n => n.id === edge.target);
    
    if (!sourceExists || !targetExists) {
      console.warn(`Edge ${edge.id} conecta nodos inexistentes: ${edge.source} -> ${edge.target}`);
      return false;
    }
    
    return true;
  });

  // Agregar edges (relaciones) al grafo
  layoutEdges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  try {
    // Ejecutar el layout de Dagre
    dagre.layout(g);
  } catch (error) {
    console.error("Error al ejecutar el layout de Dagre:", error);
    return nodes;
  }

  // Actualizar la posición de cada nodo con lo calculado por Dagre
  const updatedNodes = nodes.map((node) => {
    const nodeWithPos = g.node(node.id);
    if (!nodeWithPos) {
      console.warn(`No se encontró posición para el nodo con id: ${node.id}`);
      return node;
    }
    
    // Conservar el ancho y alto (se usan para centrar la posición del nodo)
    const width = node.width || node.data?.width || defaultWidth;
    const height = node.height || node.data?.height || defaultHeight;
    
    // Calculamos la posición base
    const basePosition = {
      x: nodeWithPos.x - width / 2,
      y: nodeWithPos.y - height / 2,
    };

    // Si es un nodo familia, vamos a posicionarlo exactamente entre sus nodos padre
    if (node.type === 'familyNode' && partnerConnections.has(node.id)) {
      const partners = partnerConnections.get(node.id);
      if (partners.length >= 2) {
        const partner1 = g.node(partners[0]);
        const partner2 = g.node(partners[1]);
        
        if (partner1 && partner2) {
          // Calcular posición X centrada entre los padres
          const centerX = (partner1.x + partner2.x) / 2;
          
          // Mantener la misma posición Y (generación) del nodo familia
          basePosition.x = centerX - width / 2;
          
          // Asegurar que los padres estén alineados en Y
          const alignY = Math.min(partner1.y, partner2.y);
          const partner1Node = nodes.find(n => n.id === partners[0]);
          const partner2Node = nodes.find(n => n.id === partners[1]);
          
          if (partner1Node && partner2Node) {
            partner1Node.position = {
              x: partner1.x - (partner1Node.width || defaultWidth) / 2,
              y: alignY - (partner1Node.height || defaultHeight) / 2
            };
            
            partner2Node.position = {
              x: partner2.x - (partner2Node.width || defaultWidth) / 2,
              y: alignY - (partner2Node.height || defaultHeight) / 2
            };
          }
        }
      }
    }

    return {
      ...node,
      position: basePosition,
    };
  });
  
  // Realizar un paso adicional para verificar y arreglar la alineación vertical de parejas
  // y nodos familia en cada generación
  const generationsMap = new Map();
  updatedNodes.forEach(node => {
    if (!node.data?.generation) return;
    
    const gen = node.data.generation;
    if (!generationsMap.has(gen)) {
      generationsMap.set(gen, []);
    }
    generationsMap.get(gen).push(node);
  });
  
  // Para cada generación, asegurarse de que todos los nodos estén alineados en Y
  generationsMap.forEach((genNodes, generation) => {
    // Calcular la posición Y promedio de la generación
    const avgY = genNodes.reduce((sum, node) => sum + node.position.y, 0) / genNodes.length;
    
    // Alinear todos los nodos de esta generación a la misma posición Y
    genNodes.forEach(node => {
      // Solo modificamos la posición Y, mantenemos la X para preservar el espaciado horizontal
      if (node.type !== 'familyNode') { // No modificamos nodos familia para no romper otras lógicas
        node.position.y = avgY;
      }
    });
  });

  return updatedNodes;
}

/**
 * Calcula la diferencia en x, en y y el ángulo entre dos puntos.
 *
 * @param {number} x0 - Coordenada x del inicio.
 * @param {number} y0 - Coordenada y del inicio.
 * @param {number} x1 - Coordenada x del final.
 * @param {number} y1 - Coordenada y del final.
 * @returns {{dx: number, dy: number, angle: number}} - Diferencia en x, en y y ángulo.
 */
function computeGeometry(x0, y0, x1, y1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angle = Math.atan2(dy, dx);
  return { dx, dy, angle };
}

/**
 * Genera una cadena SVG que describe un camino en zig-zag entre dos puntos.
 *
 * @param {number} x0 - Coordenada x inicial.
 * @param {number} y0 - Coordenada y inicial.
 * @param {number} x1 - Coordenada x final.
 * @param {number} y1 - Coordenada y final.
 * @param {number} [amplitude=15] - Amplitud del efecto zig-zag.
 * @param {number} [segments=6] - Número de segmentos o picos del zig-zag.
 * @returns {string} - Cadena SVG que representa el camino.
 */
export function createZigZagPath(x0, y0, x1, y1, amplitude = 15, segments = 6) {
  const { dx, dy, angle } = computeGeometry(x0, y0, x1, y1);
  let path = `M ${x0},${y0}`;

  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const xBase = x0 + dx * t;
    const yBase = y0 + dy * t;
    // Alterna la dirección de la amplitud en cada segmento
    const sign = i % 2 === 0 ? 1 : -1;
    const perpAngle = angle + Math.PI / 2;
    const xPeak = xBase + sign * amplitude * Math.cos(perpAngle);
    const yPeak = yBase + sign * amplitude * Math.sin(perpAngle);
    path += ` L ${xPeak},${yPeak}`;
  }

  path += ` L ${x1},${y1}`;
  return path;
}

/**
 * Genera una cadena SVG que describe un camino con ondas redondeadas entre dos puntos.
 *
 * @param {number} x0 - Coordenada x inicial.
 * @param {number} y0 - Coordenada y inicial.
 * @param {number} x1 - Coordenada x final.
 * @param {number} y1 - Coordenada y final.
 * @param {number} [amplitude=10] - Amplitud de la onda.
 * @param {number} [frequency=4] - Número de ciclos de onda.
 * @returns {string} - Cadena SVG que representa el camino.
 */
export function createRoundedWavePath(x0, y0, x1, y1, amplitude = 10, frequency = 4) {
  const { dx, dy, angle } = computeGeometry(x0, y0, x1, y1);
  let path = `M ${x0},${y0}`;

  for (let i = 1; i <= frequency; i++) {
    const t0 = (i - 1) / frequency;
    const t1 = i / frequency;
    const xStart = x0 + dx * t0;
    const yStart = y0 + dy * t0;
    const xEnd = x0 + dx * t1;
    const yEnd = y0 + dy * t1;
    const xMid = (xStart + xEnd) / 2;
    const yMid = (yStart + yEnd) / 2;
    const perpAngle = angle + Math.PI / 2;
    // Alterna la dirección de la amplitud en cada ciclo
    const sign = i % 2 === 0 ? 1 : -1;
    const xCtrl = xMid + sign * amplitude * Math.cos(perpAngle);
    const yCtrl = yMid + sign * amplitude * Math.sin(perpAngle);
    path += ` Q ${xCtrl},${yCtrl} ${xEnd},${yEnd}`;
  }

  return path;
}

/**
 * Crea un elemento SVG <path> estilizado para interfaces profesionales en el ámbito de la salud.
 *
 * Este diseño utiliza colores calmados y un trazo redondeado, lo que ofrece una apariencia limpia y moderna.
 *
 * @param {string} path - La cadena del atributo d para el elemento <path>.
 * @param {Object} [styleOptions={}] - Opciones de estilo para el camino.
 * @param {string} [styleOptions.stroke="#2196f3"] - Color del trazo (azul calmado y profesional).
 * @param {number} [styleOptions.strokeWidth=3] - Ancho del trazo.
 * @param {string} [styleOptions.fill="none"] - Color de relleno (por defecto, ninguno).
 * @param {string} [styleOptions.strokeLinecap="round"] - Estilo de terminación del trazo.
 * @param {string} [styleOptions.strokeDasharray=""] - Opcional: patrón de guiones.
 * @returns {string} - Cadena HTML que representa el elemento SVG <path> con los estilos aplicados.
 */
export function createSVGPathElement(path, styleOptions = {}) {
  const {
    stroke = "#2196f3",
    strokeWidth = 3,
    fill = "none",
    strokeLinecap = "round",
    strokeDasharray = ""
  } = styleOptions;

  return `<path d="${path}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}" stroke-linecap="${strokeLinecap}"${strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : ''} />`;
}
