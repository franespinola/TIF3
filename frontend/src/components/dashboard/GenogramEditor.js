import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import GenogramaEditorWrapper from "../genogramaEditorWrapper/GenogramaEditorWrapper";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const GenogramEditor = ({ isNew = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [genogramData, setGenogramData] = useState({
    id: '',
    name: '',
    patientId: '',
    patientName: '',
    lastModified: '',
    createdAt: new Date().toISOString().slice(0, 10)
  });
  const [genogramContent, setGenogramContent] = useState(null);

  useEffect(() => {
    const fetchGenogramData = async () => {
      if (isNew) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/genograms/view/${id}`);
        const genogram = await response.json();

        // Actualizar los datos del genograma
        setGenogramData({
          id: genogram.id,
          name: genogram.name,
          patientId: genogram.patientId,
          patientName: genogram.patientName,
          lastModified: genogram.lastModified,
          createdAt: genogram.created
        });

        // Guardar el contenido del genograma
        setGenogramContent(genogram.data);
      } catch (error) {
        console.error('Error al obtener el genograma:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenogramData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenogramData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackClick = () => {
    navigate('/genograms');
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
                {isNew ? 'Nuevo Genograma' : 'Editor de Genograma'}
              </h1>
              <p className="text-sm text-gray-500">
                {isNew 
                  ? 'Crea un nuevo genograma familiar' 
                  : `Paciente: ${genogramData.patientName} | Creado: ${genogramData.createdAt}`}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                console.log('Guardando genograma...');
                // Aquí iría la lógica para guardar el genograma
                setTimeout(() => {
                  navigate('/genograms');
                }, 1000);
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
        
        {isNew && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Genograma
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={genogramData.name}
                onChange={handleChange}
                placeholder="Ej: Genograma Familiar"
                required
              />
            </div>
            
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                Paciente
              </label>
              <select
                id="patientId"
                name="patientId"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={genogramData.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar paciente</option>
                <option value="1">María Fernández</option>
                <option value="2">Cristian Rodríguez</option>
                <option value="3">Ignacia Pérez</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-hidden">
        <ErrorBoundary>
          <ReactFlowProvider>
            <GenogramaEditorWrapper
              initialData={genogramContent}
            />
          </ReactFlowProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default GenogramEditor;