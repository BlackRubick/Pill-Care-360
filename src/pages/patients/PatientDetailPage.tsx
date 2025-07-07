import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  User,
  AlertTriangle,
  Heart,
  Activity,
  Pill,
  Clock,
  TrendingUp,
  Plus
} from 'lucide-react';

// Datos simulados
const mockPatient = {
  id: '1',
  name: 'María García López',
  email: 'maria.garcia@email.com',
  phone: '+52 961 123 4567',
  dateOfBirth: new Date('1975-03-15'),
  gender: 'female',
  address: 'Av. Central 123, Col. Centro, Tuxtla Gutiérrez, Chiapas',
  emergencyContact: {
    name: 'José García',
    phone: '+52 961 765 4321',
    relationship: 'Esposo'
  },
  medicalHistory: ['Diabetes Tipo 2', 'Hipertensión', 'Obesidad Grado I'],
  allergies: ['Penicilina', 'Mariscos'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
};

const mockTreatments = [
  {
    id: '1',
    medicationName: 'Metformina 500mg',
    dosage: '500mg',
    frequency: 2,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    compliance: 94,
    instructions: 'Tomar con las comidas principales',
    nextDose: new Date('2024-12-08T08:00:00')
  },
  {
    id: '2',
    medicationName: 'Enalapril 10mg',
    dosage: '10mg',
    frequency: 1,
    startDate: new Date('2024-11-15'),
    endDate: new Date('2025-02-15'),
    status: 'active',
    compliance: 89,
    instructions: 'Tomar en ayunas por la mañana',
    nextDose: new Date('2024-12-08T07:00:00')
  }
];

const mockRecentActivity = [
  {
    id: '1',
    action: 'Dosis tomada',
    medication: 'Metformina 500mg',
    time: new Date('2024-12-07T08:05:00'),
    status: 'completed',
    notes: 'Tomada con el desayuno'
  },
  {
    id: '2',
    action: 'Dosis tomada',
    medication: 'Enalapril 10mg',
    time: new Date('2024-12-07T07:00:00'),
    status: 'completed',
    notes: 'Tomada en ayunas'
  },
  {
    id: '3',
    action: 'Cita médica',
    medication: 'Control general',
    time: new Date('2024-12-05T10:00:00'),
    status: 'completed',
    notes: 'Revisión mensual, valores estables'
  }
];

const mockVitalSigns = [
  { date: '2024-12-07', bloodPressure: '125/80', weight: 68.5, bloodSugar: 110 },
  { date: '2024-12-01', bloodPressure: '128/82', weight: 69.0, bloodSugar: 115 },
  { date: '2024-11-15', bloodPressure: '130/85', weight: 69.2, bloodSugar: 120 }
];

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    console.log('Logging out...');
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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallCompliance = Math.round(
    mockTreatments.reduce((sum, t) => sum + t.compliance, 0) / mockTreatments.length
  );

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: User },
    { id: 'treatments', label: 'Tratamientos', icon: Pill },
    { id: 'history', label: 'Historial', icon: Clock },
    { id: 'vitals', label: 'Signos Vitales', icon: Activity }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Información personal */}
      <Card title="Información Personal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                <p className="text-gray-900">{mockPatient.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Edad</p>
                <p className="text-gray-900">
                  {calculateAge(mockPatient.dateOfBirth)} años 
                  ({formatDate(mockPatient.dateOfBirth)})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-gray-400 flex items-center justify-center">
                ♀/♂
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Género</p>
                <p className="text-gray-900 capitalize">
                  {mockPatient.gender === 'female' ? 'Femenino' : 
                   mockPatient.gender === 'male' ? 'Masculino' : 'Otro'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                <p className="text-gray-900">{mockPatient.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-gray-900">{mockPatient.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="text-gray-900">{mockPatient.address}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contacto de emergencia */}
      <Card title="Contacto de Emergencia">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Nombre</p>
            <p className="text-gray-900">{mockPatient.emergencyContact.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Teléfono</p>
            <p className="text-gray-900">{mockPatient.emergencyContact.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Relación</p>
            <p className="text-gray-900">{mockPatient.emergencyContact.relationship}</p>
          </div>
        </div>
      </Card>

      {/* Información médica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Historial Médico">
          <div className="space-y-3">
            {mockPatient.medicalHistory.length > 0 ? (
              mockPatient.medicalHistory.map((condition, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">{condition}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Sin condiciones médicas registradas</p>
            )}
          </div>
        </Card>

        <Card title="Alergias">
          <div className="space-y-3">
            {mockPatient.allergies.length > 0 ? (
              mockPatient.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-red-800">{allergy}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Sin alergias registradas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Estadísticas de cumplimiento */}
      <Card title="Resumen de Cumplimiento">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className={`text-3xl font-bold ${getComplianceColor(overallCompliance)}`}>
              {overallCompliance}%
            </p>
            <p className="text-sm text-gray-600">Cumplimiento General</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{mockTreatments.length}</p>
            <p className="text-sm text-gray-600">Tratamientos Activos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {mockTreatments.filter(t => t.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">En Curso</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {mockTreatments.reduce((sum, t) => sum + t.frequency, 0)}
            </p>
            <p className="text-sm text-gray-600">Dosis Diarias</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTreatmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tratamientos Activos</h3>
        <Link to={`/treatments/create?patientId=${id}`}>
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Nuevo Tratamiento</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockTreatments.map((treatment) => (
          <Card key={treatment.id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {treatment.medicationName}
                  </h4>
                  {getStatusBadge(treatment.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dosis</p>
                    <p className="text-gray-900">{treatment.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Frecuencia</p>
                    <p className="text-gray-900">{treatment.frequency}x al día</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cumplimiento</p>
                    <p className={`font-semibold ${getComplianceColor(treatment.compliance)}`}>
                      {treatment.compliance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Próxima Dosis</p>
                    <p className="text-gray-900">{formatDateTime(treatment.nextDose)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Duración del Tratamiento</p>
                  <p className="text-gray-900">
                    {formatDate(treatment.startDate)} - {formatDate(treatment.endDate)}
                  </p>
                </div>

                {treatment.instructions && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{treatment.instructions}</p>
                  </div>
                )}
              </div>

              <div className="ml-6">
                <Link to={`/treatments/${treatment.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
      
      <div className="space-y-4">
        {mockRecentActivity.map((activity) => (
          <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{activity.action}</h4>
                  <p className="text-sm text-gray-600">{activity.medication}</p>
                  {activity.notes && (
                    <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{formatDateTime(activity.time)}</p>
                <Badge variant={activity.status === 'completed' ? 'success' : 'secondary'}>
                  {activity.status === 'completed' ? 'Completado' : activity.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVitalsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Signos Vitales Recientes</h3>
      
      <div className="space-y-4">
        {mockVitalSigns.map((vital, index) => (
          <Card key={index}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha</p>
                <p className="text-gray-900">{vital.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Presión Arterial</p>
                <p className="text-gray-900">{vital.bloodPressure} mmHg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Peso</p>
                <p className="text-gray-900">{vital.weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Glucosa</p>
                <p className="text-gray-900">{vital.bloodSugar} mg/dL</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/patients">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver a Pacientes</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockPatient.name}</h1>
              <p className="text-gray-600">
                {calculateAge(mockPatient.dateOfBirth)} años • 
                {mockPatient.gender === 'female' ? ' Femenino' : 
                 mockPatient.gender === 'male' ? ' Masculino' : ' Otro'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to={`/patients/${id}/edit`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit size={16} />
                <span>Editar Paciente</span>
              </Button>
            </Link>
            <Link to={`/treatments/create?patientId=${id}`}>
              <Button className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Tratamiento</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'treatments' && renderTreatmentsTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'vitals' && renderVitalsTab()}
          </div>
        </Card>
      </div>
    </Layout>
  );
};