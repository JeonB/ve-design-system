# 설계서: 레이아웃·그룹·오버레이·피드백 확장

> 작성일: 2026-09-14  
> 대상: `@ve/tokens`, `@ve/ui`, `apps/storybook`  
> 선행: [`form-overlay.md`](./form-overlay.md), [`ds-improvements.md`](./ds-improvements.md)  
> 기간: 2026-09-14 ~ 2026-09-21

---

## 1. 배경과 목표

폼·Dialog까지 갖춘 상태에서, 제품 UI에서 바로 막히는 빈틈은 **레이아웃 간격**, **선택 그룹**, **측면 오버레이**, **로딩/토스트 피드백**이다.

| 유형 | 항목 | 이유 |
|------|------|------|
| 추가 | **Stack** / **Separator** | gap·구분선 ad-hoc 제거. Card/Dialog 본문에 필수 |
| 추가 | **CheckboxGroup** | 멀티 선택 필터·권한. 단일 Checkbox만으로는 name/value 묶음이 없음 |
| 추가 | **RadioGroup** | 단일 선택 세트. Select보다 옵션이 적을 때 |
| 추가 | **Drawer** | Dialog의 측면형. 설정·상세 패널 |
| 추가 | **Toast** | 저장 성공/실패 피드백. 비모달 |
| 추가 | **Skeleton** / 공개 **Spinner** | 로딩 플레이스홀더. Button 내부 Spinner를 공개 API로 |
| 개선 | **zIndex.toast**, drawer 모션 토큰 | 오버레이 스택 정리 |

### 비목표

- Combobox / 커스텀 listbox Select
- 브랜드 다중 테마
- Chromatic CI
- Toast 큐 영속화(서버)

---

## 2. Stack

```tsx
<Stack gap="md" direction="vertical" align="stretch">
  <Input />
  <Button />
</Stack>
```

| Prop | 값 |
|------|-----|
| `direction` | `vertical`(기본) \| `horizontal` |
| `gap` | `none` \| `sm` \| `md` \| `lg` → space 토큰 |
| `align` | `start` \| `center` \| `end` \| `stretch` |
| `justify` | `start` \| `center` \| `end` \| `between` |
| `wrap` | boolean |
| `fullWidth` | boolean |

---

## 3. Separator

```tsx
<Separator />
<Separator orientation="vertical" />
```

`role="separator"`, `aria-orientation`. ButtonGroupSeparator와 토큰 공유, 공개 primitive로 승격.

---

## 4. CheckboxGroup

```tsx
<CheckboxGroup name="roles" value={roles} onValueChange={setRoles} legend="Roles">
  <CheckboxGroup.Item value="admin">Admin</CheckboxGroup.Item>
  <CheckboxGroup.Item value="editor">Editor</CheckboxGroup.Item>
</CheckboxGroup>
```

- `fieldset` + `legend` (또는 `aria-labelledby`)
- controlled `value: string[]` / `onValueChange`
- `disabled` / `invalid` / `orientation` / `gap`
- Item은 기존 Checkbox + 라벨 래퍼

---

## 5. RadioGroup

```tsx
<RadioGroup name="plan" value={plan} onValueChange={setPlan} legend="Plan">
  <RadioGroup.Item value="free">Free</RadioGroup.Item>
  <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
</RadioGroup>
```

네이티브 `input[type=radio]` + 커스텀 비주얼. Checkbox와 시각 언어 정렬.

---

## 6. Drawer

```tsx
<Drawer open={open} onOpenChange={setOpen} side="right">
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Settings</Drawer.Title>
      <Drawer.Description>Workspace preferences</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>…</Drawer.Body>
    <Drawer.Footer>…</Drawer.Footer>
  </Drawer.Content>
</Drawer>
```

| Prop | 설명 |
|------|------|
| `side` | `left` \| `right` \| `top` \| `bottom` (기본 `right`) |
| focus trap / Esc / overlay | Dialog와 동일 `useFocusTrap` 재사용 |
| portal | `document.body` |

---

## 7. Toast

```tsx
const { toast } = useToast();
toast({ title: "Saved", description: "…", variant: "success" });

<ToastProvider /> // 앱 루트
```

| 항목 | 내용 |
|------|------|
| variant | `neutral` \| `success` \| `warning` \| `danger` |
| duration | 기본 4000ms, `0`이면 수동 닫기 |
| 위치 | 기본 `bottom-right` |
| a11y | `role="status"` (danger는 `alert`) |

최대 동시 표시 3개. 초과 시 오래된 것부터 제거.

---

## 8. Skeleton / Spinner

```tsx
<Skeleton width="100%" height="1rem" />
<Skeleton variant="circle" width="40px" height="40px" />
<Spinner size="md" />
```

- Skeleton: pulse 애니메이션, `aria-hidden` (주변 텍스트로 로딩 안내)
- Spinner: Button 내부 스피너를 `@ve/ui` 공개 export로 정리 (`ButtonSpinner` 재export 또는 `Spinner` 별칭)

---

## 9. PHASE (9/14–9/21)

| PHASE | 날짜 | 산출물 | 완료 기준 |
|-------|------|--------|-----------|
| 0 | 2026-09-14 | 본 설계서 | `docs/layout-feedback.md` 커밋 |
| 1 | 2026-09-15 | Stack + Separator | ui test green |
| 2 | 2026-09-16 | CheckboxGroup | ui test green |
| 3 | 2026-09-17 | RadioGroup | ui test green |
| 4 | 2026-09-18 | Drawer | ui test green |
| 5 | 2026-09-19 | ToastProvider / useToast | ui test green |
| 6 | 2026-09-20 | Skeleton + Spinner | ui test green |
| 7 | 2026-09-21 | design.md / README / 완료 기록 | 통합 검증 |

---

## 10. 체크리스트

- [ ] Stack / Separator
- [ ] CheckboxGroup / RadioGroup
- [ ] Drawer
- [ ] Toast
- [ ] Skeleton / Spinner
- [ ] 9/14–9/21 일자 커밋
- [ ] docs 반영
