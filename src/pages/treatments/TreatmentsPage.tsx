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
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

// Interfaz para los datos reales de la API
interface ApiTreatment {
  id: number;
  patient_id: number;
  medication_id: number;
  dosage: string;
  frequency: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  instructions: string;
  notes: string;
  status: string;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  patient_name: string | null;
  medication_name: string | null;
  medication_unit: string | null;
}

export const TreatmentsPage: React.FC = () => {
  // Estados principales
  const [treatments, setTreatments] = useState<ApiTreatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para datos relacionados
  const [patients, setPatients] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Estados de modales
  const [selectedTreatment, setSelectedTreatment] = useState<ApiTreatment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados de operaciones
  const [deletingTreatment, setDeletingTreatment] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<number | null>(null);

  // Usuario actual
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      
      // Cargar datos en paralelo
      await Promise.all([
        loadTreatments(),
        loadPatientsAndMedications()
      ]);
      
    } catch (err: any) {
      console.error('Error cargando datos iniciales:', err);
      setError(err.message || 'Error cargando los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadTreatments = async () => {
    try {
      console.log('🔄 Cargando tratamientos...');
      const data = await apiService.getUserTreatments();
      console.log('✅ Tratamientos cargados:', data);
      setTreatments(data || []);
    } catch (err: any) {
      console.error('❌ Error cargando tratamientos:', err);
      throw new Error('Error cargando los tratamientos: ' + err.message);
    }
  };

  const loadPatientsAndMedications = async () => {
    try {
      // Cargar pacientes y medicamentos para obtener nombres
      const [patientsData, medicationsData] = await Promise.all([
        apiService.getPatients().catch(() => []),
        apiService.getMedications().catch(() => [])
      ]);
      
      console.log('👥 Pacientes cargados:', patientsData);
      console.log('💊 Medicamentos cargados:', medicationsData);
      
      setPatients(patientsData);
      setMedications(medicationsData);
    } catch (err) {
      console.warn('⚠️ Error cargando pacientes/medicamentos:', err);
    }
  };

  const handleLogout = () => {
    apiService.logout();
  };

  // Funciones helper para obtener nombres
  const getPatientName = (patientId: number): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || `Paciente #${patientId}`;
  };

  const getMedicationName = (medicationId: number): string => {
    const medication = medications.find(m => m.id === medicationId);
    return medication?.name || `Medicamento #${medicationId}`;
  };

  // Filtrar tratamientos
  const filteredTreatments = treatments.filter(treatment => {
    const patientName = getPatientName(treatment.patient_id).toLowerCase();
    const medicationName = getMedicationName(treatment.medication_id).toLowerCase();
    
    const matchesSearch = 
      patientName.includes(searchTerm.toLowerCase()) ||
      medicationName.includes(searchTerm.toLowerCase()) ||
      treatment.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || treatment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Manejar eliminación de tratamiento
  const handleDeleteTreatment = async (treatmentId: number) => {
    if (!selectedTreatment) return;
    
    setDeletingTreatment(true);
    try {
      console.log('🗑️ Eliminando tratamiento:', treatmentId);
      
      await apiService.deleteTreatment(treatmentId);
      
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
  const handleToggleStatus = async (treatmentId: number) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    if (!treatment) return;
    
    setTogglingStatus(treatmentId);
    try {
      console.log('🔄 Cambiando estado del tratamiento:', treatmentId);
      
      const newStatus = treatment.status === 'active' ? 'suspended' : 'active';
      
      if (newStatus === 'active') {
        await apiService.activateTreatment(treatmentId);
      } else {
        await apiService.suspendTreatment(treatmentId, 'Suspendido por el usuario');
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
  const getDaysRemaining = (endDateString: string) => {
    try {
      const endDate = new Date(endDateString);
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
    await loadInitialData();
  };

  // Calcular estadísticas
  const stats = {
    active: treatments.filter(t => t.status === 'active').length,
    suspended: treatments.filter(t => t.status === 'suspended').length,
    completed: treatments.filter(t => t.status === 'completed').length,
    totalAlarms: 0 // No hay datos de alarmas en la API actual
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

        {/* Filtros y búsqueda */}
        <Card>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente, medicamento o dosis..."
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
              <p className="text-3xl font-bold text-purple-600">{treatments.length}</p>
              <p className="text-sm text-gray-600">Total Tratamientos</p>
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
                    Instrucciones
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
                            {getPatientName(treatment.patient_id)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {getMedicationName(treatment.medication_id)}
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
                        {treatment.duration_days} días
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(treatment.start_date)} - {formatDate(treatment.end_date)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getDaysRemaining(treatment.end_date) > 0 
                          ? `${getDaysRemaining(treatment.end_date)} días restantes`
                          : 'Finalizado'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {treatment.instructions}
                      </div>
                      {treatment.notes && treatment.notes !== 'Ninguna' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Notas: {treatment.notes}
                        </div>
                      )}
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
                {selectedTreatment && getMedicationName(selectedTreatment.medication_id)}
              </span>{' '}
              para {selectedTreatment && getPatientName(selectedTreatment.patient_id)}?
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