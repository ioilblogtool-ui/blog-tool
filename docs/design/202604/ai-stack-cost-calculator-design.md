# AI 스택 비용 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/ai-stack-cost-calculator.md`
> 작성일: 2026-04-13
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준
> 참고 계산기: `fire-calculator`, `dca-investment-calculator` (입력 → 결과 패턴)

---

## 1. 문서 개요

- **슬러그**: `ai-stack-cost-calculator`
- **URL**: `/tools/ai-stack-cost-calculator/`
- **콘텐츠 유형**: 인터랙티브 계산기 (`/tools/` 계열)
- **레이아웃**: `BaseLayout` + `SimpleToolShell` 사용
  - 이 저장소의 계산기 페이지 공통 패턴을 따른다.
  - `pageClass="ai-page"` 또는 `pageClass="ai-stack-page"`로 전용 스타일 범위를 분리한다.
  - 입력이 길고 결과가 의사결정 중심이므로 `resultFirst={true}` 적용을 기본값으로 본다.

---

## 2. 파일 구조

```
src/
  data/
    aiStackTools.ts          ← 툴 목록, 프리셋, FAQ 데이터
  pages/
    tools/
      ai-stack-cost-calculator.astro

public/
  og/
    tools/
      ai-stack-cost-calculator.png
  scripts/
    ai-stack-cost-calculator.js

src/styles/scss/pages/
  _ai-stack-cost-calculator.scss   (prefix: ai-)
```

---

## 3. 데이터 파일 설계 (`aiStackTools.ts`)

### 3-1. 타입 정의

```ts
export type Stage =
  | "planning"    // 기획
  | "analysis"    // 분석
  | "development" // 개발
  | "design"      // 디자인
  | "deployment"  // 배포
  | "operation";  // 운영

export type UsageLevel = "light" | "normal" | "heavy";
export type BudgetTier = "under30" | "30to60" | "60to100" | "over100";
export type BundleType = "budget" | "balanced" | "full";

export type AiTool = {
  id: string;
  name: string;
  monthlyUsd: number;           // 개인 플랜 월 비용 (USD)
  yearlyUsd?: number;           // 연간 결제 시 월 환산 (USD)
  category: "general" | "dev" | "research" | "design" | "docs";
  stages: Stage[];              // 커버하는 업무 단계
  primaryStage: Stage;          // 가장 강한 단계
  tagline: string;              // 한 줄 설명
  officialUrl: string;
  badge?: string;               // "무료플랜 있음" 등
};

export type PresetBundle = {
  id: string;
  name: string;
  toolIds: string[];
  targetStages: Stage[];
  monthlyCostUsd: number;
  type: BundleType;
  description: string;
  forWhom: string;              // "1인 개발자·사이드프로젝트"
};
```

### 3-2. 툴 데이터 (8종)

```ts
export const AI_TOOLS: AiTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    monthlyUsd: 20,
    category: "general",
    stages: ["planning", "analysis", "deployment", "operation"],
    primaryStage: "planning",
    tagline: "범용 문서·아이디어·분석 — 가장 넓은 커버리지",
    officialUrl: "https://openai.com/chatgpt/pricing/",
    badge: "무료플랜 있음",
  },
  {
    id: "claude",
    name: "Claude Pro",
    monthlyUsd: 20,
    category: "general",
    stages: ["planning", "analysis", "operation"],
    primaryStage: "planning",
    tagline: "긴 문서·자연스러운 문장·코드리뷰에 강점",
    officialUrl: "https://claude.ai/upgrade",
    badge: "무료플랜 있음",
  },
  {
    id: "cursor",
    name: "Cursor Pro",
    monthlyUsd: 20,
    category: "dev",
    stages: ["development"],
    primaryStage: "development",
    tagline: "AI 코드 에디터 — 개발 생산성 특화",
    officialUrl: "https://www.cursor.com/pricing",
    badge: "무료플랜 있음",
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    monthlyUsd: 20,
    category: "research",
    stages: ["analysis", "planning"],
    primaryStage: "analysis",
    tagline: "출처 기반 실시간 리서치·비교 조사",
    officialUrl: "https://www.perplexity.ai/pro",
    badge: "무료플랜 있음",
  },
  {
    id: "canva",
    name: "Canva Pro",
    monthlyUsd: 15,
    category: "design",
    stages: ["design"],
    primaryStage: "design",
    tagline: "배너·썸네일·SNS 콘텐츠 시각화",
    officialUrl: "https://www.canva.com/pricing/",
    badge: "무료플랜 있음",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    monthlyUsd: 10,
    category: "docs",
    stages: ["planning", "operation"],
    primaryStage: "operation",
    tagline: "문서 요약·정리·작업 관리 보조",
    officialUrl: "https://www.notion.com/pricing",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    monthlyUsd: 10,
    category: "dev",
    stages: ["development"],
    primaryStage: "development",
    tagline: "IDE 내 코드 자동완성·제안",
    officialUrl: "https://github.com/features/copilot",
    badge: "무료플랜 있음",
  },
  {
    id: "gamma",
    name: "Gamma",
    monthlyUsd: 10,
    category: "docs",
    stages: ["planning", "design"],
    primaryStage: "planning",
    tagline: "AI 슬라이드·기획 문서 초안 자동 생성",
    officialUrl: "https://gamma.app/pricing",
    badge: "무료플랜 있음",
  },
];
```

