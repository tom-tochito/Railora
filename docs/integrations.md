# Railora Mock Integration Notes

All integrations are mocked and live under `src/lib/integrations`.

- `uae-pass.ts`: returns a high-assurance mock identity assertion.
- `dul.ts`: simulates Dubai Unified Licence checks.
- `payments.ts`: exposes a payment adapter interface and sandbox payment implementation.
- `kyc.ts`: returns review-focused KYB placeholder results.
- `einvoice.ts`: validates required e-invoicing readiness fields without submitting anything.
- `notifications.ts`: queues mock email, SMS, and in-app notifications.
- `risk.ts`: produces deterministic low/medium/high risk examples.

Real providers should be added behind the existing adapter interfaces only after licensing, provider onboarding, compliance review, and production security controls are in place.
