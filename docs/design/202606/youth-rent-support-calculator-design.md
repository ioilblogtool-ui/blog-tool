# 청년월세지원 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/youth-rent-support-calculator`
- **유형**: 계산기 (복지 자가 점검형)
- **prefix**: `yrsc-` (Youth Rent Support Calculator)
- **데이터 파일**: `src/data/youthRentSupportCalculator.ts`
- **스크립트**: `public/scripts/youth-rent-support-calculator.js`
- **스타일**: `src/styles/scss/pages/_youth-rent-support-calculator.scss`
- **레이아웃**: `SimpleToolShell` (`family-care-allowance-calculator.astro`와 동일한 IA·인터랙션 구조 복제)
- **기획 문서**: `docs/plan/202606/youth-rent-support-calculator-plan.md`

### 핵심 원칙

1. **이중 소득기준을 명확히 분리 표시한다.** 청년가구(본인, 중위소득 60%)와 원가구(부모, 중위소득 100%)를 같은 화면에서 별도 체크리스트 항목으로 보여주고, 둘 다 충족해야 종합판정이 "가능성 높음"이 된다.
2. **이중 재산기준도 동일하게 분리한다.** 청년가구 1.22억원 / 원가구 4.7억원 — 절대 하나의 기준으로 합치지 않는다.
3. **월세 지원액은 "월세와 20만원 중 작은 값"으로 정확히 계산한다.** "무조건 20만원 받는다"는 오인을 결과 화면 문구로 방지한다.
4. **지자체 자체 월세지원과의 중복수급 불가 조건을 제외요건 체크리스트에 명시적으로 포함**하고, 체크 시 종합판정을 "제외 대상"으로 강제 전환한다.
5. 이 계산기는 가족돌봄수당과 달리 **중앙정부(국토교통부) 통일 제도**이므로 "지역마다 다르다"는 식의 면책 문구를 반복하지 않는다 — 대신 "지자체 자체 사업과 혼동하지 말 것"이라는 다른 종류의 주의를 준다.

---

## 2. 사실 검증 결과 (2026년 기준, 설계 단계 추가 검증 포함)

### 대상 조건
| 항목 | 기준 |
|---|---|
| 연령 | 만 19세~34세 이하 |
| 주택 소유 | 무주택자 |
| 거주 형태 | 부모와 주민등록상·실거주상 분리, 임대차계약 기반 월세 거주 |

### 소득 기준 (이중 구조)
| 구분 | 기준 | 2026년 1인 가구 예시 |
|---|---|---|
| 청년가구(본인) | 기준 중위소득 60% 이하 | 약 1,538,543원 |
| 원가구(부모 등) | 기준 중위소득 100% 이하 | 가구원수별 상이 |

### 재산 기준 (이중 구조, 설계 단계 추가 검증 완료)
| 구분 | 기준 |
|---|---|
| 청년가구(본인) | 총재산가액 1.22억원 이하 |
| 원가구(부모 등) | 총재산가액 4.7억원 이하 |

### 지원금액
- 월 최대 20만원, **실제 납부 월세와 20만원 중 작은 값**만 지원 (임차보증금·관리비 제외)
- 최대 24개월(회) → 최대 총 480만원

### 제외 대상 (체크 시 무조건 "제외 대상" 판정)
- 주택 소유자(분양권·입주권 포함)
- 2촌 이내 혈족(배우자의 2촌 이내 혈족 포함) 주택 임차
- 공공임대주택(공무원임대주택 포함) 거주
- 한 방 다수 거주 전대차
- 지자체 시행 월세지원 사업 중복 수급 중

### 제도 변경
- 2026년부터 한시 사업 → 상시 사업 전환, 연중 신청 가능

---

## 3. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  SimpleToolShell(calculatorId="youth-rent-support-calculator", pageClass="yrsc-page")
    slot="hero": CalculatorHero + InfoNotice (중앙정부 통일 제도, 지자체 자체사업과 혼동 주의)
    slot="actions": ToolActionBar
    slot="aside":
      - 빠른 기준 패널 (월 최대 20만원, 최대 24개월=480만원, 2026 상시신청)
      - 프리셋 4개 버튼
      - 입력 패널 (나이/무주택/별거/임대차/본인소득/원가구소득/본인재산/원가구재산/월세/제외요건 체크박스)
    메인 영역:
      - 종합 판정 카드
      - 조건별 체크리스트 (연령·무주택·별거·본인소득·원가구소득·본인재산·원가구재산·제외요건 — 8항목)
      - 예상 지원금 카드 (월 지원금 = min(월세, 20만원), 최대 총액)
      - "왜 제외될 수 있는가" 안내 카드
    slot="seo": SeoContent

  <script id="yrsc-data" type="application/json">...</script>
  <script type="module" src="/scripts/youth-rent-support-calculator.js">
