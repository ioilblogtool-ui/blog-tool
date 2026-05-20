# 실손보험 환급액 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/silson-insurance-refund-calculator.md`  
> 작성일: 2026-05-19  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 병원 영수증의 급여·비급여 금액 입력 → 세대별 자기부담률·통원 공제·연간 한도 반영 → 예상 환급액 산출

---

## 1. 문서 개요

- 구현 대상: `실손보험 환급액 계산기`
- slug: `silson-insurance-refund-calculator`
- URL: `/tools/silson-insurance-refund-calculator/`
- 카테고리: 보험
- 핵심 검색 의도: "실손보험 환급금 계산", "실비보험 환급액 계산기", "MRI 실손보험 얼마", "도수치료 실비 환급"
- 핵심 출력: 예상 실수령 환급액, 청구 가능 금액, 예상 자기부담금, 연간 한도 잔여액, 4세대 비급여 누적 구간
- 안전 원칙: 실제 보험금 확정 표현 금지. 모든 결과는 `예상`, `참고`, `약관 확인 필요`로 표시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    silsonInsuranceRefundCalculator.ts   ← 타입, 세대별 기본값, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      silson-insurance-refund-calculator.astro

public/
  scripts/
    silson-insurance-refund-calculator.js

src/styles/scss/pages/
  _silson-insurance-refund-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/silson-insurance-refund-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 홈 노출 대상이면 보험/의료비 토픽에 추가
- `public/og/silson-insurance-refund-calculator.png` 또는 OG 생성 스크립트 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반.
- 모바일은 입력 먼저, 결과는 입력 직후 바로 이어진다.
- 데스크톱은 좌측 입력 패널, 우측 결과 패널 구조.
- 입력은 3단계 그룹으로 나눈다.
  - Step 1: 보험 조건
  - Step 2: 영수증 금액
  - Step 3: 약관 조건 직접 수정
- SCSS prefix: `sir-`
- 모든 금액은 원 단위 입력, 화면 출력은 `원/만원` 혼합 표기.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="silson-insurance-refund-calculator"
  pageClass="sir-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 보험금 예상 고지 `InfoNotice`
3. 계산기 입력 영역
4. 결과 KPI 카드
5. 항목별 환급 분해표
6. 4세대 비급여 누적 구간 안내
7. 영수증 입력 가이드
8. 세대별 기본값 비교표
9. 청구 전 서류 체크리스트
10. 관련 리포트/계산기 CTA
11. `SeoContent` FAQ

---

## 5. 데이터 모델

```ts
// src/data/silsonInsuranceRefundCalculator.ts

export type SilsonGeneration = 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'custom';
export type VisitType = 'outpatient' | 'inpatient';
export type HospitalType = 'clinic' | 'generalHospital' | 'tertiaryHospital' | 'custom';
export type ReceiptItemType =
  | 'covered'
  | 'nonCoveredGeneral'
  | 'manualTherapy'
  | 'nonCoveredInjection'
  | 'mriMra'
  | 'prescription';

export interface SilsonGenerationPreset {
  id: SilsonGeneration;
  label: string;
  salePeriod: string;
  coveredCoinsuranceRate: number;
  nonCoveredCoinsuranceRate: number;
  specialNonCoveredCoinsuranceRate: number;
  outpatientDeductible: number;
  outpatientLimit: number;
  annualLimit: number;
  description: string;
  caution: string;
}

export interface SilsonRefundInput {
  generation: SilsonGeneration;
  visitType: VisitType;
  hospitalType: HospitalType;
  hasSpecialNonCoveredRider: boolean;

  coveredPatientPaid: number;
  nonCoveredGeneral: number;
  manualTherapy: number;
  nonCoveredInjection: number;
  mriMra: number;
  prescriptionCost: number;

  coveredCoinsuranceRate: number;
  nonCoveredCoinsuranceRate: number;
  specialNonCoveredCoinsuranceRate: number;
  outpatientDeductible: number;
  outpatientLimit: number;
  annualLimit: number;
  claimedThisYear: number;
  nonCoveredBenefitThisYear: number;
}

export interface SilsonRefundBreakdownItem {
  id: ReceiptItemType;
  label: string;
  inputAmount: number;
  eligibleAmount: number;
  coinsuranceRate: number;
  deductibleAmount: number;
  estimatedRefund: number;
  note: string;
}

export interface SilsonRefundResult {
  totalPaid: number;
  eligibleAmount: number;
  totalDeductibleAmount: number;
  grossRefundBeforeLimit: number;
  estimatedRefund: number;
  remainingAnnualLimit: number;
  nonCoveredBenefitThisClaim: number;
  nonCoveredBenefitAfterClaim: number;
  nonCoveredTierLabel: string;
  nonCoveredTierDescription: string;
  breakdown: SilsonRefundBreakdownItem[];
  warnings: string[];
}

export interface SilsonRefundPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<SilsonRefundInput>;
}

export interface SilsonFaq {
  q: string;
  a: string;
}
```

