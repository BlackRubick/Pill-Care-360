import React, { useState, useEffect } from 'react';
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
  Eye,
  RefreshCw,
  WifiOff,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

// Tipos de datos (extraídos de tu API service)
interface DashboardStats {
  totalPatients: number;
  activeTreatments: number;
  todayDoses: number;
  pendingAlerts: number;
  complianceRate: number;
}

interface Activity {
  id: number | string;
  patient: string;
  action: string;
  medication: string;
  time: string;
  status: string;
}

interface Dose {
  id: number | string;
  patient: string;
  medication: string;
  time: string;
  priority: string;
}

// Hook personalizado usando tu API service
const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activeTreatments: 0,
    todayDoses: 0,
    pendingAlerts: 0,
    complianceRate: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [upcomingDoses, setUpcomingDoses] = useState<Dose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando datos del dashboard...');

      // Verificar autenticación
      if (!apiService.isAuthenticated()) {
        throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente.');
      }

      // Usar tu API service existente para obtener los datos
      const [statsData, activityData, dosesData] = await Promise.allSettled([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(),
        apiService.getUpcomingDoses()
      ]);

      // Procesar estadísticas
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
        console.log('✅ Estadísticas cargadas:', statsData.value);
      } else {
        console.warn('⚠️ Error cargando estadísticas:', statsData.reason);
      }

      // Procesar actividad reciente
      if (activityData.status === 'fulfilled') {
        setRecentActivity(activityData.value);
        console.log('✅ Actividad reciente cargada:', activityData.value);
      } else {
        console.warn('⚠️ Error cargando actividad:', activityData.reason);
      }

      // Procesar dosis próximas
      if (dosesData.status === 'fulfilled') {
        setUpcomingDoses(dosesData.value);
        console.log('✅ Dosis próximas cargadas:', dosesData.value);
      } else {
        console.warn('⚠️ Error cargando dosis:', dosesData.reason);
      }

      // Si todos fallaron, mostrar error
      if (statsData.status === 'rejected' && activityData.status === 'rejected' && dosesData.status === 'rejected') {
        throw new Error('No se pudieron cargar los datos del dashboard');
      }

      setLastUpdate(new Date());
      console.log('✅ Dashboard cargado exitosamente');

    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      // Si es error de autenticación, redirigir al login
      if (errorMessage.includes('autenticado') || errorMessage.includes('401')) {
        apiService.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { 
    stats, 
    recentActivity, 
    upcomingDoses, 
    loading, 
    error, 
    refetch: fetchDashboardData,
    lastUpdate 
  };
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, recentActivity, upcomingDoses, loading, error, refetch, lastUpdate } = useDashboardData();
  
  // Estado del usuario desde el API service
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Obtener usuario desde el storage o API
    const storedUser = apiService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Si no hay usuario almacenado, intentar obtenerlo de la API
      apiService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          // Si falla, usar datos por defecto
          setUser({
            name: 'Usuario',
            email: 'usuario@pillcare360.com'
          });
        });
    }
  }, []);

  const handleLogout = () => {
    // Usar el método de logout de tu API service
    apiService.logout();
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'Completado',
      'missed': 'Perdido',
      'new': 'Nuevo',
      'scheduled': 'Programado',
      'pending': 'Pendiente',
      'sent': 'Enviado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'missed': 'bg-red-100 text-red-800',
      'new': 'bg-blue-100 text-blue-800',
      'scheduled': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-orange-100 text-orange-800',
      'sent': 'bg-purple-100 text-purple-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="animate-spin h-6 w-6 text-blue-600" />
              <span className="text-gray-600">Cargando dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WifiOff className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-red-800 font-medium">Error al cargar el dashboard</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refetch} 
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reintentar</span>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <p>Resumen general del sistema</p>
              {lastUpdate && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Actualizado: {lastUpdate.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch} 
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.activeTreatments}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.todayDoses}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAlerts}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad reciente */}
          <Card title="Actividad Reciente" className="h-fit">
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay actividad reciente</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.patient}</p>
                      <p className="text-sm text-gray-600">{activity.action} - {activity.medication}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {recentActivity.length > 0 && (
                <div className="pt-4">
                  <Link to="/monitoring/history">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                      <Eye size={16} />
                      <span>Ver Todo el Historial</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Próximas dosis */}
          <Card title="Próximas Dosis" className="h-fit">
            <div className="space-y-4">
              {upcomingDoses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay dosis próximas programadas</p>
                </div>
              ) : (
                upcomingDoses.map((dose) => (
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
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(dose.priority)}`}>
                        {getPriorityText(dose.priority)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {upcomingDoses.length > 0 && (
                <div className="pt-4">
                  <Link to="/treatments/alarms">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                      <Calendar size={16} />
                      <span>Ver Todas las Alarmas</span>
                    </Button>
                  </Link>
                </div>
              )}
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

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <Card title="Información de Debug" className="bg-gray-50">
            <div className="text-xs text-gray-600 space-y-2">
              <p><strong>API Base URL:</strong> {apiService.baseURL}</p>
              <p><strong>Usuario autenticado:</strong> {apiService.isAuthenticated() ? 'Sí' : 'No'}</p>
              <p><strong>Usuario actual:</strong> {user ? user.name : 'No disponible'}</p>
              <p><strong>Última actualización:</strong> {lastUpdate?.toLocaleString('es-MX') || 'Nunca'}</p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => apiService.runCompleteDiagnosis()}
                  className="text-xs"
                >
                  Ejecutar Diagnóstico Completo
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};