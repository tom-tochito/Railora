# Railora One Design System

Railora One is a restrained fintech operations system: precise, calm, global, private, and reliable. It should feel like a payment-rail operating system rather than an accounting dashboard or consumer bank clone.

## Tokens

Core tokens live in `src/app/globals.css` and are exposed through Tailwind CSS v4 `@theme inline`. Components should use token-backed utilities such as `bg-surface`, `text-muted`, `border-border`, `bg-brand`, `text-privacy`, and state tones rather than hardcoded product colors.

Primary tones:
- Neutral surfaces for most layout.
- Electric indigo for primary action and active navigation.
- Privacy violet for privacy controls and data-sharing surfaces.
- Signal green, amber, and red for confirmed, review, and urgent financial states.

## Components

Use shared primitives in `src/components/ui` for buttons, badges, fields, cards, and table scroll containers. Domain components live under `components/shell`, `components/privacy`, and the new finance/product folders as the application expands.

Financial amounts use Geist Mono or tabular numerals through the `amount-tabular` utility. Identifiers, API keys, and ledger references should also use mono or tabular styling.

## Interaction

Motion is short and stateful: 150-250ms transitions, reduced-motion support, no decorative constant pulsing. Use visible focus rings on every interactive element. Dialogs, sheets, menus, and command palette surfaces use subtle elevation only.

## Density

Merchant and developer surfaces favor calm scannability. Risk, reconciliation, settlement, and admin surfaces may be denser but must preserve readable touch targets and clear status language.
