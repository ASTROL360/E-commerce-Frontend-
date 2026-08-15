import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getAll({ page: 0, size: 4, sortBy: 'id', direction: 'asc' }).then((res) => {
      setFeaturedProducts(res.data?.data?.content || []);
    }).catch(() => {});
    categoryService.getAll().then((res) => {
      setCategories(res.data?.data || []);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <section style={heroStyle}>
        <h1>Welcome to ShopHub</h1>
        <p>Discover amazing products at unbeatable prices and free delivery to your door step</p>
        <Link to="/products" style={btnStyle}>Shop Now</Link>
      </section>

      <section style={sectionStyle}>
        <h2>Featured Products</h2>
        <div style={gridStyle}>
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>Categories</h2>
        <div style={gridStyle}>
          {categories.map((c) => (
            <Link key={c.id} to={`/products?category=${c.id}`} style={catCardStyle}>
              <h3>{c.name}</h3>
              {c.description && <p>{c.description}</p>}
            </Link>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem 0 4rem' }}>
        <Link to="/products" style={linkStyle}>Click to View All Products </Link>
      </div>
    </div>
  );
}

const heroStyle = {
  textAlign: 'center',
  padding: '6rem 1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
};
const btnStyle = {
  display: 'inline-block',
  marginTop: '1rem',
  padding: '0.75rem 2rem',
  background: '#fff',
  color: '#667eea',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
};
const sectionStyle = { padding: '2rem 1rem', maxWidth: 1200, margin: '0 auto' };
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1.5rem',
  marginTop: '1rem',
};
const catCardStyle = {
  display: 'block',
  padding: '1.5rem',
  background: '#f8f9fa',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  textAlign: 'center',
  border: '1px solid #e0e0e0',
};
const linkStyle = {
  display: 'inline-block',
  padding: '0.75rem 2rem',
  background: '#667eea',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
};
