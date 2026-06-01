/**
 * Tax Calculation Service
 * Contains all business logic for calculating Australian tax returns
 */

import {
  TAX_BRACKETS_2025_26,
  HECS_THRESHOLDS_2025_26,
  MEDICARE_LEVY_RATE,
  MEDICARE_LEVY_THRESHOLDS,
  MEDICARE_LEVY_SURCHARGE,
  LOW_INCOME_TAX_OFFSET,
  WORK_FROM_HOME,
  TAX_FREE_THRESHOLD,
} from '../constants/taxConstants';

// Type definitions for tax calculation
export interface TaxCalculationResult {
  totalIncome: number;
  totalJobIncome: number;
  abnIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  hecsRepayment: number;
  medicareLevySurcharge: number;
  lowIncomeTaxOffset: number;
  totalTax: number;
  taxWithheld: number;
  refund: number;
  breakdown: {
    income: {
      jobIncome: number;
      abnIncome: number;
      total: number;
    };
    deductions: {
      workRelated: number;
      workFromHome: number;
      total: number;
    };
    tax: {
      incomeTax: number;
      medicareLevy: number;
      medicareLevySurcharge: number;
      hecsRepayment: number;
      totalBeforeOffsets: number;
      offsets: number;
      totalAfterOffsets: number;
    };
  };
}

export interface FormDataForTaxCalculation {
  jobIncomes?: Array<{ income: string }>;
  abnIncome?: string;
  deductions?: { [key: string]: any };
  workFromHomeHours?: string;
  taxWithheld?: string;
  hecsDebt?: boolean;
  reportableSuper?: string;
  reportableFringeBenefits?: string;
  netInvestmentLosses?: string;
  exemptForeignIncome?: string;
  medicareExemption?: boolean;
  hasSpouse?: boolean;
  spouseIncome?: string;
  hasDependents?: boolean;
  dependents?: string;
  hasPrivateHospitalCover?: boolean;
}

/**
 * Calculate income tax based on taxable income
 */
export const calculateIncomeTax = (taxableIncome: number): number => {
  if (taxableIncome <= TAX_FREE_THRESHOLD) {
    return 0;
  }

  for (const bracket of TAX_BRACKETS_2025_26) {
    if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min) * bracket.rate;
    }
  }

  // For income above the highest bracket
  const highestBracket = TAX_BRACKETS_2025_26[TAX_BRACKETS_2025_26.length - 1];
  return highestBracket.base + (taxableIncome - highestBracket.min) * highestBracket.rate;
};

/**
 * Calculate Medicare levy
 */
export const calculateMedicareLevy = (
  taxableIncome: number,
  medicareExemption: boolean = false
): number => {
  if (medicareExemption) {
    return 0;
  }

  const threshold = MEDICARE_LEVY_THRESHOLDS.singleLower;

  if (taxableIncome <= threshold) {
    return 0;
  }

  const phaseInAmount = (taxableIncome - threshold) * MEDICARE_LEVY_THRESHOLDS.phaseInRate;
  return Math.min(phaseInAmount, taxableIncome * MEDICARE_LEVY_RATE);
};

export const calculateMedicareLevySurcharge = (
  taxableIncome: number,
  familyIncome: number,
  hasPrivateHospitalCover: boolean = false,
  hasSpouse: boolean = false,
  dependents: number = 0
): number => {
  if (hasPrivateHospitalCover || taxableIncome <= 0) {
    return 0;
  }

  const isFamily = hasSpouse || dependents > 0;
  const familyDependentIncrease = isFamily ? Math.max(0, dependents - 1) * 1500 : 0;
  const surchargeIncome = isFamily ? familyIncome : taxableIncome;
  const tiers = isFamily
    ? MEDICARE_LEVY_SURCHARGE.family.tiers.map((tier) => ({
        ...tier,
        min: tier.min + familyDependentIncrease,
        max: tier.max === Infinity ? Infinity : tier.max + familyDependentIncrease,
      }))
    : MEDICARE_LEVY_SURCHARGE.single.tiers;
  const tier = tiers.find(({ min, max }) => surchargeIncome >= min && surchargeIncome <= max);

  return tier ? taxableIncome * tier.rate : 0;
};

/**
 * Calculate HECS-HELP repayment
 */
export const calculateHecsRepayment = (
  taxableIncome: number,
  hasHecsDebt: boolean = false
): number => {
  if (!hasHecsDebt) {
    return 0;
  }

  for (const threshold of HECS_THRESHOLDS_2025_26) {
    if (taxableIncome >= threshold.min && taxableIncome <= threshold.max) {
      if (threshold.rateAppliesToTotalIncome) {
        return taxableIncome * threshold.rate;
      }
      return (threshold.base || 0) + (taxableIncome - threshold.min) * threshold.rate;
    }
  }

  return 0;
};

/**
 * Calculate low income tax offset
 */