```

---

## 4. 데이터 파일 (`src/data/youthRentSupportCalculator.ts`)

```ts
export interface YrscPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const YRSC_META = {
  slug: "youth-rent-support-calculator",
  title: "청년월세지원 계산기 2026",
  seoTitle: "청년월세지원 계산기 2026 | 신청 가능 여부·예상 지원금 한 번에",
  seoDescription:
    "만 나이, 본인·부모님 소득과 재산, 월세를 입력해 청년월세지원 신청 가능 여부와 예상 지원금을 계산합니다. 월 최대 20만원, 최대 24개월(480만원) 기준을 확인하세요.",
  dataNote:
    "청년월세지원은 국토교통부가 운영하는 중앙정부 통일 제도로, 2026년부터 상시 사업으로 전환되어 연중 신청할 수 있습니다. 서울 등 일부 지자체가 운영하는 자체 청년 월세지원 사업과는 별도이며, 두 사업은 중복 수급할 수 없습니다. 이 계산기의 결과는 확정 수급 여부가 아닌 자가 점검용 추정입니다.",
  updatedAt: "2026-06-25",
};

// 2026년 1인 가구 기준 중위소득(원/월) — 청년가구 60%, 원가구 100% 산정에 사용
export const YRSC_MEDIAN_INCOME_1PERSON = 2_564_238;
export const YRSC_YOUTH_INCOME_RATE = 0.6; // 청년가구 기준: 중위소득 60%
export const YRSC_ORIGIN_INCOME_RATE = 1.0; // 원가구 기준: 중위소득 100%

export const YRSC_YOUTH_ASSET_LIMIT = 122_000_000; // 청년가구 재산기준
export const YRSC_ORIGIN_ASSET_LIMIT = 470_000_000; // 원가구 재산기준

export const YRSC_MONTHLY_CAP = 200_000; // 월 최대 지원금
export const YRSC_MAX_MONTHS = 24; // 최대 지원개월

export const YRSC_MIN_AGE = 19;
export const YRSC_MAX_AGE = 34;

export const YRSC_PRESETS: YrscPreset[] = [
  {
    id: "typical-eligible",
    label: "일반적인 자취 청년",
    summary: "26세 · 본인소득 130만원 · 월세 35만원",
    input: { age: 26, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1300000, originMonthlyIncome: 4000000, youthAsset: 30000000, originAsset: 200000000, monthlyRent: 350000, excludedReason: "none" },
  },
  {
    id: "low-rent",
    label: "월세가 20만원보다 적은 경우",
    summary: "월세 15만원 — 실제 월세만큼만 지원",
    input: { age: 24, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 900000, originMonthlyIncome: 3000000, youthAsset: 15000000, originAsset: 150000000, monthlyRent: 150000, excludedReason: "none" },
  },
  {
    id: "origin-income-too-high",
    label: "부모님 소득이 기준 초과",
    summary: "본인 소득은 낮지만 원가구 소득 초과 우려",
    input: { age: 28, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1200000, originMonthlyIncome: 9000000, youthAsset: 20000000, originAsset: 200000000, monthlyRent: 400000, excludedReason: "none" },
  },
  {
    id: "public-housing-excluded",
    label: "공공임대주택 거주 (제외 대상)",
    summary: "조건은 충족하지만 공공임대주택이라 제외",
    input: { age: 27, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1100000, originMonthlyIncome: 3500000, youthAsset: 20000000, originAsset: 180000000, monthlyRent: 300000, excludedReason: "public_housing" },
  },
];

