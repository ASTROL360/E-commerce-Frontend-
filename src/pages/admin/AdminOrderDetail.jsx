import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOrders } from '../../data/mockData';
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
  const order = mockOrders.find((o) => o.id === id || String(o.id) === String(id));
  const [status, setStatus] = useState(order?.status || '');

  if (!order) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
        <ErrorMessage message="Order not found" />
        <Link to="/admin/orders" style={{ color: '#667eea' }}>&larr; Back to Orders</Link>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    // await orderService.updateStatus(id, status);
    console.log('Updating order', id, 'to status:', status);
    alert('Status updated to: ' + status);
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <Link to="/admin/orders" style={{ color: '#667eea' }}>&larr; Back to Orders</Link>
      <h1 style={{ marginTop: '0.5rem' }}>Order {order.id}</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> {order.shippingFullName}</p>
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
        <p>{order.shippingFullName}</p>
        <p>{order.shippingLine1}</p>
        <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
        <p>{order.shippingCountry}</p>
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
            {(order.items || []).map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{item.product?.name || 'Product'}</td>
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
