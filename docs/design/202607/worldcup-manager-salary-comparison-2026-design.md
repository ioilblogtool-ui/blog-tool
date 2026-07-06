# 월드컵 감독 연봉 비교 2026 설계 문서

> 작성일: 2026-07-01  
> 콘텐츠 유형: `/reports/` 인터랙티브 리포트  
> 구현 대상 URL: `/reports/worldcup-manager-salary-comparison-2026/`  
> 연결 기획 문서: `docs/plan/202607/worldcup-manager-salary-comparison-2026.md`  
> 핵심 안전장치: 감독 연봉은 비공개 계약이 많으므로 `공식`, `보도 기준`, `추정`, `확인 필요`, `미공개`를 반드시 분리한다.

---

## 1. 문서 개요

- 구현 대상: `월드컵 감독 연봉 비교 2026`
- 권장 slug: `worldcup-manager-salary-comparison-2026`
- URL: `/reports/worldcup-manager-salary-comparison-2026/`
- 카테고리: 스포츠 / 축구 / 연봉
- 메인 훅:
  - `홍명보 감독 연봉은 월드컵 감독 시장에서 어느 정도일까`
  - 단, 2026년 7월 1일 구현 기준으로 홍명보 감독 거취 관련 최신 보도를 반드시 재확인한다.
- 핵심 출력:
  - 홍명보 체제 연봉 공개 여부
  - 2026 월드컵 주요 감독 연봉 비교
  - 한국 전임 감독 연봉 비교
  - 경기당 비용, 승점당 비용, FIFA 랭킹 대비 연봉
  - 연봉 데이터 신뢰도 표

---

## 2. 최신성 주의

2026년 7월 1일 기준으로 홍명보 감독 거취는 구현 직전 반드시 재확인해야 한다. 해외 보도에서는 2026년 6월 말 사임 관련 보도가 확인되므로, 페이지 카피는 아래 두 모드를 모두 지원해야 한다.

### A안: 현직 감독 기준

```text
월드컵 감독 연봉 비교 2026: 홍명보 감독은 몇 위권일까
```

### B안: 홍명보 체제 회고 기준

```text
월드컵 감독 연봉 비교 2026: 홍명보 체제는 어느 정도 비용이었을까
```

### 구현 규칙

- `MANAGER_CONTEXT.isCurrentCoach` 값으로 문구 분기
- 현직이면 `홍명보 감독`
- 사임 또는 교체가 확인되면 `홍명보 체제`, `홍명보 전 감독`
- 연봉이 공식 확인되지 않으면 상단 KPI에 숫자를 억지로 넣지 않는다.

---

## 3. 콘텐츠 포지셔닝

### 한 줄 가치 제안

`홍명보 감독을 출발점으로, 월드컵 대표팀 감독 연봉을 원화 기준으로 환산하고 데이터 신뢰도까지 함께 보여주는 리포트`

### 독자가 얻는 것

- 홍명보 감독 연봉이 공개됐는지 여부
- 주요 월드컵 감독 연봉의 대략적인 시장 구간
- 한국 전임 감독 연봉이 세계 감독 시장에서 어느 위치였는지
- 단순 연봉 순위가 아니라 경기 수, 승점, FIFA 랭킹과 함께 보는 해석
- 공식값과 추정값을 구분해 읽는 기준

### 절대 피해야 할 방향

- `홍명보 연봉 확정`처럼 보이는 제목
- 출처가 약한 금액을 공식 데이터처럼 제시
- 감독 연봉이 높으면 성적이 좋다는 단정
- 특정 감독을 조롱하거나 정치적으로 평가하는 문장
- `1승당 비용`을 능력 평가 지표처럼 강조

---

## 4. SEO 설계

### SEO title 후보

1. `월드컵 감독 연봉 비교 2026 | 홍명보 감독 연봉은 몇 위권일까`
2. `홍명보 감독 연봉과 월드컵 감독 연봉 순위 2026`
3. `축구 국가대표 감독 연봉 비교 | 홍명보·클린스만·벤투와 월드컵 감독 시장`

권장:

```text
월드컵 감독 연봉 비교 2026 | 홍명보 감독 연봉은 몇 위권일까
```

단, 구현 시점에 홍명보 감독이 전 감독이면:

```text
월드컵 감독 연봉 비교 2026 | 홍명보 체제와 주요 감독 연봉
```

### Meta description

