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

// ── 6개 유형 스펙 ──────────────────────

export const SRH_HOUSING_TYPES: HousingTypeSpec[] = [
  { id: "seniorPurchase", name: "고령자 매입임대", target: "만 65세 이상 저소득 고령자", difficulty: "중간", baseRank: 1, note: "기존 주택을 LH/SH가 매입 후 임대 — 단지형보다 경쟁 낮은 경우 있음" },
  { id: "permanent", name: "영구임대 (고령자 공급)", target: "수급자·차상위·장애인·65세 이상", difficulty: "높음", baseRank: 2, note: "임대료 가장 저렴하지만 대기·경쟁 높음" },
  { id: "national", name: "국민임대 (고령자 우선공급)", target: "무주택 + 소득·자산 기준", difficulty: "중간~높음", baseRank: 3, note: "공급 물량 비교적 있음, 인기 지역 경쟁 높음" },
  { id: "integrated", name: "통합공공임대 (고령자 우선공급)", target: "무주택 + 소득·자산 기준", difficulty: "중간", baseRank: 4, note: "최근 공급 확대 유형" },
  { id: "jeonse", name: "고령자 전세임대", target: "저소득 고령자", difficulty: "중간", baseRank: 5, note: "당첨 후 직접 매물을 찾아야 하는 과정이 남음" },
  { id: "happy", name: "행복주택 (고령자형)", target: "만 65세 이상", difficulty: "중간", baseRank: 6, note: "역세권·신축 가능성 있음" },
];

// ── 소득 수준 등 배점 매핑 (상호 배타적, 중복 가산 방지) ──

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

// ── 판정 기준 (점수 내림차순 — find()가 최초 매치를 상위 밴드로 판정) ──

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

// ── 준비서류 체크리스트 ─────────────────

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