### 3-3. 프리셋 번들 (5종)

```ts
export const PRESET_BUNDLES: PresetBundle[] = [
  {
    id: "starter",
    name: "절약형 스타터",
    toolIds: ["chatgpt"],
    targetStages: ["planning", "analysis", "operation"],
    monthlyCostUsd: 20,
    type: "budget",
    description: "ChatGPT 하나로 기획·분석·운영 가볍게 시작",
    forWhom: "AI 처음 써보는 분 / 예산 최소화",
  },
  {
    id: "mvp",
    name: "MVP 런치 스택",
    toolIds: ["chatgpt", "cursor", "claude"],
    targetStages: ["planning", "development", "deployment"],
    monthlyCostUsd: 60,
    type: "balanced",
    description: "기획 + 개발 + 배포 — 1인 서비스 출시 기본 조합",
    forWhom: "사이드프로젝트 개발자 / 1인 빌더",
  },
  {
    id: "planner",
    name: "기획자 솔로 스택",
    toolIds: ["chatgpt", "claude", "perplexity"],
    targetStages: ["planning", "analysis"],
    monthlyCostUsd: 60,
    type: "balanced",
    description: "리서치 + 기획 문서 + 글쓰기 심화",
    forWhom: "기획자 / 리서처 / 콘텐츠 전략가",
  },
  {
    id: "content",
    name: "콘텐츠 운영 스택",
    toolIds: ["chatgpt", "canva", "notion-ai"],
    targetStages: ["planning", "design", "operation"],
    monthlyCostUsd: 45,
    type: "balanced",
    description: "콘텐츠 제작 + 시각화 + 운영 문서 자동화",
    forWhom: "콘텐츠 크리에이터 / SNS 운영자",
  },
  {
    id: "full",
    name: "풀 자동화 스택",
    toolIds: ["chatgpt", "claude", "cursor", "canva"],
    targetStages: ["planning", "analysis", "development", "design", "operation"],
    monthlyCostUsd: 75,
    type: "full",
    description: "기획부터 개발, 디자인, 운영까지 전 단계 AI 커버",
    forWhom: "다단계 혼자 커버하는 빌더 / 프리랜서",
  },
];
```

### 3-4. 단계 레이블

```ts
export const STAGE_LABELS: Record<Stage, string> = {
  planning:    "기획",
  analysis:    "분석",
  development: "개발",
  design:      "디자인",
  deployment:  "배포",
  operation:   "운영",
};

export const STAGE_ICONS: Record<Stage, string> = {
  planning:    "📋",
  analysis:    "🔍",
  development: "💻",
  design:      "🎨",
  deployment:  "🚀",
  operation:   "📊",
};
```

### 3-5. 기본값 및 메타

```ts
export const AI_CALC_META = {
  slug: "ai-stack-cost-calculator",
  title: "AI 스택 비용 계산기",
  defaultExchangeRate: 1380,     // 기본 환율 (KRW/USD)
  updatedAt: "2026년 4월",
  priceNote: "가격 정보는 각 서비스 공식 페이지 기준입니다. 실제 요금은 시점에 따라 다를 수 있습니다.",
};

export const AI_CALC_FAQ = [
  {
    q: "AI 툴 비용은 왜 실제 결제액과 다를 수 있나요?",
    a: "환율, 부가세(VAT), 카드 해외결제 수수료, 연간 결제 할인 여부에 따라 실제 청구액은 달라질 수 있습니다. 이 계산기는 공식 월정가 기준 추정치입니다.",
  },
  {
    q: "여러 AI 툴을 같이 쓰는 게 비효율인가요?",
    a: "단계별로 역할이 다르면 중복이 아닙니다. 다만 기획·운영 영역은 ChatGPT와 Claude가 많이 겹치기 때문에, 둘 다 구독하기보다 하나를 고르는 경우가 많습니다.",
  },
  {
    q: "1인 개발자에게 가장 많이 쓰이는 조합은?",
    a: "ChatGPT + Cursor 조합이 가장 흔합니다. 긴 문서나 코드리뷰가 많으면 Claude를 추가하는 경우가 많고, 배포 후 운영 문서가 필요해지면 Notion AI가 추가되는 패턴입니다.",
  },
  {
    q: "예산이 $30 이하면 어떤 툴부터 시작하나요?",
    a: "ChatGPT Plus 하나로 기획·분석·운영을 넓게 커버하는 것이 가장 무난합니다. 개발 비중이 높다면 GitHub Copilot($10)이 더 효율적일 수 있습니다.",
  },
  {
    q: "환율은 어떻게 반영되나요?",
    a: "기본값으로 1USD = 1,380원을 사용합니다. 직접 수정해서 현재 환율을 반영할 수 있습니다. 부가세 옵션 체크 시 10%가 추가됩니다.",
  },
  {
    q: "팀 단위 비용도 계산할 수 있나요?",
    a: "인원 수 입력 옵션을 통해 총비용과 1인당 비용을 함께 확인할 수 있습니다. 팀 플랜 전환 시 실제 기업 요금과 비교 확인을 권장합니다.",
  },
];
```

