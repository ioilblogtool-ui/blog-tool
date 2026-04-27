# 2026 한국인 해외여행 항공권 가격 완전 비교 — 설계 문서

> 기획 원문: `docs/plan/202604/korea-flight-price-comparison-2026.md`
> 작성일: 2026-04-20
> 구현 기준: Codex가 이 문서만 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `overseas-travel-cost-compare-2026`, `bitcoin-gold-sp500-10year-comparison-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/korea-flight-price-comparison-2026.md`
- 구현 대상: `2026 한국인 해외여행 항공권 가격 완전 비교`
- 콘텐츠 유형: 데이터 리포트 (`/reports/` 계열)
- 핵심 기능: 노선별 가격 비교 + 예약 시점별 가격 지수 + 수하물/좌석/식사 포함 총비용 비교

### 1-2. 페이지 성격

- **항공권 가격 비교 허브 리포트**: 일본·동남아·중국/중화권·유럽·미주·오세아니아 주요 노선을 동일 기준으로 비교
- **핵심 차별점**: 항공권 표면가가 아니라 수하물·좌석·식사·공항 이동비까지 포함한 실제 출국 비용 관점 제공
- **핵심 메시지**: 항공권은 `최저가`보다 `조건별 총비용`으로 봐야 한다
- 인터랙션: 권역 탭, 예약 시점 탭, LCC/FSC 총비용 비교 카드 갱신

### 1-3. 권장 slug

- `korea-flight-price-comparison-2026`
- URL: `/reports/korea-flight-price-comparison-2026/`

### 1-4. 권장 파일 구조

```txt
src/
  data/
    koreaFlightPriceComparison2026.ts
  pages/
    reports/
      korea-flight-price-comparison-2026.astro

public/
  scripts/
    korea-flight-price-comparison-2026.js
  og/
    reports/
      korea-flight-price-comparison-2026.png

src/styles/scss/pages/
  _korea-flight-price-comparison-2026.scss
```

### 1-5. 전제

- 실시간 항공권 API는 사용하지 않는다. **2026년 4월 기준 조사 스냅샷 + 공개 자료 기반 추정 범위값**으로 구현한다.
- 가격은 단일 확정값이 아니라 `비수기/일반/성수기/극성수기` 범위로 표시한다.
- 모든 금액은 성인 1인 왕복 또는 2인 합산 기준을 명확히 분리한다.
- 추정 데이터는 화면에 `추정` 또는 `참고` 배지를 붙인다.
- 표 하단에 `검색 기준일`, `출발 공항`, `왕복/일반석/성인 기준`, `옵션 포함 여부`를 반복 노출한다.

---

## 2. 현재 프로젝트 리포트 구조 정리

### 2-1. `/reports/` 공통 구조

1. `CalculatorHero`
2. `InfoNotice`
3. 조사 기준 요약 보드
4. 핵심 수치 카드
5. 비교 표/차트 섹션
6. 탭 기반 인터랙션
7. 내부 계산기 CTA
8. `SeoContent` + FAQ

### 2-2. 이번 리포트가 따라야 할 방향

- `overseas-travel-cost-compare-2026`에서 가져올 것
  - 여행 비용 기준을 먼저 고정하는 `InfoNotice`
  - 표가 길어지는 비교 리포트의 모바일 가로 스크롤 처리
  - `script[type="application/json"]` 데이터 전달 패턴
- `bitcoin-gold-sp500-10year-comparison-2026`에서 가져올 것
  - 탭 기반 데이터 전환
  - 핵심 지표 카드와 비교 차트 조합

---

## 3. 구현 범위

### 3-1. MVP 포함

- 대표 노선 20개
- 권역 6개: 일본, 동남아, 중국/중화권, 유럽, 미주, 오세아니아
- 비수기/일반/성수기/극성수기 왕복 가격 범위 표
- 항공사 유형별 비교: FSC, LCC, 외항사/경유
- 예약 시점별 가격 지수: 90일 전, 60일 전, 45일 전, 30일 전, 14일 전, 7일 전, 3일 전, 당일
- 옵션 포함 총비용 비교: 수하물, 좌석 지정, 기내식, 공항 이동비
- LCC vs FSC 역전 구간 카드
- 공항별 출발 비용 비교: 인천, 김포, 부산/대구/청주 등 지방 공항
- FAQ 8개 이상
- 내부 링크 CTA 2개 이상

