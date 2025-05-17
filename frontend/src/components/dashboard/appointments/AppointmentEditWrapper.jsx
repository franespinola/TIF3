// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\dashboard\appointments\AppointmentEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import appointmentService from '../../../services/appointmentService';
import AppointmentForm from './AppointmentForm';

/**
 * Wrapper component for editing appointments
 * Fetches appointment data before rendering the AppointmentForm
 */
const AppointmentEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await appointmentService.getAppointmentById(id);
        
        if (!response.data) {
          throw new Error('No se encontró la cita solicitada');
        }
        
        setAppointmentData(response.data);
      } catch (err) {
        console.error('Error fetching appointment data:', err);
        
        // Handle different types of errors
        if (err.response) {
          // Server response error (e.g., 404, 500)
          const statusCode = err.response.status;
          if (statusCode === 404) {
            setError('La cita solicitada no existe');
          } else {
            setError(err.response.data?.message || `Error del servidor (${statusCode})`);
          }
        } else if (err.request) {
          // Network error (no response received)
          setError('No se pudo conectar con el servidor. Por favor, compruebe su conexión');
        } else {
          // Request configuration error
          setError(err.message || 'Error al cargar los datos de la cita');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointmentData();
    } else {
      setError('ID de cita no proporcionado');
      setLoading(false);
    }
  }, [id]);

  const handleAppointmentSaved = () => {
    navigate('/appointments');
  };

  // Adaptar los datos recibidos para que el formulario los entienda
  const adaptAppointmentData = () => {
    if (!appointmentData) return null;
    
    // Si los datos vienen con date_time pero no con date, usar date_time como date
    if (appointmentData.date_time && !appointmentData.date) {
      return {
        ...appointmentData,
        date: appointmentData.date_time
      };
    }
    
    return appointmentData;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{error}</p>
          <div className="mt-4 flex gap-3">
            <button 
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </button>
            <button
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              onClick={() => navigate('/appointments')}
            >
              Ver todas las citas
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
              Editar Cita
            </h1>
          </div>
          
          {appointmentData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {appointmentData.status === 'scheduled' ? 'Programada' : 
               appointmentData.status === 'completed' ? 'Completada' :
               appointmentData.status === 'cancelled' ? 'Cancelada' : 'Reprogramada'}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            Información de la Cita
          </h3>
        </div>
        <div className="p-6">
          <AppointmentForm 
            initialData={adaptAppointmentData()}
            onSave={handleAppointmentSaved}
            onCancel={() => navigate('/appointments')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentEditWrapper;
