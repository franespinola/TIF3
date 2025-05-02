import React from 'react';
import NavigationPanel from './NavigationPanel';
import ReactFlowMinimap from './ReactFlowMinimap';

/**
 * Componente de compatibilidad que renderiza tanto NavigationPanel como
 * ReactFlowMinimap para mantener compatibilidad con código existente.
 * 
 * Nota: Se recomienda usar NavigationPanel y ReactFlowMinimap directamente
 * en lugar de este componente que es solo para compatibilidad.
 */
const EnhancedMinimap = ({ nodes, isVisible = true, showNavigationPanel = true }) => {
  return (
    <>
      <NavigationPanel 
        nodes={nodes} 
        isVisible={showNavigationPanel} 
      />
      <ReactFlowMinimap 
        nodes={nodes} 
        isVisible={isVisible} 
      />
    </>
  );
};

export default EnhancedMinimap;