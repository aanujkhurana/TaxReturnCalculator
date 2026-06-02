import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { APP_INFO, CALCULATION_ENGINE_VERSION } from '../constants/appConstants';
import { ACTIVE_FINANCIAL_YEAR } from '../constants/taxConstants';

type CrashContext = Record<string, string | number | boolean | undefined | null>;

declare const process: { env?: Record<string, string | undefined> };

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production');
const CRASH_REPORTING_ENABLED = process.env.EXPO_PUBLIC_CRASH_REPORTING_ENABLED === 'true';

let initialized = false;

export const initializeCrashReporting = (): void => {
  if (initialized) return;

  initialized = true;

  if (!CRASH_REPORTING_ENABLED || !SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: true,
    environment: ENVIRONMENT,
    release: `${APP_INFO.NAME}@${APP_INFO.VERSION}`,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend(event) {
      event.user = undefined;
      return event;
    },
  });

  Sentry.setTags({
    appVersion: APP_INFO.VERSION,
    calculationEngineVersion: CALCULATION_ENGINE_VERSION,
    financialYear: ACTIVE_FINANCIAL_YEAR,
    platform: Platform.OS,
  });
};

export const reportError = (error: unknown, context: CrashContext = {}): void => {
  if (!CRASH_REPORTING_ENABLED || !SENTRY_DSN) {
    if (__DEV__) {
      console.error('Captured app error', error, context);
    }
    return;
  }

  Sentry.withScope((scope) => {
    scope.setContext('app', {
      appVersion: APP_INFO.VERSION,
      calculationEngineVersion: CALCULATION_ENGINE_VERSION,
      financialYear: ACTIVE_FINANCIAL_YEAR,
      platform: Platform.OS,
      ...context,
    });
    Sentry.captureException(error);
  });
};

export const addCrashBreadcrumb = (
  message: string,
  data: CrashContext = {},
  level: Sentry.SeverityLevel = 'info'
): void => {
  if (!CRASH_REPORTING_ENABLED || !SENTRY_DSN) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    level,
    data,
  });
};
