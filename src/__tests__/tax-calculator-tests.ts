/**
 * Comprehensive Tax Calculator Test Suite
 * Tests all calculation fields and scenarios for the Australian Tax Return Calculator
 */

// Type definitions for test suite
interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

interface HecsThreshold {
  min: number;
  max: number;
  rate: number;
}

interface MockReactNative {
  Alert: {
    alert: jest.Mock;
    prompt: jest.Mock;
  };
  Dimensions: {
    get: () => { width: number; height: number };
  };
  Platform: {
    OS: string;
  };
  StatusBar: {
    currentHeight: number;
  };
}

// Mock React Native components for testing
const mockReactNative: MockReactNative = {
  Alert: { alert: jest.fn(), prompt: jest.fn() },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
  Platform: { OS: 'ios' },
  StatusBar: { currentHeight: 0 }
};

// Tax calculation functions extracted from App.js for testing
class TaxCalculator {
  private TAX_BRACKETS_2024_25: TaxBracket[];
  private HECS_THRESHOLDS_2024_25: HecsThreshold[];

  constructor() {
    this.TAX_BRACKETS_2024_25 = [
      { min: 0, max: 18200, rate: 0, base: 0 },
      { min: 18200, max: 45000, rate: 0.19, base: 0 },
      { min: 45000, max: 120000, rate: 0.325, base: 5092 },
      { min: 120000, max: 180000, rate: 0.37, base: 29467 },
      { min: 180000, max: Infinity, rate: 0.45, base: 51667 }
    ];

    this.HECS_THRESHOLDS_2024_25 = [
      { min: 51000, max: 59999, rate: 0.01 },
      { min: 60000, max: 67999, rate: 0.02 },
      { min: 68000, max: 71999, rate: 0.025 },
      { min: 72000, max: 78999, rate: 0.03 },
      { min: 79000, max: 88999, rate: 0.035 },
      { min: 89000, max: 97999, rate: 0.04 },
      { min: 98000, max: 109999, rate: 0.045 },
      { min: 110000, max: 124999, rate: 0.05 },
      { min: 125000, max: 139999, rate: 0.055 },
      { min: 140000, max: 151999, rate: 0.06 },
      { min: 152000, max: Infinity, rate: 0.065 }
    ];
  }

  calculateIncomeTax(taxableIncome: number): number {
    let tax = 0;
    if (taxableIncome > 180000) {
      tax = 51667 + (taxableIncome - 180000) * 0.45;
    } else if (taxableIncome > 120000) {
      tax = 29467 + (taxableIncome - 120000) * 0.37;
    } else if (taxableIncome > 45000) {
      tax = (45000 - 18200) * 0.19 + (taxableIncome - 45000) * 0.325;
    } else if (taxableIncome > 18200) {
      tax = (taxableIncome - 18200) * 0.19;
    }
    return tax;
  }

  calculateLITO(taxableIncome) {
    let lito = 0;
    if (taxableIncome <= 37500) {
      lito = 700;
    } else if (taxableIncome <= 45000) {
      lito = 700 - ((taxableIncome - 37500) * 0.05);
    } else if (taxableIncome <= 66667) {
      lito = 325 - ((taxableIncome - 45000) * 0.015);
    }
    return lito;
  }

  calculateMedicareLevy(taxableIncome, dependents = 0, medicareExemption = false) {
    if (medicareExemption) return 0;
    
    const medicareThreshold = dependents > 0 ? 45907 + (dependents * 4216) : 27222;
    let medicare = 0;
    
    if (taxableIncome > medicareThreshold) {
      if (taxableIncome <= medicareThreshold * 1.1) {
        // Medicare levy reduction
        medicare = (taxableIncome * 0.02) * ((taxableIncome - medicareThreshold) / (medicareThreshold * 0.1));
      } else {
        medicare = taxableIncome * 0.02;
      }
    }
    return medicare;
  }

