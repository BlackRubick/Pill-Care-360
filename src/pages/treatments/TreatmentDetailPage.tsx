import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Pill, 
  Calendar, 
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos simulados
const mockTreatment = {
  id: '1',
  patient: {
    id: '1',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    phone: '+52 961 123 4567'
  },
  medication: {
    id: '1',
    name: 'Metformina',
    dosage: '500mg',
    description: 'Medicamento para diabetes tipo 2',
    sideEffects: ['Náuseas', 'Diarrea', 'Dolor abdominal']
  },
  dosage: '500mg',
  frequency: 2,
  duration: 30,
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-31'),
  instructions: 'Tomar con las comidas principales para reducir efectos gastrointestinales',
  status: 'active',
  compliance: 94,
  createdAt: new Date('2024-12-01'),
  alarms: [
    {
      id: '1',
      time: '08:00',
      description: 'Con el desayuno',
      isActive: true,
      soundEnabled: true,
      visualEnabled: true
    },
    {
      id: '2',
      time: '20:00',
      description: 'Con la cena',
      isActive: true,
      soundEnabled: true,
      visualEnabled: true
    }
  ]
};

const mockDoseHistory = [
  { date: '2024-12-01', taken: 2, missed: 0, compliance: 100 },
  { date: '2024-12-02', taken: 2, missed: 0, compliance: 100 },
  { date: '2024-12-03', taken: 1, missed: 1, compliance: 50 },
  { date: '2024-12-04', taken: 2, missed: 0, compliance: 100 },
  { date: '2024-12-05', taken: 2, missed: 0, compliance: 100 },
  { date: '2024-12-06', taken: 2, missed: 0, compliance: 100 },
  { date: '2024-12-07', taken: 1, missed: 0, compliance: 50 }
];

