import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { Icon } from '@iconify/react';
import { productApi } from '../../api/product.api';

const ExploreMoreSection = () => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productApi.list({ limit: 12 }).then((res) => {
      if (isMounted && res.products) {
        setProducts(res.products);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-6 lg:py-10 bg-[#fdfbf6]">
      <div className="relative group w-full max-w-[1440px] mx-auto">
        <div className="px-4 sm:px-6 md:px-8 flex justify-between items-end mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
              <Icon icon="solar:compass-bold" className="text-yellow-600" />
              <span>Full Print Selection</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore More Products
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Discover our wide range of high-quality customizable print items for every occasion.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-yellow-800 hover:text-black flex items-center gap-1 transition-colors shrink-0"
          >
            <span>View All</span>
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>

        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 sm:left-4 top-[58%] -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-[#FFD40C] hover:text-black text-gray-800 cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            <Icon icon="lucide:chevron-left" className="text-2xl" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 sm:gap-5 px-4 sm:px-6 md:px-8 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {products.map((product, index) => (
            <div
              key={product._id || product.id || index}
              className={`snap-start shrink-0 ${index === 0 ? 'pl-1' : ''}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 sm:right-4 top-[58%] -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-[#FFD40C] hover:text-black text-gray-800 cursor-pointer active:scale-95"
            aria-label="Scroll right"
          >
            <Icon icon="lucide:chevron-right" className="text-2xl" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ExploreMoreSection;
