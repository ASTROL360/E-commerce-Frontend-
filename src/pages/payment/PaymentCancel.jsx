import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '4rem', color: '#e74c3c' }}>&#10007;</div>
      <h1 style={{ margin: '1rem 0 0.5rem' }}>Payment Cancelled</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Your payment was not completed.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/checkout" style={btnPrimary}>Try Again</Link>
        <Link to="/products" style={btnSecondary}>Continue Shopping</Link>
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
