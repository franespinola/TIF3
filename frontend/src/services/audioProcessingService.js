import api from './api';

/**
 * Servicios para el procesamiento de audio
 */
const audioProcessingService = {
  /**
   * Envía un archivo de audio para ser transcrito y procesado
   * @param {File} audioFile - Archivo de audio a procesar
   * @param {string} patientId - ID del paciente relacionado con la grabación
   * @returns {Promise} - Respuesta con el resultado del procesamiento
   */
  processAudio: (audioFile, patientId) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('patient', patientId);
    
    return api.post('/process-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Transcribe un archivo de audio
   * @param {File} audioFile - Archivo de audio a transcribir
   * @returns {Promise} - Respuesta con la transcripción
   */
  transcribeAudio: (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    return api.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Guarda una grabación de audio
   * @param {Blob} audioBlob - Blob de audio a guardar
   * @param {string} filename - Nombre del archivo
   * @returns {Promise} - Respuesta con la información de la grabación
   */
  saveRecording: (audioBlob, filename) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, filename);
    
    return api.post('/save-recording', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Genera un resumen de una sesión
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise} - Respuesta con el estado del proceso de resumen
   */
  generateSessionSummary: (sessionId) => {
    return api.post(`/sessions/${sessionId}/generate-summary`);
  },
  
  /**
   * Verifica el estado del resumen de una sesión
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise} - Respuesta con el estado del resumen
   */
  checkSummaryStatus: (sessionId) => {
    return api.get(`/sessions/${sessionId}/summary-status`);
  }
};

export default audioProcessingService;
