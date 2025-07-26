/**
 * Helper utility functions
 * Contains general utility functions used throughout the app
 */

/**
 * Generate a unique ID
 * @returns {string} - Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if a value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} - True if valid number
 */
export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Safely parse a number with fallback
 * @param {*} value - Value to parse
 * @param {number} fallback - Fallback value (default: 0)
 * @returns {number} - Parsed number or fallback
 */
export const safeParseFloat = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Safely parse an integer with fallback
 * @param {*} value - Value to parse
 * @param {number} fallback - Fallback value (default: 0)
 * @returns {number} - Parsed integer or fallback
 */
export const safeParseInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Calculate percentage of a value
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Round a number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} - Rounded value
 */
export const roundToDecimals = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Convert string to slug (URL-friendly)
 * @param {string} text - Text to convert
 * @returns {string} - Slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Get nested object property safely
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} - Value at path or default value
 */
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Set nested object property safely
 * @param {Object} obj - Object to modify
 * @param {string} path - Dot-separated path
 * @param {*} value - Value to set
 * @returns {Object} - Modified object
 */
export const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array to deduplicate
 * @param {string|Function} key - Key to compare by (for objects) or comparison function
 * @returns {Array} - Array without duplicates
 */
export const removeDuplicates = (array, key = null) => {
  if (!Array.isArray(array)) return [];
  
  if (key === null) {
    return [...new Set(array)];
  }
  
  if (typeof key === 'function') {
    const seen = new Set();
    return array.filter(item => {
      const keyValue = key(item);
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }
  
  const seen = new Set();
  return array.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

/**
 * Sort array of objects by property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} direction - 'asc' or 'desc' (default: 'asc')
 * @returns {Array} - Sorted array
 */
export const sortByProperty = (array, property, direction = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = getNestedProperty(a, property);
    const bValue = getNestedProperty(b, property);
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array of objects by property
 * @param {Array} array - Array to group
 * @param {string|Function} key - Property to group by or function that returns group key
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Wait for specified time (Promise-based delay)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
 * @returns {Promise} - Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delayTime = baseDelay * Math.pow(2, attempt);
      await delay(delayTime);
    }
  }
};
