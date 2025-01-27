// frontend/src/components/ProductCard.tsx
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <FiHeart className="text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="text-sm text-blue-600 mb-1">{product.category}</div>
        <h3 className="font-medium mb-2">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </span>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <FiShoppingCart />
            خرید
          </button>
        </div>
      </div>
    </motion.div>
  );
}