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
