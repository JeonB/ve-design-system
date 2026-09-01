# ve-design-system

vanilla-extract 기반 디자인 시스템 스타터입니다.

## Requirements

- Node.js 18+
- pnpm 10+

## Start

```bash
pnpm install
pnpm build          # @ve/tokens, @ve/ui dist 생성 — 아래 "모듈 해석" 참고
pnpm --filter storybook dev
```

## Workspace

- `packages/tokens`: theme tokens (`@vanilla-extract/css`) — static + color contract (light/dark)
- `packages/ui`: React UI primitives + recipes (`ThemeProvider`, `Button`, `Field`, `Input`, `Card`)
- `apps/storybook`: component preview and documentation (toolbar theme switch)

## Color modes

앱 루트를 `ThemeProvider`로 감싸면 light / dark / system 전환이 가능합니다.

```tsx
import { ThemeProvider, ThemeToggle, Card, Button } from "@ve/ui";

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <ThemeToggle />
      <Card>
        <Card.Header>
          <Card.Title>Hello</Card.Title>
        </Card.Header>
        <Card.Body>
          <Button>Save</Button>
        </Card.Body>
      </Card>
    </ThemeProvider>
  );
}
```

설계 상세: [`docs/color-modes.md`](docs/color-modes.md)

## Quality Gates

```bash
pnpm lint
pnpm check-types
pnpm test
```

---

## `@ve/tokens` 모듈 해석 오류 (TS2307)

`packages/ui/src/components/button.css.ts`에서 아래 오류가 나는 경우:

```
Cannot find module '@ve/tokens' or its corresponding type declarations.
```

### 원인

`@ve/tokens`는 **소스(`src/`)가 아니라 빌드 산출물(`dist/`)만** 노출합니다.

```json
// packages/tokens/package.json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  }
}
```

TypeScript(IDE 포함)는 `package.json`의 `exports` / `types` 필드를 따라 `@ve/tokens` → `packages/tokens/dist/index.d.ts`를 찾습니다.  
**`pnpm build`를 한 번도 실행하지 않았거나 `dist/`가 없으면** 선언 파일이 없어 TS2307이 발생합니다.

| 환경 | `@ve/tokens` 해석 경로 | 빌드 없이 동작? |
|------|------------------------|-----------------|
| IDE / `tsc --noEmit` | `packages/tokens/dist/` | ❌ |
| Storybook (Vite) | `packages/tokens/src/` (alias) | ✅ |

Storybook은 `.storybook/main.ts`에서 소스로 alias를 걸어 두었기 때문에 `dist` 없이도 dev가 됩니다.  
반면 `@ve/ui`의 `check-types`와 IDE는 alias가 없어 **반드시 `@ve/tokens` 빌드가 선행**되어야 합니다.

`turbo.json`의 `check-types`는 `^check-types`만 의존하고 `^build`는 의존하지 않으므로, 루트에서 `pnpm check-types`만 실행해도 동일 오류가 날 수 있습니다.

### 해결

```bash
# 의존 패키지 dist 생성
pnpm --filter @ve/tokens build
# 또는 워크스페이스 전체
pnpm build
```

이후 `pnpm --filter @ve/ui check-types`가 통과합니다.

### 재발 방지 (선택)

1. **클론 직후 `pnpm build`를 필수 단계로 문서화** (현재 README Start 섹션)
2. `turbo.json`에서 `check-types`에 `"dependsOn": ["^build"]` 추가
3. 개발용 `tsconfig`에 paths 추가 — 예: `"@ve/tokens": ["../tokens/src/index.ts"]`
4. `package.json` `exports`에 `development` 조건으로 `src` 경로 노출

---

## 대규모 React + Vite + JS + CSS Modules → 본 구조 전환 시나리오

기존 단일 앱(React 19, Vite, JavaScript, CSS Modules)을 **pnpm 모노레포 + vanilla-extract + recipe 패턴**으로 옮길 때의 단계별 시나리오입니다.

### 현재 목표 아키텍처

```
ve-design-system/
├── packages/
│   ├── tokens/     @ve/tokens  — createGlobalTheme, 디자인 토큰
│   └── ui/         @ve/ui      — .css.ts(recipe) + .tsx 컴포넌트
└── apps/
    └── storybook/              — 시각 계약·문서
```

- 스타일: CSS Modules → **vanilla-extract** (`style`, `recipe`)
- 토큰: SCSS 변수 / `:root` / 하드코딩 → **`@ve/tokens` 단일 소스**
- 컴포넌트: 앱 내 `components/` → **`@ve/ui` 패키지**
- 런타임: zero-runtime 정적 CSS (빌드 시 추출)

### Phase 0 — 준비 (1–2주)

| 항목 | 작업 |
|------|------|
| 인벤토리 | CSS Modules 파일·공통 색/간격/타이포 사용처 목록화 |
| 토큰 추출 | `--color-*`, spacing, radius, font를 스프레드시트 또는 JSON으로 정리 |
| 경계 정의 | "디자인 시스템" vs "앱 전용" 컴포넌트 구분 (Button, Input 등 vs 페이지 레이아웃) |
| 브랜치 전략 | `feat/design-system` 장기 브랜치, 기능 개발과 병행 |

**산출물**: 토큰 초안, 이전 대상 컴포넌트 우선순위(사용 빈도·중복도 기준)

