import { WBE_2026_THRESHOLDS } from "./welfareBenefitEligibility";

export type EbeSchoolLevel = "elementary" | "middle" | "high";
export type EbeEligibilityStatus = "eligible" | "borderline" | "over";
export type EbeEducationCostStatus = "likely" | "check" | "unlikely";
export type EbeEvidenceBadge = "공식" | "계산" | "추정" | "확인 필요";

export interface EbeSupportAmount {
  level: EbeSchoolLevel;
  label: string;
  annualActivitySupport: number;
  badge: EbeEvidenceBadge;
}

export interface EbeInput {
  householdSize: number;
  monthlyRecognizedIncome: number;
  elementaryCount: number;
  middleCount: number;
  highCount: number;
  showEducationCostSupport: boolean;
}

export interface EbePreset {
  id: string;
  label: string;
  summary: string;
  input: EbeInput;
}

export const EBE_META = {
  slug: "education-benefit-eligibility-calculator-2026",
  title: "2026 교육급여 계산기",
  seoTitle: "2026 교육급여 계산기 | 초중고 교육활동지원비 받을 수 있나 확인",
  seoDescription:
    "가구원 수와 월 소득인정액, 초중고 학생 수를 입력하면 2026년 교육급여 기준 통과 여부와 예상 교육활동지원비를 계산합니다.",
  updatedAt: "2026-07-21",
  dataNote:
    "교육급여 선정기준과 교육활동지원비는 교육부 2026년 공식 발표 기준입니다. 이 계산기는 사전 자가진단용이며 실제 선정 여부와 교육비 지원 항목은 소득·재산 조사와 시도교육청 심사 결과에 따라 달라질 수 있습니다.",
};

export const EBE_SUPPORT_AMOUNTS: EbeSupportAmount[] = [
  { level: "elementary", label: "초등학생", annualActivitySupport: 502_000, badge: "공식" },
  { level: "middle", label: "중학생", annualActivitySupport: 699_000, badge: "공식" },
  { level: "high", label: "고등학생", annualActivitySupport: 860_000, badge: "공식" },
];

export const EBE_THRESHOLDS = WBE_2026_THRESHOLDS.map((row) => ({
  householdSize: row.householdSize,
  medianIncome: row.medianIncome,
  educationThreshold: row.education,
  educationCostCheckLine: Math.round(row.medianIncome * 0.8),
}));

export const EBE_DEFAULT_INPUT: EbeInput = {
  householdSize: 4,
  monthlyRecognizedIncome: 2_800_000,
  elementaryCount: 1,
  middleCount: 1,
  highCount: 0,
  showEducationCostSupport: true,
};

export const EBE_PRESETS: EbePreset[] = [
  {
    id: "four-two-children",
    label: "4인 가구 자녀 2명",
    summary: "초등 1명, 중학생 1명, 소득인정액 280만원",
    input: {
      householdSize: 4,
      monthlyRecognizedIncome: 2_800_000,
      elementaryCount: 1,
      middleCount: 1,
      highCount: 0,
      showEducationCostSupport: true,
    },
  },
  {
    id: "single-parent-middle",
    label: "2인 한부모 중학생",
    summary: "중학생 1명, 소득인정액 180만원",
    input: {
      householdSize: 2,
      monthlyRecognizedIncome: 1_800_000,
      elementaryCount: 0,
      middleCount: 1,
      highCount: 0,
      showEducationCostSupport: true,
    },
  },
  {
    id: "high-school",
    label: "3인 가구 고등학생",
    summary: "고등학생 1명, 소득인정액 250만원",
    input: {
      householdSize: 3,
      monthlyRecognizedIncome: 2_500_000,
      elementaryCount: 0,
      middleCount: 0,
      highCount: 1,
      showEducationCostSupport: true,
    },
  },
];

