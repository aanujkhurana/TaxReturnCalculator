# Beta Feedback Flow

Use this flow during TestFlight, Google Play internal testing, and closed beta periods.

## In-App Entry Point

Beta users can open:

About -> Beta Feedback

The link opens the repository beta feedback issue template:

https://github.com/aanujkhurana/TaxReturnCalculator/issues/new?template=beta-feedback.md

## Required Feedback Fields

The template asks for:

- Privacy confirmation that no sensitive tax or identity records are included.
- Feedback type.
- App version, build number, platform, device model, OS version, and app environment.
- Selected financial year.
- App step or tax area affected.
- Reproduction steps.
- Expected result and actual result.
- Rounded or anonymized calculation context.
- ATO source comparison, if relevant.

## Triage Rules

- Treat calculation concerns as release blockers until reproduced or ruled out.
- Treat privacy, crash, save/export data loss, and accessibility blockers as release blockers.
- Do not ask beta users for TFNs, identity documents, bank details, myGov credentials, or exact tax records.
- Ask for rounded or anonymized scenarios when a calculation example is needed.
- Link any confirmed calculation issue to the affected tax-year source note in `src/constants/taxConstants.ts`.

## Release Exit Criteria

- No unresolved release-blocking calculation issues.
- No unresolved crash on core calculation, save, export, or About/support flows.
- No unresolved privacy wording mismatch against the current build.
- Known limitations are recorded in release notes or `TASKS.md`.
