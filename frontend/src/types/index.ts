// frontend/src/types/index.ts

// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
  }
  
  // Auth Types
  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  // Product Types
  export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    isAvailable: boolean;
    createdBy: string;
    createdAt: string;
  }
  
  // Cart Types
  export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    title: string;
    image: string;
  }
  
  export interface Cart {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
  }