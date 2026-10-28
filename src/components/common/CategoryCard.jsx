import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayImageUrl } from '../../utils/formatters';

const CategoryCard = ({ category }) => {
  const title = category.name || category.title;
  const slug = category.slug || String(category.id || category._id);
  const image = category.image;
  const count = category.subcategoriesCount
    ? `${category.subcategoriesCount} subcategories`
    : category.count || 'Custom Prints';

  return (
    <Link
      to={`/category/${slug}`}
      className="p-2 sm:p-3 md:p-4 flex flex-col items-center w-[110px] sm:w-[140px] md:w-[160px] lg:w-[180px] cursor-pointer group"
    >
      <div className="relative w-full aspect-square rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 bg-[#f4f1ea] transition-transform duration-300 group-hover:scale-105">
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className="w-2/3 h-2/3 object-cover"
          loading="lazy"
        />
        {category.badge && (
          <div className="absolute -top-1 -right-1 sm:top-1 sm:-right-2 bg-[#FFD40C] text-gray-900 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap z-10">
            <span>{category.badge}</span>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm text-center line-clamp-1 w-full" title={title}>
        {title}
      </h3>
      <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-center">
        {count}
      </p>
    </Link>
  );
};

export default CategoryCard;
