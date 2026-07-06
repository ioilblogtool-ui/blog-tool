export type EducationTrack = "STANDARD" | "NURSE" | "LICENSED_50H";

export interface EducationTrackInfo {
  code: EducationTrack;
  label: string;
  hours: number;
  breakdown: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const CCRC_META = {
  slug: "caregiver-certificate-roi-calculator-2026",
  title: "요양보호사 자격증 계산기 2026",
  seoTitle: "요양보호사 자격증 계산기 2026 | 투자비 회수기간 바로 계산",
  seoDescription:
    "교육비·취득기간 입력하면 자격증 취득 후 몇 개월 만에 투자비를 회수하는지 바로 계산. 320시간 표준교육과정 기준 안내 포함.",
  updatedAt: "2026-07-06",
  dataNote:
    "표준교육 320시간(이론126·실기114·실습80)은 노인복지법 시행규칙 제29조의2·별표10의2 기준입니다. 국가자격(간호사 등) 소지자는 40~50시간 단축과정이 적용됩니다. 교육비·실제 소요기간은 교육기관마다 다르므로 이 계산은 자가 점검용입니다.",
};

export const CCRC_EDUCATION_TRACKS: EducationTrackInfo[] = [
  { code: "STANDARD", label: "일반 (자격 없음)", hours: 320, breakdown: "이론126 · 실기114 · 실습80" },
  { code: "NURSE", label: "간호사 소지자", hours: 40, breakdown: "이론26 · 실기6 · 실습8" },
  { code: "LICENSED_50H", label: "간호조무사·사회복지사·물리치료사·작업치료사 소지자", hours: 50, breakdown: "단축과정 50시간" },
];

export function calcRoi(input: {
  educationCost: number;
  dailyStudyHours: number;
  track: EducationTrack;
  expectedMonthlyPay: number;
  currentMonthlyPay: number;
}) {
  const trackInfo = CCRC_EDUCATION_TRACKS.find((t) => t.code === input.track) ?? CCRC_EDUCATION_TRACKS[0];
  const studyDays = Math.ceil(trackInfo.hours / Math.max(input.dailyStudyHours, 1));
  const additionalMonthlyIncome = Math.max(input.expectedMonthlyPay - input.currentMonthlyPay, 0);
  const roiMonths = additionalMonthlyIncome > 0 ? input.educationCost / additionalMonthlyIncome : null;
  return { trackInfo, studyDays, additionalMonthlyIncome, roiMonths };
}

export const CCRC_FAQ: FaqItem[] = [
  {
    question: "요양보호사 교육은 꼭 320시간 다 들어야 하나요?",
    answer: "일반 응시자는 320시간(이론126·실기114·실습80)을 이수해야 합니다. 간호사·간호조무사 등 관련 국가자격 소지자는 40~50시간 단축과정이 적용됩니다.",
  },
  {
    question: "간호조무사 자격이 있으면 얼마나 단축되나요?",
    answer: "간호조무사, 사회복지사, 물리치료사, 작업치료사는 50시간 단축과정으로 자격 취득이 가능합니다.",
  },
  {
    question: "교육비는 지역마다 다른가요?",
    answer: "네. 교육기관·지역에 따라 교육비가 다르므로 실제 등록 전 여러 기관을 비교하는 것이 좋습니다.",
  },
  {
    question: "자격증 취득 후 바로 취업할 수 있나요?",
    answer: "고령화로 요양보호사 수요가 꾸준한 편이라 자격증 취득 후 비교적 빠르게 취업하는 경우가 많지만, 지역·시설별 채용 상황에 따라 다릅니다.",
  },
  {
    question: "방문요양과 요양원 중 월급 차이가 있나요?",
    answer: "근무 형태(시간제·상근직)와 시설 종류에 따라 다릅니다. 방문요양은 시간제가 많고, 요양원·재가센터는 상근직 비중이 높은 편입니다.",
  },
];

export const CCRC_SEO_INTRO = [
  "요양보호사는 60대 이후 진입할 수 있는 대표적인 자격증 기반 직업이지만, 교육비와 시간을 들여서 자격증을 딸 만한 가치가 있는지 궁금한 분들이 많습니다. 이 계산기는 교육비, 하루 학습 가능 시간, 취득 후 예상 월급, 현재 월급을 입력하면 자격증 취득 후 몇 개월 만에 투자비를 회수하는지 계산합니다.",
  "요양보호사 표준교육과정은 노인복지법 시행규칙 제29조의2·별표10의2에 따라 총 320시간(이론126시간·실기114시간·실습80시간)으로 정해져 있습니다. 다만 간호사, 간호조무사, 사회복지사, 물리치료사, 작업치료사처럼 관련 국가자격을 이미 가진 사람은 40~50시간의 단축 교육과정만 이수하면 됩니다. 이 차이는 학습 소요 기간에 직접 영향을 줍니다.",
  "회수 기간 계산은 단순합니다. 자격증 취득 후 예상 월급에서 현재(자격증 취득 전) 월급을 뺀 '추가 수입'을 기준으로, 교육비를 그 추가 수입으로 나누면 몇 개월 만에 투자비를 회수하는지 알 수 있습니다. 추가 수입이 클수록, 교육비가 적을수록 회수 기간이 짧아집니다.",
  "학습 소요 기간도 함께 확인할 수 있습니다. 하루에 몇 시간을 학습에 쓸 수 있는지 입력하면, 320시간(또는 단축과정 40~50시간)을 이수하는 데 며칠이 걸리는지 계산합니다. 평일 위주로 학습하는지, 주말까지 포함하는지에 따라 실제 소요 기간은 달라질 수 있습니다.",
  "교육비와 실제 취업 후 월급은 교육기관과 근무 형태(방문요양·요양원·재가센터)에 따라 차이가 크므로, 이 계산은 자가 점검용 추정입니다. 실제 등록 전에는 여러 교육기관의 교육비를 비교하고, 지역 채용 공고에서 실제 급여 수준을 확인하는 것을 권장합니다.",
];

export const CCRC_SEO_CRITERIA = [
  "표준교육 320시간(이론126·실기114·실습80)은 노인복지법 시행규칙 제29조의2·별표10의2 기준입니다",
  "간호사 소지자는 40시간, 간호조무사·사회복지사·물리치료사·작업치료사 소지자는 50시간 단축과정이 적용됩니다",
  "회수기간 = 교육비 ÷ (취득 후 예상 월급 - 현재 월급)",
  "교육비·실제 취업 후 급여는 교육기관·근무형태에 따라 달라 이 계산은 자가 점검용입니다",
];

export const CCRC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/senior-job-salary-calculator-2026/", label: "60대 일자리 월급 계산기", description: "요양보호사 외 다른 일자리와 비교해봅니다." },
  { href: "/reports/senior-job-comparison-2026/", label: "경비 vs 미화 vs 요양보호사 비교 리포트", description: "직업별 월급·준비기간·체력부담을 한 화면에서 비교합니다." },
  { href: "/tools/ltci-grade-benefit-calculator-2026/", label: "장기요양등급 혜택·비용 계산기", description: "돌봄을 받는 쪽의 혜택도 함께 확인합니다." },
  { href: "/reports/nursing-home-vs-home-care-cost-2026/", label: "요양원 vs 재가요양 월비용 비교", description: "요양보호사 근무처의 비용 구조를 비교합니다." },
];
