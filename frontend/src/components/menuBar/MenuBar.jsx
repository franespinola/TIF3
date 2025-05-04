import React, { useState, useRef, useEffect } from 'react';
import MenuPortal from './MenuPortal';

/**
 * MenuBar component renders the top menu with import/export options
 */
export default function MenuBar({
  onImportJSON,
  onExportJSON,
  onExportCSV,
  onExportPNG,
  onExportJPG,
  // Propiedades para controlar la visibilidad de los paneles
  showNavigationPanel,
  setShowNavigationPanel,
  showSmartGuidesConfigPanel,
  setShowSmartGuidesConfigPanel,
  showThemeVisualizer,
  setShowThemeVisualizer,
  showMinimap,
  setShowMinimap,
  showRelationEditor,
  setShowRelationEditor,
  showRelationLegend,
  setShowRelationLegend
}) {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [fileMenuPosition, setFileMenuPosition] = useState({ top: 0, left: 0 });
  const [viewMenuPosition, setViewMenuPosition] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef(null);
  const fileMenuRef = useRef(null);
  const fileMenuButtonRef = useRef(null);
  const viewMenuRef = useRef(null);
  const viewMenuButtonRef = useRef(null);

  // Cierra los menús si clicás fuera del botón o del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Para menú Archivo
      if (
        showFileMenu &&
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target) &&
        fileMenuButtonRef.current &&
        !fileMenuButtonRef.current.contains(event.target)
      ) {
        setShowFileMenu(false);
      }
      
      // Para menú Visualizar
      if (
        showViewMenu &&
        viewMenuRef.current &&
        !viewMenuRef.current.contains(event.target) &&
        viewMenuButtonRef.current &&
        !viewMenuButtonRef.current.contains(event.target)
      ) {
        setShowViewMenu(false);
      }
    };

    if (showFileMenu || showViewMenu) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showFileMenu, showViewMenu]);

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
    marginRight: '10px', // Espacio entre elementos del menú
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
    minWidth: '200px',
  };
  const dropdownItemStyle = {
    padding: '10px 16px',
    whiteSpace: 'nowrap',
    color: '#334e68',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    borderBottom: '1px solid #f1f5f9',
  };
  const checkboxItemStyle = {
    ...dropdownItemStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '16px',
  };
  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
  }
  const checkboxStyle = {
    marginRight: '8px',
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
          setShowFileMenu(false);
        }}
      />

      {/* Top menu bar */}
      <div style={menuBarStyle}>
        <img src="/logo192.png" alt="App Logo" style={logoStyle} />

        {/* Menú Archivo */}
        <div
          ref={fileMenuButtonRef}
          style={{
            ...menuLabelStyle,
            background: showFileMenu ? '#e2e8f0' : 'transparent',
          }}
          onClick={(e) => {
            setShowFileMenu(prev => !prev);
            setShowViewMenu(false); // Cerrar el otro menú
            const rect = e.currentTarget.getBoundingClientRect();
            setFileMenuPosition({ top: rect.bottom, left: rect.left });
          }}
        >
          <span>Archivo</span>
          <span style={{
            ...iconStyle,
            transform: showFileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
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

          {showFileMenu && (
            <MenuPortal isOpen={showFileMenu} position={fileMenuPosition}>
              <div ref={fileMenuRef} style={dropdownStyle}>
                {/* Importar JSON */}
                <div
                  style={dropdownItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                  onClick={() => {
                    // cerramos antes de abrir el diálogo
                    setShowFileMenu(false);
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
                    setShowFileMenu(false);
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
                    setShowFileMenu(false);
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
                    setShowFileMenu(false);
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
                    setShowFileMenu(false);
                    onExportJPG();
                  }}
                >
                  Exportar JPG
                </div>
              </div>
            </MenuPortal>
          )}
        </div>

        {/* Menú Visualizar */}
        <div
          ref={viewMenuButtonRef}
          style={{
            ...menuLabelStyle,
            background: showViewMenu ? '#e2e8f0' : 'transparent',
          }}
          onClick={(e) => {
            setShowViewMenu(prev => !prev);
            setShowFileMenu(false); // Cerrar el otro menú
            const rect = e.currentTarget.getBoundingClientRect();
            setViewMenuPosition({ top: rect.bottom, left: rect.left });
          }}
        >
          <span>Visualizar</span>
          <span style={{
            ...iconStyle,
            transform: showViewMenu ? 'rotate(180deg)' : 'rotate(0deg)',
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

          {showViewMenu && (
            <MenuPortal isOpen={showViewMenu} position={viewMenuPosition}>
              <div ref={viewMenuRef} style={dropdownStyle}>
                {/* Opción Panel de Navegación */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showNavigationPanel}
                      onChange={() => setShowNavigationPanel(!showNavigationPanel)}
                    />
                    Panel de Navegación
                  </label>
                </div>

                {/* Opción Panel de Configuración de Guías */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showSmartGuidesConfigPanel}
                      onChange={() => setShowSmartGuidesConfigPanel(!showSmartGuidesConfigPanel)}
                    />
                    Smart Guides
                  </label>
                </div>

                {/* Opción Modos de Visualización */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showThemeVisualizer}
                      onChange={() => setShowThemeVisualizer(!showThemeVisualizer)}
                    />
                    Modos de Visualización
                  </label>
                </div>

                {/* Opción Minimapa */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showMinimap}
                      onChange={() => setShowMinimap(!showMinimap)}
                    />
                    Minimapa
                  </label>
                </div>

                {/* Opción Editor de Relaciones (en sidebar) */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showRelationEditor}
                      onChange={() => setShowRelationEditor(!showRelationEditor)}
                    />
                    Editor de Relaciones (sidebar)
                  </label>
                </div>

                {/* Opción Leyenda de Relaciones (en sidebar) */}
                <div
                  style={checkboxItemStyle}
                  onMouseEnter={dropdownItemHover}
                  onMouseLeave={dropdownItemLeave}
                >
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={showRelationLegend}
                      onChange={() => setShowRelationLegend(!showRelationLegend)}
                    />
                    Leyenda de Relaciones (sidebar)
                  </label>
                </div>
              </div>
            </MenuPortal>
          )}
        </div>
      </div>
    </>
  );
}
