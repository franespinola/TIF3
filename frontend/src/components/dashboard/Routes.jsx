import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import PatientsList from './PatientsList';
import PatientDetail from './PatientDetail';
import GenogramsList from './GenogramsList';
import AppointmentsCalendar from './AppointmentsCalendar';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<PatientsList />} />
      <Route path="/patients/:patientId" element={<PatientDetail />} />
      <Route path="/genograms" element={<GenogramsList />} />
      <Route path="/appointments" element={<AppointmentsCalendar />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;