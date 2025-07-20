import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'savedCalculations';

// Generate a unique ID for calculations
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Save a new calculation
export const saveCalculation = async (calculationData, customName = null) => {
  try {
    const existingCalculations = await getCalculations();
    
    const newCalculation = {
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
export const getCalculations = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const calculations = JSON.parse(saved);
      // Sort by date (newest first)
      return calculations.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
    }
    return [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
};

// Get a specific calculation by ID
export const getCalculationById = async (id) => {
  try {
    const calculations = await getCalculations();
    return calculations.find(calc => calc.id === id);
  } catch (error) {
    console.error('Error loading calculation:', error);
    return null;
  }
};

// Delete a calculation
export const deleteCalculation = async (id) => {
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
export const updateCalculationName = async (id, newName) => {
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
export const clearAllCalculations = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing calculations:', error);
    throw new Error('Failed to clear calculations');
  }
};

// Get calculation statistics
export const getCalculationStats = async () => {
  try {
    const calculations = await getCalculations();
    
    if (calculations.length === 0) {
      return {
        totalCalculations: 0,
        totalRefunds: 0,
        totalOwed: 0,
        averageRefund: 0,
      };
    }

    const refunds = calculations
      .map(calc => calc.result?.refund || 0)
      .filter(refund => refund > 0);
    
    const owed = calculations
      .map(calc => calc.result?.refund || 0)
      .filter(refund => refund < 0)
      .map(amount => Math.abs(amount));

    return {
      totalCalculations: calculations.length,
      totalRefunds: refunds.reduce((sum, refund) => sum + refund, 0),
      totalOwed: owed.reduce((sum, amount) => sum + amount, 0),
      averageRefund: refunds.length > 0 ? refunds.reduce((sum, refund) => sum + refund, 0) / refunds.length : 0,
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
