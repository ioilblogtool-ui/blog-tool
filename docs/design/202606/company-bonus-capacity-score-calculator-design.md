# 우리 회사 성과급 체력 점수 계산기 설계 문서

> 작성일: 2026-06-23  
> 대상 URL: `/tools/company-bonus-capacity-score-calculator/`  
> 기획 문서: `docs/plan/202606/company-bonus-capacity-score-calculator.md`  
> 콘텐츠 유형: 계산기  
> 구현 목표: 주요 40개 회사 프리셋과 직접 입력 모드를 제공하고, 매출·영업이익·직원 수·전년 성과급률을 바탕으로 성과급 체력 점수와 예상 성과급 금액을 계산한다.

---

## 1. 설계 목표

### 1-1. 사용자 목표

사용자는 페이지에서 다음을 바로 확인해야 한다.

1. 우리 회사가 올해 성과급을 줄 체력이 있는가?
2. 성과급 체력 점수는 몇 점인가?
3. 기준 연봉을 넣으면 예상 성과급 세전·세후 금액은 얼마인가?
4. 성과급을 월로 나누면 월급이 얼마나 늘어난 것처럼 느껴지는가?
5. 회사 실적이 좋아졌는데도 성과급 기대가 낮게 나오는 이유는 무엇인가?
6. 프리셋에 없는 회사도 직접 입력으로 계산할 수 있는가?

### 1-2. 사이트 목표

- 기존 성과급 계산기와 자연스럽게 연결한다.
- 단순 순위표보다 고유성이 강한 계산형 콘텐츠를 만든다.
- 직장인 공유성과 재방문성을 확보한다.
- 삼성전자, SK하이닉스, 현대차, 기아, 한화에어로스페이스 등 검색 수요가 있는 회사명을 페이지 안에 자연스럽게 포함한다.
- 애드센스 관점에서 얇은 콘텐츠가 아니라 산식, 입력값, 결과 해석, FAQ가 있는 도구형 콘텐츠로 만든다.

---

## 2. 파일 구조

```text
src/
  data/
    companyBonusCapacityScoreCalculator.ts
    tools.ts
  pages/
    tools/
      company-bonus-capacity-score-calculator.astro
  styles/
    app.scss
    scss/
      pages/
        _company-bonus-capacity-score-calculator.scss
public/
  scripts/
    company-bonus-capacity-score-calculator.js
  sitemap.xml
docs/
  plan/
    202606/
      company-bonus-capacity-score-calculator.md
  design/
    202606/
      company-bonus-capacity-score-calculator-design.md
```

---

## 3. 메타·SEO 설계

### 3-1. 메타 정보

| 항목 | 값 |
|---|---|
| slug | `company-bonus-capacity-score-calculator` |
| title | 우리 회사 성과급 체력 점수 계산기 |
| seoTitle | 2026 우리 회사 성과급 체력 점수 계산기｜영업이익·이익률·직원 1인당 이익 비교 |
| description | 회사의 매출, 영업이익, 영업이익률, 직원 수, 전년 성과급률을 입력하면 올해 성과급 체력 점수와 예상 성과급 기대 구간을 계산합니다. 삼성전자, SK하이닉스, 현대차 등 주요 회사 프리셋을 제공합니다. |
| canonical | `https://bigyocalc.com/tools/company-bonus-capacity-score-calculator/` |
| og:title | 우리 회사 올해 성과급 나올까? 성과급 체력 점수 계산기 |
| og:description | 매출, 영업이익, 직원 수, 전년 성과급률을 넣고 올해 성과급 가능성을 점수로 확인하세요. |

### 3-2. H 태그 구조

```text
H1 우리 회사 성과급 체력 점수 계산기
  H2 회사 실적을 넣고 성과급 체력을 계산하세요
  H2 성과급 체력 점수 결과
  H2 같은 업종 회사와 비교
  H2 성과급 체력 점수 산식
  H2 회사 프리셋 데이터 기준
  H2 성과급은 매출보다 영업이익이 중요한 이유
  H2 자주 묻는 질문
```

### 3-3. 구조화 데이터

사용 권장:

- `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

예상 JSON-LD:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: CBC_META.title,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: CBC_META.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" }
    },
    {
      "@type": "FAQPage",
      mainEntity: CBC_FAQ.map(...)
    }
  ]
};
```