---

## 6. 세대별 기본값

`custom`을 제외한 세대 선택 시 아래 값을 폼에 자동 반영한다. 사용자는 모든 값을 직접 수정할 수 있어야 한다.

```ts
export const SILSON_GENERATION_PRESETS: SilsonGenerationPreset[] = [
  {
    id: 'gen1',
    label: '1세대',
    salePeriod: '2009년 9월 이전',
    coveredCoinsuranceRate: 0.1,
    nonCoveredCoinsuranceRate: 0.1,
    specialNonCoveredCoinsuranceRate: 0.1,
    outpatientDeductible: 5000,
    outpatientLimit: 300000,
    annualLimit: 50000000,
    description: '표준화 이전 상품으로 회사별 약관 차이가 큽니다.',
    caution: '보험증권 기준 직접 입력을 권장합니다.',
  },
  {
    id: 'gen2',
    label: '2세대',
    salePeriod: '2009년 10월~2017년 3월',
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.2,
    specialNonCoveredCoinsuranceRate: 0.2,
    outpatientDeductible: 10000,
    outpatientLimit: 250000,
    annualLimit: 50000000,
    description: '표준화 실손으로 선택형 여부에 따라 자기부담률이 다를 수 있습니다.',
    caution: '선택형/표준형 여부를 확인하세요.',
  },
  {
    id: 'gen3',
    label: '3세대',
    salePeriod: '2017년 4월~2021년 6월',
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.2,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 10000,
    outpatientLimit: 250000,
    annualLimit: 50000000,
    description: '3대 비급여 특약 가입 여부가 중요합니다.',
    caution: '도수치료·비급여주사·MRI/MRA 특약을 확인하세요.',
  },
  {
    id: 'gen4',
    label: '4세대',
    salePeriod: '2021년 7월 이후',
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.3,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 30000,
    outpatientLimit: 200000,
    annualLimit: 50000000,
    description: '급여와 비급여가 분리되고 비급여 보험료 차등제가 적용됩니다.',
    caution: '비급여 보험금 누적액을 함께 확인하세요.',
  },
];
```

> 1세대와 2세대는 상품 차이가 크므로 기본값은 보수적 예시로만 사용한다. 결과 영역에 약관 확인 안내를 항상 표시한다.

---

## 7. 계산 로직

### 7-1. 금액 분류

```text
총 병원비 =
  급여 본인부담금
  + 일반 비급여
  + 도수·체외충격파·증식치료
  + 비급여 주사료
  + MRI/MRA
  + 처방조제비

3대 비급여 금액 =
  도수·체외충격파·증식치료
  + 비급여 주사료
  + MRI/MRA
```

### 7-2. 항목별 환급액

```text
항목별 자기부담금 = 항목 금액 × 자기부담률
항목별 환급 기초액 = max(항목 금액 - 항목별 자기부담금, 0)
```

3대 비급여 특약이 꺼져 있으면:

```text
3대 비급여 eligibleAmount = 0
3대 비급여 estimatedRefund = 0
warning = "3대 비급여 특약 미가입으로 입력한 도수치료·주사·MRI 항목은 환급 계산에서 제외했습니다."
```

### 7-3. 통원 공제와 한도

