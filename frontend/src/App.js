import React from "react";
import { ReactFlowProvider } from 'reactflow'; // Importar ReactFlowProvider
import GenogramaEditorWrapper from "./components/genogramaEditorWrapper/GenogramaEditorWrapper";

function App() {
  return (
    <ReactFlowProvider> {/* Envolver con ReactFlowProvider */}
      <GenogramaEditorWrapper />
    </ReactFlowProvider>
  );
}

export default App;


