// frontend/src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Button from '../common/Button';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">وب‌سایت من</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:rtl:space-x-reverse">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                صفحه اصلی
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900"
              >
                محصولات
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-gray-700">{user.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  خروج
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  ورود
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;