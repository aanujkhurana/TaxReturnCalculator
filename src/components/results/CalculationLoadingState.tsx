import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

const LOADING_STEPS = [
  'Validating income sources',
  'Processing deductions',
  'Applying tax brackets & offsets',
  'Generating comprehensive report',
];

interface CalculationLoadingStateProps {
  loadingStep: number;
  taxYearDisplay: string;
}

const CalculationLoadingState: React.FC<CalculationLoadingStateProps> = ({
  loadingStep,
  taxYearDisplay,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="calculator" size={32} color={theme.primary} />
        </View>

        <Text style={styles.title}>Processing Your Tax Return</Text>
        <Text style={styles.subtitle}>
          Our advanced algorithms are analyzing your financial data to provide accurate tax
          calculations
        </Text>

        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color={theme.primary} style={styles.spinner} />
          <Text style={styles.progressText}>Calculating...</Text>
        </View>

        <View style={styles.steps}>
          {LOADING_STEPS.map((stepText, index) => {
            const stepNumber = index + 1;
            const isCompleted = loadingStep > stepNumber;
            const isActive = loadingStep === stepNumber;

            return (
              <View key={stepText} style={styles.step}>
                <View style={[styles.stepIcon, isCompleted && styles.stepIconActive]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  ) : isActive ? (
                    <ActivityIndicator size={8} color={theme.primary} />
                  ) : null}
                </View>
                <Text style={[styles.stepText, (isCompleted || isActive) && styles.stepTextActive]}>
                  {stepText}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Using {taxYearDisplay} ATO tax rates and thresholds{'\n'}
            Calculations typically complete within 3-5 seconds
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 36,
      alignItems: 'center',
      elevation: 10,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      minWidth: 300,
      maxWidth: 340,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconContainer: {
      marginBottom: 24,
      padding: 16,
      borderRadius: 50,
      backgroundColor: theme.primaryLight,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    spinner: {
      marginRight: 12,
    },
    progressText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '500',
    },
    steps: {
      alignSelf: 'stretch',
      marginTop: 8,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    stepIcon: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.primaryLight,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepIconActive: {
      backgroundColor: theme.primary,
    },
    stepText: {
      fontSize: 13,
      color: theme.textSecondary,
      flex: 1,
    },
    stepTextActive: {
      color: theme.text,
      fontWeight: '500',
    },
    footer: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      alignSelf: 'stretch',
    },
    footerText: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });

export default CalculationLoadingState;
