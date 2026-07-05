# VE Design System

## Principles

1. Tokens first: colors, spacing, radius, and typography start in `@ve/tokens`.
2. Components express intent: use variants for semantic meaning and size for density.
3. No ad-hoc styles in product apps: consume `@ve/ui` as the single source.
4. Keep runtime lean: vanilla-extract static CSS only.

## Initial Scope

- `Button` component with `variant` (`solid`, `outline`, `ghost`, `danger`, `link`), `size` (`sm`, `md`, `lg`, `icon`), loading/icons/fullWidth/asChild.
- Storybook as visual contract for component behavior.

## Next Steps

- Add color modes (`light` and `dark`) with `createThemeContract` + `createTheme`.
- Add foundations stories: colors, spacing, typography.
- Add `Input` and `Card` using the same recipe pattern.
