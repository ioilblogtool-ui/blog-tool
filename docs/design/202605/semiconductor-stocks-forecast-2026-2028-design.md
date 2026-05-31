# 삼성전자·SK하이닉스·마이크론·TSMC 2026~2028 실적 전망 비교 — 설계 문서

> 기획 원문: `docs/plan/202605/semiconductor-stocks-forecast-2026-2028.md`  
> 작성일: 2026-05-31  
> 구현 대상: `/reports/semiconductor-stocks-forecast-2026-2028/`  
> 구현 기준: 삼성전자·SK하이닉스·마이크론·TSMC의 2026~2028년 매출·영업이익·밸류에이션 시나리오를 비교하는 데이터형 리포트

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: 반도체 4대장 2026~2028 실적 전망 비교
- 슬러그: `semiconductor-stocks-forecast-2026-2028`
- URL: `/reports/semiconductor-stocks-forecast-2026-2028/`
- 콘텐츠 유형: 데이터형 리포트
- 카테고리: 자산·투자·반도체
- 핵심 CTA: `/reports/semiconductor-etf-2026/`, `/reports/semiconductor-value-chain/`, 향후 `/tools/semiconductor-stock-valuation-calculator/`

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 데이터 파일, Astro 페이지, 클라이언트 스크립트, SCSS, 등록 파일을 추가한다.

핵심 구현 목표:

- 삼성전자, SK하이닉스, 마이크론, TSMC를 같은 화면에서 비교한다.
- 2026~2028년 매출, 영업이익, 영업이익률, CAGR, 밸류에이션 시나리오를 제공한다.
- 모든 전망값에 `추정`, `컨센서스`, `시나리오`, `환산` 맥락을 명확히 표시한다.
- “매수·매도 추천”처럼 보이지 않도록 투자 고지를 반복 노출한다.
- 모바일에서는 복잡한 재무 표를 회사별 카드와 연도 탭으로 읽을 수 있게 한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    semiconductorStocksForecast2026_2028.ts
  pages/
    reports/
      semiconductor-stocks-forecast-2026-2028.astro

public/
  scripts/
    semiconductor-stocks-forecast-2026-2028.js

src/styles/scss/pages/
  _semiconductor-stocks-forecast-2026-2028.scss
```

필수 등록:

- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/pages/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

선택 등록:

- `/reports/semiconductor-etf-2026/` 하단 내부 링크
- `/reports/semiconductor-value-chain/` 하단 내부 링크
- 향후 OG 이미지: `public/og/reports/semiconductor-stocks-forecast-2026-2028.png`

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "삼성전자·SK하이닉스·마이크론·TSMC 2026~2028 실적 전망 비교"
description: "삼성전자, SK하이닉스, 마이크론, TSMC의 2026~2028년 매출·영업이익·영업이익률 전망을 비교합니다. HBM, DRAM, 파운드리, AI 서버 수요를 기준으로 보수·기준·낙관 시나리오별 밸류에이션을 정리했습니다."
canonical: "/reports/semiconductor-stocks-forecast-2026-2028/"
ogImage: "/og/reports/semiconductor-stocks-forecast-2026-2028.png"
```

### 3-2. 페이지 텍스트

H1:

```text
반도체 4대장 2026~2028 실적 전망 비교
```

Hero sub:

```text
AI 서버 투자와 HBM 수요가 만든 반도체 슈퍼사이클에서 삼성전자, SK하이닉스, 마이크론, TSMC의 매출·영업이익·밸류에이션을 같은 기준으로 비교합니다.
```

주요 배지:

- `추정`
- `컨센서스`
- `시나리오`
- `환산`
- `공식`
- `업데이트필요`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 삼성전자 주가 전망 | title, hero, 삼성전자 상세 섹션, FAQ |
| SK하이닉스 주가 전망 | title, SK하이닉스 상세 섹션, HBM 민감도 |
| 마이크론 주가 전망 | title, Micron 상세 섹션, FY 기준 안내 |
| TSMC 주가 전망 | title, TSMC 상세 섹션, 파운드리 비교 |
| 반도체 주식 전망 2026 | title, SEO 본문, 관련 리포트 |
| HBM 수혜주 | HBM 민감도 카드, 메모리 3사 비교 |
| AI 반도체 주식 | 비즈니스 모델 비교, TSMC·HBM 섹션 |

---

## 4. 레이아웃 방향

- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent` 조합으로 구현한다.
- SCSS prefix: `ssf-`
- pageClass: `ssf-page`
- 표는 데스크톱에서 가로 비교, 모바일에서 회사별 카드로 전환한다.
- 차트는 순수 DOM/CSS 기반 막대·라인형 블록으로 구현한다. 별도 차트 라이브러리는 1차 구현에서 사용하지 않는다.
- 주가 섹션은 단일 목표주가가 아니라 밸류에이션 배수별 범위를 보여준다.

권장 IA:

1. Hero
2. 투자 고지 및 데이터 기준 안내
3. 핵심 KPI 카드
4. 4사 비즈니스 모델 비교
5. 2026~2028 실적 전망 테이블
6. 통화 환산 기준 안내
7. 매출·영업이익 성장 차트
8. 영업이익률 비교
9. 밸류에이션 시나리오
10. 회사별 상세 카드
11. 메모리 vs 파운드리 비교
12. 리스크 체크리스트
13. 데이터 출처
14. 관련 리포트
15. SEO 본문
16. FAQ

---

## 5. 데이터 모델

파일: `src/data/semiconductorStocksForecast2026_2028.ts`

### 5-1. 기본 타입

```ts
export type SemiconductorCompanySlug =
  | "samsung-electronics"
  | "sk-hynix"
  | "micron"
  | "tsmc";

export type SemiconductorBusinessType = "integrated" | "memory" | "foundry";
export type ForecastCurrency = "KRW" | "USD" | "TWD";
export type ForecastYear = 2026 | 2027 | 2028;
export type ForecastBadge = "공식" | "컨센서스" | "시나리오" | "환산" | "추정" | "업데이트필요";
export type ScenarioKey = "bear" | "base" | "bull";
export type MetricKey =
  | "revenue"
  | "operatingProfit"
  | "operatingMargin"
  | "revenueCagr"
  | "opCagr"
  | "forwardPer"
  | "evEbitda";
```

### 5-2. 회사 데이터

```ts
export interface SemiconductorCompany {
  slug: SemiconductorCompanySlug;
  companyName: string;
  shortName: string;
  ticker: string;
  exchange: string;
  currency: ForecastCurrency;
  businessType: SemiconductorBusinessType;
  countryLabel: string;
  description: string;
  coreDrivers: string[];
  keyRisks: string[];
  investorQuestion: string;
}
```

필수 4개 기업:

```ts
export const semiconductorCompanies: SemiconductorCompany[] = [
  {
    slug: "samsung-electronics",
    companyName: "삼성전자",
    shortName: "삼성전자",
    ticker: "005930.KS",
    exchange: "KRX",
    currency: "KRW",
    businessType: "integrated",
    countryLabel: "한국",
    description: "메모리, 파운드리, 모바일, 가전을 함께 보유한 종합 반도체·전자 기업입니다.",
    coreDrivers: ["DS부문 회복", "HBM 경쟁력", "파운드리 적자 축소", "MX 수익성"],
    keyRisks: ["HBM 진입 지연", "파운드리 수익성", "전사 실적 혼합"],
    investorQuestion: "DS부문 회복이 전사 밸류에이션을 얼마나 다시 끌어올릴 수 있는가?",
  },
  // SK하이닉스, Micron, TSMC 동일 구조
];
```

### 5-3. 실적 전망 데이터

```ts
export interface SemiconductorForecast {
  companySlug: SemiconductorCompanySlug;
  year: ForecastYear;
  revenue: number;
  operatingProfit: number;
  operatingMargin: number;
  netIncome?: number;
  capex?: number;
  sourceType: "official" | "consensus" | "scenario";
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate: string;
  badge: ForecastBadge;
  note?: string;
}
```

단위 기준:

- 삼성전자, SK하이닉스: `억원` 또는 `조원` 중 하나로 통일. 구현 내부값은 `억원` 권장.
- Micron: `million USD` 또는 `billion USD` 중 하나로 통일. 구현 내부값은 `million USD` 권장.
- TSMC: `million TWD` 또는 `billion TWD` 중 하나로 통일. 구현 내부값은 `million TWD` 권장.
- 화면 표시에서는 `조원`, `억 달러`, `조 대만달러`로 변환한다.

### 5-4. 환율 데이터

```ts
export interface FxRateSet {
  asOf: string;
  usdKrw: number;
  twdKrw: number;
  twdUsd: number;
  sourceLabel: string;
  badge: ForecastBadge;
}
```

### 5-5. 시나리오 데이터

```ts
export interface SemiconductorScenario {
  companySlug: SemiconductorCompanySlug;
  scenario: ScenarioKey;
  label: string;
  year: 2028;
  operatingProfit: number;
  targetMultiple: number;
  impliedMarketCap: number;
  impliedUpside?: number;
  assumptions: string[];
  caution: string;
}
```

### 5-6. 출처 데이터

```ts
export interface SemiconductorSource {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: ForecastBadge;
  note: string;
}
```

---

## 6. 필수 데이터 세트

### 6-1. KPI 카드 데이터

```ts
export interface ForecastKpiCard {
  label: string;
  value: string;
  description: string;
  badge: ForecastBadge;
  tone: "neutral" | "memory" | "foundry" | "caution" | "growth";
}
```

카드 예시:

- `2028E 영업이익률 1위`
- `2026~2028 영업이익 CAGR 1위`
- `HBM 민감도 높은 기업`
- `파운드리 프리미엄 기업`

### 6-2. 비교 매트릭스

```ts
export interface BusinessModelMatrixItem {
  companySlug: SemiconductorCompanySlug;
  revenueSource: string;
  aiBenefit: string;
  marginDriver: string;
  mainRisk: string;
}
```

### 6-3. FAQ

```ts
export interface ForecastFaq {
  q: string;
  a: string;
}
```

---

## 7. 페이지 구현 상세

### 7-1. Astro 페이지

파일: `src/pages/reports/semiconductor-stocks-forecast-2026-2028.astro`

필수 import:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  semiconductorStocksForecast2026_2028,
  formatForecastValue,
  formatMargin,
  convertToKrw,
} from "../../data/semiconductorStocksForecast2026_2028";
---
```

