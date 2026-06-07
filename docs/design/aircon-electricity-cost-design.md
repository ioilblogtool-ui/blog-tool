# 에어컨 전기요금 계산기 설계 문서

slug: `aircon-electricity-cost`
경로: `/tools/aircon-electricity-cost/`
타입: SimpleToolShell (입력 좌 / 결과 우)
카테고리: 생활·유틸리티

---

## 1. 기획 요약

### 목적
에어컨 소비전력 + 하루 사용 시간 + 월 사용 일수를 입력하면
- 에어컨이 추가하는 월 전력 소비량(kWh)
- 가정 기본 사용량과 합산된 누진 구간
- 에어컨 단독 추가 요금 / 전체 예상 전기요금
을 즉시 계산한다.

### 핵심 차별점
- 에어컨 단독 요금이 아니라 **가정 기존 사용량 + 에어컨 추가분 = 누진 구간 반영** 계산
- 7~8월 누진 한시 완화 구간 자동 적용
- 인버터/일반 구분 → 실사용 소비전력 보정
- 에너지 효율 등급별 프리셋 제공

---

## 2. 전기요금 계산 로직

### 2026 한국전력 주택용 전력(저압) 요금 체계

#### 기본요금
| 구간 | 기본요금 |
|------|---------|
| 200kWh 이하 | 910원 |
| 201~400kWh | 1,600원 |
| 400kWh 초과 | 7,300원 |

#### 전력량 요금 (일반 / 여름 완화)
| 구간 | 일반 | 여름(7~8월) |
|------|------|------------|
| 1단계 | 0~200kWh → 93.3원/kWh | 0~300kWh → 93.3원/kWh |
| 2단계 | 201~400kWh → 187.9원/kWh | 301~450kWh → 187.9원/kWh |
| 3단계 | 400kWh 초과 → 280.6원/kWh | 450kWh 초과 → 280.6원/kWh |

#### 추가 항목 (고정)
- 기후환경요금: 9.0원/kWh
- 연료비조정액: 5.0원/kWh (추정, 분기별 변동)
- 부가가치세: 10%
- 전력산업기반기금: 3.7%

#### 총 전기요금 공식
```
전력량요금 = 누진 단계별 합산
소계 = 기본요금 + 전력량요금 + (기후환경요금 + 연료비조정액) × kWh
부과세 적용 = 소계 × 1.1 × 1.037
최종요금 = ceil(부과세 적용 / 10) × 10  (10원 단위 절사)
```

#### 에어컨 추가 요금 계산 방법
```
에어컨 추가 요금 = 총요금(기존 + 에어컨) - 총요금(기존만)
```
이렇게 해야 누진 구간 교차 효과가 정확히 반영된다.

---

## 3. 입력 항목

### 프리셋 (에어컨 종류 빠른 선택)
| 프리셋 | 소비전력 | 비고 |
|--------|---------|------|
| 벽걸이 소형 (6평 이하) | 750W | |
| 벽걸이 중형 (10평) | 1,200W | 기본값 |
| 스탠드 소형 (15평) | 2,000W | |
| 스탠드 대형 (20평+) | 3,200W | |
| 직접 입력 | - | |

### 입력 필드
| 필드 | 타입 | 범위 | 기본값 |
|------|------|------|-------|
| 소비전력 (W) | number + slider | 100~5000, step 50 | 1200 |
| 인버터 여부 | toggle | on/off | on |
| 인버터 보정률 | — | 60% 자동 적용 | 인버터 on일 때 실소비전력 = 소비전력 × 0.6 |
| 하루 사용 시간 | number + slider | 1~24, step 0.5 | 8 |
| 월 사용 일수 | number + slider | 1~31, step 1 | 25 |
| 가정 기본 월 사용량 (kWh) | number | 50~500, step 10 | 200 |
| 계절 | select | 일반 / 여름(7~8월 완화) | 여름 |

---

## 4. 출력 (결과 영역)

### KPI 카드 (상단 4개)
1. **에어컨 추가 월 요금** — 메인 강조 (원)
2. **전체 예상 전기요금** — 기존 + 에어컨 합산 (원)
3. **에어컨 월 전력 소비** — kWh
4. **누진 구간** — 1단계 / 2단계 / 3단계 (배지로 표시)

