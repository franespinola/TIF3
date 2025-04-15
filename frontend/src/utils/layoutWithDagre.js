import dagre from "dagre";

/**
 * @typedef {Object} LayoutOptions
 * @property {string} [rankdir="TB"] - Dirección del layout ("TB", "LR", "BT", "RL").
 * @property {number} [ranksep=120] - Separación entre niveles (usado para calcular la posición vertical según generation).
 * @property {number} [nodesep=80] - Separación entre nodos.
 * @property {number} [defaultWidth=100] - Ancho por defecto de un nodo si no se especifica.
 * @property {number} [defaultHeight=100] - Alto por defecto de un nodo si no se especifica.
 */

/**
 * Calcula el layout de un grafo usando Dagre y actualiza la posición de cada nodo.
 *
 * En esta versión se respeta la estructura en capas definida por el atributo "generation":
 *   - generation = 1 se ubicará en la primera capa (y = 0 o ajustado con defaultHeight)
 *   - generation = 2 en la segunda, etc.
 *
 * @param {Array<Object>} nodes - Array de nodos, donde cada uno debe tener la propiedad `id` y opcionalmente `data` con `width`, `height` y `generation`.
 * @param {Array<Object>} edges - Array de aristas, cada una con propiedades `source` y `target`.
 * @param {LayoutOptions} [options={}] - Opciones de configuración para personalizar el layout.
 * @returns {Array<Object>} - Los nodos actualizados con una propiedad `position` que indica su posición calculada.
 */
export default function layoutWithDagre(nodes, edges, options = {}) {
  const {
    rankdir = "TB",
    ranksep = 120,
    nodesep = 80,
    defaultWidth = 100,
    defaultHeight = 100,
  } = options;

  if (!Array.isArray(nodes)) {
    throw new Error("El parámetro 'nodes' debe ser un array.");
  }
  if (!Array.isArray(edges)) {
    throw new Error("El parámetro 'edges' debe ser un array.");
  }

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir, ranksep, nodesep });
  g.setDefaultEdgeLabel(() => ({}));

  // Se agregan los nodos sin forzar un 'rank' en Dagre,
  // ya que se va a recalcular la posición vertical según "generation"
  nodes.forEach((node) => {
    if (!node.id) {
      console.warn("Nodo sin id detectado:", node);
      return;
    }
    const width = node.data?.width ?? defaultWidth;
    const height = node.data?.height ?? defaultHeight;
    g.setNode(node.id, { width, height });
  });

  // Agregar edges (relaciones) al grafo
  edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      console.warn("Edge inválido detectado:", edge);
      return;
    }
    g.setEdge(edge.source, edge.target);
  });

  // Ejecutar el layout de Dagre
  dagre.layout(g);

  // Ajustar la posición de cada nodo según su valor "generation"
  // Se mantiene la posición horizontal calculada (x) y se asigna la y según la capa
  const updatedNodes = nodes.map((node) => {
    const nodeWithPos = g.node(node.id);
    if (!nodeWithPos) {
      console.warn(`No se encontró posición para el nodo con id: ${node.id}`);
      return node;
    }
    // Se extrae la generación; si no está definida se usa 1 por defecto.
    const generation = node.data?.generation ?? 1;

    // Conservar el ancho y alto (se usan para centrar la posición del nodo)
    const width = node.data?.width ?? defaultWidth;
    const height = node.data?.height ?? defaultHeight;

    // Forzamos la posición vertical en función de la capa (generation)
    // Ajustamos sumando la mitad de la altura para centrar verticalmente
    const newY = (generation - 1) * ranksep + defaultHeight / 2;

    return {
      ...node,
      position: {
        // Se conserva la posición horizontal (x) calculada por Dagre y se centra
        x: nodeWithPos.x - width / 2,
        // Se usa el valor forzado basado en la generación para la coordenada y
        y: newY - height / 2,
      },
    };
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