export const YRSC_FAQ = [
  {
    question: "본인 소득은 적은데 부모님 소득이 많으면 못 받나요?",
    answer:
      "그럴 수 있습니다. 청년월세지원은 본인(청년가구) 소득뿐 아니라 부모님 등 원가구 소득도 함께 봅니다. 청년가구는 기준 중위소득 60% 이하, 원가구는 기준 중위소득 100% 이하를 모두 충족해야 하므로, 본인 소득이 낮아도 부모님 소득이 기준을 넘으면 신청이 어려울 수 있습니다.",
  },
  {
    question: "월세가 20만원보다 적으면 어떻게 되나요?",
    answer:
      "실제로 낸 월세 금액만큼만 지원됩니다. 예를 들어 월세가 15만원이면 매달 15만원을 지원받고, 월세가 25만원이면 한도인 20만원까지만 지원됩니다. 임차보증금이나 관리비는 지원 대상에서 제외됩니다.",
  },
  {
    question: "서울에 사는데 서울형 청년월세지원도 같이 받을 수 있나요?",
    answer:
      "아닙니다. 이 계산기가 다루는 청년월세지원은 국토교통부가 운영하는 중앙정부 통일 제도이며, 서울시 등 일부 지자체가 운영하는 자체 청년 월세지원 사업과는 별도입니다. 두 사업은 중복 수급할 수 없으므로 본인에게 더 유리한 쪽을 선택해서 신청해야 합니다.",
  },
  {
    question: "2026년에 뭐가 바뀌었나요?",
    answer:
      "2026년부터 한시 사업이 상시 사업으로 전환되어, 정해진 모집 기간이 아니라 연중 언제든 신청할 수 있게 됐습니다.",
  },
  {
    question: "재산기준 1.22억원과 4.7억원은 각각 무엇인가요?",
    answer:
      "1.22억원은 청년가구(본인) 재산기준이고, 4.7억원은 원가구(부모 등) 재산기준입니다. 두 기준을 모두 충족해야 하며, 어느 한쪽이라도 초과하면 신청이 어려울 수 있습니다.",
  },
  {
    question: "부모님과 같은 동네 다른 집에 살면 별거로 인정되나요?",
    answer:
      "주민등록상 주소지와 실제 거주지가 모두 부모님과 분리되어 있어야 인정됩니다. 같은 동네라도 주민등록과 실거주가 분리되어 있다면 원칙적으로 인정되지만, 정확한 판단은 신청 기관(주민센터·복지로)의 확인이 필요합니다.",
  },
];

export const YRSC_RELATED_LINKS = [
  { href: "/tools/family-care-allowance-calculator/", label: "가족돌봄수당 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/housing-benefit-income-recognition/", label: "주거급여 계산기" },
  { href: "/reports/single-household-living-cost-2026/", label: "2026 1인 가구 생활비 완전 해부" },
];

export const YRSC_SEO_CONTENT = {
  introTitle: "청년월세지원, 나도 받을 수 있을까?",
  intro: [
    "자취하는 청년이라면 한 번쯔음 들어봤을 '청년월세지원'은 매달 월세 부담을 줄여주는 국토교통부 운영 제도입니다. 2026년부터는 정해진 모집 기간 없이 연중 언제든 신청할 수 있는 상시 사업으로 바뀌었습니다. 다만 조건이 본인 소득만으로 끝나지 않고 부모님 소득과 재산까지 함께 보기 때문에, 신청 전에 내가 대상인지 가늠하기가 쉽지 않습니다. 이 계산기는 나이, 거주 형태, 본인·원가구 소득과 재산, 월세를 입력해 신청 전에 스스로 점검할 수 있도록 만든 자가 점검용 도구입니다.",
    "기본 대상은 만 19세부터 34세 이하 무주택 청년으로, 부모와 주민등록상·실제 거주상 모두 분리되어 임대차계약을 맺고 월세를 내며 살고 있어야 합니다. 소득 기준은 이중 구조입니다. 청년가구(본인)는 기준 중위소득 60% 이하(2026년 1인 가구 기준 약 153만 8,543원), 원가구(부모 등)는 기준 중위소득 100% 이하를 모두 충족해야 합니다. 재산 기준도 마찬가지로 청년가구는 1억 2,200만원 이하, 원가구는 4억 7,000만원 이하로 나뉩니다.",
    "지원금은 매달 최대 20만원이지만, 실제로는 '월세와 20만원 중 더 작은 금액'만 지원됩니다. 월세가 15만원이면 15만원만, 25만원이면 한도인 20만원까지만 지원되는 식입니다. 최대 24개월(회)까지 지원받을 수 있어, 월세 20만원 이상을 24개월 동안 받으면 최대 480만원까지 누적됩니다. 임차보증금이나 관리비는 지원 대상에 포함되지 않고 월세만 인정됩니다.",
    "신청이 안 되는 제외 대상도 명확합니다. 주택 소유자(분양권·입주권 포함), 부모나 형제자매 등 2촌 이내 혈족의 집에 세를 들어 사는 경우, 공공임대주택(공무원임대주택 포함) 거주자, 한 방에 여러 명이 함께 사는 전대차 형태는 제외됩니다. 특히 헷갈리기 쉬운 부분은 서울시 등 일부 지자체가 운영하는 자체 청년 월세지원 사업을 이미 받고 있다면, 이 중앙정부 사업과 중복 수급이 불가능하다는 점입니다.",
    "이 계산기는 신청 결과를 보장하지 않는 자가 점검용 추정입니다. 정확한 소득·재산 산정 방식, 거주 분리 인정 기준, 신청 절차는 복지로 모의계산이나 한국토지주택공사(LH), 주소지 주민센터에서 최종 확인해야 합니다. 본인에게 지자체 자체 사업과 이 중앙정부 사업 중 어느 쪽이 더 유리한지도 함께 비교해보는 것을 권장합니다.",
  ],
  inputPoints: [
    "나이와 거주 형태를 입력하면 기본 대상 조건을 바로 확인할 수 있습니다.",
    "본인과 원가구 소득·재산을 모두 입력해야 정확한 판정을 받을 수 있습니다.",
    "월세를 입력하면 실제 지원받을 수 있는 월 지원금과 최대 총액을 볼 수 있습니다.",
  ],
  criteria: [
    "대상 연령, 소득·재산 기준, 지원금액은 2026년 국토교통부 운영 기준을 참고했습니다.",
    "청년가구와 원가구의 소득·재산 기준은 서로 다르며 둘 다 충족해야 합니다.",
    "월 지원금은 실제 월세와 20만원 중 작은 금액으로 계산됩니다.",
    "지자체 자체 청년 월세지원 사업과는 중복 수급이 불가능합니다.",
    "이 계산기는 확정 수급 여부가 아닌 자가 점검용 추정이며, 최종 확인은 복지로·LH·주민센터에서 해야 합니다.",
  ],
};

