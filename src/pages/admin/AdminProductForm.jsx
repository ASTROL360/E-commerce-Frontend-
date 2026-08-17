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
  const [uploading, setUploading] = useState({ main: false, variants: {} });
  const [imageUrl, setImageUrl] = useState('');
  const [colorVariants, setColorVariants] = useState(EMPTY_VARIANTS);

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
          const loaded = (p.colorVariants || [])
            .filter((v) => v && v.imageUrl)
            .map((v) => ({ colorName: v.colorName || '', imageUrl: v.imageUrl || '' }));
          reset({
            name: p.name || '',
            price: p.price || '',
            stockQuantity: p.stockQuantity || '',
            categoryId: p.categoryId ? String(p.categoryId) : '',
            description: p.description || '',
          });
          setImageUrl(p.imageUrl || '');
          setColorVariants([...loaded, ...EMPTY_VARIANTS].slice(0, 4));
        }
      }).catch(() => setError('Failed to load product')).finally(() => setLoading(false));
    }
  }, [id, isEditing, reset]);

  const handleVariantChange = (index, field, value) => {
    setColorVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, main: true }));
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading((prev) => ({ ...prev, main: false }));
    }
  };

  const handleVariantImageChange = async (index, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, variants: { ...prev.variants, [index]: true } }));
    try {
      const url = await uploadToCloudinary(file);
      handleVariantChange(index, 'imageUrl', url);
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading((prev) => ({ ...prev, variants: { ...prev.variants, [index]: false } }));
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
      colorVariants: colorVariants
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
          <input type="file" accept="image/*" onChange={handleMainImageChange} className="admin-product-form-file" disabled={uploading.main} />
          {uploading.main && <p className="admin-product-form-hint">Uploading...</p>}
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
          <label>Color Variants (up to 4 colors)</label>
          <p className="admin-product-form-variant-hint">
            Add a color name and upload an image for each color of this product.
          </p>
          {colorVariants.map((variant, index) => (
            <div key={index} className="admin-product-form-variant-row">
              <input
                placeholder="Color (e.g. Black)"
                value={variant.colorName}
                onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)}
                className="admin-product-form-variant-color"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleVariantImageChange(index, e.target.files?.[0])}
                className="admin-product-form-variant-file"
                disabled={uploading.variants[index]}
              />
              {uploading.variants[index] && <span className="admin-product-form-variant-uploading">Uploading...</span>}
              {variant.imageUrl ? (
                <img src={variant.imageUrl} alt={variant.colorName || `Variant ${index + 1}`} className="admin-product-form-variant-preview" />
              ) : (
                <div className="admin-product-form-variant-placeholder">No image</div>
              )}
            </div>
          ))}
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
