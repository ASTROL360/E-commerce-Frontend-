import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      productService.getAll({ page: 0, size: 1 }),
      orderService.getAllOrders({ page: 0, size: 1000 }),
    ]).then(([prodRes, orderRes]) => {
      const page = orderRes.data?.data || {};
      setProductCount(prodRes.data?.data?.totalElements || 0);
      setOrderCount(page.totalElements || 0);
      setOrders(page.content || []);
    }).catch((err) => {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter((o) => ['PAID', 'SHIPPED', 'DELIVERED'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {error && <div style={{ marginTop: '1rem' }}><ErrorMessage message={error} /></div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {[
          { label: 'Total Products', value: productCount, bg: '#667eea' },
          { label: 'Total Orders', value: orderCount, bg: '#00b894' },
          { label: 'Total Revenue', value: `₦${totalRevenue.toFixed(2)}`, bg: '#f39c12' },
        ].map((s) => (
          <div key={s.label} style={{ ...statCard, background: s.bg }}>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{s.label}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.25rem 0 0' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Recent Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const ship = o.shippingAddress || {};
            return (
              <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{o.id}</td>
                <td style={tdStyle}>{ship.fullName || '-'}</td>
                <td style={tdStyle}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>₦{Number(o.totalAmount).toFixed(2)}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', background: statusColors[o.status] || '#888', color: '#fff', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {o.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const statCard = { padding: '1.25rem', borderRadius: '8px', color: '#fff' };
const thStyle = { padding: '0.75rem 0.5rem' };
const tdStyle = { padding: '0.75rem 0.5rem' };
