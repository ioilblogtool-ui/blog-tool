# 월드컵 본선 대표팀 스쿼드 연봉 총액 비교 2026 — 설계 문서

> 작성일: 2026-06-12  
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트  
> 권장 URL: `/reports/worldcup-squad-salary-total-comparison-2026/`  
> 핵심 원칙: 국가별 선수 연봉은 공식 일괄 공개 자료가 아니므로 `보도 기준`, `추정`, `확인 필요` 배지를 국가·선수·합계 단위에 모두 표시한다.

---

## 1. 문서 개요

- 구현 대상: `월드컵 본선 대표팀 스쿼드 연봉 총액 비교 2026`
- 권장 slug: `worldcup-squad-salary-total-comparison-2026`
- URL: `/reports/worldcup-squad-salary-total-comparison-2026/`
- 카테고리: 스포츠 / 연봉 / 월드컵
- 핵심 검색 의도:
  - `월드컵 대표팀 연봉 총액`
  - `월드컵 국가별 연봉 순위`
  - `한국 브라질 연봉 비교`
  - `한국 프랑스 대표팀 연봉 비교`
  - `월드컵 스쿼드 연봉 합계`
  - `대한민국 월드컵 연봉 몇 위`
- 핵심 출력:
  - 한국 대표팀 추정 연봉 총액 순위
  - 브라질·프랑스·잉글랜드·아르헨티나 등 강팀과 한국의 격차
  - 국가별 스쿼드 연봉 합계와 데이터 커버리지
  - 선수별 TOP 연봉이 팀 총액에 미치는 비중
  - `한국은 몇 위?`, `브라질의 몇 %?`, `손흥민 있어도 몇 위?` 형태의 후킹 카드
- 안전 장치:
  - 2026 월드컵은 32개국이 아니라 48개국 본선 체제임을 명시
  - `32개국` 표현은 `주요 32개국`, `비교 가능 32개국`, `2022 회고형` 중 하나로만 사용
  - 국가별 합계는 `확인 합계`와 `추정 보정 합계`를 분리
  - 연봉 데이터가 부족한 국가는 순위표에서 `커버리지 낮음` 배지 표시

---

## 2. 32개국 표현 리스크

사용자 아이디어는 `월드컵 본선 32개국 대표팀 연봉 총액 비교`지만, 2026 FIFA 월드컵은 48개국 체제다. 따라서 구현 시 제목과 데이터 기준을 아래 중 하나로 결정해야 한다.

| 옵션 | 제목 방향 | 장점 | 리스크 |
| --- | --- | --- | --- |
| A. 2026 본선 48개국 전체 | `2026 월드컵 48개국 대표팀 연봉 총액 비교` | 최신성, 정확성 | 데이터 수집 범위가 큼 |
| B. 2026 주요 32개국 | `월드컵 주요 32개국 연봉 총액 비교` | 기존 아이디어 유지, 수집 범위 축소 | “본선 32개국”이라고 쓰면 부정확 |
| C. 2022 본선 32개국 회고 | `2022 월드컵 32개국 연봉 총액 비교` | 32개국 표현 정확 | 최신 검색 수요 약함 |

권장안은 **A를 기본으로 하되, 표에서 `주요 32개국 보기` 필터를 제공**하는 방식이다.

권장 H1:

```text
2026 월드컵 대표팀 연봉 총액 순위 — 한국은 몇 위일까?
```

보조 제목:

```text
브라질·프랑스·잉글랜드와 비교한 한국 스쿼드 추정 연봉 합계
```

---

## 3. 콘텐츠 포지셔닝

### 3-1. 한 줄 가치 제안

`월드컵 본선 국가들의 대표팀 스쿼드 추정 연봉 합계를 원화로 환산해 한국이 브라질·프랑스·잉글랜드·아르헨티나 대비 어느 위치인지 보여주는 리포트`

### 3-2. 페이지 톤

- 제목과 카드 문구는 강하게 간다.
- 본문과 표는 데이터 신뢰도를 보수적으로 표시한다.
- `연봉 총액`은 공식 보수 총액이 아니라 선수별 공개 보도와 샐러리 DB를 합산한 추정치로 설명한다.
- `몸값`과 `연봉`을 혼용하지 않는다. Transfermarkt 시장가치는 대체 지표일 뿐, 연봉 합계와 분리한다.

