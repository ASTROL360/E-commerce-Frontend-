import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import addressService from '../../services/addressService';

const emptyForm = { label: '', fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const loadAddresses = () => {
    setLoading(true);
    addressService.getAll().then((res) => {
      setAddresses(res.data?.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadAddresses(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await addressService.update(editingId, form);
      } else {
        await addressService.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        loadAddresses();
      }
    } catch (err) {
      const data = err.response?.data;
      const fieldErrors = data?.data && typeof data.data === 'object'
        ? Object.values(data.data).join('. ')
        : '';
      const status = err.response?.status ? ` (HTTP ${err.response.status})` : '';
      alert((data?.message || fieldErrors || 'Failed to save address') + status + '. Please check your details and try again.');
    }
  };

  const handleEdit = (addr) => {
    setForm({ label: addr.label, fullName: addr.fullName, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country, phone: addr.phone || '', isDefault: addr.isDefault || false });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this address?')) {
      addressService.delete(id).then(() => {
        loadAddresses();
      }).catch(() => alert('Failed to delete address'));
    }
  };

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Addresses</h1>
        <button onClick={startAdd} style={addBtn}>Add New Address</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3>{editingId ? 'Edit Address' : 'New Address'}</h3>
          <div style={gridStyle}>
            {[
              { name: 'label', label: 'Label', type: 'text' },
              { name: 'fullName', label: 'Full Name', type: 'text' },
              { name: 'line1', label: 'Address Line 1', type: 'text' },
              { name: 'line2', label: 'Address Line 2', type: 'text' },
              { name: 'city', label: 'City', type: 'text' },
              { name: 'state', label: 'State', type: 'text' },
              { name: 'postalCode', label: 'Postal Code', type: 'text' },
              { name: 'country', label: 'Country', type: 'text' },
              { name: 'phone', label: 'Phone', type: 'text' },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: '0.75rem' }}>
                <label>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} type={f.type} required={['fullName', 'line1', 'city', 'postalCode', 'country'].includes(f.name)} style={inputStyle} />
              </div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            Set as default address
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" style={saveBtn}>Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {addresses.map((addr) => (
          <div key={addr.id} style={addrCardStyle}>
            <div style={{ flex: 1 }}>
              <strong>{addr.label}</strong> - {addr.fullName}
              {addr.isDefault && <span style={defaultBadge}>Default</span>}
              <p style={{ margin: '0.25rem 0 0', color: '#555' }}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}
                {addr.phone && <><br />{addr.phone}</>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
              <button onClick={() => handleEdit(addr)} style={editBtn}>Edit</button>
              <button onClick={() => handleDelete(addr.id)} style={deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const addBtn = { padding: '0.5rem 1rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const formStyle = { padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '1rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.25rem', boxSizing: 'border-box' };
const saveBtn = { padding: '0.6rem 1.5rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const cancelBtn = { padding: '0.6rem 1.5rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const addrCardStyle = { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', gap: '1rem' };
const defaultBadge = { marginLeft: '0.5rem', background: '#667eea', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' };
const editBtn = { padding: '0.4rem 0.75rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
const deleteBtn = { padding: '0.4rem 0.75rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
