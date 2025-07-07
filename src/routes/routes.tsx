import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas del dashboard
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Páginas de autenticación
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Páginas de pacientes
import { PatientsPage } from '../pages/patients/PatientsPage';
import { CreatePatientPage } from '../pages/patients/CreatePatientPage';
import { PatientDetailPage } from '../pages/patients/PatientDetailPage';
import { EditPatientPage } from '../pages/patients/EditPatientPage';

// Páginas de tratamientos
import { TreatmentsPage } from '../pages/treatments/TreatmentsPage';
import { CreateTreatmentPage } from '../pages/treatments/CreateTreatmentPage';
import { TreatmentDetailPage } from '../pages/treatments/TreatmentDetailPage';
import { EditTreatmentPage } from '../pages/treatments/EditTreatmentPage';
import { AlarmsPage } from '../pages/treatments/AlarmsPage';

// Páginas de monitoreo
import { MonitoringPage } from '../pages/monitoring/MonitoringPage';
import { AlertsPage } from '../pages/monitoring/AlertsPage';
import { CompliancePage } from '../pages/monitoring/CompliancePage';
import { HistoryPage } from '../pages/monitoring/HistoryPage';
import { ReportsPage } from '../pages/monitoring/ReportsPage';

// Páginas de configuración
import { SettingsPage } from '../pages/SettingsPage';

// Componente de rutas protegidas (opcional, para futuro uso)
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  // Aquí puedes agregar lógica de autenticación cuando conectes tu API de Python
  // Por ahora, permitimos acceso a todas las rutas
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ruta raíz - redirige al login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Dashboard - Primera pantalla */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de autenticación */}
      <Route 
        path="/auth/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/auth/register" 
        element={
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de pacientes */}
      <Route 
        path="/patients" 
        element={
          <ProtectedRoute>
            <PatientsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patients/create" 
        element={
          <ProtectedRoute>
            <CreatePatientPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patients/:id" 
        element={
          <ProtectedRoute>
            <PatientDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patients/:id/edit" 
        element={
          <ProtectedRoute>
            <EditPatientPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Gestión de tratamientos */}
      <Route 
        path="/treatments" 
        element={
          <ProtectedRoute>
            <TreatmentsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/create" 
        element={
          <ProtectedRoute>
            <CreateTreatmentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/:id" 
        element={
          <ProtectedRoute>
            <TreatmentDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/:id/edit" 
        element={
          <ProtectedRoute>
            <EditTreatmentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/alarms" 
        element={
          <ProtectedRoute>
            <AlarmsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Monitoreo */}
      <Route 
        path="/monitoring" 
        element={
          <ProtectedRoute>
            <MonitoringPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/alerts" 
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/compliance" 
        element={
          <ProtectedRoute>
            <CompliancePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/history" 
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Configuración */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 - Cualquier ruta no encontrada redirige al dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};