  calculateHECSRepayment(taxableIncome, hasHECSDebt = false) {
    if (!hasHECSDebt) return 0;
    
    const threshold = this.HECS_THRESHOLDS_2024_25.find(t => 
      taxableIncome >= t.min && taxableIncome <= t.max
    );
    return threshold ? taxableIncome * threshold.rate : 0;
  }

  calculateWorkFromHomeDeduction(hours) {
    return parseFloat(hours || '0') * 0.67;
  }

  calculateTotalDeductions(deductions, workFromHomeHours) {
    const manualDeductions = Object.values(deductions).reduce((categorySum, category) => {
      if (typeof category === 'object' && category !== null) {
        return categorySum + Object.values(category).reduce((subSum, val) => {
          return subSum + (parseFloat(val || '0'));
        }, 0);
      }
      return categorySum + (parseFloat(category || '0'));
    }, 0);

    const workFromHomeDeduction = this.calculateWorkFromHomeDeduction(workFromHomeHours);
    return manualDeductions + workFromHomeDeduction;
  }

  calculateCompleteTax(formData) {
    const {
      jobIncomes = [''],
      abnIncome = '',
      taxWithheld = '',
      deductions = {},
      workFromHomeHours = '',
      hecsDebt = false,
      medicareExemption = false,
      dependents = '0',
      hasDependents = false
    } = formData;

    // Calculate total incomes
    const totalTFNIncome = jobIncomes.reduce((sum, income) => sum + parseFloat(income || '0'), 0);
    const abnIncomeNum = parseFloat(abnIncome || '0');
    const totalIncome = totalTFNIncome + abnIncomeNum;

    // Calculate deductions
    const totalDeductions = this.calculateTotalDeductions(deductions, workFromHomeHours);
    const workFromHomeDeduction = this.calculateWorkFromHomeDeduction(workFromHomeHours);
    const totalManualDeductions = totalDeductions - workFromHomeDeduction;

    // Calculate taxable income
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // Calculate tax components
    const tax = this.calculateIncomeTax(taxableIncome);
    const lito = this.calculateLITO(taxableIncome);
    const dependentsNum = hasDependents ? parseInt(dependents || '0') : 0;
    const medicare = this.calculateMedicareLevy(taxableIncome, dependentsNum, medicareExemption);
    const hecsRepayment = this.calculateHECSRepayment(taxableIncome, hecsDebt);

    // Calculate final amounts
    const finalTax = tax - lito + medicare + hecsRepayment;
    const taxWithheldNum = parseFloat(taxWithheld || '0');
    const refund = taxWithheldNum - finalTax;

    return {
      totalTFNIncome,
      abnIncomeNum,
      totalIncome,
      totalManualDeductions,
      workFromHomeDeduction,
      totalDeductions,
      taxableIncome,
      tax,
      lito,
      medicare,
      hecsRepayment,
      finalTax,
      taxWithheldNum,
      refund
    };
  }
}