### Phase 1 — 모노레포 골격 (1주)

1. 루트에 `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json` 구성 (본 저장소와 동일 패턴)
2. `packages/tokens` 생성 — `createGlobalTheme`로 기존 CSS 변수 이식
3. `packages/ui` 생성 — vanilla-extract + tsup 빌드 파이프라인
4. `apps/storybook` — Vite alias로 **소스 직접 참조** (개발 속도)

```bash
pnpm install
pnpm build    # 소비 앱/IDE 타입 해석을 위해 필수
```

**검증**: Storybook에서 토큰·Button 스토리 렌더, `pnpm check-types` 통과

### Phase 2 — 토큰·기초 컴포넌트 이전 (2–4주, 점진)

**토큰 (`@ve/tokens`)**

```ts
// packages/tokens/src — color contract + static :root tokens
// color-theme.css.ts: createThemeContract + light(:root) / darkTheme(class)
// static.css.ts: space, radius, font, component, …
import { vars, lightTheme, darkTheme } from "@ve/tokens";
```

**컴포넌트 패턴 (`@ve/ui`)**

| 기존 (CSS Modules) | 전환 후 |
|--------------------|---------|
| `Button.module.css` + `className` 조합 | `button.css.ts` (`recipe`) + `button.tsx` |
| `styles.primary`, `styles.large` | `buttonStyles({ variant: "solid", size: "md" })` |
| 글로벌 SCSS 변수 | `vars.color.primary` 등 토큰 참조 |

**이전 순서 권장**

1. Button, Input, Badge 등 **variant가 있는 primitive**
2. Card, Stack 등 **레이아웃 primitive**
3. 앱 전용 복합 컴포넌트는 Phase 4까지 유지

**TypeScript 전환**: `@ve/ui` 컴포넌트는 `.tsx`, 스타일 recipe는 `.css.ts`, Storybook은 `.stories.tsx`를 사용합니다.

### Phase 3 — 소비 앱 연동 (2–3주)

기존 Vite 앱을 `apps/web` 등으로 편입하거나, 별도 저장소에서 workspace 패키지로 참조:

```json
"dependencies": {
  "@ve/ui": "workspace:*",
  "@ve/tokens": "workspace:*"
}
```

**Vite 설정**

```ts
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  // 개발: alias로 src 참조 가능 (Storybook과 동일)
  // 프로덕션: pnpm build 후 dist 참조
});
```

**앱 전역**

```js
// main.tsx
import "@ve/tokens"; // :root 테마 CSS 주입
```

**교체 전략 (Strangler Fig)**

1. 새 화면부터 `@ve/ui` 사용
2. 기존 화면은 터치할 때만 CSS Modules → `@ve/ui`로 교체
3. 동일 UI는 Storybook 스토리를 **회귀 기준**으로 추가

### Phase 4 — CSS Modules 제거 (지속, 1–3개월)

| 단계 | 내용 |
|------|------|
| 4a | 앱 내 `*.module.css` import 개수 주간 추적 |
| 4b | 미사용 모듈 삭제, 중복 스타일 `@ve/ui` recipe로 흡수 |
| 4c | 앱 전용 스타일만 vanilla-extract `style()` 로컬 파일로 유지 (필요 시) |
| 4d | CSS Modules용 Vite/PostCSS 설정 제거 |

**완료 기준**: 앱에 `.module.css` 0건, 디자인 토큰 변경이 `@ve/tokens` 한 곳에서 반영됨

### Phase 5 — 품질·운영 (병행)

- **CI**: `pnpm build` → `lint` → `check-types` → `test` (의존 패키지 빌드 순서 보장)
- **시각 회귀**: Storybook + Chromatic 등 (선택)
- **버전**: 내부 패키지는 `workspace:*`, 외부 배포 시 Changesets 검토
- **다크 모드**: `createThemeContract` + `createTheme` (design.md Next Steps)

### 리스크와 완화

| 리스크 | 완화 |
|--------|------|
| `dist` 미빌드로 IDE/CI 타입 오류 | 클론 후 `pnpm build` 필수, turbo `check-types` → `^build` 의존 |
| JS ↔ TS 혼재 | 소비 앱은 JS 가능, `@ve/ui`는 TS/TSX + d.ts export |
| 대량 일괄 교체 | 페이지 단위·컴포넌트 단위 PR, Storybook 스냅샷 |
| 번들 크기 | vanilla-extract는 빌드 타임 추출; 미사용 recipe는 tree-shake |
| 팀 학습 곡선 | recipe 패턴·토큰 규칙을 Storybook docs에 고정 |

### 마일스톤 체크리스트

- [ ] Phase 0: 토큰·컴포넌트 인벤토리 완료
- [ ] Phase 1: 모노레포 + Storybook + 첫 Button 스토리
- [ ] Phase 2: 상위 5개 primitive `@ve/ui` 이전
- [ ] Phase 3: 프로덕션 앱 1개 라우트 `@ve/ui` 적용
- [ ] Phase 4: CSS Modules import 50% → 0%
- [ ] Phase 5: CI green, 토큰 변경 → 전 앱 반영 검증

### 참고

- 디자인 원칙: [design.md](./design.md)
- 컴포넌트 계약: `apps/storybook` 스토리
- 패키지 빌드: 각 `packages/*/tsup.config.ts` + `@vanilla-extract/esbuild-plugin`
