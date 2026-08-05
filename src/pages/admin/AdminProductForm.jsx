import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Loading from '../../components/common/Loading';

const EMPTY_VARIANTS = [
  { colorName: '', imageUrl: '' },
  { colorName: '', imageUrl: '' },
  { colorName: '', imageUrl: '' },
  { colorName: '', imageUrl: '' },
];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    colorVariants: EMPTY_VARIANTS,
  });

  useEffect(() => {
    categoryService.getAll().then((res) => {
      setCategories(res.data?.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      productService.getById(id).then((res) => {
        const p = res.data?.data;
        if (p) {
          const loaded = (p.colorVariants || [])
            .filter((v) => v && v.imageUrl)
            .map((v) => ({ colorName: v.colorName || '', imageUrl: v.imageUrl || '' }));
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            stockQuantity: p.stockQuantity || '',
            imageUrl: p.imageUrl || '',
            categoryId: p.categoryId || '',
            colorVariants: [...loaded, ...EMPTY_VARIANTS].slice(0, 4),
          });
        }
      }).catch(() => setError('Failed to load product')).finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const variants = form.colorVariants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    setForm({ ...form, colorVariants: variants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.stockQuantity) {
      setError('Name, price, and stock are required');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      colorVariants: form.colorVariants
        .filter((v) => v.imageUrl.trim())
        .map((v) => ({ colorName: v.colorName.trim(), imageUrl: v.imageUrl.trim() })),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: 700, padding: '2rem' }}>
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
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Color Variants (up to 4 colors)</label>
          <p style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.85rem', color: '#777' }}>
            Add a color name and image URL for each color of this product.
          </p>
          {form.colorVariants.map((variant, index) => (
            <div key={index} style={variantRowStyle}>
              <input
                name={`colorName-${index}`}
                placeholder="Color (e.g. Black)"
                value={variant.colorName}
                onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)}
                style={variantColorInputStyle}
              />
              <input
                name={`variantUrl-${index}`}
                placeholder="Image URL"
                value={variant.imageUrl}
                onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                style={variantUrlInputStyle}
              />
              {variant.imageUrl ? (
                <img src={variant.imageUrl} alt={variant.colorName || `Variant ${index + 1}`} style={variantPreviewStyle} />
              ) : (
                <div style={variantPreviewPlaceholder}>No image</div>
              )}
            </div>
          ))}
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
const variantRowStyle = { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' };
const variantColorInputStyle = { width: '30%', padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' };
const variantUrlInputStyle = { flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' };
const variantPreviewStyle = { width: 44, height: 44, objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' };
const variantPreviewPlaceholder = { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px dashed #ccc', color: '#999', fontSize: '0.65rem', textAlign: 'center', boxSizing: 'border-box' };
const saveBtn = { padding: '0.75rem 1.5rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const cancelBtn = { padding: '0.75rem 1.5rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-block' };
