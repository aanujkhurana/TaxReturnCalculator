import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

export interface TaxYearOption {
  value: string;
  label: string;
  note: string;
}

interface TaxYearSelectorProps {
  options: TaxYearOption[];
  selectedFinancialYear: string;
  isCollapsed: boolean;
  onSelectFinancialYear: (financialYear: string) => void;
  onToggle: () => void;
}

const TaxYearSelector: React.FC<TaxYearSelectorProps> = ({
  options,
  selectedFinancialYear,
  isCollapsed,
  onSelectFinancialYear,
  onToggle,
}) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.category}>
      <TouchableOpacity
        style={[
          styles.header,
          isCollapsed && styles.headerCollapsed,
          { backgroundColor: theme.primaryLight },
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.icon, styles.iconActive, { backgroundColor: theme.primary }]}>
            <Ionicons name="calendar-outline" size={22} color={isDark ? '#000' : '#fff'} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.primary }]}>Tax Year</Text>
            <Text style={styles.description}>Rates and thresholds used for this estimate</Text>
          </View>
        </View>
        <View style={[styles.toggle, { borderColor: theme.primary }]}>
          <Ionicons
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            size={20}
            color={theme.primary}
          />
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.content}>
          <View style={styles.optionGrid}>
            {options.map((option) => {
              const isSelected = option.value === selectedFinancialYear;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, isSelected && styles.optionActive]}
                  onPress={() => onSelectFinancialYear(option.value)}
                  activeOpacity={0.75}
                >
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>Financial Year {option.label}</Text>
                    <Text style={styles.optionSubtext}>{option.note}</Text>
                  </View>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isSelected ? theme.primary : theme.textSecondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    category: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 0,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    headerCollapsed: {
      borderBottomWidth: 0,
      borderRadius: 12,
      marginBottom: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    iconActive: {
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 19,
      fontWeight: '700',
      marginBottom: 6,
      letterSpacing: 0.2,
      lineHeight: 24,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 0,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    toggle: {
      padding: 10,
      borderRadius: 22,
      backgroundColor: theme.surface,
      borderWidth: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    content: {
      padding: 24,
      paddingTop: 20,
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: theme.border,
    },
    optionGrid: {
      gap: 10,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    optionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight,
    },
    optionTextContainer: {
      flex: 1,
      paddingRight: 12,
    },
    optionText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.text,
    },
    optionSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
      marginTop: 3,
    },
  });

export default TaxYearSelector;
