import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import './admin.css';

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
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="admin-products-add-btn">Add Product</Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-products-search"
      />

      {error && <p className="admin-products-error">{error}</p>}

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
        <p>Loading products...</p>
      ) : (
        <table className="admin-products-table">
          <thead>
            <tr className="admin-products-thead-row">
              <th className="admin-products-th">ID</th>
              <th className="admin-products-th">Name</th>
              <th className="admin-products-th">Category</th>
              <th className="admin-products-th">Price</th>
              <th className="admin-products-th">Stock</th>
              <th className="admin-products-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="admin-products-tbody-row">
                <td className="admin-products-td">{p.id}</td>
                <td className="admin-products-td">{p.name}</td>
                <td className="admin-products-td">{p.categoryName || '-'}</td>
                <td className="admin-products-td">₦{Number(p.price).toFixed(2)}</td>
                <td className="admin-products-td">{p.stockQuantity}</td>
                <td className="admin-products-td">
                  <Link to={`/admin/products/${p.id}/edit`} className="admin-products-edit-btn">Edit</Link>{' '}
                  <button onClick={() => handleDelete(p.id)} className="admin-products-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
