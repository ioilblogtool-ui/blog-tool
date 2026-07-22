# 청약통장 전환 손익 계산기 — 설계 문서

> 기획 원문: `docs/plan/202608/subscription-account-conversion-calculator.md`
> 작성일: 2026-07-22
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

- 구현 대상: `청약통장 전환 손익 계산기`
- slug: `subscription-account-conversion-calculator`
- URL: `/tools/subscription-account-conversion-calculator/`
- 카테고리: 부동산
- 핵심 검색 의도: "청약통장 전환 계산기", "청약예금 전환 손해", "주택청약종합저축 전환 마감", "청약통장 전환 9월 30일"
- 핵심 출력: 전환 전/후 예상 이자 차이, 청약 가능 주택 유형 변화, 마감일 D-day
- 핵심 CTA: `/tools/apt-cheonyak-gajum-calculator/`, `/reports/2026-seoul-apt-cheonyak-cutline/`

중요 톤:
- "전환하면 무조건 유리하다"고 단정하지 않는다.
- 이자 계산은 단리 근사임을 명확히 밝힌다.
- 마감일(2026-09-30) D-day를 페이지 전반에서 일관되게 강조한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    subscriptionAccountConversionCalculator.ts   ← 타입, 정책 상수, 통장 종류별 매핑표, 프리셋, FAQ
  pages/
    tools/
      subscription-account-conversion-calculator.astro

public/
  scripts/
    subscription-account-conversion-calculator.js

src/styles/scss/pages/
  _subscription-account-conversion-calculator.scss
```

추가 등록: `src/data/tools.ts`(category: `estate`), `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측 입력, 우측 전환 전/후 비교 결과.
- SCSS prefix: `sacc-`
- 상단에 **마감 D-day 배지** 고정 노출(2026-09-30 기준 클라이언트 실시간 계산).

```astro
<SimpleToolShell calculatorId="subscription-account-conversion-calculator" pageClass="sacc-page">
```

`InfoNotice` 고정 문구:

```text
청약예금·부금·저축을 주택청약종합저축으로 전환하는 제도를 기준으로 한 참고용 추정입니다.
전환 마감은 2026년 9월 30일까지이며, 실제 적용 금리는 은행별 고시금리에 따라 달라질 수 있습니다.
```

---

## 4. 데이터 모델

```ts
// src/data/subscriptionAccountConversionCalculator.ts

export type AccountType = "savings" | "deposit" | "installment"; // 청약저축 / 청약예금 / 청약부금
export type HousingPreference = "private" | "national" | "both";

export interface SaccInput {
  accountType: AccountType;
  currentBalance: number;       // 현재 예치금(잔액)
  currentRate: number;          // 현재 적용금리(%)
  yearsHeld: number;            // 가입 후 경과 기간(년)
  yearsToHold: number;          // 전환 후 예상 보유 기간(년)
  housingPreference: HousingPreference;
}

export interface SaccHousingEligibility {
  before: string;   // "민영주택만" 등
  after: string;    // "모든 주택 유형"
}

export interface SaccResult {
  interestBefore: number;
  interestAfter: number;
  interestDiff: number;
  housingEligibility: SaccHousingEligibility;
  daysUntilDeadline: number;
  isPastDeadline: boolean;
}

export interface SaccPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<SaccInput>;
}
```

---

## 5. 기준 데이터

```ts
export const SACC_POLICY_META = {
  conversionDeadline: "2026-09-30",
  newProductName: "주택청약종합저축",
  maxNewRatePercent: 3.1,
  sourceNote: "정책주간지 공감 2026-06 보도, KB의 생각·토스피드 참고",
};

// 통장 종류별 기본 참고 금리(사용자가 직접 수정 가능한 기본값)
export const SACC_DEFAULT_RATE_BY_TYPE: Record<AccountType, number> = {
  savings: 2.1,     // 청약저축
  deposit: 2.1,     // 청약예금
  installment: 2.0, // 청약부금
};

// 통장 종류별 청약 자격 변화(고정 데이터, 계산 아님)
export const SACC_HOUSING_ELIGIBILITY_MAP: Record<AccountType, SaccHousingEligibility> = {
  deposit: { before: "민영주택만", after: "모든 주택 유형" },
  installment: { before: "민영주택(전용 85㎡ 이하)만", after: "모든 주택 유형" },
  savings: { before: "국민주택만", after: "모든 주택 유형" },
};

export const SACC_ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  savings: "청약저축",
  deposit: "청약예금",
  installment: "청약부금",
};
```

---

## 6. 계산 로직

### 6-1. 이자 비교(단리 근사)

