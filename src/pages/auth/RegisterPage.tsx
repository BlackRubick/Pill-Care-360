import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import apiService from '../../services/api';
import type { RegisterData } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'caregiver'
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Register attempt:', formData);
      
      // Intentar registro con tu API de Python usando apiService
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword, // Agregar este campo que la API requiere
        role: formData.role
      };
      
      const result = await apiService.register(registerData);
      console.log('Register successful:', result);
      
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Register error:', err);
      
      // Mostrar el error específico que viene de la API
      if (err.message.includes('validación')) {
        // Error de validación 422 - mostrar detalles
        setErrors({ 
          email: err.message,
          name: 'Revisa todos los campos'
        });
      } else if (err.message.includes('ya está registrado') || err.message.includes('already exists')) {
        setErrors({ email: 'Este email ya está registrado. Intenta con otro.' });
      } else if (err.message.includes('Datos inválidos') || err.message.includes('400')) {
        setErrors({ email: 'Datos inválidos. Verifica la información ingresada.' });
      } else if (err.message.includes('fetch') || err.message.includes('network')) {
        setErrors({ email: 'Error de conexión. Verifica que el servidor esté funcionando.' });
      } else {
        setErrors({ email: err.message || 'Error en el registro. Intenta nuevamente.' });
      }
      
      // Fallback para desarrollo: permitir registro simulado si la API falla completamente
      if (process.env.NODE_ENV === 'development' && err.message.includes('fetch')) {
        console.warn('API completamente inaccesible, usando fallback de desarrollo');
        setTimeout(() => {
          setSuccess(true);
          setTimeout(() => {
            navigate('/auth/login');
          }, 2000);
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo específico
    if (errors[name as keyof RegisterData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLoginClick = () => {
    console.log('Navegando a login...');
    navigate('/auth/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-green-600 rounded-full">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <Alert
            type="success"
            title="¡Registro exitoso!"
            message="Tu cuenta ha sido creada correctamente. Te redirigiremos al login en unos segundos..."
          />
          <Button 
            onClick={() => navigate('/auth/login')}
            className="w-full"
          >
            Ir a Iniciar Sesión Ahora
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-full">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a PillCare 360
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
              placeholder="Tu nombre completo"
            />

            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              placeholder="tu@email.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de usuario
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="caregiver">Cuidador</option>
                <option value="admin">Administrador</option>
                <option value="patient">Paciente</option>
              </select>
            </div>

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              placeholder="••••••••"
              helperText="Mínimo 6 caracteres"
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              required
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Crear Cuenta
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
            </span>
            {/* Opción 1: Usando Link */}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
            
            {/* Opción 2: Usando botón con navigate (comentado para probar)
            <button
              type="button"
              onClick={handleLoginClick}
              className="font-medium text-blue-600 hover:text-blue-500 underline bg-transparent border-none cursor-pointer"
            >
              Inicia sesión aquí
            </button>
            */}
          </div>


        </form>
      </div>
    </div>
  );
};