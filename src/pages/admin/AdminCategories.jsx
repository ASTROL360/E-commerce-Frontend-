import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import categoryService from '../../services/categoryService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import './admin.css';

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
    <div className="admin-categories-page">
      <div className="admin-categories-header">
        <h1>Categories</h1>
        <button onClick={startCreate} className="admin-categories-add-btn">
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {error && <p className="admin-categories-error">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="admin-categories-form">
          <h3>{editing ? `Edit Category: ${editing.name}` : 'New Category'}</h3>
          <div className="admin-categories-field">
            <label>Name</label>
            <input className="admin-categories-input" {...register('name')} />
            {errors.name && <p className="admin-categories-field-error">{errors.name.message}</p>}
          </div>
          <div className="admin-categories-field">
            <label>Description</label>
            <input className="admin-categories-input" {...register('description')} />
          </div>
          <div className="admin-categories-actions">
            <button type="submit" className="admin-categories-save-btn">{editing ? 'Update Category' : 'Create Category'}</button>
            {editing && (
              <button type="button" onClick={startCreate} className="admin-categories-cancel-btn">Cancel</button>
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
        <p>Loading categories...</p>
      ) : (
        <table className="admin-categories-table">
          <thead>
            <tr className="admin-categories-thead-row">
              <th className="admin-categories-th">ID</th>
              <th className="admin-categories-th">Name</th>
              <th className="admin-categories-th">Description</th>
              <th className="admin-categories-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="admin-categories-tbody-row">
                <td className="admin-categories-td">{c.id}</td>
                <td className="admin-categories-td">{c.name}</td>
                <td className="admin-categories-td">{c.description || '-'}</td>
                <td className="admin-categories-td">
                  <button onClick={() => startEdit(c)} className="admin-categories-edit-btn">Edit</button>{' '}
                  <button onClick={() => handleDelete(c)} className="admin-categories-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
