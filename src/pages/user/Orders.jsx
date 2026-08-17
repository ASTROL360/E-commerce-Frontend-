import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import './userPages.css';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
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
    <div className="orders-page">
      <h1>My Orders</h1>
      {error && <p className="orders-error">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet.</p>
          <Link to="/products" className="orders-link">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="orders-card">
              <div className="orders-card-header">
                <div>
                  <strong>{order.id}</strong>
                  <span className="orders-card-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className="orders-badge"
                  style={{ '--badge-color': statusColors[order.status] || '#888' }}
                >
                  {order.status}
                </span>
              </div>
              <div className="orders-card-footer">
                <span>{order.items?.length || 0} item(s)</span>
                <strong>₦{Number(order.totalAmount).toFixed(2)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
