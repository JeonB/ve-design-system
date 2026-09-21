# VE Design System

## Principles

1. Tokens first: colors, spacing, radius, and typography start in `@ve/tokens`.
2. Components express intent: use variants for semantic meaning and size for density.
3. No ad-hoc styles in product apps: consume `@ve/ui` as the single source.
4. Keep runtime lean: vanilla-extract static CSS only.

## Initial Scope

- `Button` component with `variant` (`solid`, `secondary`, `outline`, `ghost`, `danger`, `dangerOutline`, `link`), `size` (`sm`, `md`, `lg`, `icon`), loading/icons/fullWidth/asChild/pressed.
- `ButtonGroup` for dialog footers and attached toolbars.
- `Field` + `Input` / `Textarea` / `Select` / `Checkbox` compound form pattern.
- `CheckboxGroup` / `RadioGroup` for multi- and single-select fieldsets.
- `Switch` for immediate on/off settings (`role="switch"`).
- Color modes (`light` / `dark` / `system`) via `createThemeContract` + `ThemeProvider` + `ThemeScript` (FOUC).
- `Card` compound surface that consumes theme color/shadow tokens.
- `Stack` / `Separator` layout primitives for gap and dividers.
- `Badge` with semantic variants (`neutral`, `primary`, `success`, `warning`, `danger`, `outline`).
- `Dialog` modal with focus trap, Esc/overlay dismiss, overlay tokens.
- `Drawer` side panel overlay (shares focus trap with Dialog).
- `ToastProvider` / `useToast` for non-modal feedback (max 3, auto-dismiss).
- `Skeleton` / public `Spinner` loading indicators.
- Storybook as visual contract for component behavior (toolbar theme switch).

## Next Steps

- Optional brand themes / `assignInlineVars` dynamic palettes.
- Custom listbox Select / Combobox.
- Visual regression (Chromatic) optional CI.
