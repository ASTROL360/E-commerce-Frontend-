import { Link } from 'react-router-dom';
import { mockProducts, mockOrders } from '../../data/mockData';

export default function Dashboard() {
  const totalRevenue = mockOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const recentOrders = mockOrders.slice(0, 5);

  const statusColors = {
    PENDING: '#f39c12',
    PAID: '#3498db',
    SHIPPED: '#9b59b6',
    DELIVERED: '#27ae60',
    CANCELLED: '#e74c3c',
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {[
          { label: 'Total Products', value: mockProducts.length, bg: '#667eea' },
          { label: 'Total Orders', value: mockOrders.length, bg: '#00b894' },
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
          {recentOrders.map((o) => (
            <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{o.id}</td>
              <td style={tdStyle}>{o.shippingFullName}</td>
              <td style={tdStyle}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>₦{Number(o.totalAmount).toFixed(2)}</td>
              <td style={tdStyle}>
                <span style={{ padding: '2px 8px', background: statusColors[o.status] || '#888', color: '#fff', borderRadius: '12px', fontSize: '0.8rem' }}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {[
          { to: '/admin/products', label: 'Manage Products' },
          { to: '/admin/orders', label: 'Manage Orders' },
          { to: '/admin/categories', label: 'Manage Categories' },
        ].map((l) => (
          <Link key={l.to} to={l.to} style={quickLink}>{l.label}</Link>
        ))}
      </div>
    </div>
  );
}

const statCard = { padding: '1.25rem', borderRadius: '8px', color: '#fff' };
const thStyle = { padding: '0.75rem 0.5rem' };
const tdStyle = { padding: '0.75rem 0.5rem' };
const quickLink = {
  flex: 1,
  display: 'block',
  textAlign: 'center',
  padding: '1rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  minWidth: 180,
};
