# 2026 국내 여행 vs 해외 여행 실비용 비교 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/domestic-vs-overseas-travel-cost-2026.md`
> 작성일: 2026-04-27
> 구현 기준: Codex가 이 문서만 보고 `/reports/` 리포트 페이지를 바로 구현할 수 있는 수준으로 고정
> 참고 페이지: `overseas-travel-cost-compare-2026`, `overseas-travel-cost`, `flight-cheapest-timing-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `2026 국내 여행 vs 해외 여행 실비용 비교`
- 콘텐츠 유형: 데이터 리포트 (`/reports/` 계열)
- 권장 slug: `domestic-vs-overseas-travel-cost-2026`
- URL: `/reports/domestic-vs-overseas-travel-cost-2026/`
- 비교 기준: 성인 2인, 2박 3일, 서울/수도권 출발 기준

### 1-2. 페이지 성격

- **국내 3개 권역 vs 해외 3개 권역 비교 리포트**: 제주도, 부산, 강원, 일본, 베트남, 괌을 같은 기준으로 비교한다.
- **핵심 차별점**: 총액만 비교하지 않고 교통, 숙박, 식비, 액티비티, 보험/통신/환전 같은 숨은 비용을 분해한다.
- **핵심 메시지**: 해외여행이 항상 싸다는 뜻이 아니라, 제주·부산 같은 인기 국내 여행지는 성수기 숙박과 교통이 붙으면 일본·베트남 단기여행과 체감 비용 격차가 줄어든다.
- **독자 행동**: 비용표를 본 뒤 해외여행 총비용 계산기, 항공권 최저가 시기 계산기, 여행 경비 분담 계산기로 이동한다.

### 1-3. 권장 파일 구조

```txt
src/
  data/
    domesticVsOverseasTravelCost2026.ts
  pages/
    reports/
      domestic-vs-overseas-travel-cost-2026.astro

public/
  scripts/
    domestic-vs-overseas-travel-cost-2026.js
  og/
    reports/
      domestic-vs-overseas-travel-cost-2026.png

src/styles/scss/pages/
  _domestic-vs-overseas-travel-cost-2026.scss
