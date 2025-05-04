import React, { useState, useRef, useEffect } from 'react';
import RelationshipsLegend from '../relationships/RelationshipsLegend';
import MenuPortal from './MenuPortal';

/**
 * SubMenuBar - Barra de menú secundaria debajo de MenuBar para funcionalidades adicionales
 * Incluye opciones para crear y gestionar relaciones entre nodos con selector visual
 */
const SubMenuBar = ({
  onRelate,
  updateEdgeRelation,
  selectedEdge,
  setNodes,
  setEdges,
  edges,
  showRelationEditor = true,
  showRelationLegend = true
}) => {
  // Estado para manejar los menús desplegables
  const [showRelationMenu, setShowRelationMenu] = useState(false);
  const [showLegendPopup, setShowLegendPopup] = useState(false);
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);
  
  // Estado para posiciones de menús desplegables
  const [relationMenuPosition, setRelationMenuPosition] = useState({ top: 0, left: 0 });
  const [legendPopupPosition, setLegendPopupPosition] = useState({ top: 0, left: 0 });
  const [lineStyleMenuPosition, setLineStyleMenuPosition] = useState({ top: 0, left: 0 });
  
  // Estado para formulario de relaciones
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");

  // Estado para los estilos de línea
  const [lineStyle, setLineStyle] = useState({
    strokeType: "solid", // solid, dashed, dotted, doubleLines
    connectionType: "bezier", // straight, bezier, step
    markerEnd: "none", // none, arrow, circle
    markerStart: "none", // none, arrow, circle
    strokeWidth: 2,
    autoConnect: true
  });
  
  // Referencias para los menús desplegables
  const relationMenuRef = useRef(null);
  const relationButtonRef = useRef(null);
  const legendPopupRef = useRef(null);
  const legendButtonRef = useRef(null);
  const lineStyleMenuRef = useRef(null);
  const lineStyleButtonRef = useRef(null);
  
  // Lista de tipos de relaciones con sus iconos y descripciones
  const relationshipTypes = [
    { 
      id: "matrimonio", 
      name: "Matrimonio", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20" />
        </svg>
      )
    },
    { 
      id: "divorcio", 
      name: "Divorcio", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20" />
          <path d="M15 6l-5 12" />
        </svg>
      ) 
    },
    { 
      id: "cohabitacion", 
      name: "Cohabitación", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20" strokeDasharray="4 4" />
          <path d="M12 8L17 12H7L12 8Z" stroke="black" fill="none" />
          <path d="M14 12v3h-4v-3" stroke="black" fill="none" />
        </svg>
      ) 
    },
    { 
      id: "compromiso", 
      name: "Compromiso", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20" strokeDasharray="6 3" />
        </svg>
      ) 
    },
    { 
      id: "conflicto", 
      name: "Conflicto", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2">
          <path d="M2 12c3 -4 5 4 8 0c3 -4 5 4 8 0" />
        </svg>
      ) 
    },
    { 
      id: "violencia", 
      name: "Violencia", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2">
          <path d="M2 12c2 -3 4 3 6 0c2 -3 4 3 6 0c2 -3 4 3 6 0" />
        </svg>
      ) 
    },
    { 
      id: "cercana", 
      name: "Cercana", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth="2">
          <path d="M2 10h20" />
          <path d="M2 14h20" />
        </svg>
      ) 
    },
    { 
      id: "distante", 
      name: "Distante", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
          <path d="M2 12h20" strokeDasharray="6 6" />
        </svg>
      ) 
    },
    { 
      id: "rota", 
      name: "Rota", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
          <path d="M2 12h20" />
          <path d="M12 8v8" strokeWidth="3" />
        </svg>
      ) 
    },
  ];

  // Lista de estilos de trazo disponibles
  const strokeTypes = [
    { id: "solid", name: "Continuo", icon: <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" /></svg> },
    { id: "dashed", name: "Guiones", icon: <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" /></svg> },
    { id: "dotted", name: "Punteado", icon: <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" /></svg> },
    { id: "dashdot", name: "Guión punto", icon: <svg width="60" height="20"><line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5 2 5" /></svg> },
    { id: "doubleLines", name: "Doble línea", icon: <svg width="60" height="20"><line x1="0" y1="7" x2="60" y2="7" stroke="currentColor" strokeWidth="1.5" /><line x1="0" y1="13" x2="60" y2="13" stroke="currentColor" strokeWidth="1.5" /></svg> },
  ];

  // Lista de tipos de conexión
  const connectionTypes = [
    { id: "straight", name: "Recta", icon: <svg width="60" height="20"><line x1="5" y1="18" x2="55" y2="2" stroke="currentColor" strokeWidth="2" /></svg> },
    { id: "bezier", name: "Curva", icon: <svg width="60" height="20"><path d="M5,18 C20,18 40,2 55,2" fill="none" stroke="currentColor" strokeWidth="2" /></svg> },
    { id: "step", name: "Escalón", icon: <svg width="60" height="20"><polyline points="5,18 30,18 30,2 55,2" fill="none" stroke="currentColor" strokeWidth="2" /></svg> },
  ];

  // Lista de marcadores finales
  const markers = [
    { id: "none", name: "Ninguno", icon: <svg width="40" height="20"><line x1="5" y1="10" x2="35" y2="10" stroke="currentColor" strokeWidth="2" /></svg> },
    { id: "arrow", name: "Flecha", icon: <svg width="40" height="20"><line x1="5" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" /><polygon points="30,5 40,10 30,15" fill="currentColor" /></svg> },
    { id: "circle", name: "Círculo", icon: <svg width="40" height="20"><line x1="5" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" /><circle cx="35" cy="10" r="4" fill="white" stroke="currentColor" strokeWidth="2" /></svg> },
  ];

  // Actualizar campos si hay una conexión seleccionada
  useEffect(() => {
    if (selectedEdge) {
      setSource(selectedEdge.source);
      setTarget(selectedEdge.target);
      setRelType(selectedEdge.data?.relType || "matrimonio");
      
      // Actualizar el estilo de línea basado en la arista seleccionada
      if (selectedEdge.data) {
        const edgeData = selectedEdge.data;
        setLineStyle({
          strokeType: edgeData.strokeType || "solid",
          connectionType: edgeData.connectionType || "bezier",
          markerEnd: edgeData.markerEnd || "none",
          markerStart: edgeData.markerStart || "none",
          strokeWidth: edgeData.strokeWidth || 2,
          autoConnect: edgeData.autoConnect !== undefined ? edgeData.autoConnect : true
        });
      }
    }
  }, [selectedEdge]);

  // Cierra los menús si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Para menú Relación
      if (
        showRelationMenu &&
        relationMenuRef.current &&
        !relationMenuRef.current.contains(event.target) &&
        relationButtonRef.current &&
        !relationButtonRef.current.contains(event.target)
      ) {
        setShowRelationMenu(false);
      }
      
      // Para ventana Leyenda
      if (
        showLegendPopup &&
        legendPopupRef.current &&
        !legendPopupRef.current.contains(event.target) &&
        legendButtonRef.current &&
        !legendButtonRef.current.contains(event.target)
      ) {
        setShowLegendPopup(false);
      }
      
      // Para menú Estilo de Línea
      if (
        showLineStyleMenu &&
        lineStyleMenuRef.current &&
        !lineStyleMenuRef.current.contains(event.target) &&
        lineStyleButtonRef.current &&
        !lineStyleButtonRef.current.contains(event.target)
      ) {
        setShowLineStyleMenu(false);
      }
    };

    if (showRelationMenu || showLegendPopup || showLineStyleMenu) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showRelationMenu, showLegendPopup, showLineStyleMenu]);

  // Función para aplicar la relación al seleccionarla
  const handleRelationTypeSelect = (relId) => {
    setRelType(relId);
    // Si es una edición, aplicar el cambio inmediatamente
    if (selectedEdge) {
      updateEdgeRelation(selectedEdge.id, relId);
    }
  };
  
  // Función para actualizar el estilo de línea de la arista seleccionada
  const updateLineStyle = (property, value) => {
    // Actualiza el estado local
    setLineStyle(prev => ({
      ...prev,
      [property]: value
    }));
    
    // Si hay una arista seleccionada, actualiza sus datos
    if (selectedEdge) {
      const updatedEdges = edges.map(edge => {
        if (edge.id === selectedEdge.id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              [property]: value
            }
          };
        }
        return edge;
      });
      
      setEdges(updatedEdges);
    }
  };

  // Estilos
  const subMenuBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: '#f8fafc',
    height: '40px',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 32px',
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
    position: 'fixed',
    top: '48px', // Justo debajo de MenuBar
    left: 0,
    right: 0,
    zIndex: 999,
  };

  const menuLabelStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    color: '#334e68',
    fontWeight: 600,
    transition: 'background 0.2s',
    marginRight: '10px',
  };

  const iconStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    transition: 'transform 0.3s ease',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '4px',
    zIndex: 1000,
    width: '300px', // Acotamos un poco el ancho
  };

  const lineStyleDropdownStyle = {
    ...dropdownStyle,
    width: "300px",
    padding: "12px",
  };

  const inputStyle = {
    width: '100%',
    padding: '5px 6px', // Reducido el padding
    marginBottom: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '12px', // Reducido el tamaño de fuente
    height: '28px', // Fijamos una altura específica para ambos inputs
    boxSizing: 'border-box', // Aseguramos que el padding no afecte el tamaño total
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: '30px', // Aumentado de 8px a 30px
    marginBottom: '10px',
    paddingLeft: '5px', // Espacio simétrico izquierdo
    paddingRight: '5px', // Espacio simétrico derecho
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: selectedEdge ? '#10b981' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
  };

  const relationIconStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px', // Reducido padding
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const legendPopupStyle = {
    position: 'absolute',
    top: '100%',
    left: '0px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    padding: '12px',
    zIndex: 1000,
    maxWidth: '400px',
    maxHeight: '400px',
    overflowY: 'auto',
  };
  
  const styleSectionTitle = {
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '12px',
    marginBottom: '8px',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '4px',
  };
  
  const styleOptionContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  };
  
  const styleOption = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '70px',
    height: '50px',
    transition: 'all 0.2s ease',
  };
  
  const sliderContainer = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  };
  
  const sliderLabel = {
    fontSize: '13px',
    color: '#475569',
    minWidth: '100px',
  };
  
  const sliderStyle = {
    flex: 1,
  };
  
  const sliderValueStyle = {
    fontSize: '12px',
    color: '#64748b',
    minWidth: '30px',
    textAlign: 'right',
  };
  
  const checkboxContainer = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  };
  
  const checkboxStyle = {
    marginRight: '8px',
  };
  
  const checkboxLabel = {
    fontSize: '13px',
    color: '#475569',
  };

  return (
    <div style={subMenuBarStyle}>
      {/* Menú Relación */}
      {showRelationEditor && (
        <div
          ref={relationButtonRef}
          style={{
            ...menuLabelStyle,
            background: showRelationMenu ? '#e2e8f0' : 'transparent',
          }}
          onClick={(e) => {
            const rect = relationButtonRef.current.getBoundingClientRect();
            setRelationMenuPosition({ top: rect.bottom, left: rect.left });
            setShowRelationMenu(prev => !prev);
            setShowLegendPopup(false);
            setShowLineStyleMenu(false);
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V5a2 2 0 0 1 2-2h6" />
              <path d="M14 13h4a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2zm0 0v9"/>
            </svg>
            Relación
          </span>
          <span style={{
            ...iconStyle,
            transform: showRelationMenu ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#334e68"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>

          {showRelationMenu && (
            <MenuPortal 
              isOpen={showRelationMenu} 
              position={relationMenuPosition}
              onClickOutside={() => setShowRelationMenu(false)}
            >
              <div ref={relationMenuRef} style={dropdownStyle}>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    {selectedEdge ? "Modificar relación" : "Crear relación"}
                  </h3>
                  
                  {/* Contenedor de inputs en fila */}
                  <div style={inputContainerStyle}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#475569' }}>
                        Origen
                      </label>
                      <input
                        type="text"
                        placeholder="ID origen"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        style={{
                          ...inputStyle,
                          backgroundColor: selectedEdge ? '#f8fafc' : 'white'
                        }}
                        readOnly={selectedEdge !== null}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#475569' }}>
                        Destino
                      </label>
                      <input
                        type="text"
                        placeholder="ID destino"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        style={{
                          ...inputStyle,
                          backgroundColor: selectedEdge ? '#f8fafc' : 'white'
                        }}
                        readOnly={selectedEdge !== null}
                      />
                    </div>
                  </div>
                  
                  {/* Selector visual de relaciones con iconos */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>
                      Tipo de relación
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '6px', 
                      justifyContent: 'center' 
                    }}>
                      {relationshipTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => handleRelationTypeSelect(type.id)}
                          style={{
                            ...relationIconStyle,
                            backgroundColor: relType === type.id ? '#e0f2fe' : 'transparent',
                            border: relType === type.id ? '1px solid #bae6fd' : '1px solid transparent',
                          }}
                          title={type.name}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '28px'
                          }}>
                            {type.icon}
                          </div>
                          <span style={{ fontSize: '11px', marginTop: '2px' }}>{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botón para crear relación (solo visible cuando no hay una relación seleccionada) */}
                  {!selectedEdge && (
                    <button
                      onClick={() => {
                        onRelate(source, target, relType);
                        setShowRelationMenu(false);
                      }}
                      style={buttonStyle}
                    >
                      Crear Relación
                    </button>
                  )}
                </div>
              </div>
            </MenuPortal>
          )}
        </div>
      )}

      {/* Botón para mostrar leyenda */}
      {showRelationLegend && (
        <div
          ref={legendButtonRef}
          style={{
            ...menuLabelStyle,
            background: showLegendPopup ? '#e2e8f0' : 'transparent',
          }}
          onClick={(e) => {
            const rect = legendButtonRef.current.getBoundingClientRect();
            setLegendPopupPosition({ top: rect.bottom, left: rect.left });
            setShowLegendPopup(prev => !prev);
            setShowRelationMenu(false);
            setShowLineStyleMenu(false);
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h.01"/>
              <path d="M11 7h6"/>
              <path d="M7 12h.01"/>
              <path d="M11 12h6"/>
              <path d="M7 17h.01"/>
              <path d="M11 17h6"/>
            </svg>
            Leyenda
          </span>

          {showLegendPopup && (
            <MenuPortal 
              isOpen={showLegendPopup} 
              position={legendPopupPosition}
              onClickOutside={() => setShowLegendPopup(false)}
            >
              <div ref={legendPopupRef} style={legendPopupStyle}>
                <RelationshipsLegend />
              </div>
            </MenuPortal>
          )}
        </div>
      )}

      {/* Botón y Menú Estilo de Línea */}
      <div
        ref={lineStyleButtonRef}
        style={{
          ...menuLabelStyle,
          background: showLineStyleMenu ? '#e2e8f0' : 'transparent',
        }}
        onClick={(e) => {
          const rect = lineStyleButtonRef.current.getBoundingClientRect();
          setLineStyleMenuPosition({ top: rect.bottom, left: rect.left });
          setShowLineStyleMenu(prev => !prev);
          setShowRelationMenu(false);
          setShowLegendPopup(false);
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 6H3"/>
            <path d="M21 12H3" strokeDasharray="4 2"/>
            <path d="M21 18H3" strokeDasharray="2 2"/>
          </svg>
          Estilo de línea
        </span>
        <span style={{
          ...iconStyle,
          transform: showLineStyleMenu ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#334e68"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>

        {showLineStyleMenu && (
          <MenuPortal 
            isOpen={showLineStyleMenu} 
            position={lineStyleMenuPosition}
            onClickOutside={() => setShowLineStyleMenu(false)}
          >
            <div ref={lineStyleMenuRef} style={lineStyleDropdownStyle}>
              <h3 style={{margin: '0 0 12px 0', fontSize: '16px'}}>Estilo de línea</h3>
              
              {/* Tipo de trazo */}
              <div style={styleSectionTitle}>Tipo de trazo</div>
              <div style={styleOptionContainer}>
                {strokeTypes.map((type) => (
                  <div
                    key={`stroke-${type.id}`}
                    onClick={() => updateLineStyle('strokeType', type.id)}
                    style={{
                      ...styleOption,
                      backgroundColor: lineStyle.strokeType === type.id ? '#e0f2fe' : 'transparent',
                      borderColor: lineStyle.strokeType === type.id ? '#0284c7' : '#e2e8f0',
                    }}
                    title={type.name}
                  >
                    <div style={{color: lineStyle.strokeType === type.id ? '#0284c7' : 'currentColor'}}>
                      {type.icon}
                    </div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>{type.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Tipo de conexión */}
              <div style={styleSectionTitle}>Tipo de conexión</div>
              <div style={styleOptionContainer}>
                {connectionTypes.map((type) => (
                  <div
                    key={`connection-${type.id}`}
                    onClick={() => updateLineStyle('connectionType', type.id)}
                    style={{
                      ...styleOption,
                      backgroundColor: lineStyle.connectionType === type.id ? '#e0f2fe' : 'transparent',
                      borderColor: lineStyle.connectionType === type.id ? '#0284c7' : '#e2e8f0',
                    }}
                    title={type.name}
                  >
                    <div style={{color: lineStyle.connectionType === type.id ? '#0284c7' : 'currentColor'}}>
                      {type.icon}
                    </div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>{type.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Marcadores */}
              <div style={styleSectionTitle}>Marcadores</div>
              <div style={sliderContainer}>
                <div style={sliderLabel}>Inicio:</div>
                <div style={{display: 'flex', flex: 1, gap: '6px'}}>
                  {markers.map((marker) => (
                    <div
                      key={`start-${marker.id}`}
                      onClick={() => updateLineStyle('markerStart', marker.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        border: '1px solid',
                        borderColor: lineStyle.markerStart === marker.id ? '#0284c7' : '#e2e8f0',
                        borderRadius: '4px',
                        backgroundColor: lineStyle.markerStart === marker.id ? '#e0f2fe' : 'transparent',
                        cursor: 'pointer',
                        height: '28px',
                        width: '45px',
                      }}
                      title={marker.name}
                    >
                      <div style={{transform: 'scaleX(-1)', color: lineStyle.markerStart === marker.id ? '#0284c7' : 'currentColor'}}>
                        {marker.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={sliderContainer}>
                <div style={sliderLabel}>Final:</div>
                <div style={{display: 'flex', flex: 1, gap: '6px'}}>
                  {markers.map((marker) => (
                    <div
                      key={`end-${marker.id}`}
                      onClick={() => updateLineStyle('markerEnd', marker.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        border: '1px solid',
                        borderColor: lineStyle.markerEnd === marker.id ? '#0284c7' : '#e2e8f0',
                        borderRadius: '4px',
                        backgroundColor: lineStyle.markerEnd === marker.id ? '#e0f2fe' : 'transparent',
                        cursor: 'pointer',
                        height: '28px',
                        width: '45px',
                      }}
                      title={marker.name}
                    >
                      <div style={{color: lineStyle.markerEnd === marker.id ? '#0284c7' : 'currentColor'}}>
                        {marker.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Grosor de línea */}
              <div style={styleSectionTitle}>Grosor y configuraciones</div>
              <div style={sliderContainer}>
                <div style={sliderLabel}>Grosor:</div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={lineStyle.strokeWidth}
                  onChange={(e) => updateLineStyle('strokeWidth', parseInt(e.target.value))}
                  style={sliderStyle}
                />
                <div style={sliderValueStyle}>{lineStyle.strokeWidth}px</div>
              </div>
              
              {/* Auto-conexión */}
              <div style={checkboxContainer}>
                <input
                  type="checkbox"
                  checked={lineStyle.autoConnect}
                  onChange={(e) => updateLineStyle('autoConnect', e.target.checked)}
                  style={checkboxStyle}
                  id="autoconnect-checkbox"
                />
                <label htmlFor="autoconnect-checkbox" style={checkboxLabel}>
                  Conexión automática
                </label>
              </div>
            </div>
          </MenuPortal>
        )}
      </div>

      {/* Modo rápido de cambio cuando hay una arista seleccionada */}
      {selectedEdge && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginLeft: '40px',
          padding: '0 12px',
          backgroundColor: '#f1f5f9',
          borderRadius: '20px',
          height: '32px',
        }}>
          <span style={{ fontSize: '13px', marginRight: '8px', color: '#475569' }}>
            Cambiar rápido:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {relationshipTypes.map((type) => (
              <div
                key={`rapid-${type.id}`}
                onClick={() => {
                  updateEdgeRelation(selectedEdge.id, type.id);
                  setRelType(type.id);
                }}
                style={{
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: relType === type.id ? '#e0f2fe' : 'transparent',
                  border: relType === type.id ? '1px solid #bae6fd' : '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24px',
                  height: '24px'
                }}
                title={type.name}
              >
                {React.cloneElement(type.icon, {width: 20, height: 20})}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubMenuBar;