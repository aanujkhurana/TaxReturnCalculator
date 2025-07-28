/**
 * PDF Generation Service
 * Handles creation and sharing of PDF tax calculation reports
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { APP_INFO } from '../constants/appConstants';

// Type definitions for PDF service
export interface CalculationData {
  formData: {
    jobIncomes?: Array<{ income: string }>;
    workFromHomeHours?: string;
    [key: string]: any;
  };
  result: {
    refund: number;
    totalIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    incomeTax: number;
    medicareLevy: number;
    hecsRepayment: number;
    lowIncomeTaxOffset: number;
    totalTax: number;
    taxWithheld: number;
    breakdown: {
      income: {
        jobIncome: number;
        abnIncome: number;
      };
      deductions: {
        workRelated: number;
        workFromHome: number;
      };
    };
  };
}

/**
 * Format currency for display
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date for display
 */
const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate HTML content for the PDF report
 */
const generateHTMLContent = (calculationData: CalculationData, calculationName: string): string => {
  const { formData, result } = calculationData;
  const currentDate = new Date().toISOString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Tax Calculation Report - ${calculationName}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #4A90E2;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #4A90E2;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #666;
                margin: 5px 0;
            }
            .summary {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid #4A90E2;
            }
            .summary h2 {
                margin-top: 0;
                color: #4A90E2;
            }
            .refund-amount {
                font-size: 36px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                padding: 20px;
                border-radius: 8px;
            }
            .refund-positive {
                color: #10B981;
                background: #ECFDF5;
                border: 2px solid #10B981;
            }
            .refund-negative {
                color: #EF4444;
                background: #FEF2F2;
                border: 2px solid #EF4444;
            }
            .section {
                margin-bottom: 30px;
            }
            .section h3 {
                color: #4A90E2;
                border-bottom: 2px solid #E2E8F0;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .breakdown-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .breakdown-table th,
            .breakdown-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #E2E8F0;
            }
            .breakdown-table th {
                background: #F8F9FA;
                font-weight: 600;
                color: #4A90E2;
            }
            .breakdown-table .amount {
                text-align: right;
                font-weight: 600;
            }
            .total-row {
                background: #F8F9FA;
                font-weight: bold;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #E2E8F0;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .disclaimer {
                background: #FFFBEB;
                border: 1px solid #FDE68A;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
                font-size: 14px;
                color: #92400E;
            }
            .job-income-list {
                margin-left: 20px;
            }
            .job-income-item {
                margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${APP_INFO.NAME} - Tax Calculation Report</h1>
            <p><strong>${calculationName || 'Tax Calculation'}</strong></p>
            <p>Financial Year: ${APP_INFO.FINANCIAL_YEAR}</p>
            <p>Generated: ${formatDate(currentDate)}</p>
        </div>

        <div class="summary">
            <h2>Tax Return Summary</h2>
            <div class="refund-amount ${result.refund >= 0 ? 'refund-positive' : 'refund-negative'}">
                ${result.refund >= 0 ? 'Refund: ' : 'Amount Owed: '}${formatCurrency(Math.abs(result.refund))}
            </div>
        </div>

        <div class="section">
            <h3>Income Breakdown</h3>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Income Type</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${formData.jobIncomes && formData.jobIncomes.length > 0 ? `
                        <tr>
                            <td>Employment Income (TFN Jobs)</td>
                            <td class="amount">${formatCurrency(result.breakdown.income.jobIncome)}</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="job-income-list">
                                    ${formData.jobIncomes.map((job, index) => 
                                        `<div class="job-income-item">Job ${index + 1}: ${formatCurrency(parseFloat(job.income) || 0)}</div>`
                                    ).join('')}
                                </div>
                            </td>
                        </tr>
                    ` : ''}
                    ${result.breakdown.income.abnIncome > 0 ? `
                        <tr>
                            <td>ABN/Business Income</td>
                            <td class="amount">${formatCurrency(result.breakdown.income.abnIncome)}</td>
                        </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td><strong>Total Income</strong></td>
                        <td class="amount"><strong>${formatCurrency(result.totalIncome)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>Deductions Breakdown</h3>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Deduction Type</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.breakdown.deductions.workRelated > 0 ? `
                        <tr>
                            <td>Work-Related Expenses</td>
                            <td class="amount">${formatCurrency(result.breakdown.deductions.workRelated)}</td>
                        </tr>
                    ` : ''}
                    ${result.breakdown.deductions.workFromHome > 0 ? `
                        <tr>
                            <td>Work From Home (${formData.workFromHomeHours || 0} hours)</td>
                            <td class="amount">${formatCurrency(result.breakdown.deductions.workFromHome)}</td>
                        </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td><strong>Total Deductions</strong></td>
                        <td class="amount"><strong>${formatCurrency(result.totalDeductions)}</strong></td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Taxable Income</strong></td>
                        <td class="amount"><strong>${formatCurrency(result.taxableIncome)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>Tax Calculation</h3>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Tax Component</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Income Tax</td>
                        <td class="amount">${formatCurrency(result.incomeTax)}</td>
                    </tr>
                    <tr>
                        <td>Medicare Levy</td>
                        <td class="amount">${formatCurrency(result.medicareLevy)}</td>
                    </tr>
                    ${result.hecsRepayment > 0 ? `
                        <tr>
                            <td>HECS-HELP Repayment</td>
                            <td class="amount">${formatCurrency(result.hecsRepayment)}</td>
                        </tr>
                    ` : ''}
                    ${result.lowIncomeTaxOffset > 0 ? `
                        <tr>
                            <td>Low Income Tax Offset</td>
                            <td class="amount">-${formatCurrency(result.lowIncomeTaxOffset)}</td>
                        </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td><strong>Total Tax</strong></td>
                        <td class="amount"><strong>${formatCurrency(result.totalTax)}</strong></td>
                    </tr>
                    <tr>
                        <td>Tax Withheld (PAYG)</td>
                        <td class="amount">${formatCurrency(result.taxWithheld)}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>${result.refund >= 0 ? 'Refund' : 'Amount Owed'}</strong></td>
                        <td class="amount"><strong>${formatCurrency(Math.abs(result.refund))}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated by ${APP_INFO.NAME} v${APP_INFO.VERSION}</p>
            <div class="disclaimer">
                <strong>Disclaimer:</strong> This calculation is an estimate only and should not be considered as professional tax advice. 
                Please consult with a qualified tax professional or use the official ATO tools for your actual tax return.
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Generate and share PDF report
 */
export const generateAndSharePDF = async (calculationData: CalculationData, calculationName: string = 'Tax Calculation'): Promise<boolean> => {
  try {
    const htmlContent = generateHTMLContent(calculationData, calculationName);
    const fileName = `${calculationName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.html`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/html',
        dialogTitle: 'Share Tax Calculation Report',
      });
      return true;
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
