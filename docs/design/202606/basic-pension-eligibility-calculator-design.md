# 기초연금 수급 가능성 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/basic-pension-eligibility-calculator`
- **유형**: 계산기 (복지 자가 점검형)
- **prefix**: `bpec-` (Basic Pension Eligibility Calculator)
- **데이터 파일**: `src/data/basicPensionEligibilityCalculator.ts`
- **스크립트**: `public/scripts/basic-pension-eligibility-calculator.js`
- **스타일**: `src/styles/scss/pages/_basic-pension-eligibility-calculator.scss`
- **레이아웃**: `SimpleToolShell` (기존 `livelihood-benefit-income-recognition.astro`와 동일한 IA·인터랙션 패턴 재사용)
- **기획 문서**: `docs/plan/202606/basic-pension-eligibility-calculator-plan.md`

### 핵심 원칙 (절대 위반 금지)

1. **기존 생계급여 상수와 절대 혼용하지 않는다.** `welfareBenefitEligibility.ts`의 `WBE_ASSET_DEDUCTION_BY_REGION`, `WBE_MONTHLY_CONVERSION_RATE`, `WBE_WORK_INCOME_DEDUCTION`을 import하거나 재사용하지 않는다. 기초연금은 기본재산공제액, 금융재산공제액, 재산환산율, 근로소득공제 기준이 전부 다르므로 신규 파일에 전용 상수로 새로 정의한다.
2. **국민연금 연계 감액·소득역전방지 감액은 1차 버전에서 계산하지 않는다.** 안내 문구로만 처리한다 (방법론 섹션 5번 참고).
3. 모든 결과 화면에 "확정 수급액 아님, 복지로/주민센터 최종 확인 필요" 고지를 반복 노출한다.

---

## 2. 사실 검증 결과 (2026년 기준, 보건복지부·정책브리핑 2026-01 보도 + 생활법령정보 확인)

| 항목 | 값 | 출처 |
|---|---|---|
| 선정기준액 (단독가구) | 2,470,000원 | 보건복지부·정책브리핑(2026-01) |
| 선정기준액 (부부가구) | 3,952,000원 | 보건복지부·정책브리핑(2026-01) |
| 소득평가액 공식 | `0.7 × (근로소득 - 116만원) + 기타소득` | 정책브리핑·지원펀드 정리자료 |
| 기본재산공제액 (대도시·특례시) | 1억 3,500만원 | 생활법령정보 |
| 기본재산공제액 (중소도시) | 8,500만원 | 생활법령정보 |
| 기본재산공제액 (농어촌) | 7,250만원 | 생활법령정보 |
| 금융재산 공제액 | 2,000만원 (전국 동일) | 정책브리핑 |
| 재산의 소득환산율 | 연 4% (월 환산 시 ÷12) | 생활법령정보·복지로 |
| 부부 감액 | 부부 각각 20% 감액 | 씽크얼라우드블로그·복지로 모의계산 안내 |
| 2026년 월 최대 지급액 (단독) | 349,700원 | 다음뉴스(2026-02-11) |
| 2026년 월 최대 지급액 (부부, 1인당 추정) | 단독 금액의 80% ≈ 279,760원 (⚠️ 단순 추정, 정확한 고시액은 복지로 모의계산으로 재확인 권장) | 단독 금액 × 부부감액률 단순 계산 |

> 고급자동차·회원권(P)은 월 100% 소득환산이 적용되나, 차량 용도·가액 판정이 복잡해 기존 `welfareBenefitEligibility.ts` 패턴과 동일하게 **"확인 필요" 플래그**로만 처리하고 정확한 금액 계산에는 포함하지 않는다.

---

## 3. 화면 구성 (IA) — `livelihood-benefit-income-recognition.astro`와 동일 골격

