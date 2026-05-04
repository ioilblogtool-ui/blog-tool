# AI 도구 월비용 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/ai-subscription-cost.md`  
> 작성일: 2026-04-27  
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 계산기 페이지 구현에 착수할 수 있는 수준  
> 참고 계산기: `ai-stack-cost-calculator`, `ai-automation-hourly-roi`, `bonus-simulator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `AI 도구 월비용 계산기`
- 슬러그: `ai-subscription-cost`
- URL: `/tools/ai-subscription-cost/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/`)
- 카테고리: `AI·생산성`
- 핵심 사용자: 직장인, 개발자, 프리랜서, 1인 창업자, 스타트업 팀

### 1-2. 페이지 정의

> ChatGPT, Claude, Copilot, Perplexity, Notion AI, Midjourney, Gemini, Cursor 등
> 여러 AI 도구를 동시에 구독하는 사용자가
> 월 구독비, 연간 비용, 시간 절감 효과, ROI, 중복 구독 여부를 한 번에 계산하는 비용 점검 계산기

### 1-3. 구현 원칙

- 가격은 실시간 견적이 아니라 `기본 추천값`이다. 모든 도구 가격은 사용자가 직접 수정할 수 있어야 한다.
- 달러 결제 도구가 많으므로 환율 입력값을 결과의 핵심 변수로 노출한다.
- 구독료는 비용이고 시간 절감 효과는 사용자가 입력한 추정값이므로, 결과 영역에 `추정` 표현을 반복해서 사용한다.
- 개인과 팀을 하나의 계산기에서 처리하되, 기본 화면은 개인 사용자가 바로 이해할 수 있게 유지한다.
- 중복 구독 탐지는 해지 권고가 아니라 `점검 경고`로 표현한다.
- URL 공유와 초기값 복원이 가능해야 한다.

---

## 2. 파일 구조

```text
src/
  data/
    aiSubscriptionCost.ts
  pages/
    tools/
      ai-subscription-cost.astro

public/
  scripts/
    ai-subscription-cost.js
  og/
    tools/
      ai-subscription-cost.png

src/styles/scss/pages/
  _ai-subscription-cost.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/index.astro`
- `src/pages/tools/index.astro`가 별도 카테고리 매핑을 요구하면 함께 확인
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 및 쉘

### 3-1. 공통 컴포넌트

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SeoContent`

### 3-2. 권장 설정

```astro
<SimpleToolShell
  calculatorId="ai-subscription-cost"
  pageClass="ai-subscription-page"
  resultFirst={true}
>
```

### 3-3. 이유

- 사용자의 핵심 관심사는 입력 폼 자체보다 `이번 달 총 구독료`와 `본전 여부`다.
- 모바일에서는 결과 요약을 먼저 보고 입력을 조정하는 흐름이 자연스럽다.
- 기존 AI 계산기와 같은 `SimpleToolShell` 흐름을 사용하면 내부 링크와 스타일 유지보수가 쉽다.

---

## 4. 데이터 파일 설계 (`src/data/aiSubscriptionCost.ts`)

### 4-1. 타입 정의

```ts
export type SubscriptionMode = "personal" | "team";

export type ToolCategory =
  | "chatbot"
  | "coding"
  | "research"
  | "document"
  | "image"
  | "workspace"
  | "custom";

export type PricingUnit = "account" | "seat" | "custom";

export type CurrencyCode = "USD" | "KRW";

export interface AiSubscriptionTool {
  id: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  defaultMonthlyUsd: number;
  defaultMonthlyKrw?: number;
  currency: CurrencyCode;
  pricingUnit: PricingUnit;
  isEditable: boolean;
  defaultSelected?: boolean;
  note: string;
  officialUrl?: string;
}

export interface DuplicateRule {
  id: string;
  categoryIds: ToolCategory[];
  toolIds?: string[];
  threshold: number;
  title: string;
  message: string;
  recommendation: string;
}

export interface SubscriptionPreset {
  id: string;
  label: string;
  description: string;
  mode: SubscriptionMode;
  headcount: number;
  selectedToolIds: string[];
  monthlySavedHours: number;
  hourlyValueKrw: number;
}

export interface SubscriptionFaqItem {
  question: string;
  answer: string;
}

export interface SubscriptionRelatedLink {
  href: string;
  label: string;
}
```

### 4-2. 메타 상수

