# 비트코인·금·S&P500 10년 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/bitcoin-gold-sp500-10year-comparison-2026.md`
> 작성일: 2026-04-12
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `salary-asset-2016-vs-2026`, `seoul-housing-2016-vs-2026`, `semiconductor-etf-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/bitcoin-gold-sp500-10year-comparison-2026.md`
- 구현 대상: `비트코인 vs 금 vs S&P500 10년 수익 비교 2026`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 페이지 성격

- **10년 장기투자 비교 리포트**: 비트코인, 금, S&P500, 나스닥100, 코스피를 같은 기준으로 비교
- **핵심 차별점**: 단순 누적수익률이 아니라 `MDD`, `회복 기간`, `실질 수익`, `세후 관점`, `한국 투자자 접근법`까지 함께 본다
- **핵심 메시지**: `수익률 1등`과 `버티기 편한 자산 1등`은 다를 수 있다는 점을 숫자로 설명한다

### 1-3. 권장 slug

- `bitcoin-gold-sp500-10year-comparison-2026`
- URL: `/reports/bitcoin-gold-sp500-10year-comparison-2026/`

### 1-4. 권장 파일 구조

```txt
src/
  data/
    bitcoinGoldSp5002026.ts
  pages/
    reports/
      bitcoin-gold-sp500-10year-comparison-2026.astro

public/
  scripts/
    bitcoin-gold-sp500-10year-comparison-2026.js
  og/
    reports/
      bitcoin-gold-sp500-10year-comparison-2026.png

src/styles/scss/pages/
  _bitcoin-gold-sp500-10year-comparison-2026.scss
```

### 1-5. 전제

- 실시간 시세 API를 붙이지 않고 **기준일 스냅샷 고정 데이터**로 구현한다.
- 메인 기준은 **한국 사용자 체감용 원화 기준**으로 통일한다.
- 미국 자산은 원화 환산 여부를 데이터 설명과 표 하단 주석에 명확히 노출한다.
- 세후 수익은 **정확한 세무 계산기**가 아니라 `단순 비교용 예시`로만 제공한다.

---

## 2. 현재 프로젝트 리포트 구조 정리

### 2-1. 현재 `/reports/` 공통 구조

1. `CalculatorHero`
2. `InfoNotice`
3. 브리프 보드 또는 KPI 카드
4. 비교 차트 / 비교 표 / 랭킹 카드
5. 탐색형 탭 또는 시뮬레이션 박스
6. 해설 카드 / 패턴 요약
7. 외부 참고 링크
8. 관련 계산기 / 관련 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트가 따라야 할 방향

- `salary-asset-2016-vs-2026`에서 가져올 것
  - KPI 요약 -> 직접 비교 -> 체감 계산 -> 패턴 요약 흐름
  - 숫자 비교와 해설을 한 화면에서 연결하는 UX
- `seoul-housing-2016-vs-2026`에서 가져올 것
  - 기준일/가정/주의사항을 `InfoNotice`에서 먼저 고정
  - 모바일에서 차트 과밀을 피하는 탭형 탐색
- 이번 페이지에서 새롭게 강조할 것
  - `누적수익률`과 `MDD/회복기간`을 함께 보여주는 이중 해석 구조
  - `100만원 투자 결과`와 `1억원 투자 결과`를 둘 다 제공해 재미와 현실감을 같이 챙기는 구조
  - `국내 투자자 접근법`과 `세후 관점`을 별도 섹션으로 분리해 검색 체류시간을 늘리는 구조

---

## 3. 구현 범위

### 3-1. MVP 포함

- 비교 자산 5종 고정 데이터
  - 비트코인
  - 금
  - S&P500
  - 나스닥100
  - 코스피
- 핵심 비교 지표 8종
  - 시작값
  - 종료값
  - 누적수익률
  - CAGR
  - 100만원 투자 결과
  - 최대 낙폭(MDD)
  - 회복 기간
  - 연환산 변동성
- 보조 비교 지표 3종
  - 실질 수익률
  - 세후 단순 추정
  - 한국 투자자 접근 수단
- 차트/보드 6종
  - 2016=100 성장 곡선
  - 수익률 비교 표
  - MDD 비교 보드
  - 회복 기간 비교 보드
  - 실질/세후 비교 보드
  - 상관관계 히트맵 또는 대체 매트릭스 표
- 시뮬레이션 2종
  - 100만원 일시 투자 결과
  - 1억원 일시 투자 결과
- 해설/콘텐츠 영역 4종
  - 패턴 요약 카드
  - 국내 투자자 접근법
  - FAQ
  - 관련 계산기 CTA

