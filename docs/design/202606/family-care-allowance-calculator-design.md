# 가족돌봄수당(조부모 돌봄수당) 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/family-care-allowance-calculator`
- **유형**: 계산기 (복지 자가 점검형)
- **prefix**: `fcac-` (Family Care Allowance Calculator)
- **데이터 파일**: `src/data/familyCareAllowanceCalculator.ts`
- **스크립트**: `public/scripts/family-care-allowance-calculator.js`
- **스타일**: `src/styles/scss/pages/_family-care-allowance-calculator.scss`
- **레이아웃**: `SimpleToolShell` (직전 구현한 `basic-pension-eligibility-calculator.astro`와 동일한 IA·인터랙션 구조를 그대로 복제)
- **기획 문서**: `docs/plan/202606/family-care-allowance-calculator-plan.md`

### 핵심 원칙 (절대 위반 금지)

1. **거주 지역 조건은 절대 "확정 가능"으로 표시하지 않는다.** 나이·소득·돌봄시간 3개 조건은 일반 기준으로 1차 판정하지만, 지역(시군구) 참여 여부는 항상 "확인 필요" 배지로 고정 표시한다.
2. **이 제도는 전국 통일 제도가 아니라 지자체별 자체 사업**이라는 점을 InfoNotice·FAQ·결과 화면 3곳에서 반복 고지한다.
3. **최대 지원개월 수는 지역에 따라 다르다** (설계 단계 추가 검증: 서울 최대 13개월, 그 외 지역은 12개월 운영 사례 확인). 고정값으로 단정하지 않고 지역 선택에 따라 다른 값을 보여주되, 반드시 "지자체 공고 기준 확인 필요" 안내를 동반한다.
4. 건강보험료 기준표의 5인·6인 가구 값은 설계 단계에서도 정확한 수치를 확정하지 못했다 — **"추정" 배지를 달고, 실제 판정 시 보건복지부·복지로 공식 기준표 확인을 권장하는 안내를 추가**한다 (1인~4인은 다수 출처 교차검증으로 확인됨 배지 사용 가능).

---

## 2. 사실 검증 결과 (2026년 기준, 설계 단계 추가 검증 포함)

### 대상·조건
| 항목 | 값 | 확인 상태 |
|---|---|---|
| 대상 연령 | 만 24개월~36개월 이하 (일부 지자체 47개월까지) | 확인됨 |
| 우선 대상 | 맞벌이·한부모·다문화·다자녀·장애 부모 가정 | 확인됨 |
| 돌봄 제공자 범위 | 조부모 + 4촌 이내 친인척(이모, 삼촌 등) 가능 지자체 있음 | 확인됨 |
| 필수 돌봄시간 | 월 40시간 이상 (하루 최대 4시간, 06:00~22:00만 인정) | 확인됨 |
| 부가 의무 | 돌봄일지 작성, 사전 교육(돌봄 안전·아동발달) 이수 | 확인됨 |

### 소득 기준 — 2026년 중위소득 150% 건강보험료 본인부담금 판정기준표 (직장가입자, 장기요양보험료 제외)
| 가구원수 | 기준액(원) | 배지 |
|---|---|---|
| 1인 | 138,780 | 확인됨 |
| 2인 | 229,357 | 확인됨 |
| 3인 | 290,169 | 확인됨 |
| 4인 | 360,410 | 확인됨 |
| 5인 | 약 410,000 (정확한 값 미확정) | 추정 |
| 6인 | 약 490,000 (정확한 값 미확정) | 추정 |

> 판정 시점 주의: 신청일 소득이 아니라 **해당 연도 특정 기준일(보통 3월 말경)의 건강보험료 납부 기록**으로 판정하는 방식이 일반적 — FAQ에서 명확히 고지.

### 지원금액
| 자녀(돌봄대상) 수 | 월 지원금 |
|---|---|
| 1명 | 30만원 |
| 2명 | 45만원 |
| 3명 이상 | 최대 60만원 |

> 일부 자치구(은평·도봉·성북 등)는 자체 예산으로 +10~15만원 추가 지원 — 계산기에는 반영하지 않고 안내 문구로만 고지(지자체별 추가 지원 변동성이 커서 정확한 모델링이 어려움).

