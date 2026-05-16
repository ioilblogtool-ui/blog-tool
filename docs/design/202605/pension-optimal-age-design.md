# 연금 수령 최적 나이 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/pension-optimal-age.md`
> 작성일: 2026-05-11
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 출생연도별 정상 수급개시연령 반영, 수령 나이별 누적액·손익분기 나이 비교, 물가상승률 반영 실질가치 계산

---

## 1. 문서 개요

- 구현 대상: `연금 수령 최적 나이 계산기`
- slug: `pension-optimal-age`
- URL: `/tools/pension-optimal-age/`
- 카테고리: 투자/연금/노후
- 핵심 검색 의도: "연금 언제 받는게 유리 계산", "국민연금 조기수령 계산기", "연기수령 손익분기점"
- 핵심 출력: 추천 수령 시작 나이, 수령 나이별 월수령액·누적 수령액, 손익분기 나이, 물가 반영 실질가치

---

## 2. 구현 파일 구조

```text
src/
  data/
    pensionOptimalAge.ts          ← 타입 정의, 지급률 상수, FAQ, 관련 링크
  pages/
    tools/
      pension-optimal-age.astro

public/
  scripts/
    pension-optimal-age.js

src/styles/scss/pages/
  _pension-optimal-age.scss
```

추가 등록:
- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. `resultFirst={false}` — 입력 먼저, 결과 후.
- SCSS prefix: `poa-`

```astro
<SimpleToolShell
  calculatorId="pension-optimal-age"
  pageClass="op-page poa-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
export type PensionInput = {
  currentAge: number;                    // 현재 나이
  birthYear: number;                     // 출생연도 (정상 수급개시연령 자동 판정)
  normalMonthlyPension: number;          // 예상 국민연금 월수령액 (정상수령 기준, 원)
  privateMonthlyPension: number;         // 예상 개인연금 월수령액 (원, 0 가능)
  retirementMonthlyPension: number;      // 예상 퇴직연금 월수령액 (원, 0 가능)
  healthLifeAge: number;                 // 건강수명 예상 나이
  expectedLifeAge: number;              // 기대수명 (장수 시나리오)
  inflationRate: number;                 // 물가상승률 (%, 0~5)
};

export type PensionScenario = {
  startAge: number;                      // 수령 시작 나이
  type: "early" | "normal" | "delayed";
  nationalPensionRate: number;           // 지급률 (0.70~1.36)
  nationalMonthlyAmount: number;         // 국민연금 월수령액 (원)
  totalMonthlyAmount: number;            // 국민연금 + 개인 + 퇴직 합산 월수령액
  nominalToHealthLife: number;           // 건강수명까지 명목 누적액
  nominalToExpectedLife: number;         // 기대수명까지 명목 누적액
  presentValueToHealthLife: number;      // 건강수명까지 현재가치 할인 누적액
  presentValueToExpectedLife: number;    // 기대수명까지 현재가치 할인 누적액
};

export type PensionRecommendation = {
  recommendedAge: number;
  type: "조기수령 우세" | "정상수령 우세" | "연기수령 우세";
  message: string;
  breakEvenAge: number | null;           // 손익분기 나이
};
```

---

## 5. 계산 로직 (기획 원문 계산 함수 기반)

### 5-1. 정상 수급개시연령 판정

```ts
function getNormalPensionAge(birthYear: number): number {
  if (birthYear >= 1969) return 65;
  if (birthYear >= 1965) return 64;
  if (birthYear >= 1961) return 63;
  if (birthYear >= 1957) return 62;
  if (birthYear >= 1953) return 61;
  return 60;
}
```

### 5-2. 국민연금 지급률

```ts
function getNationalPensionRate(startAge: number, normalAge: number): number {
  const diff = startAge - normalAge;
  // 조기수령: 1년당 6% 감액, 최대 5년(30% 감액)
  if (diff < 0) return Math.max(0.70, 1 + diff * 0.06);
  // 연기수령: 1년당 7.2% 증액, 최대 5년(36%)
  if (diff > 0) return 1 + Math.min(diff, 5) * 0.072;
  return 1.0;
}
```

### 5-3. 누적액 계산 (명목 단순)

```ts
function nominalCumulative(monthlyAmount: number, startAge: number, endAge: number): number {
  return Math.max(0, endAge - startAge) * 12 * monthlyAmount;
}
```

### 5-4. 현재가치 할인 누적액

