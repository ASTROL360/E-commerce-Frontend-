import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { unwrap } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import Pagination from '../../components/common/Pagination';

const ITEMS_PER_PAGE = 8;

const sortOptions = [
  { label: 'Default', sortBy: 'id', direction: 'asc' },
  { label: 'Price: Low to High', sortBy: 'price', direction: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', direction: 'desc' },
  { label: 'Newest', sortBy: 'id', direction: 'desc' },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortIndex, setSortIndex] = useState(0);

  const debounceRef = useRef(null);

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
    const { sortBy, direction } = sortOptions[sortIndex];
    const params = {
      page: currentPage - 1,
      size: ITEMS_PER_PAGE,
      sortBy,
      direction,
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
  }, [searchTerm, selectedCategory, currentPage, sortIndex]);

  const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId === selectedCategory ? '' : catId);
    setCurrentPage(1);
  };

  const handleSearchInput = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val);
      setCurrentPage(1);
    }, 300);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
          <button
            onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                String(selectedCategory) === String(c.id)
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <select
            value={sortIndex}
            onChange={(e) => { setSortIndex(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            {sortOptions.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchInput}
            className="w-full sm:w-56 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">{totalElements} product(s) found</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-danger font-medium">{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