```text
[BaseLayout]
  SiteHeader
  SimpleToolShell(calculatorId="basic-pension-eligibility-calculator", pageClass="bpec-page")
    slot="hero": CalculatorHero + InfoNotice
    slot="actions": ToolActionBar
    slot="aside":
      - 빠른 기준 패널 (단독/부부 선정기준액)
      - 프리셋 4개 버튼
      - 입력 패널 (기본정보 / 소득 / 재산)
    메인 영역:
      - 결과 KPI 그리드 (소득인정액, 선정기준액, 수급 가능성, 예상 기초연금액)
      - 게이지 바 (소득인정액 위치)
      - 소득인정액 구성 분해 카드
      - 확인 필요 항목 + 관련 계산기 링크
    slot="seo": SeoContent

  <script id="bpec-data" type="application/json">...</script>
  <script type="module" src="/scripts/basic-pension-eligibility-calculator.js">
```

---

## 4. 데이터 파일 (`src/data/basicPensionEligibilityCalculator.ts`)

```ts
export type HouseholdType = "single" | "couple";
export type HouseholdRegion = "metro" | "city" | "rural";

export interface BpecPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const BPEC_META = {
  slug: "basic-pension-eligibility-calculator",
  title: "기초연금 수급 가능성 계산기 2026",
  seoTitle: "기초연금 수급 가능성 계산기 2026 | 부모님 받을 수 있을까?",
  seoDescription:
    "가구 형태, 소득, 재산을 입력해 2026년 기초연금 선정기준 대비 소득인정액과 수급 가능성, 예상 기초연금액을 자가 점검용으로 계산합니다.",
  dataNote:
    "2026년 기초연금 선정기준액과 소득인정액 산정 방식을 바탕으로 한 자가 점검용 추정입니다. 국민연금 연계 감액·소득역전방지 감액은 반영하지 않았으며, 실제 수급 여부와 지급액은 국민연금공단·복지로 모의계산 또는 주민센터 확인 결과에 따라 달라질 수 있습니다.",
  updatedAt: "2026-06-24",
};

export const BPEC_HOUSEHOLD_LABELS: Record<HouseholdType, string> = {
  single: "단독가구",
  couple: "부부가구",
};

export const BPEC_REGION_LABELS: Record<HouseholdRegion, string> = {
  metro: "대도시·특례시",
  city: "중소도시",
  rural: "농어촌",
};

// 2026년 기초연금 선정기준액 (보건복지부·정책브리핑 2026-01 보도 기준)
export const BPEC_SELECTION_THRESHOLD: Record<HouseholdType, number> = {
  single: 2_470_000,
  couple: 3_952_000,
};

// 2026년 월 최대 지급액 — 단독 확인값, 부부 1인당은 단순 추정(⚠️ 복지로 모의계산 재확인 권장)
export const BPEC_MAX_BENEFIT: Record<HouseholdType, number> = {
  single: 349_700,
  couple: 279_760, // 349,700 × (1 - 0.2) 단순 환산, 정확한 고시액 아님
};

// 기본재산공제액 (생활법령정보 기준) — 생계급여(welfareBenefitEligibility.ts)와 절대 혼용 금지
export const BPEC_BASIC_ASSET_DEDUCTION: Record<HouseholdRegion, number> = {
  metro: 135_000_000,
  city: 85_000_000,
  rural: 72_500_000,
};

export const BPEC_FINANCIAL_ASSET_DEDUCTION = 20_000_000; // 금융재산 공제액, 전국 동일

export const BPEC_ASSET_CONVERSION_RATE_ANNUAL = 0.04; // 재산의 소득환산율 연 4%

export const BPEC_WORK_INCOME_DEDUCTION = 1_160_000; // 근로소득 공제 기준액 116만원
export const BPEC_WORK_INCOME_RATE = 0.7; // 공제 후 적용 비율 70%

export const BPEC_COUPLE_REDUCTION_RATE = 0.2; // 부부 감액 20%

export const BPEC_PRESETS: BpecPreset[] = [
  {
    id: "single-pension-only",
    label: "단독, 국민연금만 있음",
    summary: "국민연금 월 30만원 · 대도시 자가",
    input: { householdType: "single", region: "metro", publicPensionIncome: 300000, earnedIncome: 0, generalAsset: 200000000, financialAsset: 10000000 },
  },
  {
    id: "couple-rural",
    label: "부부, 농어촌 자가",
    summary: "농어촌 거주 · 금융재산 1,000만원",
    input: { householdType: "couple", region: "rural", publicPensionIncome: 400000, earnedIncome: 0, generalAsset: 90000000, financialAsset: 10000000 },
  },
  {
    id: "single-borderline",
    label: "단독, 경계 사례",
    summary: "도시 거주 · 금융재산 3,000만원",
    input: { householdType: "single", region: "city", publicPensionIncome: 500000, earnedIncome: 800000, generalAsset: 100000000, financialAsset: 30000000 },
  },
  {
    id: "couple-working",
    label: "부부, 배우자 근로소득 있음",
    summary: "한쪽 근로소득 150만원 · 중소도시",
    input: { householdType: "couple", region: "city", publicPensionIncome: 200000, earnedIncome: 1500000, generalAsset: 60000000, financialAsset: 5000000 },
  },
];

export const BPEC_FAQ = [
  {
    question: "기초연금은 국민연금을 받으면 못 받나요?",
    answer:
      "아닙니다. 국민연금을 받고 있어도 기초연금을 함께 받을 수 있습니다. 다만 국민연금 가입기간이 길거나 수령액이 일정 수준(기초연금액의 150%)을 넘으면 기초연금이 단계적으로 감액될 수 있습니다. 이 계산기는 해당 감액을 반영하지 않은 단순 추정이므로, 국민연금 수령액이 많은 경우 실제 지급액은 이 결과보다 낮을 수 있습니다.",
  },
  {
    question: "재산이 있으면 기초연금을 못 받나요?",
    answer:
      "재산이 있다고 무조건 탈락하는 것은 아닙니다. 거주 지역별 기본재산공제액(대도시 1억 3,500만원, 중소도시 8,500만원, 농어촌 7,250만원)과 금융재산 공제 2,000만원을 먼저 뺀 나머지에만 연 4%의 소득환산율이 적용됩니다. 공제액 이하의 재산은 소득인정액에 영향을 주지 않습니다.",
  },
  {
    question: "부부가 같이 받으면 왜 감액되나요?",
    answer:
      "부부가 모두 기초연금을 받는 경우 가구 단위로 생활비가 절감되는 점을 고려해 각자 20%씩 감액한 금액을 지급하는 제도입니다. 그래서 부부가구의 1인당 지급액은 단독가구보다 낮게 계산됩니다.",
  },
  {
    question: "이 계산기의 결과는 정확한 수급액인가요?",
    answer:
      "아닙니다. 이 계산기는 선정기준액과 소득인정액 산정 방식을 단순화한 자가 점검용 추정입니다. 국민연금 연계 감액, 소득역전방지 감액, 고급자동차·회원권 반영은 포함하지 않았습니다. 정확한 수급 여부와 금액은 복지로 모의계산 또는 국민연금공단, 주민센터에서 확인해야 합니다.",
  },
  {
    question: "소득평가액의 116만원 공제는 누구에게 적용되나요?",
    answer:
      "근로소득이 있는 신청자(또는 배우자)에게 적용되는 공제입니다. 월 근로소득이 116만원 이하라면 소득평가액에 반영되는 근로소득은 0원으로 계산되고, 116만원을 초과한 부분의 70%만 소득평가액에 더해집니다.",
  },
  {
    question: "공적연금(국민연금)은 어디에 입력하나요?",
    answer:
      "국민연금, 공무원연금 등 공적연금 수령액은 근로소득과 별도로 '기타소득' 항목에 그대로 입력합니다. 근로소득과 달리 별도 공제 없이 소득평가액에 전액 포함됩니다.",
  },
];

export const BPEC_RELATED_LINKS = [
  { href: "/tools/national-pension-calculator/", label: "국민연금 수령액 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/basic-livelihood-recipient-asset-standard/", label: "기초생활수급자 재산 기준 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
];

export const BPEC_SEO_CONTENT = {
  introTitle: "기초연금, 부모님이 받을 수 있는지 미리 확인하는 방법",
  intro: [
    "부모님 세대가 기초연금을 받을 수 있는지 궁금할 때 가장 먼저 막막한 부분은 '소득인정액'이라는 낯선 개념입니다. 국민연금을 받고 있으면 기초연금은 못 받는 게 아닌지, 집이나 예금이 있으면 무조건 탈락하는 건 아닌지 헷갈리기 쉽습니다. 이 계산기는 가구 형태, 소득, 재산을 입력해 신청 전에 자녀나 본인이 미리 가늠해볼 수 있도록 만든 자가 점검용 도구입니다.",
    "기초연금은 단순히 월소득만으로 판단하지 않습니다. 실제로는 근로소득에서 116만원을 공제한 뒤 70%만 반영한 '소득평가액'과, 보유 재산을 지역별 기본재산공제액과 금융재산공제 2,000만원을 뺀 뒤 연 4%로 환산한 '재산의 소득환산액'을 더한 소득인정액을 기준으로 봅니다. 2026년 기초연금 선정기준액은 단독가구 247만원, 부부가구 395만 2,000원이며, 소득인정액이 이 기준선보다 낮아야 수급 가능 구간으로 봅니다.",
    "결과를 확인할 때는 소득인정액이 선정기준액보다 낮은지부터 보고, 두 값의 차이가 얼마나 나는지를 함께 살펴보는 것이 중요합니다. 차이가 클수록 안정적으로 수급 가능한 구간이고, 차이가 거의 없는 경계 구간이라면 실제 조사에서 결과가 달라질 수 있습니다. 재산 항목 중 어떤 것이 소득인정액을 많이 끌어올렸는지 분해 결과로 확인하면 어떤 자료를 더 챙겨야 하는지도 가늠할 수 있습니다.",
    "특히 국민연금을 받고 있는 경우는 주의가 필요합니다. 국민연금 수령액 자체는 소득인정액에 그대로 포함되지만, 그것과 별개로 국민연금 가입기간이 길거나 수령액이 기초연금액의 150%를 넘으면 기초연금이 최대 50%까지 단계적으로 감액되는 별도 규정이 있습니다. 이 계산기는 계산이 복잡하고 과대·과소 추정 위험이 커서 이 감액을 반영하지 않았으므로, 국민연금을 오래 받아온 경우 실제 지급액은 이 결과보다 낮게 나올 수 있습니다.",
    "이 계산기는 실제 제도를 단순화한 자가 점검용 추정이라는 한계가 분명합니다. 부부 감액 후 정확한 1인당 지급액, 고급자동차·회원권 처리, 소득역전방지 감액 등은 실제 심사에서 별도로 반영됩니다. 정확한 수급 여부와 지급액은 반드시 복지로 모의계산 또는 국민연금공단, 주소지 읍면동 주민센터에서 최종 확인해야 하며, 이 결과만으로 신청 여부를 단정하지 않는 것이 좋습니다.",
  ],
  inputPoints: [
    "단독·부부가구별 2026년 기초연금 선정기준액을 바로 확인할 수 있습니다.",
    "소득과 재산을 반영한 소득인정액을 간이 추정할 수 있습니다.",
    "예상 기초연금액과 선정기준까지 남은 금액을 볼 수 있습니다.",
  ],
  criteria: [
    "2026년 선정기준액과 소득인정액 산정 방식은 보건복지부 발표 기준을 사용합니다.",
    "재산의 소득환산율은 연 4%, 금융재산 공제 2,000만원을 적용합니다.",
    "국민연금 연계 감액과 소득역전방지 감액은 반영하지 않은 단순 추정입니다.",
    "최종 수급 여부와 금액은 복지로 모의계산 또는 국민연금공단·주민센터에서 확인해야 합니다.",
  ],
};

export const BPEC_CONFIG = {
  selectionThreshold: BPEC_SELECTION_THRESHOLD,
  maxBenefit: BPEC_MAX_BENEFIT,
  basicAssetDeduction: BPEC_BASIC_ASSET_DEDUCTION,
  financialAssetDeduction: BPEC_FINANCIAL_ASSET_DEDUCTION,
  assetConversionRateAnnual: BPEC_ASSET_CONVERSION_RATE_ANNUAL,
  workIncomeDeduction: BPEC_WORK_INCOME_DEDUCTION,
  workIncomeRate: BPEC_WORK_INCOME_RATE,
  coupleReductionRate: BPEC_COUPLE_REDUCTION_RATE,
  presets: BPEC_PRESETS,
  labels: {
    household: BPEC_HOUSEHOLD_LABELS,
    region: BPEC_REGION_LABELS,
  },
};
```

---

## 5. 계산 로직 (`public/scripts/basic-pension-eligibility-calculator.js`)

`livelihood-benefit-income-recognition.js`와 동일한 구조(상태 객체 → 계산 함수 → 렌더 함수 → 이벤트 바인딩)를 따르되, 기초연금 전용 공식을 적용한다.

```js
(() => {
  const root = document.querySelector(".bpec-page");
  const dataEl = document.getElementById("bpec-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    householdType: "single",
    region: "metro",
    earnedIncome: 0,
    publicPensionIncome: 300000, // 국민연금 등 기타소득
    generalAsset: 150000000,
    financialAsset: 10000000,
    debt: 0,
    hasLuxuryAsset: false, // 고급자동차·회원권 등 — 확인 필요 플래그
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  // 소득평가액 = 0.7 × (근로소득 - 116만원, 최소 0) + 기타소득(국민연금 등)
  function calcIncomeEvaluation(s) {
    const earnedAfterDeduction = Math.max(s.earnedIncome - cfg.workIncomeDeduction, 0);
    const earnedEvaluated = earnedAfterDeduction * cfg.workIncomeRate;
    return earnedEvaluated + s.publicPensionIncome;
  }

  // 재산의 소득환산액 = [{(일반재산 - 기본재산공제액) + (금융재산 - 2000만원) - 부채} × 4% ÷ 12]
  function calcAssetConversion(s) {
    const basicDeduction = cfg.basicAssetDeduction[s.region] || 0;
    const generalAfterDeduction = Math.max(s.generalAsset - basicDeduction, 0);
    const financialAfterDeduction = Math.max(s.financialAsset - cfg.financialAssetDeduction, 0);
    const netAsset = Math.max(generalAfterDeduction + financialAfterDeduction - s.debt, 0);
    const monthlyConverted = (netAsset * cfg.assetConversionRateAnnual) / 12;
    return { basicDeduction, generalAfterDeduction, financialAfterDeduction, netAsset, monthlyConverted };
  }

  function calculate(s) {
    const incomeEvaluation = calcIncomeEvaluation(s);
    const asset = calcAssetConversion(s);
    const incomeRecognized = incomeEvaluation + asset.monthlyConverted;
    const threshold = cfg.selectionThreshold[s.householdType];
    const gap = threshold - incomeRecognized;
    const ratio = incomeRecognized / threshold;

    let judgement = "기준 초과 (수급 어려움)";
    if (ratio <= 0.9) judgement = "수급 가능성 높음";
    else if (ratio <= 1.0) judgement = "경계 구간 (조사 결과에 따라 달라질 수 있음)";

    const maxBenefit = cfg.maxBenefit[s.householdType];
    const estimatedBenefit = incomeRecognized < threshold ? maxBenefit : 0;

    return {
      incomeEvaluation,
      asset,
      incomeRecognized,
      threshold,
      gap,
      ratio,
      judgement,
      estimatedBenefit,
    };
  }

  function readState() {
    state.householdType = $('[data-bpec="householdType"]').value;
    state.region = $('[data-bpec="region"]').value;
    state.earnedIncome = num($('[data-bpec="earnedIncome"]').value);
    state.publicPensionIncome = num($('[data-bpec="publicPensionIncome"]').value);
    state.generalAsset = num($('[data-bpec="generalAsset"]').value);
    state.financialAsset = num($('[data-bpec="financialAsset"]').value);
    state.debt = num($('[data-bpec="debt"]').value);
    state.hasLuxuryAsset = $('[data-bpec="hasLuxuryAsset"]').checked;
  }

  function render() {
    const result = calculate(state);
    $('[data-bpec-result="incomeRecognized"]').textContent = won(result.incomeRecognized);
    $('[data-bpec-result="threshold"]').textContent = won(result.threshold);
    $('[data-bpec-result="benefit"]').textContent = won(result.estimatedBenefit);
    $('[data-bpec-result="gap"]').textContent = won(Math.abs(result.gap));
    $('[data-bpec-result="judgement"]').textContent = result.judgement;

    const gaugeFill = $("[data-bpec-gauge-fill]");
    if (gaugeFill) gaugeFill.style.width = `${Math.min(result.ratio * 100, 100)}%`;

    const breakdown = $("[data-bpec-breakdown]");
    if (breakdown) {
      breakdown.innerHTML = `
        <p>소득평가액: ${won(result.incomeEvaluation)}</p>
        <p>재산 소득환산액: ${won(result.asset.monthlyConverted)}</p>
        <p>(기본재산공제 후 일반재산: ${won(result.asset.generalAfterDeduction)} · 금융재산공제 후: ${won(result.asset.financialAfterDeduction)})</p>
      `;
    }

    const warnings = $("[data-bpec-warnings]");
    if (warnings) {
      warnings.innerHTML = state.hasLuxuryAsset
        ? `<p>⚠ 고급자동차·회원권은 별도 소득환산(월 100%)이 적용되어 이 결과보다 소득인정액이 높아질 수 있습니다. 주민센터 확인이 필요합니다.</p>`
        : "";
    }
  }

  $$("[data-bpec]").forEach((el) => el.addEventListener("input", render));
  $$("[data-bpec-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = cfg.presets.find((p) => p.id === btn.dataset.bpecPreset);
      if (!preset) return;
      Object.entries(preset.input).forEach(([key, value]) => {
        const el = $(`[data-bpec="${key}"]`);
        if (!el) return;
        if (el.type === "checkbox") el.checked = Boolean(value);
        else el.value = String(value);
      });
      render();
    });
  });

  render();
})();
```

---

## 6. Astro 페이지 핵심 섹션 (`src/pages/tools/basic-pension-eligibility-calculator.astro`)

`livelihood-benefit-income-recognition.astro`를 그대로 복제하여 다음만 교체한다:

- import 대상: `BPEC_*` 심볼들
- `CalculatorHero`: eyebrow="기초연금 계산", title="기초연금 수급 가능성 계산기", description="가구 형태와 소득, 재산을 입력하면 2026년 기초연금 선정기준 대비 소득인정액과 수급 가능성을 빠르게 확인합니다."
- `InfoNotice` lines: `BPEC_META.dataNote` + "입력값은 브라우저에서만 계산되며 서버로 전송하지 않습니다." + "국민연금 연계 감액·소득역전방지 감액은 반영하지 않았습니다."
- aside 입력 패널: 가구형태(단독/부부) select, 거주지역 select, 월 근로소득 input, 공적연금 등 기타소득 input, 일반재산 input, 금융재산 input, 부채 input, 고급자동차·회원권 checkbox
- 결과 KPI 4개: 소득인정액 추정 / 선정기준액 / 예상 기초연금액 / 기준까지 차이
- 게이지 바, 소득인정액 구성 분해, 확인 필요 항목 + 관련 계산기 링크(`national-pension-calculator`, `livelihood-benefit-income-recognition`, `basic-livelihood-recipient-asset-standard`, `/compare/welfare/`)
- `SeoContent`: `BPEC_SEO_CONTENT.introTitle/intro/inputPoints/criteria`, `faq={BPEC_FAQ}`, `related={BPEC_RELATED_LINKS}`
- JSON-LD: `WebApplication` + `FAQPage` (기존 패턴과 동일)