```ts
function presentValueCumulative(
  monthlyAmount: number,
  startAge: number,
  endAge: number,
  currentAge: number,
  inflationRate: number
): number {
  let total = 0;
  for (let age = startAge; age < endAge; age++) {
    const yearsFromNow = age - currentAge;
    const annualAmount = monthlyAmount * 12;
    const discountFactor = Math.pow(1 + inflationRate / 100, yearsFromNow);
    total += annualAmount / discountFactor;
  }
  return total;
}
```

### 5-5. 손익분기 나이

```ts
function findBreakEvenAge(
  earlierStartAge: number,
  earlierMonthly: number,
  laterStartAge: number,
  laterMonthly: number,
  maxAge: number = 100
): number | null {
  for (let age = laterStartAge; age <= maxAge; age++) {
    const earlierTotal = Math.max(0, age - earlierStartAge) * 12 * earlierMonthly;
    const laterTotal = Math.max(0, age - laterStartAge) * 12 * laterMonthly;
    if (laterTotal >= earlierTotal) return age;
  }
  return null;
}
```

### 5-6. 추천 로직

건강수명까지 명목 누적액이 가장 큰 시나리오를 추천. 동점 시 기대수명 기준 누적액 비교.

---

## 6. 시뮬레이션 수령 나이 목록

```ts
export const SCENARIO_START_AGES = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
// 출생연도에 따라 정상 수급개시연령 이하 나이 범위 자동 조정
```

---

## 7. 페이지 IA

1. **Hero** — H1: "연금 수령 최적 나이 계산기", 부제: "60세·65세·70세 수령 시 누적 수령액과 손익분기 나이를 비교합니다"
2. **InfoNotice** — "이 계산기는 단순 가정 기반 참고용 도구입니다. 실제 신청 가능 여부·수령액은 국민연금공단 확인 필요"
3. **DesignTrustPanel**
4. **입력 패널** — 현재 나이, 출생연도, 국민연금 월수령액, 개인연금, 퇴직연금, 건강수명, 기대수명, 물가상승률
5. **결과 KPI 카드 (5개)**
6. **수령 나이별 월수령액 비교 표** (60~70세)
7. **누적 수령액 비교 표** — 건강수명/기대수명 기준
8. **손익분기 나이 표시** — 조기 vs 정상, 정상 vs 연기
9. **물가 반영 실질가치 비교**
10. **연금 수령 판단 기준 가이드 카드 (3개)**
11. **CTA** — 연금 수령 나이별 비교 리포트 / 노후자금 고갈 계산기
12. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| 현재 나이 | number | 55 | 계산 기준 나이 |
| 출생연도 | number | 1970 | 정상 수급개시연령 자동 판정 |
| 국민연금 월수령액 (원) | number | 1,200,000 | 정상수령 기준 예상액 |
| 개인연금 월수령액 (원) | number | 500,000 | 0 입력 가능 |
| 퇴직연금 월수령액 (원) | number | 700,000 | 0 입력 가능 |
| 건강수명 예상 나이 | number | 82 | 주된 비교 기준 종점 |
| 기대수명 (장수 시나리오) | number | 90 | 장수 시나리오 비교 |
| 물가상승률 (%) | number | 2.0 | 실질가치 할인에 사용 |

보조 문구:
- 국민연금 월수령액 아래: "내연금.kr에서 '예상연금조회'로 확인 후 입력하세요. 정상수령 나이 기준 금액을 입력해야 합니다"
- 물가상승률 아래: "실질가치 비교에만 사용되며 명목 누적액과 함께 표시됩니다"

---

## 9. 결과 UI 상세

KPI 카드 (5개):

| 카드 | 레이블 | 서브 텍스트 |
|------|--------|-----------|
| 주요 (Main) | 추천 수령 시작 나이 | 건강수명 기준 누적액 최대화 |
| 일반 | 손익분기 나이 | 늦게 받는 전략이 앞서는 나이 |
| 일반 | 건강수명까지 최대 누적액 | 추천 시나리오 기준 |
| Accent | 조기수령 월수령액 vs 연기수령 | 최소 vs 최대 |
| 일반 | 물가 반영 실질 누적액 | 현재가치 기준 |

수령 나이별 비교 표 (핵심):

| 수령 시작 | 지급률 | 국민연금 월수령액 | 건강수명까지 누적 | 기대수명까지 누적 |
|---------|-------|-------------|-------------|-------------|
| 60세 | 70% | 84만 원 | ... | ... |
| 65세 | 100% | 120만 원 | ... | ... |
| 70세 | 136% | 163.2만 원 | ... | ... |

