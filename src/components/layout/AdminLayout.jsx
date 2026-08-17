import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';
import '../../pages/admin/admin.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/categories', label: 'Categories' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  return (
    <div className="admin-layout-page">
      <aside className="admin-layout-sidebar">
        <div className="admin-layout-brand">
          <span className="admin-layout-brand-title">ShopHub</span>
          <span className="admin-layout-brand-sub">Admin Panel</span>
        </div>

        <nav className="admin-layout-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-layout-link${isActive ? ' admin-layout-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-layout-footer">
          <div className="admin-layout-user-info">
            <div className="admin-layout-user-row">
              <Avatar user={user} size={32} />
              <div>
                <strong className="admin-layout-user-name">{user?.name || 'Admin'}</strong>
                <div>
                  <span className="admin-layout-role-badge">{user?.role || 'ADMIN'}</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/" className="admin-layout-store-link">View Store</Link>
          <button onClick={() => setLogoutConfirmOpen(true)} className="admin-layout-logout-btn">Logout</button>
        </div>
      </aside>

      <main className="admin-layout-content">
        <Outlet />
      </main>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        danger
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
}