---

## 4. 데이터 모델

### 4-1. 타입 정의

```ts
export type BonusIndustry =
  | "semiconductor"
  | "auto"
  | "defense"
  | "shipbuilding"
  | "power-equipment"
  | "battery"
  | "chemical"
  | "it-platform"
  | "finance"
  | "telecom"
  | "steel-materials"
  | "custom";

export type BusinessOutlook = "strong-up" | "up" | "flat" | "down" | "weak";

export type DataConfidence = "actual" | "consensus" | "estimated";

export type BonusRateBasis = "base" | "monthly" | "annual";

export interface CompanyBonusPreset {
  id: string;
  name: string;
  industry: BonusIndustry;
  revenueEok: number;
  operatingProfitEok: number;
  previousOperatingProfitEok: number;
  employeeCount: number;
  previousBonusRate: number;
  bonusRateBasis: BonusRateBasis; // ⚠️ 회사마다 보도 기준(기본급/월급/연봉)이 달라 명시 필수 — 기획 문서 18-1-2
  baseSalaryRatio: number;
  outlook: BusinessOutlook;
  dataConfidence: DataConfidence;
  dataAsOf: string; // 데이터 기준 시점, 분기 실적 발표 후 2주 내 갱신 (기획 문서 18-1-4)
  dataNote: string;
}

export interface BonusIndustryDefault {
  industry: BonusIndustry;
  label: string;
  defaultBonusRate: number;
  defaultOutlook: BusinessOutlook;
  description: string;
  // ⚠️ 업종 상대 평가용 — 절대 기준 점수의 업종 왜곡(기획 문서 18-1-1) 대응
  averageOperatingMargin: number; // 업종 평균 영업이익률(%)
  averageProfitPerEmployeeEok: number; // 업종 평균 직원 1인당 영업이익(억원)
}

export interface BonusScoreBreakdown {
  profitGrowth: number;
  margin: number;
  profitPerEmployee: number;
  previousBonus: number;
  outlook: number;
  total: number;
}

export interface BonusCalculationInput {
  companyName: string;
  industry: BonusIndustry;
  revenueEok: number;
  operatingProfitEok: number;
  previousOperatingProfitEok: number;
  employeeCount: number;
  previousBonusRate: number;
  annualSalaryManwon: number;
  baseSalaryRatio: number;
  outlook: BusinessOutlook;
}

export interface BonusCalculationResult {
  score: number;
  scoreLabel: string;
  scoreMessage: string;
  expectedBonusRate: number;
  grossBonusManwon: number;
  netBonusManwon: number;
  monthlyEquivalentManwon: number;
  operatingMargin: number;
  operatingProfitGrowthRate: number;
  operatingProfitPerEmployeeEok: number;
  breakdown: BonusScoreBreakdown;
  warnings: string[];
  insights: string[];
}
```

### 4-2. 메타 객체

```ts
export const CBC_META = {
  slug: "company-bonus-capacity-score-calculator",
  title: "우리 회사 성과급 체력 점수 계산기",
  seoTitle: "2026 우리 회사 성과급 체력 점수 계산기｜영업이익·이익률·직원 1인당 이익 비교",
  description:
    "회사의 매출, 영업이익, 영업이익률, 직원 수, 전년 성과급률을 입력하면 올해 성과급 체력 점수와 예상 성과급 기대 구간을 계산합니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "프리셋 데이터는 공개 실적, 컨센서스, 추정치를 섞어 계산 예시용으로 제공합니다. 실제 성과급은 회사·사업부·개인 평가 기준에 따라 달라질 수 있습니다."
} as const;
```

---

## 5. 회사 프리셋 설계

### 5-1. 초기 40개 회사

초기 구현에서는 40개 회사 프리셋을 제공한다. 수치는 구현 시 최신 공개자료 또는 추정치로 조정하되, 데이터 객체에는 `dataConfidence`와 `dataNote`를 반드시 둔다.

