import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme, THEME_STORAGE_KEY, Theme } from '../constants/themes';

// Type definitions for theme context
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isLoading: boolean;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  isLoading: true,
});

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Fallback to system preference
        const systemTheme: ColorSchemeName = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system preference on error
      const systemTheme: ColorSchemeName = Appearance.getColorScheme();
      setIsDark(systemTheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (theme: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = (): void => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme: 'light' | 'dark'): void => {
    const isDarkTheme = theme === 'dark';
    setIsDark(isDarkTheme);
    saveThemePreference(theme);
  };

  const theme: Theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
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
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to get themed styles
export const getThemedStyles = <T extends any>(styleFunction: (theme: Theme) => T, theme: Theme): T => {
  return styleFunction(theme);
};

export default ThemeContext;