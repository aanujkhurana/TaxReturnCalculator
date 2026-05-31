# AGENTS.md

## Project Overview

This is an Expo React Native app for estimating Australian individual tax return outcomes. The main app entry is `index.ts`, which registers `App.tsx`; `App.tsx` delegates to `src/App.tsx`.

## Common Commands

- Install dependencies: `npm install`
- Start Expo: `npm start`
- Run on iOS simulator: `npx expo start --ios --localhost`
- Type-check: `npm run type-check`
- Run calculation tests: `npm test`
- Generate the HTML test report: `npm run test:report`

## Code Layout

- `src/App.tsx`: main screen flow and calculator UI.
- `src/screens/`: home, splash, and about screens.
- `src/components/`: reusable form and UI components.
- `src/services/taxCalculationService.ts`: tax calculation logic.
- `src/services/pdfService.ts`: PDF generation and sharing.
- `src/services/storageService.ts`: local persistence via AsyncStorage.
- `src/constants/`: tax constants, app constants, themes, and help text.
- `src/utils/`: formatting, validation, and helper utilities.
- `src/__tests__/`: lightweight custom tax calculator test runner.

## Development Notes

- Keep tax-rate and threshold changes centralized in `src/constants/taxConstants.ts`.
- Prefer updating `src/services/taxCalculationService.ts` for calculation behavior instead of duplicating formulas in UI components.
- Preserve the app's TypeScript-first workflow; do not add generated JavaScript files under `src/`.
- The app uses Expo-managed React Native. Avoid adding native iOS or Android project files unless the workflow is intentionally changed.
- Validate mobile UI changes in an iOS simulator when practical, especially around keyboard, safe area, and scroll behavior.

## Testing Notes

- `npm run type-check` should pass before handing off code changes.
- `npm test` runs the custom test framework in `src/__tests__/run-tests.ts` and writes `test-report.html`.
- The test report file is generated output; update it only when intentionally refreshing the report.
