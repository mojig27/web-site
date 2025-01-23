import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/products/search?q=${query}`);
      onSearch(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center p-4">
      <input
        type="text"
        placeholder="Search for products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">Search</button>
    </form>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};