### 3-2. MVP 제외

- 실시간 항공권 검색
- 사용자가 직접 노선/날짜를 입력하는 계산기
- 항공권 제휴 API 연동
- 카드사 혜택 실시간 랭킹
- 도시별 상세 하위 리포트 자동 생성
- 캘린더형 날짜별 최저가 크롤링

---

## 4. 페이지 목적

- 사용자가 한국 출발 해외 항공권의 대략적 가격대를 권역·노선별로 빠르게 비교하게 한다.
- `항공권 기본가`와 `실제 총비용`이 어떻게 달라지는지 보여준다.
- 항공권 최저가 시기 계산기와 해외여행 총비용 계산기로 자연스럽게 이동하게 한다.
- 2026년 여행 수요·성수기·유류비·환율 변수에 대한 판단 기준을 제공한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 여행지 후보 비교 사용자

- `2026 항공권 가격 비교`, `일본 동남아 항공권 어디가 쌈` 검색으로 유입
- 권역별 대표 노선 가격표를 먼저 훑는다
- 월별 성수기 히트맵과 예약 시점 그래프를 보고 여행지 후보를 좁힌다

### 5-2. 특정 노선 예산 확인 사용자

- `인천 오사카 항공권 평균`, `유럽 왕복 항공권 평균 2026` 검색으로 유입
- 노선 표에서 비수기/성수기 가격 범위를 확인한다
- LCC/FSC 옵션 포함 비교를 보고 실제 총액을 판단한다

### 5-3. 가족 여행 사용자

- 표면가보다 수하물·좌석 지정·공항 이동비가 중요하다
- 옵션 포함 총비용 카드와 LCC/FSC 역전 구간 섹션이 핵심 정보가 된다

### 5-4. 장거리 여행 사용자

- 유럽/미주/오세아니아 노선의 예약 시점과 경유 여부를 중점 확인한다
- 60~90일 전 예약의 가격 지수와 성수기 회피 팁을 본다

---

## 6. 입력값 / 출력값 정의

### 6-1. 인터랙션 입력

| 입력 | 기본값 | 선택지 |
|------|--------|--------|
| `region` | `japan` | `japan`, `southeastAsia`, `chinaTaiwan`, `europe`, `americas`, `oceania` |
| `bookingWindow` | `d60` | `d90`, `d60`, `d45`, `d30`, `d14`, `d7`, `d3`, `d0` |
| `carrierMode` | `total` | `base`, `total` |

### 6-2. 출력값

- 선택 권역의 노선별 가격 범위 표
- 선택 예약 시점 기준 가격 지수 및 코멘트
- LCC/FSC 기본가 대비 옵션 포함 총비용 비교
- 최저 가격대 노선, 성수기 변동폭 큰 노선, 옵션 역전 가능 노선 하이라이트

### 6-3. URL 파라미터

```txt
/reports/korea-flight-price-comparison-2026/?region=japan&window=d60&mode=total
```

---

## 7. 섹션 구조

### 7-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice` — 데이터 기준/추정 안내
3. 2026 항공권 시장 요약 보드
4. 대표 노선 TOP 카드
5. 권역별 평균 왕복 항공권 가격 표
6. 항공사 유형별 가격 비교
7. 성수기·비수기 월별 가격 히트맵
8. 예약 시점별 가격 지수 그래프
9. 수하물·좌석·식사 옵션 포함 총비용 비교
10. LCC vs FSC 총비용 역전 구간
11. 공항별 출발 비용 비교
12. 여행보험 포함 출국 비용 시뮬레이션
13. 2026 하반기 전망
14. 관련 계산기 CTA
15. `SeoContent` + FAQ

### 7-2. 모바일 우선 순서

Hero → 기준 안내 → 핵심 수치 → 권역 탭 → 노선 표 → 예약 시점 그래프 → 옵션 총비용 → 역전 구간 → 공항 비교 → CTA → FAQ

### 7-3. PC 레이아웃

- Hero 아래 핵심 지표 카드 4개를 4열 배치
- 권역별 비교 표는 탭 + 가로 스크롤 테이블
- 예약 시점 그래프와 해석 카드: 2열
- 옵션 총비용 비교: 3개 시나리오 카드
- CTA는 하단 2열 카드

### 7-4. 섹션별 역할

#### Hero

