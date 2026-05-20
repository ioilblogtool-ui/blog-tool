# 복지급여 수급 자격 계산기 — 설계 문서

> 작성일: 2026-05-19
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 가구원 수·소득·재산·자동차·부양의무자 정보를 입력해 2026년 기준 중위소득 대비 소득인정액과 생계·의료·주거·교육급여 가능성을 간이 진단

---

## 1. 문서 개요

- 구현 대상: `복지급여 수급 자격 계산기`
- slug: `welfare-benefit-eligibility`
- URL: `/tools/welfare-benefit-eligibility/`
- 카테고리: 복지/지원금
- 핵심 검색 의도: "기초생활수급자 자격 계산기", "생계급여 자격", "소득인정액 계산", "주거급여 자격 계산", "차상위계층 조건"
- 핵심 출력: 소득인정액 추정, 기준 중위소득 대비 비율, 급여별 가능성, 예상 생계급여액, 대체 지원 후보
- 핵심 CTA: `/reports/2026-government-welfare-benefits/` + 복지로·주민센터 신청 안내

중요 톤:
- "수급 가능"이라고 단정하지 않는다.
- 결과 라벨은 `가능성 높음`, `경계`, `확인 필요`, `어려움`으로 제한한다.
- 모든 계산 결과는 `자가 점검용 추정`으로 표시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    welfareBenefitEligibility.ts     ← 타입, 2026 기준표, 환산율, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      welfare-benefit-eligibility.astro

public/
  scripts/
    welfare-benefit-eligibility.js

src/styles/scss/pages/
  _welfare-benefit-eligibility.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/welfare-benefit-eligibility';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측 입력, 우측 결과.
- `resultFirst={false}` — 모바일에서 입력 먼저.
- SCSS prefix: `wbe-`
- 입력은 4개 접이식 섹션 또는 탭으로 구성한다.
  - 가구 정보
  - 월 소득
  - 재산·자동차
  - 신청 맥락

```astro
<SimpleToolShell
  calculatorId="welfare-benefit-eligibility"
  pageClass="wbe-page"
  resultFirst={false}
>
```

상단에는 `InfoNotice`를 반드시 노출한다.

```text
이 계산기는 2026년 기준 중위소득과 급여별 선정기준을 바탕으로 한 자가 점검용 추정입니다.
실제 수급 여부는 주민센터 신청 후 소득·재산 공적자료 조사와 가구 특성 확인을 거쳐 결정됩니다.
```

---

## 4. 데이터 모델

```ts
// src/data/welfareBenefitEligibility.ts

export type HouseholdRegion = 'metro' | 'city' | 'rural';
export type HousingType = 'rent' | 'jeonse' | 'own' | 'free';
export type CarType = 'none' | 'general' | 'business' | 'disabled';
export type SupportType = 'livelihood' | 'medical' | 'housing' | 'education';
export type ObligorLevel = 'none' | 'low' | 'high' | 'unknown';
export type BenefitJudgement = 'likely' | 'borderline' | 'needs-check' | 'unlikely';

export interface WbeInput {
  householdSize: number;        // 가구원 수, MVP 1~6
  region: HouseholdRegion;      // 대도시/중소도시/농어촌
  housingType: HousingType;     // 월세/전세/자가/무상거주
  minorChildren: number;        // 미성년 자녀 수
  isSingleParent: boolean;      // 한부모 가구 여부
  hasDisabilityOrElderly: boolean; // 장애·노인·중증질환 가구원 여부

  earnedIncome: number;         // 근로소득 월평균
  businessIncome: number;       // 사업소득 월평균
  propertyIncome: number;       // 이자·배당·임대 등 월평균
  publicTransferIncome: number; // 국민연금·실업급여 등
  privateTransferIncome: number;// 가족 지원 등 반복 지원
  applyWorkDeduction: boolean;  // 근로·사업소득 간이 공제 적용

  housingAsset: number;         // 주거용 재산: 주택·전세보증금 등
  generalAsset: number;         // 일반 재산
  financialAsset: number;       // 금융재산
  debt: number;                 // 인정 가능 부채
  carValue: number;             // 자동차 가액
  carType: CarType;             // 자동차 특례

  hasSupportObligor: boolean;   // 부양의무자 있음
  obligorLevel: ObligorLevel;   // 부양의무자 고소득·고재산 가능성
  hasCrisisReason: boolean;     // 실직·질병·휴폐업 등 긴급복지 후보
  targetBenefits: SupportType[];// 확인하고 싶은 급여
}

export interface BenefitThreshold {
  householdSize: number;
  medianIncome: number;
  livelihood: number;
  medical: number;
  housing: number;
  education: number;
}

export interface BenefitStatus {
  type: SupportType;
  label: string;
  threshold: number;
  incomeRecognized: number;
  gap: number;                  // threshold - incomeRecognized
  ratioToThreshold: number;     // incomeRecognized / threshold
  judgement: BenefitJudgement;
  note: string;
}

export interface WbeResult {
  actualMonthlyIncome: number;
  incomeAfterDeduction: number;
  workIncomeDeduction: number;
  basicAssetDeduction: number;
  assetBaseAfterDebt: number;
  housingAssetMonthlyIncome: number;
  generalAssetMonthlyIncome: number;
  financialAssetMonthlyIncome: number;
  carRiskAmount: number;        // 금액 반영보다 위험도 안내용
  assetMonthlyIncome: number;
  incomeRecognized: number;
  medianIncome: number;
  ratioToMedian: number;
  livelihoodEstimate: number;
  benefitStatuses: BenefitStatus[];
  nearestBenefit: SupportType | null;
  alternativeSupports: AlternativeSupport[];
  warningFlags: WbeWarningFlag[];
}

export interface AlternativeSupport {
  id: 'near-poor' | 'single-parent' | 'emergency' | 'housing-only' | 'education' | 'energy' | 'culture';
  label: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WbeWarningFlag {
  id: 'auto' | 'obligor' | 'asset' | 'medical-obligor' | 'estimate';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface WbePreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<WbeInput>;
}
```

---

## 5. 기준 데이터

### 5-1. 2026년 기준 중위소득

```ts
export const WBE_2026_THRESHOLDS: BenefitThreshold[] = [
  { householdSize: 1, medianIncome: 2564238, livelihood: 820556,  medical: 1025695, housing: 1230834, education: 1282119 },
  { householdSize: 2, medianIncome: 4199292, livelihood: 1343773, medical: 1679717, housing: 2015660, education: 2099646 },
  { householdSize: 3, medianIncome: 5359036, livelihood: 1714892, medical: 2143614, housing: 2572337, education: 2679518 },
  { householdSize: 4, medianIncome: 6494738, livelihood: 2078316, medical: 2597895, housing: 3117474, education: 3247369 },
  { householdSize: 5, medianIncome: 7556719, livelihood: 2418150, medical: 3022688, housing: 3627225, education: 3778360 },
  { householdSize: 6, medianIncome: 8555952, livelihood: 2737905, medical: 3422381, housing: 4106857, education: 4277976 },
];
```

### 5-2. MVP 간이 환산 상수

실제 제도는 기본재산액, 주거용재산 한도액, 자동차 반영 방식, 가구 특성별 공제가 복잡하다. MVP에서는 사용자 이해를 위한 간이 산식으로 처리하고, 모든 결과에 `추정` 배지를 붙인다.

```ts
export const WBE_ASSET_DEDUCTION_BY_REGION: Record<HouseholdRegion, number> = {
  metro: 99000000, // 대도시 간이 기본공제
  city: 77000000,  // 중소도시 간이 기본공제
  rural: 53000000, // 농어촌 간이 기본공제
};

export const WBE_MONTHLY_CONVERSION_RATE = {
  housingAsset: 0.0104,   // 월 1.04% 간이
  generalAsset: 0.0104,
  financialAsset: 0.0626, // 월 6.26% 간이
  carWarningOnly: true,
};

export const WBE_WORK_INCOME_DEDUCTION = {
  basic: 0.30,       // 근로·사업소득 30% 간이 공제
  max: 600000,       // MVP 상한, 청년·특례는 본문에서 확인 필요 안내
};
```

주의:
- 위 환산율은 구현 편의를 위한 MVP 간이값이다.
- 실제 복지로 모의계산과 다를 수 있으므로 `InfoNotice`, 결과 카드, FAQ에 반복 고지한다.
- 자동차는 금액으로 강하게 반영하지 않고 위험 플래그 중심으로 표현한다.

---

## 6. 계산 로직

### 6-1. 실제 월 소득 합계

```text
actualMonthlyIncome =
  earnedIncome
  + businessIncome
  + propertyIncome
  + publicTransferIncome
  + privateTransferIncome
```

### 6-2. 근로·사업소득 간이 공제

```text
workIncomeBase = earnedIncome + businessIncome
workIncomeDeduction =
  applyWorkDeduction ? min(workIncomeBase × 30%, 600,000원) : 0

incomeAfterDeduction =
  max(actualMonthlyIncome - workIncomeDeduction, 0)
```

결과에는 아래처럼 표시한다.

```text
근로·사업소득 공제는 실제 제도상 연령·급여 종류·가구 특성에 따라 달라질 수 있어 간이 적용했습니다.
```

### 6-3. 재산의 소득환산액

```text
totalAsset = housingAsset + generalAsset + financialAsset
basicAssetDeduction = WBE_ASSET_DEDUCTION_BY_REGION[region]
assetBaseAfterDebt = max(totalAsset - basicAssetDeduction - debt, 0)
```

공제 후 남은 재산을 재산 종류 비중에 따라 나눈다.

```text
assetRatio = assetBaseAfterDebt / max(totalAsset, 1)

housingAssetMonthlyIncome =
  housingAsset × assetRatio × housingAssetRate

generalAssetMonthlyIncome =
  generalAsset × assetRatio × generalAssetRate

financialAssetMonthlyIncome =
  financialAsset × assetRatio × financialAssetRate

assetMonthlyIncome =
  housingAssetMonthlyIncome
  + generalAssetMonthlyIncome
  + financialAssetMonthlyIncome
```

### 6-4. 자동차 위험도

```text
if carType === 'none' OR carValue === 0:
  위험 없음

if carType === 'business' OR carType === 'disabled':
  "특례 확인 필요" info

if carType === 'general' AND carValue > 0:
  "자동차 반영 확인 필요" warning

if carType === 'general' AND carValue >= 10000000:
  "자동차 때문에 조사 결과가 크게 달라질 수 있음" danger
```

자동차 가액은 `incomeRecognized`에 강하게 합산하지 않고 `warningFlags`와 자연어 메시지에서 다룬다. 실제 자동차 반영 방식은 예외가 많아 단순 산출이 위험하기 때문이다.

### 6-5. 소득인정액

```text
incomeRecognized =
  incomeAfterDeduction
  + assetMonthlyIncome
```

```text
ratioToMedian = incomeRecognized / medianIncome
```

### 6-6. 급여별 판정

```text
ratioToThreshold = incomeRecognized / threshold

if ratioToThreshold <= 0.95:
  judgement = 'likely'
if 0.95 < ratioToThreshold <= 1.05:
  judgement = 'borderline'
if ratioToThreshold > 1.05:
  judgement = 'unlikely'
```

의료급여 예외:

```text
if type === 'medical' AND (hasSupportObligor || obligorLevel === 'high' || obligorLevel === 'unknown'):
  judgement = 'needs-check'
  note = '의료급여는 부양의무자 기준 확인이 필요할 수 있습니다.'
```

판정 라벨:

| 내부값 | 표시 라벨 | 색상 |
|---|---|---|
| likely | 가능성 높음 | 초록 |
| borderline | 경계 | 노랑 |
| needs-check | 확인 필요 | 파랑 |
| unlikely | 어려움 | 회색 |

### 6-7. 예상 생계급여액

```text
livelihoodEstimate =
  max(livelihoodThreshold - incomeRecognized, 0)
```

표시 문구:

```text
생계급여는 선정기준이 최저보장수준 역할을 하므로 간단히 선정기준 - 소득인정액으로 추정했습니다.
실제 지급액은 조사 결과와 타 급여 반영에 따라 달라질 수 있습니다.
```

### 6-8. 대체 지원 후보

```text
nearPoor:
  ratioToMedian <= 0.55 OR education judgement is borderline/unlikely near threshold

singleParent:
  isSingleParent && minorChildren > 0

emergency:
  hasCrisisReason === true

housingOnly:
  housing likely/borderline && livelihood unlikely

education:
  minorChildren > 0 && education likely/borderline

energy/culture:
  any basic benefit likely OR nearPoor candidate
```

---

## 7. 프리셋 초안

```ts
export const WBE_PRESETS: WbePreset[] = [
  {
    id: 'youth-part-time',
    label: '1인 청년 아르바이트',
    summary: '월소득 80만 · 금융재산 300만',
    input: {
      householdSize: 1,
      region: 'metro',
      housingType: 'rent',
      earnedIncome: 800000,
      financialAsset: 3000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: 'single-parent',
    label: '2인 한부모 가구',
    summary: '월소득 160만 · 전세 5천만',
    input: {
      householdSize: 2,
      region: 'city',
      housingType: 'jeonse',
      minorChildren: 1,
      isSingleParent: true,
      earnedIncome: 1600000,
      housingAsset: 50000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: 'family-four',
    label: '4인 저소득 맞벌이',
    summary: '월소득 250만 · 월세 · 금융 500만',
    input: {
      householdSize: 4,
      region: 'metro',
      housingType: 'rent',
      minorChildren: 2,
      earnedIncome: 2500000,
      financialAsset: 5000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: 'senior-alone',
    label: '노인 단독 가구',
    summary: '이전소득 70만 · 자가 소액',
    input: {
      householdSize: 1,
      region: 'rural',
      housingType: 'own',
      publicTransferIncome: 700000,
      housingAsset: 40000000,
      hasDisabilityOrElderly: true,
    },
  },
  {
    id: 'car-risk',
    label: '자동차 보유 가구',
    summary: '3인 · 월소득 170만 · 차량 1,200만',
    input: {
      householdSize: 3,
      region: 'city',
      earnedIncome: 1700000,
      carValue: 12000000,
      carType: 'general',
      applyWorkDeduction: true,
    },
  },
];
```

---

## 8. 페이지 IA

1. **Hero** — 제목: "복지급여 수급 자격 계산기", 부제: "2026년 기준 중위소득으로 생계·의료·주거·교육급여 가능성을 간이 확인하세요"
2. **InfoNotice** — 공식 판정 아님, 자가 점검용 추정, 실제 신청은 복지로·주민센터 확인
3. **프리셋 버튼 5개**
4. **입력 패널**
   - 가구 정보
   - 월 소득
   - 재산·자동차
   - 신청 맥락
5. **KPI 카드 4개**
   - 소득인정액 추정
   - 기준 중위소득 대비 비율
   - 예상 생계급여액
   - 가장 가까운 지원 후보
6. **급여별 판정 매트릭스**
7. **기준선 게이지**
8. **소득인정액 분해 막대**
9. **주의 플래그 카드**
   - 자동차 확인 필요
   - 부양의무자 확인 필요
   - 재산 반영 확인 필요
10. **대체 지원 후보 카드**
11. **신청 체크리스트**
12. **공식 확인 CTA**
13. **정부 복지지원금 리포트 CTA**
14. **SeoContent**

---

## 9. 입력 UI 상세

### 9-1. 가구 정보

| 필드 | 타입 | 기본값 | 유효성 |
|---|---|---:|---|
| 가구원 수 | segmented/stepper | 4 | min 1, max 6 |
| 거주 지역 | radio | metro | metro/city/rural |
| 주거 형태 | select | rent | rent/jeonse/own/free |
| 미성년 자녀 수 | number | 0 | min 0, max 10 |
| 한부모 가구 | checkbox | false | — |
| 장애·노인·중증질환 가구원 | checkbox | false | — |

보조 문구:
- 가구원 수: "MVP는 1~6인 기준표를 사용합니다. 7인 이상은 주민센터 상담으로 확인하세요."
- 거주 지역: "재산 기본공제액 간이 적용에 사용됩니다."

### 9-2. 월 소득

| 필드 | 타입 | 기본값 | 유효성 |
|---|---|---:|---|
| 근로소득 | number | 1,500,000 | min 0 |
| 사업소득 | number | 0 | min 0 |
| 재산소득 | number | 0 | min 0 |
| 공적이전소득 | number | 0 | min 0 |
| 사적이전소득 | number | 0 | min 0 |
| 근로·사업소득 간이 공제 | checkbox | true | — |

보조 문구:
- "월평균 기준으로 입력하세요."
- "일용근로·프리랜서 소득은 최근 3개월 평균을 권장합니다."

### 9-3. 재산·자동차

| 필드 | 타입 | 기본값 | 유효성 |
|---|---|---:|---|
| 주거용 재산 | number | 50,000,000 | min 0 |
| 일반 재산 | number | 0 | min 0 |
| 금융재산 | number | 5,000,000 | min 0 |
| 부채 | number | 0 | min 0 |
| 자동차 가액 | number | 0 | min 0 |
| 자동차 구분 | select | none | none/general/business/disabled |

보조 문구:
- 전세보증금은 주거용 재산에 입력.
- 예금·적금·주식·보험 해지환급금은 금융재산에 입력.
- 자동차는 실제 제도상 반영 방식이 복잡하므로 결과에서 별도 확인 필요로 안내.

### 9-4. 신청 맥락

| 필드 | 타입 | 기본값 |
|---|---|---|
| 부양의무자 있음 | checkbox | false |
| 부양의무자 고소득·고재산 가능성 | select | unknown |
| 최근 위기 사유 있음 | checkbox | false |
| 확인할 급여 | checkbox group | 전체 |

보조 문구:
- 부양의무자: "의료급여 등은 별도 확인이 필요할 수 있습니다."
- 위기 사유: "실직·질병·휴폐업·가정폭력·화재 등 갑작스러운 위기 상황"

---

## 10. 결과 UI 상세

### 10-1. KPI 카드

| 카드 | 레이블 | 표시값 | 스타일 |
|---|---|---|---|
| Main | 소득인정액 추정 | 월 X만 원 | `wbe-kpi-card--main` |
| 일반 | 기준 중위소득 대비 | X% | — |
| Accent | 예상 생계급여액 | 월 X만 원 | 가능성 높을 때 강조 |
| 일반 | 가장 가까운 지원 | 주거급여/교육급여 등 | — |

### 10-2. 급여별 판정 매트릭스

| 급여 | 선정기준 | 내 소득인정액 | 차이 | 판정 |
|---|---:|---:|---:|---|
| 생계급여 | X원 | X원 | +X원 / -X원 | 가능성 높음 |
| 의료급여 | X원 | X원 | +X원 / -X원 | 확인 필요 |
| 주거급여 | X원 | X원 | +X원 / -X원 | 경계 |
| 교육급여 | X원 | X원 | +X원 / -X원 | 어려움 |

모바일에서는 카드 리스트로 전환한다.

### 10-3. 기준선 게이지

- 가로 막대 하나에 기준 중위소득 0~50% 범위를 표시.
- 마커:
  - 생계 32%
  - 의료 40%
  - 주거 48%
  - 교육 50%
  - 내 소득인정액 위치
- `incomeRecognized / medianIncome`이 60%를 넘으면 막대 끝에 "기준 초과" 라벨.

### 10-4. 소득인정액 분해

| 항목 | 표시 |
|---|---|
| 공제 후 월 소득 | 금액 + 비율 |
| 주거용 재산 환산액 | 금액 + 비율 |
| 일반 재산 환산액 | 금액 + 비율 |
| 금융재산 환산액 | 금액 + 비율 |

Chart.js stacked bar 또는 CSS bar로 구현한다. 데이터가 0이면 빈 상태 문구 표시.

### 10-5. 자연어 결과 메시지

```text
4인 가구 기준으로 입력하신 값을 적용하면
소득인정액은 월 약 185만 원으로 추정됩니다.

2026년 생계급여 선정기준 207만 8,316원보다 약 22만 원 낮아
생계급여 신청 가능성이 있는 구간입니다.

다만 자동차·금융재산·부양의무자 정보는 실제 조사에서 다르게 반영될 수 있으므로
복지로 모의계산 또는 주소지 주민센터 상담으로 최종 확인하세요.
```

### 10-6. 경고/확인 카드

| 조건 | 카드 제목 | 심각도 |
|---|---|---|
| 일반 자동차 보유 | 자동차 반영 확인 필요 | warning |
| 차량 1,000만 원 이상 | 자동차 때문에 결과가 달라질 수 있어요 | danger |
| 의료급여 + 부양의무자 있음/모름 | 의료급여 부양의무자 확인 필요 | warning |
| 재산 환산액 비중 40% 이상 | 재산 반영이 결과에 크게 작용했습니다 | info |
| 모든 결과 공통 | 실제 신청 전 공적자료 확인 필요 | info |

### 10-7. 대체 지원 후보 카드

| 후보 | 노출 조건 | 문구 |
|---|---|---|
| 차상위계층 | 기준 중위소득 50~55% 전후 | "수급자 기준은 넘더라도 차상위 혜택을 확인해보세요." |
| 한부모가족 지원 | 한부모 + 자녀 | "한부모가족 아동양육비 등 별도 지원을 확인하세요." |
| 긴급복지 | 위기 사유 있음 | "최근 위기 사유가 있다면 긴급복지 신청 가능성이 있습니다." |
| 주거급여 단독 | 생계 어려움 + 주거 가능/경계 | "생계급여와 별개로 주거급여만 가능할 수 있습니다." |
| 교육급여 | 자녀 있음 + 교육 가능/경계 | "학생 자녀가 있다면 교육급여를 별도로 확인하세요." |

---

## 11. JavaScript 설계

