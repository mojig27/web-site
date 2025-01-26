// frontend/src/lib/api/auth.service.ts
import { api } from './client';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/api';

export const authService = {
  async login(credentials: LoginCredentials) {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterCredentials) {
    return api.post<AuthResponse>('/auth/register', data);
  },

  async getProfile() {
    return api.get<AuthResponse>('/auth/profile');
  },

  async logout() {
    return api.post('/auth/logout');
  }
};