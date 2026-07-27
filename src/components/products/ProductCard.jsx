import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stockQuantity === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      addItem(product, 1);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-card-placeholder">No Image</div>
          )}
          {outOfStock && <span className="out-of-stock-badge">Out of Stock</span>}
        </div>

        <div className="product-card-info">
          {product.category && (
            <span className="product-card-category">{product.category.name || product.category}</span>
          )}
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">₦{product.price?.toFixed(2)}</p>
        </div>
      </Link>

      <button
        className={`btn btn-primary product-card-btn ${outOfStock ? 'btn-disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={outOfStock}
      >
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
