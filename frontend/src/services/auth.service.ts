// src/services/auth.service.ts
export class AuthService {
    static async login(email: string, password: string) {
      const response = await api.post<{ token: string; user: IUser }>('/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  
    static async register(userData: {
      name: string;
      email: string;
      password: string;
      phone: string;
    }) {
      return await api.post('/auth/register', userData);
    }
  
    static async getProfile() {
      return await api.get<IUser>('/auth/profile');
    }
  }