```text
홍명보 감독을 포함해 2026 월드컵 주요 국가대표 감독 연봉을 원화 기준으로 비교합니다. 공식·보도·추정 배지를 나누고, 경기당 비용과 승점당 비용까지 함께 계산합니다.
```

사임 반영 버전:

```text
홍명보 체제를 포함해 한국 전임 감독과 2026 월드컵 주요 국가대표 감독 연봉을 원화 기준으로 비교합니다. 공식·보도·추정 배지를 구분하고 경기당 비용과 승점당 비용도 함께 봅니다.
```

### H1

```text
월드컵 감독 연봉 비교 2026
```

### H2 후보

- 홍명보 감독 연봉은 공개됐을까
- 2026 월드컵 주요 감독 연봉 순위
- 안첼로티·투헬·나겔스만·포체티노 연봉 비교
- 홍명보·클린스만·벤투 한국 대표팀 감독 연봉 비교
- 경기당 비용과 승점당 비용으로 보면
- 감독 연봉은 왜 공식 데이터가 적을까
- 월드컵 감독 연봉 FAQ

### 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 홍명보 연봉 | title, H1 하단 리드, FAQ |
| 홍명보 감독 연봉 | title, 첫 H2, KPI |
| 월드컵 감독 연봉 | title, H1, 전체 표 |
| 월드컵 감독 연봉 순위 | H2, 정렬 표 |
| 축구 국가대표 감독 연봉 | 한국 감독 비교 섹션 |
| 클린스만 연봉 | 한국 전임 감독 비교, FAQ |
| 벤투 연봉 | 한국 전임 감독 비교, FAQ |
| 안첼로티 연봉 | 주요 감독 카드 |
| 투헬 연봉 | 주요 감독 카드 |
| 포체티노 연봉 | 주요 감독 카드 |
| 나겔스만 연봉 | 주요 감독 카드 |

---

## 5. 연봉 숫자 설계 원칙

### 기준 환율

구현 직전 최신 환율로 갱신한다. 설계 문서의 원화 환산은 아래 임시 기준을 사용한다.

| 통화 | 설계 기준 환율 | 비고 |
|---|---:|---|
| USD | 1,380원 | 구현 직전 갱신 |
| EUR | 1,600원 | 구현 직전 갱신 |
| GBP | 1,870원 | 구현 직전 갱신 |

### 금액 표시 규칙

- 원화는 기본적으로 `억원` 단위
- 1억원 미만은 `만원` 단위
- 외화 원금과 원화 환산을 함께 표시
- 범위값은 범위 그대로 표시
- 출처가 약한 값은 `확인 필요`로 분리하고 순위 기본값에서 제외 가능

예:

```text
€10,000,000 / 약 160억원 / 보도 기준
$4,000,000~$6,000,000 / 약 55억~83억원 / 보도 범위
미공개 / 확인 필요
```

---

## 6. 초기 연봉 데이터 테이블

이 표는 구현 시작용 시드 데이터다. 구현 직전 최신 보도로 다시 확인해야 하며, 출처가 충돌하는 값은 범위로 표시한다.

