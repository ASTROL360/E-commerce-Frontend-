import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getPrimaryProductImage, getCloudinaryUrl } from '../../utils/productImageUtils';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addError, setAddError] = useState('');
  const outOfStock = product.stockQuantity === 0;
  const primaryImage = getPrimaryProductImage(product);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    try {
      setAddError('');
      await addItem(product.id, 1);
    } catch (err) {
      setAddError(err.message || 'Failed to add to cart');
      setTimeout(() => setAddError(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          {primaryImage ? (
            <img
              src={getCloudinaryUrl(primaryImage, 400)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
          )}
          {outOfStock && (
            <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-4">
          {(product.categoryName || product.category) && (
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {product.categoryName || product.category?.name || product.category}
            </span>
          )}
          <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-gray-900 mt-1">₦{product.price?.toFixed(2)}</p>
        </div>
      </Link>

      {!isAdmin && (
        <div className="px-4 pb-4">
          <button
            className={`w-full mt-3 text-sm font-medium py-2 rounded-lg transition-colors ${
              outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          {addError && <span className="block text-danger text-xs mt-1 text-center">{addError}</span>}
        </div>
      )}
    </div>
  );
}
