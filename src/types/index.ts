/**
 * Global Type Definitions for TaxMate AU
 */

// Navigation types
export type ScreenType = 'splash' | 'home' | 'about' | 'calculator';

// Form data types
export interface JobIncome {
  amount: string;
}

export interface DeductionCategory {
  travel: string;
  equipment: string;
  uniforms: string;
  memberships: string;
  other: string;
}

export interface SelfEducationDeductions {
  courseFees: string;
  textbooks: string;
  conferences: string;
  certifications: string;
  other: string;
}

export interface DonationDeductions {
  charitable: string;
  disasterRelief: string;
  religious: string;
  other: string;
}

export interface OtherDeductions {
  investment: string;
  taxAgent: string;
  incomeProtection: string;
  bankFees: string;
  other: string;
}

export interface Deductions {
  workRelated: DeductionCategory;
  selfEducation: SelfEducationDeductions;
  donations: DonationDeductions;
  other: OtherDeductions;
}

export interface FormData {
  jobIncomes: string[];
  taxWithheld: string;
  deductions: Deductions;
  workFromHomeHours: string;
  abnIncome: string;
  hecsDebt: boolean;
  medicareExemption: boolean;
  dependents: string;
  hasDependents: boolean;
}

// Tax calculation result types
export interface TaxBreakdown {
  income: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  hecsRepayment: number;
  totalTax: number;
  taxWithheld: number;
  refundOrOwing: number;
  effectiveRate: number;
  marginalRate: number;
}

export interface DeductionBreakdown {
  workRelated: number;
  selfEducation: number;
  donations: number;
  other: number;
  workFromHome: number;
  total: number;
}

export interface TaxResult {
  breakdown: TaxBreakdown;
  deductionBreakdown: DeductionBreakdown;
  summary: {
    totalIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    totalTax: number;
    refundOrOwing: number;
  };
}

// Saved calculation types
export interface SavedCalculation {
  id: string;
  name?: string;
  date: string;
  formData: FormData;
  result: TaxResult;
}

// Theme types
export interface Theme {
  // Colors
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  accent: string;
  accentBorder: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textLight: string;
  border: string;
  borderLight: string;
  shadow: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  buttonBack: string;
  buttonBackBorder: string;
}

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
}

// Component prop types
export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  icon?: string;
  helpKey?: string;
  error?: string;
  editable?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  helpKey: string;
}

// Validation types
export interface ValidationErrors {
  [key: string]: string;
}

// Help text types
export interface HelpTextItem {
  title: string;
  description: string;
  examples?: string[];
  tips?: string[];
  whereToFind?: string;
}

export interface HelpTextData {
  [key: string]: HelpTextItem;
}

// Tax constants types
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxConstants {
  taxBrackets: TaxBracket[];
  medicareLevy: number;
  medicareLevyThreshold: number;
  hecsThresholds: { min: number; rate: number }[];
  taxFreeThreshold: number;
  workFromHomeRate: number;
}

// Screen navigation props
export interface HomeScreenProps {
  onCreateNew: () => void;
  onViewCalculation: (calculation: SavedCalculation) => void;
  onNavigate: (screen: ScreenType) => void;
}

export interface AboutScreenProps {
  onBack: () => void;
}

export interface SplashScreenProps {
  onFinish: () => void;
}

// Utility function types
export type CurrencyFormatter = (amount: number | string) => string;
export type NumberFormatter = (value: number | string) => string;
export type ValidationFunction = (value: string) => string | null;

// Service types
export interface StorageService {
  saveCalculation: (data: FormData, name?: string) => Promise<void>;
  getCalculations: () => Promise<SavedCalculation[]>;
  deleteCalculation: (id: string) => Promise<void>;
}

export interface PDFService {
  generateAndSharePDF: (result: TaxResult, formData: FormData) => Promise<void>;
}

export interface TaxCalculationService {
  calculateTax: (formData: FormData) => TaxResult;
}