```ts
export const CBC_COMPANY_PRESETS: CompanyBonusPreset[] = [
  {
    id: "samsung-electronics",
    name: "삼성전자",
    industry: "semiconductor",
    revenueEok: 3_000_000,
    operatingProfitEok: 350_000,
    previousOperatingProfitEok: 65_000,
    employeeCount: 125000,
    previousBonusRate: 20,
    bonusRateBasis: "base",
    baseSalaryRatio: 70,
    outlook: "up",
    dataConfidence: "estimated",
    dataAsOf: "2026-Q1 실적 발표 기준",
    dataNote: "연간 실적 전망과 공개 직원 수를 바탕으로 한 추정 예시"
  }
];
```

### 5-2. 회사 리스트

| 업종 | 회사 |
|---|---|
| 반도체 | 삼성전자, SK하이닉스, DB하이텍 |
| 자동차 | 현대차, 기아, 현대모비스, 현대위아 |
| 방산 | 한화에어로스페이스, 현대로템, LIG넥스원, 한국항공우주 |
| 조선 | HD현대중공업, 한화오션, 삼성중공업, HD한국조선해양 |
| 전력기기 | HD현대일렉트릭, LS ELECTRIC, 효성중공업 |
| 배터리 | LG에너지솔루션, 삼성SDI, SK이노베이션 |
| 정유·화학 | S-Oil, LG화학, 롯데케미칼, 금호석유 |
| IT·플랫폼 | 네이버, 카카오, 쿠팡, 삼성SDS |
| 금융 | KB금융, 신한지주, 하나금융, 우리금융, 삼성화재, 삼성생명 |
| 통신 | SK텔레콤, KT, LG유플러스 |
| 철강·소재 | POSCO홀딩스, 고려아연, 포스코퓨처엠 |

### 5-3. 직접 입력 모드

프리셋에 없는 회사는 직접 입력으로 계산한다.

직접 입력 모드에서는:

- 회사명은 자유 입력
- 업종은 선택
- 매출, 영업이익, 전년 영업이익, 직원 수 입력
- 전년도 성과급률을 모르면 업종 기본값 사용 버튼 제공
- 결과에는 `직접 입력값 기준 추정` 배지 표시

---

## 6. 계산 산식 설계

### 6-1. 파생 지표

```ts
operatingMargin = operatingProfitEok / revenueEok * 100
operatingProfitGrowthRate =
  previousOperatingProfitEok > 0
    ? (operatingProfitEok - previousOperatingProfitEok) / previousOperatingProfitEok * 100
    : operatingProfitEok > 0
      ? 300
      : 0
operatingProfitPerEmployeeEok = operatingProfitEok / employeeCount
baseSalaryManwon = annualSalaryManwon * baseSalaryRatio / 100
```

### 6-2. 점수 산식

총점 100점:

| 항목 | 배점 | 함수 | 기준 |
|---|---:|---|---|
| 영업이익 증가율 | 30 | `scoreProfitGrowth` | 회사 자체 절대 변화율 |
| 영업이익률 | 25 | `scoreMargin` | 업종 평균 대비 상대값 |
| 직원 1인당 영업이익 | 20 | `scoreProfitPerEmployee` | 업종 평균 대비 상대값 |
| 전년도 성과급 지급 이력 | 15 | `scorePreviousBonus` | 회사 자체 절대값 |
| 업황 전망 | 10 | `scoreOutlook` | 회사 자체 절대값 |

`industry`가 `"custom"`(직접 입력 모드에서 업종 미지정)이면 업종 평균 데이터가 없으므로 `scoreMargin`/`scoreProfitPerEmployee`의 fallback 분기(절대값 보수적 채점)가 적용된다. 직접 입력 모드에서는 업종을 선택하도록 유도하는 안내를 입력 패널에 추가한다.

### 6-3. 함수 설계

영업이익 증가율과 업황 전망은 "회사 자체의 변화"이므로 절대 기준을 유지한다. **영업이익률과 직원 1인당 영업이익은 업종 평균 대비 상대값으로 환산한 뒤 점수를 매긴다** (기획 문서 18-1-1 — 절대 기준을 쓰면 금융·플랫폼업은 항상 고득점, 조선·방산·자동차는 항상 저득점이 되어 "실적 개선"이 아니라 "업종 차이"를 측정하게 되는 왜곡을 막기 위함).

