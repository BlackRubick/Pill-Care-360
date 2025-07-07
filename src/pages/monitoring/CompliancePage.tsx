import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Download,
  Calendar,
  User,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Cell } from 'recharts';

// Datos simulados
const complianceData = [
  { date: '2024-12-01', compliance: 85, totalDoses: 48, takenDoses: 41, missedDoses: 7 },
  { date: '2024-12-02', compliance: 92, totalDoses: 50, takenDoses: 46, missedDoses: 4 },
  { date: '2024-12-03', compliance: 78, totalDoses: 52, takenDoses: 41, missedDoses: 11 },
  { date: '2024-12-04', compliance: 95, totalDoses: 49, takenDoses: 47, missedDoses: 2 },
  { date: '2024-12-05', compliance: 88, totalDoses: 51, takenDoses: 45, missedDoses: 6 },
  { date: '2024-12-06', compliance: 91, totalDoses: 53, takenDoses: 48, missedDoses: 5 },
  { date: '2024-12-07', compliance: 87, totalDoses: 55, takenDoses: 48, missedDoses: 7 }
];

const patientCompliance = [
  {
    id: '1',
    name: 'María García López',
    totalTreatments: 2,
    activeTreatments: 2,
    weeklyCompliance: 94,
    monthlyCompliance: 89,
    totalDoses: 84,
    takenDoses: 79,
    missedDoses: 5,
    trend: 'up',
    lastDose: new Date('2024-12-07T08:05:00'),
    riskLevel: 'low'
  },
  {
    id: '2',
    name: 'Juan Carlos Pérez',
    totalTreatments: 1,
    activeTreatments: 1,
    weeklyCompliance: 82,
    monthlyCompliance: 78,
    totalDoses: 42,
    takenDoses: 34,
    missedDoses: 8,
    trend: 'down',
    lastDose: new Date('2024-12-06T15:30:00'),
    riskLevel: 'medium'
  },
  {
    id: '3',
    name: 'Ana López Mendoza',
    totalTreatments: 3,
    activeTreatments: 2,
    weeklyCompliance: 65,
    monthlyCompliance: 68,
    totalDoses: 126,
    takenDoses: 82,
    missedDoses: 44,
    trend: 'down',
    lastDose: new Date('2024-12-05T22:15:00'),
    riskLevel: 'high'
  }
];

const complianceByTimeSlot = [
  { timeSlot: '06:00-09:00', compliance: 92, doses: 35 },
  { timeSlot: '09:00-12:00', compliance: 88, doses: 28 },
  { timeSlot: '12:00-15:00', compliance: 85, doses: 42 },
  { timeSlot: '15:00-18:00', compliance: 78, doses: 38 },
  { timeSlot: '18:00-21:00', compliance: 91, doses: 45 },
  { timeSlot: '21:00-24:00', compliance: 73, doses: 32 }
];

