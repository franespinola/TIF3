import React from 'react';

/**
 * Componente que maneja el botón para colapsar/expandir el sidebar
 */
const CollapseToggle = ({ collapsed, setCollapsed }) => {
  // Estilo base para el botón de toggle
  const toggleButtonStyle = {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0,
  };

  // Estilo para el hover del botón
  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = '#e2e8f0';
  };
  
  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = '#f1f5f9';
  };

  // Manejar el clic para colapsar/expandir y notificar al padre
  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
  };

  return (
    <button 
      onClick={handleToggle} 
      style={toggleButtonStyle}
      title={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'transform 0.2s ease',
          transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        <polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
      </svg>
    </button>
  );
};

export default CollapseToggle;