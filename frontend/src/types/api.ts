// frontend/src/types/api.ts
import { User, Product, Cart } from './index';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export interface CartResponse {
  cart: Cart;
}