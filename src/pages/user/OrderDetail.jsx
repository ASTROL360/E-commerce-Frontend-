import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './userPages.css';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    orderService.getById(id).then((res) => {
      setOrder(unwrap(res));
    }).catch((err) => {
      setError(err.message || 'Failed to load order');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !order) {
    return (
      <div className="order-detail-page">
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/orders" className="order-detail-link">&larr; Back to Orders</Link>
      </div>
    );
  }

  const ship = order.shippingAddress || {};

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="order-detail-link">&larr; Back to Orders</Link>
      <h1 className="order-detail-title">Order {order.id}</h1>

      <div className="order-detail-card">
        <div className="order-detail-summary">
          <div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong>
              <span
                className="order-detail-badge"
                style={{ '--badge-color': statusColors[order.status] || '#888' }}
              >
                {order.status}
              </span>
            </p>
          </div>
          <p className="order-detail-price">₦{Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      <div className="order-detail-card">
        <h3>Shipping Address</h3>
        <p>{ship.fullName}</p>
        <p>{ship.line1}</p>
        <p>{ship.city}, {ship.state} {ship.postalCode}</p>
        <p>{ship.country}</p>
      </div>

      <div className="order-detail-card">
        <h3>Order Items</h3>
        <table className="order-detail-table">
          <thead>
            <tr className="order-detail-thead">
              <th className="order-detail-th">Product</th>
              <th className="order-detail-th">Qty</th>
              <th className="order-detail-th">Unit Price</th>
              <th className="order-detail-th">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={item.productId || idx} className="order-detail-tr">
                <td className="order-detail-td">{item.productName || 'Product'}</td>
                <td className="order-detail-td">{item.quantity}</td>
                <td className="order-detail-td">₦{Number(item.unitPrice).toFixed(2)}</td>
                <td className="order-detail-td">₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
