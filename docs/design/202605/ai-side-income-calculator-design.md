# AI 부업 수입 계산기 — 설계 문서

> 작성일: 2026-05-10
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: AI 도구 활용도에 따른 부업 수입 추정 + 도구 구독비 차감 후 순수입 계산

---

## 1. 문서 개요

- 구현 대상: `AI 부업 수입 계산기`
- slug: `ai-side-income-calculator`
- URL: `/tools/ai-side-income-calculator/`
- 카테고리: AI/생산성/자동화
- 핵심 검색 의도: AI를 활용해 부업으로 얼마를 벌 수 있는지, AI 도구 구독료를 차감하면 실제 손에 남는 금액이 얼마인지 확인하고 싶은 사용자
- 핵심 출력: 예상 월 부업 수입, AI 생산성 증가분(원), 도구 구독료 차감 후 순수입, 실효 시간당 단가, 도구 비용 회수 기간

---

## 2. 구현 파일 구조

```text
src/
  data/
    aiSideIncomeCalculator.ts        ← 타입 정의, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      ai-side-income-calculator.astro

public/
  scripts/
    ai-side-income-calculator.js

src/styles/scss/pages/
  _ai-side-income-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts` — slug, title, description, category, badges 추가
- `src/styles/app.scss` — `@use 'scss/pages/ai-side-income-calculator';`
- `public/sitemap.xml` — URL 등록

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기. 입력 후 결과가 즉시 반영되는 실시간 계산 구조.
- `resultFirst={true}` 권장 — 모바일에서 결과 카드가 상단에 먼저 보이도록.
- SCSS prefix: `asic-`

```astro
<SimpleToolShell
  calculatorId="ai-side-income-calculator"
  pageClass="op-page asic-page"
  resultFirst={true}
>
```

---

## 4. 데이터 모델

```ts
export type SideJobType =
  | "freelance-writing"   // 프리랜서 글쓰기·번역·카피라이팅
  | "content-creation"    // 유튜브·블로그·SNS 콘텐츠 제작
  | "online-course"       // 온라인 강의·튜터링·컨설팅
  | "dev-outsourcing"     // 개발 외주·코딩 대행·MVP 제작
  | "design-outsourcing"  // 디자인·영상 편집 외주
  | "data-labeling";      // 데이터 라벨링·AI 학습데이터 검수

export interface SideJobPreset {
  id: SideJobType;
  label: string;                    // UI 표시명
  description: string;              // 업종 설명 (한 줄)
  defaultHourlyRate: number;        // 기본 시간당 단가 (원)
  defaultProductivityBoost: number; // 기본 생산성 향상률 (%)
  representativeTools: string[];    // 주로 활용되는 AI 도구명
  incomeTip: string;                // 수입 관련 팁 한 줄
}

export interface AiSideIncomeInput {
  jobType: SideJobType;
  hoursPerMonth: number;            // 월 투입 시간 (시간)
  baseHourlyRate: number;           // AI 미활용 기준 시간당 단가 (원)
  aiProductivityBoost: number;      // AI 생산성 향상률 (%, 0~200)
  aiToolMonthlyCost: number;        // AI 도구 월 구독료 합산 (원)
}

export interface AiSideIncomeResult {
  baseMonthlyIncome: number;        // AI 미활용 기준 월 예상 수입 (원)
  aiMonthlyIncome: number;          // AI 활용 시 월 예상 수입 (원)
  aiContribution: number;           // AI로 늘어난 추가 수입 (원)
  netMonthlyIncome: number;         // 도구비 차감 후 순수입 (원)
  effectiveHourlyRate: number;      // 실효 시간당 단가 (원)
  toolRoiMonths: number;            // AI 도구비 회수 기간 (개월, 소수점 포함)
  isToolCostExceedingIncome: boolean; // 도구비가 AI 기여분 초과 여부
}
```

---

## 5. 계산 로직

```text
기준 월수입 = 월 투입 시간 × 시간당 단가
AI 활용 월수입 = 기준 월수입 × (1 + 생산성 향상률 / 100)
AI 기여 수입 = AI 활용 월수입 - 기준 월수입
순수입 = AI 활용 월수입 - AI 도구 월 구독료
실효 시간당 단가 = 순수입 / 월 투입 시간
도구비 회수 기간 = AI 도구 월 구독료 / AI 기여 수입
  → 결과가 1 미만이면 "이번 달 즉시 회수" 표시
  → AI 기여 수입이 0이면 도구비 회수 불가 경고 표시
```

예시 계산 (개발 외주, 월 20시간, 시급 6만 원, 향상률 70%, 도구비 3만 원):
```
기준 월수입 = 20 × 60,000 = 1,200,000원
AI 활용 월수입 = 1,200,000 × 1.70 = 2,040,000원
AI 기여 수입 = 2,040,000 - 1,200,000 = 840,000원
순수입 = 2,040,000 - 30,000 = 2,010,000원
실효 시간당 단가 = 2,010,000 / 20 = 100,500원
도구비 회수 = 30,000 / 840,000 = 0.036개월 → 즉시 회수
```

예외 처리:
- 월 투입 시간 0 → 계산 불가 안내 메시지, 결과 카드 미표시
- 생산성 향상률 0% → AI 기여 수입 0, 순수입 = 기준 월수입 - 도구비
- 순수입 음수 → "도구 구독료가 AI로 늘어난 수입보다 많습니다" 경고 표시 (붉은 테두리 + 텍스트)
- 시간당 단가 0 → 0원 결과 표시, NaN 미노출

---

## 6. 업종별 기본값 프리셋

| 업종 | 기본 시급 (원) | 기본 향상률 | 대표 AI 도구 | 비고 |
|------|-------------|-----------|------------|------|
| 프리랜서 글쓰기·번역 | 25,000 | 60% | ChatGPT, Claude, DeepL | 초안 작성·번역 속도 향상 |
| 유튜브·블로그 콘텐츠 | 20,000 | 50% | ChatGPT, Suno, Canva AI | 기획·썸네일·자막 자동화 |
| 온라인 강의·튜터링 | 40,000 | 30% | ChatGPT, Gamma, Notion AI | 강의 자료 제작 효율화 |
| 개발 외주·코딩 대행 | 60,000 | 70% | Claude Code, Cursor, Copilot | 코드 생성·리팩터링 속도 |
| 디자인·영상 편집 외주 | 45,000 | 40% | Midjourney, Runway, Adobe AI | 시안·편집 시간 단축 |
| 데이터 라벨링·AI 검수 | 15,000 | 80% | 자동화 스크립트, GPT API | 반복 작업 자동화 |

---

## 7. 페이지 IA

1. **Hero** — 제목: "AI 부업 수입 계산기", 부제: "도구 비용 빼고 진짜 남는 돈을 계산합니다"
2. **InfoNotice** — "수입은 시장 단가, 클라이언트 조건, 실제 AI 활용도에 따라 달라지는 개인별 추정값입니다. 투자·계약·소득 신고 기준으로 사용하지 마세요."
3. **DesignTrustPanel** — 업데이트 기준일, 추정 기준 안내
4. **업종 프리셋 칩 (6개)** — 클릭 시 시급·향상률 자동 적용
5. **입력 패널** — 업종, 월 시간, 시급, 향상률, 도구비
6. **결과 KPI 카드 (5개)** — AI 활용 월수입, 기준 월수입, AI 기여 수입, 순수입, 실효 시급
7. **기준 수입 vs AI 활용 수입 비교 막대** — 시각적 차이 표시
8. **생산성 향상률별 시나리오 표** — 0% / 30% / 50% / 100% / 직접 입력값 5행
9. **업종별 AI 활용 팁 카드 (6개)** — 업종별 주요 AI 도구·활용 사례
10. **도구 비용 ROI 메시지** — "이 도구비는 X개월 만에 회수됩니다"
11. **CTA 섹션** — AI 코딩 도구 비교 리포트 / AI 업무 ROI 계산기 / AI 부업 수입 비교 리포트
12. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 |
|------|------|--------|--------|
| 부업 업종 | chip/select | 개발 외주·코딩 대행 | 6개 중 선택 |
| 월 투입 시간 | number | 20 | min 1, max 300 |
| 시간당 단가 (원) | number (쉼표 포맷) | 60,000 | min 1,000 |
| AI 생산성 향상률 (%) | number | 70 | min 0, max 200 |
| AI 도구 월 구독료 합산 (원) | number (쉼표 포맷) | 30,000 | min 0 |

보조 문구:
- 시간당 단가 아래: "AI 미활용 시 받을 수 있는 예상 시장 단가를 입력하세요"
- 생산성 향상률 아래: "AI 도구를 활용해 같은 시간에 더 많은 성과를 내는 비율. 30% 향상이면 1.3배의 결과물을 만들 수 있다는 의미입니다"
- AI 도구 구독료 아래: "ChatGPT Plus 28,000원, Claude Pro 22,000원 등 매달 지출하는 AI 도구 비용의 합계"

---

## 9. 결과 UI 상세

KPI 카드 (5개):

| 카드 | 레이블 | 서브 텍스트 |
|------|--------|-----------|
| 주요 (Main) | AI 활용 월 예상 수입 | 도구비 차감 전 |
| 일반 | AI 미활용 기준 수입 | 도구 없이 일했을 때 |
| 일반 | AI 기여 추가 수입 | AI로 더 번 금액 |
| Accent | 도구비 차감 순수입 | 최종 손에 남는 금액 |
| 일반 | 실효 시간당 단가 | 순수입 ÷ 월 시간 |

자연어 결과 메시지:
```
월 20시간 개발 외주에 AI 도구를 70% 생산성으로 활용하면
기준 수입 120만 원보다 84만 원 더 많은 204만 원이 예상됩니다.
AI 도구 구독료 3만 원을 빼면 실제 순수입은 201만 원이며,
도구 비용은 이번 달에 즉시 회수됩니다.
```

생산성 향상률별 시나리오 표:

| 향상률 | AI 활용 수입 | AI 기여 수입 | 순수입 |
|--------|------------|------------|--------|
| 0% (AI 미사용) | 120만 원 | 0원 | 117만 원 |
| 30% | 156만 원 | 36만 원 | 153만 원 |
| 50% | 180만 원 | 60만 원 | 177만 원 |
| 70% (현재 입력) | 204만 원 | 84만 원 | 201만 원 |
| 100% | 240만 원 | 120만 원 | 237만 원 |

---

## 10. JavaScript 설계

```js
(() => {
  const PRESET_DATA = {}; // JSON으로 .astro에서 주입
  const DEFAULT_STATE = {
    jobType: "dev-outsourcing",
    hoursPerMonth: 20,
    baseHourlyRate: 60000,
    aiProductivityBoost: 70,
    aiToolMonthlyCost: 30000,
  };
  let state = { ...DEFAULT_STATE };

  function sanitizeNumber(val, fallback = 0) {
    const n = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(n) || n < 0 ? fallback : n;
  }

  function readInputs() {
    state.hoursPerMonth = sanitizeNumber(q("[data-asic-input='hours']").value, 1);
    state.baseHourlyRate = sanitizeNumber(q("[data-asic-input='rate']").value, 0);
    state.aiProductivityBoost = sanitizeNumber(q("[data-asic-input='boost']").value, 0);
    state.aiToolMonthlyCost = sanitizeNumber(q("[data-asic-input='toolCost']").value, 0);
  }

  function calculate(s) {
    const base = s.hoursPerMonth * s.baseHourlyRate;
    const ai = base * (1 + s.aiProductivityBoost / 100);
    const contribution = ai - base;
    const net = ai - s.aiToolMonthlyCost;
    const effectiveRate = s.hoursPerMonth > 0 ? net / s.hoursPerMonth : 0;
    const roiMonths = contribution > 0 ? s.aiToolMonthlyCost / contribution : Infinity;
    return { base, ai, contribution, net, effectiveRate, roiMonths };
  }

  function renderResults(r) { /* KPI 카드, 메시지, 시나리오 표 갱신 */ }
  function renderScenarioTable(s) { /* 0/30/50/입력값/100% 행 생성 */ }
  function applyPreset(jobType) { /* 프리셋 시급·향상률 적용 + 칩 active 클래스 */ }
  function syncUrl(s) { /* URLSearchParams로 상태 직렬화 */ }
  function restoreFromUrl() { /* URL 파라미터 파싱 후 state 복원 */ }
  function bindEvents() { /* input, change, click 이벤트 */ }
  function q(sel) { return document.querySelector(sel); }

  restoreFromUrl();
  bindEvents();
  renderResults(calculate(state));
  renderScenarioTable(state);
})();
```

URL 파라미터: `job` / `hours` / `rate` / `boost` / `tool`

---

## 11. SCSS 설계

```scss
.asic-page {
  .asic-preset-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
  }

  .asic-preset-chip {
    border: 1px solid #dce6e2;
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 0.82rem;
    cursor: pointer;
    background: #fff;
    &.is-active { background: #1a56db; color: #fff; border-color: #1a56db; }
  }

  .asic-compare-bar {
    display: grid;
    gap: 6px;
    margin: 16px 0;
    .asic-bar-row { display: flex; align-items: center; gap: 10px; }
    .asic-bar-fill { height: 10px; border-radius: 5px; background: #1a56db; }
    .asic-bar-fill--base { background: #94a3b8; }
  }

  .asic-scenario-table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: right; border-bottom: 1px solid #e8ede9; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-current { background: #f0f7ff; font-weight: 600; }
  }

  .asic-tip-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    @media (min-width: 760px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
  }
}
```

