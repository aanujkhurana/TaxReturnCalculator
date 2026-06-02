import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

type StepActionVariant = 'next' | 'calculate';

interface StepActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  variant: StepActionVariant;
  disabled?: boolean;
}

const StepActionButton: React.FC<StepActionButtonProps> = ({
  icon,
  label,
  onPress,
  variant,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const isCalculate = variant === 'calculate';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          isCalculate ? styles.calculateButton : styles.nextButton,
          disabled && styles.disabledButton,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={isCalculate ? ['#10B981', '#059669'] : ['#4A90E2', '#2C5F8C']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#fff" />
          </View>
          <Text style={isCalculate ? styles.calculateText : styles.nextText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 32,
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    nextButton: {
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 10,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    calculateButton: {
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 10,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.accentBorder,
    },
    disabledButton: {
      opacity: 0.7,
    },
    gradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      minHeight: 56,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      marginRight: 12,
    },
    calculateText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
      marginRight: 8,
    },
    nextText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
      marginLeft: 8,
    },
  });

export default StepActionButton;
