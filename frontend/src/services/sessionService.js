import api from './api';

/**
 * Servicios para gestionar sesiones clínicas
 */
const sessionService = {
  /**
   * Obtiene todas las sesiones de un paciente específico
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con las sesiones del paciente
   */
  getPatientSessions: (patientId) => {
    return api.get(`/patients/${patientId}/sessions`);
  },

  /**
   * Obtiene todas las sesiones clínicas
   * @param {number} skip - Número de registros a omitir (paginación)
   * @param {number} limit - Límite de registros a retornar
   * @returns {Promise} - Respuesta con las sesiones
   */
  getAllSessions: (skip = 0, limit = 100) => {
    return api.get(`/sessions?skip=${skip}&limit=${limit}`);
  },

  /**
   * Obtiene los detalles de una sesión específica
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise} - Respuesta con los detalles de la sesión
   */
  getSessionById: (sessionId) => {
    return api.get(`/sessions/${sessionId}`);
  },
  
  /**
   * Crea una nueva sesión clínica
   * @param {Object} sessionData - Datos de la sesión
   * @returns {Promise} - Respuesta con la sesión creada
   */
  createSession: (sessionData) => {
    return api.post('/sessions', sessionData);
  },
  
  /**
   * Actualiza una sesión existente
   * @param {string} sessionId - ID de la sesión
   * @param {Object} sessionData - Datos actualizados de la sesión
   * @returns {Promise} - Respuesta con la sesión actualizada
   */
  updateSession: (sessionId, sessionData) => {
    return api.put(`/sessions/${sessionId}`, sessionData);
  },
    /**
   * Procesa un archivo de audio y crea una nueva sesión clínica
   * @param {File} file - Archivo de audio a procesar
   * @param {string} patient - Nombre del paciente
   * @param {string} createdBy - Usuario que crea la sesión
   * @returns {Promise} - Respuesta del proceso
   */
  processAudioSession: (file, patient, createdBy = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient', patient);
    
    if (createdBy) {
      formData.append('created_by', createdBy);
    }
    
    // La ruta ya incluye el prefijo /api en la configuración base de axios
    return api.post('/process_audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default sessionService;
