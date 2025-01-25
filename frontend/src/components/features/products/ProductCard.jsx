// frontend/src/components/features/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/helpers';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            مشاهده
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;