- eyebrow: `항공권 가격 리포트`
- H1: `2026 한국인 해외여행 항공권 가격 완전 비교`
- 설명: `한국 출발 주요 해외 노선의 왕복 항공권 가격을 권역·항공사·예약 시점·옵션 포함 총비용 기준으로 비교합니다.`

#### InfoNotice

필수 문구:

- 이 리포트는 2026년 4월 기준 공개 자료와 대표 노선 표본을 바탕으로 구성한 비교 목적 자료입니다.
- 항공권 가격은 검색일, 출발일, 체류 기간, 항공사, 환승 여부, 수하물 포함 여부에 따라 크게 달라질 수 있습니다.
- 모든 가격은 성인 1인 왕복 일반석 기준이며, 옵션 포함 총비용 섹션은 2인 합산 추정값입니다.
- `추정` 표시는 실시간 견적이 아니라 비교 목적의 기준값입니다.

#### 2026 항공권 시장 요약 보드

카드 4개:

- `단거리`: 일본·대만·홍콩은 성수기 변동폭이 큼
- `중거리`: 동남아는 연말·설·여름방학이 강세
- `장거리`: 유럽·미주는 조기 예약 유리
- `총비용`: LCC는 수하물·좌석 옵션 포함 여부가 핵심

#### 대표 노선 TOP 카드

- 가장 접근성 좋은 노선: 오사카, 후쿠오카, 타이베이
- 총비용 대비 만족도 높은 노선: 방콕, 다낭, 하노이
- 장거리 대표 노선: 파리, 런던, LA, 뉴욕

#### 권역별 평균 왕복 항공권 가격 표

- 권역 탭 전환
- 표 컬럼: 권역, 노선, 비수기, 일반, 성수기, 극성수기, 가격 체감, 코멘트
- 모든 가격은 `만원` 단위 범위값으로 표시

#### 항공사 유형별 가격 비교

- FSC, LCC, 외항사/경유를 동일 노선 기준으로 비교
- 표면가와 수하물 포함 총액을 분리
- `기본가만 보면 LCC 우세`, `수하물 포함 후 격차 축소`, `장거리에서는 FSC 또는 외항사 경유 유리 가능` 메시지 강화

#### 월별 가격 히트맵

- 가로축: 1~12월
- 세로축: 일본, 동남아, 중국/중화권, 유럽, 미주, 오세아니아
- 셀 값: 가격 지수 `낮음`, `보통`, `높음`, `매우 높음`
- 모바일은 카드형 월별 리스트로 대체 가능

#### 예약 시점별 가격 지수 그래프

- 단거리/중거리/장거리 3개 라인
- 기준값: 출발 60일 전 = 100
- 90일 전~당일까지 상대 지수 표시
- 해석 카드에 `막판 특가보다 조기 예약이 유리한 노선`과 `근거리 특가 가능 노선`을 분리

#### 옵션 포함 총비용 비교

- 시나리오 3개:
  - 오사카 3박4일 / 2인 / 기내용만
  - 방콕 4박5일 / 2인 / 위탁수하물 1개
  - 파리 7박9일 / 1인 / 23kg 수하물
- 표 컬럼: 기본 운임, 수하물, 좌석 지정, 기내식, 공항 이동비, 최종 총비용

#### LCC vs FSC 총비용 역전 구간

- `LCC 유리`: 단기, 기내용 수하물, 날짜 유연
- `격차 축소`: 동남아 4박 이상, 위탁수하물 필요
- `FSC 유리 가능`: 장거리, 가족 여행, 일정 안정성 중요

#### 공항별 출발 비용 비교

- 인천, 김포, 부산, 대구, 청주
- 항공권 가격만이 아니라 공항 이동비, 전날 숙박, 심야/새벽 출발 부담을 포함

#### 관련 계산기 CTA

- `/tools/flight-cheapest-timing-calculator/`
- `/tools/overseas-travel-cost/`

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트

- `BaseLayout`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `content-section`, `section-header`, `panel`, `report-stat-card` 스타일 패턴

### 8-2. 페이지 전용 CSS 클래스 명명

prefix: `kfp-`

