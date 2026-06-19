# Railora One UI Overhaul Plan

## Discovery

Railora currently ships as a compact Next.js App Router prototype for UAE B2B escrow, invoice conversion, verification, dispute handling, trade scoring, audit export, and role switching. Existing routes are `/`, `/auth`, `/dashboard`, `/verify`, `/escrow/new`, `/escrow/[id]`, `/invoices`, `/score`, `/disputes/[id]`, `/admin`, and `/api/audit`.

The app already has useful local primitives in `src/components/ui`, server actions in `src/lib/actions/mutations.ts`, strict Zod schemas, RBAC checks, mock provider adapters, integer-fils money helpers, and double-entry ledger tests. The overhaul should preserve those contracts.

The visual system was inconsistent before this pass: teal/amber/red values, uppercase labels, card shadows, gradients, focus rings, and table treatments were repeated directly in pages and primitives. Several pages also computed seeded summaries inline, which made it harder to reuse payment, provider, settlement, privacy, and analytics views.

## Rollout Sequence

1. Establish Railora One tokens in `src/app/globals.css`: neutral light surfaces, designed dark mode, electric indigo primary, privacy violet, status colors, chart colors, focus, radius, elevation, and motion.
2. Move shell behavior into `/components/shell` with desktop rail, mobile bottom navigation, organization switcher, sandbox badge, command palette, notification affordance, privacy mode, and user menu.
3. Add display-only Railora One seed/view data for provider health, routing rules, settlement batches, payout batches, beneficiaries, API keys, webhooks, privacy scopes, analytics summaries, and command palette search.
4. Redesign existing pages around payment-rail orchestration while keeping escrow, verification, invoice, dispute, score, and admin flows operational.
5. Add additive prototype routes for `/payments`, `/routing`, `/settlement`, `/payouts`, `/merchants`, `/developer`, `/privacy`, and `/design-system`.
6. Update Playwright smoke and responsive coverage for the new surfaces.

## Guardrails

- Do not remove existing routes or server actions.
- Do not change authoritative money calculations away from integer fils.
- Do not calculate authoritative financial results in client components.
- Keep sensitive customer, beneficiary, API key, and webhook values masked by default.
- Preserve Next.js 15 App Router conventions, including awaited dynamic `params` and `searchParams`.
- Treat this as a sandbox prototype; no production payment, KYC/KYB, provider, queue, Durable Object, R2, or D1 behavior is introduced by the UI.