const complianceDistribution = [
  { range: '90-100%', count: 1, color: '#10B981' },
  { range: '80-89%', count: 1, color: '#F59E0B' },
  { range: '70-79%', count: 0, color: '#EF4444' },
  { range: '60-69%', count: 1, color: '#DC2626' },
  { range: '<60%', count: 0, color: '#7F1D1D' }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const CompliancePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPatient, setSelectedPatient] = useState('');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredPatients = selectedPatient 
    ? patientCompliance.filter(p => p.id === selectedPatient)
    : patientCompliance;

  const overallStats = {
    averageCompliance: Math.round(patientCompliance.reduce((sum, p) => sum + p.weeklyCompliance, 0) / patientCompliance.length),
    totalPatients: patientCompliance.length,
    highRiskPatients: patientCompliance.filter(p => p.riskLevel === 'high').length,
    totalDoses: patientCompliance.reduce((sum, p) => sum + p.totalDoses, 0),
    takenDoses: patientCompliance.reduce((sum, p) => sum + p.takenDoses, 0),
    missedDoses: patientCompliance.reduce((sum, p) => sum + p.missedDoses, 0)
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <Badge variant="success">Bajo Riesgo</Badge>;
      case 'medium':
        return <Badge variant="warning">Riesgo Medio</Badge>;
      case 'high':
        return <Badge variant="danger">Alto Riesgo</Badge>;
      default:
        return <Badge variant="secondary">{riskLevel}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' 
      ? <TrendingUp size={16} className="text-green-600" />
      : <TrendingDown size={16} className="text-red-600" />;
  };

  const exportReport = () => {
    console.log('Exportando reporte de cumplimiento...');
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
              <h1 className="text-2xl font-bold text-gray-900">Análisis de Cumplimiento</h1>
              <p className="text-gray-600">Reporte detallado del cumplimiento de tratamientos</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 3 meses</option>
            </select>
            <Button 
              variant="outline" 
              onClick={exportReport}
              className="flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Exportar</span>
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cumplimiento Promedio</p>
                <p className="text-3xl font-bold text-green-600">{overallStats.averageCompliance}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2.3%</span>
                </div>
              </div>
              <Target className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pacientes en Riesgo</p>
                <p className="text-3xl font-bold text-red-600">{overallStats.highRiskPatients}</p>
                <p className="text-sm text-gray-600 mt-1">de {overallStats.totalPatients} total</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dosis Tomadas</p>
                <p className="text-3xl font-bold text-blue-600">{overallStats.takenDoses}</p>
                <p className="text-sm text-gray-600 mt-1">de {overallStats.totalDoses} programadas</p>
              </div>
              <CheckCircle className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dosis Perdidas</p>
                <p className="text-3xl font-bold text-orange-600">{overallStats.missedDoses}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((overallStats.missedDoses / overallStats.totalDoses) * 100)}% del total
                </p>
              </div>
              <XCircle className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por paciente:</label>
            <select 
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los pacientes</option>
              {patientCompliance.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de cumplimiento */}
          <Card title="Tendencia de Cumplimiento" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value, name) => [
                    `${value}${name === 'compliance' ? '%' : ''}`,
                    name === 'compliance' ? 'Cumplimiento' : 
                    name === 'takenDoses' ? 'Dosis Tomadas' : 'Dosis Perdidas'
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

          {/* Cumplimiento por franja horaria */}
          <Card title="Cumplimiento por Horario" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceByTimeSlot}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value}${name === 'compliance' ? '%' : ''}`,
                  name === 'compliance' ? 'Cumplimiento' : 'Dosis'
                ]} />
                <Bar dataKey="compliance" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Análisis por paciente */}
        <Card title="Análisis Individual por Paciente">
          <div className="space-y-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        {patient.activeTreatments} tratamiento(s) activo(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getRiskBadge(patient.riskLevel)}
                    {getTrendIcon(patient.trend)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{patient.weeklyCompliance}%</p>
                    <p className="text-sm text-gray-600">Cumplimiento Semanal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{patient.takenDoses}</p>
                    <p className="text-sm text-gray-600">Dosis Tomadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{patient.missedDoses}</p>
                    <p className="text-sm text-gray-600">Dosis Perdidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      {Math.round(((patient.totalDoses - patient.missedDoses) / patient.totalDoses) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Última dosis registrada:</p>
                      <p className="text-sm text-gray-600">
                        {new Intl.DateTimeFormat('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(patient.lastDose)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Progreso del tratamiento:</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${patient.weeklyCompliance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {patient.riskLevel === 'high' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-sm text-red-800 font-medium">Atención requerida</p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Este paciente requiere seguimiento especial debido a su bajo cumplimiento.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Distribución de cumplimiento */}
        <Card title="Distribución de Cumplimiento">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Pacientes por Rango de Cumplimiento</h4>
              <div className="space-y-3">
                {complianceDistribution.map((range) => (
                  <div key={range.range} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: range.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{range.range}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{range.count}</span>
                      <span className="text-sm text-gray-500">paciente(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recomendaciones</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Seguimiento especial</p>
                  <p className="text-sm text-blue-700">
                    {overallStats.highRiskPatients} paciente(s) requieren atención inmediata
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Cumplimiento general</p>
                  <p className="text-sm text-green-700">
                    El {overallStats.averageCompliance}% de cumplimiento está dentro del objetivo
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Oportunidad de mejora</p>
                  <p className="text-sm text-yellow-700">
                    Revisar horarios de medicación en franjas de menor cumplimiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};