v1은 이해하기 쉬운 간이 추정으로 설계한다.

```text
환급 기초액 합계 = 항목별 환급 기초액 합산

통원 공제 후 금액 =
  진료 구분이 통원이면 max(환급 기초액 합계 - 통원 최소 공제금액, 0)
  진료 구분이 입원이면 환급 기초액 합계

통원 한도 반영 =
  진료 구분이 통원이면 min(통원 공제 후 금액, 통원 회당 한도)
  진료 구분이 입원이면 통원 공제 후 금액
```

> 실제 약관은 급여/비급여별 최소 공제와 비율 공제 중 큰 금액을 적용하는 방식이 다를 수 있다. v2에서 `coveredDeductible`, `nonCoveredDeductible`을 분리한다.

### 7-4. 연간 한도

```text
연간 잔여 한도 = max(연간 한도 - 올해 이미 청구한 보험금, 0)
예상 실수령 환급액 = min(통원 한도 반영 금액, 연간 잔여 한도)
한도 차감 후 잔여액 = max(연간 잔여 한도 - 예상 실수령 환급액, 0)
```

### 7-5. 4세대 비급여 누적 구간

```text
이번 비급여 보험금 =
  일반 비급여 환급액
  + 3대 비급여 환급액

청구 후 비급여 누적액 =
  올해 비급여 보험금 누적액 + 이번 비급여 보험금
```

구간 라벨:

| 누적액 | 라벨 | UI 톤 |
| ---: | --- | --- |
| 0원 | 할인 가능 구간 | positive |
| 1원~999,999원 | 유지 가능 구간 | neutral |
| 1,000,000원~1,499,999원 | 할증 주의 구간 | caution |
| 1,500,000원~2,999,999원 | 높은 할증 가능 구간 | warning |
| 3,000,000원 이상 | 최대 할증 가능 구간 | danger |

---

## 8. 클라이언트 스크립트 구조

```js
(function () {
  const root = document.querySelector('[data-calculator="silson-insurance-refund-calculator"]');
  if (!root) return;

  const state = {
    generation: 'gen4',
    visitType: 'outpatient',
    hospitalType: 'clinic',
    hasSpecialNonCoveredRider: true,
    coveredPatientPaid: 50000,
    nonCoveredGeneral: 0,
    manualTherapy: 0,
    nonCoveredInjection: 0,
    mriMra: 0,
    prescriptionCost: 0,
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.3,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 30000,
    outpatientLimit: 200000,
    annualLimit: 50000000,
    claimedThisYear: 0,
    nonCoveredBenefitThisYear: 0,
  };

  function calculate(input) {}
  function render(result) {}
  function syncFromForm() {}
  function syncToUrl() {}
  function restoreFromUrl() {}
  function applyGenerationPreset(id) {}

  restoreFromUrl();
  render(calculate(state));
})();
```

필수 인터랙션:

- 입력 변경 시 즉시 계산
- 세대 변경 시 기본 자기부담률/공제/한도 자동 반영
- `직접 입력` 선택 시 자동 반영 중단
- 통원/입원 변경 시 통원 공제·회당 한도 영역 표시/숨김
- 3대 비급여 특약 체크 해제 시 도수치료·주사·MRI 결과 0원 처리
- URL 파라미터 저장/복원
- 프리셋 버튼 클릭 시 상태 일괄 반영

---

## 9. Astro 마크업 설계

### 9-1. Frontmatter

```astro
---
import BaseLayout from '../../components/BaseLayout.astro';
import SimpleToolShell from '../../components/SimpleToolShell.astro';
import CalculatorHero from '../../components/CalculatorHero.astro';
import InfoNotice from '../../components/InfoNotice.astro';
import SeoContent from '../../components/SeoContent.astro';
import {
  SILSON_REFUND_META,
  SILSON_GENERATION_PRESETS,
  SILSON_REFUND_PRESETS,
  SILSON_REFUND_FAQ,
  SILSON_REFUND_RELATED,
} from '../../data/silsonInsuranceRefundCalculator';
---
```

### 9-2. 주요 DOM ID

