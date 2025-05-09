import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

// Componente original de Genograma
import GenogramaEditorWrapper from "./components/genogramaEditorWrapper/GenogramaEditorWrapper";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Componentes del Dashboard
import Dashboard from './components/dashboard/Dashboard';
import PatientsList from './components/dashboard/PatientsList';
import PatientDetail from './components/dashboard/PatientDetail';
import AppointmentsCalendar from './components/dashboard/AppointmentsCalendar';
import AppointmentDetail from './components/dashboard/AppointmentDetail';
import GenogramsList from './components/dashboard/GenogramsList';
import GenogramEditor from './components/dashboard/GenogramEditor';
import GenogramViewer from './components/dashboard/GenogramViewer';
import SettingsPage from './components/dashboard/SettingsPage';

// Componentes de Autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  // Manejador de errores para ResizeObserver de ReactFlow
  useEffect(() => {
    const handleResizeObserverError = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const overlay = document.getElementById('webpack-dev-server-client-overlay');
        const overlayDiv = document.getElementById('webpack-dev-server-client-overlay-div');
        if (overlay) overlay.style.display = 'none';
        if (overlayDiv) overlayDiv.style.display = 'none';
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  // Estado para verificar si el usuario está autenticado
  // En una implementación real, esto vendría de un contexto o de una API
  const isAuthenticated = true; // Por ahora siempre mostramos el dashboard

  // Componente que envuelve el contenido con ReactFlowProvider
  const GenogramaWithProvider = () => (
    <ErrorBoundary>
      <ReactFlowProvider>
        <GenogramaEditorWrapper />
      </ReactFlowProvider>
    </ErrorBoundary>
  );

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Ruta original para el editor de genogramas */}
          <Route path="/editor" element={<GenogramaWithProvider />} />
          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas del dashboard */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          
          {/* Rutas de Pacientes */}
          <Route
            path="/patients"
            element={isAuthenticated ? <PatientsList /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:id"
            element={isAuthenticated ? <PatientDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/new"
            element={isAuthenticated ? <PatientDetail isNew={true} /> : <Navigate to="/login" />}
          />
          
          {/* Rutas de Citas */}
          <Route
            path="/appointments"
            element={isAuthenticated ? <AppointmentsCalendar /> : <Navigate to="/login" />}
          />
          <Route
            path="/appointments/:id"
            element={isAuthenticated ? <AppointmentDetail /> : <Navigate to="/login" />}
          />
          
          {/* Rutas de Genogramas */}
          <Route
            path="/genograms"
            element={isAuthenticated ? <GenogramsList /> : <Navigate to="/login" />}
          />
          <Route
            path="/genograms/new"
            element={isAuthenticated ? <GenogramEditor isNew={true} /> : <Navigate to="/login" />}
          />
          <Route
            path="/genograms/edit/:id"
            element={isAuthenticated ? <GenogramEditor /> : <Navigate to="/login" />}
          />
          <Route
            path="/genograms/view/:id"
            element={isAuthenticated ? <GenogramViewer /> : <Navigate to="/login" />}
          />
          
          {/* Configuraciones */}
          <Route
            path="/settings"
            element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
          />
          
          {/* Redirigir rutas no encontradas al dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