---

## 4. 페이지 섹션 구성 (Astro)

페이지 골격은 기존 계산기들과 동일하게 아래 흐름을 따른다.

```astro
<BaseLayout ...>
  <SiteHeader />
  <SimpleToolShell
    calculatorId="ai-stack-cost-calculator"
    pageClass="ai-page"
    resultFirst={true}
  >
    <Fragment slot="hero">...</Fragment>
    <Fragment slot="actions">...</Fragment>
    <Fragment slot="aside">...</Fragment>
    <Fragment slot="results">...</Fragment>
  </SimpleToolShell>
</BaseLayout>
```

### SECTION A. Hero

```astro
<CalculatorHero ... />
<InfoNotice ... />
```

권장 구성:

- `eyebrow`: `AI 구독료 계산기`
- `title`: `AI 스택 비용 계산기`
- `description`: `기획·개발·디자인·운영까지 업무 단계별로 AI 툴을 골라 월간·연간 비용을 바로 계산하고, 예산에 맞는 최적 조합을 추천받으세요.`
- `ToolActionBar`는 `actions` 슬롯에서 `resetId="aiResetBtn"`, `copyId="aiCopyLinkBtn"`로 연결

### SECTION B. 계산기 입력 (5 Steps)

```html
<section class="ai-calc-section">
  <div class="ai-calc-card">

    <!-- Step 1: 업무 단계 선택 -->
    <div class="ai-step">
      <p class="ai-step-label">Step 1. 어떤 업무 단계에 집중하나요?</p>
      <p class="ai-step-sub">복수 선택 가능 · 기본값: 기획 + 개발</p>
      <div class="ai-stage-chips" id="ai-stage-chips">
        <!-- STAGE_LABELS 6개 chip 버튼, data-stage="planning" 등 -->
        <button class="ai-chip ai-chip--stage is-active" data-stage="planning">📋 기획</button>
        <button class="ai-chip ai-chip--stage" data-stage="analysis">🔍 분석</button>
        <button class="ai-chip ai-chip--stage is-active" data-stage="development">💻 개발</button>
        <button class="ai-chip ai-chip--stage" data-stage="design">🎨 디자인</button>
        <button class="ai-chip ai-chip--stage" data-stage="deployment">🚀 배포</button>
        <button class="ai-chip ai-chip--stage" data-stage="operation">📊 운영</button>
      </div>
    </div>

    <!-- Step 2: 사용 강도 -->
    <div class="ai-step">
      <p class="ai-step-label">Step 2. 사용 강도는 어느 정도인가요?</p>
      <div class="ai-intensity-btns" id="ai-intensity-btns">
        <button class="ai-intensity-btn" data-level="light">가볍게<span>핵심 1개 추천</span></button>
        <button class="ai-intensity-btn is-active" data-level="normal">보통<span>핵심 + 보조 추천</span></button>
        <button class="ai-intensity-btn" data-level="heavy">집중적으로<span>전 단계 커버 추천</span></button>
      </div>
    </div>

    <!-- Step 3: 월 예산 -->
    <div class="ai-step">
      <p class="ai-step-label">Step 3. 월 예산은 어느 정도인가요?</p>
      <div class="ai-budget-btns" id="ai-budget-btns">
        <button class="ai-budget-btn" data-budget="under30">$30 이하</button>
        <button class="ai-budget-btn is-active" data-budget="30to60">$30~$60</button>
        <button class="ai-budget-btn" data-budget="60to100">$60~$100</button>
        <button class="ai-budget-btn" data-budget="over100">$100 이상</button>
      </div>
    </div>

    <!-- Step 4: 현재 구독 중인 툴 -->
    <div class="ai-step">
      <p class="ai-step-label">Step 4. 이미 구독 중인 툴이 있나요? <span class="ai-optional">선택</span></p>
      <p class="ai-step-sub">선택 시 해당 비용을 제외하고 추가 필요 금액을 계산합니다.</p>
      <div class="ai-tool-checks" id="ai-tool-checks">
        <!-- AI_TOOLS 8개 checkbox, data-tool-id="chatgpt" 등 -->
      </div>
    </div>

    <!-- Step 5: 환율 옵션 (고급) -->
    <div class="ai-step">
      <p class="ai-step-label">Step 5. 원화 환산 옵션 <span class="ai-optional">고급</span></p>
      <div class="ai-option-row">
        <label class="ai-option-label">환율 (1 USD =</label>
        <input type="number" id="ai-exchange-rate" class="ai-input-small" value="1380" min="1000" max="2000" step="10">
        <span>원)</span>
      </div>
      <div class="ai-option-row">
        <label class="ai-checkbox-label">
          <input type="checkbox" id="ai-vat-check"> 부가세 10% 포함
        </label>
      </div>
    </div>

    <!-- 계산 버튼 (선택 즉시 자동 반영되지만, 명시적 CTA도 제공) -->
    <button class="ai-calc-btn" id="ai-calc-btn">비용 계산하기</button>
  </div>
</section>
```

