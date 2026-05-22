# AI 과외 vs 학원 비용 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/ai-tutoring-vs-academy-cost.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 현재 학원·과외 비용과 AI 학습 도구 구독료를 비교해 월 절감액, 연간 절약액, 과목별 AI 대체 가능 점수, 추천 시나리오를 산출

---

## 1. 문서 개요

- 구현 대상: `AI 과외 vs 학원 비용 계산기`
- slug: `ai-tutoring-vs-academy-cost`
- URL: `/tools/ai-tutoring-vs-academy-cost/`
- 카테고리: AI/생산성/자동화
- 핵심 검색 의도: "AI 과외 비용 비교", "AI 학습 학원 대체", "ChatGPT 과외 비용", "학원비 절약 계산기"
- 핵심 출력: 현재 월 교육비, AI 전환 후 월 비용, 월 절감액, 연간 절약액, 과목별 AI 대체 가능 점수, 완전 대체·하이브리드·학원 유지 시나리오
- 안전 원칙: AI가 학원·과외의 학습 효과를 보장한다고 표현하지 않는다. 결과는 비용 기준 시뮬레이션이며, 구독료·학원비·학습 효과는 사용자가 입력한 가정값임을 명확히 표시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    aiTutoringVsAcademyCost.ts       ← 타입, 기본값, 과목 점수, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      ai-tutoring-vs-academy-cost.astro

public/
  scripts/
    ai-tutoring-vs-academy-cost.js

src/styles/scss/pages/
  _ai-tutoring-vs-academy-cost.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/ai-tutoring-vs-academy-cost';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` AI/생산성 추천 도구 영역에 추가
- `src/pages/tools/index.astro` 도구 목록 노출 확인
- `public/og/tools/ai-tutoring-vs-academy-cost.png` 또는 OG 생성 스크립트 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반.
- 입력은 4단계로 나눈다.
  - Step 1: 자녀·과목 조건
  - Step 2: 현재 학원·과외 비용
  - Step 3: AI 학습 도구 비용
  - Step 4: 대체 시나리오와 관리 중요도
- 결과는 `월 절감액 → 연간 절약액 → 추천 시나리오 → 과목별 대체 가능 점수 → 비용 구성` 순서로 읽히게 한다.
- 기본 시나리오는 `하이브리드`로 둔다.
- SCSS prefix: `atac-`
- pageClass: `atac-page`
- 모바일에서는 결과 KPI와 추천 시나리오가 입력 직후 바로 보이도록 구성한다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="ai-tutoring-vs-academy-cost"
  pageClass="atac-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 비용 시뮬레이션 고지 `InfoNotice`
3. 프리셋 시나리오 버튼
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 추천 시나리오 카드
7. 과목별 AI 대체 가능 점수
8. 현재 학원비 vs AI 전환 후 비용 분해표
9. 완전 대체·하이브리드·학원 유지 비교
10. 부모 관리 시간 비용 해석
11. AI 학습 활용 체크리스트
12. 관련 계산기/리포트 CTA
13. `SeoContent` FAQ

---

## 5. 데이터 모델

파일: `src/data/aiTutoringVsAcademyCost.ts`

