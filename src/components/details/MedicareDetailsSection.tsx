import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../forms/InputField';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

const POLICY_TYPES = ['single', 'family'] as const;

interface MedicareDetailsSectionProps {
  isCollapsed: boolean;
  isComplete: boolean;
  medicareExemption: boolean;
  hasSpouse: boolean;
  spouseIncome: string;
  hasPrivateHospitalCover: boolean;
  privateHospitalCoverDays: string;
  privateHospitalCoverDaysError?: string;
  privateHealthPolicyType: string;
  hasDependents: boolean;
  dependents: string;
  onToggleCollapsed: () => void;
  onToggleMedicareExemption: () => void;
  onToggleSpouse: () => void;
  onChangeSpouseIncome: (value: string) => void;
  onTogglePrivateHospitalCover: () => void;
  onChangePrivateHospitalCoverDays: (value: string) => void;
  onSelectPrivateHealthPolicyType: (value: string) => void;
  onToggleDependents: () => void;
  onChangeDependents: (value: string) => void;
}

const MedicareDetailsSection: React.FC<MedicareDetailsSectionProps> = ({
  isCollapsed,
  isComplete,
  medicareExemption,
  hasSpouse,
  spouseIncome,
  hasPrivateHospitalCover,
  privateHospitalCoverDays,
  privateHospitalCoverDaysError,
  privateHealthPolicyType,
  hasDependents,
  dependents,
  onToggleCollapsed,
  onToggleMedicareExemption,
  onToggleSpouse,
  onChangeSpouseIncome,
  onTogglePrivateHospitalCover,
  onChangePrivateHospitalCoverDays,
  onSelectPrivateHealthPolicyType,
  onToggleDependents,
  onChangeDependents,
}) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const iconColor = isComplete ? (isDark ? '#000' : '#fff') : theme.categoryPink;

  return (
    <View style={styles.category}>
      <TouchableOpacity
        style={[
          styles.header,
          isCollapsed && styles.headerCollapsed,
          { backgroundColor: isComplete ? theme.categoryPinkLight : theme.surfaceSecondary },
        ]}
        onPress={onToggleCollapsed}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.icon,
              { backgroundColor: isComplete ? theme.categoryPink : theme.categoryPinkLight },
              isComplete && styles.iconActive,
            ]}
          >
            <Ionicons name="medical-outline" size={22} color={iconColor} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isComplete && { color: theme.categoryPink }]}>
              Medicare Levy
            </Text>
            <Text style={styles.description}>Medicare levy exemptions and dependents</Text>
          </View>
        </View>
        <View style={[styles.toggle, isComplete && { borderColor: theme.categoryPink }]}>
          <Ionicons
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            size={20}
            color={isComplete ? theme.categoryPink : '#64748B'}
          />
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.content}>
          <View style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Ionicons name="people-outline" size={18} color={theme.categoryPink} />
              <Text style={styles.guidanceTitle}>Spouse and Family Guidance</Text>
            </View>
            <Text style={styles.guidanceText}>
              Spouse income and dependents can increase Medicare levy family thresholds and change
              whether Medicare levy surcharge uses single or family tiers.
            </Text>
            <Text style={styles.guidanceText}>
              Private hospital cover affects only the Medicare levy surcharge. Medicare levy
              exemptions are separate and should be used only when you have evidence.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.toggleButton, medicareExemption && styles.toggleButtonActive]}
            onPress={onToggleMedicareExemption}
          >
            <View style={styles.toggleBody}>
              <View style={styles.toggleRow}>
                <Ionicons
                  name={medicareExemption ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={medicareExemption ? theme.primary : '#666'}
                />
                <Text style={[styles.toggleText, medicareExemption && styles.toggleTextActive]}>
                  I am exempt from Medicare Levy
                </Text>
              </View>
              <Text style={styles.toggleSubtext}>
                Tick this if you are a temporary visa holder, foreign resident, or Norfolk Island
                resident. Leave unticked if you are an Australian resident for tax purposes.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, hasSpouse && styles.toggleButtonActive]}
            onPress={onToggleSpouse}
          >
            <Ionicons
              name={hasSpouse ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={hasSpouse ? theme.primary : '#666'}
            />
            <Text style={[styles.toggleText, hasSpouse && styles.toggleTextActive]}>
              I had a spouse for Medicare levy purposes
            </Text>
          </TouchableOpacity>

          {hasSpouse && (
            <InputField
              label="Spouse Taxable Income"
              value={spouseIncome}
              onChangeText={onChangeSpouseIncome}
              placeholder="Spouse taxable income (e.g., 42000)"
              keyboardType="numeric"
              icon="person-outline"
              prefix="$"
            />
          )}

          <TouchableOpacity
            style={[styles.toggleButton, hasPrivateHospitalCover && styles.toggleButtonActive]}
            onPress={onTogglePrivateHospitalCover}
          >
            <Ionicons
              name={hasPrivateHospitalCover ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={hasPrivateHospitalCover ? theme.primary : '#666'}
            />
            <Text style={[styles.toggleText, hasPrivateHospitalCover && styles.toggleTextActive]}>
              I had appropriate private hospital cover
            </Text>
          </TouchableOpacity>

          {hasPrivateHospitalCover && (
            <>
              <View style={styles.policyTypeSegment}>
                {POLICY_TYPES.map((policyType) => (
                  <TouchableOpacity
                    key={policyType}
                    style={[
                      styles.policyTypeOption,
                      privateHealthPolicyType === policyType && styles.policyTypeOptionActive,
                    ]}
                    onPress={() => onSelectPrivateHealthPolicyType(policyType)}
                  >
                    <Text
                      style={[
                        styles.policyTypeText,
                        privateHealthPolicyType === policyType && styles.policyTypeTextActive,
                      ]}
                    >
                      {policyType === 'single' ? 'Single Policy' : 'Family Policy'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="Private Hospital Cover Days"
                value={privateHospitalCoverDays}
                onChangeText={onChangePrivateHospitalCoverDays}
                placeholder="Days covered in the year (0-365)"
                keyboardType="number-pad"
                icon="calendar-outline"
                error={privateHospitalCoverDaysError}
                suffix=" days"
              />

              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Medicare levy surcharge is prorated for days without appropriate private hospital
                  cover.
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.toggleButton, hasDependents && styles.toggleButtonActive]}
            onPress={onToggleDependents}
          >
            <Ionicons
              name={hasDependents ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={hasDependents ? theme.primary : '#666'}
            />
            <Text style={[styles.toggleText, hasDependents && styles.toggleTextActive]}>
              I have dependents
            </Text>
          </TouchableOpacity>

          {hasDependents && (
            <InputField
              label="Number of Dependents"
              value={dependents}
              onChangeText={onChangeDependents}
              placeholder="Number of children/dependents (e.g., 2)"
              keyboardType="number-pad"
              icon="people-outline"
              helpKey="dependents"
            />
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
      shadowColor: theme.categoryPink,
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
    guidanceCard: {
      marginBottom: 12,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.categoryPink,
      backgroundColor: theme.categoryPinkLight,
    },
    guidanceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    guidanceTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
      marginLeft: 8,
    },
    guidanceText: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.textSecondary,
      marginTop: 4,
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
    policyTypeSegment: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    policyTypeOption: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 10,
    },
    policyTypeOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight,
    },
    policyTypeText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    policyTypeTextActive: {
      color: theme.primary,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSecondary,
      padding: 10,
      borderRadius: 8,
      marginTop: 8,
    },
    infoText: {
      fontSize: 12,
      color: theme.textLight,
      marginLeft: 6,
      flex: 1,
    },
  });

export default MedicareDetailsSection;
