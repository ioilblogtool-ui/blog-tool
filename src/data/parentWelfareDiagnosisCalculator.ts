export type LtciGradeInput = "none" | "1" | "2" | "3" | "4" | "5" | "인지지원";
export type PwdRegion = "metro" | "city" | "rural";
export type PwdJudgement = "likely" | "borderline" | "needsCheck" | "unlikely";
export type PwdBenefitType = "cash" | "service" | "participation";

export interface PwdPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export interface PwdFaqItem {
  question: string;
  answer: string;
}

export const PWD_META = {
  slug: "parent-welfare-diagnosis-calculator",
  title: "부모님 복지 통합 자동진단",
  seoTitle: "부모님 복지 자동진단 2026 | 기초연금·장기요양·임대주택 한 번에 확인",
  seoDescription:
    "부모님 나이·가구구성·소득·재산·건강 정보를 입력하면 기초연금, 기초생활보장, 장기요양보험, 노인일자리, 고령자 주거지원과 요금 감면을 함께 점검하는 자가진단 계산기입니다.",
  dataNote:
    "이 진단은 여러 복지 제도를 한 번에 훑어보는 자가 점검용 자료이며, 공식 수급자격을 확정하는 결과가 아닙니다. 복지로 모의계산과 결과가 다를 수 있습니다.",
  criteriaDateLabel: "2026년 제도 기준(2026-07-22 갱신)",
  updatedAt: "2026-07-22",
};

export const PWD_JUDGEMENT_LABELS: Record<PwdJudgement, string> = {
  likely: "신청 검토",
  borderline: "기준 근접",
  needsCheck: "추가 정보 필요",
  unlikely: "현재 입력 기준 가능성 낮음",
};

export const PWD_BENEFIT_TYPE_LABELS: Record<PwdBenefitType, string> = {
  cash: "현금급여",
  service: "서비스·비용지원",
  participation: "참여·주거지원",
};

export const PWD_REGION_LABELS: Record<PwdRegion, string> = {
  metro: "대도시·특례시",
  city: "중소도시",
  rural: "농어촌",
};

export const PWD_LTCI_GRADE_LABELS: Record<LtciGradeInput, string> = {
  none: "없음",
  "1": "1등급",
  "2": "2등급",
  "3": "3등급",
  "4": "4등급",
  "5": "5등급",
  인지지원: "인지지원등급",
};

export const PWD_PRESETS: PwdPreset[] = [
  {
    id: "pension-only",
    label: "국민연금 월 40만원 단독가구",
    summary: "70세 · 단독 · 국민연금 40만",
    input: {
      age: 70, isCouple: false, householdSize: 1, region: "city", ltciGrade: "none",
      earnedIncome: 0, publicPension: 400000, otherIncome: 0,
      realEstate: 200000000, financialAsset: 5000000, debt: 0, housingOwnership: "current",
    },
  },
  {
    id: "living-with-child",
    label: "자녀 주택에 함께 거주",
    summary: "68세 · 자녀와 동일 가구 · 금융재산 소액",
    input: {
      age: 68, isCouple: false, householdSize: 3, region: "metro", ltciGrade: "none",
      earnedIncome: 0, publicPension: 300000, otherIncome: 0,
      realEstate: 0, financialAsset: 5000000, debt: 0, housingOwnership: "none",
    },
  },
  {
    id: "ltci-grade3",
    label: "장기요양 3등급·자가 거주",
    summary: "75세 · 3등급 보유 · 이동·화장실 도움 필요",
    input: {
      age: 75, isCouple: false, householdSize: 1, region: "city", ltciGrade: "3",
      earnedIncome: 0, publicPension: 350000, otherIncome: 0,
      realEstate: 150000000, financialAsset: 3000000, debt: 0, housingOwnership: "current",
      mobilityDifficulty: true, toiletDifficulty: true,
    },
  },
  {
    id: "low-income-no-house",
    label: "소득 없는 월세 단독가구",
    summary: "65세 · 무주택 · 소득 없음",
    input: {
      age: 65, isCouple: false, householdSize: 1, region: "city", ltciGrade: "none",
      earnedIncome: 0, publicPension: 0, otherIncome: 0,
      realEstate: 0, financialAsset: 2000000, debt: 0, housingOwnership: "none",
    },
  },
  {
    id: "multi-house-retiree",
    label: "추가 주택을 보유한 은퇴가구",
    summary: "66세 · 다주택",
    input: {
      age: 66, isCouple: false, householdSize: 1, region: "metro", ltciGrade: "none",
      earnedIncome: 0, publicPension: 800000, otherIncome: 0,
      realEstate: 900000000, financialAsset: 30000000, debt: 0, housingOwnership: "current",
    },
  },
  {
    id: "couple-pension",
    label: "국민연금 월 100만원 부부가구",
    summary: "72세 · 부부 · 국민연금 합산 100만",
    input: {
      age: 72, isCouple: true, householdSize: 2, region: "city", ltciGrade: "none",
      earnedIncome: 0, publicPension: 600000, otherIncome: 0,
      spouseAge: 70, spouseEarnedIncome: 0, spousePublicPension: 400000, spouseOtherIncome: 0,
      realEstate: 250000000, financialAsset: 8000000, spouseFinancialAsset: 4000000, debt: 0, housingOwnership: "current",
    },
  },
];

