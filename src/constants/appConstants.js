/**
 * General application constants
 * Contains app-wide configuration values and constants
 */

// Storage keys
export const STORAGE_KEYS = {
  SAVED_CALCULATIONS: 'savedCalculations',
  THEME_PREFERENCE: 'app_theme_preference'
};

// App information
export const APP_INFO = {
  NAME: 'TaxMate AU',
  VERSION: '1.0.0',
  FINANCIAL_YEAR: '2024-25'
};

// Step configuration for the tax calculator wizard
export const CALCULATOR_STEPS = [
  { id: 1, name: 'Income', label: 'Income' },
  { id: 2, name: 'Deductions', label: 'Deductions' },
  { id: 3, name: 'Details', label: 'Details' },
  { id: 4, name: 'Results', label: 'Results' }
];

// Deduction categories configuration
export const DEDUCTION_CATEGORIES = {
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
};

// Form validation rules
export const VALIDATION_RULES = {
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
};

// Loading states and messages
export const LOADING_STATES = {
  CALCULATING: 'Calculating your tax return...',
  SAVING: 'Saving calculation...',
  LOADING: 'Loading...',
  GENERATING_PDF: 'Generating PDF report...'
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_NUMBER: 'Please enter a valid number',
  NEGATIVE_VALUE: 'Value cannot be negative',
  REQUIRED_FIELD: 'This field is required',
  CALCULATION_ERROR: 'Error calculating tax return',
  SAVE_ERROR: 'Error saving calculation',
  LOAD_ERROR: 'Error loading data'
};

// Success messages
export const SUCCESS_MESSAGES = {
  CALCULATION_SAVED: 'Calculation saved successfully',
  PDF_GENERATED: 'PDF report generated successfully',
  DATA_LOADED: 'Data loaded successfully'
};

// External links
export const EXTERNAL_LINKS = {
  ATO_WEBSITE: 'https://www.ato.gov.au',
  ATO_MYDEDUCTIONS: 'https://www.ato.gov.au/calculators-and-tools/mydeductions/',
  ATO_LODGE_ONLINE: 'https://www.ato.gov.au/individuals/lodging-your-tax-return/lodge-online/',
  ATO_TAX_HELP: 'https://www.ato.gov.au/individuals/tax-help-program/',
  ATO_DEDUCTIONS_GUIDE: 'https://www.ato.gov.au/individuals/income-deductions-offsets-and-records/deductions/',
  MYGOV: 'https://my.gov.au'
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500
};

// Screen breakpoints
export const BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024
};