```

### 1-4. 전제

- 실시간 항공권, 숙박, 환율 API는 사용하지 않는다.
- 모든 금액은 `2026년 4월 기준 추정 범위값`으로 표시한다.
- 단일 확정값처럼 보이는 표현은 피하고 `약`, `범위`, `추정`, `시나리오` 라벨을 함께 사용한다.
- 쇼핑비는 비교 왜곡을 줄이기 위해 기본 총액에서 제외한다.
- 해외여행은 여행자보험, eSIM/로밍, 환전/카드 수수료를 별도 비용으로 보여준다.
- 국내여행은 렌터카, 주차, 유류비, 현지 이동비를 따로 드러낸다.

---

## 2. 현재 프로젝트 구조 적용

### 2-1. `/reports/` 공통 구조

1. `BaseLayout`
2. `CalculatorHero`
3. `InfoNotice`
4. 조사 기준 요약 카드
5. 핵심 KPI 카드
6. 비교 표/차트/카드
7. 인터랙션 영역
8. 관련 계산기 CTA
9. `SeoContent` + FAQ

### 2-2. 재사용할 구현 패턴

- `overseas-travel-cost-compare-2026`
  - 리포트형 IA, 범위값 테이블, 여행 스타일 비교 카드
  - `script[type="application/json"]`로 데이터 전달
- `korea-flight-price-comparison-2026`
  - 항공권/총비용 구분 설명, 추정값 안내 방식
- `salary-asset-2016-vs-2026`
  - 비교 리포트의 KPI 카드와 요약 보드 패턴

---

## 3. 구현 범위

### 3-1. MVP 포함

- 국내 3개 권역: 제주도, 부산, 강원
- 해외 3개 권역: 일본, 베트남, 괌
- 2박 3일, 성인 2인 기준 총비용 비교
- 비용 항목 7종:
  - 교통/항공
  - 숙박
  - 식비/카페
  - 현지 이동
  - 액티비티
  - 보험/통신/환전
  - 기타 숨은 비용
- 총비용 범위표
- 비용 최소화 순위와 만족도 대비 가성비 순위
- 시즌별 가격 변동 표
- 추천 유형별 여행지 카드
- 절약 팁 5개 이상
- FAQ 6개 이상
- 관련 계산기 CTA 3개 이상

### 3-2. MVP 제외

- 실시간 항공권/숙박 검색
- 사용자 직접 입력형 계산기
- 여행지별 상세 하위 페이지 자동 생성
- 제휴 링크 실연동
- 환율 슬라이더
- 지도 기반 비교
- 가족 구성원 수에 따른 비용 자동 확장

---

## 4. 페이지 목적

- 사용자가 국내여행과 해외여행을 같은 기간, 같은 인원, 같은 항목 기준으로 비교하게 한다.
- “국내여행이 더 비싸다”는 단정 대신 비용이 비슷해지는 조건을 보여준다.
- 제주도, 일본, 베트남처럼 검색량이 큰 후보지를 직접 비교해 SEO 진입 페이지로 쓴다.
- 리포트에서 끝나지 않고 여행 예산 계산기와 항공권 타이밍 계산기로 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 여행지 선택 전 비교 사용자

- `국내여행 해외여행 비용 비교`, `제주도 일본 여행 비용`으로 유입
- 총비용 범위표에서 6개 후보지를 먼저 훑는다
- 자신의 예산대에 맞는 추천 유형 카드를 확인한다
- 해외여행 총비용 계산기로 이동한다

### 5-2. 제주도 비용에 부담을 느낀 사용자

- 제주도 숙박, 렌터카, 식비가 예상보다 높아 대안을 찾는다
- 제주와 일본/베트남의 2박 3일 범위를 비교한다
- 성수기에는 비용 차이가 줄어드는 이유를 확인한다
- 항공권 최저가 시기 계산기로 이동한다

### 5-3. 커플/가족 여행 예산 사용자

- 커플, 아이 동반, 부모님 동반 유형별 추천을 본다
- 이동 피로, 숙소 컨디션, 액티비티 성격까지 고려한다
- 여행 경비 분담 또는 총비용 계산기로 이동한다

---

## 6. 데이터 설계

### 6-1. TypeScript 타입

```ts
export type TravelDestinationType = "domestic" | "overseas";

export type CostRange = {
  min: number;
  max: number;
  note?: string;
};

export type TravelCostCategory =
  | "transport"
  | "lodging"
  | "food"
  | "localMove"
  | "activity"
  | "insuranceAndComms"
  | "hidden";

export type TravelDestinationCost = {
  id: string;
  name: string;
  type: TravelDestinationType;
  regionLabel: string;
  summary: string;
  recommendedFor: string[];
  caution: string;
  costs: Record<TravelCostCategory, CostRange>;
  total: CostRange;
  valueScore: number;
  costRank: number;
  satisfactionRank: number;
  keyVariables: string[];
};

export type SeasonCostInsight = {
  season: string;
  domestic: string;
  overseas: string;
  strategy: string;
};

export type TravelRecommendation = {
  id: string;
  title: string;
  budgetLabel: string;
  destinations: string[];
  reason: string;
};
```

### 6-2. 데이터 파일 export

```ts
export const reportMeta = {
  slug: "domestic-vs-overseas-travel-cost-2026",
  title: "2026 국내 여행 vs 해외 여행 실비용 비교",
  description:
    "제주도, 부산, 강원과 일본, 베트남, 괌의 2박 3일 2인 기준 여행 총비용을 교통·숙박·식비·액티비티까지 비교합니다.",
  baseLabel: "2026년 4월 기준, 성인 2인 2박 3일 추정 범위",
};

