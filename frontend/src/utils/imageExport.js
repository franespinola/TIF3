import { toPng, toJpeg, toCanvas } from 'html-to-image';

/**
 * Exporta un elemento DOM como imagen PNG y lo descarga
 * 
 * @param {string} elementId - ID del elemento DOM a exportar
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {Object} options - Opciones adicionales para la exportación
 * @returns {Promise<void>}
 */
export const exportAsPng = async (elementId, fileName = 'diagrama', options = {}) => {
  try {
    // Obtener el elemento del DOM
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Elemento con ID '${elementId}' no encontrado`);
    }
    
    // Convertir el elemento a una imagen PNG
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      ...options
    });
    
    // Crear un enlace temporal y descargar la imagen
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
    
    return dataUrl;
  } catch (error) {
    console.error('Error al exportar como PNG:', error);
    throw error;
  }
};

/**
 * Exporta un elemento DOM como imagen JPG y lo descarga
 * 
 * @param {string} elementId - ID del elemento DOM a exportar
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {Object} options - Opciones adicionales para la exportación
 * @returns {Promise<void>}
 */
export const exportAsJpeg = async (elementId, fileName = 'diagrama', options = {}) => {
  try {
    // Obtener el elemento del DOM
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Elemento con ID '${elementId}' no encontrado`);
    }
    
    // Convertir el elemento a una imagen JPEG
    const dataUrl = await toJpeg(element, {
      quality: 0.9,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      ...options
    });
    
    // Crear un enlace temporal y descargar la imagen
    const link = document.createElement('a');
    link.download = `${fileName}.jpg`;
    link.href = dataUrl;
    link.click();
    
    return dataUrl;
  } catch (error) {
    console.error('Error al exportar como JPEG:', error);
    throw error;
  }
};

/**
 * Exporta un elemento DOM como un Canvas HTML
 * 
 * @param {string} elementId - ID del elemento DOM a exportar
 * @param {Object} options - Opciones adicionales para la exportación
 * @returns {Promise<HTMLCanvasElement>} El elemento canvas generado
 */
export const exportAsCanvas = async (elementId, options = {}) => {
  try {
    // Obtener el elemento del DOM
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Elemento con ID '${elementId}' no encontrado`);
    }
    
    // Convertir el elemento a un canvas
    const canvas = await toCanvas(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      ...options
    });
    
    return canvas;
  } catch (error) {
    console.error('Error al exportar como Canvas:', error);
    throw error;
  }
};

/**
 * Función combinada para exportar un elemento como PNG, JPG o Canvas
 * 
 * @param {string} elementId - ID del elemento DOM a exportar
 * @param {string} format - Formato de la imagen ('png', 'jpg'/'jpeg', o 'canvas')
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {Object} options - Opciones adicionales para la exportación
 * @returns {Promise<string|HTMLCanvasElement>} URL de datos de la imagen generada o elemento Canvas
 */
export const exportCanvasAsImage = async (elementId = 'canvas-wrapper', format = 'png', fileName = 'diagrama', options = {}) => {
  if (format.toLowerCase() === 'canvas') {
    return exportAsCanvas(elementId, options);
  }
  
  const exportFunction = format.toLowerCase() === 'png' ? exportAsPng : exportAsJpeg;
  return exportFunction(elementId, fileName, options);
};