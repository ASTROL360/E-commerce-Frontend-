import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockProducts, mockCategories } from '../../data/mockData';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(mockProducts);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <Link to="/admin/products/new" style={addBtn}>Add Product</Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.category?.name || '-'}</td>
              <td style={tdStyle}>₦{Number(p.price).toFixed(2)}</td>
              <td style={tdStyle}>{p.stockQuantity}</td>
              <td style={tdStyle}>
                <Link to={`/admin/products/${p.id}/edit`} style={editBtn}>Edit</Link>{' '}
                <button onClick={() => handleDelete(p.id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const searchStyle = { width: '100%', maxWidth: 400, padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.5rem' };
const addBtn = { padding: '0.5rem 1rem', background: '#00b894', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 };
const thStyle = { padding: '0.75rem 0.5rem' };
const tdStyle = { padding: '0.75rem 0.5rem' };
const editBtn = { padding: '0.3rem 0.75rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem' };
const deleteBtn = { padding: '0.3rem 0.75rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
