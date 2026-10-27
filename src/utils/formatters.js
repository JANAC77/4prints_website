/**
 * Checks if a Cloudflare R2 / AWS S3 presigned URL is still valid and not expired.
 */
export function isPresignedUrlValid(url) {
  try {
    if (!url.includes('X-Amz-Signature') || !url.includes('X-Amz-Date') || !url.includes('X-Amz-Expires')) {
      return false;
    }
    const parsed = new URL(url);
    const dateStr = parsed.searchParams.get('X-Amz-Date');
    const expiresSec = parseInt(parsed.searchParams.get('X-Amz-Expires') || '0', 10);
    if (!dateStr || !expiresSec) return false;

    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    const hour = parseInt(dateStr.substring(9, 11), 10);
    const min = parseInt(dateStr.substring(11, 13), 10);
    const sec = parseInt(dateStr.substring(13, 15), 10);

    const signTime = Date.UTC(year, month, day, hour, min, sec);
    const expireTime = signTime + expiresSec * 1000;

    // Buffer 5 minutes before actual expiration
    return Date.now() < expireTime - 300000;
  } catch {
    return false;
  }
}

/**
 * Resolves an image URL so it renders properly in the browser.
 * Preserves active presigned R2 URLs, routes unsigned or expired private
 * Cloudflare R2 URLs through the /r2-media proxy, and handles fallback placeholders.
 */
export function getDisplayImageUrl(url, fallback = 'https://placehold.co/400x400/1e293b/f8fafc?text=4Prints') {
  if (!url || typeof url !== 'string') return fallback;
  const cleanUrl = url.trim();
  if (!cleanUrl) return fallback;

  // Base64 or Blob URLs
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) return cleanUrl;

  // Already a local relative proxy URL
  if (cleanUrl.startsWith('/r2-media/')) return cleanUrl;

  // Full host URL pointing to /r2-media/
  if (cleanUrl.includes('/r2-media/')) {
    const idx = cleanUrl.indexOf('/r2-media/');
    return cleanUrl.substring(idx);
  }

  // If the URL is already a valid, active presigned R2 URL, use it directly (loads directly from CDN!)
  if (cleanUrl.includes('X-Amz-Signature') && isPresignedUrlValid(cleanUrl)) {
    return cleanUrl;
  }

  // Handle Cloudflare R2 URLs (raw unsigned or expired presigned)
  if (cleanUrl.includes('r2.cloudflarestorage.com')) {
    try {
      const noQuery = cleanUrl.split('?')[0];

      if (noQuery.includes('r2.cloudflarestorage.com/4printdev/')) {
        const key = noQuery.split('r2.cloudflarestorage.com/4printdev/')[1];
        if (key) return `/r2-media/${key}`;
      }

      if (noQuery.includes('.r2.cloudflarestorage.com/')) {
        let key = noQuery.split('.r2.cloudflarestorage.com/')[1];
        if (key) {
          key = key.replace(/^4printdev\//, '');
          return `/r2-media/${key}`;
        }
      }

      const afterDomain = noQuery.split('r2.cloudflarestorage.com/')[1];
      if (afterDomain) {
        const key = afterDomain.replace(/^4printdev\//, '');
        return `/r2-media/${key}`;
      }
    } catch {
      // fallback
    }
  }

  // Handle direct storage keys like "categories/...", "subcategories/...", "products/..."
  if (/^(categories|subcategories|products|admins)\//.test(cleanUrl)) {
    return `/r2-media/${cleanUrl.split('?')[0]}`;
  }

  return cleanUrl;
}

/**
 * Format Indian Rupee currency with clean standard ₹ formatting
 */
export function formatCurrency(amount, maxDecimals = 'auto') {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '₹0';
  const num = Number(amount);
  const hasDecimals = num % 1 !== 0;
  const decimals = maxDecimals === 'auto' ? (hasDecimals ? 2 : 0) : maxDecimals;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasDecimals && maxDecimals === 'auto' ? 2 : 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats an ISO date string into a human-readable format
 */
export function formatDate(dateString) {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Recently';
  }
}

/**
 * Converts text into URL slug
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Truncates text
 */
export function truncate(text, max = 60) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.substring(0, max) + '...';
}
