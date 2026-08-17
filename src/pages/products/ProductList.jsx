import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { unwrap } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import Pagination from '../../components/common/Pagination';

const ITEMS_PER_PAGE = 8;

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getAll().then((res) => {
      setCategories(unwrap(res) || []);
    }).catch(() => {
      setCategories([]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {
      page: currentPage - 1,
      size: ITEMS_PER_PAGE,
      sortBy: 'id',
      direction: 'asc',
    };
    if (searchTerm) params.name = searchTerm;
    if (selectedCategory) params.categoryId = selectedCategory;

    productService.getAll(params).then((res) => {
      const data = unwrap(res) || { content: [], totalElements: 0 };
      setProducts(data.content || []);
      setTotalElements(data.totalElements || 0);
    }).catch((err) => {
      setError(err.message || 'Failed to load products');
    }).finally(() => {
      setLoading(false);
    });
  }, [searchTerm, selectedCategory, currentPage]);

  const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId === selectedCategory ? '' : catId);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="product-list-layout">
      <aside className="product-list-aside">
        <h3>Categories</h3>
        {categories.map((c) => (
          <label key={c.id} className="product-list-cat-label">
            <input
              type="checkbox"
              checked={String(selectedCategory) === String(c.id)}
              onChange={() => handleCategoryChange(c.id)}
            />{' '}
            {c.name}
          </label>
        ))}
      </aside>

      <main className="product-list-main">
        <div className="product-list-toolbar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="product-list-search"
          />
          <p className="product-list-count">{totalElements} product(s) found</p>
        </div>

        <div className="product-list-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="product-list-error">{error}</p>
          ) : products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No products match your criteria.</p>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </main>
    </div>
  );
}