- `kfp-market-board` — 시장 요약 보드
- `kfp-route-tabs` — 권역 탭
- `kfp-route-table` — 노선별 가격 표
- `kfp-route-card` — 대표 노선 카드
- `kfp-heatmap` — 월별 히트맵
- `kfp-booking-chart` — 예약 시점 그래프
- `kfp-booking-tabs` — 예약 시점 탭
- `kfp-carrier-table` — 항공사 유형별 비교 표
- `kfp-option-compare` — 옵션 포함 총비용 비교
- `kfp-reversal-card` — LCC/FSC 역전 구간 카드
- `kfp-airport-table` — 공항별 출발 비용 표
- `kfp-cta-grid` — 내부 링크 CTA

### 8-3. Astro 페이지 구성 방식

- `.astro`에서 Hero, InfoNotice, 정적 본문, FAQ, CTA 마크업 처리
- `<script type="application/json" id="kfp-data">` 로 데이터 전달
- `public/scripts/korea-flight-price-comparison-2026.js`에서 탭 전환과 표/하이라이트 갱신
- Chart.js가 이미 프로젝트 패턴으로 쓰이므로 예약 시점 그래프는 Chart.js 라인 차트 사용
- 히트맵은 canvas보다 HTML grid가 모바일 대응과 접근성에 유리

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태

```ts
type RegionId =
  | "japan"
  | "southeastAsia"
  | "chinaTaiwan"
  | "europe"
  | "americas"
  | "oceania";

type BookingWindow = "d90" | "d60" | "d45" | "d30" | "d14" | "d7" | "d3" | "d0";
type CarrierMode = "base" | "total";

type PageState = {
  region: RegionId;
  bookingWindow: BookingWindow;
  carrierMode: CarrierMode;
};
```

### 9-2. 초기값

- `region = "japan"`
- `bookingWindow = "d60"`
- `carrierMode = "total"`

### 9-3. 동작 규칙

- 권역 탭 전환 시
  - 노선 표 갱신
  - 대표 노선 카드 갱신
  - 권역별 코멘트 갱신
- 예약 시점 탭 전환 시
  - 가격 지수 하이라이트 갱신
  - 선택 시점 설명 문구 갱신
- 기본가/총비용 토글 전환 시
  - 항공사 비교 표의 금액 컬럼 갱신
- 상태 변경 시 URL 파라미터 동기화

---

## 10. 데이터 파일 설계 (`src/data/koreaFlightPriceComparison2026.ts`)

### 10-1. 타입 정의

```ts
export type RegionId =
  | "japan"
  | "southeastAsia"
  | "chinaTaiwan"
  | "europe"
  | "americas"
  | "oceania";

export type PriceSeason = "offseason" | "regular" | "peak" | "superPeak";
export type CarrierType = "fsc" | "lcc" | "foreignTransfer";
export type BookingWindow = "d90" | "d60" | "d45" | "d30" | "d14" | "d7" | "d3" | "d0";

export interface PriceRange {
  min: number; // KRW, 성인 1인 왕복
  max: number; // KRW, 성인 1인 왕복
  isEstimate: true;
}

export interface RoutePrice {
  id: string;
  region: RegionId;
  origin: "ICN" | "GMP" | "PUS" | "TAE" | "CJJ";
  destination: string;
  destinationKo: string;
  countryKo: string;
  flightHours: number;
  prices: Record<PriceSeason, PriceRange>;
  priceFeel: "낮음" | "중간" | "높음" | "매우 높음";
  note: string;
}

export interface CarrierComparison {
  routeId: string;
  carrierType: CarrierType;
  label: string;
  baseFare: number; // KRW, 성인 1인 왕복
  baggage: number;
  seatSelection: number;
  meal: number;
  total: number;
  verdict: string;
}

export interface BookingIndexPoint {
  window: BookingWindow;
  label: string;
  shortHaulIndex: number;
  midHaulIndex: number;
  longHaulIndex: number;
  comment: string;
}

export interface MonthlyHeatmapRow {
  region: RegionId;
  label: string;
  monthlyIndex: number[]; // 1월~12월, 100 = 보통
  summary: string;
}

export interface OptionScenario {
  id: string;
  title: string;
  routeId: string;
  partyLabel: string;
  baseFare: number;
  baggage: number;
  seatSelection: number;
  meal: number;
  airportTransfer: number;
  insurance: number;
  total: number;
  message: string;
}

export interface AirportComparison {
  airport: string;
  airportKo: string;
  bestFor: string;
  flightPriceNote: string;
  accessCost: string;
  risk: string;
}
```