```ts
export const AI_SUBSCRIPTION_META = {
  slug: "ai-subscription-cost",
  title: "AI 도구 월비용 계산기",
  subtitle:
    "ChatGPT, Claude, Copilot, Perplexity, Notion AI 같은 AI 구독료를 한 달 기준으로 합산하고, 시간 절감 효과 대비 ROI를 계산합니다.",
  updatedAt: "2026년 4월",
  defaultExchangeRate: 1400,
  defaultMonthlyWorkHours: 160,
  defaultHourlyValueKrw: 30000,
  defaultMonthlySavedHours: 10,
  caution:
    "가격은 기획 문서 기준 기본값이며 실제 결제액은 요금제 변경, 환율, 부가세, 카드 수수료, 연간 결제 여부에 따라 달라질 수 있습니다.",
} as const;
```

### 4-3. 기본 도구 데이터

기획 문서의 가격을 초기값으로 사용하되, `isEditable: true`를 기본으로 둔다.

```ts
export const AI_SUBSCRIPTION_TOOLS: AiSubscriptionTool[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "chatbot",
    categoryLabel: "범용 AI 챗봇",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    defaultSelected: true,
    note: "범용 글쓰기, 분석, 코딩 보조에 넓게 쓰이는 개인 구독 기준값",
    officialUrl: "https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus",
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    category: "chatbot",
    categoryLabel: "범용 AI 챗봇",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "긴 문서, 글쓰기, 코드 리뷰 목적의 개인 구독 기준값",
    officialUrl: "https://claude.com/pricing",
  },
  {
    id: "github-copilot-pro",
    name: "GitHub Copilot Pro",
    category: "coding",
    categoryLabel: "개발 보조",
    defaultMonthlyUsd: 10,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "개인 개발자용 코딩 보조 구독 기준값",
    officialUrl: "https://docs.github.com/en/copilot/get-started/plans",
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    category: "research",
    categoryLabel: "리서치",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "출처 기반 검색과 리서치 목적 구독 기준값",
    officialUrl: "https://www.perplexity.ai/enterprise/pricing",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "document",
    categoryLabel: "문서·업무",
    defaultMonthlyUsd: 10,
    currency: "USD",
    pricingUnit: "seat",
    isEditable: true,
    note: "요금 구조 변동 가능성이 있어 직접 수정 전제로 제공",
    officialUrl: "https://www.notion.com/pricing",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "image",
    categoryLabel: "이미지 생성",
    defaultMonthlyUsd: 10,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "Basic 이상 티어가 존재하므로 실제 사용 티어에 맞게 수정",
    officialUrl: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
  },
  {
    id: "google-ai-pro",
    name: "Google AI Pro",
    category: "workspace",
    categoryLabel: "구글 생태계",
    defaultMonthlyUsd: 19.99,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "Gemini와 Google 생태계 연동 목적 구독 기준값",
    officialUrl: "https://gemini.google/subscriptions/",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    categoryLabel: "개발 IDE",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "AI 코드 에디터 구독 기준값. 실제 요금제에 맞게 수정",
    officialUrl: "https://www.cursor.com/pricing",
  },
];
```

### 4-4. 프리셋

```ts
export const AI_SUBSCRIPTION_PRESETS: SubscriptionPreset[] = [
  {
    id: "office-worker",
    label: "직장인 문서·리서치형",
    description: "ChatGPT, Notion AI, Perplexity를 쓰는 사무직 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["chatgpt-plus", "notion-ai", "perplexity-pro"],
    monthlySavedHours: 8,
    hourlyValueKrw: 25000,
  },
  {
    id: "developer",
    label: "개발자 코딩 보조형",
    description: "Claude, Copilot, Cursor를 함께 쓰는 개발자 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["claude-pro", "github-copilot-pro", "cursor"],
    monthlySavedHours: 12,
    hourlyValueKrw: 35000,
  },
  {
    id: "creator",
    label: "콘텐츠 제작형",
    description: "ChatGPT, Perplexity, Midjourney를 쓰는 콘텐츠 제작자 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["chatgpt-plus", "perplexity-pro", "midjourney"],
    monthlySavedHours: 8,
    hourlyValueKrw: 20000,
  },
  {
    id: "startup-team",
    label: "스타트업 5인 팀",
    description: "팀원 5명이 AI 구독을 함께 쓰는 운영 검토 기준",
    mode: "team",
    headcount: 5,
    selectedToolIds: ["chatgpt-plus", "github-copilot-pro", "notion-ai"],
    monthlySavedHours: 30,
    hourlyValueKrw: 30000,
  },
];
```

### 4-5. 중복 탐지 규칙

