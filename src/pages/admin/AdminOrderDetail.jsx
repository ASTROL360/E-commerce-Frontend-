import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    orderService.getById(id).then((res) => {
      const ord = unwrap(res);
      setOrder(ord);
      setStatus(ord?.status || '');
    }).catch((err) => {
      setError(err.message || 'Failed to load order');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/admin/orders" className="text-primary hover:underline mt-4 inline-block">&larr; Back to Orders</Link>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    setSuccess('');
    try {
      await orderService.updateStatus(id, status);
      setSuccess('Status updated to: ' + status);
      const res = await orderService.getById(id);
      setOrder(unwrap(res));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const ship = order.shippingAddress || {};

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6">
      <Link to="/admin/orders" className="text-primary hover:underline inline-block mb-4">&larr; Back to Orders</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order {order.id}</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700 mt-1"><strong>Customer:</strong> {ship.fullName || '-'}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">₦{Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
        {success && <p className="bg-green-50 text-green-700 rounded-lg p-3 text-sm mb-3">{success}</p>}
        {error && <ErrorMessage message={error} />}
        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
            {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handleUpdateStatus} className="bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">Update Status</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>{ship.fullName}</p>
          <p>{ship.line1}</p>
          <p>{ship.city}, {ship.state} {ship.postalCode}</p>
          <p>{ship.country}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Qty</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Unit Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(order.items || []).map((item, idx) => (
                <tr key={item.productId || idx}>
                  <td className="py-3 text-sm text-gray-900">{item.productName || 'Product'}</td>
                  <td className="py-3 text-sm text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-sm text-gray-700">₦{Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-3 text-sm text-gray-900 font-medium">₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
