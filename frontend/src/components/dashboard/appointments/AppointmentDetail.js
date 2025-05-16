import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import appointmentService from '../../../services/appointmentService';

const AppointmentDetail = ({ isNew = false, isEditing = false, initialData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew && !initialData);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(initialData || {
    id: '',
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    duration: 60,
    type: 'Consulta',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (isNew || initialData) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await appointmentService.getAppointmentById(id);
        
        if (!response.data) {
          throw new Error('No se pudieron cargar los datos de la cita');
        }
        
        setAppointment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'Error al cargar los datos de la cita'
        );
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (isNew) {
        response = await appointmentService.createAppointment(appointment);
        console.log('Cita creada:', response.data);
      } else {
        response = await appointmentService.updateAppointment(id, appointment);
        console.log('Cita actualizada:', response.data);
      }
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Ha ocurrido un error al guardar la cita. Por favor, inténtelo de nuevo.'
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (      <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/appointments')}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Nueva Cita' : 'Detalles de la Cita'}
            </h1>
          </div>
          
          {!isNew && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {appointment.status === 'scheduled' ? 'Programada' : 
               appointment.status === 'completed' ? 'Completada' :
               appointment.status === 'cancelled' ? 'Cancelada' : 'Reprogramada'}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              {isNew ? 'Agendar Nueva Cita' : 'Información de la Cita'}
            </h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointment.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  <option value="1">María Fernández</option>
                  <option value="2">Cristian Rodríguez</option>
                  <option value="3">Ignacia Pérez</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cita
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointment.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Consulta">Consulta</option>
                  <option value="Primera sesión">Primera sesión</option>
                  <option value="Sesión familiar">Sesión familiar</option>
                  <option value="Emergencia">Emergencia</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointment.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointment.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="15"
                  step="15"
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointment.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {!isNew && (
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={appointment.status}
                    onChange={handleChange}
                  >
                    <option value="scheduled">Programada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                    <option value="rescheduled">Reprogramada</option>
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appointment.notes}
                onChange={handleChange}
                placeholder="Añade notas o detalles importantes sobre la cita..."
              ></textarea>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              onClick={() => navigate('/appointments')}
            >
              Cancelar
            </button>
            
            <div className="flex space-x-2">              {!isNew && (
                <button 
                  type="button" 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={async () => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
                      try {
                        setLoading(true);
                        await appointmentService.deleteAppointment(id);
                        navigate('/appointments');
                      } catch (error) {
                        console.error('Error al eliminar la cita:', error);
                        setError(
                          error.response?.data?.message || 
                          error.message || 
                          'Ha ocurrido un error al eliminar la cita'
                        );
                        setLoading(false);
                      }
                    }
                  }}
                >
                  Eliminar
                </button>
              )}
              
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isNew ? 'Agendar Cita' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentDetail;