import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import SessionSummary from './SessionSummary';
import sessionService from '../../../services/sessionService';
import summaryService from '../../../services/summaryService';

const SessionSummaryView = () => {
  const { sessionId, patientId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // ✅ agregado
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sessionResponse = await sessionService.getSessionById(sessionId);
        const sessionData = sessionResponse.data;

        const timestamp = sessionData.summary_timestamp;
        const patientName = sessionData.patient_info?.name;

        let summaryData = null;
        if (timestamp && patientName) {
          try {
            const summaryResponse = await summaryService.getSummaryByTimestamp(timestamp, patientName);
            summaryData = summaryResponse.data;
          } catch (summaryErr) {
            console.warn("No se encontró resumen para ese timestamp:", summaryErr);
          }
        }

        setSession({
          id: sessionId,
          patient: patientName || patientId,
          date: sessionData.date,
          transcription: sessionData.transcript || '',
          summary: summaryData?.summary || null,
          summary_timestamp: timestamp
        });
      } catch (err) {
        console.error("Error al cargar la sesión:", err);
        setError("No se pudo cargar la sesión o el resumen.");
      } finally {
        setIsLoading(false);
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
      setError(null);

      const response = await summaryService.generateSummary(
        session.transcription,
        session.patient
      );

      if (response.data.status === "success") {
        setSession(prev => ({
          ...prev,
          summary: response.data.summary
        }));
      } else {
        setError("No se pudo generar el resumen. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al generar el resumen:", err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Error al generar el resumen. Por favor, inténtelo de nuevo."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSummary = async (editedSummary) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await summaryService.updateSummary(
        session.summary_timestamp,
        editedSummary,
        session.patient
      );

      setSession(prev => ({
        ...prev,
        summary: editedSummary
      }));

      setSuccessMessage("Resumen actualizado correctamente ✅");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error al guardar el resumen:", err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Error al guardar el resumen. Por favor, inténtelo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isLoading ? "Cargando sesión..." : `Resumen de Sesión - ${session?.patient || "Paciente"}`}
              </h1>
              {session?.date && (
                <div className="mt-1 text-sm text-gray-600">
                  Sesión del{" "}
                  <strong>
                    {new Date(session.date).toLocaleDateString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </strong>{" "}
                  a las{" "}
                  <strong>
                    {new Date(session.date).toLocaleTimeString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false // 👈 Esto fuerza el formato 24h (ej: 14:00)
                    })}
                  </strong>
                </div>
              )}
            </div>
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
      </div>

      {/* ✅ Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

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
