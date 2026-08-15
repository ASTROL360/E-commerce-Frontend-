import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';

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
    <div style={container}>
      <aside style={sidebar}>
        <div style={brand}>
          <span style={brandTitle}>ShopHub</span>
          <span style={brandSub}>Admin Panel</span>
        </div>

        <nav style={nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                ...navLink,
                ...(isActive ? navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={sidebarFooter}>
          <div style={userInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Avatar user={user} size={32} />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{user?.name || 'Admin'}</strong>
                <div>
                  <span style={roleBadge}>{user?.role || 'ADMIN'}</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/" style={storeLink}>View Store</Link>
          <button onClick={() => setLogoutConfirmOpen(true)} style={logoutBtn}>Logout</button>
        </div>
      </aside>

      <main style={content}>
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

const container = { minHeight: '100vh', display: 'flex', background: '#f9fafb' };
const sidebar = {
  width: 240,
  minHeight: '100vh',
  background: '#1f2937',
  color: '#d1d5db',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  flexShrink: 0,
};
const brand = { padding: '1.25rem 1.5rem', borderBottom: '1px solid #374151', display: 'flex', flexDirection: 'column', gap: '2px' };
const brandTitle = { fontSize: '1.25rem', fontWeight: 700, color: '#fff' };
const brandSub = { fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' };
const nav = { padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 };
const navLink = {
  display: 'block',
  padding: '0.6rem 0.9rem',
  borderRadius: '6px',
  color: '#d1d5db',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
};
const navLinkActive = { background: '#374151', color: '#fff' };
const sidebarFooter = { padding: '1rem 1.5rem', borderTop: '1px solid #374151', display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const userInfo = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const roleBadge = { background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' };
const storeLink = {
  display: 'block',
  textAlign: 'center',
  padding: '0.5rem',
  background: '#374151',
  color: '#fff',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
};
const logoutBtn = {
  padding: '0.5rem',
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 600,
};
const content = { flex: 1, minWidth: 0 };
