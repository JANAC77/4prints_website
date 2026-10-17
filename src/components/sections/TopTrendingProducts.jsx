import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { productApi } from '../../api/product.api';
import { getDisplayImageUrl, formatCurrency } from '../../utils/formatters';

const TrendingCard = ({ product, index, total }) => {
  const [hovered, setHovered] = useState(false);
  const rank = index + 1;
  const isFirst = index === 0;
  const isLast = total ? index === total - 1 : rank >= 10;

  const mlClass = isFirst ? 'ml-[45px]' : isLast ? 'ml-[90px]' : 'ml-[60px]';
  const plClass = isFirst ? 'pl-[45px]' : isLast ? 'pl-[90px]' : 'pl-[60px]';
  const cardWidth = isFirst ? '195px' : isLast ? '240px' : '210px';

  const title = product.name || product.title;
  const slug = product.slug || product._id;
  const image =
    (product.images && product.images[0]?.url) ||
    product.image ||
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

  return (
    <Link
      to={`/product/${slug}`}
      className="relative shrink-0 snap-start cursor-pointer group block"
      style={{ width: cardWidth }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Giant Number behind card */}
      <span
        className="absolute left-0 bottom-[32px] font-black leading-none select-none pointer-events-none z-0 transition-all duration-300"
        style={{
          fontSize: '140px',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: hovered ? '3.5px #FFD40C' : '2px #d1d5db',
          filter: hovered ? 'drop-shadow(0 4px 12px rgba(255,212,12,0.4))' : 'none',
        }}
      >
        {rank}
      </span>

      {/* Image card — overlapping the number, offset to the right */}
      <div
        className={`relative z-10 ${mlClass} aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100 transition-all duration-300`}
        style={{
          boxShadow: hovered
            ? '0 16px 36px rgba(0,0,0,0.15)'
            : '0 4px 16px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Hover dark gradient overlay with icon */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <span className="text-[11px] font-bold text-white flex items-center gap-1">
            <span>View Product</span>
            <Icon icon="solar:arrow-right-linear" className="text-yellow-400" />
          </span>
        </div>
      </div>

      {/* Product Title */}
      <h3
        className={`mt-3 font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 ${plClass} transition-colors duration-200 group-hover:text-yellow-800`}
        title={title}
      >
        {title}
      </h3>

      {/* Starting Price with Rupee Symbol */}
      <div className={`mt-1 text-xs font-extrabold text-gray-950 flex items-baseline gap-1.5 ${plClass}`}>
        <span>
          {product.pricing && product.pricing.length > 0
            ? formatCurrency(product.pricing[0].price)
            : '₹250'}
        </span>
        {product.pricing && product.pricing[0]?.quantity && (
          <span className="text-[10px] text-gray-400 font-normal">
            ({product.pricing[0].quantity} pcs)
          </span>
        )}
      </div>
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
      .list({ limit: 12 })
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
        {/* Section Header */}
        <div className="px-4 sm:px-6 md:px-8 flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
              <Icon icon="solar:chart-bold" className="text-yellow-600" />
              <span>Trending Leaderboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Top 10 Trending Products
            </h2>
          </div>
          <Link
            to="/products?badge=featured"
            className="text-xs sm:text-sm text-yellow-800 hover:text-black font-bold flex items-center gap-1 transition-colors"
          >
            <span>View All Featured</span>
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>

        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 sm:left-4 top-[50%] -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-[#FFD40C] hover:text-black text-gray-800 cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            <Icon icon="lucide:chevron-left" className="text-2xl" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-3 md:gap-4 px-4 sm:px-6 md:px-8 pb-8 snap-x snap-mandatory scrollbar-hide pt-4 scroll-smooth"
        >
          {products.map((product, index) => (
            <div
              key={product._id || product.id || index}
              className={`snap-start shrink-0 ${index === 0 ? 'pl-6' : 'pl-1'}`}
            >
              <TrendingCard
                product={product}
                index={index}
                total={products.length}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 sm:right-4 top-[50%] -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-[#FFD40C] hover:text-black text-gray-800 cursor-pointer active:scale-95"
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
