// frontend/src/app/page.tsx
import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/Hero'
import Features from '@/components/Features'

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <Features />
    </>
  )
}