### 상세 분석 패널

#### ① 사용량 구성 도넛 차트
- 기존 사용량 (kWh) vs 에어컨 추가량 (kWh)
- 중앙: 총 kWh
- canvas id: `aircon-usage-donut`

#### ② 누진 요금 구간 시각화 바
- 수평 프로그레스 바: 현재 총 사용량이 어느 구간에 있는지
- 1단계 끝(200/300kWh), 2단계 끝(400/450kWh) 마커 표시
- "현재 위치" 핀 표시

#### ③ 요금 상세 테이블
| 항목 | 기존만 | 에어컨 추가 후 |
|------|-------|--------------|
| 기본요금 | X원 | X원 |
| 전력량요금 | X원 | X원 |
| 기후환경요금 | X원 | X원 |
| 연료비조정액 | X원 | X원 |
| 부가가치세(10%) | X원 | X원 |
| 전력기반기금(3.7%) | X원 | X원 |
| **합계** | **X원** | **X원** |
| **에어컨 추가 요금** | — | **+X원** |

#### ④ 절약 팁 카드 (정적)
- 하루 1시간 줄이면 월 약 X원 절약 (동적 계산)
- 26도 vs 24도 설정 시 약 15~20% 차이
- 인버터 에어컨 vs 일반 에어컨 비교

---

## 5. 파일 구조

```
src/pages/tools/aircon-electricity-cost.astro
src/data/airconElectricityCost.ts
public/scripts/aircon-electricity-cost.js
src/styles/scss/pages/_aircon-electricity-cost.scss
```

`src/styles/app.scss`에 import 추가:
```scss
@use 'scss/pages/aircon-electricity-cost';
```

`src/data/tools.ts`에 항목 추가:
```ts
{
  slug: "aircon-electricity-cost",
  title: "에어컨 전기요금 계산기",
  description: "에어컨 소비전력·사용 시간으로 월 전기요금 추가분과 누진 구간을 계산합니다.",
  order: 0,
  eyebrow: "에어컨 전기요금",
  category: "생활·유틸리티",
  badges: ["신규", "여름"],
  previewStats: [
    { label: "벽걸이 중형·8h", value: "월 +4~6만원" },
    { label: "누진 구간 반영", value: "정확한 추가 요금" },
  ],
}
```

---

## 6. 데이터 파일 (`src/data/airconElectricityCost.ts`)

