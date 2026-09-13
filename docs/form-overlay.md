# 설계서: 폼 컨트롤·Dialog 확장 (Checkbox / Switch / Select / Dialog)

> 작성일: 2026-09-07  
> 대상: `@ve/tokens`, `@ve/ui`, `apps/storybook`  
> 선행: [`color-modes.md`](./color-modes.md), [`ds-improvements.md`](./ds-improvements.md)  
> 기간: 2026-09-07 ~ 2026-09-13

---

## 1. 배경과 목표

현재 `@ve/ui`는 Button·Field·Input·Textarea·Card·Badge·테마까지 갖췄지만,  
제품 폼·모달 플로우에 필수인 **선택형 컨트롤**과 **오버레이**가 없다.

| 유형 | 항목 | 이유 |
|------|------|------|
| 추가 | **Checkbox** | 동의·멀티셀렉트·필터. Field와 라벨 연결 필요 |
| 추가 | **Switch** | 설정 on/off. Checkbox와 역할 분리(`role="switch"`) |
| 추가 | **Select** | 단일 선택 드롭다운. 네이티브 `<select>` 스타일링으로 런타임 lean 유지 |
| 추가 | **Dialog** | 확인·폼 모달. focus trap·Esc·오버레이 |
| 개선 | **포커스/오버레이 토큰** | Dialog·Select에 쓸 `zIndex`·`shadow`·모션 보강 |

### 비목표

- Radix/Headless UI 의존 (현 스택: React + vanilla-extract만)
- 멀티 Select / Combobox / DatePicker
- Drawer / Sheet
- Chromatic CI

---

## 2. Checkbox

```tsx
<Field>
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Checkbox id="tos" name="tos" />
    <Field.Label htmlFor="tos">동의합니다</Field.Label>
  </div>
</Field>

<Checkbox checked={checked} onCheckedChange={setChecked} indeterminate />
```

| Prop | 설명 |
|------|------|
| `checked` / `defaultChecked` | controlled / uncontrolled |
| `indeterminate` | 부분 선택 (DOM `indeterminate`) |
| `invalid` / `disabled` / `required` | Field 상속 가능 |
| `onCheckedChange?(checked: boolean)` | 편의 콜백 (`onChange`도 유지) |
| `size` | `sm` \| `md` |

접근성: 네이티브 `<input type="checkbox">` + 커스텀 비주얼(형제 또는 wrapper).  
스크린 리더는 네이티브 input을 사용하고, 체크 마크는 `aria-hidden` 장식.

---

## 3. Switch

```tsx
<Switch checked={on} onCheckedChange={setOn} aria-label="알림" />
```

| Prop | 설명 |
|------|------|
| `checked` / `defaultChecked` | boolean |
| `onCheckedChange?(checked: boolean)` | |
| `disabled` | |
| `size` | `sm` \| `md` |

구현: `<button role="switch" aria-checked>` 또는 checkbox를 시각적으로 토글 UI로.  
권장: **button + role="switch"** (폼 name 불필요 시). `name`이 필요하면 hidden input 옵션은 후속.

Checkbox와 구분: Switch는 즉시 적용되는 설정, Checkbox는 제출 대상 선택.

---

## 4. Select

```tsx
<Field>
  <Field.Label>Plan</Field.Label>
  <Select name="plan" defaultValue="pro">
    <option value="free">Free</option>
    <option value="pro">Pro</option>
  </Select>
</Field>
```

| Prop | 설명 |
|------|------|
| `size` / `invalid` / `disabled` / `fullWidth` | Input과 동일 Field 상속 |
| children | `<option>` / `<optgroup>` |

네이티브 `<select>`를 Input shell 스타일로 감싼다.  
커스텀 리스트박스(포털·키보드 로빙)는 다음 사이클.

---

## 5. Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Content aria-labelledby="title">
    <Dialog.Header>
      <Dialog.Title id="title">삭제할까요?</Dialog.Title>
      <Dialog.Description>되돌릴 수 없습니다.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
      <Button variant="danger">삭제</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

| Prop | 설명 |
|------|------|
| `open` / `defaultOpen` | |
| `onOpenChange?(open: boolean)` | |
| `Dialog.Content` | role=dialog, aria-modal, focus trap |
| Esc / 오버레이 클릭 | 닫기 (Content에서 `onPointerDownOutside` 기본 true) |

개선 포인트:
- `useFocusTrap` + 열릴 때 이전 포커스 복원
- `zIndex.overlay` / `zIndex.dialog` 토큰
- `shadow.md` 토큰 (elevated surface)

Portal: `createPortal(..., document.body)`.

---

## 6. 토큰 보강

```ts
zIndex: { focus, overlay, dialog }
shadow: { sm, md, none }
motion.transition.overlay (opacity/transform)
component.checkbox / switch / select 크기 (필요 시)
```

---

## 7. PHASE (9/7–9/13)

| PHASE | 날짜 | 산출물 | 완료 기준 |
|-------|------|--------|-----------|
| 0 | 2026-09-07 | 본 설계서 | `docs/form-overlay.md` 커밋 |
| 1 | 2026-09-08 | Checkbox + 테스트·스토리 | ui test green |
| 2 | 2026-09-09 | Switch + 테스트·스토리 | ui test green |
| 3 | 2026-09-10 | Select + Field 연동 | ui test green |
| 4 | 2026-09-11 | Dialog + focus trap | ui test green |
| 5 | 2026-09-12 | zIndex/shadow 토큰·a11y 폴리시 정리 | tokens+ui build/test |
| 6 | 2026-09-13 | design.md / README / 완료 기록 | 통합 검증 green |

---

## 8. 공개 API (예정)

```ts
export { Checkbox, Switch, Select, Dialog };
export { useFocusTrap }; // 내부 또는 export
```

---

## 9. 체크리스트

- [x] Checkbox
- [x] Switch
- [x] Select
- [x] Dialog + focus trap
- [x] 오버레이 토큰
- [x] 9/7–9/13 일자 커밋
- [x] docs 반영

## 10. 구현 완료 기록

| PHASE | 날짜 | 커밋 요지 |
|-------|------|-----------|
| 0 | 2026-09-07 | 설계서 `docs/form-overlay.md` |
| 1 | 2026-09-08 | Checkbox |
| 2 | 2026-09-09 | Switch |
| 3 | 2026-09-10 | Select |
| 4 | 2026-09-11 | Dialog + overlay tokens |
| 5 | 2026-09-12 | a11y 폴리시 · focus trap 테스트 |
| 6 | 2026-09-13 | design.md / README 통합 검증 |
