# ve-design-system

vanilla-extract 기반 디자인 시스템 스타터입니다.

## Requirements

- Node.js 18+
- pnpm 10+

## Start

```bash
pnpm install
pnpm build
pnpm --filter storybook dev
```

## Workspace

- `packages/tokens`: theme tokens (`@vanilla-extract/css`)
- `packages/ui`: React UI primitives + recipes
- `apps/storybook`: component preview and documentation

## Quality Gates

```bash
pnpm lint
pnpm check-types
pnpm test
```
