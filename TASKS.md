# TASKS.md

## Goal

Make the Australian tax return calculator more valuable, trustworthy, and production-ready while keeping tax-year updates simple and auditable.

## Priority 0 - Accuracy, Compliance, and Trust

- [x] Add source-linked tax-year audit notes.
  - Record the official ATO source, retrieval date, and affected constants for rates, thresholds, offsets, HELP repayment, Medicare levy, Medicare levy surcharge, and PAYG withholding.
  - Acceptance: every tax constant in `src/constants/taxConstants.ts` can be traced to an official source note.
  - Completed: added structured source audit metadata in `src/constants/taxConstants.ts` and corrected the 2025-26 Medicare levy surcharge thresholds from the official ATO private health insurance threshold page.

- [x] Add calculation snapshot tests for each major income band.
  - Cover resident tax rates, LITO, Medicare levy phase-in, family Medicare levy reduction, HELP repayment income, Medicare levy surcharge tiers, and PAYG withholding.
  - Acceptance: tests fail when any threshold, rate, or formula changes unexpectedly.
  - Completed: added active tax-year config and major calculation output snapshots, including resident tax bands, LITO, Medicare levy, HELP, MLS, and PAYG withholding.

- [x] Add visible calculation assumptions and disclaimers.
  - Explain that the app estimates individual tax outcomes and is not tax agent advice.
  - Show assumptions around residency, full-year Medicare status, private health cover, spouse income, dependents, HELP, and PAYG withholding.
  - Acceptance: users can inspect assumptions before saving/exporting a result.
  - Completed: added a results-screen assumptions card before save/export actions and included the assumptions in saved calculation data, CSV export, and HTML report export.

- [x] Add tax-year selection to the UI.
  - Use the existing annual tax-year config so users can choose supported years.
  - Acceptance: switching years updates labels, thresholds, calculations, exports, and saved calculation metadata.
  - Completed: added a tax-year selector backed by `TAX_YEAR_CONFIGS`, with selected year flowing through result labels, assumptions, CSV/report export, and saved calculation metadata.

- [x] Add saved-result versioning.
  - Store the app version, tax year, config version, and calculation engine version with each saved result.
  - Acceptance: older saved results can be identified and recalculated intentionally instead of silently changing.
  - Completed: saved calculations now include metadata for app version, selected financial year, tax-year config version, and calculation engine version.

## Priority 1 - Production Readiness

- [x] Add CI checks.
  - Run type-check, calculation tests, and linting on every pull request.
  - Acceptance: GitHub Actions blocks merges when tests or type-checking fail.
  - Completed: added a GitHub Actions workflow for pull requests and `main` pushes that runs install, lint, format check, type-check, and calculation tests.

- [x] Add linting and formatting.
  - Add ESLint and Prettier using React Native/TypeScript-friendly defaults.
  - Acceptance: `npm run lint` and `npm run format:check` are available and documented.
  - Completed: added Expo ESLint and Prettier configs, `lint`, `format:check`, and `format` scripts, and applied the initial Prettier baseline.

- [x] Resolve Expo dependency version warnings.
  - Align Expo, React Native, AsyncStorage, and Metro runtime versions with the installed Expo SDK requirements.
  - Acceptance: `npx expo-doctor` has no dependency compatibility warnings.
  - Completed: aligned Expo SDK 53 package versions and verified with `npx expo install --check` using the local Expo dependency map.

- [x] Add error boundaries and crash reporting.
  - Add a top-level error boundary and production crash reporting provider.
  - Acceptance: calculation and rendering errors show a useful fallback and are reported with non-sensitive context.
  - Completed: added a top-level error boundary, Sentry-backed crash reporting behind environment flags, non-sensitive calculation error reporting, and `.env.example` configuration.

- [x] Add analytics with privacy controls.
  - Track feature usage, step completion, export usage, and validation failure patterns without collecting sensitive tax amounts by default.
  - Acceptance: analytics can be disabled and no raw income, deduction, TFN, or identity data is sent.
  - Completed: added an environment-gated analytics service with allowlisted event properties, debug-only local logging, and sanitized tracking for screens, step flow, validation failures, calculations, saves, exports, PAYG estimate toggles, tax-year changes, and saved-calculation opens.

