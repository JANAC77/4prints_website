import { apiRequest } from './client.js';

// High-performance in-memory cache & concurrent request deduplication
const cache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 120 * 1000; // 2 minutes fresh cache

function getCacheKey(endpoint, params = {}) {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
  return `${endpoint}?${serialized}`;
}

export const productApi = {
  /**
   * List active products directly from backend with in-flight deduplication & caching
   */
  async list(params = {}) {
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category) query.set('category', params.category);
    if (params.subCategory) query.set('subCategory', params.subCategory);

    if (params.featured !== undefined && params.featured !== null && params.featured !== '') {
      query.set('featured', String(params.featured));
    }
    if (params.bestSeller !== undefined && params.bestSeller !== null && params.bestSeller !== '') {
      query.set('bestSeller', String(params.bestSeller));
    }
    if (params.newArrival !== undefined && params.newArrival !== null && params.newArrival !== '') {
      query.set('newArrival', String(params.newArrival));
    }

    if (params.search?.trim()) query.set('search', params.search.trim());
    if (params.tags?.trim()) query.set('tags', params.tags.trim());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const endpoint = `/products${qs}`;
    const cacheKey = getCacheKey('/products', params);

    // 1. Check fresh memory cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // 2. Reuse in-flight request to prevent duplicate network calls
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    // 3. Dispatch single network fetch
    const fetchPromise = apiRequest(endpoint)
      .then((res) => {
        const result = {
          products: res?.products || [],
          total: res?.total || 0,
          page: res?.page || 1,
          limit: res?.limit || 20,
          totalPages: res?.totalPages || 1,
        };

        // Cache the result
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        // Also pre-cache individual products by slug for instant detail page loading
        if (Array.isArray(result.products)) {
          result.products.forEach((prod) => {
            if (prod?.slug) {
              cache.set(`slug:${prod.slug}`, {
                data: prod,
                timestamp: Date.now(),
              });
            }
          });
        }

        return result;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  /**
   * Get single product by slug with instant cache return
   */
  async getBySlug(slug) {
    const cacheKey = `slug:${slug}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const fetchPromise = apiRequest(`/products/${slug}`)
      .then((res) => {
        if (!res?.product) {
          throw new Error(res?.error?.message || 'Product not found');
        }
        cache.set(cacheKey, {
          data: res.product,
          timestamp: Date.now(),
        });
        return res.product;
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  /**
   * Clear in-memory product cache
   */
  clearCache() {
    cache.clear();
    inFlightRequests.clear();
  },
};
