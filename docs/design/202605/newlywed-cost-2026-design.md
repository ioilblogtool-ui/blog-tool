# 2026 신혼부부 결혼·신혼집 비용 완전 분석 — 설계 문서

> 기획 원문: `docs/plan/202605/newlywed-cost-2026.md`
> 작성일: 2026-05-17
> 콘텐츠 유형: `/reports/` 데이터 리포트
> 구현 기준: 신혼집 보증금·혼수·정착 비용·정부 지원금 14개 섹션 정적 리포트

---

## 1. 문서 개요

- 구현 대상: `2026 신혼부부 결혼·신혼집 비용 완전 분석`
- slug: `newlywed-cost-2026`
- URL: `/reports/newlywed-cost-2026/`
- 카테고리: 결혼/웨딩
- 핵심 검색 의도: "신혼부부 결혼 비용 평균", "신혼집 전세 보증금 2026", "혼수 비용 평균", "신혼부부 정부 지원금"
- 핵심 CTA: `/tools/newlywed-rent-vs-buy/` (섹션 01, 06, 14에서 반복)
- 기존 리포트와의 차별화:
  - `wedding-cost-2016-vs-2026`: 예식장·드레스·신혼여행 → **결혼식 비용**
  - `newlywed-cost-2026`: 신혼집·혼수·정착·지원금 → **결혼 이후 정착 비용**

---

## 2. 구현 파일 구조

```text
src/
  data/
    newlywedCost2026.ts       ← 14개 섹션 데이터, FAQ, 관련 링크
  pages/
    reports/
      newlywed-cost-2026.astro

src/styles/scss/pages/
  _newlywed-cost-2026.scss
```

추가 등록 필수:
- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/newlywed-cost-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 정적 리포트 페이지. JS 인터랙션 없음.
- 클래스: `report-page nwc-page`
- SCSS prefix: `nwc-`
- 섹션 02, 05, 06 Chart.js 사용 (Bar / Line 차트)
- Chart.js 로드: `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js">`

---

## 4. 데이터 모델

```ts
// src/data/newlywedCost2026.ts

// ── Section 01: 신혼집 현황 ──
export interface HousingSnapshot {
  region: '수도권' | '5대광역시' | '기타지방';
  avgJeonseDeposit: number;    // 평균 전세 보증금 (원)
  avgMonthlyRent: number;      // 평균 월세 (원)
  avgMonthlyDeposit: number;   // 월세 평균 보증금 (원)
  selfEquityRate: number;      // 자기자본 비율 (0~1)
  housingTypeRatio: {
    jeonse: number;   // 전세 비율
    wolse: number;    // 월세 비율
    buy: number;      // 매매 비율
    parents: number;  // 부모 동거 비율
  };
  note: string;
}

// ── Section 03: 혼수·가전·가구 ──
export interface HonsuItem {
  category: string;   // '냉장고', '세탁기', '침대' 등
  minCost: number;    // 최소 (원)
  avgCost: number;    // 평균 (원)
  premiumCost: number; // 프리미엄 (원)
  channel: string;    // '가전양판점 기준'
  note?: string;
}

export interface HonsuBudget {
  tier: 'minimal' | 'standard' | 'premium';
  label: string;       // '알뜰형 1천만 원', '표준형 2천만 원', '프리미엄 4천만 원'
  items: HonsuItem[];
  total: number;
}

// ── Section 04: 대출·청약 혜택 ──
export interface SpecialLoanInfo {
  name: string;        // 상품명
  target: string;      // 대상
  maxAmount: number;   // 최대 한도 (원)
  rateMin: number;     // 최저 금리 (소수)
  rateMax: number;     // 최고 금리 (소수)
  priceLimit: number;  // 주택 가격 상한 (원)
  conditions: string[]; // 자격 조건 요약
  sourceUrl: string;   // 공식 출처
  asOf: string;        // 기준일
}

// ── Section 05: 가계부 시뮬레이션 ──
export interface HouseholdBudget {
  scenario: '맞벌이-합산7천' | '맞벌이-합산1억' | '외벌이-4천';
  monthlyIncome: number;
  monthlyFixed: {
    loanPayment: number;
    insurance: number;
    communication: number;
    managementFee: number;
  };
  monthlyVariable: {
    food: number;
    transport: number;
    dining: number;
    leisure: number;
  };
  monthlySavings: number;
  homeBuyYears: number;   // 전세 → 내집마련 목표 기간 (년 추정)
}

// ── Section 11: 정부 지원금 ──
export interface GovSupport {
  name: string;
  target: string;
  amount: string;       // 금액 또는 조건 설명
  timing: string;       // 신청 시기
  sourceUrl: string;
  region?: string;      // 지자체 한정 지원이면 표시
}

// ── 공통 ──
export const NWC_SECTION_COUNT = 14;

export const NWC_FAQ = [/* 8개 FAQ */];
export const NWC_RELATED_LINKS = [/* 5개 관련 링크 */];
export const NWC_SOURCE_LINKS = [/* 3개 외부 출처 */];
```