```ts
export type GradeLevel = "elementaryLow" | "elementaryHigh" | "middle" | "high";
export type Subject = "math" | "english" | "korean" | "science" | "coding" | "other";
export type AiTool = "chatgpt" | "khanmigo" | "wrtn" | "other";
export type ScenarioType = "fullAi" | "hybrid" | "academy";
export type RiskLevel = "low" | "medium" | "high";
export type SourceBadge = "추정" | "시뮬레이션" | "가격 확인 필요" | "사용자 입력";

export interface AiTutoringInputDefaults {
  gradeLevel: GradeLevel;
  childCount: number;
  subjectCount: number;
  subjects: Subject[];
  weeklyClassCount: number;
  minutesPerClass: number;
  weeksPerMonth: number;

  monthlyAcademyFeePerSubject: number;
  usePrivateTutoring: boolean;
  tutoringHourlyRate: number;
  weeklyTutoringHours: number;
  monthlyMaterialCost: number;
  monthlyTransportCost: number;
  monthlySnackCost: number;

  selectedAiTools: AiTool[];
  chatgptMonthlyPrice: number;
  khanmigoMonthlyPrice: number;
  wrtnMonthlyPrice: number;
  otherAiMonthlyPrice: number;
  aiMaterialCost: number;
  parentWeeklyCareHours: number;
  parentHourlyValue: number;
  includeParentTimeCost: boolean;

  scenarioType: ScenarioType;
  aiReplaceRate: number;
  academySubjectsKept: number;
  classReductionRate: number;
  riskLevel: RiskLevel;
}

export interface AiToolPreset {
  id: AiTool;
  label: string;
  monthlyPrice: number;
  priceBadge: SourceBadge;
  priceNote: string;
  sourceUrl?: string;
  updatedAt: string;
}

export interface SubjectReplaceability {
  subject: Subject;
  label: string;
  baseScore: number;
  strength: string;
  caution: string;
}

export interface GradeAdjustment {
  gradeLevel: GradeLevel;
  label: string;
  scoreAdjustment: number;
  note: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  defaults: Partial<AiTutoringInputDefaults>;
}

export interface ResultMessage {
  type: ScenarioType;
  label: string;
  tone: "positive" | "neutral" | "caution";
  summary: string;
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}
```

---

## 6. 상수 설계

### 6-1. 기본값

```ts
export const AI_TUTORING_DEFAULTS: AiTutoringInputDefaults = {
  gradeLevel: "middle",
  childCount: 1,
  subjectCount: 2,
  subjects: ["math", "english"],
  weeklyClassCount: 4,
  minutesPerClass: 90,
  weeksPerMonth: 4.345,

  monthlyAcademyFeePerSubject: 250000,
  usePrivateTutoring: false,
  tutoringHourlyRate: 50000,
  weeklyTutoringHours: 0,
  monthlyMaterialCost: 30000,
  monthlyTransportCost: 20000,
  monthlySnackCost: 30000,

  selectedAiTools: ["chatgpt"],
  chatgptMonthlyPrice: 29000,
  khanmigoMonthlyPrice: 0,
  wrtnMonthlyPrice: 0,
  otherAiMonthlyPrice: 20000,
  aiMaterialCost: 20000,
  parentWeeklyCareHours: 2,
  parentHourlyValue: 15000,
  includeParentTimeCost: false,

  scenarioType: "hybrid",
  aiReplaceRate: 50,
  academySubjectsKept: 1,
  classReductionRate: 50,
  riskLevel: "medium",
};
```

AI 구독료 기본값은 구현 시점의 공식 가격과 환율을 확인해 교체한다. 가격이 바뀔 수 있으므로 결과 화면에는 `가격 확인 필요` 배지를 유지한다.

### 6-2. AI 도구 프리셋

```ts
export const AI_TOOL_PRESETS: AiToolPreset[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    monthlyPrice: 29000,
    priceBadge: "가격 확인 필요",
    priceNote: "공식 요금과 환율에 따라 원화 체감 비용이 달라질 수 있습니다.",
    updatedAt: "2026-05-21",
  },
  {
    id: "khanmigo",
    label: "Khanmigo",
    monthlyPrice: 0,
    priceBadge: "가격 확인 필요",
    priceNote: "국내 사용 가능 여부와 요금 정책을 확인해야 합니다.",
    updatedAt: "2026-05-21",
  },
  {
    id: "wrtn",
    label: "뤼튼",
    monthlyPrice: 0,
    priceBadge: "가격 확인 필요",
    priceNote: "무료·유료 정책 변동 가능성이 있어 직접 입력을 우선합니다.",
    updatedAt: "2026-05-21",
  },
];
```

### 6-3. 과목별 대체 가능 점수

