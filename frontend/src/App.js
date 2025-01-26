// src/App.js
import React from 'react';
import SearchBar from './components/SearchBar';
import Products from './pages/Products';

function App() {
  return (
    <div>
      <SearchBar />
      <Products />
    </div>
  );
}

export default App;