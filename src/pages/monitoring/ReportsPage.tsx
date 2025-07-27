import React, { useState, useEffect } from 'react';
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
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';
import apiService from '../../services/api';

interface ReportsData {
  overallStats: {
    totalPatients: number;
    totalTreatments: number;
    averageCompliance: number;
    totalDoses: number;
    missedDoses: number;
    alerts: number;
    improvementRate: number;
  };
  complianceData: Array<{
    date: string;
    compliance: number;
    patients: number;
    doses: number;
  }>;
  medicationDistribution: Array<{
    name: string;
    value: number;
    color: string;
    count: number;
  }>;
  hourlyPatterns: Array<{
    hour: string;
    doses: number;
    compliance: number;
  }>;
  patientComplianceRanges: Array<{
    range: string;
    patients: number;
    color: string;
  }>;
  treatmentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('compliance');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener usuario actual
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const user = apiService.getStoredUser();
    setCurrentUser(user);
  }, []);

  // Cargar datos de reportes
  const loadReportsData = async (period: string = selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📊 Cargando datos de reportes para período: ${period}`);
      
      const data = await apiService.getReportsPageData(period);
      setReportsData(data);
      
      console.log('✅ Datos de reportes cargados exitosamente');
    } catch (err: any) {
      console.error('❌ Error cargando datos de reportes:', err);
      setError(`Error cargando datos: ${err.message}`);
      
      // Mantener datos anteriores si existen
      if (!reportsData) {
        // Datos de fallback solo si no hay datos previos
        setReportsData({
          overallStats: {
            totalPatients: 0,
            totalTreatments: 0,
            averageCompliance: 0,
            totalDoses: 0,
            missedDoses: 0,
            alerts: 0,
            improvementRate: 0
          },
          complianceData: [],
          medicationDistribution: [],
          hourlyPatterns: [],
          patientComplianceRanges: [],
          treatmentTypes: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente y cuando cambie el período
  useEffect(() => {
    loadReportsData(selectedPeriod);
  }, [selectedPeriod]);

  const handleLogout = () => {
    apiService.logout();
  };

  const generateReport = async (type: string) => {
    try {
      console.log(`📄 Generando reporte: ${type}`);
      
      const result = await apiService.generateReport(type, 'pdf', selectedPeriod);
      
      // Mostrar mensaje de éxito
      alert(`Reporte de ${type} generado exitosamente. Se iniciará la descarga.`);
      
      // Aquí podrías implementar la descarga real del archivo
      console.log('🔽 URL de descarga:', result.download_url);
      
    } catch (err: any) {
      console.error('❌ Error generando reporte:', err);
      alert(`Error generando reporte: ${err.message}`);
    }
  };

  const exportData = async (format: string) => {
    try {
      console.log(`📤 Exportando datos en formato: ${format}`);
      
      const result = await apiService.exportData(format, 'all');
      
      // Mostrar mensaje de éxito
      alert(`Datos exportados en formato ${format} exitosamente.`);
      
      // Aquí podrías implementar la descarga real del archivo
      console.log('🔽 URL de descarga:', result.download_url);
      
    } catch (err: any) {
      console.error('❌ Error exportando datos:', err);
      alert(`Error exportando datos: ${err.message}`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  // Mostrar loading
  if (loading && !reportsData) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando datos de reportes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!reportsData) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error cargando reportes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadReportsData()} className="flex items-center space-x-2">
            <RefreshCw size={16} />
            <span>Reintentar</span>
          </Button>
        </div>
      </Layout>
    );
  }

  const { overallStats } = reportsData;

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600">Análisis detallado del cumplimiento y patrones de medicación</p>
            {error && (
              <div className="mt-2 flex items-center space-x-2 text-amber-600">
                <AlertTriangle size={16} />
                <span className="text-sm">Algunos datos pueden no estar actualizados</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 3 meses</option>
              <option value="1y">Último año</option>
            </select>
            
            <Button
              variant="outline"
              onClick={() => loadReportsData()}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </Button>
            
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
                  {overallStats.improvementRate >= 0 ? (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${overallStats.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallStats.improvementRate >= 0 ? '+' : ''}{overallStats.improvementRate}%
                  </span>
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
            {reportsData.complianceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportsData.complianceData}>
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de cumplimiento disponibles</p>
                </div>
              </div>
            )}
          </Card>

          {/* Distribución de medicamentos */}
          <Card title="Distribución por Tipo de Medicamento" className="h-96">
            {reportsData.medicationDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="70%">
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                    <RechartsPieChart
                      data={reportsData.medicationDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {reportsData.medicationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {reportsData.medicationDistribution.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de medicamentos disponibles</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Análisis por horarios */}
        <Card title="Patrones de Cumplimiento por Horario">
          {reportsData.hourlyPatterns.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData.hourlyPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="doses" orientation="left" />
                <YAxis yAxisId="compliance" orientation="right" />
                <Tooltip />
                <Bar yAxisId="doses" dataKey="doses" fill="#3B82F6" name="Dosis programadas" />
                <Line yAxisId="compliance" type="monotone" dataKey="compliance" stroke="#10B981" strokeWidth={3} name="% Cumplimiento" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de patrones horarios disponibles</p>
              </div>
            </div>
          )}
        </Card>

        {/* Análisis detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rangos de cumplimiento */}
          <Card title="Distribución de Pacientes por Cumplimiento">
            <div className="space-y-4">
              {reportsData.patientComplianceRanges.length > 0 ? (
                reportsData.patientComplianceRanges.map((range) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de rangos de cumplimiento</p>
                </div>
              )}
            </div>
          </Card>

          {/* Tipos de tratamiento */}
          <Card title="Análisis por Tipo de Tratamiento">
            <div className="space-y-4">
              {reportsData.treatmentTypes.length > 0 ? (
                reportsData.treatmentTypes.map((treatment) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de tipos de tratamiento</p>
                </div>
              )}
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