export const EBE_SOURCES = [
  {
    label: "교육부 2026년 교육급여·교육비 지원 보도자료",
    url: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105459&lev=0&m=020402&opType=N&page=1&s=moe&searchType=null&statusYN=W&temp=Y",
    badge: "공식" as EbeEvidenceBadge,
  },
  {
    label: "교육부 2026년 교육급여 선정기준 고시",
    url: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=104926&lev=0&m=0302",
    badge: "공식" as EbeEvidenceBadge,
  },
  {
    label: "교육급여 바우처",
    url: "https://e-voucher.kosaf.go.kr/",
    badge: "공식" as EbeEvidenceBadge,
  },
  {
    label: "복지로",
    url: "https://www.bokjiro.go.kr/",
    badge: "공식" as EbeEvidenceBadge,
  },
  {
    label: "교육비 원클릭 신청 시스템",
    url: "https://oneclick.neis.go.kr/",
    badge: "공식" as EbeEvidenceBadge,
  },
];

export const EBE_FAQ = [
  {
    question: "2026년 교육급여 기준은 얼마인가요?",
    answer:
      "2026년 교육급여는 기준 중위소득 50% 이하 가구의 초·중·고 학생을 대상으로 합니다. 예를 들어 4인 가구 기준은 월 소득인정액 3,247,369원 이하입니다.",
  },
  {
    question: "2026년 교육활동지원비는 얼마인가요?",
    answer:
      "교육부 발표 기준 초등학생은 연 502,000원, 중학생은 연 699,000원, 고등학생은 연 860,000원입니다.",
  },
  {
    question: "교육급여와 교육비 지원은 같은 제도인가요?",
    answer:
      "아닙니다. 교육급여는 국민기초생활보장법에 따른 전국 공통 급여이고, 교육비 지원은 시도교육청이 자체 기준으로 운영하는 지원 사업입니다.",
  },
  {
    question: "교육급여는 어디에서 신청하나요?",
    answer:
      "주소지 읍면동 행정복지센터를 방문하거나 복지로, 교육비 원클릭 신청 시스템에서 신청할 수 있습니다.",
  },
  {
    question: "교육급여 바우처는 자동으로 나오나요?",
    answer:
      "신규 수급자로 선정되면 교육급여 신청과 별도로 교육급여 바우처 누리집에서 이용권을 신청해야 합니다.",
  },
  {
    question: "교육급여 기준을 조금 넘으면 아무 지원도 못 받나요?",
    answer:
      "그렇지 않을 수 있습니다. 교육급여 기준을 넘더라도 시도교육청의 교육비 지원은 보통 중위소득 50~80% 이하 등 별도 기준으로 확인할 수 있습니다.",
  },
  {
    question: "소득인정액을 모르면 어떻게 하나요?",
    answer:
      "소득인정액은 소득과 재산을 함께 반영한 값입니다. 정확한 값은 심사로 결정되며, 모를 때는 복지급여 수급 자격 계산기에서 먼저 간이 계산해보는 흐름이 좋습니다.",
  },
  {
    question: "이미 교육급여를 받고 있으면 다시 신청해야 하나요?",
    answer:
      "기존 지원을 받고 있는 학생은 일반적으로 다시 신청하지 않아도 됩니다. 다만 신규 수급자나 새로 지원이 필요한 학생은 신청해야 합니다.",
  },
];

