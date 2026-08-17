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
    <div className="checkout-page">
      <h1>Checkout</h1>
      {error && <ErrorMessage message={error} />}

      <section className="checkout-section">
        <h2>1. Shipping Address</h2>
        {addresses.length === 0 ? (
          <div>
            <p>No saved addresses. Please add one first.</p>
            <Link to="/addresses?returnUrl=/checkout" className="checkout-link">Add Address</Link>
          </div>
        ) : (
          <div className="checkout-addr-list">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className="checkout-addr-card"
                style={{
                  borderColor: selectedAddressId === addr.id ? '#667eea' : '#ddd',
                }}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                />
                <div>
                  <strong>{addr.label}</strong> - {addr.fullName}
                  <br />
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                  <br />
                  {addr.city}, {addr.state} {addr.postalCode}
                  <br />
                  {addr.country}
                  {addr.isDefault && <span className="checkout-default-badge">Default</span>}
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="checkout-section">
        <h2>2. Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="checkout-order-item">
            <span>{item.productName} x {item.quantity}</span>
            <span>₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-order-totals">
          <div className="checkout-order-row">
            <span>Subtotal</span><span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-order-row">
            <span>Shipping</span><span>{shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}</span>
          </div>
          <div className="checkout-order-total">
            <span>Total</span><span>₦{total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className="checkout-section">
        <h2>3. Payment</h2>
        <button onClick={handlePlaceOrder} className="checkout-pay-btn" disabled={loading}>
          {addresses.length === 0 ? 'Add a shipping address first' : 'Pay with Paystack'}
        </button>
      </section>
    </div>
  );
}
