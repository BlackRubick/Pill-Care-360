import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  CheckCircle,
  TrendingDown,
  Calendar,
  Filter,
  Mail,
  Trash2,
  ArrowLeft,
  Bell,
  BellOff,
  Loader2,
  RefreshCw
} from 'lucide-react';
// import { Link } from 'react-router-dom'; // Comentado para el artefacto
import apiService from '../../services/api';

interface Alert {
  id: string;
  patient_id: number;
  patient_name: string;
  treatment_id: number;
  medication_name: string;
  type: string;
  message: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}

interface AlertsData {
  alerts: Alert[];
  stats: {
    unread_count: number;
    high_priority_count: number;
    medium_priority_count: number;
    missed_dose_count: number;
    total_count: number;
  };
  types: Array<{ value: string; label: string }>;
  severities: Array<{ value: string; label: string }>;
}

export const AlertsPage: React.FC = () => {
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showReadAlerts, setShowReadAlerts] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const user = apiService.getStoredUser();
    setCurrentUser(user);
  }, []);

  // Cargar datos de alertas
  const loadAlertsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚨 Cargando datos de alertas...');
      
      const data = await apiService.getAlertsPageData(
        selectedSeverity || undefined,
        selectedType || undefined,
        showReadAlerts
      );
      
      setAlertsData(data);
      console.log('✅ Datos de alertas cargados exitosamente');
    } catch (err: any) {
      console.error('❌ Error cargando datos de alertas:', err);
      setError(`Error cargando alertas: ${err.message}`);
      
      // Mantener datos anteriores si existen
      if (!alertsData) {
        // Datos de fallback solo si no hay datos previos
        setAlertsData({
          alerts: [],
          stats: {
            unread_count: 0,
            high_priority_count: 0,
            medium_priority_count: 0,
            missed_dose_count: 0,
            total_count: 0
          },
          types: [
            { value: 'missed_dose', label: 'Dosis Perdida' },
            { value: 'late_dose', label: 'Dosis Tardía' },
            { value: 'low_compliance', label: 'Bajo Cumplimiento' },
            { value: 'treatment_end', label: 'Fin de Tratamiento' }
          ],
          severities: [
            { value: 'high', label: 'Alta' },
            { value: 'medium', label: 'Media' },
            { value: 'low', label: 'Baja' }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAlertsData();
  }, []);

  // Recargar cuando cambien los filtros
  useEffect(() => {
    if (alertsData) {
      loadAlertsData();
    }
  }, [selectedSeverity, selectedType, showReadAlerts]);

  const handleLogout = () => {
    apiService.logout();
  };

  const markAsRead = async (alertId: string) => {
    try {
      setActionLoading(alertId);
      await apiService.markAlertAsRead(alertId);
      
      // Actualizar estado local
      if (alertsData) {
        const updatedAlerts = alertsData.alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        );
        setAlertsData({
          ...alertsData,
          alerts: updatedAlerts,
          stats: {
            ...alertsData.stats,
            unread_count: Math.max(0, alertsData.stats.unread_count - 1)
          }
        });
      }
    } catch (error: any) {
      console.error('Error marcando alerta como leída:', error);
      alert('Error marcando alerta como leída');
    } finally {
      setActionLoading(null);
    }
  };

  const markAsUnread = async (alertId: string) => {
    try {
      setActionLoading(alertId);
      await apiService.markAlertAsUnread(alertId);
      
      // Actualizar estado local
      if (alertsData) {
        const updatedAlerts = alertsData.alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_read: false } : alert
        );
        setAlertsData({
          ...alertsData,
          alerts: updatedAlerts,
          stats: {
            ...alertsData.stats,
            unread_count: alertsData.stats.unread_count + 1
          }
        });
      }
    } catch (error: any) {
      console.error('Error marcando alerta como no leída:', error);
      alert('Error marcando alerta como no leída');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      setActionLoading(alertId);
      await apiService.deleteAlert(alertId);
      
      // Actualizar estado local
      if (alertsData) {
        const alertToDelete = alertsData.alerts.find(a => a.id === alertId);
        const updatedAlerts = alertsData.alerts.filter(alert => alert.id !== alertId);
        
        setAlertsData({
          ...alertsData,
          alerts: updatedAlerts,
          stats: {
            ...alertsData.stats,
            unread_count: alertToDelete && !alertToDelete.is_read 
              ? Math.max(0, alertsData.stats.unread_count - 1)
              : alertsData.stats.unread_count,
            total_count: Math.max(0, alertsData.stats.total_count - 1)
          }
        });
      }
      
      setShowDeleteModal(false);
      setSelectedAlert(null);
    } catch (error: any) {
      console.error('Error eliminando alerta:', error);
      alert('Error eliminando alerta');
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading('all');
      await apiService.markAllAlertsAsRead();
      
      // Actualizar estado local
      if (alertsData) {
        const updatedAlerts = alertsData.alerts.map(alert => ({ ...alert, is_read: true }));
        setAlertsData({
          ...alertsData,
          alerts: updatedAlerts,
          stats: {
            ...alertsData.stats,
            unread_count: 0
          }
        });
      }
    } catch (error: any) {
      console.error('Error marcando todas las alertas como leídas:', error);
      alert('Error marcando todas las alertas como leídas');
    } finally {
      setActionLoading(null);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'missed_dose':
        return <XCircle size={20} className="text-red-500" />;
      case 'late_dose':
        return <Clock size={20} className="text-yellow-500" />;
      case 'low_compliance':
        return <TrendingDown size={20} className="text-orange-500" />;
      case 'treatment_end':
        return <Calendar size={20} className="text-blue-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    if (!alertsData?.types) return type;
    const typeObj = alertsData.types.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="danger">Alta</Badge>;
      case 'medium':
        return <Badge variant="warning">Media</Badge>;
      case 'low':
        return <Badge variant="info">Baja</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mostrar loading inicial
  if (loading && !alertsData) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando alertas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!alertsData) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error cargando alertas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadAlertsData()} className="flex items-center space-x-2">
            <RefreshCw size={16} />
            <span>Reintentar</span>
          </Button>
        </div>
      </Layout>
    );
  }

  const { alerts, stats } = alertsData;
  const unreadCount = stats.unread_count;

  // Filtrar alertas en el frontend para mejor responsividad
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === '' || alert.severity === selectedSeverity;
    const matchesType = selectedType === '' || alert.type === selectedType;
    const matchesReadStatus = showReadAlerts || !alert.is_read;
    
    return matchesSeverity && matchesType && matchesReadStatus;
  });

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Link to="/monitoring">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver al Monitoreo</span>
              </Button>
            </Link> */}
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft size={16} />
              <span>Volver al Monitoreo</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Alertas</h1>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} alerta(s) sin leer` : 'Todas las alertas están al día'}
                </p>
                {error && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <AlertTriangle size={14} />
                    <span className="text-sm">Algunos datos pueden no estar actualizados</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => loadAlertsData()}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </Button>
            
            {unreadCount > 0 && (
              <Button 
                onClick={markAllAsRead}
                disabled={actionLoading === 'all'}
                className="flex items-center space-x-2"
              >
                {actionLoading === 'all' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                <span>Marcar Todo como Leído</span>
              </Button>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{stats.unread_count}</p>
              <p className="text-sm text-gray-600">Sin Leer</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.high_priority_count}</p>
              <p className="text-sm text-gray-600">Alta Prioridad</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.medium_priority_count}</p>
              <p className="text-sm text-gray-600">Media Prioridad</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.missed_dose_count}</p>
              <p className="text-sm text-gray-600">Dosis Perdidas</p>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-end">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severidad
                </label>
                <select 
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Todas las severidades</option>
                  {alertsData.severities.map(severity => (
                    <option key={severity.value} value={severity.value}>
                      {severity.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Alerta
                </label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Todos los tipos</option>
                  {alertsData.types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showReadAlerts}
                    onChange={(e) => setShowReadAlerts(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Mostrar alertas leídas
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de alertas */}
        <Card title={`Alertas (${filteredAlerts.length})`}>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  alert.is_read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-red-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {getAlertTypeLabel(alert.type)}
                        </span>
                        {getSeverityBadge(alert.severity)}
                        {!alert.is_read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-gray-800 ${alert.is_read ? 'text-gray-600' : 'font-medium'}`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-gray-500">
                          {formatDateTime(alert.created_at)}
                        </p>
                        <p className="text-xs text-blue-600">
                          Paciente: {alert.patient_name}
                        </p>
                        <p className="text-xs text-purple-600">
                          {alert.medication_name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert.is_read ? (
                      <button
                        onClick={() => markAsUnread(alert.id)}
                        disabled={actionLoading === alert.id}
                        className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50"
                        title="Marcar como no leída"
                      >
                        {actionLoading === alert.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Mail size={16} />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        disabled={actionLoading === alert.id}
                        className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
                        title="Marcar como leída"
                      >
                        {actionLoading === alert.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDeleteModal(true);
                      }}
                      disabled={actionLoading === alert.id}
                      className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                      title="Eliminar alerta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No hay alertas que mostrar
                  </h3>
                  <p className="text-gray-500">
                    {selectedSeverity || selectedType || !showReadAlerts
                      ? 'Intenta ajustar los filtros para ver más alertas'
                      : '¡Excelente! No hay alertas pendientes en este momento'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Modal de confirmación de eliminación */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAlert(null);
          }}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar esta alerta?
            </p>
            {selectedAlert && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-800">{selectedAlert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(selectedAlert.created_at)}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAlert(null);
                }}
                disabled={actionLoading === selectedAlert?.id}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedAlert && deleteAlert(selectedAlert.id)}
                disabled={actionLoading === selectedAlert?.id}
                className="flex items-center space-x-2"
              >
                {actionLoading === selectedAlert?.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Eliminar Alerta</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};