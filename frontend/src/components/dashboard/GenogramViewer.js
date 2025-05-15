import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import GenogramaViewerWrapper from './genogramaViewerWrapper/GenogramaViewerWrapper';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import api from '../../services/api';

const GenogramViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [genogramHeader, setGenogramHeader] = useState({
    id: '',
    name: '',
    patientName: '',
    createdAt: '',
    lastModified: ''
  });

  const [genogramData, setGenogramData] = useState({ people: [], relationships: [] });

  useEffect(() => {
    const fetchGenogramData = async () => {
      try {
        const { data: genogram } = await api.get(`/genograms/view/${id}`);
        
        setGenogramHeader({
          id: genogram.id,
          name: genogram.name,
          patientName: genogram.patientName,
          createdAt: genogram.created,
          lastModified: genogram.lastModified
        });

        setGenogramData(genogram.data);
      } catch (error) {
        console.error('Error al obtener el genograma:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenogramData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/genograms');
  };

  const handleEditClick = () => {
    navigate(`/genograms/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleBackClick}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">
                {genogramHeader.name}
              </h1>
              <p className="text-sm text-gray-500">
                Paciente: {genogramHeader.patientName} | Creado: {genogramHeader.createdAt} | Última modificación: {genogramHeader.lastModified}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 border border-gray-300"
              onClick={() => alert('Genograma exportado correctamente')}
            >
              Exportar
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleEditClick}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <ErrorBoundary>
          <ReactFlowProvider>
            <GenogramaViewerWrapper
              people={genogramData.people}
              relationships={genogramData.relationships}
              readOnly={true}
            />
          </ReactFlowProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default GenogramViewer;
