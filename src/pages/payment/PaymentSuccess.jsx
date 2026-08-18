import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
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
      <div className="flex gap-4 mt-8">
        <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
          Continue Shopping
        </Link>
        <Link to="/orders" className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
