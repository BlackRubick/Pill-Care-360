import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Pill,
  Activity,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Datos simulados
const mockHistory = [
  {
    id: '1',
    patientId: '1',
    patientName: 'María García López',
    treatmentId: '1',
    medicationName: 'Metformina 500mg',
    action: 'dose_taken',
    actionLabel: 'Dosis tomada',
    scheduledTime: new Date('2024-12-07T08:00:00'),
    actualTime: new Date('2024-12-07T08:05:00'),
    status: 'taken',
    notes: 'Tomada con el desayuno',
    timestamp: new Date('2024-12-07T08:05:00')
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Juan Carlos Pérez',
    treatmentId: '2',
    medicationName: 'Ibuprofeno 400mg',
    action: 'dose_missed',
    actionLabel: 'Dosis perdida',
    scheduledTime: new Date('2024-12-07T09:00:00'),
    actualTime: null,
    status: 'missed',
    notes: 'No confirmada en el tiempo programado',
    timestamp: new Date('2024-12-07T09:30:00')
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Ana López Mendoza',
    treatmentId: '3',
    medicationName: 'Aspirina 100mg',
    action: 'alarm_snoozed',
    actionLabel: 'Alarma pospuesta',
    scheduledTime: new Date('2024-12-07T22:00:00'),
    actualTime: new Date('2024-12-07T22:15:00'),
    status: 'taken',
    notes: 'Pospuesta 15 minutos',
    timestamp: new Date('2024-12-07T22:15:00')
  },
  {
    id: '4',
    patientId: '1',
    patientName: 'María García López',
    treatmentId: '4',
    medicationName: 'Enalapril 10mg',
    action: 'treatment_started',
    actionLabel: 'Tratamiento iniciado',
    scheduledTime: new Date('2024-12-01T00:00:00'),
    actualTime: new Date('2024-12-01T00:00:00'),
    status: 'active',
    notes: 'Nuevo tratamiento para hipertensión',
    timestamp: new Date('2024-12-01T10:00:00')
  },
  {
    id: '5',
    patientId: '2',
    patientName: 'Juan Carlos Pérez',
    treatmentId: '5',
    medicationName: 'Paracetamol 500mg',
    action: 'treatment_stopped',
    actionLabel: 'Tratamiento suspendido',
    scheduledTime: new Date('2024-11-30T00:00:00'),
    actualTime: new Date('2024-11-30T00:00:00'),
    status: 'suspended',
    notes: 'Suspendido por efectos secundarios',
    timestamp: new Date('2024-11-30T14:30:00')
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const HistoryPage: React.FC = () => {
  const [history] = useState(mockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredHistory = history.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === '' || record.action === actionFilter;
    const matchesStatus = statusFilter === '' || record.status === statusFilter;
    
    return matchesSearch && matchesAction && matchesStatus;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'dose_taken':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'dose_missed':
        return <XCircle size={20} className="text-red-600" />;
      case 'alarm_snoozed':
        return <Clock size={20} className="text-yellow-600" />;
      case 'treatment_started':
        return <Activity size={20} className="text-blue-600" />;
      case 'treatment_stopped':
        return <XCircle size={20} className="text-gray-600" />;
      default:
        return <Activity size={20} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'taken':
        return <Badge variant="success">Tomada</Badge>;
      case 'missed':
        return <Badge variant="danger">Perdida</Badge>;
      case 'active':
        return <Badge variant="info">Activo</Badge>;
      case 'suspended':
        return <Badge variant="warning">Suspendido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  const exportHistory = () => {
    console.log('Exportando historial...');
    // Aquí iría la lógica para exportar
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Historial Completo</h1>
              <p className="text-gray-600">Registro detallado de todas las actividades del sistema</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={exportHistory}
              className="flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Exportar</span>
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {history.filter(h => h.status === 'taken').length}
              </p>
              <p className="text-sm text-gray-600">Dosis Tomadas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {history.filter(h => h.status === 'missed').length}
              </p>
              <p className="text-sm text-gray-600">Dosis Perdidas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {history.filter(h => h.action === 'treatment_started').length}
              </p>
              <p className="text-sm text-gray-600">Tratamientos Iniciados</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {history.filter(h => h.action === 'alarm_snoozed').length}
              </p>
              <p className="text-sm text-gray-600">Alarmas Pospuestas</p>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente, medicamento o notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las acciones</option>
              <option value="dose_taken">Dosis tomada</option>
              <option value="dose_missed">Dosis perdida</option>
              <option value="alarm_snoozed">Alarma pospuesta</option>
              <option value="treatment_started">Tratamiento iniciado</option>
              <option value="treatment_stopped">Tratamiento suspendido</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="taken">Tomada</option>
              <option value="missed">Perdida</option>
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
            </select>

            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1d">Último día</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 3 meses</option>
            </select>
          </div>
        </Card>

        {/* Lista de historial */}
        <Card title={`Historial de Actividades (${filteredHistory.length})`}>
          <div className="space-y-4">
            {filteredHistory.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getActionIcon(record.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {record.actionLabel}
                        </h3>
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{record.patientName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{record.medicationName}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Programado: {formatDateTime(record.scheduledTime)}
                          </span>
                        </div>
                        {record.actualTime && (
                          <div className="flex items-center space-x-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Real: {formatDateTime(record.actualTime)}
                            </span>
                          </div>
                        )}
                      </div>

                      {record.notes && (
                        <div className="bg-gray-100 rounded-md p-3">
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDateTime(record.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Activity size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No hay actividades que mostrar
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || actionFilter || statusFilter
                      ? 'Intenta ajustar los filtros para ver más actividades'
                      : 'Las actividades aparecerán aquí conforme se registren en el sistema'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};