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
    if (!this.token && endpoint !== '/auth/login') {
      // No token y no es login, no llamar API, lanzar error para que componente maneje
      throw new Error('Sesión expirada');
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        if (response.status === 401) {
          // No hacer logout automático aquí
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
    
    // Redirigir solo si no estamos ya en login para evitar loops
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  // ... otros métodos (getDashboardStats, etc.) igual que antes
}

const apiService = new ApiService();
export default apiService;
