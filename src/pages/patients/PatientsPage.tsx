import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Patient } from '../../types';

// Datos simulados
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    phone: '+52 961 123 4567',
    dateOfBirth: new Date('1975-03-15'),
    gender: 'female',
    address: 'Av. Central 123, Col. Centro, Tuxtla Gutiérrez',
    emergencyContact: {
      name: 'José García',
      phone: '+52 961 765 4321',
      relationship: 'Esposo'
    },
    medicalHistory: ['Diabetes Tipo 2', 'Hipertensión'],
    allergies: ['Penicilina'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    phone: '+52 961 234 5678',
    dateOfBirth: new Date('1968-07-22'),
    gender: 'male',
    address: 'Calle 5 de Mayo 456, Col. Revolución, Tuxtla Gutiérrez',
    emergencyContact: {
      name: 'Ana Pérez',
      phone: '+52 961 876 5432',
      relationship: 'Esposa'
    },
    medicalHistory: ['Artritis Reumatoide'],
    allergies: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Ana López Mendoza',
    email: 'ana.lopez@email.com',
    phone: '+52 961 345 6789',
    dateOfBirth: new Date('1982-11-08'),
    gender: 'female',
    address: 'Blvd. Belisario Domínguez 789, Col. Moctezuma, Tuxtla Gutiérrez',
    emergencyContact: {
      name: 'Carlos López',
      phone: '+52 961 987 6543',
      relationship: 'Hermano'
    },
    medicalHistory: ['Asma'],
    allergies: ['Aspirina', 'Mariscos'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    setShowDeleteModal(false);
    setSelectedPatient(null);
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

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
            <p className="text-gray-600">Administra la información de todos los pacientes</p>
          </div>
          <Link to="/patients/create">
            <Button className="flex items-center space-x-2">
              <Plus size={16} />
              <span>Nuevo Paciente</span>
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
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Todos los géneros</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <div className="text-sm text-gray-500">
                          ID: {patient.id}
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
                          patient.medicalHistory.slice(0, 2).map((condition, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-1"
                            >
                              {condition}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Sin condiciones registradas</span>
                        )}
                        {patient.medicalHistory.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{patient.medicalHistory.length - 2} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/patients/${patient.id}`}>
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link to={`/patients/${patient.id}/edit`}>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron pacientes
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Intenta con otros términos de búsqueda'
                      : 'Comienza agregando tu primer paciente'
                    }
                  </p>
                  {!searchTerm && (
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
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => selectedPatient && handleDeletePatient(selectedPatient.id)}
              >
                Eliminar Paciente
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};