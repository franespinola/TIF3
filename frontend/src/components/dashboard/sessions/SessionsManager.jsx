import React, { useState } from 'react';
import SessionsList from './SessionsList';
import SessionDetail from './SessionDetail';

/**
 * Componente que gestiona la visualización de sesiones clínicas
 */
const SessionsManager = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  const handleCloseDetails = () => {
    setSelectedSessionId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Sesiones Clínicas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${selectedSessionId ? 'hidden md:block' : 'col-span-3'} md:col-span-1`}>
          <SessionsList onSelectSession={handleSelectSession} />
        </div>
        
        {selectedSessionId && (
          <div className="col-span-3 md:col-span-2">
            <SessionDetail 
              sessionId={selectedSessionId} 
              onClose={handleCloseDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsManager;
