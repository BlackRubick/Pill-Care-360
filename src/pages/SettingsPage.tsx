import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { 
  User, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Smartphone,
  Clock,
  Volume2,
  Monitor,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Key,
  Settings as SettingsIcon,
  HelpCircle
} from 'lucide-react';

interface SettingsConfig {
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    alertSound: boolean;
    reminderFrequency: string;
    urgentOnly: boolean;
  };
  system: {
    language: string;
    timezone: string;
    dateFormat: string;
    theme: string;
    autoBackup: boolean;
    backupFrequency: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: string;
    passwordExpiry: string;
    loginAttempts: number;
  };
  alarms: {
    defaultSound: string;
    snoozeTime: number;
    maxRetries: number;
    escalationTime: number;
    weekendMode: boolean;
  };
}

const mockUser = {
  name: 'Dr. Juan Martínez',
  email: 'doctor@pillcare360.com'
};

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState<SettingsConfig>({
    profile: {
      name: 'Dr. Juan Martínez',
      email: 'doctor@pillcare360.com',
      phone: '+52 961 123 4567',
      role: 'Administrador'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      alertSound: true,
      reminderFrequency: '30',
      urgentOnly: false
    },
    system: {
      language: 'es',
      timezone: 'America/Mexico_City',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      autoBackup: true,
      backupFrequency: 'daily'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: '60',
      passwordExpiry: '90',
      loginAttempts: 3
    },
    alarms: {
      defaultSound: 'bell',
      snoozeTime: 5,
      maxRetries: 3,
      escalationTime: 15,
      weekendMode: false
    }
  });

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: keyof SettingsConfig, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pillcare-settings.json';
    link.click();
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'system', label: 'Sistema', icon: Monitor },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'alarms', label: 'Alarmas', icon: Clock }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={40} className="text-white" />
        </div>
        <div className="space-y-2">
          <Button variant="outline" size="sm">Cambiar Foto</Button>
          <p className="text-sm text-gray-500">JPG, PNG hasta 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre Completo"
          value={settings.profile.name}
          onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
        />
        <Input
          label="Correo Electrónico"
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
        />
        <Input
          label="Teléfono"
          value={settings.profile.phone}
          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <div className="flex items-center space-x-2">
            <Badge variant="info">{settings.profile.role}</Badge>
            <span className="text-sm text-gray-500">Contacta al administrador para cambios</span>
          </div>
        </div>
      </div>

      <Card title="Cambiar Contraseña">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label="Contraseña Actual"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <Button variant="outline" className="mt-4">
          <Key size={16} className="mr-2" />
          Actualizar Contraseña
        </Button>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card title="Canales de Notificación">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-blue-600" />
              <div>
                <p className="font-medium">Notificaciones por Email</p>
                <p className="text-sm text-gray-500">Recibe alertas y recordatorios por correo</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailEnabled}
                onChange={(e) => handleInputChange('notifications', 'emailEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone size={20} className="text-green-600" />
              <div>
                <p className="font-medium">Notificaciones SMS</p>
                <p className="text-sm text-gray-500">Recibe mensajes de texto para alertas urgentes</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.smsEnabled}
                onChange={(e) => handleInputChange('notifications', 'smsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 size={20} className="text-purple-600" />
              <div>
                <p className="font-medium">Sonidos de Alerta</p>
                <p className="text-sm text-gray-500">Reproducir sonidos para las alarmas</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.alertSound}
                onChange={(e) => handleInputChange('notifications', 'alertSound', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Configuración de Recordatorios">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Recordatorios
            </label>
            <select
              value={settings.notifications.reminderFrequency}
              onChange={(e) => handleInputChange('notifications', 'reminderFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.urgentOnly}
              onChange={(e) => handleInputChange('notifications', 'urgentOnly', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <label className="text-sm text-gray-700">
              Solo notificaciones urgentes
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <Card title="Configuración Regional">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
            <select
              value={settings.system.language}
              onChange={(e) => handleInputChange('system', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zona Horaria</label>
            <select
              value={settings.system.timezone}
              onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/Monterrey">Monterrey (GMT-6)</option>
              <option value="America/Cancun">Cancún (GMT-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Formato de Fecha</label>
            <select
              value={settings.system.dateFormat}
              onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/AAAA</option>
              <option value="MM/DD/YYYY">MM/DD/AAAA</option>
              <option value="YYYY-MM-DD">AAAA-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
            <select
              value={settings.system.theme}
              onChange={(e) => handleInputChange('system', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Respaldo y Sincronización">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Respaldo Automático</p>
              <p className="text-sm text-gray-500">Crear copias de seguridad automáticamente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.system.autoBackup}
                onChange={(e) => handleInputChange('system', 'autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.system.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de Respaldo
              </label>
              <select
                value={settings.system.backupFrequency}
                onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
          )}

          <div className="flex space-x-4">
            <Button variant="outline" onClick={exportSettings}>
              <Download size={16} className="mr-2" />
              Exportar Configuración
            </Button>
            <Button variant="outline">
              <Upload size={16} className="mr-2" />
              Importar Configuración
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card title="Autenticación y Acceso">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autenticación de Dos Factores</p>
              <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={settings.security.twoFactorEnabled ? 'success' : 'secondary'}>
                {settings.security.twoFactorEnabled ? 'Activado' : 'Desactivado'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
              >
                {settings.security.twoFactorEnabled ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Sesión (minutos)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="480">8 horas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiración de Contraseña (días)
              </label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => handleInputChange('security', 'passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 días</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
                <option value="180">180 días</option>
                <option value="never">Nunca</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intentos de Login Permitidos
              </label>
              <select
                value={settings.security.loginAttempts}
                onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3 intentos</option>
                <option value={5}>5 intentos</option>
                <option value={10}>10 intentos</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Historial de Actividad">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Último acceso exitoso</p>
                <p className="text-xs text-gray-500">Hoy a las 09:30 AM desde Chrome</p>
              </div>
            </div>
            <Badge variant="success">Exitoso</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Sesión cerrada</p>
                <p className="text-xs text-gray-500">Ayer a las 18:45 PM</p>
              </div>
            </div>
            <Badge variant="secondary">Cerrada</Badge>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            Ver Historial Completo
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderAlarmsTab = () => (
    <div className="space-y-6">
      <Card title="Configuración de Alarmas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sonido Predeterminado
            </label>
            <select
              value={settings.alarms.defaultSound}
              onChange={(e) => handleInputChange('alarms', 'defaultSound', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bell">Campana</option>
              <option value="chime">Carillón</option>
              <option value="beep">Pitido</option>
              <option value="melody">Melodía</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de Snooze (minutos)
            </label>
            <select
              value={settings.alarms.snoozeTime}
              onChange={(e) => handleInputChange('alarms', 'snoozeTime', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 minutos</option>
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Repeticiones
            </label>
            <select
              value={settings.alarms.maxRetries}
              onChange={(e) => handleInputChange('alarms', 'maxRetries', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 vez</option>
              <option value={2}>2 veces</option>
              <option value={3}>3 veces</option>
              <option value={5}>5 veces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de Escalación (minutos)
            </label>
            <select
              value={settings.alarms.escalationTime}
              onChange={(e) => handleInputChange('alarms', 'escalationTime', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo Fin de Semana</p>
              <p className="text-sm text-gray-500">Ajustar alarmas automáticamente los fines de semana</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alarms.weekendMode}
                onChange={(e) => handleInputChange('alarms', 'weekendMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Prueba de Sonidos">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['bell', 'chime', 'beep', 'melody'].map((sound) => (
            <Button
              key={sound}
              variant="outline"
              onClick={() => console.log(`Playing sound: ${sound}`)}
              className="flex flex-col items-center p-4 h-20"
            >
              <Volume2 size={20} className="mb-2" />
              <span className="text-sm capitalize">{sound}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia en PillCare 360</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Restablecer
            </Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* Alert de éxito */}
        {showSuccess && (
          <Alert
            type="success"
            message="Configuración guardada correctamente"
            onClose={() => setShowSuccess(false)}
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
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'system' && renderSystemTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'alarms' && renderAlarmsTab()}
          </div>
        </Card>

        {/* Información adicional */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle size={20} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">¿Necesitas ayuda?</p>
                <p className="text-sm text-gray-500">
                  Consulta nuestra documentación o contacta al soporte técnico
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Documentación
              </Button>
              <Button variant="outline" size="sm">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </Card>

        {/* Información del sistema */}
        <Card title="Información del Sistema">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Versión</p>
              <p className="text-lg font-semibold text-gray-900">PillCare 360 v2.1.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actualización</p>
              <p className="text-lg font-semibold text-gray-900">07 Dic 2024</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Licencia</p>
              <p className="text-lg font-semibold text-gray-900">Profesional</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};