### 최대 지원개월 (설계 단계 추가 검증, 지역별로 다름)
| 지역 | 최대 지원개월 | 확인 상태 |
|---|---|---|
| 서울 | 13개월 (30만원×13개월=최대 390만원, 자녀1명 기준) | 확인됨(서울형 기준) |
| 경기·기타 | 12개월 (30만원×12개월=최대 360만원, 자녀1명 기준) 운영 사례 확인 | 확인됨(사례 기준, 전체 지자체 일반화 아님) |

### 신청 절차
- 매월 1~15일 신청 → 해당 월부터 지급 / 16일 이후 신청 → 다음 달부터 지급
- 서울: "몽땅정보 만능키" / 경기: "경기 민원24" / 기타: 주소지 읍면동 주민센터

---

## 3. 화면 구성 (IA) — `basic-pension-eligibility-calculator.astro`와 동일 골격

```text
[BaseLayout]
  SiteHeader
  SimpleToolShell(calculatorId="family-care-allowance-calculator", pageClass="fcac-page")
    slot="hero": CalculatorHero + InfoNotice (지자체별 자체 사업 고지)
    slot="actions": ToolActionBar
    slot="aside":
      - 빠른 기준 패널 (대상연령 24~36개월, 지원금 1자녀 30만원 등)
      - 프리셋 4개 버튼
      - 입력 패널 (지역/아이 생년월/신청월/자녀수/가구원수/건강보험료/돌봄공백/돌봄시간)
    메인 영역:
      - 종합 판정 결과 카드 (가능성 높음 / 일부 조건 미충족 / 확인 필요)
      - 조건별 체크리스트 (나이·소득·돌봄시간·지역 4항목, 지역은 항상 "확인 필요")
      - 예상 지원금 카드 (월 지원금 × 최대 지원개월)
      - "왜 확인이 더 필요한가" 안내 카드
    slot="seo": SeoContent

  <script id="fcac-data" type="application/json">...</script>
  <script type="module" src="/scripts/family-care-allowance-calculator.js">
```

---

## 4. 데이터 파일 (`src/data/familyCareAllowanceCalculator.ts`)

