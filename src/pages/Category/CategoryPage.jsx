import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { categoryApi } from '../../api/category.api';
import { productApi } from '../../api/product.api';
import { getDisplayImageUrl } from '../../utils/formatters';

const CategoryPage = () => {
  const { slug, subSlug } = useParams();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      categoryApi.getBySlug(slug),
      categoryApi.listSubCategories(slug),
    ])
      .then(([catData, subsData]) => {
        setCategory(catData);
        setSubcategories(subsData || []);

        // Resolve subcategory slug to its actual MongoDB ObjectId
        let subCategoryId = undefined;
        if (subSlug) {
          const matchedSub = (subsData || []).find(
            (s) => s.slug === subSlug || s._id === subSlug
          );
          subCategoryId = matchedSub ? matchedSub._id : subSlug;
        }

        // Fetch products matching category and subcategory
        return productApi.list({
          category: catData?._id || catData?.slug,
          subCategory: subCategoryId,
          limit: 30,
        });
      })
      .then((prodRes) => {
        setProducts(prodRes?.products || []);
      })
      .catch((err) => {
        console.error('Error loading category:', err);
      })
      .finally(() => setLoading(false));
  }, [slug, subSlug]);

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-[#fdfbf6] text-gray-800">
      <header className="relative z-50 flex flex-col w-full bg-[#fdfbf6]">
        <MainNavbar />
        <SubNavbar />
      </header>

      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category?.name || slug}</span>
        {subSlug && (
          <>
            <span>/</span>
            <span className="text-yellow-800 font-medium capitalize">{subSlug.replace(/-/g, ' ')}</span>
          </>
        )}
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Category Hero Banner */}
        {category && (
          <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 to-[#1e293b] text-white p-6 sm:p-10 lg:p-12 mb-8 overflow-hidden shadow-sm">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full inline-block mb-3">
                Category Collection
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                {category.description}
              </p>
            </div>

            {category.image && (
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 sm:opacity-40 overflow-hidden pointer-events-none hidden md:block">
                <img
                  src={getDisplayImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Subcategories Pills */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Explore Subcategories
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <Link
                to={`/category/${slug}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  !subSlug
                    ? 'bg-[#110C0B] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-black'
                }`}
              >
                All in {category?.name || 'Category'}
              </Link>
              {subcategories.map((sub) => {
                const isActive = subSlug === sub.slug;
                return (
                  <Link
                    key={sub._id}
                    to={`/category/${slug}/${sub.slug}`}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#110C0B] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-black'
                    }`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {subSlug
                ? subcategories.find((s) => s.slug === subSlug)?.name || 'Subcategory Products'
                : `${category?.name || 'Category'} Products`}
            </h2>
            <span className="text-xs text-gray-500">
              {products.length} products available
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Icon icon="svg-spinners:180-ring-with-bg" className="text-4xl text-yellow-500 mb-3" />
              <p className="text-sm font-medium">Loading items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Icon icon="solar:box-minimalistic-linear" className="text-5xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                No products are currently published under this subcategory.
              </p>
              <Link
                to={`/category/${slug}`}
                className="bg-[#110C0B] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-black transition-colors"
              >
                View all in {category?.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} className="w-full h-full" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
