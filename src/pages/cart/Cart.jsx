import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getCloudinaryUrl } from '../../utils/productImageUtils';

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, subtotal, loading } = useCart();
  const { user } = useAuth();
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="cart-loading">
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="cart-empty-link">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={getCloudinaryUrl(item.imageUrl, 160) || '/placeholder.png'}
              alt={item.productName}
              className="cart-item-img"
            />
            <div className="cart-item-details">
              <Link to={`/products/${item.productId}`} className="cart-item-link">
                <h3 className="cart-item-name">{item.productName}</h3>
              </Link>
              <p className="cart-item-price">₦{Number(item.unitPrice).toFixed(2)}</p>
            </div>
            <div className="cart-item-qty">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">+</button>
            </div>
            <p className="cart-item-total">
              ₦{(Number(item.unitPrice) * item.quantity).toFixed(2)}
            </p>
            <button onClick={() => removeItem(item.id)} className="cart-remove-btn">&times;</button>
          </div>

        ))}
        <button onClick={clearCart} className="cart-btn cart-btn--danger cart-clear-btn">Clear Cart</button>
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>₦{subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}</span>
        </div>
        <hr />
        <div className="cart-summary-total">
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>

        <div className="cart-summary-actions">
          {user ? (
            <Link to="/checkout" className="cart-btn cart-btn--checkout">Proceed to Checkout</Link>
          ) : (
            <Link to="/login?returnUrl=/checkout" className="cart-btn cart-btn--checkout">Login to Checkout</Link>
          )}
        </div>
        <div className="cart-summary-continue">
          <Link to="/products" className="cart-continue-link">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
