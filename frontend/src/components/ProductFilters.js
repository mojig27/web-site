import { useState } from 'react';

export default function ProductFilters({ onFilter }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    onFilter({ search, category });
  };

  return (
    <div>
      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
       {/* Add more categories as needed */}
      </select>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
}