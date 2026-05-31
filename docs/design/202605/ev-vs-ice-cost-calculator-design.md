# 전기차 vs 내연기관 총비용 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/ev-vs-ice-cost-calculator.md`
> 작성일: 2026-05-31
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 차량 가격·보조금·연료비·취득세·자동차세·정비비·보험료를 합산한 5년·10년 총보유비용(TCO)과 손익분기점 연도를 실시간 비교하는 계산기

---

## 1. 문서 개요

- 구현 대상: `전기차 vs 내연기관 총비용 비교 계산기`
- slug: `ev-vs-ice-cost-calculator`
- URL: `/tools/ev-vs-ice-cost-calculator/`
- 카테고리: 자동차·생활
- 핵심 검색 의도: `전기차 유지비 계산`, `전기차 vs 휘발유차 비교`, `전기차 손익분기점`, `전기차 실제 비용`, `전기차 보조금 2026`
- 핵심 출력: EV·ICE 실구매가 차이, 월 연료비 차이, 5년·10년 TCO 비교, 손익분기점 연도, 항목별 비용 분해표
- 안전 장치: 정비비·보험료는 `추정` 배지. 충전 단가·유가는 `참고` 배지. 보조금은 조건에 따라 달라질 수 있음을 InfoNotice에 명시. 투자·구매 권유 문구 사용 금지.

---

## 2. 구현 파일 구조

```text
src/
  data/
    evVsIceCostCalculator.ts
  pages/
    tools/
      ev-vs-ice-cost-calculator.astro

public/
  scripts/
    ev-vs-ice-cost-calculator.js

src/styles/scss/pages/
  _ev-vs-ice-cost-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts` — order: 25.5, category: "compare"
- `src/styles/app.scss` — `@use 'scss/pages/ev-vs-ice-cost-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` — topicBySlug에 `"ev-vs-ice-cost-calculator": "여행·생활"` 추가
- `public/og/tools/ev-vs-ice-cost-calculator.png`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지
- SCSS prefix: `evc-`
- pageClass: `evc-page`
- 입력: Aside에 공통 설정(주행거리·비교 기간·보험료) + 메인에 EV / ICE 카드 형태로 분리
- 결과: KPI 4개 → 항목별 비교표 → 손익분기점 그래프 → 보조금 안내 → CTA
- 모바일: 차량 설정은 탭(EV / ICE) 전환, 결과는 단열 스택
- Chart.js line chart: 누적 비용 교차 그래프 (5~15년)

```astro
<SimpleToolShell
  calculatorId="ev-vs-ice-cost-calculator"
  pageClass="evc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 시뮬레이션 안내 `InfoNotice`
3. 프리셋 시나리오 버튼 (아이오닉6 vs K8 / 테슬라 vs 그랜저)
4. 공통 설정 Aside (연간 주행거리·비교 기간)
5. EV / ICE 차량 설정 카드
6. KPI 카드 4개 (실구매가 차이·월 연료비 차이·N년 TCO·손익분기점)
7. 항목별 비용 분해표
8. 손익분기점 누적비용 그래프
9. 충전 방식별 비용 안내
10. 보조금 현황 참고표
11. 관련 계산기 CTA
12. `SeoContent` + FAQ

---

## 5. 데이터 모델

파일: `src/data/evVsIceCostCalculator.ts`

```ts
export type FuelType = "gasoline" | "diesel" | "lpg" | "ev";
export type ComparisonYears = 1 | 3 | 5 | 7 | 10 | 15;
export type ResultTone = "ev_better" | "neutral" | "ice_better";
export type EvidenceBadge = "공식" | "참고" | "추정" | "시뮬레이션";

export interface EvInput {
  vehiclePrice: number;          // 차량가 (보조금 전)
  nationalSubsidy: number;       // 국고 보조금
  localSubsidy: number;          // 지자체 보조금
  energyEfficiency: number;      // 전비 (km/kWh)
  slowChargingRatio: number;     // 완속 충전 비율 (0~1)
  annualInsurance: number;       // 연간 보험료
  annualMaintenanceCost: number; // 연간 정비비
}

export interface IceInput {
  vehiclePrice: number;          // 차량가
  fuelType: FuelType;            // 연료 종류
  fuelEfficiency: number;        // 연비 (km/L)
  annualInsurance: number;       // 연간 보험료
  annualMaintenanceCost: number; // 연간 정비비
  engineDisplacementCC: number;  // 배기량 (cc) — 자동차세 계산용
}

