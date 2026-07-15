import { MINIMUM_WAGE_2026, WEEKLY_HOLIDAY_MIN_HOURS, MONTHLY_WEEKS } from "./minimumWage2026";

export type WorkType = "CAMPUS_WORK_STUDY" | "OFFCAMPUS_WORK_STUDY" | "CONVENIENCE_STORE" | "CAFE";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface WorkProfile {
  type: WorkType;
  label: string;
  hourlyWage: number;
  monthlyHoursScenario: number; // 참고 시나리오, 절대 상한 아님
  scenarioNote: string;
  location: string;
  studyCompat: "좋음" | "보통";
  commuteCost: "낮음" | "있음";
  durationLimit: string;
}

// 주휴수당 판정(주 15시간 이상) — minimumWage2026.ts 상수 재사용, 재정의 금지
function calcWeeklyHolidayPay(hourlyWage: number, weeklyHours: number): number {
  return weeklyHours >= WEEKLY_HOLIDAY_MIN_HOURS ? (weeklyHours / 40) * 8 * hourlyWage : 0;
}

// 정적 리포트 — 서버에서 고정 시나리오로 미리 계산해 렌더 (public/scripts 없음)
export function calcMonthlyIncome(hourlyWage: number, monthlyHours: number): number {
  const weeklyHours = monthlyHours / MONTHLY_WEEKS;
  const weeklyHolidayPay = calcWeeklyHolidayPay(hourlyWage, weeklyHours) * MONTHLY_WEEKS;
  return hourlyWage * monthlyHours + weeklyHolidayPay;
}

export const WSC_WORK_PROFILES: WorkProfile[] = [
  {
    type: "CAMPUS_WORK_STUDY",
    label: "국가근로(교내 일반)",
    hourlyWage: MINIMUM_WAGE_2026,
    monthlyHoursScenario: 40,
    scenarioNote: "학기 중 참고 시나리오(월 40시간) — 정확한 상한은 학교별 공지 확인 필요",
    location: "교내",
    studyCompat: "좋음",
    commuteCost: "낮음",
    durationLimit: "재학 중 최대 4학기(24개월)",
  },
  {
    type: "OFFCAMPUS_WORK_STUDY",
    label: "국가근로(교외 일반)",
    hourlyWage: 12_790,
    monthlyHoursScenario: 40,
    scenarioNote: "학기 중 참고 시나리오(월 40시간) — 정확한 상한은 학교별 공지 확인 필요",
    location: "협약기관",
    studyCompat: "보통",
    commuteCost: "있음",
    durationLimit: "횟수 제한 없음(협약기관 사정에 따라 다름)",
  },
  {
    type: "CONVENIENCE_STORE",
    label: "편의점 알바",
    hourlyWage: MINIMUM_WAGE_2026,
    monthlyHoursScenario: 70,
    scenarioNote: "참고 시나리오(주 16시간·월 70시간, 주휴수당 포함)",
    location: "매장",
    studyCompat: "보통",
    commuteCost: "있음",
    durationLimit: "제한 없음",
  },
  {
    type: "CAFE",
    label: "카페 알바",
    hourlyWage: MINIMUM_WAGE_2026,
    monthlyHoursScenario: 70,
    scenarioNote: "참고 시나리오(주 16시간·월 70시간, 주휴수당 포함)",
    location: "매장",
    studyCompat: "보통",
    commuteCost: "있음",
    durationLimit: "제한 없음",
  },
];

export const WSC_CALC_EXAMPLES = WSC_WORK_PROFILES.map((p) => ({
  ...p,
  monthlyIncome: calcMonthlyIncome(p.hourlyWage, p.monthlyHoursScenario),
}));

const incomeValues = WSC_CALC_EXAMPLES.map((p) => p.monthlyIncome);
export const WSC_MAX_INCOME = Math.max(...incomeValues);

export const WSC_META = {
  slug: "work-study-vs-part-time-comparison-2026",
  title: "국가근로 vs 알바 2026",
  seoTitle: "국가근로 vs 알바 2026 | 월 수입 얼마 차이날까",
  seoDescription:
    "국가근로장학금과 편의점·카페 알바의 시급·월 근로 참고 시나리오·예상 월수입을 비교합니다. 교내근로 학기 중·방학 중 조건 차이 포함.",
  description: "국가근로장학금과 편의점·카페 알바의 시급, 근로 조건, 예상 월수입을 비교하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "월 근로시간은 확정 상한이 아니라 비교를 위한 참고 시나리오입니다. 국가근로장학금의 정확한 월 근로시간 상한은 소속 대학 근로장학 안내를 따르며, 이 표의 시급·시간은 참고용입니다.",
};

export interface InsightItem {
  title: string;
  description: string;
}