권장 최상위 클래스:

```astro
<main class="container page-shell report-page ssf-page">
```

### 7-2. JSON-LD

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: data.meta.title,
  description: data.meta.description,
  dateModified: data.meta.updatedAt,
  inLanguage: "ko-KR",
  mainEntityOfPage: "https://bigyocalc.com/reports/semiconductor-stocks-forecast-2026-2028/",
};
```

---

## 8. UI 섹션 설계

## ① Hero

구성:

- eyebrow: `투자 데이터 리포트`
- H1: `반도체 4대장 2026~2028 실적 전망 비교`
- description: AI 서버, HBM, 파운드리 수요를 기준으로 4사 실적을 비교한다는 설명
- 하단 칩:
  - `삼성전자`
  - `SK하이닉스`
  - `Micron`
  - `TSMC`
  - `2026~2028 추정`

## ② 투자 고지

`InfoNotice` 사용:

```ts
lines={[
  "이 페이지는 투자 권유가 아니라 공개자료와 컨센서스 기반 비교 리포트입니다.",
  "2026~2028년 수치는 확정 실적이 아닌 추정치이며 실적 발표와 환율에 따라 달라질 수 있습니다.",
  "밸류에이션 범위는 목표주가나 매수·매도 의견이 아닙니다.",
]}
```

## ③ 기준 메타 보드

클래스: `.ssf-basis-board`

표시 항목:

- 업데이트 기준일
- 환율 기준일
- 비교 기업 수
- 전망 기간
- 기본 통화

## ④ 핵심 KPI 카드

클래스: `.ssf-kpi-grid`, `.ssf-kpi-card`

카드 필드:

- label
- value
- description
- badge

모바일: 1열, 태블릿: 2열, 데스크톱: 4열.

## ⑤ 4사 비즈니스 모델 비교

클래스: `.ssf-model-grid`

회사별 카드:

- 회사명·티커
- 사업 유형 배지: `종합`, `메모리`, `파운드리`
- 핵심 수혜
- 핵심 리스크
- 투자자가 봐야 할 질문

## ⑥ 필터·토글 영역

클래스: `.ssf-control-panel`

필수 DOM id:

- `#ssf-data`
- `#ssf-currency-toggle`
- `#ssf-metric-select`
- `#ssf-scenario-tabs`
- `#ssf-company-filter`
- `#ssf-forecast-table-body`
- `#ssf-mobile-cards`
- `#ssf-scenario-board`

