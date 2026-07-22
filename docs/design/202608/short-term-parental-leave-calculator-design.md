# 단기 육아휴직(1주·2주) 급여 계산기 — 설계 문서

> 기획 원문: `docs/plan/202608/short-term-parental-leave-calculator.md`
> 작성일: 2026-07-22
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

- 구현 대상: `단기 육아휴직 급여 계산기`
- slug: `short-term-parental-leave-calculator`
- URL: `/tools/short-term-parental-leave-calculator/`
- 카테고리: 육아·출산
- 핵심 검색 의도: "단기 육아휴직 급여 계산기", "1주 육아휴직 급여", "2주 육아휴직 월급", "육아휴직 8월 20일"
- 핵심 출력: 1주/2주 사용 시 월 실수령 추정액, 정상 근무 대비 감소액·감소율, 남은 육아휴직 기간 안내
- 핵심 CTA: `/tools/parental-leave-pay/`, `/tools/six-plus-six/`, `/tools/parental-leave-short-work-calculator/`

중요 톤:
- 시행일(2026-08-20) 이전/이후를 배지로 명확히 구분한다.
- 1주=7일, 2주=14일 단순화 가정을 결과 화면에 항상 노출한다.
- "실제 지급액은 고용센터 심사에 따라 달라질 수 있다"를 반복 고지한다.

---

## 2. 기존 프로젝트 재사용 상수 (신규 산정 금지)

이 계산기는 **새 급여율·상한액을 만들지 않는다**. 기존에 배포 중인 두 계산기의 실제 코드에서 확인한 상수를 그대로 재사용한다.

### 2-1. 일반 육아휴직급여 (`public/scripts/parental-leave-pay.js` 기준, 104번째 줄)

```js
// 기존 parental-leave-pay.js 상수 그대로 재사용
function getMonthlyLeavePay(monthNumber, monthlyWage) {
  if (monthNumber <= 3) return { pay: Math.min(monthlyWage, 2500000), cap: 2500000, ratio: "100%" };
  if (monthNumber <= 6) return { pay: Math.min(monthlyWage, 2000000), cap: 2000000, ratio: "100%" };
  return { pay: Math.min(monthlyWage * 0.8, 1600000), cap: 1600000, ratio: "80%" };
}
```

| 구간(누적 사용 개월) | 지급률 | 상한액 |
|---|---|---:|
| 1~3개월 | 100% | 250만 원 |
| 4~6개월 | 100% | 200만 원 |
| 7개월~ | 80% | 160만 원 |

### 2-2. 생후 18개월 내 특례(6+6) (`public/scripts/six-plus-six.js` 기준, 67·73번째 줄)

```js
// 기존 six-plus-six.js 상수 그대로 재사용
const SIX_PLUS_SIX_CAPS = [2500000, 2500000, 3000000, 3500000, 4000000, 4500000]; // 1~6개월차
function getSixPlusSixPay(monthNumber, monthlyWage) {
  return Math.min(monthlyWage, SIX_PLUS_SIX_CAPS[monthNumber - 1]);
}
```

| 사용 월차 | 지급률 | 상한액 |
|---|---|---:|
| 1개월차 | 100% | 250만 원 |
| 2개월차 | 100% | 250만 원 |
| 3개월차 | 100% | 300만 원 |
| 4개월차 | 100% | 350만 원 |
| 5개월차 | 100% | 400만 원 |
| 6개월차 | 100% | 450만 원 |

> 두 표는 데이터 파일에서 상수로 export하고, 실제 값 변경 시 `parental-leave-pay.js` / `six-plus-six.js`와 함께 갱신되도록 주석으로 상호 참조를 남긴다.

---

## 3. 구현 파일 구조

```text
src/
  data/
    shortTermParentalLeaveCalculator.ts   ← 타입, 재사용 상수 참조, 프리셋, FAQ
  pages/
    tools/
      short-term-parental-leave-calculator.astro

public/
  scripts/
    short-term-parental-leave-calculator.js

src/styles/scss/pages/
  _short-term-parental-leave-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts` (category: `life`, order 신규 배치는 육아휴직 계산기군 근처)
- `src/styles/app.scss` — `@use 'scss/pages/short-term-parental-leave-calculator';`
- `public/sitemap.xml`
- `src/pages/index.astro`의 홈 노출(신규 계산기이므로 `isNew` 배지 고려)

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측(aside) 입력 패널, 우측(main) 결과.
- SCSS prefix: `stpl-`
- 상단에 **시행일 배지**를 고정 노출한다.
  - 오늘 날짜 < 2026-08-20 → `시행 예정 D-N`
  - 오늘 날짜 ≥ 2026-08-20 → `시행 중`

