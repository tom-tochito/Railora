# Railora MVP Prototype

Railora is a UAE/Dubai B2B escrow, invoice, verification, dispute, and trade-score prototype. It is built as a polished investor-demo app with mock integrations only.

Important: Railora does not move real money, does not perform production KYC/KYB, and does not claim to be licensed. Every payment, identity, licence, sanctions, e-invoicing, document scan, queue, and reconciliation flow is sandbox/demo.

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm db:seed
pnpm preview
```

## Demo Flow

1. Open `/auth` and sign in as buyer.
2. Run verification from `/verify`.
3. Create an order from `/escrow/new`.
4. Fund escrow in sandbox mode from the created escrow room.
5. Switch to seller from `/auth`, return to `/escrow/ord-006`, submit proof, and request release.
6. Switch back to buyer and approve release.
7. Switch to platform admin and inspect `/admin` plus `/api/audit`.

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