```ts
export const AI_DUPLICATE_RULES: DuplicateRule[] = [
  {
    id: "multi-chatbot",
    categoryIds: ["chatbot"],
    threshold: 2,
    title: "범용 AI 챗봇 중복 가능",
    message: "ChatGPT와 Claude처럼 비슷한 역할의 범용 챗봇을 2개 이상 구독 중입니다.",
    recommendation: "글쓰기, 코딩, 문서 분석 중 실제 주력 용도와 사용 빈도를 기준으로 하나를 줄일 수 있는지 점검하세요.",
  },
  {
    id: "coding-tools",
    categoryIds: ["coding"],
    threshold: 2,
    title: "개발 보조 도구 중복 가능",
    message: "Copilot과 Cursor처럼 개발 보조 도구가 겹칠 수 있습니다.",
    recommendation: "IDE 자동완성, 코드 리뷰, 리팩터링 중 어떤 작업에 주로 쓰는지 나눠서 판단하세요.",
  },
  {
    id: "research-overlap",
    categoryIds: ["chatbot", "research"],
    toolIds: ["chatgpt-plus", "perplexity-pro"],
    threshold: 2,
    title: "검색·리서치 기능 중복 가능",
    message: "범용 챗봇의 검색 기능과 리서치 전용 도구가 일부 겹칠 수 있습니다.",
    recommendation: "출처 확인이 중요한 조사 업무가 많으면 유지하고, 단순 검색 위주라면 구독 축소를 검토하세요.",
  },
  {
    id: "document-overlap",
    categoryIds: ["chatbot", "document"],
    toolIds: ["chatgpt-plus", "notion-ai"],
    threshold: 2,
    title: "문서 작성 기능 중복 가능",
    message: "ChatGPT와 Notion AI 모두 문서 작성과 요약에 쓰일 수 있습니다.",
    recommendation: "Notion 내부 DB와 협업 문서 자동화가 많으면 Notion AI를 유지하고, 외부 문서 작성 중심이면 범용 챗봇 중심으로 통합하세요.",
  },
];
```

### 4-6. FAQ / 관련 링크

```ts
export const AI_SUBSCRIPTION_FAQ: SubscriptionFaqItem[] = [
  {
    question: "ChatGPT와 Claude를 둘 다 구독할 필요가 있나요?",
    answer:
      "둘 다 범용 AI 도구라 용도가 겹치는 부분이 많습니다. 글쓰기, 코딩, 문서 분석을 모두 자주 한다면 병행 가치가 있지만 사용 빈도가 낮다면 하나만 유지하거나 프로젝트 기간별로 번갈아 구독하는 방식이 효율적일 수 있습니다.",
  },
  {
    question: "AI 구독비는 비용인가요, 투자일까요?",
    answer:
      "업무 시간을 실제로 줄이고 있다면 투자에 가깝습니다. 이 계산기는 월 절감 시간과 시간당 가치를 입력해 구독료 대비 생산성 효과를 추정합니다.",
  },
  {
    question: "팀원 모두 같은 AI 도구를 써야 하나요?",
    answer:
      "반드시 그렇지는 않습니다. 개발자는 Copilot·Claude·Cursor, 기획자는 ChatGPT·Notion AI, 리서처는 Perplexity처럼 직무별로 나누는 편이 비용 효율적일 수 있습니다.",
  },
  {
    question: "달러 결제 AI 도구는 왜 원화 비용이 달라지나요?",
    answer:
      "대부분 글로벌 AI 도구는 달러 기준으로 과금됩니다. 환율, 부가세, 카드 해외결제 수수료에 따라 실제 청구액이 달라질 수 있어 환율 입력을 직접 수정할 수 있게 설계합니다.",
  },
  {
    question: "계산 결과가 실제 카드 청구액과 다를 수 있나요?",
    answer:
      "다를 수 있습니다. 이 계산기는 사용자가 입력한 가격과 환율을 바탕으로 한 추정 계산기이며, 실제 결제 전에는 각 서비스의 공식 가격과 결제 통화를 확인해야 합니다.",
  },
  {
    question: "연간 결제 할인은 어떻게 반영하나요?",
    answer:
      "각 도구의 월 비용 입력칸에 연간 결제 월 환산액을 직접 입력하면 됩니다. 예를 들어 연 200달러라면 월 16.7달러로 수정해 계산합니다.",
  },
];

export const AI_SUBSCRIPTION_RELATED_LINKS: SubscriptionRelatedLink[] = [
  { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기로 시간 절감 효과 계산하기" },
  { href: "/tools/ai-stack-cost-calculator/", label: "업무 단계별 AI 스택 비용 계산하기" },
  { href: "/tools/salary/", label: "내 월급 기준 시간당 가치 확인하기" },
  { href: "/reports/ai-job-salary-impact-2026/", label: "AI 도입이 직군별 연봉에 미치는 영향 보기" },
  { href: "/tools/dca-investment-calculator/", label: "매달 구독비를 투자했다면 얼마가 될지 계산하기" },
];
```