export const destinations: TravelDestinationCost[] = [];
export const seasonInsights: SeasonCostInsight[] = [];
export const recommendations: TravelRecommendation[] = [];
export const savingTips: string[] = [];
export const faqItems: { q: string; a: string }[] = [];
export const relatedLinks: { label: string; href: string; description: string }[] = [];
```

### 6-3. 금액 산출 규칙

- `total.min`은 각 비용 항목의 보수적 하단 합계로 계산한다.
- `total.max`는 성수기와 고비용 선택지를 반영한 상단 합계로 계산한다.
- 표에는 `60만~140만원`처럼 읽기 쉬운 한국어 금액을 사용한다.
- 차트와 JS 계산에는 원 단위 number를 사용한다.
- 해외 비용은 원화 환산 기준이며, 환율 변동 가능성을 안내한다.

---

## 7. 섹션 구조

### 7-1. 전체 IA

1. Hero
2. 기준 안내 `InfoNotice`
3. 핵심 결론 KPI
4. 6개 여행지 총비용 비교
5. 비용 항목별 분해
6. 국내여행이 비싸게 느껴지는 이유
7. 비용 최소화 순위
8. 만족도 대비 가성비 순위
9. 시즌별 가격 변동
10. 추천 유형별 여행지
11. 절약 팁
12. 관련 계산기 CTA
13. FAQ / SEO 본문

### 7-2. 모바일 우선 순서

Hero → 기준 안내 → 핵심 결론 → 총비용 비교 → 여행지 카드 → 비용 분해 → 순위 → 추천 유형 → 절약 팁 → CTA → FAQ

---

## 8. Astro 마크업 설계

### 8-1. 페이지 frontmatter

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  reportMeta,
  destinations,
  seasonInsights,
  recommendations,
  savingTips,
  faqItems,
  relatedLinks,
} from "../../data/domesticVsOverseasTravelCost2026";
import { withBase } from "../../utils/base";

const chartData = JSON.stringify({ destinations, seasonInsights });
---
```

### 8-2. Hero

- eyebrow: `여행비 비교 리포트`
- title: `국내여행과 해외여행, 어디가 진짜 더 저렴할까요?`
- description: `제주도·부산·강원과 일본·베트남·괌의 2박 3일 2인 기준 실비용을 교통, 숙박, 식비, 액티비티까지 같은 기준으로 비교합니다.`
- badges: `["국내 vs 해외", "2박 3일", "2인 기준", "추정"]`

### 8-3. 기준 안내

`InfoNotice`에는 다음 문구를 포함한다.

- 실시간 항공권/숙박 조회가 아니다.
- 2026년 4월 기준 공개 자료와 시장 범위를 바탕으로 한 추정 비교다.
- 쇼핑비는 제외했다.
- 성수기, 환율, 숙소 등급, 렌터카 여부에 따라 실제 비용은 달라진다.

### 8-4. 핵심 결론 KPI

카드 4개:

| 카드 | 내용 |
| --- | --- |
| 최저 총액 후보 | 강원, 자차 이용 시 낮은 비용 |
| 해외 가성비 후보 | 베트남, 체류비 강점 |
| 체감 역전 후보 | 제주도, 성수기 렌터카·숙박 변수 |
| 고비용 휴양 후보 | 괌, 리조트·외식비 변수 |

### 8-5. 총비용 비교 표

컬럼:

- 순위
- 여행지
- 구분
- 2박 3일 2인 예상 총비용
- 가성비 판단
- 핵심 변수

모바일에서는 카드형으로 전환한다. 표를 유지할 경우 `overflow-x: auto`를 적용한다.

### 8-6. 비용 항목별 분해

탭 또는 segmented control:

- 전체
- 국내
- 해외

각 여행지 카드에는 다음 값을 표시한다.

- 교통/항공
- 숙박
- 식비
- 액티비티
- 숨은 비용
- 핵심 주의점

### 8-7. 체감 비용 분석

국내여행이 비싸게 느껴지는 이유를 6개 카드로 표시한다.

- 비용이 계속 쪼개져 결제됨
- “국내인데 이 가격?”이라는 기대치
- 주말·연휴 숙박비 상승
- 제주·강원의 렌터카/현지 이동비
- 일본·베트남 특가와 직접 비교됨
- 해외는 경험 가치가 더 크게 인식됨

