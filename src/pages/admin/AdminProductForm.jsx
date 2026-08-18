import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import './admin.css';

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().optional(),
  description: z.string().optional(),
});

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      description: '',
    },
  });

  useEffect(() => {
    categoryService.getAll().then((res) => {
      setCategories(unwrap(res) || []);
    }).catch(() => {
      setCategories([]);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      productService.getById(id).then((res) => {
        const p = unwrap(res);
        if (p) {
          reset({
            name: p.name || '',
            price: p.price || '',
            stockQuantity: p.stockQuantity || '',
            categoryId: p.categoryId ? String(p.categoryId) : '',
            description: p.description || '',
          });
          setImageUrl(p.imageUrl || '');
        }
      }).catch(() => setError('Failed to load product')).finally(() => setLoading(false));
    }
  }, [id, isEditing, reset]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setError('');

    const payload = {
      ...data,
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      imageUrl,
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
      const body = err.response?.data;
      const msg = (typeof body === 'string' && body) || body?.message || (body?.errors && body.errors.join(', ')) || err.message || 'Failed to save product';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-product-form-page">
      <Link to="/admin/products" className="admin-product-form-back">&larr; Back to Products</Link>
      <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>

      {error && <p className="admin-product-form-error">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="admin-product-form-card">
        <div className="admin-product-form-field">
          <label>Product Name</label>
          <input
            type="text"
            className="admin-product-form-input"
            {...register('name')}
          />
          {errors.name && <p className="admin-product-form-field-error">{errors.name.message}</p>}
        </div>

        <div className="admin-product-form-field">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            className="admin-product-form-input"
            {...register('price')}
          />
          {errors.price && <p className="admin-product-form-field-error">{errors.price.message}</p>}
        </div>

        <div className="admin-product-form-field">
          <label>Stock Quantity</label>
          <input
            type="number"
            className="admin-product-form-input"
            {...register('stockQuantity')}
          />
          {errors.stockQuantity && <p className="admin-product-form-field-error">{errors.stockQuantity.message}</p>}
        </div>

        <div className="admin-product-form-field">
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="admin-product-form-file" disabled={uploading} />
          {uploading && <p className="admin-product-form-hint">Uploading...</p>}
          {imageUrl ? (
            <div className="admin-product-form-preview-row">
              <img src={imageUrl} alt="Product" className="admin-product-form-main-preview" />
              <button type="button" onClick={() => setImageUrl('')} className="admin-product-form-remove-img">Remove</button>
            </div>
          ) : (
            <p className="admin-product-form-hint">Choose a JPG or PNG file to upload.</p>
          )}
        </div>

        <div className="admin-product-form-field">
          <label>Category</label>
          <select className="admin-product-form-input" {...register('categoryId')}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="admin-product-form-field">
          <label>Description</label>
          <textarea
            rows={4}
            className="admin-product-form-textarea"
            {...register('description')}
          />
        </div>

        <div className="admin-product-form-actions">
          <button type="submit" className="admin-product-form-save">{isEditing ? 'Update' : 'Create'} Product</button>
          <Link to="/admin/products" className="admin-product-form-cancel">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