필터 항목:

| 컨트롤 | 타입 | 옵션 |
| --- | --- | --- |
| 기준 통화 | segmented button | 원통화, 원화 환산, 달러 환산 |
| 지표 | select | 매출, 영업이익, 영업이익률, CAGR |
| 시나리오 | segmented button | 보수, 기준, 낙관 |
| 기업 유형 | checkbox/chip | 전체, 메모리, 파운드리, 종합 |

## ⑦ 실적 전망 테이블

클래스: `.ssf-forecast-table`

컬럼:

| 컬럼 | 설명 |
| --- | --- |
| 기업 | 회사명·티커 |
| 유형 | 메모리/파운드리/종합 |
| 2026E 매출 | 추정값 |
| 2026E 영업이익 | 추정값 |
| 2027E 매출 | 추정값 |
| 2027E 영업이익 | 추정값 |
| 2028E 매출 | 추정값 |
| 2028E 영업이익 | 추정값 |
| 2028E 영업이익률 | 계산값 |
| 출처 | 컨센서스/시나리오 |

필수:

- `<caption>` 제공
- `추정` 배지 표시
- 통화 단위 표기
- 모바일에서는 `.ssf-mobile-cards`로 별도 렌더링

## ⑧ 성장 차트

라이브러리 없이 CSS 막대 차트 사용.

클래스:

- `.ssf-chart-grid`
- `.ssf-chart-card`
- `.ssf-bar-row`
- `.ssf-bar-track`

차트:

- 2026~2028 매출 성장
- 2026~2028 영업이익 성장
- 2028E 영업이익률 비교

## ⑨ 밸류에이션 시나리오

클래스: `.ssf-scenario-section`

구성:

- 보수·기준·낙관 탭
- 회사별 2028E 영업이익
- 적용 배수
- implied market cap
- 주요 가정
- 주의 문구

표현 원칙:

- “예상 주가” 단일값 금지
- “시나리오상 시가총액 범위”로 표현
- `목표주가 아님` 고지 표시

## ⑩ 회사별 상세 섹션

클래스: `.ssf-company-detail-grid`

회사별 카드 구성:

- 회사명
- 사업 구조 요약
- 2026~2028 핵심 관전 포인트
- 가장 민감한 변수
- 리스크
- 관련 내부 링크

상세 문구 포인트:

| 회사 | 강조 포인트 |
| --- | --- |
| 삼성전자 | DS부문과 전사 실적 구분, HBM 진입 속도, 파운드리 수익성 |
| SK하이닉스 | HBM 고마진, DRAM ASP, 고객 집중 리스크 |
| Micron | FY 기준, HBM 후발 램프업, 미국 메모리 대표주 프리미엄 |
| TSMC | HPC 매출 비중, 3nm·2nm, Capex와 지정학 리스크 |

## ⑪ 리스크 체크리스트

클래스: `.ssf-risk-grid`

리스크 항목:

- AI 서버 Capex 둔화
- HBM 공급 과잉
- 범용 DRAM/NAND 가격 하락
- 환율 변동
- TSMC 지정학 리스크
- 삼성전자 파운드리 수익성
- Micron 회계연도 비교 착시

## ⑫ 데이터 출처

클래스: `.ssf-source-grid`

출처 카드:

- 회사 IR
- 컨센서스/데이터벤더
- 신용평가/리서치 보조 출처
- 환율 기준 출처

각 출처는 다음 정보 포함:

- label
- organization
- asOf
- badge
- note
- 외부 링크

## ⑬ 관련 리포트

연결:

- `/reports/semiconductor-etf-2026/`
- `/reports/semiconductor-value-chain/`
- `/reports/etf-vs-direct-stock-10year-2026/`
- `/reports/stock-brokerage-fee-comparison-2026/`

## ⑭ SeoContent

`SeoContent` props:

```astro
<SeoContent
  introTitle="반도체 주식 전망을 실적 기준으로 읽는 방법"
  intro={data.seoIntro}
  inputPoints={data.seoInputPoints}
  criteria={data.seoCriteria}
  faq={faqItems}
  related={relatedLinks}
/>
```

---

