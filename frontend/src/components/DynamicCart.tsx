// src/components/DynamicCart.tsx
import dynamic from 'next/dynamic';

const CartModal = dynamic(() => import('./CartModal'), {
  loading: () => <div>در حال بارگذاری سبد خرید...</div>,
  ssr: false // اگر نیازی به SSR ندارد
});