export const YRSC_CONFIG = {
  medianIncome1Person: YRSC_MEDIAN_INCOME_1PERSON,
  youthIncomeRate: YRSC_YOUTH_INCOME_RATE,
  originIncomeRate: YRSC_ORIGIN_INCOME_RATE,
  youthAssetLimit: YRSC_YOUTH_ASSET_LIMIT,
  originAssetLimit: YRSC_ORIGIN_ASSET_LIMIT,
  monthlyCap: YRSC_MONTHLY_CAP,
  maxMonths: YRSC_MAX_MONTHS,
  minAge: YRSC_MIN_AGE,
  maxAge: YRSC_MAX_AGE,
  presets: YRSC_PRESETS,
};
```

> 원가구 소득기준(중위소득 100%)은 가구원수별로 달라지지만, 1차 버전은 입력 단순화를 위해 **원가구 월소득을 직접 입력받아 1인 가구 중위소득(2,564,238원)의 배수로 단순 비교**하는 방식을 쓴다. 정확한 원가구 가구원수별 기준표는 후속 버전에서 `welfareBenefitEligibility.ts`의 `medianIncome` 컬럼을 그대로 재사용해 보강할 수 있다 — 설계 단계 비고로 남김.

---

## 5. 계산 로직 (`public/scripts/youth-rent-support-calculator.js`)

```js
(() => {
  const root = document.querySelector(".yrsc-page");
  const dataEl = document.getElementById("yrsc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    age: 26,
    isHomeless: true,
    livesSeparately: true,
    hasLeaseContract: true,
    monthlyIncome: 1300000,
    originMonthlyIncome: 4000000,
    youthAsset: 30000000,
    originAsset: 200000000,
    monthlyRent: 350000,
    excludedReason: "none",
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }
  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function calculate(s) {
    const isAgeEligible = s.age >= cfg.minAge && s.age <= cfg.maxAge;
    const isBasicEligible = s.isHomeless && s.livesSeparately && s.hasLeaseContract;

    const youthIncomeLimit = cfg.medianIncome1Person * cfg.youthIncomeRate;
    const originIncomeLimit = cfg.medianIncome1Person * cfg.originIncomeRate;
    const isYouthIncomeEligible = s.monthlyIncome <= youthIncomeLimit;
    const isOriginIncomeEligible = s.originMonthlyIncome <= originIncomeLimit;

    const isYouthAssetEligible = s.youthAsset <= cfg.youthAssetLimit;
    const isOriginAssetEligible = s.originAsset <= cfg.originAssetLimit;

    const isExcluded = s.excludedReason !== "none";

    const monthlyAmount = isExcluded ? 0 : Math.min(s.monthlyRent, cfg.monthlyCap);
    const maxTotalAmount = monthlyAmount * cfg.maxMonths;

    const coreEligible =
      isAgeEligible && isBasicEligible &&
      isYouthIncomeEligible && isOriginIncomeEligible &&
      isYouthAssetEligible && isOriginAssetEligible &&
      !isExcluded;

    return {
      isAgeEligible, isBasicEligible,
      isYouthIncomeEligible, isOriginIncomeEligible,
      isYouthAssetEligible, isOriginAssetEligible,
      isExcluded,
      monthlyAmount, maxTotalAmount,
      judgement: isExcluded ? "excluded" : coreEligible ? "likely" : "partial",
    };
  }

  function judgementLabel(level) {
    if (level === "excluded") return "제외 대상";
    if (level === "likely") return "가능성 높음";
    return "일부 조건 미충족";
  }

  function readState() {
    state.age = num($('[data-yrsc="age"]')?.value, initialState.age);
    state.isHomeless = $('[data-yrsc="isHomeless"]')?.checked ?? true;
    state.livesSeparately = $('[data-yrsc="livesSeparately"]')?.checked ?? true;
    state.hasLeaseContract = $('[data-yrsc="hasLeaseContract"]')?.checked ?? true;
    state.monthlyIncome = num($('[data-yrsc="monthlyIncome"]')?.value);
    state.originMonthlyIncome = num($('[data-yrsc="originMonthlyIncome"]')?.value);
    state.youthAsset = num($('[data-yrsc="youthAsset"]')?.value);
    state.originAsset = num($('[data-yrsc="originAsset"]')?.value);
    state.monthlyRent = num($('[data-yrsc="monthlyRent"]')?.value);
    state.excludedReason = $('[data-yrsc="excludedReason"]')?.value || "none";
  }

  function setControl(key, value) {
    const el = $(`[data-yrsc="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (["monthlyIncome", "originMonthlyIncome", "youthAsset", "originAsset", "monthlyRent"].includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-yrsc-result="judgement"]').textContent = judgementLabel(result.judgement);
    $('[data-yrsc-result="ageCheck"]').textContent = result.isAgeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="basicCheck"]').textContent = result.isBasicEligible ? "충족" : "미충족";
    $('[data-yrsc-result="youthIncomeCheck"]').textContent = result.isYouthIncomeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="originIncomeCheck"]').textContent = result.isOriginIncomeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="youthAssetCheck"]').textContent = result.isYouthAssetEligible ? "충족" : "미충족";
    $('[data-yrsc-result="originAssetCheck"]').textContent = result.isOriginAssetEligible ? "충족" : "미충족";
    $('[data-yrsc-result="excludedCheck"]').textContent = result.isExcluded ? "제외 사유 있음" : "해당 없음";
    $('[data-yrsc-result="monthlyAmount"]').textContent = won(result.monthlyAmount);
    $('[data-yrsc-result="maxTotal"]').textContent = won(result.maxTotalAmount);
  }

  function refresh() {
    readState();
    render(calculate(state));
  }

  $$("[data-yrsc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-yrsc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.yrscPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#yrscResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#yrscCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#yrscCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#yrscCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#yrscCopyBtn").textContent = "복사 실패";
    }
  });

  refresh();
})();
```

> `excludedReason`이 "none"이 아니면 `monthlyAmount`를 강제로 0으로 만들고 `judgement`를 "excluded"로 고정 — 원칙 4번 강제 구현.

---

## 6. Astro 페이지 핵심 섹션

`family-care-allowance-calculator.astro`를 복제하여 다음만 교체:

- import 대상: `YRSC_*` 심볼
- `CalculatorHero`: title="청년월세지원 계산기", description="나이, 본인·부모님 소득과 재산, 월세를 입력하면 청년월세지원 신청 가능 여부와 예상 지원금을 빠르게 점검합니다."
- `InfoNotice` lines: `YRSC_META.dataNote` + "지자체 자체 청년 월세지원과는 중복 수급이 불가능합니다." + "월 지원금은 실제 월세와 20만원 중 작은 금액으로 계산됩니다."
- aside 입력 패널: 나이 input, 무주택/별거/임대차계약 checkbox 3개, 본인소득 input, 원가구소득 input, 본인재산 input, 원가구재산 input, 월세 input, 제외사유 select(없음/주택소유/혈족임차/공공임대/전대차/지자체중복수급)
- 결과 섹션: 종합판정카드 + 체크리스트 7항목(연령/기본조건/본인소득/원가구소득/본인재산/원가구재산/제외사유) + 지원금 카드 2개(월 지원금/최대 총액)
- "왜 제외될 수 있는가" 카드: 제외 대상 5가지를 텍스트로 나열
- `SeoContent`: `YRSC_SEO_CONTENT.*`, `faq={YRSC_FAQ}`, `related={YRSC_RELATED_LINKS}`

---

## 7. SCSS

`_family-care-allowance-calculator.scss`의 클래스명을 `.yrsc-*`로 치환해 그대로 복제 (judgement-card, check-grid, check-item 패턴 포함). `excludedReason` 활성 시 강조용 색상만 추가:

```scss
.yrsc-judgement-card--excluded {
  border-color: #c23b3b;
  background: #fbe9e9;

  strong { color: #c23b3b; }
}
```

---

## 8. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | 신규 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/youth-rent-support-calculator';` |
| `public/sitemap.xml` | `/tools/youth-rent-support-calculator/` 추가 |
| `src/pages/index.astro` | `topicBySlug`에 `"youth-rent-support-calculator": "복지·지원금"` 추가 (처음부터 함께 등록) |
| `family-care-allowance-calculator` 등 관련 계산기 | `relatedLinks`에 본 계산기 상호 추가 검토 |

```ts
{
  slug: "youth-rent-support-calculator",
  title: "청년월세지원 계산기 2026",
  description: "본인·부모님 소득과 재산, 월세를 입력해 청년월세지원 신청 가능 여부와 예상 지원금을 자가 점검용으로 계산합니다.",
  order: 11.74,
  eyebrow: "청년월세지원 자가점검",
  category: "support",
  iframeReady: true,
  badges: ["신규", "청년월세지원", "2026"],
  previewStats: [
    { label: "핵심 결과", value: "예상 지원금" },
    { label: "기준 비교", value: "월 최대 20만원" }
  ]
}
```

---

## 9. QA 포인트

- [ ] 청년가구·원가구 소득기준이 각각 154만원/256만원(중위소득 60%/100%)으로 정확히 분리 계산됨
- [ ] 청년가구·원가구 재산기준이 1.22억/4.7억으로 각각 독립적으로 판정됨
- [ ] 월세 15만원 입력 시 지원금이 20만원이 아니라 15만원으로 정확히 계산됨 (min 로직 검증)
- [ ] 제외사유를 하나라도 선택하면 종합판정이 무조건 "제외 대상"으로 전환되고 지원금이 0원이 됨
- [ ] intro 5단락 이상 800자 이상, FAQ 6개
- [ ] InfoNotice·FAQ·SEO 3곳에 "지자체 자체 사업과 중복수급 불가" 고지가 있음
- [ ] `npm run build` 성공
- [ ] (신규 계산 로직 포함 — 프리셋 4개 클릭 시 입력값·판정·지원금이 모두 정확히 갱신되는지 브라우저 검증 필요, 특히 "월세가 20만원보다 적은 경우"와 "공공임대주택 제외" 프리셋)

---

## 10. 구현 리스크

- **원가구 소득기준 단순화**: 원가구 가구원수별 정확한 중위소득 100% 기준표 대신 1인 가구 기준만 사용하는 1차 버전 한계 — SEO criteria와 FAQ에서 "단순화된 기준"임을 명시.
- **이중 기준 복잡도로 인한 사용자 혼란 리스크**: 체크리스트가 7항목으로 늘어나 가족돌봄수당보다 복잡함 — UI에서 "본인 기준"과 "원가구(부모님) 기준"을 시각적으로 그룹화해서 혼동을 줄여야 함.
- **지자체 자체 사업 혼동 리스크**: "서울형 청년월세지원" 등과 헷갈리지 않도록 InfoNotice 최상단에 "이건 국토부 중앙정부 사업입니다" 문구를 명확히 배치.
- **월세 지원액 min() 로직 누락 리스크**: 코드 리뷰 시 `Math.min(s.monthlyRent, cfg.monthlyCap)` 로직이 정확히 들어갔는지 반드시 확인 — 빠지면 월세가 적어도 무조건 20만원을 준다고 오안내하게 됨.
