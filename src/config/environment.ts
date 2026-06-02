export type AppEnvironment = 'development' | 'preview' | 'production';

declare const process: { env?: Record<string, string | undefined> };

const normalizeEnvironment = (value?: string): AppEnvironment => {
  if (value === 'preview' || value === 'production') {
    return value;
  }

  return 'development';
};

const readBoolean = (key: string, fallback: boolean): boolean => {
  const value = process.env?.[key];
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export const APP_ENV = normalizeEnvironment(
  process.env?.EXPO_PUBLIC_APP_ENV || process.env?.APP_ENV
);

const analyticsEnabledDefault = APP_ENV === 'production';
const crashReportingEnabledDefault = APP_ENV === 'preview' || APP_ENV === 'production';

export const ENVIRONMENT_CONFIG = {
  appEnv: APP_ENV,
  appName: process.env?.EXPO_PUBLIC_APP_NAME || 'MyTaxReturn AU',
  analyticsEnabled: readBoolean('EXPO_PUBLIC_ANALYTICS_ENABLED', analyticsEnabledDefault),
  analyticsEndpoint: process.env?.EXPO_PUBLIC_ANALYTICS_ENDPOINT,
  analyticsDebug: readBoolean('EXPO_PUBLIC_ANALYTICS_DEBUG', false),
  crashReportingEnabled: readBoolean(
    'EXPO_PUBLIC_CRASH_REPORTING_ENABLED',
    crashReportingEnabledDefault
  ),
  sentryDsn: process.env?.EXPO_PUBLIC_SENTRY_DSN,
  supportUrl:
    process.env?.EXPO_PUBLIC_SUPPORT_URL ||
    'mailto:support@example.com?subject=MyTaxReturn%20AU%20Support',
  privacyPolicyUrl:
    process.env?.EXPO_PUBLIC_PRIVACY_POLICY_URL || 'https://example.com/mytaxreturn-au/privacy',
} as const;