export const PWD_MISSING_INPUT_HINTS: Record<string, string[]> = {
  basicPension: ["임대소득", "직역연금 수급 여부", "해외 체류 여부"],
  livelihood: ["실제 생계 분리 여부", "부양의무자 관련 예외"],
  medical: ["부양의무자 소득·재산"],
  housing: ["월 임차료", "보증금"],
  seniorRental: ["세대원 전체 무주택 여부", "거주 시·군·구", "거주기간", "청약통장 가입기간·납입횟수", "수급자·차상위 여부"],
  seniorJob: ["취업 상태", "사업자등록 여부", "건강보험 직장가입 여부", "희망 근무시간·지역"],
};

export const PWD_APPLICATION_AGENCY: Record<string, string> = {
  basicPension: "국민연금공단 또는 주소지 주민센터",
  ltci: "국민건강보험공단(장기요양보험)",
  seniorJob: "한국노인인력개발원·지역 수행기관(노인일자리여기)",
  livelihood: "주소지 읍면동 주민센터",
  medical: "주소지 읍면동 주민센터",
  housing: "주소지 읍면동 주민센터",
  seniorRental: "LH 또는 해당 지역 임대주택 공급기관",
  reduction: "통신사·전기가스 공급기관·주민센터",
};

export const PWD_FAQ: PwdFaqItem[] = [
  {
    question: "여러 복지를 동시에 받을 수 있나요?",
    answer: "일부 제도는 동시에 이용할 수 있습니다. 다만 국민연금, 기초연금, 노인일자리 소득 등은 다른 제도의 소득인정액에 포함되거나 지급액에 영향을 줄 수 있어, 각 제도의 최대금액을 단순히 더한 금액이 실제 월 수령액이 되는 것은 아닙니다.",
  },
  {
    question: "이 진단 결과로 바로 신청하면 되나요?",
    answer: "진단 결과는 신청할 제도를 찾기 위한 자가점검 자료입니다. 최종 신청과 심사는 제도별 담당기관에서 진행해야 합니다. 기초연금은 국민연금공단 또는 주민센터, 장기요양보험은 국민건강보험공단, 기초생활보장은 주민센터, 공공임대주택은 LH와 해당 모집기관을 확인하세요.",
  },
  {
    question: "왜 '추가 정보 필요'로 나오나요?",
    answer: "장기요양보험은 신체·인지 기능을 조사해야 하고, 노인일자리는 지역별 모집 여부와 사업유형별 기준이 다릅니다. 임대주택 역시 무주택 기간, 가구소득, 자산, 거주지역과 모집공고가 필요하기 때문에 제한된 정보만으로 확정하기 어렵습니다.",
  },
  {
    question: "자동차가 있으면 복지 대상에서 제외되나요?",
    answer: "자동차가 있다는 이유만으로 모든 복지에서 제외되는 것은 아닙니다. 제도별로 차량가액, 차종, 연식, 사용 목적과 가구 특성을 다르게 반영합니다. 장애인 사용 차량이나 생업용 차량 등은 별도 기준이 적용될 수 있습니다.",
  },
  {
    question: "장기요양등급이 없으면 혜택을 받을 수 없나요?",
    answer: "장기요양급여를 이용하려면 원칙적으로 인정신청과 등급판정 절차가 필요합니다. 혼자 식사, 이동, 옷 입기, 화장실 이용이 어렵거나 치매로 지속적인 돌봄이 필요하다면 국민건강보험공단에 인정신청을 검토할 수 있습니다.",
  },
  {
    question: "자녀와 같이 살면 자녀의 재산도 모두 포함되나요?",
    answer: "제도와 가구 판정 방식에 따라 다릅니다. 주민등록상 가구구성, 실제 생계 여부와 신청하는 급여 종류에 따라 조사 범위가 달라질 수 있으므로 자녀와 합가한 경우에는 주민센터 상담을 권장합니다.",
  },
  {
    question: "집이 있으면 기초연금을 받을 수 없나요?",
    answer: "자가주택을 보유했다고 자동으로 제외되는 것은 아닙니다. 주택을 포함한 재산을 소득으로 환산하고 다른 소득과 합산한 소득인정액으로 판단합니다. 주택가격, 지역, 금융재산, 부채와 배우자의 자산을 함께 확인해야 합니다.",
  },
  {
    question: "감면 혜택은 자동으로 적용되나요?",
    answer: "자동 연계되는 항목도 있지만 별도 신청이 필요한 항목도 있습니다. 기초연금이나 기초생활보장 수급자가 된 뒤 통신사, 전기·가스 공급기관 또는 주민센터에 신청 상태를 확인하는 것이 안전합니다.",
  },
];