### 10-2. 메인 export 구조

```ts
export const KFP_META = {
  slug: "korea-flight-price-comparison-2026",
  title: "2026 한국인 해외여행 항공권 가격 완전 비교",
  updatedAt: "2026-04",
  baseCurrency: "KRW",
  baseCondition: "성인 1인, 왕복, 일반석, 한국 출발 기준",
  estimateNote: "실시간 견적이 아닌 비교 목적 추정 범위값입니다.",
};

export const REGION_LABELS: Record<RegionId, string> = {
  japan: "일본",
  southeastAsia: "동남아",
  chinaTaiwan: "중국·중화권",
  europe: "유럽",
  americas: "미주",
  oceania: "오세아니아",
};

export const ROUTE_PRICES: RoutePrice[] = [];
export const CARRIER_COMPARISONS: CarrierComparison[] = [];
export const BOOKING_INDEX: BookingIndexPoint[] = [];
export const MONTHLY_HEATMAP: MonthlyHeatmapRow[] = [];
export const OPTION_SCENARIOS: OptionScenario[] = [];
export const AIRPORT_COMPARISONS: AirportComparison[] = [];
export const FAQ_ITEMS: { q: string; a: string }[] = [];
```

### 10-3. 대표 노선 초안

> 구현 시작용 추정 범위입니다. 최종 구현 전 검색 기준일을 정하고 공개 자료/실제 조회값으로 보정하세요.
> 금액은 성인 1인 왕복 KRW 기준입니다.

| 권역 | 노선 | 비수기 | 일반 | 성수기 | 극성수기 |
|------|------|--------|------|--------|----------|
| 일본 | 인천-오사카 | 20~35만 | 35~55만 | 50~75만 | 75만+ |
| 일본 | 인천-도쿄 | 25~40만 | 40~65만 | 60~90만 | 90만+ |
| 일본 | 인천-후쿠오카 | 18~32만 | 30~50만 | 45~70만 | 70만+ |
| 동남아 | 인천-방콕 | 28~45만 | 45~70만 | 70~100만 | 100만+ |
| 동남아 | 인천-다낭 | 24~42만 | 40~65만 | 65~95만 | 95만+ |
| 동남아 | 인천-세부 | 25~45만 | 42~70만 | 70~100만 | 100만+ |
| 동남아 | 인천-싱가포르 | 35~60만 | 55~90만 | 85~130만 | 130만+ |
| 중국·중화권 | 인천-상하이 | 25~45만 | 40~65만 | 60~90만 | 90만+ |
| 중국·중화권 | 인천-타이베이 | 22~38만 | 35~60만 | 55~85만 | 85만+ |
| 중국·중화권 | 인천-홍콩 | 28~50만 | 45~75만 | 70~105만 | 105만+ |
| 유럽 | 인천-파리 | 80~130만 | 120~180만 | 180~250만 | 250만+ |
| 유럽 | 인천-런던 | 85~140만 | 130~190만 | 190~270만 | 270만+ |
| 유럽 | 인천-로마 | 80~135만 | 125~185만 | 185~260만 | 260만+ |
| 유럽 | 인천-바르셀로나 | 85~140만 | 130~195만 | 190~270만 | 270만+ |
| 미주 | 인천-LA | 90~140만 | 130~200만 | 190~280만 | 280만+ |
| 미주 | 인천-뉴욕 | 100~160만 | 150~230만 | 220~320만 | 320만+ |
| 미주 | 인천-밴쿠버 | 85~135만 | 125~190만 | 180~260만 | 260만+ |
| 오세아니아 | 인천-시드니 | 85~140만 | 130~200만 | 190~280만 | 280만+ |
| 오세아니아 | 인천-멜버른 | 90~150만 | 140~210만 | 200~300만 | 300만+ |
| 오세아니아 | 인천-오클랜드 | 95~160만 | 150~230만 | 220~320만 | 320만+ |

### 10-4. 예약 시점별 가격 지수 초안

기준: 출발 60일 전 = 100

