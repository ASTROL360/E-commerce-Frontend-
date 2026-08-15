import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
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

  const [reviewData, setReviewData] = useState({
    content: [],
    averageRating: 0,
    reviewCount: 0,
    canReview: false,
    myReview: null,
  });
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReviews = useCallback(() => {
    setReviewLoading(true);
    setReviewError('');
    reviewService.getByProduct(id, { page: 0, size: 100 })
      .then((res) => setReviewData(res.data?.data || {}))
      .catch(() => setReviewError('Failed to load reviews'))
      .finally(() => setReviewLoading(false));
  }, [id]);

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
    loadReviews();
  }, [id, loadReviews]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      setFormError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editing && reviewData.myReview) {
        await reviewService.update(reviewData.myReview.id, { rating, comment });
      } else {
        await reviewService.create(id, { rating, comment });
      }
      setRating(5);
      setComment('');
      setEditing(false);
      loadReviews();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewData.myReview) return;
    if (!window.confirm('Delete your review?')) return;
    try {
      await reviewService.remove(reviewData.myReview.id);
      setRating(5);
      setComment('');
      setEditing(false);
      loadReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message || 'Failed to delete review');
    }
  };

  const startEditing = () => {
    setRating(reviewData.myReview?.rating || 5);
    setComment(reviewData.myReview?.comment || '');
    setEditing(true);
    setFormError('');
  };

  const cancelEditing = () => {
    setEditing(false);
    setRating(5);
    setComment('');
    setFormError('');
  };

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
  const { content: reviews, averageRating, reviewCount, canReview, myReview } = reviewData;
  const myReviewId = myReview?.id;

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

          {reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <Stars value={Math.round(averageRating)} size="1.1rem" />
              <span style={{ color: '#666' }}>{averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

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

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Reviews</h2>

        {reviewError && <ErrorMessage message={reviewError} />}

        {!isAuthenticated && (
          <p style={{ color: '#888' }}>
            <Link to={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`} style={{ color: '#667eea' }}>
              Log in
            </Link>{' '}
            to review this product after your order has been delivered.
          </p>
        )}

        {canReview && !editing && (
          <div style={formCardStyle}>
            <h3>Write a Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your rating</label>
              <div style={{ marginBottom: '0.75rem' }}>
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                style={textareaStyle}
                maxLength={2000}
              />
              <button type="submit" style={submitBtnStyle} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {editing && myReview && (
          <div style={formCardStyle}>
            <h3>Edit Your Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your rating</label>
              <div style={{ marginBottom: '0.75rem' }}>
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                style={textareaStyle}
                maxLength={2000}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" style={submitBtnStyle} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Update Review'}
                </button>
                <button type="button" style={cancelBtnStyle} onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isAuthenticated && !canReview && !myReview && (
          <p style={{ color: '#888' }}>You can review this product after your order has been delivered.</p>
        )}

        {reviewLoading ? (
          <p style={{ color: '#999' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#999' }}>No reviews yet. Be the first to review this product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  ...reviewCardStyle,
                  borderColor: myReviewId === review.id ? '#667eea' : '#e0e0e0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong>{review.userName}</strong>
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ margin: '0.25rem 0 0.5rem' }}>
                  <Stars value={review.rating} size="1rem" />
                </div>
                {review.comment && <p style={{ color: '#444', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>}
                {myReviewId === review.id && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={startEditing} style={editBtnStyle}>Edit</button>
                    <button onClick={handleDeleteReview} style={deleteBtnStyle}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stars({ value, onChange, size = '1.2rem' }) {
  return (
    <div style={{ display: 'inline-flex', gap: '0.15rem', fontSize: size, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={onChange ? () => onChange(n) : undefined}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          style={{
            border: 'none',
            background: 'none',
            cursor: onChange ? 'pointer' : 'default',
            color: n <= value ? '#f1c40f' : '#ddd',
            fontSize: 'inherit',
            lineHeight: 1,
            padding: 0,
          }}
        >
          ★
        </button>
      ))}
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
const formCardStyle = {
  padding: '1.25rem',
  background: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '1.5rem',
};
const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  marginBottom: '0.75rem',
};
const submitBtnStyle = {
  padding: '0.6rem 1.5rem',
  background: '#667eea',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.95rem',
  cursor: 'pointer',
  fontWeight: 600,
};
const cancelBtnStyle = {
  padding: '0.6rem 1.5rem',
  background: '#fff',
  color: '#667eea',
  border: '2px solid #667eea',
  borderRadius: '6px',
  fontSize: '0.95rem',
  cursor: 'pointer',
  fontWeight: 600,
};
const editBtnStyle = {
  padding: '0.4rem 1rem',
  background: '#fff',
  color: '#667eea',
  border: '1px solid #667eea',
  borderRadius: '6px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  fontWeight: 600,
};
const deleteBtnStyle = {
  padding: '0.4rem 1rem',
  background: '#fff',
  color: '#e74c3c',
  border: '1px solid #e74c3c',
  borderRadius: '6px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  fontWeight: 600,
};
const reviewCardStyle = {
  padding: '1rem',
  border: '2px solid',
  borderRadius: '8px',
  background: '#fff',
};
