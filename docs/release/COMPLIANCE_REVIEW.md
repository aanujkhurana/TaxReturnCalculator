# App Store Compliance Review

Review date: 10 June 2026

Scope: app copy, store metadata, support/privacy links, tax advice wording, privacy claims, data handling claims, and release screenshots guidance.

## Review Sources

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety guidance: https://support.google.com/googleplay/android-developer/answer/10787469
- Expo EAS build profile documentation: https://docs.expo.dev/build/eas-json/
- ATO website references recorded in `src/constants/taxConstants.ts`

## Compliance Position

MyTaxReturn AU must be positioned as:

- An estimate calculator.
- A personal record-keeping and planning aid.
- A source-linked implementation of supported tax-year assumptions.
- Not affiliated with the Australian Taxation Office.
- Not operated by a registered tax agent.
- Not a tax lodgment product.
- Not a replacement for registered tax agent advice or official ATO services.

## Approved Wording

Use:

- Australian tax estimate calculator
- Estimate your Australian tax outcome
- Source-linked assumptions
- Saved calculations stay on your device unless you export or share them
- Consult a registered tax agent or use official ATO services for your actual tax return
- Results may not reflect your actual liability or refund

## Blocked Wording

Do not use in app copy, screenshots, store metadata, or release notes:

- ATO compliant
- Official ATO calculator
- ATO approved
- Professional tax calculator
- Professional guidance included
- Maximize your refund
- Guaranteed refund
- Accurate tax return
- Registered tax agent support
- Lodges your return
- Works completely offline
- No data leaves your device
- Your privacy is completely protected

## Changes Made In This Review

- Home screen subtitle changed from professional calculator wording to tax estimate wording.
- Empty-state copy removed refund-maximization wording.
- Empty-state feature list changed from ATO compliance/professional guidance to source-linked assumptions and estimate assumptions.
- Splash subtitle changed to tax estimate wording.
- About privacy copy now matches actual local storage, optional diagnostics, and export/share behavior.
- App and PDF disclaimers now refer to registered tax agent advice or official ATO services.
- Store metadata blocks risky screenshot captions and old mockup wording.

## Data Handling Review

Current app behavior:

- Saved calculations are stored locally on device storage.
- Reports can be exported or shared by the user.
- Analytics can be enabled by environment configuration.
- Crash reporting can be enabled by environment configuration.
- The app should not transmit raw tax amounts, TFNs, identity documents, bank details, or myGov credentials.

Store disclosure requirements:

- Apple app privacy answers must match enabled analytics, crash reporting, local storage, and export behavior.
- Google Play Data safety answers must match enabled analytics, crash reporting, local storage, and export behavior.
- Privacy policy must be updated whenever diagnostics, analytics, support, export, backup, or data deletion behavior changes.

## Screenshot Review

Do not submit the existing `mockups/` screenshots. They contain outdated wording such as professional calculator, ATO compliant calculations, professional guidance, and refund maximization.

Release screenshots must be captured from the current app build after this compliance pass.

## Remaining Production Risks

- Repository-hosted privacy/support pages are acceptable for preparation, but a stable branded website is preferable before broad production launch.
- In-app clear/delete data controls are still tracked under Priority 4.
- Store privacy questionnaires must be completed against the exact production build configuration.
- A qualified legal/tax review is still recommended before public release because this is a finance/tax-adjacent app.