---

## 7. SCSS (`_basic-pension-eligibility-calculator.scss`)

기존 `_livelihood-benefit-income-recognition.scss`의 클래스 네이밍(`.lbirc-*`)을 `.bpec-*`로 그대로 치환해 복제한다. 신규 디자인 토큰 없이 동일한 KPI 그리드, 게이지 바, breakdown 카드, warning 카드 스타일을 재사용한다.

---

## 8. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | 신규 항목 추가 (아래 예시) |
| `src/styles/app.scss` | `@use 'scss/pages/basic-pension-eligibility-calculator';` 추가 |
| `public/sitemap.xml` | `/tools/basic-pension-eligibility-calculator/` 추가 |
| `src/data/nationalPensionCalculator.ts` 등 | 관련 링크에 본 계산기 추가 검토 |
| `src/pages/compare/welfare.astro` (있다면) | 비교표에 항목 추가 검토 |

```ts
{
  slug: "basic-pension-eligibility-calculator",
  title: "기초연금 수급 가능성 계산기 2026",
  description: "가구 형태, 소득, 재산을 입력해 2026년 기초연금 선정기준 대비 소득인정액과 예상 기초연금액을 자가 점검용으로 계산합니다.",
  order: 11.72,
  eyebrow: "기초연금 수급 가능성",
  category: "support",
  iframeReady: true,
  badges: ["신규", "기초연금", "2026"],
  previewStats: [
    { label: "핵심 결과", value: "예상 수급액" },
    { label: "기준 비교", value: "선정기준액" }
  ]
}
```

