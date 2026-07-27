import { useState } from 'react';
import { mockCategories, mockProducts } from '../../data/mockData';

export default function AdminCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setCategories((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const productCount = (catId) => mockProducts.filter((p) => p.category?.id === catId).length;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Categories</h1>
        <button onClick={() => setShowForm(!showForm)} style={addBtn}>
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleChange} style={inputStyle} />
          </div>
          <button type="submit" style={saveBtn}>Create Category</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Products</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{c.id}</td>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}>{c.description || '-'}</td>
              <td style={tdStyle}>{productCount(c.id)}</td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(c.id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const addBtn = { padding: '0.5rem 1rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const formStyle = { padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '1rem' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const saveBtn = { padding: '0.6rem 1.5rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const thStyle = { padding: '0.75rem 0.5rem' };
const tdStyle = { padding: '0.75rem 0.5rem' };
const deleteBtn = { padding: '0.3rem 0.75rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
