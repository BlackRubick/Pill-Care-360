import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Clock, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

// Datos simulados para pacientes y tratamientos
const mockPatients = [
  { id: '1', name: 'María García López' },
  { id: '2', name: 'Juan Carlos Pérez' },
  { id: '3', name: 'Ana López Mendoza' }
];

const mockTreatments = [
  { id: '1', patientId: '1', medicationName: 'Metformina 500mg' },
  { id: '2', patientId: '2', medicationName: 'Ibuprofeno 400mg' },
  { id: '3', patientId: '3', medicationName: 'Aspirina 100mg' }
];

interface AlarmData {
  id?: string;
  treatmentId: string;
  patientName?: string;
  medicationName?: string;
  time: string;
  description: string;
  isActive: boolean;
  soundEnabled: boolean;
  visualEnabled: boolean;
  frequency: string;
}

interface CreateAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarmData: AlarmData) => void;
}

interface EditAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarmData: AlarmData) => void;
  alarm: AlarmData | null;
}

export const CreateAlarmModal: React.FC<CreateAlarmModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AlarmData>({
    treatmentId: '',
    time: '',
    description: '',
    isActive: true,
    soundEnabled: true,
    visualEnabled: true,
    frequency: 'Diario'
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.treatmentId) {
      newErrors.treatmentId = 'Selecciona un tratamiento';
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Agregar información del tratamiento seleccionado
      const selectedTreatment = mockTreatments.find(t => t.id === formData.treatmentId);
      const selectedPatient = mockPatients.find(p => p.id === selectedTreatment?.patientId);
      
      const completeAlarmData = {
        ...formData,
        id: `alarm_${Date.now()}`,
        patientName: selectedPatient?.name,
        medicationName: selectedTreatment?.medicationName
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(completeAlarmData);
      
      // Resetear formulario
      setFormData({
        treatmentId: '',
        time: '',
        description: '',
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
        frequency: 'Diario'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating alarm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientForTreatment = (treatmentId: string) => {
    const treatment = mockTreatments.find(t => t.id === treatmentId);
    return mockPatients.find(p => p.id === treatment?.patientId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Alarma de Medicamento"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tratamiento *
          </label>
          <select
            name="treatmentId"
            value={formData.treatmentId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar tratamiento</option>
            {mockTreatments.map(treatment => {
              const patient = getPatientForTreatment(treatment.id);
              return (
                <option key={treatment.id} value={treatment.id}>
                  {patient?.name} - {treatment.medicationName}
                </option>
              );
            })}
          </select>
          {errors.treatmentId && (
            <p className="mt-1 text-sm text-red-600">{errors.treatmentId}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hora *"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            error={errors.time}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Diario">Diario</option>
              <option value="Lunes a Viernes">Lunes a Viernes</option>
              <option value="Fines de semana">Fines de semana</option>
              <option value="Personalizado">Personalizado</option>
            </select>
          </div>
        </div>

        <Input
          label="Descripción *"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
          placeholder="Ej: Con el desayuno, Antes de dormir"
        />

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Configuración de Notificaciones</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Alarma activa</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="soundEnabled"
                checked={formData.soundEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                {formData.soundEnabled ? (
                  <Volume2 size={16} className="text-blue-600" />
                ) : (
                  <VolumeX size={16} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Sonido de alarma</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="visualEnabled"
                checked={formData.visualEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                {formData.visualEnabled ? (
                  <Eye size={16} className="text-blue-600" />
                ) : (
                  <EyeOff size={16} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Notificación visual</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Crear Alarma
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const EditAlarmModal: React.FC<EditAlarmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  alarm
}) => {
  const [formData, setFormData] = useState<AlarmData>({
    treatmentId: '',
    time: '',
    description: '',
    isActive: true,
    soundEnabled: true,
    visualEnabled: true,
    frequency: 'Diario'
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos de la alarma cuando se abre el modal
  useEffect(() => {
    if (alarm) {
      setFormData({
        ...alarm,
        treatmentId: alarm.treatmentId || '',
        frequency: alarm.frequency || 'Diario'
      });
    }
  }, [alarm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating alarm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Alarma"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Paciente:</strong> {alarm?.patientName}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Medicamento:</strong> {alarm?.medicationName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hora *"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            error={errors.time}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Diario">Diario</option>
              <option value="Lunes a Viernes">Lunes a Viernes</option>
              <option value="Fines de semana">Fines de semana</option>
              <option value="Personalizado">Personalizado</option>
            </select>
          </div>
        </div>

        <Input
          label="Descripción *"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
          placeholder="Ej: Con el desayuno, Antes de dormir"
        />

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Configuración de Notificaciones</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Alarma activa</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="soundEnabled"
                checked={formData.soundEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                {formData.soundEnabled ? (
                  <Volume2 size={16} className="text-blue-600" />
                ) : (
                  <VolumeX size={16} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Sonido de alarma</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="visualEnabled"
                checked={formData.visualEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                {formData.visualEnabled ? (
                  <Eye size={16} className="text-blue-600" />
                ) : (
                  <EyeOff size={16} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Notificación visual</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};