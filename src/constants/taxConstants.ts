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

export interface TaxSourceAuditNote {
  readonly id: string;
  readonly title: string;
  readonly source: string;
  readonly url: string;
  readonly retrievedAt: string;
  readonly affectedConstants: readonly string[];
  readonly verifiedValues: readonly string[];
  readonly notes?: string;
}

export interface TaxYearConfig {
  readonly configVersion: string;
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
  readonly sourceNoteIds: readonly string[];
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

export const TAX_SOURCE_AUDIT_NOTES: Record<string, TaxSourceAuditNote> = {
  residentTaxRates2024Later: {
    id: 'residentTaxRates2024Later',
    title: 'Resident individual income tax rates for 2024-25 and 2025-26',
    source:
      'ATO legal database - Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024 explanatory material',
    url: 'https://www.ato.gov.au/law/view/document?DocNum=0000081364&FullDocument=true',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_TAX_BRACKETS', 'TAX_FREE_THRESHOLD'],
    verifiedValues: [
      '$0-$18,200: 0%',
      '$18,201-$45,000: 16%',
      '$45,001-$135,000: 30%',
      '$135,001-$190,000: 37%',
      '$190,001 and over: 45%',
    ],
  },
  lowIncomeTaxOffset: {
    id: 'lowIncomeTaxOffset',
    title: 'Low income tax offset',
    source: 'ATO legal database - Income Tax Assessment Act 1997 section 61-115',
    url: 'https://www.ato.gov.au/law/view/document?docid=PAC%2F19970038%2F61-115',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_LOW_INCOME_TAX_OFFSET'],
    verifiedValues: [
      'Maximum offset: $700',
      'Full offset limit: $37,500',
      '$37,501-$45,000: $700 less 5% of excess',
      '$45,001-$66,667: $325 less 1.5% of excess',
    ],
  },
  studyTrainingLoan2025_26: {
    id: 'studyTrainingLoan2025_26',
    title: 'Study and training loan repayment thresholds and repayment income',
    source: 'ATO - Study and training loan repayment thresholds and rates',
    url: 'https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_HECS_THRESHOLDS'],
    verifiedValues: [
      '$0-$67,000: nil',
      '$67,001-$125,000: 15c for each $1 over $67,000',
      '$125,001-$179,285: $8,700 plus 17c for each $1 over $125,000',
      '$179,286 and over: 10% of total repayment income',
      'Repayment income includes taxable income, reportable fringe benefits, total net investment loss, reportable super contributions, and exempt foreign employment income',
    ],
  },
  medicareLevy2024_25Thresholds: {
    id: 'medicareLevy2024_25Thresholds',
    title: 'Medicare levy low-income thresholds applying from 2024-25',
    source:
      'ATO legal database - Treasury Laws Amendment (More Cost of Living Relief) Act 2025 explanatory material',
    url: 'https://www.ato.gov.au/law/view/document?DocNum=0000081420&FullDocument=true',
    retrievedAt: '2026-06-01',
    affectedConstants: ['MEDICARE_LEVY_RATE', 'FY2025_26_MEDICARE_LEVY_THRESHOLDS'],
    verifiedValues: [
      'Medicare levy rate: 2%',
      'Individual lower threshold: $27,222',
      'Individual phase-in limit: $34,027',
      'Family lower threshold: $45,907',
      'Family phase-in limit: $57,383',
      'Dependent child/student lower increase: $4,216',
      'Dependent child/student upper increase: $5,270',
      'Phase-in rate: 10c for each $1 above the relevant threshold',
    ],
    notes:
      'These are 2024-25 threshold amounts configured for the active 2025-26 app until a later official ATO threshold update is added to the tax-year config.',
  },
  medicareLevySurcharge2025_26: {
    id: 'medicareLevySurcharge2025_26',
    title: 'Medicare levy surcharge and private health insurance income thresholds',
    source: 'ATO - Income thresholds and rates for the private health insurance rebate',
    url: 'https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate/income-thresholds-and-rates-for-the-private-health-insurance-rebate',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_MEDICARE_LEVY_SURCHARGE'],
    verifiedValues: [
      'Single base tier: $101,000 or less',
      'Single tier 1: $101,001-$118,000 at 1%',
      'Single tier 2: $118,001-$158,000 at 1.25%',
      'Single tier 3: $158,001 or more at 1.5%',
      'Family base tier: $202,000 or less',
      'Family tier 1: $202,001-$236,000 at 1%',
      'Family tier 2: $236,001-$316,000 at 1.25%',
      'Family tier 3: $316,001 or more at 1.5%',
      'Family threshold increases by $1,500 for each MLS dependent child after the first',
    ],
  },
  workFromHomeFixedRate: {
    id: 'workFromHomeFixedRate',
    title: 'Working from home fixed rate method',
    source: 'ATO - Fixed rate method',
    url: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_WORK_FROM_HOME'],
    verifiedValues: [
      '2024-25 fixed rate: 70 cents per work hour',
      'Users must keep records of actual hours worked from home',
    ],
    notes:
      'ATO has published the 70 cents per hour fixed rate for 2024-25. The active 2025-26 config keeps this value until a later official ATO update is added.',
  },
  workExpenseRecordExceptions: {
    id: 'workExpenseRecordExceptions',
    title: 'Work-related expense record-keeping exceptions',
    source: 'ATO - Records you need to keep',
    url: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/records-you-need-to-keep',
    retrievedAt: '2026-06-01',
    affectedConstants: [
      'FY2025_26_STANDARD_DEDUCTIONS.workClothes',
      'FY2025_26_STANDARD_DEDUCTIONS.workFromHomeBasic',
    ],
    verifiedValues: [
      'Total work-related expenses of $300 or less may be claimed without full written evidence if the taxpayer can show the expense was incurred and how it was calculated',
      'Laundry expenses of $150 or less may be claimed without full written evidence if the taxpayer can show how the claim was calculated',
    ],
    notes: 'These are substantiation exceptions, not automatic deductions.',
  },
  carExpenseCentsPerKm2025_26: {
    id: 'carExpenseCentsPerKm2025_26',
    title: 'Cents per kilometre deduction rate for car expenses',
    source:
      'ATO Software Developers - Cents per Kilometre Deduction Rate for Car Expenses 2024 Determination',
    url: 'https://softwaredevelopers.ato.gov.au/CentsperKilometreDeductionRateforCarExpenses',
    retrievedAt: '2026-06-01',
    affectedConstants: ['FY2025_26_STANDARD_DEDUCTIONS.carExpenseKmRate'],
    verifiedValues: [
      '88 cents per kilometre applies from 1 July 2024 and remains effective for the 2025-26 income year',
    ],
  },
  paygWithholdingScale2: {
    id: 'paygWithholdingScale2',
    title: 'PAYG withholding coefficients where tax-free threshold is claimed',
    source:
      'ATO legal database - LI 2024/18 Schedule 1 statement of formulas for calculating amounts to be withheld',
    url: 'https://www.ato.gov.au/law/view/view.htm?PiT=99991231235958&docid=OPS%2FLI202418%2F00001',
    retrievedAt: '2026-06-01',
    affectedConstants: ['PAYG_SCALE_2_WEEKLY_COEFFICIENTS in src/App.tsx and test mirror'],
    verifiedValues: [
      'Scale 2 weekly coefficients use y = ax - b',
      'x is weekly earnings rounded down to whole dollars plus 99 cents',
      'The active estimate assumes the employee claimed the tax-free threshold',
    ],
  },
} as const;

