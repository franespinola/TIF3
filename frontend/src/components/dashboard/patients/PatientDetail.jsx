import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Icons from '../../ui/Icons';

const PatientDetail = () => {
  // Obtener el ID del paciente desde los parámetros de la URL
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // En un proyecto real, esto sería una llamada a la API
    const fetchPatientData = () => {
      setLoading(true);
      
      // Simulando carga de datos
      setTimeout(() => {
        // Datos de ejemplo basados en el ID proporcionado
        setPatient({
          id: patientId,
          name: patientId === 'maria' ? 'María Fernandez' : 
                patientId === 'cristian' ? 'Cristian Rodríguez' : 
                patientId === 'francisco' ? 'Francisco Torres' : 
                patientId === 'ignacia' ? 'Ignacia Vázquez' : 'Paciente',
          age: 34,
          gender: 'Femenino',
          phone: '555-123-4567',
          email: `${patientId}@ejemplo.com`,
          address: 'Av. Ejemplo 1234, Ciudad',
          emergencyContact: 'Juan Pérez (Esposo) - 555-987-6543',
          firstVisit: '2024-12-15',
          lastVisit: '2025-05-05',
          nextAppointment: '2025-05-15T14:00:00',
          diagnosis: patientId === 'maria' ? 'Problemas familiares' : 
                    patientId === 'cristian' ? 'Ansiedad generalizada' :
                    patientId === 'francisco' ? 'Depresión moderada' :
                    patientId === 'ignacia' ? 'Trastorno de estrés' : 'En evaluación',
          notes: 'Paciente presenta problemas de comunicación con su familia inmediata. Ha mostrado signos de frustración y ansiedad relacionados con conflictos no resueltos en el ámbito familiar.',
          medications: [
            { name: 'Sertralina', dosage: '50mg', frequency: 'Diaria', startDate: '2025-01-10' }
          ],
          genograms: [
            { id: 'gen1', date: '2025-05-05', name: 'Genograma familiar completo' }
          ],
          clinicalHistory: [
            { id: 'session1', date: '2025-05-05', type: 'Sesión regular', notes: 'La paciente relató nuevos conflictos con su madre.' },
            { id: 'session2', date: '2025-04-15', type: 'Sesión regular', notes: 'Se trabajó en técnicas de comunicación asertiva.' },
            { id: 'session3', date: '2025-03-28', type: 'Primera evaluación', notes: 'Primera sesión. Se realizó historia clínica inicial.' }
          ]
        });
        
        setLoading(false);
      }, 800);
    };
    
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paciente no encontrado</h2>
          <p className="text-gray-600">No se pudo encontrar información para este paciente.</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Patient header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Avatar name={patient.name} size="xl" className="mr-6" />
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">{patient.name}</h1>
                <Badge variant={
                  patient.diagnosis.includes('Ansiedad') ? 'warning' : 
                  patient.diagnosis.includes('Depresión') ? 'danger' : 
                  'secondary'
                }>
                  {patient.diagnosis}
                </Badge>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  {patient.age} años, {patient.gender}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {patient.phone}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="primary" 
              size="md"
              icon={<Icons.Recording className="w-4 h-4" />}
              onClick={() => window.location.href = `/record/${patient.id}`}
            >
              Nueva Grabación
            </Button>
            <Button 
              variant="outline" 
              size="md"
              icon={<Icons.CalendarPlus className="w-4 h-4" />}
            >
              Agendar Cita
            </Button>
            <Button 
              variant="ghost" 
              size="md"
              icon={<Icons.Edit className="w-4 h-4" />}
            >
              Editar
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'summary' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Resumen
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Historia Clínica
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'genograms' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('genograms')}
            >
              Genogramas
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'notes' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              Notas
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Información del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Correo electrónico</p>
                  <p>{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p>{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p>{patient.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contacto de emergencia</p>
                  <p>{patient.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primera consulta</p>
                  <p>{new Date(patient.firstVisit).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última consulta</p>
                  <p>{new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Next Appointment */}
          <Card>
            <CardHeader>
              <CardTitle>Próxima Cita</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.nextAppointment ? (
                <div className="text-center py-4">
                  <div className="bg-blue-50 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Icons.Calendar className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-lg">
                    {new Date(patient.nextAppointment).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {new Date(patient.nextAppointment).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Icons.Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>No hay citas programadas</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <Button 
                variant="outline"
                size="sm"
                icon={<Icons.CalendarPlus className="w-4 h-4" />}
              >
                {patient.nextAppointment ? 'Reprogramar' : 'Agendar'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Clinical Notes */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notas Clínicas</CardTitle>
              <Button variant="ghost" size="sm" icon={<Icons.Edit className="w-4 h-4" />}>
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Diagnóstico</h4>
                <p className="text-gray-700 mb-4">{patient.diagnosis}</p>
                
                <h4 className="font-medium">Notas</h4>
                <p className="text-gray-700 mb-4">{patient.notes}</p>
                
                <h4 className="font-medium">Medicación</h4>
                {patient.medications && patient.medications.length > 0 ? (
                  <div className="border rounded-md overflow-hidden mt-2">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha inicio</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.medications.map((med, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">{med.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{med.dosage}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{med.frequency}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{new Date(med.startDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay medicación prescrita</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.clinicalHistory.slice(0, 3).map((entry, index) => (
                  <div key={index} className={`border-l-2 pl-4 py-1 ${index === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p className="font-medium">{entry.type}</p>
                    <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-blue-600"
                onClick={() => setActiveTab('history')}
              >
                Ver historial completo
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historia Clínica</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                icon={<Icons.Plus className="w-4 h-4" />}
              >
                Añadir entrada
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {patient.clinicalHistory.length > 0 ? (
              <div className="space-y-8">
                {/* Para cada entrada en la historia clínica */}
                {patient.clinicalHistory.map((entry, index) => (
                  <div key={index} className={`border-l-2 pl-6 pb-6 ${index === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{entry.type}</h4>
                        <div className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('es', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="flex mt-2 sm:mt-0 space-x-2">
                        {/* Botón para ver/editar la sesión */}
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Button>

                        {/* Nuevo botón para ver el resumen de la sesión */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/patients/${patientId}/sessions/${entry.id}/summary`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{entry.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No hay registros en la historia clínica
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'genograms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Genograms */}
          {patient.genograms && patient.genograms.map((genogram) => (
            <Card key={genogram.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md mb-4">
                  <Icons.Genogram className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-medium">{genogram.name}</h3>
                <p className="text-sm text-gray-500">Creado el {new Date(genogram.date).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="border-t border-gray-100 bg-gray-50">
                <div className="w-full flex justify-between">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {/* Create New Genogram Card */}
          <Card className="border-dashed hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="h-full flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Icons.Plus className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-medium text-gray-900">Crear Genograma</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Generar un nuevo genograma para este paciente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'notes' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notas de Sesión</CardTitle>
              <Button 
                variant="primary" 
                size="sm"
                icon={<Icons.Plus className="w-4 h-4" />}
              >
                Nueva Nota
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <textarea
                className="w-full min-h-[200px] bg-transparent outline-none resize-none"
                placeholder="Escribir una nueva nota para el paciente..."
              ></textarea>
              <div className="flex justify-end mt-2">
                <Button variant="primary" size="sm">
                  Guardar Nota
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default PatientDetail;