export interface CommonInput {
  annualMileageKm: number;       // 연간 주행거리
  comparisonYears: ComparisonYears;
  slowChargingRatePerKwh: number; // 완속 단가 (원/kWh)
  fastChargingRatePerKwh: number; // 급속 단가 (원/kWh)
  fuelPricePerLiter: number;     // 연료 가격 (원/L)
}

export interface FuelPrice {
  type: FuelType;
  label: string;
  pricePerLiter: number;
  badge: EvidenceBadge;
  updatedAt: string;
}

export interface AcquisitionTax {
  evReductionMax: number;        // EV 취득세 감면 최대액 (원)
  iceRatePercent: number;        // ICE 취득세율 (%)
  basis: string;
  sourceLabel: string;
}

export interface AnnualVehicleTax {
  evFixedAmountWon: number;      // EV 자동차세 정액 (연간)
  iceRatePerCC: number;          // ICE cc당 세율 (원)
  educationTaxRate: number;      // 지방교육세율 (%)
  basis: string;
}

export interface EvCostBreakdown {
  effectiveVehiclePrice: number;   // 보조금 차감 실구매가
  acquisitionTax: number;          // 취득세 (감면 적용)
  annualVehicleTax: number;        // 연간 자동차세
  annualFuelCost: number;          // 연간 충전비
  annualMaintenance: number;       // 연간 정비비
  annualInsurance: number;         // 연간 보험료
  totalTco: number;                // 비교 기간 TCO
  monthlyAvgCost: number;          // 월 평균 비용
}

export interface IceCostBreakdown {
  effectiveVehiclePrice: number;   // 취득가
  acquisitionTax: number;          // 취득세
  annualVehicleTax: number;        // 연간 자동차세
  annualFuelCost: number;          // 연간 주유비
  annualMaintenance: number;       // 연간 정비비
  annualInsurance: number;         // 연간 보험료
  totalTco: number;                // 비교 기간 TCO
  monthlyAvgCost: number;          // 월 평균 비용
}

export interface BreakevenResult {
  years: number | null;            // 손익분기 연도 (null = 비교 기간 내 교차 없음)
  months: number | null;           // 손익분기 월 (보조)
  label: string;                   // "4년 3개월 후 전기차가 유리"
  tone: ResultTone;
}

export interface YearlyCumulativeCost {
  year: number;
  evCumulative: number;
  iceCumulative: number;
}

export interface EvcResult {
  evBreakdown: EvCostBreakdown;
  iceBreakdown: IceCostBreakdown;
  tcoDiff: number;                 // ICE - EV TCO (양수: EV 절약)
  monthlyFuelDiff: number;         // ICE 월연료비 - EV 월충전비
  breakeven: BreakevenResult;
  yearlyCumulative: YearlyCumulativeCost[];
  resultTone: ResultTone;
  warnings: string[];
}

export interface CarPreset {
  id: string;
  label: string;
  description: string;
  ev: Partial<EvInput>;
  ice: Partial<IceInput>;
}

export interface SubsidyInfo {
  region: string;
  nationalMax: number;
  localMin: number;
  localMax: number;
  note: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

export interface EvcConfig {
  meta: {
    title: string;
    seoTitle: string;
    seoDescription: string;
    caution: string;
    updatedAt: string;
  };
  defaultEvInput: EvInput;
  defaultIceInput: IceInput;
  defaultCommon: CommonInput;
  fuelPrices: FuelPrice[];
  acquisitionTax: AcquisitionTax;
  annualVehicleTax: AnnualVehicleTax;
  presets: CarPreset[];
  subsidyReference: SubsidyInfo[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
  seoIntro: string[];
  inputPoints: string[];
  criteria: string[];
}
```

---

## 6. 핵심 데이터 상수

파일: `src/data/evVsIceCostCalculator.ts`

### 6-1. 메타

```ts
export const EVC_META = {
  title: "전기차 vs 내연기관 총비용 비교 계산기",
  seoTitle: "전기차 vs 휘발유차 총비용 비교 계산기 2026｜5년·10년 손익분기점",
  seoDescription:
    "전기차와 휘발유·디젤·LPG차의 차량 가격, 보조금, 충전비, 유지비, 보험료까지 합산해 5년·10년 총보유비용(TCO)을 비교합니다. 손익분기점 연도를 즉시 확인하세요.",
  caution:
    "이 계산기는 참고용 시뮬레이션입니다. 실제 보조금은 지자체·차종·소득 기준에 따라 다르며, 전기요금·유가는 시기에 따라 변동됩니다. 정비비·보험료 추정값은 평균 범위 기준이며 개인별 실제값과 다를 수 있습니다.",
  updatedAt: "2026년 5월 기준",
};
```

### 6-2. 기본 입력값

```ts
export const EVC_DEFAULT_EV: EvInput = {
  vehiclePrice: 55_000_000,       // 5,500만원 (아이오닉6 기준)
  nationalSubsidy: 4_000_000,     // 국고 보조금 400만원
  localSubsidy: 1_000_000,        // 지자체 보조금 100만원 (서울 기준)
  energyEfficiency: 6.0,          // 6.0 km/kWh
  slowChargingRatio: 0.7,         // 완속 70%
  annualInsurance: 1_000_000,     // 연간 보험료 100만원
  annualMaintenanceCost: 550_000, // 연간 정비비 55만원 (추정)
};

export const EVC_DEFAULT_ICE: IceInput = {
  vehiclePrice: 45_000_000,       // 4,500만원 (K8 휘발유 기준)
  fuelType: "gasoline",
  fuelEfficiency: 13.0,           // 13.0 km/L
  annualInsurance: 850_000,       // 연간 보험료 85만원
  annualMaintenanceCost: 1_000_000, // 연간 정비비 100만원 (추정)
  engineDisplacementCC: 2500,     // 2500cc
};

export const EVC_DEFAULT_COMMON: CommonInput = {
  annualMileageKm: 15_000,
  comparisonYears: 5,
  slowChargingRatePerKwh: 324,    // 한전 완속 324원/kWh
  fastChargingRatePerKwh: 430,    // 급속 430원/kWh
  fuelPricePerLiter: 1_750,       // 전국 평균 휘발유 1,750원/L
};
```

### 6-3. 연료 단가 참고값

```ts
export const EVC_FUEL_PRICES: FuelPrice[] = [
  { type: "gasoline", label: "휘발유", pricePerLiter: 1_750, badge: "참고", updatedAt: "2026-05" },
  { type: "diesel",   label: "경유",   pricePerLiter: 1_630, badge: "참고", updatedAt: "2026-05" },
  { type: "lpg",      label: "LPG",   pricePerLiter: 1_010, badge: "참고", updatedAt: "2026-05" },
];

export const EVC_CHARGING_RATES = {
  slowPublic: { rate: 324, label: "완속 공용", badge: "참고" as EvidenceBadge },
  fastPublic: { rate: 430, label: "급속 공용", badge: "참고" as EvidenceBadge },
  slowHome:   { rate: 130, label: "완속 자가 설치 참고", badge: "추정" as EvidenceBadge },
};
```

### 6-4. 취득세 기준

```ts
export const EVC_ACQUISITION_TAX: AcquisitionTax = {
  evReductionMax: 1_400_000,   // EV 취득세 감면 최대 140만원 (조세특례제한법)
  iceRatePercent: 7,           // ICE 취득세율 7%
  basis: "조세특례제한법 제109조 (2026년 기준)",
  sourceLabel: "국세청·행정안전부",
};
```

### 6-5. 자동차세 기준

```ts
export const EVC_VEHICLE_TAX: AnnualVehicleTax = {
  evFixedAmountWon: 130_000,    // EV 정액 약 13만원/년
  iceRatePerCC: 19,             // 1600cc 초과 19원/cc (지방세법 기준)
  educationTaxRate: 0.3,        // 지방교육세 30%
  basis: "지방세법 제127조 (2026년 기준)",
};
// ICE 2500cc 예시: 2500 × 19 × 1.3 = 61,750원/년 → 30% 조기납부 시 약 43,225원
```

### 6-6. 프리셋

```ts
export const EVC_PRESETS: CarPreset[] = [
  {
    id: "ioniq6-vs-k8",
    label: "아이오닉6 vs K8",
    description: "중형 세단 비교 — 아이오닉6(EV) vs K8 2.5 가솔린",
    ev: {
      vehiclePrice: 55_000_000,
      nationalSubsidy: 4_000_000,
      localSubsidy: 1_000_000,
      energyEfficiency: 6.3,
      slowChargingRatio: 0.7,
    },
    ice: {
      vehiclePrice: 46_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 11.8,
      engineDisplacementCC: 2497,
    },
  },
  {
    id: "tesla3-vs-grandeur",
    label: "테슬라3 vs 그랜저",
    description: "프리미엄 세단 비교 — 테슬라 모델3(EV) vs 그랜저 HEV",
    ev: {
      vehiclePrice: 57_000_000,
      nationalSubsidy: 3_500_000,
      localSubsidy: 800_000,
      energyEfficiency: 6.1,
      slowChargingRatio: 0.6,
    },
    ice: {
      vehiclePrice: 48_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 16.5,
      engineDisplacementCC: 1999,
    },
  },
  {
    id: "ev3-vs-ray",
    label: "EV3 vs 레이",
    description: "경형~소형 비교 — 기아 EV3(EV) vs 레이 가솔린",
    ev: {
      vehiclePrice: 33_000_000,
      nationalSubsidy: 5_000_000,
      localSubsidy: 1_500_000,
      energyEfficiency: 6.8,
      slowChargingRatio: 0.8,
    },
    ice: {
      vehiclePrice: 19_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 14.5,
      engineDisplacementCC: 998,
    },
  },
];
```

### 6-7. 보조금 참고표

```ts
export const EVC_SUBSIDY_REFERENCE: SubsidyInfo[] = [
  { region: "서울",   nationalMax: 4_000_000, localMin: 800_000,  localMax: 1_200_000, note: "지자체별·차종별 상이" },
  { region: "경기",   nationalMax: 4_000_000, localMin: 500_000,  localMax: 2_000_000, note: "시·군별 상이" },
  { region: "부산",   nationalMax: 4_000_000, localMin: 1_000_000, localMax: 1_500_000, note: "" },
  { region: "대구",   nationalMax: 4_000_000, localMin: 1_200_000, localMax: 1_500_000, note: "" },
  { region: "인천",   nationalMax: 4_000_000, localMin: 800_000,  localMax: 1_200_000, note: "" },
  { region: "제주",   nationalMax: 4_000_000, localMin: 3_000_000, localMax: 4_000_000, note: "지자체 보조 최상위" },
];
// 출처: 환경부 전기차 보조금 업무처리지침 2026, 추정 포함
```

### 6-8. FAQ

```ts
export const EVC_FAQ: FaqItem[] = [
  {
    question: "전기차 보조금은 얼마인가요?",
    answer: "2026년 기준 국고 보조금 최대 400만원 내외이며, 차량 가격·성능·충전 속도 조건에 따라 달라집니다. 지자체 보조금은 서울 80~120만원, 제주 최대 400만원 등 지역별로 큰 차이가 납니다. 이 계산기에서 직접 입력해 시뮬레이션하세요.",
  },
  {
    question: "전기요금이 오르면 계산 결과가 달라지나요?",
    answer: "네. 완속·급속 충전 단가 항목을 직접 수정해 시나리오를 바꿀 수 있습니다. 2026년 기준 완속 공용 약 324원/kWh, 급속 공용 약 430원/kWh를 기본값으로 사용합니다.",
  },
  {
    question: "아파트 거주자는 자가 충전이 어렵지 않나요?",
    answer: "자가 완속 충전기를 설치할 수 없는 경우 공용 급속·완속 충전소를 이용해야 합니다. 이 계산기에서 완속·급속 비율을 조정해 실제 상황에 맞게 시뮬레이션할 수 있습니다.",
  },
  {
    question: "10만km 이상 타면 배터리 교체 비용이 문제 아닌가요?",
    answer: "주요 제조사는 배터리 보증을 10년·20만km 이상으로 제공합니다. 보증 기간 이후 교체 비용은 300~700만원 수준으로 예상되며, 이 계산기의 비교 기간 내에는 포함하지 않습니다.",
  },
  {
    question: "하이브리드 차량은 비교할 수 있나요?",
    answer: "이 계산기는 순수 EV vs 내연기관 비교가 목적입니다. 하이브리드는 ICE 측 연비를 실제 하이브리드 공인 연비(예: 그랜저 HEV 16.5km/L)로 입력해 근사 비교할 수 있습니다.",
  },
  {
    question: "중고 전기차 구매 시에도 사용할 수 있나요?",
    answer: "네. 차량가를 중고 매입가로, 국고·지자체 보조금을 0으로 입력하면 중고 전기차 기준으로 시뮬레이션됩니다.",
  },
  {
    question: "전기차 보험료가 더 비싸다는데 사실인가요?",
    answer: "2026년 기준 EV 보험료가 동급 내연기관 대비 10~20% 높은 경우가 많습니다. 배터리 수리비·부품 조달 특성 때문입니다. 이 계산기에서 실제 보험 견적으로 직접 입력하면 정확하게 비교할 수 있습니다.",
  },
  {
    question: "디젤·LPG차도 비교 가능한가요?",
    answer: "가능합니다. ICE 측 연료 종류를 경유 또는 LPG로 선택하면 해당 유가가 자동 적용됩니다.",
  },
];
```

### 6-9. 관련 링크

```ts
export const EVC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/real-estate-acquisition-tax/", label: "취득세 계산기", description: "자동차 취득세도 동일 산식 적용" },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기" },
  { href: "/tools/fire-calculator/", label: "FIRE 은퇴 자산 계산기", description: "차량 구매가 FIRE 일정에 미치는 영향" },
  { href: "/tools/dca-investment-calculator/", label: "DCA 적립식 투자 계산기" },
];
```

### 6-10. SEO 인트로 (4단락)

```ts
export const EVC_SEO_INTRO: string[] = [
  "전기차가 내연기관보다 유지비가 저렴하다는 말은 반쪽이다. 연료비만 보면 전기차가 확실히 유리하지만, 취득가, 보조금 조건, 자동차세, 정비비, 보험료를 전부 합산한 총보유비용(TCO)으로 봐야 실제 비교가 가능하다.",
  "2026년 국고 보조금 기준 전기차 실구매가는 동급 내연기관보다 1천만원 내외 비쌀 수 있다. 이 차이를 연료비와 유지비 절감으로 회수하는 데 걸리는 기간이 손익분기점이다. 연간 주행거리가 길수록, 완속 충전 비율이 높을수록, 손익분기점은 빨라진다.",
  "이 계산기는 차량 가격·보조금·취득세·자동차세·연료비·정비비·보험료를 항목별로 분리해 5년·10년 TCO를 비교한다. 특히 충전비는 완속·급속 비율을 직접 입력할 수 있어 아파트 거주자와 자가 충전 가능자 각각의 상황에 맞게 시뮬레이션할 수 있다.",
  "다만 정비비와 보험료는 추정값이며 차종·운전 이력·보험사별로 실제값이 다를 수 있다. 유가와 전기요금도 정책·계절·사업자에 따라 달라진다. 이 계산기는 참고용 시뮬레이션이며 실제 구매 결정 전에는 해당 차종 견적서와 보험 다이렉트 비교를 함께 확인하길 권장한다.",
];
```

---

## 7. 계산 로직

파일: `public/scripts/ev-vs-ice-cost-calculator.js`에서 구현. Astro 빌드 타임 계산 없이 클라이언트 순수 JS로 처리.

### 7-1. EV 실구매가

```
evEffectivePrice = vehiclePrice - nationalSubsidy - localSubsidy
```

### 7-2. EV 취득세

```
evAcquisitionTax = max(vehiclePrice * 0.07 - acquisitionTaxReductionMax, 0)
※ 취득세 감면 = 취득세액 - 140만원 (최대). 남은 금액이 0 미만이면 0원.
```

### 7-3. ICE 취득세

```
iceAcquisitionTax = vehiclePrice * 0.07
```

### 7-4. 자동차세 (연간)

```
evVehicleTax = 130_000  // 정액
iceVehicleTax = engineDisplacementCC * 19 * (1 + 0.30)
// 배기량 1600cc 이하: 18원/cc, 초과: 19원/cc (지방세법)
// 지방교육세 30% 가산
```

### 7-5. 연간 연료비

```
// EV
evAnnualFuelCost =
  annualMileageKm / energyEfficiency *
  (slowChargingRatio * slowChargingRate + (1 - slowChargingRatio) * fastChargingRate)

// ICE
iceAnnualFuelCost =
  annualMileageKm / fuelEfficiency * fuelPricePerLiter
```

### 7-6. 연간 자동차세 — 조기납부 감면 미적용 기준

```
// 연간 납부액 기준. 조기납부(1월) 시 10% 감면 — 계산기에서는 기본 적용 제외, 옵션으로 제공
```

### 7-7. 5년·N년 TCO

```
evTco =
  evEffectivePrice
  + evAcquisitionTax
  + evVehicleTax * years
  + evAnnualFuelCost * years
  + annualMaintenance * years
  + annualInsurance * years

iceTco =
  iceVehiclePrice
  + iceAcquisitionTax
  + iceVehicleTax * years
  + iceAnnualFuelCost * years
  + annualMaintenance * years
  + annualInsurance * years
```

### 7-8. 손익분기점

```
// 연도별 EV·ICE 누적비용을 계산해 교차 연도 탐색
for year = 1 to comparisonYears:
  evCumulative(year) = evTco(year)
  iceCumulative(year) = iceTco(year)
  if evCumulative(year) <= iceCumulative(year): breakeven = year

// 월 단위 보간
// 전년 차이와 당해년 차이로 선형 보간
```

### 7-9. 월 연료비 차이

```
monthlyFuelDiff =
  (iceAnnualFuelCost - evAnnualFuelCost) / 12
