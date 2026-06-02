import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

const DEFAULT_STEP_LABELS = ['Income', 'Deductions', 'Details', 'Results'];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isIncomeStepComplete: boolean;
  resultAvailable: boolean;
  onBack: () => void;
  onStepPress: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  isIncomeStepComplete,
  resultAvailable,
  onBack,
  onStepPress,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  const isStepAccessible = (step: number): boolean =>
    step === 1 || (step <= 3 && isIncomeStepComplete) || (step === 4 && resultAvailable);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <View style={styles.indicator}>
        {steps.map((step) => {
          const isAccessible = isStepAccessible(step);
          const label = DEFAULT_STEP_LABELS[step - 1] ?? `Step ${step}`;

          return (
            <View key={step} style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.circle,
                  currentStep >= step && styles.circleActive,
                  currentStep === step && styles.circleCurrent,
                  !isAccessible && styles.circleDisabled,
                ]}
                onPress={() => onStepPress(step)}
                disabled={!isAccessible}
                accessibilityRole="button"
                accessibilityLabel={`Go to ${label} step`}
                accessibilityState={{ disabled: !isAccessible, selected: currentStep === step }}
              >
                <Text
                  style={[
                    styles.number,
                    currentStep >= step && styles.numberActive,
                    !isAccessible && styles.numberDisabled,
                  ]}
                >
                  {step}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.label,
                  currentStep >= step && styles.labelActive,
                  !isAccessible && styles.labelDisabled,
                ]}
              >
                {label}
              </Text>
              {step < totalSteps && (
                <View style={[styles.line, currentStep > step && styles.lineActive]} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    indicator: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    row: {
      flex: 1,
      alignItems: 'center',
      position: 'relative',
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surfaceSecondary,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    circleActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    circleCurrent: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      transform: [{ scale: 1.1 }],
    },
    circleDisabled: {
      backgroundColor: theme.surfaceSecondary,
      borderColor: theme.borderLight,
      opacity: 0.6,
    },
    number: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    numberActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    numberDisabled: {
      color: theme.textTertiary,
    },
    label: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
      letterSpacing: 0.1,
    },
    labelActive: {
      color: theme.text,
      fontWeight: '600',
    },
    labelDisabled: {
      color: theme.textTertiary,
      opacity: 0.7,
    },
    line: {
      position: 'absolute',
      top: 14,
      left: '60%',
      right: '-40%',
      height: 1.5,
      backgroundColor: theme.borderLight,
      zIndex: -1,
    },
    lineActive: {
      backgroundColor: theme.primary,
    },
  });

export default StepIndicator;
