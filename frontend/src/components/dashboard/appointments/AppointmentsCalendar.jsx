import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Icons from '../../ui/Icons';

const AppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

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

  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const fetchAppointments = async () => {
      setLoading(true);
      
      // Simular retardo en la red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos de muestra para citas
      const today = new Date();
      const weekStart = getWeekStart(today);
      
      // Generar citas para la semana
      const mockAppointments = [
        {
          id: 1,
          patientId: 'cristian',
          patientName: 'Cristian Rodríguez',
          date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 10, 0),
          duration: 60, // minutos
          type: 'Sesión regular',
          status: 'confirmed',
          notes: 'Seguimiento de tratamiento para ansiedad'
        },
        {
          id: 2,
          patientId: 'maria',
          patientName: 'María Fernandez',
          date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 15, 30),
          duration: 90, // minutos
          type: 'Primera consulta',
          status: 'confirmed',
          notes: 'Evaluación inicial y toma de datos'
        },
        {
          id: 3,
          patientId: 'ignacia',
          patientName: 'Ignacia Vázquez',
          date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3, 11, 0),
          duration: 60, // minutos
          type: 'Seguimiento',
          status: 'confirmed',
          notes: 'Revisión de avances en el tratamiento'
        },
        {
          id: 4,
          patientId: 'francisco',
          patientName: 'Francisco Torres',
          date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 16, 0),
          duration: 60, // minutos
          type: 'Sesión regular',
          status: 'confirmed',
          notes: 'Evaluación de medicación actual'
        },
        {
          id: 5,
          patientId: 'cristian2',
          patientName: 'Cristian Morales',
          date: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 4, 9, 30),
          duration: 45, // minutos
          type: 'Urgencia',
          status: 'confirmed',
          notes: 'Atención por episodio de ansiedad'
        }
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    };
    
    fetchAppointments();
  }, []);

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

  // Obtener las citas para un día específico
  const getAppointmentsForDay = (day) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getDate() === day.getDate() &&
             appointmentDate.getMonth() === day.getMonth() &&
             appointmentDate.getFullYear() === day.getFullYear();
    });
  };

  // Ordenar las citas por hora
  const sortAppointmentsByTime = (appts) => {
    return [...appts].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Formatear la hora de la cita
  const formatAppointmentTime = (date) => {
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Determinar el color de la insignia según el tipo de cita
  const getAppointmentBadgeVariant = (type) => {
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
            onClick={() => setShowNewAppointmentModal(true)}
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
              <div className={`text-center p-2 font-medium rounded-t-lg ${
                isToday(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
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
                        <Badge variant={getAppointmentBadgeVariant(appointment.type)}>
                          {appointment.type}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatAppointmentTime(new Date(appointment.date))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar name={appointment.patientName} size="xs" />
                        <span className="font-medium truncate">{appointment.patientName}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 line-clamp-2">{appointment.notes}</p>
                      )}
                    </div>
                  </Link>
                ))}
                
                {getAppointmentsForDay(day).length === 0 && (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400 py-4">
                    No hay citas
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
                const appointmentDate = new Date(appointment.date);
                const isPast = appointmentDate < new Date();
                
                return (
                  <div 
                    key={appointment.id}
                    className={`py-4 flex items-center justify-between ${isPast ? 'opacity-60' : ''}`}
                  >
                    <Link to={`/patients/${appointment.patientId}`} className="flex items-center">
                      <Avatar name={appointment.patientName} size="md" className="mr-3" />
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
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
                      <Badge variant={getAppointmentBadgeVariant(appointment.type)}>
                        {appointment.type}
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
                No hay citas programadas
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* El modal para nueva cita se implementaría aquí */}
    </DashboardLayout>
  );
};

export default AppointmentsCalendar;