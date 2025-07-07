import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft, Plus, X, Clock } from 'lucide-react';

// Datos simulados
const mockPatients = [
  { id: '1', name: 'María García López' },
  { id: '2', name: 'Juan Carlos Pérez' },
  { id: '3', name: 'Ana López Mendoza' }
];

const mockMedications = [
  { id: '1', name: 'Metformina', dosage: '500mg', unit: 'mg' },
  { id: '2', name: 'Ibuprofeno', dosage: '400mg', unit: 'mg' },
  { id: '3', name: 'Aspirina', dosage: '100mg', unit: 'mg' },
  { id: '4', name: 'Enalapril', dosage: '10mg', unit: 'mg' },
  { id: '5', name: 'Omeprazol', dosage: '20mg', unit: 'mg' }
];

interface CreateTreatmentData {
  patientId: string;
  medicationId: string;
  customDosage: string;
  frequency: number;
  duration: number;
  startDate: string;
  instructions: string;
  alarms: {
    time: string;
    description: string;
    isActive: boolean;
    soundEnabled: boolean;
    visualEnabled: boolean;
  }[];
}

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const CreateTreatmentPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateTreatmentData>({
    patientId: '',
    medicationId: '',
    customDosage: '',
    frequency: 1,
    duration: 7,
    startDate: new Date().toISOString().split('T')[0],
    instructions: '',
    alarms: []
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmDescription, setNewAlarmDescription] = useState('');

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecciona un paciente';
    }

    if (!formData.medicationId) {
      newErrors.medicationId = 'Selecciona un medicamento';
    }

    if (!formData.customDosage.trim()) {
      newErrors.customDosage = 'La dosis es requerida';
    }

    if (formData.frequency < 1 || formData.frequency > 10) {
      newErrors.frequency = 'La frecuencia debe estar entre 1 y 10 veces por día';
    }

    if (formData.duration < 1 || formData.duration > 365) {
      newErrors.duration = 'La duración debe estar entre 1 y 365 días';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (formData.alarms.length === 0) {
      newErrors.alarms = 'Debe agregar al menos una alarma';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Creating treatment:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la lista de tratamientos
      navigate('/treatments');
    } catch (error) {
      console.error('Error creating treatment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequency' || name === 'duration' ? parseInt(value) || 0 : value
    }));

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const addAlarm = () => {
    if (newAlarmTime && newAlarmDescription.trim()) {
      const newAlarm = {
        time: newAlarmTime,
        description: newAlarmDescription.trim(),
        isActive: true,
        soundEnabled: true,
        visualEnabled: true
      };

      setFormData(prev => ({
        ...prev,
        alarms: [...prev.alarms, newAlarm]
      }));

      setNewAlarmTime('');
      setNewAlarmDescription('');

      // Limpiar error de alarmas si existe
      if (errors.alarms) {
        setErrors((prev: any) => ({
          ...prev,
          alarms: undefined
        }));
      }
    }
  };

  const removeAlarm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.filter((_, i) => i !== index)
    }));
  };

  const updateAlarm = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) => 
        i === index ? { ...alarm, [field]: value } : alarm
      )
    }));
  };

  const getSelectedMedication = () => {
    return mockMedications.find(med => med.id === formData.medicationId);
  };

  const getSelectedPatient = () => {
    return mockPatients.find(patient => patient.id === formData.patientId);
  };

  const generateAutomaticAlarms = () => {
    if (formData.frequency <= 0) return;

    const alarms: { time: string; description: string; isActive: boolean; soundEnabled: boolean; visualEnabled: boolean; }[] = [];
    const hoursPerDay = 24;
    const interval = Math.floor(hoursPerDay / formData.frequency);

    for (let i = 0; i < formData.frequency; i++) {
      const hour = 8 + (i * interval); // Empezar a las 8:00 AM
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      
      const mealTimes = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Antes de dormir'];
      const description = mealTimes[i] || `Dosis ${i + 1}`;

      alarms.push({
        time: timeString,
        description,
        isActive: true,
        soundEnabled: true,
        visualEnabled: true
      });
    }

    setFormData(prev => ({
      ...prev,
      alarms
    }));
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/treatments')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Tratamiento</h1>
            <p className="text-gray-600">Crea un nuevo tratamiento médico para un paciente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <Card title="Información del Tratamiento">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente *
                </label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar paciente</option>
                  {mockPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamento *
                </label>
                <select
                  name="medicationId"
                  value={formData.medicationId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar medicamento</option>
                  {mockMedications.map(medication => (
                    <option key={medication.id} value={medication.id}>
                      {medication.name} ({medication.dosage})
                    </option>
                  ))}
                </select>
                {errors.medicationId && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicationId}</p>
                )}
              </div>

              <Input
                label="Dosis *"
                name="customDosage"
                value={formData.customDosage}
                onChange={handleInputChange}
                error={errors.customDosage}
                placeholder="Ej: 500mg, 1 tableta"
                helperText={getSelectedMedication() ? `Dosis estándar: ${getSelectedMedication()?.dosage}` : ''}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Frecuencia (veces/día) *"
                  type="number"
                  name="frequency"
                  value={formData.frequency.toString()}
                  onChange={handleInputChange}
                  error={errors.frequency}
                  min="1"
                  max="10"
                />

                <Input
                  label="Duración (días) *"
                  type="number"
                  name="duration"
                  value={formData.duration.toString()}
                  onChange={handleInputChange}
                  error={errors.duration}
                  min="1"
                  max="365"
                />
              </div>

              <Input
                label="Fecha de Inicio *"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones Especiales
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Tomar con alimentos, evitar lácteos, etc."
                />
              </div>
            </div>
          </Card>

          {/* Configuración de alarmas */}
          <Card title="Configuración de Alarmas">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Configura los horarios en que el paciente debe tomar el medicamento
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateAutomaticAlarms}
                  className="flex items-center space-x-2"
                >
                  <Clock size={16} />
                  <span>Generar Automático</span>
                </Button>
              </div>

              {/* Agregar nueva alarma */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  label="Hora"
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                />
                <Input
                  label="Descripción"
                  value={newAlarmDescription}
                  onChange={(e) => setNewAlarmDescription(e.target.value)}
                  placeholder="Ej: Con el desayuno"
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addAlarm}
                    className="flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Agregar</span>
                  </Button>
                </div>
              </div>

              {/* Lista de alarmas */}
              <div className="space-y-3">
                {formData.alarms.map((alarm, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-medium text-blue-600">
                        {alarm.time}
                      </div>
                      <div>
                        <p className="font-medium">{alarm.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={alarm.isActive}
                              onChange={(e) => updateAlarm(index, 'isActive', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">Activa</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={alarm.soundEnabled}
                              onChange={(e) => updateAlarm(index, 'soundEnabled', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">Sonido</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={alarm.visualEnabled}
                              onChange={(e) => updateAlarm(index, 'visualEnabled', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">Visual</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAlarm(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {formData.alarms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No hay alarmas configuradas</p>
                    <p className="text-sm">Agrega al menos una alarma para el tratamiento</p>
                  </div>
                )}
              </div>

              {errors.alarms && (
                <p className="text-sm text-red-600">{errors.alarms}</p>
              )}
            </div>
          </Card>

          {/* Resumen */}
          {formData.patientId && formData.medicationId && (
            <Card title="Resumen del Tratamiento">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información del Paciente</h4>
                  <p className="text-gray-600">{getSelectedPatient()?.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Medicamento</h4>
                  <p className="text-gray-600">
                    {getSelectedMedication()?.name} - {formData.customDosage || getSelectedMedication()?.dosage}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Frecuencia y Duración</h4>
                  <p className="text-gray-600">
                    {formData.frequency} veces al día por {formData.duration} días
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fecha de Inicio</h4>
                  <p className="text-gray-600">
                    {new Date(formData.startDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                {formData.instructions && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Instrucciones</h4>
                    <p className="text-gray-600">{formData.instructions}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">Alarmas Configuradas</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.alarms.map((alarm, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {alarm.time} - {alarm.description}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/treatments')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Crear Tratamiento
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};