| 구분 | 국가 | 감독 | 연봉 원문 | 원화 환산 | 데이터 배지 | 구현 메모 |
|---|---|---|---:|---:|---|---|
| 현재/최근 한국 | 대한민국 | 홍명보 | 약 20억원 | 약 20억원 | 추정 | KFA 공식 공개값이 아닌 언론 보도·업계 추정 기준으로 표시 |
| 전임 한국 | 대한민국 | 위르겐 클린스만 | 약 29억원 보도 | 약 29억원 | 보도 기준 | 한국 감독 비교용, 출처 재확인 |
| 전임 한국 | 대한민국 | 파울루 벤투 | 약 18억원 보도 | 약 18억원 | 보도 기준 | 한국 감독 비교용, 출처 재확인 |
| 현 주요 감독 | 브라질 | 카를로 안첼로티 | 약 €10,000,000 | 약 160억원 | 보도 기준 | 일부 보도는 보너스 별도 언급 가능 |
| 현 주요 감독 | 독일 | 율리안 나겔스만 | 약 €7,000,000 | 약 112억원 | 보도 기준 | 독일 대표팀 최고 연봉권 카드 |
| 현 주요 감독 | 잉글랜드 | 토마스 투헬 | 약 £6,000,000~£7,000,000 | 약 112억~131억원 | 보도 범위 | 계약 보도별 차이 존재 |
| 현 주요 감독 | 미국 | 마우리시오 포체티노 | 약 $4,000,000~$6,000,000 | 약 55억~83억원 | 보도 범위 | 보도 출처 간 차이 큼 |
| 현 주요 감독 | 프랑스 | 디디에 데샹 | 약 €3,800,000 | 약 61억원 | 추정/보도 기준 | 2022년 공개 리스트 기반, 최신 재확인 필요 |
| 현 주요 감독 | 아르헨티나 | 리오넬 스칼로니 | 약 €2,600,000 | 약 42억원 | 추정/보도 기준 | 2022년 공개 리스트 기반, 최신 재확인 필요 |
| 현 주요 감독 | 네덜란드 | 로날드 쿠만 | 확인 필요 | 확인 필요 | 확인 필요 | 최신 금액 확보 후 반영 |
| 현 주요 감독 | 스페인 | 루이스 데 라 푸엔테 | 확인 필요 | 확인 필요 | 확인 필요 | 최신 금액 확보 후 반영 |
| 현 주요 감독 | 포르투갈 | 로베르토 마르티네스 | 확인 필요 | 확인 필요 | 확인 필요 | 최신 금액 확보 후 반영 |
| 현 주요 감독 | 일본 | 모리야스 하지메 | 확인 필요 | 확인 필요 | 확인 필요 | 아시아권 비교축 |
| 현 주요 감독 | 호주 | 토니 포포비치 | 확인 필요 | 확인 필요 | 확인 필요 | AFC 비교축 |

### 홍명보 숫자 처리 원칙

홍명보 감독 연봉은 콘텐츠의 훅이지만, 정확한 연봉이 확인되지 않으면 아래처럼 처리한다.

상단 KPI:

```text
홍명보 감독 연봉
약 20억원
협회 공식 공개 또는 신뢰 가능한 보도 확인 전까지 금액을 확정 표시하지 않습니다.
```

본문:

```text
홍명보 감독 연봉은 약 20억원 안팎으로 알려진 값을 사용하되, KFA 공식 공개값이 아닌 추정값으로 처리합니다. 클린스만·벤투 전임 감독 보도값과 주요 월드컵 감독 보도값을 기준으로 한국 대표팀 감독직의 시장 구간을 해석합니다.
```

금액 후보를 사용해야 하는 경우:

- `홍명보 연봉 후보값`을 본문 기본값으로 쓰지 않는다.
- 별도 접힘 섹션 `확인 필요 보도값`에만 둔다.
- 출처 URL, 보도일, 매체명을 반드시 저장한다.
- `공식 확인 전 추정` 배지를 붙인다.

---

## 7. 데이터 모델 설계

파일:

```text
src/data/worldcupManagerSalaryComparison2026.ts
```

### 타입

```ts
export type CurrencyCode = "KRW" | "USD" | "EUR" | "GBP";

export type SalaryEvidenceBadge =
  | "공식"
  | "보도 기준"
  | "보도 범위"
  | "추정"
  | "확인 필요"
  | "미공개";

export type Confederation =
  | "AFC"
  | "UEFA"
  | "CONMEBOL"
  | "CONCACAF"
  | "CAF"
  | "OFC";

export interface ExchangeRatePreset {
  code: CurrencyCode;
  label: string;
  krwRate: number;
  sourceLabel: string;
  updatedAt: string;
}

export interface ManagerSalaryRecord {
  id: string;
  countryKo: string;
  countryEn: string;
  managerNameKo: string;
  managerNameEn: string;
  confederation: Confederation;
  isKoreaManager: boolean;
  isCurrentCoach: boolean;
  periodLabel?: string;
  annualSalaryLocal: number | null;
  annualSalaryLocalMin?: number;
  annualSalaryLocalMax?: number;
  currency: CurrencyCode;
  annualSalaryKrw: number | null;
  annualSalaryKrwMin?: number;
  annualSalaryKrwMax?: number;
  evidenceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate?: string;
  contractPeriodLabel?: string;
  fifaRank?: number;
  recentMatches?: number;
  recentWins?: number;
  recentDraws?: number;
  recentLosses?: number;
  notes: string[];
  includeInDefaultRanking: boolean;
}

export interface DerivedManagerMetric {
  managerId: string;
  monthlyKrw: number | null;
  matchCostKrw: number | null;
  winCostKrw: number | null;
  pointCostKrw: number | null;
  rankCostIndex: number | null;
}

export interface PageFaqItem {
  q: string;
  a: string;
}
```