| 시점 | 단거리 | 중거리 | 장거리 | 코멘트 |
|------|-------:|-------:|-------:|--------|
| 90일 전 | 96 | 94 | 92 | 장거리 조기 예약 우위 |
| 60일 전 | 100 | 100 | 100 | 기준값 |
| 45일 전 | 103 | 105 | 108 | 국제선 저가 구간 마감 시작 |
| 30일 전 | 108 | 112 | 118 | 인기 날짜는 상승 구간 |
| 14일 전 | 118 | 126 | 135 | 선택 가능한 저가 운임 감소 |
| 7일 전 | 130 | 142 | 155 | 막판 특가는 예외적 |
| 3일 전 | 145 | 160 | 175 | 일정 유연성 없으면 불리 |
| 당일 | 160 | 180 | 200 | 업무/긴급 수요 운임 중심 |

### 10-5. 월별 히트맵 지수 초안

기준: 100 = 보통, 120 이상 = 높음, 140 이상 = 매우 높음

| 권역 | 1월 | 2월 | 3월 | 4월 | 5월 | 6월 | 7월 | 8월 | 9월 | 10월 | 11월 | 12월 |
|------|---:|---:|---:|---:|---:|---:|---:|---:|---:|----:|----:|----:|
| 일본 | 130 | 115 | 125 | 140 | 110 | 95 | 125 | 135 | 105 | 120 | 110 | 145 |
| 동남아 | 135 | 120 | 100 | 95 | 90 | 100 | 125 | 130 | 95 | 105 | 115 | 150 |
| 중국·중화권 | 125 | 120 | 100 | 105 | 110 | 95 | 115 | 125 | 105 | 120 | 100 | 135 |
| 유럽 | 90 | 85 | 95 | 110 | 120 | 140 | 155 | 150 | 125 | 110 | 90 | 130 |
| 미주 | 120 | 95 | 100 | 110 | 120 | 145 | 155 | 145 | 115 | 105 | 120 | 150 |
| 오세아니아 | 150 | 135 | 115 | 105 | 95 | 90 | 100 | 105 | 110 | 120 | 130 | 155 |

### 10-6. 옵션 포함 총비용 시나리오 초안

| 시나리오 | 기준 | 기본 운임 | 옵션 | 최종 메시지 |
|----------|------|----------:|------|-------------|
| 오사카 단기 | 2인, 3박4일, LCC, 기내용만 | 70만 | 좌석 3만 + 공항 이동 6만 | LCC 우위 유지 |
| 방콕 휴가 | 2인, 4박5일, 위탁수하물 1개 | 110만 | 수하물 12만 + 좌석 4만 + 보험 4만 | FSC와 격차 축소 |
| 파리 장거리 | 1인, 7박9일, 수하물 23kg | 150만 | 좌석 5만 + 보험 3만 + 공항 이동 5만 | 경유/FSC 조건 비교 필수 |

### 10-7. FAQ 초안

1. 2026년 항공권은 언제 사는 게 가장 저렴한가요?
2. 일본 항공권은 몇 월이 가장 비싼가요?
3. 동남아 항공권은 LCC가 항상 더 싼가요?
4. 유럽 왕복 항공권은 얼마를 예산으로 잡아야 하나요?
5. 위탁수하물을 추가하면 LCC와 FSC 차이가 얼마나 줄어드나요?
6. 김포 출발과 인천 출발 중 어느 쪽이 유리한가요?
7. 지방공항 출발은 항공권이 싸도 실제 총비용이 낮은가요?
8. 항공권 가격 비교 시 세금과 유류할증료는 포함해야 하나요?
9. 항공권 할인 카드나 마일리지는 어떻게 반영해야 하나요?
10. 이 페이지의 가격은 실시간 최저가인가요?

---

## 11. JavaScript 설계 (`public/scripts/korea-flight-price-comparison-2026.js`)

### 11-1. 전체 구조

```js
import { buildDefaultOptions } from "./chart-config.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let state = {
  region: "japan",
  bookingWindow: "d60",
  carrierMode: "total",
};

let bookingChart = null;

function readData() {
  const el = document.getElementById("kfp-data");
  if (!el) return null;
  return JSON.parse(el.textContent || "{}");
}

function setState(nextState) {
  state = { ...state, ...nextState };
  render();
  updateURL();
}

function render() {
  renderRegionTabs();
  renderRouteTable();
  renderRouteHighlights();
  renderBookingWindow();
  renderCarrierTable();
  renderBookingChart();
}

document.addEventListener("DOMContentLoaded", init);
```

### 11-2. 주요 함수 목록

