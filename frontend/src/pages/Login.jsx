// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            ورود به حساب کاربری
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="ایمیل"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="رمز عبور"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            ورود
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;