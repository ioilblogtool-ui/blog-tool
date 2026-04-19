# 아파트 청약 당첨 가점 계산기 설계 문서

> 기획 원문: `docs/plan/202604/apt-cheonyak-gajum-calculator.md`
> 작성일: 2026-04-19
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정
> 최종 타입: Type A. Simple Calculator
> 참고 문서: `docs/design/202604/calculator-playbook-design.md`
> 참고 계산기: `national-pension-calculator`, `coin-tax-calculator`, `jeonwolse-conversion`

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/apt-cheonyak-gajum-calculator.md`
- 구현 대상: `아파트 청약 당첨 가점 계산기 — 내 점수로 어느 지역 당첨 가능할까?`
- 콘텐츠 유형: `/tools/` 계산기형 페이지

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 계산기 구조에 맞춰 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 입력 구조, 계산 공식, 결과 카드, 해설 문구, CTA 흐름, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- 입력 4개(무주택기간, 부양가족 수, 청약통장 가입기간, 세대주 여부) → 총 84점 계산 → 지역 참고선 비교 → 전략 코멘트 제공.
- 핵심 흐름: `입력 → 총점 + 항목별 점수 → 지역 참고선 비교 → 전략 가이드 → 관련 계산기 연결`
- 타입은 `Simple Calculator`이며, 결과 해설은 점수 수준별 문장형 코멘트로 제공한다.
- **절대 "당첨 가능" 표현 금지. "비교 우위", "도전권", "보수적 접근 필요" 수준으로 제한.**

### 1-4. 권장 slug
- `apt-cheonyak-gajum-calculator`
- URL: `/tools/apt-cheonyak-gajum-calculator/`

### 1-5. 권장 파일 구조
```text
src/
  data/
    tools.ts
    aptCheonyakGajum.ts
  pages/
    tools/
      apt-cheonyak-gajum-calculator.astro

public/
  scripts/
    apt-cheonyak-gajum-calculator.js
  og/tools/
    apt-cheonyak-gajum-calculator.png

src/styles/scss/pages/
  _apt-cheonyak-gajum-calculator.scss
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 계산기 공통 구조
`docs/design/202604/calculator-playbook-design.md` 기준으로 이번 페이지는 아래 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 입력 패널
4. 핵심 결과 KPI 5~6개
5. 지역 참고선 비교 바 차트
6. 전략 가이드 카드 (아코디언)
7. 부양가족 인정 기준 안내 (아코디언)
8. FAQ
9. 이어보기 CTA
10. `SeoContent`

### 2-2. 이번 계산기에서 특히 중요한 것
- 결과에서 절대 "당첨 가능"을 표현하지 않는다.
- 지역 참고선은 **"최근 주요 분양 사례 기준 참고선"**으로 명시하고 공급유형별 편차가 크다는 안내를 붙인다.
- 세대주 여부는 계산에 직접 반영하지 않고, 전략 코멘트 분기 요소로만 활용한다 (v1).
- 부양가족 인정 기준은 화면에 아코디언 형태로 제공하고, 사용자가 혼동하기 쉬운 케이스를 중심으로 안내한다.

---

## 3. 구현 범위

### 3-1. MVP 범위 (v1)
- 입력 4개 제공
  - 무주택기간 (년)
  - 부양가족 수
  - 청약통장 가입기간 (년)
  - 세대주 여부 (토글)
- 결과 UI 제공
  - KPI 카드 5개 이내
  - 항목별 점수 breakdown
  - 지역 참고선 비교 (수평 바 차트)
  - 문장형 전략 코멘트
  - 부양가족 기준 안내 아코디언
  - 가점 올리는 전략 카드
  - FAQ 4개
  - 관련 계산기 CTA 3개

### 3-2. MVP 제외 범위
- 공급유형별 분기 (일반공급/특별공급)
- 신혼부부/생애최초 특공 자가진단
- 실시간 분양 단지 당첨선 데이터
- 계산 결과 이미지 저장
- 배우자 보유 이력, 모집공고일 기준 체크박스

---

## 4. 페이지 목적

- 복잡한 청약 가점 계산을 1분 내 완료하게 한다.
- 항목별 점수 breakdown과 지역 참고선을 통해 본인의 점수 수준을 직관적으로 인식하게 한다.
- 계산 결과를 끝으로 두지 않고 `전월세 전환율 계산기`, `전세대출 관련 리포트`, `부동산 취득세 계산기`로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 첫 청약 준비 중인 30대
- 청약 가점이 몇 점인지 모르고 청약홈에서 헷갈린다.
- 무주택기간, 부양가족, 통장 가입기간을 입력하고 총점을 바로 확인한다.
- 내 점수면 어느 지역 단지를 노릴 수 있는지 참고선으로 파악한다.

### 5-2. 재계약/이사 시점에 청약을 같이 검토 중인 가구
- 현재 전월세 부담도 있고 청약 전략도 함께 세우고 싶다.
- 점수 확인 후 `전월세 전환율 계산기`로 자연스럽게 이동한다.

### 5-3. 부양가족 인정 여부가 헷갈리는 사용자
- 부모님이 같은 세대에 있는데 가점에 포함되는지 모른다.
- 결과 하단 아코디언에서 인정 기준을 확인하고 부양가족 수를 재입력한다.

### 5-4. 청약 전략을 같이 짜고 싶은 신혼부부
- 두 사람의 점수 중 어느 쪽이 높은지 번갈아 계산해본다.
- 특별공급 병행 검토 카드를 통해 신혼부부 특공 루트를 확인한다.

---

## 6. 데이터 구조 (`src/data/aptCheonyakGajum.ts`)

### 6-1. 타입 정의

```ts
export interface CyGInput {
  homelessYears: number;       // 무주택기간 (0~15 이상)
  dependentsCount: number;     // 부양가족 수 (0~6 이상)
  subscriptionYears: number;   // 청약통장 가입기간 (0~15 이상)
  isHouseholder: boolean;      // 세대주 여부
}

export interface CyGResult {
  totalScore: number;
  homelessScore: number;
  dependentsScore: number;
  subscriptionScore: number;
  scoreLevel: 'low' | 'mid' | 'high' | 'top';
  regionLevel: CyGRegionLevel;
  strategyMessages: string[];
}

export interface CyGRegionLevel {
  seoul: string;     // 서울 인기 단지 참고
  metro: string;     // 수도권 참고
  local: string;     // 지방 참고
}

export interface CyGScoreTable {
  homeless: { maxYears: number; score: number }[];
  dependents: { count: number; score: number }[];
  subscription: { maxYears: number; score: number }[];
}

export interface CyGRegionRefLine {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  note: string;
}

export interface CyGFaqItem {
  q: string;
  a: string;
}
```

### 6-2. 점수 테이블 상수

```ts
export const CYG_SCORE_TABLE: CyGScoreTable = {
  homeless: [
    { maxYears: 1,  score: 2  },
    { maxYears: 2,  score: 4  },
    { maxYears: 3,  score: 6  },
    { maxYears: 4,  score: 8  },
    { maxYears: 5,  score: 10 },
    { maxYears: 6,  score: 12 },
    { maxYears: 7,  score: 14 },
    { maxYears: 8,  score: 16 },
    { maxYears: 9,  score: 18 },
    { maxYears: 10, score: 20 },
    { maxYears: 11, score: 22 },
    { maxYears: 12, score: 24 },
    { maxYears: 13, score: 26 },
    { maxYears: 14, score: 28 },
    { maxYears: 15, score: 30 },
    { maxYears: Infinity, score: 32 },
  ],
  dependents: [
    { count: 0, score: 5  },
    { count: 1, score: 10 },
    { count: 2, score: 15 },
    { count: 3, score: 20 },
    { count: 4, score: 25 },
    { count: 5, score: 30 },
    { count: 6, score: 35 }, // 6명 이상
  ],
  subscription: [
    { maxYears: 1,  score: 2  },  // 6개월~1년 미만 → 실제 6개월 미만은 1점이나 입력 단위가 년이므로 1년 미만=2점으로 처리
    { maxYears: 2,  score: 3  },
    { maxYears: 3,  score: 4  },
    { maxYears: 4,  score: 5  },
    { maxYears: 5,  score: 6  },
    { maxYears: 6,  score: 7  },
    { maxYears: 7,  score: 8  },
    { maxYears: 8,  score: 9  },
    { maxYears: 9,  score: 10 },
    { maxYears: 10, score: 11 },
    { maxYears: 11, score: 12 },
    { maxYears: 12, score: 13 },
    { maxYears: 13, score: 14 },
    { maxYears: 14, score: 15 },
    { maxYears: 15, score: 16 },
    { maxYears: Infinity, score: 17 },
  ],
};
```

