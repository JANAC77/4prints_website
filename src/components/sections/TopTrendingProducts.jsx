import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { productApi } from '../../api/product.api';
import { getDisplayImageUrl } from '../../utils/formatters';

const TrendingCard = ({ product, index, total }) => {
  const [hovered, setHovered] = useState(false);
  const rank = index + 1;
  const isFirst = index === 0;
  const isLast = total ? index === total - 1 : rank >= 10;

  const mlClass = isFirst ? 'ml-[32px] sm:ml-[45px]' : isLast ? 'ml-[70px] sm:ml-[100px]' : 'ml-[45px] sm:ml-[60px]';
  const plClass = isFirst ? 'pl-[32px] sm:pl-[45px]' : isLast ? 'pl-[70px] sm:pl-[100px]' : 'pl-[45px] sm:pl-[60px]';
  const cardWidthClass = isFirst ? 'w-[155px] sm:w-[185px]' : isLast ? 'w-[195px] sm:w-[240px]' : 'w-[170px] sm:w-[200px]';

  const title = product.name || product.title;
  const slug = product.slug || product._id || product.id;
  const image =
    (product.images && product.images[0]?.url) ||
    product.image ||
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

  return (
    <Link
      to={`/product/${slug}`}
      className={`relative shrink-0 snap-start cursor-pointer group block active:scale-98 transition-transform ${cardWidthClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number behind card */}
      <span
        className="absolute left-0 bottom-[22px] sm:bottom-[28px] font-black leading-none select-none pointer-events-none z-0 transition-all duration-300 text-[105px] sm:text-[140px]"
        style={{
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: hovered ? '3px #FFD40C' : '2.5px #d1d5db',
          transition: 'all 0.3s ease',
        }}
      >
        {rank}
      </span>

      {/* Image card — overlapping the number, offset to the right */}
      <div
        className={`relative z-10 ${mlClass} aspect-square rounded-[14px] overflow-hidden shadow-md bg-gray-100 transition-all duration-300`}
        style={{
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.18)'
            : '0 4px 16px rgba(0,0,0,0.08)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        />
      </div>

      {/* Product Title */}
      <h3
        className={`mt-2 sm:mt-3 font-semibold text-gray-900 text-xs sm:text-sm line-clamp-1 ${plClass} transition-colors duration-200 group-hover:text-gray-700`}
        title={title}
      >
        {title}
      </h3>
    </Link>
  );
};

const TopTrendingProducts = () => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productApi
      .list({ limit: 10 })
      .then((res) => {
        if (isMounted && res.products && res.products.length > 0) {
          const sorted = [...res.products].sort((a, b) => {
            const aFeat = a.status?.featured ? 1 : 0;
            const bFeat = b.status?.featured ? 1 : 0;
            return bFeat - aFeat;
          });
          setProducts(sorted);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch live trending products:', err);
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
    <section className="py-3 sm:py-5 lg:py-8 bg-[#fdfbf6]">
      <div className="relative group w-full">
        {/* Section Header */}
        <div className="px-4 sm:px-6 md:px-8 flex items-center gap-3 mb-2 sm:mb-4">
          <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 font-poppins">
            Top 10 Trending Products
          </h2>
        </div>

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
          className="flex overflow-x-auto gap-2 md:gap-3 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 snap-x snap-mandatory scrollbar-hide pt-2 sm:pt-4 scroll-smooth"
        >
          {products.map((product, index) => (
            <div 
              key={product._id || product.id || index} 
              className="snap-start shrink-0"
            >
              <TrendingCard 
                product={product} 
                index={index} 
                total={products.length} 
              />
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

export default TopTrendingProducts;
