# AI 학습 도구 vs 학원 2026 비용·효과 완전 비교 — 설계 문서

> 기획 원문: `docs/plan/202605/ai-learning-vs-academy-2026.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/reports/` 비교 리포트  
> 구현 기준: AI 학습 도구와 전통 학원의 월 비용, 과목별 대체 가능성, 5년 누적 비용, 학습 효과 연구, 하이브리드 전략을 비교

---

## 1. 문서 개요

- 구현 대상: `AI 학습 도구 vs 학원 2026 비용·효과 완전 비교`
- slug: `ai-learning-vs-academy-2026`
- URL: `/reports/ai-learning-vs-academy-2026/`
- 카테고리: AI/생산성/자동화
- 핵심 검색 의도: "AI 학습 도구 학원 대체 비용 비교 2026", "ChatGPT 학원비 절감", "AI 과외 비용", "AI 학습 효과"
- 핵심 CTA: `/tools/ai-tutoring-vs-academy-cost/`
- 안전 원칙: AI가 학원·과외를 완전히 대체하거나 성적 향상을 보장한다는 표현을 쓰지 않는다. 비용 수치, 가격, 연구, 후기, 시뮬레이션을 배지로 분리한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    aiLearningVsAcademy2026.ts       ← 플랫폼, 비용 시나리오, 과목 매트릭스, 연구, FAQ, 관련 링크
    reports.ts
  pages/
    reports/
      ai-learning-vs-academy-2026.astro

public/
  scripts/
    ai-learning-vs-academy-2026.js   ← 5년 비용 차트, 학년/과목 필터, 체크리스트

src/styles/scss/pages/
  _ai-learning-vs-academy-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/ai-learning-vs-academy-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 최신 리포트 또는 AI/생산성 추천 영역
- `src/pages/reports/index.astro` 정렬/카테고리 노출 확인
- `public/og/reports/ai-learning-vs-academy-2026.png` 또는 OG 생성 스크립트 대상 추가

---

## 3. 레이아웃 방향

- 정적 리포트 페이지.
- 최상위 클래스: `report-page alva-page`
- SCSS prefix: `alva-`
- 차트는 보조 정보로만 사용하고, 모든 핵심 수치는 표와 카드로도 제공한다.
- 가격·효과 관련 데이터에는 `공식 통계`, `공식 가격`, `연구`, `후기`, `시뮬레이션`, `가격 확인 필요` 배지를 붙인다.
- 기본 결론은 `완전 대체`가 아니라 `하이브리드 우선 검토`다.

권장 페이지 구조:

```astro
<main class="report-page alva-page">
  <Hero />
  <DataTrustPanel />
  <SummaryCards />
  <PlatformComparison />
  <SubjectMatrix />
  <FiveYearCostSimulation />
  <ResearchSummary />
  <CalculatorCta />
  <SeoContent />
</main>
```

---

## 4. 데이터 모델

파일: `src/data/aiLearningVsAcademy2026.ts`

