import api from './api';

/**
 * Servicios para gestionar pacientes
 */
const patientService = {
  /**
   * Obtiene todos los pacientes
   * @param {string} name - Filtro opcional por nombre
   * @returns {Promise} - Respuesta con los pacientes
   */
  getAllPatients: (name = null) => {
    const params = name ? `?name=${encodeURIComponent(name)}` : '';
    return api.get(`/patients${params}`);
  },

  /**
   * Obtiene los detalles de un paciente específico
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con los detalles del paciente
   */
  getPatientById: (patientId) => {
    return api.get(`/patients/${patientId}`);
  },
  
  /**
   * Crea un nuevo paciente
   * @param {Object} patientData - Datos del paciente
   * @returns {Promise} - Respuesta con el paciente creado
   */
  createPatient: (patientData) => {
    return api.post('/patients', patientData);
  },
  
  /**
   * Actualiza un paciente existente
   * @param {string} patientId - ID del paciente
   * @param {Object} patientData - Datos actualizados del paciente
   * @returns {Promise} - Respuesta con el paciente actualizado
   */
  updatePatient: (patientId, patientData) => {
    return api.put(`/patients/${patientId}`, patientData);
  },
  
  /**
   * Elimina un paciente
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta de confirmación
   */
  deletePatient: (patientId) => {
    return api.delete(`/patients/${patientId}`);
  },
  
  /**
   * Obtiene los medicamentos de un paciente
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con los medicamentos
   */
  getPatientMedications: (patientId) => {
    return api.get(`/patients/${patientId}/medications`);
  },
  
  /**
   * Añade un medicamento a un paciente
   * @param {string} patientId - ID del paciente
   * @param {Object} medicationData - Datos del medicamento
   * @returns {Promise} - Respuesta con el medicamento creado
   */  addPatientMedication: (patientId, medicationData) => {
    return api.post(`/patients/${patientId}/medications`, medicationData);
  },

  /**
   * Obtiene las sesiones de un paciente
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con las sesiones del paciente
   */
  getPatientSessions: (patientId) => {
    return api.get(`/patients/${patientId}/sessions`);
  },
  
  /**
   * Obtiene los genogramas de un paciente
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con los genogramas del paciente
   */
  getPatientGenograms: (patientId) => {
    return api.get(`/patients/${patientId}/genograms`);
  },

  /**
   * Busca pacientes por diferentes criterios
   * @param {Object} criteria - Criterios de búsqueda (nombre, edad, género, etc.)
   * @returns {Promise} - Respuesta con los pacientes encontrados
   */
  searchPatients: (criteria = {}) => {
    return api.get('/patients', { params: criteria });
  }
};

export default patientService;
