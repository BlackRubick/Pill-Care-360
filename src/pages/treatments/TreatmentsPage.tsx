import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Treatment } from '../../types';

// Datos simulados
const mockTreatments: Treatment[] = [
  {
    id: '1',
    patientId: '1',
    patient: {
      id: '1',
      name: 'María García López',
      email: 'maria.garcia@email.com',
      phone: '+52 961 123 4567',
      dateOfBirth: new Date('1975-03-15'),
      gender: 'female',
      address: 'Av. Central 123',
      emergencyContact: { name: 'José García', phone: '+52 961 765 4321', relationship: 'Esposo' },
      medicalHistory: ['Diabetes Tipo 2'],
      allergies: ['Penicilina'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    medicationId: '1',
    medication: {
      id: '1',
      name: 'Metformina',
      description: 'Medicamento para diabetes tipo 2',
      dosage: '500',
      unit: 'mg',
      instructions: 'Tomar con las comidas',
      sideEffects: ['Náuseas', 'Diarrea'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    dosage: '500mg',
    frequency: 2,
    duration: 30,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    instructions: 'Tomar con las comidas principales',
    alarms: [
      {
        id: '1',
        treatmentId: '1',
        time: '08:00',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        description: 'Desayuno'
      },
      {
        id: '2',
        treatmentId: '1',
        time: '20:00',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        description: 'Cena'
      }
    ],
    status: 'active',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    patientId: '2',
    patient: {
      id: '2',
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@email.com',
      phone: '+52 961 234 5678',
      dateOfBirth: new Date('1968-07-22'),
      gender: 'male',
      address: 'Calle 5 de Mayo 456',
      emergencyContact: { name: 'Ana Pérez', phone: '+52 961 876 5432', relationship: 'Esposa' },
      medicalHistory: ['Artritis Reumatoide'],
      allergies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    medicationId: '2',
    medication: {
      id: '2',
      name: 'Ibuprofeno',
      description: 'Antiinflamatorio no esteroideo',
      dosage: '400',
      unit: 'mg',
      instructions: 'Tomar después de las comidas',
      sideEffects: ['Irritación gástrica'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    dosage: '400mg',
    frequency: 3,
    duration: 14,
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-29'),
    instructions: 'Tomar después de las comidas para evitar irritación gástrica',
    alarms: [
      {
        id: '3',
        treatmentId: '2',
        time: '09:00',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        description: 'Después del desayuno'
      },
      {
        id: '4',
        treatmentId: '2',
        time: '15:00',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        description: 'Después del almuerzo'
      },
      {
        id: '5',
        treatmentId: '2',
        time: '21:00',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        description: 'Después de la cena'
      }
    ],
    status: 'active',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = 
      treatment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.medication?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || treatment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTreatment = (treatmentId: string) => {
    setTreatments(prev => prev.filter(t => t.id !== treatmentId));
    setShowDeleteModal(false);
    setSelectedTreatment(null);
  };

  const handleToggleStatus = (treatmentId: string) => {
    setTreatments(prev => prev.map(treatment => 
      treatment.id === treatmentId 
        ? { 
            ...treatment, 
            status: treatment.status === 'active' ? 'suspended' : 'active' 
          }
        : treatment
    ));
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tratamientos</h1>
            <p className="text-gray-600">Administra todos los tratamientos médicos</p>
          </div>
          <Link to="/treatments/create">
            <Button className="flex items-center space-x-2">
              <Plus size={16} />
              <span>Nuevo Tratamiento</span>
            </Button>
          </Link>
        </div>

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
              </select>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {treatments.filter(t => t.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Tratamientos Activos</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {treatments.filter(t => t.status === 'suspended').length}
              </p>
              <p className="text-sm text-gray-600">Suspendidos</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {treatments.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {treatments.reduce((total, t) => total + t.alarms.length, 0)}
              </p>
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
                            {treatment.patient?.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {treatment.medication?.name} {treatment.dosage}
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
                        {treatment.alarms.slice(0, 2).map((alarm, index) => (
                          <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock size={12} />
                            <span>{alarm.time}</span>
                            {alarm.isActive ? (
                              <span className="text-green-600">●</span>
                            ) : (
                              <span className="text-gray-400">●</span>
                            )}
                          </div>
                        ))}
                        {treatment.alarms.length > 2 && (
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
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title={treatment.status === 'active' ? 'Suspender' : 'Activar'}
                        >
                          {treatment.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
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
                      : 'Comienza creando tu primer tratamiento'
                    }
                  </p>
                  {!searchTerm && !statusFilter && (
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
              <span className="font-semibold">{selectedTreatment?.medication?.name}</span>{' '}
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
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedTreatment && handleDeleteTreatment(selectedTreatment.id)}
              >
                Eliminar Tratamiento
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};