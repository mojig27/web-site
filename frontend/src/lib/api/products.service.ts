// frontend/src/lib/api/products.service.ts
import { api } from './client';
import { ProductsResponse, Product } from '@/types/api';

export const productsService = {
  async getProducts(page = 1, limit = 10) {
    return api.get<ProductsResponse>(`/products?page=${page}&limit=${limit}`);
  },

  async getProduct(id: string) {
    return api.get<Product>(`/products/${id}`);
  },

  async searchProducts(query: string) {
    return api.get<ProductsResponse>(`/products/search?q=${query}`);
  }
};