// src/lib/api.ts
import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'خطایی رخ داد';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const fetchProducts = async (page = 1, limit = 10) => {
  try {
    const { data } = await api.get(`/products?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};