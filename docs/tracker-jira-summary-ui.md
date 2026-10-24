# 설계서: Jira 요약 화면과 같은 모양

> 작성일: 2026-10-16
> 대상: `apps/tracker`
> 선행: [`tracker-space-summary.md`](./tracker-space-summary.md)

## 관찰

로그인한 Jira Cloud 스페이스 `KAN`의 요약 화면을 REA로 다시 봤다. 쿠키, 저장값, 요청·응답 본문은 받지 않았다. 디버깅 포트가 열린 브라우저 창에 붙었기 때문에 레이아웃은 실제 창 너비(약 2560px, 배율 100%)로 그려졌다.

| 근거 | Evidence |
|------|----------|
| 대상 목록 | `ev_c0a666edae1056bdf61854a00d83fd26d7d9c395b5a861f4e96aa23317d889c3` |
| DOM과 첫 스크린샷 | `ev_7f2bfe50f431f13eb61c019546f15a5248d9381f75ef7b2049f5898cbae50415` |
| 전체 너비 스크린샷 | `ev_be1cb4647b4d0e37f56b715eb272e696120518f4d1f77d069213ad2de13b565f` |
| 아래로 스크롤한 스크린샷 | `ev_ade00d7ef1bcee4dc8b7c599679fc3beaa6e8284859a2c33c06511e6df3be5f6` |

DOM에 있는 `--ds-*` 토큰 값은 그대로 읽었다. 카드 여백, 테두리, 간격 같은 런타임 주입 스타일은 DOM 스냅샷에 없어서 1:1 스크린샷의 픽셀로 쟀다.

## 토큰 (라이트, DOM에서 읽음)

| 이름 | 값 |
|------|----|
| surface | `#FFFFFF` |
| text / subtle / subtlest | `#292A2E` / `#505258` / `#6B6E76` |
| link, selected text, brand bold | `#1868DB` |
| brand bold hovered | `#1558BC` |
| border | `#0B120E24` |
| input border | `#8C8F97` |
| selected background | `#E9F2FE` |
| neutral background | `#0515240F` |
| neutral hovered | `#0B120E24` |
| bar track (accent gray subtler) | `#DDDEE1` |
| chart neutral / hovered | `#8C8F97` / `#7D818A` |
| chart categorical 1–6 | `#357DE8` `#82B536` `#BF63F3` `#F68909` `#1558BC` `#964AC0` |
| 유형·우선순위 아이콘 (픽셀에서 잼) | 빨강 `#F15B50`, 주황 `#E06C00`, 파랑 `#4688EC`, 보라 `#BF63F3`, 라임 `#6A9A23` |
| discovery background / purple text | `#F8EEFE` / `#803FA5` |
| radius small / medium / large / xlarge | 4 / 6 / 8 / 12px |
| font body | 400 14px/20px |
| font body small | 400 12px/16px |
| heading xxsmall / xsmall / small / medium / large | 653 12/16, 14/20, 16/20, 20/24, 24/28 |
| font family | `"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif` |

다크 값은 관찰하지 않았다. 트래커의 다크 토글은 그대로 두고, 같은 이름에 어두운 값을 따로 둔다.

## 픽셀로 잰 배치

