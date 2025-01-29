// frontend/src/store/cartStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from '@/types/product';

interface CartItem extends IProduct {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: IProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item._id === product._id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            itemCount: get().itemCount + 1,
            total: get().total + product.price
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
            itemCount: get().itemCount + 1,
            total: get().total + product.price
          });
        }
      },

      removeItem: (productId) => {
        const items = get().items;
        const item = items.find(i => i._id === productId);
        if (item) {
          set({
            items: items.filter(i => i._id !== productId),
            itemCount: get().itemCount - item.quantity,
            total: get().total - (item.price * item.quantity)
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find(i => i._id === productId);
        if (item) {
          const quantityDiff = quantity - item.quantity;
          set({
            items: items.map(i =>
              i._id === productId ? { ...i, quantity } : i
            ),
            itemCount: get().itemCount + quantityDiff,
            total: get().total + (item.price * quantityDiff)
          });
        }
      },

      clearCart: () => set({ items: [], itemCount: 0, total: 0 }),
    }),
    {
      name: 'cart-storage'
    }
  )
);