---

## 5. 섹션별 구현 상세

### Section 01 — 2026 신혼부부 평균 신혼집 현황

**컴포넌트:** 지역별 3행 비교 테이블 + 신혼집 유형 분포 도넛 차트

```ts
export const HOUSING_SNAPSHOTS: HousingSnapshot[] = [
  {
    region: '수도권',
    avgJeonseDeposit: 280000000,   // 2.8억 (추정)
    avgMonthlyRent: 900000,        // 90만원 (추정)
    avgMonthlyDeposit: 50000000,   // 월세 보증금 5천만 추정
    selfEquityRate: 0.45,
    housingTypeRatio: { jeonse: 0.52, wolse: 0.28, buy: 0.12, parents: 0.08 },
    note: '수도권 기준. 국토부 주거실태조사 2024·KB부동산 2025 편집 추정',
  },
  // 5대광역시, 기타지방 동일 구조
];
```

- 데이터 성격: 추정 (원천 데이터 편집·가공)
- 배지: `추정` 필수 표기
- CTA: 계산기 바로가기 버튼 삽입

---

### Section 02 — 수도권 vs 지방 신혼집 비용 격차

**컴포넌트:** 지역별 전세 보증금 Bar 차트 + 격차 설명 문단

```ts
export const REGION_JEONSE_DATA = [
  { region: '서울', avgDeposit: 380000000 },
  { region: '경기', avgDeposit: 240000000 },
  { region: '인천', avgDeposit: 200000000 },
  { region: '부산', avgDeposit: 160000000 },
  { region: '대구', avgDeposit: 130000000 },
  { region: '광주', avgDeposit: 110000000 },
  { region: '기타', avgDeposit: 95000000 },
];
// 출처: KB부동산 2025·국토부 실거래가 2024 기준 편집 추정
```

차트: Chart.js HorizontalBar, 색상: 수도권 #1a56db, 지방 #6b7280

---

### Section 03 — 혼수·가전·가구 항목별 평균 지출

**컴포넌트:** 3단 예산 탭 (알뜰형 / 표준형 / 프리미엄) + 품목별 비교 테이블

```ts
export const HONSU_ITEMS: HonsuItem[] = [
  { category: '냉장고', minCost: 800000, avgCost: 1500000, premiumCost: 3000000, channel: '가전양판점 기준' },
  { category: '세탁기', minCost: 400000, avgCost: 900000, premiumCost: 2000000, channel: '가전양판점 기준' },
  { category: 'TV', minCost: 300000, avgCost: 700000, premiumCost: 2500000, channel: '가전양판점 기준' },
  { category: '에어컨 (벽걸이)', minCost: 400000, avgCost: 700000, premiumCost: 1500000, channel: '가전양판점 기준' },
  { category: '침대 (퀸)', minCost: 300000, avgCost: 600000, premiumCost: 2000000, channel: '가구 양판점 기준' },
  { category: '소파', minCost: 200000, avgCost: 500000, premiumCost: 1500000, channel: '가구 양판점 기준' },
  { category: '식탁 + 의자', minCost: 150000, avgCost: 350000, premiumCost: 1000000, channel: '가구 양판점 기준' },
  { category: '냉난방 (스탠드)', minCost: 700000, avgCost: 1200000, premiumCost: 3000000, channel: '가전양판점 기준' },
];

export const HONSU_BUDGETS: HonsuBudget[] = [
  { tier: 'minimal',  label: '알뜰형 1,000만원', items: HONSU_ITEMS, total: 10000000 },
  { tier: 'standard', label: '표준형 2,000만원', items: HONSU_ITEMS, total: 20000000 },
  { tier: 'premium',  label: '프리미엄 4,000만원', items: HONSU_ITEMS, total: 40000000 },
];
```

