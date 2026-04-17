# 아이 사교육비 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/child-tutoring-cost-calculator.md`
> 작성일: 2026-04-15
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준
> 참고 계산기: `fire-calculator`, `dca-investment-calculator` (입력 → 결과 패턴)

---

## 1. 문서 개요

- **슬러그**: `child-tutoring-cost-calculator`
- **URL**: `/tools/child-tutoring-cost-calculator/`
- **콘텐츠 유형**: 인터랙티브 계산기 (`/tools/` 계열)
- **레이아웃**: `BaseLayout` + `SimpleToolShell`
  - `pageClass="tutoring-page"` 로 전용 스타일 범위 분리
  - 입력 영역이 길므로 모바일에서 입력 → 결과 단일 컬럼으로 처리
  - `resultFirst={false}` (입력 먼저 노출이 UX상 자연스러움)

---

## 2. 파일 구조

```
src/
  data/
    childTutoringData.ts        ← 학교급·지역별 평균값, FAQ, 내부링크 데이터
  pages/
    tools/
      child-tutoring-cost-calculator.astro

public/
  og/
    tools/
      child-tutoring-cost-calculator.png   ← OG 이미지 (npm run og:generate 로 생성)
  scripts/
    child-tutoring-cost-calculator.js

src/styles/scss/pages/
  _child-tutoring-cost-calculator.scss    (prefix: tutoring-)
```

---

## 3. 데이터 파일 설계 (`childTutoringData.ts`)

### 3-1. 타입 정의

```ts
export type SchoolLevel = "preschool" | "elementary" | "middle" | "high";
export type Region = "seoul" | "metro" | "city" | "rural";
export type SubjectType =
  | "english" | "math" | "korean" | "science" | "essay"
  | "arts" | "coding" | "other";
export type LearningType =
  | "academy" | "private" | "group" | "visit" | "online";

export type AverageByRegion = Record<Region, number>;

export type SchoolLevelMeta = {
  level: SchoolLevel;
  label: string;        // "초등학교"
  shortLabel: string;   // "초등"
  durationYears: number;
  grades: number[];     // [1,2,3,4,5,6]
  avgMonthlyCost: AverageByRegion;  // 단위: 원
};

export type SubjectOption = {
  id: SubjectType;
  label: string;
};

export type LearningTypeOption = {
  id: LearningType;
  label: string;
};

// 기회비용 계산용 기준 파라미터
export type OpportunityCostPreset = {
  years: number;
  label: string;
};
export type ReturnRatePreset = {
  rate: number;    // 0.05 = 5%
  label: string;
};
```

### 3-2. 학교급별 평균 사교육비 데이터

> **출처**: 통계청 「초중고 사교육비 조사」 2024년 기준 추정치. 미취학 아동은 육아정책연구소 참고.  
> 실제 비용은 지역·과목·기관 유형에 따라 다를 수 있으므로 참고용으로 표기.

```ts
export const SCHOOL_LEVEL_DATA: SchoolLevelMeta[] = [
  {
    level: "preschool",
    label: "미취학",
    shortLabel: "유아",
    durationYears: 3,
    grades: [],   // 학년 구분 없음
    avgMonthlyCost: {
      seoul: 450000,
      metro:  340000,
      city:   250000,
      rural:  180000,
    },
  },
  {
    level: "elementary",
    label: "초등학교",
    shortLabel: "초등",
    durationYears: 6,
    grades: [1, 2, 3, 4, 5, 6],
    avgMonthlyCost: {
      seoul: 640000,
      metro:  500000,
      city:   400000,
      rural:  300000,
    },
  },
  {
    level: "middle",
    label: "중학교",
    shortLabel: "중등",
    durationYears: 3,
    grades: [1, 2, 3],
    avgMonthlyCost: {
      seoul: 860000,
      metro:  680000,
      city:   520000,
      rural:  400000,
    },
  },
  {
    level: "high",
    label: "고등학교",
    shortLabel: "고등",
    durationYears: 3,
    grades: [1, 2, 3],
    avgMonthlyCost: {
      seoul:  1020000,
      metro:   820000,
      city:    630000,
      rural:   500000,
    },
  },
];
```

### 3-3. 선택지 옵션 데이터

```ts
export const REGION_OPTIONS: { id: Region; label: string }[] = [
  { id: "seoul", label: "서울" },
  { id: "metro", label: "수도권" },
  { id: "city",  label: "광역시" },
  { id: "rural", label: "지방" },
];

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: "english", label: "영어" },
  { id: "math",    label: "수학" },
  { id: "korean",  label: "국어" },
  { id: "science", label: "과학" },
  { id: "essay",   label: "논술" },
  { id: "arts",    label: "예체능" },
  { id: "coding",  label: "코딩" },
  { id: "other",   label: "기타" },
];

export const LEARNING_TYPE_OPTIONS: LearningTypeOption[] = [
  { id: "academy", label: "학원" },
  { id: "private", label: "개인과외" },
  { id: "group",   label: "그룹과외" },
  { id: "visit",   label: "방문학습" },
  { id: "online",  label: "온라인" },
];
```

### 3-4. 티어 정의

```ts
export type TierInfo = {
  id: "saving" | "average" | "active" | "high";
  label: string;
  badge: string;
  minRatio: number;
  maxRatio: number;
  colorClass: string;   // SCSS에서 사용할 CSS 클래스
};

export const COMPARISON_TIERS: TierInfo[] = [
  { id: "saving",  label: "절약형",    badge: "평균보다 낮은 수준", minRatio: 0,    maxRatio: 0.7,  colorClass: "tier--saving"  },
  { id: "average", label: "평균권",    badge: "또래 평균 수준",    minRatio: 0.7,  maxRatio: 1.1,  colorClass: "tier--average" },
  { id: "active",  label: "적극 투자형", badge: "평균보다 높은 수준", minRatio: 1.1,  maxRatio: 1.5,  colorClass: "tier--active"  },
  { id: "high",    label: "고지출형",   badge: "높은 지출 구간",    minRatio: 1.5,  maxRatio: Infinity, colorClass: "tier--high" },
];
```

### 3-5. 기회비용 파라미터

```ts
export const OPPORTUNITY_YEAR_PRESETS: OpportunityCostPreset[] = [
  { years: 5,  label: "5년" },
  { years: 10, label: "10년" },
  { years: 15, label: "15년" },
];

export const RETURN_RATE_PRESETS: ReturnRatePreset[] = [
  { rate: 0.03, label: "3%" },
  { rate: 0.05, label: "5%" },
  { rate: 0.07, label: "7%" },
];
```

### 3-6. FAQ 데이터

```ts
export const TUTORING_FAQ = [
  {
    question: "초등학생 사교육비 평균은 어느 정도인가요?",
    answer: "통계청 2024년 사교육비 조사 기준 초등학생 전국 평균은 월 약 43만 원(참여 학생 기준)이며, 서울은 약 64만 원으로 지역 간 차이가 큽니다. 이 계산기의 평균값은 이를 기반으로 한 참고 추정치입니다.",
  },
  {
    question: "형제자매 교육비는 함께 계산할 수 있나요?",
    answer: "네, 자녀 수를 1~4명으로 설정하면 자녀별 교육비를 각각 입력하고 전체 합산액을 한눈에 볼 수 있습니다.",
  },
  {
    question: "월 교육비와 연간 교육비를 동시에 볼 수 있나요?",
    answer: "결과 카드에서 월 총액, 연간 총액, 현재 학교급 기준 누적 예상 금액을 한 번에 확인할 수 있습니다.",
  },
  {
    question: "사교육비 기회비용은 어떻게 계산하나요?",
    answer: "매월 동일 금액을 선택한 수익률로 적립 투자한다고 가정한 미래가치 공식(FV = PMT × ((1+r)^n − 1) / r)을 사용합니다. 실제 투자 수익을 보장하지 않으며 참고용 시뮬레이션입니다.",
  },
  {
    question: "지역별 차이도 반영되나요?",
    answer: "서울·수도권·광역시·지방 4개 지역 기준으로 또래 평균 비교값이 달라집니다. 각 자녀별로 지역을 개별 설정할 수 있습니다.",
  },
];
```

