// src/store/orderStore.ts
interface OrderStore {
    currentOrder: {
      items: CartItem[];
      shipping: {
        address: string;
        method: 'express' | 'normal';
        cost: number;
      };
      payment: {
        method: 'online' | 'cash';
        status: 'pending' | 'paid' | 'failed';
      };
      total: number;
    };
    createOrder: () => Promise<void>;
    processPayment: () => Promise<void>;
  }