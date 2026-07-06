# 고령자 임대아파트 당첨 가능성 계산기 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/senior-rental-housing-eligibility-calculator-2026-plan.md`](../../plan/202607/senior-rental-housing-eligibility-calculator-2026-plan.md)
> 작성일: 2026-07-06
> 유형: 계산기 (`/tools/`)
> 참고 구현: `src/pages/tools/gyeonggi-youth-worker-support-calculator-2026.astro` (SimpleToolShell + CompareCta + 자체 판정 로직 패턴)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/seniorRentalHousingEligibility2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/senior-rental-housing-eligibility-calculator-2026.astro` |
| 스크립트 | `public/scripts/senior-rental-housing-eligibility-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_senior-rental-housing-eligibility-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |
| 인바운드 CTA 수정 | `src/data/welfareBenefitEligibility.ts`, `src/data/basicPensionEligibilityCalculator.ts` |

---

## 2. URL 및 메타

```
슬러그: /tools/senior-rental-housing-eligibility-calculator-2026/
타이틀: 고령자 임대아파트 당첨 가능성 계산기 2026 | 점수 바로 계산
디스크립션: 나이·주택보유·소득수준·거주기간·수급자여부 입력하면 영구임대·매입임대·국민임대 당첨 가능성 점수와 추천 유형을 바로 계산. 준비서류 체크리스트 포함.
```

---

## 3. 데이터 파일 설계

