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

// Páginas de tratamientos
import { TreatmentsPage } from '../pages/treatments/TreatmentsPage';

// Páginas de monitoreo
import { MonitoringPage } from '../pages/monitoring/MonitoringPage';
import { AlertsPage } from '../pages/monitoring/AlertsPage';

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
      {/* Ruta raíz - redirige al dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
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
            {/* Crear componente PatientDetailPage */}
            <div>Detalle del paciente - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patients/:id/edit" 
        element={
          <ProtectedRoute>
            {/* Crear componente EditPatientPage */}
            <div>Editar paciente - Por implementar</div>
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
            {/* Crear componente CreateTreatmentPage */}
            <div>Crear tratamiento - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/:id" 
        element={
          <ProtectedRoute>
            {/* Crear componente TreatmentDetailPage */}
            <div>Detalle del tratamiento - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/:id/edit" 
        element={
          <ProtectedRoute>
            {/* Crear componente EditTreatmentPage */}
            <div>Editar tratamiento - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treatments/alarms" 
        element={
          <ProtectedRoute>
            {/* Crear componente AlarmsPage */}
            <div>Gestión de alarmas - Por implementar</div>
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
            {/* Crear componente CompliancePage */}
            <div>Reporte de cumplimiento - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/history" 
        element={
          <ProtectedRoute>
            {/* Crear componente HistoryPage */}
            <div>Historial completo - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monitoring/reports" 
        element={
          <ProtectedRoute>
            {/* Crear componente ReportsPage */}
            <div>Reportes avanzados - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      
      {/* Configuración */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            {/* Crear componente SettingsPage */}
            <div>Configuración - Por implementar</div>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 - Cualquier ruta no encontrada redirige al dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};