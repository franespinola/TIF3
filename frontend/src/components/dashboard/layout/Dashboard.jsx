"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/Card"
import Button from "../../ui/Button"
import Badge from "../../ui/Badge"
import Avatar from "../../ui/Avatar"
import Icons from "../../ui/Icons"
import { getAppointmentTypeProps, getAppointmentStatusProps } from '../../../utils/appointmentUtils'
import appointmentService from "../../../services/appointmentService"
import patientService from "../../../services/patientService"
import genogramService from "../../../services/genogramService"

const Dashboard = () => {
  const [patients, setPatients] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentGenograms, setRecentGenograms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState("Buen día")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")

    const fetchDashboardData = async () => {
      setIsLoading(true)
      
      try {
        // Obtener datos reales
        const [patientsResponse, appointmentsResponse, genogramsResponse] = await Promise.all([
          patientService.getAllPatients(),
          appointmentService.getAllAppointments(),
          genogramService.getAllGenograms().catch(() => ({ data: [] })) // Si no hay genogramas, devolver array vacío
        ]);
        
        // Configurar pacientes
        setPatients(patientsResponse.data || []);
        
        // Filtrar las próximas citas (futuras)
        const now = new Date();
        const upcoming = (appointmentsResponse.data || [])
          .filter(appt => new Date(appt.date_time) > now)
          .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
          .slice(0, 3); // Mostrar solo las 3 más próximas
        
        setUpcomingAppointments(upcoming);
        
        // Configurar genogramas recientes
        setRecentGenograms(genogramsResponse.data || []);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        
        // Cargar datos de fallback en caso de error
        setPatients([
          { id: "cristian", name: "Cristian Rodríguez", lastVisit: "2025-04-29", diagnosis: "Ansiedad generalizada" },
          { id: "francisco", name: "Francisco Torres", lastVisit: "2025-04-20", diagnosis: "Depresión moderada" },
          { id: "ignacia", name: "Ignacia Vázquez", lastVisit: "2025-04-25", diagnosis: "Trastorno de estrés" },
          { id: "maria", name: "María Fernandez", lastVisit: "2025-05-05", diagnosis: "Problemas familiares" },
        ]);

        setUpcomingAppointments([
          { id: 1, patientName: "Cristian Rodríguez", date: "2025-05-10T10:00:00", type: "sesion_familiar", status: "scheduled" },
          { id: 2, patientName: "María Fernandez", date: "2025-05-09T15:30:00", type: "primera_sesion_familiar", status: "confirmed" },
          { id: 3, patientName: "Ignacia Vázquez", date: "2025-05-11T11:00:00", type: "seguimiento", status: "rescheduled" },
        ]);

        setRecentGenograms([
          { id: "gen1", patientName: "Francisco Torres", date: "2025-04-20", thumbnail: null },
          { id: "gen2", patientName: "María Fernandez", date: "2025-05-05", thumbnail: null },
          { id: "gen3", patientName: "Ignacia Vázquez", date: "2025-04-25", thumbnail: null },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("es", options)
  }

  // Format date for mobile - shorter version
  const formatMobileDate = (dateString) => {
    const options = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("es", options)
  }

  // Format date to display only the date
  const formatShortDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" }
    return new Date(dateString).toLocaleDateString("es", options)
  }

  // Calculate days since last visit
  const getDaysSince = (dateString) => {
    const lastVisit = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - lastVisit)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get time until appointment
  const getTimeUntil = (dateString) => {
    const appointmentDate = new Date(dateString)
    const today = new Date()
    const diffTime = appointmentDate - today
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Mañana"
    if (diffDays < 7) return `En ${diffDays} días`
    return formatShortDate(dateString)
  }

  const stats = [
    {
      label: "Total Pacientes",
      value: patients.length,
      icon: <Icons.Patients className="w-5 h-5" />,
      color: "blue",
      link: "/patients",
      linkText: "Ver todos",
    },
    {
      label: "Citas Próximas",
      value: upcomingAppointments.length,
      icon: <Icons.Calendar className="w-5 h-5" />,
      color: "green",
      link: "/appointments",
      linkText: "Ver calendario",
    },
    {
      label: "Genogramas",
      value: recentGenograms.length,
      icon: <Icons.Genogram className="w-5 h-5" />,
      color: "purple",
      link: "/genograms",
      linkText: "Ver todos",
    },
  ]

  const quickActions = [
    {
      title: "Nueva Cita",
      icon: <Icons.CalendarPlus className="w-5 h-5" />,
      description: "Agendar una nueva consulta",
      link: "/appointments/new",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Nuevo Paciente",
      icon: <Icons.Plus className="w-5 h-5" />,
      description: "Registrar un nuevo paciente",
      link: "/patients/new",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Crear Genograma",
      icon: <Icons.Genogram className="w-5 h-5" />,
      description: "Diseñar un nuevo genograma",
      link: "/genograms/new",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Añadir Nota",
      icon: <Icons.Notes className="w-5 h-5" />,
      description: "Registrar una nota clínica",
      link: "/notes/new",
      color: "bg-amber-50 text-amber-600",
    },
  ]

  return (
    <DashboardLayout>
      {/* Header with greeting and time */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md border border-teal-400">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, Dr. Profesional</h1>
            <p className="mt-1 text-teal-100 text-sm sm:text-base">
              {new Date().toLocaleDateString("es", {
                weekday: window.innerWidth < 640 ? "short" : "long",
                day: "numeric",
                month: window.innerWidth < 640 ? "short" : "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {quickActions.slice(0, 2).map((action, index) => (
              <Link key={index} to={action.link} className="flex-1 sm:flex-auto">
                <Button
                  variant="white"
                  className="bg-white/90 hover:bg-white text-teal-700 border border-white/30 hover:border-white w-full sm:w-auto"
                  icon={action.icon}
                >
                  <span className="whitespace-nowrap">{action.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions Bar */}
      <div className="md:hidden mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-2 min-w-max">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Button
                variant="outline"
                size="sm"
                className={`whitespace-nowrap border-${action.color.split(" ")[1].split("-")[0]}-200 border`}
                icon={action.icon}
              >
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
          >
            <CardContent className="p-0">
              <div className="flex items-stretch h-full">
                <div className={`w-2 bg-${stat.color}-500 rounded-l-lg`}></div>
                <div className="flex-1 p-3 sm:p-4 md:p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 border border-${stat.color}-200`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4">
                    <Link
                      to={stat.link}
                      className={`text-${stat.color}-600 text-xs sm:text-sm font-medium hover:underline flex items-center`}
                    >
                      {stat.linkText}
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="pb-0 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
                <Icons.Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                Próximas Citas
              </CardTitle>
              <Link to="/appointments/new">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Icons.CalendarPlus className="w-4 h-4" />}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <span className="hidden sm:inline">Agendar Cita</span>
                  <span className="sm:hidden">Agendar</span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-3 mt-3">
                {upcomingAppointments.map((appointment) => (
                  <Link key={appointment.id} to={`/appointments/${appointment.id}`} className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-green-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar name={appointment.patientName} size="md" className="mr-3" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></span>
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <Icons.Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">{formatDate(appointment.date_time || appointment.date)}</span>
                              <span className="sm:hidden">{formatMobileDate(appointment.date_time || appointment.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end">
                          <Badge
                            className={`border border-opacity-50 ${getAppointmentTypeProps(appointment.type).colorClass}`}
                          >
                            {getAppointmentTypeProps(appointment.type).label}
                          </Badge>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-medium sm:mt-1 text-gray-500">
                              {getTimeUntil(appointment.date_time || appointment.date)}
                            </span>
                            {appointment.status && (
                              <Badge className={`text-xs mt-1 ${getAppointmentStatusProps(appointment.status).colorClass}`}>
                                {getAppointmentStatusProps(appointment.status).label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 sm:py-10 text-center text-gray-500 bg-gray-50 rounded-lg mt-3 border border-gray-200">
                <Icons.Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-300 mb-2" />
                <p>No hay citas programadas próximamente</p>
                <Link to="/appointments/new">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Agendar primera cita
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-4 sm:px-6 border-t border-gray-100">
            <Link
              to="/appointments"
              className="text-green-600 text-xs sm:text-sm font-medium hover:underline flex items-center mx-auto"
            >
              Ver todas las citas
              <span className="ml-1">→</span>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Actions - Desktop */}
        <Card className="border border-gray-200 shadow-sm hidden lg:block">
          <CardHeader className="pb-0 px-4 pt-4 sm:px-6 sm:pt-6 border-b border-gray-100">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Icons.Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 mt-3">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link} className="block">
                  <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all hover:border-gray-300">
                    <div
                      className={`p-2 rounded-lg mr-3 ${action.color} border border-${action.color.split(" ")[1].split("-")[0]}-200`}
                    >
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card className="border border-gray-200 shadow-sm mb-4 sm:mb-6">
        <CardHeader className="pb-0 px-4 pt-4 sm:px-6 sm:pt-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Icons.Patients className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
              Pacientes Recientes
            </CardTitle>
            <Link to="/patients">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <span className="hidden sm:inline">Ver todos los pacientes</span>
                <span className="sm:hidden">Ver todos</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3">
              {patients.map((patient) => (
                <Link key={patient.id} to={`/patients/${patient.id}`} className="block">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center mb-3">
                        <Avatar name={patient.name} size="md" className="mr-3" />
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{patient.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Icons.Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Hace {getDaysSince(patient.lastVisit)} días</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 text-xs">
                          {patient.diagnosis}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs sm:text-sm">
                        <Button variant="ghost" size="sm" className="text-blue-600 p-0 hover:bg-blue-50">
                          <Icons.Notes className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Historia</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600 p-0 hover:bg-blue-50">
                          <Icons.Genogram className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Genograma</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Quick Actions Grid - Replaces the card on mobile/tablet */}
      <div className="lg:hidden mb-4">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <Icons.Plus className="w-4 h-4 mr-2 text-amber-500" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="block">
              <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all hover:border-gray-300 text-center h-full">
                <div
                  className={`p-3 rounded-full mb-2 ${action.color} border border-${action.color.split(" ")[1].split("-")[0]}-200`}
                >
                  {action.icon}
                </div>
                <h3 className="font-medium text-sm">{action.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
