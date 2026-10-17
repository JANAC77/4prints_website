import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { colors } from "../../styles/theme";
import { productApi } from "../../api/product.api";
import { formatCurrency, getDisplayImageUrl } from "../../utils/formatters";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await productApi.list({ search: query.trim(), limit: 5 });
        setSuggestions(res.products || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    clearSearch();
    setIsFocused(false);
    navigate(`/product/${slug}`);
  };

  return (
    <div ref={containerRef} className="group relative w-full max-w-xl z-50">
      <form onSubmit={handleSearchSubmit}>
        <div
          className="flex items-center h-11 rounded-xl border-2 bg-white transition-all duration-300 shadow-xs"
          style={{
            borderColor: isFocused ? colors.primary : colors.border.main,
          }}
        >
          {/* Search Icon */}
          <button
            type="submit"
            className="pl-4 flex items-center hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <Icon
              icon="solar:magnifer-linear"
              width={20}
              height={20}
              color={isFocused ? colors.secondary : colors.text.muted}
              className="transition-all duration-300"
            />
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search visiting cards, t-shirts, flyers, mugs..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                clearSearch();
                setIsFocused(false);
              }
            }}
            className="flex-1 h-full px-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
            style={{
              color: colors.text.main,
            }}
          />

          {/* Loading or Clear */}
          {isLoading ? (
            <div className="mr-3">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-gray-400 text-lg"
              />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="mr-2 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width={18}
                color="#000"
              />
            </button>
          ) : null}
        </div>
      </form>

      {/* Live Suggestions Dropdown */}
      {isFocused && (suggestions.length > 0 || (query.trim().length >= 2 && !isLoading)) && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] divide-y divide-gray-50"
          onMouseDown={(e) => e.preventDefault()} // Prevents blur before click
        >
          {suggestions.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Matching Products
              </div>
              {suggestions.map((item) => {
                const imgUrl = getDisplayImageUrl(
                  (item.images && item.images[0]?.url) ||
                    item.image ||
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80'
                );

                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectProduct(item.slug)}
                    className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-yellow-50/80 cursor-pointer transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover/item:text-yellow-800 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.pricing?.[0]
                          ? `From ${formatCurrency(item.pricing[0].price)} for Qty ${item.pricing[0].quantity}`
                          : item.price
                          ? `From ${formatCurrency(item.price)}`
                          : `Custom Print Product`}
                      </p>
                    </div>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="text-gray-400 group-hover/item:text-yellow-700 text-base"
                    />
                  </div>
                );
              })}
              <div
                onClick={handleSearchSubmit}
                className="px-4 py-2.5 text-center text-xs font-bold text-yellow-900 bg-yellow-100/70 hover:bg-yellow-100 cursor-pointer transition-colors"
              >
                View all results for "{query}" &rarr;
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No products found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
