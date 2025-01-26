// frontend/src/lib/api/cart.service.ts
import { api } from './client';
import { CartResponse } from '@/types/api';

export const cartService = {
  async getCart() {
    return api.get<CartResponse>('/cart');
  },

  async addToCart(productId: string, quantity = 1) {
    return api.post<CartResponse>('/cart/items', { productId, quantity });
  },

  async updateCartItem(productId: string, quantity: number) {
    return api.put<CartResponse>(`/cart/items/${productId}`, { quantity });
  },

  async removeFromCart(productId: string) {
    return api.delete<CartResponse>(`/cart/items/${productId}`);
  },

  async clearCart() {
    return api.delete<CartResponse>('/cart');
  }
};