> **청약통장 6개월 미만 처리**: 입력 최솟값을 0으로 허용하되, 0년 입력 시 score=1 처리하는 예외 로직을 JS 계산 함수에 추가한다.

### 6-3. 지역 참고선 데이터

```ts
export const CYG_REGION_REF_LINES: CyGRegionRefLine[] = [
  {
    id: 'seoul-popular',
    label: '서울 인기 단지',
    minScore: 60,
    maxScore: 84,
    note: '강남·마포·용산 등 핵심 입지, 경쟁이 매우 높음',
  },
  {
    id: 'seoul-standard',
    label: '서울 일반 단지',
    minScore: 50,
    maxScore: 65,
    note: '서울 외곽·비인기 타입 포함, 분양 조건에 따라 상이',
  },
  {
    id: 'metro',
    label: '수도권 (경기·인천)',
    minScore: 40,
    maxScore: 55,
    note: '택지지구·신도시 포함, 단지별 편차 큼',
  },
  {
    id: 'local',
    label: '지방 광역시',
    minScore: 25,
    maxScore: 45,
    note: '대전·대구·부산 등, 일부 단지는 더 낮을 수 있음',
  },
];
```

> **운영 주의**: 이 참고선은 정적 하드코딩으로 관리한다. 화면에 반드시 "최근 주요 분양 사례 기준 참고선 (공급유형·지역별 편차 있음)" 레이블을 붙인다.

### 6-4. 기본 입력값

```ts
export const CYG_DEFAULT_INPUT: CyGInput = {
  homelessYears: 5,
  dependentsCount: 2,
  subscriptionYears: 5,
  isHouseholder: true,
};
```

### 6-5. FAQ 데이터

```ts
export const CYG_FAQ: CyGFaqItem[] = [
  {
    q: '청약 가점은 몇 점 만점인가요?',
    a: '민영주택 일반공급 가점제 기준 총점은 84점이며, 무주택기간 32점·부양가족수 35점·청약통장 가입기간 17점으로 구성됩니다.',
  },
  {
    q: '부양가족은 누구까지 인정되나요?',
    a: '배우자, 직계존속(부모·조부모 등), 직계비속(자녀 등)이 대표적입니다. 단, 동일 세대 구성·주민등록 동거 기간·실제 부양 사실이 요건이 되므로 모집공고문과 등본을 반드시 확인해야 합니다.',
  },
  {
    q: '내 점수로 당첨 가능한 지역을 알 수 있나요?',
    a: '참고 수준으로만 확인할 수 있습니다. 실제 당첨선은 단지, 공급유형, 지역 수요, 경쟁률에 따라 크게 달라집니다. 이 계산기의 지역 참고선은 최근 주요 분양 사례를 기준으로 한 참고값입니다.',
  },
  {
    q: '세대주가 아니면 청약 가점이 낮아지나요?',
    a: '청약 가점 점수 자체는 세대주 여부와 무관하지만, 공급유형에 따라 세대주 요건이 별도로 붙는 경우가 있습니다. 모집공고문의 청약 자격 조건을 먼저 확인하세요.',
  },
];
```

---

## 7. 계산 로직

### 7-1. 무주택기간 점수