```astro
<SimpleToolShell calculatorId="short-term-parental-leave-calculator" pageClass="stpl-page">
```

`InfoNotice` 고정 문구:

```text
2026년 8월 20일부터 시행되는 단기 육아휴직(1주·2주) 제도를 기준으로 한 참고용 추정입니다.
1주=7일, 2주=14일로 단순화했으며, 실제 지급액은 고용센터 심사와 사업장 규정에 따라 달라질 수 있습니다.
```

---

## 5. 데이터 모델

```ts
// src/data/shortTermParentalLeaveCalculator.ts

export type LeaveUnit = "1week" | "2weeks";

export interface StplInput {
  monthlyWage: number;          // 월 통상임금
  leaveUnit: LeaveUnit;         // 1주 / 2주
  isSixPlusSixEligible: boolean;// 생후 18개월 내 부모 모두 사용 특례 해당 여부
  sixPlusSixMonthNumber: number; // 특례 해당 시 몇 개월차인지 (1~6), 기본 1
  hasUsedGeneralLeaveThisYear: boolean; // 올해 일반 육아휴직(30일 이상) 사용 이력
  generalLeaveMonthNumber: number; // 사용 이력이 있다면 일반 육아휴직 몇 개월차까지 썼는지 (급여율 단계 판단용)
}

export interface StplLeaveResult {
  unit: LeaveUnit;
  daysUsed: number;              // 7 또는 14
  workDaysPay: number;           // 근무일 비례 회사 급여
  leaveAllowance: number;        // 단기 육아휴직급여(일할 환산)
  totalPay: number;              // workDaysPay + leaveAllowance
  reductionAmount: number;       // 정상 월급 - totalPay
  reductionRate: number;         // reductionAmount / 정상 월급
  reductionBadge: "minor" | "moderate" | "large";
}

export interface StplResult {
  normalMonthlyWage: number;
  oneWeek: StplLeaveResult;
  twoWeeks: StplLeaveResult;
  appliedRatio: string;          // "100%" | "80%" 등 표시용
  appliedCap: number;
  isSixPlusSixApplied: boolean;
  remainingLeaveNote: string;
}

export interface StplPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<StplInput>;
}
```

---

## 6. 기준 데이터 (2-1, 2-2 상수를 export)

```ts
export const STPL_GENERAL_LEAVE_TIERS = [
  { minMonth: 1, maxMonth: 3, ratio: 1.0, cap: 2500000 },
  { minMonth: 4, maxMonth: 6, ratio: 1.0, cap: 2000000 },
  { minMonth: 7, maxMonth: Infinity, ratio: 0.8, cap: 1600000 },
];

export const STPL_SIX_PLUS_SIX_CAPS = [2500000, 2500000, 3000000, 3500000, 4000000, 4500000];

export const STPL_POLICY_META = {
  effectiveDate: "2026-08-20",
  targetChild: "만 8세 이하 또는 초등학교 2학년 이하",
  usageLimit: "연 1회, 1주 또는 2주 단위",
  sourceNote: "고용노동부 발표 기준(2026-06-29 보도자료)",
};
```

---

## 7. 계산 로직

### 7-1. 근무일 비례 회사 급여

```text
DAYS_IN_MONTH = 30 (단순화)
근무일수 = DAYS_IN_MONTH - 사용일수(7 또는 14)
근무일 급여 = 월 통상임금 × (근무일수 / DAYS_IN_MONTH)
```

### 7-2. 단기 육아휴직급여(일할 환산)

```text
if isSixPlusSixEligible:
  월 상한 = STPL_SIX_PLUS_SIX_CAPS[sixPlusSixMonthNumber - 1]
  지급률 = 1.0
else:
  tier = STPL_GENERAL_LEAVE_TIERS에서 generalLeaveMonthNumber(이번 달 차수)로 조회
  월 상한 = tier.cap
  지급률 = tier.ratio

일 지급액 = min(월 통상임금 × 지급률, 월 상한) / 30
단기 육아휴직급여 = 일 지급액 × 사용일수(7 또는 14)
```

> `generalLeaveMonthNumber`는 "이번 단기 육아휴직이 전체 육아휴직 사용 개월 수 중 몇 개월차에 해당하는지"를 의미한다. MVP 기본값은 1개월차(신규 사용자)로 두고, `hasUsedGeneralLeaveThisYear`가 true면 입력값을 사용자가 직접 조정하게 한다.

