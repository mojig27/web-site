import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';

export default function Products() {
  const [products, setProducts] = useState([]);

  const handleSearch = (results) => {
    setProducts(results);
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <ul className="mt-4">
        {products.map((product) => (
          <li key={product._id} className="border-b p-2">{product.name}</li>
        ))}
      </ul>
    </div>
  );
}