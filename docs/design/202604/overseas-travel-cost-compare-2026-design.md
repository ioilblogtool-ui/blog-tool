# 일본·동남아·유럽 여행 실비용 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/overseas-travel-cost-compare-2026.md`
> 작성일: 2026-04-15
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `bitcoin-gold-sp500-10year-comparison-2026`, `salary-asset-2016-vs-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/overseas-travel-cost-compare-2026.md`
- 구현 대상: `일본·동남아·유럽 여행 실비용 비교 2026`
- 콘텐츠 유형: 데이터 리포트 + 스타일별 총예산 시뮬레이션 (`/reports/` 계열)

### 1-2. 페이지 성격

- **8개 도시 비교 리포트**: 도쿄·오사카·방콕·하노이·마닐라·파리·로마·바르셀로나를 동일 기준으로 비교
- **핵심 차별점**: 항공권만이 아니라 숙박·식비·교통·관광·수하물·환율·보험까지 묶어 "2인 기준 실비용"으로 제시
- **핵심 메시지**: 어디가 싸냐가 아니라 **같은 2인 여행이라도 비용 구조가 어떻게 다른지**를 보여준다
- 인터랙션: 여행 스타일(배낭형/스탠다드형/프리미엄형)·기간(2박3일/4박5일/7박8일) 탭으로 총예산 표 갱신

### 1-3. 권장 slug

- `overseas-travel-cost-compare-2026`
- URL: `/reports/overseas-travel-cost-compare-2026/`

### 1-4. 권장 파일 구조

```txt
src/
  data/
    overseasTravelCostCompare2026.ts
  pages/
    reports/
      overseas-travel-cost-compare-2026.astro

public/
  scripts/
    overseas-travel-cost-compare-2026.js
  og/
    reports/
      overseas-travel-cost-compare-2026.png

src/styles/scss/pages/
  _overseas-travel-cost-compare-2026.scss
```

### 1-5. 전제

- 실시간 항공/환율 API 미사용. **2026년 4월 기준 조사 스냅샷 고정 데이터**로 구현한다.
- 가격은 "범위값" 또는 "대표 중앙값"으로 표시한다. 단일 고정값은 절대 사용 않는다.
- 모든 금액은 **KRW(원화) 환산 기준**으로 통일한다. 환율 기준일을 데이터 파일과 표 하단에 명시한다.
- 배낭형/스탠다드형/프리미엄형 총예산은 `추정` 라벨을 붙이며 정확한 견적이 아님을 명시한다.

---

## 2. 현재 프로젝트 리포트 구조 정리

### 2-1. `/reports/` 공통 구조

1. `CalculatorHero`
2. `InfoNotice`
3. 조사 개요 보드
4. 항목별 비교 표/카드
5. 핵심 인터랙션 시뮬레이션 (탭 기반 총예산)
6. 권역별 총평 & 절약 팁
7. 관련 계산기 CTA
8. `SeoContent` + FAQ

### 2-2. 이번 리포트가 따라야 할 방향

- `bitcoin-gold-sp500-10year-comparison-2026`에서 가져올 것
  - 탭 기반 인터랙션으로 도시별 데이터 전환
  - `script[type="application/json"]` 데이터 주입 패턴
- `salary-asset-2016-vs-2026`에서 가져올 것
  - 비교 보드 카드 레이아웃
  - 기준 안내를 `InfoNotice`에서 먼저 고정

---

## 3. 구현 범위

### 3-1. MVP (v1) 포함

- 8개 도시 고정 데이터
- 비교 항목 10종 (항공/수하물/숙박/식비/교통/관광/통신/보험/환전/도시세)
- **4박5일 기준 총예산** 중심 (2박3일·7박8일은 보조)
- 3개 여행 스타일별 총예산 탭
- 권역별 총평 카드 3개
- FAQ 8개 이상
- 절약 팁 5개

### 3-2. MVP 제외

- 실시간 시세 조회
- 사용자 직접 입력 계산기 (별도 계산기 페이지로 CTA 연결)
- 2박3일·7박8일 상세 시뮬레이션 (데이터만 준비, 탭 UI는 v2)
- 도시별 서브 리포트 분기
- 독자 실지출 설문
- 환율 변동 슬라이더

