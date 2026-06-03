import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../constants/themes';
import { formatCurrency } from '../../utils/formatters';

interface CompactTaxTableProps {
  result: any;
  taxWithheld: string;
}

const CompactTaxTable: React.FC<CompactTaxTableProps> = ({ result, taxWithheld }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const tableData = [
    ['Item', 'Amount'],
    ['TFN Employment Income', formatCurrency(result.totalTFNIncome)],
    ['ABN/Business Income', formatCurrency(result.abnIncomeNum)],
    ['Total Gross Income', formatCurrency(result.totalTFNIncome + result.abnIncomeNum)],
    ['Manual Deductions', formatCurrency(result.totalManualDeductions)],
    ['Work From Home Deduction', formatCurrency(result.workFromHomeDeduction)],
    ['Total Deductions', formatCurrency(result.totalDeductions)],
    ['Taxable Income', formatCurrency(result.taxableIncome)],
    ['Gross Tax', formatCurrency(result.tax)],
    ['LITO Offset', formatCurrency(result.lito)],
    ['Medicare Levy', formatCurrency(result.medicare)],
  ];

  if (result.medicareLevySurcharge > 0) {
    tableData.push(['Medicare Levy Surcharge', formatCurrency(result.medicareLevySurcharge)]);
  }

  if (result.hecsRepayment > 0) {
    tableData.push(['HECS-HELP Repayment', formatCurrency(result.hecsRepayment)]);
  }

  tableData.push(
    ['Tax Withheld (PAYG)', formatCurrency(parseFloat(taxWithheld || '0'))],
    [result.refund >= 0 ? 'Tax Refund' : 'Tax Owing', formatCurrency(Math.abs(result.refund))]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tableData.map((row, rowIndex) => (
          <View
            key={row[0]}
            style={[
              styles.row,
              rowIndex === 0 && styles.headerRow,
              rowIndex === tableData.length - 1 && styles.finalRow,
            ]}
          >
            {row.map((cell, cellIndex) => (
              <View
                key={`${row[0]}-${cellIndex}`}
                style={[styles.cell, cellIndex === 0 ? styles.cellLabel : styles.cellValue]}
              >
                <Text
                  style={[
                    styles.cellText,
                    rowIndex === 0 && styles.headerText,
                    rowIndex === tableData.length - 1 && styles.finalText,
                    cellIndex === 1 && rowIndex > 0 && styles.valueText,
                  ]}
                >
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    },
    content: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      minHeight: 48,
    },
    headerRow: {
      backgroundColor: theme.surfaceSecondary,
      borderBottomWidth: 2,
      borderBottomColor: theme.border,
    },
    finalRow: {
      backgroundColor: theme.successLight,
      borderBottomWidth: 0,
    },
    cell: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    cellLabel: {
      flex: 2,
      borderRightWidth: 1,
      borderRightColor: theme.borderLight,
    },
    cellValue: {
      flex: 1,
      alignItems: 'flex-end',
    },
    cellText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    headerText: {
      fontWeight: '700',
      color: theme.text,
    },
    finalText: {
      fontWeight: '700',
      color: theme.success,
    },
    valueText: {
      fontWeight: '600',
      textAlign: 'right',
      color: theme.text,
    },
  });

export default CompactTaxTable;
