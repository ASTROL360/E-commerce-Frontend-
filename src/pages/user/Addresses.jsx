import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import addressService from '../../services/addressService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import './userPages.css';

const addressSchema = z.object({
  label: z.string().optional().or(z.literal('')),
  fullName: z.string().min(1, 'Full name is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional().or(z.literal('')),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional().or(z.literal('')),
  isDefault: z.boolean(),
});

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: false,
    },
  });

  const loadAddresses = () => {
    setLoading(true);
    addressService.getAll().then((res) => {
      setAddresses(unwrap(res) || []);
    }).catch(() => {
      setError('Failed to load addresses');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadAddresses(); }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await addressService.update(editingId, data);
      } else {
        await addressService.create(data);
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        loadAddresses();
      }
    } catch (err) {
      const respData = err.response?.data;
      const fieldErrors = respData?.data && typeof respData.data === 'object'
        ? Object.values(respData.data).join('. ')
        : '';
      const status = err.response?.status ? ` (HTTP ${err.response.status})` : '';
      setError((respData?.message || fieldErrors || 'Failed to save address') + status + '. Please check your details and try again.');
    }
  };

  const handleEdit = (addr) => {
    reset({
      label: addr.label || '',
      fullName: addr.fullName,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state || '',
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || '',
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    addressService.delete(deleteTarget).then(() => {
      loadAddresses();
    }).catch(() => {
      setError('Failed to delete address');
    }).finally(() => setDeleteTarget(null));
  };

  const startAdd = () => {
    reset({
      label: '',
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="addresses-page">
      <div className="addresses-header">
        <h1>My Addresses</h1>
        <button onClick={startAdd} className="addresses-btn">Add New Address</button>
      </div>

      {error && <p className="addresses-error">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="addresses-form">
          <h3>{editingId ? 'Edit Address' : 'New Address'}</h3>
          <div className="addresses-grid">
            {[
              { name: 'label', label: 'Label' },
              { name: 'fullName', label: 'Full Name' },
              { name: 'line1', label: 'Address Line 1' },
              { name: 'line2', label: 'Address Line 2' },
              { name: 'city', label: 'City' },
              { name: 'state', label: 'State' },
              { name: 'postalCode', label: 'Postal Code' },
              { name: 'country', label: 'Country' },
              { name: 'phone', label: 'Phone' },
            ].map((f) => (
              <div key={f.name} className="addresses-field">
                <label>{f.label}</label>
                <input
                  {...register(f.name)}
                  type="text"
                  className="addresses-input"
                />
                {errors[f.name] && (
                  <p className="addresses-field-error">{errors[f.name].message}</p>
                )}
              </div>
            ))}
          </div>
          <label className="addresses-checkbox-label">
            <input type="checkbox" {...register('isDefault')} />
            Set as default address
          </label>
          <div className="addresses-form-actions">
            <button type="submit" className="addresses-save-btn">Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="addresses-cancel-btn">Cancel</button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.map((addr) => (
          <div key={addr.id} className="addresses-card">
            <div className="addresses-card-body">
              <strong>{addr.label}</strong> - {addr.fullName}
              {addr.isDefault && <span className="addresses-default-badge">Default</span>}
              <p className="addresses-card-info">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}
                {addr.phone && <><br />{addr.phone}</>}
              </p>
            </div>
            <div className="addresses-card-actions">
              <button onClick={() => handleEdit(addr)} className="addresses-edit-btn">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="addresses-delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
        confirmText="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
