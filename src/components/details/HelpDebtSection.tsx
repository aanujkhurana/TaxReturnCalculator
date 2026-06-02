import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../forms/InputField';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

interface HelpDebtSectionProps {
  hasHelpDebt: boolean;
  isCollapsed: boolean;
  reportableSuper: string;
  reportableFringeBenefits: string;
  netInvestmentLosses: string;
  exemptForeignIncome: string;
  taxYearDisplay: string;
  onToggleCollapsed: () => void;
  onToggleHelpDebt: () => void;
  onChangeReportableSuper: (value: string) => void;
  onChangeReportableFringeBenefits: (value: string) => void;
  onChangeNetInvestmentLosses: (value: string) => void;
  onChangeExemptForeignIncome: (value: string) => void;
}

const HelpDebtSection: React.FC<HelpDebtSectionProps> = ({
  hasHelpDebt,
  isCollapsed,
  reportableSuper,
  reportableFringeBenefits,
  netInvestmentLosses,
  exemptForeignIncome,
  taxYearDisplay,
  onToggleCollapsed,
  onToggleHelpDebt,
  onChangeReportableSuper,
  onChangeReportableFringeBenefits,
  onChangeNetInvestmentLosses,
  onChangeExemptForeignIncome,
}) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const iconColor = hasHelpDebt ? (isDark ? '#000' : '#fff') : theme.categoryWork;

  return (
    <View style={styles.category}>
      <TouchableOpacity
        style={[
          styles.header,
          isCollapsed && styles.headerCollapsed,
          { backgroundColor: hasHelpDebt ? theme.categoryWorkLight : theme.surfaceSecondary },
        ]}
        onPress={onToggleCollapsed}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.icon,
              { backgroundColor: hasHelpDebt ? theme.categoryWork : theme.categoryWorkLight },
              hasHelpDebt && styles.iconActive,
            ]}
          >
            <Ionicons name="school-outline" size={22} color={iconColor} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, hasHelpDebt && { color: theme.categoryWork }]}>
              HECS-HELP Debt
            </Text>
            <Text style={styles.description}>Student loan repayment obligations</Text>
          </View>
        </View>
        <View style={[styles.toggle, hasHelpDebt && { borderColor: theme.categoryWork }]}>
          <Ionicons
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            size={20}
            color={hasHelpDebt ? theme.categoryWork : '#64748B'}
          />
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.toggleButton, hasHelpDebt && styles.toggleButtonActive]}
            onPress={onToggleHelpDebt}
          >
            <View style={styles.toggleBody}>
              <View style={styles.toggleRow}>
                <Ionicons
                  name={hasHelpDebt ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={hasHelpDebt ? theme.primary : '#666'}
                />
                <Text style={[styles.toggleText, hasHelpDebt && styles.toggleTextActive]}>
                  I have HECS-HELP debt
                </Text>
              </View>
              <Text style={styles.toggleSubtext}>
                HECS-HELP repayments use the {taxYearDisplay} marginal method and include
                repayment-income adjustments below.
              </Text>
            </View>
          </TouchableOpacity>

          {hasHelpDebt && (
            <>
              <InputField
                label="Reportable Super Contributions"
                value={reportableSuper}
                onChangeText={onChangeReportableSuper}
                placeholder="Salary sacrifice super (e.g., 5000)"
                icon="wallet-outline"
                prefix="$"
              />
              <InputField
                label="Reportable Fringe Benefits"
                value={reportableFringeBenefits}
                onChangeText={onChangeReportableFringeBenefits}
                placeholder="Reportable fringe benefits (e.g., 3500)"
                icon="briefcase-outline"
                prefix="$"
              />
              <InputField
                label="Net Investment Losses"
                value={netInvestmentLosses}
                onChangeText={onChangeNetInvestmentLosses}
                placeholder="Rental/investment losses (e.g., 2000)"
                icon="trending-down-outline"
                prefix="$"
              />
              <InputField
                label="Exempt Foreign Income"
                value={exemptForeignIncome}
                onChangeText={onChangeExemptForeignIncome}
                placeholder="Exempt foreign income (e.g., 10000)"
                icon="earth-outline"
                prefix="$"
              />
            </>
          )}
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
      shadowColor: theme.categoryWork,
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
      color: theme.text,
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
      borderColor: theme.border,
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
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
      backgroundColor: theme.surfaceSecondary,
    },
    toggleButtonActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primary,
    },
    toggleBody: {
      flex: 1,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
      fontWeight: '500',
    },
    toggleTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    toggleSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
      marginTop: 8,
      marginLeft: 36,
    },
  });

export default HelpDebtSection;
