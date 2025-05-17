"use client"

import { useState, useEffect } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import Icons from "../../ui/Icons"
import Avatar from "../../ui/Avatar"

/**
 * Componente de Layout para el dashboard que proporciona
 * una estructura consistente con navegación lateral, encabezado
 * y área de contenido principal.
 *
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Contenido a mostrar dentro del layout
 */
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  // Información del usuario (sería obtenida de un contexto de autenticación)
  const user = {
    name: "Dr. Francisco Valenzuela",
    role: "Psicólogo Clínico",
    profileImage: null,
  }

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Verificar al cargar
    checkIfMobile()

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Lista de enlaces de navegación del sidebar
  const navigationLinks = [
    {
      title: "Dashboard",
      path: "/",
      icon: <Icons.Dashboard className="w-5 h-5" />,
    },
    {
      title: "Pacientes",
      path: "/patients",
      icon: <Icons.Patients className="w-5 h-5" />,
    },
    {
      title: "Citas",
      path: "/appointments",
      icon: <Icons.Calendar className="w-5 h-5" />,
    },
    {
      title: "Genogramas",
      path: "/genograms",
      icon: <Icons.Genogram className="w-5 h-5" />,
    },
    {
      title: "Configuración",
      path: "/settings",
      icon: <Icons.Settings className="w-5 h-5" />,
    },
  ]

  // Obtener el título de la página actual
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname
    // Encontrar la ruta exacta primero
    let navItem = navigationLinks.find((nav) => nav.path === currentPath)

    // Si no hay coincidencia exacta, buscar rutas que comiencen con el mismo patrón
    if (!navItem && currentPath !== "/") {
      navItem = navigationLinks.find((nav) => nav.path !== "/" && currentPath.startsWith(nav.path))
    }

    return navItem?.title || "Dashboard"
  }

  // Overlay para cerrar el sidebar en móviles al hacer clic fuera
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay para cerrar el sidebar en móviles */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar / Navegación lateral */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 shadow-sm
          transition-all duration-300 ease-in-out transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-64
        `}
      >
        {/* Logo y nombre de la aplicación */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold mr-3">
              P
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              PsychCare
            </span>
          </Link>
        </div>

        {/* Navegación */}
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {navigationLinks.map((navItem) => (
              <NavLink
                key={navItem.path}
                to={navItem.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                  }
                `}
                end={navItem.path === "/"} // Solo hace match exacto para la ruta base
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <div className={`mr-3 transition-colors ${location.pathname === navItem.path ? "text-teal-600" : ""}`}>
                  {navItem.icon}
                </div>
                {navItem.title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Perfil de usuario en el sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
          <div className="flex items-center">
            <Avatar name={user.name} size="md" className="mr-3" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.role}</div>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
              <Icons.Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Botón para mostrar/ocultar el sidebar en móviles */}
      <button
        className="fixed bottom-6 left-6 z-40 lg:hidden flex items-center justify-center p-3 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-colors"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Contenido principal */}
      <div
        className={`
        flex-1 transition-all duration-300 ease-in-out
        lg:ml-64
      `}
      >
        {/* Header / Barra superior */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-100 shadow-sm">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              {/* Título de la página actual */}
              <h1 className="text-lg md:text-xl font-medium text-gray-800">{getCurrentPageTitle()}</h1>
            </div>

            {/* Acciones rápidas y perfil de usuario */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Botón de notificaciones */}
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
                <Icons.Calendar className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Botón de mensajes */}
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <Icons.Notes className="w-5 h-5" />
              </button>

              {/* Perfil de usuario - visible solo en pantallas medianas y grandes */}
              <div className="hidden md:flex items-center pl-3 border-l border-gray-200">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <Avatar name={user.name} size="sm" className="mr-2" />
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido principal */}
        <main className="p-4 md:p-6 overflow-y-auto h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
