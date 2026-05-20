# 2026 실손보험 세대별 완전 비교 — 설계 문서

> 기획 원문: `docs/plan/202605/silson-insurance-generation-comparison-2026.md`  
> 작성일: 2026-05-19  
> 콘텐츠 유형: `/reports/` SEO 리포트형 허브 페이지  
> 구현 기준: 1~4세대 실손보험의 보험료·보장·자기부담률·비급여 구조 비교 + 실손보험 환급액 계산기 CTA 연결

---

## 1. 문서 개요

- 구현 대상: `2026 실손보험 세대별 완전 비교`
- slug: `silson-insurance-generation-comparison-2026`
- URL: `/reports/silson-insurance-generation-comparison-2026/`
- 카테고리: 보험
- 핵심 타깃: 1~4세대 실손보험 보유자, 4세대 전환 고민자, 비급여 진료 이용자, 보험 리모델링 검토자
- 핵심 검색 의도: "실손보험 1세대 2세대 3세대 4세대 비교", "4세대 실손보험 전환", "2026 실손보험료 인상률"
- 핵심 CTA: `/tools/silson-insurance-refund-calculator/`
- 안전 원칙: 특정 보험사 추천, 최저가 단정, 전환 강권 금지. 모든 판단은 조건부로 제시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    silsonInsuranceGenerationComparison2026.ts
  pages/
    reports/
      silson-insurance-generation-comparison-2026.astro

public/
  scripts/
    silson-insurance-generation-comparison-2026.js

src/styles/scss/pages/
  _silson-insurance-generation-comparison-2026.scss
```

추가 등록:

- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/silson-insurance-generation-comparison-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 홈 리포트 노출 대상이면 추가
- `src/pages/reports/index.astro` 보험 카테고리 필터/태그 확인
- `public/og/silson-insurance-generation-comparison-2026.png` 또는 OG 생성 대상 추가

---

## 3. 레이아웃 방향

- `BaseLayout` 직접 사용 리포트 페이지.
- 상단은 `CalculatorHero` + `InfoNotice` + KPI 4개.
- 본문은 14개 리포트 섹션을 순서대로 배치한다.
- SCSS prefix: `sigc-`
- pageClass: `report-page sigc-page`
- 표가 많으므로 모든 비교표는 `.table-scroll` 래퍼를 기본 사용한다.
- 보험사별 비교는 추천 카드가 아니라 `약관 확인표` 톤으로 표현한다.

---

## 4. 페이지 IA

1. Hero — H1, 요약, 계산기 CTA
2. InfoNotice — 기준일, 추정/약관 확인 고지
3. KPI 카드 — 평균 인상률, 최고 인상 세대, 4세대 비급여 자기부담, 판단 변수
4. 실손보험 세대 변천사
5. 세대별 보험료 현황 비교
6. 급여/비급여 보장 범위 비교
7. 도수치료·MRI·비급여주사 환급 시뮬레이션
8. 4세대 전환 손익분기 계산
9. 연령대별 유불리 매트릭스
10. 갱신 주기·보험료 인상률 10년 추이
11. 중복 가입 주의사항
12. 청구 거절 사유 TOP 5
13. 실손+종신 vs 실손+정기 결합 비용 비교
14. 2026년 비급여 관리 강화 제도 변화
15. 보험사별 주요 조항 확인표
16. 실손보험 환급액 계산기 CTA
17. 세대별 가입·전환 액션 플랜
18. `SeoContent` FAQ 및 관련 링크

---

## 5. 데이터 모델

파일: `src/data/silsonInsuranceGenerationComparison2026.ts`

```ts
export type SilsonGenerationId = 'gen1' | 'gen2' | 'gen3' | 'gen4';
export type AgeGroup = '20s' | '30s' | '40s' | '50s';
export type UsageLevel = 'low' | 'medium' | 'high';
export type DecisionTone = 'positive' | 'neutral' | 'caution' | 'danger';

export interface SilsonGenerationSummary {
  id: SilsonGenerationId;
  label: string;
  salePeriod: string;
  structure: string;
  coveredCoinsurance: string;
  nonCoveredCoinsurance: string;
  outpatientDeductible: string;
  premiumIncrease2026: string;
  mainFeature: string;
  pros: string[];
  cons: string[];
}