### 8-8. 순위 섹션

두 개의 순위를 나란히 보여준다.

- 비용 최소화 기준
- 만족도 대비 가성비 기준

모바일에서는 두 섹션을 세로로 쌓는다.

### 8-9. 시즌별 가격 변동

기획서의 월별 흐름을 표로 구현한다.

컬럼:

- 시즌
- 국내여행 흐름
- 해외여행 흐름
- 추천 전략

### 8-10. 추천 유형별 카드

카드 5개:

- 비용 최소형
- 가성비 해외형
- 커플 여행형
- 아이 동반 가족형
- 부모님 동반형

각 카드에는 예산, 추천지, 이유를 포함한다.

### 8-11. CTA

상단 CTA:

- 문구: `내 여행 조건으로 총비용을 다시 계산해보세요.`
- 링크: `/tools/overseas-travel-cost/`

중간 CTA:

- 문구: `친구·커플·가족 여행이라면 정산까지 같이 확인하세요.`
- 링크: `/tools/travel-expense-split/`
- 해당 페이지가 아직 없으면 CTA는 노출하지 않거나 비활성 링크를 쓰지 않는다.

하단 CTA:

- 문구: `항공권은 예매 시점에 따라 총액이 크게 달라집니다.`
- 링크: `/tools/flight-cheapest-timing-calculator/`

---

## 9. JavaScript 설계

### 9-1. 파일

`public/scripts/domestic-vs-overseas-travel-cost-2026.js`

### 9-2. 역할

- 총비용 비교 차트 렌더링
- 국내/해외/전체 필터 전환
- 비용 항목 breakdown 카드 갱신
- URL 파라미터 유지

### 9-3. DOM id

```txt
dvotc-data
dvotc-filter-all
dvotc-filter-domestic
dvotc-filter-overseas
dvotc-summary-grid
dvotc-cost-chart
dvotc-breakdown-grid
dvotc-rank-cost
dvotc-rank-value
```

### 9-4. URL 파라미터

```txt
/reports/domestic-vs-overseas-travel-cost-2026/?view=all
/reports/domestic-vs-overseas-travel-cost-2026/?view=domestic
/reports/domestic-vs-overseas-travel-cost-2026/?view=overseas
```

허용값:

- `all`
- `domestic`
- `overseas`

허용값 외 파라미터는 `all`로 되돌린다.

### 9-5. 차트

- Chart.js가 이미 프로젝트에서 사용 가능하면 막대 차트를 사용한다.
- x축: 여행지
- y축: 예상 총비용 중앙값
- 보조 데이터: 최소~최대 범위
- Chart.js 로드 실패 시 표와 카드만으로도 정보가 전달되도록 한다.

---

## 10. SCSS 설계

### 10-1. 파일

`src/styles/scss/pages/_domestic-vs-overseas-travel-cost-2026.scss`

### 10-2. prefix

모든 클래스는 `dvotc-` prefix를 사용한다.

예:

```scss
.dvotc-page {}
.dvotc-kpi-grid {}
.dvotc-cost-table {}
.dvotc-destination-card {}
.dvotc-filter-row {}
.dvotc-cta-band {}
```

### 10-3. 레이아웃 기준

- 최대 본문 폭: `1120px`
- 카드 radius: `8px` 이하
- 표는 모바일에서 가로 스크롤 또는 카드 전환
- 카드 안 heading은 hero급 크기를 쓰지 않는다
- 색상은 기존 token을 우선 사용한다

### 10-4. 모바일 처리

- `640px` 이하:
  - KPI 카드 1열
  - 비교 표는 카드형 요약 우선
  - CTA 버튼은 full width
- `820px` 이하:
  - 비용 분해 카드는 2열 이하
  - 순위 섹션은 세로 스택

---

## 11. SEO 설계

### 11-1. title

`2026 국내 여행 vs 해외 여행 실비용 비교 | 제주도·일본·베트남 2박3일 경비`

### 11-2. description