---

## 4. 페이지 목적

- 사용자가 `어느 도시가 총예산이 적게 드는가`를 여행 스타일별로 빠르게 판단하게 한다.
- 항공·숙박·식비뿐 아니라 **수하물·환율·보험·관광 입장료**까지 포함한 "실비용" 관점을 제공한다.
- 리포트에서 끝나지 않고 여행 예산 계산기·환율 계산기·여행자보험 비교로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 여행지 결정형 사용자

- `일본 동남아 유럽 여행비 비교`, `2박3일 방콕 비용`, `파리 여행 2인 예산` 등 검색으로 유입
- 총예산 표에서 도시별 대략적 금액을 먼저 훑는다
- 희망 스타일 탭 선택 후 자신의 예산과 비교한다

### 5-2. 예산 확인형 사용자

- `유럽 여행 항공권 얼마`, `방콕 숙박비`, `도쿄 입장료` 검색으로 유입
- 항목별 비교 표를 섹션별로 읽는다
- 절약 팁 → 관련 계산기 CTA로 이동한다

### 5-3. 이미 목적지가 정해진 사용자

- 특정 도시 섹션과 FAQ를 집중 탐색한다
- 숨은 비용(수하물·도시세·환전수수료) 섹션이 핵심 정보가 된다

---

## 6. 입력값 / 출력값 정의

### 6-1. 인터랙션 입력 (탭)

| 입력 | 기본값 | 선택지 |
|------|--------|--------|
| `travelStyle` | `standard` | `budget`, `standard`, `premium` |
| `duration` | `4n5d` | `2n3d`, `4n5d`, `7n8d` |

### 6-2. 출력값

- 선택 스타일×기간 기준 8개 도시 총예산 비교 표
- 도시별 항목별 금액 분해 (항공/숙박/식비/교통/관광/기타)
- 권역 내 가성비 코멘트 카드

### 6-3. URL 파라미터 (선택 구현)

```txt
/reports/overseas-travel-cost-compare-2026/?style=standard&duration=4n5d
```

---

## 7. 섹션 구조

### 7-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice` — 기준 안내
3. 조사 개요 보드
4. 항공권 & 수하물 비교 섹션
5. 숙박 & 체류비 비교 섹션
6. 식비 & 관광 비교 섹션
7. 현지교통·통신·보험 비교 섹션
8. 환율 & 결제 전략 카드
9. **여행 스타일별 총예산 시뮬레이션** (메인 인터랙션)
10. 권역별 총평 카드
11. 절약 팁
12. 관련 계산기 / 리포트 CTA
13. `SeoContent` + FAQ

### 7-2. 모바일 우선 순서

- Hero → 기준 안내 → 조사 개요 → 항공 → 숙박 → 식비·관광 → 교통·통신·보험 → 환율·결제 → **총예산 시뮬레이션** → 총평 → 절약 팁 → CTA → SEO

### 7-3. PC 레이아웃

- 비교 표는 세로 배치 단일 컬럼 (표 가로 스크롤)
- 총예산 시뮬레이션: `좌: 스타일/기간 탭 + 표 / 우: 도시별 하이라이트 카드` 2열
- 권역별 총평 카드: 3열 (일본/동남아/유럽)
- 절약 팁 + CTA: 하단 단일 컬럼

### 7-4. 섹션별 역할

#### Hero

- eyebrow: `여행 비용 리포트`
- H1: `일본·동남아·유럽 여행 실비용 비교 2026`
- 설명: 도쿄·오사카·방콕·하노이·마닐라·파리·로마·바르셀로나 8개 도시를 기준으로 항공권부터 환율·보험까지 2인 총비용을 한눈에 비교합니다.

#### InfoNotice

- 필수 문구
  - 이 리포트는 2026년 4월 기준 공개 시세와 참고 자료를 바탕으로 구성한 비교 목적 자료입니다.
  - 항공권·환율·숙박비는 조회 시점과 여행 날짜에 따라 크게 달라질 수 있습니다.
  - 모든 금액은 성인 2인 기준 원화 환산 추정값입니다.
  - 환율 기준: 2026년 4월 기준 (JPY 8.9원, THB 39원, VND 0.055원, PHP 24원, EUR 1,460원)

