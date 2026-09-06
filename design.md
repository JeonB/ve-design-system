# VE Design System

## Principles

1. Tokens first: colors, spacing, radius, and typography start in `@ve/tokens`.
2. Components express intent: use variants for semantic meaning and size for density.
3. No ad-hoc styles in product apps: consume `@ve/ui` as the single source.
4. Keep runtime lean: vanilla-extract static CSS only.

## Initial Scope

- `Button` component with `variant` (`solid`, `secondary`, `outline`, `ghost`, `danger`, `dangerOutline`, `link`), `size` (`sm`, `md`, `lg`, `icon`), loading/icons/fullWidth/asChild/pressed.
- `ButtonGroup` for dialog footers and attached toolbars.
- `Field` + `Input` / `Textarea` compound form pattern: label/description/error wiring, sizes, invalid/disabled, icon slots (Input).
- Color modes (`light` / `dark` / `system`) via `createThemeContract` + `ThemeProvider` + `ThemeScript` (FOUC).
- `Card` compound surface that consumes theme color/shadow tokens.
- `Badge` with semantic variants (`neutral`, `primary`, `success`, `warning`, `danger`, `outline`).
- Storybook as visual contract for component behavior (toolbar theme switch).

## Next Steps

- Optional brand themes / `assignInlineVars` dynamic palettes.
- Select / Checkbox / Dialog primitives.
- Visual regression (Chromatic) optional CI.
