// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\dashboard\patients\PatientEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import PatientForm from './PatientForm';
import patientService from '../../../services/patientService';

/**
 * Wrapper component for editing patients
 * Fetches patient data before rendering the PatientForm
 */
const PatientEditWrapper = () => {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await patientService.getPatientById(patientId);
        
        if (!response.data) {
          throw new Error('No se encontró el paciente solicitado');
        }
        
        setPatientData(response.data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        
        // Manejar diferentes tipos de errores
        if (err.response) {
          // Error de respuesta del servidor (ej. 404, 500)
          const statusCode = err.response.status;
          if (statusCode === 404) {
            setError('El paciente solicitado no existe');
          } else {
            setError(err.response.data?.message || `Error del servidor (${statusCode})`);
          }
        } else if (err.request) {
          // Error de red (no se recibió respuesta)
          setError('No se pudo conectar con el servidor. Por favor, compruebe su conexión');
        } else {
          // Error de configuración de la solicitud
          setError(err.message || 'Error al cargar los datos del paciente');
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    } else {
      setError('ID de paciente no proporcionado');
      setLoading(false);
    }
  }, [patientId]);

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
              onClick={() => window.location.href = '/patients'}
            >
              Ver todos los pacientes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <PatientForm isEditing={true} patientId={patientId} initialData={patientData} />;
};

export default PatientEditWrapper;