### 3-3. 금지 표현

- `공식 국가대표 연봉 총액`
- `확정 연봉 순위`
- `실수령액`
- `월드컵 출전 수당`
- `선수 몸값 = 연봉`

권장 표현:

- `보도 기준 추정 연봉 합계`
- `샐러리 DB와 언론 보도 기반 원화 환산`
- `확인 가능한 선수 기준 합계`
- `누락 선수를 보정한 추정 총액`
- `데이터 커버리지`

---

## 4. 데이터 기준

### 4-1. 기준일

- 기준일: 구현일 기준으로 별도 `updatedAt` 표시
- 월드컵 기준:
  - 2026 콘텐츠는 48개국 본선 기준
  - 최종 엔트리 발표 전에는 `예상 스쿼드` 또는 `최근 대표팀 명단`으로 표시
  - 최종 엔트리 발표 후 FIFA/KFA/각 협회 명단으로 업데이트

### 4-2. 출처 후보

| 데이터 | 출처 후보 | 배지 | 사용 방식 |
| --- | --- | --- | --- |
| 본선 참가국/조 편성 | FIFA 공식, 대회 공식 페이지 | 공식 | 국가 목록과 조별리그 정보 |
| 최종 명단 | FIFA 스쿼드, 각국 축구협회 발표 | 공식 | 선수 목록 기준 |
| 선수 연봉 | Capology, SalarySport, Spotrac, MLS Players Association, 현지 언론 | 보도 기준/추정 | 선수별 연봉 입력 |
| 한국 선수 | KFA 명단, K리그 공개자료, 해외 리그 보도 | 공식/보도 기준/추정 | 한국 대표팀 상세 카드 |
| 환율 | 한국은행/네이버 금융/기준 환율 입력값 | 참고 | 원화 환산 |
| 시장가치 | Transfermarkt | 참고 | 연봉 누락 보정 참고용, 연봉과 분리 |

참고 URL 후보:

- FIFA: `https://www.fifa.com/`
- KFA: `https://www.kfa.or.kr/`
- Capology: `https://www.capology.com/`
- SalarySport: `https://www.salarysport.com/`
- Spotrac: `https://www.spotrac.com/`
- MLS Players Association: `https://mlsplayers.org/`
- Transfermarkt: `https://www.transfermarkt.com/`

### 4-3. 데이터 등급

```ts
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type TeamCoverageBadge = "높음" | "중간" | "낮음";
export type TournamentMode = "worldcup2026_48" | "featured32" | "worldcup2022_32";
```

등급 기준:

- `공식`: 협회 명단, 리그 공식 보수 공개 자료
- `보도 기준`: 주요 언론 또는 선수협 공개 보수 자료
- `추정`: 샐러리 DB 또는 복수 자료 평균
- `확인 필요`: 선수는 포함하지만 연봉값 신뢰도가 낮은 경우

---

## 5. 데이터 모델 설계

파일: `src/data/worldcupSquadSalaryTotalComparison2026.ts`

### 5-1. 기본 타입

```ts
export type CurrencyCode = "KRW" | "USD" | "EUR" | "GBP" | "BRL" | "JPY" | "AUD" | "CAD";
export type PlayerPosition = "GK" | "DF" | "MF" | "FW";
export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type TeamCoverageBadge = "높음" | "중간" | "낮음";
export type TournamentMode = "worldcup2026_48" | "featured32" | "worldcup2022_32";

export interface ExchangeRatePreset {
  code: CurrencyCode;
  label: string;
  krwRate: number;
  sourceBadge: "참고" | "직접 입력";
}

export interface WorldcupTeam {
  id: string;
  nameKo: string;
  nameEn: string;
  confederation: "AFC" | "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "OFC";
  group?: string;
  fifaRank?: number;
  isQualified: boolean;
  isFeatured: boolean;
  flagEmoji?: string;
}

export interface SquadSalaryPlayer {
  id: string;
  teamId: string;
  nameKo: string;
  nameEn: string;
  position: PlayerPosition;
  club: string;
  league: string;
  salaryAmount: number | null;
  salaryCurrency: CurrencyCode;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note?: string;
  isStar?: boolean;
}

export interface TeamSalarySummary {
  teamId: string;
  confirmedPlayers: number;
  squadSize: number;
  confirmedTotalKrw: number;
  estimatedTotalKrw: number;
  averageKrw: number;
  medianKrw: number;
  topPlayerName: string;
  topPlayerKrw: number;
  topPlayerShare: number;
  coverageRate: number;
  coverageBadge: TeamCoverageBadge;
  sourceBadge: SalarySourceBadge;
}
```

