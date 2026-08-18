import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';

const statusBg = {
  PENDING: 'bg-warning',
  PAID: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
};

const quickActions = (status) => {
  if (status === 'DELIVERED' || status === 'CANCELLED') return [];
  if (status === 'SHIPPED') return [{ to: 'DELIVERED', label: 'Deliver' }, { to: 'CANCELLED', label: 'Cancel' }];
  return [{ to: 'SHIPPED', label: 'Ship' }, { to: 'CANCELLED', label: 'Cancel' }];
};

const actionBg = (to) => (to === 'CANCELLED' ? 'bg-danger' : to === 'DELIVERED' ? 'bg-success' : 'bg-purple-500');

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
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {error && <p className="text-danger mb-4">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((o) => {
                const ship = o.shippingAddress || {};
                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{o.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{ship.fullName || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">₦{Number(o.totalAmount).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusBg[o.status] || 'bg-gray-400'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/orders/${o.id}`} className="bg-primary text-white px-3 py-1 rounded text-sm">View</Link>
                        {quickActions(o.status).map((a) => (
                          <button
                            key={a.to}
                            onClick={() => handleStatusChange(o.id, a.to)}
                            disabled={updatingId === o.id}
                            className={`${actionBg(a.to)} text-white px-3 py-1 rounded text-sm disabled:opacity-50`}
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
        </div>
      )}
    </div>
  );
}