**`src/data/seniorRentalHousingEligibility2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type HousingOwnership = "none" | "past" | "current";
export type IncomeLevel = "livelihood" | "nearPoverty" | "basicPensionOnly" | "veryLow" | "general";
export type HomelessYears = "under1" | "1to5" | "5to10" | "10plus";
export type ResidenceYears = "under1" | "1to3" | "3to5" | "5plus";
export type SubscriptionCount = "none" | "under6" | "6to23" | "24plus";
export type CarOwnership = "noneOrCheap" | "general" | "expensive";
export type HousingTypeId = "seniorPurchase" | "permanent" | "national" | "integrated" | "jeonse" | "happy";

export interface HousingTypeSpec {
  id: HousingTypeId;
  name: string;
  target: string;
  difficulty: "낮음" | "중간" | "중간~높음" | "높음";
  baseRank: number; // 기본 추천 순서 (1~6)
  note: string;
}

export interface ScoreItem {
  key: string;
  label: string;
  points: number; // 음수면 감점
  category: "age" | "income" | "housing" | "residence" | "readiness" | "strategy";
}

export interface JudgmentBand {
  minScore: number;
  label: string;
  message: string;
}

export interface SrhFaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

// ── 메타 ──────────────────────────────────────────

export const SRH_META = {
  slug: "senior-rental-housing-eligibility-calculator-2026",
  title: "고령자 임대아파트 당첨 가능성 계산기 2026",
  seoTitle: "고령자 임대아파트 당첨 가능성 계산기 2026 | 점수 바로 계산",
  seoDescription:
    "나이·주택보유·소득수준·거주기간·수급자여부 입력하면 영구임대·매입임대·국민임대 당첨 가능성 점수와 추천 유형을 바로 계산. 준비서류 체크리스트 포함.",
  dataNote:
    "이 계산기의 배점·판정 기준은 LH·마이홈 공개 자료를 단순화한 자가 점검용 추정입니다. 실제 배점은 공고별·지자체별 세부 기준에 따라 달라질 수 있어, 신청 전 반드시 해당 공고문을 확인해야 합니다.",
  updatedAt: "2026-07-06",
};

// ── 6개 유형 스펙 (원본 1·2절) ──────────────────────

export const SRH_HOUSING_TYPES: HousingTypeSpec[] = [
  { id: "seniorPurchase", name: "고령자 매입임대", target: "만 65세 이상 저소득 고령자", difficulty: "중간", baseRank: 1, note: "기존 주택을 LH/SH가 매입 후 임대 — 단지형보다 경쟁 낮은 경우 있음" },
  { id: "permanent", name: "영구임대 (고령자 공급)", target: "수급자·차상위·장애인·65세 이상", difficulty: "높음", baseRank: 2, note: "임대료 가장 저렴하지만 대기·경쟁 높음" },
  { id: "national", name: "국민임대 (고령자 우선공급)", target: "무주택 + 소득·자산 기준", difficulty: "중간~높음", baseRank: 3, note: "공급 물량 비교적 있음, 인기 지역 경쟁 높음" },
  { id: "integrated", name: "통합공공임대 (고령자 우선공급)", target: "무주택 + 소득·자산 기준", difficulty: "중간", baseRank: 4, note: "최근 공급 확대 유형" },
  { id: "jeonse", name: "고령자 전세임대", target: "저소득 고령자", difficulty: "중간", baseRank: 5, note: "당첨 후 직접 매물을 찾아야 하는 과정이 남음" },
  { id: "happy", name: "행복주택 (고령자형)", target: "만 65세 이상", difficulty: "중간", baseRank: 6, note: "역세권·신축 가능성 있음" },
];

// ── 배점표 (원본 10절) ────────────────────────────

export const SRH_SCORE_ITEMS: ScoreItem[] = [
  { key: "age65", label: "만 65세 이상", points: 10, category: "age" },
  { key: "age70", label: "만 70세 이상 (누적)", points: 5, category: "age" },
  { key: "incomeLivelihood", label: "기초생활수급자", points: 30, category: "income" },
  { key: "incomeNearPoverty", label: "차상위계층", points: 25, category: "income" },
  { key: "incomeVeryLow", label: "소득이 매우 낮음", points: 20, category: "income" },
  { key: "disability", label: "장애인 등록", points: 15, category: "income" },
  { key: "homeless10", label: "무주택 10년 이상", points: 20, category: "housing" },
  { key: "residence5", label: "해당 지역 거주 5년 이상", points: 15, category: "residence" },
  { key: "subscription24", label: "청약통장 24회 이상", points: 10, category: "readiness" },
  { key: "carNoneOrCheap", label: "자동차 없음 또는 저가 차량", points: 10, category: "readiness" },
  { key: "separatedFromChildren", label: "자녀와 세대분리", points: 10, category: "housing" },
  { key: "strategyPopularAreaOnly", label: "인기지역만 고집", points: -20, category: "strategy" },
  { key: "strategyNewBuildOnly", label: "신축만 고집", points: -15, category: "strategy" },
  { key: "strategySingleApplicationOnly", label: "한 공고만 신청", points: -20, category: "strategy" },
];

// 소득 수준 셀렉트 → 배점 매핑 (상호 배타적, 중복 가산 방지)
export const SRH_INCOME_LEVEL_SCORE: Record<IncomeLevel, number> = {
  livelihood: 30,
  nearPoverty: 25,
  basicPensionOnly: 0, // 별도 가산 없음 — 추천 유형 재정렬에만 반영
  veryLow: 20,
  general: 0,
};

export const SRH_HOMELESS_YEARS_SCORE: Record<HomelessYears, number> = {
  under1: 0,
  "1to5": 0,
  "5to10": 0,
  "10plus": 20,
};

export const SRH_RESIDENCE_YEARS_SCORE: Record<ResidenceYears, number> = {
  under1: 0,
  "1to3": 0,
  "3to5": 0,
  "5plus": 15,
};

export const SRH_SUBSCRIPTION_SCORE: Record<SubscriptionCount, number> = {
  none: 0,
  under6: 0,
  "6to23": 0,
  "24plus": 10,
};

export const SRH_CAR_SCORE: Record<CarOwnership, number> = {
  noneOrCheap: 10,
  general: 0,
  expensive: 0,
};

// ── 판정 기준 (원본 10절) ──────────────────────────

export const SRH_JUDGMENT_BANDS: JudgmentBand[] = [
  { minScore: 80, label: "적극 신청 권장", message: "영구임대·매입임대 당첨 가능성이 높습니다. 지금 바로 공고를 확인하세요." },
  { minScore: 50, label: "병행 신청 추천", message: "국민임대·매입임대·통합공공임대를 함께 신청하는 것을 추천합니다." },
  { minScore: 30, label: "지역 확대 필요", message: "현재 지역만으로는 부족할 수 있습니다. 인접 지역과 전세임대도 함께 검토하세요." },
  { minScore: -Infinity, label: "조건 재점검 필요", message: "소득·세대분리·자산 조건부터 다시 확인하는 것이 우선입니다." },
];

// ── FAQ ──────────────────────────────────────────

export const SRH_FAQ: SrhFaqItem[] = [
  {
    q: "이 점수가 실제 LH·SH 배점과 정확히 같나요?",
    a: "아닙니다. 이 계산기는 LH 통합공공임대 우선공급 배점 기준과 마이홈 공개 자료를 단순화한 자가 점검용 추정치입니다. 실제 배점 항목과 가중치는 공고별·지자체별로 세부 기준이 다를 수 있어 정확한 점수는 해당 공고문에서 확인해야 합니다.",
  },
  {
    q: "기초연금만 받아도 수급자로 인정되나요?",
    a: "아닙니다. 기초연금 수급은 소득·재산이 하위 70% 수준이면 받을 수 있어 기초생활수급자·차상위계층보다 기준이 넓습니다. 기초연금만 받는 경우는 배점에서 별도 가산은 없지만, 국민임대·통합공공임대 유형에서 우선 추천 대상이 됩니다.",
  },
  {
    q: "자녀와 세대가 분리되어 있어야 신청할 수 있나요?",
    a: "무주택세대구성원 판정에 영향을 줄 수 있습니다. 자녀가 주택을 소유하고 있는데 부모님이 같은 세대원으로 등재되어 있으면 무주택 요건 판단이 불리해질 수 있어, 신청 전 세대분리 여부를 먼저 확인하는 것이 중요합니다.",
  },
  {
    q: "청약통장이 없어도 신청할 수 있는 유형이 있나요?",
    a: "네, 영구임대나 고령자 매입임대처럼 수급자·차상위 등 취약계층 우선 공급 유형은 청약통장 없이도 신청 가능한 경우가 많습니다. 다만 국민임대·통합공공임대 일부 공급에서는 청약통장 납입 이력이 배점에 반영될 수 있습니다.",
  },
  {
    q: "영구임대와 고령자 매입임대 중 어디부터 넣는 게 유리한가요?",
    a: "소득 수준에 따라 다릅니다. 기초생활수급자·차상위계층이라면 영구임대가 유리하고, 소득은 낮지만 수급자가 아니라면 고령자 매입임대나 국민임대 고령자 우선공급을 먼저 검토하는 것을 추천합니다.",
  },
  {
    q: "예비입주자 순번을 받았는데 포기하면 불이익이 있나요?",
    a: "공고와 유형에 따라 재신청 제한이나 감점이 있을 수 있습니다. 포기 전 해당 공고문의 예비입주자 관련 조항과 재신청 제한 규정을 반드시 확인해야 합니다.",
  },
  {
    q: "점수가 낮게 나왔는데 지금 바로 할 수 있는 게 있나요?",
    a: "청약통장을 해지하지 않고 유지하는 것, 자녀와 세대분리를 검토하는 것, 인기 지역·신축에 집착하지 않고 여러 공고에 동시에 신청하는 것이 점수를 즉시 개선할 수 있는 실행 가능한 항목입니다.",
  },
];

// ── 준비서류 체크리스트 (원본 11절) ─────────────────

export const SRH_CHECKLIST = [
  "주민등록등본·초본 (정부24, 주민센터)",
  "가족관계증명서·혼인관계증명서 (정부24, 주민센터)",
  "기초생활수급자·차상위계층 확인서 (주민센터)",
  "장애인증명서 (정부24, 주민센터)",
  "건강보험 자격득실확인서·건강보험료 납부확인서 (국민건강보험)",
  "청약통장 납입인정회차 확인 (은행, 청약홈)",
  "임대차계약서 (현재 전월세 거주자)",
  "자동차등록증 (차량 보유 시)",
];

// ── 내부 링크 ────────────────────────────────────

export const SRH_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기" },
  { href: "/tools/ltci-grade-benefit-calculator-2026/", label: "장기요양등급 혜택 계산기" },
  { href: "/tools/housing-benefit-income-recognition/", label: "주거급여 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
];

// ── SEO 텍스트 (800자 이상, 5단락 이상 — docs/GOOGLE_SEO_RULES.md 기준) ──

export const SRH_SEO_CONTENT = {
  introTitle: "고령자 임대아파트, 운이 아니라 조건 싸움입니다",
  intro: [
    "고령자 임대아파트는 흔히 운이 좋아야 당첨된다고 생각하기 쉽지만, 실제로는 무주택 기간, 소득 수준, 해당 지역 거주기간, 수급자·차상위·장애인 여부, 청약저축 납입횟수 같은 배점 조건이 당첨 가능성을 크게 좌우합니다. 유형도 영구임대, 국민임대, 통합공공임대, 고령자 매입임대, 고령자 전세임대, 행복주택 고령자형까지 여섯 가지로 나뉘어 있어, 한 단지 인기 공고만 기다리기보다 유형을 넓혀 여러 공고에 계속 신청하는 것이 핵심 전략입니다.",
    "이 계산기는 나이, 주택 보유 여부, 소득 수준, 해당 지역 거주기간, 장애인 등록 여부, 청약통장 납입횟수, 자동차 보유, 자녀와의 세대분리 여부를 입력하면 당첨 가능성 점수를 즉시 계산합니다. 기초생활수급자는 30점, 차상위계층은 25점, 무주택 10년 이상은 20점처럼 항목별 가점이 명확하게 구성되어 있어, 점수가 어디서 나오고 어디서 깎이는지 그대로 확인할 수 있습니다.",
    "점수는 80점 이상이면 영구임대·매입임대 적극 신청, 50~79점이면 국민임대·매입임대·통합공공임대 병행, 30~49점이면 지역 확대와 전세임대 검토, 30점 미만이면 소득·세대·자산 조건 재점검이 필요한 구간으로 4단계 판정됩니다. 또한 소득 수준에 따라 6개 유형의 추천 순서도 달라집니다. 기초생활수급자라면 영구임대가 우선순위에 오르고, 기초연금만 받는 경우라면 국민임대와 통합공공임대가 먼저 추천됩니다.",
    "특히 인기 지역이나 신축만 고집하는 것, 공고 하나에만 신청하는 것은 오히려 감점 요인으로 반영됩니다. 청약통장을 해지하지 않고 유지하거나 자녀와 세대분리를 검토하는 것처럼 지금 바로 실행할 수 있는 항목은 별도로 강조해 보여줍니다. 부모님을 대신해 신청 가능성을 알아보는 자녀도, 본인이 직접 신청을 준비하는 고령자도 같은 화면에서 확인할 수 있습니다.",
    "다만 이 계산기의 배점과 판정 기준은 LH·마이홈 공개 자료를 단순화한 자가 점검용 추정치입니다. 실제 배점 항목과 가중치는 공고별·지자체별 세부 기준에 따라 달라질 수 있으므로, 신청 전 반드시 해당 공고문과 LH청약플러스, 마이홈포털, SH·GH 등 지방공사 공고를 통해 최종 확인해야 합니다.",
  ],
  inputPoints: [
    "나이, 주택 보유 여부, 무주택 기간을 입력하면 기본 자격 요건을 먼저 확인합니다.",
    "소득 수준(수급자·차상위·기초연금만·소득낮음·일반)을 선택하면 배점과 추천 유형이 함께 달라집니다.",
    "청약통장 납입횟수, 자동차 보유, 세대분리 여부, 신청 전략까지 입력하면 점수 구성 내역과 보완 가능한 항목을 확인할 수 있습니다.",
  ],
  criteria: [
    "배점표: 기초생활수급자 +30, 차상위계층 +25, 무주택 10년 이상 +20, 해당 지역 거주 5년 이상 +15 등 (LH·마이홈 공개 자료 단순화)",
    "판정: 80점 이상 적극 신청, 50~79점 병행 신청, 30~49점 지역 확대 검토, 30점 미만 조건 재점검",
    "추천 유형 순서는 소득 수준에 따라 재정렬되며, 기본 순서는 고령자 매입임대 → 영구임대 → 국민임대 → 통합공공임대 → 전세임대 → 행복주택입니다.",
    "이 계산기는 자가 점검용 추정이며 실제 배점은 공고문·지자체 기준으로 최종 확인해야 합니다.",
  ],
};
```

