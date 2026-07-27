import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockOrders } from '../../data/mockData';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = statusFilter === 'ALL'
    ? mockOrders
    : mockOrders.filter((o) => o.status === statusFilter);

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Orders</h1>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              ...filterBtn,
              background: statusFilter === s ? '#667eea' : '#e0e0e0',
              color: statusFilter === s ? '#fff' : '#333',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
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
              <td style={tdStyle}>
                <Link to={`/admin/orders/${o.id}`} style={viewBtn}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '0.75rem 0.5rem' };
const tdStyle = { padding: '0.75rem 0.5rem' };
const filterBtn = { padding: '0.4rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' };
const viewBtn = { padding: '0.3rem 0.75rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem' };
