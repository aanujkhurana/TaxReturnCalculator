/**
 * Tax Calculation Service
 * Contains all business logic for calculating Australian tax returns
 */

import {
  TAX_BRACKETS_2024_25,
  HECS_THRESHOLDS_2024_25,
  MEDICARE_LEVY_RATE,
  MEDICARE_LEVY_SURCHARGE,
  LOW_INCOME_TAX_OFFSET,
  WORK_FROM_HOME,
  TAX_FREE_THRESHOLD
} from '../constants/taxConstants';

/**
 * Calculate income tax based on taxable income
 * @param {number} taxableIncome - The taxable income amount
 * @returns {number} - The calculated income tax
 */
export const calculateIncomeTax = (taxableIncome) => {
  if (taxableIncome <= TAX_FREE_THRESHOLD) {
    return 0;
  }

  for (const bracket of TAX_BRACKETS_2024_25) {
    if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min) * bracket.rate;
    }
  }

  // For income above the highest bracket
  const highestBracket = TAX_BRACKETS_2024_25[TAX_BRACKETS_2024_25.length - 1];
  return highestBracket.base + (taxableIncome - highestBracket.min) * highestBracket.rate;
};

/**
 * Calculate Medicare levy
 * @param {number} taxableIncome - The taxable income amount
 * @param {boolean} medicareExemption - Whether the person has Medicare exemption
 * @returns {number} - The calculated Medicare levy
 */
export const calculateMedicareLevy = (taxableIncome, medicareExemption = false) => {
  if (medicareExemption) {
    return 0;
  }

  // Medicare levy threshold for 2024-25
  const threshold = 29207;
  const shadeOutEnd = 36508;

  if (taxableIncome <= threshold) {
    return 0;
  }

  if (taxableIncome <= shadeOutEnd) {
    // Shade-out range calculation
    const shadeOutAmount = (taxableIncome - threshold) * 0.1;
    return Math.min(shadeOutAmount, taxableIncome * MEDICARE_LEVY_RATE);
  }

  return taxableIncome * MEDICARE_LEVY_RATE;
};

/**
 * Calculate HECS-HELP repayment
 * @param {number} taxableIncome - The taxable income amount
 * @param {boolean} hasHecsDebt - Whether the person has HECS debt
 * @returns {number} - The calculated HECS repayment
 */
export const calculateHecsRepayment = (taxableIncome, hasHecsDebt = false) => {
  if (!hasHecsDebt) {
    return 0;
  }

  for (const threshold of HECS_THRESHOLDS_2024_25) {
    if (taxableIncome >= threshold.min && taxableIncome <= threshold.max) {
      return taxableIncome * threshold.rate;
    }
  }

  return 0;
};

/**
 * Calculate low income tax offset
 * @param {number} taxableIncome - The taxable income amount
 * @returns {number} - The calculated low income tax offset
 */
export const calculateLowIncomeTaxOffset = (taxableIncome) => {
  const { maxOffset, phaseOutStart, phaseOutEnd } = LOW_INCOME_TAX_OFFSET;

  if (taxableIncome <= phaseOutStart) {
    return maxOffset;
  }

  if (taxableIncome >= phaseOutEnd) {
    return 0;
  }

  // Phase out calculation
  const phaseOutAmount = (taxableIncome - phaseOutStart) * 0.05;
  return Math.max(0, maxOffset - phaseOutAmount);
};

/**
 * Calculate work from home deduction
 * @param {number} hours - Number of work from home hours
 * @returns {number} - The calculated work from home deduction
 */
export const calculateWorkFromHomeDeduction = (hours) => {
  if (!hours || hours <= 0) {
    return 0;
  }

  const deduction = hours * WORK_FROM_HOME.shortcutRate;
  return Math.min(deduction, WORK_FROM_HOME.maxShortcutClaim);
};

/**
 * Calculate total deductions
 * @param {Object} deductions - Object containing all deduction amounts
 * @param {number} workFromHomeHours - Number of work from home hours
 * @returns {number} - The total deductions amount
 */
export const calculateTotalDeductions = (deductions, workFromHomeHours = 0) => {
  const workFromHomeDeduction = calculateWorkFromHomeDeduction(workFromHomeHours);
  
  const totalDeductions = Object.values(deductions).reduce((sum, amount) => {
    return sum + (parseFloat(amount) || 0);
  }, 0);

  return totalDeductions + workFromHomeDeduction;
};

/**
 * Main tax calculation function
 * @param {Object} formData - All form data for tax calculation
 * @returns {Object} - Complete tax calculation results
 */
export const calculateTax = (formData) => {
  try {
    // Extract data from form
    const totalJobIncome = formData.jobIncomes?.reduce((sum, job) => sum + (parseFloat(job.income) || 0), 0) || 0;
    const abnIncome = parseFloat(formData.abnIncome) || 0;
    const totalIncome = totalJobIncome + abnIncome;
    
    const totalDeductions = calculateTotalDeductions(formData.deductions || {}, formData.workFromHomeHours);
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);
    
    const taxWithheld = parseFloat(formData.taxWithheld) || 0;
    const hasHecsDebt = formData.hecsDebt === true;
    const medicareExemption = formData.medicareExemption === true;

    // Calculate tax components
    const incomeTax = calculateIncomeTax(taxableIncome);
    const medicareLevy = calculateMedicareLevy(taxableIncome, medicareExemption);
    const hecsRepayment = calculateHecsRepayment(taxableIncome, hasHecsDebt);
    const lowIncomeTaxOffset = calculateLowIncomeTaxOffset(taxableIncome);

    // Calculate total tax
    const totalTaxBeforeOffsets = incomeTax + medicareLevy + hecsRepayment;
    const totalTax = Math.max(0, totalTaxBeforeOffsets - lowIncomeTaxOffset);
    
    // Calculate refund or amount owed
    const refund = taxWithheld - totalTax;

    return {
      totalIncome,
      totalJobIncome,
      abnIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      medicareLevy,
      hecsRepayment,
      lowIncomeTaxOffset,
      totalTax,
      taxWithheld,
      refund,
      breakdown: {
        income: {
          jobIncome: totalJobIncome,
          abnIncome: abnIncome,
          total: totalIncome
        },
        deductions: {
          workRelated: Object.values(formData.deductions || {}).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0),
          workFromHome: calculateWorkFromHomeDeduction(formData.workFromHomeHours),
          total: totalDeductions
        },
        tax: {
          incomeTax,
          medicareLevy,
          hecsRepayment,
          totalBeforeOffsets: totalTaxBeforeOffsets,
          offsets: lowIncomeTaxOffset,
          totalAfterOffsets: totalTax
        }
      }
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    throw new Error('Failed to calculate tax return');
  }
};
