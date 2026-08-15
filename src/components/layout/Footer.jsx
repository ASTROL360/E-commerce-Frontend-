import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>ShopHub</h3>
          <p>Your one-stop online shop for everything you need.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>123 Commerce St</p>
          <p>support@shophub.com</p>
          <p>(+234) 916-4794-335</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