```ts
export type RegionType = "seoul" | "gyeonggi" | "etc";
export type CareGapReason = "dual_income" | "single_parent" | "multi_child" | "disabled_parent" | "none";
export type JudgementLevel = "likely" | "partial" | "needs_check";

export interface FcacPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const FCAC_META = {
  slug: "family-care-allowance-calculator",
  title: "가족돌봄수당 계산기 2026",
  seoTitle: "가족돌봄수당 계산기 | 조부모 돌봄수당 신청 가능 여부·예상 지원금",
  seoDescription:
    "아이 생년월, 소득, 돌봄시간을 입력해 가족돌봄수당(조부모 돌봄수당) 신청 가능성과 예상 지원금을 자가 점검합니다. 24~36개월, 월 30만~60만원 기준을 한 번에 확인하세요.",
  dataNote:
    "가족돌봄수당은 전국 통일 제도가 아니라 시·도 및 시군구별 자체 사업입니다. 나이·소득·돌봄시간은 일반적인 기준으로 1차 점검하지만, 거주 지역의 사업 참여 여부는 반드시 별도로 확인해야 합니다. 이 계산기의 결과는 확정 수급 여부가 아닌 자가 점검용 추정입니다.",
  updatedAt: "2026-06-25",
};

export const FCAC_REGION_LABELS: Record<RegionType, string> = {
  seoul: "서울",
  gyeonggi: "경기도",
  etc: "기타 지역",
};

export const FCAC_CARE_GAP_LABELS: Record<CareGapReason, string> = {
  dual_income: "맞벌이",
  single_parent: "한부모",
  multi_child: "다자녀",
  disabled_parent: "장애 부모",
  none: "해당 없음",
};

// 2026년 중위소득 150% 건강보험료 본인부담금 기준 (직장가입자, 장기요양보험료 제외)
export const FCAC_INCOME_THRESHOLD: Record<number, { value: number; badge: "확인됨" | "추정" }> = {
  1: { value: 138_780, badge: "확인됨" },
  2: { value: 229_357, badge: "확인됨" },
  3: { value: 290_169, badge: "확인됨" },
  4: { value: 360_410, badge: "확인됨" },
  5: { value: 410_000, badge: "추정" },
  6: { value: 490_000, badge: "추정" },
};

export const FCAC_MONTHLY_AMOUNT_BY_CHILD: Record<number, number> = {
  1: 300_000,
  2: 450_000,
  3: 600_000, // 3명 이상은 동일 적용
};

// 지역별 최대 지원개월 (서울 13개월 확인, 그 외 12개월 운영 사례 — 전체 지자체 일반화 아님)
export const FCAC_MAX_MONTHS_BY_REGION: Record<RegionType, number> = {
  seoul: 13,
  gyeonggi: 12,
  etc: 12,
};

export const FCAC_MIN_AGE_MONTHS = 24;
export const FCAC_MAX_AGE_MONTHS = 36;
export const FCAC_MIN_CARE_HOURS = 40;

export const FCAC_PRESETS: FcacPreset[] = [
  {
    id: "seoul-dual-income",
    label: "서울, 맞벌이",
    summary: "아이 24개월 진입 · 가구 3인 · 건강보험료 27만원",
    input: { region: "seoul", childBirthYear: 2025, childBirthMonth: 3, applyYear: 2027, applyMonth: 3, childCount: 1, householdSize: 3, healthInsuranceFee: 270000, careGapReason: "dual_income", monthlyCareHours: 40 },
  },
  {
    id: "gyeonggi-multi-child",
    label: "경기도, 다자녀",
    summary: "자녀 2명 돌봄 · 가구 4인 · 건강보험료 33만원",
    input: { region: "gyeonggi", childBirthYear: 2025, childBirthMonth: 1, applyYear: 2027, applyMonth: 6, childCount: 2, householdSize: 4, healthInsuranceFee: 330000, careGapReason: "multi_child", monthlyCareHours: 45 },
  },
  {
    id: "etc-borderline",
    label: "기타 지역, 경계 사례",
    summary: "건강보험료 기준 근접 · 돌봄시간 부족 가능성",
    input: { region: "etc", childBirthYear: 2025, childBirthMonth: 6, applyYear: 2027, applyMonth: 7, childCount: 1, householdSize: 3, healthInsuranceFee: 295000, careGapReason: "single_parent", monthlyCareHours: 35 },
  },
  {
    id: "seoul-not-eligible-age",
    label: "서울, 아직 24개월 미만",
    summary: "신청 시점이 너무 빠른 케이스",
    input: { region: "seoul", childBirthYear: 2026, childBirthMonth: 1, applyYear: 2027, applyMonth: 6, childCount: 1, householdSize: 3, healthInsuranceFee: 200000, careGapReason: "dual_income", monthlyCareHours: 40 },
  },
];

export const FCAC_FAQ = [
  {
    question: "가족돌봄수당은 전국 어디서나 받을 수 있나요?",
    answer:
      "아닙니다. 가족돌봄수당은 전국 통일 제도가 아니라 시·도 및 시군구별 자체 사업입니다. 같은 경기도 안에서도 시군마다 참여 여부가 다르고, 참여하지 않는 지자체도 있습니다. 이 계산기는 나이·소득·돌봄시간 조건만 일반 기준으로 점검하며, 거주 지역의 실제 참여 여부는 반드시 주민센터나 해당 지자체 공고로 별도 확인해야 합니다.",
  },
  {
    question: "소득 기준은 신청일 기준 소득인가요?",
    answer:
      "아닙니다. 대부분 지자체는 신청일이 아니라 해당 연도의 특정 기준일(보통 3월 말경)의 건강보험료 납부 기록을 기준으로 소득을 판정합니다. 신청 시점에 소득이 바뀌었더라도 기준일 당시 자료로 판정되니, 정확한 기준일은 신청 지자체 공고에서 확인해야 합니다.",
  },
  {
    question: "16일에 신청하면 어떻게 되나요?",
    answer:
      "대부분 지자체는 매월 1일~15일 신청 시 해당 월부터 지급하고, 16일 이후 신청하면 다음 달부터 지급합니다. 신청을 미루면 한 달치 지원금을 못 받을 수 있으니 신청 시점을 꼭 챙겨야 합니다.",
  },
  {
    question: "조부모가 아니어도 가족돌봄수당을 받을 수 있나요?",
    answer:
      "네, 일부 지자체는 조부모뿐 아니라 4촌 이내 친인척(이모, 삼촌 등)도 돌봄 제공자로 인정합니다. 다만 인정 범위는 지자체마다 다르므로 신청 전 확인이 필요합니다.",
  },
  {
    question: "어린이집을 같이 이용하면 못 받나요?",
    answer:
      "대부분 지자체는 어린이집 등 보육시설을 이용하는 시간과 가족돌봄 시간이 중복되지 않아야 한다는 조건을 둡니다. 어린이집을 일부 이용하면서 나머지 시간에 가족돌봄을 받는 경우 인정 여부가 지자체마다 다를 수 있어 별도 확인이 필요합니다.",
  },
  {
    question: "최대 지원개월은 지역마다 다른가요?",
    answer:
      "네, 다릅니다. 서울은 최대 13개월(자녀 1명 기준 최대 390만원), 다른 일부 지역은 12개월(최대 360만원)로 운영되는 사례가 확인됩니다. 이 계산기는 선택한 지역에 따라 다른 최대 개월을 보여주지만, 정확한 개월 수는 신청하는 지자체 공고로 다시 확인해야 합니다.",
  },
];

export const FCAC_RELATED_LINKS = [
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직급여 계산기" },
  { href: "/tools/daycare-vs-kindergarten-cost/", label: "어린이집 vs 유치원 비용 비교" },
];

export const FCAC_SEO_CONTENT = {
  introTitle: "가족돌봄수당, 우리 아이도 받을 수 있을까?",
  intro: [
    "조부모나 친척에게 아이를 맡기는 가정이 늘면서 '가족돌봄수당'(조부모 돌봄수당, 손주 돌봄수당)에 대한 관심도 함께 커지고 있습니다. 하지만 막상 알아보면 나이 기준, 소득 기준, 거주 지역 조건이 한꺼번에 얽혀 있어 내가 신청 대상인지조차 가늠하기 어렵습니다. 이 계산기는 아이 생년월, 가구 소득, 돌봄 시간을 입력해 신청 전에 스스로 점검할 수 있도록 만든 자가 점검용 도구입니다.",
    "가족돌봄수당은 보통 만 24개월부터 36개월 이하 아이를 대상으로 하며, 맞벌이·한부모·다문화·다자녀·장애 부모 가정이 우선 대상입니다. 소득 기준은 기준 중위소득 150% 이하로, 가구원 수별 건강보험료 본인부담금(장기요양보험료 제외) 합산액이 일정 기준 이하여야 합니다. 지원금은 돌봄대상 자녀 수에 따라 1명 월 30만원, 2명 월 45만원, 3명 이상 월 최대 60만원으로 차등 지급됩니다.",
    "가장 헷갈리기 쉬운 부분은 이 제도가 전국 통일 제도가 아니라는 점입니다. 가족돌봄수당은 시·도와 시군구별 자체 사업으로 운영되기 때문에, 같은 경기도 안에서도 참여하는 시군과 참여하지 않는 시군이 나뉩니다. 그래서 이 계산기는 나이·소득·돌봄시간은 일반 기준으로 점검하지만, 거주 지역의 실제 참여 여부는 항상 '확인 필요'로 별도 표시합니다.",
    "최대 지원 개월도 지역마다 다릅니다. 서울은 최대 13개월(자녀 1명 기준 최대 390만원)까지 지원하는 것으로 확인되고, 다른 일부 지역은 12개월(최대 360만원) 기준으로 운영되는 사례가 있습니다. 또한 소득 기준 판정은 신청일이 아니라 해당 연도의 특정 기준일(보통 3월 말경) 건강보험료 납부 기록을 사용하는 경우가 많아, 신청 시점과 기준일이 다르면 결과가 달라질 수 있습니다.",
    "이 계산기는 신청 결과를 보장하지 않는 자가 점검용 추정입니다. 돌봄시간은 월 40시간 이상이면서 하루 최대 4시간, 오전 6시부터 오후 10시 사이여야 인정되는 등 세부 규정이 있고, 돌봄일지 작성과 사전 교육 이수 같은 추가 의무도 있습니다. 정확한 신청 가능 여부와 지원금은 반드시 주소지 읍면동 주민센터나 해당 지자체 공고에서 최종 확인해야 합니다.",
  ],
  inputPoints: [
    "아이 생년월과 신청 예정월을 넣으면 24~36개월 대상 기간을 바로 확인할 수 있습니다.",
    "건강보험료를 넣으면 가구원 수 기준 소득 충족 여부를 점검할 수 있습니다.",
    "자녀 수와 지역을 선택하면 예상 월 지원금과 최대 총 지원금을 볼 수 있습니다.",
  ],
  criteria: [
    "대상 연령, 소득 기준, 지원금액은 2026년 기준 다수 지자체 공통 운영 기준을 참고했습니다.",
    "거주 지역의 사업 참여 여부는 일반 기준으로 판정할 수 없어 항상 '확인 필요'로 표시합니다.",
    "최대 지원개월은 지역별로 다르며(서울 13개월, 그 외 12개월 사례), 정확한 값은 지자체 공고로 재확인해야 합니다.",
    "이 계산기는 확정 수급 여부가 아닌 자가 점검용 추정이며, 최종 확인은 주민센터에서 해야 합니다.",
  ],
};

export const FCAC_CONFIG = {
  incomeThreshold: FCAC_INCOME_THRESHOLD,
  monthlyAmountByChild: FCAC_MONTHLY_AMOUNT_BY_CHILD,
  maxMonthsByRegion: FCAC_MAX_MONTHS_BY_REGION,
  minAgeMonths: FCAC_MIN_AGE_MONTHS,
  maxAgeMonths: FCAC_MAX_AGE_MONTHS,
  minCareHours: FCAC_MIN_CARE_HOURS,
  presets: FCAC_PRESETS,
  labels: {
    region: FCAC_REGION_LABELS,
    careGap: FCAC_CARE_GAP_LABELS,
  },
};
```