### 3-7. 내부 링크 데이터

```ts
export const TUTORING_RELATED_TOOLS = [
  { slug: "dca-investment-calculator", label: "적립식 투자 계산기", reason: "기회비용 확장" },
  { slug: "fire-calculator",           label: "파이어족 계산기",    reason: "장기 자산 비교" },
  { slug: "parental-leave-short-work", label: "육아휴직 급여 계산기", reason: "육아 가계 전체 맥락" },
];
```

---

## 4. `.astro` 페이지 구조

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
  SCHOOL_LEVEL_DATA,
  REGION_OPTIONS,
  SUBJECT_OPTIONS,
  LEARNING_TYPE_OPTIONS,
  COMPARISON_TIERS,
  OPPORTUNITY_YEAR_PRESETS,
  RETURN_RATE_PRESETS,
  TUTORING_FAQ,
  TUTORING_RELATED_TOOLS,
} from "../../data/childTutoringData";

const config = {
  SCHOOL_LEVEL_DATA,
  REGION_OPTIONS,
  SUBJECT_OPTIONS,
  LEARNING_TYPE_OPTIONS,
  COMPARISON_TIERS,
  OPPORTUNITY_YEAR_PRESETS,
  RETURN_RATE_PRESETS,
};

const faqSchema = TUTORING_FAQ.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: { "@type": "Answer", text: item.answer },
}));
---

<BaseLayout
  title="아이 사교육비 계산기 | 월 교육비·연간 학원비·누적 비용 한눈에"
  description="자녀 나이, 학교급, 과목, 지역을 입력하면 월 사교육비와 연간 교육비, 누적 학원비를 계산해주는 아이 사교육비 계산기. 또래 평균 비교와 기회비용 분석까지 한 번에 확인하세요."
  ogImage="/og/tools/child-tutoring-cost-calculator.png"
  jsonLd={{ ... FAQPage schema ... }}
>
  <SiteHeader />
  <SimpleToolShell pageClass="tutoring-page">
    <CalculatorHero
      title="아이 사교육비 계산기"
      description="자녀 수, 학교급, 과목, 지역만 입력하면 월·연간·누적 교육비와 평균 대비 수준을 한 번에 확인할 수 있어요."
      slot="hero"
    />
    <!-- 입력 영역 -->
    <section class="tutoring-input" slot="input"> ... </section>
    <!-- 결과 영역 -->
    <section class="tutoring-result" slot="result"> ... </section>
  </SimpleToolShell>

  <!-- SEO 콘텐츠 -->
  <SeoContent faqs={TUTORING_FAQ} />
</BaseLayout>

<!-- 설정 데이터를 JS로 주입 -->
<script define:vars={{ config }}>
  window.__TUTORING_CONFIG__ = config;
</script>
<script src="/scripts/child-tutoring-cost-calculator.js"></script>
```

---

## 5. HTML 마크업 상세

### 5-1. 입력 영역 (`tutoring-input`)

```html
<!-- 자녀 수 선택 -->
<div class="tutoring-child-count">
  <label>자녀 수</label>
  <div class="tutoring-count-buttons" id="childCountButtons">
    <button class="tutoring-count-btn is-active" data-count="1">1명</button>
    <button class="tutoring-count-btn" data-count="2">2명</button>
    <button class="tutoring-count-btn" data-count="3">3명</button>
    <button class="tutoring-count-btn" data-count="4">4명</button>
  </div>
</div>

<!-- 자녀별 카드 컨테이너 (JS로 동적 렌더링) -->
<div id="childCardsContainer"></div>

<!-- 자녀 카드 템플릿 (hidden, JS cloneNode 용도) -->
<template id="childCardTemplate">
  <div class="tutoring-child-card" data-child-index="">
    <!-- 아코디언 헤더 (모바일) -->
    <div class="tutoring-child-card__header">
      <span class="tutoring-child-card__title">첫째</span>
      <button class="tutoring-child-card__toggle" type="button" aria-expanded="true">
        <span class="sr-only">접기/펼치기</span>
      </button>
    </div>
    <div class="tutoring-child-card__body">
      <!-- 학교급 -->
      <div class="tutoring-field">
        <label>학교급</label>
        <div class="tutoring-level-buttons">
          <button class="tutoring-level-btn" data-level="preschool">유아</button>
          <button class="tutoring-level-btn is-active" data-level="elementary">초등</button>
          <button class="tutoring-level-btn" data-level="middle">중등</button>
          <button class="tutoring-level-btn" data-level="high">고등</button>
        </div>
      </div>
      <!-- 학년 (학교급에 따라 동적 노출) -->
      <div class="tutoring-field tutoring-field--grade">
        <label>학년</label>
        <select class="tutoring-grade-select">
          <!-- JS로 학교급에 맞게 동적 생성 -->
        </select>
      </div>
      <!-- 지역 -->
      <div class="tutoring-field">
        <label>지역</label>
        <select class="tutoring-region-select">
          <option value="">선택하세요</option>
          <option value="seoul">서울</option>
          <option value="metro">수도권</option>
          <option value="city">광역시</option>
          <option value="rural">지방</option>
        </select>
      </div>
      <!-- 과목 목록 -->
      <div class="tutoring-subjects">
        <div class="tutoring-subjects__header">
          <span>과목별 월 비용</span>
          <button class="tutoring-add-subject-btn" type="button">+ 과목 추가</button>
        </div>
        <div class="tutoring-subject-rows">
          <!-- JS로 과목 행 동적 추가 -->
        </div>
      </div>
      <!-- 교재비 / 기타비용 -->
      <div class="tutoring-extra-costs">
        <div class="tutoring-field tutoring-field--inline">
          <label>교재비 (월)</label>
          <div class="tutoring-input-wrap">
            <input type="number" class="tutoring-book-cost" placeholder="0" min="0" step="10000">
            <span class="tutoring-input-unit">원</span>
          </div>
        </div>
        <div class="tutoring-field tutoring-field--inline">
          <label>기타비용 (월)</label>
          <div class="tutoring-input-wrap">
            <input type="number" class="tutoring-extra-cost" placeholder="0" min="0" step="10000">
            <span class="tutoring-input-unit">원</span>
          </div>
        </div>
      </div>
      <!-- 자녀 소계 -->
      <div class="tutoring-child-subtotal">
        월 소계: <strong class="tutoring-child-subtotal__value">0원</strong>
      </div>
    </div>
  </div>
</template>

<!-- 과목 행 템플릿 -->
<template id="subjectRowTemplate">
  <div class="tutoring-subject-row">
    <select class="tutoring-subject-name">
      <option value="">과목 선택</option>
      <!-- SUBJECT_OPTIONS로 채움 -->
    </select>
    <select class="tutoring-learning-type">
      <!-- LEARNING_TYPE_OPTIONS로 채움 -->
    </select>
    <div class="tutoring-input-wrap">
      <input type="number" class="tutoring-subject-cost" placeholder="월 비용" min="0" step="10000">
      <span class="tutoring-input-unit">원</span>
    </div>
    <button class="tutoring-remove-subject-btn" type="button">삭제</button>
  </div>
