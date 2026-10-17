import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import MainNavbar from '../../components/layout/MainNavbar';
import SubNavbar from '../../components/layout/SubNavbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

const WishlistPage = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

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
        <span className="text-gray-900 font-medium">My Wishlist</span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for future orders
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-yellow-800 hover:text-black flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-4xl mx-auto mb-4">
              <Icon icon="solar:heart-broken-linear" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Tap the heart icon on any product to save it here for quick reordering.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#110C0B] hover:bg-black text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors shadow-xs"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id || product.id} product={product} className="w-full h-full" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