### SECTION C. 결과 카드

```html
<section class="ai-result-section" id="ai-result-section">

  <!-- 메인 KPI -->
  <div class="ai-result-kpi">
    <div class="ai-kpi-card ai-kpi-card--main">
      <p class="ai-kpi-label">월 예상 비용</p>
      <p class="ai-kpi-value" id="ai-monthly-usd">$0</p>
      <p class="ai-kpi-krw" id="ai-monthly-krw">약 0만원</p>
    </div>
    <div class="ai-kpi-card">
      <p class="ai-kpi-label">연 예상 비용</p>
      <p class="ai-kpi-value" id="ai-annual-usd">$0</p>
      <p class="ai-kpi-krw" id="ai-annual-krw">약 0만원</p>
    </div>
    <div class="ai-kpi-card">
      <p class="ai-kpi-label">단계 커버리지</p>
      <p class="ai-kpi-value" id="ai-coverage">0%</p>
      <p class="ai-kpi-note" id="ai-coverage-note">선택한 단계 중 커버 가능 비율</p>
    </div>
    <div class="ai-kpi-card">
      <p class="ai-kpi-label">절감 가능 금액</p>
      <p class="ai-kpi-value" id="ai-savings">$0</p>
      <p class="ai-kpi-note">절약형 스택 전환 시</p>
    </div>
  </div>

  <!-- 추천 스택 -->
  <div class="ai-recommend-grid">
    <div class="ai-recommend-card ai-recommend-card--best">
      <p class="ai-rec-badge">최적 스택</p>
      <p class="ai-rec-name" id="ai-rec-name">—</p>
      <p class="ai-rec-cost" id="ai-rec-cost">—</p>
      <div class="ai-rec-tools" id="ai-rec-tools"></div>
      <p class="ai-rec-desc" id="ai-rec-desc">—</p>
    </div>
    <div class="ai-recommend-card ai-recommend-card--budget">
      <p class="ai-rec-badge">절약형</p>
      <p class="ai-rec-name" id="ai-budget-name">—</p>
      <p class="ai-rec-cost" id="ai-budget-cost">—</p>
      <div class="ai-rec-tools" id="ai-budget-tools"></div>
      <p class="ai-rec-desc" id="ai-budget-desc">—</p>
    </div>
  </div>

  <!-- 비용 비중 차트 -->
  <div class="ai-chart-wrap">
    <p class="ai-chart-title">선택 툴별 비용 비중</p>
    <canvas id="ai-donut-chart"></canvas>
  </div>

</section>
```

### SECTION D. 프리셋 스택 카드

```html
<section class="content-section">
  <div class="section-header--compact">
    <p class="section-header__eyebrow">인기 조합</p>
    <h2>대표 AI 스택 프리셋</h2>
    <p>아래 조합 중 하나를 골라 계산기에 바로 불러올 수 있습니다.</p>
  </div>
  <div class="ai-preset-grid">
    <!-- PRESET_BUNDLES 5개 순회 -->
    <div class="ai-preset-card" data-preset-id="mvp">
      <div class="ai-preset-head">
        <p class="ai-preset-name">MVP 런치 스택</p>
        <p class="ai-preset-cost">월 $60</p>
      </div>
      <p class="ai-preset-for">1인 개발자 · 사이드프로젝트</p>
      <div class="ai-preset-tools"><!-- 툴 칩 --></div>
      <p class="ai-preset-desc">기획 + 개발 + 배포 — 1인 서비스 출시 기본 조합</p>
      <button class="ai-preset-apply" data-preset-id="mvp">이 조합으로 계산하기</button>
    </div>
    <!-- 나머지 4개 동일 패턴 -->
  </div>
</section>
```

### SECTION E. 툴 비교표

```html
<section class="content-section">
  <div class="section-header--compact">
    <p class="section-header__eyebrow">툴 가격표</p>
    <h2>AI 툴 비교표</h2>
    <p>월정가 기준 · {AI_CALC_META.updatedAt} 업데이트</p>
  </div>
  <div class="table-wrap">
    <table class="ai-tool-table">
      <thead>
        <tr>
          <th>툴</th>
          <th>월 비용</th>
          <th>주요 단계</th>
          <th>특징</th>
          <th>공식 링크</th>
        </tr>
      </thead>
      <tbody>
        <!-- AI_TOOLS 8개 순회 -->
      </tbody>
    </table>
  </div>
  <p class="ai-price-note">{AI_CALC_META.priceNote}</p>
</section>
```

