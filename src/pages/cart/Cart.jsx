import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getCloudinaryUrl } from '../../utils/productImageUtils';

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, subtotal, loading } = useCart();
  const { user } = useAuth();
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;
  const freeShippingThreshold = 50000;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <img
                src={getCloudinaryUrl(item.imageUrl, 160) || '/placeholder.png'}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                  {item.productName}
                </Link>
                <p className="text-sm text-gray-500 mt-1">₦{Number(item.unitPrice).toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors text-sm"
                >
                  -
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-200">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors text-sm"
                >
                  +
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900 w-24 text-right flex-shrink-0">
                ₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Link to="/products" className="text-sm text-primary hover:underline font-medium">
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-danger hover:underline font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            {shipping > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Free shipping progress</span>
                  <span>₦{(freeShippingThreshold - subtotal).toFixed(0)} away</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900 font-medium">{shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">₦{total.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="block w-full bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-xl font-semibold transition-colors">
                Proceed to Checkout
              </Link>
            ) : (
              <Link to="/login?returnUrl=/checkout" className="block w-full bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-xl font-semibold transition-colors">
                Login to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
