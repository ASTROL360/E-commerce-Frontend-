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
    <div className="min-h-screen">
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Discover Amazing Products
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Unbeatable prices and free delivery right to your doorstep
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl text-lg transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {error && (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <p className="text-danger text-center font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-center text-gray-500 text-lg">Loading...</p>
        </div>
      ) : (
        <>
          <section className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.id}`}
                  className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{c.name}</h3>
                    {c.description && (
                      <p className="mt-2 text-sm text-gray-500">{c.description}</p>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Shop With Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                    <p className="text-sm text-gray-500 mt-1">On orders above ₦50,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                    <p className="text-sm text-gray-500 mt-1">Protected by Paystack</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                    <p className="text-sm text-gray-500 mt-1">We're here to help anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="bg-primary rounded-2xl px-8 py-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">Stay in the Loop</h2>
              <p className="text-primary-light mb-6">Get the latest deals and new arrivals delivered to your inbox.</p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-l-xl text-sm focus:outline-none"
                />
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-r-xl text-sm font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <Link to="/products" className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          View All Products
        </Link>
      </div>
    </div>
  );
}
