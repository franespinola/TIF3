import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Icons from '../../ui/Icons';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentGenograms, setRecentGenograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      setIsLoading(true);

      setTimeout(() => {
        setPatients([
          { id: 'cristian', name: 'Cristian Rodríguez', lastVisit: '2025-04-29', diagnosis: 'Ansiedad generalizada' },
          { id: 'francisco', name: 'Francisco Torres', lastVisit: '2025-04-20', diagnosis: 'Depresión moderada' },
          { id: 'ignacia', name: 'Ignacia Vázquez', lastVisit: '2025-04-25', diagnosis: 'Trastorno de estrés' },
          { id: 'maria', name: 'María Fernandez', lastVisit: '2025-05-05', diagnosis: 'Problemas familiares' },
        ]);

        setUpcomingAppointments([
          { id: 1, patientName: 'Cristian Rodríguez', date: '2025-05-10T10:00:00', type: 'Sesión regular' },
          { id: 2, patientName: 'María Fernandez', date: '2025-05-09T15:30:00', type: 'Primera consulta' },
          { id: 3, patientName: 'Ignacia Vázquez', date: '2025-05-11T11:00:00', type: 'Seguimiento' },
        ]);

        setRecentGenograms([
          { id: 'gen1', patientName: 'Francisco Torres', date: '2025-04-20', thumbnail: null },
          { id: 'gen2', patientName: 'María Fernandez', date: '2025-05-05', thumbnail: null },
          { id: 'gen3', patientName: 'Ignacia Vázquez', date: '2025-04-25', thumbnail: null },
        ]);

        setIsLoading(false);
      }, 800);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Pacientes', value: patients.length, icon: <Icons.Patients className="w-5 h-5" />, color: 'blue' },
    { label: 'Citas Próximas', value: upcomingAppointments.length, icon: <Icons.Calendar className="w-5 h-5" />, color: 'green' },
    { label: 'Genogramas', value: recentGenograms.length, icon: <Icons.Genogram className="w-5 h-5" />, color: 'purple' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido, Dr. Profesional</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tus pacientes y actividades.</p>
        </div>
        <Link to="/patients/new">
          <Button 
            variant="primary"
            icon={<Icons.Plus className="w-4 h-4" />}
          >
            Nuevo Paciente
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: `var(--color-${stat.color}-500)` }}>
            <CardContent className="flex items-center py-6">
              <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximas Citas</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                icon={<Icons.CalendarPlus className="w-4 h-4" />}
              >
                Agendar Cita
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              upcomingAppointments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar name={appointment.patientName} size="md" className="mr-3" />
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Icons.Calendar className="w-4 h-4 mr-1" />
                            {new Date(appointment.date).toLocaleString('es', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={appointment.type === 'Primera consulta' ? 'primary' : 'default'}>
                          {appointment.type}
                        </Badge>
                        <Link to={`/appointments/${appointment.id}`}>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Icons.Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  No hay citas programadas próximamente
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left border-dashed"
                icon={<Icons.Recording className="w-5 h-5" />}
              >
                Nueva Grabación de Entrevista
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left border-dashed"
                icon={<Icons.Genogram className="w-5 h-5" />}
              >
                Crear Genograma
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left border-dashed"
                icon={<Icons.Notes className="w-5 h-5" />}
              >
                Añadir Nota Clínica
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left border-dashed"
                icon={<Icons.Calendar className="w-5 h-5" />}
              >
                Ver Calendario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pacientes Recientes</CardTitle>
              <Link to="/patients">
                <Button 
                  variant="ghost" 
                  size="sm"
                >
                  Ver todos los pacientes
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {patients.map((patient) => (
                  <Link 
                    key={patient.id} 
                    to={`/patients/${patient.id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <Avatar name={patient.name} size="lg" className="mr-3" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-gray-500">
                            Última visita: {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary">{patient.diagnosis}</Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                        <Button variant="ghost" size="sm" className="text-blue-600 p-0">
                          Ver historia
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600 p-0">
                          Genograma
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;