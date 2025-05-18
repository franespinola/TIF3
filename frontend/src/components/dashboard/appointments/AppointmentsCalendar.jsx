"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/Card"
import Button from "../../ui/Button"
import Badge from "../../ui/Badge"
import Avatar from "../../ui/Avatar"
import Icons from "../../ui/Icons"
import appointmentService from "../../../services/appointmentService"
import Modal from "../../ui/Modal"
import AppointmentForm from "./AppointmentForm"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, isToday as isDateToday } from "date-fns"
import es from "date-fns/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { getAppointmentStatusProps, getAppointmentTypeProps } from '../../../utils/appointmentUtils'

const locales = { es }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const mapAppointmentsToEvents = (appointments) => {
  return appointments.map((appt) => {
    const date = new Date(appt.date || appt.date_time)
    return {
      id: appt.id,
      title: `${appt.patientName || "Paciente"} - ${appt.type || appt.status || ""}`,
      start: date,
      end: new Date(date.getTime() + (appt.duration_minutes || 60) * 60000),
      resource: appt,
    }
  })
}

// Función para obtener el color de fondo según el tipo de cita
const getAppointmentEventStyle = (event) => {
  const type = event.resource?.type?.toLowerCase() || "";
  const status = event.resource?.status?.toLowerCase() || "";
  
  // Si la cita está cancelada, darle un estilo distintivo
  if (status === 'cancelled') {
    return {
      backgroundColor: "#f3f4f6", // gray-100
      borderLeft: "4px solid #ef4444", // red-500
      color: "#9ca3af", // gray-400
      opacity: 0.7,
      textDecoration: "line-through"
    }
  }

  if (type.includes("primera consulta") || type === "primera_sesion_familiar") {
    return {
      backgroundColor: "#dbeafe", // blue-100
      borderLeft: "4px solid #3b82f6", // blue-500
      color: "#1e40af", // blue-800
    }
  } else if (type.includes("urgencia") || type === "emergencia") {
    return {
      backgroundColor: "#fee2e2", // red-100
      borderLeft: "4px solid #ef4444", // red-500
      color: "#991b1b", // red-800
    }
  } else if (type.includes("seguimiento") || type === "seguimiento") {
    return {
      backgroundColor: "#e0f2fe", // sky-100
      borderLeft: "4px solid #0ea5e9", // sky-500
      color: "#075985", // sky-800
    }
  } else if (type.includes("sesion familiar") || type === "sesion_familiar") {
    return {
      backgroundColor: "#d1fae5", // emerald-100
      borderLeft: "4px solid #10b981", // emerald-500
      color: "#065f46", // emerald-800
    }
  } else if (type === "consulta_familiar") {
    return {
      backgroundColor: "#ccfbf1", // teal-100
      borderLeft: "4px solid #14b8a6", // teal-500
      color: "#115e59", // teal-800
    }
  } else if (type === "consulta") {
    return {
      backgroundColor: "#dbeafe", // blue-100
      borderLeft: "4px solid #3b82f6", // blue-500
      color: "#1e40af", // blue-800
    }
  }

  return {
    backgroundColor: "#f3f4f6", // gray-100
    borderLeft: "4px solid #9ca3af", // gray-400
    color: "#374151", // gray-700
  }
}

const AppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("week") // 'day', 'week', 'month', 'agenda'
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    consulta: true,
    primera_sesion_familiar: true,
    sesion_familiar: true,
    consulta_familiar: true,
    seguimiento: true,
    emergencia: true,
  })

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar
    checkIfMobile()

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Obtener el primer día de la semana (lunes)
  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // ajustar cuando el día es domingo
    return new Date(d.setDate(diff))
  }

  // Generar un array con los días de la semana actual
  const getDaysInWeek = (date) => {
    const weekStart = getWeekStart(date)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Cambiar a la semana/mes/día anterior
  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  // Cambiar a la semana/mes/día siguiente
  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  // Cambiar a hoy
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Nueva función para cargar las citas reales
  const fetchAppointmentsData = async () => {
    setLoading(true)
    try {
      const response = await appointmentService.getAllAppointments()
      setAppointments(response.data)
    } catch (error) {
      console.error("Error al cargar las citas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointmentsData()
  }, [])

  // Nueva función para manejar cuando se guarda una cita
  const handleAppointmentSaved = (data) => {
    // Refrescar la lista de citas
    fetchAppointmentsData()

    // Cerrar el modal después de un breve retraso para mostrar el mensaje de éxito
    setTimeout(() => {
      setShowNewAppointmentModal(false)
      setSelectedPatientId(null)
      setSelectedDate(null)
    }, 2000)
  }

  // Función para abrir el modal con un día y paciente preseleccionados
  const openNewAppointmentModal = (date = null, patientId = null) => {
    if (date) {
      setSelectedDate(date)
    }
    if (patientId) {
      setSelectedPatientId(patientId)
    }
    setShowNewAppointmentModal(true)
  }

  // Función para preparar los datos iniciales del formulario
  const getInitialFormData = () => {
    const initialData = {}

    if (selectedDate) {
      // Configurar la fecha y hora para el formulario
      const dateTime = new Date(selectedDate)

      // Si la hora ya ha pasado, establecer la hora a la siguiente hora entera
      const now = new Date()
      if (dateTime < now) {
        dateTime.setHours(now.getHours() + 1)
        dateTime.setMinutes(0)
        dateTime.setSeconds(0)
      }

      initialData.date_time = dateTime.toISOString().slice(0, 16)
    }

    return initialData
  }

  // Obtener la lista de días de la semana actual
  const weekDays = getDaysInWeek(currentDate)

  // Formatear una fecha para mostrar el mes y el año
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("es", { month: "long", year: "numeric" })
  }

  // Formatear una fecha para mostrar el día y mes
  const formatDayMonth = (date) => {
    return date.toLocaleDateString("es", { day: "numeric", month: "long" })
  }

  // Verificar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Nueva función para obtener la fecha de la cita de manera consistente
  const getAppointmentDate = (appointment) => {
    // Intentar obtener la fecha en este orden: date, date_time, creando un fallback por defecto
    if (appointment.date) {
      return new Date(appointment.date)
    }
    if (appointment.date_time) {
      return new Date(appointment.date_time)
    }
    // Fallback por si ninguno de los campos existe
    return new Date()
  }

  // Obtener las citas para un día específico
  const getAppointmentsForDay = (day) => {
    return appointments.filter((appointment) => {
      const appointmentDate = getAppointmentDate(appointment)
      return (
        appointmentDate.getDate() === day.getDate() &&
        appointmentDate.getMonth() === day.getMonth() &&
        appointmentDate.getFullYear() === day.getFullYear()
      )
    })
  }

  // Ordenar las citas por hora
  const sortAppointmentsByTime = (appts) => {
    return [...appts].sort((a, b) => getAppointmentDate(a) - getAppointmentDate(b))
  }

  // Formatear la hora de la cita
  const formatAppointmentTime = (date) => {
    return date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  // Obtener el título según la vista actual
  const getCurrentViewTitle = () => {
    if (view === "day") {
      return formatDayMonth(currentDate)
    } else if (view === "week") {
      return `${formatMonthYear(weekDays[0])}${
        weekDays[0].getMonth() !== weekDays[6].getMonth() ? ` - ${formatMonthYear(weekDays[6])}` : ""
      }`
    } else if (view === "month") {
      return formatMonthYear(currentDate)
    } else {
      return "Agenda"
    }
  }

  // Obtener las próximas citas (futuras) con filtrado por tipo
  const getUpcomingAppointments = () => {
    const now = new Date()
    // Filtrar por citas futuras y con estados válidos: scheduled, confirmed o rescheduled
    return sortAppointmentsByTime(
      appointments.filter((appointment) => {
        const appointmentDate = getAppointmentDate(appointment)
        const validStatus = ['scheduled', 'confirmed', 'rescheduled']
        // Añadir filtro por tipo de cita
        const appointmentType = appointment.type?.toLowerCase() || 'consulta';
        return appointmentDate >= now && 
               validStatus.includes(appointment.status) && 
               activeFilters[appointmentType];
      }),
    ).slice(0, 5) // Mostrar solo las 5 próximas
  }

  // Filtrar todas las citas según los filtros activos
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      const appointmentType = appointment.type?.toLowerCase() || 'consulta';
      return activeFilters[appointmentType];
    });
  }

  // Cambiar el estado de un filtro
  const toggleFilter = (typeKey) => {
    setActiveFilters(prev => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }));
  }

  // Tipos de citas para la leyenda, basados en appointmentUtils
  const appointmentTypes = [
    { key: "consulta", label: getAppointmentTypeProps("consulta").label, colorClass: getAppointmentTypeProps("consulta").colorClass },
    { key: "primera_sesion_familiar", label: getAppointmentTypeProps("primera_sesion_familiar").label, colorClass: getAppointmentTypeProps("primera_sesion_familiar").colorClass },
    { key: "sesion_familiar", label: getAppointmentTypeProps("sesion_familiar").label, colorClass: getAppointmentTypeProps("sesion_familiar").colorClass },
    { key: "consulta_familiar", label: getAppointmentTypeProps("consulta_familiar").label, colorClass: getAppointmentTypeProps("consulta_familiar").colorClass },
    { key: "seguimiento", label: getAppointmentTypeProps("seguimiento").label, colorClass: getAppointmentTypeProps("seguimiento").colorClass },
    { key: "emergencia", label: getAppointmentTypeProps("emergencia").label, colorClass: getAppointmentTypeProps("emergencia").colorClass },
  ];

  // Personalizar los componentes del calendario
  const calendarComponents = {
    event: (props) => {
      const { event } = props
      const appointmentType = event.resource?.type || "";
      const appointmentStatus = event.resource?.status || "scheduled";
      const typeProps = getAppointmentTypeProps(appointmentType);
      const statusProps = getAppointmentStatusProps(appointmentStatus);
      const isCancelled = appointmentStatus === 'cancelled';

      return (
        <div className="flex items-center p-1 overflow-hidden h-full">
          <div className="flex-1 truncate">
            <div className={`font-medium text-sm truncate flex items-center ${isCancelled ? 'line-through text-gray-400' : ''}`}>
              {isCancelled && (
                <div className={`h-2 w-2 rounded-full mr-1 ${statusProps.colorClass.replace('bg-', 'bg-red-')} flex-shrink-0`}></div>
              )}
              {event.resource?.patientName || "Paciente"}
            </div>
            <div className="text-xs truncate flex items-center">
              <span className={`mr-1 ${isCancelled ? 'text-gray-400' : ''}`}>{formatAppointmentTime(event.start)}</span>
              <Badge className={`text-xs border border-opacity-50 ${isCancelled ? 'bg-gray-100 text-gray-500 border-gray-300' : typeProps.colorClass}`}>
                {isCancelled ? 'Cancelada' : typeProps.label}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
  }

  return (
    <DashboardLayout>
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md border border-teal-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Calendario de Citas</h1>
            <p className="text-sm sm:text-base text-teal-100">Gestiona tus citas y consultas con pacientes</p>
          </div>
          <Button
            variant="white"
            className="bg-white/90 hover:bg-white text-teal-700 border border-white/30 hover:border-white w-full sm:w-auto"
            icon={<Icons.CalendarPlus className="w-4 h-4" />}
            onClick={() => openNewAppointmentModal()}
          >
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-4 sm:mb-6 border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="px-2 border-gray-200 hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday} className="border-gray-200 hover:bg-gray-50">
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  className="px-2 border-gray-200 hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
                <h2 className="text-base sm:text-lg font-medium text-gray-800">{getCurrentViewTitle()}</h2>
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 -mx-3 px-3 sm:pb-0 sm:mx-0 sm:px-0">
                <Button
                  variant={view === "day" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setView("day")}
                  className={
                    view === "day"
                      ? "bg-teal-600 hover:bg-teal-700 text-white border border-teal-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                >
                  Día
                </Button>
                <Button
                  variant={view === "week" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setView("week")}
                  className={
                    view === "week"
                      ? "bg-teal-600 hover:bg-teal-700 text-white border border-teal-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                >
                  Semana
                </Button>
                <Button
                  variant={view === "month" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setView("month")}
                  className={
                    view === "month"
                      ? "bg-teal-600 hover:bg-teal-700 text-white border border-teal-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                >
                  Mes
                </Button>
                <Button
                  variant={view === "agenda" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setView("agenda")}
                  className={
                    view === "agenda"
                      ? "bg-teal-600 hover:bg-teal-700 text-white border border-teal-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                >
                  Agenda
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLegend(!showLegend)}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Icons.Calendar className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Leyenda {Object.values(activeFilters).filter(f => f).length < appointmentTypes.length && `(${Object.values(activeFilters).filter(f => f).length}/${appointmentTypes.length})`}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Leyenda de tipos de citas */}
          {showLegend && (
            <div className="bg-white p-3 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 justify-center">
                {appointmentTypes.map((type) => (
                  <button
                    key={type.key}
                    className={`px-3 py-1 rounded-md text-xs ${type.colorClass} border border-opacity-50 transition-all flex items-center ${!activeFilters[type.key] ? 'opacity-50' : ''}`}
                    onClick={() => toggleFilter(type.key)}
                  >
                    <span className={`h-3 w-3 rounded-full mr-1 ${activeFilters[type.key] ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          {/* React Big Calendar */}
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="calendar-container" style={{ height: isMobile ? "500px" : "700px" }}>
                {getFilteredAppointments().length === 0 && !loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Icons.Calendar className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No hay citas que coincidan con los filtros seleccionados</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setActiveFilters({
                        consulta: true,
                        primera_sesion_familiar: true,
                        sesion_familiar: true,
                        consulta_familiar: true,
                        seguimiento: true,
                        emergencia: true,
                      })}
                    >
                      Restablecer filtros
                    </Button>
                  </div>
                ) : (
                  <Calendar
                    localizer={localizer}
                    events={mapAppointmentsToEvents(getFilteredAppointments())}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={(newView) => setView(newView)}
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    views={{
                      month: true,
                      week: true,
                      day: true,
                      agenda: true,
                    }}
                    messages={{
                      today: "Hoy",
                      previous: "Anterior",
                      next: "Siguiente",
                      month: "Mes",
                      week: "Semana",
                      day: "Día",
                      agenda: "Agenda",
                      date: "Fecha",
                      time: "Hora",
                      event: "Evento",
                      noEventsInRange: "No hay citas en este rango.",
                      allDay: "Todo el día",
                      work_week: "Semana laboral",
                      yesterday: "Ayer",
                      tomorrow: "Mañana",
                      showMore: (total) => `+ Ver ${total} más`,
                    }}
                    onSelectSlot={({ start }) => openNewAppointmentModal(start)}
                    onSelectEvent={(event) => {
                      const patientId = event.resource.patient_id
                      const appointmentId = event.resource.id
                      if (patientId && appointmentId) {
                        window.location.href = `/appointments/${appointmentId}`
                      }
                    }}
                    selectable
                    popup
                    components={calendarComponents}
                    eventPropGetter={(event) => ({
                      style: getAppointmentEventStyle(event),
                    })}
                    dayPropGetter={(date) => {
                      if (isDateToday(date)) {
                        return {
                          style: {
                            backgroundColor: "#f0fdfa", // teal-50
                          },
                        }
                      }
                      return {}
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments Sidebar */}
        <div className="hidden lg:block">
          <Card className="border border-gray-200 shadow-sm h-full">
            <CardHeader className="pb-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <CardTitle className="text-lg font-bold flex items-center">
                <Icons.Calendar className="w-5 h-5 mr-2 text-teal-500" />
                Próximas Citas
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto p-0" style={{ maxHeight: "650px" }}>
              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : getUpcomingAppointments().length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {getUpcomingAppointments().map((appointment) => {
                    const appointmentDate = getAppointmentDate(appointment)
                    const type = appointment.type || ""
                    const status = appointment.status || "scheduled"
                    const statusProps = getAppointmentStatusProps(status)
                    const isCancelled = status === 'cancelled';

                    return (
                      <Link key={appointment.id} to={`/appointments/${appointment.id}`} className="block">
                        <div
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            isToday(appointmentDate) ? "border-l-4 border-teal-500" : ""
                          } ${isCancelled ? "opacity-75" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`border border-opacity-50 ${isCancelled ? "bg-gray-100 text-gray-500 border-gray-200" : getAppointmentTypeProps(type).colorClass}`}>
                              {getAppointmentTypeProps(type).label}
                            </Badge>
                            <span className="text-xs font-medium text-gray-500">
                              {formatAppointmentTime(appointmentDate)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Avatar name={appointment.patientName || "Paciente"} size="sm" className="mr-2" />
                            <div>
                              <p className={`font-medium text-sm ${isCancelled ? "line-through text-gray-400" : ""}`}>
                                {isCancelled && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-red-400 mr-1"></span>
                                )}
                                {appointment.patientName || "Paciente"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-xs text-gray-500">
                                  {appointmentDate.toLocaleDateString("es", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </div>
                                <Badge className={`text-xs ${statusProps.colorClass}`}>
                                  {statusProps.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{appointment.notes}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 bg-gray-50 border border-gray-200 m-3 rounded-lg">
                  <Icons.Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p>No hay citas programadas próximamente</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                    onClick={() => setShowNewAppointmentModal(true)}
                  >
                    Agendar primera cita
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-3 pb-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <Link
                to="/appointments"
                className="text-teal-600 text-sm font-medium hover:underline flex items-center mx-auto"
              >
                Ver todas las citas
                <span className="ml-1">→</span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Mobile Upcoming Appointments */}
      <div className="lg:hidden mt-4 sm:mt-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <CardTitle className="text-lg font-bold flex items-center">
              <Icons.Calendar className="w-5 h-5 mr-2 text-teal-500" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : getUpcomingAppointments().length > 0 ? (
              <div className="divide-y divide-gray-200">
                {getUpcomingAppointments().map((appointment) => {
                  const appointmentDate = getAppointmentDate(appointment)
                  const type = appointment.type || ""
                  const status = appointment.status || "scheduled"
                  const statusProps = getAppointmentStatusProps(status)
                  const isCancelled = status === 'cancelled';

                  return (
                    <Link key={appointment.id} to={`/appointments/${appointment.id}`} className="block">
                      <div
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          isToday(appointmentDate) ? "border-l-4 border-teal-500" : ""
                        } ${isCancelled ? "opacity-75" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`border border-opacity-50 ${isCancelled ? "bg-gray-100 text-gray-500 border-gray-200" : getAppointmentTypeProps(type).colorClass}`}>
                            {getAppointmentTypeProps(type).label}
                          </Badge>
                          <span className="text-xs font-medium text-gray-500">
                            {formatAppointmentTime(appointmentDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Avatar name={appointment.patientName || "Paciente"} size="sm" className="mr-2" />
                          <div>
                            <p className={`font-medium text-sm ${isCancelled ? "line-through text-gray-400" : ""}`}>
                              {isCancelled && (
                                <span className="inline-block h-2 w-2 rounded-full bg-red-400 mr-1"></span>
                              )}
                              {appointment.patientName || "Paciente"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-gray-500">
                                {appointmentDate.toLocaleDateString("es", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </div>
                              <Badge className={`text-xs ${statusProps.colorClass}`}>
                                {statusProps.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 bg-gray-50 border border-gray-200 m-3 rounded-lg">
                <Icons.Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p>No hay citas programadas próximamente</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => setShowNewAppointmentModal(true)}
                >
                  Agendar primera cita
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-3 pb-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <Link
              to="/appointments"
              className="text-teal-600 text-sm font-medium hover:underline flex items-center mx-auto"
            >
              Ver todas las citas
              <span className="ml-1">→</span>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Modal para nueva cita */}
      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Agendar Nueva Cita"
        size="lg"
      >
        <div className="p-4 sm:p-6">
          <AppointmentForm
            initialData={getInitialFormData()}
            patientId={selectedPatientId}
            onSave={handleAppointmentSaved}
            onCancel={() => setShowNewAppointmentModal(false)}
          />
        </div>
      </Modal>

      {/* Estilos personalizados para react-big-calendar */}
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
          background-color: white;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .rbc-toolbar {
          display: none; /* Ocultamos la barra de herramientas predeterminada */
        }
        
        .rbc-header {
          padding: 10px 3px;
          font-weight: 600;
          font-size: 0.875rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4b5563;
        }
        
        .rbc-month-view {
          border: none;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .rbc-month-row {
          border-top: 1px solid #f3f4f6;
        }
        
        .rbc-day-bg {
          transition: background-color 0.2s;
        }
        
        .rbc-day-bg:hover {
          background-color: #f9fafb;
        }
        
        .rbc-off-range-bg {
          background-color: #f9fafb;
        }
        
        .rbc-today {
          background-color: #f0fdfa;
        }
        
        .rbc-event {
          border-radius: 6px;
          padding: 2px 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: transform 0.1s, box-shadow 0.1s;
        }
        
        .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .rbc-event-label {
          display: none;
        }
        
        .rbc-time-view {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .rbc-time-header {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rbc-time-content {
          border-top: 1px solid #e5e7eb;
        }
        
        .rbc-timeslot-group {
          border-bottom: 1px solid #f3f4f6;
        }
        
        .rbc-time-slot {
          border-top: none;
        }
        
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #f3f4f6;
        }
        
        .rbc-current-time-indicator {
          background-color: #10b981;
          height: 2px;
        }
        
        .rbc-agenda-view table.rbc-agenda-table {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
          background-color: #f9fafb;
          padding: 12px 8px;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
        }
        
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 8px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
          background-color: #f9fafb;
        }
        
        .rbc-agenda-view table.rbc-agenda-table tbody > tr:last-child > td {
          border-bottom: none;
        }
        
        .rbc-agenda-time-cell {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .rbc-agenda-date-cell, .rbc-agenda-event-cell {
          font-size: 0.875rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .rbc-header {
            padding: 8px 2px;
            font-size: 0.7rem;
          }
          
          .rbc-event {
            padding: 1px 2px;
          }
          
          .rbc-day-slot .rbc-events-container {
            margin-right: 0;
          }
          
          .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
            padding: 8px 4px;
            font-size: 0.7rem;
          }
          
          .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
            padding: 8px 4px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default AppointmentsCalendar
