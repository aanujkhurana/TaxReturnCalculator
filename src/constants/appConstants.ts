/**
 * General application constants
 * Contains app-wide configuration values and constants
 */

// Type definitions for constants
export interface StorageKeys {
  readonly SAVED_CALCULATIONS: string;
  readonly THEME_PREFERENCE: string;
}

export interface AppInfo {
  readonly NAME: string;
  readonly VERSION: string;
  readonly FINANCIAL_YEAR: string;
}

export interface CalculatorStep {
  readonly id: number;
  readonly name: string;
  readonly label: string;
}

export interface DeductionSubcategory {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
}

export interface DeductionCategory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly subcategories?: DeductionSubcategory[];
}

export interface DeductionCategories {
  readonly WORK_RELATED: DeductionCategory;
  readonly SELF_EDUCATION: DeductionCategory;
  readonly DONATIONS: DeductionCategory;
  readonly OTHER_DEDUCTIONS: DeductionCategory;
}

// Storage keys
export const STORAGE_KEYS: StorageKeys = {
  SAVED_CALCULATIONS: 'savedCalculations',
  THEME_PREFERENCE: 'app_theme_preference'
} as const;

// App information
export const APP_INFO: AppInfo = {
  NAME: 'TaxMate AU',
  VERSION: '1.0.0',
  FINANCIAL_YEAR: '2024-25'
} as const;

// Step configuration for the tax calculator wizard
export const CALCULATOR_STEPS: readonly CalculatorStep[] = [
  { id: 1, name: 'Income', label: 'Income' },
  { id: 2, name: 'Deductions', label: 'Deductions' },
  { id: 3, name: 'Details', label: 'Details' },
  { id: 4, name: 'Results', label: 'Results' }
] as const;

// Deduction categories configuration
export const DEDUCTION_CATEGORIES: DeductionCategories = {
  WORK_RELATED: {
    id: 'workRelated',
    title: 'Work-Related Expenses',
    description: 'Tools, uniforms, travel, and other work expenses',
    icon: 'briefcase',
    color: 'categoryWork',
    subcategories: [
      { id: 'workRelatedTravel', title: 'Travel Expenses', icon: 'car' },
      { id: 'workRelatedEquipment', title: 'Equipment & Tools', icon: 'construct' },
      { id: 'workRelatedUniforms', title: 'Uniforms & Clothing', icon: 'shirt' },
      { id: 'workRelatedMemberships', title: 'Memberships & Subscriptions', icon: 'card' }
    ]
  },
  SELF_EDUCATION: {
    id: 'selfEducation',
    title: 'Self-Education Expenses',
    description: 'Courses, books, and professional development',
    icon: 'school',
    color: 'categoryEducation',
    subcategories: [
      { id: 'selfEducationCourseFees', title: 'Course Fees', icon: 'school' },
      { id: 'selfEducationTextbooks', title: 'Textbooks & Materials', icon: 'book' },
      { id: 'selfEducationConferences', title: 'Conferences & Seminars', icon: 'people' },
      { id: 'selfEducationCertifications', title: 'Certifications', icon: 'ribbon' }
    ]
  },
  DONATIONS: {
    id: 'donations',
    title: 'Charitable Donations',
    description: 'Tax-deductible donations to registered charities',
    icon: 'heart',
    color: 'categoryDonations',
    subcategories: [
      { id: 'donationsCharitable', title: 'Charitable Donations', icon: 'heart' },
      { id: 'donationsDisasterRelief', title: 'Disaster Relief', icon: 'medical' },
      { id: 'donationsReligious', title: 'Religious Organizations', icon: 'home' }
    ]
  },
  OTHER_DEDUCTIONS: {
    id: 'otherDeductions',
    title: 'Other Deductions',
    description: 'Investment expenses, tax agent fees, and more',
    icon: 'document-text',
    color: 'categoryOther'
  }
} as const;

