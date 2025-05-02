import React, { useState, useRef, useEffect } from 'react';
import RelationshipsLegend from '../relationships/RelationshipsLegend';

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
  edges
}) => {
  // Estado para manejar los menús desplegables
  const [showRelationMenu, setShowRelationMenu] = useState(false);
  const [showLegendPopup, setShowLegendPopup] = useState(false);
  
  // Estado para formulario de relaciones
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relType, setRelType] = useState("matrimonio");
  
  // Referencias para los menús desplegables
  const relationMenuRef = useRef(null);
  const relationButtonRef = useRef(null);
  const legendPopupRef = useRef(null);
  const legendButtonRef = useRef(null);
  
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

  // Actualizar campos si hay una conexión seleccionada
  useEffect(() => {
    if (selectedEdge) {
      setSource(selectedEdge.source);
      setTarget(selectedEdge.target);
      setRelType(selectedEdge.data?.relType || "matrimonio");
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
    };

    if (showRelationMenu || showLegendPopup) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showRelationMenu, showLegendPopup]);

  // Función para aplicar la relación al seleccionarla
  const handleRelationTypeSelect = (relId) => {
    setRelType(relId);
    // Si es una edición, aplicar el cambio inmediatamente
    if (selectedEdge) {
      updateEdgeRelation(selectedEdge.id, relId);
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

  return (
    <div style={subMenuBarStyle}>
      {/* Menú Relación */}
      <div
        ref={relationButtonRef}
        style={{
          ...menuLabelStyle,
          background: showRelationMenu ? '#e2e8f0' : 'transparent',
        }}
        onClick={() => {
          setShowRelationMenu(prev => !prev);
          setShowLegendPopup(false); // Cerrar el otro popup
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
        )}
      </div>

      {/* Botón para mostrar leyenda */}
      <div
        ref={legendButtonRef}
        style={{
          ...menuLabelStyle,
          background: showLegendPopup ? '#e2e8f0' : 'transparent',
        }}
        onClick={() => {
          setShowLegendPopup(prev => !prev);
          setShowRelationMenu(false); // Cerrar el otro menú
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
          <div ref={legendPopupRef} style={legendPopupStyle}>
            <RelationshipsLegend />
          </div>
        )}
      </div>

      {/* Modo rápido de creación de relaciones cuando hay una arista seleccionada */}
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