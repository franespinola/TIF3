import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import PatientsList from './PatientsList';
import PatientDetail from './PatientDetail';
import PatientForm from './PatientForm';
import GenogramsList from './GenogramsList';
import GenogramEditor from './GenogramEditor';
import GenogramViewer from './GenogramViewer';
import AppointmentsCalendar from './AppointmentsCalendar';
import AppointmentDetail from './AppointmentDetail';
import SettingsPage from './SettingsPage';
import SessionSummaryView from '../clinical/SessionSummaryView';

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Dashboard principal */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Rutas de Pacientes */}
      <Route path="/patients" element={<PatientsList />} />
      <Route path="/patients/:patientId" element={<PatientDetail />} />
      <Route path="/patients/new" element={<PatientForm />} />
      
      {/* Rutas de Genogramas */}
      <Route path="/genograms" element={<GenogramsList />} />
      <Route path="/genograms/new" element={<GenogramEditor isNew={true} />} />
      <Route path="/genograms/edit/:id" element={<GenogramEditor />} />
      <Route path="/genograms/view/:id" element={<GenogramViewer />} />
      
      {/* Rutas de Citas */}
      <Route path="/appointments" element={<AppointmentsCalendar />} />
      <Route path="/appointments/:id" element={<AppointmentDetail />} />
      
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