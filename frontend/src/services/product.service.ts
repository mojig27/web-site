// frontend/src/services/product.service.ts
import { api } from '../lib/api';
import { ProductsResponse, Product } from '../types/api';

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    return api.get<ProductsResponse>(`/products?${params.toString()}`);
  },

  async getProduct(id: string) {
    return api.get<Product>(`/products/${id}`);
  },

  async searchProducts(query: string) {
    return api.get<ProductsResponse>(`/products/search?q=${query}`);
  },

  async getRelatedProducts(id: string) {
    return api.get<Product[]>(`/products/${id}/related`);
  }
};