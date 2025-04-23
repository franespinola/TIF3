import React, { useState } from 'react';
import { MiniMap, useReactFlow, Panel } from 'reactflow';

/**
 * Componente de mini-mapa mejorado con opciones adicionales para la navegación.
 * Permite ajustar el tamaño, ver áreas de interés y navegar rápidamente.
 */
const EnhancedMinimap = ({ nodes }) => {
  const [expanded, setExpanded] = useState(false);
  const [maskColor, setMaskColor] = useState('rgba(240, 240, 240, 0.6)');
  const [nodeColor, setNodeColor] = useState('#555');
  const [showPatientHighlight, setShowPatientHighlight] = useState(true);
  
  const { fitView, setCenter, getZoom, setViewport } = useReactFlow();
  
  // Colores personalizados para el minimapa según el tipo de nodo
  const nodeStrokeColor = (node) => {
    if (node.type === 'masculinoNode') return '#2563eb';
    if (node.type === 'femeninoNode') return '#db2777';
    if (node.type === 'pacienteNode') return '#047857';
    if (['rectangle', 'circle', 'text', 'note'].includes(node.type)) return '#f59e0b';
    return nodeColor;
  };
  
  // Función para centrar en áreas de interés
  const centerOnArea = (areaType) => {
    // Encuentra todos los nodos del tipo seleccionado
    const targetNodes = nodes.filter(node => {
      if (areaType === 'patient') return node.type === 'pacienteNode';
      if (areaType === 'notes') return ['text', 'note'].includes(node.type);
      if (areaType === 'family') return ['masculinoNode', 'femeninoNode'].includes(node.type);
      return false;
    });
    
    if (targetNodes.length === 0) return;
    
    // Encuentra el centro promedio de los nodos
    const sumX = targetNodes.reduce((sum, node) => sum + node.position.x, 0);
    const sumY = targetNodes.reduce((sum, node) => sum + node.position.y, 0);
    const centerX = sumX / targetNodes.length;
    const centerY = sumY / targetNodes.length;
    
    // Centra la vista en ese punto
    setCenter(centerX, centerY, { zoom: getZoom(), duration: 800 });
  };
  
  // Función para restaurar la vista completa
  const handleFitView = () => {
    fitView({ duration: 800 });
  };

  return (
    <div className="enhanced-minimap" style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 100,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: expanded ? '12px' : '6px',
      transition: 'all 0.3s ease',
      width: expanded ? '280px' : '180px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '12px',
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
          </svg>
          Navegación
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '10px',
            color: '#64748b'
          }}
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M15 3v7h6"/>
              <path d="M9 21v-7H3"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v7H3"/>
              <path d="M15 21v-7h6"/>
            </svg>
          )}
        </button>
      </div>
      
      <MiniMap
        nodeStrokeColor={nodeStrokeColor}
        nodeStrokeWidth={3}
        nodeColor={node => {
          if (showPatientHighlight && node.type === 'pacienteNode') {
            return 'rgba(4, 120, 87, 0.6)';
          }
          return 'rgba(160, 160, 160, 0.6)';
        }}
        maskColor={maskColor}
        zoomable
        pannable
        style={{
          height: expanded ? 120 : 80
        }}
      />
      
      {expanded && (
        <div style={{ marginTop: '10px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '8px'
          }}>
            <button
              onClick={handleFitView}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                border: '1px solid #bae6fd',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 16 4 4 4-4"/>
                <path d="M7 20V4"/>
                <path d="m21 8-4-4-4 4"/>
                <path d="M17 4v16"/>
              </svg>
              Ver todo
            </button>
            
            <button
              onClick={() => centerOnArea('patient')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: '#dcfce7',
                color: '#047857',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Paciente
            </button>
            
            <button
              onClick={() => centerOnArea('family')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Familia
            </button>
            
            <button
              onClick={() => centerOnArea('notes')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: '#fef9c3',
                color: '#854d0e',
                border: '1px solid #fef08a',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Notas
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <label style={{
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <input
                type="checkbox"
                checked={showPatientHighlight}
                onChange={() => setShowPatientHighlight(!showPatientHighlight)}
                style={{ width: '12px', height: '12px' }}
              />
              Destacar paciente
            </label>
            
            <select
              onChange={(e) => setMaskColor(e.target.value)}
              value={maskColor}
              style={{
                padding: '2px 5px',
                fontSize: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '3px',
                background: '#f8fafc'
              }}
            >
              <option value="rgba(240, 240, 240, 0.6)">Claro</option>
              <option value="rgba(51, 65, 85, 0.6)">Oscuro</option>
              <option value="rgba(0, 0, 0, 0.4)">Contraste</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMinimap;