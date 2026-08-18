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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-xl font-bold text-white block">ShopHub</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar user={user} size={32} />
            <div className="min-w-0">
              <strong className="block text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</strong>
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
          <Link to="/" className="block text-center text-xs text-gray-400 hover:text-white transition-colors">
            View Store
          </Link>
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold text-primary">ShopHub</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Admin</span>
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

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