---

## 5. 계산 로직 (`public/scripts/family-care-allowance-calculator.js`)

`basic-pension-eligibility-calculator.js`와 동일한 구조(상태 → 계산 함수 → 렌더 → 이벤트)를 따른다.

```js
(() => {
  const root = document.querySelector(".fcac-page");
  const dataEl = document.getElementById("fcac-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    region: "seoul",
    childBirthYear: 2025,
    childBirthMonth: 3,
    applyYear: 2027,
    applyMonth: 3,
    childCount: 1,
    householdSize: 3,
    healthInsuranceFee: 270000,
    careGapReason: "dual_income",
    monthlyCareHours: 40,
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function calcAgeMonths(s) {
    return (s.applyYear - s.childBirthYear) * 12 + (s.applyMonth - s.childBirthMonth);
  }

  function calculate(s) {
    const ageMonths = calcAgeMonths(s);
    const isAgeEligible = ageMonths >= cfg.minAgeMonths && ageMonths <= cfg.maxAgeMonths;
    const isCareGapEligible = s.careGapReason !== "none";
    const isCareHoursEligible = s.monthlyCareHours >= cfg.minCareHours;

    const incomeEntry = cfg.incomeThreshold[Math.min(s.householdSize, 6)] || cfg.incomeThreshold[6];
    const isIncomeEligible = s.healthInsuranceFee <= incomeEntry.value;

    const childCountKey = Math.min(s.childCount, 3);
    const monthlyAmount = cfg.monthlyAmountByChild[childCountKey] || 0;
    const maxMonths = cfg.maxMonthsByRegion[s.region] || 12;
    const maxTotalAmount = monthlyAmount * maxMonths;

    const coreEligible = isAgeEligible && isCareGapEligible && isCareHoursEligible && isIncomeEligible;
    let judgement = "needs_check";
    if (!isAgeEligible || !isCareGapEligible) judgement = "partial";
    else if (coreEligible) judgement = "likely";
    else judgement = "partial";

    return {
      ageMonths,
      isAgeEligible,
      isCareGapEligible,
      isCareHoursEligible,
      isIncomeEligible,
      incomeEntry,
      monthlyAmount,
      maxMonths,
      maxTotalAmount,
      judgement,
    };
  }

  function judgementLabel(level) {
    if (level === "likely") return "가능성 높음 (지역 참여 여부는 별도 확인)";
    if (level === "partial") return "일부 조건 미충족";
    return "확인 필요";
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function readState() {
    state.region = $('[data-fcac="region"]').value;
    state.childBirthYear = num($('[data-fcac="childBirthYear"]').value, initialState.childBirthYear);
    state.childBirthMonth = num($('[data-fcac="childBirthMonth"]').value, initialState.childBirthMonth);
    state.applyYear = num($('[data-fcac="applyYear"]').value, initialState.applyYear);
    state.applyMonth = num($('[data-fcac="applyMonth"]').value, initialState.applyMonth);
    state.childCount = num($('[data-fcac="childCount"]').value, 1);
    state.householdSize = num($('[data-fcac="householdSize"]').value, 3);
    state.healthInsuranceFee = num($('[data-fcac="healthInsuranceFee"]').value);
    state.careGapReason = $('[data-fcac="careGapReason"]').value;
    state.monthlyCareHours = num($('[data-fcac="monthlyCareHours"]').value);
  }

  function setControl(key, value) {
    const el = $(`[data-fcac="${key}"]`);
    if (!el) return;
    el.value = String(value);
  }

  function render(result) {
    $('[data-fcac-result="judgement"]').textContent = judgementLabel(result.judgement);
    $('[data-fcac-result="ageCheck"]').textContent = result.isAgeEligible ? "충족" : "미충족";
    $('[data-fcac-result="incomeCheck"]').textContent = result.isIncomeEligible ? "충족" : "미충족";
    $('[data-fcac-result="careHoursCheck"]').textContent = result.isCareHoursEligible ? "충족" : "미충족";
    $('[data-fcac-result="regionCheck"]').textContent = "확인 필요"; // 항상 고정
    $('[data-fcac-result="monthlyAmount"]').textContent = won(result.monthlyAmount);
    $('[data-fcac-result="maxTotal"]').textContent = `${won(result.maxTotalAmount)} (최대 ${result.maxMonths}개월)`;
    $('[data-fcac-result="incomeBadge"]').textContent = result.incomeEntry.badge;
  }

  function refresh() {
    readState();
    render(calculate(state));
  }

  $$("[data-fcac]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-fcac-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.fcacPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#fcacResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#fcacCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#fcacCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#fcacCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#fcacCopyBtn").textContent = "복사 실패";
    }
  });

  refresh();
})();
```

