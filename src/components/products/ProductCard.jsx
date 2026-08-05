import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getPrimaryProductImage } from '../../utils/productImageUtils';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
    await addItem(product.id, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} />
          ) : (
            <div className="product-card-placeholder">No Image</div>
          )}
          {outOfStock && <span className="out-of-stock-badge">Out of Stock</span>}
        </div>

        <div className="product-card-info">
          {(product.categoryName || product.category) && (
            <span className="product-card-category">{product.categoryName || product.category?.name || product.category}</span>
          )}
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">₦{product.price?.toFixed(2)}</p>
        </div>
      </Link>

      {!isAdmin && (
        <button
          className={`btn btn-primary product-card-btn ${outOfStock ? 'btn-disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}
