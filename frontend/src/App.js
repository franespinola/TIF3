import React, { useEffect } from "react";
import { ReactFlowProvider } from 'reactflow'; // Importar ReactFlowProvider
import GenogramaEditorWrapper from "./components/genogramaEditorWrapper/GenogramaEditorWrapper";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
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
      <ReactFlowProvider> {/* Envolver con ReactFlowProvider */}
        <GenogramaEditorWrapper />
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}

export default App;


