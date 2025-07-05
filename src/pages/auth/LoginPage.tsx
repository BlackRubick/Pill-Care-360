import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import type { LoginCredentials } from '../../types';

export const LoginPage: React.FC = () => {
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
      // Aquí iría la lógica de autenticación
      console.log('Login attempt:', credentials);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir al dashboard después del login exitoso
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
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
              <Link
                to="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate aquí
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};