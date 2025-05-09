import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Icons } from '../ui/Icons';
import { Avatar } from '../ui/Avatar';

/**
 * Componente de Layout para el dashboard que proporciona
 * una estructura consistente con navegación lateral, encabezado
 * y área de contenido principal.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido a mostrar dentro del layout
 */
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Información del usuario (sería obtenida de un contexto de autenticación)
  const user = {
    name: 'Dr. Francisco Valenzuela',
    role: 'Psicólogo Clínico',
    profileImage: null
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Lista de enlaces de navegación del sidebar
  const navigationLinks = [
    { 
      title: 'Dashboard', 
      path: '/', 
      icon: <Icons.Dashboard className="w-5 h-5" /> 
    },
    { 
      title: 'Pacientes', 
      path: '/patients', 
      icon: <Icons.Patients className="w-5 h-5" /> 
    },
    { 
      title: 'Citas', 
      path: '/appointments', 
      icon: <Icons.Calendar className="w-5 h-5" /> 
    },
    { 
      title: 'Genogramas', 
      path: '/genograms', 
      icon: <Icons.Genogram className="w-5 h-5" /> 
    },
    { 
      title: 'Configuración', 
      path: '/settings', 
      icon: <Icons.Settings className="w-5 h-5" /> 
    }
  ];

  // Clase para el sidebar según su estado
  const sidebarClass = `
    fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out 
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `;

  // Clase para el contenido principal según el estado del sidebar
  const mainContentClass = `
    flex-1 transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
  `;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar / Navegación lateral */}
      <div className={sidebarClass}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">PsychCare</span>
          </Link>
        </div>
        
        {/* Navegación */}
        <nav className="px-2 pt-4 pb-16 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {navigationLinks.map((navItem) => (
            <NavLink
              key={navItem.path}
              to={navItem.path}
              className={({ isActive }) => `
                flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              end={navItem.path === '/'} // Solo hace match exacto para la ruta base
            >
              <div className="mr-3">{navItem.icon}</div>
              {navItem.title}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Botón para mostrar/ocultar el sidebar en móviles */}
      <button
        className="fixed bottom-4 left-4 z-20 md:hidden flex items-center justify-center p-2 rounded-full bg-blue-600 text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Contenido principal */}
      <div className={mainContentClass}>
        {/* Header / Barra superior */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <div>
            {/* Título de la página actual */}
            <h1 className="text-xl font-medium text-gray-800">
              {navigationLinks.find(nav => nav.path === location.pathname)?.title || 'Dashboard'}
            </h1>
          </div>
          
          {/* Perfil de usuario */}
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <Avatar
                  name={user.name}
                  size="md"
                  className="mr-2"
                />
              )}
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </button>
          </div>
        </header>
        
        {/* Área de contenido principal */}
        <main className="p-6 overflow-y-auto h-[calc(100%-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;