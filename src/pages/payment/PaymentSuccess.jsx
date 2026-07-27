import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '4rem', color: '#27ae60' }}>&#10003;</div>
      <h1 style={{ margin: '1rem 0 0.5rem' }}>Payment Successful!</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Your order has been placed and payment received.
      </p>
      {orderId && (
        <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#888' }}>
          Order ID: <strong>{orderId}</strong>
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/products" style={btnPrimary}>Continue Shopping</Link>
        <Link to="/orders" style={btnSecondary}>View My Orders</Link>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: '2rem',
  textAlign: 'center',
};
const btnPrimary = {
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
};
const btnSecondary = {
  padding: '0.75rem 2rem',
  background: '#fff',
  color: '#667eea',
  border: '2px solid #667eea',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
};
