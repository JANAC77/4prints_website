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
      className="p-2 sm:p-3 flex flex-col items-center w-[115px] sm:w-[140px] md:w-[160px] lg:w-[175px] cursor-pointer group"
    >
      {/* Circle Capsule */}
      <div className="relative w-full aspect-square rounded-full p-1 bg-white border border-gray-100 shadow-xs group-hover:shadow-lg group-hover:border-yellow-400/80 transition-all duration-300 mb-2.5 sm:mb-3">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={getDisplayImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-112"
            loading="lazy"
          />

          {category.badge && (
            <div className="absolute top-1.5 right-1.5 bg-[#FFD40C] text-gray-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs z-10">
              <span>{category.badge}</span>
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <h3
        className="font-bold text-gray-900 text-xs sm:text-sm text-center line-clamp-1 w-full group-hover:text-yellow-800 transition-colors"
        title={title}
      >
        {title}
      </h3>
      <span className="text-gray-400 text-[10px] sm:text-[11px] mt-0.5 text-center truncate max-w-full">
        {count}
      </span>
    </Link>
  );
};

export default CategoryCard;
