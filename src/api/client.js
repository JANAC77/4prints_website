const STORAGE_KEY_TOKEN = 'customer_token';
const STORAGE_KEY_BASE_URL = '4prints_api_base';

export function getApiBaseUrl() {
  const customUrl = localStorage.getItem(STORAGE_KEY_BASE_URL);
  if (customUrl && customUrl !== 'http://localhost:3000') {
    return customUrl;
  }
  // Default to empty string so requests use Vite server proxy and avoid CORS
  return import.meta.env.VITE_API_BASE_URL || '';
}

export function setApiBaseUrl(url) {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY_BASE_URL);
  } else {
    localStorage.setItem(STORAGE_KEY_BASE_URL, url.replace(/\/+$/, ''));
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
