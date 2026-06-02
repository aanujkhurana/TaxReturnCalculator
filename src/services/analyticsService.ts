import { Platform } from 'react-native';
import { APP_INFO, CALCULATION_ENGINE_VERSION } from '../constants/appConstants';
import { ACTIVE_FINANCIAL_YEAR } from '../constants/taxConstants';

export type AnalyticsEventName =
  | 'screen_viewed'
  | 'calculator_step_viewed'
  | 'calculator_step_completed'
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

declare const process: { env?: Record<string, string | undefined> };

const ENVIRONMENT = process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production');
const ANALYTICS_ENABLED = process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true';
const ANALYTICS_ENDPOINT = process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT;
const ANALYTICS_DEBUG = process.env.EXPO_PUBLIC_ANALYTICS_DEBUG === 'true';

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
      environment: ENVIRONMENT,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    },
  };

  if (!ANALYTICS_ENABLED || !ANALYTICS_ENDPOINT) {
    if (__DEV__ && ANALYTICS_DEBUG) {
      console.info('Analytics event', payload);
    }
    return;
  }

  try {
    await fetch(ANALYTICS_ENDPOINT, {
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