### 5-2. 필수 export

```ts
export const WCSST_META = {
  slug: "worldcup-squad-salary-total-comparison-2026",
  title: "2026 월드컵 대표팀 연봉 총액 순위",
  seoTitle: "월드컵 대표팀 연봉 총액 순위 2026 | 한국은 몇 위? 브라질·프랑스 비교",
  seoDescription:
    "2026 월드컵 본선 국가들의 대표팀 스쿼드 추정 연봉 합계를 원화로 환산해 한국, 브라질, 프랑스, 잉글랜드, 아르헨티나의 격차를 비교합니다.",
  updatedAt: "2026-06-12",
  dataNote:
    "국가별 연봉 총액은 구단 공식 계약서가 아니라 선수별 공개 보도, 샐러리 DB, 선수협 공개자료를 합산한 추정값입니다.",
};

export const WCSST_EXCHANGE_RATES: ExchangeRatePreset[] = [];
export const WCSST_TEAMS: WorldcupTeam[] = [];
export const WCSST_PLAYERS: SquadSalaryPlayer[] = [];
export const WCSST_FAQ = [];
export const WCSST_RELATED_LINKS = [];
```

### 5-3. 국가 초기 세트

MVP는 48개국 전체가 아니라 검색 수요가 큰 국가부터 시작한다.

| 우선순위 | 국가 |
| --- | --- |
| 1 | 대한민국 |
| 1 | 브라질 |
| 1 | 프랑스 |
| 1 | 잉글랜드 |
| 1 | 아르헨티나 |
| 1 | 포르투갈 |
| 1 | 스페인 |
| 1 | 독일 |
| 2 | 일본 |
| 2 | 미국 |
| 2 | 멕시코 |
| 2 | 네덜란드 |
| 2 | 이탈리아 또는 본선 진출 UEFA 주요국 |
| 2 | 크로아티아 |
| 2 | 우루과이 |
| 2 | 콜롬비아 |
| 3 | 호주, 사우디, 모로코, 세네갈 등 |

MVP 표에는 `주요 16개국`으로 시작하고, 데이터가 채워지면 `주요 32개국`, 최종적으로 `48개국`으로 확장한다.

---

## 6. 집계 로직

### 6-1. 선수 원화 환산

```text
선수 원화 연봉 = salaryAmount × currencyRate
```

주의:

- `salaryAmount = null`이면 합계에서 제외하고 `확인 필요`로 표시한다.
- 세금, 보너스, 초상권, 대표팀 포상금은 제외한다.
- 클럽 연봉 기준이므로 국가대표 수당과 다르다.

### 6-2. 국가 합계

```text
확인 합계 = salaryAmount가 있는 선수의 원화 연봉 합계
커버리지 = salaryAmount가 있는 선수 수 / squadSize
평균 확인 연봉 = 확인 합계 / salaryAmount가 있는 선수 수
추정 보정 합계 = 확인 합계 + 누락 선수 수 × 보정 평균
```

보정 평균 우선순위:

1. 같은 국가의 확인 선수 median
2. 같은 리그/포지션 그룹 median
3. 같은 confederation 대표팀 median
4. 보정 불가 시 `확인 합계`만 표시

MVP에서는 보정 로직을 단순화한다.

```text
추정 보정 합계 = 확인 합계 + 누락 선수 수 × 확인 선수 median
```