| DOM | 용도 |
| --- | --- |
| `#sir-generation` | 실손보험 세대 |
| `#sir-visit-type` | 통원/입원 |
| `#sir-covered-patient-paid` | 급여 본인부담금 |
| `#sir-non-covered-general` | 일반 비급여 |
| `#sir-manual-therapy` | 도수치료 등 |
| `#sir-non-covered-injection` | 비급여 주사 |
| `#sir-mri-mra` | MRI/MRA |
| `#sir-estimated-refund` | 예상 실수령 환급액 |
| `#sir-eligible-amount` | 청구 가능 금액 |
| `#sir-deductible` | 예상 자기부담금 |
| `#sir-remaining-limit` | 연간 한도 잔여액 |
| `#sir-breakdown-body` | 상세 분해표 tbody |
| `#sir-non-covered-tier` | 4세대 누적 구간 |

---

## 10. 결과 UI 설계

### 10-1. KPI 카드

| 카드 | 표시 | 클래스 |
| --- | --- | --- |
| 예상 실수령 환급액 | `estimatedRefund` | `report-stat-card--primary` |
| 청구 가능 금액 | `eligibleAmount` | 기본 |
| 예상 자기부담금 | `totalDeductibleAmount` | 기본 |
| 연간 한도 잔여액 | `remainingAnnualLimit` | `report-stat-card--accent` |

카드 하단에는 작은 문구를 붙인다.

```text
약관과 심사 결과에 따라 실제 지급액은 달라질 수 있습니다.
```

### 10-2. 항목별 분해표

| 항목 | 입력 금액 | 보장대상 | 자기부담 | 예상 환급 | 비고 |
| --- | ---: | ---: | ---: | ---: | --- |
| 급여 본인부담금 | 50,000원 | 50,000원 | 10,000원 | 40,000원 | 급여 |
| 일반 비급여 | 0원 | 0원 | 0원 | 0원 | 비급여 |
| 도수치료 | 120,000원 | 120,000원 | 36,000원 | 84,000원 | 3대 비급여 |

모바일에서는 `.table-scroll` 래퍼로 가로 스크롤 처리한다.

### 10-3. 4세대 비급여 누적 구간

- 4세대 선택 시 강조 표시
- 1~3세대 선택 시 접거나 "4세대 선택 시 적용" 문구 노출
- 게이지는 0원, 100만 원, 150만 원, 300만 원 눈금

---

## 11. 입력 UX 설계

### Step 1. 보험 조건

| 필드 | UI | 비고 |
| --- | --- | --- |
| 진료 구분 | segmented control | 통원/입원 |
| 실손보험 세대 | select 또는 pill radio | 선택 시 기본값 자동 반영 |
| 의료기관 유형 | select | v1은 안내용, v2에서 공제 자동화 |
| 3대 비급여 특약 | checkbox/toggle | 3세대·4세대에서 강조 |
| 올해 청구액 | number | 연간 한도 차감 |
| 올해 비급여 보험금 | number | 4세대 누적 구간 |

### Step 2. 영수증 금액

| 필드 | UI | 입력 도움말 |
| --- | --- | --- |
| 급여 본인부담금 | money input | 공단부담금은 입력하지 않음 |
| 일반 비급여 | money input | 영수증 비급여 중 3대 비급여 제외 |
| 도수·체외충격파·증식치료 | money input | 3대 비급여 |
| 비급여 주사료 | money input | 3대 비급여 |
| MRI/MRA | money input | 3대 비급여 |
| 처방조제비 | money input | 약국 영수증이 있을 때 입력 |

### Step 3. 약관 조건

기본은 접힌 상태의 `advanced panel`로 제공한다.

| 필드 | UI |
| --- | --- |
| 급여 자기부담률 | select: 0%, 10%, 20%, 직접 |
| 비급여 자기부담률 | select: 10%, 20%, 30%, 직접 |
| 3대 비급여 자기부담률 | select: 20%, 30%, 직접 |
| 통원 최소 공제금액 | money input |
| 통원 회당 한도 | money input |
| 연간 한도 | money input |

---

## 12. 프리셋 시나리오

