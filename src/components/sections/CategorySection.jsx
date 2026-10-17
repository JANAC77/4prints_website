import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';
import { Icon } from '@iconify/react';
import { categoryApi } from '../../api/category.api';

const CategorySection = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    categoryApi.list().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setCategories(data);
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
  }, [categories]);

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

  if (categories.length === 0) return null;

  return (
    <section className="my-6 lg:my-10 bg-[#fdfbf6] w-full">
      <div className="relative group w-full max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between px-4 sm:px-6 md:px-8 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
              <Icon icon="solar:widget-2-bold" className="text-yellow-600" />
              <span>Catalog Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm text-yellow-800 hover:text-black font-bold flex items-center gap-1 transition-colors"
          >
            <span>View All ({categories.length})</span>
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
          className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {categories.map((category, index) => (
            <div
              key={category._id || category.id || index}
              className={`snap-start shrink-0 ${index === 0 ? 'pl-1' : ''}`}
            >
              <CategoryCard category={category} />
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

export default CategorySection;