---

## 5. 계산 로직

### 5-1. 입력 상태

```ts
export interface CalculatorState {
  mode: SubscriptionMode;
  headcount: number;
  exchangeRate: number;
  includeVat: boolean;
  includeCardFee: boolean;
  cardFeeRate: number;
  monthlyWorkHours: number;
  hourlyValueKrw: number;
  monthlySavedHours: number;
  selectedToolIds: string[];
  toolPrices: Record<string, number>; // USD 월 비용 또는 KRW 월 비용
}
```

### 5-2. 도구별 월 비용

```text
도구 월 비용(원) =
  currency가 USD이면 입력 월 비용 × 환율
  currency가 KRW이면 입력 월 비용
```

팀 모드에서 `pricingUnit = seat`인 도구는 인원 수를 곱한다.

```text
도구 총비용 =
  pricingUnit이 seat이면 도구 월 비용 × 사용 인원 수
  pricingUnit이 account이면 도구 월 비용
```

### 5-3. 총 구독비

```text
월 총 구독비 = 선택 도구별 총비용 합계
부가세 포함 월 총 구독비 = 월 총 구독비 × 1.1
카드 수수료 포함 월 총 구독비 = 월 총 구독비 × (1 + 카드 수수료율)
연간 비용 = 최종 월 총 구독비 × 12
1인당 월 비용 = 최종 월 총 구독비 ÷ 사용 인원 수
```

적용 순서는 단순화를 위해 아래처럼 고정한다.

```text
최종 월 총 구독비 = 기본 월 총 구독비 × VAT 배수 × 카드 수수료 배수
```

### 5-4. 시간 절감 효과

```text
월 절감 시간 가치 = 월 절감 시간 × 시간당 가치
월 순효과 = 월 절감 시간 가치 - 최종 월 총 구독비
ROI 점수 = 월 절감 시간 가치 ÷ 최종 월 총 구독비 × 100
본전 필요 절감 시간 = 최종 월 총 구독비 ÷ 시간당 가치
```

### 5-5. ROI 해석 기준

| ROI 점수 | 상태 라벨 | 해석 |
| ---: | --- | --- |
| 300 이상 | 매우 효율적 | 구독료 대비 시간 절감 효과가 큰 편 |
| 150~299 | 효율적 | 핵심 도구 중심으로 유지할 만한 수준 |
| 100~149 | 본전 수준 | 중복 구독과 사용 빈도 점검 필요 |
| 100 미만 | 본전 미달 | 비용 대비 효과가 낮을 수 있음 |

### 5-6. Validation 규칙

- `headcount`: `1~100`
- `exchangeRate`: `500~3000`
- `monthlyWorkHours`: `1~400`
- `hourlyValueKrw`: `0~1,000,000`
- `monthlySavedHours`: `0~monthlyWorkHours`
- 도구별 월 비용: `0~1000` USD 또는 `0~1,000,000` KRW
- 선택 도구가 0개이면 결과는 `선택된 도구 없음` 상태를 보여준다.

에러 문구:

- `월 절감 시간은 월 업무 시간보다 클 수 없습니다.`
- `환율은 500원 이상 3,000원 이하로 입력하세요.`
- `도구를 하나 이상 선택하면 구독비를 계산할 수 있습니다.`

---

## 6. 페이지 구성 (`src/pages/tools/ai-subscription-cost.astro`)

### 6-1. 전체 IA

1. Hero
2. 추정 안내 `InfoNotice`
3. 결과 KPI
4. 기본 입력 패널
5. AI 도구 체크리스트 및 가격 수정
6. ROI 입력
7. 중복 구독 경고
8. 프리셋 시나리오
9. 비용 비중 차트
10. 계산 기준 설명
11. FAQ
12. `SeoContent`

### 6-2. Hero

- eyebrow: `AI 구독비 계산`
- title: `AI 도구 월비용 계산기`
- description: `ChatGPT, Claude, Copilot, Perplexity, Notion AI 등 사용 중인 AI 구독료를 합산하고, 월 절감 시간 대비 ROI와 중복 구독 여부를 확인합니다.`
- badges:
  - `월 구독비`
  - `연간 비용`
  - `ROI`
  - `중복 구독 점검`

### 6-3. InfoNotice

필수 안내:

- 가격은 실시간 견적이 아니라 기본 추천값이며 사용자가 수정할 수 있음
- 달러 결제 도구는 환율, 부가세, 카드 수수료에 따라 실제 청구액이 달라짐
- ROI는 사용자가 입력한 절감 시간과 시간당 가치 기반 추정값임

### 6-4. SimpleToolShell 슬롯 구조

#### `slot="hero"`

- `CalculatorHero`
- `InfoNotice`

#### `slot="actions"`

- 사용 유형 선택
- 환율·수수료 옵션
- 프리셋 버튼
- AI 도구 체크리스트
- ROI 입력값
- `ToolActionBar`

#### `slot="results"`

- KPI 카드
- ROI 해석 카드
- 중복 구독 경고
- 비용 비중 차트

#### `slot="aside"`

- 계산 기준 요약
- AI 구독비 줄이는 팁
- 관련 계산기 링크

---

## 7. 입력 UI 설계

### 7-1. 사용 조건

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| 사용 유형 | segmented | 개인 | 개인/팀 선택 |
| 사용 인원 수 | number | 1 | 팀 모드에서 강조 |
| 환율 | number | 1,400 | USD → KRW 환산 |
| 부가세 포함 | checkbox | off | 10% 적용 |
| 카드 수수료 포함 | checkbox | off | 기본 1.5% 적용 |

### 7-2. AI 도구 체크리스트

각 도구는 아래 UI 단위로 렌더링한다.

```html
<label class="ais-tool-row">
  <input type="checkbox" data-ais-tool="chatgpt-plus" checked />
  <span class="ais-tool-main">
    <strong>ChatGPT Plus</strong>
    <small>범용 AI 챗봇 · 기본값 $20/월</small>
  </span>
  <span class="ais-tool-price">
    <input type="number" data-ais-price="chatgpt-plus" value="20" min="0" step="0.01" />
    <span>USD/월</span>
  </span>
</label>
```

### 7-3. ROI 입력

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| 월 업무 시간 | number | 160 | 본전 필요 시간 비교 기준 |
| 시간당 가치 | number | 30,000 | 월급 기준 또는 직접 입력 |
| AI로 절감되는 월 시간 | number | 10 | 사용자가 체감하는 추정 절감 시간 |

### 7-4. 프리셋 버튼

```html
<div class="ais-preset-row">
  <button type="button" data-ais-preset="office-worker">직장인 문서·리서치형</button>
  <button type="button" data-ais-preset="developer">개발자 코딩 보조형</button>
  <button type="button" data-ais-preset="creator">콘텐츠 제작형</button>
  <button type="button" data-ais-preset="startup-team">스타트업 5인 팀</button>
</div>
```

---

## 8. 결과 UI 설계

### 8-1. KPI 카드

```html
<section class="ais-result-grid">
  <article class="ais-kpi-card ais-kpi-card--main">
    <p>월 총 구독비</p>
    <strong id="aisMonthlyCost">약 0원</strong>
    <span id="aisMonthlyUsd">$0 기준</span>
  </article>
  <article class="ais-kpi-card">
    <p>연간 환산 비용</p>
    <strong id="aisYearlyCost">약 0원</strong>
    <span>월 비용 × 12</span>
  </article>
  <article class="ais-kpi-card">
    <p>1인당 월 비용</p>
    <strong id="aisPerUserCost">약 0원</strong>
    <span id="aisHeadcountNote">개인 기준</span>
  </article>
  <article class="ais-kpi-card">
    <p>월 순효과</p>
    <strong id="aisNetBenefit">약 0원</strong>
    <span id="aisNetBenefitNote">절감 시간 가치 - 구독비</span>
  </article>
</section>
```

### 8-2. ROI 해석 카드

```html
<article class="ais-roi-card" id="aisRoiCard">
  <p class="ais-roi-label">ROI 점수</p>
  <strong id="aisRoiScore">0점</strong>
  <span id="aisRoiMessage">AI 도구를 선택하면 비용 대비 효과를 계산합니다.</span>
  <dl>
    <div>
      <dt>월 절감 시간 가치</dt>
      <dd id="aisSavedValue">약 0원</dd>
    </div>
    <div>
      <dt>본전 필요 절감 시간</dt>
      <dd id="aisBreakEvenHours">0시간</dd>
    </div>
  </dl>
</article>
```

### 8-3. 중복 경고

```html
<section class="ais-warning-section">
  <div class="section-header--compact">
    <p class="section-header__eyebrow">중복 구독 점검</p>
    <h2>비슷한 역할의 도구가 겹치는지 확인하세요</h2>
  </div>
  <div id="aisDuplicateWarnings" class="ais-warning-list"></div>
</section>
```