```ts
export const SUBJECT_REPLACEABILITY: SubjectReplaceability[] = [
  {
    subject: "english",
    label: "영어",
    baseScore: 82,
    strength: "회화, 작문, 단어 반복, 문장 첨삭에 강합니다.",
    caution: "발음 교정과 시험 전략은 별도 관리가 필요합니다.",
  },
  {
    subject: "coding",
    label: "코딩",
    baseScore: 85,
    strength: "예제 생성, 오류 설명, 단계별 힌트 제공에 강합니다.",
    caution: "무작정 정답을 복사하지 않도록 과정을 확인해야 합니다.",
  },
  {
    subject: "math",
    label: "수학",
    baseScore: 68,
    strength: "개념 설명과 유사 문제 생성에 적합합니다.",
    caution: "오답 습관, 풀이 과정, 시험 시간 관리는 학부모나 강사의 점검이 필요합니다.",
  },
  {
    subject: "korean",
    label: "국어",
    baseScore: 62,
    strength: "독해 질문, 요약, 글쓰기 첨삭 보조에 활용할 수 있습니다.",
    caution: "학교·입시 평가 기준과 채점 포인트는 별도로 확인해야 합니다.",
  },
  {
    subject: "science",
    label: "과학",
    baseScore: 65,
    strength: "개념 설명, 실험 원리 정리, 퀴즈 생성에 적합합니다.",
    caution: "탐구 설계와 서술형 답안은 추가 점검이 필요합니다.",
  },
  {
    subject: "other",
    label: "기타",
    baseScore: 55,
    strength: "자료 정리와 반복 질문 보조에 활용할 수 있습니다.",
    caution: "과목 특성에 맞춘 별도 판단이 필요합니다.",
  },
];
```

### 6-4. 프리셋

- `elementaryEnglishCoding`: 초등 영어·코딩 보조형
- `middleMathEnglish`: 중학생 수학·영어 절감형
- `highExamStable`: 고등 입시 안정형

프리셋 버튼 클릭 시 입력값을 한 번에 채우고 즉시 재계산한다.

---

## 7. 계산 로직

파일 위치:

- v1: `public/scripts/ai-tutoring-vs-academy-cost.js`
- v2: 계산 함수 일부를 `src/data` 또는 별도 TS 유틸로 분리 가능

### 7-1. 입력 정규화

```js
function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function readInput() {
  return {
    gradeLevel: getValue("gradeLevel"),
    childCount: clamp(getNumber("childCount"), 1, 5),
    subjectCount: clamp(getNumber("subjectCount"), 1, 8),
    subjects: getCheckedValues("subjects"),
    weeklyClassCount: clamp(getNumber("weeklyClassCount"), 0, 21),
    minutesPerClass: clamp(getNumber("minutesPerClass"), 30, 240),
    weeksPerMonth: clamp(getNumber("weeksPerMonth"), 4, 5),
    // 이하 비용 입력
  };
}
```

### 7-2. 현재 월 교육비

```js
function calculateCurrentCost(input) {
  const academyCost =
    input.monthlyAcademyFeePerSubject * input.subjectCount * input.childCount;
  const tutoringCost = input.usePrivateTutoring
    ? input.tutoringHourlyRate * input.weeklyTutoringHours * input.weeksPerMonth * input.childCount
    : 0;
  const extraCost =
    input.monthlyMaterialCost + input.monthlyTransportCost + input.monthlySnackCost;

  return {
    academyCost,
    tutoringCost,
    extraCost,
    total: academyCost + tutoringCost + extraCost,
  };
}
```

### 7-3. AI 전환 후 월 비용

```js
function calculateAiCost(input) {
  const aiSubscriptionCost =
    input.chatgptMonthlyPrice +
    input.khanmigoMonthlyPrice +
    input.wrtnMonthlyPrice +
    input.otherAiMonthlyPrice;

  const keptAcademyCost =
    input.monthlyAcademyFeePerSubject * input.academySubjectsKept * input.childCount;
  const reducedExtraCost =
    (input.monthlyMaterialCost + input.monthlyTransportCost + input.monthlySnackCost) *
    (1 - input.classReductionRate / 100);
  const parentTimeCost = input.includeParentTimeCost
    ? input.parentWeeklyCareHours * input.parentHourlyValue * input.weeksPerMonth
    : 0;

  return {
    aiSubscriptionCost,
    keptAcademyCost,
    reducedExtraCost,
    parentTimeCost,
    aiMaterialCost: input.aiMaterialCost,
    total:
      aiSubscriptionCost +
      keptAcademyCost +
      reducedExtraCost +
      parentTimeCost +
      input.aiMaterialCost,
  };
}
```