### SECTION F. FAQ + SeoContent

```astro
<SeoContent
  introTitle="AI 스택 비용 계산기 이용 안내"
  intro={[
    "ChatGPT, Claude, Cursor 같은 AI 툴을 여러 개 쓰다 보면 월 구독료가 생각보다 빠르게 쌓입니다. 이 계산기는 업무 단계별로 필요한 AI 툴을 골라 월간·연간 비용을 한 번에 확인하고, 예산에 맞는 최적 조합을 추천해줍니다.",
    "단계 선택 → 사용 강도 → 예산 순으로 입력하면 추천 스택과 절약형 대안이 자동으로 계산됩니다.",
    "환율과 부가세 옵션을 반영하면 실제 체감 원화 비용까지 확인할 수 있습니다.",
  ]}
  criteria={[
    "가격은 각 서비스 공식 월 구독 요금(개인 플랜) 기준",
    "기존 구독 툴 선택 시 해당 비용 제외 후 추가 비용 기준 재계산",
    "사용 강도는 추천 스택 레벨에 반영 (가격 배수 아님)",
  ]}
  faq={faqItems}
/>
```

---

## 5. JS 인터랙션 (`ai-stack-cost-calculator.js`)

기존 계산기들과 동일하게 `type="module"` 스크립트로 로드한다. `ai-` prefix 유지.

### 5-0. 스크립트 로드 규칙

```astro
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/ai-stack-cost-calculator.js")}></script>
```

- 차트가 필요하면 이 저장소 공용 파일인 `public/scripts/chart-config.js`를 import 해서 색상/툴팁 기본값을 재사용한다.
- 별도 프레임워크나 island 추가 없이, Astro + vanilla JS 기준으로 끝낸다.
- URL 공유가 중요하므로 가능하면 `public/scripts/url-state.js` 패턴을 참고해 주요 입력값을 query string에 저장한다.

### 5-1. 상태 객체

```js
const state = {
  selectedStages: ["planning", "development"],  // Stage[]
  intensity: "normal",                          // "light"|"normal"|"heavy"
  budget: "30to60",                             // BudgetTier
  currentTools: [],                             // 이미 구독 중인 툴 id[]
  exchangeRate: 1380,
  vatIncluded: false,
};
```

### 5-2. 핵심 데이터 (JS 내 인라인 또는 data-* 전달)

Astro 페이지에서 아래처럼 JSON 직렬화해 `<div id="ai-data">`에 data-* 속성으로 전달:

```astro
<div
  id="ai-data"
  data-tools={JSON.stringify(AI_TOOLS)}
  data-presets={JSON.stringify(PRESET_BUNDLES)}
  aria-hidden="true"
  style="display:none"
></div>
```

### 5-3. 함수 목록

| 함수 | 역할 |
|---|---|
| `loadData()` | `#ai-data`에서 tools/presets 파싱 |
| `initStageChips()` | 단계 칩 멀티 토글 |
| `initIntensityBtns()` | 사용 강도 단일 선택 |
| `initBudgetBtns()` | 예산 단일 선택 |
| `initToolChecks()` | 현재 구독 툴 체크박스 렌더링 + 이벤트 |
| `initOptionInputs()` | 환율 input, VAT 체크 |
| `initPresetBtns()` | "이 조합으로 계산하기" → state 업데이트 + 재계산 |
| `calculate()` | 메인 계산 로직 → 결과 DOM 업데이트 |
| `renderRecommendation()` | 추천/절약 스택 카드 업데이트 |
| `initDonutChart()` | Chart.js donut 초기 생성 |
| `updateDonutChart()` | 선택 변경 시 데이터 업데이트 |
| `renderToolTable()` | 툴 비교표 동적 렌더 (정적 HTML 보완) |
| `renderPresetCards()` | 프리셋 카드 동적 렌더 |
| `syncUrlState()` | 단계/강도/예산/환율/VAT를 URL query string으로 저장 |
| `restoreUrlState()` | 공유 링크 진입 시 상태 복원 |

### 5-4. 계산 로직

