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

const {
  ACTIVE_FINANCIAL_YEAR,
  ACTIVE_TAX_YEAR_CONFIG,
  TAX_SOURCE_AUDIT_NOTES
} = require('../constants/taxConstants.ts');

const toSnapshot = (value) => JSON.stringify(value, null, 2);

// Tax calculation functions extracted from App.js for testing
class TaxCalculator {
  private TAX_BRACKETS_2025_26: TaxBracket[];
  private PAYG_SCALE_2_WEEKLY_COEFFICIENTS;

  constructor() {
    this.TAX_BRACKETS_2025_26 = [
      { min: 0, max: 18200, rate: 0, base: 0 },
      { min: 18200, max: 45000, rate: 0.16, base: 0 },
      { min: 45000, max: 135000, rate: 0.30, base: 4288 },
      { min: 135000, max: 190000, rate: 0.37, base: 31288 },
      { min: 190000, max: Infinity, rate: 0.45, base: 51638 }
    ];

    this.PAYG_SCALE_2_WEEKLY_COEFFICIENTS = [
      { lessThan: 361, a: 0, b: 0 },
      { lessThan: 500, a: 0.1600, b: 57.8462 },
      { lessThan: 625, a: 0.2600, b: 107.8462 },
      { lessThan: 721, a: 0.1800, b: 57.8462 },
      { lessThan: 865, a: 0.1890, b: 64.3365 },
      { lessThan: 1282, a: 0.3227, b: 180.0385 },
      { lessThan: 2596, a: 0.3200, b: 176.5769 },
      { lessThan: 3653, a: 0.3900, b: 358.3077 },
      { lessThan: Infinity, a: 0.4700, b: 650.6154 }
    ];
  }

  calculateIncomeTax(taxableIncome: number): number {
    let tax = 0;
    if (taxableIncome > 190000) {
      tax = 51638 + (taxableIncome - 190000) * 0.45;
    } else if (taxableIncome > 135000) {
      tax = 31288 + (taxableIncome - 135000) * 0.37;
    } else if (taxableIncome > 45000) {
      tax = 4288 + (taxableIncome - 45000) * 0.30;
    } else if (taxableIncome > 18200) {
      tax = (taxableIncome - 18200) * 0.16;
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
      lito = Math.max(0, 325 - ((taxableIncome - 45000) * 0.015));
    }
    return lito;
  }

  calculateMedicareLevy(taxableIncome, dependents = 0, medicareExemption = false, hasSpouse = false, spouseIncome = 0) {
    if (medicareExemption) return 0;
    
    const useFamilyThreshold = hasSpouse || dependents > 0;
    const medicareThreshold = useFamilyThreshold ? 45907 + (dependents * 4216) : 27222;
    const thresholdIncome = useFamilyThreshold ? taxableIncome + spouseIncome : taxableIncome;
    if (thresholdIncome <= medicareThreshold) return 0;

    return Math.min((thresholdIncome - medicareThreshold) * 0.1, taxableIncome * 0.02);
  }

  calculateHECSRepayment(taxableIncome, hasHECSDebt = false) {
    if (!hasHECSDebt) return 0;
    
    if (taxableIncome <= 67000) return 0;
    if (taxableIncome <= 125000) return (taxableIncome - 67000) * 0.15;
    if (taxableIncome <= 179285) return 8700 + ((taxableIncome - 125000) * 0.17);
    return taxableIncome * 0.10;
  }

