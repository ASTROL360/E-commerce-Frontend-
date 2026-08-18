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
    <div className="max-w-2xl mx-auto p-6 lg:p-8">
      <Link to="/admin/products" className="text-primary hover:underline text-sm inline-block mb-4">&larr; Back to Products</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Product' : 'Add Product'}</h1>

      {error && <p className="text-danger mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            {...register('name')}
          />
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            {...register('price')}
          />
          {errors.price && <p className="text-danger text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            {...register('stockQuantity')}
          />
          {errors.stockQuantity && <p className="text-danger text-xs mt-1">{errors.stockQuantity.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:opacity-90" />
          {uploading && <p className="text-gray-500 text-xs mt-1">Uploading...</p>}
          {imageUrl ? (
            <div className="flex items-center gap-4 mt-3">
              <img src={imageUrl} alt="Product" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
              <button type="button" onClick={() => setImageUrl('')} className="text-danger text-sm hover:underline">Remove</button>
            </div>
          ) : (
            <p className="text-gray-400 text-xs mt-1">Choose a JPG or PNG file to upload.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" {...register('categoryId')}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y"
            {...register('description')}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-success text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">{isEditing ? 'Update' : 'Create'} Product</button>
          <Link to="/admin/products" className="text-gray-600 hover:text-gray-900 px-6 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