### 3-2. MVP 제외

- 실시간 시세 호출
- 사용자 임의 시작일/종료일 입력
- 적립식 매수 엔진
- 정교한 세금 계산기
- 포트폴리오 리밸런싱 시뮬레이션
- 로그인/저장/히스토리 기능

---

## 4. 페이지 목적

- 사용자가 `지난 10년 동안 무엇이 가장 많이 올랐는가`를 한눈에 파악하게 한다.
- 동시에 `가장 많이 오른 자산이 가장 견디기 쉬운 자산은 아니다`라는 점을 MDD와 회복 기간으로 이해하게 한다.
- 리포트에서 끝나지 않고 `적립식 투자 계산기`, `FIRE 계산기`, `ETF 비교 리포트`, `환율 계산기`로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 장기투자 비교형 사용자

- `비트코인 금 S&P500 비교`, `10년 수익률 비교` 검색으로 유입한다.
- 상단 표에서 누적수익률과 100만원 투자 결과를 먼저 본다.
- 이어서 MDD와 회복 기간을 확인하며 `버틸 수 있었는지`를 판단한다.

### 5-2. 코인 입문 사용자

- 비트코인이 정말 압도적이었는지 궁금해한다.
- 금, S&P500과 같이 놓고 보며 위험 대비 성과를 읽는다.
- 마지막에 분할매수/자산배분 관련 CTA로 이동한다.

### 5-3. ETF 투자 사용자

- S&P500과 나스닥100이 금, 비트코인보다 얼마나 안정적이었는지 확인한다.
- 세후 관점과 국내 투자 수단 섹션을 본다.
- ETF 비교 리포트나 적립식 계산기로 이동한다.

### 5-4. 일반 검색 유입 사용자

- `2016년에 100만원 넣었으면 얼마`, `비트코인 vs 금`, `S&P500 10년 수익률` 검색으로 들어온다.
- Hero, 핵심 표, FAQ만 읽어도 결론을 얻을 수 있어야 한다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력

- `compareMode`
  - `growth`: 2016=100 성장 곡선
  - `drawdown`: MDD 비교
  - `recovery`: 회복 기간 비교
  - `real`: 실질/세후 비교
- `investmentAmount`
  - 기본값: `1000000`
  - 단위: 원
  - 100만원, 1000만원, 1억원 프리셋 버튼 제공
- `allocationPreset`
  - `aggressive`
  - `balanced`
  - `defensive`

#### 확장 대비 URL 파라미터

- `mode`
- `amount`
- `preset`

### 6-2. 출력값

#### 메인 리포트 출력

- 10년 누적수익률 순위
- 100만원 투자 결과 순위
- 최대 낙폭 최대 자산
- 회복 기간 최장 자산
- 변동성 최저 자산
- 실질 수익률 비교 결과

#### 표/차트 출력

- 자산별 성장곡선
- 자산별 누적수익률/CAGR 표
- 자산별 MDD/회복 기간 표
- 자산별 변동성 표
- 자산별 세후 단순 비교 표

#### 시뮬레이션 출력

- 선택 투자금 기준 현재 가치
- 선택 투자금 기준 수익 금액
- 선택 투자금 기준 실질 구매력 추정

---

## 7. 섹션 구조

### 7-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. 투자 결과 브리프 보드
4. KPI 요약 카드
5. 10년 수익률 비교 표
6. 2016=100 성장 곡선 차트
7. MDD / 회복 기간 비교 보드
8. 변동성 / 실질 수익 / 세후 비교 보드
9. 100만원 / 1억원 투자 시뮬레이션 박스
10. 상관관계 매트릭스
11. 국내 투자자 접근법
12. 2026 현재 진입 시나리오 카드
13. 패턴 요약 카드
14. FAQ
15. 관련 계산기 / 리포트 CTA
16. `SeoContent`

### 7-2. 모바일 우선 순서

- Hero
- 기준 안내
- 브리프 보드
- KPI
- 핵심 표
- 성장 곡선
- MDD / 회복 기간
- 실질 / 세후
- 투자금 시뮬레이션
- 국내 투자자 접근법
- FAQ
- CTA
- SEO

### 7-3. PC 레이아웃

- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드 4개` 2열
- 핵심 표와 성장 곡선은 세로 배치
- MDD / 회복 기간 / 변동성은 3열 카드 보드
- 투자 시뮬레이션은 `좌: 입력 / 우: 결과` 2열
- FAQ와 CTA는 하단 단일 컬럼

### 7-4. 섹션별 역할

#### Hero

- eyebrow: `자산 비교 리포트`
- H1 예시: `비트코인·금·S&P500 10년 수익 비교 2026`
- 설명 예시
  - 2016년에 같은 돈을 넣었다면 현재 얼마가 됐는지 비교합니다.
  - 수익률뿐 아니라 하락폭, 회복 기간, 실질 수익까지 함께 보여준다는 메시지를 준다.

#### InfoNotice

- 필수 문구
  - 기준일 스냅샷 기준의 비교용 리포트임
  - 미국 자산은 원화 환산 여부와 배당 포함 여부를 명시함
  - 세후 비교는 단순화된 예시이며 실제 세금은 투자 수단과 개인 상황에 따라 달라짐
  - 과거 수익률은 미래 수익을 보장하지 않음

#### 투자 결과 브리프 보드

- 리드 문단 1개
- 하이라이트 카드 4개
  - 100만원 투자 결과 1위
  - 최대 낙폭 최대 자산
  - 변동성 최저 자산
  - 2026 현재 접근 난이도 코멘트

#### KPI 요약 카드

- 카드 5~6개 권장
  - 누적수익률 1위
  - CAGR 1위
  - MDD 최악
  - 회복 최단
  - 실질 수익률 1위
  - 세후 관점 주의 자산

#### 10년 수익률 비교 표

- 기본 정렬: `100만원 투자 결과` 내림차순
- 컬럼
  - 자산명
  - 시작가
  - 종료가
  - 누적수익률
  - CAGR
  - 100만원 투자 결과
- 표 하단에 `기준일 / 환율 / 배당 / 데이터 정의` 주석 필수

#### 2016=100 성장 곡선 차트

- 라인 차트 1개
- 자산별 색상 고정
- Y축은 지수값, X축은 연도
- 목적: 절대 가격이 아니라 상대 성장 경로를 보여준다

#### MDD / 회복 기간 비교 보드

- 카드 또는 표 2종
- 항목
  - MDD
  - 낙폭 발생 시기
  - 회복 기간
  - 체감 난이도 라벨
- 목적: `많이 벌었는가`와 `버틸 수 있었는가`를 분리해서 읽게 한다

#### 변동성 / 실질 수익 / 세후 비교 보드

- 탭형 보드 권장
  - `변동성`
  - `실질 수익`
  - `세후 비교`
- 모바일에서는 한 번에 하나만 펼쳐 가독성을 높인다

#### 100만원 / 1억원 투자 시뮬레이션 박스

- 입력
  - 투자금 프리셋
- 출력
  - 자산별 현재 가치
  - 수익 금액
  - 실질 구매력 추정
- 제출 버튼 없이 즉시 반영

#### 상관관계 매트릭스

- 5x5 매트릭스 또는 단순 표
- 최근 10년 기준 단일 버전으로 시작
- 목적: 자산배분 관점의 차이를 짧게 설명한다

#### 국내 투자자 접근법

- 자산별 접근 수단 카드
  - 비트코인: 원화 거래소 / 해외 거래소
  - 금: KRX 금 / 금 ETF / 금통장
  - S&P500, 나스닥100: 미국 ETF / 국내 상장 미국지수 ETF
  - 코스피: 지수 ETF / 대형주 ETF

#### 2026 현재 진입 시나리오 카드

- 공격형 / 균형형 / 안정형 3개 카드
- 투자 권유가 아니라 `예시 배분 구조` 톤으로만 설명

#### 패턴 요약 카드

- 카드 4개
  - 수익률 1등과 편안한 투자 1등의 차이
  - 비트코인의 경로 리스크
  - 금의 방어 자산 역할
  - S&P500/나스닥100의 장기 우상향 설득력

#### FAQ

- 최소 8개
- 검색 키워드형 질문 중심으로 구성

#### 관련 계산기 / 리포트 CTA

- 내부 링크 우선
  - `dca-investment-calculator`
  - `fire`
  - `semiconductor-etf-2026`
  - 환율 관련 계산기

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `content-section`, `section-header`, `panel`, `report-stat-card`

### 8-2. 페이지 전용 블록

- `asset-compare-hero-board`
- `asset-compare-highlight-card`
- `asset-compare-kpi-grid`
- `asset-return-table`
- `asset-growth-chart-panel`
- `asset-risk-grid`
- `asset-real-return-panel`
- `asset-tax-panel`
- `asset-simulation-box`
- `asset-correlation-matrix`
- `asset-access-grid`
- `asset-allocation-grid`
- `asset-pattern-grid`
- `asset-faq-panel`
- `asset-cta-panel`

### 8-3. Astro 페이지 구성 방식

- `.astro`에서 메타, KPI, FAQ, 초기 시뮬레이션 값을 만든다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/bitcoin-gold-sp500-10year-comparison-2026.js`에서
  - 차트 렌더
  - 탭 상태 변경
  - 투자금 시뮬레이션
  - URL 파라미터 동기화
