import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Your cart is empty</h2>
        <Link to="/products" style={linkStyle}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Shopping Cart</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {cart.map((item) => (
          <div key={item.product.id} style={itemStyle}>
            <img
              src={item.product.imageUrl || '/placeholder.png'}
              alt={item.product.name}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
            />
            <div style={{ flex: 1 }}>
              <Link to={`/products/${item.product.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                <h3 style={{ margin: 0 }}>{item.product.name}</h3>
              </Link>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>₦{Number(item.product.price).toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={qtyBtn}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={qtyBtn}>+</button>
            </div>
            <p style={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
              ₦{(Number(item.product.price) * item.quantity).toFixed(2)}
            </p>
            <button onClick={() => removeItem(item.product.id)} style={removeBtn}>&times;</button>
          </div>
        ))}
      </div>

      <div style={summaryStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Subtotal</span>
          <span>₦{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}</span>
        </div>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {user ? (
            <Link to="/checkout" style={{ ...btnStyle, textAlign: 'center', flex: 1 }}>Proceed to Checkout</Link>
          ) : (
            <Link to="/login?returnUrl=/checkout" style={{ ...btnStyle, textAlign: 'center', flex: 1 }}>Login to Checkout</Link>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/products" style={{ color: '#667eea' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #eee',
};
const qtyBtn = {
  width: 32,
  height: 32,
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
};
const removeBtn = {
  background: 'none',
  border: 'none',
  color: '#e74c3c',
  fontSize: '1.25rem',
  cursor: 'pointer',
};
const summaryStyle = {
  marginTop: '2rem',
  padding: '1.5rem',
  background: '#f8f9fa',
  borderRadius: '8px',
};
const btnStyle = {
  display: 'block',
  padding: '0.75rem 1.5rem',
  background: '#667eea',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
};
const linkStyle = {
  display: 'inline-block',
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  marginTop: '1rem',
};
