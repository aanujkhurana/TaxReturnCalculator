import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnvironment = 'development' | 'preview' | 'production';

declare const process: { env: Record<string, string | undefined> };

const ENVIRONMENT_DEFAULTS: Record<
  AppEnvironment,
  {
    analyticsEnabled: boolean;
    crashReportingEnabled: boolean;
    name: string;
    slug: string;
    supportUrl: string;
    privacyPolicyUrl: string;
  }
> = {
  development: {
    analyticsEnabled: false,
    crashReportingEnabled: false,
    name: 'MyTaxReturn AU Dev',
    slug: 'MyTaxReturn-au-dev',
    supportUrl: 'mailto:support@example.com?subject=MyTaxReturn%20AU%20Dev%20Support',
    privacyPolicyUrl: 'https://example.com/mytaxreturn-au/privacy',
  },
  preview: {
    analyticsEnabled: false,
    crashReportingEnabled: true,
    name: 'MyTaxReturn AU Preview',
    slug: 'MyTaxReturn-au-preview',
    supportUrl: 'mailto:support@example.com?subject=MyTaxReturn%20AU%20Preview%20Support',
    privacyPolicyUrl: 'https://example.com/mytaxreturn-au/privacy',
  },
  production: {
    analyticsEnabled: true,
    crashReportingEnabled: true,
    name: 'MyTaxReturn AU',
    slug: 'MyTaxReturn-au',
    supportUrl: 'mailto:support@example.com?subject=MyTaxReturn%20AU%20Support',
    privacyPolicyUrl: 'https://example.com/mytaxreturn-au/privacy',
  },
};

const normalizeEnvironment = (value?: string): AppEnvironment => {
  if (value === 'preview' || value === 'production') {
    return value;
  }

  return 'development';
};

const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = normalizeEnvironment(process.env.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV);
  const defaults = ENVIRONMENT_DEFAULTS[appEnv];

  return {
    ...config,
    name: process.env.EXPO_PUBLIC_APP_NAME || defaults.name,
    slug: process.env.EXPO_PUBLIC_APP_SLUG || defaults.slug,
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#0F172A',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {},
    web: {
      bundler: 'metro',
    },
    plugins: ['expo-font', '@sentry/react-native'],
    extra: {
      appEnv,
      analyticsEnabled: readBoolean(
        process.env.EXPO_PUBLIC_ANALYTICS_ENABLED,
        defaults.analyticsEnabled
      ),
      crashReportingEnabled: readBoolean(
        process.env.EXPO_PUBLIC_CRASH_REPORTING_ENABLED,
        defaults.crashReportingEnabled
      ),
      supportUrl: process.env.EXPO_PUBLIC_SUPPORT_URL || defaults.supportUrl,
      privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || defaults.privacyPolicyUrl,
    },
  };
};
