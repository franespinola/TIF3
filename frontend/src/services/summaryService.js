import api from './api';

/**
 * Servicios para gestionar resúmenes de sesiones
 */
const summaryService = {
  /**
   * Obtiene un resumen específico por timestamp y nombre del paciente
   * @param {string} timestamp - Timestamp del resumen (formato: YYYYMMDDHHMMSS)
   * @param {string} patientName - Nombre del paciente (coincide con el nombre de carpeta)
   * @returns {Promise}
   */
  getSummaryByTimestamp: (timestamp, patientName) => {
    return api.get(`/summaries/${timestamp}`, {
      params: { patient: patientName }
    });
  },

  /**
   * Genera un nuevo resumen basado en una transcripción
   * @param {string} transcription - Transcripción de la sesión
   * @param {string} patientName - Nombre del paciente
   * @returns {Promise}
   */
  generateSummary: (transcription, patientName) => {
    return api.post('/summaries/generate', {
      transcripcion: transcription,
      patient: patientName
    });
  },

  /**
   * Actualiza un resumen existente
   * @param {string} timestamp - Timestamp del resumen
   * @param {string} summary - Texto del resumen actualizado
   * @param {string} patientName - Nombre del paciente
   * @returns {Promise}
   */
  updateSummary: (timestamp, summary, patientName) => {
    return api.put(`/summaries/${timestamp}`, {
      summary,
      patient: patientName
    });
  },

  /**
   * Elimina un resumen
   * @param {string} timestamp - Timestamp del resumen
   * @param {string} patientName - Nombre del paciente
   * @returns {Promise}
   */
  deleteSummary: (timestamp, patientName) => {
    return api.delete(`/summaries/${timestamp}`, {
      params: { patient: patientName }
    });
  },

  /**
   * Lista todos los resúmenes disponibles para un paciente
   * @param {string} patientName
   * @returns {Promise}
   */
  listPatientSummaries: (patientName) => {
    return api.get(`/summaries/patient/${patientName}`);
  }
};

export default summaryService;