- 1차 구현은 하위 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태

```ts
type CompareMode = "growth" | "drawdown" | "recovery" | "real";
type AllocationPreset = "aggressive" | "balanced" | "defensive";

type ViewState = {
  compareMode: CompareMode;
  investmentAmount: number;
  allocationPreset: AllocationPreset;
};
```

### 9-2. 초기값

- `compareMode = "growth"`
- `investmentAmount = 1000000`
- `allocationPreset = "balanced"`

### 9-3. 동작 규칙

- 차트 모드 변경 시
  - 탭 활성 상태 갱신
  - 보조 설명 문구와 범례 갱신
- 투자금 변경 시
  - 시뮬레이션 카드 즉시 갱신
- 배분 프리셋 변경 시
  - 예시 포트폴리오 카드 강조 상태 갱신
- URL 파라미터 동기화 권장
  - `mode`
  - `amount`
  - `preset`

예시:

```txt
/reports/bitcoin-gold-sp500-10year-comparison-2026/?mode=real&amount=100000000&preset=balanced
```

---

## 10. 계산 로직

### 10-1. 누적수익률

```ts
totalReturnRate = ((endValue - startValue) / startValue) * 100;
```

### 10-2. CAGR

```ts
cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
```

### 10-3. 투자 결과 금액

```ts
finalAmount = Math.round(initialAmount * (endValue / startValue));
profitAmount = finalAmount - initialAmount;
```

### 10-4. 실질 수익률

```ts
realReturnRate = (((1 + nominalReturnRate / 100) / (1 + inflationRate / 100)) - 1) * 100;
```

### 10-5. 세후 단순 추정

```ts
afterTaxAmount = finalAmount - estimatedTaxAmount;
afterTaxReturnRate = ((afterTaxAmount - initialAmount) / initialAmount) * 100;
```

- 자산별 과세 구조가 다르므로 `estimatedTaxAmount`는 수단별 단순 예시로만 사용한다.

### 10-6. MDD

```ts
mdd = ((troughValue - peakValue) / peakValue) * 100;
```

### 10-7. 회복 기간

```ts
recoveryMonths = monthsBetween(peakDate, recoveryDate);
```

- 고점 회복을 못 한 경우 `미회복` 라벨 처리

### 10-8. 체감 난이도 라벨

```ts
if (mdd <= -60) riskLabel = "매우 높음";
else if (mdd <= -35) riskLabel = "높음";
else if (mdd <= -20) riskLabel = "중간";
else riskLabel = "낮음";
```

---

## 11. 데이터 파일 구조

### 11-1. 타입 정의

```ts
export type AssetId = "BTC" | "GOLD" | "SP500" | "NASDAQ100" | "KOSPI";

export interface AssetSnapshot {
  id: AssetId;
  label: string;
  currency: "KRW";
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  totalReturnRate: number;
  cagr: number;
  mdd: number;
  mddPeriodLabel: string;
  recoveryMonths: number | null;
  volatilityAnnual: number;
  inflationAdjustedReturnRate: number;
  afterTaxReturnRate?: number;
  investmentAccess: string[];
  summary: string;
  color: string;
}

export interface GrowthPoint {
  year: number;
  BTC: number;
  GOLD: number;
  SP500: number;
  NASDAQ100: number;
  KOSPI: number;
}

export interface AllocationPreset {
  id: "aggressive" | "balanced" | "defensive";
  label: string;
  weights: Array<{ assetId: AssetId; weight: number }>;
  note: string;
}
```

### 11-2. 메인 export 구조

```ts
export const BITCOIN_GOLD_SP500_2026_META = {
  slug: "bitcoin-gold-sp500-10year-comparison-2026",
  title: "비트코인 vs 금 vs S&P500 10년 수익 비교 2026",
  updatedAt: "2026-04",
  baseCurrency: "KRW",
  startDate: "2016-01-01",
  endDate: "2026-04-01",
};

export const ASSET_SNAPSHOTS: AssetSnapshot[] = [/* ... */];
export const GROWTH_SERIES: GrowthPoint[] = [/* 2016~2026 */];
export const CORRELATION_MATRIX = [/* 5x5 */];
export const ALLOCATION_PRESETS: AllocationPreset[] = [/* 3개 */];
export const FAQ_ITEMS = [/* question, answer */];
export const REFERENCE_LINKS = [/* label, href, source */];
```

### 11-3. 데이터 작성 규칙