---

## 4. tools.ts 등록

```ts
{
  slug: "senior-rental-housing-eligibility-calculator-2026",
  title: "고령자 임대아파트 당첨 가능성 계산기 2026",
  description: "나이·주택보유·소득수준·거주기간·수급자여부 입력하면 영구임대·매입임대·국민임대 당첨 가능성 점수와 추천 유형을 동시에 계산합니다.",
  order: 11.76, // gyeonggi-youth-worker-support-calculator-2026(11.75) 바로 뒤
  eyebrow: "고령자 임대주택",
  category: "support",
  iframeReady: true,
  badges: ["신규", "고령자", "임대주택", "당첨확률"],
  previewStats: [
    { label: "핵심 결과", value: "당첨 가능성 점수" },
    { label: "추천 유형", value: "6종 우선순위" }
  ]
},
```

---

## 5. 계산 로직

```js
// public/scripts/senior-rental-housing-eligibility-calculator-2026.js

// 입력
// - age: number
// - housingOwnership: "none" | "past" | "current"
// - homelessYears: "under1" | "1to5" | "5to10" | "10plus"
// - residenceYears: "under1" | "1to3" | "3to5" | "5plus"
// - incomeLevel: "livelihood" | "nearPoverty" | "basicPensionOnly" | "veryLow" | "general"
// - isDisabled: boolean
// - subscriptionCount: "none" | "under6" | "6to23" | "24plus"
// - carOwnership: "noneOrCheap" | "general" | "expensive"
// - isSeparatedFromChildren: boolean
// - strategyPopularAreaOnly / strategyNewBuildOnly / strategySingleApplicationOnly: boolean

// 현재 주택 보유 시 즉시 "신청 불가" — 점수 계산 자체를 생략
if (housingOwnership === "current") {
  return { blocked: true, message: "현재 주택을 보유하고 있어 신청 대상이 아닙니다." };
}

function calcScoreBreakdown(input) {
  const items = [];
  if (input.age >= 65) items.push({ key: "age65", points: 10 });
  if (input.age >= 70) items.push({ key: "age70", points: 5 });
  items.push({ key: "income", points: SRH_INCOME_LEVEL_SCORE[input.incomeLevel] });
  if (input.isDisabled) items.push({ key: "disability", points: 15 });
  items.push({ key: "homeless", points: SRH_HOMELESS_YEARS_SCORE[input.homelessYears] });
  items.push({ key: "residence", points: SRH_RESIDENCE_YEARS_SCORE[input.residenceYears] });
  items.push({ key: "subscription", points: SRH_SUBSCRIPTION_SCORE[input.subscriptionCount] });
  items.push({ key: "car", points: SRH_CAR_SCORE[input.carOwnership] });
  if (input.isSeparatedFromChildren) items.push({ key: "separated", points: 10 });
  if (input.strategyPopularAreaOnly) items.push({ key: "popularArea", points: -20 });
  if (input.strategyNewBuildOnly) items.push({ key: "newBuild", points: -15 });
  if (input.strategySingleApplicationOnly) items.push({ key: "singleApp", points: -20 });
  return items;
}

function totalScore(items) {
  return items.reduce((sum, i) => sum + i.points, 0);
}

function judge(score) {
  return SRH_JUDGMENT_BANDS.find((b) => score >= b.minScore);
}

// 추천 유형 순서: 기본 순서(baseRank)에서 소득수준에 따라 우선순위 이동
function rankHousingTypes(incomeLevel) {
  const base = [...SRH_HOUSING_TYPES].sort((a, b) => a.baseRank - b.baseRank);
  if (incomeLevel === "livelihood" || incomeLevel === "nearPoverty") {
    return moveToFront(base, ["permanent", "seniorPurchase"]);
  }
  if (incomeLevel === "basicPensionOnly") {
    return moveToFront(base, ["national", "integrated", "seniorPurchase"]);
  }
  return base;
}

function moveToFront(list, idsInOrder) {
  const rest = list.filter((t) => !idsInOrder.includes(t.id));
  const front = idsInOrder.map((id) => list.find((t) => t.id === id)).filter(Boolean);
  return [...front, ...rest];
}

// 보완 가능 항목 (실행 가능한 것만 필터)
function actionableItems(input) {
  const tips = [];
  if (input.subscriptionCount !== "24plus") tips.push("청약통장을 해지하지 않고 24회 이상 유지하면 +10점");
  if (!input.isSeparatedFromChildren) tips.push("자녀와 세대분리를 검토하면 +10점");
  if (input.strategyPopularAreaOnly) tips.push("인기 지역만 고집하지 않고 인접 지역까지 넓히면 -20점 감점 해소");
  if (input.strategyNewBuildOnly) tips.push("신축만 고집하지 않고 구축까지 넓히면 -15점 감점 해소");
  if (input.strategySingleApplicationOnly) tips.push("한 공고만 신청하지 않고 여러 공고·유형에 동시 신청하면 -20점 감점 해소");
  return tips;
}
```

