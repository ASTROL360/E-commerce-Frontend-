import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/common/Avatar';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        <p>Please log in to view your profile here.</p>
        <Link to="/login" style={{ color: '#667eea' }}>Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={profileHeaderStyle}>
        <Avatar user={user} size={96} />
        <div>
          <h1>{user.name}</h1>
          <p style={{ color: '#6b7280' }}>{user.email}</p>
          
        </div>
      </div>

      <div style={cardStyle}>
        <h2>Personal Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to="/orders" style={navCardStyle}>
          <h3>My Orders</h3>
          <p>Click here to view all the orders you've placed</p>
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
const profileHeaderStyle = { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' };
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
