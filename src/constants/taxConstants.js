/**
 * Tax calculation constants for Australian tax system
 * Contains tax brackets, thresholds, and rates for the 2024-25 financial year
 */

// Tax brackets for 2024-25 financial year
export const TAX_BRACKETS_2024_25 = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18200, max: 45000, rate: 0.19, base: 0 },
  { min: 45000, max: 120000, rate: 0.325, base: 5092 },
  { min: 120000, max: 180000, rate: 0.37, base: 29467 },
  { min: 180000, max: Infinity, rate: 0.45, base: 51667 }
];

// HECS-HELP repayment thresholds for 2024-25
export const HECS_THRESHOLDS_2024_25 = [
  { min: 51550, max: 59518, rate: 0.01 },
  { min: 59519, max: 63089, rate: 0.02 },
  { min: 63090, max: 66875, rate: 0.025 },
  { min: 66876, max: 70888, rate: 0.03 },
  { min: 70889, max: 75140, rate: 0.035 },
  { min: 75141, max: 79649, rate: 0.04 },
  { min: 79650, max: 84429, rate: 0.045 },
  { min: 84430, max: 89494, rate: 0.05 },
  { min: 89495, max: 94865, rate: 0.055 },
  { min: 94866, max: 100557, rate: 0.06 },
  { min: 100558, max: 106590, rate: 0.065 },
  { min: 106591, max: 112985, rate: 0.07 },
  { min: 112986, max: 119764, rate: 0.075 },
  { min: 119765, max: 126950, rate: 0.08 },
  { min: 126951, max: 134568, rate: 0.085 },
  { min: 134569, max: 142642, rate: 0.09 },
  { min: 142643, max: 151200, rate: 0.095 },
  { min: 151201, max: Infinity, rate: 0.10 }
];

// Medicare levy rate
export const MEDICARE_LEVY_RATE = 0.02;

// Medicare levy surcharge thresholds and rates
export const MEDICARE_LEVY_SURCHARGE = {
  single: {
    threshold: 97000,
    tiers: [
      { min: 97000, max: 113000, rate: 0.01 },
      { min: 113001, max: 151000, rate: 0.0125 },
      { min: 151001, max: Infinity, rate: 0.015 }
    ]
  },
  family: {
    threshold: 194000,
    tiers: [
      { min: 194000, max: 226000, rate: 0.01 },
      { min: 226001, max: 302000, rate: 0.0125 },
      { min: 302001, max: Infinity, rate: 0.015 }
    ]
  }
};

// Low income tax offset thresholds
export const LOW_INCOME_TAX_OFFSET = {
  maxOffset: 700,
  phaseOutStart: 45000,
  phaseOutEnd: 66667
};

// Work from home deduction rates
export const WORK_FROM_HOME = {
  shortcutRate: 0.67, // per hour
  maxShortcutClaim: 1000
};

// Financial year
export const FINANCIAL_YEAR = '2024-25';

// Tax-free threshold
export const TAX_FREE_THRESHOLD = 18200;

// Standard deduction amounts (for reference)
export const STANDARD_DEDUCTIONS = {
  workClothes: 150,
  workFromHomeBasic: 300,
  carExpenseKmRate: 0.85 // per km for 2024-25
};

// Dependent spouse tax offset
export const DEPENDENT_SPOUSE_OFFSET = {
  maxOffset: 0, // Removed from 2019-20
  incomeThreshold: 0
};

// Senior Australians tax offset
export const SENIOR_TAX_OFFSET = {
  single: {
    maxOffset: 2230,
    incomeThreshold: 32279,
    phaseOutRate: 0.125
  },
  couple: {
    maxOffset: 1602,
    incomeThreshold: 28974,
    phaseOutRate: 0.125
  }
};