```js
function calcHomelessScore(years) {
  const table = [
    [1, 2], [2, 4], [3, 6], [4, 8], [5, 10],
    [6, 12], [7, 14], [8, 16], [9, 18], [10, 20],
    [11, 22], [12, 24], [13, 26], [14, 28], [15, 30],
  ];
  for (const [maxYears, score] of table) {
    if (years < maxYears) return score;
  }
  return 32; // 15년 이상
}
```

### 7-2. 부양가족 점수

```js
function calcDependentsScore(count) {
  const safeCount = Math.min(count, 6);
  if (safeCount === 0) return 5;
  return Math.min(5 + safeCount * 5, 35);
}
```

### 7-3. 청약통장 가입기간 점수

```js
function calcSubscriptionScore(years) {
  if (years < 1) return 1; // 6개월 미만 또는 입력 0
  const table = [
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  ];
  for (const [maxYears, score] of table) {
    if (years < maxYears) return score;
  }
  return 17; // 15년 이상
}
```

### 7-4. 총점 계산 및 레벨 판정

```js
function calcTotal(input) {
  const homelessScore = calcHomelessScore(input.homelessYears);
  const dependentsScore = calcDependentsScore(input.dependentsCount);
  const subscriptionScore = calcSubscriptionScore(input.subscriptionYears);
  const totalScore = homelessScore + dependentsScore + subscriptionScore;

  return {
    totalScore,
    homelessScore,
    dependentsScore,
    subscriptionScore,
    scoreLevel: getScoreLevel(totalScore),
  };
}

function getScoreLevel(score) {
  if (score >= 60) return 'top';
  if (score >= 45) return 'high';
  if (score >= 30) return 'mid';
  return 'low';
}
```

### 7-5. 지역 참고선 비교 판정

```js
function getRegionLevel(totalScore) {
  return {
    seoul: totalScore >= 60
      ? '서울 인기 단지 도전권 수준 (공급유형별 상이)'
      : totalScore >= 50
      ? '서울 일부 단지 도전권 수준, 핵심 입지는 보수적 접근 필요'
      : '서울 인기 단지는 참고선 대비 점수 여유 부족',
    metro: totalScore >= 40
      ? '수도권 주요 단지 도전권 수준 (단지별 편차 큼)'
      : '수도권도 경쟁이 높은 지역은 보수적 접근 필요',
    local: totalScore >= 25
      ? '지방 광역시 일부 단지 전략적 도전 가능'
      : '지방 광역시도 경쟁 낮은 단지 우선 검토 권장',
  };
}
```

### 7-6. 전략 메시지 생성

```js
function getStrategyMessages(input, result) {
  const msgs = [];
  const { totalScore, homelessScore, dependentsScore, subscriptionScore } = result;

  if (homelessScore < 20) {
    msgs.push('무주택기간을 늘릴수록 가점이 올라갑니다. 주택 보유 이력 없이 기간을 유지하는 것이 중요합니다.');
  }
  if (dependentsScore < 20) {
    msgs.push('부양가족 요건(배우자, 직계존속·직계비속)을 꼼꼼히 확인해 인정 가능한 인원을 파악하세요.');
  }
  if (subscriptionScore < 10) {
    msgs.push('청약통장 가입기간은 시간이 쌓일수록 점수가 올라갑니다. 해지하지 말고 유지하는 것이 핵심입니다.');
  }
  if (!input.isHouseholder) {
    msgs.push('세대주 요건이 붙는 공급유형도 있으니 청약 자격 조건을 모집공고문에서 반드시 확인하세요.');
  }
  if (totalScore < 30) {
    msgs.push('현재 점수대는 경쟁이 낮은 지방 소규모 단지나 특별공급(신혼부부·생애최초) 병행 검토를 추천합니다.');
  }

  return msgs;
}
```

### 7-7. 예외 처리
- 모든 입력값은 0 이상 정수로 제한한다.
- `homelessYears` 최대 입력: 30 (슬라이더 상한, 점수 계산은 15년 이상 동일)
- `dependentsCount` 최대 입력: 6
- `subscriptionYears` 최대 입력: 20
- NaN/음수 입력 방지, 폼 입력 방어 코드 추가

---

## 8. 페이지 구조 (`src/pages/tools/apt-cheonyak-gajum-calculator.astro`)

