import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../../components/products/ProductCard';

export default function Wishlist() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite products here.</p>
        <Link to="/products" className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} product={{
            id: item.productId,
            name: item.productName,
            price: item.productPrice,
            imageUrl: item.productImageUrl,
            stockQuantity: item.stockQuantity,
          }} />
        ))}
      </div>
    </div>
  );
}