  calculateMedicareLevySurcharge(taxableIncome, familyIncome, hasPrivateHospitalCover = false, hasSpouse = false, dependents = 0) {
    if (hasPrivateHospitalCover || taxableIncome <= 0) return 0;

    const isFamily = hasSpouse || dependents > 0;
    const familyDependentIncrease = isFamily ? Math.max(0, dependents - 1) * 1500 : 0;
    const surchargeIncome = isFamily ? familyIncome : taxableIncome;
    const tiers = isFamily
      ? [
          { min: 202001 + familyDependentIncrease, max: 236000 + familyDependentIncrease, rate: 0.01 },
          { min: 236001 + familyDependentIncrease, max: 316000 + familyDependentIncrease, rate: 0.0125 },
          { min: 316001 + familyDependentIncrease, max: Infinity, rate: 0.015 }
        ]
      : [
          { min: 101001, max: 118000, rate: 0.01 },
          { min: 118001, max: 158000, rate: 0.0125 },
          { min: 158001, max: Infinity, rate: 0.015 }
        ];
    const tier = tiers.find(t => surchargeIncome >= t.min && surchargeIncome <= t.max);
    return tier ? taxableIncome * tier.rate : 0;
  }

  calculateWorkFromHomeDeduction(hours) {
    return parseFloat(hours || '0') * 0.70;
  }