</template>
```

### 5-2. 결과 영역 (`tutoring-result`)

```html
<!-- KPI 카드 4종 -->
<div class="tutoring-kpi-grid">
  <div class="tutoring-kpi-card">
    <div class="tutoring-kpi-card__label">월 사교육비</div>
    <div class="tutoring-kpi-card__value" id="kpiMonthly">-</div>
  </div>
  <div class="tutoring-kpi-card">
    <div class="tutoring-kpi-card__label">연간 사교육비</div>
    <div class="tutoring-kpi-card__value" id="kpiAnnual">-</div>
  </div>
  <div class="tutoring-kpi-card tutoring-kpi-card--accent">
    <div class="tutoring-kpi-card__label">누적 예상 비용</div>
    <div class="tutoring-kpi-card__value" id="kpiCumulative">-</div>
    <div class="tutoring-kpi-card__context" id="kpiCumulativeContext"></div>
  </div>
  <div class="tutoring-kpi-card">
    <div class="tutoring-kpi-card__label">형제자매 합산</div>
    <div class="tutoring-kpi-card__value" id="kpiTotal">-</div>
  </div>
</div>

<!-- 또래 비교 섹션 -->
<div class="tutoring-comparison" id="comparisonSection">
  <h2 class="tutoring-section-title">우리 집 사교육비는 평균 대비 어느 수준일까?</h2>
  <div id="comparisonCards">
    <!-- 자녀별로 JS 동적 생성 -->
    <!-- 각 카드: 티어 뱃지 + 가로 막대 그래프 + 차액 문구 -->
  </div>
</div>

<!-- 누적 비용 시뮬레이션 섹션 -->
<div class="tutoring-simulation" id="simulationSection">
  <h2 class="tutoring-section-title">초등부터 고등까지 누적 교육비는 얼마일까?</h2>
  <!-- 시나리오 선택 -->
  <div class="tutoring-scenario-buttons">
    <button class="tutoring-scenario-btn is-active" data-growth="0">현재 수준 유지</button>
    <button class="tutoring-scenario-btn" data-growth="0.1">학교급 상승 시 +10%</button>
    <button class="tutoring-scenario-btn" data-growth="0.2">학교급 상승 시 +20%</button>
  </div>
  <!-- 누적 결과 표 -->
  <div class="tutoring-simulation-table" id="simulationTable">
    <!-- JS로 동적 생성: 학교급별 행 + 합계 -->
  </div>
</div>

<!-- 기회비용 섹션 -->
<div class="tutoring-opportunity" id="opportunitySection">
  <h2 class="tutoring-section-title">이 돈을 투자했다면 얼마나 되었을까?</h2>
  <!-- 파라미터 선택 -->
  <div class="tutoring-opportunity-params">
    <div class="tutoring-field">
      <label>기간</label>
      <div class="tutoring-tab-buttons" id="yearPresets">
        <button class="tutoring-tab-btn" data-years="5">5년</button>
        <button class="tutoring-tab-btn is-active" data-years="10">10년</button>
        <button class="tutoring-tab-btn" data-years="15">15년</button>
      </div>
    </div>
    <div class="tutoring-field">
      <label>기대수익률</label>
      <div class="tutoring-tab-buttons" id="ratePresets">
        <button class="tutoring-tab-btn" data-rate="0.03">3%</button>
        <button class="tutoring-tab-btn is-active" data-rate="0.05">5%</button>
        <button class="tutoring-tab-btn" data-rate="0.07">7%</button>
      </div>
    </div>
  </div>
  <!-- 기회비용 결과 -->
  <div class="tutoring-opportunity-result" id="opportunityResult">
    <div class="tutoring-opportunity-card">
      <div class="tutoring-opportunity-card__label">월 <span id="opMonthly">-</span> 기준 <span id="opYears">10</span>년 후</div>
      <div class="tutoring-opportunity-card__value" id="opFutureValue">-</div>
      <div class="tutoring-opportunity-card__note">연 <span id="opRate">5</span>% 수익률 가정 시 참고값</div>
    </div>
  </div>
  <!-- 관련 계산기 링크 -->
  <div class="tutoring-opportunity-links">
    <a href="/tools/dca-investment-calculator/">적립식 투자 계산기로 더 자세히 보기 →</a>
  </div>
</div>

