import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  const requestLogout = () => {
    setDropdownOpen(false);
    setLogoutConfirmOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          ShopHub
        </Link>

        <button
          className="sm:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        <nav className="hidden sm:flex sm:items-center sm:gap-6">
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </div>

          <form className="flex items-center" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
            />
            <button type="submit" className="sr-only">Search</button>
          </form>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-2 bg-danger text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <button
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <Avatar user={user} size={24} />
                    <span className="hidden lg:inline">{user?.name || 'User'}</span>
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/addresses"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            Addresses
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={requestLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              <form onSubmit={handleSearch} className="pt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                />
              </form>

              <div className="pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <Avatar user={user} size={32} />
                      <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                    </div>
                    {!isAdmin && (
                      <Link
                        to="/cart"
                        className="block px-2 py-1 text-sm text-gray-600 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Cart {getItemCount() > 0 && `(${getItemCount()})`}
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-2 py-1 text-sm text-gray-600 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {!isAdmin && (
                      <>
                        <Link
                          to="/profile"
                          className="block px-2 py-1 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-2 py-1 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/addresses"
                          className="block px-2 py-1 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Addresses
                        </Link>
                      </>
                    )}
                    <button
                      onClick={requestLogout}
                      className="block w-full text-left px-2 py-1 text-sm text-danger hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      className="flex-1 text-center border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
    </header>
  );
}
