// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();
  
  const productUrls = products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productUrls,
  ];
}