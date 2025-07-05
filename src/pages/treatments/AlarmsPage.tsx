import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
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
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alarm } from '../../types';

// Datos simulados expandidos
const mockAlarms = [
  {
    id: '1',
    treatmentId: '1',
    patientName: 'María García López',
    medicationName: 'Metformina 500mg',
    time: '08:00',
    description: 'Desayuno',
    isActive: true,
    soundEnabled: true,
    visualEnabled: true,
    frequency: 'Diario',
    lastTriggered: new Date('2024-12-07T08:00:00'),
    nextTrigger: new Date('2024-12-08T08:00:00')
  },
  {
    id: '2',
    treatmentId: '1',
    patientName: 'María García López',
    medicationName: 'Metformina 500mg',
    time: '20:00',
    description: 'Cena',
    isActive: true,
    soundEnabled: true,
    visualEnabled: true,
    frequency: 'Diario',
    lastTriggered: new Date('2024-12-07T20:00:00'),
    nextTrigger: new Date('2024-12-08T20:00:00')
  },
  {
    id: '3',
    treatmentId: '2',
    patientName: 'Juan Carlos Pérez',
    medicationName: 'Ibuprofeno 400mg',
    time: '09:00',
    description: 'Después del desayuno',
    isActive: true,
    soundEnabled: false,
    visualEnabled: true,
    frequency: 'Diario',
    lastTriggered: new Date('2024-12-07T09:00:00'),
    nextTrigger: new Date('2024-12-08T09:00:00')
  },
  {
    id: '4',
    treatmentId: '2',
    patientName: 'Juan Carlos Pérez',
    medicationName: 'Ibuprofeno 400mg',
    time: '15:00',
    description: 'Después del almuerzo',
    isActive: false,
    soundEnabled: true,
    visualEnabled: true,
    frequency: 'Diario',
    lastTriggered: new Date('2024-12-07T15:00:00'),
    nextTrigger: new Date('2024-12-08T15:00:00')
  },
  {
    id: '5',
    treatmentId: '3',
    patientName: 'Ana López Mendoza',
    medicationName: 'Aspirina 100mg',
    time: '22:00',
    description: 'Antes de dormir',
    isActive: true,
    soundEnabled: true,
    visualEnabled: false,
    frequency: 'Diario',
    lastTriggered: new Date('2024-12-07T22:00:00'),
    nextTrigger: new Date('2024-12-08T22:00:00')
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const AlarmsPage: React.FC = () => {
  const [alarms, setAlarms] = useState(mockAlarms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedAlarm, setSelectedAlarm] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSearch = 
      alarm.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && alarm.isActive) ||
      (statusFilter === 'inactive' && !alarm.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isActive: !alarm.isActive }
        : alarm
    ));
  };

  const handleToggleSound = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, soundEnabled: !alarm.soundEnabled }
        : alarm
    ));
  };

  const handleEditAlarm = (alarm: any) => {
    setSelectedAlarm(alarm);
    setShowEditModal(true);
  };

  const handleDeleteAlarm = (alarmId: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
    setShowDeleteModal(false);
    setSelectedAlarm(null);
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNextAlarms = () => {
    const now = new Date();
    return alarms
      .filter(alarm => alarm.isActive && alarm.nextTrigger > now)
      .sort((a, b) => a.nextTrigger.getTime() - b.nextTrigger.getTime())
      .slice(0, 5);
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Alarmas</h1>
            <p className="text-gray-600">Configura y administra todas las alarmas de medicamentos</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/treatments">
              <Button variant="outline" className="flex items-center space-x-2">
                <Pill size={16} />
                <span>Ver Tratamientos</span>
              </Button>
            </Link>
            <Button className="flex items-center space-x-2">
              <Plus size={16} />
              <span>Nueva Alarma</span>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {alarms.filter(a => a.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Alarmas Activas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {alarms.filter(a => !a.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Alarmas Inactivas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {alarms.filter(a => a.soundEnabled).length}
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
                    <p className="text-xs text-gray-500">{alarm.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatTime(alarm.time)}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(alarm.nextTrigger)}</p>
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
                        <p className="text-xs text-gray-500 mt-1">{alarm.description}</p>
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
                          className={`p-1 rounded ${alarm.soundEnabled ? 'text-blue-600' : 'text-gray-400'}`}
                          title={alarm.soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
                        >
                          {alarm.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>
                        <div className={`w-2 h-2 rounded-full ${alarm.visualEnabled ? 'bg-green-500' : 'bg-gray-300'}`} 
                             title={alarm.visualEnabled ? 'Notificación visual activada' : 'Notificación visual desactivada'}>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={alarm.isActive ? 'success' : 'secondary'}>
                        {alarm.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleAlarm(alarm.id)}
                          className={`p-1 ${alarm.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                          title={alarm.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {alarm.isActive ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => handleEditAlarm(alarm)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAlarm(alarm);
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

            {filteredAlarms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron alarmas
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter
                      ? 'Intenta con otros filtros de búsqueda'
                      : 'Las alarmas se crean automáticamente con los tratamientos'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

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
              a las {selectedAlarm?.time} para {selectedAlarm?.patientName}?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAlarm(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedAlarm && handleDeleteAlarm(selectedAlarm.id)}
              >
                Eliminar Alarma
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};