```ts
export const ELECTRICITY_RATES = {
  // 기본요금 (원)
  basicCharge: [
    { maxKwh: 200, charge: 910 },
    { maxKwh: 400, charge: 1600 },
    { maxKwh: Infinity, charge: 7300 },
  ],
  // 전력량요금 단가 (원/kWh) - 일반
  normalTiers: [
    { maxKwh: 200, rate: 93.3 },
    { maxKwh: 400, rate: 187.9 },
    { maxKwh: Infinity, rate: 280.6 },
  ],
  // 전력량요금 단가 (원/kWh) - 여름(7~8월)
  summerTiers: [
    { maxKwh: 300, rate: 93.3 },
    { maxKwh: 450, rate: 187.9 },
    { maxKwh: Infinity, rate: 280.6 },
  ],
  climateCharge: 9.0,      // 기후환경요금 원/kWh
  fuelAdjustment: 5.0,     // 연료비조정액 원/kWh (추정)
  vatRate: 0.10,            // 부가가치세
  fundRate: 0.037,          // 전력산업기반기금
};

export const AIRCON_PRESETS = [
  { id: "wall-small",  label: "벽걸이 소형 (6평 이하)", watt: 750 },
  { id: "wall-mid",    label: "벽걸이 중형 (10평)",    watt: 1200 },
  { id: "stand-small", label: "스탠드 소형 (15평)",    watt: 2000 },
  { id: "stand-large", label: "스탠드 대형 (20평+)",   watt: 3200 },
  { id: "custom",      label: "직접 입력",             watt: 0 },
];

export const INVERTER_RATIO = 0.6; // 인버터 실소비전력 보정

export const ACC_FAQS = [
  {
    question: "에어컨 전기요금은 어떻게 계산하나요?",
    answer: "소비전력(kW) × 하루 사용 시간 × 월 사용 일수 = 월 사용 kWh를 구한 뒤, 가정 기존 사용량과 합산해 누진 요금을 계산합니다. 에어컨 추가 요금 = 합산 요금 - 기존 요금으로 산출합니다."
  },
  {
    question: "인버터 에어컨은 전기요금이 다른가요?",
    answer: "인버터 에어컨은 정격 소비전력의 약 40~70% 수준으로 작동합니다. 본 계산기는 인버터 선택 시 정격 소비전력의 60%를 실소비전력으로 적용합니다."
  },
  {
    question: "여름철 전기요금 누진 완화란 무엇인가요?",
    answer: "한국전력은 매년 7~8월 냉방 수요 집중 기간에 1단계 구간을 200kWh에서 300kWh로, 2단계를 400kWh에서 450kWh로 한시 확대합니다. 계절 설정을 '여름(7~8월)'으로 선택하면 완화 기준이 자동 적용됩니다."
  },
  {
    question: "에어컨 온도를 1도 높이면 얼마나 절약되나요?",
    answer: "설정 온도를 1°C 높이면 소비전력이 약 7~10% 감소하는 것으로 알려져 있습니다. 26°C → 28°C로 올리면 월 사용량에 따라 수천 원에서 수만 원 절약될 수 있습니다."
  },
  {
    question: "전기요금이 실제와 다를 수 있나요?",
    answer: "본 계산기는 한국전력 2026년 주택용 전력(저압) 기준입니다. 연료비조정액은 분기별로 변동되며, 주택용 전력(고압), 사용 주택 유형, 복지 할인, 에너지 바우처 적용 여부에 따라 실제 고지서 금액과 다를 수 있습니다."
  },
];

export const ACC_SEO_INTRO = `에어컨을 켤 때마다 드는 전기요금이 실제로 얼마인지 정확히 계산하기 어렵습니다. 단순히 소비전력에 단가를 곱하면 누진세 효과가 빠집니다. 본 계산기는 가정 기존 사용량에 에어컨 추가분을 더해 누진 구간 교차 효과까지 반영한 정확한 추가 요금을 계산합니다.`;

export const ACC_RELATED = [
  { href: "/tools/minimum-wage-2026/", label: "최저임금 계산기" },
  { href: "/tools/overtime-pay-calculator/", label: "야근수당 계산기" },
  { href: "/reports/monthly-dividend-etf-2026/", label: "월배당 ETF 비교" },
];
```

---

## 7. JS 계산 로직 (`public/scripts/aircon-electricity-cost.js`)

### 핵심 함수 구조

```js
// 누진 요금 계산 (tiers: normalTiers or summerTiers)
function calcEnergyCharge(kwh, tiers) {
  let charge = 0, remaining = kwh;
  let prevMax = 0;
  for (const tier of tiers) {
    const bracket = Math.min(remaining, tier.maxKwh - prevMax);
    if (bracket <= 0) break;
    charge += bracket * tier.rate;
    remaining -= bracket;
    prevMax = tier.maxKwh;
    if (remaining <= 0) break;
  }
  return charge;
}

// 기본요금 (단계 요금제 - 총 사용량 기준)
function calcBasicCharge(kwh, basicChargeTable) {
  for (const entry of basicChargeTable) {
    if (kwh <= entry.maxKwh) return entry.charge;
  }
  return basicChargeTable.at(-1).charge;
}

// 최종 전기요금
function calcTotalBill(kwh, isSummer, rates) {
  const tiers = isSummer ? rates.summerTiers : rates.normalTiers;
  const basic = calcBasicCharge(kwh, rates.basicCharge);
  const energy = calcEnergyCharge(kwh, tiers);
  const climate = kwh * rates.climateCharge;
  const fuel = kwh * rates.fuelAdjustment;
  const subtotal = basic + energy + climate + fuel;
  const withTax = subtotal * (1 + rates.vatRate) * (1 + rates.fundRate);
  return Math.floor(withTax / 10) * 10;
}

// 에어컨 추가 요금
function calcAirconExtra(baseKwh, airconKwh, isSummer, rates) {
  const billBase = calcTotalBill(baseKwh, isSummer, rates);
  const billTotal = calcTotalBill(baseKwh + airconKwh, isSummer, rates);
  return { extra: billTotal - billBase, total: billTotal, base: billBase };
}

// 에어컨 월 소비량
function calcAirconKwh(watt, hoursPerDay, daysPerMonth, isInverter, inverterRatio) {
  const effectiveWatt = isInverter ? watt * inverterRatio : watt;
  return (effectiveWatt / 1000) * hoursPerDay * daysPerMonth;
}
```

