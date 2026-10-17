import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { categoryApi } from '../../api/category.api';
import { getDisplayImageUrl } from '../../utils/formatters';

const SubNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

  // Load categories and pre-fetch subcategories for instant hover dropdown
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    categoryApi
      .list()
      .then((cats) => {
        if (!isMounted || !Array.isArray(cats)) return;
        setCategories(cats);

        // Pre-fetch subcategories for each category in parallel
        cats.forEach((cat) => {
          if (!cat.slug) return;
          categoryApi
            .listSubCategories(cat.slug)
            .then((subs) => {
              if (isMounted) {
                setSubCategoriesMap((prev) => ({
                  ...prev,
                  [cat.slug]: Array.isArray(subs) ? subs : [],
                }));
              }
            })
            .catch(() => {});
        });
      })
      .catch((err) => {
        console.error('Failed to load categories for subnavbar:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Handle dropdown mouse enter with debounce cancellation & fallback fetch
  const handleMouseEnter = (slug) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(slug);

    if (subCategoriesMap[slug] === undefined) {
      categoryApi
        .listSubCategories(slug)
        .then((subs) => {
          setSubCategoriesMap((prev) => ({
            ...prev,
            [slug]: Array.isArray(subs) ? subs : [],
          }));
        })
        .catch(() => {});
    }
  };

  // Handle dropdown mouse leave with graceful delay
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const isAllProductsActive = location.pathname === '/products' && !location.search;

  return (
    <div className="w-full bg-white border-b border-gray-100 font-poppins relative z-30 shadow-xs overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible relative">
        {/* Categories Navigation Bar */}
        <nav
          className="flex items-center justify-start md:justify-center gap-1 sm:gap-1.5 py-2 w-full overflow-x-auto md:overflow-visible scrollbar-hide text-xs sm:text-[13px]"
          aria-label="Category Navigation"
        >
          {/* All Products Tab */}
          <Link
            to="/products"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-150 shrink-0 select-none ${
              isAllProductsActive
                ? 'bg-yellow-400 text-gray-950 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/80'
            }`}
          >
            <Icon
              icon="solar:widget-2-bold"
              className={`text-base ${
                isAllProductsActive ? 'text-gray-950' : 'text-gray-400'
              }`}
            />
            <span>All Products</span>
          </Link>

          {/* Vertical Separator */}
          <div className="h-4 w-px bg-gray-200 shrink-0 mx-1" />

          {/* Skeletons while loading */}
          {isLoading && categories.length === 0 && (
            <div className="flex items-center gap-2">
              {[80, 65, 75, 90, 70].map((width, idx) => (
                <div
                  key={idx}
                  className="h-7 bg-gray-100 rounded-lg animate-pulse shrink-0"
                  style={{ width: `${width}px` }}
                />
              ))}
            </div>
          )}

          {/* Dynamic Categories */}
          {categories.map((cat, index) => {
            // Exact path matching avoids prefix clashes like /category/test vs /category/test6
            const isCategoryActive =
              location.pathname === `/category/${cat.slug}` ||
              location.pathname.startsWith(`/category/${cat.slug}/`);

            const subs = subCategoriesMap[cat.slug] || [];
            const isDropdownOpen = activeDropdown === cat.slug;
            const hasSubcategories = subs.length > 0;

            const isFirstFew = index < 2;
            const isLastFew = index >= categories.length - 2;
            const dropdownAlignClass = isFirstFew
              ? 'left-0'
              : isLastFew
              ? 'right-0'
              : 'left-1/2 -translate-x-1/2';

            return (
              <div
                key={cat._id || cat.slug}
                className="relative shrink-0 group overflow-visible"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Category Main Button */}
                <Link
                  to={`/category/${cat.slug}`}
                  title={cat.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-150 whitespace-nowrap select-none cursor-pointer ${
                    isCategoryActive
                      ? 'bg-yellow-400 text-gray-950 font-semibold shadow-xs'
                      : isDropdownOpen
                      ? 'bg-gray-100 text-gray-950 font-medium'
                      : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/80'
                  }`}
                >
                  <span className="truncate max-w-[130px] sm:max-w-[170px] md:max-w-[210px]">
                    {cat.name}
                  </span>
                  {hasSubcategories && (
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      className={`text-[11px] transition-transform duration-200 ${
                        isCategoryActive
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-700'
                      } ${isDropdownOpen ? 'rotate-180 text-yellow-700' : ''}`}
                    />
                  )}
                </Link>

                {/* Subcategories Dropdown Menu - Shown on hover & active */}
                {hasSubcategories && (
                  <div
                    className={`absolute top-full ${dropdownAlignClass} pt-1.5 z-[100] ${
                      isDropdownOpen
                        ? 'block opacity-100 visible pointer-events-auto'
                        : 'hidden md:group-hover:block opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible pointer-events-none md:group-hover:pointer-events-auto'
                    }`}
                    onMouseEnter={() => handleMouseEnter(cat.slug)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/90 p-2.5 text-left">
                      {/* Dropdown Header */}
                      <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 mb-1.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate mr-2">
                          {cat.name} Subcategories
                        </span>
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="text-[11px] text-yellow-800 hover:text-yellow-900 font-bold flex items-center gap-0.5 hover:underline shrink-0"
                        >
                          <span>All</span>
                          <Icon icon="solar:arrow-right-linear" className="text-xs" />
                        </Link>
                      </div>

                      {/* Subcategories List */}
                      <div className="py-1 space-y-1 max-h-80 overflow-y-auto scrollbar-hide">
                        {subs.map((sub) => {
                          const isSubActive =
                            location.pathname === `/category/${cat.slug}/${sub.slug}`;
                          return (
                            <Link
                              key={sub._id || sub.slug}
                              to={`/category/${cat.slug}/${sub.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer group/item ${
                                isSubActive
                                  ? 'bg-yellow-50 text-yellow-950 font-semibold'
                                  : 'text-gray-700 hover:bg-amber-50/70 hover:text-black'
                              }`}
                            >
                              {sub.image ? (
                                <img
                                  src={getDisplayImageUrl(sub.image)}
                                  alt={sub.name}
                                  className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100 shadow-2xs"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0 border border-yellow-100">
                                  <Icon
                                    icon="solar:folder-with-files-linear"
                                    className="text-base"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate leading-tight group-hover/item:text-yellow-800 transition-colors">
                                  {sub.name}
                                </p>
                                {sub.description && (
                                  <p className="text-[10px] text-gray-400 truncate leading-normal mt-0.5">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                              <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="text-gray-300 text-xs shrink-0 group-hover/item:text-yellow-700 group-hover/item:translate-x-0.5 transition-all"
                              />
                            </Link>
                          );
                        })}
                      </div>

                      {/* Dropdown Footer CTA */}
                      <div className="pt-2 mt-1 border-t border-gray-100 px-1">
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Explore All {cat.name}</span>
                          <Icon icon="solar:arrow-right-linear" className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SubNavbar;

