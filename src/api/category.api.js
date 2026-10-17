import { apiRequest } from './client.js';

const cache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache for categories

export const categoryApi = {
  /**
   * List all active categories directly from backend with caching
   */
  async list() {
    const cacheKey = 'categories:all';

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const promise = apiRequest('/categories')
      .then((res) => {
        const categories = res?.categories || [];
        cache.set(cacheKey, { data: categories, timestamp: Date.now() });

        // Pre-cache individual categories by slug
        categories.forEach((c) => {
          if (c?.slug) {
            cache.set(`cat:${c.slug}`, { data: c, timestamp: Date.now() });
          }
        });

        return categories;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, promise);
    return promise;
  },

  /**
   * Get single category by slug directly from backend
   */
  async getBySlug(slug) {
    const cacheKey = `cat:${slug}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const promise = apiRequest(`/categories/${slug}`)
      .then((res) => {
        if (!res?.category) {
          throw new Error(res?.error?.message || 'Category not found');
        }
        cache.set(cacheKey, { data: res.category, timestamp: Date.now() });
        return res.category;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, promise);
    return promise;
  },

  /**
   * List subcategories under category directly from backend
   */
  async listSubCategories(categorySlug) {
    const cacheKey = `subs:${categorySlug}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const promise = apiRequest(`/categories/${categorySlug}/subcategories`)
      .then((res) => {
        const subs = res?.subcategories || [];
        cache.set(cacheKey, { data: subs, timestamp: Date.now() });
        return subs;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, promise);
    return promise;
  },

  /**
   * Get single subcategory directly from backend
   */
  async getSubCategory(categorySlug, subSlug) {
    const cacheKey = `sub:${categorySlug}:${subSlug}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const promise = apiRequest(`/categories/${categorySlug}/subcategories/${subSlug}`)
      .then((res) => {
        if (!res?.subcategory) {
          throw new Error(res?.error?.message || 'SubCategory not found');
        }
        cache.set(cacheKey, { data: res.subcategory, timestamp: Date.now() });
        return res.subcategory;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, promise);
    return promise;
  },

  /**
   * Clear in-memory categories cache
   */
  clearCache() {
    cache.clear();
    inFlightRequests.clear();
  },
};
