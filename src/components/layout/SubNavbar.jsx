import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { categoryApi } from '../../api/category.api';
import { getDisplayImageUrl } from '../../utils/formatters';

const SubNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [loadingSubs, setLoadingSubs] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

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

  // Check scroll overflow for navigation arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle dropdown mouse enter with debounce cancellation & fallback fetch
  const handleMouseEnter = (slug) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(slug);

    if (subCategoriesMap[slug] === undefined) {
      setLoadingSubs((prev) => ({ ...prev, [slug]: true }));
      categoryApi
        .listSubCategories(slug)
        .then((subs) => {
          setSubCategoriesMap((prev) => ({
            ...prev,
            [slug]: Array.isArray(subs) ? subs : [],
          }));
        })
        .catch(() => {
          setSubCategoriesMap((prev) => ({ ...prev, [slug]: [] }));
        })
        .finally(() => {
          setLoadingSubs((prev) => ({ ...prev, [slug]: false }));
        });
    }
  };

  // Handle dropdown mouse leave with graceful delay
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const isAllProductsActive = location.pathname === '/products' && !location.search;

  return (
    <div className="w-full bg-[#fdfbf6]/95 backdrop-blur-md border-b border-gray-200/70 font-poppins relative z-40 overflow-visible shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 relative overflow-visible">
        <div className="relative flex items-center py-2 overflow-visible">
          
          {/* Scroll Left Button (Visible on desktop when overflowed) */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll categories left"
              className="hidden md:flex absolute left-0 z-20 w-7 h-7 -ml-2 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-yellow-100 transition-all cursor-pointer"
            >
              <Icon icon="lucide:chevron-left" className="text-base" />
            </button>
          )}

          {/* Categories Horizontal Navigation Bar */}
          <nav
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-1.5 sm:gap-2 w-full overflow-x-auto md:overflow-visible scrollbar-hide py-1 text-xs sm:text-[13px]"
            aria-label="Category Navigation"
          >
            {/* All Products Tab Pill */}
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 shrink-0 select-none shadow-2xs ${
                isAllProductsActive
                  ? 'bg-[#FFD40C] text-gray-950 font-bold ring-1 ring-yellow-500/30'
                  : 'bg-white/80 hover:bg-white text-gray-800 border border-gray-200/70 hover:border-gray-300'
              }`}
            >
              <Icon
                icon="solar:widget-2-bold"
                className={`text-base ${
                  isAllProductsActive ? 'text-gray-950' : 'text-yellow-600'
                }`}
              />
              <span>All Products</span>
            </Link>

            {/* Vertical Separator */}
            <div className="h-5 w-px bg-gray-300/60 shrink-0 mx-1" />

            {/* Skeletons while loading */}
            {isLoading && categories.length === 0 && (
              <div className="flex items-center gap-2">
                {[85, 70, 95, 80, 75].map((width, idx) => (
                  <div
                    key={idx}
                    className="h-8 bg-gray-200/60 rounded-full animate-pulse shrink-0"
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>
            )}

            {/* Dynamic Category Pills */}
            {categories.map((cat, index) => {
              const isCategoryActive =
                location.pathname === `/category/${cat.slug}` ||
                location.pathname.startsWith(`/category/${cat.slug}/`);

              const subs = subCategoriesMap[cat.slug] || (Array.isArray(cat.subcategories) ? cat.subcategories : []);
              const isDropdownOpen = activeDropdown === cat.slug;
              const isFetchingSubs = loadingSubs[cat.slug];
              const hasSubcategories = subs.length > 0 || isFetchingSubs || cat.hasSubcategories;

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
                  {/* Category Pill Link */}
                  <Link
                    to={`/category/${cat.slug}`}
                    title={cat.name}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 whitespace-nowrap select-none cursor-pointer border ${
                      isCategoryActive
                        ? 'bg-[#FFD40C] text-gray-950 font-bold border-yellow-400 shadow-2xs'
                        : isDropdownOpen
                        ? 'bg-white text-gray-950 font-semibold border-gray-300 shadow-xs'
                        : 'bg-transparent text-gray-700 border-transparent hover:bg-white hover:text-black hover:border-gray-200/80 hover:shadow-2xs'
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
                            ? 'text-gray-950'
                            : 'text-gray-400 group-hover:text-gray-700'
                        } ${isDropdownOpen ? 'rotate-180 text-yellow-700' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Subcategories Modern Dropdown Menu */}
                  {hasSubcategories && (
                    <div
                      className={`absolute top-full ${dropdownAlignClass} pt-2 z-[9999] transition-all duration-150 ${
                        isDropdownOpen
                          ? 'block opacity-100 visible pointer-events-auto'
                          : 'hidden md:group-hover:block opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible pointer-events-none md:group-hover:pointer-events-auto'
                      }`}
                      onMouseEnter={() => handleMouseEnter(cat.slug)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="w-72 sm:w-80 bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/90 p-3 text-left">
                        {/* Dropdown Header */}
                        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 mb-2">
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

                        {/* Loading State Skeleton */}
                        {isFetchingSubs && subs.length === 0 ? (
                          <div className="space-y-2 py-2 px-1">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-xl animate-pulse">
                                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                              </div>
                            ))}
                          </div>
                        ) : subs.length > 0 ? (
                          /* Subcategories List */
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
                                      : 'text-gray-700 hover:bg-yellow-50/70 hover:text-black'
                                  }`}
                                >
                                  {sub.image ? (
                                    <img
                                      src={getDisplayImageUrl(sub.image)}
                                      alt={sub.name}
                                      className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100 shadow-2xs"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-yellow-100/80 text-yellow-800 flex items-center justify-center shrink-0 border border-yellow-200/60">
                                      <Icon
                                        icon="solar:folder-with-files-linear"
                                        className="text-base"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate leading-tight group-hover/item:text-yellow-900 transition-colors">
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
                        ) : (
                          /* Fallback when no subcategories returned */
                          <div className="py-3 px-3 text-center text-xs text-gray-500">
                            <p>No specific subcategories listed.</p>
                            <Link
                              to={`/category/${cat.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="text-yellow-800 font-bold hover:underline block mt-1"
                            >
                              Explore all {cat.name}
                            </Link>
                          </div>
                        )}

                        {/* Dropdown Footer CTA */}
                        <div className="pt-2 mt-1 border-t border-gray-100 px-1">
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-yellow-100 text-gray-700 hover:text-yellow-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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

          {/* Scroll Right Button (Visible on desktop when overflowed) */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll categories right"
              className="hidden md:flex absolute right-0 z-20 w-7 h-7 -mr-2 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-yellow-100 transition-all cursor-pointer"
            >
              <Icon icon="lucide:chevron-right" className="text-base" />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
