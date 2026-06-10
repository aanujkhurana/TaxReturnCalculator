# Release Checklist

Use this checklist before every TestFlight, Google Play testing, or production release.

## Release Scope

- [ ] Confirm release type: internal test, TestFlight beta, Play closed test, staged production, or full production.
- [ ] Confirm version in `package.json`, `app.config.ts`, iOS `buildNumber`, and Android `versionCode`.
- [ ] Confirm the active financial year and calculation engine version in `src/constants/appConstants.ts`.
- [ ] Confirm release notes describe user-visible calculation, export, storage, privacy, and UI changes.

## Tax Source Verification

- [ ] Re-check ATO individual resident tax rates for the active financial year.
- [ ] Re-check ATO low income tax offset thresholds and phase-out rules.
- [ ] Re-check Medicare levy thresholds, family thresholds, dependent increases, and exemption wording.
- [ ] Re-check Medicare levy surcharge thresholds, family tier increases, and private hospital cover treatment.
- [ ] Re-check HELP repayment thresholds and repayment-income components.
- [ ] Re-check PAYG withholding table coefficients and rounding rules.
- [ ] Re-check work-from-home fixed rate and deduction guidance.
- [ ] Update source notes in `src/constants/taxConstants.ts` with retrieval date and affected constants.
- [ ] Run calculation snapshot tests after any source update.

## Automated Checks

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm test`
- [ ] `npx expo-doctor`
- [ ] Confirm `test-report.html` is only committed when intentionally refreshed.

## Manual App QA

- [ ] Run Expo on iOS simulator with `npx expo start --ios --localhost`.
- [ ] Test a low-income scenario, median-income scenario, high-income scenario, ABN-only scenario, HELP scenario, Medicare family scenario, and MLS scenario.
- [ ] Confirm keyboard behavior on a small iPhone simulator.
- [ ] Confirm result screen scrolling, save flow, scenario compare flow, PDF/share flow, and About/support links.
- [ ] Confirm dark mode and light mode are readable.
- [ ] Confirm VoiceOver labels and navigation on core screens before production.
- [ ] Confirm on at least one physical iOS device before App Store submission.
- [ ] Confirm on at least one physical Android device before Play Store submission.

## Privacy And Data Handling

- [ ] Confirm privacy policy matches actual analytics, crash reporting, local storage, exports, and third-party SDK usage.
- [ ] Confirm Google Play Data safety answers match the app binary and privacy policy.
- [ ] Confirm Apple app privacy answers match the app binary and privacy policy.
- [ ] Confirm no TFN, identity document, bank account, or raw sensitive tax detail is transmitted by analytics or crash reporting.
- [ ] Confirm support/contact links do not attach sensitive tax values by default.
- [ ] Confirm users can understand what data is local-only before saving or exporting.

## Store Metadata

- [ ] Confirm app name, subtitle/short description, full description, keywords, category, age rating, screenshots, icon, and splash are final.
- [ ] Confirm support URL is active and includes a working contact path.
- [ ] Confirm privacy policy URL is active, public, non-geofenced, and not a PDF.
- [ ] Confirm screenshots show the current supported tax year and avoid misleading refund guarantees.
- [ ] Confirm app review notes explain that the app is an Australian tax estimate calculator and not a registered tax agent service.

## Build And Submission

- [ ] Confirm `eas.json` profile: `preview-simulator`, `preview`, or `production`.
- [ ] Confirm `APP_ENV`, `EXPO_PUBLIC_APP_ENV`, `IOS_BUNDLE_IDENTIFIER`, `ANDROID_PACKAGE`, `IOS_BUILD_NUMBER`, and `ANDROID_VERSION_CODE`.
- [ ] Run `npm run eas:whoami` and confirm the intended Expo account.
- [ ] For simulator inspection, run `npm run eas:build:ios:preview-simulator`.
- [ ] For iOS beta, run `npm run eas:build:ios:preview` and distribute through TestFlight when signed.
- [ ] For Android beta, run `npm run eas:build:android:preview` and upload to Play internal or closed testing.
- [ ] For production, run `npm run eas:build:ios:production` and `npm run eas:build:android:production`.

## Final Review

- [ ] Confirm release branch is clean.
- [ ] Tag the release after store build artifacts are accepted.
- [ ] Store the release checklist outcome with the release notes.
- [ ] Record known limitations and next tax-year maintenance tasks.

## Source References

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety form guidance: https://support.google.com/googleplay/android-developer/answer/10787469
- Expo EAS build profiles: https://docs.expo.dev/build/eas-json/