### 필수 export

```ts
export const WMCS_META = {
  slug: "worldcup-manager-salary-comparison-2026",
  title: "월드컵 감독 연봉 비교 2026",
  seoTitle: "월드컵 감독 연봉 비교 2026 | 홍명보 감독 연봉은 몇 위권일까",
  seoDescription:
    "홍명보 감독을 포함해 2026 월드컵 주요 국가대표 감독 연봉을 원화 기준으로 비교합니다. 공식·보도·추정 배지를 나누고, 경기당 비용과 승점당 비용까지 함께 계산합니다.",
  updatedAt: "2026-07-01",
  dataNote:
    "감독 연봉은 공식 공개되지 않은 계약이 많습니다. 이 페이지는 공식 발표, 언론 보도, 공개 데이터베이스를 구분해 표시하며 비공개 계약은 추정값으로만 다룹니다.",
};

export const WMCS_MANAGER_CONTEXT = {
  koreaFocusManagerId: "hong-myung-bo",
  isCurrentCoach: false,
  currentStatusLabel: "거취 최신 확인 필요",
  statusNote:
    "구현 직전 대한축구협회 공지와 주요 통신사 보도를 재확인해 현직/전임 표현을 결정합니다.",
};

export const WMCS_EXCHANGE_RATES: ExchangeRatePreset[] = [];
export const WMCS_MANAGERS: ManagerSalaryRecord[] = [];
export const WMCS_FAQ: PageFaqItem[] = [];
export const WMCS_RELATED_LINKS = [];
```

---

## 8. 계산 로직

### 원화 환산

```text
원화 연봉 = 외화 연봉 × 기준 환율
```

범위값:

```text
원화 연봉 하단 = 외화 연봉 하단 × 기준 환율
원화 연봉 상단 = 외화 연봉 상단 × 기준 환율
```

### 월급 환산

```text
월급 = 원화 연봉 ÷ 12
```

### 경기당 비용

```text
경기당 비용 = 원화 연봉 ÷ 최근 1년 A매치 수
```

최근 1년 경기 수가 불명확하면:

```text
경기당 비용 = null
```

UI 표시:

```text
경기 수 기준 미확정
```

### 승점당 비용

```text
최근 1년 승점 = 승 × 3 + 무 × 1
승점당 비용 = 원화 연봉 ÷ 최근 1년 승점
```

주의:

- 승점당 비용은 공식 평가 지표가 아니다.
- 상대 수준, 경기 중요도, 홈/원정 조건을 반영하지 않는다.
- 본문에서 `체감용 보조 지표`라고 안내한다.

### 1승당 비용

```text
1승당 비용 = 원화 연봉 ÷ 최근 1년 승수
```

권장 노출:

- KPI에는 넣지 않는다.
- 상세 표나 접힘 섹션에만 표시한다.
- 클릭을 끌 수 있지만 오해가 커서 보조 지표로 낮춘다.

---

## 9. 페이지 IA

1. Hero
2. 데이터 신뢰도 안내
3. 홍명보 감독/홍명보 체제 요약 카드
4. 주요 월드컵 감독 연봉 KPI
5. 주요 감독 연봉 순위 표
6. 한국 대표팀 감독 연봉 히스토리
7. 효율 지표: 경기당 비용, 승점당 비용
8. 국가별/대륙별 비교
9. 데이터 출처와 방법론
10. FAQ
11. 관련 스포츠 연봉 리포트
12. SeoContent

---

## 10. UI 설계

### 레이아웃

- `BaseLayout` 기반
- pageClass: `wmcs-page`
- SCSS prefix: `wmcs-`
- 첫 화면은 리포트형이지만 숫자 카드가 바로 보여야 한다.
- 대시보드처럼 무겁지 않게, 읽는 흐름을 유지한다.

### Hero

```astro
<CalculatorHero
  eyebrow="스포츠 연봉 리포트"
  title="월드컵 감독 연봉 비교 2026"
  description="홍명보 감독을 출발점으로 주요 월드컵 국가대표 감독 연봉을 원화 기준으로 비교합니다. 공식·보도·추정 배지를 나누고 경기당 비용과 승점당 비용도 함께 봅니다."
/>
```

사임 반영 시 description:

```text
홍명보 체제를 출발점으로 한국 전임 감독과 주요 월드컵 국가대표 감독 연봉을 원화 기준으로 비교합니다.
```

### InfoNotice

