// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\dashboard\appointments\AppointmentEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import AppointmentDetail from './AppointmentDetail';
import appointmentService from '../../../services/appointmentService';

/**
 * Wrapper component for editing appointments
 * Fetches appointment data before rendering the AppointmentDetail
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

  return <AppointmentDetail isEditing={true} initialData={appointmentData} />;
};

export default AppointmentEditWrapper;
