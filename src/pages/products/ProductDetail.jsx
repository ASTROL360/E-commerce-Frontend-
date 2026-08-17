import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getProductImageOptions } from '../../utils/productImageUtils';
import ImageSlider from '../../components/common/ImageSlider';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

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
  const [deleteReviewTarget, setDeleteReviewTarget] = useState(false);

  const loadReviews = useCallback(() => {
    setReviewLoading(true);
    setReviewError('');
    reviewService.getByProduct(id, { page: 0, size: 100 })
      .then((res) => setReviewData(unwrap(res) || {}))
      .catch(() => setReviewError('Failed to load reviews'))
      .finally(() => setReviewLoading(false));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setError('');
    productService.getById(id).then((res) => {
      setProduct(unwrap(res));
    }).catch((err) => {
      setError(err.message || 'Failed to load product');
    }).finally(() => {
      setLoading(false);
    });
    loadReviews();
  }, [id, loadReviews]);

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
    setDeleteReviewTarget(true);
  };

  const confirmDeleteReview = async () => {
    setDeleteReviewTarget(false);
    if (!reviewData.myReview) return;
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
      <div className="product-detail-error-wrap">
        <ErrorMessage message={error || 'Product not found'} />
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  const images = getProductImageOptions(product);
  const { content: reviews, averageRating, reviewCount, canReview, myReview } = reviewData;
  const myReviewId = myReview?.id;

  return (
    <div className="product-detail-page">
      <Link to="/products" className="product-detail-back">
        &larr; Back to Products
      </Link>
      <div className="product-detail-layout">
        <div className="product-detail-gallery">
          <ImageSlider images={images} alt={product.name} />
        </div>
        <div className="product-detail-info">
          {(product.categoryName || product.category) && (
            <span className="product-detail-category">{product.categoryName || product.category?.name}</span>
          )}
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">
            ₦{Number(product.price).toFixed(2)}
          </p>
          <p className="product-detail-desc">{product.description}</p>

          {reviewCount > 0 && (
            <div className="product-detail-rating-summary">
              <Stars value={Math.round(averageRating)} size="1.1rem" />
              <span className="product-detail-rating-text">{averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

          {inStock ? (
            <p className="product-detail-stock">In Stock ({product.stockQuantity} available)</p>
          ) : (
            <p className="product-detail-stock product-detail-stock--out">Out of Stock</p>
          )}

          {inStock && !isAdmin && (
            <div className="product-detail-qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="product-detail-qty-btn">
                -
              </button>
              <span className="product-detail-qty-val">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))} className="product-detail-qty-btn">
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
              className="product-detail-add-btn"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <section className="product-detail-reviews">
        <h2 className="product-detail-reviews-title">Reviews</h2>

        {reviewError && <ErrorMessage message={reviewError} />}

        {!isAuthenticated && (
          <p className="product-detail-login-hint">
            <Link to={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`} className="product-detail-login-link">
              Log in
            </Link>{' '}
            to review this product after your order has been delivered.
          </p>
        )}

        {canReview && !editing && (
          <div className="product-detail-review-form">
            <h3>Write a Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label className="product-detail-form-label">Your rating</label>
              <div className="product-detail-form-stars">
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                className="product-detail-textarea"
                maxLength={2000}
              />
              <button type="submit" className="product-detail-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {editing && myReview && (
          <div className="product-detail-review-form">
            <h3>Edit Your Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label className="product-detail-form-label">Your rating</label>
              <div className="product-detail-form-stars">
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                className="product-detail-textarea"
                maxLength={2000}
              />
              <div className="product-detail-form-actions">
                <button type="submit" className="product-detail-submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Update Review'}
                </button>
                <button type="button" className="product-detail-cancel-btn" onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isAuthenticated && !canReview && !myReview && (
          <p className="product-detail-review-wait">You can review this product after your order has been delivered.</p>
        )}

        {reviewLoading ? (
          <p className="product-detail-review-loading">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="product-detail-review-empty">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="product-detail-review-list">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="product-detail-review-card"
                style={{
                  borderColor: myReviewId === review.id ? '#667eea' : '#e0e0e0',
                }}
              >
                <div className="product-detail-review-header">
                  <strong>{review.userName}</strong>
                  <span className="product-detail-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="product-detail-review-stars">
                  <Stars value={review.rating} size="1rem" />
                </div>
                {review.comment && <p className="product-detail-review-comment">{review.comment}</p>}
                {myReviewId === review.id && (
                  <div className="product-detail-review-actions">
                    <button onClick={startEditing} className="product-detail-edit-btn">Edit</button>
                    <button onClick={handleDeleteReview} className="product-detail-delete-btn">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={deleteReviewTarget}
        title="Delete Review"
        message="Are you sure you want to delete your review?"
        confirmText="Delete"
        danger
        onConfirm={confirmDeleteReview}
        onCancel={() => setDeleteReviewTarget(false)}
      />
    </div>
  );
}

function Stars({ value, onChange, size = '1.2rem' }) {
  return (
    <div className="star-container" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={onChange ? () => onChange(n) : undefined}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="star-btn"
          style={{
            cursor: onChange ? 'pointer' : 'default',
            color: n <= value ? '#f1c40f' : '#ddd',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