```text
감독 연봉은 국가협회가 공식 공개하지 않는 경우가 많습니다. 이 페이지는 공식 발표, 주요 언론 보도, 공개 데이터베이스를 구분해 표시하며, 비공개 계약은 추정값 또는 미공개로 처리합니다.
```

### 상단 KPI 카드

| 카드 | 기본 문구 | 조건 |
|---|---|---|
| 홍명보 연봉 | `약 20억원` | 추정 배지 필수 |
| 최고 보도 연봉 | `안첼로티 약 160억원` | 안첼로티 데이터 사용 시 |
| 보도 범위 상위권 | `투헬 약 112억~131억원` | 범위값 표시 |
| 한국 전임 감독 | `클린스만 약 29억원 / 벤투 약 18억원` | 한국 비교 |

### 홍명보 요약 카드

구성:

- 이름
- 역할 상태: 현직 / 전임 / 확인 필요
- 연봉 공개 여부
- 계약 기간
- 데이터 배지
- 설명 2문장

문구:

```text
홍명보 감독 연봉은 약 20억원 안팎 추정값으로 표시하되, 공식 확정값처럼 보이지 않게 `추정` 배지를 붙입니다. 한국 전임 감독 보도값과 세계 주요 감독 보도값을 기준으로 시장 구간을 비교합니다.
```

### 주요 감독 연봉 표

컬럼:

- 순위
- 국가
- 감독
- 연봉 원문
- 원화 환산
- 데이터 배지
- 계약/기준 메모
- 출처

정렬:

- 원화 환산 높은 순
- 국가명
- 대륙
- 데이터 신뢰도

필터:

- 전체
- 한국 관련
- UEFA
- CONMEBOL
- AFC
- CONCACAF
- 보도 기준만
- 추정 포함

### 한국 감독 히스토리 섹션

카드 3개:

- 홍명보
- 클린스만
- 벤투

표시:

- 기간
- 연봉
- 데이터 배지
- 월드컵 사이클
- 한 줄 해석

문구:

```text
한국 대표팀 감독 연봉 비교는 확정 순위가 아니라 보도 기준의 시장 구간을 보는 용도입니다.
```

### 효율 지표 섹션

카드:

- 경기당 비용
- 승점당 비용
- 월급 환산
- FIFA 랭킹 대비 연봉

주의 문구:

```text
경기당 비용과 승점당 비용은 단순 환산 지표입니다. 상대 전력, 경기 중요도, 선수단 부상, 대회 단계는 반영하지 않습니다.
```

### 차트

Chart.js 없이 CSS bar 우선.

차트 1:

- 주요 감독 연봉 TOP 8

차트 2:

- 한국 전임 감독 연봉 비교

차트 3:

- 대륙별 보도 연봉 구간

Fallback:

- 차트가 없어도 표와 카드만으로 핵심 정보가 남아야 한다.

---

## 11. 클라이언트 JS 설계

파일:

```text
public/scripts/worldcup-manager-salary-comparison-2026.js
```

### 패턴

- IIFE
- `script[type="application/json"]` 데이터 주입
- DOM 업데이트는 `textContent` 우선
- URL state 사용
- `NaN`, `null`, `undefined` 방어

### 주요 함수

```js
function normalizeRate(value, fallback) {}
function convertToKrw(amount, currency, rates) {}
function convertRangeToKrw(min, max, currency, rates) {}
function buildDerivedMetrics(manager, rates) {}
function formatKrw(value) {}
function formatForeignSalary(manager) {}
function formatSalaryBadge(badge) {}
function getSortableSalaryValue(manager) {}
function filterManagers(managers, state) {}
function sortManagers(managers, state) {}
function renderKpis(managers, context) {}
function renderHongSummary(manager, context) {}
function renderManagerTable(managers) {}
function renderKoreaHistory(managers) {}
function renderEfficiencyCards(managers) {}
function renderBars(managers) {}
function syncUrlState(state) {}
function restoreUrlState() {}
```

### URL 파라미터

| 파라미터 | 값 |
|---|---|
| `confed` | `all`, `AFC`, `UEFA`, `CONMEBOL`, `CONCACAF`, `CAF`, `OFC` |
| `source` | `all`, `reported`, `estimated`, `verified` |
| `sort` | `salary-desc`, `salary-asc`, `country`, `source` |
| `usd` | 사용자 입력 USD 환율 |
| `eur` | 사용자 입력 EUR 환율 |
| `gbp` | 사용자 입력 GBP 환율 |

