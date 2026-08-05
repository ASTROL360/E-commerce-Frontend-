import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    orderService.getById(id).then((res) => {
      const ord = res.data?.data;
      setOrder(ord);
      setStatus(ord?.status || '');
    }).catch((err) => {
      setError(err.message || 'Failed to load order');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !order) {
    return (
      <div style={{ maxWidth: 800, padding: '2rem' }}>
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/admin/orders" style={{ color: '#667eea' }}>&larr; Back to Orders</Link>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    try {
      await orderService.updateStatus(id, status);
      alert('Status updated to: ' + status);
      const res = await orderService.getById(id);
      setOrder(res.data?.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const ship = order.shippingAddress || {};

  return (
    <div style={{ maxWidth: 800, padding: '2rem' }}>
      <Link to="/admin/orders" style={{ color: '#667eea' }}>&larr; Back to Orders</Link>
      <h1 style={{ marginTop: '0.5rem' }}>Order {order.id}</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> {ship.fullName || '-'}</p>
          </div>
          <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>₦{Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      <div style={cardStyle}>
        <h3>Update Status</h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handleUpdateStatus} style={updateBtn}>Update Status</button>
        </div>
      </div>

      <div style={cardStyle}>
        <h3>Shipping Address</h3>
        <p>{ship.fullName}</p>
        <p>{ship.line1}</p>
        <p>{ship.city}, {ship.state} {ship.postalCode}</p>
        <p>{ship.country}</p>
      </div>

      <div style={cardStyle}>
        <h3>Order Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Product</th>
              <th style={{ padding: '0.5rem' }}>Qty</th>
              <th style={{ padding: '0.5rem' }}>Unit Price</th>
              <th style={{ padding: '0.5rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={item.productId || idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{item.productName || 'Product'}</td>
                <td style={{ padding: '0.5rem' }}>{item.quantity}</td>
                <td style={{ padding: '0.5rem' }}>₦{Number(item.unitPrice).toFixed(2)}</td>
                <td style={{ padding: '0.5rem' }}>₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = { padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' };
const selectStyle = { padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' };
const updateBtn = { padding: '0.5rem 1.5rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
