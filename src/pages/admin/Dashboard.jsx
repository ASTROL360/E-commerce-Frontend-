import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';
import './admin.css';

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
      const page = unwrap(orderRes) || {};
      setProductCount(unwrap(prodRes)?.totalElements || 0);
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
    <div className="admin-dash-page">
      <h1>Admin Dashboard</h1>
      {error && <div className="admin-dash-error"><ErrorMessage message={error} /></div>}

      <div className="admin-dash-grid">
        {[
          { label: 'Total Products', value: productCount, bg: '#667eea' },
          { label: 'Total Orders', value: orderCount, bg: '#00b894' },
          { label: 'Total Revenue', value: `₦${totalRevenue.toFixed(2)}`, bg: '#f39c12' },
        ].map((s) => (
          <div key={s.label} className="admin-dash-card" style={{ background: s.bg }}>
            <p className="admin-dash-card-label">{s.label}</p>
            <p className="admin-dash-card-value">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="admin-dash-recent">Recent Orders</h2>
      <table className="admin-dash-table">
        <thead>
          <tr className="admin-dash-thead-row">
            <th className="admin-dash-th">ID</th>
            <th className="admin-dash-th">Customer</th>
            <th className="admin-dash-th">Date</th>
            <th className="admin-dash-th">Total</th>
            <th className="admin-dash-th">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const ship = o.shippingAddress || {};
            return (
              <tr key={o.id} className="admin-dash-tbody-row">
                <td className="admin-dash-td">{o.id}</td>
                <td className="admin-dash-td">{ship.fullName || '-'}</td>
                <td className="admin-dash-td">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="admin-dash-td">₦{Number(o.totalAmount).toFixed(2)}</td>
                <td className="admin-dash-td">
                  <span className="admin-dash-status-badge" style={{ background: statusColors[o.status] || '#888' }}>
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
