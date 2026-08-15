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
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ShopHub
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="cart-link" onClick={() => setMobileMenuOpen(false)}>
                    <span className="cart-icon">&#128722;</span>
                    {getItemCount() > 0 && (
                      <span className="cart-badge">{getItemCount()}</span>
                    )}
                  </Link>
                )}

                <div className="user-dropdown">
                  <button
                    className="user-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <Avatar user={user} size={24} />
                    {user?.name || 'User'} &#9662;
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      {isAdmin ? (
                        <Link
                          to="/admin"
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
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/addresses"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            Addresses
                          </Link>
                        </>
                      )}
                      <button onClick={requestLogout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
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
