# 메시 vs 호날두 통산 기록·연봉 비교 리포트 설계 문서

> 작성일: 2026-06-21
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트
> 권장 URL: `/reports/messi-ronaldo-career-comparison-2026/`
> 핵심 원칙: `GOAT(역대 최고)` 논쟁은 결론을 내리는 콘텐츠가 아니라, 통산 골·우승·연봉 등 숫자를 비교표로 제시하고 판단은 독자에게 맡긴다. 모든 누적 기록은 시점 스냅샷이므로 `기준일`을 명확히 표기하고, 시즌 중에는 최근 경기 결과로 바로 갱신이 필요함을 운영 메모로 남긴다.

---

## 1. 문서 개요

- 구현 대상: `리오넬 메시 vs 크리스티아누 호날두 통산 기록·연봉 비교`
- 권장 slug: `messi-ronaldo-career-comparison-2026`
- URL: `/reports/messi-ronaldo-career-comparison-2026/`
- 카테고리: 스포츠 / 연봉 / 레전드 비교
- 기획 배경: 메시가 최근 경기에서 해트트릭을 기록하며 `메시 vs 호날두 GOAT 논쟁`, `메시 호날두 누가 더 잘하나`류 검색이 다시 올라오는 시점. 두 선수 모두 30대 후반까지 현역으로 뛰며 기록이 계속 갱신되는 흔치 않은 케이스라, 일회성 콘텐츠가 아니라 `최근 활약 발생 시 갱신`하는 상시 리포트로 설계한다.
- 핵심 검색 의도:
  - `메시 호날두 비교`
  - `메시 호날두 누가 더 잘하나` / `메시 호날두 GOAT`
  - `메시 통산 골`
  - `호날두 통산 골`
  - `메시 연봉` / `호날두 연봉`
  - `메시 발롱도르` / `호날두 발롱도르`
  - `메시 월드컵` / `호날두 월드컵`
  - `메시 해트트릭`
- 핵심 출력:
  - 통산 골/도움/출전 경기 수 비교 카드 (클럽+국가대표 합산, 기준일 명시)
  - 발롱도르·메이저 트로피·리그 우승 수 비교
  - 월드컵 성적 비교 (메시 2022 우승 vs 호날두 무관)
  - 현재 소속(메시 인터 마이애미, 호날두 알 나스르) 연봉·이적료 비교
  - 최근 폼 카드: 직전 해트트릭 등 최근 경기 기록 하이라이트 (날짜 명시, 주기적 갱신 대상)
  - `누가 더 낫나`가 아니라 `어느 항목에서 누가 앞서는가`를 항목별로 보여주는 비교표
- 안전 장치:
  - `GOAT`, `역대 최고`, `더 위대하다` 같은 결론형 표현은 헤딩에서 배제하고, 항목별 우위만 표시
  - 모든 누적 기록(골/도움/경기수)에는 `기준일(YYYY-MM-DD)`을 표 헤더와 카드에 명시
  - 클럽+국가대표 합산 기준과 클럽 단독 기준을 분리해 표기 (출처마다 집계 기준이 다름)
  - 연봉은 공식 계약 공개가 거의 없는 영역이므로 `보도 기준 추정`, `확인 필요` 배지 필수
  - 팬덤 간 논쟁이 거친 주제이므로 댓글성 자극 문구(`까임` `빠 vs 까` 등)는 절대 사용하지 않고 사실 중심 톤 유지

---

## 2. 콘텐츠 포지셔닝

### 2-1. 한 줄 가치 제안

`메시와 호날두의 통산 골·우승·연봉을 항목별 숫자로 비교해, 'GOAT 논쟁'을 감정이 아니라 데이터로 보게 하는 리포트`

### 2-2. 페이지 톤