```

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/ev-vs-ice-cost-calculator.astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  EVC_META, EVC_DEFAULT_EV, EVC_DEFAULT_ICE, EVC_DEFAULT_COMMON,
  EVC_FUEL_PRICES, EVC_PRESETS, EVC_SUBSIDY_REFERENCE,
  EVC_FAQ, EVC_RELATED_LINKS, EVC_SEO_INTRO,
  EVC_ACQUISITION_TAX, EVC_VEHICLE_TAX, EVC_CHARGING_RATES,
} from "../../data/evVsIceCostCalculator";
---
```

주요 섹션 흐름:

```astro
<SimpleToolShell calculatorId="ev-vs-ice-cost-calculator" pageClass="evc-page" resultFirst={false}>

  <Fragment slot="hero">
    <CalculatorHero eyebrow="자동차 비용 비교" title="전기차 vs 내연기관 총비용 비교" ... />
    <InfoNotice title="계산 전 확인" lines={[EVC_META.caution, "정비비·보험료는 추정값입니다...", "보조금은 지자체·차종 조건에 따라 달라집니다."]} />
  </Fragment>

  <Fragment slot="actions">
    <ToolActionBar resetId="evcResetBtn" copyId="evcCopyBtn" />
  </Fragment>

  <!-- Aside: 공통 설정 -->
  <Fragment slot="aside">
    <!-- 연간 주행거리 슬라이더 -->
    <!-- 비교 기간 select -->
    <!-- 충전 단가 조정 (접힘 영역) -->
    <!-- 유가 조정 -->
  </Fragment>

  <!-- 프리셋 -->
  <div class="evc-presets">
    {EVC_PRESETS.map(p => <button class="evc-preset-btn" data-preset={p.id}>{p.label}</button>)}
  </div>

  <!-- 차량 설정 카드 (EV / ICE) -->
  <section class="evc-vehicle-cards panel">
    <div class="evc-vehicle-card evc-vehicle-card--ev">EV 설정</div>
    <div class="evc-vehicle-card evc-vehicle-card--ice">ICE 설정</div>
  </section>

  <!-- KPI -->
  <div class="evc-kpi-grid">
    <article class="evc-kpi-card evc-kpi-card--main">
      <span>N년 TCO 차이</span>
      <strong id="evcTcoDiff">-</strong>
      <small id="evcTcoDiffLabel">-</small>
    </article>
    <article class="evc-kpi-card">
      <span>월 연료비 차이</span>
      <strong id="evcMonthlyFuelDiff">-</strong>
    </article>
    <article class="evc-kpi-card">
      <span>손익분기점</span>
      <strong id="evcBreakeven">-</strong>
    </article>
    <article class="evc-kpi-card">
      <span>EV 실구매가</span>
      <strong id="evcEffectivePrice">-</strong>
    </article>
  </div>

  <!-- 항목별 비용 분해표 -->
  <section class="evc-breakdown-section panel">
    <table class="evc-breakdown-table">
      <thead><tr><th>항목</th><th>전기차</th><th>내연기관</th></tr></thead>
      <tbody>
        <tr><td>실구매가</td><td id="evcEvEffPrice">-</td><td id="evcIceEffPrice">-</td></tr>
        <tr><td>취득세</td><td id="evcEvAcqTax">-</td><td id="evcIceAcqTax">-</td></tr>
        <tr><td>자동차세 (기간 합계)</td><td id="evcEvVehTax">-</td><td id="evcIceVehTax">-</td></tr>
        <tr><td>연료비 (기간 합계)</td><td id="evcEvFuel">-</td><td id="evcIceFuel">-</td></tr>
        <tr><td>정비비 (기간 합계)</td><td id="evcEvMaint">-</td><td id="evcIceMaint">-</td></tr>
        <tr><td>보험료 (기간 합계)</td><td id="evcEvInsur">-</td><td id="evcIceInsur">-</td></tr>
        <tr class="evc-breakdown-table__total"><td>총보유비용 (TCO)</td><td id="evcEvTco">-</td><td id="evcIceTco">-</td></tr>
      </tbody>
    </table>
    <p class="evc-breakdown-note">※ 정비비·보험료는 <span class="evc-badge evc-badge--estimate">추정</span>값입니다.</p>
  </section>

  <!-- 손익분기점 그래프 -->
  <section class="evc-chart-section panel">
    <h2>누적 총비용 비교 그래프</h2>
    <canvas id="evcBreakevenChart" height="280"></canvas>
    <p class="evc-chart-note">* 연도별 누적 비용. 교차점이 손익분기점입니다.</p>
  </section>

  <!-- 충전 방식별 비용 안내 -->
  <section class="evc-charging-guide panel">...</section>

  <!-- 보조금 참고표 -->
  <section class="evc-subsidy-section panel">...</section>

  <!-- 관련 CTA -->
  <section class="evc-related-section panel">...</section>

  <Fragment slot="seo">
    <SeoContent introTitle="전기차가 진짜로 저렴한지 알려면" intro={EVC_SEO_INTRO}
      inputPoints={EVC_INPUT_POINTS} criteria={EVC_CRITERIA}
      faq={EVC_FAQ} related={EVC_RELATED_LINKS} />
  </Fragment>

</SimpleToolShell>

<script id="evcConfig" type="application/json" set:html={JSON.stringify(config)} />
<script type="module" src={withBase("/scripts/ev-vs-ice-cost-calculator.js")}></script>
```

---

## 9. 클라이언트 스크립트 설계

파일: `public/scripts/ev-vs-ice-cost-calculator.js`

### 9-1. 설정 로드

```js
const config = JSON.parse(document.getElementById("evcConfig").textContent);
const { defaults, fuelPrices, acquisitionTax, vehicleTax, presets } = config;
```

### 9-2. 상태

```js
const state = {
  ev: { ...defaults.ev },
  ice: { ...defaults.ice },
  common: { ...defaults.common },
};
```

### 9-3. 핵심 함수

```js
function calcEvAcquisitionTax(price, reductionMax) { /* max(price*0.07 - reductionMax, 0) */ }
function calcIceAcquisitionTax(price) { /* price * 0.07 */ }
function calcEvVehicleTax() { /* 고정 13만원 */ }
function calcIceVehicleTax(cc) { /* cc * 19 * 1.3 */ }
function calcEvAnnualFuel(mileage, efficiency, slowRatio, slowRate, fastRate) { }
function calcIceAnnualFuel(mileage, efficiency, pricePerL) { }
function calcTco(ev, ice, common, years) { /* 항목별 합산 */ }
function calcBreakeven(ev, ice, common) { /* 연도별 누적비용 탐색 */ }
function buildYearlyCumulative(ev, ice, common, maxYears) { /* 연도별 배열 */ }
function renderKpi(result) { }
function renderBreakdownTable(result) { }
function renderChart(yearlyCumulative, breakevenYear) { /* Chart.js line */ }
function updateAll() { /* state → 계산 → 렌더 */ }
```