#### 조사 개요 보드

- 대상 도시 8곳 + 권역 구분
- 기준 인원: 성인 2명
- 조사 기간 단위: 2박3일 / 4박5일 / 7박8일
- 예산 유형: 배낭형 / 스탠다드형 / 프리미엄형

#### 항공권 & 수하물 비교

- 비수기·일반·성수기 왕복 항공권 범위 표 (2인 합산, 원화)
- FSC/LCC 구분 코멘트
- 수하물 포함/미포함 주의 사항

#### 숙박 & 체류비 비교

- 1박 기준 3개 등급 비교 (2인 1실 기준, KRW)
- 도시세/숙박세 유무

#### 식비 & 관광 비교

- 저가 식당 1끼 (1인), 중급 2인 식사, 커피/간식 (1인)
- 대표 관광지 입장료 TOP3~5 (1인 기준, KRW 환산)

#### 현지교통·통신·보험

- 시내 대중교통 1일 평균 (1인)
- 공항 이동 편도 (1인)
- eSIM/유심 3일/5일/8일 패키지 (1인)
- 여행자보험 2인 합산 평균 (전 기간)

#### 환율 & 결제 전략

- 현금 환전 vs 카드 결제 vs ATM 인출 비교 카드
- KRW 기준 5% 환율 변동 시 총예산 영향 예시

#### 여행 스타일별 총예산 시뮬레이션

- 스타일 탭 3개 × 기간 탭 3개
- 기본값: 스탠다드형 × 4박5일
- 출력: 8개 도시 총예산 비교 표 + 최저/최고 도시 하이라이트
- 표 컬럼: 도시 / 항공 / 숙박 / 식비 / 교통+관광 / 통신+보험 / 합계

#### 권역별 총평 카드

- 일본 / 동남아 / 유럽 각 1개 카드
- 강점·주의점·추천 여행 스타일 요약

#### 절약 팁

- 5개 항목 (번호형 리스트)

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `content-section`, `section-header`, `panel`, `report-stat-card`

### 8-2. 페이지 전용 CSS 클래스 명명

- `travel-overview-board` — 조사 개요
- `travel-city-badge` — 도시 아이콘 + 권역 태그
- `travel-flight-table` — 항공권 비교 표
- `travel-stay-table` — 숙박 비교 표
- `travel-food-table` — 식비·관광 비교 표
- `travel-misc-table` — 교통·통신·보험 비교 표
- `travel-fx-card` — 환율·결제 전략 카드
- `travel-budget-sim` — 총예산 시뮬레이션 박스
  - `travel-budget-sim__style-tabs` — 여행 스타일 탭
  - `travel-budget-sim__duration-tabs` — 기간 탭
  - `travel-budget-sim__table` — 결과 표
  - `travel-budget-sim__highlight` — 최저/최고 하이라이트
- `travel-region-card` — 권역별 총평 카드
- `travel-tips-list` — 절약 팁 리스트

### 8-3. Astro 페이지 구성 방식

- `.astro`에서 Hero 카피, InfoNotice, FAQ, 정적 비교 표(항공/숙박/식비/교통) 마크업 처리
- `<script type="application/json" id="travel-data">` 로 총예산 시뮬레이션 데이터 전달
- `public/scripts/overseas-travel-cost-compare-2026.js`에서
  - 여행 스타일·기간 탭 전환 및 표 갱신
  - URL 파라미터 동기화 (`style`, `duration`)
- 1차 구현은 하위 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태

```ts
type TravelStyle = "budget" | "standard" | "premium";
type Duration = "2n3d" | "4n5d" | "7n8d";

type SimState = {
  style: TravelStyle;
  duration: Duration;
};
```

### 9-2. 초기값

- `style = "standard"`
- `duration = "4n5d"`

### 9-3. 동작 규칙

- 탭 전환 시
  - 활성 탭 UI 갱신
  - `travel-budget-sim__table` 내용 갱신
  - 하이라이트 카드 갱신 (최저/최고 도시)