```ts
export type EvidenceBadge =
  | "공식 통계"
  | "공식 가격"
  | "연구"
  | "후기"
  | "시뮬레이션"
  | "가격 확인 필요"
  | "정책 변경 가능";

export type PlatformType =
  | "generalAi"
  | "educationAi"
  | "lecture"
  | "problemSolving"
  | "academy";

export type SubjectId = "math" | "english" | "korean" | "science" | "coding";
export type GradeBand = "elementaryLow" | "elementaryHigh" | "middle" | "high";
export type SuitabilityLevel = "high" | "medium" | "low";
export type ScenarioType = "fullAi" | "hybrid" | "academy";
export type Tone = "positive" | "neutral" | "caution";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url?: string;
  badge: EvidenceBadge;
  asOf: string;
  note?: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  badge: EvidenceBadge;
  tone: Tone;
}

export interface AiLearningPlatform {
  id: string;
  name: string;
  type: PlatformType;
  monthlyPrice: number;
  priceText: string;
  priceBadge: EvidenceBadge;
  bestFor: string;
  strengths: string[];
  cautions: string[];
  sourceId?: string;
}

export interface SubjectSuitability {
  subject: SubjectId;
  label: string;
  level: SuitabilityLevel;
  score: number;
  aiUseCases: string[];
  academyUseCases: string[];
  caution: string;
}

export interface GradeRoadmap {
  gradeBand: GradeBand;
  label: string;
  recommendedStrategy: string;
  aiUse: string;
  academyUse: string;
  caution: string;
}

export interface CostScenario {
  type: ScenarioType;
  label: string;
  monthlyAcademyCost: number;
  monthlyAiCost: number;
  monthlyHybridCost: number;
  academyIncreaseRate: number;
  aiIncreaseRate: number;
  description: string;
  caution: string;
}

export interface FiveYearCostPoint {
  year: number;
  fullAi: number;
  hybrid: number;
  academy: number;
}

export interface ResearchInsight {
  title: string;
  badge: EvidenceBadge;
  finding: string;
  limitation: string;
  implication: string;
  sourceId?: string;
}

export interface ReviewSignal {
  sentiment: "positive" | "neutral" | "negative";
  label: string;
  summary: string;
  badge: EvidenceBadge;
}

export interface ParentChecklistItem {
  id: string;
  label: string;
  description: string;
  riskIfMissing: string;
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

## 5. 상수 설계

### 5-1. 메타

```ts
export const AI_LEARNING_VS_ACADEMY_META = {
  slug: "ai-learning-vs-academy-2026",
  title: "AI 학습 도구 vs 학원 2026 비용·효과 완전 비교",
  description:
    "2026년 AI 학습 도구와 전통 학원의 월 비용, 과목별 대체 가능성, 5년 누적 비용, 학습 효과 연구, 하이브리드 전략을 비교합니다.",
  category: "AI/생산성/자동화",
  updatedAt: "2026-05-21",
};
```

### 5-2. 요약 카드

```ts
export const ALVA_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "참여학생 월평균 사교육비",
    value: "60.4만 원",
    description: "2025년 초중고 사교육비조사 기준 참여학생 월평균 사교육비입니다.",
    badge: "공식 통계",
    tone: "neutral",
  },
  {
    label: "기본 결론",
    value: "하이브리드 우선",
    description: "과목·학년·학습 습관에 따라 AI 활용 범위를 나누는 전략이 현실적입니다.",
    badge: "시뮬레이션",
    tone: "positive",
  },
  {
    label: "AI 적합 과목",
    value: "영어·코딩",
    description: "반복 질문, 작문, 예제 생성, 오류 설명에 강점이 있습니다.",
    badge: "연구",
    tone: "positive",
  },
  {
    label: "주의 과목",
    value: "수학·입시",
    description: "오답 습관, 풀이 과정, 시험 전략은 사람의 점검이 필요합니다.",
    badge: "연구",
    tone: "caution",
  },
];
```

### 5-3. 플랫폼 비교 데이터

```ts
export const ALVA_PLATFORMS: AiLearningPlatform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    type: "generalAi",
    monthlyPrice: 0,
    priceText: "무료~유료 요금제",
    priceBadge: "가격 확인 필요",
    bestFor: "개념 질문, 작문·첨삭, 영어 대화, 코딩 보조",
    strengths: ["범용성이 높음", "질문 반복이 쉬움", "영어·코딩 보조에 강함"],
    cautions: ["답변 검증 필요", "요금제와 환율 변동 가능", "학생용 안전장치 별도 확인 필요"],
  },
  {
    id: "wrtn",
    name: "뤼튼",
    type: "generalAi",
    monthlyPrice: 0,
    priceText: "무료/유료 정책 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "한국어 질문, 문장 생성, 자료 정리",
    strengths: ["한국어 접근성이 높음", "학습 자료 정리에 활용 가능"],
    cautions: ["요금·기능 정책 변동 가능", "교육 특화 커리큘럼은 별도 확인 필요"],
  },
  {
    id: "khanmigo",
    name: "Khanmigo",
    type: "educationAi",
    monthlyPrice: 0,
    priceText: "공식 안내 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "수학·코딩·인문 질문형 학습",
    strengths: ["교육 특화 AI 튜터", "힌트 중심 학습 설계"],
    cautions: ["국내 이용 가능성 확인 필요", "한국 입시 커리큘럼과 직접 대응은 제한적일 수 있음"],
  },
  {
    id: "class101",
    name: "클래스101 AI/온라인 강의형",
    type: "lecture",
    monthlyPrice: 0,
    priceText: "구독·프로모션 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "커리큘럼형 강의와 자기주도 학습",
    strengths: ["강의형 커리큘럼", "관심사 기반 학습"],
    cautions: ["AI 튜터형과 강의형을 구분해야 함", "입시 과목 직접 대체 여부 확인 필요"],
  },
];
```

### 5-4. 과목별 매트릭스

```ts
export const ALVA_SUBJECT_MATRIX: SubjectSuitability[] = [
  {
    subject: "english",
    label: "영어",
    level: "high",
    score: 82,
    aiUseCases: ["회화 연습", "작문 첨삭", "단어 반복", "문장 변환"],
    academyUseCases: ["발음 교정", "시험 전략", "학습 지속성 관리"],
    caution: "시험 대비와 발음 교정은 사람의 피드백이 유리할 수 있습니다.",
  },
  {
    subject: "coding",
    label: "코딩",
    level: "high",
    score: 85,
    aiUseCases: ["예제 생성", "오류 설명", "프로젝트 힌트", "개념 질문"],
    academyUseCases: ["프로젝트 리뷰", "코드 품질 피드백", "학습 로드맵"],
    caution: "정답 코드를 그대로 복사하지 않도록 과정 점검이 필요합니다.",
  },
  {
    subject: "math",
    label: "수학",
    level: "medium",
    score: 68,
    aiUseCases: ["개념 설명", "유사 문제", "단계별 힌트"],
    academyUseCases: ["오답 관리", "풀이 습관", "시험 시간 전략"],
    caution: "풀이 과정과 오답 원인을 직접 설명할 수 있는지 확인해야 합니다.",
  },
  {
    subject: "korean",
    label: "국어",
    level: "low",
    score: 58,
    aiUseCases: ["요약", "독해 질문", "글쓰기 초안"],
    academyUseCases: ["서술형 채점", "문학 해석", "평가 기준 적용"],
    caution: "학교·입시 채점 기준과 AI 피드백이 다를 수 있습니다.",
  },
  {
    subject: "science",
    label: "과학",
    level: "medium",
    score: 65,
    aiUseCases: ["개념 설명", "퀴즈 생성", "실험 원리 정리"],
    academyUseCases: ["탐구 설계", "서술형 답안", "심화 문제"],
    caution: "탐구형·서술형 문제는 검증된 교재와 사람의 점검이 필요합니다.",
  },
];
```

### 5-5. 비용 시뮬레이션

```ts
export const ALVA_COST_SCENARIO: CostScenario = {
  type: "hybrid",
  label: "중학생 수학·영어 2과목 기준",
  monthlyAcademyCost: 620000,
  monthlyAiCost: 69000,
  monthlyHybridCost: 349000,
  academyIncreaseRate: 0.03,
  aiIncreaseRate: 0.03,
  description: "학원 2과목 유지, AI 완전 전환, 1과목 학원 유지 하이브리드를 비교합니다.",
  caution: "교육비 비교용 추정값이며 학습 효과를 보장하지 않습니다.",
};
```

5년 누적 비용은 빌드 시 데이터로 생성하거나 클라이언트 JS에서 계산한다.

---

## 6. 페이지 IA

1. **Hero** — 제목, 서브카피, 핵심 CTA
2. **DataTrustPanel** — 기준일, 출처 배지, 가격 변동 안내
3. **핵심 요약 카드** — 사교육비 기준선, 하이브리드 결론, AI 적합 과목, 주의 과목
4. **① AI 학습 시장 현황** — 2024→2026 성장 흐름
5. **② 주요 플랫폼 5종 기능·가격 비교표**
6. **③ 과목별 AI 대체 가능성 매트릭스**
7. **④ 학원비 vs AI 구독료 5년 누적 비용 시뮬레이션**
8. **⑤ 실제 학부모·학생 사용 후기 데이터**
9. **⑥ AI+학원 하이브리드 최적 조합 전략**
10. **⑦ 학년별 추천 AI 도구 로드맵**
11. **⑧ 교육부 AI 교육 정책 동향**
12. **⑨ AI 학습 효과 연구 데이터 요약**
13. **⑩ 비용 절감 시나리오 3가지**
14. **⑪ 학부모 체크리스트**
15. **⑫ 전문가 관점 체크포인트**
16. **⑬ 관련 계산기 CTA 및 내부링크**
17. **⑭ 2027 전망 및 결론**
18. **FAQ / SeoContent**

---

## 7. 주요 마크업 설계

### 7-1. 데이터 주입

```astro
<script
  id="alvaData"
  type="application/json"
  set:html={JSON.stringify({
    platforms: ALVA_PLATFORMS,
    subjectMatrix: ALVA_SUBJECT_MATRIX,
    costScenario: ALVA_COST_SCENARIO,
    gradeRoadmap: ALVA_GRADE_ROADMAP,
    checklist: ALVA_PARENT_CHECKLIST,
  })}
