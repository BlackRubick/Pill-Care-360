export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'caregiver' | 'patient';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'caregiver' | 'patient';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}