```ts
export const SILSON_REFUND_PRESETS: SilsonRefundPreset[] = [
  {
    id: 'mri-gen4',
    label: '4세대 MRI 통원',
    description: 'MRI 60만 원 검사 후 예상 환급액을 확인합니다.',
    input: {
      generation: 'gen4',
      visitType: 'outpatient',
      hasSpecialNonCoveredRider: true,
      mriMra: 600000,
    },
  },
  {
    id: 'manual-gen3',
    label: '3세대 도수치료',
    description: '도수치료 12만 원, 3대 비급여 특약 기준입니다.',
    input: {
      generation: 'gen3',
      visitType: 'outpatient',
      hasSpecialNonCoveredRider: true,
      manualTherapy: 120000,
    },
  },
  {
    id: 'small-outpatient',
    label: '소액 통원',
    description: '급여 본인부담 1만 5천 원 청구 실익을 확인합니다.',
    input: {
      generation: 'gen4',
      visitType: 'outpatient',
      coveredPatientPaid: 15000,
    },
  },
  {
    id: 'inpatient-surgery',
    label: '입원 수술비',
    description: '입원 진료비 급여 100만 원, 비급여 80만 원 예시입니다.',
    input: {
      generation: 'gen2',
      visitType: 'inpatient',
      coveredPatientPaid: 1000000,
      nonCoveredGeneral: 800000,
    },
  },
];
```

---

## 13. 상태 저장 URL 파라미터

공유 가능한 링크를 위해 주요 값만 URL에 저장한다.

| 파라미터 | 필드 |
| --- | --- |
| `gen` | generation |
| `visit` | visitType |
| `covered` | coveredPatientPaid |
| `noncovered` | nonCoveredGeneral |
| `manual` | manualTherapy |
| `injection` | nonCoveredInjection |
| `mri` | mriMra |
| `claimed` | claimedThisYear |
| `nb` | nonCoveredBenefitThisYear |

예시:

```text
/tools/silson-insurance-refund-calculator/?gen=gen4&visit=outpatient&mri=600000&nb=1200000
```

---

## 14. SEO 콘텐츠 설계

`SeoContent` props:

```astro
<SeoContent
  introTitle="실손보험 환급액 계산기 — 영수증 보는 법"
  intro={[
    '실손보험 환급액은 병원비 전체가 아니라 환자가 실제 부담한 금액, 급여·비급여 구분, 자기부담률, 통원 공제금액에 따라 달라집니다.',
    '이 계산기는 병원 영수증의 주요 금액을 입력해 예상 환급액을 빠르게 확인하고, 청구 전 확인해야 할 서류와 약관 조건을 함께 정리합니다.',
  ]}
  inputPoints={[
    '급여 본인부담금과 비급여 금액을 나눠 입력합니다.',
    '1~4세대 실손보험 기본값을 선택하거나 내 약관 기준으로 직접 수정합니다.',
    '4세대 실손은 비급여 보험금 누적 구간을 함께 확인합니다.',
  ]}
  criteria={[
    '세대별 대표 자기부담률을 사용한 참고 계산입니다.',
    '실제 보험금은 보험회사, 약관, 특약, 면책사항, 심사 결과에 따라 달라질 수 있습니다.',
    '공단부담금은 사용자가 낸 금액이 아니므로 계산에서 제외합니다.',
    '도수치료·비급여 주사·MRI/MRA는 3대 비급여 특약 가입 여부를 확인해야 합니다.',
  ]}
  faq={SILSON_REFUND_FAQ}
  related={SILSON_REFUND_RELATED}
/>
```

---

## 15. FAQ