- 헤딩은 검색 수요에 맞춰 `메시 vs 호날두`를 강하게 노출하되, 결론은 단정하지 않는다.
- "어느 항목은 메시가 앞서고, 어느 항목은 호날두가 앞선다"는 균형 잡힌 구성을 기본으로 한다.
- 최근 이슈(해트트릭 등)는 Hero 또는 InfoNotice의 `최근 업데이트` 영역에서만 다루고, 본문 전체 논조를 흔들지 않는다.
- 두 선수 모두에 대해 동일한 분량, 동일한 카드 구조로 대칭성을 유지한다 (한쪽을 더 우호적으로 다루지 않음).

### 2-3. 금지 표현

- `OOO가 GOAT다`, `OOO가 더 위대하다`
- `OOO 까임`, `OOO 빠 vs 까`, `국가대표 버스 탄다`류 팬덤 자극 표현
- `공식 연봉`, `확정 연봉` (보도 기준 추정과 구분 없이 단정하는 표현)
- 두 선수 중 한 명에 대한 부정적 일화·사생활 언급

권장 표현:

- `메시가 앞서는 항목` / `호날두가 앞서는 항목`
- `보도 기준 추정 연봉`
- `OO 기준 통산 골 (클럽+국가대표 합산)`
- `이 비교는 우열을 가리기 위한 자료가 아니라 항목별 숫자 정리입니다.`

---

## 3. 데이터 기준

### 3-1. 기준일 원칙

- 모든 통산 기록은 `dataAsOf` 필드로 기준일을 명시 (예: `2026-06-20`)
- 시즌 중 경기 결과(골/도움/해트트릭 등)가 나올 때마다 `RECENT_FORM` 데이터만 빠르게 갱신할 수 있는 구조로 분리
- `통산 기록`과 `최근 폼`을 별도 데이터 블록으로 나눠, 통산 기록 전체를 매번 재집계하지 않고도 최근 이슈를 반영 가능하게 한다

### 3-2. 비교 항목

| 카테고리 | 항목 | 비고 |
| --- | --- | --- |
| 통산 득점/공격포인트 | 클럽 통산 골, 국가대표 통산 골, 클럽+국가대표 합산 골, 통산 도움 | 출전 경기수도 함께 표기 (골/경기 비율 참고용) |
| 개인 수상 | 발롱도르 횟수·연도, FIFA 더 베스트/올해의 선수 횟수 | |
| 팀 트로피 | 챔피언스리그, 리그 우승, 코파/유로 등 국가대표 메이저 대회 | |
| 국가대표 성적 | 월드컵 우승/준우승 여부, 월드컵 득점, A매치 출전·득점 | 메시 2022 우승은 핵심 비교 포인트 |
| 현재 시장 가치 | 현재 소속 클럽, 리그, 계약 기간 | 인터 마이애미(MLS) vs 알 나스르(사우디 프로리그) |
| 연봉/수입 | 클럽 연봉 추정, 광고·스폰서 수입 추정(있다면 분리 표기), 합산 추정 연수입 | 출처 분리, `보도 기준`/`추정` 배지 |
| 최근 폼 | 최근 5~10경기 골/도움, 최근 해트트릭 등 하이라이트 일자 | 갱신 대상 영역 |

### 3-3. 데이터 등급

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type RecordSourceBadge = "공식 통계" | "보도 기준" | "집계 시점 차이";
```

- `공식 통계`: FIFA, UEFA, 각 리그 공식 통계 사이트의 골/도움/출전 기록
- `보도 기준`: Forbes, Capology 등에서 보도한 연봉·수입 추정
- `집계 시점 차이`: 통산 골 등 합산 방식이 매체마다 달라(공식전만 포함 vs 친선경기 포함 등) 수치가 갈리는 경우
- `확인 필요`: 광고 수입처럼 정확한 공개 자료가 없는 항목

### 3-4. 출처 후보

| 데이터 | 출처 후보 |
| --- | --- |
| 통산 골/도움/출전 | Transfermarkt, ESPN, 각 리그 공식 통계, FIFA |
| 발롱도르/수상 내역 | France Football(발롱도르 공식 주관), FIFA |
| 국가대표 성적 | FIFA 공식 기록, 아르헨티나/포르투갈 축구협회 |
| 연봉/수입 | Forbes(연간 스포츠 스타 수입 순위), Capology, Spotrac, 현지 언론 보도 |
| 현재 소속 계약 | 클럽 공식 발표(이적/계약 발표 보도자료), 현지 언론 |

참고 URL 후보:

- Transfermarkt: `https://www.transfermarkt.com/`
- ESPN: `https://www.espn.com/`
- Forbes: `https://www.forbes.com/`
- Capology: `https://www.capology.com/`
- FIFA: `https://www.fifa.com/`