/>
<script src="/scripts/ai-learning-vs-academy-2026.js" defer></script>
```

### 7-2. Hero

```astro
<section class="alva-hero">
  <p class="alva-eyebrow">2026 교육비·AI 학습 비교</p>
  <h1>AI 학습 도구 vs 학원 2026 비용·효과 완전 비교</h1>
  <p>
    ChatGPT, 뤼튼, Khanmigo, AI 강의 플랫폼과 전통 학원의 월 비용·과목별 적합도·학습 관리 리스크를 비교합니다.
  </p>
  <a href="/tools/ai-tutoring-vs-academy-cost/" class="alva-primary-cta">
    우리 집 AI 전환 절감액 계산하기
  </a>
</section>
```

### 7-3. 출처 신뢰 패널

```astro
<section class="alva-trust-panel" aria-labelledby="alva-trust-title">
  <h2 id="alva-trust-title">데이터 기준</h2>
  <ul>
    <li><span class="alva-badge alva-badge--official">공식 통계</span> 2025년 초중고 사교육비조사</li>
    <li><span class="alva-badge alva-badge--price">가격 확인 필요</span> AI 플랫폼 요금제</li>
    <li><span class="alva-badge alva-badge--simulation">시뮬레이션</span> 5년 누적 비용</li>
  </ul>