- 데이터 성격: 추정 (가전양판점 공시가 편집·가공)
- 하단: 중고·렌탈 절약 팁 카드

---

### Section 04 — 신혼부부 특례대출·청약 혜택 총정리

**컴포넌트:** 대출 상품별 조건 카드 (3종) + 청약 특별공급 요약 테이블

```ts
export const SPECIAL_LOANS: SpecialLoanInfo[] = [
  {
    name: '신혼부부 구입자금 특례대출',
    target: '결혼 7년 이내 신혼부부·예비부부',
    maxAmount: 500000000,
    rateMin: 0.0185, rateMax: 0.033,
    priceLimit: 900000000,
    conditions: ['부부합산 연소득 1.3억 이하', '순자산 5.06억 이하', '생애최초 또는 1주택 처분 조건'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026-01',
  },
  {
    name: '버팀목 전세자금대출 (신혼부부)',
    target: '결혼 7년 이내 신혼부부',
    maxAmount: 300000000,
    rateMin: 0.02, rateMax: 0.035,
    priceLimit: 500000000,  // 전세 보증금 상한
    conditions: ['부부합산 연소득 7,500만 이하', '순자산 3.61억 이하'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026-01',
  },
  {
    name: '생애최초 주택담보대출',
    target: '생애 최초 주택 구입자',
    maxAmount: 500000000,
    rateMin: 0.023, rateMax: 0.035,
    priceLimit: 900000000,
    conditions: ['부부합산 연소득 2억 이하', '주택 보유 이력 없음'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026-01',
  },
];
```

- 데이터 성격: 공식 (주택금융공사 2026.01 기준)
- 배지: `공식` + 기준일 표기
- 하단: "조건 자주 바뀝니다 — 신청 전 공식 사이트 확인" 안내 문구

---

### Section 05 — 맞벌이 vs 외벌이 신혼 가계부 시뮬레이션

**컴포넌트:** 탭 전환 3시나리오 + 월 가계부 Bar 차트 (수입/지출/저축)

```ts
export const HOUSEHOLD_BUDGETS: HouseholdBudget[] = [
  {
    scenario: '맞벌이-합산7천',
    monthlyIncome: 4583333,   // 연 7천만 ÷ 12
    monthlyFixed: {
      loanPayment: 1200000,   // 전세 대출 이자 + 기회비용 추정
      insurance: 300000,
      communication: 120000,
      managementFee: 150000,
    },
    monthlyVariable: {
      food: 400000,
      transport: 200000,
      dining: 300000,
      leisure: 200000,
    },
    monthlySavings: 1713333,
    homeBuyYears: 8,
  },
  // 맞벌이-합산1억, 외벌이-4천 동일 구조
];
```

- 데이터 성격: 추정 (편집 시뮬레이션)
- 하단: "실제 가계부는 지출 항목마다 다릅니다" 안내

---

### Section 06 — 전세 보증금 마련 기간 시뮬레이션

**컴포넌트:** 연 소득별 × 보증금 목표별 매트릭스 테이블 + CTA 카드

```ts
export const SAVINGS_MATRIX = {
  depositTargets: [150000000, 200000000, 300000000, 500000000],
  incomeScenarios: [
    { label: '합산 5천만', monthlySaving: 800000 },
    { label: '합산 7천만', monthlySaving: 1500000 },
    { label: '합산 1억',   monthlySaving: 2500000 },
  ],
  // 기간 = (목표 보증금) / (월 저축액) / 12 (년)
};
```

