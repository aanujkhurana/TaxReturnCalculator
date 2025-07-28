import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

// Type definitions for ThemeToggle props
export interface ThemeToggleProps {
  style?: ViewStyle;
  size?: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style, size = 24 }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleToggle = (): void => {
    toggleTheme();
  };

  const getStyles = (theme: Theme) => StyleSheet.create({
    toggleButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    toggleButtonActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primary,
    },
  });

  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        isDark && styles.toggleButtonActive,
        style
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      accessibilityRole="button"
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={size}
        color={isDark ? theme.primary : theme.textSecondary}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
