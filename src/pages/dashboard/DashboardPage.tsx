import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  Pill, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Datos simulados
const dashboardStats = {
  totalPatients: 24,
  activeTreatments: 45,
  todayDoses: 128,
  pendingAlerts: 3,
  complianceRate: 89
};

const recentActivity = [
  {
    id: 1,
    patient: 'María García',
    action: 'Dosis tomada',
    medication: 'Aspirina 100mg',
    time: '10:30 AM',
    status: 'completed'
  },
  {
    id: 2,
    patient: 'Juan Pérez',
    action: 'Dosis perdida',
    medication: 'Metformina 500mg',
    time: '09:00 AM',
    status: 'missed'
  },
  {
    id: 3,
    patient: 'Ana López',
    action: 'Nuevo tratamiento',
    medication: 'Ibuprofeno 400mg',
    time: '08:45 AM',
    status: 'new'
  }
];

const upcomingDoses = [
  {
    id: 1,
    patient: 'Carlos Rodríguez',
    medication: 'Enalapril 10mg',
    time: '14:00',
    priority: 'high'
  },
  {
    id: 2,
    patient: 'Elena Martín',
    medication: 'Omeprazol 20mg',
    time: '14:30',
    priority: 'medium'
  },
  {
    id: 3,
    patient: 'Roberto Silva',
    medication: 'Paracetamol 500mg',
    time: '15:00',
    priority: 'low'
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    localStorage.clear();
    
    // También puedes limpiar cookies si las usas
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('Sesión cerrada exitosamente');
    
    // Forzar redirección inmediata
    window.location.href = '/auth/login';
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Resumen general del sistema</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/patients/create">
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Paciente</span>
              </Button>
            </Link>
            <Link to="/treatments/create">
              <Button className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Tratamiento</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalPatients}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Pill className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tratamientos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeTreatments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dosis Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.todayDoses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cumplimiento</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.complianceRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad reciente */}
          <Card title="Actividad Reciente" className="h-fit">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.patient}</p>
                    <p className="text-sm text-gray-600">{activity.action} - {activity.medication}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'missed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status === 'completed' ? 'Completado' :
                       activity.status === 'missed' ? 'Perdido' : 'Nuevo'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link to="/monitoring/history">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                    <Eye size={16} />
                    <span>Ver Todo el Historial</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Próximas dosis */}
          <Card title="Próximas Dosis" className="h-fit">
            <div className="space-y-4">
              {upcomingDoses.map((dose) => (
                <div key={dose.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{dose.patient}</p>
                    <p className="text-sm text-gray-600">{dose.medication}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar size={14} className="text-gray-400" />
                      <p className="text-xs text-gray-500">{dose.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      dose.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : dose.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {dose.priority === 'high' ? 'Alta' :
                       dose.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link to="/treatments/alarms">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                    <Calendar size={16} />
                    <span>Ver Todas las Alarmas</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card title="Accesos Rápidos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/patients" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Gestionar Pacientes</p>
              </div>
            </Link>
            
            <Link to="/treatments" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Pill className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Ver Tratamientos</p>
              </div>
            </Link>
            
            <Link to="/monitoring/compliance" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Monitor Cumplimiento</p>
              </div>
            </Link>
            
            <Link to="/monitoring/alerts" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Ver Alertas</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};