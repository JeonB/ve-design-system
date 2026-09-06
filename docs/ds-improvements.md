# 설계서: DS 개선 및 추가 기능 (ThemeScript / Textarea / Badge)

> 작성일: 2026-09-02  
> 대상 패키지: `@ve/tokens`, `@ve/ui`, `apps/storybook`  
> 선행: [`color-modes.md`](./color-modes.md) (8/26–9/1 완료)  
> 상태: PHASE별 구현

---

## 1. 배경과 목표

컬러 모드·Card까지 도입된 상태에서, 설계상 **후속**으로 남았거나 실무에서 바로 막히는 빈틈이 세 가지다.

| 유형 | 항목 | 왜 지금인가 |
|------|------|-------------|
| 개선 | **ThemeScript (FOUC 방지)** | `ThemeProvider`는 마운트 후에야 클래스를 붙인다. SSR/첫 페인트에서 light→dark 깜빡임이 난다. |
| 추가 | **Textarea** | Field+Input만 있으면 긴 텍스트·코멘트 UI를 앱에서 ad-hoc으로 만든다. |
| 추가 | **Badge** | 상태·카운트·필터 칩이 Card/테이블에서 가장 자주 쓰이는 비상호작용 표식이다. |

### 목표

1. hydration 전에 `documentElement`에 테마 클래스·`data-theme`·`color-scheme`을 적용하는 **인라인 스크립트 헬퍼**를 제공한다.
2. Input과 동일 토큰·Field 컨텍스트를 쓰는 **Textarea**를 추가한다.
3. semantic variant 기반 **Badge**를 추가하고 Storybook·테스트로 계약을 고정한다.

### 비목표

- 브랜드 다중 테마 / `assignInlineVars` 동적 팔레트
- Select / Checkbox / Dialog (다음 사이클)
- 시각 회귀(Chromatic) CI — 로컬 Storybook·Vitest만

---

## 2. 개선 상세: ThemeScript

### 문제

```
HTML 파싱 → 첫 페인트(기본 light :root) → React hydrate → ThemeProvider effect → dark 적용
```

storage가 `dark`이거나 system이 dark면 **한 프레임 light가 보인다**.

### 해결

`<head>`(또는 `body` 최상단)에 동기 실행 스크립트를 넣어 hydration 전에 테마를 맞춘다.

```ts
// @ve/ui
getThemeInitScript({ storageKey?: string; defaultMode?: ThemeMode }): string
// 또는
<ThemeScript storageKey="ve-theme" defaultMode="system" />
```

`ThemeScript`는 Next.js `Script`/`dangerouslySetInnerHTML` 패턴을 위해 **문자열 script**와 **React 컴포넌트** 둘 다 제공한다.

### 스크립트 동작

1. `localStorage[storageKey]` 읽기 (`light` | `dark` | `system`)
2. 없거나 `system`이면 `matchMedia('(prefers-color-scheme: dark)')`
3. `document.documentElement`에:
   - `lightTheme` / `darkTheme` 클래스 토글
   - `data-theme="light|dark"`
   - `style.colorScheme`

클래스 문자열은 **빌드 타임에 `@ve/tokens`의 `lightTheme` / `darkTheme` 값을 인라인**한다.  
런타임에 tokens 모듈을 스크립트에서 import하지 않는다(인라인 IIFE).

### ThemeProvider 정합

- 동일 `storageKey` / 동일 resolve 규칙
- Provider 마운트 시 이미 맞는 클래스면 no-op에 가깝게 유지(재적용은 허용)
- `forcedMode`는 스크립트와 무관(Storybook 전용)

### 테스트

- `getThemeInitScript`가 light/dark 클래스명 문자열을 포함하는지
- jsdom에서 `eval`/Function으로 스크립트 실행 후 `data-theme` 검증(가능 범위)

---

## 3. 추가 상세: Textarea

### API

```tsx
<Field>
  <Field.Label>Notes</Field.Label>
  <Textarea name="notes" rows={4} />
  <Field.Description>Optional context</Field.Description>
</Field>
```

