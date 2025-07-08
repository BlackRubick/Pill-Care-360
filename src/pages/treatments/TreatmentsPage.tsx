import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  User,
  Pill,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Bug
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import type { Treatment } from '../../types';

export const TreatmentsPage: React.FC = () => {
  // Estados principales
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Estados de modales
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados de operaciones
  const [deletingTreatment, setDeletingTreatment] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  // Usuario actual
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Estado de debug
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar usuario actual
      const user = apiService.getStoredUser();
      setCurrentUser(user);
      
      console.log('👤 Usuario actual:', user);
      console.log('🔐 Token presente:', !!localStorage.getItem("access_token"));
      
      // Cargar tratamientos del usuario
      await loadTreatments();
    } catch (err: any) {
      console.error('💥 Error cargando datos iniciales:', err);
      setError(err.message || 'Error cargando los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadTreatments = async () => {
    try {
      console.log('🔄 Iniciando carga de tratamientos...');
      
      // Debug: Información del usuario y autenticación
      const user = apiService.getStoredUser();
      const token = localStorage.getItem("access_token");
      
      const debugData = {
        user: user,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        baseURL: (apiService as any).baseURL,
        timestamp: new Date().toISOString()
      };
      
      console.log('📊 Debug Info:', debugData);
      setDebugInfo(debugData);
      
      // Método 1: Intentar getUserTreatments
      console.log('🔍 Método 1: Intentando getUserTreatments...');
      try {
        const userTreatments = await apiService.getUserTreatments();
        console.log('✅ getUserTreatments exitoso:', userTreatments);
        setTreatments(userTreatments);
        return; // Si funciona, salir
      } catch (error1) {
        console.log('❌ getUserTreatments falló:', error1);
      }

      // Método 2: Intentar getTreatments directo
      console.log('🔍 Método 2: Intentando getTreatments directo...');
      try {
        const allTreatments = await apiService.getTreatments();
        console.log('✅ getTreatments exitoso:', allTreatments);
        setTreatments(allTreatments);
        return; // Si funciona, salir
      } catch (error2) {
        console.log('❌ getTreatments falló:', error2);
      }

      // Método 3: Intentar con parámetros específicos
      console.log('🔍 Método 3: Intentando con parámetros específicos...');
      try {
        const params = user?.id ? { caregiver_id: user.id } : {};
        const paramTreatments = await apiService.getTreatments(params);
        console.log('✅ getTreatments con parámetros exitoso:', paramTreatments);
        setTreatments(paramTreatments);
        return; // Si funciona, salir
      } catch (error3) {
        console.log('❌ getTreatments con parámetros falló:', error3);
      }

      // Método 4: Probar endpoints alternativos
      console.log('🔍 Método 4: Probando endpoints alternativos...');
      try {
        // Intentar con request directo
        const directResponse = await (apiService as any).request('/treatments/');
        console.log('✅ Request directo exitoso:', directResponse);
        setTreatments(Array.isArray(directResponse) ? directResponse : []);
        return;
      } catch (error4) {
        console.log('❌ Request directo falló:', error4);
      }

      // Si todos los métodos fallan
      throw new Error('No se pudo cargar los tratamientos por ningún método');
      
    } catch (err: any) {
      console.error('❌ Error final cargando tratamientos:', err);
      
      if (err.message.includes('401') || err.message.includes('Sesión expirada')) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // handleLogout();
        return;
      }
      
      setError('Error cargando los tratamientos: ' + err.message);
    }
  };

  // Función de debug manual
  const runDebugTests = async () => {
    console.log('🐛 Iniciando tests de debug...');
    
    try {
      // Test 1: Verificar salud de la API
      console.log('\n🏥 Test 1: Health check...');
      try {
        const health = await apiService.checkHealth();
        console.log('✅ Health check:', health);
      } catch (e) {
        console.log('❌ Health check falló:', e);
      }

      // Test 2: Verificar usuario actual
      console.log('\n👤 Test 2: Usuario actual...');
      try {
        const currentUserAPI = await apiService.getCurrentUser();
        console.log('✅ Usuario desde API:', currentUserAPI);
      } catch (e) {
        console.log('❌ getCurrentUser falló:', e);
      }

      // Test 3: Verificar pacientes (para contexto)
      console.log('\n👥 Test 3: Pacientes...');
      try {
        const patients = await apiService.getPatients();
        console.log('✅ Pacientes:', patients);
      } catch (e) {
        console.log('❌ getPatients falló:', e);
      }

      // Test 4: Probar diferentes endpoints de tratamientos
      console.log('\n💊 Test 4: Endpoints de tratamientos...');
      const endpointsToTest = [
        '/treatments/',
        '/treatments',
        '/api/treatments/',
        '/api/treatments'
      ];

      for (const endpoint of endpointsToTest) {
        try {
          console.log(`Probando: ${endpoint}`);
          const response = await (apiService as any).request(endpoint);
          console.log(`✅ ${endpoint}:`, response);
        } catch (e) {
          console.log(`❌ ${endpoint}:`, e);
        }
      }

    } catch (error) {
      console.error('💥 Error en debug tests:', error);
    }
  };

  const handleLogout = () => {
    apiService.logout();
  };

  // Filtrar tratamientos
  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = 
      treatment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.medication?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || treatment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Manejar eliminación de tratamiento
  const handleDeleteTreatment = async (treatmentId: string) => {
    if (!selectedTreatment) return;
    
    setDeletingTreatment(true);
    try {
      console.log('🗑️ Eliminando tratamiento:', treatmentId);
      
      await apiService.deleteTreatment(parseInt(treatmentId));
      
      // Actualizar lista local
      setTreatments(prev => prev.filter(t => t.id !== treatmentId));
      
      console.log('✅ Tratamiento eliminado exitosamente');
      
      // Cerrar modal
      setShowDeleteModal(false);
      setSelectedTreatment(null);
      
    } catch (err: any) {
      console.error('❌ Error eliminando tratamiento:', err);
      setError('Error eliminando el tratamiento: ' + err.message);
    } finally {
      setDeletingTreatment(false);
    }
  };

  // Manejar cambio de estado del tratamiento
  const handleToggleStatus = async (treatmentId: string) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    if (!treatment) return;
    
    setTogglingStatus(treatmentId);
    try {
      console.log('🔄 Cambiando estado del tratamiento:', treatmentId);
      
      const newStatus = treatment.status === 'active' ? 'suspended' : 'active';
      
      if (newStatus === 'active') {
        await apiService.activateTreatment(parseInt(treatmentId));
      } else {
        await apiService.suspendTreatment(parseInt(treatmentId), 'Suspendido por el usuario');
      }
      
      // Actualizar estado local
      setTreatments(prev => prev.map(t => 
        t.id === treatmentId 
          ? { ...t, status: newStatus }
          : t
      ));
      
      console.log('✅ Estado del tratamiento actualizado');
      
    } catch (err: any) {
      console.error('❌ Error cambiando estado:', err);
      setError('Error cambiando el estado: ' + err.message);
    } finally {
      setTogglingStatus(null);
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'suspended':
        return <Badge variant="warning">Suspendido</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Desconocido'}</Badge>;
    }
  };

  // Formatear fecha
  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Fecha inválida';
    }
  };

  // Calcular días restantes
  const getDaysRemaining = (endDateInput: string | Date) => {
    try {
      const endDate = typeof endDateInput === 'string' ? new Date(endDateInput) : endDateInput;
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  // Recargar datos
  const handleRefresh = async () => {
    setError(null);
    await loadTreatments();
  };

  // Calcular estadísticas
  const stats = {
    active: treatments.filter(t => t.status === 'active').length,
    suspended: treatments.filter(t => t.status === 'suspended').length,
    completed: treatments.filter(t => t.status === 'completed').length,
    totalAlarms: treatments.reduce((total, t) => total + (t.alarms?.length || 0), 0)
  };

  if (loading) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="animate-spin" size={20} />
            <span>Cargando tratamientos...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tratamientos</h1>
            <p className="text-gray-600">Administra todos los tratamientos médicos</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center space-x-2"
            >
              <Bug size={16} />
              <span>Debug</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </Button>
            <Link to="/treatments/create">
              <Button className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Tratamiento</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Debug Info */}
        {showDebug && (
          <Card className="border-blue-200 bg-blue-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">Información de Debug</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runDebugTests}
                  className="flex items-center space-x-2"
                >
                  <Bug size={14} />
                  <span>Ejecutar Tests</span>
                </Button>
              </div>
              <div className="text-sm text-blue-700">
                <pre className="bg-blue-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify({
                    debugInfo,
                    treatmentsCount: treatments.length,
                    filteredCount: filteredTreatments.length,
                    currentError: error,
                    currentUser: currentUser?.name || 'No user'
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </Card>
        )}

        {/* Status Info */}
        <Card className="border-blue-200 bg-blue-50">
          <div className="text-sm text-blue-700">
            <strong>Estado actual:</strong> {treatments.length} tratamientos cargados 
            {currentUser && <span> | Usuario: {currentUser.name || currentUser.email}</span>}
            {debugInfo && <span> | API: {debugInfo.baseURL}</span>}
          </div>
        </Card>

        {/* Filtros y búsqueda */}
        <Card>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente o medicamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600">Tratamientos Activos</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.suspended}</p>
              <p className="text-sm text-gray-600">Suspendidos</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.totalAlarms}</p>
              <p className="text-sm text-gray-600">Total Alarmas</p>
            </div>
          </Card>
        </div>

        {/* Lista de tratamientos */}
        <Card title={`Tratamientos (${filteredTreatments.length})`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente y Medicamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alarmas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {treatment.patient?.name || 'Paciente desconocido'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {treatment.medication?.name || 'Medicamento'} {treatment.dosage}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {treatment.frequency}x al día
                      </div>
                      <div className="text-sm text-gray-500">
                        {treatment.dosage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {treatment.duration} días
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(treatment.startDate)} - {formatDate(treatment.endDate)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getDaysRemaining(treatment.endDate) > 0 
                          ? `${getDaysRemaining(treatment.endDate)} días restantes`
                          : 'Finalizado'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {treatment.alarms?.slice(0, 2).map((alarm, index) => (
                          <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock size={12} />
                            <span>{alarm.time}</span>
                            {alarm.isActive ? (
                              <span className="text-green-600">●</span>
                            ) : (
                              <span className="text-gray-400">●</span>
                            )}
                          </div>
                        )) || (
                          <div className="text-sm text-gray-500">Sin alarmas</div>
                        )}
                        {treatment.alarms && treatment.alarms.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{treatment.alarms.length - 2} más
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(treatment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/treatments/${treatment.id}`}>
                          <button className="text-blue-600 hover:text-blue-900 p-1" title="Ver detalles">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link to={`/treatments/${treatment.id}/edit`}>
                          <button className="text-green-600 hover:text-green-900 p-1" title="Editar">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleToggleStatus(treatment.id)}
                          disabled={togglingStatus === treatment.id}
                          className="text-purple-600 hover:text-purple-900 p-1 disabled:opacity-50"
                          title={treatment.status === 'active' ? 'Suspender' : 'Activar'}
                        >
                          {togglingStatus === treatment.id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : treatment.status === 'active' ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedTreatment(treatment);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTreatments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Pill size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron tratamientos
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter
                      ? 'Intenta con otros filtros de búsqueda'
                      : treatments.length === 0 
                        ? 'No hay tratamientos en la base de datos'
                        : 'Comienza creando tu primer tratamiento'
                    }
                  </p>
                  {!searchTerm && !statusFilter && treatments.length === 0 && (
                    <Link to="/treatments/create" className="mt-4 inline-block">
                      <Button>
                        <Plus size={16} className="mr-2" />
                        Crear Primer Tratamiento
                      </Button>
                    </Link>
                  )}
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
            setSelectedTreatment(null);
          }}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar el tratamiento de{' '}
              <span className="font-semibold">
                {selectedTreatment?.medication?.name}
              </span>{' '}
              para {selectedTreatment?.patient?.name}?
            </p>
            <p className="text-sm text-red-600">
              Esta acción no se puede deshacer y eliminará todas las alarmas y registros asociados.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTreatment(null);
                }}
                disabled={deletingTreatment}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedTreatment && handleDeleteTreatment(selectedTreatment.id)}
                disabled={deletingTreatment}
                className="flex items-center space-x-2"
              >
                {deletingTreatment && <RefreshCw size={16} className="animate-spin" />}
                <span>Eliminar Tratamiento</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};