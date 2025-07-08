// src/services/api.ts

interface DashboardStats {
  totalPatients: number;
  activeTreatments: number;
  todayDoses: number;
  pendingAlerts: number;
  complianceRate: number;
}

interface Activity {
  id: number;
  patient: string;
  action: string;
  medication: string;
  time: string;
  status: string;
}

interface Dose {
  id: number;
  patient: string;
  medication: string;
  time: string;
  priority: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirm_password: string; // Agregar este campo requerido por la API
  role: string;
}

class ApiService {
  baseURL: string;
  token: string | null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    this.token = localStorage.getItem('access_token');
  }

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Sesión expirada');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ----- Autenticación -----

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    try {
      console.log('Intentando login con:', { email, password: '***' });
      
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      console.log('Respuesta login:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Error en el login';
        try {
          const errorData = await response.json();
          console.log('Error de login detallado:', errorData);
          
          if (response.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
          } else if (response.status === 422) {
            errorMessage = 'Formato de datos inválido.';
          } else {
            errorMessage = errorData.message || 'Error en el servidor';
          }
        } catch (parseError) {
          console.error('Error parsing login response:', parseError);
          if (response.status === 401) {
            errorMessage = 'Credenciales inválidas';
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login exitoso:', { ...data, access_token: '***' });
      
      this.token = data.access_token;
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('authToken', this.token); // Para compatibilidad
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ message: string; user: User }> {
    try {
      console.log('Enviando datos de registro:', userData);
      
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        // Intentar obtener el mensaje de error detallado
        let errorMessage = 'Error en el registro';
        try {
          const errorData = await response.json();
          console.log('Error detallado:', errorData);
          
          if (response.status === 422) {
            // Error de validación - mostrar detalles específicos
            if (errorData.detail && Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map((err: any) => 
                `${err.loc?.join('.')}: ${err.msg}`
              ).join(', ');
              errorMessage = `Errores de validación: ${validationErrors}`;
            } else {
              errorMessage = 'Datos inválidos. Verifica que todos los campos estén correctos.';
            }
          } else if (response.status === 409) {
            errorMessage = 'El email ya está registrado';
          } else if (response.status === 400) {
            errorMessage = errorData.message || 'Datos inválidos';
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.clear(); // Limpiar todo por seguridad
    sessionStorage.clear();
    
    // Limpiar cookies
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    window.location.href = '/auth/login';
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  // ----- Dashboard -----

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Intentar obtener stats reales de la API
      const stats = await this.request('/dashboard/stats');
      return stats;
    } catch (error) {
      console.warn('Failed to fetch real stats, using fallback');
      // Fallback con datos simulados
      const patients = await this.getPatients().catch(() => []);
      const treatments = await this.getTreatments().catch(() => []);
      
      return {
        totalPatients: patients.length || 24,
        activeTreatments: treatments.filter((t: any) => t.status === 'active').length || 45,
        todayDoses: 128,
        pendingAlerts: 3,
        complianceRate: 89,
      };
    }
  }

  async getRecentActivity(): Promise<Activity[]> {
    try {
      return await this.request('/dashboard/recent-activity');
    } catch (error) {
      console.warn('Failed to fetch real activity, using fallback');
      return [
        {
          id: 1,
          patient: 'María García',
          action: 'Dosis tomada',
          medication: 'Aspirina 100mg',
          time: '10:30 AM',
          status: 'completed',
        },
        {
          id: 2,
          patient: 'Juan Pérez',
          action: 'Dosis perdida',
          medication: 'Metformina 500mg',
          time: '09:00 AM',
          status: 'missed',
        },
      ];
    }
  }

  async getUpcomingDoses(): Promise<Dose[]> {
    try {
      return await this.request('/dashboard/upcoming-doses');
    } catch (error) {
      console.warn('Failed to fetch real doses, using fallback');
      return [
        {
          id: 1,
          patient: 'Carlos Rodríguez',
          medication: 'Enalapril 10mg',
          time: '14:00',
          priority: 'high',
        },
        {
          id: 2,
          patient: 'Elena Martín',
          medication: 'Omeprazol 20mg',
          time: '14:30',
          priority: 'medium',
        },
      ];
    }
  }

  // ----- Pacientes -----

  async getPatients(params: Record<string, any> = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients?${queryString}`);
  }

  async getPatient(id: number): Promise<any> {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patientData: any): Promise<any> {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: number, patientData: any): Promise<any> {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: number): Promise<void> {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // ----- Medicamentos -----

  async getMedications(params: Record<string, any> = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/medications?${queryString}`);
  }

  async getMedication(id: number): Promise<any> {
    return this.request(`/medications/${id}`);
  }

  async createMedication(medicationData: any): Promise<any> {
    return this.request('/medications', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  }

  async searchMedications(query: string): Promise<any[]> {
    return this.request(`/medications/search/by-name?q=${encodeURIComponent(query)}`);
  }

  // ----- Tratamientos -----

  async getTreatments(params: Record<string, any> = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/treatments?${queryString}`);
  }

  async getTreatment(id: number): Promise<any> {
    return this.request(`/treatments/${id}`);
  }

  async createTreatment(treatmentData: any): Promise<any> {
    return this.request('/treatments', {
      method: 'POST',
      body: JSON.stringify(treatmentData),
    });
  }

  async updateTreatment(id: number, treatmentData: any): Promise<any> {
    return this.request(`/treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(treatmentData),
    });
  }

  async deleteTreatment(id: number): Promise<void> {
    return this.request(`/treatments/${id}`, {
      method: 'DELETE',
    });
  }

  async getPatientTreatments(patientId: number): Promise<any[]> {
    return this.request(`/treatments/patient/${patientId}/active`);
  }

  // ----- Health check -----

  async checkHealth(): Promise<any> {
    try {
      return await this.request('/health');
    } catch (error) {
      console.warn('Health check failed:', error);
      return { status: 'unknown', message: 'Cannot connect to API' };
    }
  }

  // ----- Utility methods -----

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

const apiService = new ApiService();
export default apiService;