단, 커버리지가 50% 미만이면 추정 보정 순위에 `낮음` 배지를 붙이고 기본 정렬에서 하단으로 보낼 수 있다.

### 6-3. 순위 기준

사용자에게 두 가지 순위를 제공한다.

| 순위 | 설명 | 기본 여부 |
| --- | --- | --- |
| 추정 보정 총액 순위 | 누락 선수를 median으로 보정한 총액 | 기본 |
| 확인 합계 순위 | 연봉 확인 선수만 합산 | 보조 |

Hero의 `한국은 몇 위?`는 기본적으로 `추정 보정 총액 순위`를 사용하되, 카드 하단에 기준을 명시한다.

### 6-4. 격차 계산

```text
브라질 대비 한국 비율 = 한국 추정 보정 총액 / 브라질 추정 보정 총액
프랑스 대비 한국 비율 = 한국 추정 보정 총액 / 프랑스 추정 보정 총액
격차 금액 = 비교국 추정 보정 총액 - 한국 추정 보정 총액
```

표시 예:

```text
한국 대표팀 추정 연봉 총액은 브라질의 약 00% 수준입니다.
프랑스와의 격차는 약 000억 원으로 추정됩니다.
```

---

## 7. 페이지 IA

1. Hero
2. InfoNotice: 2026은 48개국, 연봉은 추정값
3. 후킹 KPI 카드
   - 한국은 몇 위?
   - 브라질 대비 몇 %
   - 프랑스와 몇 억 차이?
   - 한국 1위 선수 비중
4. 필터/컨트롤
   - 48개국 전체 / 주요 32개국 / 강팀만 / 아시아만
   - 순위 기준: 추정 보정 총액 / 확인 합계
   - 환율 입력
5. 국가별 연봉 총액 순위표
6. 한국 vs 브라질·프랑스·잉글랜드 비교 카드
7. 국가별 TOP 연봉 선수 카드
8. 커버리지와 데이터 신뢰도 설명
9. 월드컵 32개국 표현 주의 박스
10. FAQ
11. 관련 스포츠 연봉 리포트
12. SeoContent

---

## 8. UI 설계

### 8-1. 레이아웃

- BaseLayout 기반 리포트 페이지
- pageClass: `wcsst-page`
- SCSS prefix: `wcsst-`
- 상단은 스포츠 리포트답게 숫자 카드 중심
- 표는 데스크톱에서 넓게, 모바일에서는 국가 카드형으로 전환

### 8-2. Hero

```astro
<CalculatorHero
  eyebrow="월드컵·스포츠 연봉 리포트"
  title="한국 대표팀 연봉 총액은 월드컵 몇 위일까?"
  description="브라질, 프랑스, 잉글랜드, 아르헨티나와 한국 대표팀의 스쿼드 추정 연봉 합계를 원화 기준으로 비교합니다."
/>
```

InfoNotice:

```text
2026 월드컵은 48개국 본선 체제입니다. 이 페이지의 32개국 보기는 전체 본선이 아니라 데이터 비교가 가능한 주요 32개국 필터입니다.
국가별 연봉 총액은 선수별 보도 기준 추정 연봉을 합산한 값이며, 공식 대표팀 급여 총액이 아닙니다.
```

### 8-3. 후킹 KPI 카드

| 카드 | 문구 |
| --- | --- |
| 한국 순위 | `한국은 추정 총액 기준 00위` |
| 브라질 대비 | `브라질의 00% 수준` |
| 프랑스 격차 | `프랑스와 약 000억 차이` |
| 한국 의존도 | `한국 총액 중 손흥민 비중 00%` |

### 8-4. 국가별 순위표

컬럼:

- 순위
- 국가
- 조/대륙
- 추정 보정 총액
- 확인 합계
- 확인 선수 수
- 커버리지
- 최고 연봉 선수
- 브라질 대비
- 출처 신뢰도

모바일 카드:

```text
1위 브라질
추정 총액 0,000억
확인 선수 22/26명 · 커버리지 높음
최고 연봉 선수: Neymar 또는 Vinicius Jr.
한국 대비 0.0배
```

### 8-5. 비교 카드

한국을 중심으로 4개 비교 카드 제공:

- 한국 vs 브라질
- 한국 vs 프랑스
- 한국 vs 잉글랜드
- 한국 vs 일본

각 카드 구성:

- 양국 총액
- 차이 금액
- 한국이 상대국의 몇 %
- 최고 연봉 선수 비교
- 데이터 커버리지

### 8-6. 차트

Chart.js 또는 CSS bar로 충분하다.

차트 1: 국가별 총액 TOP 15  
차트 2: 한국 vs 주요국 비율  
차트 3: 국가별 최고 연봉 선수 비중

차트 실패 fallback:

- 동일 데이터를 순위표로 제공하므로 차트가 없어도 정보 손실 없음

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/worldcup-squad-salary-total-comparison-2026.js`

### 9-1. 함수 목록

```js
function normalizeRate(value, fallback) {}
function convertToKrw(amount, currency, rates) {}
function getMedian(values) {}
function summarizeTeam(team, players, rates) {}
function buildTeamSummaries(teams, players, rates) {}
function rankTeams(summaries, rankMode) {}
function findTeamSummary(summaries, teamId) {}
function buildKoreaComparisons(summaries) {}
function formatKrw(value) {}
function formatPercent(value) {}
function renderKpis(summaries) {}
function renderRankingTable(summaries) {}
function renderComparisonCards(comparisons) {}
function renderCoverageNotes(summaries) {}
function updateCharts(summaries) {}
function syncUrlState(state) {}
function restoreUrlState() {}
```

### 9-2. 상태값

```ts
type PageState = {
  tournamentMode: "worldcup2026_48" | "featured32";
  rankMode: "estimatedTotal" | "confirmedTotal";
  confederationFilter: "all" | "AFC" | "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "OFC";
  usdRate: number;
  eurRate: number;
  gbpRate: number;
  viewUnit: "eok" | "millionKrw";
};
```

### 9-3. URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `mode` | `48` / `featured32` |
| `rank` | `estimated` / `confirmed` |
| `confed` | 대륙 필터 |
| `usd` | 달러 환율 |
| `eur` | 유로 환율 |
| `gbp` | 파운드 환율 |

### 9-4. 입력 제한

- 환율 최소 100, 최대 3000
- 음수, 빈값, NaN은 기본값 복구
- 커버리지 50% 미만 국가는 `커버리지 낮음`으로 표기

---

## 10. SEO 설계

### 10-1. SEO Title

```text
월드컵 대표팀 연봉 총액 순위 2026 | 한국은 몇 위? 브라질·프랑스 비교
```

### 10-2. Meta Description

```text
2026 월드컵 본선 대표팀의 스쿼드 추정 연봉 합계를 원화로 환산해 한국, 브라질, 프랑스, 잉글랜드, 아르헨티나의 격차와 순위를 비교합니다.
```

### 10-3. H1 후보

```text
2026 월드컵 대표팀 연봉 총액 순위
```

보조 H1 변형:

```text
한국 대표팀 연봉 총액은 월드컵 몇 위일까?
```

### 10-4. 권장 H2

- 한국 대표팀 연봉 총액은 몇 위일까
- 브라질·프랑스·잉글랜드와 한국의 연봉 격차
- 월드컵 국가별 스쿼드 연봉 총액 순위
- 국가별 최고 연봉 선수는 누구일까
- 32개국이 아니라 48개국 기준으로 봐야 하는 이유
- 데이터 출처와 추정 방식
- 월드컵 대표팀 연봉 총액 FAQ

### 10-5. 후킹 제목 후보

| 후보 | 용도 |
| --- | --- |
| `손흥민 있어도 한국은 몇 위? 월드컵 대표팀 연봉 총액 순위` | SNS/OG |
| `한국 대표팀 연봉 총액, 브라질의 몇 %일까` | 본문 H2 |
| `브라질·프랑스는 얼마짜리 스쿼드로 월드컵에 나올까` | 섹션 제목 |
| `월드컵 48개국 연봉 총액 순위 — 한국의 현실 위치` | SEO 보조 |
| `한국 vs 브라질 대표팀 연봉 합계 비교` | 롱테일 |

---

## 11. FAQ 설계

```ts
export const WCSST_FAQ = [
  {
    question: "월드컵 대표팀 연봉 총액은 공식 자료인가요?",
    answer:
      "아닙니다. 국가대표팀이 선수 연봉 총액을 공식 발표하는 구조가 아니므로, 이 페이지는 선수별 공개 보도, 샐러리 DB, 선수협 공개자료를 합산한 추정 리포트입니다.",
  },
  {
    question: "2026 월드컵은 32개국인가요?",
    answer:
      "아닙니다. 2026 월드컵은 48개국 본선 체제입니다. 페이지에서 32개국 보기를 제공한다면 전체 본선이 아니라 데이터 비교가 가능한 주요 32개국 필터로 표시해야 합니다.",
  },
  {
    question: "연봉과 몸값은 다른가요?",
    answer:
      "다릅니다. 연봉은 선수가 구단에서 받는 보수 기준이고, 몸값은 이적 시장 가치입니다. 이 페이지의 기본 순위는 연봉 합계를 기준으로 하며, 시장가치는 보조 참고 지표로만 사용합니다.",
  },
  {
    question: "한국 대표팀 총액은 손흥민 한 명 영향이 큰가요?",
    answer:
      "그럴 수 있습니다. 그래서 국가별 총액과 함께 최고 연봉 선수의 팀 내 비중을 표시합니다. 스타 선수 한 명이 총액을 크게 끌어올리는 국가와 평균적으로 높은 국가를 구분하기 위해서입니다.",
  },
  {
    question: "누락 선수가 있으면 순위가 왜 나오나요?",
    answer:
      "확인 가능한 선수만 합산한 확인 합계와 누락 선수를 median으로 보정한 추정 보정 합계를 분리합니다. 커버리지가 낮은 국가는 순위 신뢰도가 낮다는 배지를 표시합니다.",
  },
  {
    question: "대표팀 수당이나 월드컵 포상금도 포함하나요?",
    answer:
      "포함하지 않습니다. 이 리포트는 클럽 연봉 기준 단순 환산이며, 월드컵 출전 수당, 승리 수당, 협회 포상금, 광고 수입, 세금은 제외합니다.",
  },
  {
    question: "환율을 바꾸면 국가 순위도 바뀌나요?",
    answer:
      "네. 국가별 선수 연봉 기준 통화가 달러, 유로, 파운드, 원화 등으로 다르기 때문에 환율 입력값에 따라 원화 환산 총액과 일부 순위가 달라질 수 있습니다.",
  },
];
```

---

## 12. SeoContent 초안 방향

intro 4문단:

1. 월드컵 기간에는 경기 결과뿐 아니라 대표팀 선수 연봉과 몸값 검색 수요가 함께 올라간다.
2. 이 리포트는 선수 개인 연봉이 아니라 국가별 스쿼드 연봉 합계를 비교한다.
3. 2026 월드컵은 48개국이므로 `32개국` 표현은 주요국 필터 또는 2022 회고형에서만 정확하다.
4. 연봉 데이터는 공식 통합 자료가 아니므로 확인 합계, 추정 보정 합계, 데이터 커버리지를 함께 봐야 한다.

필수 문구:

- `이 리포트는 국가대표팀 공식 급여 총액이 아닙니다.`
- `연봉과 시장가치는 다른 지표입니다.`
- `대표팀 수당, 월드컵 포상금, 광고 수입, 세금은 제외했습니다.`
- `커버리지가 낮은 국가는 순위보다 대략적인 규모 비교로 봐야 합니다.`

---

## 13. 관련 링크 전략

| 연결 페이지 | CTA 문구 | 목적 |
| --- | --- | --- |
| `/reports/korea-worldcup-squad-salary-2026/` | 한국 대표팀 선수별 연봉 순위 보기 | 기존 페이지와 연결 |
| `/reports/kleague-salary-comparison-2026/` | K리그 구단 연봉 총액과 비교하기 | 스포츠 연봉 클러스터 |
| `/reports/kbo-salary-comparison-2026/` | KBO 10구단 연봉 총액 보기 | 스포츠 연봉 클러스터 |
| `/reports/large-company-salary-growth-by-years-2026/` | 직장인 연봉과 비교하기 | 일반 연봉 콘텐츠 순환 |
| `/tools/salary/` | 내 연봉 실수령액 계산하기 | 계산기 전환 |

기존 `korea-worldcup-squad-salary-2026` 페이지에서 받을 CTA:

```text
한국 선수 개인 연봉을 봤다면, 이제 국가별 스쿼드 총액으로 비교해보세요.
```

---

## 14. 구현 파일 구조

```text
src/
  data/
    worldcupSquadSalaryTotalComparison2026.ts
    reports.ts
  pages/
    reports/
      worldcup-squad-salary-total-comparison-2026.astro
  styles/
    scss/
      pages/
        _worldcup-squad-salary-total-comparison-2026.scss
    app.scss

