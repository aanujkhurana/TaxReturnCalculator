/**
 * Help text data for all input fields in the tax calculator
 * Contains comprehensive guidance for users on how to fill out each field
 */

// Type definitions for help text
export interface HelpTextItem {
  readonly title: string;
  readonly purpose: string;
  readonly examples: readonly string[];
  readonly tips: readonly string[];
  readonly whereToFind: string;
}

export interface HelpTextData {
  readonly [key: string]: HelpTextItem;
}

export const HELP_TEXT: HelpTextData = {
  jobIncome: {
    title: "Employment Income (TFN Jobs)",
    purpose: "Enter your gross annual salary or wages from employment where tax was withheld using your Tax File Number (TFN).",
    examples: [
      "Full-time salary: 75000",
      "Part-time wages: 35000",
      "Multiple jobs: Add each separately"
    ],
    tips: [
      "Use your gross income before tax, not your take-home pay",
      "Find this amount on your payment summary or PAYG summary",
      "Include bonuses, overtime, and allowances",
      "Don't include super contributions or salary sacrifice amounts"
    ],
    whereToFind: "Check your payment summary, payslips, or PAYG summary from your employer"
  },
  abnIncome: {
    title: "ABN/Freelance Income",
    purpose: "Enter your total income from self-employment, contracting, or business activities using your Australian Business Number (ABN).",
    examples: [
      "Freelance consulting: 18000",
      "Uber/delivery driving: 12000",
      "Small business revenue: 45000"
    ],
    tips: [
      "Enter gross income before business expenses",
      "Include all ABN income from the financial year",
      "Business expenses will be calculated separately",
      "If you have multiple ABNs, combine the total income"
    ],
    whereToFind: "Check your business records, invoices, or BAS statements"
  },
  taxWithheld: {
    title: "Tax Withheld (PAYG)",
    purpose: "Enter the total amount of tax that was withheld from your employment income (TFN jobs) during the financial year.",
    examples: [
      "Single job PAYG: 12500",
      "Multiple jobs total: 18750",
      "Including extra withholding: 16200"
    ],
    tips: [
      "Add up tax withheld from all your TFN employment jobs only",
      "Include any extra tax you asked to be withheld",
      "Don't include ABN/business income (no tax withheld)",
      "Don't include super contributions or other deductions",
      "This reduces your final tax bill"
    ],
    whereToFind: "Found on your payment summary, payslips, or in your myGov account"
  },
  workRelated: {
    title: "Work-Related Expenses",
    purpose: "Enter the total amount you spent on items required for your work that weren't reimbursed by your employer.",
    examples: [
      "Tools and equipment: 800",
      "Work uniforms: 300",
      "Professional development: 1200"
    ],
    tips: [
      "Only include expenses directly related to earning your income",
      "Keep receipts as evidence for the ATO",
      "Don't include travel between home and work",
      "Clothing must be specific uniforms or protective gear"
    ],
    whereToFind: "Review your receipts and records for work-related purchases"
  },
  selfEducation: {
    title: "Self-Education Expenses",
    purpose: "Enter costs for courses, training, or education that directly relates to your current job or increases your income-earning ability.",
    examples: [
      "Professional course: 1200",
      "Work-related books: 150",
      "Conference attendance: 800"
    ],
    tips: [
      "Education must relate to your current work",
      "Include course fees, textbooks, and travel to study",
      "Don't include meals or accommodation",
      "Keep all receipts and course documentation"
    ],
    whereToFind: "Check receipts for courses, books, and educational materials"
  },
  donations: {
    title: "Charitable Donations",
    purpose: "Enter the total amount of tax-deductible donations you made to registered charities.",
    examples: [
      "Regular charity donations: 500",
      "Disaster relief fund: 200",
      "Religious organization: 300"
    ],
    tips: [
      "Only donations to DGR (Deductible Gift Recipient) organizations qualify",
      "Donations over $2 require receipts",
      "Don't include raffle tickets or fundraising purchases",
      "Check the charity's DGR status on the ATO website"
    ],
    whereToFind: "Review your donation receipts and bank statements"
  },
  otherDeductions: {
    title: "Other Deductions",
    purpose: "Enter other allowable tax deductions such as investment expenses, tax agent fees, or income protection insurance.",
    examples: [
      "Tax agent fees: 300",
      "Investment property expenses: 1200",
      "Income protection insurance: 450"
    ],
    tips: [
      "Only include expenses directly related to earning income",
      "Investment expenses must relate to taxable investments",
      "Keep detailed records and receipts",
      "When in doubt, consult a tax professional"
    ],
    whereToFind: "Review receipts for professional services and investment-related expenses"
  },
  workFromHome: {
    title: "Work From Home Hours",
    purpose: "Enter the total number of hours you worked from home during the financial year using the ATO shortcut method.",
    examples: [
      "2 days per week: ~400 hours",
      "Full-time remote: ~1800 hours",
      "Occasional WFH: ~100 hours"
    ],
    tips: [
      "ATO shortcut method: $0.67 per hour (max $1,000)",
      "Keep a diary or log of work from home hours",
      "Must be for employment duties, not personal use",
      "Alternative: claim actual expenses with detailed records"
    ],
    whereToFind: "Calculate from your work diary, calendar, or employment records"
  },
  dependents: {
    title: "Number of Dependents",
    purpose: "Enter the number of dependent children or other dependents that may affect your tax offsets and Medicare levy.",
    examples: [
      "Two children under 18: 2",
      "One child + elderly parent: 2",
      "No dependents: 0"
    ],
    tips: [
      "Include children under 18 or full-time students under 25",
      "Include other dependents you financially support",
      "May affect Medicare levy surcharge thresholds",
      "Can increase your tax-free threshold"
    ],
    whereToFind: "Count your dependent children and other dependents you financially support"
  },
  hecsDebt: {
    title: "HECS-HELP Debt",
    purpose: "Indicate if you have outstanding Higher Education Contribution Scheme (HECS) or Higher Education Loan Programme (HELP) debt.",
    examples: [
      "University degree with HECS debt: Yes",
      "TAFE course with VET Student Loan: Yes",
      "No student loans: No"
    ],
    tips: [
      "HECS-HELP repayments are calculated automatically based on your income",
      "Repayment rates range from 1% to 10% of your taxable income",
      "Minimum repayment threshold is $51,550 for 2024-25",
      "Check your myGov account for current debt balance"
    ],
    whereToFind: "Check your myGov account, ATO online services, or previous tax returns"
  },

  // Work-Related Deduction Subcategories
  workRelatedTravel: {
    title: "Work-Related Travel Expenses",
    purpose: "Enter costs for travel directly related to your work, excluding normal commuting between home and work.",
    examples: [
      "Travel between work sites: 450",
      "Client visits: 320",
      "Work conferences travel: 800"
    ],
    tips: [
      "Don't include travel between home and regular workplace",
      "Include car expenses, public transport, flights for work",
      "Keep detailed logbooks for car travel",
      "Must be directly related to earning income"
    ],
    whereToFind: "Review travel receipts, logbooks, and work-related trip records"
  },

  workRelatedEquipment: {
    title: "Work Equipment & Tools",
    purpose: "Enter costs for tools, equipment, and technology required for your work that weren't provided by your employer.",
    examples: [
      "Professional tools: 600",
      "Computer equipment: 1200",
      "Safety equipment: 300"
    ],
    tips: [
      "Only include items used primarily for work",
      "Equipment over $300 may need to be depreciated",
      "Don't include items provided by employer",
      "Keep purchase receipts and warranty information"
    ],
    whereToFind: "Check receipts for work tools, equipment, and technology purchases"
  },

  workRelatedUniforms: {
    title: "Uniforms & Protective Clothing",
    purpose: "Enter costs for compulsory work uniforms, protective clothing, and occupation-specific clothing.",
    examples: [
      "Company uniform: 250",
      "Safety boots and gear: 180",
      "Professional attire: 400"
    ],
    tips: [
      "Must be compulsory uniform or protective clothing",
      "Include cleaning and maintenance costs",
      "Regular business attire usually not deductible",
      "Logo or company-specific clothing qualifies"
    ],
    whereToFind: "Review receipts for uniforms, safety gear, and work-specific clothing"
  },

  workRelatedMemberships: {
    title: "Professional Memberships & Subscriptions",
    purpose: "Enter costs for professional memberships, union fees, and work-related subscriptions.",
    examples: [
      "Professional association: 350",
      "Union membership: 200",
      "Industry publications: 120"
    ],
    tips: [
      "Must be directly related to your work",
      "Include professional body memberships",
      "Union fees are generally deductible",
      "Trade magazines and journals qualify"
    ],
    whereToFind: "Check bank statements for membership fees and subscription payments"
  }
} as const;