  calculatePaygWithholdingEstimate(annualIncome) {
    if (annualIncome <= 0) return 0;

    const x = Math.floor(annualIncome / 52) + 0.99;
    const coefficient = this.PAYG_SCALE_2_WEEKLY_COEFFICIENTS.find(({ lessThan }) => x < lessThan);
    return Math.round(Math.max(0, Math.round((coefficient.a * x) - coefficient.b)) * 52);
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
      reportableSuper = '',
      reportableFringeBenefits = '',
      netInvestmentLosses = '',
      exemptForeignIncome = '',
      medicareExemption = false,
      hasSpouse = false,
      spouseIncome = '',
      hasPrivateHospitalCover = false,
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
    const spouseIncomeNum = hasSpouse ? (parseFloat(spouseIncome || '0') || 0) : 0;
    const medicare = this.calculateMedicareLevy(taxableIncome, dependentsNum, medicareExemption, hasSpouse, spouseIncomeNum);
    const familyIncomeForMedicare = taxableIncome + spouseIncomeNum;
    const medicareLevySurcharge = this.calculateMedicareLevySurcharge(taxableIncome, familyIncomeForMedicare, hasPrivateHospitalCover, hasSpouse, dependentsNum);
    const studyLoanRepaymentIncome = taxableIncome +
      (parseFloat(reportableSuper || '0') || 0) +
      (parseFloat(reportableFringeBenefits || '0') || 0) +
      (parseFloat(netInvestmentLosses || '0') || 0) +
      (parseFloat(exemptForeignIncome || '0') || 0);
    const hecsRepayment = this.calculateHECSRepayment(studyLoanRepaymentIncome, hecsDebt);

    // Calculate final amounts
    const finalTax = Math.max(0, tax - lito + medicare + medicareLevySurcharge + hecsRepayment);
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
      studyLoanRepaymentIncome,
      tax,
      lito,
      medicare,
      medicareLevySurcharge,
      spouseIncome: spouseIncomeNum,
      familyIncomeForMedicare,
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

    test('16% tax bracket ($18,201 - $45,000)', () => {
      expect(calculator.calculateIncomeTax(25000)).toBeCloseTo((25000 - 18200) * 0.16, 2);
      expect(calculator.calculateIncomeTax(45000)).toBeCloseTo((45000 - 18200) * 0.16, 2);
    });

    test('30% tax bracket ($45,001 - $135,000)', () => {
      const income = 80000;
      const expectedTax = 4288 + (income - 45000) * 0.30;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });

    test('37% tax bracket ($135,001 - $190,000)', () => {
      const income = 150000;
      const expectedTax = 31288 + (income - 135000) * 0.37;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });

    test('45% tax bracket (>$190,000)', () => {
      const income = 200000;
      const expectedTax = 51638 + (income - 190000) * 0.45;
      expect(calculator.calculateIncomeTax(income)).toBeCloseTo(expectedTax, 2);
    });
  });

  describe('Active Tax Year Snapshot Tests', () => {
    test('Active 2025-26 config has source notes for each tax constant group', () => {
      expect(ACTIVE_FINANCIAL_YEAR).toBe('2025-26');

      const sourceNoteIds = ACTIVE_TAX_YEAR_CONFIG.sourceNoteIds;
      const missingSourceNotes = sourceNoteIds.filter(id => !TAX_SOURCE_AUDIT_NOTES[id]);
      expect(missingSourceNotes.join(',')).toBe('');

      const affectedConstants = sourceNoteIds
        .flatMap(id => TAX_SOURCE_AUDIT_NOTES[id].affectedConstants)
        .join('|');
      [
        'FY2025_26_TAX_BRACKETS',
        'FY2025_26_HECS_THRESHOLDS',
        'FY2025_26_MEDICARE_LEVY_THRESHOLDS',
        'FY2025_26_MEDICARE_LEVY_SURCHARGE',
        'FY2025_26_LOW_INCOME_TAX_OFFSET',
        'FY2025_26_WORK_FROM_HOME',
        'FY2025_26_STANDARD_DEDUCTIONS',
        'PAYG_SCALE_2_WEEKLY_COEFFICIENTS'
      ].forEach(constantName => {
        if (!affectedConstants.includes(constantName)) {
          throw new Error(`Missing source coverage for ${constantName}`);
        }
      });
    });

    test('Active 2025-26 tax-year config constants snapshot', () => {
      const snapshot = {
        configVersion: ACTIVE_TAX_YEAR_CONFIG.configVersion,
        financialYear: ACTIVE_TAX_YEAR_CONFIG.financialYear,
        taxFreeThreshold: ACTIVE_TAX_YEAR_CONFIG.taxFreeThreshold,
        taxBrackets: ACTIVE_TAX_YEAR_CONFIG.taxBrackets,
        lowIncomeTaxOffset: ACTIVE_TAX_YEAR_CONFIG.lowIncomeTaxOffset,
        helpRepaymentThresholds: ACTIVE_TAX_YEAR_CONFIG.helpRepaymentThresholds,
        medicareLevyThresholds: ACTIVE_TAX_YEAR_CONFIG.medicareLevyThresholds,
        medicareLevySurcharge: ACTIVE_TAX_YEAR_CONFIG.medicareLevySurcharge,
        workFromHome: ACTIVE_TAX_YEAR_CONFIG.workFromHome,
        standardDeductions: ACTIVE_TAX_YEAR_CONFIG.standardDeductions
      };

      expect(toSnapshot(snapshot)).toBe(`{
  "configVersion": "2025-26.1",
  "financialYear": "2025-26",
  "taxFreeThreshold": 18200,
  "taxBrackets": [
    {
      "min": 0,
      "max": 18200,
      "rate": 0,
      "base": 0
    },
    {
      "min": 18200,
      "max": 45000,
      "rate": 0.16,
      "base": 0
    },
    {
      "min": 45000,
      "max": 135000,
      "rate": 0.3,
      "base": 4288
    },
    {
      "min": 135000,
      "max": 190000,
      "rate": 0.37,
      "base": 31288
    },
    {
      "min": 190000,
      "max": null,
      "rate": 0.45,
      "base": 51638
    }
  ],
  "lowIncomeTaxOffset": {
    "maxOffset": 700,
    "fullOffsetLimit": 37500,
    "firstPhaseOutEnd": 45000,
    "firstPhaseOutRate": 0.05,
    "secondPhaseOutEnd": 66667,
    "secondPhaseOutBase": 325,
    "secondPhaseOutRate": 0.015
  },
  "helpRepaymentThresholds": [
    {
      "min": 0,
      "max": 67000,
      "rate": 0,
      "base": 0
    },
    {
      "min": 67000,
      "max": 125000,
      "rate": 0.15,
      "base": 0
    },
    {
      "min": 125000,
      "max": 179285,
      "rate": 0.17,
      "base": 8700
    },
    {
      "min": 179286,
      "max": null,
      "rate": 0.1,
      "base": 0,
      "rateAppliesToTotalIncome": true
    }
  ],
  "medicareLevyThresholds": {
    "singleLower": 27222,
    "singleUpper": 34027,
    "familyLower": 45907,
    "familyUpper": 57383,
    "dependentChildLowerIncrease": 4216,
    "dependentChildUpperIncrease": 5270,
    "phaseInRate": 0.1,
    "rate": 0.02
  },
  "medicareLevySurcharge": {
    "single": {
      "threshold": 101000,
      "tiers": [
        {
          "min": 101001,
          "max": 118000,
          "rate": 0.01
        },
        {
          "min": 118001,
          "max": 158000,
          "rate": 0.0125
        },
        {
          "min": 158001,
          "max": null,
          "rate": 0.015
        }
      ]
    },
    "family": {
      "threshold": 202000,
      "tiers": [
        {
          "min": 202001,
          "max": 236000,
          "rate": 0.01
        },
        {
          "min": 236001,
          "max": 316000,
          "rate": 0.0125
        },
        {
          "min": 316001,
          "max": null,
          "rate": 0.015
        }
      ]
    }
  },
  "workFromHome": {
    "shortcutRate": 0.7,
    "maxShortcutClaim": null
  },
  "standardDeductions": {
    "workClothes": 150,
    "workFromHomeBasic": 300,
    "carExpenseKmRate": 0.88
  }
}`);
    });

    test('Major calculation outputs snapshot', () => {
      const snapshot = {
        residentIncomeTax: [
          { taxableIncome: 18200, tax: calculator.calculateIncomeTax(18200) },
          { taxableIncome: 45000, tax: calculator.calculateIncomeTax(45000) },
          { taxableIncome: 80000, tax: calculator.calculateIncomeTax(80000) },
          { taxableIncome: 135000, tax: calculator.calculateIncomeTax(135000) },
          { taxableIncome: 190000, tax: calculator.calculateIncomeTax(190000) },
          { taxableIncome: 220000, tax: calculator.calculateIncomeTax(220000) }
        ],
        lowIncomeTaxOffset: [
          { taxableIncome: 37500, offset: calculator.calculateLITO(37500) },
          { taxableIncome: 45000, offset: calculator.calculateLITO(45000) },
          { taxableIncome: 66667, offset: calculator.calculateLITO(66667) }
        ],
        medicareLevy: [
          { taxableIncome: 27222, levy: calculator.calculateMedicareLevy(27222) },
          { taxableIncome: 30000, levy: calculator.calculateMedicareLevy(30000) },
          { taxableIncome: 60000, levy: calculator.calculateMedicareLevy(60000) },
          { taxableIncome: 30000, spouseIncome: 20000, levy: calculator.calculateMedicareLevy(30000, 0, false, true, 20000) }
        ],
        helpRepayment: [
          { repaymentIncome: 67000, repayment: calculator.calculateHECSRepayment(67000, true) },
          { repaymentIncome: 75000, repayment: calculator.calculateHECSRepayment(75000, true) },
          { repaymentIncome: 127064, repayment: calculator.calculateHECSRepayment(127064, true) },
          { repaymentIncome: 190000, repayment: calculator.calculateHECSRepayment(190000, true) }
        ],
        medicareLevySurcharge: [
          { taxableIncome: 100000, familyIncome: 100000, surcharge: calculator.calculateMedicareLevySurcharge(100000, 100000, false, false, 0) },
          { taxableIncome: 102000, familyIncome: 102000, surcharge: calculator.calculateMedicareLevySurcharge(102000, 102000, false, false, 0) },
          { taxableIncome: 120000, familyIncome: 220000, surcharge: calculator.calculateMedicareLevySurcharge(120000, 220000, false, true, 0) },
          { taxableIncome: 120000, familyIncome: 220000, hasCover: true, surcharge: calculator.calculateMedicareLevySurcharge(120000, 220000, true, true, 0) }
        ],
        paygWithholding: [
          { employmentIncome: 75000, withholding: calculator.calculatePaygWithholdingEstimate(75000) },
          { employmentIncome: 150000, withholding: calculator.calculatePaygWithholdingEstimate(150000) }
        ]
      };

      expect(toSnapshot(snapshot)).toBe(`{
  "residentIncomeTax": [
    {
      "taxableIncome": 18200,
      "tax": 0
    },
    {
      "taxableIncome": 45000,
      "tax": 4288
    },
    {
      "taxableIncome": 80000,
      "tax": 14788
    },
    {
      "taxableIncome": 135000,
      "tax": 31288
    },
    {
      "taxableIncome": 190000,
      "tax": 51638
    },
    {
      "taxableIncome": 220000,
      "tax": 65138
    }
  ],
  "lowIncomeTaxOffset": [
    {
      "taxableIncome": 37500,
      "offset": 700
    },
    {
      "taxableIncome": 45000,
      "offset": 325
    },
    {
      "taxableIncome": 66667,
      "offset": 0
    }
  ],
  "medicareLevy": [
    {
      "taxableIncome": 27222,
      "levy": 0
    },
    {
      "taxableIncome": 30000,
      "levy": 277.8
    },
    {
      "taxableIncome": 60000,
      "levy": 1200
    },
    {
      "taxableIncome": 30000,
      "spouseIncome": 20000,
      "levy": 409.3
    }
  ],
  "helpRepayment": [
    {
      "repaymentIncome": 67000,
      "repayment": 0
    },
    {
      "repaymentIncome": 75000,
      "repayment": 1200
    },
    {
      "repaymentIncome": 127064,
      "repayment": 9050.88
    },
    {
      "repaymentIncome": 190000,
      "repayment": 19000
    }
  ],
  "medicareLevySurcharge": [
    {
      "taxableIncome": 100000,
      "familyIncome": 100000,
      "surcharge": 0
    },
    {
      "taxableIncome": 102000,
      "familyIncome": 102000,
      "surcharge": 1020
    },
    {
      "taxableIncome": 120000,
      "familyIncome": 220000,
      "surcharge": 1200
    },
    {
      "taxableIncome": 120000,
      "familyIncome": 220000,
      "hasCover": true,
      "surcharge": 0
    }
  ],
  "paygWithholding": [
    {
      "employmentIncome": 75000,
      "withholding": 14820
    },
    {
      "employmentIncome": 150000,
      "withholding": 39884
    }
  ]
}`);
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
      const expectedLevy = (income - threshold) * 0.1;
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
      expect(calculator.calculateMedicareLevy(income, dependents)).toBeCloseTo((income - familyThreshold) * 0.1, 2);
    });

    test('Family threshold includes spouse taxable income', () => {
      expect(calculator.calculateMedicareLevy(30000, 0, false, true, 12000)).toBe(0);
      expect(calculator.calculateMedicareLevy(30000, 0, false, true, 20000)).toBeCloseTo((50000 - 45907) * 0.1, 2);
    });

    test('Medicare levy surcharge applies without private hospital cover', () => {
      expect(calculator.calculateMedicareLevySurcharge(100000, 100000, false, false, 0)).toBe(0);
      expect(calculator.calculateMedicareLevySurcharge(102000, 102000, false, false, 0)).toBeCloseTo(1020, 2);
      expect(calculator.calculateMedicareLevySurcharge(120000, 220000, false, true, 0)).toBeCloseTo(1200, 2);
      expect(calculator.calculateMedicareLevySurcharge(120000, 220000, true, true, 0)).toBe(0);
    });
  });

  describe('HECS-HELP Repayment Tests', () => {
    test('No HECS repayment below threshold', () => {
      expect(calculator.calculateHECSRepayment(50000, true)).toBe(0);
    });

    test('HECS repayment at various thresholds', () => {
      expect(calculator.calculateHECSRepayment(65000, true)).toBe(0);
      expect(calculator.calculateHECSRepayment(75000, true)).toBeCloseTo((75000 - 67000) * 0.15, 2);
      expect(calculator.calculateHECSRepayment(127064, true)).toBeCloseTo(8700 + ((127064 - 125000) * 0.17), 2);
      expect(calculator.calculateHECSRepayment(180000, true)).toBeCloseTo(180000 * 0.10, 2);
    });

    test('No HECS repayment when no debt', () => {
      expect(calculator.calculateHECSRepayment(100000, false)).toBe(0);
    });

    test('HELP repayment uses repayment-income adjustments', () => {
      const result = calculator.calculateCompleteTax({
        jobIncomes: ['60000'],
        abnIncome: '',
        taxWithheld: '10000',
        deductions: {},
        workFromHomeHours: '',
        hecsDebt: true,
        reportableSuper: '5000',
        reportableFringeBenefits: '3000',
        netInvestmentLosses: '2000',
        exemptForeignIncome: '1000',
        medicareExemption: false,
        dependents: '0',
        hasDependents: false
      });

      expect(result.taxableIncome).toBe(60000);
      expect(result.studyLoanRepaymentIncome).toBe(71000);
      expect(result.hecsRepayment).toBeCloseTo((71000 - 67000) * 0.15, 2);
    });
  });

  describe('Work From Home Deduction Tests', () => {
    test('WFH deduction calculation', () => {
      expect(calculator.calculateWorkFromHomeDeduction('100')).toBe(70);
      expect(calculator.calculateWorkFromHomeDeduction('200')).toBe(140);
      expect(calculator.calculateWorkFromHomeDeduction('0')).toBe(0);
      expect(calculator.calculateWorkFromHomeDeduction('')).toBe(0);
    });
  });

  describe('PAYG Withholding Estimate Tests', () => {
    test('Uses ATO weekly scale 2 coefficients', () => {
      expect(calculator.calculatePaygWithholdingEstimate(0)).toBe(0);
      expect(calculator.calculatePaygWithholdingEstimate(75000)).toBe(14820);
      expect(calculator.calculatePaygWithholdingEstimate(150000)).toBe(39884);
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

      const expectedTotal = 1250 + 3300 + 1100 + 2000 + 70; // Including WFH
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
      expect(result.workFromHomeDeduction).toBe(35);
      expect(result.totalManualDeductions).toBe(1000);
      expect(result.totalDeductions).toBe(1035);
      expect(result.taxableIncome).toBe(33965);
      expect(result.lito).toBe(700);
      expect(result.medicare).toBeCloseTo(674.30, 2); // Medicare levy reduction phase-in
      expect(result.hecsRepayment).toBe(0);
      // Verify the calculation components are correct
      expect(result.tax).toBeCloseTo(2522.40, 1); // Tax on taxable income
      expect(result.finalTax).toBeCloseTo(2496.70, 1); // Tax - LITO + Medicare
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
      expect(result.workFromHomeDeduction).toBe(210);
      expect(result.totalManualDeductions).toBe(17100);
      expect(result.totalDeductions).toBe(17310);
      expect(result.taxableIncome).toBe(157690);
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
      expect(result.refund).toBe(0); // LITO is not refundable when no tax is payable
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
      expect(result.workFromHomeDeduction).toBe(1400);
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
      expect(calculator.calculateIncomeTax(18201)).toBeCloseTo(0.16, 2);
      expect(calculator.calculateIncomeTax(45000)).toBeCloseTo((45000 - 18200) * 0.16, 2);
      expect(calculator.calculateIncomeTax(45001)).toBeCloseTo(4288 + 0.30, 2);
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
