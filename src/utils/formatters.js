/**
 * Formatting utility functions
 * Contains functions for formatting currency, dates, and other display values
 */

/**
 * Format currency for display
 * @param {number|string} value - The value to format
 * @param {string} currency - Currency code (default: 'AUD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'AUD') => {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format number with thousands separators
 * @param {number|string} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format date for display
 * @param {string|Date} date - The date to format
 * @param {string} locale - Locale code (default: 'en-AU')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, locale = 'en-AU') => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time for display
 * @param {string|Date} date - The date to format
 * @param {string} locale - Locale code (default: 'en-AU')
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (date, locale = 'en-AU') => {
  if (!date) return '';
  
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format percentage for display
 * @param {number|string} value - The value to format (as decimal, e.g., 0.19 for 19%)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';
  
  return (num * 100).toFixed(decimals) + '%';
};

/**
 * Format hours for display
 * @param {number|string} hours - The hours to format
 * @returns {string} - Formatted hours string
 */
export const formatHours = (hours) => {
  const num = parseFloat(hours);
  if (isNaN(num) || num === 0) return '0 hrs';
  
  if (num === 1) return '1 hr';
  return `${formatNumber(num, 0)} hrs`;
};

/**
 * Format file size for display
 * @param {number} bytes - The size in bytes
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Format phone number for display
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Australian mobile numbers
  if (cleaned.length === 10 && cleaned.startsWith('04')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  // Format Australian landline numbers
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2 $3');
  }
  
  return phone;
};

/**
 * Format ABN for display
 * @param {string} abn - The ABN to format
 * @returns {string} - Formatted ABN
 */
export const formatABN = (abn) => {
  if (!abn) return '';
  
  // Remove all non-digits
  const cleaned = abn.replace(/\D/g, '');
  
  // Format as XX XXX XXX XXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  }
  
  return abn;
};

/**
 * Format TFN for display (partially masked for security)
 * @param {string} tfn - The TFN to format
 * @returns {string} - Formatted and masked TFN
 */
export const formatTFN = (tfn) => {
  if (!tfn) return '';
  
  // Remove all non-digits
  const cleaned = tfn.replace(/\D/g, '');
  
  // Format as XXX XXX XXX with last 3 digits masked
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 ***');
  }
  
  return tfn;
};
