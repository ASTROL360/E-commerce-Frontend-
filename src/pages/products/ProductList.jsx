import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
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
      setCategories(res.data?.data || []);
    }).catch(() => {});
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
      const data = res.data?.data || { content: [], totalElements: 0 };
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
    <div style={{ display: 'flex', gap: '2rem', maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      <aside style={{ minWidth: 220 }}>
        <h3>Categories</h3>
        {categories.map((c) => (
          <label key={c.id} style={{ display: 'block', padding: '0.35rem 0', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={String(selectedCategory) === String(c.id)}
              onChange={() => handleCategoryChange(c.id)}
            />{' '}
            {c.name}
          </label>
        ))}
      </aside>

      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            style={inputStyle}
          />
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{totalElements} product(s) found</p>
        </div>

        <div style={gridStyle}>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '1.5rem',
};
const inputStyle = {
  width: '100%',
  padding: '0.6rem 1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};
