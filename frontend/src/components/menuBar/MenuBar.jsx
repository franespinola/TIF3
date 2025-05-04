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
  
  // Referencia al input file oculto para importar
  const fileInputRef = useRef(null);
  const fileMenuRef = useRef(null);
  const fileMenuButtonRef = useRef(null);
  const viewMenuRef = useRef(null);
  const viewMenuButtonRef = useRef(null);

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

  // Función para mostrar un menú y esconder los otros
  const openMenuAndCloseOthers = (menuToOpen) => {
    if (menuToOpen === 'file') {
      setShowFileMenu(true);
      setShowViewMenu(false);
      closeOtherMenus(fileMenuRef);
    } else if (menuToOpen === 'view') {
      setShowViewMenu(true);
      setShowFileMenu(false);
      closeOtherMenus(viewMenuRef);
    }
  };

  // Función para manejar el hover con intención (detección de intención real)
  const handleMenuHover = (menuType) => {
    if (menuType === 'file' && !showFileMenu) {
      const rect = fileMenuButtonRef.current.getBoundingClientRect();
      setFileMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('file');
    } else if (menuType === 'view' && !showViewMenu) {
      const rect = viewMenuButtonRef.current.getBoundingClientRect();
      setViewMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('view');
    }
  };

  // Función para manejar el clic en un botón de menú
  const handleMenuClick = (menuType, e) => {
    e.stopPropagation();
    
    if (menuType === 'file') {
      if (showFileMenu) {
        // No cerramos si ya está abierto, el usuario probablemente quiere navegar el menú
      } else {
        const rect = fileMenuButtonRef.current.getBoundingClientRect();
        setFileMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('file');
      }
    } else if (menuType === 'view') {
      if (showViewMenu) {
        // No cerramos si ya está abierto, el usuario probablemente quiere navegar el menú
      } else {
        const rect = viewMenuButtonRef.current.getBoundingClientRect();
        setViewMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('view');
      }
    }
  };

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
          onClick={(e) => handleMenuClick('file', e)}
          onMouseEnter={() => handleMenuHover('file')}
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
            <MenuPortal 
              isOpen={showFileMenu} 
              position={fileMenuPosition}
              onClickOutside={() => setShowFileMenu(false)}
            >
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
          onClick={(e) => handleMenuClick('view', e)}
          onMouseEnter={() => handleMenuHover('view')}
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
            <MenuPortal 
              isOpen={showViewMenu} 
              position={viewMenuPosition}
              onClickOutside={() => setShowViewMenu(false)}
            >
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