- CTA: `/tools/newlywed-rent-vs-buy/` 강조 카드 삽입

---

### Section 07 — 신혼집 지역별 전세가율 비교

**컴포넌트:** 지역별 전세가율 테이블 + 해석 문단

```ts
export const JEONSE_RATE_DATA = [
  { region: '서울 강남', jeonseRate: 0.52, trend: '하락', note: 'KB부동산 2025.12' },
  { region: '서울 노원', jeonseRate: 0.68, trend: '보합', note: 'KB부동산 2025.12' },
  { region: '경기 성남', jeonseRate: 0.65, trend: '보합', note: 'KB부동산 2025.12' },
  { region: '경기 평택', jeonseRate: 0.72, trend: '상승', note: 'KB부동산 2025.12' },
  { region: '부산 해운대', jeonseRate: 0.69, trend: '보합', note: 'KB부동산 2025.12' },
  { region: '대구 수성', jeonseRate: 0.66, trend: '하락', note: 'KB부동산 2025.12' },
];
// 전세가율이 높을수록 전세 리스크 ↑, 낮을수록 매매 진입 매력 ↑
```

---

### Section 08 — 신혼 1년차 고정비·변동비 실태

**컴포넌트:** 지출 항목별 도넛 차트 + "예상 밖 지출" 강조 카드

- 예상 밖 지출 3종 카드: 관리비·공과금 과소 추정 / 자동차 보험 유지비 / 구독 서비스 누적

---

### Section 09 — 결혼 전 자산 수준별 신혼집 전략

**컴포넌트:** 3단 분기 카드 (자기자본 1억 미만 / 1~3억 / 3억 이상)

```ts
export const ASSET_STRATEGIES = [
  {
    tier: 'under1',
    label: '자기자본 1억 미만',
    strategy: '전세 대출 최대 활용 + 청약 납입 병행',
    tips: ['버팀목 전세대출 신혼부부 우대', '월 저축 목표 설정', '청약 가점 점검'],
  },
  {
    tier: '1to3',
    label: '자기자본 1~3억',
    strategy: '전세 vs 소형 매매 손익 비교 후 결정',
    tips: ['신혼부부 특례대출 활용', '지방·외곽 소형 매매 검토', '전세가율 높은 지역 리스크 점검'],
  },
  {
    tier: 'over3',
    label: '자기자본 3억 이상',
    strategy: '매매 진입 적극 검토 + 대출 최적 구조 설계',
    tips: ['생애최초 취득세 감면', '주담대 vs 특례대출 금리 비교', '재무설계사 상담 권장'],
  },
];
```

---

### Section 10 — 혼수 절약 팁·중고 활용 비율

**컴포넌트:** 품목별 중고 추천도 테이블 + 절약 팁 카드

```ts
export const SECOND_HAND_GUIDE = [
  { item: '소파', recommend: true,  reason: '외관 상태 직접 확인 가능, 절약 폭 큼' },
  { item: '식탁·의자', recommend: true,  reason: '당근마켓 시세 풍부, 절약 폭 큼' },
  { item: '냉장고', recommend: false, reason: '위생 우려, AS 보장 없음' },
  { item: '세탁기', recommend: false, reason: '내부 세척 불명확, 고장 리스크' },
  { item: 'TV', recommend: true,  reason: '모델·연식 확인 쉬움, 절약 폭 중간' },
  { item: '에어컨', recommend: false, reason: '냉매·필터 상태 확인 어려움' },
];
```

---

### Section 11 — 신혼부부 정부 지원금·바우처 총정리

**컴포넌트:** 시기별 체크리스트 카드 + 지원금 테이블