> `judgement` 로직 핵심: 지역(거주지) 조건은 계산에 넣지 않고 **항상 별도 "확인 필요" 텍스트로 고정**한다. 종합 판정에 "가능"이라는 단어를 쓸 때도 반드시 "지역 참여 여부는 별도 확인"이라는 괄호 문구를 함께 붙인다 (원칙 1번 강제).

---

## 6. Astro 페이지 핵심 섹션

`basic-pension-eligibility-calculator.astro`를 복제하여 다음만 교체:

- import 대상: `FCAC_*` 심볼
- `CalculatorHero`: title="가족돌봄수당 계산기", description="아이 생년월과 가구 소득, 돌봄시간을 입력하면 가족돌봄수당 신청 가능성과 예상 지원금을 빠르게 점검합니다."
- `InfoNotice` lines: `FCAC_META.dataNote` + "거주 지역의 사업 참여 여부는 반드시 별도로 확인해야 합니다." + "최대 지원개월은 지역에 따라 다릅니다."
- aside 입력 패널: 지역 select(서울/경기/기타), 아이 생년/월, 신청 예정 연/월, 자녀(돌봄대상) 수, 가구원 수, 건강보험료, 돌봄공백 사유 select, 월 돌봄시간
- 결과 섹션: 종합 판정 카드(상단) + 조건별 체크리스트 4항목(나이/소득/돌봄시간/지역 — 지역만 항상 "확인 필요" 스타일 다르게) + 예상 지원금 카드(월 지원금, 최대 총액 + 최대개월)
- "왜 확인이 더 필요한가" 카드: 지자체별 자체 사업, 소득기준 판정 시점, 최대 지원개월 지역차 3가지를 텍스트로 강조
- `SeoContent`: `FCAC_SEO_CONTENT.*`, `faq={FCAC_FAQ}`, `related={FCAC_RELATED_LINKS}`

