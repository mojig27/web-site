// frontend/src/components/cart/CartItem.tsx
import Image from 'next/image';
import { CartItem as ICartItem } from '@/types';
import { formatPrice } from '@/utils/format';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove
}) => {
  const { product, quantity } = item;

  return (
    <div className="flex items-center py-4 border-b">
      <div className="relative w-24 h-24 ml-4">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{product.title}</h3>
        <div className="text-sm text-gray-600 mt-1">
          قیمت واحد: {formatPrice(product.price)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-3 py-1 border-x">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        <div className="text-lg font-semibold">
          {formatPrice(product.price * quantity)}
        </div>

        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 hover:text-red-600"
        >
          حذف
        </button>
      </div>
    </div>
  );
};

// frontend/src/pages/cart.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CartItem } from '@/components/cart';
import { Cart, CartItem as ICartItem } from '@/types';
import { cartService } from '@/services/cart.service';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await cartService.updateQuantity(productId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await cartService.removeFromCart(productId);
      setCart(response.data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>
        <p className="text-gray-600">سبد خرید شما خالی است</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item: ICartItem) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">خلاصه سفارش</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>تعداد اقلام:</span>
              <span>{cart.items.length}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>مبلغ کل:</span>
              <span>{formatPrice(cart.totalPrice)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ادامه فرآیند خرید
          </button>
        </div>
      </div>
    </div>
  );
}