경고가 없을 때:

```text
현재 선택 조합에서는 뚜렷한 중복 구독 경고가 없습니다.
```

### 8-4. 비용 비중 차트

- Chart.js 도넛 차트 사용
- 차트가 로드되지 않으면 툴별 금액 리스트를 fallback으로 표시
- 라벨은 한국어: `ChatGPT Plus 28,000원`

---

## 9. JavaScript 설계 (`public/scripts/ai-subscription-cost.js`)

### 9-1. 로드 규칙

```astro
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/ai-subscription-cost.js")}></script>
```

데이터 전달:

```astro
<script
  id="aiSubscriptionCostData"
  type="application/json"
  set:html={JSON.stringify(seed)}
/>
```

### 9-2. 상태 객체

```js
const state = {
  mode: "personal",
  headcount: 1,
  exchangeRate: 1400,
  includeVat: false,
  includeCardFee: false,
  cardFeeRate: 0.015,
  monthlyWorkHours: 160,
  hourlyValueKrw: 30000,
  monthlySavedHours: 10,
  selectedToolIds: ["chatgpt-plus"],
  toolPrices: {},
};
```

### 9-3. 함수 목록

| 함수 | 역할 |
| --- | --- |
| `loadSeed()` | JSON seed 파싱 |
| `restoreStateFromUrl()` | query string 상태 복원 |
| `syncUrlState()` | 입력값 URL 반영 |
| `renderToolRows()` | 도구 체크리스트 렌더링 |
| `bindModeControls()` | 개인/팀 전환 |
| `bindOptionInputs()` | 환율, VAT, 수수료, ROI 입력 이벤트 |
| `bindToolRows()` | 체크박스와 가격 입력 이벤트 |
| `bindPresetButtons()` | 프리셋 적용 |
| `calculate()` | 메인 계산 |
| `detectDuplicates()` | 중복 규칙 평가 |
| `renderResults()` | KPI/ROI/경고 DOM 업데이트 |
| `initCostChart()` | Chart.js 도넛 차트 초기화 |
| `updateCostChart()` | 선택 도구별 비용 비중 업데이트 |
| `resetState()` | 기본값 복원 |
| `copyShareUrl()` | 현재 URL 복사 |

### 9-4. 메인 계산 예시

```js
function calculate() {
  const selectedTools = tools.filter((tool) => state.selectedToolIds.includes(tool.id));
  const vatMul = state.includeVat ? 1.1 : 1;
  const feeMul = state.includeCardFee ? 1 + state.cardFeeRate : 1;

  const toolCosts = selectedTools.map((tool) => {
    const inputPrice = Number(state.toolPrices[tool.id] ?? tool.defaultMonthlyUsd ?? 0);
    const baseKrw = tool.currency === "KRW" ? inputPrice : inputPrice * state.exchangeRate;
    const quantity = state.mode === "team" && tool.pricingUnit === "seat" ? state.headcount : 1;
    const monthlyKrw = Math.round(baseKrw * quantity * vatMul * feeMul);

    return {
      id: tool.id,
      name: tool.name,
      category: tool.category,
      monthlyKrw,
      monthlyUsd: tool.currency === "USD" ? inputPrice * quantity : 0,
    };
  });

  const monthlyCostKrw = toolCosts.reduce((sum, item) => sum + item.monthlyKrw, 0);
  const yearlyCostKrw = monthlyCostKrw * 12;
  const perUserCostKrw = Math.round(monthlyCostKrw / Math.max(1, state.headcount));
  const savedValueKrw = Math.round(state.monthlySavedHours * state.hourlyValueKrw);
  const netBenefitKrw = savedValueKrw - monthlyCostKrw;
  const roiScore = monthlyCostKrw > 0 ? Math.round((savedValueKrw / monthlyCostKrw) * 100) : 0;
  const breakEvenHours = state.hourlyValueKrw > 0 ? monthlyCostKrw / state.hourlyValueKrw : 0;
  const duplicateWarnings = detectDuplicates(selectedTools);

  renderResults({
    toolCosts,
    monthlyCostKrw,
    yearlyCostKrw,
    perUserCostKrw,
    savedValueKrw,
    netBenefitKrw,
    roiScore,
    breakEvenHours,
    duplicateWarnings,
  });

  updateCostChart(toolCosts);
  syncUrlState();
}
```

### 9-5. 중복 탐지 예시

