import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusBg = {
  PENDING: 'bg-warning',
  PAID: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
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

  if (loading) return <p className="text-gray-500 p-6 lg:p-8">Loading dashboard...</p>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Products', value: productCount, bg: '#667eea' },
          { label: 'Total Orders', value: orderCount, bg: '#00b894' },
          { label: 'Total Revenue', value: `₦${totalRevenue.toFixed(2)}`, bg: '#f39c12' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-6 text-white" style={{ background: s.bg }}>
            <p className="text-sm font-medium opacity-90">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((o) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
