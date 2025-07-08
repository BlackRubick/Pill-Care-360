import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft, Plus, X } from 'lucide-react';
import apiService from '../../services/api';
import type { CreatePatientData } from '../../types';

export const CreatePatientPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreatePatientData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'female',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: [],
    allergies: []
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [newMedicalCondition, setNewMedicalCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar usuario al montar el componente
  useEffect(() => {
    const currentUser = apiService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Si no hay usuario, redirigir al login
      navigate('/auth/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    apiService.logout();
  };

  // Función de validación mejorada
  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Validaciones básicas
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'El teléfono debe tener al menos 10 caracteres';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else {
      // Validar que la fecha no sea en el futuro
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'La fecha de nacimiento no puede ser en el futuro';
      }
      
      // Validar que la persona no sea mayor a 120 años
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 120) {
        newErrors.dateOfBirth = 'La fecha de nacimiento no es válida';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'La dirección debe tener al menos 10 caracteres';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors.emergencyContactName = 'El nombre del contacto de emergencia es requerido';
    } else if (formData.emergencyContact.name.trim().length < 2) {
      newErrors.emergencyContactName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyContactPhone = 'El teléfono del contacto de emergencia es requerido';
    } else if (formData.emergencyContact.phone.trim().length < 10) {
      newErrors.emergencyContactPhone = 'El teléfono debe tener al menos 10 caracteres';
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors.emergencyContactRelationship = 'La relación del contacto de emergencia es requerida';
    }

    // Validar que los arrays estén inicializados
    if (!Array.isArray(formData.medicalHistory)) {
      console.warn('medicalHistory no es un array, inicializando...');
      setFormData(prev => ({ ...prev, medicalHistory: [] }));
    }

    if (!Array.isArray(formData.allergies)) {
      console.warn('allergies no es un array, inicializando...');
      setFormData(prev => ({ ...prev, allergies: [] }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función mejorada para manejar la creación de pacientes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      console.log('Creating patient:', formData);
      
      // Verificar que tenemos un token válido
      const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
      console.log('Token disponible:', token ? 'Sí' : 'No');
      console.log('Usuario actual:', user);
      
      // Preparar los datos para la API - ESTRUCTURA CORRECTA
      const patientData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        date_of_birth: formData.dateOfBirth, // Campo requerido por el backend
        gender: formData.gender,
        address: formData.address.trim(),
        // El backend espera un objeto emergency_contact completo
        emergency_contact: {
          name: formData.emergencyContact.name.trim(),
          phone: formData.emergencyContact.phone.trim(),
          relationship: formData.emergencyContact.relationship.trim()
        },
        // Asegurar que son arrays, incluso si están vacíos
        medical_history: formData.medicalHistory || [],
        allergies: formData.allergies || [],
        // Campo requerido: caregiver_id (ID del usuario actual)
        caregiver_id: user?.id || null
      };

      console.log('Datos a enviar (estructura correcta):', patientData);
      
      // Verificar que tenemos caregiver_id
      if (!patientData.caregiver_id) {
        throw new Error('No se pudo obtener el ID del usuario. Verifica tu sesión.');
      }
      
      // DEBUGGING: Verificar cada campo
      console.log('Validación de campos:');
      console.log('- name:', patientData.name, 'length:', patientData.name.length);
      console.log('- email:', patientData.email, 'válido:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email));
      console.log('- phone:', patientData.phone, 'length:', patientData.phone.length);
      console.log('- date_of_birth:', patientData.date_of_birth, 'válido:', !!patientData.date_of_birth, 'valor:', patientData.date_of_birth);
      console.log('- gender:', patientData.gender);
      console.log('- address:', patientData.address, 'length:', patientData.address.length);
      console.log('- emergency_contact:', patientData.emergency_contact, 'es objeto:', typeof patientData.emergency_contact === 'object');
      console.log('  - emergency_contact.name:', patientData.emergency_contact.name, 'length:', patientData.emergency_contact.name.length);
      console.log('  - emergency_contact.phone:', patientData.emergency_contact.phone, 'length:', patientData.emergency_contact.phone.length);
      console.log('  - emergency_contact.relationship:', patientData.emergency_contact.relationship, 'length:', patientData.emergency_contact.relationship.length);
      console.log('- medical_history:', patientData.medical_history, 'es array:', Array.isArray(patientData.medical_history));
      console.log('- allergies:', patientData.allergies, 'es array:', Array.isArray(patientData.allergies));
      console.log('- caregiver_id:', patientData.caregiver_id, 'tipo:', typeof patientData.caregiver_id);

      // Crear paciente usando la API
      const response = await apiService.createPatient(patientData);
      
      console.log('Patient created successfully:', response);
      
      setSuccessMessage('Paciente creado exitosamente');
      
      // Redirigir después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        navigate('/patients');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating patient:', error);
      
      // Log detallado del error
      console.log('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response,
        stack: error.stack
      });

      // Manejo de errores específicos mejorado
      if (error.message.includes('422')) {
        // Error de validación - mostrar información más detallada
        console.log('Error 422 - Datos de validación:', error.response?.data);
        
        let validationMessage = 'Errores de validación en los siguientes campos: ';
        
        // Intentar extraer información específica del error
        if (error.response?.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const fieldErrors = error.response.data.detail.map(err => 
              `${err.loc ? err.loc.join('.') : 'campo'}: ${err.msg}`
            ).join(', ');
            validationMessage += fieldErrors;
          } else {
            validationMessage += error.response.data.detail;
          }
        }
        
        setErrors({ 
          general: validationMessage
        });
      } else if (error.message.includes('403')) {
        // Error de autorización
        setErrors({ 
          general: 'No tienes permisos para crear pacientes. Verifica tu sesión e intenta nuevamente.' 
        });
        
        // Verificar si el token es válido
        try {
          const currentUser = await apiService.getCurrentUser();
          console.log('Usuario verificado:', currentUser);
        } catch (authError) {
          console.error('Token inválido:', authError);
          setErrors({ 
            general: 'Tu sesión ha expirado. Serás redirigido al login.' 
          });
          setTimeout(() => {
            apiService.logout();
          }, 2000);
        }
      } else if (error.message.includes('409')) {
        setErrors({ email: 'Ya existe un paciente con este email.' });
      } else if (error.message.includes('401')) {
        setErrors({ general: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
        setTimeout(() => apiService.logout(), 2000);
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        setErrors({ general: 'Error de conexión. Verifica que el servidor esté funcionando.' });
      } else {
        setErrors({ general: `Error al crear el paciente: ${error.message}` });
      }
      
      // Fallback para desarrollo
      if (process.env.NODE_ENV === 'development' && error.message.includes('fetch')) {
        console.warn('API no disponible, simulando creación exitosa para desarrollo');
        setTimeout(() => {
          setSuccessMessage('Paciente creado exitosamente (modo desarrollo)');
          setTimeout(() => navigate('/patients'), 1500);
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Limpiar error general si se está editando
    if (errors.general) {
      setErrors((prev: any) => ({
        ...prev,
        general: undefined
      }));
    }
  };

  const addMedicalCondition = () => {
    if (newMedicalCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalCondition.trim()]
      }));
      setNewMedicalCondition('');
    }
  };

  const removeMedicalCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/patients')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Paciente</h1>
            <p className="text-gray-600">Registra un nuevo paciente en el sistema</p>
          </div>
        </div>

        {/* Mensajes de estado */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
          />
        )}

        {errors.general && (
          <Alert
            type="error"
            message={errors.general}
            onClose={() => setErrors(prev => ({ ...prev, general: undefined }))}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información personal */}
          <Card title="Información Personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre Completo *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Nombre completo del paciente"
              />

              <Input
                label="Correo Electrónico *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="correo@ejemplo.com"
              />

              <Input
                label="Teléfono *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="+52 961 123 4567"
              />

              <Input
                label="Fecha de Nacimiento *"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección completa del paciente"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Contacto de emergencia */}
          <Card title="Contacto de Emergencia">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Nombre *"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                error={errors.emergencyContactName}
                placeholder="Nombre del contacto"
              />

              <Input
                label="Teléfono *"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                error={errors.emergencyContactPhone}
                placeholder="+52 961 123 4567"
              />

              <Input
                label="Relación *"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                error={errors.emergencyContactRelationship}
                placeholder="Ej: Esposo, Hijo, Hermano"
              />
            </div>
          </Card>

          {/* Historial médico */}
          <Card title="Historial Médico">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condiciones Médicas
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newMedicalCondition}
                    onChange={(e) => setNewMedicalCondition(e.target.value)}
                    placeholder="Ej: Diabetes, Hipertensión"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
                  />
                  <Button
                    type="button"
                    onClick={addMedicalCondition}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Agregar</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medicalHistory.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeMedicalCondition(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Ej: Penicilina, Mariscos"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  />
                  <Button
                    type="button"
                    onClick={addAllergy}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Agregar</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Información de debug para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <Card title="Debug - Información de sesión y datos">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Token:</p>
                    <p className="text-xs text-gray-600">
                      {localStorage.getItem('access_token') ? '✅ Presente' : '❌ Ausente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Usuario:</p>
                    <p className="text-xs text-gray-600">
                      {user ? `✅ ${user.name}` : '❌ No cargado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">API:</p>
                    <p className="text-xs text-gray-600">
                      {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const userInfo = await apiService.getCurrentUser();
                        alert(`Usuario válido: ${JSON.stringify(userInfo, null, 2)}`);
                      } catch (error) {
                        alert(`Error de sesión: ${error.message}`);
                      }
                    }}
                  >
                    Verificar Sesión
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Headers actuales:', apiService.getHeaders());
                      console.log('Token:', localStorage.getItem('access_token'));
                      console.log('Usuario:', localStorage.getItem('user'));
                    }}
                  >
                    Debug Console
                  </Button>
                </div>
                
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Ver estructura de datos para API
                  </summary>
                  <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify({
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      date_of_birth: formData.dateOfBirth,
                      gender: formData.gender,
                      address: formData.address,
                      emergency_contact: {
                        name: formData.emergencyContact.name,
                        phone: formData.emergencyContact.phone,
                        relationship: formData.emergencyContact.relationship
                      },
                      medical_history: formData.medicalHistory,
                      allergies: formData.allergies,
                      caregiver_id: user?.id || null
                    }, null, 2)}
                  </pre>
                </details>
                
                {/* Información adicional de debug */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Test de validación en tiempo real
                  </summary>
                  <div className="mt-2 bg-gray-100 p-3 rounded text-xs">
                    <p><strong>Validaciones:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Nombre: {formData.name.trim().length >= 2 ? '✅' : '❌'} ({formData.name.trim().length} caracteres)</li>
                      <li>Email: {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '✅' : '❌'}</li>
                      <li>Teléfono: {formData.phone.trim().length >= 10 ? '✅' : '❌'} ({formData.phone.trim().length} caracteres)</li>
                      <li>Fecha: {formData.dateOfBirth ? '✅' : '❌'}</li>
                      <li>Dirección: {formData.address.trim().length >= 10 ? '✅' : '❌'} ({formData.address.trim().length} caracteres)</li>
                      <li>Contacto emergencia: {formData.emergencyContact.name.trim() && formData.emergencyContact.phone.trim() && formData.emergencyContact.relationship.trim() ? '✅' : '❌'}</li>
                      <li>Arrays: medicalHistory={Array.isArray(formData.medicalHistory) ? '✅' : '❌'}, allergies={Array.isArray(formData.allergies) ? '✅' : '❌'}</li>
                      <li>Caregiver ID: {user?.id ? '✅' : '❌'} (valor: {user?.id || 'null'})</li>
                    </ul>
                  </div>
                </details>
              </div>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/patients')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Crear Paciente
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};