```ts
export function scoreProfitGrowth(rate: number): number {
  if (rate >= 300) return 30;
  if (rate >= 100) return 24;
  if (rate >= 30) return 18;
  if (rate >= 0) return 12;
  if (rate >= -30) return 6;
  return 0;
}

// margin: 회사 영업이익률(%), industryAverageMargin: 업종 평균 영업이익률(%)
export function scoreMargin(margin: number, industryAverageMargin: number): number {
  if (industryAverageMargin <= 0) return margin > 0 ? 12 : 0; // 업종 평균 데이터가 없을 때 fallback
  const relative = margin / industryAverageMargin; // 1.0 = 업종 평균
  if (relative >= 1.5) return 25;
  if (relative >= 1.2) return 21;
  if (relative >= 0.9) return 16;
  if (relative >= 0.6) return 10;
  if (relative > 0) return 5;
  return 0;
}

// valueEok: 회사 직원 1인당 영업이익(억원), industryAverageEok: 업종 평균 직원 1인당 영업이익(억원)
export function scoreProfitPerEmployee(valueEok: number, industryAverageEok: number): number {
  if (industryAverageEok <= 0) return valueEok > 0 ? 9 : 0; // fallback
  const relative = valueEok / industryAverageEok;
  if (relative >= 1.5) return 20;
  if (relative >= 1.2) return 17;
  if (relative >= 0.9) return 13;
  if (relative >= 0.6) return 9;
  if (relative > 0) return 5;
  return 0;
}
```

결과 화면에는 "업종 평균 대비 1.3배" 같은 상대 지표를 함께 표시해, 절대 금액만 봤을 때 생기는 업종 간 오해를 줄인다(섹션 10-2 KPI 카드에 "업종 평균 대비" 보조 텍스트 추가).

### 6-4. 예상 성과급률

```ts
expectedBonusRate = previousBonusRate * performanceMultiplier * outlookMultiplier
```

상한:

- 기본 상한: 200%
- 적자 회사 상한: 20%
- 매출 또는 직원 수 입력값이 0이면 계산 제한

### 6-5. 실수령액 추정

간단 추정:

```ts
grossBonusManwon = baseSalaryManwon * expectedBonusRate / 100
netBonusManwon = grossBonusManwon * netRate
```

`netRate` 기본값:

| 세전 성과급 | 추정 실수령률 |
|---:|---:|
| 500만 원 이하 | 0.88 |
| 500만~1500만 원 | 0.82 |
| 1500만~3000만 원 | 0.76 |
| 3000만 원 초과 | 0.70 |

주의:

- 실제 세금은 연봉, 부양가족, 원천징수 방식에 따라 달라진다.
- 결과에는 `세후 추정` 표시를 반드시 붙인다.

---

## 7. 결과 판정 설계

### 7-1. 점수 라벨

| 점수 | 라벨 | 색상 |
|---:|---|---|
| 80~100 | 성과급 체력 매우 높음 | green |
| 60~79 | 성과급 가능성 높음 | blue |
| 40~59 | 보통 | amber |
| 20~39 | 제한적 | orange |
| 0~19 | 낮음 | red |

### 7-2. 결과 메시지

```ts
export function getScoreMessage(score: number): string {
  if (score >= 80) return "실적과 이익률이 모두 강해 성과급 기대가 큰 구간입니다.";
  if (score >= 60) return "영업이익 개선이 확인되며 전년보다 성과급 기대가 높아질 수 있습니다.";
  if (score >= 40) return "실적은 나쁘지 않지만 성과급 확대를 확신하기는 어려운 구간입니다.";
  if (score >= 20) return "이익률이나 증가율이 약해 성과급 기대를 낮춰 잡는 편이 안전합니다.";
  return "영업이익 체력이 약하거나 적자 구간이면 성과급 기대가 낮습니다.";
}
```

### 7-3. 인사이트 생성

결과 하단에 3~5개 인사이트를 자동 생성한다.

조건 예시 (영업이익률·직원 1인당 영업이익은 업종 평균 대비 상대값 기준으로 판단 — 절대 금액 기준 문구는 업종 왜곡을 유발하므로 사용하지 않음):

- 업종 평균 대비 영업이익률 1.2배 이상: `같은 업종 평균보다 이익률이 높아 성과급 체력에 강하게 기여합니다.`
- 영업이익 증가율 100% 이상: `전년 대비 실적 개선폭이 커 성과급 기대를 높이는 요인입니다.`
- 업종 평균 대비 직원 1인당 영업이익 1.2배 이상: `같은 업종 안에서 직원 1인당 이익 창출력이 높아 보상 여력 지표가 강합니다.`
- 전년도 성과급률 0: `전년도 지급 이력이 약하면 올해 실적이 좋아도 실제 지급률은 보수적일 수 있습니다.`
- 적자: `적자 구간에서는 성과급보다 격려금 또는 일회성 보상 성격일 수 있습니다.`

