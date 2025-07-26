/**
 * Validation utility functions
 * Contains functions for validating form inputs and data
 */

import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants/appConstants';

/**
 * Validate if a value is a valid number
 * @param {string|number} value - The value to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and error
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = VALIDATION_RULES.INCOME.MIN,
    max = VALIDATION_RULES.INCOME.MAX,
    required = false,
    allowDecimals = true,
    fieldName = 'Value'
  } = options;

  // Check if required
  if (required && (!value || value.toString().trim() === '')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  // Allow empty values if not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true, error: null };
  }

  // Convert to number
  const numValue = parseFloat(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_NUMBER
    };
  }

  // Check for negative values
  if (numValue < 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NEGATIVE_VALUE
    };
  }

  // Check decimal places if not allowed
  if (!allowDecimals && numValue % 1 !== 0) {
    return {
      isValid: false,
      error: 'Please enter a whole number'
    };
  }

  // Check min/max bounds
  if (numValue < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (numValue > max) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${max.toLocaleString()}`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate income amount
 * @param {string|number} value - The income value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateIncome = (value, required = false) => {
  return validateNumber(value, {
    min: VALIDATION_RULES.INCOME.MIN,
    max: VALIDATION_RULES.INCOME.MAX,
    required,
    allowDecimals: true,
    fieldName: 'Income'
  });
};

/**
 * Validate deduction amount
 * @param {string|number} value - The deduction value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateDeduction = (value, required = false) => {
  return validateNumber(value, {
    min: VALIDATION_RULES.INCOME.MIN,
    max: VALIDATION_RULES.INCOME.MAX,
    required,
    allowDecimals: true,
    fieldName: 'Deduction'
  });
};

/**
 * Validate hours
 * @param {string|number} value - The hours value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateHours = (value, required = false) => {
  return validateNumber(value, {
    min: VALIDATION_RULES.HOURS.MIN,
    max: VALIDATION_RULES.HOURS.MAX,
    required,
    allowDecimals: false,
    fieldName: 'Hours'
  });
};

/**
 * Validate number of dependents
 * @param {string|number} value - The dependents value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateDependents = (value, required = false) => {
  return validateNumber(value, {
    min: VALIDATION_RULES.DEPENDENTS.MIN,
    max: VALIDATION_RULES.DEPENDENTS.MAX,
    required,
    allowDecimals: false,
    fieldName: 'Number of dependents'
  });
};

/**
 * Validate email address
 * @param {string} email - The email to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateEmail = (email, required = false) => {
  if (required && (!email || email.trim() === '')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  if (!email || email.trim() === '') {
    return { isValid: true, error: null };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - The phone number to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validatePhone = (phone, required = false) => {
  if (required && (!phone || phone.trim() === '')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  if (!phone || phone.trim() === '') {
    return { isValid: true, error: null };
  }

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Australian phone numbers should be 10 digits
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      error: 'Please enter a valid Australian phone number'
    };
  }

  // Mobile numbers should start with 04
  // Landline numbers should start with area codes (02, 03, 07, 08)
  if (!cleaned.match(/^(04|02|03|07|08)/)) {
    return {
      isValid: false,
      error: 'Please enter a valid Australian phone number'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate ABN (Australian Business Number)
 * @param {string} abn - The ABN to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} - Validation result
 */
export const validateABN = (abn, required = false) => {
  if (required && (!abn || abn.trim() === '')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  if (!abn || abn.trim() === '') {
    return { isValid: true, error: null };
  }

  // Remove all non-digits
  const cleaned = abn.replace(/\D/g, '');

  // ABN should be 11 digits
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      error: 'ABN must be 11 digits'
    };
  }

  // Basic ABN validation algorithm
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let sum = 0;

  // Subtract 1 from the first digit
  const firstDigit = parseInt(cleaned[0]) - 1;
  sum += firstDigit * weights[0];

  // Add weighted sum of remaining digits
  for (let i = 1; i < 11; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }

  if (sum % 89 !== 0) {
    return {
      isValid: false,
      error: 'Please enter a valid ABN'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate form data for a specific step
 * @param {Object} formData - The form data to validate
 * @param {number} step - The step number to validate
 * @returns {Object} - Validation result with errors object
 */
export const validateFormStep = (formData, step) => {
  const errors = {};
  let hasErrors = false;

  switch (step) {
    case 1: // Income step
      // Validate job incomes
      if (formData.jobIncomes && formData.jobIncomes.length > 0) {
        const hasValidJobIncome = formData.jobIncomes.some(income => {
          const validation = validateIncome(income);
          return validation.isValid && parseFloat(income || '0') > 0;
        });

        if (!hasValidJobIncome && !formData.abnIncome) {
          errors.jobIncomes = 'Please enter at least one source of income';
          hasErrors = true;
        }
      }

      // Validate ABN income if provided
      if (formData.abnIncome) {
        const abnValidation = validateIncome(formData.abnIncome);
        if (!abnValidation.isValid) {
          errors.abnIncome = abnValidation.error;
          hasErrors = true;
        }
      }

      // Validate tax withheld
      if (formData.taxWithheld) {
        const taxValidation = validateIncome(formData.taxWithheld);
        if (!taxValidation.isValid) {
          errors.taxWithheld = taxValidation.error;
          hasErrors = true;
        }
      }
      break;

    case 2: // Deductions step
      // Validate work from home hours
      if (formData.workFromHomeHours) {
        const hoursValidation = validateHours(formData.workFromHomeHours);
        if (!hoursValidation.isValid) {
          errors.workFromHomeHours = hoursValidation.error;
          hasErrors = true;
        }
      }

      // Validate deduction amounts
      if (formData.deductions) {
        Object.keys(formData.deductions).forEach(category => {
          if (typeof formData.deductions[category] === 'object') {
            // Nested deductions
            Object.keys(formData.deductions[category]).forEach(subCategory => {
              const value = formData.deductions[category][subCategory];
              if (value) {
                const validation = validateDeduction(value);
                if (!validation.isValid) {
                  errors[`${category}.${subCategory}`] = validation.error;
                  hasErrors = true;
                }
              }
            });
          } else {
            // Simple deductions
            const value = formData.deductions[category];
            if (value) {
              const validation = validateDeduction(value);
              if (!validation.isValid) {
                errors[category] = validation.error;
                hasErrors = true;
              }
            }
          }
        });
      }
      break;

    case 3: // Details step
      // Validate dependents
      if (formData.dependents) {
        const dependentsValidation = validateDependents(formData.dependents);
        if (!dependentsValidation.isValid) {
          errors.dependents = dependentsValidation.error;
          hasErrors = true;
        }
      }
      break;
  }

  return {
    isValid: !hasErrors,
    errors
  };
};