## 9. 클라이언트 스크립트 설계

파일: `public/scripts/semiconductor-stocks-forecast-2026-2028.js`

### 9-1. 상태

```js
const state = {
  currency: "native", // native | krw | usd
  metric: "operatingProfit",
  scenario: "base",
  companyType: "all",
};
```

### 9-2. 기능

- JSON 데이터 파싱
- 통화 토글
- 지표 변경
- 기업 유형 필터
- 시나리오 탭 변경
- 테이블 재렌더링
- 모바일 카드 재렌더링
- 차트 막대 길이 재계산
- 시나리오 보드 재렌더링

### 9-3. 접근성

- 시나리오 탭은 `aria-pressed` 갱신
- 결과 변경 영역은 `aria-live="polite"`
- 테이블 caption 제공
- 버튼 텍스트는 아이콘 단독 사용 금지

---

## 10. SCSS 설계

파일: `src/styles/scss/pages/_semiconductor-stocks-forecast-2026-2028.scss`

### 10-1. 클래스 prefix

모든 전용 스타일은 `.ssf-page` 하위로 제한한다.

```scss
.ssf-page {
  --ssf-ink: #151d24;
  --ssf-muted: #65707c;
  --ssf-line: #dfe7ef;
  --ssf-soft: #f5f8fb;
  --ssf-memory: #0f8f7a;
  --ssf-foundry: #2f5ea8;
  --ssf-caution: #b76e00;
}
```

### 10-2. 주요 블록

- `.ssf-basis-board`
- `.ssf-kpi-grid`
- `.ssf-kpi-card`
- `.ssf-model-grid`
- `.ssf-model-card`
- `.ssf-control-panel`
- `.ssf-forecast-table-wrap`
- `.ssf-forecast-table`
- `.ssf-mobile-cards`
- `.ssf-chart-grid`
- `.ssf-chart-card`
- `.ssf-scenario-section`
- `.ssf-scenario-board`
- `.ssf-company-detail-grid`
- `.ssf-risk-grid`
- `.ssf-source-grid`
- `.ssf-related-grid`

### 10-3. 반응형

| 뷰포트 | 처리 |
| --- | --- |
| 1200px 이상 | KPI 4열, 회사 카드 4열, 표 전체 노출 |
| 980px 이하 | KPI 2열, 회사 카드 2열 |
| 680px 이하 | 모든 카드 1열, 표 숨김 또는 가로 스크롤 최소화, 모바일 카드 노출 |

### 10-4. 디자인 주의

- 투자 콘텐츠이므로 과도한 장식, 그라디언트, 마케팅형 히어로 금지
- 대시보드형 리포트처럼 조용하고 정보 밀도 있게 구성
- 카드 안 카드 금지
- 긴 회사명과 숫자가 모바일에서 넘치지 않도록 `minmax(0, 1fr)`, `overflow-wrap` 적용
- 색상은 메모리/파운드리/주의 톤 정도로만 구분

---

## 11. 데이터 표시 함수

데이터 파일에서 export 권장:

```ts
export function formatNativeCurrency(value: number, currency: ForecastCurrency): string;
export function formatKrwFromNative(value: number, currency: ForecastCurrency, fx: FxRateSet): string;
export function formatUsdFromNative(value: number, currency: ForecastCurrency, fx: FxRateSet): string;
export function formatMargin(value: number): string;
export function formatMultiple(value: number): string;
export function getCompanyForecasts(slug: SemiconductorCompanySlug): SemiconductorForecast[];
export function calcCagr(start: number, end: number, years: number): number;
```

표시 예시:

| 통화 | 표시 |
| --- | --- |
| KRW | `123.4조원` |
| USD | `$123.4B` 또는 `1,234억 달러` |
| TWD | `NT$5.2조` |
| KRW 환산 | `약 123.4조원` |

---

## 12. 등록 파일 설계

### 12-1. `src/data/reports.ts`

추가 위치: 반도체 ETF, 반도체 밸류체인 근처 또는 자산·투자 시리즈 상단.

```ts
{
  slug: "semiconductor-stocks-forecast-2026-2028",
  title: "삼성전자·SK하이닉스·마이크론·TSMC 2026~2028 실적 전망 비교",
  description: "삼성전자, SK하이닉스, 마이크론, TSMC의 2026~2028년 매출·영업이익·밸류에이션 시나리오를 비교하는 반도체 주식 리포트입니다.",
  order: 28.5,
  badges: ["반도체", "주식", "AI", "2026~2028"],
}
```

