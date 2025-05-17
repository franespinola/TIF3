import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Icons from '../../ui/Icons';
import appointmentService from '../../../services/appointmentService';
import Modal from '../../ui/Modal';
import AppointmentForm from './AppointmentForm';

const AppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Obtener el primer día de la semana (lunes)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ajustar cuando el día es domingo
    return new Date(d.setDate(diff));
  };

  // Generar un array con los días de la semana actual
  const getDaysInWeek = (date) => {
    const weekStart = getWeekStart(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Cambiar a la semana anterior
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Cambiar a la semana siguiente
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Cambiar a hoy
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Nueva función para cargar las citas reales
  const fetchAppointmentsData = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAllAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsData();
  }, []);

  // Nueva función para manejar cuando se guarda una cita
  const handleAppointmentSaved = (data) => {
    // Refrescar la lista de citas
    fetchAppointmentsData();
    
    // Cerrar el modal después de un breve retraso para mostrar el mensaje de éxito
    setTimeout(() => {
      setShowNewAppointmentModal(false);
      setSelectedPatientId(null);
      setSelectedDate(null);
    }, 2000);
  };

  // Función para abrir el modal con un día y paciente preseleccionados
  const openNewAppointmentModal = (date = null, patientId = null) => {
    if (date) {
      setSelectedDate(date);
    }
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setShowNewAppointmentModal(true);
  };

  // Función para preparar los datos iniciales del formulario
  const getInitialFormData = () => {
    const initialData = {};
    
    if (selectedDate) {
      // Configurar la fecha y hora para el formulario
      const dateTime = new Date(selectedDate);
      
      // Si la hora ya ha pasado, establecer la hora a la siguiente hora entera
      const now = new Date();
      if (dateTime < now) {
        dateTime.setHours(now.getHours() + 1);
        dateTime.setMinutes(0);
        dateTime.setSeconds(0);
      }
      
      initialData.date_time = dateTime.toISOString().slice(0, 16);
    }
    
    return initialData;
  };

  // Obtener la lista de días de la semana actual
  const weekDays = getDaysInWeek(currentDate);

  // Formatear una fecha para mostrar el mes y el año
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  };

  // Verificar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Nueva función para obtener la fecha de la cita de manera consistente
  const getAppointmentDate = (appointment) => {
    // Intentar obtener la fecha en este orden: date, date_time, creando un fallback por defecto
    if (appointment.date) {
      return new Date(appointment.date);
    } 
    if (appointment.date_time) {
      return new Date(appointment.date_time);
    }
    // Fallback por si ninguno de los campos existe
    return new Date();
  };

  // Obtener las citas para un día específico
  const getAppointmentsForDay = (day) => {
    return appointments.filter(appointment => {
      const appointmentDate = getAppointmentDate(appointment);
      return appointmentDate.getDate() === day.getDate() &&
             appointmentDate.getMonth() === day.getMonth() &&
             appointmentDate.getFullYear() === day.getFullYear();
    });
  };

  // Ordenar las citas por hora
  const sortAppointmentsByTime = (appts) => {
    return [...appts].sort((a, b) => getAppointmentDate(a) - getAppointmentDate(b));
  };

  // Formatear la hora de la cita
  const formatAppointmentTime = (date) => {
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Determinar el color de la insignia según el tipo de cita
  const getAppointmentBadgeVariant = (type) => {
    // Si type es undefined o null, devolver valor por defecto
    if (!type) return 'default';
    
    switch (type.toLowerCase()) {
      case 'primera consulta':
        return 'primary';
      case 'urgencia':
        return 'danger';
      case 'seguimiento':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario de Citas</h1>
          <p className="text-gray-600">Gestiona tus citas y consultas con pacientes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="primary"
            icon={<Icons.CalendarPlus className="w-4 h-4" />}
            onClick={() => openNewAppointmentModal()}
          >
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={previousWeek}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToToday}
              >
                Hoy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={nextWeek}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
              <h2 className="text-lg font-medium text-gray-800">
                {formatMonthYear(weekDays[0])}
                {weekDays[0].getMonth() !== weekDays[6].getMonth() && 
                  ` - ${formatMonthYear(weekDays[6])}`}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={view === 'day' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setView('day')}
              >
                Día
              </Button>
              <Button 
                variant={view === 'week' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setView('week')}
              >
                Semana
              </Button>
              <Button 
                variant={view === 'month' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setView('month')}
              >
                Mes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Calendar */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col h-auto min-h-96">
              <div 
                className={`text-center p-2 font-medium rounded-t-lg ${
                  isToday(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                } cursor-pointer hover:bg-opacity-90`}
                onClick={() => openNewAppointmentModal(day)}
              >
                <div>{day.toLocaleDateString('es', { weekday: 'short' })}</div>
                <div className="text-lg">{day.getDate()}</div>
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-b-lg p-2 space-y-2">
                {sortAppointmentsByTime(getAppointmentsForDay(day)).map((appointment) => (
                  <Link
                    to={`/appointments/${appointment.id}`}
                    key={appointment.id}
                    className="block"
                  >
                    <div 
                      className="bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getAppointmentBadgeVariant(appointment.type || appointment.status)}>
                          {appointment.type || appointment.status}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatAppointmentTime(getAppointmentDate(appointment))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar name={appointment.patientName || 'Paciente'} size="xs" />
                        <span className="font-medium truncate">{appointment.patientName || 'Paciente'}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 line-clamp-2">{appointment.notes}</p>
                      )}
                    </div>
                  </Link>
                ))}
                
                {getAppointmentsForDay(day).length === 0 && (
                  <div 
                    className="flex items-center justify-center h-full text-sm text-gray-400 py-4 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => openNewAppointmentModal(day)}
                  >
                    <span className="flex items-center">
                      <Icons.Plus className="w-3 h-3 mr-1" />
                      Agendar cita
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              sortAppointmentsByTime(appointments).map((appointment) => {
                const appointmentDate = getAppointmentDate(appointment);
                const isPast = appointmentDate < new Date();
                
                return (
                  <div 
                    key={appointment.id}
                    className={`py-4 flex items-center justify-between ${isPast ? 'opacity-60' : ''}`}
                  >
                    <Link to={`/patients/${appointment.patient_id}`} className="flex items-center">
                      <Avatar name={appointment.patientName || 'Paciente'} size="md" className="mr-3" />
                      <div>
                        <p className="font-medium">{appointment.patientName || 'Paciente'}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Icons.Calendar className="w-4 h-4 mr-1" />
                          {appointmentDate.toLocaleDateString('es', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center">
                      <Badge variant={getAppointmentBadgeVariant(appointment.type || appointment.status)}>
                        {appointment.type || appointment.status}
                      </Badge>
                      <Link to={`/appointments/${appointment.id}`}>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <Icons.Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}

            {!loading && appointments.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                <p>No hay citas programadas</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setShowNewAppointmentModal(true)}
                >
                  Agendar primera cita
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para nueva cita */}
      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Agendar Nueva Cita"
        size="lg"
      >
        <div className="p-6">
          <AppointmentForm 
            initialData={getInitialFormData()}
            patientId={selectedPatientId}
            onSave={handleAppointmentSaved}
            onCancel={() => setShowNewAppointmentModal(false)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AppointmentsCalendar;