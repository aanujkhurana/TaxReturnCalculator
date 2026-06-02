import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';

interface ResultInfoItem {
  label: string;
  detail: string;
}

interface ResultInfoCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  intro: string;
  items: ResultInfoItem[];
  title: string;
}

const ResultInfoCard: React.FC<ResultInfoCardProps> = ({
  icon,
  iconColor,
  intro,
  items,
  title,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.intro}>{intro}</Text>
      <View style={styles.list}>
        {items.map(({ label, detail }) => (
          <View key={label} style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.detail}>{detail}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface CalculationAssumptionsCardProps {
  assumptions: ResultInfoItem[];
}

export const CalculationAssumptionsCard: React.FC<CalculationAssumptionsCardProps> = ({
  assumptions,
}) => {
  const { theme } = useTheme();

  return (
    <ResultInfoCard
      icon="shield-checkmark-outline"
      iconColor={theme.warning}
      title="Calculation Assumptions"
      intro="Review these before saving or exporting this estimate."
      items={assumptions}
    />
  );
};

interface DocumentChecklistCardProps {
  documentChecklist: ResultInfoItem[];
}

export const DocumentChecklistCard: React.FC<DocumentChecklistCardProps> = ({
  documentChecklist,
}) => {
  const { theme } = useTheme();

  return (
    <ResultInfoCard
      icon="folder-open-outline"
      iconColor={theme.primary}
      title="Document and Receipt Checklist"
      intro="Keep these records with your estimate before saving or lodging."
      items={documentChecklist}
    />
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
      marginLeft: 8,
      flex: 1,
    },
    intro: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    list: {
      gap: 10,
    },
    item: {
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    detail: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.textSecondary,
    },
  });
