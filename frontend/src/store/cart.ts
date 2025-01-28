// src/store/cart.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const items = get().items;
        set({ 
          items: [...items, item],
          total: get().total + item.price
        });
      },
      removeItem: (itemId) => {
        const items = get().items;
        const item = items.find(i => i.id === itemId);
        set({ 
          items: items.filter(i => i.id !== itemId),
          total: get().total - (item?.price || 0)
        });
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, total: state.total })
    }
  )
);