```text
전환 전 예상 이자 = currentBalance × (currentRate / 100) × yearsToHold
전환 후 예상 이자 = currentBalance × (SACC_POLICY_META.maxNewRatePercent / 100) × yearsToHold
이자 차이 = 전환 후 예상 이자 - 전환 전 예상 이자
```

### 6-2. 마감 D-day

```text
daysUntilDeadline = ceil((2026-09-30 - 오늘 날짜) / 1일)
isPastDeadline = daysUntilDeadline < 0
```

`isPastDeadline`이 true인 경우 결과 화면 상단에 "전환 마감이 지났을 수 있습니다. 최신 공지를 확인하세요"로 전환한다(발행 시점에 마감일이 연장/재공지될 가능성 대비).

### 6-3. 청약 자격 변화

계산이 아니라 `SACC_HOUSING_ELIGIBILITY_MAP[accountType]`을 그대로 조회해 표시한다.

---

## 7. 프리셋

```ts
export const SACC_PRESETS: SaccPreset[] = [
  { id: "old-deposit", label: "오래된 청약예금", summary: "청약예금 2,000만 원", input: { accountType: "deposit", currentBalance: 20000000, currentRate: 2.1, yearsHeld: 10, yearsToHold: 3 } },
  { id: "small-installment", label: "청약부금 소액 가입자", summary: "청약부금 500만 원", input: { accountType: "installment", currentBalance: 5000000, currentRate: 2.0, yearsHeld: 5, yearsToHold: 3 } },
  { id: "long-savings", label: "청약저축 장기 보유", summary: "청약저축 1,000만 원", input: { accountType: "savings", currentBalance: 10000000, currentRate: 2.1, yearsHeld: 15, yearsToHold: 3 } },
];
```

---

## 8. 페이지 IA

1. **Hero** — "청약통장 전환 손익 계산기"
2. **마감 D-day 배지** (최상단 고정)
3. **InfoNotice** — 참고용 추정 + 단리 근사 고지
4. **프리셋 버튼 3개**
5. **입력 패널** (통장 종류/예치금/현재 금리/경과 기간/보유 예정 기간)
6. **전환 전/후 비교 카드** (핵심 섹션)
7. **통장 종류별 청약 자격 변화표** (정적)
8. **자연어 결과 메시지**
9. **전환 신청 방법 안내** (은행 앱/영업점)
10. **SeoContent(FAQ 포함)**

---

## 9. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 | 보조 문구 |
|---|---|---:|---|---|
| 현재 통장 종류 | select | 청약예금 | savings/deposit/installment | 선택 시 현재 적용금리 기본값 자동 채움 |
| 현재 예치금(잔액) | number | 15,000,000 | min 0 | — |
| 현재 적용금리 | number(%) | 2.1 | 0~10 | "통장 약관의 실제 금리로 수정 가능합니다" |
| 가입 후 경과 기간 | number(년) | 8 | 0~40 | "전환해도 그대로 인정됩니다" |
| 전환 후 예상 보유 기간 | number(년) | 3 | 0~40 | — |
| 희망 주택 유형 | select | 둘 다 고려 | private/national/both | 결과의 청약 자격 카드 강조 대상 결정 |

---

## 10. 결과 UI 상세

### 10-1. 마감 D-day 배지

```text
D-45 (2026년 9월 30일까지)
```
`isPastDeadline`이면 경고 배지로 전환.

### 10-2. 전환 전/후 비교 카드

```text
┌───────────────┬───────────────┐
│   전환 전      │   전환 후      │
├───────────────┼───────────────┤
│ 금리 2.1%      │ 금리 3.1%      │
│ 예상이자 94.5만 │ 예상이자 139.5만│
│ 민영주택만      │ 모든 주택 유형   │
└───────────────┴───────────────┘
        차이: +45만 원
```

### 10-3. 통장 종류별 청약 자격 변화표 (고정)

| 통장 종류 | 전환 전 청약 가능 | 전환 후 청약 가능 |
|---|---|---|
| 청약예금 | 민영주택만 | 모든 주택 유형 |
| 청약부금 | 민영주택(전용 85㎡ 이하)만 | 모든 주택 유형 |
| 청약저축 | 국민주택만 | 모든 주택 유형 |

### 10-4. 자연어 결과 메시지

```text
청약예금 1,500만 원을 8년째 보유 중이며 현재 금리 2.1% 기준으로
3년 더 보유하면 예상 이자는 약 94만 5천 원입니다.

주택청약종합저축으로 전환하면 최대 금리 3.1% 적용 시
3년 예상 이자는 약 139만 5천 원으로, 약 45만 원 더 받을 수 있습니다.

전환해도 기존 8년의 가입기간과 납입금액은 그대로 인정되며,
전환 후에는 민영주택뿐 아니라 국민주택에도 청약할 수 있게 됩니다.

전환 마감은 2026년 9월 30일까지입니다.
```

