import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import GenogramaViewerWrapper from "../genogramaViewerWrapper/GenogramaViewerWrapper";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const GenogramViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [genogramData, setGenogramData] = useState({
    id: '',
    name: '',
    patientId: '',
    patientName: '',
    lastModified: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchGenogramData = async () => {
      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo
        const data = {
          id: id,
          name: 'Genograma familiar',
          patientId: '1',
          patientName: 'María Fernández',
          lastModified: '2025-05-05',
          createdAt: '2025-05-01'
        };
        
        setGenogramData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching genogram data:', error);
        setLoading(false);
      }
    };

    fetchGenogramData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/genograms');
  };

  const handleEditClick = () => {
    navigate(`/genograms/${id}/edit`);
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
                {genogramData.name}
              </h1>
              <p className="text-sm text-gray-500">
                Paciente: {genogramData.patientName} | Creado: {genogramData.createdAt} | Última modificación: {genogramData.lastModified}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 border border-gray-300"
              onClick={() => {
                console.log('Exportando genograma...');
                // Aquí iría la lógica para exportar el genograma
                alert('Genograma exportado correctamente');
              }}
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
            <GenogramaViewerWrapper genogramId={id} readOnly={true} />
          </ReactFlowProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default GenogramViewer;