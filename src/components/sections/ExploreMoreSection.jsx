import React, { useRef, useState, useEffect } from 'react';
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
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-5 lg:py-8 bg-[#fdfbf6]">
      <div className="relative group w-full">
        <div className="px-4 sm:px-6 md:px-8 flex justify-between items-end mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 font-poppins mb-2">
              Explore More Products
            </h2>
            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
              Discover our wide range of high-quality customizable items.
            </p>
          </div>
        </div>

        {/* Left Button */}
        {canScrollLeft && (
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-yellow-100 hover:text-yellow-800 text-gray-700 cursor-pointer"
            aria-label="Scroll left"
          >
            <Icon icon="lucide:chevron-left" className="text-2xl" />
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 px-4 sm:px-6 md:px-8 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {products.map((product, index) => (
            <div 
              key={product._id || product.id || index} 
              className={`snap-start shrink-0 ${index === 0 ? 'pl-[32px]' : ''}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Right Button */}
        {canScrollRight && (
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-yellow-100 hover:text-yellow-800 text-gray-700 cursor-pointer"
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
