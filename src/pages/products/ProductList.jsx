import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockProducts, mockCategories } from '../../data/mockData';
import ProductCard from '../../components/products/ProductCard';
import Pagination from '../../components/common/Pagination';

const ITEMS_PER_PAGE = 8;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? String(p.category?.id) === String(selectedCategory)
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        {mockCategories.map((c) => (
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
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{filtered.length} product(s) found</p>
        </div>

        <div style={gridStyle}>
          {paginated.length > 0 ? (
            paginated.map((p) => <ProductCard key={p.id} product={p} />)
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