- [x] Add environment configuration.
  - Separate development, preview, and production settings.
  - Acceptance: build-time config controls analytics, crash reporting, app name, and support links.
  - Completed: added Expo dynamic config for development/preview/production defaults, shared runtime environment config, environment-driven analytics/crash toggles, app naming, and support/privacy links surfaced through app constants and About screen.

## Priority 2 - User Value

- [x] Add a guided deduction checklist.
  - Include work-related, self-education, donations, WFH, tax agent fees, income protection, union fees, investment expenses, and rental property prompts.
  - Acceptance: users can discover common deductions without reading long help text.
  - Completed: added an ATO source-backed deduction checklist for common claim areas, completion indicators from entered deduction fields, and tap-to-open navigation into the matching deduction category.

- [x] Add document and receipt checklist.
  - Generate a personalized list based on entered income, deductions, HELP, Medicare, spouse, dependents, and private health cover.
  - Acceptance: the app can export a checklist with the tax estimate report.
  - Completed: added a personalized document checklist to result cards, saved calculation data, CSV export, and HTML report export based on income, deductions, HELP, Medicare, spouse, dependents, and private health cover inputs.

- [x] Add scenario comparison.
  - Let users duplicate a calculation and compare refund/owing differences across deductions, income, HELP, spouse income, and private health cover.
  - Acceptance: users can see a side-by-side summary of at least two scenarios.
  - Completed: added saved-calculation duplication into an editable scenario and a home-screen comparison panel for the two most recent saved scenarios covering refund/owing, income, deductions, HELP, spouse, and private hospital cover differences.

- [x] Add ABN/business income improvements.
  - Add business deductions, GST/BAS notes, super contributions, and tax instalment warnings.
  - Acceptance: ABN users get clearer estimates without mixing employment and business assumptions.
  - Completed: added ABN business deduction and deductible personal super fields, included them in calculation/save/export totals, and added ABN guidance for PAYG instalments, GST/BAS record keeping, and personal super deduction evidence.

- [x] Add private health insurance detail.
  - Capture days covered, single/family policy type, dependents, and partial-year coverage.
  - Acceptance: Medicare levy surcharge estimates support partial-year private hospital cover.
  - Completed: added private hospital policy type and covered-days inputs, saved/exported those fields, and prorated Medicare levy surcharge by uncovered days for partial-year cover.

- [x] Add spouse and family guidance.
  - Explain spouse income, dependents, family thresholds, Medicare levy reduction, and surcharge impacts.
  - Acceptance: the app reduces user uncertainty when family details affect calculations.
  - Completed: added a Medicare details guidance card explaining spouse income, dependents, family thresholds, Medicare levy reduction context, Medicare levy surcharge tiers, private hospital cover, and exemption evidence.

## Priority 3 - Mobile Experience

- [ ] Split the large calculator screen into smaller components.
  - Extract income, deductions, Medicare, HELP, results, saved calculations, and exports into focused components.
  - Acceptance: `src/App.tsx` is mostly state orchestration and navigation, not all UI and formulas.

- [ ] Move all calculation behavior into services.
  - Remove duplicate formula logic from UI code.
  - Acceptance: UI screens call a single calculation service and tests target that service.

- [ ] Improve form validation.
  - Add field-level validation, reasonable range warnings, and blocking errors for impossible inputs.
  - Acceptance: users know exactly what to fix before calculating.

- [ ] Improve accessibility.
  - Add accessibility labels, roles, sufficient contrast, larger text support, and screen reader-friendly result summaries.
  - Acceptance: core flows work with VoiceOver on iOS.

- [ ] Add keyboard and scroll QA.
  - Confirm numeric fields, safe areas, sticky actions, and result screens behave correctly on small and large iPhones.
  - Acceptance: no field is hidden behind the keyboard during the main flow.

- [ ] Add loading, empty, and error states for saved calculations.
  - Acceptance: storage failures and empty history states are clear and recoverable.

## Priority 4 - Export, Storage, and Privacy