export const FY2025_26_SOURCE_NOTE_IDS = [
  'residentTaxRates2024Later',
  'lowIncomeTaxOffset',
  'studyTrainingLoan2025_26',
  'medicareLevy2024_25Thresholds',
  'medicareLevySurcharge2025_26',
  'workFromHomeFixedRate',
  'workExpenseRecordExceptions',
  'carExpenseCentsPerKm2025_26',
  'paygWithholdingScale2',
] as const;

const FY2025_26_TAX_BRACKETS: readonly TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18200, max: 45000, rate: 0.16, base: 0 },
  { min: 45000, max: 135000, rate: 0.3, base: 4288 },
  { min: 135000, max: 190000, rate: 0.37, base: 31288 },
  { min: 190000, max: Infinity, rate: 0.45, base: 51638 },
] as const;

// HELP/STSL repayment thresholds for 2025-26.
// From 2025-26 repayments are marginal until the top band.
const FY2025_26_HECS_THRESHOLDS: readonly HecsThreshold[] = [
  { min: 0, max: 67000, rate: 0, base: 0 },
  { min: 67000, max: 125000, rate: 0.15, base: 0 },
  { min: 125000, max: 179285, rate: 0.17, base: 8700 },
  { min: 179286, max: Infinity, rate: 0.1, base: 0, rateAppliesToTotalIncome: true },
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
  phaseInRate: 0.1,
  rate: MEDICARE_LEVY_RATE,
} as const;

// Medicare levy surcharge thresholds and rates
const FY2025_26_MEDICARE_LEVY_SURCHARGE: MedicareLevySurcharge = {
  single: {
    threshold: 101000,
    tiers: [
      { min: 101001, max: 118000, rate: 0.01 },
      { min: 118001, max: 158000, rate: 0.0125 },
      { min: 158001, max: Infinity, rate: 0.015 },
    ],
  },
  family: {
    threshold: 202000,
    tiers: [
      { min: 202001, max: 236000, rate: 0.01 },
      { min: 236001, max: 316000, rate: 0.0125 },
      { min: 316001, max: Infinity, rate: 0.015 },
    ],
  },
} as const;

