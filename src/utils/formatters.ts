/**
 * Formatting utility functions
 * Contains functions for formatting currency, dates, and other display values
 */

/**
 * Format currency for display
 */
export const formatCurrency = (value: number | string, currency: string = 'AUD'): string => {
  const num = parseFloat(value.toString());
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
 */
export const formatNumber = (value: number | string, decimals: number = 2): string => {
  const num = parseFloat(value.toString());
  if (isNaN(num)) return '0';

  return num.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, locale: string = 'en-AU'): string => {
  if (!date) return '';

  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: string | Date, locale: string = 'en-AU'): string => {
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
 */
export const formatPercentage = (value: number | string, decimals: number = 1): string => {
  const num = parseFloat(value.toString());
  if (isNaN(num)) return '0%';

  return (num * 100).toFixed(decimals) + '%';
};

/**
 * Format hours for display
 */
export const formatHours = (hours: number | string): string => {
  const num = parseFloat(hours.toString());
  if (isNaN(num) || num === 0) return '0 hrs';

  if (num === 1) return '1 hr';
  return `${formatNumber(num, 0)} hrs`;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 50, suffix: string = '...'): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
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
 */
export const formatABN = (abn: string): string => {
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
 */
export const formatTFN = (tfn: string): string => {
  if (!tfn) return '';

  // Remove all non-digits
  const cleaned = tfn.replace(/\D/g, '');

  // Format as XXX XXX XXX with last 3 digits masked
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 ***');
  }

  return tfn;
};
