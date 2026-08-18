import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <div className="text-6xl text-danger mb-4">&#10007;</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
      <p className="text-gray-500 text-lg">
        Your payment was not completed.
      </p>
      <div className="flex gap-4 mt-8">
        <Link to="/checkout" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
          Try Again
        </Link>
        <Link to="/products" className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