### 7-3. 합계와 감소율

```text
월 실수령 추정 = 근무일 급여 + 단기 육아휴직급여
정상 근무 대비 감소액 = 월 통상임금 - 월 실수령 추정
감소율 = 감소액 / 월 통상임금
```

### 7-4. 결과 배지

```text
if 감소율 <= 0.10: badge = 'minor'    (정상 근무와 큰 차이 없음)
if 0.10 < 감소율 <= 0.30: badge = 'moderate' (일부 감소)
if 감소율 > 0.30: badge = 'large'     (큰 폭 감소)
```

### 7-5. 1주/2주 동시 계산

입력값은 공통으로 받되, `oneWeek`와 `twoWeeks` 두 결과를 항상 함께 계산해 비교 카드에 나란히 표시한다(사용자가 선택한 `leaveUnit`은 강조 표시용으로만 사용).

---

## 8. 프리셋

```ts
export const STPL_PRESETS: StplPreset[] = [
  {
    id: "school-break",
    label: "신학기 방학 돌봄",
    summary: "월 300만 · 1주 사용",
    input: { monthlyWage: 3000000, leaveUnit: "1week", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
  {
    id: "daycare-closure",
    label: "어린이집 휴원 대응",
    summary: "월 250만 · 2주 사용",
    input: { monthlyWage: 2500000, leaveUnit: "2weeks", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
  {
    id: "six-plus-six-case",
    label: "생후 18개월 내 맞벌이",
    summary: "월 400만 · 1주 · 6+6 특례",
    input: { monthlyWage: 4000000, leaveUnit: "1week", isSixPlusSixEligible: true, sixPlusSixMonthNumber: 1 },
  },
  {
    id: "low-income",
    label: "저소득 구간",
    summary: "월 180만 · 2주 사용",
    input: { monthlyWage: 1800000, leaveUnit: "2weeks", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
];
```

---

## 9. 페이지 IA

1. **Hero** — 제목: "단기 육아휴직 급여 계산기", 부제: "2026년 8월 20일 시행, 1주·2주 쓰면 월급이 얼마나 줄어드는지 확인하세요"
2. **시행일 배지** — D-day 카운트다운 또는 "시행 중" 상태
3. **InfoNotice** — 1주=7일/2주=14일 단순화, 참고용 추정 고지
4. **프리셋 버튼 4개**
5. **입력 패널**
   - 월 통상임금
   - 생후 18개월 내 특례(6+6) 여부 → true면 개월차 select 노출
   - 올해 일반 육아휴직 사용 이력 → true면 개월차 select 노출
6. **KPI 카드 4개**
   - 이번 달 실수령 추정액(선택한 unit 기준)
   - 정상 근무 대비 감소액
   - 감소율
   - 남은 육아휴직 기간 안내(텍스트)
7. **1주 vs 2주 비교 카드** (핵심 차별화 섹션)
8. **아이가 아플 때 쓸 수 있는 제도 비교표** (단기 육아휴직/가족돌봄휴가/연차/육아기 단축/일반 육아휴직)
9. **자연어 결과 메시지**
10. **SeoContent** (FAQ 포함)

---

## 10. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 | 보조 문구 |
|---|---|---:|---|---|
| 월 통상임금 | number | 3,000,000 | min 0 | "세전 월 통상임금을 입력하세요" |
| 사용 단위 | segmented(1주/2주) | 1주 | — | "결과 화면에는 1주·2주가 항상 함께 비교 표시됩니다" |
| 생후 18개월 내 특례(6+6) 해당 | toggle | false | — | "부모 모두 육아휴직을 사용하는 경우에만 해당합니다" |
| 특례 개월차 | select(1~6), 특례 true일 때만 노출 | 1 | 1~6 | — |
| 올해 일반 육아휴직 사용 이력 | toggle | false | — | "이미 사용한 개월 수에 따라 지급률(100%/80%)이 달라집니다" |
| 일반 육아휴직 개월차 | select(1~12), 이력 true일 때만 노출 | 1 | 1~12 | — |

---

## 11. 결과 UI 상세

### 11-1. KPI 카드

