import { useState } from 'react';
import SearchBar from '../components/SearchBar';

export default function Products() {
  const [products, setProducts] = useState([]);

  const handleSearch = (results) => {
    setProducts(results);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}