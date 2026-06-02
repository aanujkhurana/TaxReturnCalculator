import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { APP_INFO, CALCULATION_ENGINE_VERSION } from '../constants/appConstants';
import { ACTIVE_FINANCIAL_YEAR } from '../constants/taxConstants';
import { ENVIRONMENT_CONFIG } from '../config/environment';

type CrashContext = Record<string, string | number | boolean | undefined | null>;

let initialized = false;

export const initializeCrashReporting = (): void => {
  if (initialized) return;

  initialized = true;

  if (!ENVIRONMENT_CONFIG.crashReportingEnabled || !ENVIRONMENT_CONFIG.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: ENVIRONMENT_CONFIG.sentryDsn,
    enabled: true,
    environment: ENVIRONMENT_CONFIG.appEnv,
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
  if (!ENVIRONMENT_CONFIG.crashReportingEnabled || !ENVIRONMENT_CONFIG.sentryDsn) {
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
  if (!ENVIRONMENT_CONFIG.crashReportingEnabled || !ENVIRONMENT_CONFIG.sentryDsn) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    level,
    data,
  });
};