### 8-1. 레이아웃
- `SimpleToolShell.astro` 사용

### 8-2. Hero

```astro
<CalculatorHero
  eyebrow="청약 가점 계산"
  title="아파트 청약 가점 계산기"
  description="무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 총 84점 기준 청약 가점과 지역별 참고 당첨선을 바로 확인할 수 있습니다."
/>
<InfoNotice
  text="이 계산기는 일반적인 청약 가점 구조(무주택기간 32점·부양가족수 35점·청약통장 가입기간 17점)를 기준으로 산출한 참고용 결과입니다. 실제 청약 자격, 가점 인정 여부, 당첨 가능성은 모집공고일 기준 공급유형·지역요건·세대구성에 따라 달라질 수 있습니다."
/>
```

### 8-3. 입력 패널

#### SECTION A. 무주택기간
```html
<div class="cyg-input-group">
  <label class="cyg-label">
    무주택기간
    <span class="cyg-tooltip-trigger" data-tip="모집공고일 기준 본인 및 세대원 전원이 주택을 소유하지 않은 기간">?</span>
  </label>
  <div class="cyg-slider-row">
    <input type="range" id="cyg-homeless-slider" min="0" max="30" step="1" value="5" class="cyg-slider">
    <div class="cyg-number-input-wrap">
      <input type="number" id="cyg-homeless-years" min="0" max="30" value="5">
      <span class="cyg-unit">년</span>
    </div>
  </div>
  <div class="cyg-score-preview" id="cyg-homeless-score-preview">→ 10점 / 32점</div>
</div>
```

#### SECTION B. 부양가족 수
```html
<div class="cyg-input-group">
  <label class="cyg-label">
    부양가족 수
    <span class="cyg-tooltip-trigger" data-tip="배우자, 직계존속, 직계비속 중 실제 인정 가능한 인원 (본인 제외)">?</span>
  </label>
  <div class="cyg-stepper-row">
    <button class="cyg-stepper-btn" id="cyg-dep-minus">−</button>
    <span class="cyg-stepper-value" id="cyg-dep-count">2</span>
    <span class="cyg-unit">명</span>
    <button class="cyg-stepper-btn" id="cyg-dep-plus">+</button>
  </div>
  <div class="cyg-score-preview" id="cyg-dep-score-preview">→ 15점 / 35점</div>
</div>
```

#### SECTION C. 청약통장 가입기간
```html
<div class="cyg-input-group">
  <label class="cyg-label">
    청약통장 가입기간
    <span class="cyg-tooltip-trigger" data-tip="주택청약종합저축 가입일 기준, 모집공고일까지 계속 유지한 기간">?</span>
  </label>
  <div class="cyg-number-input-wrap">
    <input type="number" id="cyg-sub-years" min="0" max="20" value="5">
    <span class="cyg-unit">년</span>
  </div>
  <div class="cyg-score-preview" id="cyg-sub-score-preview">→ 6점 / 17점</div>
</div>
```

#### SECTION D. 세대주 여부
```html
<div class="cyg-input-group">
  <label class="cyg-label">세대주 여부</label>
  <div class="cyg-toggle-row">
    <label class="cyg-toggle">
      <input type="checkbox" id="cyg-householder" checked>
      <span class="cyg-toggle-track"></span>
    </label>
    <span class="cyg-toggle-label" id="cyg-householder-label">세대주</span>
  </div>
</div>
```

#### SECTION E. 액션
```html
<div class="cyg-actions">
  <button id="cyg-reset-btn" class="button button--ghost">초기화</button>
  <button id="cyg-copy-link-btn" class="button button--ghost">공유 링크 복사</button>
</div>
```

### 8-4. 결과 영역

#### KPI 카드 5개
1. 총 가점 (큰 숫자, 84점 대비)
2. 무주택기간 점수 (X / 32점)
3. 부양가족 점수 (X / 35점)
4. 청약통장 점수 (X / 17점)
5. 점수 레벨 배지 (낮음 / 보통 / 높음 / 최상위)