```ts
export const GOV_SUPPORTS: GovSupport[] = [
  {
    name: '결혼 세액공제 (2026 신설)',
    target: '2026년 이후 혼인신고',
    amount: '50만원 (1회)',
    timing: '연말정산',
    sourceUrl: 'https://www.nts.go.kr',
  },
  {
    name: '신혼부부 생애최초 취득세 감면',
    target: '생애최초 주택 구입 신혼부부',
    amount: '200만원 한도',
    timing: '취득일 60일 이내 신청',
    sourceUrl: 'https://www.mois.go.kr',
  },
  {
    name: '부모급여 (출산 후)',
    target: '0~1세 아동 부모',
    amount: '월 100만원 (0세), 50만원 (1세)',
    timing: '출생 후 신청',
    sourceUrl: 'https://www.bokjiro.go.kr',
  },
  {
    name: '첫만남이용권 (출산 후)',
    target: '신생아 출생',
    amount: '200만원 (바우처)',
    timing: '출생신고 후',
    sourceUrl: 'https://www.bokjiro.go.kr',
  },
  // 지자체 지원 별도 섹션 (서울·경기·세종)
];
```

---

### Section 12 — 2016 vs 2026 신혼 비용 변화 비교

**컴포넌트:** 항목별 2016/2026 비교 테이블 + 상승률 Bar 차트

```ts
export const COST_COMPARISON_2016_2026 = [
  { item: '수도권 평균 전세 보증금', val2016: 170000000, val2026: 280000000, sourceNote: '국토부 실거래가 편집 추정' },
  { item: '혼수·가전 평균', val2016: 12000000, val2026: 18000000, sourceNote: '소비자물가지수·업계 자료 편집 추정' },
  { item: '신혼 1년차 고정비', val2016: 1500000, val2026: 2300000, sourceNote: '가계동향조사 편집 추정' },
  { item: '부부 합산 평균 연봉', val2016: 60000000, val2026: 82000000, sourceNote: '고용노동부 임금실태조사 편집 추정' },
];
// 모두 추정 배지 필수
```

---

### Section 13 — 전문가 코멘트·재무설계 조언

**컴포넌트:** 3인 전문가 인용 카드 (재무설계사 / 부동산 전문가 / 법률)

- 실제 특정인 인용 아님, 일반적 조언 형태로 작성
- 배지: `참고` 표기

```ts
export const EXPERT_TIPS = [
  {
    role: '재무설계사 관점',
    tip: '신혼 초 가장 중요한 것은 비상 예비자금 3~6개월치 확보입니다. 내집마련보다 먼저 안전망을 만드세요.',
  },
  {
    role: '부동산 전문가 관점',
    tip: '전세가율 70% 이상 지역은 보증 사고 리스크가 높습니다. 전세보증보험 가입 여부를 반드시 확인하세요.',
  },
  {
    role: '법률·세무 관점',
    tip: '부모님 지원을 받을 경우 10년간 5천만원(직계존속) 증여세 비과세 한도를 활용하면 절세가 가능합니다.',
  },
];
```

---

### Section 14 — 계산기 CTA 및 관련 콘텐츠 내부링크

**컴포넌트:** 강조 CTA 카드 + 관련 링크 그리드

```astro
<!-- 강조 CTA -->
<div class="nwc-cta-card">
  <p class="nwc-cta-eyebrow">바로 계산해보기</p>
  <h2 class="nwc-cta-title">우리 조건에서 전세가 유리할까요, 매매가 유리할까요?</h2>
  <p class="nwc-cta-desc">전세 보증금·매매가·대출 금리를 입력하면 손익분기 전환 시점을 즉시 계산합니다.</p>
  <a href="/tools/newlywed-rent-vs-buy/" class="nwc-cta-btn">신혼집 전세 vs 매매 계산하기 →</a>
</div>
```

---

## 6. 페이지 IA (전체)

