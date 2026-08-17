import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import './admin.css';

const statusColors = {
  PENDING: '#f39c12',
  PAID: '#3498db',
  SHIPPED: '#9b59b6',
  DELIVERED: '#27ae60',
  CANCELLED: '#e74c3c',
};

const quickActions = (status) => {
  if (status === 'DELIVERED' || status === 'CANCELLED') return [];
  if (status === 'SHIPPED') return [{ to: 'DELIVERED', label: 'Deliver' }, { to: 'CANCELLED', label: 'Cancel' }];
  return [{ to: 'SHIPPED', label: 'Ship' }, { to: 'CANCELLED', label: 'Cancel' }];
};

const actionColor = (to) => (to === 'CANCELLED' ? '#e74c3c' : to === 'DELIVERED' ? '#27ae60' : '#9b59b6');

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadOrders = () => {
    setLoading(true);
    orderService.getAllOrders({ page: 0, size: 50 }).then((res) => {
      setOrders(unwrap(res)?.content || []);
    }).catch(() => {
      setError('Failed to load orders');
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, target) => {
    setUpdatingId(id);
    try {
      await orderService.updateStatus(id, target);
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="admin-orders-page">
      <h1>Orders</h1>

      {error && <p className="admin-orders-error">{error}</p>}

      <div className="admin-orders-filters">
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="admin-orders-filter-btn"
            style={{
              background: statusFilter === s ? '#667eea' : '#e0e0e0',
              color: statusFilter === s ? '#fff' : '#333',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr className="admin-orders-thead-row">
              <th className="admin-orders-th">ID</th>
              <th className="admin-orders-th">Customer</th>
              <th className="admin-orders-th">Date</th>
              <th className="admin-orders-th">Total</th>
              <th className="admin-orders-th">Status</th>
              <th className="admin-orders-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const ship = o.shippingAddress || {};
              return (
                <tr key={o.id} className="admin-orders-tbody-row">
                  <td className="admin-orders-td">{o.id}</td>
                  <td className="admin-orders-td">{ship.fullName || '-'}</td>
                  <td className="admin-orders-td">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="admin-orders-td">₦{Number(o.totalAmount).toFixed(2)}</td>
                  <td className="admin-orders-td">
                    <span className="admin-orders-status-badge" style={{ background: statusColors[o.status] || '#888' }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="admin-orders-td">
                    <div className="admin-orders-actions-cell">
                      <Link to={`/admin/orders/${o.id}`} className="admin-orders-view-btn">View</Link>
                      {quickActions(o.status).map((a) => (
                        <button
                          key={a.to}
                          onClick={() => handleStatusChange(o.id, a.to)}
                          disabled={updatingId === o.id}
                          className="admin-orders-quick-btn"
                          style={{ background: actionColor(a.to) }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
