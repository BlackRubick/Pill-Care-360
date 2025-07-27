import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { CreateAlarmModal, EditAlarmModal } from '../../components/alarms/AlarmModals';
import apiService from '../../services/api'; // Usar tu apiService existente
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock,
  Bell,
  BellOff,
  User,
  Pill,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  Calendar,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlarmData {
  id: number;
  treatment_id: number;
  patientName: string;
  medicationName: string;
  time: string;
  description: string;
  is_active: boolean;
  sound_enabled: boolean;
  visual_enabled: boolean;
  frequency: string;
  dosage?: string;
  lastTriggered?: Date;
  nextTrigger?: Date;
}

interface TreatmentWithDetails {
  id: number;
  patient_id: number;
  medication_id: number;
  patient_name?: string;
  medication_name?: string;
  dosage: string;
  frequency: number;
  status: string;
  alarms?: any[];
}

export const AlarmsPage: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [treatments, setTreatments] = useState<TreatmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Usuario real desde el localStorage/API
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar usuario actual
  const loadCurrentUser = async () => {
    try {
      setLoadingUser(true);
      console.log('👤 Cargando usuario actual...');
      
      // Primero intentar obtener del localStorage
      const storedUser = apiService.getStoredUser();
      console.log('📱 Usuario desde localStorage:', storedUser);
      
      if (storedUser) {
        setCurrentUser(storedUser);
        
        // Opcionalmente, verificar con la API que el usuario sigue válido
        try {
          const currentApiUser = await apiService.getCurrentUser();
          console.log('🌐 Usuario verificado con API:', currentApiUser);
          setCurrentUser(currentApiUser);
        } catch (apiError) {
          console.warn('⚠️ No se pudo verificar usuario con API, usando datos locales:', apiError);
          // Mantener el usuario del localStorage si falla la verificación
        }
      } else {
        // Si no hay usuario en localStorage, intentar obtener de la API
        console.log('🔍 No hay usuario en localStorage, obteniendo de API...');
        const apiUser = await apiService.getCurrentUser();
        console.log('✅ Usuario obtenido de API:', apiUser);
        setCurrentUser(apiUser);
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando usuario:', err);
      
      // Si falla todo, usar un usuario por defecto o redirigir al login
      console.warn('⚠️ Usando usuario por defecto debido a error de autenticación');
      setCurrentUser({
        id: 0,
        name: 'Usuario Desconocido',
        email: 'usuario@ejemplo.com',
        role: 'caregiver'
      });
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...');
    apiService.logout();
  };

  // Cargar alarmas desde la API usando tu servicio existente
  const loadAlarms = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando alarmas...');

      // Cargar usuario primero
      await loadCurrentUser();

      const userTreatments = await apiService.getUserTreatments();
      console.log('📋 Tratamientos obtenidos:', userTreatments);
      
      setTreatments(userTreatments);

      if (userTreatments.length === 0) {
        console.log('ℹ️ No hay tratamientos para mostrar alarmas');
        setAlarms([]);
        toast.info('No tienes tratamientos activos con alarmas');
        return;
      }

      const allAlarms: AlarmData[] = [];
      
      for (const treatment of userTreatments) {
        try {
          console.log(`⏰ Obteniendo alarmas para tratamiento ${treatment.id}`);
          const treatmentAlarms = await apiService.getTreatmentAlarms(treatment.id);
          
          // Convertir alarmas de la API al formato de la interfaz
          const formattedAlarms = treatmentAlarms.map(alarm => ({
            id: alarm.id,
            treatment_id: alarm.treatment_id,
            patientName: treatment.patient_name || `Paciente #${treatment.patient_id}`,
            medicationName: treatment.medication_name 
              ? `${treatment.medication_name} ${treatment.dosage}`.trim()
              : `Medicamento #${treatment.medication_id}`,
            time: alarm.time,
            description: alarm.description || '',
            is_active: alarm.is_active ?? true,
            sound_enabled: alarm.sound_enabled ?? true,
            visual_enabled: alarm.visual_enabled ?? true,
            frequency: `${treatment.frequency}x al día`,
            dosage: treatment.dosage,
            nextTrigger: calculateNextTrigger(alarm.time, alarm.is_active)
          }));

          allAlarms.push(...formattedAlarms);
          console.log(`✅ ${formattedAlarms.length} alarmas agregadas para tratamiento ${treatment.id}`);
          
        } catch (alarmError) {
          console.warn(`⚠️ Error obteniendo alarmas del tratamiento ${treatment.id}:`, alarmError);
          // Continuar con los demás tratamientos
        }
      }

      setAlarms(allAlarms);
      console.log(`🎯 Total de alarmas cargadas: ${allAlarms.length}`);
      
      if (allAlarms.length > 0) {
        toast.success(`${allAlarms.length} alarmas cargadas`);
      } else {
        toast.info('No se encontraron alarmas configuradas');
      }

    } catch (error: any) {
      console.error('❌ Error cargando alarmas:', error);
      toast.error(error.message || 'Error al cargar las alarmas');
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular próxima activación de alarma
  const calculateNextTrigger = (time: string, isActive: boolean): Date | undefined => {
    if (!isActive) return undefined;
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      
      const nextTrigger = new Date();
      nextTrigger.setHours(hours, minutes, 0, 0);
      
      // Si ya pasó hoy, programar para mañana
      if (nextTrigger <= new Date()) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }
      
      return nextTrigger;
    } catch (error) {
      console.warn('Error calculando próxima alarma:', error);
      return undefined;
    }
  };

  useEffect(() => {
    loadAlarms();
  }, []);

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSearch = 
      alarm.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && alarm.is_active) ||
      (statusFilter === 'inactive' && !alarm.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateAlarm = async (alarmData: any) => {
    try {
      setActionLoading('create');
      console.log('🆕 Creando nueva alarma:', alarmData);
      
      const newAlarmRequest = {
        time: alarmData.time,
        is_active: alarmData.isActive ?? true,
        sound_enabled: alarmData.soundEnabled ?? true,
        visual_enabled: alarmData.visualEnabled ?? true,
        description: alarmData.description || ''
      };

      await apiService.createTreatmentAlarm(alarmData.treatmentId, newAlarmRequest);
      toast.success('Alarma creada exitosamente');
      
      // Recargar alarmas
      await loadAlarms();
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('❌ Error creando alarma:', error);
      toast.error(error.message || 'Error al crear la alarma');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditAlarm = async (alarmData: AlarmData) => {
    try {
      setActionLoading('edit');
      console.log('✏️ Editando alarma:', alarmData);
      
      const updateRequest = {
        time: alarmData.time,
        is_active: alarmData.is_active,
        sound_enabled: alarmData.sound_enabled,
        visual_enabled: alarmData.visual_enabled,
        description: alarmData.description || ''
      };

      await apiService.updateTreatmentAlarm(alarmData.treatment_id, alarmData.id, updateRequest);
      toast.success('Alarma actualizada exitosamente');
      
      // Recargar alarmas
      await loadAlarms();
      setShowEditModal(false);
      setSelectedAlarm(null);
    } catch (error: any) {
      console.error('❌ Error actualizando alarma:', error);
      toast.error(error.message || 'Error al actualizar la alarma');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAlarm = async (alarmId: number) => {
    try {
      setActionLoading(`toggle-${alarmId}`);
      
      const alarm = alarms.find(a => a.id === alarmId);
      if (!alarm) {
        toast.error('Alarma no encontrada');
        return;
      }

      console.log(`🔄 Cambiando estado de alarma ${alarmId}`);
      
      await apiService.updateTreatmentAlarm(alarm.treatment_id, alarmId, {
        is_active: !alarm.is_active
      });

      // Actualizar estado local inmediatamente
      setAlarms(prev => prev.map(a => 
        a.id === alarmId 
          ? { ...a, is_active: !a.is_active, nextTrigger: calculateNextTrigger(a.time, !a.is_active) }
          : a
      ));

      toast.success(`Alarma ${!alarm.is_active ? 'activada' : 'desactivada'}`);
    } catch (error: any) {
      console.error('❌ Error cambiando estado de alarma:', error);
      toast.error(error.message || 'Error al cambiar estado de la alarma');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSound = async (alarmId: number) => {
    try {
      setActionLoading(`sound-${alarmId}`);
      
      const alarm = alarms.find(a => a.id === alarmId);
      if (!alarm) {
        toast.error('Alarma no encontrada');
        return;
      }

      console.log(`🔊 Cambiando sonido de alarma ${alarmId}`);

      await apiService.updateTreatmentAlarm(alarm.treatment_id, alarmId, {
        sound_enabled: !alarm.sound_enabled
      });

      // Actualizar estado local
      setAlarms(prev => prev.map(a => 
        a.id === alarmId 
          ? { ...a, sound_enabled: !a.sound_enabled }
          : a
      ));

      toast.success(`Sonido ${!alarm.sound_enabled ? 'activado' : 'desactivado'}`);
    } catch (error: any) {
      console.error('❌ Error cambiando sonido:', error);
      toast.error(error.message || 'Error al cambiar configuración de sonido');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (alarm: AlarmData) => {
    setSelectedAlarm(alarm);
    setShowEditModal(true);
  };

  const handleDeleteAlarm = async (alarmId: number) => {
    try {
      setActionLoading('delete');
      
      const alarm = alarms.find(a => a.id === alarmId);
      if (!alarm) {
        toast.error('Alarma no encontrada');
        return;
      }

      console.log(`🗑️ Eliminando alarma ${alarmId}`);

      await apiService.deleteTreatmentAlarm(alarm.treatment_id, alarmId);
      
      // Actualizar estado local
      setAlarms(prev => prev.filter(a => a.id !== alarmId));
      
      toast.success('Alarma eliminada exitosamente');
      setShowDeleteModal(false);
      setSelectedAlarm(null);
    } catch (error: any) {
      console.error('❌ Error eliminando alarma:', error);
      toast.error(error.message || 'Error al eliminar la alarma');
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${displayHour}:${minute} ${ampm}`;
    } catch (error) {
      return time;
    }
  };

  const formatDateTime = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getNextAlarms = () => {
    const now = new Date();
    return alarms
      .filter(alarm => alarm.is_active && alarm.nextTrigger && alarm.nextTrigger > now)
      .sort((a, b) => (a.nextTrigger?.getTime() || 0) - (b.nextTrigger?.getTime() || 0))
      .slice(0, 5);
  };

  // Mostrar loading mientras se carga el usuario y alarmas
  if (loading || loadingUser) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">
              {loadingUser ? 'Cargando información del usuario...' : 'Cargando alarmas...'}
            </p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Alarmas</h1>
            <p className="text-gray-600">
              Configura y administra todas las alarmas de medicamentos
              {/* Mostrar info del usuario actual */}
              {currentUser && (
                <span className="text-sm text-gray-500 ml-2">
                  • Usuario: {currentUser.name} ({currentUser.role})
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/treatments">
              <Button variant="outline" className="flex items-center space-x-2">
                <Pill size={16} />
                <span>Ver Tratamientos</span>
              </Button>
            </Link>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setShowCreateModal(true)}
              disabled={actionLoading === 'create'}
            >
              {actionLoading === 'create' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              <span>Nueva Alarma</span>
            </Button>
          </div>
        </div>

        {/* Información del usuario actual */}
        {currentUser && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-green-900">
                  Sesión activa: {currentUser.name}
                </p>
                <p className="text-sm text-green-700">
                  {currentUser.email} • Rol: {currentUser.role}
                  {currentUser.id && ` • ID: ${currentUser.id}`}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {alarms.filter(a => a.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Alarmas Activas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {alarms.filter(a => !a.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Alarmas Inactivas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {alarms.filter(a => a.sound_enabled).length}
              </p>
              <p className="text-sm text-gray-600">Con Sonido</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {getNextAlarms().length}
              </p>
              <p className="text-sm text-gray-600">Próximas 24h</p>
            </div>
          </Card>
        </div>

        {/* Próximas alarmas */}
        <Card title="Próximas Alarmas" className="h-fit">
          <div className="space-y-3">
            {getNextAlarms().map((alarm) => (
              <div key={alarm.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alarm.patientName}</p>
                    <p className="text-sm text-gray-600">{alarm.medicationName}</p>
                    {alarm.description && (
                      <p className="text-xs text-gray-500">{alarm.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatTime(alarm.time)}</p>
                  <p className="text-xs text-gray-500">
                    {alarm.nextTrigger && formatDateTime(alarm.nextTrigger)}
                  </p>
                </div>
              </div>
            ))}
            {getNextAlarms().length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay alarmas programadas para las próximas 24 horas</p>
            )}
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
                  placeholder="Buscar por paciente, medicamento o descripción..."
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
                <option value="">Todas las alarmas</option>
                <option value="active">Solo activas</option>
                <option value="inactive">Solo inactivas</option>
              </select>
              <Button
                variant="outline"
                onClick={loadAlarms}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                <span>Actualizar</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de alarmas */}
        <Card title={`Alarmas (${filteredAlarms.length})`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente y Medicamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configuración
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
                {filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {alarm.patientName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {alarm.medicationName}
                          </span>
                        </div>
                        {alarm.description && (
                          <p className="text-xs text-gray-500 mt-1">{alarm.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatTime(alarm.time)}</p>
                          <p className="text-xs text-gray-500">{alarm.frequency}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleSound(alarm.id)}
                          disabled={actionLoading === `sound-${alarm.id}`}
                          className={`p-1 rounded ${alarm.sound_enabled ? 'text-blue-600' : 'text-gray-400'} ${
                            actionLoading === `sound-${alarm.id}` ? 'opacity-50' : 'hover:bg-gray-100'
                          }`}
                          title={alarm.sound_enabled ? 'Sonido activado' : 'Sonido desactivado'}
                        >
                          {actionLoading === `sound-${alarm.id}` ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : alarm.sound_enabled ? (
                            <Volume2 size={16} />
                          ) : (
                            <VolumeX size={16} />
                          )}
                        </button>
                        <div className={`w-2 h-2 rounded-full ${alarm.visual_enabled ? 'bg-green-500' : 'bg-gray-300'}`} 
                             title={alarm.visual_enabled ? 'Notificación visual activada' : 'Notificación visual desactivada'}>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={alarm.is_active ? 'success' : 'secondary'}>
                        {alarm.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleAlarm(alarm.id)}
                          disabled={actionLoading === `toggle-${alarm.id}`}
                          className={`p-1 ${alarm.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} ${
                            actionLoading === `toggle-${alarm.id}` ? 'opacity-50' : ''
                          }`}
                          title={alarm.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {actionLoading === `toggle-${alarm.id}` ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : alarm.is_active ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(alarm)}
                          disabled={!!actionLoading}
                          className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAlarm(alarm);
                            setShowDeleteModal(true);
                          }}
                          disabled={!!actionLoading}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
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

            {filteredAlarms.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron alarmas
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter
                      ? 'Intenta con otros filtros de búsqueda'
                      : treatments.length === 0 
                        ? 'Primero necesitas crear tratamientos para configurar alarmas'
                        : 'Las alarmas se pueden crear para los tratamientos existentes'
                    }
                  </p>
                  {treatments.length > 0 && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={16} />
                      <span>Crear Primera Alarma</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Modal de crear alarma */}
        <CreateAlarmModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAlarm}
          loading={actionLoading === 'create'}
          treatments={treatments}
        />

        {/* Modal de editar alarma */}
        <EditAlarmModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAlarm(null);
          }}
          onSave={handleEditAlarm}
          alarm={selectedAlarm}
          loading={actionLoading === 'edit'}
        />

        {/* Modal de eliminación */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAlarm(null);
          }}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar la alarma de{' '}
              <span className="font-semibold">{selectedAlarm?.medicationName}</span>{' '}
              a las <span className="font-semibold">{selectedAlarm?.time}</span> para {selectedAlarm?.patientName}?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                Esta acción no se puede deshacer. La alarma se eliminará permanentemente.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAlarm(null);
                }}
                disabled={actionLoading === 'delete'}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedAlarm && handleDeleteAlarm(selectedAlarm.id)}
                disabled={actionLoading === 'delete'}
                className="flex items-center space-x-2"
              >
                {actionLoading === 'delete' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Eliminar Alarma</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};