```
Hero
  eyebrow: "결혼/웨딩 리포트"
  title: "2026 신혼부부 결혼·신혼집 비용 완전 분석"
  description: "예식장 비용이 아닌, 결혼 이후 신혼집·혼수·정착에 실제로 드는 돈을 14개 섹션으로 분석합니다."

InfoNotice
  - "이 리포트는 공개 통계와 편집 추정 데이터를 종합한 참고 자료입니다. 2026.05 기준이며, 대출 조건·지원금은 변경될 수 있습니다."

Section 01. 2026 신혼부부 평균 신혼집 현황
Section 02. 수도권 vs 지방 신혼집 비용 격차
Section 03. 혼수·가전·가구 항목별 평균 지출
Section 04. 신혼부부 특례대출·청약 혜택 총정리
Section 05. 맞벌이 vs 외벌이 신혼 가계부 시뮬레이션
Section 06. 전세 보증금 마련 기간 시뮬레이션 + 계산기 CTA
Section 07. 신혼집 지역별 전세가율 비교
Section 08. 신혼 1년차 고정비·변동비 실태
Section 09. 결혼 전 자산 수준별 신혼집 전략
Section 10. 혼수 절약 팁·중고 활용 비율
Section 11. 신혼부부 정부 지원금·바우처 총정리
Section 12. 2016 vs 2026 신혼 비용 변화 비교
Section 13. 전문가 코멘트·재무설계 조언
Section 14. 계산기 CTA + 관련 콘텐츠 내부링크

SeoContent (FAQ 8개 + 관련 링크 5개)
```

---

## 7. SCSS 설계

```scss
.nwc-page {

  // 섹션 공통
  .nwc-section {
    margin-top: 48px;
    &__eyebrow { font-size: 0.78rem; font-weight: 600; color: #0f6e56; letter-spacing: 0.04em; }
    &__title   { font-size: 1.15rem; font-weight: 800; margin: 4px 0 12px; }
    &__sub     { font-size: 0.9rem; color: #6b7280; margin: 0 0 20px; }
  }

  // 지역 비교 테이블
  .nwc-region-table {
    width: 100%; border-collapse: collapse;
    th, td { padding: 10px 12px; border-bottom: 1px solid #e8ede9; font-size: 0.88rem; }
    th { background: #f8fcfa; font-weight: 700; text-align: left; }
    td:not(:first-child) { text-align: right; }
  }

  // 혼수 예산 탭
  .nwc-honsu-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .nwc-honsu-tab {
    padding: 6px 16px; border-radius: 20px; border: 1px solid #dce6e2;
    font-size: 0.85rem; cursor: pointer; background: #fff;
    &.is-active { background: #0f6e56; color: #fff; border-color: #0f6e56; }
  }

  // 대출 상품 카드
  .nwc-loan-cards { display: grid; gap: 16px; grid-template-columns: 1fr;
    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); } }
  .nwc-loan-card {
    border: 1.5px solid #e8ede9; border-radius: 12px; padding: 18px 20px;
    .nwc-loan-rate { font-size: 1.3rem; font-weight: 800; color: #0f6e56; }
    .nwc-loan-badge { font-size: 0.72rem; background: #f0fdf4; color: #0f6e56;
      border-radius: 4px; padding: 2px 6px; font-weight: 600; }
  }

  // 자산 수준별 전략 카드
  .nwc-asset-cards { display: grid; gap: 16px;
    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); } }
  .nwc-asset-card {
    border-radius: 12px; padding: 20px; background: #f8faf9;
    border-left: 4px solid #0f6e56;
    &.is-under1 { border-left-color: #6b7280; }
    &.is-mid    { border-left-color: #1a56db; }
    &.is-over3  { border-left-color: #0f6e56; }
  }

  // 전문가 코멘트 카드
  .nwc-expert-cards { display: grid; gap: 16px;
    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); } }
  .nwc-expert-card {
    border: 1px solid #e8ede9; border-radius: 12px; padding: 18px 20px;
    .nwc-expert-role { font-size: 0.78rem; color: #0f6e56; font-weight: 600; margin-bottom: 8px; }
    .nwc-expert-badge { font-size: 0.72rem; background: #f3f4f6; color: #6b7280;
      border-radius: 4px; padding: 2px 6px; }
  }

  // 2016 vs 2026 비교 차트 래퍼
  .nwc-compare-chart { max-width: 640px; margin: 20px auto 0; }

  // CTA 카드
  .nwc-cta-card {
    background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
    border: 1.5px solid #6ee7b7; border-radius: 16px; padding: 32px 28px;
    text-align: center; margin: 32px 0;
  }
  .nwc-cta-btn {
    display: inline-block; margin-top: 16px; padding: 12px 28px;
    background: #0f6e56; color: #fff; border-radius: 8px;
    font-size: 0.95rem; font-weight: 700; text-decoration: none;
  }

  // 지원금 테이블
  .nwc-support-table {
    width: 100%; border-collapse: collapse;
    th, td { padding: 10px 12px; border-bottom: 1px solid #e8ede9; font-size: 0.86rem; }
    th { background: #f0fdf4; font-weight: 700; }
    td.is-official { color: #0f6e56; font-weight: 600; }
  }
}
```

