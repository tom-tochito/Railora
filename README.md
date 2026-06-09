# Railora MVP Prototype

Railora is a UAE/Dubai B2B escrow, invoice, verification, dispute, and trade-score prototype. It is built as a polished investor-demo app with mock integrations only.

Important: Railora does not move real money, does not perform production KYC/KYB, and does not claim to be licensed. Every payment, identity, licence, sanctions, e-invoicing, document scan, queue, and reconciliation flow is sandbox/demo.

## Run The App

From a fresh checkout:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-style local check:

```bash
pnpm build
pnpm start
```

Useful scripts:

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm db:seed
pnpm preview
```

## Key User Journeys

### Buyer Escrow Journey

1. Open `/auth` and sign in as buyer.
2. Run verification from `/verify`.
3. Create an order from `/escrow/new`.
4. Fund escrow in sandbox mode from the created escrow room.
5. Try the invalid transition button in the escrow room to see state-machine errors.

### Seller Fulfilment Journey

1. Open `/auth` and sign in as seller.
2. Open `/escrow/ord-006`.
3. Click `Seller submits proof`.
4. Click `Request release`.
5. Review milestones, evidence upload, activity feed, and ledger preview.

### Buyer Release Journey

1. Open `/auth` and sign in as buyer.
2. Open `/escrow/ord-006`.
3. Click `Approve release`.
4. Confirm the ledger preview shows balanced debit and credit totals.

### Dispute Journey

1. Open `/disputes/disp-001`.
2. Review the dispute reason, evidence gallery, and event log.
3. Switch to platform admin from `/auth`.
4. Return to `/disputes/disp-001` and test the admin resolution controls.

### Invoice To Escrow Journey

1. Open `/invoices`.
2. Review invoice status, VAT, and e-invoicing readiness fields.
3. Click `Create invoice`.
4. Click `Convert to escrow`.
5. Use `Mock PDF` to show where invoice export would sit.

### Trade Score Journey

1. Open `/score`.
2. Review completed orders, on-time delivery, dispute rate, refund behaviour, verification depth, and repeat counterparty signals.
3. Use the explainability panel to describe how Railora builds trust signals without presenting them as a regulated credit score.

### Platform Admin Journey

1. Open `/auth` and sign in as platform risk/admin.
2. Open `/admin`.
3. Review flagged transactions, verification failures, risk scores, and audit trail.
4. Click `Trigger reconciliation`.
5. Open `/api/audit` to inspect the audit log JSON.

## Stack

- Next.js App Router, React, strict TypeScript
- Tailwind CSS with shadcn/ui-style local components
- Zod and React Hook Form
- Drizzle ORM schema for Cloudflare D1 / SQLite
- Mock R2 document metadata abstraction
- Mock payment, UAE PASS, DUL, KYC, e-invoicing, notifications, and risk adapters
- Vitest unit tests and Playwright smoke test
- OpenNext Cloudflare Workers config

## Data

Seed data includes 3 buyers, 3 sellers, 6 escrow orders, 2 disputes, 4 invoices, 5 document records, 3 risk score examples, ledger transactions, audit events, and notifications.

## Cloudflare

`wrangler.jsonc` defines placeholder D1 and R2 bindings. Replace the demo IDs and bucket names before deploying a real worker.

See `docs/architecture.md`, `docs/integrations.md`, and `docs/compliance.md`.
