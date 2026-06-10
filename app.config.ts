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
    scheme: string;
    iosBundleIdentifier: string;
    androidPackage: string;
    supportUrl: string;
    privacyPolicyUrl: string;
  }
> = {
  development: {
    analyticsEnabled: false,
    crashReportingEnabled: false,
    name: 'MyTaxReturn AU Dev',
    slug: 'MyTaxReturn-au-dev',
    scheme: 'mytaxreturnau-dev',
    iosBundleIdentifier: 'au.mytaxreturn.app.dev',
    androidPackage: 'au.mytaxreturn.app.dev',
    supportUrl: 'mailto:support@example.com?subject=MyTaxReturn%20AU%20Dev%20Support',
    privacyPolicyUrl: 'https://example.com/mytaxreturn-au/privacy',
  },
  preview: {
    analyticsEnabled: false,
    crashReportingEnabled: true,
    name: 'MyTaxReturn AU Preview',
    slug: 'MyTaxReturn-au-preview',
    scheme: 'mytaxreturnau-preview',
    iosBundleIdentifier: 'au.mytaxreturn.app.preview',
    androidPackage: 'au.mytaxreturn.app.preview',
    supportUrl: 'mailto:support@example.com?subject=MyTaxReturn%20AU%20Preview%20Support',
    privacyPolicyUrl: 'https://example.com/mytaxreturn-au/privacy',
  },
  production: {
    analyticsEnabled: true,
    crashReportingEnabled: true,
    name: 'MyTaxReturn AU',
    slug: 'MyTaxReturn-au',
    scheme: 'mytaxreturnau',
    iosBundleIdentifier: 'au.mytaxreturn.app',
    androidPackage: 'au.mytaxreturn.app',
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

const readPositiveInteger = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = normalizeEnvironment(process.env.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV);
  const defaults = ENVIRONMENT_DEFAULTS[appEnv];
  const easProjectId = process.env.EAS_PROJECT_ID;

  return {
    ...config,
    ...(process.env.EXPO_OWNER ? { owner: process.env.EXPO_OWNER } : {}),
    name: process.env.EXPO_PUBLIC_APP_NAME || defaults.name,
    slug: process.env.EXPO_PUBLIC_APP_SLUG || defaults.slug,
    version: '1.0.0',
    scheme: process.env.EXPO_PUBLIC_APP_SCHEME || defaults.scheme,
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#0F172A',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || defaults.iosBundleIdentifier,
      buildNumber: process.env.IOS_BUILD_NUMBER || '1',
    },
    android: {
      package: process.env.ANDROID_PACKAGE || defaults.androidPackage,
      versionCode: readPositiveInteger(process.env.ANDROID_VERSION_CODE, 1),
    },
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
      ...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
    },
  };
};