// Test Suite
describe('Australian Tax Calculator - Comprehensive Tests', () => {
  let calculator;

  beforeEach(() => {
    calculator = new TaxCalculator();
  });

  describe('Income Tax Calculation Tests', () => {
    test('Tax-free threshold (≤$18,200)', () => {
      expect(calculator.calculateIncomeTax(18200)).toBe(0);
      expect(calculator.calculateIncomeTax(15000)).toBe(0);
    });

    test('19% tax bracket ($18,201 - $45,000)', () => {
      expect(calculator.calculateIncomeTax(25000)).toBeCloseTo((25000 - 18200) * 0.19, 2);
      expect(calculator.calculateIncomeTax(45000)).toBeCloseTo((45000 - 18200) * 0.19, 2);
    });

    test('32.5% tax bracket ($45,001 - $120,000)', () => {
      const income = 80000;
      const expectedTax = (45000 - 18200) * 0.19 + (income - 45000) * 0.325;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });

    test('37% tax bracket ($120,001 - $180,000)', () => {
      const income = 150000;
      const expectedTax = 29467 + (income - 120000) * 0.37;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });

    test('45% tax bracket (>$180,000)', () => {
      const income = 200000;
      const expectedTax = 51667 + (income - 180000) * 0.45;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });
  });

  describe('Low Income Tax Offset (LITO) Tests', () => {
    test('Full LITO for income ≤$37,500', () => {
      expect(calculator.calculateLITO(30000)).toBe(700);
      expect(calculator.calculateLITO(37500)).toBe(700);
    });

    test('Reduced LITO for income $37,501 - $45,000', () => {
      const income = 40000;
      const expectedLITO = 700 - ((income - 37500) * 0.05);
      expect(calculator.calculateLITO(income)).toBeCloseTo(expectedLITO, 2);
    });

    test('Further reduced LITO for income $45,001 - $66,667', () => {
      const income = 50000;
      const expectedLITO = 325 - ((income - 45000) * 0.015);
      expect(calculator.calculateLITO(income)).toBeCloseTo(expectedLITO, 2);
    });

    test('No LITO for income >$66,667', () => {
      expect(calculator.calculateLITO(70000)).toBe(0);
      expect(calculator.calculateLITO(100000)).toBe(0);
    });
  });

  describe('Medicare Levy Tests', () => {
    test('No Medicare levy below threshold', () => {
      expect(calculator.calculateMedicareLevy(25000)).toBe(0);
    });

    test('Medicare levy reduction zone', () => {
      const income = 28000;
      const threshold = 27222;
      const expectedLevy = (income * 0.02) * ((income - threshold) / (threshold * 0.1));
      expect(calculator.calculateMedicareLevy(income)).toBeCloseTo(expectedLevy, 2);
    });

    test('Full Medicare levy (2%)', () => {
      const income = 50000;
      expect(calculator.calculateMedicareLevy(income)).toBeCloseTo(income * 0.02, 2);
    });

    test('Medicare exemption', () => {
      expect(calculator.calculateMedicareLevy(50000, 0, true)).toBe(0);
    });

    test('Family threshold with dependents', () => {
      const income = 60000; // Higher income to ensure above family threshold
      const dependents = 2;
      const familyThreshold = 45907 + (dependents * 4216); // = 54339
      expect(calculator.calculateMedicareLevy(income, dependents)).toBeCloseTo(income * 0.02, 2);
    });
  });

  describe('HECS-HELP Repayment Tests', () => {
    test('No HECS repayment below threshold', () => {
      expect(calculator.calculateHECSRepayment(50000, true)).toBe(0);
    });

    test('HECS repayment at various thresholds', () => {
      expect(calculator.calculateHECSRepayment(55000, true)).toBeCloseTo(55000 * 0.01, 2);
      expect(calculator.calculateHECSRepayment(65000, true)).toBeCloseTo(65000 * 0.02, 2);
      expect(calculator.calculateHECSRepayment(75000, true)).toBeCloseTo(75000 * 0.03, 2);
      expect(calculator.calculateHECSRepayment(95000, true)).toBeCloseTo(95000 * 0.04, 2);
      expect(calculator.calculateHECSRepayment(155000, true)).toBeCloseTo(155000 * 0.065, 2);
    });

    test('No HECS repayment when no debt', () => {
      expect(calculator.calculateHECSRepayment(100000, false)).toBe(0);
    });
  });

  describe('Work From Home Deduction Tests', () => {
    test('WFH deduction calculation', () => {
      expect(calculator.calculateWorkFromHomeDeduction('100')).toBe(67);
      expect(calculator.calculateWorkFromHomeDeduction('200')).toBe(134);
      expect(calculator.calculateWorkFromHomeDeduction('0')).toBe(0);
      expect(calculator.calculateWorkFromHomeDeduction('')).toBe(0);
    });
  });

  describe('Deduction Calculation Tests', () => {
    test('Manual deductions calculation', () => {
      const deductions = {
        workRelated: {
          travel: '500',
          equipment: '300',
          uniforms: '200',
          memberships: '100',
          other: '150'
        },
        selfEducation: {
          courseFees: '2000',
          textbooks: '300',
          conferences: '500',
          certifications: '400',
          other: '100'
        },
        donations: {
          charitable: '500',
          disasterRelief: '200',
          religious: '300',
          other: '100'
        },
        other: {
          investment: '800',
          taxAgent: '350',
          incomeProtection: '600',
          bankFees: '50',
          other: '200'
        }
      };

      const expectedTotal = 1250 + 3300 + 1100 + 2000 + 67; // Including WFH
      expect(calculator.calculateTotalDeductions(deductions, '100')).toBe(expectedTotal);
    });
  });

  describe('Complete Tax Calculation Integration Tests', () => {
    test('Low income scenario with basic deductions', () => {
      const formData = {
        jobIncomes: ['35000'],
        abnIncome: '',
        taxWithheld: '3500',
        deductions: {
          workRelated: { travel: '500', equipment: '', uniforms: '', memberships: '', other: '' },
          selfEducation: { courseFees: '', textbooks: '', conferences: '', certifications: '', other: '' },
          donations: { charitable: '200', disasterRelief: '', religious: '', other: '' },
          other: { investment: '', taxAgent: '300', incomeProtection: '', bankFees: '', other: '' }
        },
        workFromHomeHours: '50',
        hecsDebt: false,
        medicareExemption: false,
        dependents: '0',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);

      expect(result.totalTFNIncome).toBe(35000);
      expect(result.abnIncomeNum).toBe(0);
      expect(result.totalIncome).toBe(35000);
      expect(result.workFromHomeDeduction).toBe(33.5);
      expect(result.totalManualDeductions).toBe(1000);
      expect(result.totalDeductions).toBe(1033.5);
      expect(result.taxableIncome).toBe(33966.5);
      expect(result.lito).toBe(700);
      expect(result.medicare).toBeCloseTo(679.33, 2); // 2% of taxable income
      expect(result.hecsRepayment).toBe(0);
      // Verify the calculation components are correct
      expect(result.tax).toBeCloseTo(2995.64, 1); // Tax on taxable income
      expect(result.finalTax).toBeCloseTo(2974.97, 1); // Tax - LITO + Medicare
    });

    test('High income scenario with comprehensive deductions', () => {
      const formData = {
        jobIncomes: ['120000', '30000'],
        abnIncome: '25000',
        taxWithheld: '45000',
        deductions: {
          workRelated: { travel: '2000', equipment: '1500', uniforms: '500', memberships: '300', other: '700' },
          selfEducation: { courseFees: '3000', textbooks: '500', conferences: '1000', certifications: '800', other: '200' },
          donations: { charitable: '1000', disasterRelief: '500', religious: '300', other: '200' },
          other: { investment: '2500', taxAgent: '500', incomeProtection: '1200', bankFees: '100', other: '300' }
        },
        workFromHomeHours: '300',
        hecsDebt: true,
        medicareExemption: false,
        dependents: '2',
        hasDependents: true
      };

      const result = calculator.calculateCompleteTax(formData);

      expect(result.totalTFNIncome).toBe(150000);
      expect(result.abnIncomeNum).toBe(25000);
      expect(result.totalIncome).toBe(175000);
      expect(result.workFromHomeDeduction).toBe(201);
      expect(result.totalManualDeductions).toBe(17100);
      expect(result.totalDeductions).toBe(17301);
      expect(result.taxableIncome).toBe(157699);
      expect(result.tax).toBeGreaterThan(0);
      expect(result.medicare).toBeGreaterThan(0);
      expect(result.hecsRepayment).toBeGreaterThan(0);
    });

    test('Edge case: Zero income', () => {
      const formData = {
        jobIncomes: [''],
        abnIncome: '',
        taxWithheld: '0',
        deductions: {},
        workFromHomeHours: '',
        hecsDebt: false,
        medicareExemption: false,
        dependents: '0',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);

      expect(result.totalIncome).toBe(0);
      expect(result.taxableIncome).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.medicare).toBe(0);
      expect(result.lito).toBe(700); // LITO still applies at zero income
      expect(result.refund).toBe(700); // Refund equals LITO when no tax withheld
    });

    test('Edge case: Very high income with maximum deductions', () => {
      const formData = {
        jobIncomes: ['500000'],
        abnIncome: '100000',
        taxWithheld: '200000',
        deductions: {
          workRelated: { travel: '10000', equipment: '5000', uniforms: '2000', memberships: '1000', other: '2000' },
          selfEducation: { courseFees: '15000', textbooks: '2000', conferences: '5000', certifications: '3000', other: '1000' },
          donations: { charitable: '25000', disasterRelief: '5000', religious: '3000', other: '2000' },
          other: { investment: '50000', taxAgent: '2000', incomeProtection: '5000', bankFees: '500', other: '5000' }
        },
        workFromHomeHours: '2000',
        hecsDebt: true,
        medicareExemption: false,
        dependents: '3',
        hasDependents: true
      };

      const result = calculator.calculateCompleteTax(formData);

      expect(result.totalIncome).toBe(600000);
      expect(result.workFromHomeDeduction).toBe(1340);
      expect(result.tax).toBeGreaterThan(100000);
      expect(result.hecsRepayment).toBeGreaterThan(0);
    });

    test('Medicare exemption scenario', () => {
      const formData = {
        jobIncomes: ['80000'],
        abnIncome: '',
        taxWithheld: '18000',
        deductions: {},
        workFromHomeHours: '',
        hecsDebt: false,
        medicareExemption: true,
        dependents: '0',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);

      expect(result.medicare).toBe(0);
    });
  });

  describe('Field Validation and Edge Cases', () => {
    test('Empty string inputs handled correctly', () => {
      const formData = {
        jobIncomes: ['', '', ''],
        abnIncome: '',
        taxWithheld: '',
        deductions: {
          workRelated: { travel: '', equipment: '', uniforms: '', memberships: '', other: '' }
        },
        workFromHomeHours: '',
        hecsDebt: false,
        medicareExemption: false,
        dependents: '',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);
      expect(result.totalIncome).toBe(0);
      expect(result.totalDeductions).toBe(0);
    });

    test('Multiple job incomes calculation', () => {
      const formData = {
        jobIncomes: ['50000', '30000', '20000'],
        abnIncome: '',
        taxWithheld: '25000',
        deductions: {},
        workFromHomeHours: '',
        hecsDebt: false,
        medicareExemption: false,
        dependents: '0',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);
      expect(result.totalTFNIncome).toBe(100000);
    });

    test('ABN income only scenario', () => {
      const formData = {
        jobIncomes: [''],
        abnIncome: '75000',
        taxWithheld: '0',
        deductions: {},
        workFromHomeHours: '',
        hecsDebt: false,
        medicareExemption: false,
        dependents: '0',
        hasDependents: false
      };

      const result = calculator.calculateCompleteTax(formData);
      expect(result.totalTFNIncome).toBe(0);
      expect(result.abnIncomeNum).toBe(75000);
      expect(result.totalIncome).toBe(75000);
    });
  });

  describe('Boundary Value Tests', () => {
    test('Tax bracket boundaries', () => {
      // Test exactly at bracket boundaries
      expect(calculator.calculateIncomeTax(18200)).toBe(0);
      expect(calculator.calculateIncomeTax(18201)).toBeCloseTo(0.19, 2);
      expect(calculator.calculateIncomeTax(45000)).toBeCloseTo((45000 - 18200) * 0.19, 2);
      expect(calculator.calculateIncomeTax(45001)).toBeCloseTo((45000 - 18200) * 0.19 + 0.325, 2);
    });

    test('Medicare levy thresholds', () => {
      expect(calculator.calculateMedicareLevy(27222)).toBe(0);
      expect(calculator.calculateMedicareLevy(27223)).toBeGreaterThan(0);
    });

    test('LITO boundaries', () => {
      expect(calculator.calculateLITO(37500)).toBe(700);
      expect(calculator.calculateLITO(37501)).toBeLessThan(700);
      expect(calculator.calculateLITO(66666)).toBeGreaterThan(0);
      expect(calculator.calculateLITO(66668)).toBe(0);
    });
  });
});