자연어 메시지:
```
입력하신 조건에서는 65세 정상수령이 가장 균형적인 선택입니다.
건강수명 82세 기준 누적 수령액이 2억 8,800만 원으로 가장 높으며,
조기수령(60세) 대비 약 3,600만 원, 연기수령(70세)보다 안정적인
소득 흐름을 만들 수 있습니다.
```

---

## 10. JavaScript 설계

```js
(() => {
  const NORMAL_AGES = { 1969: 65, 1965: 64, 1961: 63, 1957: 62, 1953: 61 };
  const EARLY_RATE_PER_YEAR = 0.06;
  const DELAYED_RATE_PER_YEAR = 0.072;
  const SCENARIO_AGES = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];

  let state = {
    currentAge: 55,
    birthYear: 1970,
    normalMonthly: 1200000,
    privateMonthly: 500000,
    retirementMonthly: 700000,
    healthLifeAge: 82,
    expectedLifeAge: 90,
    inflationRate: 2.0,
  };

  function getNormalAge(birthYear) {
    if (birthYear >= 1969) return 65;
    if (birthYear >= 1965) return 64;
    if (birthYear >= 1961) return 63;
    if (birthYear >= 1957) return 62;
    if (birthYear >= 1953) return 61;
    return 60;
  }

  function getRate(startAge, normalAge) {
    const diff = startAge - normalAge;
    if (diff < 0) return Math.max(0.70, 1 + diff * EARLY_RATE_PER_YEAR);
    if (diff > 0) return 1 + Math.min(diff, 5) * DELAYED_RATE_PER_YEAR;
    return 1.0;
  }

  function calcNominal(monthly, start, end) {
    return Math.max(0, end - start) * 12 * monthly;
  }

  function calcPV(monthly, start, end, currentAge, rate) {
    let total = 0;
    for (let age = start; age < end; age++) {
      total += (monthly * 12) / Math.pow(1 + rate / 100, age - currentAge);
    }
    return total;
  }

  function findBreakEven(aStart, aMonthly, bStart, bMonthly) {
    for (let age = bStart; age <= 100; age++) {
      if (calcNominal(bMonthly, bStart, age) >= calcNominal(aMonthly, aStart, age)) return age;
    }
    return null;
  }

  function calculate(s) {
    const normalAge = getNormalAge(s.birthYear);
    const validAges = SCENARIO_AGES.filter(a => a >= normalAge - 5 && a <= normalAge + 5);
    return validAges.map(startAge => {
      const rate = getRate(startAge, normalAge);
      const national = s.normalMonthly * rate;
      const total = national + s.privateMonthly + s.retirementMonthly;
      return {
        startAge,
        type: startAge < normalAge ? "early" : startAge > normalAge ? "delayed" : "normal",
        rate,
        national,
        total,
        nominalHealth: calcNominal(total, startAge, s.healthLifeAge),
        nominalExpected: calcNominal(total, startAge, s.expectedLifeAge),
        pvHealth: calcPV(total, startAge, s.healthLifeAge, s.currentAge, s.inflationRate),
        pvExpected: calcPV(total, startAge, s.expectedLifeAge, s.currentAge, s.inflationRate),
      };
    });
  }

  function recommend(scenarios) {
    const best = [...scenarios].sort((a, b) => b.nominalHealth - a.nominalHealth)[0];
    const normal = scenarios.find(s => s.type === "normal");
    const early = scenarios.find(s => s.startAge === scenarios[0].startAge);
    const breakEven = early && normal ? findBreakEven(early.startAge, early.total, normal.startAge, normal.total) : null;
    return { best, breakEven };
  }

  function renderResults(scenarios, rec) { /* KPI 카드, 비교 표, 메시지 갱신 */ }
  function readInputs() {}
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {}

  restoreFromUrl();
  bindEvents();
  const scenarios = calculate(state);
  renderResults(scenarios, recommend(scenarios));
})();
```

URL 파라미터: `age` / `birth` / `national` / `private` / `retire` / `health` / `expect` / `inflation`

---

## 11. SCSS 설계

