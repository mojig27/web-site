// frontend/src/components/admin/layout/AdminLayout.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:mr-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// frontend/src/components/admin/layout/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  {
    title: 'داشبورد',
    path: '/admin',
    icon: 'dashboard'
  },
  {
    title: 'محصولات',
    path: '/admin/products',
    icon: 'products'
  },
  {
    title: 'سفارش‌ها',
    path: '/admin/orders',
    icon: 'orders'
  },
  {
    title: 'نظرات',
    path: '/admin/reviews',
    icon: 'reviews'
  },
  {
    title: 'کاربران',
    path: '/admin/users',
    icon: 'users'
  }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">پنل مدیریت</h1>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100
                ${router.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''}
              `}
            >
              <span className="mr-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};