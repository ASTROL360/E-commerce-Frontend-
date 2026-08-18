import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?returnUrl=/checkout');
      return;
    }
    addressService.getAll().then((res) => {
      const saved = unwrap(res) || [];
      setAddresses(saved);
      const defaultAddr = saved.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (saved.length > 0) setSelectedAddressId(saved[0].id);
    }).catch(() => {
      setError('Failed to load addresses');
    }).finally(() => setInitialLoading(false));
  }, [user, navigate]);

  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (addresses.length === 0) {
      setError('Please add a shipping address before checking out');
      return;
    }
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await orderService.checkoutFromCart(selectedAddressId);
      const order = unwrap(res);

      const payRes = await paymentService.initialize(order.id, `${window.location.origin}/payment/verify`);
      const payment = unwrap(payRes);

      clearCart();
      if (payment.authorizationUrl) {
        window.location.href = payment.authorizationUrl;
      } else if (payment.reference) {
        navigate('/payment/verify?reference=' + payment.reference);
      } else {
        navigate('/payment/success?orderId=' + order.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Loading />;
  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            {addresses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-500 mb-4">No saved addresses. Please add one first.</p>
                <Link to="/addresses?returnUrl=/checkout" className="inline-block bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
                  Add Address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900">{addr.label}</strong>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-600">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-sm text-gray-500">{addr.country}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.productName} x {item.quantity}</span>
                  <span className="text-gray-900 font-medium flex-shrink-0">₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
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

            <button
              onClick={handlePlaceOrder}
              disabled={loading || addresses.length === 0}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {addresses.length === 0 ? 'Add a shipping address first' : 'Pay with Paystack'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