| 카드 | 레이블 | 표시값 | 스타일 |
|---|---|---|---|
| Main | 이번 달 실수령 추정액 | X만 원 | `stpl-kpi-card--main` |
| Accent | 정상 근무 대비 감소액 | -X만 원 | — |
| 일반 | 감소율 | X% | 배지 색상 연동 |
| 일반 | 남은 육아휴직 기간 | "약 N개월 남음" 텍스트 | — |

### 11-2. 1주 vs 2주 비교 카드

```text
┌─────────────┬─────────────┐
│   1주 사용   │   2주 사용   │
├─────────────┼─────────────┤
│ 실수령 XXX만 │ 실수령 XXX만 │
│ 감소 -XX만   │ 감소 -XX만   │
│ 감소율 X%    │ 감소율 X%    │
└─────────────┴─────────────┘
```
선택한 `leaveUnit` 쪽 카드에 `is-active` 클래스로 강조.

### 11-3. 제도 비교표 (정적 데이터, 계산 아님)

| 제도 | 사용 사유 | 기간 | 유급 여부 | 급여 지급 |
|---|---|---:|---|---|
| 단기 육아휴직 | 질병·방학·휴원 | 1주·2주 | 휴직 | 육아휴직급여 |
| 가족돌봄휴가 | 가족 돌봄 | 연간 한도 | 원칙상 무급 | 별도 확인 |
| 연차휴가 | 자유 | 보유 일수 | 유급 | 회사 급여 |
| 육아기 단축근무 | 지속적 육아 | 장기간 | 근로급여+지원 | 단축급여 |
| 일반 육아휴직 | 자녀 양육 | 장기간 | 휴직 | 육아휴직급여 |

### 11-4. 자연어 결과 메시지

```text
월 통상임금 300만 원 기준으로 1주(7일) 단기 육아휴직을 사용하면
이번 달 실수령액은 약 275만 원으로 추정되어,
정상 근무 대비 약 25만 원(8%) 줄어듭니다.

2주(14일)를 사용하면 이번 달 실수령액은 약 250만 원으로 추정되어
정상 근무 대비 약 50만 원(17%) 줄어듭니다.

단기 육아휴직 사용분은 전체 육아휴직 가능 기간에서 차감되니
남은 기간을 확인하고 계획해주세요.
```

---

## 12. JavaScript 설계

