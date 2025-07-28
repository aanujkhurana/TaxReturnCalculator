import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/appConstants';

// Type definitions for storage service
export interface SavedCalculation {
  id: string;
  name: string | null;
  savedDate: string;
  formData: {
    jobIncomes?: any[];
    taxWithheld?: string;
    deductions?: { [key: string]: any };
    workFromHomeHours?: string;
    abnIncome?: string;
    hecsDebt?: boolean;
    medicareExemption?: boolean;
    dependents?: string;
  };
  result: any;
}

export interface CalculationStats {
  totalCalculations: number;
  totalRefunds: number;
  totalOwed: number;
  averageRefund: number;
  refundCount: number;
  owedCount: number;
}

const STORAGE_KEY = STORAGE_KEYS.SAVED_CALCULATIONS;

// Generate a unique ID for calculations
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Save a new calculation
export const saveCalculation = async (calculationData: any, customName: string | null = null): Promise<string> => {
  try {
    const existingCalculations = await getCalculations();

    const newCalculation: SavedCalculation = {
      id: generateId(),
      name: customName,
      savedDate: new Date().toISOString(),
      formData: {
        jobIncomes: calculationData.jobIncomes,
        taxWithheld: calculationData.taxWithheld,
        deductions: calculationData.deductions,
        workFromHomeHours: calculationData.workFromHomeHours,
        abnIncome: calculationData.abnIncome,
        hecsDebt: calculationData.hecsDebt,
        medicareExemption: calculationData.medicareExemption,
        dependents: calculationData.dependents,
      },
      result: calculationData.result,
    };

    const updatedCalculations = [newCalculation, ...existingCalculations];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalculations));

    return newCalculation.id;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw new Error('Failed to save calculation');
  }
};

// Get all saved calculations
export const getCalculations = async (): Promise<SavedCalculation[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const calculations: SavedCalculation[] = JSON.parse(saved);
      // Sort by date (newest first)
      return calculations.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
    }
    return [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
};

// Get a specific calculation by ID
export const getCalculationById = async (id: string): Promise<SavedCalculation | null> => {
  try {
    const calculations = await getCalculations();
    return calculations.find(calc => calc.id === id) || null;
  } catch (error) {
    console.error('Error loading calculation:', error);
    return null;
  }
};

// Delete a calculation
export const deleteCalculation = async (id: string): Promise<boolean> => {
  try {
    const calculations = await getCalculations();
    const updatedCalculations = calculations.filter(calc => calc.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalculations));
    return true;
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw new Error('Failed to delete calculation');
  }
};

// Update a calculation's name
export const updateCalculationName = async (id: string, newName: string): Promise<boolean> => {
  try {
    const calculations = await getCalculations();
    const updatedCalculations = calculations.map(calc =>
      calc.id === id ? { ...calc, name: newName } : calc
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalculations));
    return true;
  } catch (error) {
    console.error('Error updating calculation name:', error);
    throw new Error('Failed to update calculation name');
  }
};

// Clear all saved calculations (for debugging/reset purposes)
export const clearAllCalculations = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing calculations:', error);
    throw new Error('Failed to clear calculations');
  }
};

// Get calculation statistics
export const getCalculationStats = async (): Promise<CalculationStats> => {
  try {
    const calculations = await getCalculations();

    if (calculations.length === 0) {
      return {
        totalCalculations: 0,
        totalRefunds: 0,
        totalOwed: 0,
        averageRefund: 0,
        refundCount: 0,
        owedCount: 0,
      };
    }

    const refunds = calculations
      .map(calc => calc.result?.refund || 0)
      .filter((refund: number) => refund > 0);

    const owed = calculations
      .map(calc => calc.result?.refund || 0)
      .filter((refund: number) => refund < 0)
      .map((amount: number) => Math.abs(amount));

    return {
      totalCalculations: calculations.length,
      totalRefunds: refunds.reduce((sum: number, refund: number) => sum + refund, 0),
      totalOwed: owed.reduce((sum: number, amount: number) => sum + amount, 0),
      averageRefund: refunds.length > 0 ? refunds.reduce((sum: number, refund: number) => sum + refund, 0) / refunds.length : 0,
      refundCount: refunds.length,
      owedCount: owed.length,
    };
  } catch (error) {
    console.error('Error getting calculation stats:', error);
    return {
      totalCalculations: 0,
      totalRefunds: 0,
      totalOwed: 0,
      averageRefund: 0,
      refundCount: 0,
      owedCount: 0,
    };
  }
};