const mockRecentDoses = [
  {
    id: '1',
    scheduledTime: new Date('2024-12-07T20:00:00'),
    actualTime: new Date('2024-12-07T20:05:00'),
    status: 'taken',
    notes: 'Tomada con la cena'
  },
  {
    id: '2',
    scheduledTime: new Date('2024-12-07T08:00:00'),
    actualTime: new Date('2024-12-07T08:00:00'),
    status: 'taken',
    notes: 'Tomada con el desayuno'
  },
  {
    id: '3',
    scheduledTime: new Date('2024-12-06T20:00:00'),
    actualTime: new Date('2024-12-06T20:15:00'),
    status: 'taken',
    notes: 'Tomada con 15 minutos de retraso'
  },
  {
    id: '4',
    scheduledTime: new Date('2024-12-06T08:00:00'),
    actualTime: new Date('2024-12-06T08:00:00'),
    status: 'taken',
    notes: 'Tomada puntualmente'
  },
  {
    id: '5',
    scheduledTime: new Date('2024-12-05T20:00:00'),
    actualTime: null,
    status: 'missed',
    notes: 'No se registró la toma'
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const TreatmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'suspended':
        return <Badge variant="warning">Suspendido</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDoseStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'missed':
        return <XCircle size={20} className="text-red-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const diffTime = mockTreatment.endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysElapsed = () => {
    const today = new Date();
    const diffTime = today.getTime() - mockTreatment.startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: Activity },
    { id: 'alarms', label: 'Alarmas', icon: Bell },
    { id: 'history', label: 'Historial de Dosis', icon: Clock },
    { id: 'compliance', label: 'Cumplimiento', icon: CheckCircle }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Información del tratamiento */}
      <Card title="Información del Tratamiento">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Paciente</p>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-900">{mockTreatment.patient.name}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Medicamento</p>
              <div className="flex items-center space-x-2">
                <Pill size={16} className="text-gray-400" />
                <span className="text-gray-900">
                  {mockTreatment.medication.name} {mockTreatment.dosage}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Frecuencia</p>
              <p className="text-gray-900">{mockTreatment.frequency} veces al día</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              {getStatusBadge(mockTreatment.status)}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Duración</p>
              <p className="text-gray-900">{mockTreatment.duration} días</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Período</p>
              <p className="text-gray-900">
                {formatDate(mockTreatment.startDate)} - {formatDate(mockTreatment.endDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Progreso</p>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((getDaysElapsed() / mockTreatment.duration) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {getDaysElapsed()}/{mockTreatment.duration} días
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Días Restantes</p>
              <p className="text-gray-900">{Math.max(getDaysRemaining(), 0)} días</p>
            </div>
          </div>
        </div>

        {mockTreatment.instructions && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instrucciones Especiales</h4>
            <p className="text-blue-800">{mockTreatment.instructions}</p>
          </div>
        )}
      </Card>

      {/* Información del medicamento */}
      <Card title="Información del Medicamento">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Descripción</p>
            <p className="text-gray-900">{mockTreatment.medication.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Efectos Secundarios Conocidos</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockTreatment.medication.sideEffects.map((effect, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                >
                  <AlertTriangle size={12} className="mr-1" />
                  {effect}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{mockTreatment.compliance}%</p>
            <p className="text-sm text-gray-600">Cumplimiento</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {mockDoseHistory.reduce((sum, day) => sum + day.taken, 0)}
            </p>
            <p className="text-sm text-gray-600">Dosis Tomadas</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {mockDoseHistory.reduce((sum, day) => sum + day.missed, 0)}
            </p>
            <p className="text-sm text-gray-600">Dosis Perdidas</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{mockTreatment.alarms.length}</p>
            <p className="text-sm text-gray-600">Alarmas Activas</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAlarmsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Alarmas Configuradas</h3>
        <Link to="/treatments/alarms">
          <Button variant="outline">Gestionar Todas las Alarmas</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockTreatment.alarms.map((alarm) => (
          <Card key={alarm.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bell size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{alarm.time}</h4>
                  <p className="text-gray-600">{alarm.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {alarm.soundEnabled ? (
                    <Volume2 size={16} className="text-blue-600" />
                  ) : (
                    <VolumeX size={16} className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {alarm.soundEnabled ? 'Sonido' : 'Sin sonido'}
                  </span>
                </div>

                <Badge variant={alarm.isActive ? 'success' : 'secondary'}>
                  {alarm.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Historial de Dosis Recientes</h3>
      
      <div className="space-y-4">
        {mockRecentDoses.map((dose) => (
          <Card key={dose.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getDoseStatusIcon(dose.status)}
                <div>
                  <p className="font-medium text-gray-900">
                    Dosis programada para {formatDateTime(dose.scheduledTime)}
                  </p>
                  {dose.actualTime && (
                    <p className="text-sm text-gray-600">
                      Tomada: {formatDateTime(dose.actualTime)}
                    </p>
                  )}
                  {dose.notes && (
                    <p className="text-sm text-gray-500">{dose.notes}</p>
                  )}
                </div>
              </div>

              <Badge variant={
                dose.status === 'taken' ? 'success' : 
                dose.status === 'missed' ? 'danger' : 'warning'
              }>
                {dose.status === 'taken' ? 'Tomada' : 
                 dose.status === 'missed' ? 'Perdida' : 'Pendiente'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Análisis de Cumplimiento</h3>
      
      <Card title="Tendencia de Cumplimiento" className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockDoseHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
              formatter={(value, name) => [
                `${value}${name === 'compliance' ? '%' : ''}`,
                name === 'compliance' ? 'Cumplimiento' : 
                name === 'taken' ? 'Dosis Tomadas' : 'Dosis Perdidas'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="compliance" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Resumen de Cumplimiento">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cumplimiento general:</span>
              <span className={`font-semibold ${getComplianceColor(mockTreatment.compliance)}`}>
                {mockTreatment.compliance}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dosis tomadas:</span>
              <span className="font-semibold text-blue-600">
                {mockDoseHistory.reduce((sum, day) => sum + day.taken, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dosis perdidas:</span>
              <span className="font-semibold text-red-600">
                {mockDoseHistory.reduce((sum, day) => sum + day.missed, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Días con cumplimiento 100%:</span>
              <span className="font-semibold text-purple-600">
                {mockDoseHistory.filter(day => day.compliance === 100).length}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Recomendaciones">
          <div className="space-y-3">
            {mockTreatment.compliance >= 95 ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Excelente cumplimiento</p>
                <p className="text-sm text-green-700">
                  El paciente mantiene un cumplimiento excelente. Continuar con el tratamiento actual.
                </p>
              </div>
            ) : mockTreatment.compliance >= 80 ? (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Cumplimiento aceptable</p>
                <p className="text-sm text-yellow-700">
                  Considerar revisar los horarios de medicación para mejorar el cumplimiento.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800">Cumplimiento bajo</p>
                <p className="text-sm text-red-700">
                  Se requiere intervención. Contactar al paciente para revisar el tratamiento.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Sugerencia</p>
              <p className="text-sm text-blue-700">
                Programar una cita de seguimiento para evaluar la efectividad del tratamiento.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/treatments">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver a Tratamientos</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mockTreatment.medication.name} {mockTreatment.dosage}
              </h1>
              <p className="text-gray-600">
                Tratamiento para {mockTreatment.patient.name}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              {mockTreatment.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
              <span>{mockTreatment.status === 'active' ? 'Suspender' : 'Activar'}</span>
            </Button>
            <Link to={`/treatments/${id}/edit`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit size={16} />
                <span>Editar</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'alarms' && renderAlarmsTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'compliance' && renderComplianceTab()}
          </div>
        </Card>
      </div>
    </Layout>
  );
};