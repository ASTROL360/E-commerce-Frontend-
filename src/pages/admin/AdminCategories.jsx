import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import categoryService from '../../services/categoryService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  const loadCategories = () => {
    setLoading(true);
    categoryService.getAll().then((res) => {
      setCategories(unwrap(res) || []);
    }).catch(() => {
      setError('Failed to load categories');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);

  const startCreate = () => {
    setEditing(null);
    reset({ name: '', description: '' });
    setShowForm(!showForm);
  };

  const startEdit = (c) => {
    setEditing(c);
    reset({ name: c.name, description: c.description || '' });
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await categoryService.update(editing.id, data);
      } else {
        await categoryService.create(data);
      }
      reset({ name: '', description: '' });
      setShowForm(false);
      setEditing(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = (c) => {
    setDeleteTarget(c);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.remove(deleteTarget.id);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={startCreate} className="bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 text-sm">
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {error && <p className="text-danger mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editing ? `Edit Category: ${editing.name}` : 'New Category'}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" {...register('name')} />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" {...register('description')} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-success text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">{editing ? 'Update Category' : 'Create Category'}</button>
            {editing && (
              <button type="button" onClick={startCreate} className="text-gray-600 hover:text-gray-900 px-6 py-2.5 text-sm">Cancel</button>
            )}
          </div>
        </form>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Description</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{c.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{c.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{c.description || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(c)} className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(c)} className="bg-danger text-white px-3 py-1 rounded text-sm">Delete</button>
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