- URL 파라미터 동기화
  - `style`, `duration`

---

## 10. 계산 로직

### 10-1. 총예산 산출 방식

```ts
// 2인 합산, KRW
total = flight2p + luggage2p + accommodation2p + food2p + transport2p
        + attractions2p + sim2p + insurance2p + misc2p;
```

- `flight2p`: 해당 스타일 왕복 항공권 대표값 × 2인
- `luggage2p`: 스타일별 수하물 추가 비용 (배낭형 LCC는 별도 계산)
- `accommodation2p`: 1박 기준 × nights (2인 1실 기준)
- `food2p`: (저가/중급 식당 일평균 2인) × days
- `transport2p`: (시내교통 1일 + 공항이동 왕복) × 2인 × days 보정
- `attractions2p`: 주요 관광지 2~3개 합산 × 2인
- `sim2p`: 해당 기간 eSIM × 2인
- `insurance2p`: 여행자보험 2인 합산
- `misc2p`: 도시세 등 기타 (0이면 생략)

### 10-2. 스타일별 적용 기준

| 항목 | 배낭형 | 스탠다드형 | 프리미엄형 |
|------|--------|-----------|-----------|
| 항공 | 비수기 최저가 중앙값 | 일반 시즌 중앙값 | 일반 시즌 상단값 |
| 수하물 | LCC 추가 비용 포함 | FSC 무료 기준 | FSC 무료 기준 |
| 숙박 | 호스텔 중앙값 | 2~3성급 중앙값 | 4성급 중앙값 |
| 식비 | 저가 식당 위주 | 저가+중급 혼합 | 중급 위주 |
| 관광 | 무료 명소 위주, 유료 1개 | 유료 명소 2개 | 유료 명소 3개 |

### 10-3. 기간별 적용 기준

| 항목 | 2박3일 | 4박5일 | 7박8일 |
|------|--------|--------|--------|
| nights | 2 | 4 | 7 |
| days | 3 | 5 | 8 |
| 항공 동일 | O | O | O |
| 숙박 ×nights | O | O | O |
| 식비 ×days | O | O | O |
| 통신 패키지 | 3일권 | 5일권 | 8일권 |

---

## 11. 데이터 파일 구조 (`src/data/overseasTravelCostCompare2026.ts`)

### 11-1. 타입 정의

```ts
export type RegionId = "japan" | "southeast-asia" | "europe";
export type CityId =
  | "tokyo" | "osaka"
  | "bangkok" | "hanoi" | "manila"
  | "paris" | "rome" | "barcelona";
export type TravelStyle = "budget" | "standard" | "premium";
export type DurationKey = "2n3d" | "4n5d" | "7n8d";

export interface FlightData {
  offseason: { min: number; max: number };   // 2인 합산 KRW
  regular:   { min: number; max: number };
  peak:      { min: number; max: number };
  luggageNote: string;
  luggageExtra: number;  // 배낭형 LCC 추가 수하물 2인 추정, KRW
}

export interface AccommodationData {
  hostel:   number;  // 1박 2인 1실 중앙값, KRW
  standard: number;
  premium:  number;
  taxNote:  string;  // 도시세/숙박세 여부
  taxPerNightPer: number;  // 1인 1박 기준 KRW (0이면 없음)
}

export interface FoodData {
  cheapMealPer:  number;  // 저가 식당 1끼 1인, KRW
  midMeal2p:     number;  // 중급 2인 식사 합산, KRW
  coffeePer:     number;  // 커피/음료 1인, KRW
}

export interface TransportData {
  dailyPerPerson:     number;  // 시내 대중교통 1일 평균 1인, KRW
  airportTransferPer: number;  // 공항 이동 편도 1인, KRW
}

export interface AttractionItem {
  name:     string;
  pricePer: number;  // 1인, KRW
  official: boolean;
}

export interface SimData {
  threeDayPer: number;  // eSIM/유심 3일 패키지 1인, KRW
  fiveDayPer:  number;
  eightDayPer: number;
}

export interface CityData {
  id:             CityId;
  region:         RegionId;
  label:          string;       // 한국어 도시명
  country:        string;
  currency:       string;
  exchangeRate:   number;       // 1원 = n 현지통화 기준으로 표시 or 1현지통화 = nKRW
  exchangeRateLabel: string;    // 예: "JPY 100 = 약 890원"
  flightHours:    number;       // 비행 시간 (참고용)
  flight:         FlightData;
  accommodation:  AccommodationData;
  food:           FoodData;
  transport:      TransportData;
  attractions:    AttractionItem[];
  sim:            SimData;
  insuranceAvg2p: number;       // 여행자보험 2인 합산 전기간 추정, KRW (4박5일 기준)
  summary:        string;       // 한 줄 코멘트
}

export interface TotalBudgetRow {
  cityId:        CityId;
  flight:        number;
  luggage:       number;
  accommodation: number;
  food:          number;
  transport:     number;
  attractions:   number;
  sim:           number;
  insurance:     number;
  misc:          number;
  total:         number;
}

export type BudgetMatrix = {
  [S in TravelStyle]: {
    [D in DurationKey]: TotalBudgetRow[];
  };
};
```