---

## 8. SEO 설계

```text
title: 2026 신혼부부 결혼·신혼집 비용 완전 분석 | 전세 보증금·혼수·지원금 총정리
description: 2026년 신혼부부 평균 전세 보증금, 혼수·가전 비용, 정부 지원금, 맞벌이·외벌이 가계부 시뮬레이션까지 14개 섹션으로 완전 정리. 신혼집 준비 전 반드시 읽어야 할 데이터 리포트.
H1: 2026 신혼부부 결혼·신혼집 비용 완전 분석
```

JSON-LD: `Article` + `FAQPage`

키워드: 신혼부부 결혼 비용 평균, 신혼집 전세 보증금 2026, 혼수 비용 평균, 신혼부부 특례대출, 신혼 가계부, 신혼부부 정부 지원금

---

## 9. SeoContent 초안

### FAQ (8개)

```ts
export const NWC_FAQ = [
  {
    question: '2026년 수도권 신혼집 평균 전세 보증금은 얼마인가요?',
    answer: '국토부 실거래가·KB부동산 데이터 편집 기준으로 수도권 신혼 평균 전세 보증금은 약 2.5~3억 원 수준으로 추정됩니다. 서울은 3.5~4억 원, 경기·인천은 2~2.5억 원대로 격차가 큽니다. 실제 시세는 지역·면적·시기에 따라 달라지므로 KB부동산이나 국토부 실거래가를 함께 확인하세요.',
  },
  {
    question: '신혼부부 특례대출과 일반 주담대는 금리가 얼마나 차이 나나요?',
    answer: '2026년 기준 신혼부부 구입자금 특례대출은 연 1.85~3.3%, 시중 일반 주담대는 연 3.5~5% 수준입니다. 대출 금액 4억 원 기준 금리 차이 1%p만으로도 연 400만 원, 5년 누적 2,000만 원 이상 절감 효과가 날 수 있습니다. 조건은 자주 바뀌므로 신청 전 주택금융공사 공식 사이트를 확인하세요.',
  },
  {
    question: '혼수·가전 비용은 평균 얼마인가요?',
    answer: '결혼정보업체·소비자 설문 기준으로 신혼 혼수·가전·가구 평균 지출은 약 1,500~2,500만 원 수준으로 추정됩니다. 가전 브랜드와 가구 품질에 따라 500만 원대부터 5,000만 원 이상까지 편차가 큽니다. 이 리포트의 Section 03에서 알뜰형(1천만)/표준형(2천만)/프리미엄(4천만) 구성 예시를 확인하세요.',
  },
  {
    question: '신혼부부가 받을 수 있는 정부 지원금을 모두 합치면 얼마인가요?',
    answer: '결혼 세액공제(50만), 취득세 감면(최대 200만), 출산 후 첫만남이용권(200만)+부모급여(0세 기준 연 1,200만)를 합산하면 첫 2년간 1,600만 원 이상 지원을 받을 수 있습니다. 지자체 추가 지원까지 포함하면 더 늘어납니다. Section 11에서 시기별 신청 체크리스트를 확인하세요.',
  },
  {
    question: '전세 보증금 마련까지 보통 몇 년 걸리나요?',
    answer: '부부 합산 월 저축액 150만 원 기준으로 3억 원 마련에 약 17년이 걸립니다. 200만 원이면 12년, 250만 원이면 10년 수준입니다. 전세대출을 활용해 자기자본 목표를 낮추거나(대출 70% 활용 시 1억 마련 목표), 부모 지원·증여를 병행하면 기간을 크게 단축할 수 있습니다.',
  },
  {
    question: '전세가율이 높은 지역은 왜 위험한가요?',
    answer: '전세가율이 80% 이상인 지역은 집값이 조금만 하락해도 전세 보증금이 집값보다 커지는 역전세 상황이 발생할 수 있습니다. 이 경우 집주인이 보증금을 제때 돌려주지 못하는 전세 사기·보증 사고 리스크가 높아집니다. 전세보증보험(HUG) 가입과 선순위 채권 확인이 필수입니다.',
  },
  {
    question: '부모님 지원을 받을 때 증여세가 걱정됩니다',
    answer: '직계존속(부모)에게 받는 증여는 10년간 5,000만 원까지 비과세입니다. 미성년자는 2,000만 원입니다. 부부가 각자 부모에게 받으면 양쪽 합산 최대 1억 원까지 비과세 한도가 생깁니다. 결혼 전후 2년 이내에는 혼인 공제로 1억 원 추가 비과세(2023년 세법 개정)도 적용됩니다.',
  },
  {
    question: '10년 전(2016)보다 신혼 비용이 얼마나 올랐나요?',
    answer: '수도권 평균 전세 보증금은 2016년 약 1.7억 원에서 2026년 약 2.8억 원으로 약 65% 상승 추정됩니다. 같은 기간 부부 합산 평균 연봉은 6천만 원에서 8,200만 원으로 약 37% 오르는 데 그쳤습니다. 주거 비용 상승이 소득 상승을 크게 웃돌아 신혼 초기 자기자본 마련 부담이 커졌습니다.',
  },
];
```

