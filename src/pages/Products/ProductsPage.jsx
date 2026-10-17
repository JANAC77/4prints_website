import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSubCategory = searchParams.get('subCategory') || '';
  const initialBadge = searchParams.get('badge') || ''; // 'featured', 'bestSeller', 'newArrival'

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBadge, setSelectedBadge] = useState(initialBadge);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync with URL query params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBadge(searchParams.get('badge') || '');
  }, [searchParams]);

  // Load categories for filter sidebar
  useEffect(() => {
    categoryApi.list().then((list) => {
      if (Array.isArray(list)) setCategories(list);
    });
  }, []);

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    // Resolve selectedCategory slug to MongoDB _id if needed
    const catObj = categories.find(
      (c) => c.slug === selectedCategory || c._id === selectedCategory
    );
    const categoryParam = catObj ? catObj._id : selectedCategory || undefined;

    const params = {
      search: searchQuery || undefined,
      category: categoryParam,
      featured: selectedBadge === 'featured' ? true : undefined,
      bestSeller: selectedBadge === 'bestSeller' ? true : undefined,
      newArrival: selectedBadge === 'newArrival' ? true : undefined,
      limit: 40,
    };

    productApi
      .list(params)
      .then((res) => {
        let list = res.products || [];

        // Apply client sorting
        if (sortBy === 'price-low') {
          list.sort((a, b) => (a.pricing?.[0]?.price || 0) - (b.pricing?.[0]?.price || 0));
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => (b.pricing?.[0]?.price || 0) - (a.pricing?.[0]?.price || 0));
        } else if (sortBy === 'rating') {
          list.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        }

        setProducts(list);
        setTotal(res.total || list.length);
      })
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory, selectedBadge, sortBy]);

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === slug) {
      setSelectedCategory('');
      newParams.delete('category');
    } else {
      setSelectedCategory(slug);
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleBadgeSelect = (badge) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedBadge === badge) {
      setSelectedBadge('');
      newParams.delete('badge');
    } else {
      setSelectedBadge(badge);
      newParams.set('badge', badge);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBadge('');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6] text-gray-800">
      <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
        <MainNavbar />
        <SubNavbar />
      </header>

      {/* Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Product Catalog</span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {products.length} of {total} custom print products
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
            >
              <Icon icon="solar:filter-linear" className="text-base" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-black cursor-pointer shadow-xs"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar (3 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-900">Filters</span>
                {(selectedCategory || selectedBadge || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-yellow-800 hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Collections / Badges */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Collections</h3>
                <div className="space-y-1.5">
                  {[
                    { id: 'bestSeller', label: 'Best Sellers' },
                    { id: 'featured', label: 'Top Featured' },
                    { id: 'newArrival', label: 'New Arrivals' },
                  ].map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => handleBadgeSelect(badge.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                        selectedBadge === badge.id
                          ? 'bg-[#110C0B] text-white font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{badge.label}</span>
                      {selectedBadge === badge.id && (
                        <Icon icon="lucide:check" className="text-sm text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                        selectedCategory === cat.slug
                          ? 'bg-yellow-100 text-yellow-900 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {selectedCategory === cat.slug && (
                        <Icon icon="lucide:check" className="text-sm text-yellow-800" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid (9 cols on lg) */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Icon icon="svg-spinners:180-ring-with-bg" className="text-4xl text-yellow-500 mb-3" />
                <p className="text-sm font-medium">Fetching products catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Icon icon="solar:box-minimalistic-linear" className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  We couldn't find any products matching your selected criteria. Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#110C0B] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} className="w-full h-full" />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 lg:hidden">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <Icon icon="lucide:x" className="text-xl" />
                </button>
              </div>

              {/* Collections */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Collections</h4>
                <div className="space-y-1">
                  {['bestSeller', 'featured', 'newArrival'].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => handleBadgeSelect(badge)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                        selectedBadge === badge ? 'bg-black text-white' : 'text-gray-700'
                      }`}
                    >
                      {badge === 'bestSeller' ? 'Best Sellers' : badge === 'featured' ? 'Featured' : 'New Arrivals'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCategorySelect(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                        selectedCategory === c.slug ? 'bg-yellow-100 text-yellow-900 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-[#110C0B] text-white py-3 rounded-xl font-bold text-sm mt-6"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsPage;
