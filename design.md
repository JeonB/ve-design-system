# VE Design System

## Principles

1. Tokens first: colors, spacing, radius, and typography start in `@ve/tokens`.
2. Components express intent: use variants for semantic meaning and size for density.
3. No ad-hoc styles in product apps: consume `@ve/ui` as the single source.
4. Keep runtime lean: vanilla-extract static CSS only.

## Initial Scope

- `Button` component with `variant` (`solid`, `secondary`, `outline`, `ghost`, `danger`, `dangerOutline`, `link`), `size` (`sm`, `md`, `lg`, `icon`), loading/icons/fullWidth/asChild/pressed.
- `ButtonGroup` for dialog footers and attached toolbars.
- Storybook as visual contract for component behavior.

## Next Steps

- Add color modes (`light` and `dark`) with `createThemeContract` + `createTheme`.
- Token categories: `color`, `space`, `radius`, `font`, `component.*`, `motion`, `focus`, `shadow` — see Storybook `Foundations/Tokens`.
- Add `Input` and `Card` using the same recipe pattern.
