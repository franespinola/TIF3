import React from 'react';

/**
 * Componente que maneja el botón para colapsar/expandir el sidebar
 */
const CollapseToggle = ({ collapsed, setCollapsed }) => {
  // Base style for collapse toggle button
  const toggleButtonStyle = {
    background: 'linear-gradient(135deg, #e0e5ec, #f5f7fa)',
    border: '1px solid #ccd6e3',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, background 0.3s',
    position: 'relative',
    top: '-10px',
    left: '-10px',
  };

  // Arrow icon style for collapse toggle
  const arrowStyle = {
    transition: 'transform 0.3s ease-in-out',
    transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
    stroke: '#4f46e5',
    strokeWidth: 2,
    fill: 'none',
  };

  return (
    <div style={{ position: 'relative', padding: '8px' }}>
      <button 
        onClick={() => setCollapsed(c => !c)} 
        style={toggleButtonStyle}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" style={arrowStyle}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
};

export default CollapseToggle;