export interface PremiumComparisonRow {
  generation: SilsonGenerationId;
  increaseRate2026: string;
  monthlyPremium30s: string;
  dataStatus: 'collected' | 'needsCollection';
  interpretation: string;
  sourceLabel: string;
}

export interface CoverageComparisonRow {
  item: string;
  gen1: string;
  gen2: string;
  gen3: string;
  gen4: string;
}

export interface RefundScenario {
  id: string;
  label: string;
  medicalCost: number;
  category: 'manualTherapy' | 'mri' | 'injection' | 'bundle';
  description: string;
}

export interface RefundSimulationRow {
  scenarioId: string;
  generation: SilsonGenerationId;
  estimatedRefund: number;
  outOfPocket: number;
  limitNote: string;
  renewalImpact: string;
}

export interface SwitchBreakEvenInput {
  currentGeneration: SilsonGenerationId;
  currentMonthlyPremium: number;
  targetMonthlyPremium: number;
  annualCoveredCost: number;
  annualNonCoveredCost: number;
  outpatientVisits: number;
}

export interface SwitchBreakEvenResult {
  annualPremiumSaving: number;
  estimatedExtraOutOfPocket: number;
  netBenefit: number;
  decisionLabel: string;
  decisionTone: DecisionTone;
  message: string;
}

export interface AgeMatrixRow {
  ageGroup: AgeGroup;
  low: string;
  medium: string;
  high: string;
}

export interface PremiumTrendRow {
  year: number;
  overall: number | null;
  gen1: number | null;
  gen2: number | null;
  gen3: number | null;
  gen4: number | null;
  sourceLabel: string;
}