```js
// public/scripts/welfare-benefit-eligibility.js
(() => {
  const DATA = JSON.parse(document.getElementById('wbe-data').textContent);
  let activePanel = 'household';

  const state = {
    householdSize: 4,
    region: 'metro',
    housingType: 'rent',
    minorChildren: 0,
    isSingleParent: false,
    hasDisabilityOrElderly: false,
    earnedIncome: 1500000,
    businessIncome: 0,
    propertyIncome: 0,
    publicTransferIncome: 0,
    privateTransferIncome: 0,
    applyWorkDeduction: true,
    housingAsset: 50000000,
    generalAsset: 0,
    financialAsset: 5000000,
    debt: 0,
    carValue: 0,
    carType: 'none',
    hasSupportObligor: false,
    obligorLevel: 'unknown',
    hasCrisisReason: false,
    targetBenefits: ['livelihood', 'medical', 'housing', 'education'],
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }
  function fmtWon(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
  function fmtMan(n) { return Math.round(n / 10000).toLocaleString('ko-KR') + '만 원'; }
  function fmtPct(n) { return Math.round(n * 100).toLocaleString('ko-KR') + '%'; }

  function getThreshold(size) {
    return DATA.thresholds.find(row => row.householdSize === size) || DATA.thresholds[3];
  }

  function calcWorkDeduction(s) {
    if (!s.applyWorkDeduction) return 0;
    const workIncome = s.earnedIncome + s.businessIncome;
    return Math.min(workIncome * DATA.workDeduction.basic, DATA.workDeduction.max);
  }

  function calcAssetMonthlyIncome(s) {
    const totalAsset = s.housingAsset + s.generalAsset + s.financialAsset;
    const basicAssetDeduction = DATA.assetDeductions[s.region] || DATA.assetDeductions.metro;
    const assetBaseAfterDebt = Math.max(0, totalAsset - basicAssetDeduction - s.debt);
    const ratio = totalAsset > 0 ? assetBaseAfterDebt / totalAsset : 0;

    const housingAssetMonthlyIncome = s.housingAsset * ratio * DATA.rates.housingAsset;
    const generalAssetMonthlyIncome = s.generalAsset * ratio * DATA.rates.generalAsset;
    const financialAssetMonthlyIncome = s.financialAsset * ratio * DATA.rates.financialAsset;

    return {
      basicAssetDeduction,
      assetBaseAfterDebt,
      housingAssetMonthlyIncome,
      generalAssetMonthlyIncome,
      financialAssetMonthlyIncome,
      assetMonthlyIncome:
        housingAssetMonthlyIncome + generalAssetMonthlyIncome + financialAssetMonthlyIncome,
    };
  }

  function judgeBenefit(type, threshold, incomeRecognized, s) {
    const ratio = incomeRecognized / threshold;
    let judgement = 'unlikely';
    if (ratio <= 0.95) judgement = 'likely';
    else if (ratio <= 1.05) judgement = 'borderline';

    if (type === 'medical' && (s.hasSupportObligor || s.obligorLevel === 'high' || s.obligorLevel === 'unknown')) {
      judgement = 'needs-check';
    }
    return judgement;
  }

  function buildWarnings(s, r) {
    const warnings = [{
      id: 'estimate',
      title: '자가 점검용 추정입니다',
      message: '실제 수급 여부는 주민센터 신청 후 공적자료 조사로 결정됩니다.',
      severity: 'info',
    }];

    if (s.carType === 'general' && s.carValue > 0) {
      warnings.push({
        id: 'auto',
        title: s.carValue >= 10000000 ? '자동차 때문에 결과가 크게 달라질 수 있어요' : '자동차 반영 확인 필요',
        message: '자동차는 용도·가액·장애인용·생업용 여부에 따라 반영 방식이 달라질 수 있습니다.',
        severity: s.carValue >= 10000000 ? 'danger' : 'warning',
      });
    }

    if (s.hasSupportObligor || s.obligorLevel === 'high' || s.obligorLevel === 'unknown') {
      warnings.push({
        id: 'obligor',
        title: '부양의무자 기준 확인 필요',
        message: '의료급여 등 일부 급여는 부양의무자 정보가 실제 판정에 영향을 줄 수 있습니다.',
        severity: 'warning',
      });
    }

    if (r.assetMonthlyIncome > r.incomeRecognized * 0.4) {
      warnings.push({
        id: 'asset',
        title: '재산 환산액 비중이 큽니다',
        message: '재산 공제·부채 인정 여부에 따라 최종 결과가 달라질 수 있습니다.',
        severity: 'info',
      });
    }

    return warnings;
  }

  function buildAlternatives(s, statuses, ratioToMedian) {
    const byType = Object.fromEntries(statuses.map(item => [item.type, item]));
    const list = [];

    if (ratioToMedian <= 0.55 || byType.education?.judgement === 'borderline') {
      list.push({ id: 'near-poor', label: '차상위계층', reason: '기준 중위소득 50% 전후 구간입니다.', priority: 'high' });
    }
    if (s.isSingleParent && s.minorChildren > 0) {
      list.push({ id: 'single-parent', label: '한부모가족 지원', reason: '미성년 자녀가 있는 한부모 가구입니다.', priority: 'high' });
    }
    if (s.hasCrisisReason) {
      list.push({ id: 'emergency', label: '긴급복지', reason: '최근 위기 사유가 있다면 별도 신청을 확인하세요.', priority: 'high' });
    }
    if (byType.housing && ['likely', 'borderline'].includes(byType.housing.judgement) && byType.livelihood?.judgement === 'unlikely') {
      list.push({ id: 'housing-only', label: '주거급여 별도 확인', reason: '생계급여와 별개로 주거급여만 가능할 수 있습니다.', priority: 'medium' });
    }
    if (s.minorChildren > 0 && byType.education && ['likely', 'borderline'].includes(byType.education.judgement)) {
      list.push({ id: 'education', label: '교육급여', reason: '학생 자녀가 있다면 교육급여를 확인하세요.', priority: 'medium' });
    }

    return list;
  }

  function calculate(s) {
    const threshold = getThreshold(s.householdSize);
    const actualMonthlyIncome =
      s.earnedIncome + s.businessIncome + s.propertyIncome
      + s.publicTransferIncome + s.privateTransferIncome;
    const workIncomeDeduction = calcWorkDeduction(s);
    const incomeAfterDeduction = Math.max(0, actualMonthlyIncome - workIncomeDeduction);
    const asset = calcAssetMonthlyIncome(s);
    const incomeRecognized = incomeAfterDeduction + asset.assetMonthlyIncome;
    const ratioToMedian = incomeRecognized / threshold.medianIncome;

    const types = ['livelihood', 'medical', 'housing', 'education'];
    const labels = { livelihood: '생계급여', medical: '의료급여', housing: '주거급여', education: '교육급여' };
    const statuses = types.map(type => {
      const benefitThreshold = threshold[type];
      const judgement = judgeBenefit(type, benefitThreshold, incomeRecognized, s);
      return {
        type,
        label: labels[type],
        threshold: benefitThreshold,
        incomeRecognized,
        gap: benefitThreshold - incomeRecognized,
        ratioToThreshold: incomeRecognized / benefitThreshold,
        judgement,
        note: type === 'medical' && judgement === 'needs-check'
          ? '부양의무자 기준 확인 필요'
          : '',
      };
    });

    const nearest = statuses
      .filter(item => item.gap >= 0)
      .sort((a, b) => a.gap - b.gap)[0]?.type ?? null;

    const partialResult = {
      actualMonthlyIncome,
      incomeAfterDeduction,
      workIncomeDeduction,
      ...asset,
      incomeRecognized,
      medianIncome: threshold.medianIncome,
      ratioToMedian,
      livelihoodEstimate: Math.max(0, threshold.livelihood - incomeRecognized),
      benefitStatuses: statuses,
      nearestBenefit: nearest,
      assetMonthlyIncome: asset.assetMonthlyIncome,
    };

    return {
      ...partialResult,
      alternativeSupports: buildAlternatives(s, statuses, ratioToMedian),
      warningFlags: buildWarnings(s, partialResult),
    };
  }

  function renderKpis(result) {}
  function renderBenefitMatrix(result) {}
  function renderGauge(result) {}
  function renderBreakdown(result) {}
  function renderWarnings(result) {}
  function renderAlternatives(result) {}
  function renderChecklist(state) {}
  function renderMessage(result, state) {}
  function syncUrl(state) {}
  function restoreFromUrl() {}
  function applyPreset(id) {}

  function readInputs() {
    state.householdSize = clamp(num(q('[data-wbe="householdSize"]')?.value, 4), 1, 6);
    state.region = q('[data-wbe="region"]')?.value || 'metro';
    state.housingType = q('[data-wbe="housingType"]')?.value || 'rent';
    state.minorChildren = clamp(num(q('[data-wbe="minorChildren"]')?.value, 0), 0, 10);
    state.isSingleParent = q('[data-wbe="isSingleParent"]')?.checked ?? false;
    state.hasDisabilityOrElderly = q('[data-wbe="hasDisabilityOrElderly"]')?.checked ?? false;

    state.earnedIncome = num(q('[data-wbe="earnedIncome"]')?.value, 0);
    state.businessIncome = num(q('[data-wbe="businessIncome"]')?.value, 0);
    state.propertyIncome = num(q('[data-wbe="propertyIncome"]')?.value, 0);
    state.publicTransferIncome = num(q('[data-wbe="publicTransferIncome"]')?.value, 0);
    state.privateTransferIncome = num(q('[data-wbe="privateTransferIncome"]')?.value, 0);
    state.applyWorkDeduction = q('[data-wbe="applyWorkDeduction"]')?.checked ?? true;

    state.housingAsset = num(q('[data-wbe="housingAsset"]')?.value, 0);
    state.generalAsset = num(q('[data-wbe="generalAsset"]')?.value, 0);
    state.financialAsset = num(q('[data-wbe="financialAsset"]')?.value, 0);
    state.debt = num(q('[data-wbe="debt"]')?.value, 0);
    state.carValue = num(q('[data-wbe="carValue"]')?.value, 0);
    state.carType = q('[data-wbe="carType"]')?.value || 'none';

    state.hasSupportObligor = q('[data-wbe="hasSupportObligor"]')?.checked ?? false;
    state.obligorLevel = q('[data-wbe="obligorLevel"]')?.value || 'unknown';
    state.hasCrisisReason = q('[data-wbe="hasCrisisReason"]')?.checked ?? false;
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderKpis(result);
    renderBenefitMatrix(result);
    renderGauge(result);
    renderBreakdown(result);
    renderWarnings(result);
    renderAlternatives(result);
    renderChecklist(state);
    renderMessage(result, state);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-wbe]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    qa('[data-wbe-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.wbePreset));
    });
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터:

```text
hh / region / house / child / single / special
earned / biz / prop / public / private / wd
hasset / gasset / fasset / debt / car / cartype
obligor / obligorLevel / crisis
```

---

## 12. SCSS 설계

```scss
.wbe-page {
  .wbe-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .wbe-preset-btn {
    border: 1px solid #dce6e2;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    background: #fff;
    color: #374151;
    cursor: pointer;

    &.is-active {
      background: #0f6e56;
      border-color: #0f6e56;
      color: #fff;
    }
  }

  .wbe-input-section {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 14px;
    background: #fff;
  }

  .wbe-input-section__title {
    font-size: 0.92rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 12px;
  }

  .wbe-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .wbe-kpi-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #f8faf9;

    p {
      margin: 0 0 6px;
      font-size: 0.78rem;
      color: #6b7280;
    }

    strong {
      display: block;
      font-size: 1.18rem;
      font-weight: 900;
      color: #111827;
      line-height: 1.25;
    }

    span {
      display: block;
      margin-top: 4px;
      font-size: 0.74rem;
      color: #6b7280;
    }

    &--main {
      background: #e1f5ee;
      border-color: #0f6e56;

      strong {
        color: #0f6e56;
        font-size: 1.34rem;
      }
    }

    &--accent {
      background: #f0f7ff;
      border-color: #bfdbfe;
    }
  }

  .wbe-benefit-table-wrap {
    overflow-x: auto;
    margin-top: 20px;
  }

  .wbe-benefit-table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: 0.86rem;

    th,
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
    }

    th {
      text-align: left;
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }

    td:not(:first-child) {
      text-align: right;
    }
  }

  .wbe-status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 74px;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 0.74rem;
    font-weight: 800;

    &--likely {
      background: #dcfce7;
      color: #166534;
    }

    &--borderline {
      background: #fef3c7;
      color: #92400e;
    }

    &--needs-check {
      background: #dbeafe;
      color: #1e40af;
    }

    &--unlikely {
      background: #f3f4f6;
      color: #4b5563;
    }
  }

  .wbe-gauge {
    position: relative;
    height: 18px;
    margin: 28px 0 36px;
    border-radius: 999px;
    background: linear-gradient(90deg, #dcfce7 0 64%, #fef3c7 64% 96%, #fee2e2 96% 100%);
  }

  .wbe-gauge-marker {
    position: absolute;
    top: -8px;
    width: 2px;
    height: 34px;
    background: #111827;

    span {
      position: absolute;
      top: 36px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-size: 0.68rem;
      font-weight: 700;
      color: #374151;
    }

    &--mine {
      width: 4px;
      background: #0f6e56;
      z-index: 2;
    }
  }

  .wbe-breakdown-list {
    display: grid;
    gap: 10px;
    margin-top: 20px;
  }

  .wbe-breakdown-row {
    display: grid;
    grid-template-columns: 120px 1fr 90px;
    align-items: center;
    gap: 10px;
    font-size: 0.84rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .wbe-breakdown-bar {
    height: 10px;
    border-radius: 999px;
    background: #e5e7eb;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: #0f6e56;
    }
  }

  .wbe-warning-grid,
  .wbe-alternative-grid {
    display: grid;
    gap: 12px;
    margin-top: 20px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .wbe-warning-card,
  .wbe-alternative-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 14px 16px;
    background: #fff;
  }

  .wbe-warning-card--warning {
    border-color: #fbbf24;
    background: #fffbeb;
  }

  .wbe-warning-card--danger {
    border-color: #fca5a5;
    background: #fff5f5;
  }

  .wbe-message {
    margin-top: 20px;
    border-left: 3px solid #0f6e56;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    background: #f8faf9;
    font-size: 0.88rem;
    line-height: 1.75;
    color: #374151;
  }

  .wbe-official-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 24px;
    background: #f0f7ff;
  }
}
```

---

## 13. SEO 설계

```text
title: 기초생활수급자 자격 계산기 - 2026 생계·의료·주거·교육급여 기준 확인
description: 가구원 수, 소득, 재산, 자동차 정보를 입력하면 2026년 기준 중위소득 대비 소득인정액과 생계·의료·주거·교육급여 수급 가능성을 간이 계산합니다.
H1: 복지급여 수급 자격 계산기
```

JSON-LD:
- `WebApplication`
- `FAQPage`

키워드:
- 기초생활수급자 자격 계산기
- 생계급여 자격
- 소득인정액 계산
- 주거급여 자격 계산
- 차상위계층 조건
- 2026 기준 중위소득

---

## 14. SeoContent 초안

### introTitle

`복지급여 수급 자격 계산기 — 2026년 기준 중위소득으로 신청 가능성을 먼저 확인하세요`

### intro

1. 기초생활보장 급여는 단순 월급이 아니라 소득인정액을 기준으로 판단합니다. 소득인정액은 실제 월 소득에 재산을 월 소득처럼 환산한 금액을 더한 값입니다. 이 계산기는 2026년 기준 중위소득과 급여별 선정기준을 바탕으로 우리 집이 어느 기준선에 가까운지 간이 확인할 수 있도록 설계했습니다.

2. 2026년 기준으로 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다. 예를 들어 4인 가구 기준 중위소득은 월 6,494,738원이며, 생계급여 선정기준은 월 2,078,316원입니다.

3. 이 계산기는 소득평가액과 재산 소득환산액을 나누어 보여줍니다. 소득은 낮지만 금융재산·전세보증금·자동차 때문에 결과가 달라질 수 있는 경우를 확인할 수 있도록 재산 반영 비중과 자동차 확인 필요 메시지를 별도로 표시합니다.

4. 생계급여는 선정기준에서 소득인정액을 뺀 금액으로 예상액을 추정할 수 있습니다. 다만 실제 지급액은 공적자료 조사, 가구 특성, 타 급여 반영, 부양의무자 기준 등에 따라 달라질 수 있습니다. 결과는 신청 전 자가 점검용으로만 활용하세요.

5. 수급 기준에서 조금 넘는다고 모든 지원이 끝나는 것은 아닙니다. 차상위계층, 한부모가족 지원, 긴급복지, 주거급여 단독 신청, 교육급여, 에너지바우처, 문화누리카드처럼 별도 기준으로 확인할 수 있는 제도가 있습니다. 결과 화면에서는 상황별 대체 지원 후보도 함께 안내합니다.

### inputPoints

- 가구원 수와 2026년 기준 중위소득에 따른 급여별 기준선을 확인할 수 있습니다.
- 월 소득과 재산을 입력해 소득인정액을 간이 추정할 수 있습니다.
- 생계·의료·주거·교육급여 가능성과 대체 지원 후보를 함께 볼 수 있습니다.

### criteria

- 기준 중위소득과 급여별 선정기준은 2026년 보건복지부 기준을 사용합니다.
- 소득인정액 계산은 실제 제도를 단순화한 자가 점검용 추정입니다.
- 자동차·부양의무자·재산 특례는 실제 조사에서 달라질 수 있어 확인 필요로 표시합니다.
- 최종 수급 여부는 복지로 또는 주소지 읍면동 주민센터에서 확인해야 합니다.

### FAQ

```ts
export const WBE_FAQ = [
  {
    question: '이 계산기로 실제 수급 여부를 확정할 수 있나요?',
    answer: '아니요. 이 계산기는 신청 전 자가 점검용 간이 계산기입니다. 실제 수급 여부는 주민센터 신청 후 소득·재산 공적자료 조사와 가구 특성 확인을 거쳐 결정됩니다.',
  },
  {
    question: '소득인정액이 무엇인가요?',
    answer: '소득인정액은 단순 월급이 아니라 월 소득에 재산을 월 소득처럼 환산한 금액을 더한 값입니다. 그래서 소득이 낮아도 재산이나 자동차가 있으면 결과가 달라질 수 있습니다.',
  },
  {
    question: '생계급여와 주거급여 기준이 다른가요?',
    answer: '네. 2026년 기준으로 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다.',
  },
  {
    question: '생계급여 예상액은 어떻게 계산하나요?',
    answer: '간단히는 생계급여 선정기준에서 소득인정액을 뺀 금액으로 추정합니다. 다만 실제 지급액은 지자체 조사 결과와 다른 급여 반영 여부에 따라 달라질 수 있습니다.',
  },
  {
    question: '자동차가 있으면 무조건 탈락하나요?',
    answer: '무조건은 아닙니다. 자동차의 용도, 가액, 배기량, 장애인·생업용 여부 등에 따라 다르게 판단될 수 있습니다. 이 계산기에서는 자동차 보유 시 확인 필요 경고를 표시합니다.',
  },
  {
    question: '부양의무자 기준은 아직 있나요?',
    answer: '급여 종류에 따라 다릅니다. 생계급여는 부양의무자 기준이 크게 완화되었지만, 의료급여 등에서는 부양의무자 확인이 중요할 수 있습니다. 결과 화면에서는 급여별로 확인 필요 여부를 분리해 안내합니다.',
  },
  {
    question: '수급자가 아니어도 받을 수 있는 지원이 있나요?',
    answer: '가능합니다. 소득인정액이 기준 중위소득 50% 전후라면 차상위계층, 자녀가 있는 한부모 가구라면 한부모가족 지원, 갑작스러운 실직·질병이 있다면 긴급복지를 함께 확인할 수 있습니다.',
  },
  {
    question: '어디에서 신청하나요?',
    answer: '온라인은 복지로에서 확인할 수 있고, 오프라인은 주소지 읍면동 주민센터에서 상담·신청할 수 있습니다. 정확한 서류는 가구 상황에 따라 달라질 수 있습니다.',
  },
];
```

---

## 15. 관련 링크

- `/reports/2026-government-welfare-benefits/` — 2026 정부 복지지원금 완전 정복
- `/tools/daycare-vs-kindergarten-cost/` — 어린이집 vs 유치원 비용 계산기
- `/tools/year-end-tax-refund-calculator/` — 연말정산 환급액 계산기
- `/reports/daycare-kindergarten-cost-2026/` — 2026 어린이집·유치원 비용 리포트
- `/reports/newlywed-cost-2026/` — 2026 신혼부부 생활비 리포트

---

## 16. 접근성·개인정보 설계

- 소득·재산 입력값은 브라우저에서만 계산한다.
- 서버 전송이 없음을 `InfoNotice` 또는 입력 하단에 표시한다.
- 색상만으로 판정을 전달하지 않고 라벨 텍스트를 함께 표시한다.
- 게이지 마커에는 `aria-label`을 제공한다.
- 테이블은 모바일에서 가로 스크롤 또는 카드형으로 전환한다.
- 외부 링크는 새 탭이며 `rel="noopener noreferrer"` 적용.
- 제휴 링크가 생길 경우 `nofollow`와 제휴 고지를 추가한다.

---

## 17. QA 체크리스트

- [ ] 가구원 수 1~6 각각 기준 중위소득·급여별 선정기준이 정확히 매핑됨
- [ ] 7인 이상 입력 불가 또는 별도 안내 표시
- [ ] 모든 숫자 입력에서 쉼표 포함 값 정상 파싱
- [ ] 소득·재산이 모두 0일 때 NaN 미노출, 결과 정상 표시
- [ ] 부채가 재산보다 커도 재산 환산액 0 미만으로 내려가지 않음
- [ ] 자동차 일반 선택 + 가액 입력 시 확인 필요 카드 노출
- [ ] 자동차 특례 선택 시 단정 대신 "특례 확인 필요" 안내
- [ ] 의료급여 + 부양의무자 있음/모름 선택 시 `확인 필요` 표시
- [ ] 생계급여 예상액은 0원 미만으로 표시되지 않음
- [ ] 판정 라벨 4종 색상과 텍스트가 일치
- [ ] 대체 지원 후보가 조건에 맞게 노출
- [ ] 기준선 게이지에서 내 위치 마커가 0~100% 범위를 벗어나도 UI 깨지지 않음
- [ ] URL 파라미터 복원 정상 동작
- [ ] InfoNotice에 "자가 점검용 추정" 고지 표시
- [ ] SeoContent FAQ 8개 이상 표시
- [ ] 모바일 360px에서 입력·KPI·급여 카드·CTA가 겹치지 않음
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
