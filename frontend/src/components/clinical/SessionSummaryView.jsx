import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../dashboard/layout/DashboardLayout';
import SessionSummary from './SessionSummary';
import axios from 'axios';

const SessionSummaryView = () => {
  const { sessionId, patientId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        // Verificar si existe el resumen
        const response = await axios.get(
          `/api/summaries/${sessionId}?patient=${patientId || 'unknown'}`
        );
        setSession(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error al cargar el resumen:", err);
        
        // Si no existe el resumen, intentar cargar solo la transcripción
        try {
          // Aquí iría tu lógica para cargar solo la transcripción
          // Por ejemplo, otra llamada a la API para obtener transcripción
          
          setSession({
            id: sessionId,
            timestamp: sessionId,
            patient: patientId,
            transcription: "La transcripción no está disponible",
            summary: null
          });
        } catch (transcriptError) {
          setError("No se pudo encontrar la sesión o la transcripción.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId, patientId]);

  const handleGenerateSummary = async () => {
    if (!session?.transcription) {
      setError("No hay transcripción disponible para generar un resumen.");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post('/api/summaries/generate', {
        transcripcion: session.transcription,
        patient: patientId || session.patient
      });

      if (response.data.status === "success") {
        // Actualizar el estado con el nuevo resumen
        setSession(prev => ({
          ...prev,
          summary: response.data.summary
        }));
      } else {
        setError("No se pudo generar el resumen. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al generar el resumen:", err);
      setError("Error al generar el resumen: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSummary = async (editedSummary) => {
    // Esta función se implementaría para guardar un resumen editado
    // Por ahora solo actualizamos el estado local
    setSession(prev => ({
      ...prev,
      summary: editedSummary
    }));

    // Aquí iría la llamada a la API para guardar el resumen editado
    console.log("Guardando resumen editado:", editedSummary);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoading ? 
              "Cargando sesión..." : 
              `Resumen de Sesión - ${session?.patient || patientId || "Paciente"}`
            }
          </h1>
        </div>
        
        {session?.transcription && !session?.summary && !isGenerating && (
          <button 
            onClick={handleGenerateSummary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generar Resumen
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <SessionSummary 
          summary={session?.summary}
          isLoading={isLoading || isGenerating} 
          onEdit={handleGenerateSummary}
          onSave={handleSaveSummary}
        />
        
        {session?.transcription && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Transcripción Completa</h2>
            </div>
            <div className="p-5">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                {session.transcription.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SessionSummaryView;