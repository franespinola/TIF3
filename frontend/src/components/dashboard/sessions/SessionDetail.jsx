import React, { useState, useEffect } from 'react';
import sessionService from '../../../services/sessionService';

/**
 * Componente que muestra los detalles de una sesión clínica
 */
const SessionDetail = ({ sessionId, onClose }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (sessionId) {
      loadSessionDetails();
    }
  }, [sessionId]);

  const loadSessionDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await sessionService.getSessionById(sessionId);
      setSession(response.data);
    } catch (err) {
      console.error('Error al cargar detalles de la sesión:', err);
      setError('No se pudieron cargar los detalles de la sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-gray-500">No hay información disponible</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Encabezado */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detalles de la Sesión
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(session.date)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Información del paciente */}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Información del Paciente</h3>
        {session.patient_info ? (
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-sm text-gray-900">{session.patient_info.name}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-500">Edad</p>
              <p className="text-sm text-gray-900">{session.patient_info.age} años</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-500">Género</p>
              <p className="text-sm text-gray-900">{session.patient_info.gender}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{session.patient_info.email}</p>
            </div>
          </div>
        ) : (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">No hay información del paciente disponible</p>
        )}
      </div>

      {/* Tabs de contenido */}
      <div className="border-t border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <nav className="flex -mb-px">
            <button
              className={`${
                activeTab === 'summary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              onClick={() => setActiveTab('summary')}
            >
              Resumen
            </button>
            <button
              className={`${
                activeTab === 'transcript'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              onClick={() => setActiveTab('transcript')}
            >
              Transcripción
            </button>
            <button
              className={`${
                activeTab === 'genogram'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('genogram')}
            >
              Genograma
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido según la pestaña seleccionada */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'summary' && (
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Resumen de la Sesión</h4>
            {session.summary ? (
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {session.summary}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>El resumen está siendo generado...</p>
                <p className="mt-2 text-sm">Este proceso puede tomar unos minutos.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'transcript' && (
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Transcripción Completa</h4>
            {session.transcript ? (
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {session.transcript}
              </div>
            ) : (
              <p className="text-gray-500">No hay transcripción disponible</p>
            )}
          </div>
        )}
        
        {activeTab === 'genogram' && (
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Genograma</h4>
            {session.genogram ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium text-gray-700">{session.genogram.name}</h5>
                  <button 
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                    onClick={() => {
                      // Aquí iría la lógica para abrir el genograma en el editor
                      console.log('Abrir genograma:', session.genogram);
                    }}
                  >
                    Abrir en Editor
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-xs text-gray-600 overflow-auto max-h-[300px]">
                    {JSON.stringify(session.genogram.data, null, 2)}
                  </pre>
                </div>
                {session.genogram.notes && (
                  <div className="mt-4">
                    <h6 className="text-sm font-medium text-gray-700">Notas</h6>
                    <p className="text-sm text-gray-600">{session.genogram.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No hay genograma disponible</p>
            )}
          </div>
        )}
      </div>
      
      {/* Pie */}
      <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID de sesión: {session.id}</span>
          <span>Creado por: {session.created_by || 'Sistema'}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