```html
<div class="cyg-result-cards">
  <div class="cyg-result-card cyg-result-card--main">
    <div class="cyg-result-label">총 가점</div>
    <div class="cyg-result-value" id="cyg-total-score">0</div>
    <div class="cyg-result-sub">/ 84점 만점</div>
    <div class="cyg-score-badge" id="cyg-score-badge">보통</div>
  </div>
  <div class="cyg-result-card">
    <div class="cyg-result-label">무주택기간 점수</div>
    <div class="cyg-result-value" id="cyg-homeless-score">0</div>
    <div class="cyg-result-sub">/ 32점</div>
  </div>
  <div class="cyg-result-card">
    <div class="cyg-result-label">부양가족 점수</div>
    <div class="cyg-result-value" id="cyg-dep-score">0</div>
    <div class="cyg-result-sub">/ 35점</div>
  </div>
  <div class="cyg-result-card">
    <div class="cyg-result-label">청약통장 점수</div>
    <div class="cyg-result-value" id="cyg-sub-score">0</div>
    <div class="cyg-result-sub">/ 17점</div>
  </div>
</div>
```

#### 지역 참고선 비교
- 수평 바 차트로 내 점수와 4개 지역 참고선 범위를 시각화
- Chart.js `horizontal bar` 사용
- 범례에 "최근 주요 분양 사례 기준 참고선" 명시

```html
<div class="cyg-chart-section">
  <div class="cyg-chart-label">지역별 당첨 참고선 비교
    <span class="cyg-chart-note">최근 주요 분양 사례 기준 참고선 · 공급유형·단지별 편차 있음</span>
  </div>
  <canvas id="cyg-region-chart"></canvas>
</div>
```

#### 전략 코멘트 박스
```html
<div class="cyg-strategy-box" id="cyg-strategy-box">
  <div class="cyg-strategy-title">내 점수 기반 전략 체크</div>
  <ul class="cyg-strategy-list" id="cyg-strategy-list">
    <!-- JS로 동적 삽입 -->
  </ul>
</div>
```

#### 부양가족 인정 기준 아코디언

```html
<details class="cyg-accordion">
  <summary class="cyg-accordion-summary">부양가족 인정 기준 확인하기</summary>
  <div class="cyg-accordion-body">
    <p><strong>인정 대표 사례</strong></p>
    <ul>
      <li>배우자 (세대주·세대원 모두 가능)</li>
      <li>직계존속 (부모·조부모 등) — 동일 주민등록 3년 이상 요건 확인 필요</li>
      <li>직계비속 (자녀 등) — 미혼인 경우 인정</li>
    </ul>
    <p><strong>주의 사항</strong></p>
    <ul>
      <li>동일 세대 구성·주민등록 여부 필수 확인</li>
      <li>배우자 보유 이력 있을 경우 세대원 전원 무주택 요건에 영향 가능</li>
      <li>2025년 개정 이후 건강보험 요양급여 내역 제출 등 증빙이 강화됨</li>
      <li>공급유형별 세부 기준 차이 존재 — 반드시 모집공고문 기준 확인</li>
    </ul>
  </div>
</details>
```

#### 하단 구성
- FAQ accordion 4개
- 관련 계산기 CTA 3개
  - `전월세 전환율 계산기` → `/tools/jeonwolse-conversion/`
  - `서울 전월세 비율 리포트` → `/reports/seoul-apartment-jeonse-report/`
  - `주택 구입 자금 계산기` → `/tools/home-purchase-fund/`

---

## 9. 클라이언트 스크립트 (`public/scripts/apt-cheonyak-gajum-calculator.js`)

### 9-1. 상태 객체

```js
const state = {
  homelessYears: 5,
  dependentsCount: 2,
  subscriptionYears: 5,
  isHouseholder: true,
};
```

