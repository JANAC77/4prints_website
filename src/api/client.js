const STORAGE_KEY_TOKEN = 'customer_token';
const STORAGE_KEY_BASE_URL = '4prints_api_base';

export const DEFAULT_API_BASE_URL = 'https://api.autoneu.in';

export function getApiBaseUrl() {
  const stored = localStorage.getItem(STORAGE_KEY_BASE_URL);
  if (stored) {
    if (stored.includes('localhost:3000')) {
      localStorage.removeItem(STORAGE_KEY_BASE_URL);
      return '';
    }
    return stored;
  }
  // Default to empty string so requests use Vite server proxy or vercel rewrites and avoid CORS
  return import.meta.env.VITE_API_BASE_URL || '';
}

export function getDisplayApiBaseUrl() {
  return localStorage.getItem(STORAGE_KEY_BASE_URL) || import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url) {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY_BASE_URL);
  } else {
    const cleanUrl = url.replace(/\/+$/, '');
    if (cleanUrl === DEFAULT_API_BASE_URL) {
      localStorage.removeItem(STORAGE_KEY_BASE_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_BASE_URL, cleanUrl);
    }
  }
}

/**
 * Health check to ping backend
 */
export async function checkBackendHealth() {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/hello`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const latency = Date.now() - startTime;
    return {
      online: response.ok,
      status: response.status,
      latency,
    };
  } catch {
    return {
      online: false,
      status: 0,
      latency: null,
    };
  }
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
}

export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } else {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  }
}

/**
 * Standard API request wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `HTTP Error ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.code = data?.error?.code || 'API_ERROR';
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.status === 401 && !endpoint.includes('/auth/login')) {
      // Dispatches event when token is unauthorized/expired
      window.dispatchEvent(new CustomEvent('customer:unauthorized'));
    }
    throw error;
  }
}