```js
function calculate() {
  const tools = window.__AI_TOOLS__;
  const presets = window.__AI_PRESETS__;

  // 1. 단계 기준 후보 툴 필터
  const candidateTools = tools.filter(t =>
    t.stages.some(s => state.selectedStages.includes(s))
  );

  // 2. 이미 구독 중인 툴은 현재 비용에 포함
  const currentCost = tools
    .filter(t => state.currentTools.includes(t.id))
    .reduce((sum, t) => sum + t.monthlyUsd, 0);

  // 3. 추천 스택 선정 로직
  //    - budget에 따라 monthlyCostUsd 필터
  //    - selectedStages 커버리지 높은 preset 우선
  //    - intensity에 따라 추천 우선순위 보정
  const budgetMax = { under30: 30, "30to60": 60, "60to100": 100, over100: 999 }[state.budget];
  const eligible = presets.filter(p => p.monthlyCostUsd <= budgetMax);

  // 커버리지 계산: 선택 단계 중 preset이 커버하는 비율
  function coverage(preset) {
    const covered = state.selectedStages.filter(s =>
      preset.targetStages.includes(s)
    ).length;
    return covered / state.selectedStages.length;
  }

  function intensityScore(preset) {
    if (state.intensity === "light") {
      return preset.type === "budget" ? 2 : preset.type === "balanced" ? 1 : 0;
    }
    if (state.intensity === "heavy") {
      return preset.type === "full" ? 2 : preset.type === "balanced" ? 1 : 0;
    }
    return preset.type === "balanced" ? 2 : 1;
  }

  const sorted = eligible.sort((a, b) => {
    const coverageGap = coverage(b) - coverage(a);
    if (coverageGap !== 0) return coverageGap;
    const intensityGap = intensityScore(b) - intensityScore(a);
    if (intensityGap !== 0) return intensityGap;
    return a.monthlyCostUsd - b.monthlyCostUsd;
  });
  const recommended = sorted[0] || presets[0];
  const budgetAlt = presets.find(p => p.type === "budget") || presets[0];

  // 4. 총 비용 계산 (추천 스택 기준)
  const totalUsd = recommended.monthlyCostUsd;
  const alreadyPaidUsd = tools
    .filter(t => state.currentTools.includes(t.id) && recommended.toolIds.includes(t.id))
    .reduce((sum, t) => sum + t.monthlyUsd, 0);
  const additionalUsd = Math.max(0, totalUsd - alreadyPaidUsd);

  const vatMul = state.vatIncluded ? 1.1 : 1;
  const monthlyKrw = Math.round(additionalUsd * state.exchangeRate * vatMul);
  const annualUsd = additionalUsd * 12;
  const annualKrw = monthlyKrw * 12;
  const savingsUsd = totalUsd - budgetAlt.monthlyCostUsd;
  const coveragePct = Math.round(coverage(recommended) * 100);

  // 5. DOM 업데이트 + URL 반영
  updateResultDOM({ additionalUsd, monthlyKrw, annualUsd, annualKrw, savingsUsd, coveragePct, recommended, budgetAlt });
  updateDonutChart(recommended, tools);
  syncUrlState();
}
```

### 5-5. 도넛 차트 (Chart.js)

```js
let donutChart = null;

function initDonutChart() {
  const canvas = document.getElementById("ai-donut-chart");
  if (!canvas || typeof Chart === "undefined") return;

  donutChart = new Chart(canvas, {
    type: "doughnut",
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` $${ctx.parsed}/월 (${ctx.label})`,
          },
        },
      },
      cutout: "65%",
    },
  });
}

function updateDonutChart(preset, tools) {
  if (!donutChart) return;
  const toolData = preset.toolIds.map(id => tools.find(t => t.id === id)).filter(Boolean);
  const COLORS = ["#1D9E75","#4a90d9","#9c7cc7","#f5a623","#e57373","#4caf8d","#90a4ae","#5c6bc0"];
  donutChart.data.labels = toolData.map(t => t.name);
  donutChart.data.datasets[0].data = toolData.map(t => t.monthlyUsd);
  donutChart.data.datasets[0].backgroundColor = COLORS.slice(0, toolData.length);
  donutChart.update();
}
```

### 5-6. 초기화

```js
document.addEventListener("DOMContentLoaded", function () {
  loadData();
  renderPresetCards();
  initStageChips();
  initIntensityBtns();
  initBudgetBtns();
  initToolChecks();
  initOptionInputs();
  initPresetBtns();
  document.getElementById("ai-calc-btn")?.addEventListener("click", calculate);

  if (typeof Chart !== "undefined") {
    initDonutChart();
    calculate();
  } else {
    const s = document.querySelector('script[src*="chart"]');
    if (s) s.addEventListener("load", function () {
      initDonutChart();
      calculate();
    });
  }
});
```

---

## 6. SCSS 설계 (`_ai-stack-cost-calculator.scss`)

**prefix**: `ai-`  
**색상 팔레트**: 하드코딩 (프로젝트 컨벤션)