---

## 4. 데이터 모델 설계

파일: `src/data/messiRonaldoCareerComparison2026.ts`

### 4-1. 기본 타입

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type RecordSourceBadge = "공식 통계" | "보도 기준" | "집계 시점 차이";
export type PlayerId = "messi" | "ronaldo";

export interface PlayerProfile {
  id: PlayerId;
  nameKo: string;
  nameEn: string;
  flag: string;
  birthDate: string;
  currentClub: string;
  currentLeague: string;
  contractUntil?: string;
  position: string;
  photo?: {
    src: string;
    alt: string;
    sourceName: string;
    sourceUrl: string;
    licenseLabel: string;
  };
}

export interface CareerRecordItem {
  id: string;
  category: "scoring" | "awards" | "trophies" | "nationalTeam" | "income";
  labelKo: string;
  messiValue: string;
  ronaldoValue: string;
  messiRaw?: number;
  ronaldoRaw?: number;
  leaderId?: PlayerId | "tie";
  sourceBadge: RecordSourceBadge | SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note?: string;
}

export interface RecentFormEntry {
  id: string;
  playerId: PlayerId;
  date: string;            // YYYY-MM-DD
  competition: string;
  opponent: string;
  result: string;          // 예: "해트트릭 (3골)"
  summary: string;
  sourceUrl?: string;
}

export interface ComparisonFaqItem {
  question: string;
  answer: string;
}
```

### 4-2. 필수 export

```ts
export const MRCC_META = {
  slug: "messi-ronaldo-career-comparison-2026",
  title: "메시 vs 호날두 통산 기록·연봉 비교",
  seoTitle: "메시 호날두 비교 2026 | 통산 골·발롱도르·연봉 한눈에",
  seoDescription:
    "메시와 호날두의 통산 골, 발롱도르, 월드컵 성적, 현재 연봉을 항목별로 비교합니다. 최근 해트트릭 등 최신 경기 기록도 함께 확인하세요.",
  dataAsOf: "2026-06-20",
  updatedAt: "2026-06-21",
  dataNote:
    "통산 기록은 집계 시점과 매체별 기준(공식전 only / 친선경기 포함 등)에 따라 다를 수 있습니다. 연봉과 수입은 공식 계약 공개가 아닌 보도 기준 추정입니다.",
};