> 회사명을 직접 문장에 결합해 단정하는 표현(`"OOO는 성과급이 적습니다"`)은 생성하지 않는다 — 기획 문서 18-1-3 평판 리스크 대응.

---

## 8. 클라이언트 JS 설계

### 8-1. 기본 구조

`public/scripts/company-bonus-capacity-score-calculator.js`

```js
(function () {
  const root = document.querySelector("[data-cbc-calculator]");
  if (!root) return;

  const payload = JSON.parse(document.getElementById("cbc-data").textContent);
  const state = { mode: "preset", selectedCompanyId: payload.defaultCompanyId };

  function calculate(input) {}
  function render(result) {}
  function syncFromPreset(companyId) {}
  function readInput() {}
  function bindEvents() {}

  syncFromPreset(state.selectedCompanyId);
  bindEvents();
})();
```

### 8-2. DOM ID 규칙

| 요소 | ID |
|---|---|
| 회사 선택 | `cbcCompanySelect` |
| 직접 입력 전환 | `cbcCustomModeToggle` |
| 업종 | `cbcIndustry` |
| 매출 | `cbcRevenue` |
| 올해 영업이익 | `cbcOperatingProfit` |
| 전년 영업이익 | `cbcPreviousOperatingProfit` |
| 직원 수 | `cbcEmployeeCount` |
| 전년도 성과급률 | `cbcPreviousBonusRate` |
| 연봉 | `cbcAnnualSalary` |
| 기본급 비중 | `cbcBaseSalaryRatio` |
| 업황 전망 | `cbcOutlook` |
| 점수 | `cbcScore` |
| 점수 라벨 | `cbcScoreLabel` |
| 예상 성과급률 | `cbcExpectedBonusRate` |
| 세전 성과급 | `cbcGrossBonus` |
| 세후 성과급 | `cbcNetBonus` |
| 월 환산 | `cbcMonthlyEquivalent` |
| 인사이트 목록 | `cbcInsights` |

### 8-3. 보안 원칙

- 사용자 입력값은 숫자 파싱 후 계산에만 사용
- 동적 텍스트는 `textContent` 사용
- HTML 문자열 삽입 금지
- URL 파라미터 공유 기능은 2차 개선으로 미룬다

---

## 9. Astro 페이지 설계

### 9-1. 주요 imports

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  CBC_META,
  CBC_COMPANY_PRESETS,
  CBC_INDUSTRY_DEFAULTS,
  CBC_FAQ,
  CBC_RELATED_LINKS,
  CBC_SEO_INTRO,
  CBC_CRITERIA
} from "../../data/companyBonusCapacityScoreCalculator";
---
```

### 9-2. 페이지 구조

```text
main.cbc-page[data-cbc-calculator]
  CalculatorHero
  InfoNotice
  ToolActionBar
  section.cbc-calculator
    div.cbc-input-panel
    div.cbc-result-panel
  section.cbc-peer-compare
  section.cbc-formula
  section.cbc-company-pool
  SeoContent
  script#cbc-data
  script[src="/scripts/company-bonus-capacity-score-calculator.js"]
