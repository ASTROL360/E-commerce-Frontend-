import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';

const statusBg = {
  PENDING: 'bg-warning',
  PAID: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService.getMyOrders().then((res) => {
      const data = unwrap(res) || { content: [] };
      setOrders(data.content || []);
    }).catch(() => {
      setError('Failed to load orders');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <Link to="/products" className="text-primary hover:underline font-medium">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow block">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <strong className="text-gray-900">#{order.id}</strong>
                  <span className="text-gray-400 text-sm ml-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusBg[order.status] || 'bg-gray-400'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items?.length || 0} item(s)</span>
                <strong className="text-gray-900">₦{Number(order.totalAmount).toFixed(2)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