```scss
// 색상 변수 (로컬)
$ai-green:      #1D9E75;
$ai-green-dark: #0F6E56;
$ai-green-tint: #E1F5EE;
$ai-blue:       #4a90d9;
$ai-purple:     #9c7cc7;

$bg-card:   #fff;
$bg-section: linear-gradient(180deg, #f6fbf9 0%, #eef7f3 100%);
$border:    #d4eae3;
$text:      #172033;
$muted:     #5f6674;
$accent:    #0F6E56;

// ── 페이지 래퍼 ─────────────────────────────────────────────
.ai-calc-page {
  display: grid;
  gap: 24px;

  .content-section { /* 동일한 섹션 카드 스타일 */ }
}

// ── 계산기 카드 ─────────────────────────────────────────────
.ai-calc-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// ── Step 레이블 ─────────────────────────────────────────────
.ai-step-label {
  font-weight: 700; font-size: 0.9rem; color: $text; margin: 0 0 6px;
}
.ai-step-sub { font-size: 0.78rem; color: $muted; margin: 0 0 10px; }
.ai-optional {
  font-size: 0.7rem; font-weight: 400;
  background: #f0f0f0; border-radius: 4px; padding: 2px 6px;
  color: $muted; margin-left: 6px;
}

// ── 단계 칩 ─────────────────────────────────────────────────
.ai-stage-chips { display: flex; flex-wrap: wrap; gap: 8px; }

.ai-chip--stage {
  padding: 6px 14px; border-radius: 999px;
  border: 1.5px solid $border; background: $bg-card;
  font-size: 0.85rem; cursor: pointer; color: $text;
  transition: all 0.15s;

  &.is-active {
    background: $ai-green; color: #fff;
    border-color: $ai-green; font-weight: 600;
  }
}

// ── 강도 버튼 ────────────────────────────────────────────────
.ai-intensity-btns { display: flex; gap: 10px; flex-wrap: wrap; }

.ai-intensity-btn {
  flex: 1; min-width: 100px; padding: 10px 12px;
  border-radius: 12px; border: 1.5px solid $border;
  background: $bg-card; cursor: pointer; text-align: center;
  font-weight: 600; font-size: 0.88rem; color: $text;
  display: flex; flex-direction: column; gap: 3px;
  transition: all 0.15s;

  span { font-size: 0.72rem; font-weight: 400; color: $muted; }

  &.is-active {
    border-color: $ai-green; background: $ai-green-tint;
    color: $accent;
  }
}

// ── 예산 버튼 ────────────────────────────────────────────────
.ai-budget-btns { display: flex; gap: 8px; flex-wrap: wrap; }

.ai-budget-btn {
  padding: 7px 16px; border-radius: 8px;
  border: 1.5px solid $border; background: $bg-card;
  font-size: 0.85rem; cursor: pointer; color: $text;
  font-weight: 500; transition: all 0.15s;

  &.is-active {
    border-color: $ai-green-dark; background: $ai-green-dark;
    color: #fff; font-weight: 600;
  }
}

// ── 툴 체크박스 ──────────────────────────────────────────────
.ai-tool-checks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.ai-tool-check-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border: 1.5px solid $border; border-radius: 10px;
  background: $bg-card; cursor: pointer; font-size: 0.82rem;
  color: $text; transition: border-color 0.15s;

  input[type="checkbox"] { accent-color: $ai-green; width: 14px; height: 14px; }

  &.is-checked { border-color: $ai-green; background: $ai-green-tint; }

  .ai-tool-price { margin-left: auto; color: $muted; font-size: 0.75rem; }
}

// ── 환율 옵션 ────────────────────────────────────────────────
.ai-option-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem; color: $text; margin-bottom: 8px;
}
.ai-input-small {
  width: 80px; padding: 5px 8px;
  border: 1px solid $border; border-radius: 6px;
  font-size: 0.85rem; text-align: right;
}

// ── 계산 버튼 ────────────────────────────────────────────────
.ai-calc-btn {
  width: 100%; padding: 14px;
  background: $ai-green; color: #fff;
  border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s;

  &:hover { background: $ai-green-dark; }
}

// ── 결과 KPI ─────────────────────────────────────────────────
.ai-result-kpi {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
}

.ai-kpi-card {
  padding: 16px 14px; text-align: center;
  background: $bg-card; border: 1px solid $border; border-radius: 14px;

  &--main { border-color: $ai-green; background: $ai-green-tint; }
}
.ai-kpi-label { font-size: 0.74rem; color: $muted; margin: 0 0 4px; }
.ai-kpi-value { font-size: 1.6rem; font-weight: 700; color: $ai-green; margin: 0; }
.ai-kpi-krw   { font-size: 0.78rem; color: $muted; margin: 2px 0 0; }
.ai-kpi-note  { font-size: 0.72rem; color: $muted; margin: 2px 0 0; }

// ── 추천 스택 카드 ───────────────────────────────────────────
.ai-recommend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
}

.ai-recommend-card {
  padding: 18px 16px; border-radius: 16px;
  border: 1.5px solid $border; background: $bg-card;
}
.ai-recommend-card--best  { border-color: $ai-green; }
.ai-recommend-card--budget { border-color: $ai-blue; }

.ai-rec-badge {
  font-size: 0.68rem; font-weight: 700;
  color: $accent; text-transform: uppercase;
  letter-spacing: 0.06em; margin: 0 0 6px;
}
.ai-rec-name { font-size: 1rem; font-weight: 700; color: $text; margin: 0 0 4px; }
.ai-rec-cost { font-size: 1.25rem; font-weight: 700; color: $ai-green; margin: 0 0 8px; }
.ai-rec-tools { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.ai-rec-tool-chip {
  font-size: 0.72rem; padding: 2px 8px;
  background: #f0f4f8; border-radius: 999px; color: $text;
}
.ai-rec-desc { font-size: 0.8rem; color: $muted; margin: 0; line-height: 1.6; }

// ── 도넛 차트 ────────────────────────────────────────────────
.ai-chart-wrap {
  background: $bg-card; border: 1px solid $border;
  border-radius: 16px; padding: 20px;
  max-height: 300px;

  canvas { max-height: 240px; }
}
.ai-chart-title { font-size: 0.88rem; font-weight: 600; color: $text; margin: 0 0 12px; }

// ── 프리셋 카드 ──────────────────────────────────────────────
.ai-preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}

.ai-preset-card {
  padding: 18px 16px; border-radius: 16px;
  border: 1px solid $border; background: $bg-card;
  display: flex; flex-direction: column; gap: 8px;
}
.ai-preset-head {
  display: flex; justify-content: space-between; align-items: baseline;
}
.ai-preset-name { font-weight: 700; font-size: 0.95rem; color: $text; }
.ai-preset-cost { font-weight: 700; color: $ai-green; font-size: 0.9rem; }
.ai-preset-for  { font-size: 0.76rem; color: $muted; }
.ai-preset-desc { font-size: 0.8rem; color: $muted; line-height: 1.6; flex: 1; }
.ai-preset-apply {
  margin-top: auto; padding: 8px 0; width: 100%;
  background: $ai-green-tint; border: 1.5px solid $ai-green;
  border-radius: 8px; font-size: 0.82rem; font-weight: 600;
  color: $accent; cursor: pointer; transition: background 0.15s;

  &:hover { background: $ai-green; color: #fff; }
}

// ── 툴 비교표 ────────────────────────────────────────────────
.ai-tool-table {
  width: 100%; border-collapse: collapse; font-size: 0.84rem;

  th { padding: 10px 12px; text-align: left; background: #f5faf7; font-size: 0.75rem; font-weight: 700; color: $muted; border-bottom: 2px solid $border; }
  td { padding: 10px 12px; border-bottom: 1px solid $border; color: $text; vertical-align: middle; }
}

.ai-price-note {
  font-size: 0.76rem; color: $muted; margin-top: 10px; line-height: 1.6;
}
```