---

## 12. Astro 페이지 구조

파일:

```text
src/pages/reports/worldcup-manager-salary-comparison-2026.astro
```

구성:

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  WMCS_META,
  WMCS_MANAGER_CONTEXT,
  WMCS_EXCHANGE_RATES,
  WMCS_MANAGERS,
  WMCS_FAQ,
  WMCS_RELATED_LINKS,
} from "../../data/worldcupManagerSalaryComparison2026";
---

<BaseLayout
  title={WMCS_META.seoTitle}
  description={WMCS_META.seoDescription}
  pageClass="wmcs-page"
>
  <!-- Hero -->
  <!-- InfoNotice -->
  <!-- KPI -->
  <!-- Hong summary -->
  <!-- Controls -->
  <!-- Ranking table -->
  <!-- Korea history -->
  <!-- Efficiency section -->
  <!-- Methodology -->
  <!-- FAQ -->
  <!-- Related links -->
  <!-- SeoContent -->
</BaseLayout>
```

데이터 주입:

```astro
<script
  id="wmcs-data"
  type="application/json"
  set:html={JSON.stringify({
    context: WMCS_MANAGER_CONTEXT,
    rates: WMCS_EXCHANGE_RATES,
    managers: WMCS_MANAGERS,
  })}
/>
<script src="/scripts/worldcup-manager-salary-comparison-2026.js" defer></script>
```

---

## 13. SCSS 설계

파일:

```text
src/styles/scss/pages/_worldcup-manager-salary-comparison-2026.scss
```

prefix:

```text
wmcs-
```

주요 클래스:

```scss
.wmcs-page {}
.wmcs-notice {}
.wmcs-kpi-grid {}
.wmcs-kpi-card {}
.wmcs-focus-card {}
.wmcs-controls {}
.wmcs-table-wrap {}
.wmcs-manager-table {}
.wmcs-mobile-card-list {}
.wmcs-mobile-card {}
.wmcs-badge {}
.wmcs-badge--official {}
.wmcs-badge--reported {}
.wmcs-badge--range {}
.wmcs-badge--estimated {}
.wmcs-badge--unknown {}
.wmcs-bar-list {}
.wmcs-bar-row {}
.wmcs-methodology {}
.wmcs-faq {}
.wmcs-related {}
```

모바일:

- 640px 이하에서는 표를 카드 리스트로 전환
- KPI는 1열
- 컨트롤은 세로 스택
- 긴 감독명과 국가명은 줄바꿈 허용
- 배지는 줄바꿈되어도 카드 높이가 과도하게 흔들리지 않도록 min-height 적용

---

## 14. FAQ 설계

```ts
export const WMCS_FAQ = [
  {
    q: "홍명보 감독 연봉은 공식 공개된 금액인가요?",
    a: "약 20억원 안팎 추정값으로 표시합니다. 다만 대한축구협회 공식 공개값으로 확인된 숫자는 아니므로 공식 연봉처럼 쓰지 않고 추정 배지를 붙입니다.",
  },
  {
    q: "월드컵 감독 연봉 순위는 확정 순위인가요?",
    a: "아닙니다. 국가대표 감독 계약은 비공개가 많아 이 페이지의 순위는 공개 보도와 확인 가능한 추정값 기준의 비교 순위입니다.",
  },
  {
    q: "클린스만 감독과 벤투 감독 연봉은 어떻게 비교하나요?",
    a: "보도된 원화 기준 연봉을 같은 표에 넣고, 데이터 배지를 붙여 비교합니다. 계약 세부 조건과 보너스는 반영하지 않습니다.",
  },
  {
    q: "감독 연봉은 세전인가요, 세후인가요?",
    a: "대부분 보도값은 세전 또는 계약 총액 기준으로 해석해야 합니다. 세후 실수령액, 보너스, 주거 지원, 차량 지원 등은 별도로 확인되지 않으면 제외합니다.",
  },
  {
    q: "안첼로티, 투헬, 나겔스만 연봉은 왜 범위나 추정으로 표시되나요?",
    a: "감독 계약은 매체별 보도 금액이 다를 수 있습니다. 보도값이 충돌하면 하나의 확정값처럼 보이지 않도록 범위 또는 보도 기준 배지를 사용합니다.",
  },
  {
    q: "경기당 비용은 어떻게 계산하나요?",
    a: "원화 연봉을 최근 1년 A매치 수로 나눈 단순 환산값입니다. 경기 중요도와 상대 수준은 반영하지 않는 참고 지표입니다.",
  },
  {
    q: "승점당 비용은 감독 능력 지표인가요?",
    a: "아닙니다. 승점당 비용은 비용을 체감하기 위한 보조 지표이며, 감독 능력이나 전술 수준을 평가하는 공식 지표가 아닙니다.",
  },
  {
    q: "환율을 바꾸면 순위도 달라지나요?",
    a: "달러, 유로, 파운드 연봉을 원화로 환산하기 때문에 환율 입력값에 따라 일부 순위와 금액이 달라질 수 있습니다.",
  },
];
```

---

## 15. 관련 링크 전략

상단 또는 본문 중간:

| 링크 | 앵커 |
|---|---|
| `/reports/korea-worldcup-squad-salary-2026/` | 한국 월드컵 대표팀 선수 연봉 비교 |
| `/reports/worldcup-squad-salary-total-comparison-2026/` | 월드컵 대표팀 선수단 연봉 총액 비교 |
| `/tools/worldcup-prize-money-calculator/` | 월드컵 상금 계산기 |

하단:

| 링크 | 앵커 |
|---|---|
| `/reports/korea-football-legends-salary-comparison-2026/` | 한국 축구 레전드 연봉 비교 |
| `/reports/son-heung-min-lafc-salary-net-worth-2026/` | 손흥민 LAFC 연봉 리포트 |
| `/reports/lee-kang-in-psg-salary-2026/` | 이강인 PSG 연봉 리포트 |

---

## 16. 구현 파일 목록

```text
src/
  data/
    worldcupManagerSalaryComparison2026.ts
    reports.ts
  pages/
    reports/
      worldcup-manager-salary-comparison-2026.astro
  styles/
    scss/
      pages/
        _worldcup-manager-salary-comparison-2026.scss
    app.scss

