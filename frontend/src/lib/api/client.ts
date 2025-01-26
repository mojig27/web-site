// frontend/src/lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { APIResponse } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
  }
}

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIResponse>) => {
        if (error.response) {
          throw new ApiError(
            error.response.status,
            error.response.data.message || 'خطای سرور',
            error.response.data.error
          );
        }
        throw new ApiError(500, 'خطا در ارتباط با سرور');
      }
    );
  }

  async get<T>(url: string) {
    const response = await this.client.get<APIResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any) {
    const response = await this.client.post<APIResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<APIResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<APIResponse<T>>(url);
    return response.data;
  }
}

export const api = new ApiClient();