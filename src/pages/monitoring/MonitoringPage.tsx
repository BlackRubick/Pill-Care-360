import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  BarChart3,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Datos simulados
const complianceData = [
  { date: '2024-12-01', compliance: 85 },
  { date: '2024-12-02', compliance: 92 },
  { date: '2024-12-03', compliance: 88 },
  { date: '2024-12-04', compliance: 95 },
  { date: '2024-12-05', compliance: 78 },
  { date: '2024-12-06', compliance: 90 },
  { date: '2024-12-07', compliance: 87 }
];

const dailyDosesData = [
  { hour: '06:00', taken: 12, missed: 2 },
  { hour: '08:00', taken: 25, missed: 3 },
  { hour: '12:00', taken: 30, missed: 5 },
  { hour: '18:00', taken: 28, missed: 4 },
  { hour: '20:00', taken: 22, missed: 2 },
  { hour: '22:00', taken: 15, missed: 1 }
];

const recentAlerts = [
  {
    id: '1',
    patientName: 'María García',
    medication: 'Metformina 500mg',
    type: 'missed_dose',
    message: 'Dosis perdida a las 08:00',
    severity: 'high',
    timestamp: new Date('2024-12-07T08:30:00'),
    isRead: false
  },
  {
    id: '2',
    patientName: 'Juan Pérez',
    medication: 'Ibuprofeno 400mg',
    type: 'late_dose',
    message: 'Dosis tomada con 45 min de retraso',
    severity: 'medium',
    timestamp: new Date('2024-12-07T09:45:00'),
    isRead: false
  },
  {
    id: '3',
    patientName: 'Ana López',
    medication: 'Aspirina 100mg',
    type: 'low_compliance',
    message: 'Cumplimiento bajo (65%) en los últimos 7 días',
    severity: 'high',
    timestamp: new Date('2024-12-07T07:00:00'),
    isRead: true
  }
];

const patientCompliance = [
  { name: 'María García', compliance: 95, treatments: 2 },
  { name: 'Juan Pérez', compliance: 88, treatments: 1 },
  { name: 'Ana López', compliance: 65, treatments: 3 },
  { name: 'Carlos Rodríguez', compliance: 92, treatments: 1 },
  { name: 'Elena Martín', compliance: 78, treatments: 2 }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const MonitoringPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'missed_dose':
        return <XCircle size={16} className="text-red-500" />;
      case 'late_dose':
        return <Clock size={16} className="text-yellow-500" />;
      case 'low_compliance':
        return <TrendingUp size={16} className="text-orange-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
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

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const overallStats = {
    totalPatients: 24,
    activeAlerts: recentAlerts.filter(a => !a.isRead).length,
    todayCompliance: 89,
    weeklyAverage: 87
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitoreo y Cumplimiento</h1>
            <p className="text-gray-600">Supervisa el cumplimiento de tratamientos en tiempo real</p>
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
            <Link to="/monitoring/reports">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 size={16} />
                <span>Reportes</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pacientes Monitoreados</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalPatients}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.activeAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cumplimiento Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.todayCompliance}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Semanal</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.weeklyAverage}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de cumplimiento */}
          <Card title="Tendencia de Cumplimiento" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value) => [`${value}%`, 'Cumplimiento']}
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

          {/* Gráfico de dosis por hora */}
          <Card title="Dosis por Horario" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDosesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="taken" fill="#10B981" name="Tomadas" />
                <Bar dataKey="missed" fill="#EF4444" name="Perdidas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Alertas y cumplimiento por paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas recientes */}
          <Card title="Alertas Recientes" className="h-fit">
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${alert.isRead ? 'bg-gray-50' : 'bg-red-50 border-red-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{alert.patientName}</p>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.medication}</p>
                        <p className="text-sm text-gray-800 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTime(alert.timestamp)}</p>
                      </div>
                    </div>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/monitoring/alerts">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Todas las Alertas
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Cumplimiento por paciente */}
          <Card title="Cumplimiento por Paciente" className="h-fit">
            <div className="space-y-4">
              {patientCompliance.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.treatments} tratamiento(s)</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            patient.compliance >= 90 ? 'bg-green-500' :
                            patient.compliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.compliance}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        patient.compliance >= 90 ? 'text-green-600' :
                        patient.compliance >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {patient.compliance}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/monitoring/compliance">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Reporte Completo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card title="Acciones Rápidas">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/monitoring/alerts" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Gestionar Alertas</p>
                <p className="text-xs text-gray-500">{overallStats.activeAlerts} pendientes</p>
              </div>
            </Link>
            
            <Link to="/monitoring/history" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Historial Completo</p>
                <p className="text-xs text-gray-500">Ver actividad</p>
              </div>
            </Link>
            
            <Link to="/monitoring/compliance" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Análisis Cumplimiento</p>
                <p className="text-xs text-gray-500">Reportes detallados</p>
              </div>
            </Link>
            
            <Link to="/monitoring/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Reportes Avanzados</p>
                <p className="text-xs text-gray-500">Exportar datos</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};