---

## 6. 페이지 IA

```
Hero
 └─ eyebrow: 고령자 임대주택
 └─ title: 고령자 임대아파트 당첨 가능성 계산기 2026
 └─ description: 나이·소득·거주기간·수급자여부 입력 → 당첨 점수·추천 유형 확인

InfoNotice: dataNote(배점 추정치 안내) + 공고문 기준 재확인 권고

[계산기 영역 — SimpleToolShell]
 ├─ aside(입력 패널)
 │   ├─ 나이 (셀렉트: 60~64/65~69/70이상)
 │   ├─ 주택 보유 여부 (토글: 무주택/과거보유/현재보유)
 │   ├─ 무주택 기간 (셀렉트, 무주택 선택 시만 노출)
 │   ├─ 해당 지역 거주기간 (셀렉트)
 │   ├─ 소득 수준 (셀렉트: 수급자/차상위/기초연금만/소득낮음/일반)
 │   ├─ 장애인 등록 여부 (토글)
 │   ├─ 청약통장 납입횟수 (셀렉트)
 │   ├─ 자동차 보유 (셀렉트)
 │   ├─ 자녀와 세대분리 (토글)
 │   └─ 신청 전략 체크 (체크박스 3종)
 └─ 결과 카드
     ├─ 총점 + 판정 (4단계)
     ├─ 점수 구성 내역 (항목별 리스트)
     ├─ 보완 가능 항목 (실행 가능한 것만)
     └─ 추천 유형 순서 (6종, 소득수준 기반 재정렬)

섹션 1 — 유형 비교표 (6개 유형, <table>)
섹션 2 — 준비서류 체크리스트 (8개 카드)
섹션 3 — CompareCta (고령자·복지 계산기 4종 링크)
섹션 4 — FAQ (7개)
SeoContent (intro 5단락/800자+, criteria, related)
```

