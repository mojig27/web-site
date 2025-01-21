import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductFilters from './ProductFilters';
import { useRouter } from 'next/router';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products', { params: filters });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBuy = (productId) => {
    router.push(`/checkout?productId=${productId}`);
  };

  return (
    <div>
      <h1>Product List</h1>
      <ProductFilters onFilter={handleFilter} />
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.imageUrl} loading="lazy" alt={product.name} />
            <button onClick={() => handleBuy(product._id)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
}