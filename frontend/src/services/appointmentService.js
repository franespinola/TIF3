import api from './api';

/**
 * Servicios para gestionar citas
 */
const appointmentService = {
  /**
   * Obtiene todas las citas
   * @param {Object} filters - Filtros para las citas
   * @param {string} filters.patientId - ID del paciente (opcional)
   * @param {Date} filters.startDate - Fecha de inicio (opcional)
   * @param {Date} filters.endDate - Fecha de fin (opcional)
   * @param {string} filters.status - Estado de la cita (opcional)
   * @returns {Promise} - Respuesta con las citas
   */
  getAllAppointments: (filters = {}) => {
    const params = [];
    
    if (filters.patientId) {
      params.push(`patient_id=${encodeURIComponent(filters.patientId)}`);
    }
    
    if (filters.startDate) {
      params.push(`start_date=${filters.startDate.toISOString()}`);
    }
    
    if (filters.endDate) {
      params.push(`end_date=${filters.endDate.toISOString()}`);
    }
    
    if (filters.status) {
      params.push(`status=${encodeURIComponent(filters.status)}`);
    }
    
    const url = params.length > 0 ? `/appointments?${params.join('&')}` : '/appointments';
    
    return api.get(url);
  },

  /**
   * Obtiene los detalles de una cita específica
   * @param {string} appointmentId - ID de la cita
   * @returns {Promise} - Respuesta con los detalles de la cita
   */
  getAppointmentById: (appointmentId) => {
    return api.get(`/appointments/${appointmentId}`);
  },
  
  /**
   * Obtiene las citas de un paciente específico
   * @param {string} patientId - ID del paciente
   * @returns {Promise} - Respuesta con las citas del paciente
   */
  getPatientAppointments: (patientId) => {
    return api.get(`/patients/${patientId}/appointments`);
  },
  
  /**
   * Crea una nueva cita
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise} - Respuesta con la cita creada
   */
  createAppointment: (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },
  
  /**
   * Actualiza una cita existente
   * @param {string} appointmentId - ID de la cita
   * @param {Object} appointmentData - Datos actualizados de la cita
   * @returns {Promise} - Respuesta con la cita actualizada
   */
  updateAppointment: (appointmentId, appointmentData) => {
    return api.put(`/appointments/${appointmentId}`, appointmentData);
  },
  
  /**
   * Elimina una cita
   * @param {string} appointmentId - ID de la cita
   * @returns {Promise} - Respuesta de confirmación
   */
  deleteAppointment: (appointmentId) => {
    return api.delete(`/appointments/${appointmentId}`);
  },
  
  /**
   * Cambia el estado de una cita
   * @param {string} appointmentId - ID de la cita
   * @param {string} status - Nuevo estado de la cita
   * @returns {Promise} - Respuesta con la cita actualizada
   */
  updateAppointmentStatus: (appointmentId, status) => {
    return api.patch(`/appointments/${appointmentId}/status`, { status });
  }
};

export default appointmentService;