### 7-4. 절감액

```js
function calculateSavings(currentTotal, aiTotal) {
  const monthlySaving = currentTotal - aiTotal;
  const annualSaving = monthlySaving * 12;
  const savingRate = currentTotal > 0 ? (monthlySaving / currentTotal) * 100 : 0;

  return { monthlySaving, annualSaving, savingRate };
}
```

### 7-5. 과목별 AI 대체 가능 점수

```js
function calculateSubjectScores(input, subjectRules) {
  const gradeAdjustments = {
    elementaryLow: -12,
    elementaryHigh: -6,
    middle: 0,
    high: -10,
  };
  const riskAdjustments = {
    low: 5,
    medium: 0,
    high: -10,
  };

  return input.subjects.map((subject) => {
    const rule = subjectRules.find((item) => item.subject === subject);
    const rawScore =
      (rule?.baseScore || 55) +
      gradeAdjustments[input.gradeLevel] +
      riskAdjustments[input.riskLevel];

    return {
      subject,
      label: rule?.label || "기타",
      score: clamp(rawScore, 0, 100),
      strength: rule?.strength || "",
      caution: rule?.caution || "",
    };
  });
}
```

### 7-6. 추천 시나리오

```js
function getRecommendation(averageScore, savingRate, input) {
  if (input.riskLevel === "high" || averageScore < 60) {
    return "academy";
  }

  if (averageScore >= 78 && savingRate >= 40) {
    return "fullAi";
  }

  if (averageScore >= 60 && savingRate >= 20) {
    return "hybrid";
  }

  return "academy";
}
```

결과 문구는 `비용 기준 추천`이라는 단서를 붙인다.

---

## 8. DOM 구조

### 8-1. 데이터 주입

```astro
<script
  id="atacData"
  type="application/json"
  set:html={JSON.stringify({
    defaults: AI_TUTORING_DEFAULTS,
    aiToolPresets: AI_TOOL_PRESETS,
    subjectRules: SUBJECT_REPLACEABILITY,
    scenarioPresets: AI_TUTORING_SCENARIO_PRESETS,
    resultMessages: AI_TUTORING_RESULT_MESSAGES,
  })}
/>
<script src="/scripts/ai-tutoring-vs-academy-cost.js" defer></script>
```

### 8-2. 입력 폼 ID

```text
atac-grade-level
atac-child-count
atac-subject-count
atac-weekly-class-count
atac-minutes-per-class
atac-academy-fee
atac-use-private-tutoring
atac-tutoring-hourly-rate
atac-weekly-tutoring-hours
atac-material-cost
atac-transport-cost
atac-snack-cost
atac-chatgpt-price
atac-khanmigo-price
atac-wrtn-price
atac-other-ai-price
atac-ai-material-cost
atac-parent-weekly-care-hours
atac-parent-hourly-value
atac-include-parent-time-cost
atac-scenario-type
atac-ai-replace-rate
atac-academy-subjects-kept
atac-class-reduction-rate
atac-risk-level
```

과목 체크박스:

```astro
<input type="checkbox" name="atac-subjects" value="math" checked />
```

AI 도구 체크박스:

```astro
<input type="checkbox" name="atac-ai-tools" value="chatgpt" checked />
```

### 8-3. 결과 DOM ID

```text
atac-current-monthly-cost
atac-ai-monthly-cost
atac-monthly-saving
atac-annual-saving
atac-saving-rate
atac-recommendation-label
atac-recommendation-summary
atac-breakeven-count
atac-parent-time-cost
atac-subject-score-list
atac-cost-breakdown-table
atac-scenario-comparison
```

---

## 9. 결과 UI 설계

### 9-1. KPI 카드

순서:

1. 월 절감액
2. 연간 절약액
3. AI 전환 후 월 비용
4. 현재 월 교육비

월 절감액이 음수면 `AI 전환 후 비용 증가`로 라벨을 바꾼다.

```astro
<section class="atac-results" aria-live="polite">
  <article class="atac-kpi atac-kpi--primary">
    <span>월 절감액</span>
    <strong id="atac-monthly-saving">0원</strong>
    <p id="atac-saving-rate">현재 대비 0%</p>
  </article>
</section>
```

### 9-2. 추천 시나리오 카드

```astro
<article class="atac-recommendation" data-recommendation-tone="neutral">
  <span class="atac-badge">비용 기준 추천</span>
  <h2 id="atac-recommendation-label">하이브리드 추천</h2>
  <p id="atac-recommendation-summary"></p>
  <p class="atac-disclaimer">
    이 결과는 비용 시뮬레이션이며 학습 효과를 보장하지 않습니다.
  </p>
</article>
```

### 9-3. 과목별 점수

```astro
<section class="atac-subject-scores" aria-labelledby="atac-score-title">
  <h2 id="atac-score-title">과목별 AI 대체 가능 점수</h2>
  <div id="atac-subject-score-list" class="atac-score-list"></div>
</section>
```

점수 바는 CSS width로 처리한다. 차트 라이브러리 없이 구현한다.

```html
<article class="atac-score-item">
  <div class="atac-score-head">
    <strong>영어</strong>
    <span>82점</span>
  </div>
  <div class="atac-score-track">
    <span class="atac-score-fill" style="width: 82%"></span>
  </div>
  <p>회화, 작문, 단어 반복, 문장 첨삭에 강합니다.</p>
</article>
```

### 9-4. 시나리오 비교

3개 카드를 고정 노출한다.

| 시나리오 | 계산 방식 | 표시 항목 |
| --- | --- | --- |
| 완전 대체 | 유지 학원 과목 0개 | 월 비용, 절감액, 관리 리스크 |
| 하이브리드 | 일부 과목·횟수 유지 | 월 비용, 절감액, 추천 대상 |
| 학원 유지 | 학원 유지 + AI 보조 | 월 비용 증가분, 학습 보조 장점 |

---

## 10. 스크립트 설계

파일: `public/scripts/ai-tutoring-vs-academy-cost.js`

### 10-1. 모듈 구조

```js
(function () {
  const dataNode = document.getElementById("atacData");
  if (!dataNode) return;

  const seed = JSON.parse(dataNode.textContent || "{}");
  const state = {
    input: { ...seed.defaults },
  };

  function formatWon(value) {}
  function readInput() {}
  function calculateCurrentCost(input) {}
  function calculateAiCost(input) {}
  function calculateSubjectScores(input) {}
  function getRecommendation(score, savingRate, input) {}
  function renderResults(result) {}
  function bindInputs() {}
  function bindPresets() {}
  function init() {}

  init();
})();
```

### 10-2. 이벤트

- `input`: 숫자 입력 변경 시 즉시 재계산
- `change`: select, checkbox, toggle 변경 시 재계산
- `click`: 프리셋 버튼 적용
- `click`: 시나리오 segmented control 전환

### 10-3. URL 파라미터

공유용으로 최소 파라미터만 지원한다.

```text
grade=middle
subjects=math,english
fee=250000
scenario=hybrid
replace=50
```

사용자 입력값 전체를 URL에 싣지는 않는다.

---

## 11. 입력 UX 상세

### 숫자 입력

- 원 단위 입력은 천 단위 콤마 표시를 지원한다.
- 내부 계산은 숫자로 정규화한다.
- 음수 입력은 0으로 보정한다.

### 슬라이더

- AI 대체 비율: 0~100%, 5% 단위
- 학원 횟수 감소율: 0~100%, 5% 단위
- 화면에는 `50% 대체`, `주 2회 감소 수준`처럼 해석 문구를 함께 표시한다.

### 토글

- `과외 이용 여부`가 꺼져 있으면 과외 단가와 시간 입력을 비활성화한다.
- `부모 시간비용 반영`이 꺼져 있으면 부모 시간비용 결과를 0원으로 표시하되, 해설 문구에는 숨은 비용 가능성을 안내한다.

---

## 12. SCSS 설계

파일: `src/styles/scss/pages/_ai-tutoring-vs-academy-cost.scss`

### 주요 클래스