---

## 12. SEO 설계

```text
title: AI 부업 수입 계산기 - 도구비 빼고 실제 얼마나 남을까
description: 프리랜서, 개발 외주, 콘텐츠, 강의 등 업종별로 AI 도구 생산성 향상률을 입력하면 월 부업 수입과 도구 구독료 차감 후 순수입을 계산합니다.
H1: AI 부업 수입 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: AI 부업 수입 계산, AI 프리랜서 수입, AI 활용 부업 얼마, AI 개발 외주 월급, ChatGPT 부업 수입

---

## 13. SeoContent 초안

### introTitle
`AI 부업 수입 계산기 — 생산성 향상률과 도구비를 함께 보는 이유`

### intro (5문단)

1. AI 도구를 부업에 활용하면 같은 시간에 더 많은 결과물을 만들 수 있습니다. 하지만 ChatGPT Plus, Claude Pro, Cursor, Midjourney 등 도구 구독료가 매달 쌓이면 실제 손에 남는 금액은 달라집니다. 이 계산기는 AI 활용 전후 월 수입과 도구비를 차감한 순수입을 한 화면에서 비교합니다.

2. 생산성 향상률은 "AI 도구를 활용해 같은 시간에 얼마나 더 많은 성과를 낼 수 있는가"를 나타냅니다. 50% 향상이라면 1시간에 처리하던 작업을 40분 만에 끝낼 수 있거나, 같은 시간에 1.5배의 결과물을 만들 수 있다는 뜻입니다. 업종에 따라 이 수치는 크게 다릅니다. 개발·코딩 대행은 AI 코드 생성 덕분에 50~100% 향상도 현실적이고, 번역·글쓰기는 40~70%, 강의나 컨설팅처럼 인간 전문성이 핵심인 업종은 20~40% 수준이 현실적인 추정값입니다.

3. 도구 구독료는 생각보다 빠르게 회수됩니다. 월 3만 원 구독료를 내더라도 AI 활용으로 추가 수입이 월 10만 원 늘어난다면 도구비는 당월에 즉시 회수됩니다. 반대로 AI 도구를 거의 사용하지 않거나 생산성 향상이 미미하다면 도구비가 순수입을 갉아먹는 구조가 됩니다. '도구비 회수 기간'을 기준으로 구독 유지 여부를 판단하는 것이 합리적입니다.

4. 이 계산기는 6개 업종 프리셋을 제공합니다. 개발 외주·코딩 대행, 프리랜서 글쓰기·번역, 디자인·영상 편집, 온라인 강의·튜터링, 유튜브·블로그 콘텐츠, 데이터 라벨링·AI 검수 중 가장 가까운 업종을 선택하면 시장 평균 수준의 시급과 향상률이 자동으로 설정됩니다. 이후 본인 상황에 맞게 수치를 조정하면 더 정확한 추정값을 얻을 수 있습니다.

5. 계산 결과는 시장 단가, 클라이언트 조건, 실제 AI 활용 숙련도에 따라 실제와 차이가 날 수 있습니다. 이 계산기는 부업 수입을 예측하거나 소득세 신고에 사용하는 공식 자료가 아닌, 업종과 시간 투자 효율을 가늠하기 위한 참고용 추정 도구입니다.

### FAQ (8개)

```ts
export const ASIC_FAQ = [
  {
    question: "AI를 활용하면 실제로 부업 수입이 늘어나나요?",
    answer: "업종에 따라 다릅니다. 코딩 대행·번역·글쓰기처럼 반복성이 높고 AI가 초안을 빠르게 생성할 수 있는 업종에서는 생산성 향상이 뚜렷합니다. 반면 클라이언트와 직접 대면해 신뢰를 쌓아야 하는 컨설팅·강의는 AI의 직접적인 수입 기여가 상대적으로 낮을 수 있습니다. 각 업종별 기본값은 시장 추정값으로 본인 경험에 맞게 조정하세요.",
  },
  {
    question: "생산성 향상률 몇 %를 입력해야 현실적인가요?",
    answer: "업종별로 다르지만 초보자 기준으로는 30~50%, AI에 익숙한 사람은 50~100%가 현실적인 범위입니다. 개발 외주는 Claude Code나 Cursor를 능숙하게 사용하면 70% 이상도 가능합니다. 처음엔 보수적으로 30%로 설정하고, 실제 사용하면서 조정하는 것을 권장합니다.",
  },
  {
    question: "AI 도구 구독료는 어디까지 포함해야 하나요?",
    answer: "부업에 직접 사용하는 도구 비용을 모두 합산하세요. ChatGPT Plus(월 약 28,000원), Claude Pro(월 약 22,000원), Cursor Pro(월 약 27,000원), Midjourney(월 약 13,000~27,000원) 등이 대표적입니다. 업무와 개인 용도를 겸용한다면 업무 사용 비중만큼만 포함하는 것이 합리적입니다.",
  },
  {
    question: "부업 수입이 얼마부터 세금을 내야 하나요?",
    answer: "개인이 부업으로 벌어들인 수입은 기타소득 또는 사업소득으로 구분되어 종합소득세 신고 대상이 됩니다. 연간 기타소득이 300만 원을 초과하면 종합소득세를 신고해야 합니다. 이 계산기는 세금을 반영하지 않으므로 정확한 세금 계산은 국세청 홈택스 또는 세무 전문가에게 확인하세요.",
  },
  {
    question: "프리랜서 단가는 어떻게 정하면 되나요?",
    answer: "크몽, 숨고, 프리랜서코리아 등 플랫폼에서 유사 서비스 단가를 먼저 조사하세요. 초보 단계에서는 시장 평균보다 10~20% 낮게 시작해 포트폴리오를 쌓은 뒤 올리는 전략이 일반적입니다. AI 활용으로 품질이 올라가면 단가를 높이는 협상 명분이 생깁니다.",
  },
  {
    question: "데이터 라벨링은 AI 때문에 일자리가 줄지 않나요?",
    answer: "단순 반복 라벨링 수요는 줄고 있지만, AI 모델 품질 검수, 복잡한 판단이 필요한 RLHF 데이터 수집, 전문 도메인 라벨링(의료·법률·금융)의 수요는 꾸준합니다. AI를 활용해 1차 라벨링을 자동화하고 검수 속도를 높이는 방향이 현재 트렌드입니다.",
  },
  {
    question: "AI 도구를 쓰면 클라이언트에게 알려야 하나요?",
    answer: "계약 조건에 따라 다릅니다. 일부 클라이언트는 AI 사용 금지를 명시하기도 합니다. 번역·글쓰기·코딩 외주에서는 AI 초안을 직접 수정·검수한 최종 결과물을 납품하는 경우가 일반적이며, 납품물의 품질과 책임은 프리랜서에게 있습니다. 계약 전에 AI 활용 여부를 투명하게 확인하는 것이 좋습니다.",
  },
  {
    question: "월 몇 시간을 투자해야 의미 있는 수입이 나올까요?",
    answer: "업종과 시급에 따라 다르지만, 월 10~20시간은 부업 감각을 유지하는 최소 수준으로 볼 수 있습니다. 개발 외주처럼 시급이 높은 업종에서는 월 15시간으로도 100만 원 이상이 가능하고, 콘텐츠처럼 시급이 낮은 경우에는 30시간 이상을 투자해야 의미 있는 수익이 납니다. 이 계산기에서 시간을 바꿔 보면 목표 수입을 위한 최소 투자 시간을 파악할 수 있습니다.",
  },
];
```

---

## 14. 관련 링크

- `/tools/ai-work-roi-calculator/` — AI 업무 ROI 계산기
- `/tools/ai-automation-hourly-roi/` — AI 업무 자동화 시급 계산기
- `/reports/ai-side-income-comparison-2026/` — AI 부업 수입 비교 리포트
- `/reports/ai-coding-tools-comparison-2026/` — AI 코딩 도구 비교
- `/tools/ai-subscription-cost/` — AI 도구 월 비용 계산기

---

## 15. QA 체크리스트

- [ ] 월 시간 0 입력 시 NaN 미노출, "1시간 이상 입력하세요" 안내
- [ ] 생산성 향상률 0% 시 AI 기여 수입 0, 순수입 = 기준수입 - 도구비
- [ ] 순수입 음수 시 경고 메시지 + 붉은 테두리 표시
- [ ] 프리셋 칩 클릭 시 시급·향상률 즉시 반영 + active 클래스 전환
- [ ] 시나리오 표 5행 (0% / 30% / 50% / 입력값 / 100%) 정상 렌더링
- [ ] 현재 입력값 행에 하이라이트 표시
- [ ] URL 파라미터 복원이 새 탭에서 정상 동작
- [ ] 모바일 360px에서 KPI 카드, 칩 그리드 overflow 없음
- [ ] 세금·소득 신고 면책 문구 InfoNotice에 명확히 표시
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