---

## 10. 관련 링크

```ts
export const NWC_RELATED_LINKS = [
  { href: '/tools/newlywed-rent-vs-buy/', label: '신혼집 전세 vs 매매 손익 계산기' },
  { href: '/tools/home-purchase-fund/', label: '내집마련 자금 계산기' },
  { href: '/tools/wedding-budget-calculator/', label: '결혼 예산 계산기' },
  { href: '/tools/apt-cheonyak-gajum-calculator/', label: '아파트 청약 가점 계산기' },
  { href: '/reports/wedding-cost-2016-vs-2026/', label: '웨딩 비용 10년 변화 리포트' },
];

export const NWC_SOURCE_LINKS = [
  {
    source: '주택금융공사',
    title: '신혼부부 구입자금 특례대출 안내',
    href: 'https://www.hf.go.kr',
    desc: '대출 금리·한도·자격 조건 공식 안내',
  },
  {
    source: '국토교통부',
    title: '실거래가 공개 시스템',
    href: 'https://rt.molit.go.kr',
    desc: '아파트·빌라·오피스텔 실거래 시세 확인',
  },
  {
    source: '복지로',
    title: '신혼부부 정부 지원금 통합 안내',
    href: 'https://www.bokjiro.go.kr',
    desc: '부모급여·첫만남이용권·아동수당 신청',
  },
];
```

---

## 11. QA 체크리스트

- [ ] 모든 추정 데이터에 `추정` 배지 표기
- [ ] 공식 데이터(대출 조건·지원금)에 기준일 표기
- [ ] Section 04 대출 상품 출처 URL 유효성 확인
- [ ] Chart.js 스크립트 태그 포함 (섹션 02, 05, 12 차트 사용)
- [ ] Section 14 CTA 링크 `/tools/newlywed-rent-vs-buy/` 유효 확인
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
- [ ] 모바일 360px — 카드·테이블 가로 스크롤 정상
- [ ] InfoNotice 기준일 "2026.05" 표기
- [ ] FAQ 8개 JSON-LD FAQPage 포함 확인
- [ ] 웨딩 비용 리포트(`wedding-cost-2016-vs-2026`)와 중복 섹션 없음 확인
- [ ] "전문가 코멘트"가 특정인 인용처럼 보이지 않도록 문구 검수