- [ ] Improve PDF report quality.
  - Include tax year, assumptions, input summary, detailed formula breakdown, disclaimers, and source notes.
  - Acceptance: exported reports are useful for personal records and conversations with a tax professional.

- [ ] Add CSV export for calculations.
  - Export saved calculations and key result fields.
  - Acceptance: users can analyze historical estimates outside the app.

- [ ] Add secure local data controls.
  - Add clear all data, delete individual result, and optional app lock guidance.
  - Acceptance: users can manage sensitive local tax data intentionally.

- [ ] Add import/export backup.
  - Let users back up saved calculations to a local file and restore them later.
  - Acceptance: backups include schema version and reject incompatible files safely.

- [ ] Add data retention copy.
  - Explain what is stored locally and what leaves the device.
  - Acceptance: privacy expectations are visible before users save or export.

## Priority 5 - Release Preparation

- [x] Add app metadata.
  - Prepare app icon, splash screen, store screenshots, description, keywords, support URL, and privacy policy URL.
  - Acceptance: metadata is ready for TestFlight/App Store submission.
  - Completed: added generated app icon/splash assets, wired them into Expo config, added store metadata copy, screenshot capture requirements, support page, and privacy policy draft under `docs/release/`.

- [x] Add EAS build setup.
  - Configure development, preview, and production build profiles.
  - Acceptance: `eas build` can produce an iOS preview build.
  - Completed: added EAS development simulator, preview, preview simulator, and production profiles; added native app IDs/build numbers to Expo config; added npm EAS build shortcuts and updated README build commands.

- [x] Add release checklist.
  - Include tax-source verification, tests, simulator QA, physical-device QA, privacy review, dependency audit, and export QA.
  - Acceptance: releases follow a repeatable checklist.
  - Completed: added `docs/release/RELEASE_CHECKLIST.md` covering release scope, ATO source verification, automated checks, manual app QA, privacy/data handling, store metadata, EAS build/submission, and final review steps.

- [x] Add beta feedback flow.
  - Provide an in-app support/contact path and structured feedback questions.
  - Acceptance: beta users can report calculation concerns with enough context to reproduce them.
  - Completed: added an About-screen Beta Feedback link, GitHub beta feedback issue template, beta triage guide, and support-page link with privacy-safe reporting questions.

- [x] Add app store compliance review.
  - Review financial/tax advice wording, disclaimers, privacy claims, and data handling.
  - Acceptance: app copy avoids implying registered tax agent advice.
  - Completed: added `docs/release/COMPLIANCE_REVIEW.md`, removed high-risk professional/ATO-compliant/refund-maximization app copy, aligned privacy claims with analytics/crash/export behavior, and documented blocked wording for screenshots and store metadata.

## Priority 6 - Future Tax-Year Maintenance

- [ ] Add a tax-year update script.
  - Generate a new config entry from a template and list required ATO source checks.
  - Acceptance: creating FY2026-27 starts from data changes, not formula rewrites.

- [ ] Add config validation tests.
  - Validate thresholds are sorted, rates are valid, offsets phase out correctly, and surcharge tiers do not overlap.
  - Acceptance: invalid tax-year configs fail fast.

- [ ] Add source review reminders.
  - Track annual dates to re-check ATO rates, thresholds, HELP rules, Medicare thresholds, surcharge thresholds, WFH rate, and withholding schedules.
  - Acceptance: annual updates have an owner, date, and checklist.

- [ ] Add unsupported-year handling.
  - Show a clear message if users open or import a calculation from an unsupported year.
  - Acceptance: old data does not produce misleading current-year results.

## Suggested Next Sprint

1. Continue Priority 3 mobile hardening: component extraction, service cleanup, validation, accessibility, keyboard, and saved-calculation states.
2. Improve export/storage/privacy controls: PDF detail, CSV export, delete/clear data, backup import/export, and data-retention copy.
3. Add future tax-year maintenance automation: config validation tests, update script, annual source-review reminders, and unsupported-year handling.
4. Capture fresh release screenshots from the current build and do not use the old `mockups/` screenshots.
5. Replace repository-hosted support/privacy URLs with stable branded website URLs before broad production launch.