```js
// public/scripts/short-term-parental-leave-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('stpl-data').textContent);
  const DAYS_IN_MONTH = 30;

  const state = {
    monthlyWage: 3000000,
    leaveUnit: '1week',
    isSixPlusSixEligible: false,
    sixPlusSixMonthNumber: 1,
    hasUsedGeneralLeaveThisYear: false,
    generalLeaveMonthNumber: 1,
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }
  function fmtWon(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
  function fmtMan(n) { return Math.round(n / 10000).toLocaleString('ko-KR') + '만 원'; }
  function fmtPct(n) { return Math.round(n * 100) + '%'; }

  function getGeneralTier(monthNumber) {
    return DATA.generalTiers.find(t => monthNumber >= t.minMonth && monthNumber <= t.maxMonth)
      || DATA.generalTiers[DATA.generalTiers.length - 1];
  }

  function getDailyAllowance(s) {
    let ratio, cap;
    if (s.isSixPlusSixEligible) {
      ratio = 1.0;
      cap = DATA.sixPlusSixCaps[s.sixPlusSixMonthNumber - 1];
    } else {
      const tier = getGeneralTier(s.generalLeaveMonthNumber);
      ratio = tier.ratio;
      cap = tier.cap;
    }
    const monthlyAllowance = Math.min(s.monthlyWage * ratio, cap);
    return { dailyAllowance: monthlyAllowance / DAYS_IN_MONTH, ratio, cap };
  }

  function calcForUnit(s, days) {
    const workDays = DAYS_IN_MONTH - days;
    const workDaysPay = s.monthlyWage * (workDays / DAYS_IN_MONTH);
    const { dailyAllowance } = getDailyAllowance(s);
    const leaveAllowance = dailyAllowance * days;
    const totalPay = workDaysPay + leaveAllowance;
    const reductionAmount = s.monthlyWage - totalPay;
    const reductionRate = reductionAmount / s.monthlyWage;

    let reductionBadge = 'minor';
    if (reductionRate > 0.30) reductionBadge = 'large';
    else if (reductionRate > 0.10) reductionBadge = 'moderate';

    return {
      daysUsed: days,
      workDaysPay,
      leaveAllowance,
      totalPay,
      reductionAmount,
      reductionRate,
      reductionBadge,
    };
  }

  function calculate(s) {
    const oneWeek = calcForUnit(s, 7);
    const twoWeeks = calcForUnit(s, 14);
    const { ratio, cap } = getDailyAllowance(s);

    return {
      normalMonthlyWage: s.monthlyWage,
      oneWeek,
      twoWeeks,
      appliedRatio: fmtPct(ratio),
      appliedCap: cap,
      isSixPlusSixApplied: s.isSixPlusSixEligible,
      remainingLeaveNote: s.hasUsedGeneralLeaveThisYear
        ? '이미 육아휴직을 사용한 이력이 있어, 단기 사용분만큼 남은 기간이 줄어듭니다.'
        : '단기 육아휴직 사용분은 전체 육아휴직 가능 기간(최대 1년~1년 6개월)에서 차감됩니다.',
    };
  }

  function renderKpis(result, unit) {}
  function renderCompareCards(result, activeUnit) {}
  function renderMessage(result, state) {}
  function renderEffectiveDateBadge() {
    const today = new Date();
    const effective = new Date(DATA.policyMeta.effectiveDate);
    const badgeEl = q('[data-stpl="effective-badge"]');
    if (!badgeEl) return;
    if (today < effective) {
      const diffDays = Math.ceil((effective - today) / (1000 * 60 * 60 * 24));
      badgeEl.textContent = `시행 예정 D-${diffDays}`;
      badgeEl.classList.add('is-upcoming');
    } else {
      badgeEl.textContent = '시행 중';
      badgeEl.classList.add('is-active');
    }
  }
  function syncUrl(state) {}
  function restoreFromUrl() {}
  function applyPreset(id) {
    const preset = DATA.presets.find(p => p.id === id);
    if (!preset) return;
    Object.assign(state, preset.input);
    reflectStateToInputs();
    update();
  }
  function reflectStateToInputs() {}

  function readInputs() {
    state.monthlyWage = num(q('[data-stpl="monthlyWage"]')?.value, 3000000);
    state.leaveUnit = q('[data-stpl="leaveUnit"]:checked')?.value || '1week';
    state.isSixPlusSixEligible = q('[data-stpl="isSixPlusSixEligible"]')?.checked ?? false;
    state.sixPlusSixMonthNumber = num(q('[data-stpl="sixPlusSixMonthNumber"]')?.value, 1);
    state.hasUsedGeneralLeaveThisYear = q('[data-stpl="hasUsedGeneralLeaveThisYear"]')?.checked ?? false;
    state.generalLeaveMonthNumber = num(q('[data-stpl="generalLeaveMonthNumber"]')?.value, 1);
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderKpis(result, state.leaveUnit);
    renderCompareCards(result, state.leaveUnit);
    renderMessage(result, state);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-stpl]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    qa('[data-stpl-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.stplPreset));
    });
  }

  restoreFromUrl();
  renderEffectiveDateBadge();
  bindEvents();
  update();
})();
```

URL 파라미터: `wage / unit / six / sixMonth / used / usedMonth`

---

## 13. SCSS 설계 (핵심 발췌)

```scss
.stpl-page {
  .stpl-effective-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.8rem;
    font-weight: 800;
    margin-bottom: 12px;

    &.is-upcoming {
      background: #fef3c7;
      color: #92400e;
    }

    &.is-active {
      background: #dcfce7;
      color: #166534;
    }
  }

  .stpl-compare-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;
  }

  .stpl-compare-card {
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;
    background: #fff;
    text-align: center;

    &.is-active {
      border-color: #0f6e56;
      background: #f5fbf8;
    }

    h3 {
      margin: 0 0 10px;
      font-size: 0.9rem;
      color: #374151;
    }

    strong {
      display: block;
      font-size: 1.2rem;
      color: #111827;
    }

    .stpl-compare-reduction {
      margin-top: 6px;
      font-size: 0.82rem;
      color: #b91c1c;
    }
  }

  .stpl-comparison-table-wrap {
    overflow-x: auto;
    margin-top: 20px;
  }

  .stpl-comparison-table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    font-size: 0.84rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: left;
    }

    th {
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }
  }
}
```

---

## 14. SEO 설계

```text
title: 2026 단기 육아휴직 급여 계산기 | 1주·2주 쓰면 월급 얼마 줄어들까
description: 2026년 8월 20일 시행되는 1주·2주 단기 육아휴직 급여를 월 통상임금 기준으로 계산합니다. 정상 근무 대비 감소액과 남은 육아휴직 기간까지 한 번에 확인하세요.
H1: 단기 육아휴직 급여 계산기
```

