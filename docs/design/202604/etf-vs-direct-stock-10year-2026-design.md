# ETF vs 직접투자 10년 수익률 완전 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/etf-vs-direct-stock-10year-2026.md`
> 작성일: 2026-04-18
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 `/reports/` 페이지 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `bitcoin-gold-sp500-10year-comparison-2026`, `semiconductor-etf-2026`, `salary-asset-2016-vs-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/etf-vs-direct-stock-10year-2026.md`
- 구현 대상: `ETF vs 직접투자 10년 수익률 완전 비교 분석 (2016~2026)`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/`)
- 카테고리: 투자·재테크

### 1-2. 페이지 성격

- `10년 장기투자 비교 리포트`
- 핵심 비교축:
  - `수익률`
  - `변동성 / MDD`
  - `세금 / 보수 / 거래비용`
  - `재현 가능성 / 유지 가능성`
- 핵심 메시지:
  - `수익률 1등은 개별주일 수 있지만, 재현 가능성과 유지 가능성은 ETF가 더 높을 수 있다.`

### 1-3. 권장 slug

- `etf-vs-direct-stock-10year-2026`
- URL: `/reports/etf-vs-direct-stock-10year-2026/`

### 1-4. 전제

- 실시간 시세 API는 붙이지 않는다.
- 핵심 데이터는 `기준일 고정 스냅샷`으로 제공한다.
- 국내 상장 미국 ETF는 상장 시점이 늦기 때문에 `10년 전체 비교군`과 분리한다.
- 세금은 `일반 투자자 기준 단순화 설명`으로 제공하며, 세무 자문처럼 보이지 않게 쓴다.

---

## 2. 권장 파일 구조

```text
src/
  data/
    etfVsDirectStock10Year2026.ts
  pages/
    reports/
      etf-vs-direct-stock-10year-2026.astro

public/
  scripts/
    etf-vs-direct-stock-10year-2026.js
  og/
    reports/
      etf-vs-direct-stock-10year-2026.png

src/styles/scss/pages/
  _etf-vs-direct-stock-10year-2026.scss
```

### 2-1. 추가 반영 파일

- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/pages/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 현재 프로젝트 기준 정리

### 3-1. 리포트 공통 구조

현재 `/reports/` 페이지는 아래 흐름을 따른다.

1. `BaseLayout`
2. `SiteHeader`
3. `CalculatorHero`
4. `InfoNotice`
5. 상단 브리프 보드 / KPI 카드
6. 비교 표 / 차트 / 탐색 보드
7. 해설 카드 / 시뮬레이션
8. FAQ
9. 관련 계산기 / 관련 리포트 CTA
10. `SeoContent`

### 3-2. 이번 리포트 구현 방향

- `bitcoin-gold-sp500-10year-comparison-2026`에서 가져올 것
  - 10년 비교형 KPI 보드
  - MDD / 회복기간 / 체감 비교 카드
  - 투자금 시뮬레이션 영역
- `semiconductor-etf-2026`에서 가져올 것
  - 표 + 카드 + 탭형 탐색 구조
  - ETF 성격 차이를 카드형으로 정리하는 방식
- 이번 페이지에서 새롭게 강조할 것
  - `국내 ETF 10년 비교군`과 `국내 상장 미국 ETF 상장 이후 비교군`을 명확히 분리
  - `세후 순수익`과 `유지 가능성`을 별도 축으로 설명
  - `ETF 코어 + 직접투자 위성` 혼합 전략 카드 제공

---

## 4. 구현 범위

### 4-1. MVP 포함

- 파트 A: 2016~2026 10년 비교 가능한 국내 ETF vs 국내 개별주 비교
- 파트 B: 국내 상장 미국 ETF의 상장 이후 성과 비교
- 파트 C: 세금·보수·거래비용·분산효과 종합 비교
- 자산군별 핵심 지표
  - 누적수익률
  - CAGR
  - MDD
  - 연환산 변동성
  - 배당 재투자 반영 수익률
  - 세후 단순 추정 수익률
- 차트/보드
  - 2016=100 성장 곡선
  - 수익률 비교 표
  - MDD 비교 보드
  - 세후 순수익 비교표
  - 포트폴리오 혼합 전략 카드
- FAQ
- 관련 계산기 / 리포트 CTA

### 4-2. MVP 제외

- 실시간 API
- 사용자 임의 종목 검색
- 정교한 세금 엔진
- 로그인 / 저장
- 백테스트 엔진 수준의 리밸런싱 시뮬레이션

---

## 5. 페이지 목적

- 사용자가 `ETF가 편하긴 한데 직접투자보다 결국 손해인가?`라는 질문에 대해 숫자로 답을 얻도록 한다.
- `개별주 1등 사례`와 `평균적 유지 가능성`은 다를 수 있다는 점을 보여준다.
- 세후 순수익, 변동성, 분산효과를 함께 보여줘서 단순 수익률 경쟁으로 흐르지 않게 한다.
- 하단에서 `적립식 투자 계산기`, `양도세 계산기`, `ETF 리포트`로 자연스럽게 이어지게 한다.

---

## 6. 핵심 사용자 시나리오

### 6-1. ETF 초보 투자자

- `ETF vs 개별주`, `ETF 직접투자 수익 비교` 검색으로 유입
- 먼저 상단 결론 카드와 비교 표를 본다
- MDD와 세후 순수익을 보고 ETF의 현실적 장점을 이해한다

### 6-2. 삼성전자·SK하이닉스 개별주 투자자

- `삼성전자 vs KODEX200`, `개별주 장기투자 ETF 비교` 검색으로 유입
- 개별주가 더 높았던 시기와 더 위험했던 시기를 같이 본다
- 포트폴리오 혼합 전략 카드에서 현실적인 대안을 찾는다

### 6-3. 미국 ETF 관심층

- `TIGER S&P500 10년 수익률`, `국내상장 미국ETF 수익 비교` 검색으로 유입
- 10년 전체 비교가 아니라 `상장 이후 비교`라는 점을 이해해야 한다

### 6-4. 체류시간이 짧은 검색 유입

- Hero, 브리프 보드, 비교표, FAQ만 읽어도 핵심 결론을 얻어야 한다

---

## 7. 데이터 구조 (`src/data/etfVsDirectStock10Year2026.ts`)

### 7-1. 타입 정의

```ts
export type AssetBucket = "domestic-etf" | "domestic-stock" | "global-etf";
export type ComparisonMode = "gross" | "afterTax" | "dividend";
export type MixProfile = "etf-core" | "balanced" | "stock-heavy";

