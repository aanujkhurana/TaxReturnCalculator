import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [jobIncomes, setJobIncomes] = useState(['']);
  const [taxWithheld, setTaxWithheld] = useState('');
  const [deductions, setDeductions] = useState('');
  const [workFromHomeHours, setWorkFromHomeHours] = useState('');
  const [abnIncome, setAbnIncome] = useState('');
  const [hecsDebt, setHecsDebt] = useState(false);
  const [result, setResult] = useState(null);

  const updateJobIncome = (index, value) => {
    const newIncomes = [...jobIncomes];
    newIncomes[index] = value;
    setJobIncomes(newIncomes);
  };

  const addJobIncomeField = () => {
    setJobIncomes([...jobIncomes, '']);
  };

  const estimateTax = () => {
    const parsedJobIncomes = jobIncomes.map((val) => parseFloat(val || '0'));
    const totalTFNIncome = parsedJobIncomes.reduce((sum, curr) => sum + (isNaN(curr) ? 0 : curr), 0);
    const abnIncomeNum = parseFloat(abnIncome || '0');
    const taxWithheldNum = parseFloat(taxWithheld);
    const deductionsNum = parseFloat(deductions || '0');
    const wfhHours = parseFloat(workFromHomeHours || '0');
    if (isNaN(taxWithheldNum) || isNaN(deductionsNum) || isNaN(abnIncomeNum)) {
      setResult(null);
      return;
    }

    const workFromHomeDeduction = wfhHours * 0.67;
    const totalDeductions = deductionsNum + workFromHomeDeduction;
    const totalIncome = totalTFNIncome + abnIncomeNum;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    let tax = 0;
    if (taxableIncome > 135000) {
      tax = (45000 - 18200) * 0.16 + (135000 - 45000) * 0.30 + (taxableIncome - 135000) * 0.37;
    } else if (taxableIncome > 45000) {
      tax = (45000 - 18200) * 0.16 + (taxableIncome - 45000) * 0.30;
    } else if (taxableIncome > 18200) {
      tax = (taxableIncome - 18200) * 0.16;
    }

    let lito = 0;
    if (taxableIncome <= 37500) {
      lito = 700;
    } else if (taxableIncome <= 66667) {
      lito = 700 - ((taxableIncome - 37500) * 0.05);
    }

    const medicare = taxableIncome < 24276 ? 0 : taxableIncome * 0.02;

    let hecsRepayment = 0;
    if (hecsDebt && taxableIncome >= 51000) {
      hecsRepayment = taxableIncome * 0.01;
    }

    const finalTax = tax - lito + medicare + hecsRepayment;
    const refund = taxWithheldNum - finalTax;

    setResult({ totalTFNIncome, abnIncomeNum, workFromHomeDeduction, taxableIncome, tax, lito, medicare, hecsRepayment, finalTax, refund });
  };

  const exportCSV = async () => {
    if (!result) return;
    const headers = [
      'TFN Income', 'ABN Income', 'WFH Deduction', 'Taxable Income', 'Tax', 'LITO', 'Medicare', 'HECS', 'Final Tax', 'Refund'
    ];
    const row = [
      result.totalTFNIncome, result.abnIncomeNum, result.workFromHomeDeduction,
      result.taxableIncome, result.tax, result.lito, result.medicare, result.hecsRepayment,
      result.finalTax, result.refund
    ];
    const csv = `${headers.join(',')}\n${row.join(',')}`;
    const path = FileSystem.documentDirectory + 'tax_summary.csv';
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(path);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>TaxMate AU - 2024-25</Text>

      <Text style={styles.label}>TFN Job Incomes ($)</Text>
      {jobIncomes.map((val, idx) => (
        <TextInput
          key={idx}
          keyboardType="numeric"
          value={val}
          onChangeText={(v) => updateJobIncome(idx, v)}
          placeholder={`Job ${idx + 1}`}
          style={styles.input}
        />
      ))}
      <Button title="Add Another Job" onPress={addJobIncomeField} />

      <Text style={styles.label}>ABN Income ($)</Text>
      <TextInput
        keyboardType="numeric"
        value={abnIncome}
        onChangeText={setAbnIncome}
        placeholder="e.g., 10000"
        style={styles.input}
      />

      <Text style={styles.label}>Tax Withheld ($)</Text>
      <TextInput
        keyboardType="numeric"
        value={taxWithheld}
        onChangeText={setTaxWithheld}
        placeholder="e.g., 9500"
        style={styles.input}
      />

      <Text style={styles.label}>Deductions ($)</Text>
      <TextInput
        keyboardType="numeric"
        value={deductions}
        onChangeText={setDeductions}
        placeholder="e.g., 1500"
        style={styles.input}
      />

      <Text style={styles.label}>Work From Home Hours</Text>
      <TextInput
        keyboardType="numeric"
        value={workFromHomeHours}
        onChangeText={setWorkFromHomeHours}
        placeholder="e.g., 400"
        style={styles.input}
      />

      <View style={{ marginBottom: 16 }}>
        <Button
          title={hecsDebt ? '✔️ HECS/HELP Debt Included' : 'Include HECS/HELP Debt'}
          onPress={() => setHecsDebt(!hecsDebt)}
        />
      </View>

      <Button title="Estimate Refund" onPress={estimateTax} />

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text>Total TFN Income: ${result.totalTFNIncome.toFixed(2)}</Text>
          <Text>ABN Income: ${result.abnIncomeNum.toFixed(2)}</Text>
          <Text>Work From Home Deduction: -${result.workFromHomeDeduction.toFixed(2)}</Text>
          <Text>Taxable Income: ${result.taxableIncome.toFixed(2)}</Text>
          <Text>Gross Tax: ${result.tax.toFixed(2)}</Text>
          <Text>LITO Offset: -${result.lito.toFixed(2)}</Text>
          <Text>Medicare Levy: +${result.medicare.toFixed(2)}</Text>
          <Text>HECS Repayment: +${result.hecsRepayment.toFixed(2)}</Text>
          <Text>Total Tax Owed: ${result.finalTax.toFixed(2)}</Text>
          <Text style={styles.resultFinal}>
            {result.refund >= 0 ? `Estimated Refund: $${result.refund.toFixed(2)}` : `Owing ATO: $${Math.abs(result.refund).toFixed(2)}`}
          </Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Export CSV" onPress={exportCSV} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  resultContainer: {
    marginTop: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultFinal: {
    marginTop: 8,
    fontWeight: '600',
  },
});