### 9-4. 차트 설정 (Chart.js)

```js
const chartData = {
  labels: years,   // ["1년", "2년", ...]
  datasets: [
    { label: "전기차 누적 비용", data: evCumulativeArr, borderColor: "#2563eb", ... },
    { label: "내연기관 누적 비용", data: iceCumulativeArr, borderColor: "#dc2626", ... },
  ],
};
// 손익분기점: annotation plugin 또는 수직선으로 표시
```

### 9-5. URL 파라미터 동기화

```
?evPrice=55000000&icePrice=45000000&mileage=15000&years=5
```

초기 로드 시 URL 파라미터 → 상태 복원. 슬라이더 변경 시 400ms 디바운스 후 replaceState.

### 9-6. 프리셋 적용

```js
presetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const preset = presets.find(p => p.id === btn.dataset.preset);
    Object.assign(state.ev, preset.ev);
    Object.assign(state.ice, preset.ice);
    syncInputsFromState();
    updateAll();
  });
});
```

---

## 10. 스타일 설계

파일: `src/styles/scss/pages/_ev-vs-ice-cost-calculator.scss`

### 10-1. 클래스 prefix 목록

```text
evc-page
evc-badge / evc-badge--official / evc-badge--reference / evc-badge--estimate / evc-badge--simulation
evc-presets / evc-preset-btn / evc-preset-btn--active
evc-vehicle-cards / evc-vehicle-card / evc-vehicle-card--ev / evc-vehicle-card--ice
evc-vehicle-card__header / evc-vehicle-card__badge / evc-vehicle-card__inputs
evc-kpi-grid / evc-kpi-card / evc-kpi-card--main / evc-kpi-card--positive / evc-kpi-card--caution
evc-breakdown-section / evc-breakdown-table / evc-breakdown-table__total / evc-breakdown-note
evc-chart-section / evc-chart-note
evc-charging-guide / evc-charging-grid / evc-charging-card
evc-subsidy-section / evc-subsidy-table / evc-subsidy-table-wrap
evc-related-section / evc-related-grid / evc-related-card
evc-result-label / evc-result-label--ev / evc-result-label--ice / evc-result-label--neutral
```

