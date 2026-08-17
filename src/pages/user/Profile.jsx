import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/common/Avatar';
import './userPages.css';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-login-prompt">
        <p>Please log in to view your profile here.</p>
        <Link to="/login" className="profile-login-link">Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Avatar user={user} size={96} />
        <div>
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-card">
        <h2>Personal Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="profile-nav-row">
        <Link to="/orders" className="profile-nav-card">
          <h3>My Orders</h3>
          <p>Click here to view all the orders you've placed</p>
        </Link>
        <Link to="/addresses" className="profile-nav-card">
          <h3>My Addresses</h3>
          <p>Manage shipping addresses</p>
        </Link>
      </div>
    </div>
  );
}