---

## 9. QA 포인트

- [ ] 단독가구 선정기준액 2,470,000원, 부부가구 3,952,000원이 정확히 반영됨
- [ ] 근로소득 116만원 이하 입력 시 소득평가액에 근로소득 반영분이 0원으로 처리됨
- [ ] 지역별 기본재산공제액(1.35억/8,500만/7,250만)이 정확히 분기됨
- [ ] 금융재산 2,000만원 공제가 일반재산 공제와 별도로 적용됨
- [ ] 부부가구 선택 시 예상 기초연금액이 단독가구보다 낮게 표시됨 (부부감액 반영)
- [ ] 고급자동차·회원권 체크 시 경고 문구만 노출되고 금액 계산에는 포함되지 않음
- [ ] InfoNotice·FAQ·결과 화면 3곳에 모두 "국민연금 연계 감액 미반영" 고지가 있음
- [ ] intro 5단락 이상 800자 이상, FAQ 6개
- [ ] `npm run build` 성공
- [ ] (신규 인터랙티브 계산 로직이므로) 프리셋 4개 클릭 시 입력값과 결과가 모두 정확히 갱신되는지 브라우저 검증 필요

---

## 10. 구현 리스크

- **국민연금 연계 감액 누락에 대한 오인 리스크**: 국민연금을 오래 받은 부모님 케이스는 이 계산기 결과보다 실제 지급액이 낮을 수 있음 — FAQ 1번, InfoNotice, SEO intro 4번째 단락에서 반복 고지.
- **부부 1인당 최대 지급액(279,760원)은 단순 환산값**: 정확한 고시액이 아니므로 구현 전 복지로 모의계산으로 한 번 더 교차검증 권장. 검증 후 다르면 `BPEC_MAX_BENEFIT.couple` 값만 교체하면 되는 구조로 설계함.
- **재산의 소득환산율 4% 추가 검증**: 보건복지부 고시 원문 확인이 가장 안전하나, 2개의 독립된 보도/생활법령정보 출처에서 동일하게 확인되어 신뢰도는 높은 편.
- **생계급여 상수 혼용 방지**: 코드 리뷰 시 `welfareBenefitEligibility.ts`의 심볼을 import하지 않았는지 반드시 확인.