### 12-2. `src/pages/reports/index.astro`

```ts
"semiconductor-stocks-forecast-2026-2028": {
  eyebrow: "반도체 주식",
  tags: [
    { label: "삼성전자", mod: "asset" },
    { label: "하이닉스", mod: "asset" },
    { label: "TSMC", mod: "asset" },
  ],
  category: "asset",
  isNew: true,
}
```

### 12-3. `src/pages/index.astro`

```ts
"semiconductor-stocks-forecast-2026-2028": { category: "asset", isNew: true },
```

### 12-4. `src/styles/app.scss`

```scss
@use 'scss/pages/semiconductor-stocks-forecast-2026-2028';
```

### 12-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/semiconductor-stocks-forecast-2026-2028/</loc>
  <lastmod>2026-05-31</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.85</priority>
</url>
```

---

## 13. 품질·안전 기준

### 13-1. 투자 콘텐츠 금지 표현

금지:

- “매수 추천”
- “무조건 오른다”
- “목표주가 확정”
- “지금 사야 한다”
- “가장 좋은 종목”

권장:

- “시나리오상”
- “컨센서스 기준”
- “추정”
- “가정에 따라”
- “밸류에이션 범위”
- “투자 판단 전 공식자료 확인 필요”

### 13-2. 필수 고지

상단:

```text
이 페이지는 투자 권유가 아니라 공개자료와 컨센서스 기반 비교 리포트입니다.
```

표 하단:

```text
2026~2028년 수치는 확정 실적이 아니며 실적 발표, 환율, 메모리 가격, AI 서버 투자, Capex 계획에 따라 바뀔 수 있습니다.
```

밸류에이션 섹션:

```text
밸류에이션 범위는 목표주가나 매수·매도 의견이 아닙니다.
```

### 13-3. 데이터 주의

- 삼성전자는 전사 실적과 DS부문 해석을 분리한다.
- SK하이닉스는 HBM 수혜와 고객 집중 리스크를 함께 표기한다.
- Micron은 FY 기준과 calendar year 기준을 혼동하지 않는다.
- TSMC는 TWD 실적과 ADR 주가를 혼동하지 않는다.
- 환율 기준일을 반드시 표기한다.

---

## 14. QA 체크리스트

- [ ] `/reports/semiconductor-stocks-forecast-2026-2028/` 페이지 생성
- [ ] `src/data/semiconductorStocksForecast2026_2028.ts` 생성
- [ ] 모든 2026~2028 수치에 `추정` 또는 `컨센서스` 표시
- [ ] 환율 기준일 표시
- [ ] Micron FY 기준 표시
- [ ] TSMC TWD/ADR 구분 표시
- [ ] 투자 권유 문장 없음
- [ ] 모바일에서 표 대신 카드가 읽힘
- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/reports/index.astro` 등록
- [ ] `src/pages/index.astro` 등록
- [ ] `src/styles/app.scss` 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공

---

## 15. 구현 순서

1. 데이터 파일 작성
2. Astro 페이지 골격 작성
3. Hero, InfoNotice, KPI, 비즈니스 모델 카드 구현
4. 전망 테이블과 모바일 카드 구현
5. 시나리오 섹션 구현
6. 회사별 상세 카드 구현
7. 리스크·출처·관련 리포트·SEO 본문 구현
8. 클라이언트 스크립트 추가
9. SCSS 추가
10. 리포트 목록·홈·사이트맵 등록
11. `npm run build`
12. 생성 HTML 핵심 문구 확인

---

## 16. 구현 완료 기준

다음 조건을 만족하면 1차 구현 완료로 본다.

- 사용자가 4개 기업의 2026~2028 매출·영업이익·영업이익률을 한 화면에서 비교할 수 있다.
- 메모리 기업과 파운드리 기업의 수혜 구조 차이가 명확히 보인다.
- 보수·기준·낙관 시나리오가 별도 카드로 제공된다.
- 모든 전망값이 확정값처럼 보이지 않는다.
- 홈과 리포트 목록에서 `자산` 카테고리로 분류된다.
- 빌드가 성공한다.