export const MRCC_PLAYERS: PlayerProfile[] = [];
export const MRCC_RECORDS: CareerRecordItem[] = [];
export const MRCC_RECENT_FORM: RecentFormEntry[] = [];
export const MRCC_FAQ: ComparisonFaqItem[] = [];
export const MRCC_RELATED_LINKS = [];
```

### 4-3. leaderId 사용 원칙

- `leaderId`는 단순 숫자 비교가 가능한 항목(통산 골 수, 발롱도르 횟수 등)에만 부여
- 비교가 무의미한 항목(현재 소속 리그, 포지션 등)은 `leaderId` 생략
- 숫자 차이가 근소하거나 집계 기준이 달라 우열을 매기기 부적절한 항목은 `leaderId: "tie"` 또는 생략 + `note`로 설명
- UI에서 `leaderId`가 있는 행만 우위 배지(예: 강조 색상 텍스트)를 표시, 없는 행은 중립으로 표시 — 이렇게 해야 "전체 항목에서 누가 이겼다"는 식의 단순 합산 오독을 줄일 수 있다

---

## 5. 페이지 IA

1. Hero — "메시 vs 호날두, 숫자로 보는 통산 기록 비교"
2. InfoNotice — 기준일, 집계 기준 차이, GOAT 논쟁 비단정 고지, 연봉 추정치 고지
3. 최근 업데이트 카드 — 최근 해트트릭 등 최신 경기 하이라이트 (양 선수 동시 노출, 기록이 없으면 "최근 소식 없음" 표기)
4. 선수 프로필 카드 2개 (나이, 소속, 국가, 포지션)
5. 핵심 KPI 비교 카드 4~6개 (통산 골, 발롱도르, 월드컵, 추정 연봉 등 가장 검색 수요 높은 지표)
6. 항목별 비교표 (카테고리 탭 또는 아코디언: 득점/수상/트로피/국가대표/수입)
7. 월드컵 성적 비교 섹션 (메시 2022 우승 포인트 별도 강조 — 둘 다 사실 기반)
8. 연봉·수입 비교 섹션 (출처·배지 강조)
9. "이 리포트는 우열을 가리지 않습니다" 해석 가이드 박스
10. 데이터 기준과 한계 (집계 시점 차이, 갱신 주기 안내)
11. FAQ
12. 관련 리포트 링크
13. SeoContent

---

## 6. UI 설계

### 6-1. 레이아웃

- BaseLayout 기반, `CompareToolShell` 패턴이 있다면 우선 검토하되 인터랙션이 단순하므로 기존 리포트 페이지 패턴(`SimpleToolShell` 미사용, 일반 `<main>` + section 구성)을 재사용
- pageClass: `mrcc-page`
- SCSS prefix: `mrcc-`
- 두 선수를 항상 같은 폭, 같은 순서(메시 좌/위, 호날두 우/아래)로 배치해 시각적 대칭 유지

### 6-2. Hero

```astro
<CalculatorHero
  eyebrow="스포츠 레전드 비교 리포트"
  title="메시 vs 호날두, 숫자로 보는 통산 기록 비교"
  description="통산 골, 발롱도르, 월드컵 성적, 현재 연봉까지 항목별로 비교합니다. 최근 경기 기록도 함께 업데이트합니다."
/>
```

InfoNotice:

```text
이 리포트는 '누가 GOAT인가'를 결론 내리는 자료가 아니라, 항목별 숫자를 정리한 비교표입니다.
통산 골·도움 등은 집계 시점({dataAsOf} 기준)과 매체별 기준에 따라 수치가 다를 수 있습니다.
연봉과 수입은 공식 계약 공개가 아닌 보도 기준 추정이며 실제와 차이가 있을 수 있습니다.
```

### 6-3. 최근 업데이트 카드

```text
[메시] 2026-06-18 · MLS 정규시즌 · vs OOO
해트트릭 (3골) — 최근 5경기 7골 3도움

