import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const statusBg = {
  PENDING: 'bg-warning',
  PAID: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
};

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const loadOrder = () => {
    setLoading(true);
    setError('');
    orderService.getById(id).then((res) => {
      setOrder(unwrap(res));
    }).catch((err) => {
      setError(err.message || 'Failed to load order');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadOrder(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelOrder = async () => {
    setCancelConfirmOpen(false);
    setCancelling(true);
    try {
      await orderService.cancelOrder(id);
      toast.success('Order cancelled');
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorMessage message={error || 'Order not found'} />
        <Link to="/orders" className="text-primary hover:underline mt-4 inline-block">&larr; Back to Orders</Link>
      </div>
    );
  }

  const ship = order.shippingAddress || {};
  const canCancel = ['PENDING', 'PAID'].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-primary hover:underline inline-block mb-4">&larr; Back to Orders</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order {order.id}</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700 mt-1"><strong>Status:</strong>{' '}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ml-1 ${statusBg[order.status] || 'bg-gray-400'}`}>
                {order.status}
              </span>
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900">₦{Number(order.totalAmount).toFixed(2)}</p>
        </div>
        {canCancel && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCancelConfirmOpen(true)}
              disabled={cancelling}
              className="bg-danger text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger-hover disabled:opacity-50 transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
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

      <ConfirmDialog
        open={cancelConfirmOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        danger
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelConfirmOpen(false)}
      />
    </div>
  );
}
