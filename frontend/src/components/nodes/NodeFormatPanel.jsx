import React from 'react';
import FormattingToolbar from '../menuBar/FormattingToolbar';

/**
 * Panel de formato que se muestra cuando un nodo está seleccionado
 * Permite cambiar el estilo del texto del nodo seleccionado
 */
const NodeFormatPanel = ({ selectedNode, onUpdateNodeStyle }) => {
  if (!selectedNode) return null;
  
  const updateNodeStyle = (nodeId, styleProperties) => {
    if (onUpdateNodeStyle) {
      onUpdateNodeStyle(nodeId, styleProperties);
    }
  };
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      padding: '8px 12px',
      zIndex: 100,
      minWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#64748b'
        }}>
          Formato de texto
        </div>
      </div>
      
      <FormattingToolbar
        selectedNode={selectedNode}
        updateNodeStyle={updateNodeStyle}
      />
    </div>
  );
};

export default NodeFormatPanel;