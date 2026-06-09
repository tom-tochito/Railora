# Railora Architecture Notes

Railora is a Next.js App Router prototype with server actions for mutations and client components for demo interactivity.

## Runtime Shape

- App UI uses seed data from `src/lib/data/seed.ts`.
- Server actions in `src/lib/actions/mutations.ts` validate inputs with Zod, check RBAC, call mock adapters, and record audit events.
- Domain rules live in `src/lib/domain`: AED/fils money helpers, escrow state machine, and double-entry ledger validation.
- Drizzle schema in `src/lib/db/schema.ts` mirrors the prototype relational model for Cloudflare D1.
- `src/middleware.ts` applies secure headers, no-store API responses, and a rate-limit placeholder header.

## Money and Ledger

All amounts are integer fils. Every money event creates a ledger transaction with at least two entries. Debits must equal credits or the write is rejected.

## Demo State

The end-to-end role-switching walkthrough stores the current escrow room state in browser localStorage. This is intentional for the MVP demo and should be replaced by persisted D1 order state before production work.