public/
  scripts/
    worldcup-manager-salary-comparison-2026.js
  sitemap.xml
```

등록 필요:

- `src/data/reports.ts`
- `src/pages/index.astro`의 `reportMetaBySlug`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 17. 콘텐츠 본문 초안

### 홍명보 감독 연봉은 공개됐을까

홍명보 감독 연봉은 검색 수요가 높고 약 20억원 안팎으로 알려져 있다. 다만 대표팀 감독 계약은 세부 금액이 공식 공개되지 않는 경우가 많으므로, 이 페이지는 20억원을 공식 확정값이 아니라 추정 기준으로 먼저 보여준다.

공식 또는 주요 보도에서 확인 가능한 금액이 있으면 `보도 기준` 배지를 붙인다. 홍명보 20억원처럼 공식값은 아니지만 널리 알려진 금액은 `추정`으로 두고, 클린스만·벤투 전임 감독 보도값과 세계 주요 감독 보도값을 기준으로 시장 구간을 해석한다.

### 월드컵 감독 연봉 상위권은 어느 정도일까

2026 월드컵을 앞두고 가장 높은 보도 연봉 구간에 있는 감독은 안첼로티, 나겔스만, 투헬, 포체티노처럼 유럽 빅클럽 또는 빅리그 커리어가 뚜렷한 감독들이다.

안첼로티의 브라질 대표팀 연봉은 약 1,000만 유로 보도 기준으로 원화 약 160억원 수준이다. 나겔스만은 약 700만 유로, 투헬은 약 600만~700만 파운드 보도 범위로 잡으면 모두 한국 전임 감독 보도값보다 높은 구간에 있다.

### 한국 대표팀 감독 연봉은 낮은 편일까

클린스만 약 29억원, 벤투 약 18억원 보도값을 기준으로 보면 한국 대표팀 감독직은 세계 최상위권 감독 연봉과는 차이가 크지만, AFC 중상위권 또는 월드컵 본선 중위권 국가와 비교할 수 있는 구간으로 볼 수 있다.

다만 감독 연봉은 협회 예산, 감독 커리어, 월드컵 기대 성적, 계약 기간, 보너스 구조가 섞인 결과다. 단순히 비싸다거나 싸다고 단정하기보다 같은 기준으로 환산한 구간을 보는 편이 안전하다.

### 경기당 비용은 어떻게 읽어야 할까

경기당 비용은 연봉을 최근 1년 경기 수로 나눈 체감 지표다. 숫자는 직관적이지만 상대 전력, 홈/원정, 대회 중요도, 선수단 부상 같은 요소를 반영하지 못한다.

따라서 이 페이지에서는 경기당 비용과 승점당 비용을 `참고 지표`로만 보여준다. 감독 능력 평가나 선임 타당성 판단은 별도의 축구적 분석이 필요하다.

---

## 18. 출처 설계

구현 직전 아래 출처를 재확인한다.

공식:

- 대한축구협회: `https://www.kfa.or.kr/`
- FIFA 월드랭킹: `https://inside.fifa.com/fifa-world-ranking/men`
- FIFA 대회/일정: `https://www.fifa.com/`