키워드: 단기 육아휴직 급여 계산기, 1주 육아휴직 급여, 2주 육아휴직 월급, 육아휴직 8월 20일, 방학 육아휴직

---

## 15. SeoContent 초안

### intro

1. 2026년 8월 20일부터 만 8세 이하(초등학교 2학년 이하) 자녀를 둔 근로자는 방학, 휴원·휴교, 자녀 질병 등으로 급하게 며칠만 쉬어야 할 때 연 1회, 1주 또는 2주 단위로 육아휴직을 사용할 수 있습니다. 기존에는 30일 이상 사용해야만 육아휴직급여가 지급됐지만, 이제는 짧은 기간을 사용해도 7일·14일 단위로 환산된 급여를 받을 수 있습니다.

2. 이 계산기는 월 통상임금을 입력하면 1주 사용과 2주 사용 각각의 경우 회사에서 받는 근무일 급여와 고용보험 육아휴직급여를 합산해 이번 달 실수령액을 추정합니다. 생후 18개월 내 부모가 함께 사용하는 6+6 특례에 해당한다면 더 높은 지급률과 상한액이 적용됩니다.

3. 단기 육아휴직을 사용한 기간은 전체 육아휴직 가능 기간에서 차감됩니다. 이미 올해 일반 육아휴직을 사용한 이력이 있다면 남은 기간과 적용되는 지급률(월차에 따라 100% 또는 80%)이 달라질 수 있습니다.

### criteria

- 시행일·대상·사용 단위는 고용노동부 발표(2026-06-29 보도자료) 기준입니다.
- 급여율·상한액은 기존 육아휴직급여·6+6 특례 계산기와 동일한 기준을 재사용합니다.
- 1주=7일, 2주=14일로 단순화했으며 실제 근무일 산정은 사업장마다 다를 수 있습니다.

### FAQ

```ts
export const STPL_FAQ = [
  { question: "단기 육아휴직도 급여가 나오나요?", answer: "네. 기존에는 30일 이상 사용해야 급여가 지급됐지만, 2026년 8월 20일부터는 1주·2주 단기 사용에도 7일·14일 단위로 환산해 육아휴직급여가 지급됩니다." },
  { question: "1년에 몇 번 쓸 수 있나요?", answer: "연 1회, 1주 또는 2주 단위로 사용할 수 있습니다." },
  { question: "아무 때나 쓸 수 있나요?", answer: "방학, 휴원·휴교, 자녀 질병 등 단기 돌봄이 필요한 경우에 사용할 수 있습니다." },
  { question: "단기로 쓰면 원래 육아휴직 기간이 줄어드나요?", answer: "네. 단기 육아휴직 사용 기간은 전체 육아휴직 가능 기간에서 차감됩니다." },
  { question: "이미 일반 육아휴직을 다 썼으면 단기 육아휴직도 못 쓰나요?", answer: "전체 육아휴직 기간을 모두 소진했다면 단기 육아휴직도 추가로 사용하기 어렵습니다. 남은 기간 안에서만 사용할 수 있습니다." },
];
```

---

## 16. 관련 링크

- `/tools/parental-leave-pay/` — 일반 육아휴직 급여 계산
- `/tools/six-plus-six/` — 6+6 특례 계산
- `/tools/parental-leave-short-work-calculator/` — 단축근무 비교
- `/tools/single-parental-leave-total/` — 한 명만 사용하는 케이스

---

## 17. QA 체크리스트

- [ ] `parental-leave-pay.js`, `six-plus-six.js`의 상수와 이 계산기의 상수가 동일한지 재대조
- [ ] 6+6 특례 토글 on/off 시 개월차 select 노출/숨김 정상 동작
- [ ] 일반 육아휴직 이력 토글 on/off 시 개월차 select 노출/숨김 정상 동작
- [ ] 1주/2주 비교 카드가 항상 동시에 계산·표시됨
- [ ] 선택한 leaveUnit에 따라 KPI 카드 값이 올바르게 전환됨
- [ ] 시행일 배지가 오늘 날짜 기준으로 D-day/시행 중을 올바르게 표시
- [ ] 월 통상임금 0원 입력 시 NaN 미노출
- [ ] 감소율 배지(minor/moderate/large) 색상과 텍스트 일치
- [ ] 제도 비교표 모바일에서 가로 스크롤 정상
- [ ] URL 파라미터 복원 정상 동작
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