```scss
.atac-page {}
.atac-hero {}
.atac-notice {}
.atac-preset-grid {}
.atac-form-grid {}
.atac-field {}
.atac-field-row {}
.atac-checkbox-grid {}
.atac-segmented {}
.atac-results {}
.atac-kpi {}
.atac-recommendation {}
.atac-badge {}
.atac-score-list {}
.atac-score-item {}
.atac-score-track {}
.atac-score-fill {}
.atac-breakdown {}
.atac-scenario-grid {}
.atac-scenario-card {}
.atac-disclaimer {}
.atac-cta-band {}
```

### 디자인 규칙

- 카드 반경은 8px 이하를 기본으로 한다.
- 입력 카드 안에 또 다른 카드가 들어가는 구조는 피한다.
- 결과 KPI는 숫자가 길어져도 줄바꿈으로 안정적으로 표시한다.
- 대체 가능 점수 바는 색상만으로 의미를 전달하지 않고 점수와 라벨을 함께 표시한다.
- `추정`, `시뮬레이션`, `가격 확인 필요` 배지는 결과 근처에 반복 노출한다.

### 반응형

- 1024px 이상: 입력 2열, 결과 패널 sticky 가능
- 768px 이하: 입력과 결과 단일 컬럼
- 560px 이하: KPI 카드 1열, segmented control 줄바꿈 허용

---

## 13. SEO/본문 설계

### 메타

- title: `AI 과외 vs 학원 비용 계산기 | 월 학원비 절감액 비교`
- description: `자녀 학년, 과목 수, 주간 수업 횟수, 현재 학원비를 입력하면 ChatGPT 등 AI 학습 도구로 대체했을 때 월 절감액과 연간 절약액을 계산합니다.`
- canonical: `/tools/ai-tutoring-vs-academy-cost/`

### SeoContent 구성

1. AI 과외 비용 비교가 필요한 이유
2. AI가 비용을 줄일 수 있는 영역
3. 완전 대체보다 하이브리드를 먼저 봐야 하는 이유
4. 과목별 AI 활용 적합도
5. FAQ

### FAQ

```ts
export const AI_TUTORING_FAQ: FaqItem[] = [
  {
    question: "AI 과외가 학원을 완전히 대체할 수 있나요?",
    answer:
      "과목, 학년, 학습 습관에 따라 다릅니다. 이 계산기는 비용 기준 시뮬레이션이며 학습 효과를 보장하지 않습니다.",
  },
  {
    question: "ChatGPT로 수학 학원을 대체할 수 있나요?",
    answer:
      "개념 설명과 유사 문제 생성에는 도움이 될 수 있지만 오답 습관, 풀이 과정, 시험 전략은 별도 점검이 필요합니다.",
  },
  {
    question: "영어 학원은 AI로 대체하기 쉬운 편인가요?",
    answer:
      "회화, 작문, 단어 반복, 문장 첨삭은 AI 활용도가 높은 편입니다. 다만 발음, 시험 대비, 학습 지속성은 별도 관리가 필요합니다.",
  },
  {
    question: "AI 학습 도구 비용은 얼마로 계산해야 하나요?",
    answer:
      "무료·유료 정책과 환율이 바뀔 수 있으므로 계산기에서 직접 월 구독료를 수정할 수 있게 제공합니다.",
  },
  {
    question: "부모 관리 시간도 비용에 넣어야 하나요?",
    answer:
      "AI 학습은 학부모의 목표 설정과 오답 점검이 필요할 수 있습니다. 필요하면 부모 관리 시간을 시급으로 환산해 숨은 비용까지 비교할 수 있습니다.",
  },
];
```

---

## 14. 관련 링크

```ts
export const AI_TUTORING_RELATED_LINKS: RelatedLink[] = [
  {
    label: "배달 vs 직접 요리 비용 계산기",
    href: "/tools/delivery-vs-cooking-cost/",
    description: "생활비 절감 효과를 월간·연간 기준으로 비교합니다.",
  },
  {
    label: "대출 갈아타기 계산기",
    href: "/tools/loan-refinancing-calculator/",
    description: "금리 변경 시 월 납입금과 총 이자 절감액을 계산합니다.",
  },
  {
    label: "2026 1인 가구 생활비 완전 해부",
    href: "/reports/single-household-living-cost-2026/",
    description: "주거비, 식비, 통신비, 구독료까지 생활비 구조를 분석합니다.",
  },
];
```

---

## 15. 접근성·주의 문구

