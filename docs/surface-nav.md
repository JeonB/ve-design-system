# 설계서: 서피스·아이덴티티·내비 확장 (Alert / Avatar / Tabs)

> 작성일: 2026-09-22  
> 대상: `@ve/tokens`, `@ve/ui`, `apps/storybook`  
> 선행: [`layout-feedback.md`](./layout-feedback.md), [`form-overlay.md`](./form-overlay.md)  
> 기간: 2026-09-22 ~ 2026-09-25

---

## 1. 배경과 목표

Toast·Skeleton까지 갖춘 상태에서, 제품 화면에서 바로 막히는 빈틈은 **인라인 상태 배너**, **사용자/엔티티 아바타**, **섹션 탭 내비**이다.

| 유형 | 항목 | 이유 |
|------|------|------|
| 추가 | **Alert** | Toast는 일시적. 폼 상단·빈 상태·권한 안내처럼 **남는** 피드백이 필요 |
| 추가 | **Avatar** | 멤버·작성자 표시. img + 이니셜 fallback을 앱마다 ad-hoc으로 만들지 않기 |
| 추가 | **Tabs** | Card/설정 패널 내 섹션 전환. 네이티브-lean compound로 키보드 내비 |
| 개선 | **피드백 역할 분리** | Toast = 비모달·자동 dismiss / Alert = 인라인·수동 유지. a11y 폴리시에 역할 명시 |

### 비목표

- Combobox / 커스텀 listbox Select
- Tooltip / Popover / Popover 포지셔닝
- AvatarGroup (후속)
- Chromatic CI
- 브랜드 다중 테마

---

## 2. Alert

```tsx
<Alert variant="success" title="Saved">
  Draft is up to date.
</Alert>

<Alert variant="danger" title="Payment failed">
  Check your card and try again.
</Alert>
```

| Prop | 설명 |
|------|------|
| `variant` | `neutral` \| `info` \| `success` \| `warning` \| `danger` |
| `title` | 선택. 있으면 강조 제목 |
| `children` | 본문 |
| `role` | 기본: `status`(info/success/neutral), `alert`(warning/danger) |

- 토큰: Badge/Toast와 동일 semantic subtle 배경 + border
- 비상호작용 서피스(닫기 버튼은 후속; 필요 시 소비 앱에서 `Button` ghost 배치)

---

## 3. Avatar

```tsx
<Avatar src="/a.png" alt="Ada Lovelace" />
<Avatar alt="Grace Hopper" fallback="GH" size="lg" />
```

| Prop | 설명 |
|------|------|
| `src` / `alt` | 이미지. `alt` 필수(장식이면 `alt=""` + `aria-hidden`) |
| `fallback` | 이미지 없거나 로드 실패 시 이니셜/노드 |
| `size` | `sm` \| `md` \| `lg` |

- `img` 에러 시 fallback으로 전환
- 원형(`radius.full`), muted 배경 fallback
- `data-slot="avatar"`

---

## 4. Tabs

```tsx
<Tabs defaultValue="general">
  <Tabs.List aria-label="Settings">
    <Tabs.Trigger value="general">General</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">…</Tabs.Content>
  <Tabs.Content value="billing">…</Tabs.Content>
</Tabs>
```

| 규칙 | 내용 |
|------|------|
| API | controlled `value` / uncontrolled `defaultValue` + `onValueChange` |
| a11y | `role="tablist"` / `tab` / `tabpanel`, `aria-selected`, 화살표 키 로빙 |
| 활성화 | 선택된 탭만 패널 표시(언마운트 또는 `hidden`) |

Dialog/Drawer처럼 compound `Object.assign` 패턴 유지.

---

## 5. PHASE (9/22–9/25)

| PHASE | 날짜 | 산출물 | 완료 기준 |
|-------|------|--------|-----------|
| 0 | 2026-09-22 | 본 설계서 | `docs/surface-nav.md` 커밋 |
| 1 | 2026-09-23 | Alert | ui test green |
| 2 | 2026-09-24 | Avatar | ui test green |
| 3 | 2026-09-25 | Tabs + design.md / README / 완료 기록 | 통합 검증 |

---

## 6. 체크리스트

- [x] Alert
- [x] Avatar
- [x] Tabs (키보드 로빙)
- [x] 9/22–9/25 일자 커밋
- [x] docs 반영

## 7. 구현 완료 기록

| PHASE | 날짜 | 커밋 요지 |
|-------|------|-----------|
| 0 | 2026-09-22 | 설계서 `docs/surface-nav.md` |
| 1 | 2026-09-23 | Alert |
| 2 | 2026-09-24 | Avatar |
| 3 | 2026-09-25 | Tabs · design.md / README 통합 검증 |