[호날두] 최근 소식 업데이트 전
```

- 한쪽만 최근 이슈가 있을 때도 양쪽 카드 틀은 유지하고 "최근 소식 없음"으로 균형을 맞춘다
- 이 영역은 운영 중 가장 자주 갱신되는 블록이므로 `MRCC_RECENT_FORM` 배열에 새 항목을 추가하는 방식으로 운영 (기존 항목 삭제보다 최근 N개만 노출)

### 6-4. 핵심 KPI 카드

| 카드 | 문구 예시 |
| --- | --- |
| 통산 골 | `메시 OOO골 · 호날두 OOO골 (클럽+국가대표, {기준일})` |
| 발롱도르 | `메시 O회 · 호날두 O회` |
| 월드컵 | `메시 우승(2022) · 호날두 무관` |
| 현재 연봉 추정 | `메시 연 OOO억 · 호날두 연 OOO억 (보도 기준)` |

### 6-5. 항목별 비교표

- 카테고리 탭: `득점·도움` / `개인 수상` / `팀 트로피` / `국가대표` / `연봉·수입`
- 각 행: 항목명 / 메시 값 / 호날두 값 / 우위 표시(있는 경우만) / 출처 배지
- 모바일에서는 좌우 스와이프 없이 2단 카드형으로 전환 (항목명 위, 두 선수 값 좌우 배치)

### 6-6. 해석 가이드 박스

```text
이 리포트는 항목별 숫자를 비교한 자료입니다. 득점력, 수상 경력, 국가대표 성적, 수입 구조가 서로 다른 영역이라
전체를 단순 합산해 한 명이 '더 위대하다'고 결론 내리기 어렵습니다. 각자 강한 영역이 다르다는 점을 참고해주세요.
```

---

## 7. 클라이언트 JS 설계

파일: `public/scripts/messi-ronaldo-career-comparison-2026.js`

### 7-1. 함수 목록

```js
function renderRecentForm(entries) {}
function renderKpiCards(records) {}
function renderProfileCards(players) {}
function renderCategoryTable(records, category) {}
function setActiveCategory(category) {}
function renderLeaderBadge(record) {}
function syncUrlState(state) {}
function init() {}
```

### 7-2. 상태값

```ts
type PageState = {
  activeCategory: "scoring" | "awards" | "trophies" | "nationalTeam" | "income";
};
```

### 7-3. URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `category` | 비교표 카테고리 탭 선택 상태 유지 |

- 인터랙션이 단순하므로 환율 입력, 필터 등 추가 상태는 두지 않는다 (불필요한 복잡도 방지)

---

## 8. SEO 설계

### 8-1. SEO Title

```text
메시 호날두 비교 2026 | 통산 골·발롱도르·연봉 한눈에
```

### 8-2. Meta Description

```text
메시와 호날두의 통산 골, 발롱도르, 월드컵 성적, 현재 연봉을 항목별로 비교. 최근 해트트릭 등 최신 경기 기록도 함께 정리.
```

### 8-3. H1 후보

```text
메시 vs 호날두, 숫자로 보는 통산 기록 비교
```

### 8-4. 권장 H2

- 메시와 호날두, 통산 골은 누가 더 많을까
- 발롱도르와 개인 수상 횟수 비교
- 월드컵에서는 메시가 우승했다 — 그 외 국가대표 성적
- 지금 누가 더 많이 버나 — 연봉·수입 비교
- 최근 경기 기록 업데이트
- 이 비교가 GOAT 논쟁의 결론은 아닌 이유
- 자주 묻는 질문

### 8-5. 후킹 제목 후보

| 후보 | 용도 |
| --- | --- |
| `메시 해트트릭 직후 다시 불붙은 메시 vs 호날두 비교` | SNS/OG, 시의성 강조 |
| `통산 골은 누가 더 많을까 — 메시 vs 호날두 숫자 비교` | 본문 H2 |
| `메시 우승, 호날두 무관 — 월드컵만 떼어보면` | 섹션 제목 |
| `지금 연봉은 누가 더 받을까 — 메시 vs 호날두 수입 비교` | 롱테일 |

---

## 9. FAQ 설계

```ts
export const MRCC_FAQ = [
  {
    question: "이 리포트는 누가 GOAT인지 알려주나요?",
    answer:
      "아닙니다. 이 리포트는 통산 골, 수상, 연봉 등 항목별 숫자를 정리한 비교 자료이며, 'GOAT' 같은 종합 평가는 보는 사람의 기준에 따라 달라질 수 있어 결론을 내리지 않습니다.",
  },
  {
    question: "통산 골 수치가 다른 사이트와 다를 수 있나요?",
    answer:
      "네. 친선경기 포함 여부, 집계 시점, 클럽/국가대표 합산 방식이 매체마다 달라 수치가 소폭 다를 수 있습니다. 이 페이지는 기준일과 집계 방식을 함께 표기합니다.",
  },
  {
    question: "메시와 호날두의 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 두 선수의 클럽이 연봉을 공식 발표하지 않는 경우가 많아, Forbes·Capology 등의 보도 기준 추정치를 사용했습니다.",
  },
  {
    question: "월드컵 성적은 왜 따로 다루나요?",
    answer:
      "메시는 2022 카타르 월드컵에서 우승했고 호날두는 우승 경력이 없어, 두 선수 비교에서 검색 수요와 관심이 가장 큰 항목이기 때문입니다. 다만 이는 국가대표 성적 중 하나일 뿐 선수 개인 기량의 전부를 의미하지는 않습니다.",
  },
  {
    question: "최근 경기 기록은 얼마나 자주 업데이트되나요?",
    answer:
      "두 선수 모두 현역으로 뛰고 있어 해트트릭 등 주요 경기 기록이 나올 때마다 '최근 업데이트' 영역을 갱신할 예정입니다. 통산 기록 전체는 기준일 단위로 정기 갱신합니다.",
  },
  {
    question: "왜 두 선수만 비교하나요?",
    answer:
      "메시와 호날두는 2000년대 후반부터 가장 오랜 기간 동시에 최상위권 기록을 유지해온 선수라 비교 검색 수요가 압도적으로 많습니다. 추후 다른 레전드 비교 리포트로 확장할 수 있습니다.",
  },
];
```

---

## 10. SeoContent 초안 방향

intro 4문단:

1. 메시의 최근 해트트릭 등 활약이 화제가 되면서 '메시 vs 호날두 GOAT 논쟁'이 다시 떠오르는 배경 설명
2. 이 리포트는 결론을 내리는 콘텐츠가 아니라 통산 골, 발롱도르, 월드컵 성적, 연봉을 항목별로 비교하는 자료라는 점
3. 두 선수가 서로 다른 영역에서 강점을 보인다는 점 (메시는 월드컵 우승·개인 기교, 호날두는 통산 골 양·꾸준함 등 — 실제 데이터 입력 시 갱신)
4. 통산 기록은 집계 시점과 매체별 기준에 따라 달라질 수 있고, 연봉은 보도 기준 추정이라는 데이터 한계 고지

필수 문구:

- `이 리포트는 누가 더 위대한지 결론을 내리는 자료가 아닙니다.`
- `통산 골·도움 등 누적 기록은 기준일과 집계 방식에 따라 차이가 있을 수 있습니다.`
- `연봉과 수입은 공식 계약 공개가 아닌 보도 기준 추정입니다.`

---

## 11. 관련 링크 전략

| 연결 페이지 | CTA 문구 | 목적 |
| --- | --- | --- |
| `/reports/korea-football-legends-salary-comparison-2026/` | 손흥민·이강인과 역대 레전드 연봉 비교 보기 | 레전드 비교 콘텐츠 클러스터 |
| `/reports/son-heung-min-lafc-salary-net-worth-2026/` | 손흥민 연봉·재산 추정 보기 | 스포츠 연봉 클러스터 |
| `/reports/lee-kang-in-psg-salary-2026/` | 이강인 PSG 연봉 보기 | 스포츠 연봉 클러스터 |
| `/reports/worldcup-squad-salary-total-comparison-2026/` | 월드컵 대표팀 연봉 총액 순위 보기 | 월드컵 시즌 트래픽 연결 |
| `/reports/worldcup-prize-money-calculator/` | 월드컵 상금 계산기 보기 | 계산기 전환 |

양방향 CTA: `worldcup-squad-salary-total-comparison-2026`, `korea-football-legends-salary-comparison-2026` 페이지에 본 리포트로 연결되는 링크를 역으로 추가하는 것을 권장 (구현 시 `RELATED_LINKS` 배열에 상호 추가).

---

## 12. 구현 파일 구조

```text
src/
  data/
    messiRonaldoCareerComparison2026.ts
    reports.ts
  pages/
    reports/
      messi-ronaldo-career-comparison-2026.astro
  styles/
    scss/
      pages/
        _messi-ronaldo-career-comparison-2026.scss
    app.scss

