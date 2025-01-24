import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // مسیر واردات به فایل App.js در پوشه src
import './styles/index.css'; // فرض بر این است که فایل استایل شما در پوشه styles قرار دارد

// ایجاد یک ریشه (root) برای رندر کردن کامپوننت‌ها
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
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