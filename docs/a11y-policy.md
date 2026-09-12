# 접근성 폴리시 (Form / Overlay)

> 작성일: 2026-09-12  
> 대상: Checkbox, Switch, Select, Dialog, Field 계열

## 원칙

1. **네이티브 우선**: 가능하면 시맨틱 HTML(`checkbox`, `select`, `button role=switch`, `role=dialog`)을 쓴다.
2. **이름 붙이기**: 모든 컨트롤은 `Field.Label` / `aria-label` / `aria-labelledby` 중 하나로 이름이 있어야 한다.
3. **상태 전달**: `invalid` → `aria-invalid`, `disabled` → disabled/`aria-disabled`, Switch → `aria-checked`.
4. **설명 연결**: Field Description/Error는 `aria-describedby`로만 연결한다. 존재하지 않는 id를 넣지 않는다.
5. **포커스**: Dialog는 열릴 때 focus trap, 닫힐 때 이전 포커스 복원. Esc·오버레이 닫기는 기본 on.
6. **모달**: `aria-modal="true"`, body scroll lock, `aria-labelledby` 필수. Description이 있을 때만 `aria-describedby`.

## 컴포넌트별

| 컴포넌트 | 역할 | 주의 |
|----------|------|------|
| Checkbox | 제출용 선택 | `indeterminate`는 DOM 속성으로만 |
| Switch | 즉시 설정 토글 | 폼 `name` 제출이 필요하면 Checkbox |
| Select | 단일 선택 | 커스텀 listbox는 후속 |
| Dialog | 모달 | `useFocusTrap` 필수 |

## 테스트 최소선

- 키보드로 조작 가능한지 (Tab / Space / Enter / Esc)
- 스크린 리더용 name·state가 Testing Library role query로 잡히는지