export interface InsurerClauseRow {
  insurer: string;
  coveredLimit: string;
  nonCoveredLimit: string;
  specialRider: string;
  appClaim: string;
  note: string;
  sourceUrl?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 핵심 데이터 상수

### 6-1. 메타

```ts
export const SIGC_META = {
  title: '2026 실손보험 세대별 완전 비교',
  subtitle:
    '1세대부터 4세대까지 보험료, 자기부담률, 비급여 보장 방식을 비교하고 유지·전환 판단 기준을 정리합니다.',
  methodology:
    '손해보험협회·생명보험협회·금융당국 발표 및 보험사 상품공시실 자료를 기준으로 구성합니다.',
  caution:
    '실제 보험료와 보험금은 보험회사, 가입 시기, 특약, 심사 결과에 따라 달라질 수 있습니다.',
  updatedAt: '2026년 5월 기준',
};
```

### 6-2. KPI

```ts
export const SIGC_KPI = [
  { label: '2026 평균 인상률', value: '약 7.8%', note: '전체 평균 기준' },
  { label: '인상률 최고 세대', value: '4세대', note: '20%대 인상 보도' },
  { label: '4세대 비급여 자기부담', value: '30%', note: '대표 기본값' },
  { label: '전환 판단 변수', value: '비급여 이용액', note: '최근 1년 기준' },
];
```

### 6-3. 세대 요약

```ts
export const SILSON_GENERATIONS: SilsonGenerationSummary[] = [
  {
    id: 'gen1',
    label: '1세대',
    salePeriod: '2009년 9월 이전',
    structure: '표준화 이전 회사별 약관',
    coveredCoinsurance: '상품별 상이',
    nonCoveredCoinsurance: '상품별 상이',
    outpatientDeductible: '상품별 상이',
    premiumIncrease2026: '3%대',
    mainFeature: '보장 폭은 넓지만 보험료 부담이 큰 편',
    pros: ['보장 범위가 넓은 경우가 많음', '비급여 이용이 많으면 유리할 수 있음'],
    cons: ['월 보험료 부담이 큼', '약관 차이가 커 직접 확인 필요'],
  },
  {
    id: 'gen2',
    label: '2세대',
    salePeriod: '2009년 10월~2017년 3월',
    structure: '표준화 실손',
    coveredCoinsurance: '10~20%',
    nonCoveredCoinsurance: '대체로 20%',
    outpatientDeductible: '병원급별 공제',
    premiumIncrease2026: '5%대',
    mainFeature: '보험료와 보장 사이 균형형',
    pros: ['표준화 이후 구조라 비교가 쉬움', '기존 보장 유지 가치가 있음'],
    cons: ['선택형 여부에 따라 차이 존재', '갱신 보험료 부담 가능'],
  },
  {
    id: 'gen3',
    label: '3세대',
    salePeriod: '2017년 4월~2021년 6월',
    structure: '기본형 + 3대 비급여 특약',
    coveredCoinsurance: '10~20%',
    nonCoveredCoinsurance: '대체로 20%',
    outpatientDeductible: '병원급별 공제',
    premiumIncrease2026: '16%대',
    mainFeature: '3대 비급여 특약 가입 여부가 핵심',
    pros: ['4세대보다 비급여 부담이 낮을 수 있음', '특약 구조가 비교적 명확'],
    cons: ['3대 비급여 특약 미가입 시 보장 공백 가능', '2026 인상률 부담'],
  },
  {
    id: 'gen4',
    label: '4세대',
    salePeriod: '2021년 7월 이후',
    structure: '급여 주계약 + 비급여 특약',
    coveredCoinsurance: '20%',
    nonCoveredCoinsurance: '30%',
    outpatientDeductible: '급여/비급여별 최소 공제',
    premiumIncrease2026: '20%대',
    mainFeature: '보험료는 낮지만 비급여 이용액 관리가 중요',
    pros: ['월 보험료가 상대적으로 낮음', '병원 이용이 적으면 효율적'],
    cons: ['비급여 자기부담률 높음', '비급여 보험료 차등제 영향 가능'],
  },
];
```

---

## 7. 인터랙티브 로직

### 7-1. 전환 손익 계산

```ts
export function calculateSwitchBreakEven(
  input: SwitchBreakEvenInput
): SwitchBreakEvenResult {
  const annualPremiumSaving =
    Math.max(input.currentMonthlyPremium - input.targetMonthlyPremium, 0) * 12;

  const estimatedExtraOutOfPocket =
    input.annualCoveredCost * 0.1 +
    input.annualNonCoveredCost * 0.1 +
    input.outpatientVisits * 10000;

  const netBenefit = annualPremiumSaving - estimatedExtraOutOfPocket;

  if (netBenefit >= 300000) {
    return {
      annualPremiumSaving,
      estimatedExtraOutOfPocket,
      netBenefit,
      decisionLabel: '전환 검토 가능',
      decisionTone: 'positive',
      message: '보험료 절감 효과가 추가 본인부담 추정보다 큽니다. 단, 고액 비급여 예정이 있으면 약관을 먼저 확인하세요.',
    };
  }

  if (netBenefit >= 0) {
    return {
      annualPremiumSaving,
      estimatedExtraOutOfPocket,
      netBenefit,
      decisionLabel: '비교 필요',
      decisionTone: 'neutral',
      message: '보험료 절감과 보장 축소가 비슷한 구간입니다. 최근 1년 비급여 이용액을 기준으로 다시 계산하세요.',
    };
  }

  return {
    annualPremiumSaving,
    estimatedExtraOutOfPocket,
    netBenefit,
    decisionLabel: '유지 우선 검토',
    decisionTone: 'caution',
    message: '추가 본인부담 추정이 보험료 절감액보다 큽니다. 기존 세대 유지가 나을 수 있습니다.',
  };
}
```

### 7-2. 필터 상태

```ts
type SigcUiState = {
  selectedGeneration: SilsonGenerationId;
  selectedAgeGroup: AgeGroup;
  selectedUsageLevel: UsageLevel;
  currentMonthlyPremium: number;
  targetMonthlyPremium: number;
  annualCoveredCost: number;
  annualNonCoveredCost: number;
  outpatientVisits: number;
};
```

필수 동작:

- 세대 선택 시 세대 요약 카드 강조
- 연령대/이용량 선택 시 매트릭스 추천 문구 갱신
- 전환 손익 입력 변경 시 결과 카드 즉시 갱신
- CTA 클릭은 계산기 URL로 이동
- URL 파라미터 저장은 선택. 리포트 페이지라 v1에서는 생략 가능

---

## 8. 클라이언트 스크립트 구조

파일: `public/scripts/silson-insurance-generation-comparison-2026.js`

```js
(function () {
  const root = document.querySelector('[data-report="silson-insurance-generation-comparison-2026"]');
  if (!root) return;

  const state = {
    selectedGeneration: 'gen2',
    selectedAgeGroup: '30s',
    selectedUsageLevel: 'medium',
    currentMonthlyPremium: 42000,
    targetMonthlyPremium: 18000,
    annualCoveredCost: 300000,
    annualNonCoveredCost: 500000,
    outpatientVisits: 6,
  };

  function calculateSwitchBreakEven(input) {}
  function updateGenerationCards() {}
  function updateMatrixMessage() {}
  function updateBreakEvenResult() {}
  function bindEvents() {}

  bindEvents();
  updateGenerationCards();
  updateMatrixMessage();
  updateBreakEvenResult();
})();
```

차트:

- 기존 사이트 패턴에 맞춰 Chart.js CDN이 이미 있는 경우만 사용한다.
- Chart.js 미사용 가능성을 열어두고, 기본 구현은 CSS 막대/라인 대체 UI로도 가능하게 설계한다.
- 차트가 비어 보이지 않도록 데이터가 `needsCollection`이면 "공시 수집 후 입력" 배지를 표시한다.

---

## 9. Astro 마크업 설계

### 9-1. Frontmatter

```astro
---
import BaseLayout from '../../components/BaseLayout.astro';
import CalculatorHero from '../../components/CalculatorHero.astro';
import InfoNotice from '../../components/InfoNotice.astro';
import SeoContent from '../../components/SeoContent.astro';
import {
  SIGC_META,
  SIGC_KPI,
  SILSON_GENERATIONS,
  SIGC_PREMIUM_ROWS,
  SIGC_COVERAGE_ROWS,
  SIGC_REFUND_SCENARIOS,
  SIGC_AGE_MATRIX,
  SIGC_PREMIUM_TRENDS,
  SIGC_INSURER_CLAUSES,
  SIGC_FAQ,
  SIGC_RELATED,
} from '../../data/silsonInsuranceGenerationComparison2026';
---
```

### 9-2. 주요 DOM

| DOM | 용도 |
| --- | --- |
| `[data-report="silson-insurance-generation-comparison-2026"]` | 스크립트 루트 |
| `[data-generation-card]` | 세대 카드 |
| `#sigc-generation-select` | 내 세대 선택 |
| `#sigc-age-group` | 연령대 선택 |
| `#sigc-usage-level` | 의료 이용량 선택 |
| `#sigc-current-premium` | 현재 월 보험료 |
| `#sigc-target-premium` | 4세대 예상 월 보험료 |
| `#sigc-covered-cost` | 연간 급여 진료비 |
| `#sigc-non-covered-cost` | 연간 비급여 진료비 |
| `#sigc-outpatient-visits` | 통원 횟수 |
| `#sigc-switch-saving` | 연간 보험료 절감액 |
| `#sigc-extra-out-of-pocket` | 추가 본인부담 추정 |
| `#sigc-net-benefit` | 전환 순효과 |
| `#sigc-decision-label` | 판단 라벨 |

---

## 10. 섹션별 구현 상세

### 10-1. Hero/KPI

- H1: `2026 실손보험 세대별 완전 비교`
- CTA: `내 실손 환급액 계산하기`
- KPI 4개는 `report-stat-card` 패턴 사용.
- `InfoNotice`에는 2026년 5월 기준, 약관·공시 확인 필요 문구를 넣는다.

### 10-2. 세대 변천사

- `SILSON_GENERATIONS`를 타임라인 카드로 렌더링.
- 각 카드에 판매 시기, 구조, 핵심 특징, 장단점 표시.
- 모바일 1열, 태블릿 2열, 데스크톱 4열.

### 10-3. 보험료 현황

- `SIGC_PREMIUM_ROWS` 표 렌더링.
- `monthlyPremium30s`가 `공시 수집 후 입력`이면 회색 배지.
- 2026 인상률은 막대 시각화 추가.

### 10-4. 보장 범위 비교

- `SIGC_COVERAGE_ROWS`를 1~4세대 컬럼 표로 렌더링.
- "상품별 상이" 셀은 `sigc-cell--caution`.
- 4세대 비급여 자기부담 셀은 강조하되 위험 단정은 피한다.

### 10-5. 환급 시뮬레이션

- 탭: 도수치료 / MRI / 비급여 주사 / 묶음.
- 각 탭은 세대별 예상 환급액, 본인부담액, 한도 메모 표시.
- v1 데이터는 예시값으로 두고 "약관별 상이" 배지를 붙인다.
- 하단 CTA: `/tools/silson-insurance-refund-calculator/`

### 10-6. 4세대 전환 손익분기

- 입력: 현재 월 보험료, 4세대 예상 월 보험료, 연간 급여 진료비, 연간 비급여 진료비, 통원 횟수.
- 결과: 연간 보험료 절감액, 추가 본인부담 추정, 전환 순효과, 판단 라벨.
- 라벨: `전환 검토 가능`, `비교 필요`, `유지 우선 검토`.

### 10-7. 연령대별 유불리 매트릭스

- 행: 20대/30대/40대/50대.
- 열: 병원 이용 적음/보통/비급여 이용 많음.
- 사용자가 연령대와 이용량을 선택하면 해당 셀을 강조한다.

### 10-8. 10년 인상률 추이

- `SIGC_PREMIUM_TRENDS` 표와 라인 차트.
- 결측값은 `-`로 표시.
- 출처 라벨과 기준일을 표 하단에 명시.

### 10-9. 중복 가입 주의사항

- 개인실손+개인실손, 개인실손+단체실손, 종합보험 내 실손 특약 상황을 체크리스트로 표시.
- "중복 보상 가능"처럼 오해되는 표현 금지.

### 10-10. 청구 거절 TOP 5

- 순위형 카드.
- 각 카드에 사유, 대처법, 필요한 서류 표시.
- 청구 체크리스트 CTA는 정보성 문구만 사용.

### 10-11. 실손+종신 vs 실손+정기

- 보장 목적 분리 관점으로 설명.
- 상품 추천이 아니라 비용 구조 비교표로 표현.

### 10-12. 2026 제도 변화

- 5세대 실손은 별도 박스로만 다룬다.
- 본문 제목과 검색 의도는 1~4세대 비교 유지.
- 문구: "신규 판매 상품 변화", "보유계약 비교와 구분".

### 10-13. 보험사별 조항 확인표

- 삼성화재, 한화손해보험, 메리츠화재, DB손해보험, 현대해상.
- 약관 링크는 공식 공시실 URL만 사용.
- `추천`, `순위`, `가성비` 표현 금지.

### 10-14. 세대별 액션 플랜

- 현재 세대별로 "먼저 확인할 것", "유지 검토", "전환 검토"를 조건부로 표시.
- 최종 CTA는 계산기와 약관 확인으로 제한.

---

## 11. SEO 콘텐츠 설계

```astro
<SeoContent
  introTitle="2026 실손보험 세대별 비교 — 읽는 법"
  intro={[
    '실손보험은 가입 시기와 세대에 따라 보험료, 자기부담률, 통원 공제, 비급여 보장 방식이 달라집니다.',
    '이 리포트는 1세대부터 4세대까지의 차이를 표와 시뮬레이션으로 정리하고, 4세대 전환 여부를 판단할 때 확인해야 할 기준을 안내합니다.',
  ]}
  inputPoints={[
    '내 실손보험 세대를 확인하고 보험료와 보장 구조를 비교합니다.',
    '도수치료·MRI·비급여 주사처럼 체감 차이가 큰 항목의 환급 구조를 확인합니다.',
    '최근 1년 병원 이용액과 비급여 사용액을 기준으로 유지·전환 판단을 점검합니다.',
  ]}
  criteria={[
    '2026년 5월 기준 공개 자료와 보험협회·보험사 공시 기준으로 정리합니다.',
    '보험료 예시는 성별, 연령, 특약, 보험회사에 따라 달라질 수 있습니다.',
    '5세대 실손은 신규 판매 제도 변화로만 다루고, 본문 비교 대상은 1~4세대 보유계약입니다.',
    '실제 보험금과 보장 여부는 가입 약관과 보험회사 심사 결과를 확인해야 합니다.',
  ]}
  faq={SIGC_FAQ}
  related={SIGC_RELATED}
/>
```

---

## 12. FAQ

```ts
export const SIGC_FAQ: FaqItem[] = [
  {
    q: '2026년 기준 4세대 실손보험이 가장 좋은가요?',
    a: '무조건 그렇지는 않습니다. 4세대는 보험료가 상대적으로 낮지만 급여·비급여 자기부담률이 높고, 비급여 보험금 수령액에 따라 갱신 보험료가 달라질 수 있습니다.',
  },
  {
    q: '1세대 실손은 보험료가 비싸도 유지해야 하나요?',
    a: '1세대는 보장 범위가 넓은 경우가 많지만 보험료 부담이 큽니다. 최근 병원 이용액, 비급여 진료 빈도, 앞으로 예상되는 치료 계획을 기준으로 비교해야 합니다.',
  },
  {
    q: '3세대와 4세대의 가장 큰 차이는 무엇인가요?',
    a: '3세대는 기본형과 3대 비급여 특약 구조가 핵심이고, 4세대는 급여 주계약과 비급여 특약을 더 명확히 분리하면서 비급여 자기부담률과 보험료 차등제를 강화한 것이 핵심입니다.',
  },
  {
    q: '도수치료를 자주 받으면 4세대가 불리한가요?',
    a: '불리할 수 있습니다. 도수치료는 3대 비급여 항목으로 특약 가입 여부, 횟수·한도, 자기부담률이 중요합니다. 4세대는 비급여 보험금 누적액이 갱신 보험료에도 영향을 줄 수 있습니다.',
  },
  {
    q: '실손보험을 여러 개 가입하면 더 많이 받을 수 있나요?',
    a: '일반적으로 실손보험은 실제 손해액을 보상하는 구조이므로 여러 개 가입해도 중복으로 더 많이 받기 어렵습니다.',
  },
  {
    q: '5세대 실손이 나왔는데 이 리포트는 왜 1~4세대만 비교하나요?',
    a: '이 리포트의 핵심 검색 의도는 기존 가입자가 보유한 1~4세대 실손보험의 유지·전환 판단입니다. 5세대는 2026년 신규 판매 상품이므로 제도 변화 섹션에서 별도로 다룹니다.',
  },
];
```

---

## 13. 관련 링크

```ts
export const SIGC_RELATED = [
  {
    href: '/tools/silson-insurance-refund-calculator/',
    label: '실손보험 환급액 계산기',
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

## 14. SCSS 설계

파일: `src/styles/scss/pages/_silson-insurance-generation-comparison-2026.scss`

주요 클래스:

```scss
.sigc-page {}
.sigc-kpi-grid {}
.sigc-timeline {}
.sigc-generation-card {}
.sigc-generation-card--active {}
.sigc-premium-bars {}
.sigc-coverage-table {}
.sigc-simulation-tabs {}
.sigc-simulation-panel {}
.sigc-break-even {}
.sigc-break-even__result {}
.sigc-matrix {}
.sigc-trend-chart {}
.sigc-refusal-list {}
.sigc-system-change {}
.sigc-insurer-table {}
.sigc-action-plan {}
.sigc-cta-band {}
```

스타일 원칙:

- 금융/보험 리포트이므로 차분한 업무형 UI.
- 색상은 토큰 사용: `var(--color-*)`.
- 위험 구간은 텍스트 라벨과 함께 표시.
- 카드 중첩 금지.
- 테이블은 모바일 가로 스크롤.
- CTA는 과도한 상담 유도보다 계산기 연결 중심.

---

## 15. 접근성 및 UX 체크

- 필터 버튼은 `aria-pressed` 사용.
- 탭은 `role="tablist"`, `role="tab"`, `role="tabpanel"` 적용.
- 전환 손익 결과는 `aria-live="polite"`.
- 차트는 표 데이터와 함께 제공해 스크린리더 사용자가 수치를 확인할 수 있게 한다.
- 색상만으로 유불리를 구분하지 않고 라벨 표시.
- 외부 약관 링크는 새 탭, `rel="noopener noreferrer"` 적용.

---

## 16. 고정 안내 문구

### InfoNotice

```text
이 리포트는 2026년 5월 기준 공개 자료와 보험협회·보험사 공시 정보를 바탕으로 정리한 참고 자료입니다.
실제 보험료, 자기부담률, 보장 여부, 보험금 지급액은 가입 시기, 보험회사, 특약, 약관, 심사 결과에 따라 달라질 수 있습니다.
```

### 보험사별 비교 안내

```text
아래 표는 보험사 추천 순위가 아니라 약관 확인을 돕기 위한 체크표입니다.
정확한 보장 내용은 각 보험사 상품공시실의 약관 원문을 확인하세요.
```

### 5세대 안내

```text
2026년에는 5세대 실손보험이 신규 판매되기 시작했지만, 이 리포트의 본문 비교 대상은 기존 가입자가 보유한 1~4세대 실손보험입니다.
5세대는 제도 변화 흐름을 이해하기 위한 참고 박스로만 다룹니다.
```

### 전환 판단 안내

```text
전환 판단은 보험료 절감액만으로 결정하면 안 됩니다.
최근 1년 병원비, 비급여 이용액, 통원 횟수, 앞으로 예상되는 치료 계획, 현재 약관을 함께 확인해야 합니다.
```

---

## 17. 검증 시나리오

| 케이스 | 입력/상태 | 기대 결과 |
| --- | --- | --- |
| 기본 로드 | 페이지 진입 | KPI, 세대 카드, 비교표, CTA가 모두 노출 |
| 세대 선택 | 2세대 선택 | 2세대 카드 활성화, 세대 설명 변경 |
| 전환 손익 양수 | 현재 60,000원, 4세대 20,000원, 비급여 0원 | 전환 검토 가능 |
| 전환 손익 음수 | 현재 45,000원, 4세대 25,000원, 비급여 300만 원 | 유지 우선 검토 |
| 연령 매트릭스 | 50대 + 비급여 많음 | 전환 신중 메시지 |
| 보험사 표 | 약관 링크 있음 | 새 탭 링크와 공식 출처 라벨 |
| 모바일 표 | 375px 폭 | 표 가로 스크롤, 텍스트 겹침 없음 |

---

## 18. 구현 체크리스트

### 데이터

- [ ] `SIGC_META` 작성
- [ ] `SIGC_KPI` 작성
- [ ] `SILSON_GENERATIONS` 작성
- [ ] `SIGC_PREMIUM_ROWS` 작성
- [ ] `SIGC_COVERAGE_ROWS` 작성
- [ ] `SIGC_REFUND_SCENARIOS` 및 시뮬레이션 결과 작성
- [ ] `SIGC_AGE_MATRIX` 작성
- [ ] `SIGC_PREMIUM_TRENDS` 작성
- [ ] `SIGC_INSURER_CLAUSES` 작성
- [ ] `SIGC_FAQ`, `SIGC_RELATED` 작성

### 페이지

- [ ] BaseLayout SEO 설정
- [ ] CalculatorHero/InfoNotice 구성
- [ ] KPI 카드 4개
- [ ] 14개 본문 섹션 렌더링
- [ ] 계산기 CTA 3~4회 배치
- [ ] SeoContent 연결

### 스크립트

- [ ] 세대 카드 필터
- [ ] 환급 시뮬레이션 탭
- [ ] 연령대 매트릭스 강조
- [ ] 전환 손익 계산
- [ ] 금액 포맷팅

### 등록

- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공 확인

---

## 19. v1/v2 경계

### v1에 포함

- 1~4세대 세대별 비교
- 2026 보험료 인상률 KPI
- 자기부담률·급여·비급여 비교표
- 도수치료/MRI/비급여주사 시뮬레이션
- 4세대 전환 손익 간이 계산
- 연령대별 유불리 매트릭스
- 보험사별 주요 조항 확인표
- 실손보험 환급액 계산기 CTA

### v2로 미룸

- 보험사 공시실 자동 수집
- 실제 성별·연령별 보험료 데이터 필터
- 세대별 약관 PDF 원문 파싱
- 환급액 계산기와 입력값 연동
- 사용자 저장/공유 기능
- 보험사별 앱 청구 UX 비교 실측

---

## 20. 최종 구현 방향

이 리포트는 보험상품 추천 페이지가 아니라, 기존 가입자가 자신의 실손보험 세대와 의료 이용 패턴을 이해하도록 돕는 판단 보조 페이지다. 페이지의 중심은 `4세대가 좋다/나쁘다`가 아니라 `보험료 절감액과 보장 축소 가능성을 동시에 비교해야 한다`는 메시지다.

구현 시에는 표와 데이터가 많아도 모바일에서 읽을 수 있게 섹션을 짧게 쪼개고, 핵심 표마다 해석 문장과 계산기 CTA를 붙인다. 2026년 5세대 실손 출시 이슈는 반드시 언급하되, 본문 비교 대상은 1~4세대 보유계약으로 고정한다.
