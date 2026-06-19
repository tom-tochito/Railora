# Railora One Component Migration

## Current State

Existing pages import shared primitives from `src/components/ui` plus app-level helpers such as `AppShell`, `PageHeader`, metrics, badges, and responsive record lists. These imports remain valid.

## New Organization

- `components/shell`: app shell, navigation, command palette, workspace controls.
- `components/privacy`: masking and privacy disclosure controls.
- `components/finance`: amount, balance, settlement, and ledger display components.
- `components/payments`: transaction feed, table, filters, and detail panels.
- `components/routing`: Rail Map provider health, rules, simulation, and route traces.
- `components/settlement`: settlement batches and reconciliation workspace.
- `components/merchants`: merchant profile and KYB cards.
- `components/risk`: operations queues, cases, evidence, and decision panels.
- `components/developer`: API keys, webhooks, logs, event catalog, and simulator surfaces.
- `components/ui`: low-level primitives only.

## Migration Rule

Move repeated presentation into domain components when at least two pages share the pattern. Keep server data access, mutations, permissions, authoritative calculations, and formatting helpers outside presentational client components.
