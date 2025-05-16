import api from './api';

/**
 * Servicios para gestionar notas clínicas
 */
const clinicalNotesService = {
  /**
   * Obtiene todas las notas clínicas de un paciente
   * @param {string} patientId - ID del paciente
   * @param {string} type - Tipo de nota clínica (opcional)
   * @param {number} limit - Límite de registros a retornar
   * @returns {Promise} - Respuesta con las notas clínicas
   */
  getPatientClinicalNotes: (patientId, type = null, limit = 50) => {
    let url = `/patients/${patientId}/clinical-notes`;
    const params = [];
    
    if (type) {
      params.push(`type=${encodeURIComponent(type)}`);
    }
    
    if (limit !== 50) {
      params.push(`limit=${limit}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return api.get(url);
  },

  /**
   * Obtiene los detalles de una nota clínica específica
   * @param {string} patientId - ID del paciente
   * @param {string} noteId - ID de la nota clínica
   * @returns {Promise} - Respuesta con los detalles de la nota clínica
   */
  getClinicalNoteById: (patientId, noteId) => {
    return api.get(`/patients/${patientId}/clinical-notes/${noteId}`);
  },
  
  /**
   * Crea una nueva nota clínica para un paciente
   * @param {string} patientId - ID del paciente
   * @param {Object} noteData - Datos de la nota clínica
   * @returns {Promise} - Respuesta con la nota clínica creada
   */
  createClinicalNote: (patientId, noteData) => {
    return api.post(`/patients/${patientId}/clinical-notes`, noteData);
  },
  
  /**
   * Actualiza una nota clínica existente
   * @param {string} patientId - ID del paciente
   * @param {string} noteId - ID de la nota clínica
   * @param {Object} noteData - Datos actualizados de la nota clínica
   * @returns {Promise} - Respuesta con la nota clínica actualizada
   */
  updateClinicalNote: (patientId, noteId, noteData) => {
    return api.put(`/patients/${patientId}/clinical-notes/${noteId}`, noteData);
  },
  
  /**
   * Elimina una nota clínica
   * @param {string} patientId - ID del paciente
   * @param {string} noteId - ID de la nota clínica
   * @returns {Promise} - Respuesta de confirmación
   */
  deleteClinicalNote: (patientId, noteId) => {
    return api.delete(`/patients/${patientId}/clinical-notes/${noteId}`);
  }
};

export default clinicalNotesService;