public/
  scripts/
    worldcup-squad-salary-total-comparison-2026.js
  sitemap.xml
```

등록 필요:

- `src/data/reports.ts`
- `src/pages/reports/index.astro` 카드 메타 필요 시 추가
- `src/styles/app.scss`
- `public/sitemap.xml`
- OG 이미지 생성 대상

---

## 15. QA 체크리스트

### 데이터

- [ ] 2026 콘텐츠라면 `48개국` 기준을 명시했는가?
- [ ] `32개국` 표현이 `본선 32개국`처럼 부정확하게 쓰이지 않았는가?
- [ ] 국가별 합계에 `확인 합계`와 `추정 보정 합계`를 분리했는가?
- [ ] 데이터 커버리지와 확인 선수 수가 표시되는가?
- [ ] 연봉과 시장가치를 혼용하지 않았는가?
- [ ] 대표팀 수당, 포상금, 광고 수입, 세금 제외 문구가 있는가?

### UI

- [ ] 모바일에서 순위표가 카드형 또는 가로 스크롤로 깨지지 않는가?
- [ ] KPI 카드 문구가 짧고 강하게 보이는가?
- [ ] 커버리지 낮은 국가는 시각적으로 구분되는가?
- [ ] 환율 입력에 NaN, 빈값, 음수 방어가 있는가?
- [ ] Chart.js가 실패해도 핵심 표가 남는가?

### SEO

- [ ] H1에 `월드컵 대표팀 연봉 총액` 또는 `한국은 몇 위` 의도가 들어가는가?
- [ ] Description에 한국, 브라질, 프랑스가 포함되는가?
- [ ] FAQ가 6개 이상인가?
- [ ] 관련 링크가 4개 이상인가?

### 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공

---

## 16. 구현 순서

1. 구현 직전 FIFA 본선 참가국/최종 명단 기준 확인
2. 주요 16개국부터 국가/선수 데이터 입력
3. `confirmedTotal`과 `estimatedTotal` 집계 함수 구현
4. 리포트 페이지와 순위표 구현
5. 환율/필터/순위 기준 JS 구현
6. 기존 한국 대표팀 연봉 페이지에 내부 CTA 추가
7. reports 등록, style import, sitemap 등록
8. `npm run build`
9. 모바일/데스크톱 시각 확인
10. 발행 후 월드컵 명단 변경과 이적/연봉 보도 업데이트

---

## 17. 최종 설계 요약

이 콘텐츠는 클릭을 만드는 제목은 강하게 가져가되, 실제 데이터 처리는 매우 보수적으로 해야 한다. 가장 중요한 장치는 `한국은 몇 위`라는 후킹 카드와 `확인 합계/추정 보정 합계/커버리지`를 동시에 보여주는 것이다.

2026 월드컵은 48개국 체제이므로 `32개국 본선`이라고 쓰면 정확성 문제가 생긴다. 따라서 페이지는 48개국 기준으로 설계하고, 데이터 수집 범위를 줄이고 싶을 때만 `주요 32개국 보기` 필터를 제공한다. 기존 `대한민국 월드컵 대표팀 연봉 순위` 페이지와 연결하면, 선수 개인 연봉에서 국가별 스쿼드 총액으로 자연스럽게 확장되는 스포츠 연봉 클러스터가 된다.
