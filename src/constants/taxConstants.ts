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

export interface TaxYearConfig {
  readonly financialYear: string;
  readonly taxBrackets: readonly TaxBracket[];
  readonly helpRepaymentThresholds: readonly HecsThreshold[];
  readonly medicareLevyThresholds: MedicareLevyThresholds;
  readonly medicareLevySurcharge: MedicareLevySurcharge;
  readonly lowIncomeTaxOffset: LowIncomeTaxOffset;
  readonly workFromHome: WorkFromHome;
  readonly standardDeductions: StandardDeductions;
  readonly taxFreeThreshold: number;
  readonly taxYearInfo: TaxYearInfo;
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

const FY2025_26_TAX_BRACKETS: readonly TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18200, max: 45000, rate: 0.16, base: 0 },
  { min: 45000, max: 135000, rate: 0.30, base: 4288 },
  { min: 135000, max: 190000, rate: 0.37, base: 31288 },
  { min: 190000, max: Infinity, rate: 0.45, base: 51638 }
] as const;

// HELP/STSL repayment thresholds for 2025-26.
// From 2025-26 repayments are marginal until the top band.
const FY2025_26_HECS_THRESHOLDS: readonly HecsThreshold[] = [
  { min: 0, max: 67000, rate: 0, base: 0 },
  { min: 67000, max: 125000, rate: 0.15, base: 0 },
  { min: 125000, max: 179285, rate: 0.17, base: 8700 },
  { min: 179286, max: Infinity, rate: 0.10, base: 0, rateAppliesToTotalIncome: true }
] as const;

// Medicare levy rate
export const MEDICARE_LEVY_RATE: number = 0.02 as const;

// Medicare levy low-income thresholds from the 2024-25 legislation, applying
// to 2024-25 and later income years until replaced.
const FY2025_26_MEDICARE_LEVY_THRESHOLDS: MedicareLevyThresholds = {
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
const FY2025_26_MEDICARE_LEVY_SURCHARGE: MedicareLevySurcharge = {
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
const FY2025_26_LOW_INCOME_TAX_OFFSET: LowIncomeTaxOffset = {
  maxOffset: 700,
  fullOffsetLimit: 37500,
  firstPhaseOutEnd: 45000,
  firstPhaseOutRate: 0.05,
  secondPhaseOutEnd: 66667,
  secondPhaseOutBase: 325,
  secondPhaseOutRate: 0.015
} as const;

// Work from home deduction rates
const FY2025_26_WORK_FROM_HOME: WorkFromHome = {
  shortcutRate: 0.70, // per hour
  maxShortcutClaim: Infinity
} as const;

const FY2025_26_FINANCIAL_YEAR = '2025-26' as const;

const FY2025_26_TAX_YEAR_INFO: TaxYearInfo = {
  current: FY2025_26_FINANCIAL_YEAR,
  display: '2025-26',
  sourceYearForMedicareThresholds: '2024-25',
  note: 'Medicare levy low-income thresholds are the 2024-25 amounts that apply to 2024-25 and later income years until replaced.'
} as const;

// Standard deduction amounts (for reference)
const FY2025_26_STANDARD_DEDUCTIONS: StandardDeductions = {
  workClothes: 150,
  workFromHomeBasic: 300,
  carExpenseKmRate: 0.88 // per km for 2025-26
} as const;

export const ACTIVE_FINANCIAL_YEAR = '2025-26' as const;

export const TAX_YEAR_CONFIGS: Record<string, TaxYearConfig> = {
  '2025-26': {
    financialYear: FY2025_26_FINANCIAL_YEAR,
    taxBrackets: FY2025_26_TAX_BRACKETS,
    helpRepaymentThresholds: FY2025_26_HECS_THRESHOLDS,
    medicareLevyThresholds: FY2025_26_MEDICARE_LEVY_THRESHOLDS,
    medicareLevySurcharge: FY2025_26_MEDICARE_LEVY_SURCHARGE,
    lowIncomeTaxOffset: FY2025_26_LOW_INCOME_TAX_OFFSET,
    workFromHome: FY2025_26_WORK_FROM_HOME,
    standardDeductions: FY2025_26_STANDARD_DEDUCTIONS,
    taxFreeThreshold: 18200,
    taxYearInfo: FY2025_26_TAX_YEAR_INFO
  }
} as const;

export const ACTIVE_TAX_YEAR_CONFIG = TAX_YEAR_CONFIGS[ACTIVE_FINANCIAL_YEAR];

// Backward-compatible aliases for app code.
export const FINANCIAL_YEAR: string = ACTIVE_TAX_YEAR_CONFIG.financialYear;
export const TAX_YEAR_INFO: TaxYearInfo = ACTIVE_TAX_YEAR_CONFIG.taxYearInfo;
export const TAX_BRACKETS_2025_26: readonly TaxBracket[] = ACTIVE_TAX_YEAR_CONFIG.taxBrackets;
export const HECS_THRESHOLDS_2025_26: readonly HecsThreshold[] = ACTIVE_TAX_YEAR_CONFIG.helpRepaymentThresholds;
export const MEDICARE_LEVY_THRESHOLDS: MedicareLevyThresholds = ACTIVE_TAX_YEAR_CONFIG.medicareLevyThresholds;
export const MEDICARE_LEVY_SURCHARGE: MedicareLevySurcharge = ACTIVE_TAX_YEAR_CONFIG.medicareLevySurcharge;
export const LOW_INCOME_TAX_OFFSET: LowIncomeTaxOffset = ACTIVE_TAX_YEAR_CONFIG.lowIncomeTaxOffset;
export const WORK_FROM_HOME: WorkFromHome = ACTIVE_TAX_YEAR_CONFIG.workFromHome;
export const STANDARD_DEDUCTIONS: StandardDeductions = ACTIVE_TAX_YEAR_CONFIG.standardDeductions;
export const TAX_FREE_THRESHOLD: number = ACTIVE_TAX_YEAR_CONFIG.taxFreeThreshold;
export const PAYG_ESTIMATE: PaygEstimate = {
  medicareEstimateThreshold: MEDICARE_LEVY_THRESHOLDS.singleLower
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
