import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

// Componente original de Genograma
import GenogramaEditorWrapper from "./components/genogramaEditorWrapper/GenogramaEditorWrapper";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Componente de rutas del Dashboard
import DashboardRoutes from './components/dashboard/Routes';

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
            path="/*" 
            element={isAuthenticated ? <DashboardRoutes /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
