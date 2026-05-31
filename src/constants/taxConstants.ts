/**
 * Tax calculation constants for Australian tax system
 * Contains tax brackets, thresholds, and rates for the 2025-26 financial year
 */

// Type definitions for tax constants
export interface TaxBracket {
  readonly min: number;
  readonly max: number;
  readonly rate: number;
  readonly base: number;
}

export interface HecsThreshold {
  readonly min: number;
  readonly max: number;
  readonly rate: number;
  readonly base?: number;
  readonly rateAppliesToTotalIncome?: boolean;
}

export interface MedicareLevySurchargeTier {
  readonly min: number;
  readonly max: number;
  readonly rate: number;
}

export interface MedicareLevySurchargeCategory {
  readonly threshold: number;
  readonly tiers: readonly MedicareLevySurchargeTier[];
}

export interface MedicareLevySurcharge {
  readonly single: MedicareLevySurchargeCategory;
  readonly family: MedicareLevySurchargeCategory;
}

export interface LowIncomeTaxOffset {
  readonly maxOffset: number;
  readonly fullOffsetLimit: number;
  readonly firstPhaseOutEnd: number;
  readonly firstPhaseOutRate: number;
  readonly secondPhaseOutEnd: number;
  readonly secondPhaseOutBase: number;
  readonly secondPhaseOutRate: number;
}

export interface MedicareLevyThresholds {
  readonly singleLower: number;
  readonly singleUpper: number;
  readonly familyLower: number;
  readonly familyUpper: number;
  readonly dependentChildLowerIncrease: number;
  readonly dependentChildUpperIncrease: number;
  readonly phaseInRate: number;
  readonly rate: number;
}

export interface PaygEstimate {
  readonly medicareEstimateThreshold: number;
}

export interface TaxYearInfo {
  readonly current: string;
  readonly display: string;
  readonly sourceYearForMedicareThresholds: string;
  readonly note: string;
}

export interface WorkFromHome {
  readonly shortcutRate: number;
  readonly maxShortcutClaim: number;
}

export interface StandardDeductions {
  readonly workClothes: number;
  readonly workFromHomeBasic: number;
  readonly carExpenseKmRate: number;
}

export interface DependentSpouseOffset {
  readonly maxOffset: number;
  readonly incomeThreshold: number;
}

export interface SeniorTaxOffsetCategory {
  readonly maxOffset: number;
  readonly incomeThreshold: number;
  readonly phaseOutRate: number;
}

export interface SeniorTaxOffset {
  readonly single: SeniorTaxOffsetCategory;
  readonly couple: SeniorTaxOffsetCategory;
}

// Tax brackets for 2025-26 financial year
export const TAX_BRACKETS_2025_26: readonly TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18200, max: 45000, rate: 0.16, base: 0 },
  { min: 45000, max: 135000, rate: 0.30, base: 4288 },
  { min: 135000, max: 190000, rate: 0.37, base: 31288 },
  { min: 190000, max: Infinity, rate: 0.45, base: 51638 }
] as const;

// HELP/STSL repayment thresholds for 2025-26.
// From 2025-26 repayments are marginal until the top band.
export const HECS_THRESHOLDS_2025_26: readonly HecsThreshold[] = [
  { min: 0, max: 67000, rate: 0, base: 0 },
  { min: 67000, max: 125000, rate: 0.15, base: 0 },
  { min: 125000, max: 179285, rate: 0.17, base: 8700 },
  { min: 179286, max: Infinity, rate: 0.10, base: 0, rateAppliesToTotalIncome: true }
] as const;

// Medicare levy rate
export const MEDICARE_LEVY_RATE: number = 0.02 as const;

// Medicare levy low-income thresholds from the 2024-25 legislation, applying
// to 2024-25 and later income years until replaced.
export const MEDICARE_LEVY_THRESHOLDS: MedicareLevyThresholds = {
  singleLower: 27222,
  singleUpper: 34027,
  familyLower: 45907,
  familyUpper: 57383,
  dependentChildLowerIncrease: 4216,
  dependentChildUpperIncrease: 5270,
  phaseInRate: 0.10,
  rate: MEDICARE_LEVY_RATE
} as const;

// Medicare levy surcharge thresholds and rates
export const MEDICARE_LEVY_SURCHARGE: MedicareLevySurcharge = {
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
} as const;

// Low income tax offset thresholds
export const LOW_INCOME_TAX_OFFSET: LowIncomeTaxOffset = {
  maxOffset: 700,
  fullOffsetLimit: 37500,
  firstPhaseOutEnd: 45000,
  firstPhaseOutRate: 0.05,
  secondPhaseOutEnd: 66667,
  secondPhaseOutBase: 325,
  secondPhaseOutRate: 0.015
} as const;

// Work from home deduction rates
export const WORK_FROM_HOME: WorkFromHome = {
  shortcutRate: 0.70, // per hour
  maxShortcutClaim: Infinity
} as const;

// Financial year
export const FINANCIAL_YEAR: string = '2025-26' as const;

export const TAX_YEAR_INFO: TaxYearInfo = {
  current: FINANCIAL_YEAR,
  display: '2025-26',
  sourceYearForMedicareThresholds: '2024-25',
  note: 'Medicare levy low-income thresholds are the 2024-25 amounts that apply to 2024-25 and later income years until replaced.'
} as const;

export const PAYG_ESTIMATE: PaygEstimate = {
  medicareEstimateThreshold: MEDICARE_LEVY_THRESHOLDS.singleLower
} as const;

// Tax-free threshold
export const TAX_FREE_THRESHOLD: number = 18200 as const;

// Standard deduction amounts (for reference)
export const STANDARD_DEDUCTIONS: StandardDeductions = {
  workClothes: 150,
  workFromHomeBasic: 300,
  carExpenseKmRate: 0.88 // per km for 2025-26
} as const;

// Dependent spouse tax offset
export const DEPENDENT_SPOUSE_OFFSET: DependentSpouseOffset = {
  maxOffset: 0, // Removed from 2019-20
  incomeThreshold: 0
} as const;

// Senior Australians tax offset
export const SENIOR_TAX_OFFSET: SeniorTaxOffset = {
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
} as const;