export const calculateLowIncomeTaxOffset = (taxableIncome: number): number => {
  const {
    maxOffset,
    fullOffsetLimit,
    firstPhaseOutEnd,
    firstPhaseOutRate,
    secondPhaseOutEnd,
    secondPhaseOutBase,
    secondPhaseOutRate,
  } = LOW_INCOME_TAX_OFFSET;

  if (taxableIncome <= fullOffsetLimit) {
    return maxOffset;
  }

  if (taxableIncome <= firstPhaseOutEnd) {
    return Math.max(0, maxOffset - (taxableIncome - fullOffsetLimit) * firstPhaseOutRate);
  }

  if (taxableIncome <= secondPhaseOutEnd) {
    return Math.max(
      0,
      secondPhaseOutBase - (taxableIncome - firstPhaseOutEnd) * secondPhaseOutRate
    );
  }

  return 0;
};

/**
 * Calculate work from home deduction
 */
export const calculateWorkFromHomeDeduction = (hours: number | string): number => {
  if (!hours || parseFloat(hours.toString()) <= 0) {
    return 0;
  }

  const numHours = parseFloat(hours.toString());
  const deduction = numHours * WORK_FROM_HOME.shortcutRate;
  return Math.min(deduction, WORK_FROM_HOME.maxShortcutClaim);
};

/**
 * Calculate total deductions
 */
export const calculateTotalDeductions = (
  deductions: { [key: string]: any },
  workFromHomeHours: number | string = 0
): number => {
  const workFromHomeDeduction = calculateWorkFromHomeDeduction(workFromHomeHours);

  const totalDeductions = Object.values(deductions).reduce((sum: number, amount: any) => {
    if (typeof amount === 'object' && amount !== null) {
      return (
        sum +
        Object.values(amount).reduce<number>((categorySum: number, value: any) => {
          return categorySum + (parseFloat(value) || 0);
        }, 0)
      );
    }
    return sum + (parseFloat(amount) || 0);
  }, 0);

  return totalDeductions + workFromHomeDeduction;
};

/**
 * Main tax calculation function
 */
export const calculateTax = (formData: FormDataForTaxCalculation): TaxCalculationResult => {
  try {
    // Extract data from form
    const totalJobIncome =
      formData.jobIncomes?.reduce((sum, job) => sum + (parseFloat(job.income) || 0), 0) || 0;
    const abnIncome = parseFloat(formData.abnIncome) || 0;
    const totalIncome = totalJobIncome + abnIncome;

    const totalDeductions = calculateTotalDeductions(
      formData.deductions || {},
      formData.workFromHomeHours
    );
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    const taxWithheld = parseFloat(formData.taxWithheld) || 0;
    const hasHecsDebt = formData.hecsDebt === true;
    const medicareExemption = formData.medicareExemption === true;
    const hasSpouse = formData.hasSpouse === true;
    const spouseIncome = hasSpouse ? parseFloat(formData.spouseIncome) || 0 : 0;
    const dependents = formData.hasDependents ? parseInt(formData.dependents || '0') || 0 : 0;
    const hasPrivateHospitalCover = formData.hasPrivateHospitalCover === true;

    // Calculate tax components
    const incomeTax = calculateIncomeTax(taxableIncome);
    const medicareLevy = calculateMedicareLevy(taxableIncome, medicareExemption);
    const medicareLevySurcharge = calculateMedicareLevySurcharge(
      taxableIncome,
      taxableIncome + spouseIncome,
      hasPrivateHospitalCover,
      hasSpouse,
      dependents
    );
    const studyLoanRepaymentIncome =
      taxableIncome +
      (parseFloat(formData.reportableSuper) || 0) +
      (parseFloat(formData.reportableFringeBenefits) || 0) +
      (parseFloat(formData.netInvestmentLosses) || 0) +
      (parseFloat(formData.exemptForeignIncome) || 0);
    const hecsRepayment = calculateHecsRepayment(studyLoanRepaymentIncome, hasHecsDebt);
    const lowIncomeTaxOffset = calculateLowIncomeTaxOffset(taxableIncome);

    // Calculate total tax
    const totalTaxBeforeOffsets = incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment;
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
      medicareLevySurcharge,
      hecsRepayment,
      lowIncomeTaxOffset,
      totalTax,
      taxWithheld,
      refund,
      breakdown: {
        income: {
          jobIncome: totalJobIncome,
          abnIncome: abnIncome,
          total: totalIncome,
        },
        deductions: {
          workRelated: Object.values(formData.deductions || {}).reduce(
            (sum, amount) => sum + (parseFloat(amount) || 0),
            0
          ),
          workFromHome: calculateWorkFromHomeDeduction(formData.workFromHomeHours),
          total: totalDeductions,
        },
        tax: {
          incomeTax,
          medicareLevy,
          medicareLevySurcharge,
          hecsRepayment,
          totalBeforeOffsets: totalTaxBeforeOffsets,
          offsets: lowIncomeTaxOffset,
          totalAfterOffsets: totalTax,
        },
      },
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    throw new Error('Failed to calculate tax return');
  }
};
