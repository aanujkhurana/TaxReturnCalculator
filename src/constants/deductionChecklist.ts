export type DeductionChecklistCategory =
  | 'workRelated'
  | 'selfEducation'
  | 'donations'
  | 'other'
  | 'workFromHome';

export interface DeductionChecklistItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly icon: string;
  readonly categoryKey: DeductionChecklistCategory;
  readonly fieldKey?: string;
  readonly sourceLabel: string;
  readonly sourceUrl: string;
}

export const DEDUCTION_CHECKLIST_ITEMS: readonly DeductionChecklistItem[] = [
  {
    id: 'work-travel',
    title: 'Work travel and car costs',
    detail: 'Trips between workplaces, client visits, or other work travel you paid for.',
    icon: 'car-outline',
    categoryKey: 'workRelated',
    fieldKey: 'travel',
    sourceLabel: 'ATO work-related deductions',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'tools-equipment',
    title: 'Tools, equipment, and devices',
    detail: 'Work-use tools, computer gear, phone accessories, or equipment depreciation.',
    icon: 'construct-outline',
    categoryKey: 'workRelated',
    fieldKey: 'equipment',
    sourceLabel: 'ATO deductions you can claim',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'uniforms-safety',
    title: 'Uniforms and protective clothing',
    detail: 'Occupation-specific clothing, protective gear, laundry, or dry-cleaning records.',
    icon: 'shirt-outline',
    categoryKey: 'workRelated',
    fieldKey: 'uniforms',
    sourceLabel: 'ATO work-related deductions',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'union-professional-fees',
    title: 'Union and professional fees',
    detail: 'Union fees, professional memberships, subscriptions, licences, or registrations.',
    icon: 'people-outline',
    categoryKey: 'workRelated',
    fieldKey: 'memberships',
    sourceLabel: 'ATO deductions you can claim',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'self-education',
    title: 'Self-education and conferences',
    detail: 'Courses, seminars, books, certifications, or conferences linked to current work.',
    icon: 'school-outline',
    categoryKey: 'selfEducation',
    sourceLabel: 'ATO self-education expenses',
    sourceUrl:
      'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/education-training-and-seminars/self-education-expenses',
  },
  {
    id: 'donations-dgr',
    title: 'Gifts and donations',
    detail: 'Donations to deductible gift recipients with receipts or donation summaries.',
    icon: 'heart-outline',
    categoryKey: 'donations',
    sourceLabel: 'ATO deductions you can claim',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'work-from-home',
    title: 'Working from home records',
    detail: 'Hours worked from home, with records to support the fixed-rate method claim.',
    icon: 'home-outline',
    categoryKey: 'workFromHome',
    sourceLabel: 'ATO fixed-rate method',
    sourceUrl:
      'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method',
  },
  {
    id: 'tax-agent-fees',
    title: 'Tax agent and accounting fees',
    detail: 'Prior-year tax preparation, accounting, or advice costs for managing tax affairs.',
    icon: 'calculator-outline',
    categoryKey: 'other',
    fieldKey: 'taxAgent',
    sourceLabel: 'ATO other deductible expenses',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'income-protection',
    title: 'Income protection insurance',
    detail: 'Premiums for income protection cover, excluding private or capital cover portions.',
    icon: 'shield-checkmark-outline',
    categoryKey: 'other',
    fieldKey: 'incomeProtection',
    sourceLabel: 'ATO deductions you can claim',
    sourceUrl: 'https://www.ato.gov.au/mytaxdeductionsyoucanclaim',
  },
  {
    id: 'investment-rental',
    title: 'Investment or rental expenses',
    detail: 'Interest, account fees, property costs, or other costs tied to assessable income.',
    icon: 'trending-up-outline',
    categoryKey: 'other',
    fieldKey: 'investment',
    sourceLabel: 'ATO records you need to keep',
    sourceUrl:
      'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/records-you-need-to-keep',
  },
];
