import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">ShopHub</h3>
          <p className="text-sm leading-relaxed">
            Your one-stop online shop for everything you need with a free delivery to your door step.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/products" className="text-sm hover:text-white transition-colors">Products</Link>
            </li>
            <li>
              <Link to="/about" className="text-sm hover:text-white transition-colors">About</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>1 Commerce St, Lagos, Nigeria</li>
            <li>support@shophub.com</li>
            <li>(+234) 916-4794-335</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-400">
          <p>&copy; 2026 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
