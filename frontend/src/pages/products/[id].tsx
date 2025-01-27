// frontend/src/pages/products/[id].tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiHeart, FiShare2, FiTruck, FiShield } from 'react-icons/fi';
import Image from 'next/image';

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // این داده‌ها باید از API دریافت شوند
  const product = {
    id: '1',
    title: 'گوشی هوشمند سامسونگ',
    price: 12500000,
    description: 'گوشی هوشمند سامسونگ با صفحه نمایش 6.5 اینچی و دوربین 48 مگاپیکسلی',
    images: [
      '/images/product1.jpg',
      '/images/product1-2.jpg',
      '/images/product1-3.jpg',
      '/images/product1-4.jpg',
    ],
    category: 'موبایل',
    stock: 10,
    specifications: [
      { key: 'صفحه نمایش', value: '6.5 اینچ' },
      { key: 'دوربین اصلی', value: '48 مگاپیکسل' },
      { key: 'باتری', value: '5000 میلی‌آمپر' },
      { key: 'رم', value: '8 گیگابایت' },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative h-24 rounded-md overflow-hidden cursor-pointer transition
                  ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.title} - تصویر ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="text-gray-600">{product.category}</div>
          </div>

          <div className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-gray-700">تعداد:</span>
            <div className="flex items-center border rounded-lg">
              <button
                className="p-2 hover:bg-gray-100 transition"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <FiMinus />
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                className="p-2 hover:bg-gray-100 transition"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              افزودن به سبد خرید
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <FiHeart className="text-gray-600" />
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <FiShare2 className="text-gray-600" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <FiTruck className="text-2xl text-blue-600" />
              <div>
                <div className="font-medium">ارسال سریع</div>
                <div className="text-sm text-gray-600">تحویل در 3 روز کاری</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <FiShield className="text-2xl text-blue-600" />
              <div>
                <div className="font-medium">گارانتی اصالت</div>
                <div className="text-sm text-gray-600">18 ماه گارانتی</div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">مشخصات فنی</h2>
            <div className="space-y-2">
              {product.specifications.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-gray-600">{spec.key}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}