# Railora One Accessibility

Railora One targets WCAG 2.2 AA expectations for a financial operations console.

## Requirements

- Every interactive element must be keyboard reachable.
- Focus states must be visible against light and dark surfaces.
- Statuses must include text, not color alone.
- Sensitive values must be masked by default and have explicit reveal labels.
- Command palette and mobile menus must declare dialog/menu intent with labels.
- Tables must remain horizontally scrollable inside containers rather than causing page-level overflow.
- Mobile touch targets must remain at least 44px tall and wide.
- Reduced-motion preferences are respected globally.
- RTL layout must not break major page grids, shell, or record lists.

## Verification

Use Playwright responsive smoke tests across 320, 390, 640, 768, and 1440 widths. Add targeted manual checks for keyboard command palette open/close, Escape dismissal, mobile More menu, privacy reveal buttons, and focus movement.