export interface AssetPerformanceRow {
  id: string;
  name: string;
  ticker: string;
  bucket: AssetBucket;
  startDate: string;
  endDate: string;
  listedAt?: string;
  feeNote?: string;
  taxNote?: string;
  cumulativeReturn: number;
  cagr: number;
  mdd: number;
  volatility: number;
  dividendAdjustedReturn?: number;
  afterTaxReturn?: number;
  summary: string;
  tags: string[];
}

export interface YearlyHeatmapRow {
  assetId: string;
  years: Record<number, number>;
}

export interface StrategyCard {
  id: MixProfile;
  title: string;
  fit: string;
  composition: string;
  summary: string;
  caution: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

### 7-2. 메타 구조

```ts
export const etfVsDirectStock10Year2026 = {
  meta: {
    slug: "etf-vs-direct-stock-10year-2026",
    title: "ETF vs 직접투자 10년 수익률 완전 비교 분석 (2016~2026)",
    subtitle:
      "KODEX200, TIGER200 같은 국내 ETF와 삼성전자·SK하이닉스 등 개별주를 10년 수익률, MDD, 세후 순수익 기준으로 비교합니다.",
    updatedAt: "2026-04-18",
  },
  heroSummary: "...",
  kpis: [...],
  domesticEtfRows: [...],
  domesticStockRows: [...],
  globalEtfRows: [...],
  yearlyHeatmap: [...],
  strategyCards: [...],
  faq: [...],
  relatedLinks: [...],
  sourceLinks: [...],
} as const;
```

### 7-3. 비교군 정의

#### 국내 ETF 10년 비교군

- `KODEX 200`
- `TIGER 200`
- 필요 시 추가 1~2개

#### 국내 개별주 10년 비교군

- `삼성전자`
- `SK하이닉스`
- `NAVER`
- `현대차`

주의:

- `LG에너지솔루션` 등 10년 전체 비교가 어려운 종목은 제외하거나 별도 주석 처리

#### 국내 상장 미국 ETF 상장 이후 비교군

- `TIGER S&P500`
- `ACE 미국S&P500`
- `KODEX 미국S&P500TR`

### 7-4. 데이터 설계 원칙

- `10년 전체 비교군`과 `상장 이후 비교군`은 절대 같은 표에 섞지 않는다.
- 세후 수익은 `설명용 단순 추정`임을 별도 note로 고정한다.
- 배당 재투자 버전과 미포함 버전은 비교 모드 탭으로 전환 가능하게 설계한다.

---

## 8. 페이지 구조 (`src/pages/reports/etf-vs-direct-stock-10year-2026.astro`)

### 8-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. Editor&apos;s Brief 보드
4. KPI 카드
5. 국내 ETF vs 개별주 10년 비교 표
6. 2016=100 성장 곡선 차트
7. MDD / 변동성 비교 보드
8. 배당 재투자 / 세후 순수익 비교 탭
9. 국내 상장 미국 ETF 상장 이후 비교 섹션
10. 세금·보수·거래비용 비교 표
11. 포트폴리오 혼합 전략 카드
12. 투자 성향별 추천 전략
13. FAQ
14. 출처 링크
15. 관련 계산기 / 리포트 CTA
16. `SeoContent`

### 8-2. Hero

- eyebrow: `장기투자 비교 리포트`
- title: `ETF vs 직접투자 10년 비교 2026`
- description: `수익률만이 아니라 변동성, 세금, 유지 가능성까지 같이 봅니다.`
- badges:
  - `ETF`
  - `개별주`
  - `10년 비교`
  - `세후 순수익`

### 8-3. InfoNotice

필수 안내 3줄:

- 기간은 `2016-01 ~ 2026-04` 고정
- 국내 상장 미국 ETF는 `상장 이후 성과`로 별도 비교
- 세금은 일반 투자자 기준 단순화 설명이며 실제 계좌 조건에 따라 달라질 수 있음

### 8-4. Editor&apos;s Brief 보드

핵심 카드 3개:

1. `수익률 최고치는 개별주일 수 있음`
2. `유지 가능성은 ETF가 더 높을 수 있음`
3. `현실적 최적해는 ETF 코어 + 직접투자 위성일 가능성`

---

## 9. 섹션별 상세 설계

### 9-1. 국내 ETF vs 개별주 10년 비교표

표 컬럼:

| 자산 | 유형 | 누적수익률 | CAGR | MDD | 변동성 | 배당 재투자 | 세후 순수익 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |

목적:

- 가장 먼저 핵심 수치를 한 줄에서 비교
- 상단에서 결론을 빠르게 얻는 섹션

### 9-2. 성장 곡선 차트

- 형태: line
- X축: 2016 ~ 2026
- Y축: 2016=100 지수화
- 토글:
  - `총수익 기준`
  - `배당 재투자 기준`

### 9-3. MDD / 변동성 비교 보드

카드형 2열 또는 4칸:

- 최대 낙폭 가장 큰 자산
- 최대 낙폭 가장 낮은 자산
- 변동성 가장 큰 자산
- 변동성 가장 낮은 자산

핵심 문장:

`가장 많이 오른 자산과 가장 버티기 쉬운 자산은 다를 수 있습니다.`

### 9-4. 배당 재투자 / 세후 순수익 비교

탭:

- `배당 미포함`
- `배당 재투자`
- `세후 단순 추정`

주의 문구:

- `세후 수익은 설명용 단순화 추정치이며 실제 계좌, 보유 규모, 매매 방식에 따라 달라질 수 있습니다.`

### 9-5. 국내 상장 미국 ETF 상장 이후 비교

섹션 제목:

`국내 상장 미국 ETF는 상장 이후 성과가 어땠을까`

구성:

- 상장일
- 총보수
- 상장 이후 누적수익률
- 추종지수
- 주의사항

핵심:

- 이 섹션은 10년 전체 비교가 아님을 반복해서 명시

### 9-6. 세금·보수·거래비용 비교

표 구조:

| 자산 유형 | 매매차익 과세 | 거래세 | 분배금/배당 과세 | 총보수/수수료 | 해설 |
| --- | --- | --- | --- | --- | --- |

표현 가이드:

- `국내주식형 ETF는 매매차익 비과세와 거래세 면제가 강점`
- `국내 상장 해외형 ETF는 과세 구조가 달라질 수 있음`
- `국내 개별주는 일반 소액주주 기준 장내매도 양도세가 일반적으로 없는 구조지만 거래세가 있음`

### 9-7. 포트폴리오 혼합 전략 카드

권장 3종:

1. `ETF 코어형`
2. `ETF + 직접투자 균형형`
3. `직접투자 고비중형`

카드 필드:

- 누구에게 맞는지
- 예시 구성
- 기대 장점
- 주의점

### 9-8. 투자 성향별 추천 전략

표 또는 카드:

| 투자 성향 | 추천 전략 |
| --- | --- |
| 초보 | ETF 중심 |
| 직장인 장기 적립식 | 국내/미국 ETF 혼합 |
| 종목 분석 가능 | ETF 코어 + 개별주 위성 |
| 고위험 선호 | 개별주 비중 확대 |
| 변동성 민감 | ETF 위주 |

---

## 10. JavaScript 설계 (`public/scripts/etf-vs-direct-stock-10year-2026.js`)

### 10-1. 역할

- 비교 모드 탭 전환
- 차트 데이터 전환
- 특정 자산 하이라이트
- 모바일 아코디언 보조 동작

### 10-2. 권장 함수 구조

```js
function getStateFromDom() {}
function switchComparisonMode(mode) {}
function renderGrowthChart(mode) {}
function renderAfterTaxTable(mode) {}
function highlightAsset(assetId) {}
function boot() {}
```

### 10-3. MVP 인터랙션

- `gross / afterTax / dividend` 탭
- 성장 곡선 모드 전환
- 미국 ETF 상장 이후 비교 행 강조

---

## 11. 스타일 설계 (`_etf-vs-direct-stock-10year-2026.scss`)

### 11-1. prefix

- `evds26-`

### 11-2. 시각 톤

- 투자 리포트답게 `딥그린 + 샌드 + 오프화이트`
- KPI와 표 가독성을 우선
- 위험/MDD는 주황 또는 적갈색 톤으로 보조 강조

### 11-3. 핵심 스타일 포인트

- 상단 브리프 보드
- 비교표 헤더 고정감
- 탭 전환 버튼
- 포트폴리오 전략 카드
- 모바일에서 표는 가로 스크롤 허용, 카드 해설은 별도 유지

---

## 12. SEO / 하단 콘텐츠

### 12-1. SeoContent 권장 구조

- `introTitle`: `ETF와 직접투자 10년 비교를 어떻게 읽어야 하나`
- `intro`: 수익률만 보지 말아야 하는 이유
- `inputPoints`: 10년 비교군과 상장 이후 비교군 차이
- `criteria`: 세금 단순화, 배당 재투자, MDD 중요성
- `faq`: `faq`
- `related`: `relatedLinks`

### 12-2. 관련 링크 전략

내부 링크 최소 포함:

- `적립식 투자 계산기`
- `국내주식 양도세 / 세금 계산기` 계열이 있으면 연결
- `반도체 ETF 비교 2026`
- `비트코인·금·S&P500 10년 비교 2026`

---

## 13. QA 체크리스트

- [ ] 국내 ETF / 국내 개별주 / 국내 상장 미국 ETF 구분이 명확하다
- [ ] 상장 이후 비교군이 10년 비교 표에 섞이지 않는다
- [ ] 배당 재투자 / 세후 모드 전환 시 표와 차트가 같이 바뀐다
- [ ] MDD와 변동성 강조 카드가 모바일에서도 읽기 쉽다
- [ ] 세금 관련 문구가 단정적으로 쓰이지 않는다
- [ ] FAQ가 5개 이상 포함된다
- [ ] `src/data/reports.ts` 등록 및 허브 노출이 반영된다
- [ ] `npm run build`가 통과한다

---

## 14. 구현 우선순위

### 14-1. MVP 필수

1. 데이터 파일
2. 리포트 페이지 본문
3. 비교표 / KPI 보드
4. 성장 곡선 / 탭 전환
5. FAQ / 관련 CTA

### 14-2. 있으면 좋은 요소

1. 연도별 수익률 히트맵
2. 자산 하이라이트 카드 인터랙션
3. 포트폴리오 혼합 전략 미니 시뮬레이션

### 14-3. 확장 후보

- 사용자 선택 포트폴리오 비중 슬라이더
- 적립식 투자 시나리오 연결
- 세후 기준 더 정교한 계산기 파생