<!-- 절감 팁 섹션 -->
<div class="tutoring-tips">
  <h2 class="tutoring-section-title">사교육비를 줄이는 현실적인 방법</h2>
  <ul class="tutoring-tips-list">
    <li>과목 수보다 실제 학습 효과를 먼저 점검해보세요</li>
    <li>월 교육비 총액보다 연간 누적 부담을 같이 보세요</li>
    <li>오프라인 학원과 온라인 강의를 혼합하면 비용을 줄일 수 있어요</li>
    <li>학교급 전환 시점에 필수 과목 중심으로 재편해보세요</li>
    <li>형제자매가 있다면 자녀별이 아닌 가계 전체 기준으로 예산을 관리해보세요</li>
  </ul>
</div>
```

---

## 6. JS 로직 설계 (`child-tutoring-cost-calculator.js`)

### 6-1. 상태 구조

```js
// 전역 상태 (단순 객체, 프레임워크 없음)
const state = {
  childCount: 1,
  children: [
    // 기본 자녀 1명
    {
      level: "elementary",
      grade: 1,
      region: "",
      subjects: [],  // [{ name, type, cost }]
      bookCost: 0,
      extraCost: 0,
    }
  ],
  opportunityYears: 10,
  opportunityRate: 0.05,
  growthScenario: 0,   // 0 / 0.1 / 0.2
};
```

### 6-2. 핵심 계산 함수

```js
// 자녀별 월 비용
function calcChildMonthly(child) {
  const subjectTotal = child.subjects.reduce((sum, s) => sum + (s.cost || 0), 0);
  return subjectTotal + child.bookCost + child.extraCost;
}

// 전체 월 합계
function calcTotalMonthly() {
  return state.children.reduce((sum, c) => sum + calcChildMonthly(c), 0);
}

// 연간
function calcAnnual() {
  return calcTotalMonthly() * 12;
}

// 누적: 첫 번째 자녀 기준 현재 학교급 남은 기간
function calcCumulative() {
  const child = state.children[0];
  if (!child) return { amount: 0, context: "" };
  const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find(l => l.level === child.level);
  if (!levelMeta) return { amount: 0, context: "" };
  const remainYears = child.grade
    ? levelMeta.durationYears - child.grade + 1
    : levelMeta.durationYears;
  const amount = calcChildMonthly(child) * 12 * remainYears;
  return { amount, context: `${levelMeta.shortLabel} 잔여 ${remainYears}년 기준` };
}

// 또래 비교
function calcTierForChild(child) {
  if (!child.region) return null;
  const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find(l => l.level === child.level);
  if (!levelMeta) return null;
  const avg = levelMeta.avgMonthlyCost[child.region];
  const monthly = calcChildMonthly(child);
  if (!avg || avg === 0) return null;
  const ratio = monthly / avg;
  const tier = CONFIG.COMPARISON_TIERS.find(t => ratio >= t.minRatio && ratio < t.maxRatio);
  const diff = monthly - avg;
  return { tier, ratio, diff, avg, monthly };
}