### 11-2. 메인 export 구조

```ts
export const TRAVEL_REPORT_META = {
  slug:          "overseas-travel-cost-compare-2026",
  title:         "일본·동남아·유럽 여행 실비용 비교 2026",
  updatedAt:     "2026-04",
  baseCurrency:  "KRW",
  exchangeBaseDate: "2026-04",
  persons:       2,
  rateNote:      "JPY 100=890원, THB 1=39원, VND 10000=55원, PHP 1=24원, EUR 1=1460원 기준 (추정)",
};

export const CITIES: CityData[] = [/* 8개 도시 */];

export const BUDGET_MATRIX: BudgetMatrix = {/* 3스타일 × 3기간 × 8도시 */};

export const REGION_SUMMARY = {
  japan: { title: "일본", pros: "...", cons: "...", recommend: "..." },
  "southeast-asia": { title: "동남아", pros: "...", cons: "...", recommend: "..." },
  europe: { title: "유럽", pros: "...", cons: "...", recommend: "..." },
};

export const SAVING_TIPS: string[] = [/* 5개 */];

export const FAQ_ITEMS: { q: string; a: string }[] = [/* 8개 이상 */];

export const RELATED_LINKS = [
  { label: "환율 계산기", href: "/tools/exchange-rate/" },
  { label: "여행 예산 계산기", href: "/tools/travel-budget/" },
];
```

### 11-3. 도시별 대표 데이터 초안 (2026년 4월 기준 추정값)

> 아래는 구현 시작점을 위한 추정 중앙값입니다. 공식 사이트 및 실시간 시세 확인 후 보정 권장.
> **모든 금액은 2인 합산 KRW (만원 단위 반올림)**

#### 항공권 (왕복, 2인 합산)

| 도시 | 비수기 | 일반 | 성수기 | 수하물 LCC 추가 |
|------|--------|------|--------|---------------|
| 도쿄 | 60~100만 | 80~140만 | 140만+ | 2인 약 4만 |
| 오사카 | 56~100만 | 76~130만 | 130만+ | 2인 약 4만 |
| 방콕 | 70~120만 | 90~160만 | 160만+ | 2인 약 6만 |
| 하노이 | 60~110만 | 80~150만 | 150만+ | 2인 약 6만 |
| 마닐라 | 60~110만 | 80~140만 | 140만+ | 2인 약 6만 |
| 파리 | 160~260만 | 200~340만 | 340만+ | 없음(FSC) |
| 로마 | 170~270만 | 210~350만 | 350만+ | 없음(FSC) |
| 바르셀로나 | 170~280만 | 220~360만 | 360만+ | 없음(FSC) |

#### 숙박 (1박, 2인 1실, KRW)