---

## 7. SCSS

`_livelihood-benefit-income-recognition.scss` / `_basic-pension-eligibility-calculator.scss`의 클래스명을 `.fcac-*`로 치환해 그대로 복제. 신규 토큰 불필요. 단, "지역 확인 필요" 체크리스트 항목은 다른 항목과 시각적으로 구분되도록 주의색(`#fffbeb` 배경, `#92400e` 텍스트)을 추가:

```scss
.fcac-check-item--region {
  border-color: #f6d58f;
  background: #fffbeb;
}
```

---

## 8. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | 신규 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/family-care-allowance-calculator';` |
| `public/sitemap.xml` | `/tools/family-care-allowance-calculator/` 추가 |
| `src/pages/index.astro` | `topicBySlug`에 `"family-care-allowance-calculator": "복지·지원금"` 추가 (최근 누락 사고 재발 방지 — 처음부터 함께 등록) |
| 관련 계산기 4개 | `relatedLinks`에 본 계산기 상호 추가 검토 |

```ts
{
  slug: "family-care-allowance-calculator",
  title: "가족돌봄수당 계산기 2026",
  description: "아이 생년월, 소득, 돌봄시간을 입력해 가족돌봄수당(조부모 돌봄수당) 신청 가능성과 예상 지원금을 자가 점검용으로 계산합니다.",
  order: 11.73,
  eyebrow: "가족돌봄수당 자가점검",
  category: "support",
  iframeReady: true,
  badges: ["신규", "가족돌봄수당", "2026"],
  previewStats: [
    { label: "핵심 결과", value: "예상 지원금" },
    { label: "기준 비교", value: "24~36개월" }
  ]
}
```

