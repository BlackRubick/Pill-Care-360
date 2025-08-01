import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { ArrowLeft, Plus, X, Save } from "lucide-react";

// Mock del paciente actual
const mockPatient = {
  id: "1",
  name: "María García López",
  email: "maria.garcia@email.com",
  phone: "+52 961 123 4567",
  dateOfBirth: "1975-03-15",
  gender: "female",
  address: "Av. Central 123, Col. Centro, Tuxtla Gutiérrez, Chiapas",
  emergencyContact: {
    name: "José García",
    phone: "+52 961 765 4321",
    relationship: "Esposo",
  },
  medicalHistory: ["Diabetes Tipo 2", "Hipertensión"],
  allergies: ["Penicilina"],
};

interface EditPatientData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
}

const mockUser = {
  name: "Dr. Juan Martínez",
  email: "doctor@pillcare360.com",
};

export const EditPatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditPatientData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "female",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: [],
    allergies: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newMedicalCondition, setNewMedicalCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  // Cargar datos del paciente al montar el componente
  useEffect(() => {
    // Simular carga de datos
    setFormData({
      name: mockPatient.name,
      email: mockPatient.email,
      phone: mockPatient.phone,
      dateOfBirth: mockPatient.dateOfBirth,
      gender: mockPatient.gender as "male" | "female" | "other",
      address: mockPatient.address,
      emergencyContact: mockPatient.emergencyContact,
      medicalHistory: [...mockPatient.medicalHistory],
      allergies: [...mockPatient.allergies],
    });
  }, [id]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors.emergencyContactName =
        "El nombre del contacto de emergencia es requerido";
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyContactPhone =
        "El teléfono del contacto de emergencia es requerido";
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors.emergencyContactRelationship =
        "La relación del contacto de emergencia es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("Updating patient:", formData);

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/patients/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating patient:", error);
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

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const addMedicalCondition = () => {
    if (newMedicalCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalCondition.trim()],
      }));
      setNewMedicalCondition("");
    }
  };

  const removeMedicalCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index),
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/patients/${id}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Paciente
            </h1>
            <p className="text-gray-600">
              Modifica la información del paciente
            </p>
          </div>
        </div>

        {/* Alert de éxito */}
        {showSuccess && (
          <Alert type="success" message="Paciente actualizado correctamente" />
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
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addMedicalCondition())
                    }
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
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAllergy())
                    }
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

          {/* Información adicional */}
          <Card title="Información del Sistema">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Paciente registrado
                </p>
                <p className="text-gray-900">
                  {new Date().toLocaleDateString("es-ES")}{" "}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Última actualización
                </p>
                <p className="text-gray-900">
                  {new Date().toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/patients/${id}`)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Guardar Cambios</span>
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
