import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    productService.getAll({ page: 0, size: 100, sortBy: 'id', direction: 'asc' }).then((res) => {
      setProducts(unwrap(res)?.content || []);
    }).catch(() => {
      setError('Failed to load products');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    productService.delete(deleteTarget).then(() => {
      loadProducts();
    }).catch(() => {
      setError('Failed to delete product');
    }).finally(() => setDeleteTarget(null));
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 text-sm">Add Product</Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
      />

      {error && <p className="text-danger mb-4">{error}</p>}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Stock</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{p.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{p.categoryName || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">₦{Number(p.price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{p.stockQuantity}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</Link>
                      <button onClick={() => handleDelete(p.id)} className="bg-danger text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
