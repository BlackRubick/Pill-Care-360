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
  // Agrega más campos si tu API los retorna
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
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('access_token', this.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  // ----- Dashboard -----

  async getDashboardStats(): Promise<DashboardStats> {
    const patients = await this.request('/patients');
    const treatments = await this.request('/treatments');
    const totalPatients = patients.length;
    const activeTreatments = treatments.filter((t: any) => t.status === 'active').length;

    return {
      totalPatients,
      activeTreatments,
      todayDoses: 0,
      pendingAlerts: 0,
      complianceRate: 89,
    };
  }

  async getRecentActivity(): Promise<Activity[]> {
    return [
      {
        id: 1,
        patient: 'María García',
        action: 'Dosis tomada',
        medication: 'Aspirina 100mg',
        time: '10:30 AM',
        status: 'completed',
      },
    ];
  }

  async getUpcomingDoses(): Promise<Dose[]> {
    return [
      {
        id: 1,
        patient: 'Carlos Rodríguez',
        medication: 'Enalapril 10mg',
        time: '14:00',
        priority: 'high',
      },
    ];
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
    return this.request('/health');
  }
}

const apiService = new ApiService();
export default apiService;
