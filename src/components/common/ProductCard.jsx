import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { Icon } from '@iconify/react';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, getDisplayImageUrl } from '../../utils/formatters';

const ProductCard = ({ product, className = '' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Normalize product fields between backend schema and legacy mock
  const id = product._id || product.id;
  const title = product.name || product.title;
  const slug = product.slug || id;
  const image =
    (product.images && product.images[0]?.url) ||
    product.image ||
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

  // Determine pricing display with clean Rupee symbol
  let priceDisplay = '';
  let qtyDisplay = product.qty ? `for Qty ${product.qty}` : '';
  if (product.pricing && product.pricing.length > 0) {
    const minTier = product.pricing[0];
    priceDisplay = formatCurrency(minTier.price);
    qtyDisplay = `for Qty ${minTier.quantity}`;
  } else if (product.priceStr) {
    priceDisplay = product.priceStr.includes('₹')
      ? product.priceStr
      : formatCurrency(product.priceStr);
  } else if (product.price !== undefined && product.price !== null) {
    priceDisplay = formatCurrency(product.price);
  } else {
    priceDisplay = '₹250';
    qtyDisplay = 'for Qty 100';
  }

  const ratingVal =
    typeof product.rating === 'number'
      ? product.rating
      : typeof product.rating?.average === 'number'
      ? product.rating.average
      : 4.8;

  const reviewsCount =
    typeof product.reviews === 'number'
      ? product.reviews
      : typeof product.rating?.totalReviews === 'number'
      ? product.rating.totalReviews
      : 0;

  const inWishlist = isInWishlist(id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      ...product,
      _id: id,
      name: title,
      slug,
      image,
      images: [{ url: image }],
    });
  };

  const defaultDimensions = 'w-[155px] xs:w-[170px] sm:w-[220px] md:w-[260px] shrink-0';

  return (
    <Link
      to={`/product/${slug}`}
      className={`bg-white rounded-xl sm:rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden transition-all duration-200 active:scale-[0.98] ${className || defaultDimensions}`}
    >
      <div className="relative h-[120px] xs:h-[135px] sm:h-[175px] md:h-[210px] w-full bg-gray-100 shrink-0">
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Heart Icon */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 p-1 rounded-full shadow-sm hover:text-red-500 text-gray-600 transition-colors focus:outline-none z-10 cursor-pointer active:scale-90"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            icon={inWishlist ? 'solar:heart-bold' : 'mingcute:heart-line'}
            className={`text-base sm:text-lg md:text-xl ${inWishlist ? 'text-red-500' : ''}`}
          />
        </button>
      </div>

      <div className="p-2 xs:p-2.5 sm:p-3.5 md:p-4 flex flex-col flex-grow">
        <h3
          className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-1 mb-1 sm:mb-2 md:mb-2.5"
          title={title}
        >
          {title}
        </h3>

        <div className="flex justify-between items-end mt-auto text-[10px] sm:text-xs gap-1">
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-900 leading-tight whitespace-nowrap">{priceDisplay}</span>
            {qtyDisplay && (
              <span className="text-gray-500 text-[9px] sm:text-[11px] leading-tight truncate whitespace-nowrap">{qtyDisplay}</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 font-semibold text-gray-900 shrink-0 self-end">
            <AiFillStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-black" />
            <span>{ratingVal}</span>
            {reviewsCount > 0 && (
              <span className="text-gray-500 font-normal hidden sm:inline">({reviewsCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
