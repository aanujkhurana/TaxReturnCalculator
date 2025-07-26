/**
 * Theme definitions for light and dark modes
 * Contains all color schemes and styling constants
 */

// Light theme color scheme
export const lightTheme = {
  // Background colors
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  
  // Text colors
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textLight: '#475569',
  
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#EBF5FF',
  primaryBorder: '#E1EFFF',
  
  // Accent colors
  accent: '#10B981',
  accentLight: '#ECFDF5',
  accentBorder: '#BBF7D0',
  
  // Button colors (following user preferences)
  buttonNext: '#4A90E2',
  buttonNextBorder: '#2C5F8C',
  buttonBack: '#6B7280',
  buttonBackBorder: '#6B7280',
  buttonCalculate: '#10B981',
  buttonCalculateBorder: '#059669',
  
  // Status colors
  success: '#10B981',
  successLight: '#ECFDF5',
  successBorder: '#BBF7D0',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorBorder: '#FECACA',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningBorder: '#FDE68A',
  
  // Border and divider colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E5E7EB',
  
  // Shadow colors
  shadow: '#000',
  
  // Category colors
  categoryWork: '#4A90E2',
  categoryWorkLight: '#EBF5FF',
  categoryEducation: '#10B981',
  categoryEducationLight: '#ECFDF5',
  categoryDonations: '#F59E0B',
  categoryDonationsLight: '#FFFBEB',
  categoryOther: '#8B5CF6',
  categoryOtherLight: '#F3E8FF',
  categoryHome: '#EF4444',
  categoryHomeLight: '#FEF2F2',
  categoryPink: '#EC4899',
  categoryPinkLight: '#FDF2F8',
  
  // ATO colors
  atoBlue: '#1E40AF',
  atoBlueBorder: '#1D4ED8',
};

// Dark theme color scheme
export const darkTheme = {
  // Background colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  
  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textLight: '#E2E8F0',
  
  // Primary colors
  primary: '#60A5FA',
  primaryLight: '#1E3A8A',
  primaryBorder: '#3B82F6',
  
  // Accent colors
  accent: '#34D399',
  accentLight: '#064E3B',
  accentBorder: '#10B981',
  
  // Button colors (following user preferences, adapted for dark mode)
  buttonNext: '#60A5FA',
  buttonNextBorder: '#3B82F6',
  buttonBack: '#6B7280',
  buttonBackBorder: '#9CA3AF',
  buttonCalculate: '#10B981',
  buttonCalculateBorder: '#34D399',
  
  // Status colors
  success: '#34D399',
  successLight: '#064E3B',
  successBorder: '#10B981',
  error: '#F87171',
  errorLight: '#7F1D1D',
  errorBorder: '#DC2626',
  warning: '#FBBF24',
  warningLight: '#92400E',
  warningBorder: '#F59E0B',
  
  // Border and divider colors
  border: '#475569',
  borderLight: '#334155',
  divider: '#475569',
  
  // Shadow colors
  shadow: '#000',
  
  // Category colors (adapted for dark mode)
  categoryWork: '#60A5FA',
  categoryWorkLight: '#1E3A8A',
  categoryEducation: '#34D399',
  categoryEducationLight: '#064E3B',
  categoryDonations: '#FBBF24',
  categoryDonationsLight: '#92400E',
  categoryOther: '#A78BFA',
  categoryOtherLight: '#4C1D95',
  categoryHome: '#F87171',
  categoryHomeLight: '#7F1D1D',
  categoryPink: '#F472B6',
  categoryPinkLight: '#831843',
  
  // ATO colors
  atoBlue: '#3B82F6',
  atoBlueBorder: '#60A5FA',
};

// Theme storage key
export const THEME_STORAGE_KEY = 'app_theme_preference';