| 부분 | 값 |
|------|----|
| 상단 바 | 높이 48px + 아래 테두리 1px. 좌우 12px |
| 상단 왼쪽 | 32px 아이콘 버튼 두 개(사이드바 접기, 앱), 24px 로고, 앱 이름 heading small |
| 검색 + 만들기 | 둘을 묶어 가운데 정렬. 검색 너비 777px, 높이 32px, 테두리 `#8C8F97`, 반경 6. 간격 8px. 만들기 90×32, `#1868DB`, 흰 글자, 반경 4 |
| 사이드바 | 너비 320px(오른쪽 테두리 포함). 위아래 12px, 좌우 12px. 행 높이 32px, 아이콘 16px, 아이콘–글자 간격 8px |
| 사이드바 그룹 제목 | heading xxsmall, subtlest, 들여쓰기 12px |
| 선택한 스페이스 | 들여쓴 행, 배경 `#E9F2FE`, 글자 `#1868DB`, 왼쪽 2px 막대, 반경 4 |
| 스페이스 머리 | 좌우 24px. 위 16px에 breadcrumb `Spaces`(body, subtle). 그 아래 20px 스페이스 아이콘 + 제목 heading medium |
| 탭 | body, 아이콘 16px + 6px 간격. 선택 탭은 `#1868DB` 글자와 아래 2px 막대. 탭 줄 아래 테두리 1px |
| 본문 열 | 가운데 정렬, 너비 1154px, 위 24px |
| 요약 간격 | 행·열 모두 22px |
| 7일 타일 | 4열, 높이 66px, 테두리 1px, 반경 8, 안쪽 12px. 아이콘 칸 40×40(배경 neutral, 반경 6), 칸–글자 8px. 제목 heading small, 아래 body small subtle |
| 카드 | 2열, 높이 322px, 테두리 1px, 반경 8, 안쪽 16px. 제목 heading small, 설명 body + 링크 |
| 상태 개요 | 도넛 지름 210px, 두께 24px, 가운데 총계(heading large)와 `Total work items`. 범례는 10px 사각형 + body small subtle, 0건은 빼고 `이름: 수` |
| 우선순위 | 세로 막대. 눈금 0, 절반, 최대. 막대 `#8C8F97`. 아래 축에 우선순위 아이콘과 이름 |
| 유형·업무량 표 | 머리 heading xxsmall subtle. 이름 열 180px, 행 높이 40px. 막대 높이 24px, 트랙 `#DDDEE1`, 채움 `#8C8F97`, 안쪽에 흰 퍼센트. 다섯 행이 보이고 나머지는 스크롤 |
| 빈 상태 | 가운데 정렬, 그림 위에 제목 heading small, 설명 body |

## 구현

1. `layout/jira-theme.css.ts`에 위 토큰을 vanilla-extract 테마 계약으로 둔다. `:root`는 라이트, `@ve/tokens`의 `darkTheme` 클래스가 붙으면 다크 값을 쓴다.
2. `layout/icons.tsx`에 16px 선 아이콘을 직접 그린다. Atlassian 로고, 일러스트, 아이콘 파일은 가져오지 않는다.
3. 상단 바, 사이드바, 스페이스 머리, 탭을 위 배치로 바꾼다. 기존 기능(검색, 만들기, 받은편지함, 사용자 전환, 테마)은 그대로 둔다.
4. `buildSpaceSummary`에 도넛 조각, 최근 활동, 에픽의 완료·진행·할 일 수를 더하고, 담당자 필터를 받는다.
5. 요약 화면을 타일, 도넛, 최근 활동, 우선순위 막대, 유형 표, 업무량 표, 에픽 진행 순서로 그린다. 타일과 범례는 JQL로 걸러진 리스트로 간다.
6. 리스트는 `?jql=`을 받아 필터를 연 채 시작한다.

## 관찰하지 못한 상태

KAN에는 최근 활동과 에픽이 없어서 Jira는 두 카드를 빈 상태로만 보여 줬다. 활동 목록(아바타, 문장, 상대 시각)과 에픽 진행 막대(완료 초록, 진행 파랑, 트랙 회색)는 같은 카드 틀 안에서 추론해 그린다.

## 검증

같은 데이터(KAN 스페이스, 미배정 Medium Task 하나)를 넣은 트래커를 REA로 2560×1195 헤드리스 Chrome에서 그려 Jira 스크린샷과 나란히 비교했다. 7일 타일 윗선을 기준으로 맞춘 본문 열에서 다른 픽셀은 약 6%였고, 대부분 글꼴과 아이콘 모양 차이다. 본문이 7px 오른쪽에 있는 것은 Jira 창의 15px 스크롤바 때문이다.

## 같게 하지 않는 것

- 글꼴: `Atlassian Sans`는 배포하지 않는다. 스택 첫 자리는 그대로 두고, 그다음에 오픈 라이선스(SIL OFL)인 `Inter Variable`을 실어 653 굵기를 그대로 쓴다. 자간과 글자 폭은 조금 다르다.
- Priority 카드의 "How to manage priorities for spaces"처럼 Atlassian 문서로 가는 링크는 넣지 않는다.
- 로고, 일러스트, 아이콘은 Atlassian 자산이 아니라 직접 그린 모양이다.
- 쿠키 안내, Reports 홍보 배너, Upgrade, Development/Forms/Timeline/Docs/Reports 탭, 피드백 줄은 트래커에 해당 기능이 없어서 넣지 않는다.