```scss
.poa-page {
  .poa-result-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  }

  .poa-scenario-table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    th, td { padding: 9px 12px; border-bottom: 1px solid #e8ede9; text-align: right; font-size: 0.88rem; }
    th:first-child, td:first-child { text-align: left; }
    tr.is-recommended { background: #f0faf6; font-weight: 700; }
    tr.is-early td.poa-rate { color: #b91c1c; }
    tr.is-delayed td.poa-rate { color: #0f6e56; }
  }

  .poa-breakeven-badge {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .poa-guide-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    @media (min-width: 760px) { grid-template-columns: repeat(3, 1fr); }
  }
}
```

---

## 12. SEO 설계

```text
title: 연금 수령 최적 나이 계산기 — 조기수령 vs 연기수령 손익분기점 비교
description: 국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리한지 계산합니다. 60세·62세·65세·70세 수령 시 누적 수령액, 월수령액, 손익분기 나이, 물가 반영 실질가치를 비교합니다.
H1: 연금 수령 최적 나이 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 연금 수령 나이 계산, 연금 언제 받는게 유리, 국민연금 조기수령 계산기, 연기수령 손익분기점

---

## 13. SeoContent 초안

### introTitle
`연금 수령 최적 나이 계산기 — 빨리 받을까 늦게 받을까를 숫자로 비교합니다`

### intro (5문단)

1. 국민연금은 언제 받기 시작하느냐에 따라 월 수령액이 달라지고, 그 차이는 평생 유지됩니다. 1969년생 이후 기준으로 정상 수급개시연령은 65세이며, 최대 5년 앞당겨 60세에 받으면 30% 감액(지급률 70%), 반대로 5년 늦춰 70세에 받으면 36% 증액(지급률 136%)됩니다. 이 계산기는 본인의 출생연도, 예상 연금액, 건강수명, 기대수명을 입력해 수령 나이별 누적 수령액과 손익분기 나이를 자동으로 비교해 드립니다.

2. 핵심 판단 기준은 "몇 살까지 살 것으로 예상하는가"입니다. 조기수령은 60세부터 연금을 받아 초기 누적액이 많지만, 일정 나이가 지나면 정상수령 누적액이 역전됩니다. 이 역전되는 나이가 손익분기점이며, 건강수명을 어떻게 예상하느냐에 따라 최적 수령 나이가 달라집니다. 계산기 하단의 손익분기 나이 표에서 두 전략이 교차하는 나이를 확인할 수 있습니다.

3. 국민연금만 입력하는 것이 아니라 개인연금과 퇴직연금 월수령액도 함께 입력하면, 3층 연금 구조를 합산한 실제 노후 현금흐름을 비교할 수 있습니다. 예를 들어 국민연금 120만 원, 개인연금 50만 원, 퇴직연금 70만 원을 합산하면 총 월 240만 원의 연금 수입이 발생하는 구조를 시나리오별로 계산합니다.

4. 물가상승률을 반영하면 같은 금액이라도 미래 시점의 실질 구매력이 달라집니다. 물가상승률 2%를 적용하면 20년 후 100만 원의 현재가치는 약 67만 원 수준입니다. 계산기는 명목 누적액과 함께 현재가치 할인 누적액을 동시에 보여주어, "명목 금액은 많지만 실질가치는 낮은 연기수령"의 함정을 확인할 수 있습니다.

5. 이 계산기는 단순화된 계산 모델로 참고 목적으로만 활용하세요. 실제 국민연금 수령액, 조기·연기 신청 가능 여부, 세금, 건강보험료 영향은 국민연금공단(1355) 또는 내연금.kr에서 개인 가입 이력을 기반으로 확인해야 합니다.

### FAQ (8개)

```ts
export const POA_FAQ = [
  {
    question: "국민연금 예상 수령액은 어디서 확인하나요?",
    answer: "국민연금공단 내연금.kr 사이트 또는 앱에서 '예상연금조회' 서비스를 이용하면 지금까지 납부한 보험료를 기반으로 정상수령 나이의 예상 수령액을 확인할 수 있습니다. 로그인 후 '내 연금 알아보기' 메뉴에서 확인 가능합니다.",
  },
  {
    question: "출생연도에 따라 정상 수급개시연령이 다른 이유는 무엇인가요?",
    answer: "국민연금법 개정으로 수급개시연령이 점진적으로 늦춰지고 있습니다. 1953~1956년생은 61세, 이후 3년 단위로 1세씩 높아져 1969년생 이후부터 65세가 정상 수급개시연령입니다. 이 계산기는 출생연도를 입력하면 자동으로 정상 수급개시연령을 계산해 적용합니다.",
  },
  {
    question: "조기수령 신청 요건은 무엇인가요?",
    answer: "가입기간 10년 이상이고 출생연도별 조기노령연금 지급개시연령 이상인 사람이, 소득 있는 업무에 종사하지 않는 경우 신청할 수 있습니다. 소득 있는 업무 기준은 A값(전체 가입자 평균 소득)을 초과하는 소득이 있는 경우를 의미합니다. 정확한 신청 가능 여부는 국민연금공단에 문의하세요.",
  },
  {
    question: "손익분기 나이는 어떻게 계산하나요?",
    answer: "빨리 받는 전략(예: 60세 조기수령)의 누적 수령액과 늦게 받는 전략(예: 65세 정상수령)의 누적 수령액이 같아지는 나이입니다. 이 계산기는 매 나이마다 두 전략의 누적액을 비교해 처음 역전되는 나이를 손익분기점으로 표시합니다. 이 나이까지 생존하면 늦게 받는 전략이 유리해집니다.",
  },
  {
    question: "개인연금과 퇴직연금은 수령 시기를 따로 설정할 수 있나요?",
    answer: "이 계산기는 국민연금, 개인연금, 퇴직연금이 모두 동일한 시작 나이에 수령을 시작하는 것으로 가정합니다. 실제로는 개인연금(55세 이후)과 퇴직연금(은퇴 시점)이 국민연금보다 먼저 수령을 시작할 수 있습니다. 더 정밀한 시뮬레이션이 필요하다면 각 상품별로 별도 계산 후 합산하는 방법을 권장합니다.",
  },
  {
    question: "연기수령은 전체 금액만 연기할 수 있나요?",
    answer: "아닙니다. 국민연금액의 50~90% 범위에서 원하는 비율을 선택해 일부만 연기할 수 있습니다. 나머지 금액은 정상 수급개시연령부터 받고, 연기한 비율에 대해서만 연 7.2%가 가산됩니다. 소득 공백 일부를 메우면서 연금액도 높이고 싶다면 일부 연기 전략이 유용합니다.",
  },
  {
    question: "이 계산기 결과만 보고 연금 수령 시기를 결정해도 되나요?",
    answer: "아닙니다. 이 계산기는 단순 수학 모델로 참고용 추정을 제공합니다. 실제 결정 전에 ① 국민연금공단에서 실제 예상 수령액 확인 ② 건강보험료·세금 영향 검토 ③ 배우자 연금 합산 현금흐름 확인 ④ 금융 전문가 상담을 거치는 것을 권장합니다.",
  },
  {
    question: "은퇴 후 국민연금 임의계속가입을 하면 연금액이 늘어나나요?",
    answer: "네. 60세 이후에도 임의계속가입을 통해 보험료를 계속 납부하면 연금액을 높일 수 있습니다. 다만 추가 납부 보험료 대비 늘어나는 연금액을 비교해 가입 여부를 결정해야 합니다. 가입기간이 10년 미만인 경우 수급권 확보 목적으로도 임의계속가입을 고려할 수 있습니다.",
  },
];
```

---

## 14. 관련 링크

- `/reports/pension-age-comparison-2026/` — 연금 수령 나이별 실수령액 비교 리포트
- `/reports/worker-retirement-reality-2026/` — 직장인 노후 준비 실태
- `/tools/retirement-fund-depletion/` — 노후자금 고갈 시점 계산기
- `/tools/irp-pension-calculator/` — IRP 연금 계산기
- `/tools/fire-calculator/` — FIRE 조기 은퇴 계산기

---

## 15. QA 체크리스트

- [ ] 출생연도 입력 시 정상 수급개시연령 자동 계산 정확 (1969년생 이후 → 65세)
- [ ] 조기수령 지급률 0.70~1.0 범위 정확 (5년 초과 조기 시 0.70 고정)
- [ ] 연기수령 지급률 1.0~1.36 범위 정확 (5년 초과 연기 시 1.36 고정)
- [ ] 누적액 계산: 기간이 0 이하(시작 나이 > 종점 나이)일 때 0원 처리
- [ ] 손익분기 나이: 없는 경우(장수해도 역전 안 됨) null 처리 → "비교 기간 내 역전 없음" 표시
- [ ] 물가상승률 0% 입력 시 명목·실질 누적액 동일 표시
- [ ] 건강수명 > 기대수명 입력 시 경고 또는 자동 보정
- [ ] 모바일 360px 시나리오 표 가로 스크롤 정상
- [ ] 투자·금융 조언 면책 문구 표시
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
