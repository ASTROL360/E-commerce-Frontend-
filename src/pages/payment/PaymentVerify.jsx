import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const navigate = useNavigate();
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
      const data = unwrap(res);
      setStatus(data?.status);
      setOrderId(data?.orderId || null);
    }).catch((err) => {
      setError(err.response?.data?.message || err.message || 'Failed to verify payment');
    }).finally(() => setLoading(false));
  }, [reference]);

  useEffect(() => {
    if (status === 'SUCCESS') {
      const timer = setTimeout(() => navigate('/'), 2500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (loading) return <Loading />;

  const success = status === 'SUCCESS';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      {error ? (
        <>
          <ErrorMessage message={error} />
          <div className="flex gap-4 mt-8">
            <Link to="/checkout" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
              Back to Checkout
            </Link>
            <Link to="/orders" className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              My Orders
            </Link>
          </div>
        </>
      ) : success ? (
        <>
          <div className="text-6xl text-success mb-4">&#10003;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 text-lg">
            Your order has been placed and payment received.
          </p>
          {orderId && (
            <p className="mt-2 text-sm text-gray-400">
              Order ID: <strong>{orderId}</strong>
            </p>
          )}
          <p className="mt-8 text-gray-400">
            Redirecting you to the home page...
          </p>
        </>
      ) : (
        <>
          <div className="text-6xl text-danger mb-4">&#10007;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Completed</h1>
          <p className="text-gray-500 text-lg">
            Your payment was not completed. Your order is still pending.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/checkout" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
              Try Again
            </Link>
            <Link to="/products" className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
