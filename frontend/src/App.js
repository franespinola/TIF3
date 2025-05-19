import React, { useEffect } from 'react';
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

// Componente original de Genograma
import GenogramaEditorWrapper from "./components/genogramaEditorWrapper/GenogramaEditorWrapper";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Componente de rutas del Dashboard
import DashboardRoutes from './components/dashboard/routes/Routes';

// Componentes de Autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Configuración del router con banderas futuras
const router = createBrowserRouter([
  {
    path: "/editor",
    element: (
      <ErrorBoundary>
        <ReactFlowProvider>
          <GenogramaEditorWrapper />
        </ReactFlowProvider>
      </ErrorBoundary>
    )
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/*",
    element: <DashboardRoutes />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

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

  return (
    <ErrorBoundary>
      <RouterProvider 
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
