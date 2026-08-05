import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadCategories = () => {
    setLoading(true);
    categoryService.getAll().then((res) => {
      setCategories(res.data?.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await categoryService.create(form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
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

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.description || '-'}</td>
                <td style={tdStyle}>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
