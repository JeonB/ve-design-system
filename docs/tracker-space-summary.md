# 설계서: 스페이스 요약

> 작성일: 2026-10-08
> 대상: `apps/tracker`
> 선행: [`tracker-platform.md`](./tracker-platform.md)

## 관찰

로그인한 Jira Software 스페이스 `KAN`(표시 이름 My Kanban Space)를 REA로 봤다. 저장값, 쿠키, 응답 본문은 수집하지 않았다.

| 화면 | Evidence | 본 것 |
|------|----------|--------|
| 요약 | `ev_b763d1e2b08f13397fb74e6220772bca12a5437381a63cd31b3517bb3434cd42` | 상태 개요, 최근 7일 활동(completed / updated / created / due soon), 우선순위 다섯 단계, 작업 유형, 담당자별 업무량, 에픽 진행 |
| 보드 | `ev_6f30f5e78d6e3984ef2f40107e6d4470fc3088434a56bcd45cbed6d4d5b17a29` | 열 To Do, In Progress, In Review, Done. 열 안 만들기, 상태 추가, 담당자 필터, Group |
| 작업 항목 | `ev_38ff4a9954ecf00cce9e0e16c65b52fbd3d6b86b864dc6853192268da697ca71` | 상태, 작업 유형, 에픽 슬롯, 설명, 첨부, 서브태스크, 연결 항목, 활동(All / Comments / History / Work log), 담당자, Parent, 기한, 라벨, Team, 시작일, 보고자 |

스페이스 탐색은 Summary, List, Board, Development, Forms, Timeline, Docs, Reports다. 보드 주소는 `/jira/software/projects/KAN/boards/1`이고, 작업 항목은 `/browse/{key}`다.

요약의 우선순위 링크는 Highest, High, Medium, Low, Lowest다. 작업 유형 링크는 Task, Epic, Bug, Feature, Story, Subtask다. 상태 개요는 0이 아닌 To Do만 링크로 나왔고, 보드에는 빈 열도 있다.

작업 항목 상세의 Details에는 Resolution과 Priority가 없었다. 상태는 보드 열과 같은 To Do 버튼이다. 그래서 이전에 소스만 보고 적은 해결 필드 설계는 이 관찰로 확인되지 않았다. 이번 범위에서 해결 필드는 넣지 않는다.

## 추론

7일 숫자의 계산식은 화면에 없다. 요약이 0이었기 때문이다. 구현은 다음으로 둔다.

- completed: 상태 범주가 `done`이고 `updatedAt`이 기준 시각부터 거꾸로 7일 안에 있다.
- updated: `updatedAt`이 그 구간에 있다.
- created: `createdAt`이 그 구간에 있다.
- due soon: 완료 범주가 아니고, 기한의 UTC 날짜가 기준일의 UTC 자정부터 7일 미만이다.

에픽 진행은 자식(`parentId`) 가운데 완료 범주 비율이다. 자식이 없으면 0/0이다.

## 트래커와의 차이

요약 화면은 이슈 수와 상태 수만 그린다. 우선순위는 `low | medium | high | urgent`라서 Highest / Lowest가 없다. 작업 유형에 Feature가 없다. 기본 상태 이름은 To do, In progress, In review다. 보드 열, 리스트, 상세, 워크플로는 이미 관찰된 칸과 맞는다.

## 구현

1. `IssueType`에 `feature`를 더한다. 요약의 유형 순서는 Task, Epic, Bug, Feature, Story, Subtask다.
2. `Priority`를 `highest | high | medium | low | lowest`로 바꾼다. 저장 스키마는 3이다. 읽기 때 `urgent`는 `highest`가 된다. 1·2·3을 모두 읽는다.
3. 기본 상태 이름과 라벨을 To Do, In Progress, In Review, Done으로 맞춘다. JQL 비교는 대소문자를 무시한다.
4. `buildSpaceSummary`가 상태, 7일 활동, 우선순위, 유형, 담당자, 에픽 진행을 계산한다. 화면은 그 결과만 그린다. 상태와 우선순위, 유형은 0건도 보여서 보드의 빈 열과 요약의 다섯 우선순위, 여섯 유형이 빠지지 않는다.
5. 요약의 전체 항목 링크는 리스트로 간다.

## 하지 않는 것

Forms, Docs, Development, Timeline, Assets, Goals, Plans, Dashboards, 쿠키 배너, Work log, Team 필드, 해결 필드는 이번 구현에 없다. 작업 항목 본문과 계정 표시는 설계에 옮기지 않는다.