- 숫자 원본은 계산이 쉬운 `number`로 저장한다.
- 화면 노출용 `억원`, `만원`, `%` 포맷은 `.astro` 또는 스크립트에서 처리한다.
- 기준일, 환율, 배당 포함 여부는 메타와 표 하단 주석에서 중복 노출한다.
- 세후 수익은 `exact`가 아니라 `simpleEstimate` 라벨을 붙인다.

---

## 12. SEO / 카피 가이드

### 12-1. 메인 메타 초안

- `title`: `비트코인 vs 금 vs S&P500 10년 수익 비교 2026 | 100만원이 얼마 됐을까?`
- `description`: `2016~2026년 비트코인, 금, S&P500, 나스닥100, 코스피에 같은 돈을 투자했다면 현재 얼마가 됐을까? 누적수익률, 최대 낙폭(MDD), 회복 기간, 실질 수익, 세후 관점까지 한눈에 비교합니다.`

### 12-2. 핵심 카피 원칙

- 투자 권유형 문구 금지
- `압승`, `폭등` 같은 표현은 데이터 옆 보조 문장으로만 제한
- 추천 표현
  - `성과는 높았지만 변동성도 매우 컸다`
  - `수익률보다 버티기 난이도를 같이 봐야 한다`
  - `금은 수익률보다 방어력 관점에서 읽는 자산이다`

### 12-3. FAQ 추천 질문

1. 지난 10년 수익률 1위는 무조건 비트코인인가요?
2. 금은 왜 수익률이 낮아도 계속 비교 대상에 들어가나요?
3. S&P500과 나스닥100 중 장기투자는 뭐가 더 안정적이었나요?
4. 코스피는 왜 상대적으로 약해 보이나요?
5. 환율까지 반영한 비교인가요?
6. 세후 수익은 실제와 똑같나요?
7. 2026년 지금 들어가도 늦지 않았나요?
8. 적립식으로 샀다면 결과가 달라지나요?

---

## 13. 구현 체크리스트

### 13-1. 데이터

- `src/data/bitcoinGoldSp5002026.ts` 작성
- 자산 5종 스냅샷 데이터 입력
- 성장 시계열 배열 작성
- FAQ, 참고 링크, 프리셋 데이터 입력

### 13-2. 페이지

- `src/pages/reports/bitcoin-gold-sp500-10year-comparison-2026.astro` 작성
- `src/data/reports.ts` 메타 등록
- `src/pages/reports/index.astro` 허브 노출 필요 여부 반영

### 13-3. 스크립트

- 차트 탭 상태 제어
- 투자금 시뮬레이션 계산
- URL 파라미터 동기화

### 13-4. 스타일

- 페이지 전용 SCSS 작성
- 모바일 표 가로 스크롤 처리
- 리스크 카드의 시각적 강도 차등 처리

---

## 14. QA 체크리스트

### 14-1. 콘텐츠 QA

- 자산명, 기준일, 환율, 배당 포함 여부가 명확히 표기되는가
- `수익률`과 `실질 수익률`, `세전`과 `세후`가 혼동되지 않는가
- 비트코인/금/주식 각각의 성격 설명이 과장 없이 균형적인가

### 14-2. 계산 QA

- 100만원, 1000만원, 1억원 프리셋에서 결과가 올바르게 선형 비례하는가
- MDD, CAGR, 실질 수익 계산식이 자산별 동일 기준으로 적용되는가
- 회복 기간 미회복 케이스가 깨지지 않는가

### 14-3. UI QA

- 모바일에서 표가 가로 스크롤로 읽히는가
- 탭 전환 시 활성 상태와 설명 문구가 함께 갱신되는가
- Hero -> 핵심 표 -> 리스크 보드 순서로 자연스럽게 읽히는가

### 14-4. SEO QA

- H1은 1개만 존재하는가
- FAQ 스키마 및 `SeoContent` 문단이 메인 키워드를 과도하게 반복하지 않는가
- 내부 링크 CTA가 관련성이 높은 흐름으로 연결되는가

---

## 15. 최종 구현 메모

- 이 페이지의 승부 포인트는 `수익률 자랑`이 아니라 `성과와 스트레스를 같이 비교하는 UX`다.
- 따라서 차트 수를 늘리는 것보다 `핵심 표 + MDD/회복 기간 + 투자금 시뮬레이션` 3축이 선명해야 한다.
- 1차 구현에서는 정적 데이터 기반으로 완성도를 높이고, 이후 파생 페이지로 `적립식 버전`, `세후 계산기 버전`, `자산배분 버전`을 확장하는 방향이 적절하다.