---

## 7. 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "ai-stack-cost-calculator",
  title: "AI 스택 비용 계산기",
  description: "ChatGPT, Claude, Cursor, Perplexity 등 AI 툴 조합의 월간·연간 비용을 계산하고, 업무 단계별 최적 스택을 추천받는 계산기",
  order: /* 현재 마지막 order + 1 */,
  category: "calculator",
  badges: ["AI툴", "구독료", "비용계산"],
  previewStats: [
    { label: "기본 런치 스택", value: "$60/월" },
    { label: "절약형 스타터", value: "$20/월" },
  ],
},
```

### `src/pages/tools/ai-stack-cost-calculator.astro`

- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`, `ToolActionBar`, `SimpleToolShell` 조합 사용
- `jsonLd`는 `WebApplication` 기준으로 작성
- 하단에 Chart.js CDN + 페이지 전용 module script 로드

### `public/og/tools/ai-stack-cost-calculator.png`

- 초기 구현에서는 임시 OG 이미지 허용
- 추후 `npm run og:generate` 또는 수동 제작으로 대체 가능

### `src/styles/app.scss`

```scss
@use 'scss/pages/ai-stack-cost-calculator';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/ai-stack-cost-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. 구현 순서

1. `src/data/aiStackTools.ts` — 툴 데이터 + 프리셋 + FAQ + 메타
2. `src/styles/scss/pages/_ai-stack-cost-calculator.scss` — 스타일
3. `src/styles/app.scss` — import 추가
4. `src/pages/tools/ai-stack-cost-calculator.astro` — `SimpleToolShell` 기반 페이지 마크업
5. `public/scripts/ai-stack-cost-calculator.js` — 계산 로직 + URL 상태 + 차트
6. `src/data/tools.ts` — 등록
7. `public/og/tools/ai-stack-cost-calculator.png` — OG 준비
8. `public/sitemap.xml` — URL 추가
9. `npm run build` 확인

---

## 9. QA 포인트

- [ ] 단계 칩 0개 선택 시 → "먼저 업무 단계를 선택하세요" 안내 노출
- [ ] 이미 구독 툴이 추천 스택에 포함 시 → 추가 비용 0으로 표시
- [ ] 환율 입력값 비정상(0, 음수) 시 → 기본값 1380으로 fallback
- [ ] 프리셋 "이 조합으로 계산하기" → 칩 상태 자동 업데이트 확인
- [ ] 모바일 320px에서 단계 칩 wrapping 정상 확인
- [ ] Chart.js 로드 실패 시 → 차트 영역 fallback 텍스트 표시
- [ ] 툴 비교표 스크롤 가능 (table-wrap overflow-x: auto)
- [ ] 공유 URL 진입 시 선택한 단계/예산/환율 상태 복원 확인
- [ ] 이미 구독한 툴이 추천 스택과 100% 겹칠 때 "추가 필요 비용 0" 문구 자연스러운지 확인
