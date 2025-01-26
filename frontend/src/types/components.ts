// frontend/src/types/components.ts
import { ReactNode } from 'react';
import { Product, CartItem } from './index';

// Layout Components
export interface LayoutProps {
  children: ReactNode;
}

// Button Components
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Form Components
export interface InputProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

// Product Components
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

// Cart Components
export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

// Navigation Components
export interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
}