| 함수 | 역할 |
|------|------|
| `readData()` | JSON 데이터 파싱 |
| `restoreFromURL()` | URL 파라미터에서 상태 복원 |
| `updateURL()` | `region`, `window`, `mode` 파라미터 갱신 |
| `bindEvents()` | 권역 탭, 예약 시점 탭, 기본가/총비용 토글 이벤트 연결 |
| `renderRegionTabs()` | 현재 권역 활성 상태 표시 |
| `renderRouteTable()` | 선택 권역 노선 가격표 갱신 |
| `renderRouteHighlights()` | 최저/변동폭/옵션주의 노선 카드 갱신 |
| `renderBookingWindow()` | 선택 예약 시점 코멘트 갱신 |
| `renderCarrierTable()` | 기본가/총비용 모드에 따른 항공사 비교 표 갱신 |
| `renderBookingChart()` | 예약 시점별 가격 지수 라인 차트 갱신 |
| `formatKRWRange()` | 원 단위 범위값을 `20만~35만원` 형식으로 변환 |

### 11-3. 방어 로직

- JSON 파싱 실패 시 정적 표만 유지하고 콘솔 경고만 출력
- URL 파라미터가 허용값이 아니면 기본값 사용
- Chart.js가 없으면 그래프 영역에 정적 표 유지
- 탭 버튼은 `aria-selected`, `tabindex`를 갱신한다
- 금액이 `null`이면 `조사 필요`로 표시하고 계산에서 제외한다

---

## 12. SCSS 설계 (`_korea-flight-price-comparison-2026.scss`)

prefix: `kfp-`

```scss
.kfp-market-board {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.kfp-route-tabs,
.kfp-booking-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.kfp-tab {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-chip);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;

  &.is-active,
  &[aria-selected="true"] {
    border-color: var(--color-brand-primary);
    background: var(--color-brand-primary);
    color: #fff;
  }
}

.kfp-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: #fff;
}

.kfp-route-table,
.kfp-carrier-table,
.kfp-airport-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
  }

  th {
    background: var(--color-surface);
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  td[data-align="right"] {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

.kfp-heatmap {
  display: grid;
  gap: 8px;
}

.kfp-heatmap-row {
  display: grid;
  grid-template-columns: 92px repeat(12, minmax(42px, 1fr));
  gap: 4px;
  align-items: stretch;

  @media (max-width: 720px) {
    grid-template-columns: 84px repeat(12, 42px);
    overflow-x: auto;
  }
}

.kfp-heatmap-cell {
  min-height: 36px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 0.78rem;
  font-weight: 700;

  &--low { background: #dcfce7; color: #166534; }
  &--mid { background: #fef9c3; color: #854d0e; }
  &--high { background: #fed7aa; color: #9a3412; }
  &--very-high { background: #fee2e2; color: #991b1b; }
}

.kfp-option-compare {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
}

.kfp-reversal-card,
.kfp-route-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: #fff;
  padding: 16px;
}

.kfp-chart-shell {
  min-height: 280px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 16px;
  background: #fff;
}

.kfp-footnote {
  margin-top: 8px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
```

---

## 13. `reports.ts` 등록

```ts
{
  slug: "korea-flight-price-comparison-2026",
  title: "2026 한국인 해외여행 항공권 가격 완전 비교",
  description: "한국 출발 주요 해외 항공권을 노선별·항공사별·예약 시점별·옵션 포함 총비용 기준으로 비교합니다.",
  category: "여행",
  tags: ["항공권", "해외여행", "여행비", "2026"],
  eyebrow: "항공권 가격 리포트",
  isNew: true,
}
```

프로젝트의 실제 `reports.ts` 타입과 필드명에 맞춰 조정한다.

---

## 14. `sitemap.xml` 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/korea-flight-price-comparison-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 15. SEO / 카피 가이드

### 15-1. 메타 초안

- `title`: `2026 항공권 가격 비교 | 한국 출발 노선별·항공사별 왕복 실비 총정리`
- `description`: `2026년 한국 출발 해외 항공권 가격을 일본·동남아·중국·유럽·미주·오세아니아 기준으로 비교했습니다. 항공사별 왕복 평균가, 성수기/비수기, 예약 시점별 가격 변화, 수하물 포함 총비용까지 확인하세요.`

### 15-2. H1 / H2 구성

