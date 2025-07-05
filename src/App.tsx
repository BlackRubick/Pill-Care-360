import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Páginas de autenticación
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Páginas del dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Páginas de pacientes
import { PatientsPage } from './pages/patients/PatientsPage';
import { CreatePatientPage } from './pages/patients/CreatePatientPage';

// Páginas de tratamientos
import { TreatmentsPage } from './pages/treatments/TreatmentsPage';

// Páginas de monitoreo
import { MonitoringPage } from './pages/monitoring/MonitoringPage';
import { AlertsPage } from './pages/monitoring/AlertsPage';

// Estilos globales
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* Ruta principal - redirige al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Gestión de pacientes */}
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/create" element={<CreatePatientPage />} />
          
          {/* Gestión de tratamientos */}
          <Route path="/treatments" element={<TreatmentsPage />} />
          
          {/* Monitoreo */}
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/monitoring/alerts" element={<AlertsPage />} />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;