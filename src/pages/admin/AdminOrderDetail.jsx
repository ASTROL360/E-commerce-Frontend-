import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import './admin.css';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    orderService.getById(id).then((res) => {
      const ord = unwrap(res);
      setOrder(ord);
      setStatus(ord?.status || '');
    }).catch((err) => {
      setError(err.message || 'Failed to load order');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !order) {
    return (
      <div className="admin-order-detail-page">
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/admin/orders" className="admin-order-detail-back">&larr; Back to Orders</Link>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    setSuccess('');
    try {
      await orderService.updateStatus(id, status);
      setSuccess('Status updated to: ' + status);
      const res = await orderService.getById(id);
      setOrder(unwrap(res));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const ship = order.shippingAddress || {};

  return (
    <div className="admin-order-detail-page">
      <Link to="/admin/orders" className="admin-order-detail-back">&larr; Back to Orders</Link>
      <h1 className="admin-order-detail-title">Order {order.id}</h1>

      <div className="admin-order-detail-card">
        <div className="admin-order-detail-card-header">
          <div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> {ship.fullName || '-'}</p>
          </div>
          <p className="admin-order-detail-amount">₦{Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      <div className="admin-order-detail-card">
        <h3>Update Status</h3>
        {success && <p className="admin-order-detail-success">{success}</p>}
        {error && <ErrorMessage message={error} />}
        <div className="admin-order-detail-status-row">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-order-detail-select">
            {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handleUpdateStatus} className="admin-order-detail-update-btn">Update Status</button>
        </div>
      </div>

      <div className="admin-order-detail-card">
        <h3>Shipping Address</h3>
        <p>{ship.fullName}</p>
        <p>{ship.line1}</p>
        <p>{ship.city}, {ship.state} {ship.postalCode}</p>
        <p>{ship.country}</p>
      </div>

      <div className="admin-order-detail-card">
        <h3>Order Items</h3>
        <table className="admin-order-detail-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={item.productId || idx}>
                <td>{item.productName || 'Product'}</td>
                <td>{item.quantity}</td>
                <td>₦{Number(item.unitPrice).toFixed(2)}</td>
                <td>₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