```js
function detectDuplicates(selectedTools) {
  return duplicateRules.filter((rule) => {
    if (Array.isArray(rule.toolIds) && rule.toolIds.length) {
      const hitCount = rule.toolIds.filter((id) => selectedTools.some((tool) => tool.id === id)).length;
      return hitCount >= rule.threshold;
    }

    const hitCount = selectedTools.filter((tool) => rule.categoryIds.includes(tool.category)).length;
    return hitCount >= rule.threshold;
  });
}
```

### 9-6. URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `mode` | `personal` / `team` |
| `n` | 인원 수 |
| `fx` | 환율 |
| `vat` | `1`이면 부가세 포함 |
| `fee` | `1`이면 카드 수수료 포함 |
| `hours` | 월 절감 시간 |
| `value` | 시간당 가치 |
| `tools` | 선택 도구 id를 콤마로 연결 |

예시:

```text
/tools/ai-subscription-cost/?mode=personal&fx=1400&tools=chatgpt-plus,claude-pro&hours=12&value=30000
```

---

## 10. SCSS 설계 (`_ai-subscription-cost.scss`)

### 10-1. 스타일 원칙

- 페이지 루트: `.ai-subscription-page`
- 내부 prefix: `ais-`
- 카드 radius는 8px 이하가 기본이나, 기존 계산기 패턴에 맞춘 섹션 카드가 이미 둥근 경우 내부 UI는 과하게 둥글게 만들지 않는다.
- 운영 도구 느낌의 조용한 UI를 목표로 한다. 마케팅형 히어로나 과한 그라데이션은 사용하지 않는다.
- 테이블과 도구 체크리스트는 모바일에서 가로 스크롤 없이 1열로 재배치한다.

### 10-2. 주요 블록

```scss
.ai-subscription-page {
  display: grid;
  gap: 24px;

  .ais-result-grid { ... }
  .ais-kpi-card { ... }
  .ais-form-panel { ... }
  .ais-tool-list { ... }
  .ais-tool-row { ... }
  .ais-roi-card { ... }
  .ais-warning-list { ... }
  .ais-chart-shell { ... }
}
```

### 10-3. 반응형 기준

- `900px` 이하: 결과 KPI 2열 → 1열
- `760px` 이하: 도구 행을 체크박스/설명/가격 입력 1열로 변경
- `480px` 이하: 프리셋 버튼 전체 폭, 숫자 입력 최소 폭 제한

### 10-4. 차트 영역

```scss
.ais-chart-shell {
  min-height: 300px;
  height: 300px;
  border: 1px solid #d8e2ea;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}
```

---

## 11. 콘텐츠/SEO 구성

### 11-1. SEO 섹션 제목

1. AI 도구 구독비, 왜 계산해야 할까?
2. ChatGPT, Claude, Copilot, Perplexity 가격은 어떻게 입력하나?
3. 개인 사용자가 많이 쓰는 AI 구독 조합
4. 개발자가 많이 쓰는 AI 도구 조합
5. 콘텐츠 제작자가 많이 쓰는 AI 도구 조합
6. 스타트업 팀 단위 AI 구독비 계산법
7. AI 구독비를 줄이는 5가지 방법
8. AI 도구 ROI 계산 공식
9. 중복 구독을 피하는 체크리스트
10. AI 구독비 계산기 활용 예시

### 11-2. SeoContent 입력 예시

```astro
<SeoContent
  introTitle="AI 도구 월비용 계산기 이용 안내"
  intro={[
    "AI 도구는 한두 개만 구독할 때는 부담이 작아 보이지만, ChatGPT, Claude, Copilot, Perplexity, Notion AI처럼 여러 도구가 쌓이면 월 고정비가 빠르게 커집니다.",
    "이 계산기는 사용 중인 AI 도구를 선택하고 환율과 절감 시간을 입력해 월 구독비, 연간 비용, ROI를 함께 보여줍니다.",
    "가격은 기본 추천값이며 실제 결제 전에는 각 서비스 공식 요금과 결제 통화를 확인해야 합니다.",
  ]}
  criteria={[
    "월 비용은 사용자가 입력한 도구별 가격과 환율 기준",
    "팀 모드는 seat 단위 도구에 인원 수를 곱해 계산",
    "ROI는 월 절감 시간과 시간당 가치를 바탕으로 한 추정값",
  ]}
  faq={faq}
  related={AI_SUBSCRIPTION_RELATED_LINKS}
/>
```

### 11-3. 사용자 facing 표현 주의

