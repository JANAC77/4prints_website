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

  const defaultDimensions = 'w-[180px] sm:w-[220px] md:w-[260px] shrink-0';

  return (
    <Link
      to={`/product/${slug}`}
      className={`group bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 hover:border-yellow-300/80 ${className || defaultDimensions}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-gray-50 to-gray-100/60 overflow-hidden shrink-0">
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Soft dark vignette on bottom on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.status?.bestSeller && (
            <span className="bg-yellow-400 text-gray-950 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
              ★ Best Seller
            </span>
          )}
          {product.status?.newArrival && !product.status?.bestSeller && (
            <span className="bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.status?.featured && !product.status?.bestSeller && !product.status?.newArrival && (
            <span className="bg-gray-900 text-yellow-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className={`absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 z-10 cursor-pointer active:scale-90 ${
            inWishlist
              ? 'bg-white text-red-500 shadow-md ring-2 ring-red-100'
              : 'bg-white/85 backdrop-blur-md text-gray-600 hover:text-red-500 hover:bg-white hover:scale-105'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            icon={inWishlist ? 'solar:heart-bold' : 'solar:heart-linear'}
            className="text-lg sm:text-xl"
          />
        </button>

        {/* Slide-up "Customize Print" Action Pill on Hover */}
        <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out hidden sm:flex items-center justify-center">
          <span className="w-full bg-[#110C0B] hover:bg-black text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md">
            <span>Customize Print</span>
            <Icon icon="solar:arrow-right-linear" className="text-yellow-400 text-sm" />
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3
            className="font-semibold text-gray-900 text-xs sm:text-sm md:text-[15px] line-clamp-1 mb-1 group-hover:text-yellow-800 transition-colors"
            title={title}
          >
            {title}
          </h3>

          {product.shortDescription && (
            <p className="text-[11px] text-gray-500 line-clamp-1 mb-2 hidden sm:block">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100/80 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-gray-950 text-sm sm:text-base tracking-tight leading-tight">
              {priceDisplay}
            </span>
            <span className="text-gray-400 text-[10px] sm:text-[11px] whitespace-nowrap">
              {qtyDisplay}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 shrink-0">
            <AiFillStar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-gray-900">{ratingVal}</span>
            {reviewsCount > 0 && (
              <span className="text-gray-400 text-[10px] font-normal">({reviewsCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