</section>
```

### 7-4. 플랫폼 비교표

```astro
<section class="alva-section" aria-labelledby="alva-platform-title">
  <div class="alva-section-heading">
    <p>② 플랫폼 비교</p>
    <h2 id="alva-platform-title">주요 AI 학습 플랫폼 기능·가격 비교</h2>
  </div>
  <div class="alva-table-wrap">
    <table class="alva-platform-table">
      <thead>
        <tr>
          <th>플랫폼</th>
          <th>주요 용도</th>
          <th>가격</th>
          <th>강점</th>
          <th>주의점</th>
        </tr>
      </thead>
      <tbody>
        {ALVA_PLATFORMS.map((platform) => (
          <tr>
            <th>{platform.name}</th>
            <td>{platform.bestFor}</td>
            <td>
              <span class="alva-badge">{platform.priceBadge}</span>
              {platform.priceText}
            </td>
            <td>{platform.strengths.join(", ")}</td>
            <td>{platform.cautions.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 7-5. 과목별 매트릭스

```astro
<section class="alva-section" aria-labelledby="alva-subject-title">
  <div class="alva-section-heading">
    <p>③ 과목별 판단</p>
    <h2 id="alva-subject-title">AI 대체 가능성 매트릭스</h2>
  </div>
  <div class="alva-subject-grid">
    {ALVA_SUBJECT_MATRIX.map((subject) => (
      <article class={`alva-subject-card alva-subject-card--${subject.level}`}>
        <div class="alva-card-head">
          <h3>{subject.label}</h3>
          <span>{subject.score}점</span>
        </div>
        <div class="alva-score-track">
          <span style={`width: ${subject.score}%`}></span>
        </div>
        <p>{subject.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### 7-6. 계산기 CTA

```astro
<aside class="alva-cta-band">
  <div>
    <span class="alva-badge alva-badge--simulation">계산기</span>
    <h2>우리 집 과목 수와 학원비로 직접 계산해보기</h2>
    <p>자녀 학년, 과목 수, 학원비, AI 구독료를 입력해 월 절감액과 연간 절약액을 확인하세요.</p>
  </div>
  <a href="/tools/ai-tutoring-vs-academy-cost/?grade=middle&subjects=math,english&scenario=hybrid">
    AI 전환 절감액 계산하기
  </a>
</aside>
```

---

## 8. 차트·스크립트 설계

파일: `public/scripts/ai-learning-vs-academy-2026.js`

### 8-1. 책임

- 5년 누적 비용 라인/막대 차트 렌더링
- 학년별 로드맵 필터
- 과목별 매트릭스 필터
- 학부모 체크리스트 점수 계산
- Chart.js가 없을 때 정적 표 유지

### 8-2. 기본 구조

```js
(function () {
  const dataNode = document.getElementById("alvaData");
  if (!dataNode) return;

  const seed = JSON.parse(dataNode.textContent || "{}");
  const formatWon = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;

  function calculateFiveYearCosts(scenario) {}
  function renderCostChart() {}
  function bindGradeFilter() {}
  function bindSubjectFilter() {}
  function bindChecklist() {}

  renderCostChart();
  bindGradeFilter();
  bindSubjectFilter();
  bindChecklist();
})();
```

### 8-3. 5년 비용 계산

```js
function calculateFiveYearCosts(scenario) {
  const rows = [];
  let academyMonthly = scenario.monthlyAcademyCost;
  let aiMonthly = scenario.monthlyAiCost;
  let hybridMonthly = scenario.monthlyHybridCost;

  let academyTotal = 0;
  let aiTotal = 0;
  let hybridTotal = 0;

  for (let year = 1; year <= 5; year += 1) {
    academyTotal += academyMonthly * 12;
    aiTotal += aiMonthly * 12;
    hybridTotal += hybridMonthly * 12;

    rows.push({
      year,
      academy: academyTotal,
      fullAi: aiTotal,
      hybrid: hybridTotal,
    });

    academyMonthly *= 1 + scenario.academyIncreaseRate;
    aiMonthly *= 1 + scenario.aiIncreaseRate;
    hybridMonthly *= 1 + scenario.academyIncreaseRate * 0.5;
  }

  return rows;
}
```

### 8-4. 인터랙션 셀렉터

```text
data-alva-grade
data-alva-subject
data-alva-check
data-alva-cost-table
data-alva-chart
```

### 8-5. 체크리스트 판정

```text
체크 7개 이상: AI 단독 또는 강한 하이브리드 검토
체크 4~6개: 하이브리드 권장
체크 3개 이하: 학원 유지 + AI 보조 권장
```

결과 문구에는 `학습 효과 보장 아님` 단서를 붙인다.

---

## 9. SCSS 설계

파일: `src/styles/scss/pages/_ai-learning-vs-academy-2026.scss`

### 주요 클래스

```scss
.alva-page {}
.alva-hero {}
.alva-eyebrow {}
.alva-primary-cta {}
.alva-trust-panel {}
.alva-badge {}
.alva-summary-grid {}
.alva-summary-card {}
.alva-section {}
.alva-section-heading {}
.alva-table-wrap {}
.alva-platform-table {}
.alva-subject-grid {}
.alva-subject-card {}
.alva-score-track {}
.alva-cost-simulation {}
.alva-chart-wrap {}
.alva-scenario-grid {}
.alva-scenario-card {}
.alva-roadmap {}
.alva-research-list {}
.alva-checklist {}
.alva-check-result {}
.alva-cta-band {}
.alva-source-list {}
```

### 디자인 규칙

- 카드 반경은 8px 이하를 기본으로 한다.
- 표가 많은 페이지이므로 장식보다 행간, 배지, 구분선을 우선한다.
- 비교표는 모바일에서 카드형으로 전환하거나 가로 스크롤을 허용한다.
- 가격과 연구 결과에는 배지를 반복 노출한다.
- CTA는 본문 판단과 분리된 full-width band로 배치한다.
- 점수 바는 색상만으로 의미를 전달하지 않고 점수 텍스트를 함께 표시한다.

### 반응형

- 1024px 이상: 요약 카드 4열, 플랫폼 표 전체 표시
- 768px 이하: 요약 카드 2열, 시나리오 카드 1~2열
- 560px 이하: 요약 카드 1열, 표는 카드형 또는 가로 스크롤

---

## 10. SEO 설계

### 메타

- title: `AI 학습 도구 vs 학원 2026 비용·효과 비교 | 학원비 절감 시뮬레이션`
- description: `2026년 AI 학습 도구와 전통 학원의 월 비용, 과목별 대체 가능성, 5년 누적 비용, 학습 효과 연구, 하이브리드 전략을 비교합니다.`
- canonical: `/reports/ai-learning-vs-academy-2026/`

### H 태그

- H1: `AI 학습 도구 vs 학원 2026 비용·효과 완전 비교`
- H2: 14개 주요 섹션
- H3: 플랫폼, 과목, 학년, 시나리오 하위 비교

### 구조화 데이터

- `Article`
- `FAQPage`
- 필요 시 `ItemList`로 플랫폼 비교 목록 보강

FAQPage는 화면 FAQ와 동일한 문구만 사용한다.

---

## 11. SeoContent / FAQ 설계

### SeoContent 구성

```ts
const seoContent = {
  intro: [
    "AI 학습 도구는 질문을 반복하고, 개념을 다시 설명하고, 영어 문장을 첨삭하는 데 강점이 있습니다. 하지만 모든 학생과 과목에서 학원을 그대로 대체한다고 보기는 어렵습니다.",
    "이 리포트는 2026년 기준 사교육비 데이터와 AI 도구 가격, 연구 결과, 사용 후기를 나눠 보고, 완전 대체·하이브리드·학원 유지 시나리오를 비교합니다.",
  ],
  criteria: [
    "가격은 공식 요금과 사용자가 입력할 수 있는 추정값을 분리합니다.",
    "학습 효과는 연구 결과와 후기 사례를 구분해 해석합니다.",
    "고등·입시 구간은 완전 대체보다 보조 도구 활용을 기본값으로 봅니다.",
  ],
};
```

### FAQ

```ts
export const ALVA_FAQ: FaqItem[] = [
  {
    question: "AI 학습 도구가 학원을 완전히 대체할 수 있나요?",
    answer:
      "일부 과목과 자기주도 학습이 강한 학생에게는 가능성이 있지만, 대부분은 학원과 AI를 함께 쓰는 하이브리드 방식이 현실적입니다.",
  },
  {
    question: "ChatGPT와 Khanmigo는 무엇이 다른가요?",
    answer:
      "ChatGPT는 범용 AI에 가깝고, Khanmigo는 교육 특화 AI 튜터 성격이 강합니다. 커리큘럼, 안전장치, 국내 이용 가능성은 별도로 확인해야 합니다.",
  },
  {
    question: "수학 학원은 AI로 줄여도 되나요?",
    answer:
      "개념 설명과 유사 문제 생성에는 AI가 도움이 될 수 있습니다. 다만 오답 습관, 풀이 과정, 시험 전략은 사람의 점검이 필요합니다.",
  },
  {
    question: "영어 학원은 AI 대체가 쉬운가요?",
    answer:
      "회화, 작문, 단어 반복, 문장 첨삭은 AI 활용도가 높은 편입니다. 발음 교정과 시험 대비는 학원이나 교사의 피드백이 유리할 수 있습니다.",
  },
  {
    question: "AI 학습 도구 비용은 어떻게 계산하나요?",
    answer:
      "월 구독료, 교재비, 부모 관리 시간, 유지할 학원비를 함께 봐야 합니다. 가격은 요금제와 환율에 따라 달라질 수 있습니다.",
  },
  {
    question: "AI 학습 효과 연구는 긍정적인가요?",
    answer:
      "연습 문제나 피드백 품질에서는 긍정적인 결과가 보고되지만, 실제 시험 성과나 장기 학습 습관은 별도 검증이 필요합니다.",
  },
];
```

---

## 12. 관련 링크

```ts
export const ALVA_RELATED_LINKS: RelatedLink[] = [
  {
    label: "AI 과외 vs 학원 비용 계산기",
    href: "/tools/ai-tutoring-vs-academy-cost/",
    description: "우리 집 학원비와 AI 구독료를 입력해 월 절감액과 연간 절약액을 계산합니다.",
  },
  {
    label: "AI 부업 월수익 실태 비교 2026",
    href: "/reports/ai-side-income-comparison-2026/",
    description: "AI 도구의 생산성 효과를 수익 관점에서 비교합니다.",
  },
  {
    label: "2026 1인 가구 생활비 완전 해부",
    href: "/reports/single-household-living-cost-2026/",
    description: "주거비, 식비, 통신비, 구독료까지 생활비 구조를 분석합니다.",
  },
  {
    label: "대출 갈아타기 계산기",
    href: "/tools/loan-refinancing-calculator/",
    description: "가계 고정비 절감 관점에서 대출 전환 효과를 계산합니다.",
  },
];
```

---

## 13. 출처 목록 설계

```ts
export const ALVA_SOURCES: SourceInfo[] = [
  {
    id: "kostat-private-education-2025",
    label: "2025년 초중고 사교육비조사",
    organization: "통계청·교육부",
    url: "https://www.kostat.go.kr/board.es?act=view&bid=11758&list_no=444220&mid=a20101000000&ref_bid=&tag=",
    badge: "공식 통계",
    asOf: "2026-03-12",
  },
  {
    id: "korea-policy-private-education-2025",
    label: "2025년 초중고 사교육비조사 결과",
    organization: "대한민국 정책브리핑",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=156748552",
    badge: "공식 통계",
    asOf: "2026-03-12",
  },
];
```

AI 플랫폼 가격 출처는 구현 직전에 최신 공식 페이지를 확인해 추가한다.

---

## 14. 리포트 등록 예시

`src/data/reports.ts`

```ts
{
  slug: "ai-learning-vs-academy-2026",
  title: "AI 학습 도구 vs 학원 2026 비용·효과 완전 비교",
  description:
    "2026년 AI 학습 도구와 전통 학원의 월 비용, 과목별 대체 가능성, 5년 누적 비용, 학습 효과 연구를 비교합니다.",
  category: "AI/생산성/자동화",
  href: "/reports/ai-learning-vs-academy-2026/",
  badges: ["AI", "교육비", "학원비", "2026"],
}
```

`src/styles/app.scss`

```scss
@use 'scss/pages/ai-learning-vs-academy-2026';
```

`public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/ai-learning-vs-academy-2026/</loc>
</url>
```

---

## 15. QA 체크리스트

- [ ] `/reports/ai-learning-vs-academy-2026/` 페이지가 정상 렌더링된다.
- [ ] `src/data/reports.ts` 등록 후 `/reports/` 목록에 노출된다.
- [ ] `src/styles/app.scss`에 전용 SCSS가 연결되어 있다.
- [ ] `public/sitemap.xml`에 URL이 추가되어 있다.
- [ ] 14개 섹션이 모두 본문에 반영된다.
- [ ] 공식 통계, 공식 가격, 연구, 후기, 시뮬레이션 배지가 구분된다.
- [ ] AI가 학원 효과를 보장한다는 표현이 없다.
- [ ] 플랫폼 가격은 구현 직전 최신 공식 페이지 기준으로 재확인했다.
- [ ] 5년 누적 비용 시뮬레이션에는 `시뮬레이션` 배지가 붙는다.
- [ ] Chart.js가 없어도 비용표로 핵심 내용이 전달된다.
- [ ] 과목 점수 바가 모바일에서 깨지지 않는다.
- [ ] 플랫폼 비교표가 모바일에서 읽기 가능하다.
- [ ] 계산기 CTA가 본문 중간과 하단에 배치된다.
- [ ] FAQ 구조화 데이터와 화면 FAQ 문구가 일치한다.
- [ ] `npm run build`가 성공한다.

---

## 16. v1 / v2 범위

### v1

- 정적 리포트 페이지
- 플랫폼 비교표
- 과목별 AI 대체 가능성 매트릭스
- 5년 누적 비용 시뮬레이션 표와 차트
- 학년별 로드맵
- 연구 데이터 요약
- 학부모 체크리스트
- 계산기 CTA
- FAQ와 SeoContent

### v2

- 플랫폼 가격 데이터 연도별 업데이트
- 방문자 설문 기반 후기 데이터 축적
- 과목·학년 선택형 미니 필터 고도화
- 계산기 입력값과 리포트 CTA 파라미터 연동 강화
- AI 교육 정책 타임라인 자동 갱신

---

## 17. 구현 메모

이 리포트는 데이터가 많은 만큼 첫 화면의 결론을 짧게 잡아야 한다. `참여학생 월평균 사교육비`, `하이브리드 우선`, `영어·코딩 적합`, `수학·입시 주의` 네 가지 카드로 방향을 먼저 보여주고, 상세 근거를 아래에서 풀어낸다.

가장 중요한 전환 지점은 `/tools/ai-tutoring-vs-academy-cost/`다. 플랫폼 추천보다 먼저 사용자가 자기 집 과목 수와 학원비로 직접 계산하게 만드는 흐름이 이 페이지의 검색 유입과 수익화를 모두 살린다.
