import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import apiService from '../../services/api';
import type { LoginCredentials } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Login attempt:', credentials);
      
      // Intentar login con tu API de Python
      const response = await apiService.login(credentials.email, credentials.password);
      
      console.log('Login successful:', response);
      
      // Login exitoso - el token ya se guardó en apiService.login()
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Determinar si es un error de conexión o un error de autenticación
      const isConnectionError = err.message.includes('fetch') || 
                               err.message.includes('network') || 
                               err.message.includes('Failed to fetch') ||
                               err.message.includes('NetworkError');
      
      const isAuthError = err.message.includes('401') || 
                         err.message.includes('Credenciales inválidas') ||
                         err.message.includes('Unauthorized');
      
      // Manejo de errores específicos
      if (isAuthError) {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
      } else if (isConnectionError) {
        setError('Error de conexión. Verifica que el servidor esté funcionando.');
        
        // Solo usar fallback si es un error de conexión Y estamos en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error de conexión detectado, ofreciendo fallback de desarrollo');
          // Mostrar opción de fallback después de 2 segundos
          setTimeout(() => {
            if (confirm('¿Usar modo sin conexión para desarrollo? (Esto permitirá acceso sin validar credenciales)')) {
              if (credentials.email && credentials.password) {
                localStorage.setItem('authToken', 'dev-offline-token');
                localStorage.setItem('access_token', 'dev-offline-token');
                localStorage.setItem('user', JSON.stringify({
                  id: '1',
                  name: 'Dr. Usuario Desarrollo (Sin conexión)',
                  email: credentials.email
                }));
                navigate('/dashboard');
              }
            }
          }, 2000);
        }
      } else {
        setError('Error inesperado. Intenta nuevamente.');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterClick = () => {
    console.log('Navegando a registro...');
    navigate('/auth/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-full">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de PillCare 360
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <div className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Iniciar Sesión
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
            </span>
            {/* Opción 1: Usando Link */}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </Link>
            
            {/* Opción 2: Usando botón con navigate (comentado para probar)
            <button
              type="button"
              onClick={handleRegisterClick}
              className="font-medium text-blue-600 hover:text-blue-500 underline bg-transparent border-none cursor-pointer"
            >
              Regístrate aquí
            </button>
            */}
          </div>


        </form>
      </div>
    </div>
  );
};