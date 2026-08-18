import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { unwrap } from '../../services/api';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProductCard from '../../components/products/ProductCard';
import { getCloudinaryUrl } from '../../utils/productImageUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
  const [adminDeleteReviewId, setAdminDeleteReviewId] = useState(null);

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
      const p = unwrap(res);
      setProduct(p);
      if (p?.categoryId) {
        productService.getAll({ categoryId: p.categoryId, page: 0, size: 5 }).then((relRes) => {
          const rel = unwrap(relRes)?.content || [];
          setRelatedProducts(rel.filter((r) => r.id !== Number(id)).slice(0, 4));
        }).catch(() => {});
      }
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
    const targetId = adminDeleteReviewId || reviewData.myReview?.id;
    setDeleteReviewTarget(false);
    setAdminDeleteReviewId(null);
    if (!targetId) return;
    try {
      await reviewService.remove(targetId);
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
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <ErrorMessage message={error || 'Product not found'} />
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline font-medium">
          Back to Products
        </Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  const { content: reviews, averageRating, reviewCount, canReview, myReview } = reviewData;
  const myReviewId = myReview?.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-primary hover:underline font-medium mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 overflow-hidden rounded-2xl">
          <img
            src={getCloudinaryUrl(product.imageUrl, 800) || '/placeholder.png'}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="lg:col-span-2">
          {(product.categoryName || product.category) && (
            <nav className="text-sm text-gray-500 mb-3">
              <span className="hover:text-primary cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-primary cursor-pointer">Products</span>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{product.categoryName || product.category?.name}</span>
            </nav>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-2xl font-bold text-primary mt-4">
            ₦{Number(product.price).toFixed(2)}
          </p>

          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Stars value={Math.round(averageRating)} size="1.1rem" />
              <span className="text-sm text-gray-500">{averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

          <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <span className="w-2 h-2 bg-success rounded-full" />
                In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-danger">
                <span className="w-2 h-2 bg-danger rounded-full" />
                Out of Stock
              </span>
            )}
          </div>

          {inStock && !isAdmin && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-medium text-gray-900 border-x border-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
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
                toast.success('Added to cart');
              }}
              className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Add to Cart
            </button>
          )}

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Free Shipping
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Checkout
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

        {reviewError && <ErrorMessage message={reviewError} />}

        {!isAuthenticated && (
          <p className="text-gray-500 mb-6">
            <Link to={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`} className="text-primary hover:underline font-medium">
              Log in
            </Link>{' '}
            to review this product after your order has been delivered.
          </p>
        )}

        {canReview && !editing && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
              <div className="mb-4">
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                maxLength={2000}
              />
              <button
                type="submit"
                className="mt-4 bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {editing && myReview && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Edit Your Review</h3>
            {formError && <ErrorMessage message={formError} />}
            <form onSubmit={handleSubmitReview}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
              <div className="mb-4">
                <Stars value={rating} onChange={setRating} size="1.6rem" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product (optional)..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                maxLength={2000}
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Update Review'}
                </button>
                <button
                  type="button"
                  className="border border-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isAuthenticated && !canReview && !myReview && (
          <p className="text-gray-500 mb-6">You can review this product after your order has been delivered.</p>
        )}

        {reviewLoading ? (
          <p className="text-gray-500 py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 py-4">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-xl border p-5 ${myReviewId === review.id ? 'border-primary' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-gray-900">{review.userName}</strong>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-2">
                  <Stars value={review.rating} size="1rem" />
                </div>
                {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
                {myReviewId === review.id && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={startEditing} className="text-sm text-primary hover:underline font-medium">Edit</button>
                    <button onClick={handleDeleteReview} className="text-sm text-danger hover:underline font-medium">Delete</button>
                  </div>
                )}
                {isAdmin && myReviewId !== review.id && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => { setAdminDeleteReviewId(review.id); setDeleteReviewTarget(true); }} className="text-sm text-danger hover:underline font-medium">Delete (Admin)</button>
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
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
        danger
        onConfirm={confirmDeleteReview}
        onCancel={() => { setDeleteReviewTarget(false); setAdminDeleteReviewId(null); }}
      />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stars({ value, onChange, size = '1.2rem' }) {
  return (
    <div className="flex gap-0.5" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={onChange ? () => onChange(n) : undefined}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="transition-colors"
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
