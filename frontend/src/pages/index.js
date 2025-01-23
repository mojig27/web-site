// src/pages/index.js
import React from 'react';
import Head from 'next/head';
import App from '../components/App';
import '../styles/index.css'; // فرض بر این است که فایل استایل شما در پوشه styles قرار دارد

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
      </Head>
      <App />
    </div>
  );
}