public/
  scripts/
    messi-ronaldo-career-comparison-2026.js
  sitemap.xml
  images/
    reports/
      messi-ronaldo-career-comparison-2026/
```

등록 필요:

- `src/data/reports.ts`
- `src/styles/app.scss`: `@use 'scss/pages/messi-ronaldo-career-comparison-2026';`
- `public/sitemap.xml`
- 기존 스포츠 연봉 리포트들과 상호 링크
- OG 이미지 생성 대상 (`npm run og:generate`)

---

## 13. QA 체크리스트

### 데이터

- [ ] 통산 기록에 기준일(`dataAsOf`)이 명시되어 있는가?
- [ ] 클럽 단독 / 클럽+국가대표 합산 기준이 명확히 구분되는가?
- [ ] 연봉·수입 항목에 `보도 기준`/`추정`/`확인 필요` 배지가 있는가?
- [ ] `leaderId`가 숫자 비교 가능한 항목에만 부여되었는가?
- [ ] 최근 업데이트 영역이 양 선수 대칭 구조로 운영되는가?

### 콘텐츠 톤

- [ ] `GOAT다`, `더 위대하다` 같은 결론형 표현이 헤딩/본문에 없는가?
- [ ] 두 선수에 대한 분량·카드 구조가 대칭적인가?
- [ ] 팬덤 자극형 표현이 없는가?
- [ ] "우열을 가리지 않는다"는 해석 가이드 문구가 본문에 명시되어 있는가?

### UI

- [ ] 모바일에서 비교표가 카드형으로 자연스럽게 전환되는가?
- [ ] 카테고리 탭 전환이 URL 파라미터로 유지되는가?
- [ ] 최근 업데이트 카드가 한쪽만 있어도 레이아웃이 깨지지 않는가?

### SEO

- [ ] H1/Title에 `메시 호날두` 또는 `메시 vs 호날두` 의도가 들어가는가?
- [ ] FAQ가 6개 이상인가?
- [ ] 관련 링크가 4개 이상인가?

### 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공

---

## 14. 구현 순서

1. 구현 직전 통산 골/도움/수상/국가대표 최신 수치를 출처별로 재확인 (현역 선수라 수치가 계속 바뀜)
2. 메시 최근 해트트릭 등 최신 경기 기록을 `MRCC_RECENT_FORM`에 입력
3. `src/data/messiRonaldoCareerComparison2026.ts` 작성 (선수 프로필, 항목별 기록, FAQ, 관련 링크)
4. `/reports/messi-ronaldo-career-comparison-2026.astro` 작성
5. `public/scripts/messi-ronaldo-career-comparison-2026.js` 작성 (카테고리 탭, 최근 업데이트 렌더)
6. `_messi-ronaldo-career-comparison-2026.scss` 작성
7. `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
8. 기존 스포츠 연봉 리포트들과 상호 CTA 추가
9. `npm run build`
10. 모바일/데스크톱 시각 확인, 비교표 카드 대칭성 재확인
11. 발행 후 양 선수 주요 경기 결과 발생 시 `MRCC_RECENT_FORM` 갱신 운영

---

## 15. 발행 리스크 및 운영 메모

- 통산 골 등 수치는 현역 선수 특성상 거의 매주 바뀐다. 발행 직전 재확인이 필수이며, 페이지에는 반드시 `기준일`을 노출해 "오래된 수치"로 보이는 리스크를 줄인다.
- GOAT 논쟁은 팬덤 간 민감도가 높은 주제이므로, 댓글·SNS 반응에서 "한쪽 편을 든다"는 오해가 생기지 않도록 카드 순서·분량·톤의 대칭성을 발행 전 재점검한다.
- 연봉·수입 데이터는 두 선수 모두 추정치 편차가 크므로(특히 광고 수입), 광고/스폰서 수입을 클럽 연봉과 분리해 표기하지 않으면 총수입이 부풀려져 보일 수 있다.
- 시의성 콘텐츠 특성상 발행 직후 트래픽이 몰릴 수 있어, `최근 업데이트` 영역을 미리 비워두지 않고 발행 시점에 실제 최신 기록(해트트릭 등)을 채워서 발행한다.