```

### 9-3. 첫 화면 UX

첫 화면에서 결과가 보이게 한다.

- 기본 회사: 삼성전자
- 기본 연봉: 7000만 원
- 기본급 비중: 70%
- 우측 결과 패널에 성과급 체력 점수 즉시 노출

---

## 10. UI 설계

### 10-1. 입력 패널

입력 패널은 2단 구성:

1. 회사 선택
2. 실적·연봉 입력

회사 선택:

- `<select>`로 40개 회사 제공
- 옆에 `직접 입력` 토글 버튼
- 회사 선택 시 실적 값 자동 채움

실적 입력:

- 매출
- 올해 영업이익
- 전년 영업이익
- 직원 수
- 전년도 성과급률
- 기준 연봉
- 기본급 비중
- 업황 전망

### 10-2. 결과 패널

상단:

- 원형 또는 막대 게이지
- 점수 `78점`
- 라벨 `성과급 가능성 높음`

KPI 카드:

- 예상 성과급률
- 세전 성과급
- 세후 성과급
- 월 환산 효과

세부 지표:

- 영업이익률
- 전년 대비 영업이익 증가율
- 직원 1인당 영업이익

### 10-3. 점수 분해

각 항목별 점수 막대:

- 영업이익 증가율 30점 중 몇 점
- 영업이익률 25점 중 몇 점 (보조 텍스트: "업종 평균 대비 1.3배")
- 직원 1인당 영업이익 20점 중 몇 점 (보조 텍스트: "업종 평균 대비 0.9배")
- 전년도 성과급 이력 15점 중 몇 점
- 업황 전망 10점 중 몇 점

영업이익률·직원 1인당 영업이익 막대에는 절대 금액과 "업종 평균 대비 N배" 상대값을 함께 표시해, 왜 같은 영업이익률이라도 업종에 따라 점수가 다른지 사용자가 바로 이해할 수 있게 한다.

### 10-4. 업종 비교표

선택한 회사와 같은 업종의 프리셋 회사를 표로 보여준다.

| 회사 | 영업이익률 | 직원 1인당 영업이익 | 전년 성과급률 | 성과급 체력 |
|---|---:|---:|---:|---:|

모바일에서는 가로 스크롤 표로 처리한다.

---

## 11. 스타일 설계

### 11-1. 네임스페이스

모든 스타일은 `.cbc-page` 아래로 제한한다.

```scss
.cbc-page {
  --cbc-ink: #172033;
  --cbc-muted: #5e6878;
  --cbc-line: #dbe3ef;
  --cbc-soft: #f6f8fb;
  --cbc-blue: #2563eb;
  --cbc-green: #15803d;
  --cbc-amber: #b45309;
  --cbc-red: #b91c1c;
}
```

### 11-2. 레이아웃

```scss
.cbc-calculator {
  display: grid;
  gap: 16px;
}

@media (min-width: 980px) {
  .cbc-calculator {
    grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
    align-items: start;
  }
}
```

### 11-3. 카드 규칙

- 카드 border-radius: 8px 이하
- 카드 안에 카드 중첩 금지
- 결과 KPI는 같은 높이 유지
- 모바일에서 버튼 텍스트가 넘치지 않게 `min-height`와 `line-height` 설정

### 11-4. 색상

점수 구간:

- 80 이상: green
- 60 이상: blue
- 40 이상: amber
- 20 이상: orange
- 20 미만: red

단색 팔레트가 되지 않도록 입력 영역, 결과 영역, 점수 분해 영역에 색상 역할을 분리한다.

---

## 12. 접근성

- 모든 입력에 `<label>` 제공
- 결과 변경 영역에 `aria-live="polite"` 적용
- 점수 막대는 숫자 텍스트를 함께 표시
- 버튼 텍스트는 목적이 드러나게 작성
- 표에는 `<caption>`과 `scope` 적용

---

## 13. 포맷 함수

```ts
export function formatEok(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}억 원`;
}

export function formatManwon(value: number): string {
  if (value >= 10000) {
    const eok = Math.floor(value / 10000);
    const man = Math.round(value % 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만 원` : `${eok}억 원`;
  }
  return `${Math.round(value).toLocaleString("ko-KR")}만 원`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
