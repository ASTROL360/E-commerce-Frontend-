import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProducts, mockCategories } from '../../data/mockData';
import Loading from '../../components/common/Loading';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
  });

  useEffect(() => {
    if (isEditing) {
      const product = mockProducts.find((p) => p.id === Number(id));
      if (product) {
        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stockQuantity: product.stockQuantity || '',
          imageUrl: product.imageUrl || '',
          categoryId: product.category?.id || '',
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.stockQuantity) {
      setError('Name, price, and stock are required');
      return;
    }

    setLoading(true);
    try {
      // if (isEditing) {
      //   await productService.update(id, form);
      // } else {
      //   await productService.create(form);
      // }
      console.log('Saving product:', form);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <Link to="/admin/products" style={{ color: '#667eea' }}>&larr; Back to Products</Link>
      <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        {[
          { name: 'name', label: 'Product Name', type: 'text' },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
          { name: 'imageUrl', label: 'Image URL', type: 'text' },
        ].map((f) => (
          <div key={f.name} style={fieldStyle}>
            <label>{f.label}</label>
            <input
              name={f.name}
              type={f.type}
              value={form[f.name]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        ))}

        <div style={fieldStyle}>
          <label>Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} style={inputStyle}>
            <option value="">Select Category</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" style={saveBtn}>{isEditing ? 'Update' : 'Create'} Product</button>
          <Link to="/admin/products" style={{ ...cancelBtn, textDecoration: 'none', textAlign: 'center', lineHeight: '2.5rem' }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

const formStyle = { padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const saveBtn = { padding: '0.75rem 1.5rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const cancelBtn = { padding: '0.75rem 1.5rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-block' };
