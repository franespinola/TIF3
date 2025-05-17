import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../layout/Dashboard';
import PatientsList from '../patients/PatientsList';
import PatientDetail from '../patients/PatientDetail';
import PatientForm from '../patients/PatientForm';
import PatientEditWrapper from '../patients/PatientEditWrapper';
import GenogramsList from '../genograms/GenogramsList';
import GenogramEditor from '../genograms/GenogramEditor';
import GenogramEditWrapper from '../genograms/GenogramEditWrapper';
import GenogramViewer from '../genograms/GenogramViewer';
import AppointmentsCalendar from '../appointments/AppointmentsCalendar';
import AppointmentEditWrapper from '../appointments/AppointmentEditWrapper';
import AppointmentCreateWrapper from '../appointments/AppointmentCreateWrapper';
import SettingsPage from '../settings/SettingsPage';
import SessionSummaryView from '../sessions/SessionSummaryView';

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Dashboard principal */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Rutas de Pacientes */}
      <Route path="/patients" element={<PatientsList />} />
      <Route path="/patients/new" element={<PatientForm />} />
      <Route path="/patients/edit/:patientId" element={<PatientEditWrapper />} />
      <Route path="/patients/:patientId" element={<PatientDetail />} />
      
      {/* Rutas de Genogramas */}
      <Route path="/genograms" element={<GenogramsList />} />
      <Route path="/genograms/new" element={<GenogramEditor isNew={true} />} />
      <Route path="/genograms/edit/:id" element={<GenogramEditWrapper />} />
      <Route path="/genograms/view/:id" element={<GenogramViewer />} />
      
      {/* Rutas de Citas */}
      <Route path="/appointments" element={<AppointmentsCalendar />} />
      <Route path="/appointments/new" element={<AppointmentCreateWrapper />} />
      <Route path="/appointments/:id" element={<AppointmentEditWrapper />} />
      
      {/* Rutas de Resúmenes de Sesión */}
      <Route path="/sessions/:sessionId/summary" element={<SessionSummaryView />} />
      <Route path="/patients/:patientId/sessions/:sessionId/summary" element={<SessionSummaryView />} />
      
      {/* Configuraciones */}
      <Route path="/settings" element={<SettingsPage />} />
      
      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;