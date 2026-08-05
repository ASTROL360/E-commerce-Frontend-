import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getProductImageOptions } from '../../utils/productImageUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    productService.getById(id).then((res) => {
      setProduct(res.data?.data || null);
    }).catch((err) => {
      setError(err.message || 'Failed to load product');
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  if (loading) return <Loading />;
  if (error || !product) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <ErrorMessage message={error || 'Product not found'} />
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  const images = getProductImageOptions(product);
  const currentImage = images[selectedImage]?.src || images[0]?.src || '/placeholder.png';

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '1rem', color: '#667eea' }}>
        &larr; Back to Products
      </Link>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 350px' }}>
          <img
            src={currentImage}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: 450 }}
          />
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <img
                    src={img.src}
                    alt={`${product.name} ${img.label || idx + 1}`}
                    onMouseEnter={() => setSelectedImage(idx)}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: idx === selectedImage ? '3px solid #667eea' : '2px solid #e0e0e0',
                      opacity: idx === selectedImage ? 1 : 0.7,
                    }}
                  />
                  <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#666' }}>{img.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 300px' }}>
          {(product.categoryName || product.category) && (
            <span style={{ color: '#888', fontSize: '0.9rem' }}>{product.categoryName || product.category?.name}</span>
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

          {inStock && !isAdmin && (
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

          {inStock && !isAdmin && (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
                  return;
                }
                addItem(product.id, quantity);
              }}
              style={addBtnStyle}
            >
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