```

---

## 14. 테스트 케이스

### 14-1. 정상 케이스

| 케이스 | 입력 | 기대 |
|---|---|---|
| 고성장 흑자 | 영업이익 증가율 300%, 이익률 30% | 80점 이상 |
| 안정 흑자 | 증가율 10%, 이익률 8% | 40~60점 |
| 적자 전환 | 올해 영업이익 음수 | 낮음 판정 |
| 전년 적자에서 흑자 | 전년 음수, 올해 양수 | 증가율 상한 처리 |
| 직원 수 0 | 직원 수 미입력 | 계산 경고, 점수 게이지 비표시 |
| 조선업 업종 내 우등 | 조선업, 이익률 9%(업종 평균 6%의 1.5배) | 영업이익률 25점 만점 (절대 기준이면 9%는 16점에 불과 — 상대 기준 적용 확인용 케이스) |
| 금융업 업종 내 평균 | 금융업, 이익률 25%(업종 평균과 동일) | 영업이익률 16점 (절대 기준이면 25%는 21점 — 상대 기준 적용 확인용 케이스) |

### 14-2. UI 케이스

- 회사 선택 시 입력값 자동 변경
- 직접 입력 전환 시 회사 선택 비활성화 또는 직접 입력 안내 표시
- 연봉 변경 시 성과급 금액 즉시 변경
- 기본급 비중 변경 시 성과급 금액 즉시 변경
- 업황 전망 변경 시 점수와 예상 성과급률 변경

### 14-3. 경계값

- 매출 0
- 영업이익 0
- 전년 영업이익 0
- 성과급률 0
- 성과급률 200 이상 입력
- 연봉 0

---

## 15. 등록 체크리스트

### 15-1. 신규 파일

- [ ] `src/data/companyBonusCapacityScoreCalculator.ts`
- [ ] `src/pages/tools/company-bonus-capacity-score-calculator.astro`
- [ ] `public/scripts/company-bonus-capacity-score-calculator.js`
- [ ] `src/styles/scss/pages/_company-bonus-capacity-score-calculator.scss`

### 15-2. 기존 파일 수정

- [ ] `src/data/tools.ts`
- [ ] `src/styles/app.scss`
- [ ] `public/sitemap.xml`

### 15-3. 품질 검증

- [ ] `href="#"` 없음
- [ ] 미완성 신호 문구 없음
- [ ] 추정 결과에 추정 표시
- [ ] 데이터 기준일 표시
- [ ] 직접 입력 모드 제공
- [ ] `npm run build` 성공

---

## 16. 내부 링크 설계

### 16-1. 연결할 페이지

| 링크 | 목적 |
|---|---|
| `/reports/corporate-bonus-comparison-2026/` | 대기업 성과급 비교 허브 |
| `/tools/samsung-bonus/` | 삼성전자 성과급 계산 |
| `/tools/sk-hynix-bonus/` | SK하이닉스 성과급 계산 |
| `/tools/hyundai-bonus/` | 현대차 성과급 계산 |
| `/tools/hanwha-bonus-calculator/` | 한화 성과급 계산 |
| `/tools/salary/` | 연봉 실수령액 계산 |

실제 존재 여부는 구현 전 `Test-Path`로 확인한다.

### 16-2. CTA 문구

- “회사 체력을 봤다면 내 세후 성과급도 계산해보세요.”
- “성과급이 월급으로 얼마나 늘어난 것처럼 느껴지는지 확인하세요.”
- “삼성전자·SK하이닉스처럼 회사별 성과급 산식이 있는 경우 전용 계산기도 함께 보세요.”

---

## 17. 애드센스·품질 리스크 대응

### 17-1. 얇은 콘텐츠 방지

반드시 포함:

- 직접 입력 계산기
- 40개 회사 프리셋
- 점수 산식 공개
- 결과 해석
- 업종별 비교표
- FAQ
- 데이터 기준 안내

### 17-2. 오해 방지

반드시 표시:

> 이 계산기는 공개 실적과 입력값을 바탕으로 성과급 체력을 추정하는 도구입니다. 실제 성과급은 회사의 지급 기준, 사업부 실적, 개인 평가, 노사 협상, 세금에 따라 달라질 수 있습니다.

### 17-3. 금지 표현

- 성과급 확정
- 무조건 지급
- 100% 받음
- 투자 추천
- 공식 지급률

---

## 18. 최종 구현 방향

MVP는 다음 범위로 구현한다.

1. 40개 회사 프리셋
2. 직접 입력 모드
3. 성과급 체력 점수
4. 예상 성과급률
5. 세전·세후 예상 성과급
6. 월 환산 효과
7. 직원 1인당 영업이익
8. 같은 업종 비교표
9. SEO 본문과 FAQ

2차 개선에서 공유 URL, 결과 이미지, 회사 검색 자동완성, 시총 대비 영업이익 배수를 추가한다.

이 계산기는 단일 페이지로도 강하지만, 장기적으로는 `기업 체급 계산기`, `직원 1인당 영업이익 TOP20`, `삼성전자 vs SK하이닉스 실적·성과급 비교`로 확장하는 허브 역할을 하게 설계한다.
