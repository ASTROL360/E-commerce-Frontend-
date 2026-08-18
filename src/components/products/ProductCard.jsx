import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { getPrimaryProductImage, getCloudinaryUrl } from '../../utils/productImageUtils';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [addError, setAddError] = useState('');
  const outOfStock = product.stockQuantity === 0;
  const primaryImage = getPrimaryProductImage(product);
  const wishlisted = isWishlisted(product.id);

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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
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
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg className="w-4 h-4" fill={wishlisted ? '#dc2626' : 'none'} viewBox="0 0 24 24" stroke={wishlisted ? '#dc2626' : 'currentColor'} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
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
