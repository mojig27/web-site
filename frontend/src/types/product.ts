// frontend/src/types/product.ts
export interface IProduct {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    brand: string;
    specifications: {
      material: string;
      dimensions: string;
      colors: string[];
      warranty: string;
      madeIn: string;
    };
    installationGuide?: string;
    stock: number;
    discount?: {
      percent: number;
      validUntil: Date;
    };
    isAvailable: boolean;
  }