### 9-2. 주요 함수 목록
- `readForm()` — 폼 입력값 state 동기화
- `calcHomelessScore(years)` — 무주택기간 점수 계산
- `calcDependentsScore(count)` — 부양가족 점수 계산
- `calcSubscriptionScore(years)` — 통장 가입기간 점수 계산
- `calcTotal(state)` — 총점 + 레벨 반환
- `getRegionLevel(totalScore)` — 지역 참고선 텍스트 반환
- `getStrategyMessages(state, result)` — 전략 메시지 생성
- `updateResultCards(result)` — KPI 카드 갱신
- `updateScorePreviews(result)` — 입력 아래 실시간 점수 미리보기 갱신
- `updateChart(result)` — 지역 참고선 차트 갱신
- `updateStrategyBox(messages)` — 전략 박스 갱신
- `updateScoreBadge(level)` — 점수 레벨 배지 갱신
- `syncUrlParams()` — URL 파라미터 동기화
- `restoreFromUrl()` — URL 파라미터 복원
- `copyShareLink()` — 공유 링크 복사
- `initFaq()` — FAQ 아코디언 초기화

### 9-3. URL 파라미터

| param | 의미 |
|---|---|
| `hy` | 무주택기간 (년) |
| `dc` | 부양가족 수 |
| `sy` | 청약통장 가입기간 (년) |
| `hh` | 세대주 여부 (1/0) |

### 9-4. 인터랙션 규칙
- 입력 변경 시 즉시 재계산 (`input` 이벤트)
- 슬라이더와 숫자 입력 동기화 (양방향)
- 부양가족 스테퍼: 최솟값 0, 최댓값 6 고정
- 점수 미리보기(`cyg-score-preview`)는 입력 영역 아래 즉시 갱신
- 결과 카드 초기 렌더링은 기본값으로 계산된 상태로 시작
- 공유 링크 복사 후 토스트 피드백 표시

### 9-5. 차트 구성 (Chart.js)

```js
// 수평 막대 차트: 내 점수 + 지역 참고선 범위
const chartConfig = {
  type: 'bar',
  options: {
    indexAxis: 'y',
    scales: {
      x: { min: 0, max: 84 },
    },
  },
  data: {
    labels: ['내 점수', '서울 인기', '서울 일반', '수도권', '지방 광역시'],
    datasets: [
      {
        label: '점수',
        data: [/* totalScore, range bars */],
        backgroundColor: ['#1a56db', ...],
      },
    ],
  },
};
```

---

## 10. 스타일 가이드 (`_apt-cheonyak-gajum-calculator.scss`)

### 10-1. CSS prefix
- `cyg-` 사용 (Cheonyak Gajum)

### 10-2. 시각 톤
- 총점 카드: 블루 계열 (`#1a56db`)
- 점수 레벨 배지
  - `top`: 그린 (`#057a55`)
  - `high`: 블루 (`#1a56db`)
  - `mid`: 오렌지 (`#d97706`)
  - `low`: 그레이 (`#6b7280`)
- 차트에서 내 점수: 블루, 참고선 범위: 연한 그레이

### 10-3. 주요 컴포넌트
- `cyg-input-group`
- `cyg-slider-row`
- `cyg-slider`
- `cyg-stepper-row` / `cyg-stepper-btn` / `cyg-stepper-value`
- `cyg-score-preview`
- `cyg-result-cards`
- `cyg-result-card` / `cyg-result-card--main`
- `cyg-score-badge`
- `cyg-chart-section`
- `cyg-strategy-box` / `cyg-strategy-list`
- `cyg-accordion` / `cyg-accordion-summary` / `cyg-accordion-body`

### 10-4. 반응형 규칙
- 640px 이상: KPI 카드 2×2 + 총점 카드 1개 (전체 5개)
- 375px~639px: KPI 카드 1열 스택
- 차트는 최소 높이 200px 보장
- 입력 그룹은 모바일 1열

---

