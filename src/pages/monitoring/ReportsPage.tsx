import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Download, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Users,
  Pill,
  Activity,
  AlertTriangle,
  FileText,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';

// Datos simulados para reportes
const complianceData = [
  { date: '2024-11-01', compliance: 78, patients: 20, doses: 145 },
  { date: '2024-11-02', compliance: 82, patients: 21, doses: 158 },
  { date: '2024-11-03', compliance: 85, patients: 22, doses: 167 },
  { date: '2024-11-04', compliance: 79, patients: 22, doses: 162 },
  { date: '2024-11-05', compliance: 88, patients: 23, doses: 178 },
  { date: '2024-11-06', compliance: 91, patients: 24, doses: 189 },
  { date: '2024-11-07', compliance: 87, patients: 24, doses: 185 },
  { date: '2024-11-08', compliance: 89, patients: 24, doses: 192 },
  { date: '2024-11-09', compliance: 93, patients: 25, doses: 201 },
  { date: '2024-11-10', compliance: 86, patients: 25, doses: 196 },
  { date: '2024-11-11', compliance: 90, patients: 25, doses: 203 },
  { date: '2024-11-12', compliance: 94, patients: 26, doses: 218 },
  { date: '2024-11-13', compliance: 88, patients: 26, doses: 210 },
  { date: '2024-11-14', compliance: 92, patients: 26, doses: 224 },
  { date: '2024-11-15', compliance: 89, patients: 27, doses: 219 }
];

const medicationDistribution = [
  { name: 'Cardiovasculares', value: 35, color: '#3B82F6' },
  { name: 'Diabetes', value: 28, color: '#10B981' },
  { name: 'Analgésicos', value: 18, color: '#F59E0B' },
  { name: 'Antibióticos', value: 12, color: '#EF4444' },
  { name: 'Otros', value: 7, color: '#8B5CF6' }
];

const hourlyPatterns = [
  { hour: '06:00', doses: 12, compliance: 85 },
  { hour: '08:00', doses: 45, compliance: 92 },
  { hour: '12:00', doses: 38, compliance: 88 },
  { hour: '18:00', doses: 42, compliance: 90 },
  { hour: '20:00', doses: 35, compliance: 87 },
  { hour: '22:00', doses: 28, compliance: 82 }
];

const patientComplianceRanges = [
  { range: '90-100%', patients: 15, color: '#10B981' },
  { range: '80-89%', patients: 8, color: '#F59E0B' },
  { range: '70-79%', patients: 3, color: '#EF4444' },
  { range: '60-69%', patients: 1, color: '#DC2626' },
  { range: '<60%', patients: 0, color: '#7F1D1D' }
];

const treatmentTypes = [
  { type: 'Crónicos', count: 18, percentage: 67 },
  { type: 'Agudos', count: 6, percentage: 22 },
  { type: 'Preventivos', count: 3, percentage: 11 }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('compliance');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const generateReport = (type: string) => {
    console.log(`Generando reporte: ${type}`);
    // Aquí iría la lógica para generar y descargar el reporte
  };

  const exportData = (format: string) => {
    console.log(`Exportando datos en formato: ${format}`);
    // Aquí iría la lógica para exportar datos
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  const overallStats = {
    totalPatients: 27,
    totalTreatments: 45,
    averageCompliance: 89,
    totalDoses: 2847,
    missedDoses: 312,
    alerts: 23,
    improvementRate: 5.2
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600">Análisis detallado del cumplimiento y patrones de medicación</p>
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
              <option value="1y">Último año</option>
            </select>
            <Button
              variant="outline"
              onClick={() => exportData('pdf')}
              className="flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Exportar PDF</span>
            </Button>
            <Button
              onClick={() => generateReport('complete')}
              className="flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>Generar Reporte</span>
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
                  <span className="text-sm text-green-600">+{overallStats.improvementRate}%</span>
                </div>
              </div>
              <Activity className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
                <p className="text-3xl font-bold text-blue-600">{overallStats.totalPatients}</p>
                <p className="text-sm text-gray-600 mt-1">{overallStats.totalTreatments} tratamientos</p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dosis Administradas</p>
                <p className="text-3xl font-bold text-purple-600">{overallStats.totalDoses.toLocaleString()}</p>
                <p className="text-sm text-red-600 mt-1">{overallStats.missedDoses} perdidas</p>
              </div>
              <Pill className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Alertas Generadas</p>
                <p className="text-3xl font-bold text-orange-600">{overallStats.alerts}</p>
                <p className="text-sm text-gray-600 mt-1">Este período</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Selección de tipo de reporte */}
        <Card>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'compliance', label: 'Cumplimiento', icon: Activity },
              { id: 'medications', label: 'Medicamentos', icon: Pill },
              { id: 'patterns', label: 'Patrones Horarios', icon: Clock },
              { id: 'patients', label: 'Análisis Pacientes', icon: Users }
            ].map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedReport === report.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{report.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de cumplimiento */}
          <Card title="Tendencia de Cumplimiento" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis domain={[70, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value, name) => {
                    if (name === 'compliance') return [`${value}%`, 'Cumplimiento'];
                    return [value, name];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribución de medicamentos */}
          <Card title="Distribución por Tipo de Medicamento" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                <RechartsPieChart
                  data={medicationDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {medicationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {medicationDistribution.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Análisis por horarios */}
        <Card title="Patrones de Cumplimiento por Horario">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="doses" orientation="left" />
              <YAxis yAxisId="compliance" orientation="right" />
              <Tooltip />
              <Bar yAxisId="doses" dataKey="doses" fill="#3B82F6" name="Dosis programadas" />
              <Line yAxisId="compliance" type="monotone" dataKey="compliance" stroke="#10B981" strokeWidth={3} name="% Cumplimiento" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Análisis detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rangos de cumplimiento */}
          <Card title="Distribución de Pacientes por Cumplimiento">
            <div className="space-y-4">
              {patientComplianceRanges.map((range) => (
                <div key={range.range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: range.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{range.range}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{range.patients}</span>
                    <span className="text-sm text-gray-500">pacientes</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tipos de tratamiento */}
          <Card title="Análisis por Tipo de Tratamiento">
            <div className="space-y-4">
              {treatmentTypes.map((treatment) => (
                <div key={treatment.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{treatment.type}</span>
                    <span className="text-sm text-gray-600">{treatment.count} tratamientos ({treatment.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${treatment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card title="Generar Reportes Específicos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => generateReport('compliance')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reporte de Cumplimiento</h3>
                  <p className="text-sm text-gray-500">Análisis detallado del cumplimiento por paciente</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => generateReport('medications')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Pill className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reporte de Medicamentos</h3>
                  <p className="text-sm text-gray-500">Estadísticas de uso y efectividad</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => generateReport('alerts')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reporte de Alertas</h3>
                  <p className="text-sm text-gray-500">Análisis de incidencias y patrones</p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Opciones de exportación */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Exportar Datos</h3>
              <p className="text-sm text-gray-600">Descarga los datos en diferentes formatos para análisis externo</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => exportData('csv')}
                size="sm"
              >
                CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('excel')}
                size="sm"
              >
                Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('pdf')}
                size="sm"
              >
                PDF
              </Button>
              <Button
                onClick={() => exportData('json')}
                size="sm"
              >
                JSON
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};