# 설계서: Jira형 이슈 콘솔 (기초)

> 작성일: 2026-09-25  
> 소비: `@ve/ui`, `@ve/tokens`  
> 선행: [`layout-feedback.md`](./layout-feedback.md), [`surface-nav.md`](./surface-nav.md), [`form-overlay.md`](./form-overlay.md)  
> 상태: MVP 앱 `apps/tracker` (목 데이터)

---

## 1. 가능 여부

가능하다. `@ve/ui`는 폼·오버레이·피드백·레이아웃·탭·아바타까지 있어서 **이슈 목록, 보드, 상세, 생성/수정** MVP를 제품 앱으로 구성할 수 있다.

이 저장소의 디자인 시스템은 컴포넌트 라이브러리다. Jira 클론 자체를 `packages/ui`에 넣지 않는다. 제품은 별도 앱(`apps/tracker` 등)이 `@ve/ui`를 조립하고, 도메인·라우팅·데이터는 앱이 가진다.

지금 라이브러리에 없는 것은 제품 고유 UI다. 칸반 드래그, 리치 텍스트, JQL, 스프린트 플래닝, 권한 매트릭스는 MVP 밖에 둔다.

| 레이어 | 담당 |
|--------|------|
| 토큰·프리미티브 | `@ve/tokens`, `@ve/ui` |
| 화면 조립·라우트·상태 | 제품 앱 |
| 이슈 데이터 | 앱 mock → 이후 API |

---

## 2. MVP와 비목표

### MVP

한 워크스페이스, 소수 프로젝트, 이슈 CRUD, 상태 컬럼 보드, 이슈 상세(설명·담당·우선순위·댓글).

| 화면 | 사용자 목표 |
|------|-------------|
| 프로젝트 목록 | 들어갈 프로젝트 고르기 |
| 보드 | 상태별로 이슈를 보고, 상태를 바꾸기 |
| 이슈 목록 | 필터해서 찾기 |
| 이슈 상세 | 내용 읽고 필드·댓글 수정 |
| 이슈 생성 | Dialog로 최소 필드 등록 |

이슈 유형은 `epic` / `story` / `task` / `bug` 네 가지. 서브태스크·스프린트·워크플로 커스텀은 후속.

### 비목표 (이번 기초 설계)

- Atlassian 계정·마켓플레이스·애드온
- JQL, 저장된 필터 공유, 대시보드 가젯
- 드래그 앤 드롭 보드 (상태 변경은 Select 또는 메뉴)
- 리치 텍스트 / 위키 마크업 에디터 (`Textarea`로 대체)
- 실시간 협업, 알림 센터, 이메일
- 첨부 파일 업로드
- 다중 워크플로·상태 머신 디자이너

---

## 3. 도메인

```txt
Workspace
  └── Project (key: WEB)
        └── Issue (key: WEB-12)
              ├── type, status, priority
              ├── assignee, reporter
              ├── summary, description
              └── comments[]
```

| 필드 | 값 |
|------|-----|
| `IssueType` | `epic` \| `story` \| `task` \| `bug` |
| `IssueStatus` | `backlog` \| `todo` \| `in_progress` \| `in_review` \| `done` |
| `Priority` | `low` \| `medium` \| `high` \| `urgent` |

상태 전이는 MVP에서 제한하지 않는다. 어떤 상태에서든 다른 상태로 바꿀 수 있다. 워크플로 규칙은 후속.

식별자: `project.key` + 증가 번호 → `WEB-12`. 표시용이며 URL은 `issueId`를 쓴다.

---

## 4. 정보 구조

```txt
/                          프로젝트 목록
/p/:projectKey             보드 (기본)
/p/:projectKey/list        이슈 목록
/p/:projectKey/issues/:id  이슈 상세
```

이슈 생성은 라우트가 아니라 보드·목록의 Dialog.

전역 크롬:

- 상단: 제품명, 프로젝트 전환(`Select`), `ThemeToggle`
- 본문: 프로젝트 안에서는 `Tabs`로 Board / List

인증은 MVP에서 고정 사용자 2~3명(mock). 로그인 화면은 후속.

---

## 5. 화면과 `@ve/ui` 매핑

### 프로젝트 목록

`Stack` + `Card`. 카드 안에 `Card.Title`(프로젝트 이름), `Badge`(키), `Card.Description`(이슈 수). 빈 목록은 `Alert`.

### 보드

상태 5컬럼. 컬럼 헤더는 `Stack` horizontal + `Badge`(건수). 이슈 카드:

| UI | 컴포넌트 |
|----|----------|
| 카드 서피스 | `Card` |
| 유형 | `Badge` (`bug`→danger, `story`→primary, 나머지 neutral/outline) |
| 우선순위 | `Badge` (`urgent`/`high`→warning 또는 danger) |
| 제목 | `Card.Title` |
| 키 | `Card.Description` |
| 담당 | `Avatar` |

로딩은 `Skeleton`. 컬럼이 비면 짧은 문구만 둔다.

상태 변경: 카드의 `Select`(상태). 드래그는 후속이라 보드 레이아웃도 CSS grid/flex이며, 새 레이아웃 primitive를 만들지 않는다.

### 이슈 목록

`Stack`으로 필터 바: `Input`(요약 검색), `Select`(유형·상태·담당). 결과는 `Card` 행 또는 단순 리스트. 정렬은 업데이트 시각 내림차순 고정.

빈 결과·에러는 `Alert`. 저장 성공은 `useToast`.

### 이슈 상세

좌측 본문, 우측 필드 패널.

| 영역 | 컴포넌트 |
|------|----------|
| 제목 수정 | `Input` |
| 설명 | `Textarea` + `Field` |
| 유형·상태·우선순위·담당 | `Select` + `Field` |
| 보고자 | `Avatar` + 텍스트 (읽기 전용) |
| 댓글 목록 | `Stack` + `Avatar` + `Separator` |
| 댓글 작성 | `Textarea` + `Button` |
| 저장 실패 | `Alert` variant `danger` |
| 좁은 폭 | 필드 패널을 `Drawer`로 |

삭제는 `Dialog` 확인 후 `Button` danger.

### 이슈 생성

`Dialog`. 필드: 유형(`Select`), 요약(`Input`), 설명(`Textarea`), 우선순위(`Select`). 생성 직후 상세로 이동하고 `toast({ variant: "success" })`.

---

## 6. 상태 배지 계약

앱 전용 매핑이다. 디자인 시스템 Badge variant를 늘리지 않는다.

| 상태 | Badge |
|------|-------|
| backlog, todo | `neutral` |
| in_progress | `primary` |
| in_review | `warning` |
| done | `success` |

| 유형 | Badge |
|------|-------|
| bug | `danger` |
| story | `primary` |
| epic | `outline` |
| task | `neutral` |

| 우선순위 | Badge |
|----------|-------|
| urgent | `danger` |
| high | `warning` |
| medium | `neutral` |
| low | `outline` |

---

## 7. 앱 구조 (구현 시)

```txt
apps/tracker          Next.js 또는 Vite + React
  src/routes          위 IA
  src/domain          Issue, Project 타입·목 저장소
  src/features        board, issue-list, issue-detail, issue-create
```

- UI 스타일은 `@ve/ui`와 토큰만 사용한다. 제품 CSS는 레이아웃(그리드 컬럼 수)에만 둔다.
- 데이터는 첫 구현에서 메모리 mock. `NEXT_PUBLIC_API_URL` 패턴이 필요해지면 그때 클라이언트 경계를 연다.
- Storybook은 디자인 시스템 계약용으로 유지한다. 이슈 카드 스토리는 제품 앱에 두지 않고, 보드가 프리미티브 조합으로 충분한지 설계로 확인한 뒤 부족하면 DS에 primitive를 추가한다.

---

## 8. 디자인 시스템 갭

MVP는 아래 없이도 성립한다. 제품이 막힐 때 DS 쪽 후보로 남긴다.

| 갭 | MVP 대체 | 후속 |
|----|----------|------|
| 칸반 드래그 | 상태 `Select` | 제품 라이브러리 또는 DS 비포함 |
| Combobox (담당자 검색) | `Select` | DS Combobox |
| Tooltip (키·우선순위 힌트) | `Badge` 텍스트 | DS Tooltip |
| AvatarGroup | `Avatar` 1명 | DS AvatarGroup |
| 데이터 테이블 | `Card` 리스트 | 제품 또는 DS Table |
| 명령 팔레트 | 상단 `Input` 검색 | 후속 |

원칙: 이슈 카드·보드 컬럼을 `@ve/ui` 컴포넌트로 승격하지 않는다. 두 번째 제품에서 같은 패턴이 나올 때만 프리미티브를 올린다.

---

## 9. 구현

`apps/tracker`가 이 설계의 MVP다. `pnpm --filter tracker dev` → http://localhost:4310

1. 프로젝트 목록과 테마 전환
2. 보드, 이슈 카드, 상태 Select
3. 이슈 상세, 댓글, 생성 Dialog, 삭제
4. 목록 필터

데이터는 메모리 mock이다. 칸반 드래그와 API 연동은 후속이다.
