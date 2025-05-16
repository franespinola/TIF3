import api from './api';

/**
 * Servicios para gestionar genogramas
 */
const genogramService = {
  /**
   * Obtiene todos los genogramas
   * @param {string} patientId - Filtro opcional por paciente
   * @returns {Promise} - Respuesta con los genogramas
   */
  getAllGenograms: (patientId = null) => {
    const params = patientId ? `?patient_id=${encodeURIComponent(patientId)}` : '';
    return api.get(`/genograms${params}`);
  },
  
  /**
   * Obtiene lista de genogramas con nombre de paciente
   * @param {string} patientId - Filtro opcional por paciente
   * @returns {Promise} - Respuesta con los genogramas y nombres de pacientes
   */
  getGenogramsList: (patientId = null) => {
    const params = patientId ? `?patient_id=${encodeURIComponent(patientId)}` : '';
    return api.get(`/genograms/list${params}`);
  },

  /**
   * Obtiene los detalles de un genograma específico
   * @param {string} genogramId - ID del genograma
   * @returns {Promise} - Respuesta con los detalles del genograma
   */
  getGenogramById: (genogramId) => {
    return api.get(`/genograms/${genogramId}`);
  },
  
  /**
   * Obtiene el contenido de un genograma específico
   * @param {string} genogramId - ID del genograma
   * @returns {Promise} - Respuesta con el contenido del genograma
   */
  getGenogramContent: (genogramId) => {
    return api.get(`/genograms/${genogramId}/content`);
  },
  
  /**
   * Crea un nuevo genograma
   * @param {Object} genogramData - Datos del genograma
   * @returns {Promise} - Respuesta con el genograma creado
   */
  createGenogram: (genogramData) => {
    return api.post('/genograms', genogramData);
  },
  
  /**
   * Actualiza un genograma existente
   * @param {string} genogramId - ID del genograma
   * @param {Object} genogramData - Datos actualizados del genograma
   * @returns {Promise} - Respuesta con el genograma actualizado
   */
  updateGenogram: (genogramId, genogramData) => {
    return api.put(`/genograms/${genogramId}`, genogramData);
  },
  
  /**
   * Elimina un genograma
   * @param {string} genogramId - ID del genograma
   * @returns {Promise} - Respuesta de confirmación
   */
  deleteGenogram: (genogramId) => {
    return api.delete(`/genograms/${genogramId}`);
  }
};

export default genogramService;
