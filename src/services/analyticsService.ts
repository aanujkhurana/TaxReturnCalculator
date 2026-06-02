import { Platform } from 'react-native';
import { APP_INFO, CALCULATION_ENGINE_VERSION } from '../constants/appConstants';
import { ACTIVE_FINANCIAL_YEAR } from '../constants/taxConstants';
import { ENVIRONMENT_CONFIG } from '../config/environment';

export type AnalyticsEventName =
  | 'screen_viewed'
  | 'calculator_step_viewed'
  | 'calculator_step_completed'
  | 'deduction_checklist_opened'
  | 'validation_failed'
  | 'tax_calculation_completed'
  | 'tax_calculation_failed'
  | 'calculation_saved'
  | 'calculation_save_failed'
  | 'export_started'
  | 'export_completed'
  | 'export_failed'
  | 'tax_year_changed'
  | 'external_link_opened'
  | 'payg_estimate_toggled'
  | 'saved_calculation_opened';

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;

const ALLOWED_PROPERTY_KEYS = new Set([
  'area',
  'calculationEngineVersion',
  'currentStep',
  'errorType',
  'exportFormat',
  'financialYear',
  'hasAbn',
  'hasDependents',
  'hasEmployment',
  'hasHecsDebt',
  'hasPrivateHospitalCover',
  'hasSpouse',
  'inputSourceCount',
  'linkHost',
  'medicareExemption',
  'paygMode',
  'previousFinancialYear',
  'previousStep',
  'resultType',
  'screen',
  'step',
  'targetStep',
  'taxYearConfigVersion',
  'validationErrorCount',
]);

const sanitizeProperties = (properties: AnalyticsProperties = {}): AnalyticsProperties => {
  return Object.entries(properties).reduce<AnalyticsProperties>((sanitized, [key, value]) => {
    if (!ALLOWED_PROPERTY_KEYS.has(key) || value === undefined) {
      return sanitized;
    }

    sanitized[key] = typeof value === 'string' ? value.slice(0, 120) : value;
    return sanitized;
  }, {});
};

const sendAnalyticsEvent = async (
  name: AnalyticsEventName,
  properties: AnalyticsProperties
): Promise<void> => {
  const payload = {
    name,
    properties: sanitizeProperties(properties),
    metadata: {
      appVersion: APP_INFO.VERSION,
      calculationEngineVersion: CALCULATION_ENGINE_VERSION,
      defaultFinancialYear: ACTIVE_FINANCIAL_YEAR,
      environment: ENVIRONMENT_CONFIG.appEnv,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    },
  };

  if (!ENVIRONMENT_CONFIG.analyticsEnabled || !ENVIRONMENT_CONFIG.analyticsEndpoint) {
    if (__DEV__ && ENVIRONMENT_CONFIG.analyticsDebug) {
      console.info('Analytics event', payload);
    }
    return;
  }

  try {
    await fetch(ENVIRONMENT_CONFIG.analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to send analytics event', name, error);
    }
  }
};

export const trackAnalyticsEvent = (
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {}
): void => {
  void sendAnalyticsEvent(name, properties);
};