```ts
export const SILSON_REFUND_FAQ = [
  {
    q: '이 계산기의 결과가 실제 보험금과 같나요?',
    a: '아니요. 입력한 금액과 세대별 대표 자기부담률을 바탕으로 한 예상 계산입니다. 실제 보험금은 보험회사, 약관, 특약, 면책사항, 심사 결과에 따라 달라질 수 있습니다.',
  },
  {
    q: '병원 영수증에서 공단부담금도 입력해야 하나요?',
    a: '아니요. 공단부담금은 국민건강보험공단이 부담한 금액이므로 계산기 입력 대상에서 제외합니다. 사용자가 실제 낸 급여 본인부담금과 비급여 금액을 입력하세요.',
  },
  {
    q: '통원 진료비가 적으면 환급액이 0원이 될 수도 있나요?',
    a: '네. 통원은 자기부담률뿐 아니라 최소 공제금액이 적용될 수 있습니다. 병원비가 공제금액보다 작거나 비슷하면 예상 환급액이 0원일 수 있습니다.',
  },
  {
    q: '도수치료와 MRI는 왜 별도로 입력하나요?',
    a: '3세대 이후 실손보험에서는 도수치료·체외충격파·증식치료, 비급여 주사료, MRI/MRA가 3대 비급여 특약으로 분리되어 한도와 자기부담률이 다르게 적용될 수 있기 때문입니다.',
  },
  {
    q: '4세대 실손은 비급여를 청구하면 보험료가 오르나요?',
    a: '4세대 실손보험은 비급여 보험금 수령액에 따라 갱신 시 비급여 보험료가 할인 또는 할증될 수 있습니다. 실제 적용 여부와 금액은 보험회사 조회 화면에서 확인해야 합니다.',
  },
  {
    q: '1세대 실손도 계산할 수 있나요?',
    a: '가능합니다. 다만 1세대 실손은 보험회사별 약관 차이가 크므로 계산기 기본값보다 보험증권의 자기부담률과 한도를 직접 입력하는 것이 좋습니다.',
  },
];
```

---

## 16. 관련 링크

```ts
export const SILSON_REFUND_RELATED = [
  {
    href: '/reports/silson-insurance-generation-comparison-2026/',
    label: '2026 실손보험 세대별 완전 비교',
  },
  {
    href: '/tools/year-end-tax-refund-calculator/',
    label: '연말정산 환급액 계산기',
  },
  {
    href: '/tools/pregnancy-checkup-cost/',
    label: '임신 주수별 검사비 계산기',
  },
  {
    href: '/tools/fetal-insurance-calculator/',
    label: '태아보험 보험료 계산기',
  },
];
```

---

## 17. SCSS 설계

파일: `src/styles/scss/pages/_silson-insurance-refund-calculator.scss`

주요 클래스:

```scss
.sir-page {}
.sir-form-section {}
.sir-step {}
.sir-step__header {}
.sir-field-grid {}
.sir-segmented {}
.sir-advanced-panel {}
.sir-result-grid {}
.sir-result-note {}
.sir-breakdown {}
.sir-tier-card {}
.sir-tier-gauge {}
.sir-receipt-guide {}
.sir-checklist {}
```

스타일 원칙:

- 색상은 `var(--color-*)` 토큰만 사용
- 보험/의료 페이지이므로 과도한 경고색 남발 금지
- `danger` 톤은 4세대 비급여 300만 원 이상 구간에만 사용
- 카드 안에 카드 중첩 금지
- 표는 모바일 가로 스크롤
- 버튼은 계산 실행 버튼이 아니라 프리셋/공유/초기화 용도로만 사용

---

## 18. 접근성 및 UX 체크

- 모든 입력에 `label` 연결
- 금액 입력에는 `inputmode="numeric"` 적용
- 원 단위 입력 옆에 포맷된 금액 보조 텍스트 표시
- 결과 변화가 큰 KPI 영역은 `aria-live="polite"` 적용
- 색상만으로 위험 구간을 구분하지 않고 텍스트 라벨 병행
- 상세 조건 패널은 `button aria-expanded`로 열고 닫기
- 프리셋 버튼은 선택 상태를 `aria-pressed`로 표시

---

## 19. 고정 안내 문구

### InfoNotice

```text
이 계산기는 입력한 병원비와 세대별 대표 자기부담률을 바탕으로 한 예상 계산입니다.
실제 보험금은 가입한 보험회사, 약관, 특약, 면책사항, 의료기관 서류 심사 결과에 따라 달라질 수 있습니다.
```

### 1~2세대 안내

