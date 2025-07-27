// Constantes de rutas para fácil mantenimiento
export const ROUTES = {
  // Ruta principal
  HOME: '/',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  
  // Pacientes
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients/create',
    DETAIL: (id: string) => `/patients/${id}`,
    EDIT: (id: string) => `/patients/${id}/edit`,
  },
  
  // Tratamientos
  TREATMENTS: {
    LIST: '/treatments',
    CREATE: '/treatments/create',
    DETAIL: (id: string) => `/treatments/${id}`,
    EDIT: (id: string) => `/treatments/${id}/edit`,
    ALARMS: '/treatments/alarms',
  },
  
  // Monitoreo
  MONITORING: {
    OVERVIEW: '/monitoring',
    ALERTS: '/monitoring/alerts',
    COMPLIANCE: '/monitoring/compliance',
    HISTORY: '/monitoring/history',
    REPORTS: '/monitoring/reports',
  },
  
  // Configuración
  SETTINGS: '/settings',
} as const;

// Tipos para las rutas
export type RouteKey = keyof typeof ROUTES;

// Rutas públicas (no requieren autenticación)
export const PUBLIC_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
];

// Rutas protegidas (requieren autenticación)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PATIENTS.LIST,
  ROUTES.PATIENTS.CREATE,
  ROUTES.TREATMENTS.LIST,
  ROUTES.TREATMENTS.CREATE,
  ROUTES.TREATMENTS.ALARMS,
  ROUTES.MONITORING.OVERVIEW,
  ROUTES.MONITORING.ALERTS,
  ROUTES.MONITORING.COMPLIANCE,
  ROUTES.MONITORING.HISTORY,
  ROUTES.MONITORING.REPORTS,
  ROUTES.SETTINGS,
];

// Configuración de navegación para el sidebar
export const NAVIGATION_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'Home'
  },
  {
    key: 'patients',
    label: 'Pacientes',
    path: ROUTES.PATIENTS.LIST,
    icon: 'Users'
  },
  {
    key: 'treatments',
    label: 'Tratamientos',
    path: ROUTES.TREATMENTS.LIST,
    icon: 'Pill'
  },
  {
    key: 'alarms',
    label: 'Alarmas',
    path: ROUTES.TREATMENTS.ALARMS,
    icon: 'Calendar'
  },

  {
    key: 'reports',
    label: 'Reportes',
    path: ROUTES.MONITORING.REPORTS,
    icon: 'BarChart3'
  },
  {
    key: 'alerts',
    label: 'Alertas',
    path: ROUTES.MONITORING.ALERTS,
    icon: 'AlertTriangle'
  }
] as const;