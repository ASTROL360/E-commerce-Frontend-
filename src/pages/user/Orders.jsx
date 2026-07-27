import { Link } from 'react-router-dom';
import { mockOrders } from '../../data/mockData';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

export default function Orders() {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>My Orders</h1>
      {mockOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>No orders yet.</p>
          <Link to="/products" style={linkStyle}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {mockOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} style={orderCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <strong>{order.id}</strong>
                  <span style={{ marginLeft: '1rem', color: '#888' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span style={badgeStyle(statusColors[order.status] || '#888')}>
                  {order.status}
                </span>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
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

const orderCardStyle = {
  display: 'block',
  padding: '1rem 1.25rem',
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
};
const badgeStyle = (color) => ({
  padding: '2px 10px',
  background: color,
  color: '#fff',
  borderRadius: '12px',
  fontSize: '0.8rem',
  fontWeight: 600,
});
const linkStyle = {
  display: 'inline-block',
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  marginTop: '0.5rem',
};