---

## 7. 컴포넌트 구조

### 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD (`FAQPage` 스키마) |
| `SiteHeader.astro` | 전역 헤더 |
| `SimpleToolShell.astro` | 계산기 레이아웃 |
| `CalculatorHero.astro` | Hero 섹션 |
| `InfoNotice.astro` | 확인 필요 안내 배너 |
| `ToolActionBar.astro` | 리셋·링크복사 버튼 |
| `CompareCta.astro` | 고령자·복지 계산기 아웃바운드 CTA (`variant="welfare"`) |
| `SeoContent.astro` | SEO 텍스트 + FAQ + related |

### 페이지 전용 마크업

| 블록 클래스 | 설명 |
|---|---|
| `.srh-page` | 페이지 루트 |
| `.srh-input-section` | 입력 그룹 |
| `.srh-score-card` | 총점·판정 카드 |
| `.srh-score-card--band-high` / `--band-mid` / `--band-low` / `--band-warn` | 4단계 판정별 색상 |
| `.srh-breakdown-list` | 점수 구성 내역 (가점/감점 리스트) |
| `.srh-breakdown-item--positive` / `--negative` | 가점/감점 항목 색 구분 |
| `.srh-actionable-grid` | 보완 가능 항목 카드 그리드 |
| `.srh-type-rank-list` | 추천 유형 순위 리스트 |
| `.srh-type-rank-item` | 개별 유형 순위 카드 (순번 배지 포함) |
| `.srh-compare-table` | 유형 비교표 |
| `.srh-checklist-grid` | 준비서류 체크리스트 |

---

## 8. SCSS 설계

**파일:** `src/styles/scss/pages/_senior-rental-housing-eligibility-calculator-2026.scss`

### CSS 로컬 토큰

```scss
.srh-page {
  --srh-ink: #14213d;
  --srh-muted: #5d6b82;
  --srh-line: rgba(20, 33, 61, 0.12);
  --srh-soft: #f5f7fb;

  --srh-primary: #1a56db;
  --srh-primary-bg: #eff4ff;

  --srh-green: #059669;   // 80점 이상 — 적극 신청
  --srh-green-bg: #d1fae5;

  --srh-amber: #d97706;   // 50~79점 — 병행 신청
  --srh-amber-bg: #fef3c7;

  --srh-orange: #ea580c;  // 30~49점 — 지역 확대
  --srh-orange-bg: #ffedd5;

  --srh-red: #dc2626;     // 30점 미만 — 재점검
  --srh-red-bg: #fee2e2;
}
```

### 주요 스타일 블록

```scss
// 판정 카드 (점수대별 색상)
.srh-score-card {
  padding: 1.5rem;
  border-radius: 16px;
  border: 1.5px solid var(--srh-line);
  text-align: center;

  &--band-high  { background: var(--srh-green-bg);  border-color: var(--srh-green); }
  &--band-mid   { background: var(--srh-amber-bg);  border-color: var(--srh-amber); }
  &--band-low   { background: var(--srh-orange-bg); border-color: var(--srh-orange); }
  &--band-warn  { background: var(--srh-red-bg);    border-color: var(--srh-red); }

  .srh-score-card__value { font-size: 2.5rem; font-weight: 800; }
  .srh-score-card__label { font-size: 1rem; font-weight: 700; margin-top: 0.5rem; }
  .srh-score-card__message { font-size: 0.875rem; color: var(--srh-muted); margin-top: 0.5rem; }
}

// 점수 구성 내역
.srh-breakdown-list {
  display: grid;
  gap: 0.5rem;
}
.srh-breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  &--positive { background: var(--srh-green-bg); color: var(--srh-green); }
  &--negative { background: var(--srh-red-bg);   color: var(--srh-red); }
}

// 추천 유형 순위
.srh-type-rank-list {
  display: grid;
  gap: 0.6rem;
}
.srh-type-rank-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--srh-line);

  .srh-type-rank-item__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: var(--srh-primary);
    color: #fff;
    font-weight: 700;
    font-size: 0.8125rem;
    flex-shrink: 0;
  }
}

// 유형 비교표
.srh-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  th, td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--srh-line); text-align: left; }
  th { background: var(--srh-soft); font-weight: 600; }
}

// 체크리스트
.srh-checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.srh-checklist-card {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--srh-line);
  span { color: var(--srh-primary); font-weight: 700; }
  p { margin: 0; font-size: 0.875rem; color: var(--srh-ink); }
}
```

---

## 9. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import CompareCta from "../../components/CompareCta.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  SRH_META,
  SRH_HOUSING_TYPES,
  SRH_SCORE_ITEMS,
  SRH_JUDGMENT_BANDS,
  SRH_FAQ,
  SRH_CHECKLIST,
  SRH_RELATED_LINKS,
  SRH_SEO_CONTENT,
} from "../../data/seniorRentalHousingEligibility2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const config = {
  housingTypes: SRH_HOUSING_TYPES,
  judgmentBands: SRH_JUDGMENT_BANDS,
};

const faqSchema = SRH_FAQ.map((item) => ({
  "@type": "Question",
  name: item.q,
  acceptedAnswer: { "@type": "Answer", text: item.a },
}));
---

