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
        {/* Category Hero Banner - Website Matching Color & Theme */}
        {category && (
          <div 
            className="relative rounded-2xl sm:rounded-3xl border border-yellow-200/80 p-4 sm:p-8 lg:p-12 mb-6 sm:mb-8 overflow-hidden shadow-xs"
            style={{ background: 'linear-gradient(135deg, #fff9e6 0%, #fcf0da 50%, #ffffff 100%)' }}
          >
            {/* Decorative Yellow Background Shape (Desktop) */}
            <div 
              className="hidden md:block absolute top-0 right-0 bottom-0 w-[45%] bg-[#ffcc00]/25 z-0 pointer-events-none"
              style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              {/* Decorative dots pattern */}
              <div className="absolute top-8 right-12 grid grid-cols-5 gap-2 opacity-35">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-600/60" />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="max-w-2xl w-full">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-950 uppercase tracking-widest bg-[#FFD40C] px-3.5 py-1 rounded-full shadow-2xs mb-3">
                  <Icon icon="solar:folder-with-files-bold" className="text-sm" />
                  <span>Category Collection</span>
                </span>
                
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#110C0B] mb-3 leading-tight tracking-tight">
                  {category.name}
                </h1>
                
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl font-normal mb-5">
                  {category.description || `Explore our high quality ${category.name} custom prints, crafted with premium materials and precision.`}
                </p>

                {/* Quality Highlights Tags */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-medium text-gray-800">
                  <div className="flex items-center gap-1.5 bg-white/80 border border-yellow-200/80 px-3 py-1.5 rounded-full shadow-2xs">
                    <Icon icon="solar:check-circle-bold" className="text-yellow-600 text-sm" />
                    <span>2400 DPI Printing</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 border border-yellow-200/80 px-3 py-1.5 rounded-full shadow-2xs">
                    <Icon icon="solar:check-circle-bold" className="text-yellow-600 text-sm" />
                    <span>Fast Turnaround</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 border border-yellow-200/80 px-3 py-1.5 rounded-full shadow-2xs">
                    <Icon icon="solar:check-circle-bold" className="text-yellow-600 text-sm" />
                    <span>Custom Print Ready</span>
                  </div>
                </div>
              </div>

              {/* Right Image Display */}
              {category.image && (
                <div className="relative z-10 shrink-0 hidden md:block">
                  <div className="w-56 h-44 lg:w-72 lg:h-52 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
                    <img
                      src={getDisplayImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subcategories Pills */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Explore Subcategories
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <Link
                to={`/category/${slug}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  !subSlug
                    ? 'bg-[#110C0B] text-[#FFD40C] shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50/50'
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
                        ? 'bg-[#110C0B] text-[#FFD40C] shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50/50'
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
                className="bg-[#110C0B] text-[#FFD40C] px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-black transition-colors"
              >
                View all in {category?.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
