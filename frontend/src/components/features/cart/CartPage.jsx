// frontend/src/components/features/cart/CartPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart 
} from '../../../store/slices/cartSlice';
import { formatPrice } from '../../../utils/helpers';
import Button from '../../common/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">سبد خرید شما خالی است</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.product._id} className="flex items-center border-b py-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 mx-4">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-gray-600">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(
                      item.product._id, 
                      parseInt(e.target.value)
                    )}
                    className="border rounded p-1"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product._id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">مجموع:</span>
              <span className="text-xl font-bold">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <Button
              className="w-full"
              onClick={() => {/* پرداخت */}}
            >
              ادامه فرآیند خرید
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;