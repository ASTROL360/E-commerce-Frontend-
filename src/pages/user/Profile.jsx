import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        <p>Please log in to view your profile.</p>
        <Link to="/login" style={{ color: '#667eea' }}>Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>My Profile</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Personal Info</h2>
          <button onClick={() => setEditing(!editing)} style={editBtn}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); setEditing(false); }}>
            <div style={fieldStyle}>
              <label>Name</label>
              <input defaultValue={user.name} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label>Email</label>
              <input defaultValue={user.email} type="email" style={inputStyle} />
            </div>
            <button type="submit" style={saveBtn}>Save Changes</button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to="/orders" style={navCardStyle}>
          <h3>My Orders</h3>
          <p>View your order history</p>
        </Link>
        <Link to="/addresses" style={navCardStyle}>
          <h3>My Addresses</h3>
          <p>Manage shipping addresses</p>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = { padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const editBtn = { padding: '0.5rem 1rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const saveBtn = { padding: '0.6rem 1.5rem', background: '#00b894', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 };
const navCardStyle = {
  flex: 1,
  display: 'block',
  padding: '1.5rem',
  background: '#f8f9fa',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  border: '1px solid #e0e0e0',
};