// Additional type definitions
export interface ValidationRule {
  readonly MIN: number;
  readonly MAX: number;
  readonly DECIMAL_PLACES: number;
}

export interface ValidationRules {
  readonly INCOME: ValidationRule;
  readonly HOURS: ValidationRule;
  readonly DEPENDENTS: ValidationRule;
}

export interface LoadingStates {
  readonly CALCULATING: string;
  readonly SAVING: string;
  readonly LOADING: string;
  readonly GENERATING_PDF: string;
}

export interface ErrorMessages {
  readonly INVALID_NUMBER: string;
  readonly NEGATIVE_VALUE: string;
  readonly REQUIRED_FIELD: string;
  readonly CALCULATION_ERROR: string;
  readonly SAVE_ERROR: string;
  readonly LOAD_ERROR: string;
}

export interface SuccessMessages {
  readonly CALCULATION_SAVED: string;
  readonly PDF_GENERATED: string;
  readonly DATA_LOADED: string;
}

export interface ExternalLinks {
  readonly ATO_WEBSITE: string;
  readonly ATO_MYDEDUCTIONS: string;
  readonly ATO_LODGE_ONLINE: string;
  readonly ATO_TAX_HELP: string;
  readonly ATO_DEDUCTIONS_GUIDE: string;
  readonly MYGOV: string;
}

export interface AnimationDurations {
  readonly SHORT: number;
  readonly MEDIUM: number;
  readonly LONG: number;
}

export interface Breakpoints {
  readonly SMALL: number;
  readonly MEDIUM: number;
  readonly LARGE: number;
}

// Form validation rules
export const VALIDATION_RULES: ValidationRules = {
  INCOME: {
    MIN: 0,
    MAX: 10000000,
    DECIMAL_PLACES: 2
  },
  HOURS: {
    MIN: 0,
    MAX: 8760, // Maximum hours in a year
    DECIMAL_PLACES: 0
  },
  DEPENDENTS: {
    MIN: 0,
    MAX: 20,
    DECIMAL_PLACES: 0
  }
} as const;

// Loading states and messages
export const LOADING_STATES: LoadingStates = {
  CALCULATING: 'Calculating your tax return...',
  SAVING: 'Saving calculation...',
  LOADING: 'Loading...',
  GENERATING_PDF: 'Generating PDF report...'
} as const;

// Error messages
export const ERROR_MESSAGES: ErrorMessages = {
  INVALID_NUMBER: 'Please enter a valid number',
  NEGATIVE_VALUE: 'Value cannot be negative',
  REQUIRED_FIELD: 'This field is required',
  CALCULATION_ERROR: 'Error calculating tax return',
  SAVE_ERROR: 'Error saving calculation',
  LOAD_ERROR: 'Error loading data'
} as const;

// Success messages
export const SUCCESS_MESSAGES: SuccessMessages = {
  CALCULATION_SAVED: 'Calculation saved successfully',
  PDF_GENERATED: 'PDF report generated successfully',
  DATA_LOADED: 'Data loaded successfully'
} as const;

// External links
export const EXTERNAL_LINKS: ExternalLinks = {
  ATO_WEBSITE: 'https://www.ato.gov.au',
  ATO_MYDEDUCTIONS: 'https://www.ato.gov.au/calculators-and-tools/mydeductions/',
  ATO_LODGE_ONLINE: 'https://www.ato.gov.au/individuals/lodging-your-tax-return/lodge-online/',
  ATO_TAX_HELP: 'https://www.ato.gov.au/individuals/tax-help-program/',
  ATO_DEDUCTIONS_GUIDE: 'https://www.ato.gov.au/individuals/income-deductions-offsets-and-records/deductions/',
  MYGOV: 'https://my.gov.au'
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS: AnimationDurations = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500
} as const;

// Screen breakpoints
export const BREAKPOINTS: Breakpoints = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024
} as const;
