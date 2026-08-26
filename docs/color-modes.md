# 설계서: Color Modes (Light / Dark)

> 작성일: 2026-08-26  
> 대상 패키지: `@ve/tokens`, `@ve/ui`, `apps/storybook`  
> 상태: 승인 후 PHASE별 구현

---

## 1. 배경과 목표

현재 `@ve/tokens`는 `createGlobalTheme(":root", …)` 한 벌로 light 색만 정의한다.  
제품·Storybook에서 **라이트/다크 전환**이 없으면 컴포넌트 비주얼 계약이 한 모드에만 고정된다.

### 목표

1. vanilla-extract 권장 패턴인 `createThemeContract` + `createTheme`로 **색상(및 모드 의존 그림자) 테마**를 분리한다.
2. `@ve/ui`에 `ThemeProvider` / `useTheme`를 제공해 런타임 모드 전환(`light` | `dark` | `system`)을 지원한다.
3. 기존 Button / Field / Input은 **토큰 참조만으로** 다크 모드에 자동 반응한다(컴포넌트별 하드코딩 금지).
4. Storybook에서 모드 토글이 가능하고, Card로 테마 소비 패턴을 검증한다.

### 비목표 (이번 범위 밖)

- 브랜드별 다중 테마(white-label) / 런타임 `assignInlineVars` 동적 팔레트
- prefers-contrast, high-contrast 테마
- SSR 쿠키 기반 flash 방지(Next.js 앱 연동) — 훅만 준비하고 앱 구현은 후속

---

## 2. 설계 원칙

| 원칙 | 적용 |
|------|------|
| Tokens first | 모드별 값은 `@ve/tokens`에만 존재. UI는 `vars.color.*` 참조 |
| Contract 안정성 | 색 토큰 키는 contract로 고정. light/dark가 동일 키를 구현 |
| 정적 토큰 분리 | space / radius / font / component 크기 등은 모드 불변 → global 유지 |
| 런타임 lean | CSS 변수 + 클래스 토글. 인라인 스타일 테마 주입 없음 |
| a11y | `color-scheme` CSS, `data-theme` 속성, 시스템 선호 반영 |

---

## 3. 토큰 아키텍처

### 3.1 분할

```
@ve/tokens
├── theme-contract.css.ts   # createThemeContract (color, shadow)
├── themes.css.ts           # lightTheme / darkTheme = createTheme(contract, values)
├── static.css.ts           # createGlobalTheme(:root) — space, radius, font, …
└── index.ts                # export vars(=contract), staticVars, themes, ThemeMode
```

기존 `theme.css.ts`의 `color` / `shadow`는 contract + themes로 이전한다.  
나머지 카테고리는 `static.css.ts`의 `:root`에 유지한다.

소비 측 호환:

```ts
// 컴포넌트는 계속 vars.color.background 등을 사용
import { vars } from "@ve/tokens";
// vars = theme contract 변수 참조 (CSS var)
```

`@ve/ui` 스타일은 import 경로만 유지하면 재빌드 후 다크 클래스 적용 시 값이 바뀐다.

### 3.2 Light / Dark 색상 매핑 (초안)

| Token | Light | Dark |
|-------|-------|------|
| background | `#ffffff` | `#0b1220` |
| foreground | `#111827` | `#f3f4f6` |
| primary | `#2563eb` | `#3b82f6` |
| primaryForeground | `#ffffff` | `#ffffff` |
| primaryHover | `#1d4ed8` | `#60a5fa` |
| primarySubtle | `#eff6ff` | `#1e3a5f` |
| secondary | `#f3f4f6` | `#1f2937` |
| secondaryForeground | `#374151` | `#e5e7eb` |
| secondaryHover | `#e5e7eb` | `#374151` |
| danger | `#dc2626` | `#f87171` |
| dangerForeground | `#ffffff` | `#111827` |
| dangerHover | `#b91c1c` | `#fca5a5` |
| dangerSubtle | `#fef2f2` | `#3f1d1d` |
| dangerBorder | `#fecaca` | `#7f1d1d` |
| muted | `#f3f4f6` | `#1f2937` |
| mutedForeground | `#6b7280` | `#9ca3af` |
| border | `#e5e7eb` | `#374151` |
| ring | `#2563eb` | `#60a5fa` |
| ghostHover | `rgba(17,24,39,0.06)` | `rgba(255,255,255,0.08)` |
| transparent | `transparent` | `transparent` |
| shadow.sm | light slate | darker slate |
| shadow.none | `none` | `none` |

대비·가독성은 Storybook 시각 검수 + 추후 토큰 튜닝으로 보완한다.

### 3.3 클래스 적용

```ts
export const lightTheme = createTheme(vars, { …light colors… });
export const darkTheme = createTheme(vars, { …dark colors… });
```

`ThemeProvider`가 루트 요소에 `lightTheme` 또는 `darkTheme` 클래스를 붙인다.  
동시에 `data-theme="light|dark"`와 `style.colorScheme`을 설정한다.

---

## 4. UI API