### 이벤트 흐름
1. 입력 변경 → `recalculate()` 호출
2. `recalculate()` → 에어컨 kWh, 추가 요금, 구간 계산
3. DOM 업데이트: KPI 카드, 테이블, 도넛 차트, 진행 바
4. 누진 구간 배지 색상: 1단계=green, 2단계=warning, 3단계=danger
5. 절약 팁: 하루 1시간 줄였을 때 절약액 동적 계산

### URL 파라미터 (공유 링크)
`?w=1200&h=8&d=25&base=200&inv=1&season=summer`

---

## 8. SCSS 구조 (`_aircon-electricity-cost.scss`)

prefix: `acc-`

### 주요 클래스
```scss
.acc-page {}
.acc-kpi-grid {}           // 4열 KPI 카드
.acc-kpi-card {}
.acc-kpi-card--main {}     // 메인 강조 (에어컨 추가 요금)
.acc-preset-grid {}        // 프리셋 버튼 그리드
.acc-preset-btn {}
.acc-progress-bar {}       // 누진 구간 시각화 바
.acc-progress-fill {}
.acc-progress-marker {}    // 200/300/400/450kWh 마커
.acc-progress-pin {}       // 현재 위치 핀
.acc-tier-badge {}         // 1단계/2단계/3단계 배지
.acc-tier-badge--1 {}      // green
.acc-tier-badge--2 {}      // warning
.acc-tier-badge--3 {}      // danger
.acc-detail-table {}
.acc-tip-grid {}           // 절약 팁 카드 그리드
.acc-donut-wrap {}         // 차트 래퍼 (height: 220px)
```

---

## 9. SEO 설정

- **페이지 title**: `에어컨 전기요금 계산기 2026 — 누진세 반영 월 추가 요금`
- **description**: `에어컨 소비전력과 하루 사용 시간을 입력하면 월 전기요금 추가분을 누진세 구간까지 반영해 정확하게 계산합니다. 인버터 보정, 여름 완화 구간 자동 적용.`
- **JSON-LD**: WebApplication + FAQPage

### 타겟 키워드
- 에어컨 전기요금 계산기
- 에어컨 한달 전기요금
- 에어컨 전기요금 얼마나 나와
- 에어컨 누진세 계산
- 에어컨 전기세 계산기

---

## 10. 구현 순서

1. `src/data/airconElectricityCost.ts` 데이터 파일
2. `src/data/tools.ts` 항목 추가
3. `src/pages/tools/aircon-electricity-cost.astro` 페이지
4. `public/scripts/aircon-electricity-cost.js` 계산 로직 + 차트
5. `src/styles/scss/pages/_aircon-electricity-cost.scss` + `app.scss` import
6. `public/sitemap.xml` 경로 추가
7. `npm run build` 검증

---

## 11. QA 포인트

- [ ] 200kWh → 201kWh 경계에서 기본요금 1,600원으로 전환 확인
- [ ] 여름 완화: 300kWh 경계 정확히 적용되는지 확인
- [ ] 인버터 on/off 토글 시 소비전력 보정 반영 확인
- [ ] 도넛 차트 기존+에어컨 합계 = KPI kWh 일치 확인
- [ ] 누진 구간 배지 색상 구간별 정확히 변환 확인
- [ ] URL 파라미터 공유 후 동일 값 복원 확인
- [ ] 모바일 1열 레이아웃 확인
- [ ] build 후 `/tools/aircon-electricity-cost/` 경로 확인
