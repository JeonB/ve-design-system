# VE Design System

## Principles

1. Tokens first: colors, spacing, radius, and typography start in `@ve/tokens`.
2. Components express intent: use variants for semantic meaning and size for density.
3. No ad-hoc styles in product apps: consume `@ve/ui` as the single source.
4. Keep runtime lean: vanilla-extract static CSS only.

## Initial Scope

- `Button` component with `variant` (`solid`, `secondary`, `outline`, `ghost`, `danger`, `dangerOutline`, `link`), `size` (`sm`, `md`, `lg`, `icon`), loading/icons/fullWidth/asChild/pressed.
- `ButtonGroup` for dialog footers and attached toolbars.
- `Field` + `Input` compound form pattern: label/description/error wiring, sizes, invalid/disabled, icon slots.
- Color modes (`light` / `dark` / `system`) via `createThemeContract` + `ThemeProvider`.
- `Card` compound surface that consumes theme color/shadow tokens.
- Storybook as visual contract for component behavior (toolbar theme switch).

## Next Steps

- Optional brand themes / `assignInlineVars` dynamic palettes.
- SSR FOUC prevention helpers for Next.js apps.
- Token categories already covered: `color`, `space`, `radius`, `font`, `component.*`, `motion`, `focus`, `shadow` — see Storybook `Foundations/Tokens`.
