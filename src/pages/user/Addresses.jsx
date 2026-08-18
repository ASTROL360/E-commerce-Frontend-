import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import addressService from '../../services/addressService';
import { unwrap } from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <button onClick={startAdd} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 text-sm">Add New Address</button>
      </div>

      {error && <p className="text-danger mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Address' : 'New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  {...register(f.name)}
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                {errors[f.name] && (
                  <p className="text-danger text-xs mt-1">{errors[f.name].message}</p>
                )}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
            <input type="checkbox" {...register('isDefault')} className="rounded border-gray-300 text-primary focus:ring-primary" />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-success text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90">Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-600 hover:text-gray-900 px-6 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-gray-900">{addr.label}</strong>
                <span className="text-gray-400">-</span>
                <span className="text-gray-700">{addr.fullName}</span>
                {addr.isDefault && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <p className="text-sm text-gray-500">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}
                {addr.phone && <><br />{addr.phone}</>}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(addr)} className="bg-primary text-white px-3 py-1 rounded text-sm">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="bg-danger text-white px-3 py-1 rounded text-sm">Delete</button>
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