### 접근성

- 결과 영역은 `aria-live="polite"`를 사용한다.
- segmented control은 버튼 그룹으로 구현하고 현재 선택 상태를 `aria-pressed`로 표시한다.
- 과목 점수 바에는 시각적 막대 외에 텍스트 점수를 제공한다.
- 모든 입력에는 명시적 `label`을 연결한다.

### 고정 주의 문구

결과 영역과 본문 하단에 동일하게 노출한다.

```text
이 계산기는 교육비 절감 가능성을 추정하는 도구입니다. AI 학습 도구가 학원·과외의 학습 효과를 보장하거나 모든 학생에게 동일하게 적합하다는 의미는 아닙니다.
```

가격 입력 영역에는 별도 문구를 둔다.

```text
AI 학습 도구 구독료는 국가, 요금제, 환율, 프로모션에 따라 달라질 수 있습니다. 최신 가격을 확인한 뒤 직접 수정해 계산하세요.
```

---

## 16. 등록 예시

`src/data/tools.ts`

```ts
{
  slug: "ai-tutoring-vs-academy-cost",
  title: "AI 과외 vs 학원 비용 계산기",
  description:
    "현재 학원비와 AI 학습 도구 구독료를 비교해 월 절감액, 연간 절약액, 과목별 대체 가능 점수를 계산합니다.",
  category: "AI/생산성/자동화",
  href: "/tools/ai-tutoring-vs-academy-cost/",
  badges: ["AI", "교육비", "학원비", "시뮬레이션"],
}
```

`src/styles/app.scss`

```scss
@use 'scss/pages/ai-tutoring-vs-academy-cost';
```

`public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/ai-tutoring-vs-academy-cost/</loc>
</url>
```

---

## 17. QA 체크리스트

- [ ] `/tools/ai-tutoring-vs-academy-cost/` 페이지가 정상 렌더링된다.
- [ ] `src/data/tools.ts` 등록 후 `/tools/` 목록에 노출된다.
- [ ] `src/styles/app.scss`에 전용 SCSS가 연결되어 있다.
- [ ] `public/sitemap.xml`에 URL이 추가되어 있다.
- [ ] 기본값으로 계산했을 때 월 절감액·연간 절약액이 즉시 표시된다.
- [ ] 완전 대체·하이브리드·학원 유지 시나리오가 모두 비교된다.
- [ ] 월 절감액이 음수일 때 비용 증가 상태로 자연스럽게 표시된다.
- [ ] 과목별 대체 가능 점수가 0~100 범위를 벗어나지 않는다.
- [ ] `추정`, `시뮬레이션`, `가격 확인 필요` 배지가 표시된다.
- [ ] AI가 학습 효과를 보장한다는 표현이 없다.
- [ ] 부모 시간비용 포함/제외 토글 결과가 올바르게 반영된다.
- [ ] 모바일 360px 폭에서 입력, KPI, 점수 바가 겹치지 않는다.
- [ ] FAQ 구조화 데이터와 화면 FAQ 문구가 일치한다.
- [ ] `npm run build`가 성공한다.

---

## 18. v1 / v2 범위

### v1

- 정적 Astro 계산기 페이지
- 입력값 기반 비용 계산
- 3개 시나리오 비교
- 과목별 AI 대체 가능 점수
- 프리셋 3종
- FAQ, SeoContent, 내부 CTA

### v2

- 자녀별 복수 프로필 저장
- 과목별 학원비 개별 입력
- 학습 루틴 추천
- 교육비 공제 계산기 연동
- AI 학습 플랫폼 가격 데이터 주기 업데이트

---

## 19. 구현 메모

이 계산기의 기본값은 `하이브리드`가 적합하다. “AI로 학원을 완전히 대체한다”는 메시지는 학부모에게 부담스럽고, 실제 사용 의사결정도 대부분 일부 과목·일부 횟수 조정에서 시작된다.

결과 화면의 첫 숫자는 반드시 `월 절감액`이어야 한다. 사용자가 궁금한 것은 AI 플랫폼 소개가 아니라 “우리 집 교육비가 실제로 얼마나 줄어드는지”이므로, 제휴 CTA는 결과 해석 이후에 배치한다.
