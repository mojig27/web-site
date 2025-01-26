// src/api/types.ts
import { User, Product, Cart } from '../types';

export interface APIResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

export interface CartResponse {
  cart: Cart;
}