```text
1세대·2세대 실손보험은 가입 시기와 회사별 약관 차이가 큽니다.
정확한 계산을 위해 보험증권 또는 보험회사 앱에서 자기부담률과 통원 한도를 확인해 주세요.
```

### 3대 비급여 안내

```text
도수치료·체외충격파·증식치료, 비급여 주사료, MRI/MRA는 3대 비급여 특약 가입 여부에 따라 보장 여부와 한도가 달라질 수 있습니다.
```

### 4세대 안내

```text
4세대 실손보험은 비급여 보험금 수령액에 따라 갱신 시 비급여 보험료가 할인 또는 할증될 수 있습니다.
이 계산기는 누적 구간을 참고로 보여주며, 실제 적용 여부는 보험회사 조회 화면에서 확인해야 합니다.
```

---

## 20. 검증 시나리오

| 케이스 | 입력 | 기대 결과 |
| --- | --- | --- |
| 소액 통원 | 4세대, 급여 15,000원, 통원 공제 30,000원 | 예상 환급액 0원 |
| MRI 통원 | 4세대, MRI 600,000원, 특약 있음 | 자기부담 30% 반영, 통원 한도 적용 |
| 특약 없음 | 4세대, MRI 600,000원, 특약 없음 | MRI 환급액 0원, 경고 노출 |
| 입원 수술 | 2세대, 입원, 급여 1,000,000원 + 비급여 800,000원 | 통원 한도 미적용, 연간 한도만 적용 |
| 연간 한도 초과 | annualLimit 1,000,000원, claimedThisYear 950,000원 | 예상 환급액 최대 50,000원 |
| 4세대 할증 주의 | 기존 비급여 1,200,000원 + 이번 비급여 환급 | 할증 주의 이상 구간 표시 |

---

## 21. 구현 체크리스트

### 데이터

- [ ] `SILSON_REFUND_META` 작성
- [ ] `SILSON_GENERATION_PRESETS` 작성
- [ ] `SILSON_REFUND_PRESETS` 작성
- [ ] `SILSON_REFUND_FAQ` 작성
- [ ] `SILSON_REFUND_RELATED` 작성

### 페이지

- [ ] Hero/InfoNotice 구성
- [ ] SimpleToolShell 기반 입력/결과 영역 구성
- [ ] 3단계 입력 폼 구성
- [ ] KPI 카드 4개 구성
- [ ] 항목별 분해표 구성
- [ ] 4세대 비급여 누적 게이지 구성
- [ ] SeoContent 연결

### 스크립트

- [ ] 세대 프리셋 자동 반영
- [ ] 실시간 계산
- [ ] URL 상태 저장/복원
- [ ] 프리셋 적용
- [ ] 금액 포맷팅
- [ ] 경고 메시지 조건부 표시

### 등록

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공 확인

---

## 22. v1/v2 경계

### v1에 포함

- 1~4세대 기본값 선택
- 통원/입원 예상 환급액 계산
- 급여·일반 비급여·3대 비급여 분리 입력
- 통원 공제·회당 한도·연간 한도 직접 수정
- 4세대 비급여 누적 구간 안내
- 영수증 입력 가이드와 청구 서류 체크리스트

### v2로 미룸

- 보험사별 약관 템플릿 선택
- 3대 비급여 항목별 횟수 한도 관리
- 급여/비급여별 통원 공제 독립 계산
- OCR 영수증 인식
- 보험사 앱 청구 딥링크
- 사용자 계산 내역 저장

---

## 23. 최종 구현 방향

이 계산기는 "정확한 보험금 산정기"가 아니라 "청구 전 예상 환급액을 빠르게 확인하는 도구"로 구현한다. 세대별 대표값을 제공하되, 약관 차이가 큰 보험 상품 특성을 고려해 사용자가 자기부담률과 한도를 직접 수정할 수 있게 만드는 것이 핵심이다.

첫 화면에서는 복잡한 약관보다 영수증 금액 입력을 우선하고, 고급 조건은 접힌 패널에 둔다. 결과 화면에서는 예상 환급액만 크게 보여주지 말고, 어떤 항목이 제외되었는지와 왜 자기부담금이 발생했는지를 분해표로 설명해야 한다.