export const WSC_INSIGHTS: InsightItem[] = [
  {
    title: "시급만 보면 알바가 유리해 보일 수 있습니다",
    description:
      "교외 근로(12,790원)를 제외하면 국가근로 교내와 일반 알바 시급은 2026년 최저임금으로 같습니다. 차이는 통학 비용·시간, 학업 병행 편의성에서 갈립니다.",
  },
  {
    title: "교내근로는 통학·생활 동선이 짧습니다",
    description: "학교 안에서 근무해 별도 교통비·이동시간이 거의 들지 않고, 수업 사이 시간을 활용하기 좋습니다.",
  },
  {
    title: "재학 중 이용 가능 학기 수 제한이 있습니다",
    description: "교내 근로는 재학 중 최대 4학기(24개월)까지만 가능해, 4년 내내 활용하려면 학기별 계획이 필요합니다.",
  },
];

export const WSC_FAQ: FaqItem[] = [
  {
    question: "국가근로장학금 시급은 얼마인가요?",
    answer: "교내 일반(봉사유형 포함)은 2026년 최저임금과 동일한 10,320원, 교외 일반(장애대학생 봉사유형 포함)은 12,790원입니다.",
  },
  {
    question: "국가근로장학금은 한 달에 얼마나 벌 수 있나요?",
    answer: "학기 중 월 40시간 참고 시나리오 기준 교내 근로는 약 41만 원대, 교외 근로는 약 51만 원대입니다. 정확한 근로시간 상한은 학교 공지에 따라 다릅니다.",
  },
  {
    question: "국가근로장학금과 일반 알바 중 뭐가 나은가요?",
    answer: "시급만 보면 비슷하거나 알바가 높을 수 있지만, 통학시간·교통비를 아낄 수 있고 학업과 병행하기 좋다는 점에서 교내 근로가 실질적으로 유리한 경우가 많습니다.",
  },
  {
    question: "국가근로장학금은 몇 학기까지 할 수 있나요?",
    answer: "교내 근로는 재학 중 최대 4학기(24개월)까지 가능합니다. 교외 근로는 협약기관 사정에 따라 다릅니다.",
  },
  {
    question: "방학 중에도 국가근로장학금을 할 수 있나요?",
    answer: "네, 방학 중 집중근로 프로그램이 별도로 운영됩니다. 학기 중보다 근로시간이 늘어나는 경우가 많으니 소속 대학 공지를 확인하세요.",
  },
  {
    question: "알바 시급 계산에 주휴수당이 포함되나요?",
    answer: "네, 이 리포트의 알바 월수입 예시는 주 15시간 이상 근무를 가정해 주휴수당을 포함한 금액입니다.",
  },
];

export const WSC_SEO_INTRO = [
  "대학생이 학기 중 수입을 고민할 때 가장 많이 비교하는 게 국가근로장학금과 일반 알바입니다. 국가근로(교내 일반)의 시급은 2026년 최저임금과 같은 10,320원이고, 교외 일반은 12,790원으로 더 높습니다. 이 리포트는 국가근로 교내·교외와 편의점·카페 알바를 시급, 근로 조건, 예상 월수입 기준으로 한 화면에서 비교합니다.",
  "시급만 보면 국가근로 교내와 일반 알바가 같아 차이가 없어 보이지만, 실제로는 근무 장소와 학업 병행 편의성에서 갈립니다. 국가근로 교내는 학교 안에서 근무해 통학·교통비 부담이 거의 없고 수업 사이 시간을 활용하기 좋은 반면, 알바는 매장 근무라 별도 이동시간과 교통비가 들 수 있습니다.",
  "월 예상수입은 학기 중 참고 시나리오(국가근로 월 40시간, 알바 월 70시간)를 기준으로 계산했으며, 알바 예시에는 주 15시간 이상 근무 시 발생하는 주휴수당을 포함했습니다. 다만 국가근로장학금의 정확한 월 근로시간 상한은 확인된 출처마다 표기가 달라, 이 리포트는 확정 상한이 아니라 비교를 위한 참고 시나리오로만 제시합니다.",
  "국가근로장학금은 재학 중 이용 가능한 횟수에도 제한이 있습니다. 교내 근로는 재학 중 최대 4학기(24개월)까지만 가능해, 4년 내내 활용하려면 학기별로 언제 신청할지 계획을 세우는 것이 좋습니다. 정확한 시급·근로시간·신청 절차는 반드시 소속 대학 근로장학 공지를 통해 확인해야 합니다.",
];

export const WSC_SEO_CRITERIA = [
  "국가근로 시급은 교내 일반 10,320원(2026 최저임금과 동일), 교외 일반 12,790원 기준입니다.",
  "월 예상수입은 학기 중 참고 시나리오(국가근로 월 40시간, 알바 월 70시간)로 계산한 예시이며 확정 근로시간이 아닙니다.",
  "알바 예시는 근로기준법 제55조 기준 주 15시간 이상 근무 시 주휴수당을 포함해 계산했습니다.",
  "정확한 국가근로장학금 조건(시급·근로시간·신청 자격)은 소속 대학 근로장학 안내를 따라야 합니다.",
];

export const WSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
  { href: "/tools/minimum-wage-2026/", label: "2026 최저임금 계산기", description: "이 리포트의 기준이 되는 최저임금을 상세 확인합니다." },
];
