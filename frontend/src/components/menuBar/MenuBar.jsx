import React, { useState, useRef, useEffect } from 'react';

/**
 * MenuBar component renders the top "Archivo" menu with import/export options
 */
export default function MenuBar({
  onImportJSON,
  onExportJSON,
  onExportCSV,
  onExportPNG,
  onExportJPG
}) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Cierra el menú si clicás fuera del botón o del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showMenu]);

  // Estilos
  const menuBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: '#f0f4f8',
    height: '48px',
    borderBottom: '1px solid #d1d9e6',
    padding: '0 32px',
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    left: '12px',
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
        onChange={(e) => {
          onImportJSON(e);
          // (por si acaso) cerramos aquí también tras elegir archivo
          setShowMenu(false);
        }}
      />

      {/* Top menu bar */}
      <div style={menuBarStyle}>
        <img src="/logo192.png" alt="App Logo" style={logoStyle} />

        <div
          ref={menuButtonRef}
          style={menuLabelStyle}
          onClick={() => setShowMenu(prev => !prev)}
        >
          <span>Archivo</span>
          <span style={iconStyle}>
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

          {showMenu && (
            <div ref={menuRef} style={dropdownStyle}>
              {/* Importar JSON */}
              <div
                style={dropdownItemStyle}
                onMouseEnter={dropdownItemHover}
                onMouseLeave={dropdownItemLeave}
                onClick={() => {
                  // cerramos antes de abrir el diálogo
                  setShowMenu(false);
                  // y lanzamos el click en el input tras un tick
                  setTimeout(() => fileInputRef.current.click(), 0);
                }}
              >
                Importar JSON
              </div>

              {/* Exportar JSON */}
              <div
                style={dropdownItemStyle}
                onMouseEnter={dropdownItemHover}
                onMouseLeave={dropdownItemLeave}
                onClick={() => {
                  setShowMenu(false);
                  onExportJSON();
                }}
              >
                Exportar JSON
              </div>

              {/* Exportar CSV */}
              <div
                style={dropdownItemStyle}
                onMouseEnter={dropdownItemHover}
                onMouseLeave={dropdownItemLeave}
                onClick={() => {
                  setShowMenu(false);
                  onExportCSV();
                }}
              >
                Exportar CSV
              </div>

              {/* Exportar PNG */}
              <div
                style={dropdownItemStyle}
                onMouseEnter={dropdownItemHover}
                onMouseLeave={dropdownItemLeave}
                onClick={() => {
                  setShowMenu(false);
                  onExportPNG();
                }}
              >
                Exportar PNG
              </div>

              {/* Exportar JPG */}
              <div
                style={dropdownItemStyle}
                onMouseEnter={dropdownItemHover}
                onMouseLeave={dropdownItemLeave}
                onClick={() => {
                  setShowMenu(false);
                  onExportJPG();
                }}
              >
                Exportar JPG
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