export const PWD_SEO_CONTENT = {
  introTitle: "부모님 복지 통합 자동진단 — 한 번 입력으로 놓친 제도가 없는지 확인하세요",
  intro: [
    "부모님의 나이, 가구구성, 소득, 재산, 건강 및 주거 정보를 한 번 입력하면 기초연금, 기초생활보장, 장기요양보험, 노인일자리, 고령자 주거지원과 각종 요금 감면을 함께 점검할 수 있습니다.",
    "진단 결과는 신청 검토, 기준 근접, 추가 정보 필요, 현재 입력 기준 가능성 낮음으로 구분합니다. 공식 수급자격을 확정하는 결과가 아니라 신청 전에 놓친 제도가 없는지 확인하는 자가점검 결과입니다.",
    "현금급여(기초연금·생계급여·주거급여)와 노인일자리 활동비·장기요양 서비스·요금 감면처럼 성격이 다른 항목은 서로 합산하지 않고 별도로 표시합니다.",
  ],
  inputPoints: [
    "부부가구는 배우자의 소득과 재산을 함께 입력해야 판정 정확도가 높아집니다.",
    "현금급여, 노인일자리 활동비, 장기요양 서비스, 요금 감면은 성격이 달라 별도로 표시합니다.",
    "소득과 재산의 실제 인정금액은 행정기관 조사 및 제도별 환산방식에 따라 달라질 수 있습니다.",
  ],
  criteria: [
    "지자체별 지원과 임대주택은 거주지역과 모집공고에 따라 결과가 달라집니다.",
    "최종 신청과 심사는 국민연금공단, 국민건강보험공단, 복지로, LH 또는 주소지 주민센터에서 진행합니다.",
    "이 계산기는 공식 모의계산(복지로)을 대체하지 않으며, 결과가 다를 수 있습니다.",
  ],
};

export const PWD_RELATED_LINKS = [
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기" },
  { href: "/tools/ltci-grade-benefit-calculator-2026/", label: "장기요양등급 혜택·비용 계산기" },
  { href: "/tools/senior-rental-housing-eligibility-calculator-2026/", label: "고령자 임대아파트 당첨 가능성 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
  { href: "/tools/senior-job-salary-calculator-2026/", label: "60대 일자리 월급 계산기" },
];
