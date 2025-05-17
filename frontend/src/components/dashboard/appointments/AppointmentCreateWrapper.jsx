import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import AppointmentForm from './AppointmentForm';

/**
 * Wrapper component for creating new appointments
 */
const AppointmentCreateWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialData, setInitialData] = useState({});
  const [preselectedPatientId, setPreselectedPatientId] = useState(null);

  // Procesar parámetros de la URL en caso de que vengan
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const patientId = queryParams.get('patientId');
    if (patientId) {
      setPreselectedPatientId(patientId);
    }

    // Si hay una fecha preseleccionada
    const date = queryParams.get('date');
    if (date) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          // Si la hora ya ha pasado, establecer la hora a la siguiente hora entera
          const now = new Date();
          if (dateObj < now) {
            dateObj.setHours(now.getHours() + 1);
            dateObj.setMinutes(0);
            dateObj.setSeconds(0);
          }
          
          setInitialData({
            ...initialData,
            date: dateObj.toISOString().slice(0, 16)
          });
        }
      } catch (e) {
        console.error('Error parsing date from URL', e);
      }
    }
  }, [location.search]);

  const handleAppointmentSaved = () => {
    navigate('/appointments');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/appointments')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Nueva Cita
          </h1>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            Agendar Nueva Cita
          </h3>
        </div>
        <div className="p-6">
          <AppointmentForm 
            initialData={initialData}
            patientId={preselectedPatientId}
            onSave={handleAppointmentSaved}
            onCancel={() => navigate('/appointments')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentCreateWrapper; 