---

## 11. JavaScript 설계

```js
// public/scripts/subscription-account-conversion-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('sacc-data').textContent);

  const state = {
    accountType: 'deposit',
    currentBalance: 15000000,
    currentRate: 2.1,
    yearsHeld: 8,
    yearsToHold: 3,
    housingPreference: 'both',
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }
  function fmtMan(n) { return Math.round(n / 10000).toLocaleString('ko-KR') + '만 원'; }

  function calcDaysUntilDeadline() {
    const today = new Date();
    const deadline = new Date(DATA.policyMeta.conversionDeadline);
    const diffMs = deadline - today;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days;
  }

  function calculate(s) {
    const interestBefore = s.currentBalance * (s.currentRate / 100) * s.yearsToHold;
    const interestAfter = s.currentBalance * (DATA.policyMeta.maxNewRatePercent / 100) * s.yearsToHold;
    const interestDiff = interestAfter - interestBefore;
    const housingEligibility = DATA.housingEligibilityMap[s.accountType];
    const daysUntilDeadline = calcDaysUntilDeadline();

    return {
      interestBefore,
      interestAfter,
      interestDiff,
      housingEligibility,
      daysUntilDeadline,
      isPastDeadline: daysUntilDeadline < 0,
    };
  }

  function renderDeadlineBadge(result) {
    const el = q('[data-sacc="deadline-badge"]');
    if (!el) return;
    if (result.isPastDeadline) {
      el.textContent = '전환 마감이 지났을 수 있습니다 — 최신 공지 확인 필요';
      el.classList.add('is-past');
    } else {
      el.textContent = `D-${result.daysUntilDeadline} (2026년 9월 30일까지)`;
      el.classList.remove('is-past');
    }
  }

  function renderCompareCards(result) {}
  function renderMessage(result, state) {}
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

  function onAccountTypeChange() {
    // 통장 종류 변경 시 현재 적용금리 기본값 자동 채움(사용자가 이미 수정했다면 덮어쓰지 않도록 dirty 플래그 고려)
    const type = q('[data-sacc="accountType"]')?.value;
    const rateInput = q('[data-sacc="currentRate"]');
    if (rateInput && !rateInput.dataset.dirty) {
      rateInput.value = DATA.defaultRateByType[type];
    }
  }

  function readInputs() {
    state.accountType = q('[data-sacc="accountType"]')?.value || 'deposit';
    state.currentBalance = num(q('[data-sacc="currentBalance"]')?.value, 15000000);
    state.currentRate = num(q('[data-sacc="currentRate"]')?.value, 2.1);
    state.yearsHeld = num(q('[data-sacc="yearsHeld"]')?.value, 8);
    state.yearsToHold = num(q('[data-sacc="yearsToHold"]')?.value, 3);
    state.housingPreference = q('[data-sacc="housingPreference"]')?.value || 'both';
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderDeadlineBadge(result);
    renderCompareCards(result);
    renderMessage(result, state);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-sacc]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    q('[data-sacc="accountType"]')?.addEventListener('change', onAccountTypeChange);
    q('[data-sacc="currentRate"]')?.addEventListener('input', (e) => { e.target.dataset.dirty = 'true'; });
    qa('[data-sacc-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.saccPreset));
    });
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터: `type / balance / rate / held / hold / pref`

---

## 12. SCSS 설계 (핵심 발췌)

```scss
.sacc-page {
  .sacc-deadline-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.82rem;
    font-weight: 800;
    background: #fef3c7;
    color: #92400e;
    margin-bottom: 12px;

    &.is-past {
      background: #fee2e2;
      color: #991b1b;
    }
  }

  .sacc-compare-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    border: 1px solid #e8ede9;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
  }

  .sacc-compare-col {
    padding: 16px;
    text-align: center;

    &--before { background: #f8faf9; }
    &--after { background: #e1f5ee; }

    h3 {
      margin: 0 0 10px;
      font-size: 0.86rem;
      color: #374151;
    }

    strong {
      display: block;
      font-size: 1.15rem;
      color: #111827;
    }
  }

  .sacc-diff-banner {
    text-align: center;
    margin-top: 14px;
    padding: 10px;
    border-radius: 10px;
    background: #0f6e56;
    color: #fff;
    font-weight: 800;
  }

  .sacc-eligibility-table-wrap {
    overflow-x: auto;
    margin-top: 24px;
  }

  .sacc-eligibility-table {
    width: 100%;
    min-width: 480px;
    border-collapse: collapse;
    font-size: 0.84rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: left;
    }

    th { background: #f8fcfa; font-weight: 800; }
  }
}
```

---

## 13. SEO 설계

```text
title: 2026 청약통장 전환 계산기 | 9월 30일 마감, 전환하면 얼마 더 받을까
description: 청약예금·청약부금·청약저축을 주택청약종합저축으로 전환할 때 이자 차이와 청약 가능 주택 유형 변화를 계산합니다. 전환 마감 2026년 9월 30일 D-day 포함.
H1: 청약통장 전환 손익 계산기
```

키워드: 청약통장 전환 계산기, 청약예금 전환 손해, 주택청약종합저축 전환 마감, 청약저축 전환 방법, 청약통장 전환 9월 30일

---

## 14. SeoContent 초안

### intro

1. 청약예금, 청약부금, 청약저축을 보유하고 있다면 2026년 9월 30일까지 주택청약종합저축으로 전환할 수 있습니다. 전환하면 기존 납입금액과 가입기간은 그대로 인정되면서 더 높은 금리(최대 연 3.1%)와 더 넓은 청약 자격을 얻을 수 있습니다.

2. 이 계산기는 현재 통장 종류와 예치금, 금리를 입력하면 전환 전후 예상 이자 차이와 청약 가능 주택 유형 변화를 함께 보여줍니다. 청약예금·부금은 민영주택만, 청약저축은 국민주택만 가능했던 자격이 전환 후에는 모든 주택 유형으로 확대됩니다.

3. 다만 이자 계산은 단리 근사이며, 과거 가입한 상품에 특별 우대금리가 걸려 있는 경우는 전환이 항상 유리하지 않을 수 있습니다. 본인 통장의 실제 약관을 함께 확인하는 것이 안전합니다.

### criteria

- 전환 마감일, 대상 통장, 금리 정보는 2026년 6월 공개된 정책·금융권 자료를 기준으로 합니다.
- 이자 비교는 단리 근사이며 실제 상품 조건은 은행 약관에 따라 다를 수 있습니다.
- 전환이 항상 유리한 것은 아니므로 본인 통장 조건을 함께 확인해야 합니다.

### FAQ

```ts
export const SACC_FAQ = [
  { question: "전환하면 기존에 넣은 돈과 기간이 사라지나요?", answer: "아닙니다. 청약예금·부금은 기존 납입금액과 가입기간이, 청약저축은 기존 납입인정금액과 납입횟수가 그대로 인정됩니다." },
  { question: "전환 마감이 언제까지인가요?", answer: "2026년 9월 30일까지입니다. 이후 연장 여부는 별도 공지를 확인해야 합니다." },
  { question: "전환하면 무조건 이득인가요?", answer: "대부분의 경우 금리와 청약 자격 모두 유리해지지만, 과거 가입한 상품에 특별 우대금리가 걸려 있는 경우는 예외일 수 있어 본인 통장의 약관을 함께 확인하는 것이 안전합니다." },
  { question: "전환은 어떻게 신청하나요?", answer: "가입한 은행의 앱 또는 영업점 창구에서 신청할 수 있습니다." },
  { question: "청약저축만 있었는데 전환하면 민영주택도 청약할 수 있나요?", answer: "네. 종합저축으로 전환하면 기존에 국민주택만 가능했던 청약저축도 민영주택까지 청약할 수 있게 됩니다." },
];
```

---

## 15. 관련 링크

- `/tools/apt-cheonyak-gajum-calculator/`
- `/reports/2026-seoul-apt-cheonyak-cutline/`
- `/tools/home-purchase-fund/`
- `/tools/income-home-affordability/`

---

## 16. QA 체크리스트

- [ ] 통장 종류 변경 시 현재 적용금리 기본값이 자동으로 채워지되, 사용자가 직접 수정한 값은 덮어쓰지 않음(`dirty` 플래그 동작 확인)
- [ ] 예치금 0원 입력 시 이자 차이 0으로 정상 표시(NaN 없음)
- [ ] 마감 D-day가 오늘 날짜 기준으로 정확히 계산됨
- [ ] 마감일 경과 시(`isPastDeadline`) 경고 배지로 전환
- [ ] 청약 자격 변화표가 선택한 통장 종류에 맞게 강조 표시됨
- [ ] 희망 주택 유형 선택이 결과 카드의 강조 대상에 반영됨(선택사항 — MVP에서는 생략 가능, 생략 시 문서에 명시)
- [ ] URL 파라미터 복원 정상 동작
- [ ] 모바일 360px에서 비교 카드가 세로로 자연스럽게 쌓임
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