// 기회비용 (적립식 미래가치 공식)
// FV = PMT × ((1+r)^n − 1) / r  (월 복리)
function calcOpportunityCost(monthly, yearlyRate, years) {
  const r = yearlyRate / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

// 누적 시뮬레이션 테이블 (학교급 순서대로)
function calcSimulationTable(child) {
  const levels = ["preschool", "elementary", "middle", "high"];
  const levelOrder = levels.indexOf(child.level);
  const baseMonthly = calcChildMonthly(child);
  const rows = [];
  let runningMonthly = baseMonthly;

  levels.forEach((level, idx) => {
    const meta = CONFIG.SCHOOL_LEVEL_DATA.find(l => l.level === level);
    if (!meta) return;
    // 현재 학교급 이전은 스킵
    if (idx < levelOrder) return;
    if (idx > levelOrder) {
      runningMonthly = baseMonthly * Math.pow(1 + state.growthScenario, idx - levelOrder);
    }
    const years = (idx === levelOrder && child.grade)
      ? meta.durationYears - child.grade + 1
      : meta.durationYears;
    const cumulative = runningMonthly * 12 * years;
    rows.push({
      label: meta.shortLabel,
      monthly: runningMonthly,
      years,
      cumulative,
    });
  });

  const total = rows.reduce((s, r) => s + r.cumulative, 0);
  return { rows, total };
}
```

### 6-3. 렌더 흐름

```
사용자 입력 변경
  → updateState()
  → recalc()
  → renderKPI()
  → renderComparison()
  → renderSimulation()
  → renderOpportunity()
```

### 6-4. 카드 동적 렌더링

- `childCount` 변경 시 `childCardsContainer` 에 카드를 추가/제거
- 카드 추가: `childCardTemplate` 를 cloneNode(true) 하여 index 설정 후 append
- 과목 행 추가: `subjectRowTemplate` 를 cloneNode(true)
- 과목 행 삭제: 해당 행 remove + state 갱신

### 6-5. URL 파라미터 직렬화 (v1에서는 선택 구현)

- `url-state.js` 의 헬퍼 사용
- 직렬화 키: `cc`(childCount), `c0l`, `c0r`, `c0g`, `c0s`(자녀0 level/region/grade/subjects) 등
- subjects는 JSON 인코딩 후 base64 처리 고려 (URL 길이 한계)

---

## 7. SCSS 설계 (`_child-tutoring-cost-calculator.scss`)

prefix: `tutoring-`

### 7-1. 주요 클래스 목록

| 클래스 | 역할 |
|--------|------|
| `.tutoring-page` | 페이지 루트 범위 |
| `.tutoring-child-count` | 자녀 수 선택 영역 |
| `.tutoring-count-btn` | 자녀 수 버튼 (is-active 상태) |
| `.tutoring-child-card` | 자녀별 입력 카드 |
| `.tutoring-child-card__header` | 카드 헤더 (아코디언 토글) |
| `.tutoring-child-card__body` | 카드 바디 |
| `.tutoring-level-btn` | 학교급 선택 버튼 |
| `.tutoring-subject-row` | 과목 행 |
| `.tutoring-add-subject-btn` | 과목 추가 버튼 |
| `.tutoring-kpi-grid` | KPI 카드 그리드 (2×2) |
| `.tutoring-kpi-card` | 개별 KPI 카드 |
| `.tutoring-kpi-card--accent` | 강조 KPI 카드 |
| `.tutoring-comparison` | 또래 비교 섹션 |
| `.tutoring-bar-wrap` | 가로 막대 그래프 래퍼 |
| `.tutoring-bar` | 막대 본체 (width: JS로 % 설정) |
| `.tutoring-bar__avg-marker` | 평균 위치 마커 |
| `.tutoring-tier-badge` | 티어 뱃지 |
| `.tier--saving` | 절약형 색상 |
| `.tier--average` | 평균권 색상 |
| `.tier--active` | 적극 투자형 색상 |
| `.tier--high` | 고지출형 색상 |
| `.tutoring-simulation-table` | 누적 시뮬레이션 테이블 |
| `.tutoring-scenario-btn` | 시나리오 선택 버튼 |
| `.tutoring-opportunity-card` | 기회비용 결과 카드 |
| `.tutoring-tab-btn` | 탭형 버튼 (is-active) |
| `.tutoring-tips-list` | 절감 팁 리스트 |

### 7-2. 반응형 기준점

```scss
// 모바일: 단일 컬럼, 카드 아코디언 동작
// 768px+: 입력/결과 여백 확장
// 1024px+: KPI 카드 4열 그리드

.tutoring-kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.tutoring-subject-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: var(--space-2);

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    // 비용 입력과 삭제 버튼은 두 번째 행
  }
}
```

### 7-3. 티어 색상 토큰

```scss
.tier--saving  { --tier-color: var(--color-success); }
.tier--average { --tier-color: var(--color-primary); }
.tier--active  { --tier-color: var(--color-warning); }
.tier--high    { --tier-color: var(--color-danger);  }

