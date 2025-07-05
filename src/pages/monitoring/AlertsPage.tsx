import React, { useState } from 'react';
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
  BellOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alert } from '../../types';

// Datos simulados de alertas
const mockAlerts: Alert[] = [
  {
    id: '1',
    patientId: '1',
    treatmentId: '1',
    type: 'missed_dose',
    message: 'María García no tomó su dosis de Metformina 500mg programada para las 08:00',
    severity: 'high',
    isRead: false,
    createdAt: new Date('2024-12-07T08:30:00')
  },
  {
    id: '2',
    patientId: '2',
    treatmentId: '2',
    type: 'late_dose',
    message: 'Juan Pérez tomó su dosis de Ibuprofeno 400mg con 45 minutos de retraso',
    severity: 'medium',
    isRead: false,
    createdAt: new Date('2024-12-07T09:45:00')
  },
  {
    id: '3',
    patientId: '3',
    treatmentId: '3',
    type: 'low_compliance',
    message: 'Ana López tiene un cumplimiento del 65% en los últimos 7 días',
    severity: 'high',
    isRead: true,
    createdAt: new Date('2024-12-07T07:00:00')
  },
  {
    id: '4',
    patientId: '1',
    treatmentId: '1',
    type: 'treatment_end',
    message: 'El tratamiento de Aspirina para María García finaliza en 3 días',
    severity: 'low',
    isRead: true,
    createdAt: new Date('2024-12-06T10:00:00')
  },
  {
    id: '5',
    patientId: '4',
    treatmentId: '4',
    type: 'missed_dose',
    message: 'Carlos Rodríguez no confirmó la toma de Enalapril 10mg de las 14:00',
    severity: 'medium',
    isRead: false,
    createdAt: new Date('2024-12-07T14:30:00')
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showReadAlerts, setShowReadAlerts] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === '' || alert.severity === selectedSeverity;
    const matchesType = selectedType === '' || alert.type === selectedType;
    const matchesReadStatus = showReadAlerts || !alert.isRead;
    
    return matchesSeverity && matchesType && matchesReadStatus;
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAsUnread = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: false } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setShowDeleteModal(false);
    setSelectedAlert(null);
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
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
    switch (type) {
      case 'missed_dose':
        return 'Dosis Perdida';
      case 'late_dose':
        return 'Dosis Tardía';
      case 'low_compliance':
        return 'Bajo Cumplimiento';
      case 'treatment_end':
        return 'Fin de Tratamiento';
      default:
        return type;
    }
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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/monitoring">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver al Monitoreo</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Alertas</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} alerta(s) sin leer` : 'Todas las alertas están al día'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                className="flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Marcar Todo como Leído</span>
              </Button>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
              <p className="text-sm text-gray-600">Sin Leer</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'high').length}
              </p>
              <p className="text-sm text-gray-600">Alta Prioridad</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {alerts.filter(a => a.severity === 'medium').length}
              </p>
              <p className="text-sm text-gray-600">Media Prioridad</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {alerts.filter(a => a.type === 'missed_dose').length}
              </p>
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
                >
                  <option value="">Todas las severidades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
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
                >
                  <option value="">Todos los tipos</option>
                  <option value="missed_dose">Dosis Perdida</option>
                  <option value="late_dose">Dosis Tardía</option>
                  <option value="low_compliance">Bajo Cumplimiento</option>
                  <option value="treatment_end">Fin de Tratamiento</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showReadAlerts}
                    onChange={(e) => setShowReadAlerts(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                  alert.isRead 
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
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-gray-800 ${alert.isRead ? 'text-gray-600' : 'font-medium'}`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert.isRead ? (
                      <button
                        onClick={() => markAsUnread(alert.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Marcar como no leída"
                      >
                        <Mail size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Marcar como leída"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
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
                  {formatDateTime(selectedAlert.createdAt)}
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
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedAlert && deleteAlert(selectedAlert.id)}
              >
                Eliminar Alerta
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};