| 도시 | 호스텔 | 2~3성급 | 4성급 | 도시세 |
|------|--------|---------|-------|--------|
| 도쿄 | 6~8만 | 13~22만 | 28~50만 | 없음(숙박세 별도 경우 있음) |
| 오사카 | 5~7만 | 10~18만 | 22~42만 | 없음 |
| 방콕 | 2~4만 | 6~13만 | 16~32만 | 없음 |
| 하노이 | 2~4만 | 5~10만 | 13~26만 | 없음 |
| 마닐라 | 2~4만 | 5~11만 | 16~30만 | 없음 |
| 파리 | 9~15만 | 20~38만 | 45~90만 | 1인1박 약 0.6~3.3유로 |
| 로마 | 8~13만 | 18~33만 | 38~75만 | 1인1박 약 3.5~7유로 |
| 바르셀로나 | 7~13만 | 16~30만 | 32~70만 | 1인1박 약 1~4유로 |

#### 식비 (1인 기준, KRW)

| 도시 | 저가 식당 1끼 | 중급 2인 식사 합산 | 커피 1잔 |
|------|-------------|-----------------|---------|
| 도쿄 | 1.1만 | 6만 | 0.6만 |
| 오사카 | 1.0만 | 5.5만 | 0.6만 |
| 방콕 | 0.5만 | 3만 | 0.3만 |
| 하노이 | 0.4만 | 2.5만 | 0.25만 |
| 마닐라 | 0.5만 | 2.8만 | 0.3만 |
| 파리 | 1.6만 | 10만 | 0.7만 |
| 로마 | 1.4만 | 8.5만 | 0.5만 |
| 바르셀로나 | 1.3만 | 8만 | 0.5만 |

#### 대표 관광지 입장료 (1인 KRW, 공식 사이트 기준 2026년 4월)

| 도시 | 대표 명소 1 | 대표 명소 2 | 대표 명소 3 |
|------|----------|----------|----------|
| 도쿄 | 스카이트리 콤보 약 2.7만 | 팀랩 약 3.6만 | 우에노동물원 약 0.6만 |
| 오사카 | 어메이징패스 1일권 약 3.1만 | 유니버설스튜디오 약 8.5만 | 오사카성 약 0.7만 |
| 방콕 | 왕궁·왓프라깨우 약 0.6만 | 짐톰슨 약 0.2만 | 아유타야당일투어 약 1.3만 |
| 하노이 | 하롱베이 1일투어 약 1.2만 | 호아로수용소 약 0.15만 | 호치민묘 무료 |
| 마닐라 | 이나무롤 섬투어 약 0.8만 | 인트라무로스 약 0.1만 | 마닐라동물원 약 0.05만 |
| 파리 | 에펠탑 최대 약 5.4만 | 루브르 약 2.9만 | 오르세 약 2.9만 |
| 로마 | 바티칸박물관+시스티나 약 3.6만 | 콜로세움 약 2.9만 | 보르게세갤러리 약 2.9만 |
| 바르셀로나 | 사그라다파밀리아 약 3.6만 | 구엘공원 약 1.5만 | 피카소미술관 약 1.6만 |

> 위 입장료는 2026년 4월 공식 사이트 기준 일반 성인 요금의 원화 환산 추정값. 온라인 사전예약 수수료·할인 등은 별도.

#### 교통·통신·보험 (1인 기준 KRW, 보험은 2인 합산)

| 도시 | 시내교통 1일 | 공항이동 편도 | eSIM 5일 | 여행자보험 2인 4박5일 |
|------|-----------|------------|---------|-------------------|
| 도쿄 | 0.8만 | 1.5만 | 1.2만 | 4만 |
| 오사카 | 0.7만 | 1.0만 | 1.2만 | 4만 |
| 방콕 | 0.3만 | 0.5만 | 0.8만 | 3만 |
| 하노이 | 0.3만 | 0.4만 | 0.8만 | 3만 |
| 마닐라 | 0.3만 | 0.5만 | 0.8만 | 3만 |
| 파리 | 1.5만 | 2.0만 | 1.5만 | 6만 |
| 로마 | 1.3만 | 1.8만 | 1.5만 | 6만 |
| 바르셀로나 | 1.2만 | 1.5만 | 1.5만 | 6만 |

### 11-4. 총예산 추정 예시 (스탠다드형 4박5일, 2인 합산 KRW 만원)