.tutoring-tier-badge {
  background: var(--tier-color);
  color: #fff;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

---

## 8. 구현 순서 (v1 MVP)

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | `childTutoringData.ts` 작성 — 타입, 평균값, FAQ | `src/data/childTutoringData.ts` |
| 2 | `tools.ts` 에 항목 추가 | `src/data/tools.ts` |
| 3 | `_child-tutoring-cost-calculator.scss` 작성 및 `app.scss` 에 import | scss 파일 |
| 4 | `.astro` 페이지 마크업 작성 | `src/pages/tools/child-tutoring-cost-calculator.astro` |
| 5 | JS 상태 관리 + 계산 함수 구현 | `public/scripts/child-tutoring-cost-calculator.js` |
| 6 | 자녀 카드 동적 렌더링 구현 | JS |
| 7 | KPI 카드 + 또래 비교 렌더링 | JS |
| 8 | 누적 시뮬레이션 테이블 렌더링 | JS |
| 9 | 기회비용 계산 + 렌더링 | JS |
| 10 | 모바일 아코디언 동작 구현 | JS + SCSS |
| 11 | `sitemap.xml` 에 URL 추가 | `public/sitemap.xml` |
| 12 | `npm run build` 빌드 검증 | — |

---

## 9. `tools.ts` 등록 예시

```ts
{
  slug: "child-tutoring-cost-calculator",
  title: "아이 사교육비 계산기",
  description: "자녀 수, 학교급, 과목, 지역을 입력하면 월·연간·누적 교육비와 또래 평균 대비 수준을 한 번에 계산. 기회비용 시뮬레이션 포함.",
  order: /* 기존 마지막 순서 + 1 */,
  eyebrow: "육아",
  category: "parenting",
  badges: ["신규"],
  previewStats: [
    { label: "비교 기준", value: "4개 지역" },
    { label: "자녀 수", value: "최대 4명" },
  ],
},
```

---

## 10. QA 포인트

### 계산 정확성
- [ ] 자녀별 과목 합계 = 월 소계
- [ ] 전체 월 합계 = 자녀 소계의 합
- [ ] 연간 = 월 × 12
- [ ] 누적 = 월 × 12 × 잔여 연수
- [ ] 기회비용 FV 공식 검증 (수기 계산과 대조)
- [ ] 잔여 연수: 초등 3학년이면 6 − 3 + 1 = 4년

### UX
- [ ] 자녀 수 변경 시 카드 추가/삭제가 즉시 반영
- [ ] 과목 행 추가/삭제가 정상 동작
- [ ] 모바일 아코디언 열고 닫기 동작
- [ ] 입력값 변경 즉시 결과 갱신 (debounce 불필요, 직접 반영)
- [ ] 지역 미선택 시 비교 섹션 미노출 또는 안내 문구 표시
- [ ] 과목 0개 상태에서 오류 없이 0원 표시

### 콘텐츠
- [ ] 모든 평균값에 "추정·참고" 레이블 표기
- [ ] 기회비용 결과에 "실제 수익 보장 아님" 면책 문구
- [ ] 비교 티어 문구가 경쟁 심리 자극 없이 중립적
- [ ] FAQ 내용이 실제 계산 로직과 일치

### 빌드
- [ ] `npm run build` 오류 없음
- [ ] `/tools/child-tutoring-cost-calculator/` 라우트 `dist/` 에 생성 확인
- [ ] OG 이미지 경로 일치

---

## 11. 유의사항

- **평균 데이터 갱신**: 통계청 사교육비 조사는 매년 3월경 발표. 데이터 연도를 주석으로 명시하고 갱신 시 `childTutoringData.ts` 만 수정하면 되도록 구조화.
- **비교 결과 표현**: "상위 N%" 표현 금지. 항상 "평균 대비 수준" 중심 문구 사용.
- **기회비용 면책**: 투자 권유가 아님을 반드시 명시. `InfoNotice` 컴포넌트로 처리.
- **광고 위치**: 결과 대시보드 하단, 기회비용 섹션 상단 2곳 최우선. AdSense 삽입 시 계산 결과 카드와 시각적으로 명확히 분리.
