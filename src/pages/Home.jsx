import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { unwrap } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let done = 0;
    const checkDone = () => { if (++done === 2) setLoading(false); };

    productService.getAll({ page: 0, size: 4, sortBy: 'id', direction: 'asc' }).then((res) => {
      setFeaturedProducts(unwrap(res)?.content || []);
    }).catch(() => {
      setError('Failed to load products');
    }).finally(checkDone);

    categoryService.getAll().then((res) => {
      setCategories(unwrap(res) || []);
    }).catch(() => {
      setCategories([]);
    }).finally(checkDone);
  }, []);

  return (
    <div>
      <section className="home-hero">
        <h1>Welcome to ShopHub</h1>
        <p>Discover amazing products at unbeatable prices and free delivery to your door step</p>
        <Link to="/products" className="home-hero-btn">Shop Now</Link>
      </section>

      {error && <p className="home-error">{error}</p>}

      {loading ? (
        <p className="home-loading">Loading...</p>
      ) : (
        <>
          <section className="home-section">
            <h2>Featured Products</h2>
            <div className="home-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section className="home-section">
            <h2>Categories</h2>
            <div className="home-grid">
              {categories.map((c) => (
                <Link key={c.id} to={`/products?category=${c.id}`} className="home-cat-card">
                  <h3>{c.name}</h3>
                  {c.description && <p>{c.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="home-cta">
        <Link to="/products" className="home-cta-btn">Click to View All Products </Link>
      </div>
    </div>
  );
}
