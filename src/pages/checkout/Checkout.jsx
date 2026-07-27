import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { mockAddresses } from '../../data/mockData';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?returnUrl=/checkout');
      return;
    }
    const saved = mockAddresses;
    setAddresses(saved);
    const defaultAddr = saved.find((a) => a.isDefault);
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    else if (saved.length > 0) setSelectedAddressId(saved[0].id);
  }, [user, navigate]);

  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
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
      const orderData = {
        addressId: selectedAddressId,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };
      const orderId = 'ORD-' + Date.now();
      console.log('Order created:', orderId, orderData);
      clearCart();
      navigate('/payment/success?orderId=' + orderId);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Checkout</h1>
      {error && <ErrorMessage message={error} />}

      <section style={sectionStyle}>
        <h2>1. Shipping Address</h2>
        {addresses.length === 0 ? (
          <div>
            <p>No saved addresses. Please add one first.</p>
            <Link to="/addresses" style={linkStyle}>Add Address</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {addresses.map((addr) => (
              <label
                key={addr.id}
                style={{
                  ...addrCardStyle,
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
                  {addr.isDefault && <span style={defaultBadge}>Default</span>}
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h2>2. Order Summary</h2>
        {cart.map((item) => (
          <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            <span>{item.product.name} x {item.quantity}</span>
            <span>₦{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span><span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Shipping</span><span>{shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>
            <span>Total</span><span>₦{total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>3. Payment</h2>
        <button onClick={handlePlaceOrder} style={payBtn} disabled={loading || addresses.length === 0}>
          Pay with Paystack
        </button>
      </section>
    </div>
  );
}

const sectionStyle = { marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' };
const addrCardStyle = { display: 'flex', gap: '0.75rem', padding: '1rem', border: '2px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: '#fff' };
const defaultBadge = { marginLeft: '0.5rem', background: '#667eea', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' };
const linkStyle = { color: '#667eea', textDecoration: 'underline' };
const payBtn = { padding: '0.75rem 2rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600, width: '100%' };
