/**
 * Fábrica de nodos para crear consistentemente diferentes tipos de nodos
 * Centraliza la creación de nodos con propiedades predeterminadas
 */

/**
 * Crea las propiedades base para un nuevo nodo
 * @param {string} type - Tipo de nodo a crear
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {object} customData - Datos personalizados específicos del tipo de nodo
 * @returns {object} - Objeto de nodo completo para React Flow
 */
export const createNode = (type, x, y, customData = {}) => {
  // Propiedades base compartidas por todos los nodos
  const baseNode = {
    id: `${type}-${Date.now()}`,
    type,
    position: { x, y },
    selected: false,
    data: {
      ...customData,
    }
  };
  
  // Añadir propiedades específicas según el tipo
  switch (type) {
    case 'rectangleNode':
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          width: customData.width || 100,
          height: customData.height || 80,
          stroke: customData.stroke || '#000000',
          fill: customData.fill || 'transparent',
          strokeWidth: customData.strokeWidth || 2,
          label: customData.label || '',
        }
      };
      
    case 'circleNode':
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          radius: customData.radius || 50,
          stroke: customData.stroke || '#000000',
          fill: customData.fill || 'transparent',
          strokeWidth: customData.strokeWidth || 2,
          label: customData.label || '',
        }
      };
      
    case 'textNode':
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          width: customData.width || 150,
          height: customData.height || 80,
          fontSize: customData.fontSize || 16,
          color: customData.color || '#000000',
          text: customData.text || 'Texto',
        }
      };
      
    case 'masculinoNode':
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          name: customData.name || 'Nombre',
          age: customData.age || '',
          profession: customData.profession || '',
          info: customData.info || '',
        }
      };
      
    case 'femeninoNode':
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          name: customData.name || 'Nombre',
          age: customData.age || '',
          profession: customData.profession || '',
          info: customData.info || '',
        }
      };
      
    default:
      return baseNode;
  }
};

/**
 * Crea un borde entre dos nodos
 * @param {string} source - ID del nodo origen
 * @param {string} target - ID del nodo destino
 * @param {string} type - Tipo de borde (opcional)
 * @param {object} data - Datos adicionales para el borde
 * @returns {object} - Objeto de borde para React Flow
 */
export const createEdge = (source, target, type = 'relationshipEdge', data = {}) => {
  return {
    id: `e-${source}-${target}-${Date.now()}`,
    source,
    target,
    type,
    data: {
      relType: data.relType || 'matrimonio',
      ...data
    },
    animated: data.animated || false
  };
};