> 아래는 항공(일반 중앙값) + 숙박(2~3성급 중앙값 × 4박) + 식비(혼합 5일) + 교통(5일) + 관광지(2개) + 통신(5일, 2인) + 보험(2인)

| 도시 | 항공 | 숙박 | 식비 | 교통 | 관광 | 통신·보험 | 기타(도시세 등) | **합계** |
|------|------|------|------|------|------|---------|--------------|--------|
| 도쿄 | 110 | 68 | 24 | 23 | 13 | 6 | 0 | **244** |
| 오사카 | 103 | 58 | 22 | 19 | 12 | 6 | 0 | **220** |
| 방콕 | 125 | 38 | 14 | 8 | 4 | 5 | 0 | **194** |
| 하노이 | 115 | 30 | 12 | 7 | 3 | 5 | 0 | **172** |
| 마닐라 | 110 | 32 | 13 | 8 | 3 | 5 | 0 | **171** |
| 파리 | 270 | 117 | 46 | 33 | 17 | 9 | 6 | **498** |
| 로마 | 280 | 102 | 40 | 28 | 14 | 9 | 10 | **483** |
| 바르셀로나 | 290 | 92 | 38 | 26 | 13 | 9 | 8 | **476** |

> 위 수치는 설계 단계 추정값입니다. 구현 시 항목별 단가 기준을 데이터 파일에서 투명하게 제공하고, 실제 시세와 함께 검토 후 보정하세요.

### 11-5. 데이터 작성 규칙

- 숫자는 `number` (KRW 원화, 1원 단위)로 저장한다.
- 화면 노출용 `만원`, `%`, `~` 포맷은 `.astro` 또는 스크립트에서 처리한다.
- 환율·기준일은 메타와 표 하단 주석에서 중복 노출한다.
- 모든 가격 항목에 `isEstimate: true` 플래그를 달아 "추정"임을 명시한다.

---

## 12. SEO / 카피 가이드

### 12-1. 메인 메타 초안

- `title`: `일본·동남아·유럽 여행 실비용 비교 2026 | 2인 해외여행 총예산 완전정리`
- `description`: `2026년 기준 일본, 동남아, 유럽 8개 도시의 항공권·숙박·식비·교통·관광지 입장료를 2인 기준으로 비교. 배낭형·스탠다드·프리미엄 여행 스타일별 총예산까지 한눈에 확인하세요.`

### 12-2. H1 / H2 구성

- H1: `일본·동남아·유럽 여행 실비용 비교 2026`
- H2 목록
  - `2026 해외여행 비용 비교 기준`
  - `서울 출발 왕복 항공권 & 수하물 비교`
  - `도시별 숙박비 비교`
  - `식비·관광지 입장료 비교`
  - `현지교통·통신·보험 비교`
  - `환율과 결제 수수료 전략`
  - `여행 스타일별 2인 총예산 비교`
  - `일본 vs 동남아 vs 유럽 총평`
  - `해외여행 예산 절약 팁`

### 12-3. FAQ 추천 질문 (최소 8개)

1. 2인 기준 일본과 동남아 여행비 차이는 얼마나 나나요?
2. 유럽 여행은 항공권만 비싼 건가요, 현지 물가도 높은가요?
3. 4박5일 스탠다드 여행 기준 가장 저렴한 도시는 어디인가요?
4. LCC와 FSC(대형항공사) 중 어느 쪽이 실제로 더 저렴한가요?
5. 환율 변동이 여행 예산에 얼마나 영향을 주나요?
6. 현금 환전과 카드 결제 중 어느 쪽이 유리한가요?
7. 유럽 도시세(관광세)는 얼마나 되나요?
8. 여행 스타일(배낭형 vs 프리미엄형)에 따라 총예산이 얼마나 다른가요?

### 12-4. 카피 원칙

- `최저가` 표현 금지. `범위값` 또는 `대표 중앙값`으로 표시한다.
- 추정값 옆에 항상 `(추정)` 또는 `(참고)` 표기한다.
- `기준 시점 명시 + 비교 구조 신뢰성`이 핵심이다.

---

## 13. 구현 체크리스트

### 13-1. 데이터

