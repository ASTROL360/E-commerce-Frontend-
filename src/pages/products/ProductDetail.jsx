import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const product = mockProducts.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <ErrorMessage message="Product not found" />
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '1rem', color: '#667eea' }}>
        &larr; Back to Products
      </Link>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 350px' }}>
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: 450 }}
          />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          {product.category && (
            <span style={{ color: '#888', fontSize: '0.9rem' }}>{product.category.name}</span>
          )}
          <h1 style={{ margin: '0.5rem 0' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
            ₦{Number(product.price).toFixed(2)}
          </p>
          <p style={{ lineHeight: 1.6, color: '#555' }}>{product.description}</p>

          {inStock ? (
            <p style={{ color: 'green' }}>In Stock ({product.stockQuantity} available)</p>
          ) : (
            <p style={{ color: 'red' }}>Out of Stock</p>
          )}

          {inStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={qtyBtnStyle}>
                -
              </button>
              <span style={{ fontSize: '1.1rem', minWidth: 30, textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))} style={qtyBtnStyle}>
                +
              </button>
            </div>
          )}

          {inStock && (
            <button onClick={() => addItem(product, quantity)} style={addBtnStyle}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: 36,
  height: 36,
  border: '1px solid #ccc',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '1.1rem',
};
const addBtnStyle = {
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 600,
};