<BaseLayout
  title={SRH_META.seoTitle}
  description={SRH_META.seoDescription}
  ogImage="/og/og-home.png"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SRH_META.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    description: SRH_META.seoDescription,
    url: `${(import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "")}/tools/${SRH_META.slug}/`,
    mainEntity: { "@type": "FAQPage", mainEntity: faqSchema },
  }}
>
  <SiteHeader />

  <SimpleToolShell calculatorId={SRH_META.slug} pageClass="srh-page" resultFirst={false}>
    <Fragment slot="hero">
      <CalculatorHero
        eyebrow="고령자 임대주택"
        title="고령자 임대아파트 당첨 가능성 계산기 2026"
        description="나이·소득·거주기간·수급자여부를 입력하면 당첨 가능성 점수와 추천 유형을 바로 계산합니다."
      />
      <InfoNotice
        title="계산 전 확인"
        lines={[
          SRH_META.dataNote,
          "입력한 정보는 브라우저에서만 계산되며 서버로 전송하지 않습니다.",
        ]}
      />
    </Fragment>

    <Fragment slot="actions">
      <ToolActionBar resetId="srhResetBtn" copyId="srhCopyBtn" />
    </Fragment>

    <Fragment slot="aside">
      <article class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-heading__eyebrow">입력</p>
            <h2 class="panel__title">조건 입력</h2>
          </div>
        </div>

        <section class="srh-input-section">
          <div class="form-grid">
            <label class="field">
              <span>나이</span>
              <select data-srh="age">
                <option value="62">60~64세</option>
                <option value="67" selected>65~69세</option>
                <option value="72">70세 이상</option>
              </select>
            </label>
            <label class="field">
              <span>주택 보유 여부</span>
              <select data-srh="housingOwnership">
                <option value="none" selected>무주택</option>
                <option value="past">과거 보유 (현재 없음)</option>
                <option value="current">현재 보유</option>
              </select>
            </label>
            <label class="field">
              <span>무주택 기간</span>
              <select data-srh="homelessYears">
                <option value="under1">1년 미만</option>
                <option value="1to5">1~5년</option>
                <option value="5to10">5~10년</option>
                <option value="10plus" selected>10년 이상</option>
              </select>
            </label>
            <label class="field">
              <span>해당 지역 거주기간</span>
              <select data-srh="residenceYears">
                <option value="under1">1년 미만</option>
                <option value="1to3">1~3년</option>
                <option value="3to5">3~5년</option>
                <option value="5plus" selected>5년 이상</option>
              </select>
            </label>
            <label class="field">
              <span>소득 수준</span>
              <select data-srh="incomeLevel">
                <option value="livelihood">기초생활수급자</option>
                <option value="nearPoverty">차상위계층</option>
                <option value="basicPensionOnly">기초연금만 수급</option>
                <option value="veryLow" selected>소득이 매우 낮음</option>
                <option value="general">일반</option>
              </select>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" data-srh="isDisabled" />
              <span>장애인으로 등록되어 있습니다</span>
            </label>
            <label class="field">
              <span>청약통장 납입횟수</span>
              <select data-srh="subscriptionCount">
                <option value="none">없음</option>
                <option value="under6">6회 미만</option>
                <option value="6to23">6~23회</option>
                <option value="24plus" selected>24회 이상</option>
              </select>
            </label>
            <label class="field">
              <span>자동차 보유</span>
              <select data-srh="carOwnership">
                <option value="noneOrCheap" selected>없음 또는 저가 차량</option>
                <option value="general">일반 차량</option>
                <option value="expensive">고가 차량</option>
              </select>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" data-srh="isSeparatedFromChildren" checked />
              <span>자녀와 세대가 분리되어 있습니다</span>
            </label>
          </div>
        </section>

        <section class="srh-input-section">
          <h3>신청 전략 (해당하면 체크)</h3>
          <div class="form-grid">
            <label class="checkbox-option">
              <input type="checkbox" data-srh="strategyPopularAreaOnly" />
              <span>인기 지역만 고집할 계획입니다</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" data-srh="strategyNewBuildOnly" />
              <span>신축만 고집할 계획입니다</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" data-srh="strategySingleApplicationOnly" />
              <span>한 공고에만 신청할 계획입니다</span>
            </label>
          </div>
        </section>
      </article>
    </Fragment>

    <section class="srh-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">계산 결과</p>
        <h2>당첨 가능성 점수와 판정</h2>
      </div>
      <div class="srh-score-card" id="srhScoreCard">
        <p class="srh-score-card__value" id="srhScoreValue">-</p>
        <p class="srh-score-card__label" id="srhScoreLabel"></p>
        <p class="srh-score-card__message" id="srhScoreMessage"></p>
      </div>

      <h3>점수 구성 내역</h3>
      <div class="srh-breakdown-list" id="srhBreakdownList"></div>

      <h3>지금 바로 보완할 수 있는 항목</h3>
      <div class="srh-actionable-grid" id="srhActionableGrid"></div>

      <h3>추천 유형 순서</h3>
      <div class="srh-type-rank-list" id="srhTypeRankList"></div>
    </section>

    <section class="srh-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">유형 비교</p>
        <h2>고령자 임대주택 6종 비교</h2>
      </div>
      <table class="srh-compare-table">
        <thead>
          <tr><th>유형</th><th>대상</th><th>당첨 난이도</th></tr>
        </thead>
        <tbody>
          {SRH_HOUSING_TYPES.map((t) => (
            <tr><td>{t.name}</td><td>{t.target}</td><td>{t.difficulty}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    <section class="srh-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">신청 준비</p>
        <h2>준비서류 체크리스트</h2>
      </div>
      <div class="srh-checklist-grid">
        {SRH_CHECKLIST.map((item) => (
          <article class="srh-checklist-card">
            <span aria-hidden="true">✓</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>

    <CompareCta
      variant="welfare"
      eyebrow="고령자·복지 계산기"
      title="부모님 복지 혜택도 함께 확인하세요"
      description="장기요양, 기초연금, 생계급여까지 고령자 관련 복지 제도를 한 곳에서 비교합니다."
      links={[
        { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
        { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기" },
        { href: "/tools/ltci-grade-benefit-calculator-2026/", label: "장기요양등급 혜택 계산기" },
        { href: "/tools/housing-benefit-income-recognition/", label: "주거급여 계산기" },
      ]}
    />

    <Fragment slot="seo">
      <SeoContent
        introTitle={SRH_SEO_CONTENT.introTitle}
        intro={SRH_SEO_CONTENT.intro}
        inputPoints={SRH_SEO_CONTENT.inputPoints}
        criteria={SRH_SEO_CONTENT.criteria}
        faq={SRH_FAQ.map((f) => ({ question: f.q, answer: f.a }))}
        related={SRH_RELATED_LINKS}
      />
    </Fragment>
  </SimpleToolShell>

  <script id="srh-data" type="application/json" set:html={JSON.stringify(config)} />
  <script type="module" src={withBase("/scripts/senior-rental-housing-eligibility-calculator-2026.js")}></script>
</BaseLayout>
```

---

## 10. JS 로직 (`public/scripts/senior-rental-housing-eligibility-calculator-2026.js`)

```js
(() => {
  const root = document.querySelector(".srh-page");
  const configEl = document.getElementById("srh-data");
  if (!root || !configEl) return;

  const { housingTypes, judgmentBands } = JSON.parse(configEl.textContent || "{}");

  const $ = (sel) => root.querySelector(sel);

  const INCOME_SCORE = { livelihood: 30, nearPoverty: 25, basicPensionOnly: 0, veryLow: 20, general: 0 };
  const HOMELESS_SCORE = { under1: 0, "1to5": 0, "5to10": 0, "10plus": 20 };
  const RESIDENCE_SCORE = { under1: 0, "1to3": 0, "3to5": 0, "5plus": 15 };
  const SUBSCRIPTION_SCORE = { none: 0, under6: 0, "6to23": 0, "24plus": 10 };
  const CAR_SCORE = { noneOrCheap: 10, general: 0, expensive: 0 };

  let state = {
    age: 67,
    housingOwnership: "none",
    homelessYears: "10plus",
    residenceYears: "5plus",
    incomeLevel: "veryLow",
    isDisabled: false,
    subscriptionCount: "24plus",
    carOwnership: "noneOrCheap",
    isSeparatedFromChildren: true,
    strategyPopularAreaOnly: false,
    strategyNewBuildOnly: false,
    strategySingleApplicationOnly: false,
  };

  function breakdown() {
    const items = [];
    if (state.age >= 65) items.push({ label: "만 65세 이상", points: 10 });
    if (state.age >= 70) items.push({ label: "만 70세 이상", points: 5 });
    const incomeLabel = { livelihood: "기초생활수급자", nearPoverty: "차상위계층", veryLow: "소득이 매우 낮음" }[state.incomeLevel];
    if (INCOME_SCORE[state.incomeLevel] > 0) items.push({ label: incomeLabel, points: INCOME_SCORE[state.incomeLevel] });
    if (state.isDisabled) items.push({ label: "장애인 등록", points: 15 });
    if (HOMELESS_SCORE[state.homelessYears] > 0) items.push({ label: "무주택 10년 이상", points: 20 });
    if (RESIDENCE_SCORE[state.residenceYears] > 0) items.push({ label: "해당 지역 거주 5년 이상", points: 15 });
    if (SUBSCRIPTION_SCORE[state.subscriptionCount] > 0) items.push({ label: "청약통장 24회 이상", points: 10 });
    if (CAR_SCORE[state.carOwnership] > 0) items.push({ label: "자동차 없음/저가 차량", points: 10 });
    if (state.isSeparatedFromChildren) items.push({ label: "자녀와 세대분리", points: 10 });
    if (state.strategyPopularAreaOnly) items.push({ label: "인기지역만 고집", points: -20 });
    if (state.strategyNewBuildOnly) items.push({ label: "신축만 고집", points: -15 });
    if (state.strategySingleApplicationOnly) items.push({ label: "한 공고만 신청", points: -20 });
    return items;
  }

  function judge(score) {
    return judgmentBands.find((b) => score >= b.minScore) || judgmentBands[judgmentBands.length - 1];
  }

  function rankTypes() {
    const base = [...housingTypes].sort((a, b) => a.baseRank - b.baseRank);
    const moveToFront = (ids) => {
      const front = ids.map((id) => base.find((t) => t.id === id)).filter(Boolean);
      const rest = base.filter((t) => !ids.includes(t.id));
      return [...front, ...rest];
    };
    if (state.incomeLevel === "livelihood" || state.incomeLevel === "nearPoverty") {
      return moveToFront(["permanent", "seniorPurchase"]);
    }
    if (state.incomeLevel === "basicPensionOnly") {
      return moveToFront(["national", "integrated", "seniorPurchase"]);
    }
    return base;
  }

  function actionableTips() {
    const tips = [];
    if (state.subscriptionCount !== "24plus") tips.push("청약통장을 24회 이상 유지하면 +10점");
    if (!state.isSeparatedFromChildren) tips.push("자녀와 세대분리를 검토하면 +10점");
    if (state.strategyPopularAreaOnly) tips.push("인기 지역만 고집하지 않으면 -20점 감점 해소");
    if (state.strategyNewBuildOnly) tips.push("신축만 고집하지 않으면 -15점 감점 해소");
    if (state.strategySingleApplicationOnly) tips.push("여러 공고에 동시 신청하면 -20점 감점 해소");
    return tips;
  }

  function render() {
    if (state.housingOwnership === "current") {
      $("#srhScoreValue").textContent = "신청 불가";
      $("#srhScoreLabel").textContent = "현재 주택을 보유하고 있습니다";
      $("#srhScoreMessage").textContent = "무주택 요건을 충족하지 않아 대부분의 공공임대 유형에서 신청 대상이 아닙니다.";
      $("#srhBreakdownList").innerHTML = "";
      $("#srhActionableGrid").innerHTML = "";
      $("#srhTypeRankList").innerHTML = "";
      syncURL();
      return;
    }

    const items = breakdown();
    const score = items.reduce((sum, i) => sum + i.points, 0);
    const band = judge(score);

    $("#srhScoreValue").textContent = `${score}점`;
    $("#srhScoreLabel").textContent = band.label;
    $("#srhScoreMessage").textContent = band.message;

    const card = $("#srhScoreCard");
    card.className = "srh-score-card";
    if (score >= 80) card.classList.add("srh-score-card--band-high");
    else if (score >= 50) card.classList.add("srh-score-card--band-mid");
    else if (score >= 30) card.classList.add("srh-score-card--band-low");
    else card.classList.add("srh-score-card--band-warn");

    $("#srhBreakdownList").innerHTML = items
      .map((i) => `<div class="srh-breakdown-item srh-breakdown-item--${i.points >= 0 ? "positive" : "negative"}"><span>${i.label}</span><strong>${i.points > 0 ? "+" : ""}${i.points}점</strong></div>`)
      .join("");

    const tips = actionableTips();
    $("#srhActionableGrid").innerHTML = tips.length
      ? tips.map((t) => `<article class="srh-checklist-card"><span aria-hidden="true">→</span><p>${t}</p></article>`).join("")
      : `<p>현재 실행 가능한 보완 항목이 모두 반영되어 있습니다.</p>`;

    $("#srhTypeRankList").innerHTML = rankTypes()
      .map((t, idx) => `<div class="srh-type-rank-item"><span class="srh-type-rank-item__badge">${idx + 1}</span><div><strong>${t.name}</strong><p>${t.target} · 난이도 ${t.difficulty}</p></div></div>`)
      .join("");

    syncURL();
  }

  function bindInputs() {
    root.querySelectorAll("[data-srh]").forEach((el) => {
      const key = el.dataset.srh;
      const eventName = el.tagName === "SELECT" ? "change" : el.type === "checkbox" ? "change" : "input";
      el.addEventListener(eventName, () => {
        state[key] = el.type === "checkbox" ? el.checked : (key === "age" ? Number(el.value) : el.value);
        render();
      });
    });
  }

  function syncURL() {
    const p = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => p.set(k, typeof v === "boolean" ? (v ? "1" : "0") : v));
    history.replaceState(null, "", `?${p.toString()}`);
  }

  document.getElementById("srhResetBtn")?.addEventListener("click", () => {
    state = {
      age: 67, housingOwnership: "none", homelessYears: "10plus", residenceYears: "5plus",
      incomeLevel: "veryLow", isDisabled: false, subscriptionCount: "24plus", carOwnership: "noneOrCheap",
      isSeparatedFromChildren: true, strategyPopularAreaOnly: false, strategyNewBuildOnly: false, strategySingleApplicationOnly: false,
    };
    render();
  });

  document.getElementById("srhCopyBtn")?.addEventListener("click", () => {
    syncURL();
    navigator.clipboard?.writeText(location.href).catch(() => {});
  });

  bindInputs();
  render();
})();
```

---

## 11. app.scss import

```scss
@use 'scss/pages/senior-rental-housing-eligibility-calculator-2026';
```

---

## 12. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/senior-rental-housing-eligibility-calculator-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. 인바운드 CTA 반영 (기존 파일 수정)

| 파일 | 수정 내용 |
|---|---|
| `src/data/welfareBenefitEligibility.ts` | `WBE_RELATED_LINKS`에 `{ href: "/tools/senior-rental-housing-eligibility-calculator-2026/", label: "고령자 임대아파트 당첨 가능성 계산기" }` 추가 |
| `src/data/basicPensionEligibilityCalculator.ts` | `BPEC_RELATED_LINKS`에 동일 링크 추가 |

---

## 14. QA 포인트

- [ ] 주택 "현재 보유" 선택 시 점수 계산 없이 즉시 "신청 불가" 카드로 전환
- [ ] 소득 수준 5개 옵션이 상호 배타적으로 처리되어 중복 가산 없는지 (수급자 선택 시 "소득 매우 낮음" 점수와 동시 가산 안 됨)
- [ ] 70세 이상 선택 시 65세(+10)·70세(+5) 누적 가산 확인
- [ ] 전략 체크박스 3종 체크 시 실시간 감점 반영 및 "보완 가능 항목"에 즉시 노출
- [ ] 80/50/30점 경계값에서 판정 라벨·카드 색상이 정확히 전환되는지
- [ ] 소득수준별 추천 유형 순서 재정렬 확인 (수급자/차상위 → 영구임대·매입임대 우선, 기초연금만 → 국민임대·통합공공임대 우선, 일반 → 기본 순서)
- [ ] `CompareCta` 4개 링크 정상 작동 (`.compare-cta` 그리드는 이미 `minmax(0,42%)`로 수정된 상태 — 별도 조치 불필요, 정상 렌더링만 확인)
- [ ] `SeoContent` intro 5단락/800자 이상, FAQ 7개 확인
- [ ] `npm run build` 통과, `dist/tools/senior-rental-housing-eligibility-calculator-2026/` 라우트 생성 확인
- [ ] 메타 타이틀 50자 이내, 디스크립션 80~120자 재확인
- [ ] 결과 화면에 "배점은 추정치이며 공고문 기준 재확인 필요" 안내 문구가 고정 노출되는지