보도/확인 후보:

- AP, Reuters 등 통신사: 홍명보 선임/사임, 주요 감독 선임
- The Guardian, BBC, Sky Sports: 투헬·포체티노·월드컵 관련 보도
- ESPN, The Athletic, CBS Sports: 미국 대표팀 및 포체티노 관련 보도
- AS, Marca, Globo, Reuters: 안첼로티 브라질 대표팀 관련 보도
- KBS, 연합뉴스, 중앙일보, 조선일보, 한겨레 등 국내 매체: 홍명보·클린스만·벤투 보도값 확인

출처 저장 규칙:

```ts
sourceLabel: "Reuters 보도, 2026-05",
sourceUrl: "https://...",
sourceDate: "2026-05-12",
evidenceBadge: "보도 기준",
```

---

## 19. QA 체크리스트

### 데이터

- [ ] 홍명보 감독 현직/전임 상태를 구현 직전 재확인했는가?
- [ ] 홍명보 연봉 20억원을 공식값이 아니라 `추정`으로 표시했는가?
- [ ] 모든 금액에 데이터 배지가 붙어 있는가?
- [ ] 보도 범위값은 단일 확정값처럼 보이지 않는가?
- [ ] 환율 기준일과 환율값이 표시되어 있는가?
- [ ] 세전/세후, 보너스, 수당 제외 안내가 있는가?

### UI

- [ ] 모바일에서 표가 깨지지 않고 카드형으로 전환되는가?
- [ ] KPI 카드의 긴 문구가 넘치지 않는가?
- [ ] 배지가 색상만이 아니라 텍스트로도 구분되는가?
- [ ] 차트 없이도 핵심 정보가 읽히는가?
- [ ] 필터와 정렬 후 빈 상태 문구가 자연스러운가?

### SEO

- [ ] H1에 `월드컵 감독 연봉`이 들어가는가?
- [ ] title 또는 description에 `홍명보`가 들어가는가?
- [ ] FAQ가 visible 상태인가?
- [ ] 관련 스포츠 연봉 리포트 링크가 3개 이상인가?
- [ ] `reports.ts`, 홈 메타, sitemap 등록이 완료되었는가?

### 안전성

- [ ] `공식 연봉`, `확정 연봉`, `실수령액` 표현을 남용하지 않았는가?
- [ ] 특정 감독 평가가 과도하게 단정적이지 않은가?
- [ ] 출처가 약한 값은 기본 순위에서 제외하거나 `확인 필요`로 표시했는가?

---

## 20. 구현 순서

1. 구현 직전 최신 출처 재확인
2. 홍명보 현직/전임 상태 결정
3. `worldcupManagerSalaryComparison2026.ts` 데이터 작성
4. 리포트 Astro 페이지 작성
5. CSS bar 기반 차트와 표 구현
6. 클라이언트 필터/정렬 JS 구현
7. FAQ + 방법론 + 관련 링크 구현
8. `reports.ts`, `index.astro`, `app.scss`, `sitemap.xml` 등록
9. `npm run build`
10. 모바일/데스크톱 시각 확인

---

## 21. 최종 설계 요약

이 리포트의 승부처는 `홍명보 연봉 얼마?`라는 검색 의도에 약 20억원 추정값으로 빠르게 답하되, 공식 확정값이 아님을 분명히 보여준 뒤 세계 감독 시장과 한국 전임 감독 보도값을 함께 놓는 것이다.

상단에서는 홍명보 체제의 약 20억원 추정값을 빠르게 답하고, 본문에서는 안첼로티·투헬·나겔스만·포체티노 같은 보도 금액이 잡히는 감독을 기준축으로 삼는다. 이렇게 하면 검색 유입은 `홍명보 연봉`으로 받고, 체류 시간은 `월드컵 감독 연봉 순위`, `한국 전임 감독 비교`, `경기당 비용`으로 늘릴 수 있다.
