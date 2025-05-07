import React, { useState, useRef, useEffect } from 'react';
import MenuPortal from './MenuPortal';
import FormattingToolbar from './FormattingToolbar';

/**
 * SubMenuBar - Barra de menú secundaria debajo de MenuBar para funcionalidades adicionales
 * Incluye opciones para crear y gestionar relaciones entre nodos con selector visual
 * y barra de herramientas de formato de texto similar a Lucidchart
 */
const SubMenuBar = ({
  onRelate,
  updateEdgeRelation,
  selectedEdge,
  setNodes,
  setEdges,
  edges,
  showRelationEditor = true,
  selectedNode = null, // Nodo seleccionado para formato
  updateNodeStyle, // Función para actualizar el estilo del nodo
}) => {
  // Estado para manejar los menús desplegables
  const [showRelationMenu, setShowRelationMenu] = useState(false);
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);
  
  // Estado para posiciones de menús desplegables
  const [relationMenuPosition, setRelationMenuPosition] = useState({ top: 0, left: 0 });
  const [lineStyleMenuPosition, setLineStyleMenuPosition] = useState({ top: 0, left: 0 });
  
  // Estado para saber si hay algún menú activo (para comportamiento hover)
  const [anyMenuActive, setAnyMenuActive] = useState(false);
  // Estado para saber si el ratón está dentro del SubMenuBar
  const [mouseInSubMenuBar, setMouseInSubMenuBar] = useState(false);
  
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
  const subMenuBarRef = useRef(null);
  const relationMenuRef = useRef(null);
  const relationButtonRef = useRef(null);
  const lineStyleMenuRef = useRef(null);
  const lineStyleButtonRef = useRef(null);
  
  // Actualizamos el estado anyMenuActive cuando cambia el estado de los menús
  useEffect(() => {
    const isAnyMenuActive = showRelationMenu || showLineStyleMenu;
    setAnyMenuActive(isAnyMenuActive);
  }, [showRelationMenu, showLineStyleMenu]);

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

  // Función para cerrar menús actualmente abiertos excepto el indicado
  const closeOtherMenus = (currentMenuRef) => {
    if (window._activeMenus) {
      window._activeMenus.forEach(menu => {
        // Si el menú no es el actual (el que vamos a mostrar), lo cerramos
        if (menu.ref.current !== currentMenuRef.current && menu.onClose) {
          menu.onClose();
        }
      });
    }
  };

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setShowRelationMenu(false);
    setShowLineStyleMenu(false);
  };

  // Manejar la entrada y salida del ratón del SubMenuBar
  const handleMouseEnterSubMenuBar = () => {
    setMouseInSubMenuBar(true);
  };

  const handleMouseLeaveSubMenuBar = () => {
    setMouseInSubMenuBar(false);
    // Si el ratón sale del SubMenuBar y no hay ningún menú abierto en este momento
    // (esto previene que se cierren los menús si el ratón entra en un menú desplegado)
    if (anyMenuActive && !window._activeMenus) {
      closeAllMenus();
    }
  };

  // Efecto para manejar clics en cualquier parte del documento
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Si hay algún menú abierto y el clic fue fuera de la barra de menú y fuera de cualquier menú
      if (anyMenuActive) {
        let clickedInSubMenuBar = subMenuBarRef.current && subMenuBarRef.current.contains(e.target);
        let clickedInAnyMenu = false;
        
        if (window._activeMenus) {
          window._activeMenus.forEach(menu => {
            if (menu.ref.current && menu.ref.current.contains(e.target)) {
              clickedInAnyMenu = true;
            }
          });
        }
        
        if (!clickedInSubMenuBar && !clickedInAnyMenu) {
          closeAllMenus();
        }
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [anyMenuActive]);

  // Función para mostrar un menú y esconder los otros
  const openMenuAndCloseOthers = (menuToOpen) => {
    if (menuToOpen === 'relation') {
      setShowRelationMenu(true);
      setShowLineStyleMenu(false);
      closeOtherMenus(relationMenuRef);
    } else if (menuToOpen === 'lineStyle') {
      setShowLineStyleMenu(true);
      setShowRelationMenu(false);
      closeOtherMenus(lineStyleMenuRef);
    }
  };

  // Función para manejar la apertura automática al hacer hover
  const handleMenuHover = (menuType) => {
    // Si ya hay un menú activo, permitimos que se abra por hover
    const shouldOpenByHover = anyMenuActive && mouseInSubMenuBar;
    
    if (menuType === 'relation' && (!showRelationMenu && shouldOpenByHover)) {
      const rect = relationButtonRef.current.getBoundingClientRect();
      setRelationMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('relation');
    } else if (menuType === 'lineStyle' && (!showLineStyleMenu && shouldOpenByHover)) {
      const rect = lineStyleButtonRef.current.getBoundingClientRect();
      setLineStyleMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('lineStyle');
    }
  };

  // Función para manejar el clic en un botón de menú
  const handleMenuClick = (menuType, e) => {
    e.stopPropagation();
    
    if (menuType === 'relation') {
      if (showRelationMenu) {
        // No cerramos si ya está abierto, el usuario probablemente quiere navegar el menú
      } else {
        const rect = relationButtonRef.current.getBoundingClientRect();
        setRelationMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('relation');
      }
    } else if (menuType === 'lineStyle') {
      if (showLineStyleMenu) {
        // No cerramos si ya está abierto, el usuario probablemente quiere navegar el menú
      } else {
        const rect = lineStyleButtonRef.current.getBoundingClientRect();
        setLineStyleMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('lineStyle');
      }
    }
  };

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
    justifyContent: 'flex-start', // Revertimos a flex-start para poder controlar mejor la posición
    background: '#f8fafc',
    height: '40px',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 32px',
    paddingLeft: '380px', // Añadimos padding izquierdo para mover los elementos después del sidebar
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
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px",
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

  const inputContainerStyle = {
    display: 'flex', 
    gap: '10px', 
    marginBottom: '12px'
  };

  const styleSectionTitle = {
    fontSize: '13px',
    color: '#475569',
    marginBottom: '8px',
  };
  
  const styleOptionContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  };
  
  const styleOption = {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    <div 
      style={subMenuBarStyle}
      ref={subMenuBarRef}
      onMouseEnter={handleMouseEnterSubMenuBar}
      onMouseLeave={handleMouseLeaveSubMenuBar}
    >
      {/* Barra de herramientas de formato - Utilizamos el componente FormattingToolbar */}
      <FormattingToolbar 
        selectedNode={selectedNode} 
        updateNodeStyle={updateNodeStyle} 
      />

      {/* Menú Relación */}
      {showRelationEditor && (
        <div
          ref={relationButtonRef}
          style={{
            ...menuLabelStyle,
            background: showRelationMenu ? '#e2e8f0' : 'transparent',
          }}
          onClick={(e) => handleMenuClick('relation', e)}
          onMouseEnter={() => handleMenuHover('relation')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2.5"/>
              <circle cx="5" cy="19" r="2.5"/>
              <circle cx="19" cy="19" r="2.5"/>
              <path d="M12 7L12 13"/>
              <path d="M5 17L5 13 19 13 19 17"/>
              <path d="M12 13L5 13"/>
              <path d="M12 13L19 13"/>
            </svg>
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

      {/* Botón y Menú Estilo de Línea */}
      <div
        ref={lineStyleButtonRef}
        style={{
          ...menuLabelStyle,
          background: showLineStyleMenu ? '#e2e8f0' : 'transparent',
        }}
        onClick={(e) => handleMenuClick('lineStyle', e)}
        onMouseEnter={() => handleMenuHover('lineStyle')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 6H3"/>
            <path d="M21 12H3" strokeDasharray="4 2"/>
            <path d="M21 18H3" strokeDasharray="2 2"/>
          </svg>
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
                      <div style={{color: lineStyle.markerStart === marker.id ? '#0284c7' : 'currentColor'}}>
                        {marker.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={sliderContainer}>
                <div style={sliderLabel}>Fin:</div>
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
                {type.icon}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubMenuBar;