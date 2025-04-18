import React, { useState, useRef } from 'react';

/**
 * MenuBar component renders the top "Archivo" menu with import/export options
 */
export default function MenuBar({ onImportJSON, onExportJSON, onExportCSV, onExportPNG, onExportJPG }) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  // Estilos mejorados para el menú y desplegable
  const menuBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: '#f0f4f8',
    height: '48px',
    borderBottom: '1px solid #d1d9e6',
    padding: '0 32px',       // increase separation from screen edges
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
  };
  const logoStyle = {
    height: '32px',
    cursor: 'pointer',
    marginRight: '16px',
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
  };
  const iconStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    transition: 'transform 0.3s ease',
    transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
  };
  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '12px', // align dropdown precisely with start of 'Archivo' text
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '4px',
    zIndex: 1000,
  };
  const dropdownItemStyle = {
    padding: '10px 16px',
    whiteSpace: 'nowrap',
    color: '#334e68',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    borderBottom: '1px solid #f1f5f9',
  };
  const dropdownItemHover = e => e.currentTarget.style.background = '#f0f4f8';
  const dropdownItemLeave = e => e.currentTarget.style.background = 'transparent';

  return (
    <>
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onImportJSON}
      />
      {/* Top menu bar similar to Lucidchart */}
      <div style={menuBarStyle}>
        <img src="/logo192.png" alt="App Logo" style={logoStyle} />
        <div style={menuLabelStyle} onClick={() => setShowMenu(prev => !prev)}>
          <span>Archivo</span>
          <span style={iconStyle}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334e68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          {showMenu && (
            <div style={dropdownStyle}>
              <div onClick={() => fileInputRef.current.click()} onMouseEnter={dropdownItemHover} onMouseLeave={dropdownItemLeave} style={dropdownItemStyle}>Importar JSON</div>
              <div onClick={onExportJSON} onMouseEnter={dropdownItemHover} onMouseLeave={dropdownItemLeave} style={dropdownItemStyle}>Exportar JSON</div>
              <div onClick={onExportCSV} onMouseEnter={dropdownItemHover} onMouseLeave={dropdownItemLeave} style={dropdownItemStyle}>Exportar CSV</div>
              <div onClick={onExportPNG} onMouseEnter={dropdownItemHover} onMouseLeave={dropdownItemLeave} style={dropdownItemStyle}>Exportar PNG</div>
              <div onClick={onExportJPG} onMouseEnter={dropdownItemHover} onMouseLeave={dropdownItemLeave} style={dropdownItemStyle}>Exportar JPG</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}