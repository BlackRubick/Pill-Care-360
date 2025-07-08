import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { ArrowLeft, Plus, X, Clock, Loader } from "lucide-react";
import apiService from "../../services/api";

interface CreateTreatmentData {
  patientId: string;
  medicationId: string;
  dosage: string;
  frequency: number;
  durationDays: number;
  startDate: string;
  instructions: string;
  notes: string;
  alarms: {
    time: string;
    description: string;
    isActive: boolean;
    soundEnabled: boolean;
    visualEnabled: boolean;
  }[];
}

export const CreateTreatmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId");

  const [formData, setFormData] = useState<CreateTreatmentData>({
    patientId: preselectedPatientId || "",
    medicationId: "",
    dosage: "",
    frequency: 1,
    durationDays: 7,
    startDate: new Date().toISOString().split("T")[0],
    instructions: "",
    notes: "",
    alarms: [],
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const [newAlarmDescription, setNewAlarmDescription] = useState("");

  useEffect(() => {
    const currentUser = apiService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
      loadInitialData();
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      console.log("📋 Cargando datos iniciales...");

      const currentUser = apiService.getStoredUser();
      const isAdmin =
        currentUser?.role === "admin" || currentUser?.role === "administrator";

      // Cargar pacientes
      const patientParams = isAdmin ? {} : { caregiver_id: currentUser?.id };
      const patientsData = await apiService.getPatients(patientParams);
      console.log("✅ Pacientes cargados:", patientsData);
      setPatients(patientsData);

      // Intentar cargar medicamentos
      try {
        const medicationsData = await apiService.getMedications();
        console.log("✅ Medicamentos cargados desde la API:", medicationsData);
        setMedications(medicationsData);
      } catch (medicationError: any) {
        console.warn(
          "⚠️ Error cargando medicamentos desde la API:",
          medicationError.message
        );

        // Solo usar datos temporales si el endpoint no está disponible
        if (
          medicationError.message.includes("Method Not Allowed") ||
          medicationError.message.includes("404") ||
          medicationError.message.includes("not found")
        ) {
          console.warn(
            "📦 Endpoint de medicamentos no disponible, usando datos temporales"
          );

          // Medicamentos temporales hasta que implementes el endpoint
          const tempMedications = [
            {
              id: 1,
              name: "Metformina",
              dosage: "500",
              unit: "mg",
              concentration: "500mg",
              description: "Antidiabético",
            },
            {
              id: 2,
              name: "Ibuprofeno",
              dosage: "400",
              unit: "mg",
              concentration: "400mg",
              description: "Antiinflamatorio",
            },
            {
              id: 3,
              name: "Aspirina",
              dosage: "100",
              unit: "mg",
              concentration: "100mg",
              description: "Antiagregante plaquetario",
            },
            {
              id: 4,
              name: "Enalapril",
              dosage: "10",
              unit: "mg",
              concentration: "10mg",
              description: "Antihipertensivo",
            },
            {
              id: 5,
              name: "Omeprazol",
              dosage: "20",
              unit: "mg",
              concentration: "20mg",
              description: "Protector gástrico",
            },
            {
              id: 6,
              name: "Paracetamol",
              dosage: "500",
              unit: "mg",
              concentration: "500mg",
              description: "Analgésico y antipirético",
            },
            {
              id: 7,
              name: "Losartán",
              dosage: "50",
              unit: "mg",
              concentration: "50mg",
              description: "Antihipertensivo",
            },
            {
              id: 8,
              name: "Simvastatina",
              dosage: "20",
              unit: "mg",
              concentration: "20mg",
              description: "Hipolipemiante",
            },
          ];

          setMedications(tempMedications);
          console.log("📦 Usando medicamentos temporales:", tempMedications);
        } else {
          // Si es otro tipo de error, lanzarlo
          throw medicationError;
        }
      }
    } catch (error: any) {
      console.error("❌ Error cargando datos iniciales:", error);

      if (error.message.includes("Method Not Allowed")) {
        setError(
          "Algunos endpoints de la API no están disponibles. Contacta al administrador del sistema."
        );
      } else {
        setError(`Error al cargar datos: ${error.message}`);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
  };

const validateForm = (): { isValid: boolean; errors: any } => {
  const newErrors: any = {};

  if (!formData.patientId) {
    newErrors.patientId = "Selecciona un paciente";
  }

  if (!formData.medicationId) {
    newErrors.medicationId = "Selecciona un medicamento";
  }

  if (!formData.dosage.trim()) {
    newErrors.dosage = "La dosis es requerida";
  } else if (formData.dosage.trim().length < 2) {
    newErrors.dosage = "La dosis debe tener al menos 2 caracteres";
  }

  if (formData.frequency < 1 || formData.frequency > 24) {
    newErrors.frequency = "La frecuencia debe estar entre 1 y 24 veces por día";
  }

  if (formData.durationDays < 1 || formData.durationDays > 365) {
    newErrors.durationDays = "La duración debe estar entre 1 y 365 días";
  }

  if (!formData.startDate) {
    newErrors.startDate = "La fecha de inicio es requerida";
  } else {
    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      newErrors.startDate = "La fecha de inicio no puede ser en el pasado";
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.durationDays - 1);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    if (endDate > maxDate) {
      newErrors.durationDays = "La duración del tratamiento es excesiva";
    }
  }

  if (formData.alarms.length === 0) {
    newErrors.alarms = "Debe agregar al menos una alarma";
  } else {
    const times = formData.alarms.map((a) => a.time);
    const duplicates = times.filter(
      (time, index) => times.indexOf(time) !== index
    );
    if (duplicates.length > 0) {
      newErrors.alarms = "No puede haber alarmas con el mismo horario";
    }
  }

  if (formData.instructions.length > 1000) {
    newErrors.instructions = "Las instrucciones no pueden exceder 1000 caracteres";
  }

  if (formData.notes.length > 1000) {
    newErrors.notes = "Las notas no pueden exceder 1000 caracteres";
  }

  setErrors(newErrors);
  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit llamado");

    const { isValid, errors: validationErrors } = validateForm();
    console.log("Validación:", isValid);
    console.log("Errores:", validationErrors);

    if (!isValid) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      console.log("Creating treatment:", formData);

      const currentUser = apiService.getStoredUser();
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Calcular fecha de fin
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + formData.durationDays - 1);

      // Preparar datos para la API según el esquema TreatmentCreate
      const treatmentData = {
        patient_id: parseInt(formData.patientId),
        medication_id: parseInt(formData.medicationId),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency,
        duration_days: formData.durationDays,
        start_date: formData.startDate,
        end_date: endDate.toISOString().split("T")[0],
        instructions: formData.instructions.trim() || null,
        notes: formData.notes.trim() || null,
        // El backend asignará automáticamente created_by_id y status
      };

      console.log("📤 Datos del tratamiento a enviar:", treatmentData);

      // Crear el tratamiento
      const response = await apiService.createTreatment(treatmentData);
      console.log("✅ Tratamiento creado:", response);

      // Crear las alarmas si se creó el tratamiento exitosamente
      if (response.id && formData.alarms.length > 0) {
        console.log("⏰ Creando alarmas para el tratamiento...");

        try {
          for (const alarm of formData.alarms) {
            const alarmData = {
              time: alarm.time,
              description: alarm.description,
              is_active: alarm.isActive,
              sound_enabled: alarm.soundEnabled,
              visual_enabled: alarm.visualEnabled,
            };

            await apiService.createTreatmentAlarm(response.id, alarmData);
          }
          console.log("✅ Todas las alarmas creadas exitosamente");
        } catch (alarmError) {
          console.warn("⚠️ Error creando algunas alarmas:", alarmError);
          // No fallar todo el proceso si las alarmas fallan
        }
      }

      setSuccessMessage("Tratamiento creado exitosamente");

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate("/treatments");
      }, 1500);
    } catch (error: any) {
      console.error("❌ Error creando tratamiento:", error);

      if (error.message.includes("422")) {
        setError(
          "Errores de validación. Verifica que todos los campos estén correctos."
        );
      } else if (error.message.includes("403")) {
        setError("No tienes permisos para crear tratamientos.");
      } else if (error.message.includes("404")) {
        setError("Paciente o medicamento no encontrado.");
      } else {
        setError(`Error al crear el tratamiento: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "frequency" || name === "durationDays"
          ? parseInt(value) || 0
          : value,
    }));

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined,
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
        visualEnabled: true,
      };

      setFormData((prev) => ({
        ...prev,
        alarms: [...prev.alarms, newAlarm],
      }));

      setNewAlarmTime("");
      setNewAlarmDescription("");

      // Limpiar error de alarmas si existe
      if (errors.alarms) {
        setErrors((prev: any) => ({
          ...prev,
          alarms: undefined,
        }));
      }
    }
  };

  const removeAlarm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      alarms: prev.alarms.filter((_, i) => i !== index),
    }));
  };

  const updateAlarm = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) =>
        i === index ? { ...alarm, [field]: value } : alarm
      ),
    }));
  };

  const getSelectedMedication = () => {
    return medications.find(
      (med) => med.id.toString() === formData.medicationId
    );
  };

  const getMedicationDisplayInfo = (medication: any) => {
    if (!medication) return "";

    // Para medicamentos reales de la API
    if (medication.full_name) {
      return medication.full_name;
    }

    // Para medicamentos temporales o formato alternativo
    const concentration =
      medication.concentration ||
      (medication.dosage && medication.unit
        ? `${medication.dosage}${medication.unit}`
        : "");

    return concentration
      ? `${medication.name} (${concentration})`
      : medication.name;
  };

  const getSelectedPatient = () => {
    return patients.find(
      (patient) => patient.id.toString() === formData.patientId
    );
  };

  const generateAutomaticAlarms = () => {
    if (formData.frequency <= 0) return;

    const alarms: {
      time: string;
      description: string;
      isActive: boolean;
      soundEnabled: boolean;
      visualEnabled: boolean;
    }[] = [];
    const hoursPerDay = 24;
    const interval = Math.floor(hoursPerDay / formData.frequency);

    for (let i = 0; i < formData.frequency; i++) {
      const hour = 8 + i * interval; // Empezar a las 8:00 AM
      const timeString = `${hour.toString().padStart(2, "0")}:00`;

      const mealTimes = [
        "Desayuno",
        "Almuerzo",
        "Merienda",
        "Cena",
        "Antes de dormir",
      ];
      const description = mealTimes[i] || `Dosis ${i + 1}`;

      alarms.push({
        time: timeString,
        description,
        isActive: true,
        soundEnabled: true,
        visualEnabled: true,
      });
    }

    setFormData((prev) => ({
      ...prev,
      alarms,
    }));
  };

  if (isLoadingData) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/treatments")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nuevo Tratamiento
            </h1>
            <p className="text-gray-600">
              Crea un nuevo tratamiento médico para un paciente
            </p>
          </div>
        </div>

        {/* Mensajes de estado */}
        {successMessage && <Alert type="success" message={successMessage} />}

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

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
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patientId}
                  </p>
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
                  {medications.map((medication) => (
                    <option key={medication.id} value={medication.id}>
                      {medication.name}{" "}
                      {medication.concentration ||
                      (medication.dosage && medication.unit)
                        ? `(${
                            medication.concentration ||
                            medication.dosage + medication.unit
                          })`
                        : ""}
                    </option>
                  ))}
                </select>
                {errors.medicationId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.medicationId}
                  </p>
                )}
              </div>

              <Input
                label="Dosis *"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                error={errors.dosage}
                placeholder="Ej: 500mg, 1 tableta"
                helperText={
                  getSelectedMedication()?.concentration ||
                  getSelectedMedication()?.dosage
                    ? `Concentración: ${
                        getSelectedMedication()?.concentration ||
                        getSelectedMedication()?.dosage +
                          getSelectedMedication()?.unit ||
                        ""
                      }`
                    : ""
                }
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
                  max="24"
                  helperText="Máximo 24 veces al día"
                />

                <Input
                  label="Duración (días) *"
                  type="number"
                  name="durationDays"
                  value={formData.durationDays.toString()}
                  onChange={handleInputChange}
                  error={errors.durationDays}
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
                min={new Date().toISOString().split("T")[0]}
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
                  maxLength={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Tomar con alimentos, evitar lácteos, etc."
                />
                <div className="flex justify-between mt-1">
                  {errors.instructions && (
                    <p className="text-sm text-red-600">
                      {errors.instructions}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.instructions.length}/1000 caracteres
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  maxLength={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales sobre el tratamiento..."
                />
                <div className="flex justify-between mt-1">
                  {errors.notes && (
                    <p className="text-sm text-red-600">{errors.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.notes.length}/1000 caracteres
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Configuración de alarmas */}
          <Card title="Configuración de Alarmas">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Configura los horarios en que el paciente debe tomar el
                  medicamento
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
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
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
                              onChange={(e) =>
                                updateAlarm(index, "isActive", e.target.checked)
                              }
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">
                              Activa
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={alarm.soundEnabled}
                              onChange={(e) =>
                                updateAlarm(
                                  index,
                                  "soundEnabled",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">
                              Sonido
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={alarm.visualEnabled}
                              onChange={(e) =>
                                updateAlarm(
                                  index,
                                  "visualEnabled",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <span className="text-sm text-gray-600">
                              Visual
                            </span>
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
                    <p className="text-sm">
                      Agrega al menos una alarma para el tratamiento
                    </p>
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
                  <h4 className="font-medium text-gray-900 mb-2">
                    Información del Paciente
                  </h4>
                  <p className="text-gray-600">{getSelectedPatient()?.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Medicamento
                  </h4>
                  <p className="text-gray-600">
                    {getMedicationDisplayInfo(getSelectedMedication())} -{" "}
                    {formData.dosage || "Dosis no especificada"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Frecuencia y Duración
                  </h4>
                  <p className="text-gray-600">
                    {formData.frequency} veces al día por{" "}
                    {formData.durationDays} días
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Fecha de Inicio
                  </h4>
                  <p className="text-gray-600">
                    {new Date(formData.startDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
                {formData.instructions && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Instrucciones
                    </h4>
                    <p className="text-gray-600">{formData.instructions}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Alarmas Configuradas
                  </h4>
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

          {/* Información de debug para desarrollo */}
          {process.env.NODE_ENV === "development" && (
            <Card title="Debug - Información del Sistema">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Pacientes Cargados:
                    </p>
                    <p className="text-xs text-gray-600">
                      {patients.length > 0
                        ? `✅ ${patients.length} pacientes`
                        : "❌ Sin pacientes"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Medicamentos:
                    </p>
                    <p className="text-xs text-gray-600">
                      {medications.length > 0
                        ? `✅ ${medications.length} medicamentos ${
                            medications[0]?.full_name
                              ? "(API real)"
                              : "(temporales)"
                          }`
                        : "❌ Sin medicamentos"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Usuario:
                    </p>
                    <p className="text-xs text-gray-600">
                      {user
                        ? `✅ ${user.name} (${user.role})`
                        : "❌ No cargado"}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium text-gray-700 mb-2">
                    Endpoints de Tratamientos Disponibles:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✅ GET /api/patients/ - Disponible</li>
                    <li>
                      ✅ GET /api/medications/ -{" "}
                      {medications.length > 0 && medications[0]?.full_name
                        ? "Disponible (API real)"
                        : medications.length > 0
                        ? "Fallback (datos temporales)"
                        : "No disponible"}
                    </li>
                    <li>✅ POST /api/treatments - Endpoint principal</li>
                    <li>
                      ✅ POST /api/treatments/{"{"}
                      {"{id}"}/alarms - Para alarmas
                    </li>
                    <li>
                      ✅ GET /api/treatments/patient/{"{"}
                      {"{id}"}/active - Para paciente
                    </li>
                    <li>
                      ✅ GET /api/treatments/dashboard/summary - Dashboard
                    </li>
                    <li>✅ GET /api/treatments/expiring - Próximos a vencer</li>
                    <li>
                      ✅ POST /api/treatments/{"{"}
                      {"{id}"}/suspend - Suspender
                    </li>
                    <li>
                      ✅ POST /api/treatments/{"{"}
                      {"{id}"}/complete - Completar
                    </li>
                  </ul>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Ver medicamentos disponibles ({medications.length})
                  </summary>
                  <div className="mt-2 bg-gray-100 p-3 rounded text-xs max-h-32 overflow-auto">
                    {medications.map((med, index) => (
                      <div key={index} className="mb-1">
                        {med.name} - {med.concentration}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </Card>
          )}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/treatments")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Crear Tratamiento
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