export const EBE_SEO_CONTENT = {
  introTitle: "교육급여는 교육비 지원과 함께 확인해야 합니다",
  intro: [
    "교육급여는 초·중·고 학생이 있는 저소득 가구의 교육비 부담을 줄이기 위한 기초생활보장 급여입니다. 2026년 기준으로 교육급여는 기준 중위소득 50% 이하 가구의 학생을 대상으로 하며, 학생의 학교급에 따라 교육활동지원비가 연 1회 지원됩니다.",
    "2026년 교육활동지원비는 초등학생 50만 2천원, 중학생 69만 9천원, 고등학생 86만원입니다. 고등학생은 학교 유형에 따라 입학금, 수업료, 교과서비 지원 여부도 함께 확인해야 합니다.",
    "교육급여와 교육비 지원은 이름이 비슷하지만 서로 다릅니다. 교육급여는 전국 공통 법정 급여이고, 교육비 지원은 시도교육청이 운영하는 지원 사업입니다. 교육비 지원에는 급식비, 방과후학교 자유수강권, 교육정보화비, 고교 학비 등이 포함될 수 있습니다.",
    "소득기준은 단순 월급이 아니라 소득인정액으로 봐야 합니다. 소득인정액은 소득과 재산을 함께 반영한 값이므로 월급만 보고 대상 여부를 단정하기 어렵습니다. 소득인정액을 모른다면 복지급여 수급 자격 계산기로 먼저 간이 확인해보는 것이 좋습니다.",
    "교육급여는 연중 신청할 수 있지만 신청일을 기준으로 지원되기 때문에 집중 신청 기간에 맞춰 신청하는 것이 유리합니다. 신규 수급자로 선정되면 교육급여 신청만으로 끝나는 것이 아니라 교육급여 바우처 이용권도 별도로 신청해야 합니다.",
  ],
  inputPoints: [
    "가구원 수와 월 소득인정액을 입력하면 2026년 교육급여 기준 중위소득 50% 기준과 비교합니다.",
    "초등·중등·고등 학생 수를 입력하면 선정 시 받을 수 있는 교육활동지원비 합계를 계산합니다.",
    "교육급여 기준을 넘는 경우에도 교육비 지원 확인 후보를 함께 안내합니다.",
    "소득인정액을 모르면 복지급여 수급 자격 계산기에서 먼저 간이 계산해보세요.",
  ],
  criteria: [
    "2026년 교육급여는 기준 중위소득 50% 이하 가구의 학생이 대상입니다.",
    "교육활동지원비는 초등 502,000원, 중등 699,000원, 고등 860,000원입니다.",
    "교육비 지원은 시도교육청 재량 사업으로 지역별 기준과 항목이 다를 수 있습니다.",
    "이 계산기는 자가진단용이며 실제 선정 여부는 소득·재산 조사와 교육청 심사 결과를 따릅니다.",
  ],
};

export const EBE_RELATED_LINKS = [
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "소득인정액을 모른다면 생계·주거·교육급여 기준을 먼저 함께 확인하세요.",
  },
  {
    href: "/tools/school-uniform-cost-calculator-2026/",
    label: "중학교 교복비 계산기 2026",
    description: "교복·체육복 첫 구매 비용과 지원금 차감 후 부담액을 계산합니다.",
  },
  {
    href: "/reports/elementary-school-ready-cost-2026/",
    label: "초등학교 입학 준비 비용 2026",
    description: "책가방, 문구, 체육복 등 입학 전 준비 비용을 확인합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "월 학원비와 연간 교육비를 따로 계산합니다.",
  },
  {
    href: "/compare/welfare/",
    label: "지원금 비교표",
    description: "청년·출산·복지급여 지원금을 상황별로 비교합니다.",
  },
];

export function getEbeThreshold(householdSize: number) {
  return EBE_THRESHOLDS.find((item) => item.householdSize === householdSize) ?? EBE_THRESHOLDS[3];
}

export function calcEducationBenefit(input: EbeInput) {
  const threshold = getEbeThreshold(input.householdSize);
  const gap = threshold.educationThreshold - input.monthlyRecognizedIncome;
  const ratio = threshold.educationThreshold > 0 ? input.monthlyRecognizedIncome / threshold.educationThreshold : 0;
  const status: EbeEligibilityStatus =
    input.monthlyRecognizedIncome <= threshold.educationThreshold
      ? "eligible"
      : input.monthlyRecognizedIncome <= threshold.educationThreshold * 1.1
        ? "borderline"
        : "over";
  const educationCostStatus: EbeEducationCostStatus =
    input.monthlyRecognizedIncome <= threshold.educationThreshold
      ? "likely"
      : input.monthlyRecognizedIncome <= threshold.educationCostCheckLine
        ? "check"
        : "unlikely";
  const elementarySupport = input.elementaryCount * 502_000;
  const middleSupport = input.middleCount * 699_000;
  const highSupport = input.highCount * 860_000;
  const totalActivitySupport = elementarySupport + middleSupport + highSupport;

  return {
    threshold,
    gap,
    ratio,
    status,
    educationCostStatus,
    supportByLevel: { elementarySupport, middleSupport, highSupport },
    totalActivitySupport,
    expectedActivitySupport: status === "eligible" ? totalActivitySupport : 0,
    studentCount: input.elementaryCount + input.middleCount + input.highCount,
  };
}
