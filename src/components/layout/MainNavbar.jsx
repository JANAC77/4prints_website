import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';
import logo from '../../assets/images/logo.png';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const MainNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="w-full bg-[#fdfbf6]/95 backdrop-blur-md font-poppins border-b border-gray-200/80 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Left: Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center group">
          <img
            src={logo}
            alt="4prints Logo"
            className="h-9 sm:h-11 md:h-12 object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex flex-1 justify-center px-8 max-w-2xl relative z-50">
          <SearchBar />
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-5 text-gray-700">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-yellow-100/80 hover:text-yellow-900 transition-all active:scale-95 text-gray-800"
            title="Wishlist"
          >
            <Icon icon="solar:heart-linear" className="text-2xl" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#FFD40C] text-gray-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-yellow-100/80 hover:text-yellow-900 transition-all active:scale-95 text-gray-800"
            title="Shopping Cart"
          >
            <Icon icon="solar:cart-outline" className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#110C0B] text-yellow-400 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3.5 rounded-full hover:bg-yellow-100/70 border border-gray-200 bg-white shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#110C0B] text-yellow-400 font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900 max-w-[110px] truncate">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`text-gray-500 text-sm transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-yellow-50 hover:text-gray-950 font-medium transition-colors"
                    >
                      <Icon icon="solar:user-linear" className="text-lg text-gray-500" />
                      <span>My Profile & Addresses</span>
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-yellow-50 hover:text-gray-950 font-medium transition-colors"
                    >
                      <Icon icon="solar:bag-3-linear" className="text-lg text-gray-500" />
                      <span>My Cart ({totalItems})</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-yellow-50 hover:text-gray-950 font-medium transition-colors"
                    >
                      <Icon icon="solar:heart-linear" className="text-lg text-gray-500" />
                      <span>Wishlist ({wishlistCount})</span>
                    </Link>
                  </div>

                  <div className="pt-1.5 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-semibold cursor-pointer"
                    >
                      <Icon icon="solar:logout-2-linear" className="text-lg" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#FFD40C] hover:bg-[#ffc800] text-gray-950 font-bold px-7 py-2.5 rounded-full transition-all text-sm shadow-xs hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Action Icons & Menu Button */}
        <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
          <Link to="/wishlist" className="relative p-2.5 text-gray-800">
            <Icon icon="solar:heart-linear" className="text-2xl" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#FFD40C] text-gray-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2.5 text-gray-800">
            <Icon icon="solar:cart-outline" className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#110C0B] text-yellow-400 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-900 p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Icon
              icon={isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'}
              className="text-2xl"
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-t border-gray-100 shadow-xl py-4 px-5 space-y-4 animate-in fade-in">
          <SearchBar />

          <div className="flex flex-col space-y-1.5 pt-2">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3.5 text-gray-900 font-semibold hover:bg-yellow-50 rounded-xl flex items-center gap-2"
            >
              <Icon icon="solar:box-minimalistic-linear" className="text-lg text-yellow-600" />
              <span>All Products Catalog</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3.5 text-gray-900 font-semibold hover:bg-yellow-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:heart-linear" className="text-lg text-yellow-600" />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-[#FFD40C] text-gray-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3.5 text-gray-900 font-semibold hover:bg-yellow-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:cart-outline" className="text-lg text-yellow-600" />
                <span>Shopping Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-black text-yellow-400 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 text-center rounded-xl bg-gray-100 text-gray-900 font-bold text-sm"
                >
                  My Profile ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full py-2.5 px-4 text-center rounded-xl bg-red-50 text-red-600 font-bold text-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-[#FFD40C] text-gray-950 font-bold py-3 rounded-full text-center shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
