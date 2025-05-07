import React, { useState, useRef } from 'react';
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
}) {
  // Estados para menús principales
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  
  // Estados para submenús de Archivo
  const [showImportSubmenu, setShowImportSubmenu] = useState(false);
  const [showExportSubmenu, setShowExportSubmenu] = useState(false);
  
  // Estados para posiciones de menús
  const [fileMenuPosition, setFileMenuPosition] = useState({ top: 0, left: 0 });
  const [viewMenuPosition, setViewMenuPosition] = useState({ top: 0, left: 0 });
  const [importSubmenuPosition, setImportSubmenuPosition] = useState({ top: 0, left: 0 });
  const [exportSubmenuPosition, setExportSubmenuPosition] = useState({ top: 0, left: 0 });
  
  // Referencias para los elementos DOM
  const fileInputRef = useRef(null);
  const fileMenuRef = useRef(null);
  const fileMenuButtonRef = useRef(null);
  const viewMenuRef = useRef(null);
  const viewMenuButtonRef = useRef(null);
  const importItemRef = useRef(null);
  const exportItemRef = useRef(null);
  const importSubmenuRef = useRef(null);
  const exportSubmenuRef = useRef(null);

  const closeOtherMenus = (currentMenuRef, isSubmenu = false) => {
    if (window._activeMenus) {
      window._activeMenus.forEach(menu => {
        if (menu.ref.current !== currentMenuRef.current && menu.onClose && !isSubmenu) {
          menu.onClose();
        }
      });
    }
  };

  const openMenuAndCloseOthers = (menuToOpen) => {
    if (menuToOpen === 'file') {
      setShowFileMenu(true);
      setShowViewMenu(false);
      closeOtherMenus(fileMenuRef);
    } else if (menuToOpen === 'view') {
      setShowViewMenu(true);
      setShowFileMenu(false);
      closeOtherMenus(viewMenuRef);
    } else if (menuToOpen === 'importSubmenu') {
      setShowImportSubmenu(true);
      setShowExportSubmenu(false);
      closeOtherMenus(importSubmenuRef, true);
    } else if (menuToOpen === 'exportSubmenu') {
      setShowExportSubmenu(true);
      setShowImportSubmenu(false);
      closeOtherMenus(exportSubmenuRef, true);
    }
  };

  const handleMenuHover = (menuType) => {
    if (menuType === 'file' && !showFileMenu) {
      const rect = fileMenuButtonRef.current.getBoundingClientRect();
      setFileMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('file');
    } else if (menuType === 'view' && !showViewMenu) {
      const rect = viewMenuButtonRef.current.getBoundingClientRect();
      setViewMenuPosition({ top: rect.bottom, left: rect.left });
      openMenuAndCloseOthers('view');
    } else if (menuType === 'importSubmenu' && !showImportSubmenu) {
      const rect = importItemRef.current.getBoundingClientRect();
      setImportSubmenuPosition({ top: rect.top - 5, left: rect.right + 5 });
      openMenuAndCloseOthers('importSubmenu');
    } else if (menuType === 'exportSubmenu' && !showExportSubmenu) {
      const rect = exportItemRef.current.getBoundingClientRect();
      setExportSubmenuPosition({ top: rect.top - 5, left: rect.right + 5 });
      openMenuAndCloseOthers('exportSubmenu');
    }
  };

  const handleMenuClick = (menuType, e) => {
    e.stopPropagation();
    
    if (menuType === 'file') {
      if (showFileMenu) {
        // No cerramos si ya está abierto
      } else {
        const rect = fileMenuButtonRef.current.getBoundingClientRect();
        setFileMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('file');
      }
    } else if (menuType === 'view') {
      if (showViewMenu) {
        // No cerramos si ya está abierto
      } else {
        const rect = viewMenuButtonRef.current.getBoundingClientRect();
        setViewMenuPosition({ top: rect.bottom, left: rect.left });
        openMenuAndCloseOthers('view');
      }
    } else if (menuType === 'importSubmenu') {
      if (showImportSubmenu) {
        // No cerramos si ya está abierto
      } else {
        const rect = importItemRef.current.getBoundingClientRect();
        setImportSubmenuPosition({ top: rect.top - 5, left: rect.right + 5 });
        openMenuAndCloseOthers('importSubmenu');
      }
    } else if (menuType === 'exportSubmenu') {
      if (showExportSubmenu) {
        // No cerramos si ya está abierto
      } else {
        const rect = exportItemRef.current.getBoundingClientRect();
        setExportSubmenuPosition({ top: rect.top - 5, left: rect.right + 5 });
        openMenuAndCloseOthers('exportSubmenu');
      }
    }
  };

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
    minWidth: '200px',
  };
  const submenuStyle = {
    ...dropdownStyle,
    top: '0px',
    left: '100%',
    marginTop: '0',
    marginLeft: '1px',
  };
  const dropdownItemStyle = {
    padding: '10px 16px',
    whiteSpace: 'nowrap',
    color: '#334e68',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  const submenuIconStyle = {
    marginLeft: '10px',
  };
  const dropdownItemHover = e => e.currentTarget.style.background = '#f0f4f8';
  const dropdownItemLeave = e => e.currentTarget.style.background = 'transparent';

  return (
    <>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          onImportJSON(e);
          setShowFileMenu(false);
          setShowImportSubmenu(false);
          setShowExportSubmenu(false);
        }}
      />

      <div style={menuBarStyle}>
        <img src="/logo192.png" alt="App Logo" style={logoStyle} />

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
              closeDelay={300}
            >
              <div ref={fileMenuRef} style={dropdownStyle}>
                <div
                  ref={importItemRef}
                  style={dropdownItemStyle}
                  onMouseEnter={() => handleMenuHover('importSubmenu')}
                  onClick={(e) => handleMenuClick('importSubmenu', e)}
                >
                  <span>Importar</span>
                  <span style={submenuIconStyle}>
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
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </span>
                  
                  {showImportSubmenu && (
                    <MenuPortal 
                      isOpen={showImportSubmenu} 
                      position={importSubmenuPosition}
                      onClickOutside={() => setShowImportSubmenu(false)}
                      isSubmenu={true}
                      closeDelay={300}
                    >
                      <div ref={importSubmenuRef} style={submenuStyle}>
                        <div
                          style={dropdownItemStyle}
                          onMouseEnter={dropdownItemHover}
                          onMouseLeave={dropdownItemLeave}
                          onClick={() => {
                            setShowFileMenu(false);
                            setShowImportSubmenu(false);
                            setTimeout(() => fileInputRef.current.click(), 0);
                          }}
                        >
                          Importar JSON
                        </div>
                      </div>
                    </MenuPortal>
                  )}
                </div>

                <div
                  ref={exportItemRef}
                  style={dropdownItemStyle}
                  onMouseEnter={() => handleMenuHover('exportSubmenu')}
                  onClick={(e) => handleMenuClick('exportSubmenu', e)}
                >
                  <span>Exportar</span>
                  <span style={submenuIconStyle}>
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
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </span>
                  
                  {showExportSubmenu && (
                    <MenuPortal 
                      isOpen={showExportSubmenu} 
                      position={exportSubmenuPosition}
                      onClickOutside={() => setShowExportSubmenu(false)}
                      isSubmenu={true}
                      closeDelay={300}
                    >
                      <div ref={exportSubmenuRef} style={submenuStyle}>
                        <div
                          style={dropdownItemStyle}
                          onMouseEnter={dropdownItemHover}
                          onMouseLeave={dropdownItemLeave}
                          onClick={() => {
                            setShowFileMenu(false);
                            setShowExportSubmenu(false);
                            onExportJSON();
                          }}
                        >
                          Exportar JSON
                        </div>

                        <div
                          style={dropdownItemStyle}
                          onMouseEnter={dropdownItemHover}
                          onMouseLeave={dropdownItemLeave}
                          onClick={() => {
                            setShowFileMenu(false);
                            setShowExportSubmenu(false);
                            onExportCSV();
                          }}
                        >
                          Exportar CSV
                        </div>

                        <div
                          style={dropdownItemStyle}
                          onMouseEnter={dropdownItemHover}
                          onMouseLeave={dropdownItemLeave}
                          onClick={() => {
                            setShowFileMenu(false);
                            setShowExportSubmenu(false);
                            onExportPNG();
                          }}
                        >
                          Exportar PNG
                        </div>

                        <div
                          style={dropdownItemStyle}
                          onMouseEnter={dropdownItemHover}
                          onMouseLeave={dropdownItemLeave}
                          onClick={() => {
                            setShowFileMenu(false);
                            setShowExportSubmenu(false);
                            onExportJPG();
                          }}
                        >
                          Exportar JPG
                        </div>
                      </div>
                    </MenuPortal>
                  )}
                </div>
              </div>
            </MenuPortal>
          )}
        </div>

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
              closeDelay={300}
            >
              <div ref={viewMenuRef} style={dropdownStyle}>
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
              </div>
            </MenuPortal>
          )}
        </div>
      </div>
    </>
  );
}