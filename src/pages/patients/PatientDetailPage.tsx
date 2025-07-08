import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
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
  Plus,
  Loader,
  RefreshCw
} from 'lucide-react';
import apiService from '../../services/api';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  caregiverId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Treatment {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: number;
  startDate: Date;
  endDate?: Date;
  status: string;
  compliance?: number;
  instructions?: string;
  nextDose?: Date;
}

interface Activity {
  id: string;
  action: string;
  medication: string;
  time: Date;
  status: string;
  notes?: string;
}

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = apiService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/auth/login');
      return;
    }

    if (id) {
      loadPatientData();
    }
  }, [id, navigate]);

  const loadPatientData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📋 Cargando datos del paciente:', id);

      // Verificar que el usuario esté autenticado
      const currentUser = apiService.getStoredUser();
      if (!currentUser) {
        setError('Usuario no autenticado. Redirigiendo al login...');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }

      // Cargar datos del paciente usando el método actualizado
      const patientData = await apiService.getPatient(Number(id));
      console.log('✅ Datos del paciente cargados:', patientData);

      // Verificar permisos basado en el rol
      if (currentUser.role === 'admin' || currentUser.role === 'administrator') {
        // Los administradores pueden ver todos los pacientes
        console.log('✅ Usuario administrador: acceso completo a todos los pacientes');
      } else if (patientData.caregiver_id !== currentUser.id) {
        // Los usuarios normales solo pueden ver sus pacientes asignados
        setError('No tienes permisos para ver este paciente.');
        return;
      }

      // Transformar datos del paciente
      const transformedPatient: Patient = {
        id: patientData.id.toString(),
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        dateOfBirth: new Date(patientData.date_of_birth),
        gender: patientData.gender,
        address: patientData.address,
        emergencyContact: patientData.emergency_contact || {
          name: '',
          phone: '',
          relationship: ''
        },
        medicalHistory: patientData.medical_history || [],
        allergies: patientData.allergies || [],
        caregiverId: patientData.caregiver_id,
        createdAt: new Date(patientData.created_at),
        updatedAt: new Date(patientData.updated_at || patientData.created_at)
      };

      setPatient(transformedPatient);

      // Cargar tratamientos del paciente
      try {
        // Intentar con el endpoint específico para tratamientos activos
        let treatmentsData;
        try {
          treatmentsData = await apiService.getPatientTreatments(Number(id));
        } catch (treatmentError) {
          console.log('ℹ️ Endpoint de tratamientos activos no disponible, intentando endpoint general...');
          // Si no hay endpoint específico, intentar obtener todos los tratamientos del paciente
          try {
            treatmentsData = await apiService.getAllPatientTreatments(Number(id));
          } catch (allTreatmentError) {
            console.log('ℹ️ No hay endpoints específicos de tratamientos para este paciente');
            treatmentsData = [];
          }
        }
        
        console.log('✅ Tratamientos cargados:', treatmentsData);

        if (!treatmentsData || treatmentsData.length === 0) {
          console.log('ℹ️ No se encontraron tratamientos para este paciente');
          setTreatments([]);
        } else {
          const transformedTreatments: Treatment[] = treatmentsData.map((treatment: any) => ({
            id: treatment.id.toString(),
            medicationName: treatment.medication_name || treatment.medication?.name || 'Medicamento',
            dosage: treatment.dosage || 'No especificado',
            frequency: treatment.frequency || 1,
            startDate: new Date(treatment.start_date),
            endDate: treatment.end_date ? new Date(treatment.end_date) : undefined,
            status: treatment.status || 'active',
            compliance: treatment.compliance || Math.floor(Math.random() * 20) + 80, // Simulado
            instructions: treatment.instructions || treatment.notes,
            nextDose: treatment.next_dose ? new Date(treatment.next_dose) : new Date()
          }));

          setTreatments(transformedTreatments);
        }
      } catch (treatmentError) {
        console.warn('⚠️ No se pudieron cargar los tratamientos:', treatmentError);
        setTreatments([]);
      }

      // Simular actividad reciente (esto requeriría un endpoint específico)
      const mockActivity: Activity[] = [
        {
          id: '1',
          action: 'Paciente registrado',
          medication: 'Sistema',
          time: transformedPatient.createdAt,
          status: 'completed',
          notes: 'Registro inicial del paciente'
        }
      ];

      setRecentActivity(mockActivity);

    } catch (error: any) {
      console.error('❌ Error cargando datos del paciente:', error);
      
      // Debug endpoints si estamos en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Modo desarrollo: ejecutando debug de endpoints...');
        apiService.debugEndpoints();
      }
      
      if (error.message.includes('no encontrado') || error.message.includes('not found')) {
        setError('Paciente no encontrado.');
      } else if (error.message.includes('permisos')) {
        setError('No tienes permisos para ver este paciente.');
      } else if (error.message.includes('autenticado')) {
        setError('Sesión expirada. Redirigiendo al login...');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        setError(`Error al cargar los datos: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
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
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return <Badge variant="success">Activo</Badge>;
      case 'suspended':
      case 'suspendido':
        return <Badge variant="warning">Suspendido</Badge>;
      case 'completed':
      case 'completado':
        return <Badge variant="secondary">Completado</Badge>;
      case 'paused':
      case 'pausado':
        return <Badge variant="warning">Pausado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallCompliance = treatments.length > 0 
    ? Math.round(treatments.reduce((sum, t) => sum + (t.compliance || 0), 0) / treatments.length)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: User },
    { id: 'treatments', label: 'Tratamientos', icon: Pill },
    { id: 'history', label: 'Historial', icon: Clock },
    { id: 'vitals', label: 'Información Médica', icon: Activity }
  ];

  if (isLoading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando información del paciente...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link to="/patients">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver a Pacientes</span>
              </Button>
            </Link>
          </div>
          <Alert type="error" message={error} />
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link to="/patients">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Volver a Pacientes</span>
              </Button>
            </Link>
          </div>
          <Alert type="error" message="Paciente no encontrado" />
        </div>
      </Layout>
    );
  }

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
                <p className="text-gray-900">{patient.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Edad</p>
                <p className="text-gray-900">
                  {calculateAge(patient.dateOfBirth)} años 
                  ({formatDate(patient.dateOfBirth)})
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
                  {patient.gender === 'female' ? 'Femenino' : 
                   patient.gender === 'male' ? 'Masculino' : 'Otro'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                <p className="text-gray-900">{patient.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-gray-900">{patient.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="text-gray-900">{patient.address}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contacto de emergencia */}
      {patient.emergencyContact.name && (
        <Card title="Contacto de Emergencia">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-gray-900">{patient.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              <p className="text-gray-900">{patient.emergencyContact.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Relación</p>
              <p className="text-gray-900">{patient.emergencyContact.relationship}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Información médica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Historial Médico">
          <div className="space-y-3">
            {patient.medicalHistory.length > 0 ? (
              patient.medicalHistory.map((condition, index) => (
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
            {patient.allergies.length > 0 ? (
              patient.allergies.map((allergy, index) => (
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
      {treatments.length > 0 && (
        <Card title="Resumen de Cumplimiento">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className={`text-3xl font-bold ${getComplianceColor(overallCompliance)}`}>
                {overallCompliance}%
              </p>
              <p className="text-sm text-gray-600">Cumplimiento General</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{treatments.length}</p>
              <p className="text-sm text-gray-600">Tratamientos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {treatments.filter(t => t.status.toLowerCase() === 'active' || t.status.toLowerCase() === 'activo').length}
              </p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {treatments.reduce((sum, t) => sum + t.frequency, 0)}
              </p>
              <p className="text-sm text-gray-600">Dosis Diarias</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderTreatmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Tratamientos ({treatments.length})
        </h3>
        <Link to={`/treatments/create?patientId=${id}`}>
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Nuevo Tratamiento</span>
          </Button>
        </Link>
      </div>

      {treatments.length > 0 ? (
        <div className="space-y-4">
          {treatments.map((treatment) => (
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
                    {treatment.compliance && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cumplimiento</p>
                        <p className={`font-semibold ${getComplianceColor(treatment.compliance)}`}>
                          {treatment.compliance}%
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Inicio</p>
                      <p className="text-gray-900">{formatDate(treatment.startDate)}</p>
                    </div>
                  </div>

                  {treatment.endDate && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Fin del Tratamiento</p>
                      <p className="text-gray-900">{formatDate(treatment.endDate)}</p>
                    </div>
                  )}

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
      ) : (
        <div className="text-center py-12">
          <Pill size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Sin tratamientos registrados
          </h3>
          <p className="text-gray-500 mb-4">
            Este paciente no tiene tratamientos activos.
          </p>
          <Link to={`/treatments/create?patientId=${id}`}>
            <Button>
              <Plus size={16} className="mr-2" />
              Agregar Primer Tratamiento
            </Button>
          </Link>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
      
      <div className="space-y-4">
        {recentActivity.map((activity) => (
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
      <h3 className="text-lg font-medium text-gray-900">Información Médica Detallada</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Registro del Paciente">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
              <p className="text-gray-900">{formatDateTime(patient.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actualización</p>
              <p className="text-gray-900">{formatDateTime(patient.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID del Paciente</p>
              <p className="text-gray-900">{patient.id}</p>
            </div>
          </div>
        </Card>

        <Card title="Resumen Médico">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Condiciones Médicas</p>
              <p className="text-gray-900">{patient.medicalHistory.length || 'Ninguna'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Alergias Conocidas</p>
              <p className="text-gray-900">{patient.allergies.length || 'Ninguna'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tratamientos Activos</p>
              <p className="text-gray-900">
                {treatments.filter(t => t.status.toLowerCase() === 'active' || t.status.toLowerCase() === 'activo').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Información adicional si hay alergias */}
      {patient.allergies.length > 0 && (
        <Card title="⚠️ Alergias - Información Crítica">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              {patient.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-red-800 font-medium">{allergy}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-red-700 mt-3">
              ⚠️ Importante: Verificar siempre estas alergias antes de prescribir nuevos medicamentos.
            </p>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <Layout user={user} onLogout={handleLogout}>
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
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">
                {calculateAge(patient.dateOfBirth)} años • 
                {patient.gender === 'female' ? ' Femenino' : 
                 patient.gender === 'male' ? ' Masculino' : ' Otro'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={loadPatientData}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </Button>
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

        {/* Alertas importantes */}
        {patient.allergies.length > 0 && (
          <Alert
            type="warning"
            message={`⚠️ ALERGIAS: ${patient.allergies.join(', ')} - Verificar antes de prescribir medicamentos`}
          />
        )}

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