| Prop | 설명 |
|------|------|
| `size` | `sm` \| `md` \| `lg` (Input과 동일 타이포·패딩 스케일) |
| `invalid` / `disabled` / `required` / `fullWidth` | Field 컨텍스트 상속 (Input과 동일) |
| `resize` | `none` \| `vertical`(기본) \| `both` |
| 나머지 | 표준 `textarea` HTML attributes (`rows`, `cols`, …) |

### 스타일

- Input의 shell 패턴을 재사용하되 **멀티라인**: `align-items: flex-start`, `min-height` by size
- focus-within ring, invalid border = Input과 동일 토큰
- left/right icon은 **이번 범위 제외**(멀티라인과 아이콘 정렬 복잡도)

### 테스트

- Field id / aria-describedby / invalid / disabled 상속
- `resize` data attribute 또는 style 반영

---

## 4. 추가 상세: Badge

### API

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger" size="sm">3</Badge>
```

| Prop | 값 |
|------|-----|
| `variant` | `neutral` \| `primary` \| `success` \| `warning` \| `danger` \| `outline` |
| `size` | `sm` \| `md` |
| `children` | ReactNode |

비상호작용: 기본 `span`. `asChild`는 이번 범위 제외.

### 토큰

기존 color 팔레트로 매핑한다. success/warning이 없으면 **tokens에 최소 semantic 색을 추가**한다.

| Badge | 배경 / 전경 (light 기준) |
|-------|-------------------------|
| neutral | muted / mutedForeground |
| primary | primarySubtle / primary |
| success | 신규 `successSubtle` / `success` |
| warning | 신규 `warningSubtle` / `warning` |
| danger | dangerSubtle / danger |
| outline | transparent + border / foreground |

dark 팔레트도 `color-values.ts`에 함께 추가한다.

### 테스트·Storybook

- variant / size data attributes
- Components/Badge 스토리 + dark toolbar 검수

---

## 5. PHASE 계획 (9/2–9/6)

| PHASE | 날짜 | 산출물 | 완료 기준 |
|-------|------|--------|-----------|
| 0 | 2026-09-02 | 본 설계서 | `docs/ds-improvements.md` 커밋 |
| 1 | 2026-09-03 | `getThemeInitScript` + `ThemeScript` + 테스트 | ui test green |
| 2 | 2026-09-04 | Textarea (+ css) + Field 연동 + 테스트·스토리 | ui test green |
| 3 | 2026-09-05 | success/warning 토큰 + Badge + 테스트·스토리 | tokens+ui build/test |
| 4 | 2026-09-06 | design.md / README / 설계서 완료 기록, 통합 검증 | check-types + test green |

각 PHASE는 **구현 → 테스트 → 해당 날짜 커밋** 후 다음으로 진행한다.

---

## 6. 공개 API (예정)

```ts
// @ve/ui
export { ThemeScript, getThemeInitScript };
export { Textarea };
export type { TextareaProps };
export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
```

---

## 7. 리스크

| 리스크 | 완화 |
|--------|------|
| 인라인 스크립트와 Provider 클래스명 불일치 | tokens 빌드 산출 className을 스크립트 생성 시 import |
| Textarea/Input 스타일 드리프트 | 공유 recipe 베이스 또는 동일 토큰 셀렉터 복사 후 주석으로 동기화 포인트 명시 |
| success/warning 토큰이 Button까지 파급 | Badge만 우선 사용; Button success variant는 비목표 |

---

## 8. 체크리스트

- [x] ThemeScript FOUC 방지
- [x] Textarea + Field
- [x] Badge + semantic 토큰
- [x] 9/2–9/6 일자별 커밋
- [x] docs 반영

## 9. 구현 완료 기록

| PHASE | 날짜 | 커밋 요지 |
|-------|------|-----------|
| 0 | 2026-09-02 | 설계서 `docs/ds-improvements.md` |
| 1 | 2026-09-03 | ThemeScript / getThemeInitScript |
| 2 | 2026-09-04 | Textarea + Field |
| 3 | 2026-09-05 | success/warning 토큰 + Badge |
| 4 | 2026-09-06 | design.md / README 반영·통합 검증 |
