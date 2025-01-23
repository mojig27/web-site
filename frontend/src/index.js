// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css'; // فرض بر این است که فایل استایل شما در پوشه styles قرار دارد

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);