## 11. 사이트 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "apt-cheonyak-gajum-calculator",
  title: "아파트 청약 가점 계산기",
  description: "무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 총 84점 기준 청약 가점과 서울·수도권·지방 참고 당첨선을 바로 확인합니다.",
  order: 26,
  eyebrow: "청약 가점 계산",
  category: "calculator",
  iframeReady: false,
  badges: ["청약", "가점", "부동산", "무주택"],
  previewStats: [
    { label: "만점", value: "84점", context: "무주택 32 + 부양가족 35 + 통장 17" },
    { label: "비교", value: "지역 참고선", context: "서울·수도권·지방" },
  ],
},
```

### 추가 반영 위치
- `src/pages/index.astro`
  - `topicBySlug`에 `"apt-cheonyak-gajum-calculator": "부동산"` 추가
- `src/styles/app.scss`
  - `@use 'scss/pages/apt-cheonyak-gajum-calculator';`
- `public/sitemap.xml`
  - `/tools/apt-cheonyak-gajum-calculator/` 추가

---

## 12. SEO 설계

### 12-1. 메인 키워드
- 청약 가점 계산기
- 아파트 청약 가점 계산
- 청약 점수 계산기
- 청약 당첨 가능성 계산

### 12-2. 서브 키워드
- 무주택기간 청약 점수
- 부양가족 청약 가점
- 청약통장 가입기간 점수
- 서울 청약 당첨선
- 84점 청약 가점표

### 12-3. 메타 초안

```text
title: "청약 가점 계산기 2026 | 84점 기준 내 점수 + 지역 참고선 확인 | 비교계산소"
description: "무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 청약 가점을 즉시 계산해드립니다. 항목별 점수와 서울·수도권·지방 참고 당첨선 비교까지 한 번에 확인하세요."
```

### 12-4. 권장 H 구조
- H1: 아파트 청약 가점 계산기
- H2: 청약 가점 계산 결과
- H2: 지역별 참고 당첨선 비교
- H2: 가점 올리는 실전 전략
- H2: 부양가족 인정 기준 안내
- H2: 청약 가점 FAQ

---

## 13. QA 체크리스트

### 13-1. 계산 로직
- [ ] 무주택기간 0년 → 2점, 15년 이상 → 32점 정상 계산
- [ ] 부양가족 0명 → 5점, 6명 이상 → 35점 정상 계산
- [ ] 청약통장 0년 → 1점, 15년 이상 → 17점 정상 계산
- [ ] 총점 최솟값 8점(0+0+0 아닌 5+2+1), 최댓값 84점 확인
- [ ] 지역 참고선 텍스트가 점수에 맞게 분기되는지

### 13-2. UI
- [ ] 슬라이더와 숫자 입력이 양방향 동기화되는지
- [ ] 부양가족 스테퍼 최솟값(0)/최댓값(6) 동작
- [ ] 점수 미리보기(`→ X점 / 32점`)가 즉시 갱신되는지
- [ ] 차트가 모바일에서 깨지지 않는지
- [ ] 공유 링크 복사 후 URL에서 동일 상태 복원되는지
- [ ] 초기화 버튼이 기본값으로 복원하는지

### 13-3. 콘텐츠 / 신뢰
- [ ] InfoNotice 참고용 계산기 디스클레이머 상단 노출
- [ ] 지역 참고선에 "최근 분양 사례 기준" 문구 표시
- [ ] "당첨 가능" 표현이 어디에도 없는지 확인
- [ ] 부양가족 인정 기준 아코디언에 최신 증빙 강화 내용 포함
- [ ] FAQ와 전략 메시지가 법률 자문처럼 보이지 않는지

### 13-4. 사이트 반영
- [ ] `src/data/tools.ts` 등록
- [ ] `src/pages/index.astro` `topicBySlug` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음

---

## 14. 개발 메모

- 이 계산기의 핵심 훅은 **지역 참고선 비교**다. 단순 점수 계산보다 "내 점수면 어디를 노릴 수 있는가"가 체류 시간을 높인다.
- 전략 메시지는 3개 이내로 제한하고, 너무 길면 오히려 가독성이 떨어진다.
- 차트 라이브러리는 이미 `chart-config.js`가 있으므로 공통 옵션을 재사용한다.
- 후속 확장 우선순위: 공급유형 분기(일반/특별공급 자가진단) → 신혼부부·생애최초 체크리스트 → 최근 분양 사례 데이터셋 업데이트.
- 청약홈 외부 링크는 `target="_blank" rel="noopener noreferrer"` 처리 필수.