- H1: `2026 한국인 해외여행 항공권 가격 완전 비교`
- H2 목록
  - `2026 항공권 가격 비교 기준`
  - `한국 출발 주요 노선별 왕복 항공권 가격`
  - `대한항공·아시아나·LCC 가격 차이 비교`
  - `성수기·비수기 월별 항공권 가격 히트맵`
  - `항공권은 언제 사는 게 가장 쌀까`
  - `수하물·좌석·식사 포함 실제 총비용 비교`
  - `LCC가 더 비싸지는 구간`
  - `인천·김포·지방공항 출발 비용 차이`
  - `2026 하반기 항공권 가격 전망`

### 15-3. 카피 원칙

- `최저가 보장`, `무조건`, `확정` 표현 금지
- `평균가`를 쓸 때는 반드시 기준 조건을 붙인다
- 추정 가격에는 `추정`, `참고`, `범위값` 표현을 같이 쓴다
- 실시간 구매 유도보다 계산기/비교 리포트 내부 링크 전환을 우선한다

---

## 16. 구현 순서

1. `src/data/koreaFlightPriceComparison2026.ts` 작성
2. `src/pages/reports/korea-flight-price-comparison-2026.astro` 작성
3. `public/scripts/korea-flight-price-comparison-2026.js` 작성
4. `src/styles/scss/pages/_korea-flight-price-comparison-2026.scss` 작성
5. `src/styles/app.scss`에 `@use` 추가
6. `src/data/reports.ts`에 리포트 등록
7. `public/sitemap.xml`에 URL 추가
8. OG 이미지 생성 또는 플레이스홀더 추가
9. `npm run build` 실행
10. 모바일 375px / 태블릿 768px / 데스크톱 1280px 레이아웃 점검

---

## 17. QA 체크리스트

### 17-1. 콘텐츠 QA

- [ ] 가격이 단일 확정값이 아니라 범위값 또는 지수로 표시되는가
- [ ] 모든 추정 가격에 `추정` 또는 `참고` 라벨이 있는가
- [ ] `성인 1인 왕복 일반석`과 `2인 옵션 포함 총비용` 기준이 혼동되지 않는가
- [ ] 수하물 포함/미포함 여부가 표마다 명시되는가
- [ ] 검색 기준일과 조건이 InfoNotice와 표 하단에 반복 노출되는가

### 17-2. 데이터 QA

- [ ] `ROUTE_PRICES`의 권역별 노선 수가 탭 UI와 일치하는가
- [ ] 가격 범위에서 `min <= max`가 보장되는가
- [ ] `BOOKING_INDEX`가 모든 예약 시점 8개를 포함하는가
- [ ] `MONTHLY_HEATMAP`이 각 권역당 12개월 값을 모두 포함하는가
- [ ] 옵션 시나리오의 `total`이 항목 합계와 일치하는가

### 17-3. UI QA

- [ ] 모바일 375px에서 노선 표가 가로 스크롤로 읽히는가
- [ ] 권역 탭 전환 시 표와 하이라이트 카드가 같이 바뀌는가
- [ ] 예약 시점 탭 전환 시 코멘트가 바뀌는가
- [ ] Chart.js 미로드 시에도 본문이 깨지지 않는가
- [ ] 히트맵 색상만으로 의미를 전달하지 않고 숫자/라벨도 함께 보이는가

### 17-4. SEO QA

- [ ] H1이 1개만 존재하는가
- [ ] 메타 title/description이 기획 문서 SEO 세트와 일치하는가
- [ ] FAQ가 8개 이상 포함되는가
- [ ] `/tools/flight-cheapest-timing-calculator/`와 `/tools/overseas-travel-cost/` 내부 링크가 포함되는가
- [ ] `public/sitemap.xml`에 URL이 추가되는가

---

## 18. 최종 구현 메모

- 이 리포트는 항공권 `가격표`가 아니라 `의사결정 프레임`이어야 한다.
- 상단에서 노선별 가격대를 빠르게 보여주되, 중반 이후에는 예약 시점·옵션·공항 이동비까지 포함한 총비용 관점으로 전환한다.
- 실시간 항공권 데이터가 아니므로 숫자 신뢰성은 `기준 명시`, `범위값`, `추정 라벨`, `표 하단 주석`으로 확보한다.
- 1차 구현은 권역별 비교와 옵션 총비용 역전 구간 완성도를 우선하고, v2에서 도시별 상세 리포트나 날짜별 캘린더형 비교로 확장한다.