`제주도, 부산, 강원과 일본, 베트남, 괌의 2박 3일 2인 기준 여행비를 교통·숙박·식비·액티비티까지 비교합니다. 국내여행과 해외여행 중 어디가 더 유리한지 비용 구조로 확인하세요.`

### 11-3. H2 후보

- `국내여행과 해외여행 2박 3일 총비용 비교`
- `제주도 여행이 비싸게 느껴지는 이유`
- `일본·베트남·괌 단기여행은 어떤 비용이 변수일까`
- `비용 최소화 기준 추천 여행지`
- `만족도 대비 가성비 기준 추천 여행지`
- `시즌별 국내·해외 여행비 변동`

### 11-4. FAQ

최소 6개:

1. 국내여행이 해외여행보다 정말 더 비싼가요?
2. 제주도와 일본 중 어디가 더 저렴한가요?
3. 베트남 여행은 왜 가성비가 좋다고 하나요?
4. 괌은 가성비 여행지인가요?
5. 2박 3일 기준으로 해외여행은 너무 짧지 않나요?
6. 국내 vs 해외 여행을 고를 때 가장 중요한 기준은 무엇인가요?

---

## 12. 등록 체크리스트

### 12-1. 리포트 등록

- [ ] `src/data/reports.ts`에 slug 등록
- [ ] `src/pages/reports/index.astro` 관련 리포트 목록 노출 확인
- [ ] `public/sitemap.xml`에 `/reports/domestic-vs-overseas-travel-cost-2026/` 추가
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/domestic-vs-overseas-travel-cost-2026';` 추가
- [ ] OG 이미지 생성 또는 기본 fallback 확인

### 12-2. 연결 링크

- [ ] `/tools/overseas-travel-cost/`
- [ ] `/tools/flight-cheapest-timing-calculator/`
- [ ] `/reports/overseas-travel-cost-compare-2026/`
- [ ] `/reports/korea-flight-price-comparison-2026/`는 실제 구현 여부 확인 후 연결
- [ ] `/tools/travel-expense-split/`는 실제 구현 여부 확인 후 연결

---

## 13. QA 체크리스트

- [ ] 모든 비용 범위에 `추정` 또는 `참고` 맥락이 붙어 있는가
- [ ] 국내여행이 무조건 더 비싸다는 단정 표현이 없는가
- [ ] 해외여행이 무조건 더 싸다는 단정 표현이 없는가
- [ ] 쇼핑비 제외 기준이 명확한가
- [ ] 2박 3일, 성인 2인, 서울/수도권 출발 기준이 반복 노출되는가
- [ ] 모바일 320px에서 표/카드가 넘치지 않는가
- [ ] 차트가 없어도 표만으로 핵심 정보가 전달되는가
- [ ] CTA 링크가 실제 존재하는 페이지만 가리키는가
- [ ] `npm run build`가 통과하는가

---

## 14. 구현 순서

1. `src/data/domesticVsOverseasTravelCost2026.ts` 작성
2. `src/pages/reports/domestic-vs-overseas-travel-cost-2026.astro` 작성
3. `src/styles/scss/pages/_domestic-vs-overseas-travel-cost-2026.scss` 작성
4. `src/styles/app.scss` import 추가
5. `public/scripts/domestic-vs-overseas-travel-cost-2026.js` 작성
6. `src/data/reports.ts` 등록
7. `public/sitemap.xml` 등록
8. `npm run build`

---

## 15. 최종 구현 방향

이 리포트는 여행 카테고리의 허브 콘텐츠로 설계한다. 핵심은 “국내가 비싸다” 또는 “해외가 싸다”라는 결론이 아니라, 같은 2박 3일 2인 여행이라도 비용이 붙는 방식이 다르다는 점을 보여주는 것이다.

제주도는 렌터카·숙박·식비가, 일본은 항공권·환율·도시 숙박이, 베트남은 항공권과 체류비 분산이, 괌은 리조트·외식·액티비티가 핵심 변수다. 각 변수의 차이를 표와 카드로 분해하면 검색 유입 사용자도 빠르게 결론을 얻고, 계산기 페이지로 자연스럽게 이동할 수 있다.
