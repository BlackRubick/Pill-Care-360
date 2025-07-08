import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar,
  Loader,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import type { Patient } from '../../types';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  // Cargar usuario y pacientes al montar el componente
  useEffect(() => {
    const currentUser = apiService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    }
    loadPatients();
  }, []);

  // Filtrar pacientes cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }

    if (genderFilter) {
      filtered = filtered.filter(patient => patient.gender === genderFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, genderFilter]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📋 Cargando pacientes desde la API...');
      
      const patientsData = await apiService.getPatients();
      console.log('✅ Pacientes cargados:', patientsData);
      
      // Transformar los datos de la API al formato esperado
      const transformedPatients = patientsData.map((patient: any) => ({
        id: patient.id.toString(),
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: new Date(patient.date_of_birth),
        gender: patient.gender,
        address: patient.address,
        emergencyContact: patient.emergency_contact || {
          name: '',
          phone: '',
          relationship: ''
        },
        medicalHistory: patient.medical_history || [],
        allergies: patient.allergies || [],
        createdAt: new Date(patient.created_at),
        updatedAt: new Date(patient.updated_at || patient.created_at)
      }));
      
      setPatients(transformedPatients);
    } catch (error: any) {
      console.error('❌ Error cargando pacientes:', error);
      setError(`Error al cargar pacientes: ${error.message}`);
      
      // Fallback con datos vacíos en caso de error
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!selectedPatient) return;

    try {
      setIsDeleting(true);
      console.log('🗑️ Eliminando paciente:', patientId);
      
      await apiService.deletePatient(Number(patientId));
      
      // Actualizar la lista local
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setShowDeleteModal(false);
      setSelectedPatient(null);
      
      console.log('✅ Paciente eliminado exitosamente');
    } catch (error: any) {
      console.error('❌ Error eliminando paciente:', error);
      setError(`Error al eliminar paciente: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleRefresh = () => {
    loadPatients();
  };

  if (isLoading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando pacientes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
            <p className="text-gray-600">Administra la información de todos los pacientes</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </Button>
            <Link to="/patients/create">
              <Button className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Paciente</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Filtros y búsqueda */}
        <Card>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select 
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los géneros</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
              <p className="text-sm text-gray-600">Total de Pacientes</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {patients.filter(p => p.gender === 'female').length}
              </p>
              <p className="text-sm text-gray-600">Pacientes Femeninas</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {patients.filter(p => p.gender === 'male').length}
              </p>
              <p className="text-sm text-gray-600">Pacientes Masculinos</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {patients.filter(p => p.medicalHistory.length > 0).length}
              </p>
              <p className="text-sm text-gray-600">Con Condiciones Médicas</p>
            </div>
          </Card>
        </div>

        {/* Lista de pacientes */}
        <Card title={`Pacientes (${filteredPatients.length})`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información de Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad/Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condiciones Médicas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>

                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-2" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2" />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateAge(patient.dateOfBirth)} años
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {patient.gender === 'male' ? 'Masculino' : 
                         patient.gender === 'female' ? 'Femenino' : 'Otro'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {patient.medicalHistory.length > 0 ? (
                          <>
                            {patient.medicalHistory.slice(0, 2).map((condition, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-1 mb-1"
                              >
                                {condition}
                              </span>
                            ))}
                            {patient.medicalHistory.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{patient.medicalHistory.length - 2} más
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Sin condiciones registradas</span>
                        )}
                        
                        {patient.allergies.length > 0 && (
                          <div className="mt-1">
                            {patient.allergies.slice(0, 1).map((allergy, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mr-1"
                              >
                                🚨 {allergy}
                              </span>
                            ))}
                            {patient.allergies.length > 1 && (
                              <span className="text-xs text-gray-500">
                                +{patient.allergies.length - 1} alergias más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.createdAt.toLocaleDateString('es-MX')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.createdAt.toLocaleTimeString('es-MX', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/patients/${patient.id}`}>
                          <button 
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link to={`/patients/${patient.id}/edit`}>
                          <button 
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Editar paciente"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar paciente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {searchTerm || genderFilter ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || genderFilter
                      ? 'Intenta con otros términos de búsqueda o filtros'
                      : 'Comienza agregando tu primer paciente'
                    }
                  </p>
                  {!searchTerm && !genderFilter && (
                    <Link to="/patients/create" className="mt-4 inline-block">
                      <Button>
                        <Plus size={16} className="mr-2" />
                        Agregar Primer Paciente
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
            setSelectedPatient(null);
          }}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar al paciente{' '}
              <span className="font-semibold">{selectedPatient?.name}</span>?
            </p>
            <p className="text-sm text-red-600">
              Esta acción no se puede deshacer y eliminará todos los tratamientos asociados.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPatient(null);
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedPatient && handleDeletePatient(selectedPatient.id)}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar Paciente'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};