// Low income tax offset thresholds
const FY2025_26_LOW_INCOME_TAX_OFFSET: LowIncomeTaxOffset = {
  maxOffset: 700,
  fullOffsetLimit: 37500,
  firstPhaseOutEnd: 45000,
  firstPhaseOutRate: 0.05,
  secondPhaseOutEnd: 66667,
  secondPhaseOutBase: 325,
  secondPhaseOutRate: 0.015,
} as const;

// Work from home deduction rates
const FY2025_26_WORK_FROM_HOME: WorkFromHome = {
  shortcutRate: 0.7, // per hour
  maxShortcutClaim: Infinity,
} as const;

const FY2025_26_FINANCIAL_YEAR = '2025-26' as const;

const FY2025_26_TAX_YEAR_INFO: TaxYearInfo = {
  current: FY2025_26_FINANCIAL_YEAR,
  display: '2025-26',
  sourceYearForMedicareThresholds: '2024-25',
  note: 'Medicare levy low-income thresholds are the 2024-25 amounts that apply to 2024-25 and later income years until replaced.',
} as const;

// Standard deduction amounts (for reference)
const FY2025_26_STANDARD_DEDUCTIONS: StandardDeductions = {
  workClothes: 150,
  workFromHomeBasic: 300,
  carExpenseKmRate: 0.88, // per km for 2025-26
} as const;

export const ACTIVE_FINANCIAL_YEAR = '2025-26' as const;

export const TAX_YEAR_CONFIGS: Record<string, TaxYearConfig> = {
  '2025-26': {
    configVersion: '2025-26.1',
    financialYear: FY2025_26_FINANCIAL_YEAR,
    taxBrackets: FY2025_26_TAX_BRACKETS,
    helpRepaymentThresholds: FY2025_26_HECS_THRESHOLDS,
    medicareLevyThresholds: FY2025_26_MEDICARE_LEVY_THRESHOLDS,
    medicareLevySurcharge: FY2025_26_MEDICARE_LEVY_SURCHARGE,
    lowIncomeTaxOffset: FY2025_26_LOW_INCOME_TAX_OFFSET,
    workFromHome: FY2025_26_WORK_FROM_HOME,
    standardDeductions: FY2025_26_STANDARD_DEDUCTIONS,
    taxFreeThreshold: 18200,
    taxYearInfo: FY2025_26_TAX_YEAR_INFO,
    sourceNoteIds: FY2025_26_SOURCE_NOTE_IDS,
  },
} as const;

export const ACTIVE_TAX_YEAR_CONFIG = TAX_YEAR_CONFIGS[ACTIVE_FINANCIAL_YEAR];

// Backward-compatible aliases for app code.
export const FINANCIAL_YEAR: string = ACTIVE_TAX_YEAR_CONFIG.financialYear;
export const TAX_YEAR_INFO: TaxYearInfo = ACTIVE_TAX_YEAR_CONFIG.taxYearInfo;
export const TAX_BRACKETS_2025_26: readonly TaxBracket[] = ACTIVE_TAX_YEAR_CONFIG.taxBrackets;
export const HECS_THRESHOLDS_2025_26: readonly HecsThreshold[] =
  ACTIVE_TAX_YEAR_CONFIG.helpRepaymentThresholds;
export const MEDICARE_LEVY_THRESHOLDS: MedicareLevyThresholds =
  ACTIVE_TAX_YEAR_CONFIG.medicareLevyThresholds;
export const MEDICARE_LEVY_SURCHARGE: MedicareLevySurcharge =
  ACTIVE_TAX_YEAR_CONFIG.medicareLevySurcharge;
export const LOW_INCOME_TAX_OFFSET: LowIncomeTaxOffset = ACTIVE_TAX_YEAR_CONFIG.lowIncomeTaxOffset;
export const WORK_FROM_HOME: WorkFromHome = ACTIVE_TAX_YEAR_CONFIG.workFromHome;
export const STANDARD_DEDUCTIONS: StandardDeductions = ACTIVE_TAX_YEAR_CONFIG.standardDeductions;
export const TAX_FREE_THRESHOLD: number = ACTIVE_TAX_YEAR_CONFIG.taxFreeThreshold;
export const PAYG_ESTIMATE: PaygEstimate = {
  medicareEstimateThreshold: MEDICARE_LEVY_THRESHOLDS.singleLower,
} as const;

// Dependent spouse tax offset
export const DEPENDENT_SPOUSE_OFFSET: DependentSpouseOffset = {
  maxOffset: 0, // Removed from 2019-20
  incomeThreshold: 0,
} as const;

// Senior Australians tax offset
export const SENIOR_TAX_OFFSET: SeniorTaxOffset = {
  single: {
    maxOffset: 2230,
    incomeThreshold: 32279,
    phaseOutRate: 0.125,
  },
  couple: {
    maxOffset: 1602,
    incomeThreshold: 28974,
    phaseOutRate: 0.125,
  },
} as const;
