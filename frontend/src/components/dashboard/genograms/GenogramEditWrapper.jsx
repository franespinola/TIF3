// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\dashboard\genograms\GenogramEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import GenogramEditor from './GenogramEditor';
import genogramService from '../../../services/genogramService';
import api from '../../../services/api';

/**
 * Wrapper component for editing genograms
 * Fetches genogram data before rendering the GenogramEditor
 */
const GenogramEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genogramData, setGenogramData] = useState(null);
  const [genogramContent, setGenogramContent] = useState(null);
  useEffect(() => {
    const fetchGenogramData = async () => {
      try {
        console.log('=== GenogramEditWrapper: Cargando datos del genograma ===');
        console.log('Genogram ID:', id);
        
        // Get genogram details and content in a single request
        const response = await api.get(`/genograms/view/${id}`);
        
        if (!response.data) {
          throw new Error('No se encontró el genograma solicitado');
        }
        
        console.log('Datos cargados desde API:', response.data);
        
        setGenogramData({
          id: response.data.id,
          name: response.data.name,
          patientId: response.data.patientId,
          patientName: response.data.patientName,
          lastModified: response.data.lastModified,
          createdAt: response.data.created
        });
        
        console.log('Estableciendo contenido del genograma:', response.data.data);
        setGenogramContent(response.data.data);
      } catch (err) {
        console.error('Error fetching genogram data:', err);
        
        // Handle different types of errors
        if (err.response) {
          // Server response error (e.g., 404, 500)
          const statusCode = err.response.status;
          if (statusCode === 404) {
            setError('El genograma solicitado no existe');
          } else {
            setError(err.response.data?.message || `Error del servidor (${statusCode})`);
          }
        } else if (err.request) {
          // Network error (no response received)
          setError('No se pudo conectar con el servidor. Por favor, compruebe su conexión');
        } else {
          // Request configuration error
          setError(err.message || 'Error al cargar los datos del genograma');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGenogramData();
    } else {
      setError('ID de genograma no proporcionado');
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
              onClick={() => navigate('/genograms')}
            >
              Ver todos los genogramas
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <GenogramEditor genogramData={genogramData} genogramContent={genogramContent} />;
};

export default GenogramEditWrapper;
