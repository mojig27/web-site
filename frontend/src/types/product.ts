// src/types/product.ts
interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  images: string[];
  specifications: {
    brand: string;
    model: string;
    material: string;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    weight: number;
    colors: string[];
    warranty: string;
  };
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
}