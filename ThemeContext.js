import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const THEME_STORAGE_KEY = 'app_theme_preference';

// Define color schemes
const lightTheme = {
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
  buttonNext: '#000000',
  buttonNextBorder: '#333333',
  buttonBack: '#6B7280',
  buttonBackBorder: '#6B7280',
  buttonCalculate: '#10B981',
  buttonCalculateBorder: '#059669',
  
  // Status colors
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  
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
  
  // ATO colors
  atoBlue: '#1E40AF',
  atoBlueBorder: '#1D4ED8',
};

const darkTheme = {
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
  buttonNext: '#000000',
  buttonNextBorder: '#374151',
  buttonBack: '#6B7280',
  buttonBackBorder: '#9CA3AF',
  buttonCalculate: '#10B981',
  buttonCalculateBorder: '#34D399',
  
  // Status colors
  success: '#34D399',
  successLight: '#064E3B',
  error: '#F87171',
  errorLight: '#7F1D1D',
  warning: '#FBBF24',
  warningLight: '#92400E',
  
  // Border and divider colors
  border: '#475569',
  borderLight: '#334155',
  divider: '#475569',
  
  // Shadow colors
  shadow: '#000',
  
  // Category colors (adapted for dark mode)
  categoryWork: '#60A5FA',
  categoryWorkLight: '#1E3A8A',
    // categoryWork: '#818CF8',
  // categoryWorkLight: '#312E81',
  categoryEducation: '#34D399',
  categoryEducationLight: '#064E3B',
  categoryDonations: '#FBBF24',
  categoryDonationsLight: '#92400E',
  categoryOther: '#A78BFA',
  categoryOtherLight: '#4C1D95',
  categoryHome: '#F87171',
  categoryHomeLight: '#7F1D1D',
  
  // ATO colors
  atoBlue: '#3B82F6',
  atoBlueBorder: '#60A5FA',
};

// Create theme context
const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Fallback to system preference
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system preference on error
      const systemTheme = Appearance.getColorScheme();
      setIsDark(systemTheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme) => {
    const isDarkTheme = theme === 'dark';
    setIsDark(isDarkTheme);
    saveThemePreference(theme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to get themed styles
export const getThemedStyles = (styleFunction, theme) => {
  return styleFunction(theme);
};

export default ThemeContext;