- `확실히 절약됩니다` 금지
- `구독을 해지하세요` 금지
- `공식 월비용`처럼 고정값으로 단정하지 않기
- 권장 표현:
  - `기본값`
  - `추정`
  - `직접 수정 가능`
  - `점검해보세요`
  - `실제 결제 전 공식 요금 확인 필요`

---

## 12. 등록 체크리스트

- [ ] `src/data/aiSubscriptionCost.ts` 작성
- [ ] `src/pages/tools/ai-subscription-cost.astro` 작성
- [ ] `public/scripts/ai-subscription-cost.js` 작성
- [ ] `src/styles/scss/pages/_ai-subscription-cost.scss` 작성
- [ ] `src/data/tools.ts`에 `ai-subscription-cost` 등록
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/ai-subscription-cost';` 추가
- [ ] `public/sitemap.xml`에 `/tools/ai-subscription-cost/` 추가
- [ ] OG 이미지 `public/og/tools/ai-subscription-cost.png` 생성
- [ ] `npm run build` 성공 확인

---

## 13. QA 체크리스트

### 13-1. 계산 QA

- [ ] 도구 0개 선택 시 빈 상태가 깨지지 않음
- [ ] USD 도구가 환율 변경에 따라 원화 비용 재계산됨
- [ ] KRW 직접 입력 도구가 환율 영향을 받지 않음
- [ ] 팀 모드에서 seat 단위 도구만 인원 수가 곱해짐
- [ ] VAT와 카드 수수료 토글이 중복/누락 없이 적용됨
- [ ] 월 절감 시간이 월 업무 시간을 넘으면 검증 문구 표시
- [ ] 시간당 가치가 0이면 본전 필요 시간 계산이 깨지지 않음
- [ ] ROI 100 미만/100 이상/150 이상/300 이상 메시지가 올바르게 바뀜

### 13-2. 인터랙션 QA

- [ ] 프리셋 버튼 클릭 시 도구, 인원 수, 절감 시간, 시간당 가치가 함께 반영됨
- [ ] 도구 가격 수정 후 체크 상태를 유지한 채 결과가 갱신됨
- [ ] URL 공유 후 새로고침해도 상태가 복원됨
- [ ] reset 버튼이 기본값으로 복원됨
- [ ] copy link 버튼이 현재 상태 URL을 복사함
- [ ] Chart.js 로드 실패 시 fallback 리스트가 보임

### 13-3. 콘텐츠 QA

- [ ] 모든 추정 결과에 `추정`, `기본값`, `직접 수정 가능` 취지가 드러남
- [ ] 영어 문장으로 된 사용자 facing 본문 없음
- [ ] 가격을 최신 공식 확정값처럼 단정하지 않음
- [ ] FAQ 6개 이상 노출
- [ ] 관련 링크가 실제 존재하는 페이지 위주로 연결됨

### 13-4. 반응형 QA

- [ ] 320px에서 도구 행의 가격 입력이 넘치지 않음
- [ ] KPI 카드 텍스트가 버튼/카드 영역을 침범하지 않음
- [ ] 차트가 모바일에서 적정 높이를 유지함
- [ ] 프리셋 버튼과 토글이 줄바꿈되어도 레이아웃이 흔들리지 않음

---

## 14. 구현 순서

1. `src/data/aiSubscriptionCost.ts`에 타입, 도구, 프리셋, FAQ, 관련 링크 작성
2. `src/pages/tools/ai-subscription-cost.astro`에서 `SimpleToolShell` 기반 페이지 골격 작성
3. 도구 체크리스트와 결과 KPI의 정적 마크업 완성
4. `public/scripts/ai-subscription-cost.js`에서 상태, 계산, URL 복원, 프리셋 적용 구현
5. Chart.js 도넛 차트와 fallback 리스트 구현
6. `_ai-subscription-cost.scss` 작성 후 `app.scss`에 import
7. `tools.ts`, `sitemap.xml`, 홈/목록 노출 여부 확인
8. `npm run build`

---

## 15. 최종 요약

| 항목 | 설계 방향 |
| --- | --- |
| 핵심 목적 | AI 도구 구독비 합산과 ROI 점검 |
| 차별화 | 환율 반영, 팀 단위 계산, 중복 구독 탐지 |
| 데이터 기준 | 기본 추천값 + 사용자 직접 수정 |
| 결과 핵심 | 월 총 구독비, 연간 비용, 순효과, ROI 점수, 본전 필요 시간 |
| UX 방향 | 결과 우선, 도구 체크리스트, 프리셋 빠른 적용 |
| 안전장치 | 실시간 가격 아님 고지, 추정값 표현, 공식 요금 확인 안내 |
