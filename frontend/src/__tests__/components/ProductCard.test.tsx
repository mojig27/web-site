// src/__tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100000,
    image: '/test.jpg',
  };

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('۱۰۰,۰۰۰ تومان')).toBeInTheDocument();
  });

  it('handles add to cart action', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /افزودن به سبد خرید/i }));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});