### 4.1 타입

```ts
type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
```

### 4.2 ThemeProvider

```tsx
<ThemeProvider defaultMode="system" storageKey="ve-theme">
  {children}
</ThemeProvider>
```

| Prop | 설명 |
|------|------|
| `defaultMode` | 초기 모드 (기본 `system`) |
| `storageKey` | localStorage 키 (기본 `ve-theme`) |
| `forcedMode` | Storybook 등에서 강제 light/dark (storage 무시) |
| `children` | ReactNode |

동작:

1. 마운트 시 storage → 없으면 `defaultMode`
2. `system`이면 `matchMedia('(prefers-color-scheme: dark)')`로 resolve
3. `document.documentElement`에 theme class + `data-theme` 적용
4. `system` 모드에서 media 변경 리스너로 자동 갱신

### 4.3 useTheme

```ts
const { mode, resolvedTheme, setMode, toggle } = useTheme();
```

- `mode`: 사용자 선택 (`light` | `dark` | `system`)
- `resolvedTheme`: 실제 적용 (`light` | `dark`)
- `setMode(mode)` / `toggle()`: light ↔ dark (system이면 resolved 반대쪽으로 고정)

Provider 밖 호출 시 명확한 에러.

### 4.4 ThemeToggle (선택, PHASE 후반)

Storybook/데모용 작은 버튼. 제품 패키지 export 여부: PHASE 4에서 결정.

---

## 5. Card (테마 소비 검증용)

다크 모드가 레이아웃 프리미티브까지 전파되는지 검증하기 위해 **Card**를 추가한다.

```tsx
<Card>
  <Card.Header>
    <Card.Title>…</Card.Title>
    <Card.Description>…</Card.Description>
  </Card.Header>
  <Card.Body>…</Card.Body>
  <Card.Footer>…</Card.Footer>
</Card>
```

- variant: `elevated` | `outline` | `muted`
- padding size: `sm` | `md` | `lg`
- 배경/보더는 `vars.color.*` / `vars.shadow.*`만 사용

---

## 6. Storybook

- `preview`에 `ThemeProvider` decorator + toolbar `theme` 글로벌 (`light` | `dark` | `system`)
- Foundations/Tokens 스토리에 현재 resolved theme 표시
- Components/Card, Button, Input을 다크에서 스냅샷성 검수

---

## 7. 테스트 계획

| 영역 | 케이스 |
|------|--------|
| tokens | light/dark theme class export, contract 키 존재 |
| ThemeProvider | mode 변경 시 data-theme / class, system + media mock |
| useTheme | Provider 밖 에러, setMode / toggle |
| Card | compound 렌더, variant data attributes |
| 회귀 | 기존 Button / Input / Field 테스트 전부 |

---

## 8. PHASE 계획 (일자별)

| PHASE | 날짜 | 산출물 | 완료 기준 |
|-------|------|--------|-----------|
| 0 | 2026-08-26 | 본 설계서 | `docs/color-modes.md` 커밋 |
| 1 | 2026-08-27 | contract + light/dark themes + static 분리 | tokens build / check-types |
| 2 | 2026-08-28 | ThemeProvider, useTheme | ui 단위 테스트 통과 |
| 3 | 2026-08-29 | 기존 theme.css 제거·마이그레이션, 컴포넌트 회귀 | 전 ui 테스트 + build |
| 4 | 2026-08-30 | Storybook decorator / toolbar | Storybook check-types |
| 5 | 2026-08-31 | Card + 테스트 + 스토리 | Card 테스트 통과 |
| 6 | 2026-09-01 | design.md / README 반영, 통합 검증 | lint·types·test green |

각 PHASE는 **구현 → 검증 → 해당 날짜로 커밋** 후 다음 PHASE로 진행한다.

---

## 9. 리스크와 완화

| 리스크 | 완화 |
|--------|------|
| `:root` createGlobalTheme와 theme class CSS var 충돌 | color/shadow만 contract로 이전, 정적은 별도 네임스페이스 |
| FOUC (초기 페인트 전 잘못된 테마) | documentElement에 class 적용; 앱 측 인라인 스크립트는 후속 |
| Storybook alias가 src를 직참조 | tokens/ui 소스 구조 변경 시 alias 경로 유지 |
| 기존 `vars` import 깨짐 | index에서 `vars` = contract로 re-export, 공개 API 유지 |

---

## 10. 공개 API 요약 (최종 예정)

```ts
// @ve/tokens
export { vars, staticVars, lightTheme, darkTheme };
export type { ThemeMode, ResolvedTheme };

// @ve/ui
export { ThemeProvider, useTheme, ThemeToggle, Card };
```

---

## 11. 승인 체크리스트

- [x] vanilla-extract `createThemeContract` / `createTheme` 사용
- [x] light / dark / system 모드
- [x] 기존 컴포넌트 하드코딩 색상 없이 토큰만 사용
- [x] PHASE별 일자 커밋 계획 (8/26–9/1)
- [x] Card로 테마 소비 검증
