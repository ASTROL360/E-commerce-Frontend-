import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    paymentService.verify(reference).then((res) => {
      const data = res.data?.data || res.data;
      setStatus(data?.status);
      setOrderId(data?.orderId || null);
    }).catch((err) => {
      setError(err.response?.data?.message || err.message || 'Failed to verify payment');
    }).finally(() => setLoading(false));
  }, [reference]);

  if (loading) return <Loading />;

  const success = status === 'SUCCESS';

  return (
    <div style={containerStyle}>
      {error ? (
        <>
          <ErrorMessage message={error} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/checkout" style={btnPrimary}>Back to Checkout</Link>
            <Link to="/orders" style={btnSecondary}>My Orders</Link>
          </div>
        </>
      ) : success ? (
        <>
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
        </>
      ) : (
        <>
          <div style={{ fontSize: '4rem', color: '#e74c3c' }}>&#10007;</div>
          <h1 style={{ margin: '1rem 0 0.5rem' }}>Payment Not Completed</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Your payment was not completed. Your order is still pending.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/checkout" style={btnPrimary}>Try Again</Link>
            <Link to="/products" style={btnSecondary}>Continue Shopping</Link>
          </div>
        </>
      )}
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
