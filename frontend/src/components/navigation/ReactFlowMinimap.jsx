// filepath: c:\Users\frane\Desktop\TIF3\frontend\src\components\navigation\ReactFlowMinimap.jsx
import React, { useState, useEffect } from 'react';
import { MiniMap } from 'reactflow';

/**
 * Componente de mini-mapa para ReactFlow con opciones personalizadas y posicionamiento adaptativo
 * Se coloca a la derecha del canvas sin superponerse con el sidebar
 */
const ReactFlowMinimap = ({ 
  nodeColor = 'rgba(160, 160, 160, 0.6)',
  maskColor = 'rgba(240, 240, 240, 0.6)', 
  showPatientHighlight = true,
  height = 150,
}) => {
  // Estado para la posición del minimapa
  const [position, setPosition] = useState({
    right: 'calc(20vw + 30px)' // Posición inicial: 20vw (ancho del sidebar) + margen
  });

  // Actualizar la posición del minimapa cuando la ventana cambia de tamaño
  useEffect(() => {
    const handleResize = () => {
      // Ajustar la posición del minimapa basado en el estado del sidebar (asumimos que podría estar colapsado)
      // Usamos una función para detectar si el sidebar está visible y calcular el espacio necesario
      const sidebarElement = document.querySelector('[style*="width: 20vw"]');
      
      if (sidebarElement) {
        // Sidebar expandido - dejamos espacio para el sidebar completo
        setPosition({ right: 'calc(20vw + 30px)' });
      } else {
        // Sidebar colapsado o no encontrado - dejamos menos espacio
        setPosition({ right: '80px' }); // 50px del sidebar colapsado + 30px de margen
      }
    };

    // Configurar inicialmente
    handleResize();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // También observamos cambios en el DOM que podrían indicar que el sidebar cambió
    const observer = new MutationObserver(handleResize);
    observer.observe(document.body, { 
      attributes: true, 
      childList: true, 
      subtree: true 
    });
    
    // Limpiar listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);
  
  // Colores personalizados para el minimapa según el tipo de nodo
  const nodeStrokeColor = (node) => {
    if (node.type === 'masculinoNode') return '#2563eb';
    if (node.type === 'femeninoNode') return '#db2777';
    if (node.type === 'pacienteNode') return '#047857';
    if (['rectangle', 'circle', 'text', 'note'].includes(node.type)) return '#f59e0b';
    return '#555';
  };

  return (
    <MiniMap
      nodeStrokeColor={nodeStrokeColor}
      nodeStrokeWidth={3}
      nodeColor={node => {
        if (showPatientHighlight && node.type === 'pacienteNode') {
          return 'rgba(4, 120, 87, 0.6)';
        }
        return nodeColor;
      }}
      maskColor={maskColor}
      zoomable
      pannable
      style={{
        height: height,
        width: 250,
        position: 'fixed',
        bottom: '20px',
        right: position.right,
        left: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.3s ease'
      }}
    />
  );
};

export default ReactFlowMinimap;