### 10-2. 핵심 컬러 시스템

```scss
$ev-blue: #2563eb;       // EV — 파랑
$ice-red: #dc2626;       // ICE — 빨강
$neutral: #374151;       // 중립

.evc-vehicle-card--ev  { border-color: $ev-blue; }
.evc-vehicle-card--ice { border-color: $ice-red; }

.evc-kpi-card--positive { background: #eff6ff; strong { color: $ev-blue; } }
.evc-kpi-card--caution  { background: #fff1f2; strong { color: $ice-red; } }
```

### 10-3. 차량 설정 카드 — 반응형

```scss
.evc-vehicle-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}
```

### 10-4. KPI 그리드

```scss
.evc-kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .evc-kpi-card--main {
    grid-column: 1 / -1;

    @media (min-width: 640px) {
      grid-column: auto;
    }
  }
}
```

### 10-5. 분해표

```scss
.evc-breakdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 9px 10px;
    border-bottom: 1px solid #f3f4f6;
    text-align: right;

    &:first-child { text-align: left; }
  }

  th { background: #f7f7f2; font-size: 12px; font-weight: 800; }

  &__total td {
    font-weight: 900;
    font-size: 14px;
    background: #eff6ff;
    border-top: 2px solid #1d4ed8;
  }
}
```

---

## 11. tools.ts 등록

```ts
{
  slug: "ev-vs-ice-cost-calculator",
  title: "전기차 vs 내연기관 총비용 비교 계산기",
  description: "전기차와 휘발유·디젤·LPG차의 보조금·취득세·충전비·유지비·보험료를 전부 합산해 5년·10년 총보유비용을 비교합니다. 손익분기점 연도를 즉시 확인하세요.",
  order: 25.5,
  eyebrow: "자동차 비용 비교",
  category: "compare",
  iframeReady: true,
  badges: ["신규", "시뮬레이션"],
  previewStats: [
    { label: "비교 항목", value: "TCO 6가지" },
    { label: "손익분기", value: "연도 즉시 계산" },
  ],
},
```

---

## 12. sitemap.xml 등록

```xml
<url>
  <loc>https://bigyocalc.com/tools/ev-vs-ice-cost-calculator/</loc>
  <lastmod>2026-05-31</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.85</priority>
</url>
```

`changefreq: yearly` — 보조금·세제 개편 시 연 1회 업데이트 예상.

---

## 13. QA 체크리스트

- [ ] 프리셋 클릭 시 EV·ICE 입력값이 즉시 반영된다
- [ ] 연간 주행거리 슬라이더 변경 시 모든 결과가 실시간 갱신된다
- [ ] 연료 종류 변경 시 유가 기본값이 자동 전환된다 (휘발유→경유→LPG)
- [ ] 완속 비율 0% (급속만) / 100% (완속만) 극단값에서 계산이 깨지지 않는다
- [ ] 손익분기점이 비교 기간 내에 없을 때 "비교 기간 내 교차 없음" 라벨이 표시된다
- [ ] 분해표 모든 항목에 배지가 표시된다 (공식/참고/추정)
- [ ] Chart.js 그래프가 모바일에서 가로 스크롤 없이 표시된다
- [ ] URL 파라미터로 상태 복원이 된다
- [ ] 리셋 버튼 클릭 시 기본값으로 돌아간다
- [ ] FAQ 8개가 모두 표시된다
- [ ] 관련 계산기 링크가 정상 이동한다
- [ ] `npm run build` 성공

---

## 14. 구현 순서

1. `src/data/evVsIceCostCalculator.ts` — 타입, 기본값, 상수, FAQ, SEO 텍스트
2. `src/pages/tools/ev-vs-ice-cost-calculator.astro` — 정적 구조 (차량 설정 카드, KPI, 분해표, 그래프 캔버스, 보조금 표, CTA)
3. `src/styles/scss/pages/_ev-vs-ice-cost-calculator.scss` — `evc-` 전체 스타일
4. `src/styles/app.scss` — `@use` 추가
5. `src/data/tools.ts` — 등록 (order 25.5)
6. `public/sitemap.xml` — URL 추가
7. `public/scripts/ev-vs-ice-cost-calculator.js` — 계산 로직, Chart.js 그래프, 프리셋, URL 파라미터
8. `src/pages/index.astro` — topicBySlug 추가
9. 모바일 UI 확인 (차량 카드 1열·KPI 2열·그래프 크기)
10. `npm run build` 확인