---

## 9. QA 포인트

- [ ] 지역(거주지) 조건이 입력값과 무관하게 항상 "확인 필요"로 표시됨
- [ ] 종합 판정이 "가능성 높음"일 때도 "지역 참여 여부는 별도 확인" 문구가 함께 노출됨
- [ ] 24개월 미만/36개월 초과 입력 시 나이 조건 "미충족"으로 정확히 표시됨
- [ ] 가구원수 5·6인 선택 시 건강보험료 기준에 "추정" 배지가 노출됨
- [ ] 지역을 서울→경기로 바꾸면 최대 지원개월이 13→12로 바뀌고 총 지원금도 재계산됨
- [ ] InfoNotice·결과화면·FAQ 3곳 모두 "지자체별 자체 사업" 고지가 있음
- [ ] intro 5단락 이상 800자 이상, FAQ 6개
- [ ] `npm run build` 성공
- [ ] (신규 계산 로직 포함 — 프리셋 4개 클릭 시 입력값·판정·지원금이 모두 정확히 갱신되는지 브라우저 검증 필요, 특히 "서울, 아직 24개월 미만" 프리셋이 정확히 "미충족"으로 뜨는지)

---

## 10. 구현 리스크

- **지역 조건 오인 리스크(최우선)**: 코드 리뷰 시 `judgement` 계산에 지역 변수가 섞여 "지역 조건까지 충족"으로 보이는 문구가 생기지 않는지 반드시 확인.
- **5·6인 가구 기준액 미확정**: 추정 배지 유지, 향후 보건복지부·복지로 공식 자료로 교차검증 시 업데이트.
- **최대 지원개월 지역 일반화 리스크**: "경기·기타 12개월"은 일부 운영 사례 기준이며 모든 지자체에 해당하지 않을 수 있음 — FAQ 6번에서 명확히 고지.
- **자치구 추가지원(은평·도봉·성북 등 +10~15만원) 미반영**: 계산기에는 반영하지 않고 InfoNotice/SEO 본문에서 안내만 — 정확한 모델링을 위한 자치구별 데이터가 부족하기 때문.
