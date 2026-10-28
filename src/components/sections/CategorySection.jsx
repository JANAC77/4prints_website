import React, { useRef, useState, useEffect } from 'react';
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
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (categories.length === 0) return null;

  return (
    <section className="my-3 sm:my-5 lg:my-8 mt-4 sm:mt-8 bg-[#fdfbf6] w-full">
      <div className="relative group w-full">
        <h2 className="px-4 sm:px-6 md:px-8 text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 lg:mb-6 font-poppins">
          Explore all categories
        </h2>
        
        {/* Left Button - desktop only */}
        {canScrollLeft && (
          <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-2 top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-yellow-100 hover:text-yellow-800 text-gray-700 cursor-pointer"
            aria-label="Scroll left"
          >
            <Icon icon="lucide:chevron-left" className="text-2xl" />
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {categories.map((category) => (
            <div 
              key={category._id || category.id} 
              className="snap-start shrink-0"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* Right Button - desktop only */}
        {canScrollRight && (
          <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-2 top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-yellow-100 hover:text-yellow-800 text-gray-700 cursor-pointer"
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