- [ ] `src/data/overseasTravelCostCompare2026.ts` 작성
- [ ] 8개 도시 CityData 입력 (항공/숙박/식비/교통/관광/통신/보험)
- [ ] BUDGET_MATRIX 계산 및 입력 (3스타일 × 3기간 × 8도시)
- [ ] REGION_SUMMARY 3개 입력
- [ ] SAVING_TIPS 5개 입력
- [ ] FAQ_ITEMS 8개 이상 입력
- [ ] 도시세 항목 각 도시별 확인 후 반영

### 13-2. 페이지

- [ ] `src/pages/reports/overseas-travel-cost-compare-2026.astro` 작성
- [ ] `src/data/reports.ts` 메타 등록
- [ ] `public/sitemap.xml` 라우트 추가
- [ ] OG 이미지 (`public/og/reports/overseas-travel-cost-compare-2026.png`)

### 13-3. 스크립트

- [ ] `public/scripts/overseas-travel-cost-compare-2026.js` 작성
- [ ] 스타일 탭 전환 → 총예산 표 갱신
- [ ] 기간 탭 전환 → 총예산 표 갱신
- [ ] 최저/최고 도시 하이라이트 갱신
- [ ] URL 파라미터 동기화 (`style`, `duration`)

### 13-4. 스타일

- [ ] `src/styles/scss/pages/_overseas-travel-cost-compare-2026.scss` 작성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 비교 표 가로 스크롤 처리
- [ ] 탭 활성 상태 스타일
- [ ] 권역별 총평 카드 3열 (PC) / 1열 (모바일) 레이아웃

---

## 14. QA 체크리스트

### 14-1. 콘텐츠 QA

- [ ] 환율 기준일과 기준 환율이 InfoNotice와 표 하단 양쪽에 명시되는가
- [ ] 모든 가격에 `(추정)` 표시가 있는가
- [ ] 도시 수가 본문 전체에서 8개로 통일되는가 (6개 표현 혼입 없음)
- [ ] 항공권이 범위값으로 노출되며 단일 고정값이 없는가
- [ ] 수하물 포함/미포함 여부가 명시되는가

### 14-2. 계산 QA

- [ ] BUDGET_MATRIX 값이 CityData 단가 기준으로 올바르게 계산되는가
- [ ] 스타일 변경 시 항공·숙박·식비 기준이 표 정의에 따라 달라지는가
- [ ] 기간 변경 시 숙박×nights, 식비×days가 올바르게 스케일되는가
- [ ] 도시세 항목이 2인×nights 기준으로 합산되는가

### 14-3. UI QA

- [ ] 모바일(375px)에서 비교 표가 가로 스크롤로 읽히는가
- [ ] 탭 전환 시 `travel-budget-sim__table` 내용이 즉시 갱신되는가
- [ ] 최저/최고 도시 하이라이트 카드가 탭 전환에 맞게 갱신되는가
- [ ] Hero → 항공 → 숙박 → 총예산 시뮬레이션 순으로 자연스럽게 읽히는가

### 14-4. SEO QA

- [ ] H1이 1개만 존재하는가
- [ ] `reports.ts` 메타 title/description이 SEO 가이드와 일치하는가
- [ ] FAQ schema 및 `SeoContent` 문단이 메인 키워드를 적절히 사용하는가
- [ ] 내부 링크 CTA가 환율 계산기·여행 예산 계산기 등 관련 도구로 연결되는가

---

## 15. 최종 구현 메모

- 이 페이지의 승부 포인트는 `어디가 제일 싸냐`가 아니라 **`같은 조건으로 비교하는 프레임`** 을 설계하는 것이다.
- 따라서 숫자를 박제하지 않고, "기준 + 범위값 + 추정 레이블" 구조를 일관되게 유지해야 신뢰도가 높다.
- 1차 구현은 **스탠다드형 × 4박5일** 총예산 표를 완성도 높게 만들고, 나머지 스타일·기간은 탭 전환으로 연결한다.
- 이후 v2에서 2박3일·7박8일 상세 시뮬레이션, v3에서 환율 변동 슬라이더와 여행 예산 계산기 연동을 확장하는 방향이 적합하다.
