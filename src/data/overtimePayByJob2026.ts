export type IndustryId = "it" | "large-office" | "sme-office" | "medical" | "production" | "public";

export interface IndustryStat {
  id: IndustryId;
  label: string;
  shortLabel: string;
  monthlyOvertimeHours: number;
  overtimePayRate: number;
  nightPayRate: number;
  holidayPayRate: number;
  popalRate: number;
  over52Rate: number;
  avgBasePay: number;
  representativeJob: string;
  overtimeNote: string;
  disputeIndex: number;
}

export interface CaseSimulation {
  id: string;
  label: string;
  industryId: IndustryId;
  basePay: number;
  scheduledHours: number;
  overtimeHours: number;
  nightHours: number;
  holidayUnder8: number;
  holidayOver8: number;
  isPopal: boolean;
  popalAmount: number;
  hourlyWage: number;
  overtimePay: number;
  nightPay: number;
  holidayPay: number;
  totalGross: number;
  totalNet: number;
  popalExcess: number;
}

export interface DisputeStat {
  year: number;
  totalCases: number;
  avgAmount: number;
}

export interface GenderAgeOvertimeStat {
  ageGroup: string;
  maleHours: number;
  femaleHours: number;
}

export const OPJ_META = {
  title: "2026 직종별 야근·수당 실태 완전 비교",
  subtitle: "IT·사무직·의료·생산직·공공기관 6개 업종의 야근 시간, 수당 지급률, 포괄임금제 위험 구간을 한 화면에서 비교합니다.",
  methodology: "고용노동부 제도 안내, 임금체불 진정 절차, 공개 통계와 현장 사례를 참고해 비교계산소가 표준화한 추정 리포트입니다.",
  caution: "직종별 수치는 기업 규모·노조·근로계약·교대 형태에 따라 달라질 수 있으므로, 개인 청구 전에는 근로계약서와 급여명세서를 기준으로 다시 계산해야 합니다.",
  updatedAt: "업데이트 기준: 2026년 5월",
};

export const INDUSTRY_STATS: IndustryStat[] = [
  {
    id: "it",
    label: "IT·소프트웨어",
    shortLabel: "IT",
    monthlyOvertimeHours: 28,
    overtimePayRate: 0.4,
    nightPayRate: 0.3,
    holidayPayRate: 0.35,
    popalRate: 0.7,
    over52Rate: 0.25,
    avgBasePay: 4200000,
    representativeJob: "개발자·PM·디자이너",
    overtimeNote: "포괄임금제가 흔하고 실제 추가 수당 지급률이 낮은 편입니다.",
    disputeIndex: 78,
  },
  {
    id: "large-office",
    label: "대기업 사무직",
    shortLabel: "대기업",
    monthlyOvertimeHours: 18,
    overtimePayRate: 0.65,
    nightPayRate: 0.55,
    holidayPayRate: 0.6,
    popalRate: 0.4,
    over52Rate: 0.1,
    avgBasePay: 4800000,
    representativeJob: "기획·마케팅·재무",
    overtimeNote: "월말 마감과 프로젝트 기간에 야근이 집중되는 구조입니다.",
    disputeIndex: 46,
  },
  {
    id: "sme-office",
    label: "중소기업 사무직",
    shortLabel: "중소사무",
    monthlyOvertimeHours: 22,
    overtimePayRate: 0.35,
    nightPayRate: 0.25,
    holidayPayRate: 0.3,
    popalRate: 0.65,
    over52Rate: 0.18,
    avgBasePay: 2900000,
    representativeJob: "영업·총무·인사",
    overtimeNote: "근로시간 기록이 약하고 수당 미지급 분쟁이 생기기 쉽습니다.",
    disputeIndex: 85,
  },
  {
    id: "medical",
    label: "의료·간호",
    shortLabel: "의료",
    monthlyOvertimeHours: 32,
    overtimePayRate: 0.8,
    nightPayRate: 0.75,
    holidayPayRate: 0.78,
    popalRate: 0.2,
    over52Rate: 0.3,
    avgBasePay: 3500000,
    representativeJob: "간호사·의료기사",
    overtimeNote: "야간·휴일 근무가 많고 교대 기록 체계가 비교적 명확합니다.",
    disputeIndex: 72,
  },
  {
    id: "production",
    label: "생산직·제조업",
    shortLabel: "생산직",
    monthlyOvertimeHours: 35,
    overtimePayRate: 0.85,
    nightPayRate: 0.82,
    holidayPayRate: 0.8,
    popalRate: 0.15,
    over52Rate: 0.28,
    avgBasePay: 3100000,
    representativeJob: "생산·설비·품질",
    overtimeNote: "교대·특근 구조가 뚜렷해 수당 규모가 가장 크게 잡히는 편입니다.",
    disputeIndex: 92,
  },
  {
    id: "public",
    label: "공공기관·공무원",
    shortLabel: "공공",
    monthlyOvertimeHours: 10,
    overtimePayRate: 0.9,
    nightPayRate: 0.88,
    holidayPayRate: 0.85,
    popalRate: 0,
    over52Rate: 0.04,
    avgBasePay: 3800000,
    representativeJob: "행정직·기술직",
    overtimeNote: "초과근무 승인 체계가 있어 빈도는 낮지만 지급률은 높은 편입니다.",
    disputeIndex: 28,
  },
];

export const CASE_SIMULATIONS: CaseSimulation[] = [
  {
    id: "case-it",
    label: "IT 개발자 A씨",
    industryId: "it",
    basePay: 4000000,
    scheduledHours: 209,
    overtimeHours: 20,
    nightHours: 0,
    holidayUnder8: 0,
    holidayOver8: 0,
    isPopal: true,
    popalAmount: 200000,
    hourlyWage: 19139,
    overtimePay: 574170,
    nightPay: 0,
    holidayPay: 0,
    totalGross: 574170,
    totalNet: 500276,
    popalExcess: 374170,
  },
  {
    id: "case-nurse",
    label: "간호사 B씨",
    industryId: "medical",
    basePay: 3400000,
    scheduledHours: 209,
    overtimeHours: 15,
    nightHours: 30,
    holidayUnder8: 8,
    holidayOver8: 8,
    isPopal: false,
    popalAmount: 0,
    hourlyWage: 16268,
    overtimePay: 366030,
    nightPay: 244020,
    holidayPay: 391632,
    totalGross: 1001682,
    totalNet: 873466,
    popalExcess: 0,
  },
  {
    id: "case-factory",
    label: "생산직 C씨",
    industryId: "production",
    basePay: 2800000,
    scheduledHours: 209,
    overtimeHours: 10,
    nightHours: 40,
    holidayUnder8: 8,
    holidayOver8: 0,
    isPopal: false,
    popalAmount: 0,
    hourlyWage: 13397,
    overtimePay: 200955,
    nightPay: 267940,
    holidayPay: 160764,
    totalGross: 629659,
    totalNet: 549062,
    popalExcess: 0,
  },
];

export const DISPUTE_STATS: DisputeStat[] = [
  { year: 2020, totalCases: 142, avgAmount: 1650000 },
  { year: 2021, totalCases: 156, avgAmount: 1780000 },
  { year: 2022, totalCases: 171, avgAmount: 1860000 },
  { year: 2023, totalCases: 189, avgAmount: 2050000 },
  { year: 2024, totalCases: 203, avgAmount: 2180000 },
  { year: 2025, totalCases: 216, avgAmount: 2310000 },
  { year: 2026, totalCases: 224, avgAmount: 2440000 },
];

export const GENDER_AGE_OVERTIME: GenderAgeOvertimeStat[] = [
  { ageGroup: "20대", maleHours: 22, femaleHours: 18 },
  { ageGroup: "30대", maleHours: 29, femaleHours: 23 },
  { ageGroup: "40대", maleHours: 24, femaleHours: 17 },
  { ageGroup: "50대", maleHours: 20, femaleHours: 14 },
];

export const SUMMARY_CARDS = [
  { label: "야근 최다 업종", value: "생산직·제조업", detail: "월 35시간 추정" },
  { label: "지급률 최저", value: "중소기업 사무직", detail: "연장수당 지급률 35% 추정" },
  { label: "포괄임금제 최다", value: "IT·소프트웨어", detail: "적용 비율 70% 추정" },
  { label: "분쟁 위험 최상단", value: "생산직·중소사무", detail: "근무 기록과 수당 산식 확인 필요" },
];

export const OPJ_STEPS = [
  "근로계약서, 급여명세서, 포괄임금 약정 문구를 먼저 모읍니다.",
  "출퇴근 기록, 메신저 업무 지시, 캘린더, 교대표처럼 실제 근무 시간을 입증할 자료를 정리합니다.",
  "통상임금 기준 시간급을 계산하고 연장·야간·휴일 가산분을 분리합니다.",
  "회사에 정산을 요청한 뒤 답변이 없거나 거절되면 고용노동부 임금체불 진정을 준비합니다.",
  "금액이 크거나 포괄임금 약정이 불명확하면 노무사 상담으로 청구 범위를 점검합니다.",
];

export const OPJ_STRATEGIES = [
  {
    title: "IT·사무직",
    body: "포괄임금제 문구와 실제 근무 기록의 차이를 핵심 근거로 삼아야 합니다. 메신저 지시와 배포 기록도 근무시간 입증에 도움이 됩니다.",
  },
  {
    title: "의료·생산직",
    body: "교대표와 특근 기록이 남는 경우가 많아 수당 산식 검증이 중요합니다. 야간과 휴일이 겹치는 날은 가산 구조를 따로 표시하세요.",
  },
  {
    title: "중소기업",
    body: "출퇴근 기록이 약하면 증거가 흩어지기 쉽습니다. 매일 근무 종료 시각과 업무 지시 내용을 별도로 기록해 두는 것이 좋습니다.",
  },
  {
    title: "이직 준비자",
    body: "면접에서 야근 빈도, 포괄임금 포함 금액, 초과분 정산 기준을 구체적으로 확인하면 입사 후 분쟁 가능성을 줄일 수 있습니다.",
  },
];

export const OPJ_REFERENCE_LINKS = [
  { href: "https://www.moel.go.kr/", label: "고용노동부" },
  { href: "https://minwon.moel.go.kr/", label: "고용노동부 민원마당" },
  { href: "/tools/overtime-pay-calculator/", label: "야근수당 계산기" },
  { href: "/reports/it-si-sm-salary-comparison-2026/", label: "IT SI·SM 연봉 비교" },
  { href: "/reports/large-company-salary-growth-by-years-2026/", label: "대기업 연차별 연봉 성장 비교" },
];

export const OPJ_FAQ = [
  {
    question: "어떤 직종이 야근이 가장 많은가요?",
    answer: "이 리포트 기준으로는 생산직·제조업이 월 35시간으로 가장 높고, 의료·간호와 IT·소프트웨어가 뒤를 잇습니다. 모두 비교계산소 추정값입니다.",
  },
  {
    question: "포괄임금제이면 야근수당을 받을 수 없나요?",
    answer: "그렇지 않습니다. 실제 법정 수당이 포괄임금으로 받은 금액을 넘으면 차액 청구 가능성이 있습니다. 약정 문구와 실제 근무 기록을 함께 확인해야 합니다.",
  },
  {
    question: "연장근로와 야간근로가 겹치면 어떻게 계산하나요?",
    answer: "야간 시간대에 연장근로를 했다면 연장 가산과 야간 가산을 함께 검토해야 합니다. 개인별 산식은 야근수당 계산기에서 별도로 확인하는 것이 안전합니다.",
  },
  {
    question: "수당 미지급 진정은 어디서 신청하나요?",
    answer: "고용노동부 민원마당에서 임금체불 진정을 신청할 수 있습니다. 근로계약서, 급여명세서, 출퇴근 기록을 준비하면 처리 과정이 빨라집니다.",
  },
  {
    question: "재택근무 중 야근도 수당 대상인가요?",
    answer: "사용자의 지시나 승인 아래 연장·야간·휴일 근로를 했다면 재택근무라도 수당 검토 대상이 될 수 있습니다. 업무 로그와 지시 기록이 중요합니다.",
  },
  {
    question: "임금채권 소멸시효는 얼마나 되나요?",
    answer: "임금 청구권은 일반적으로 3년 시효를 기준으로 검토합니다. 오래된 미지급분은 지체하지 말고 증거를 정리해 상담을 받는 편이 좋습니다.",
  },
  {
    question: "5인 미만 사업장도 야근수당이 있나요?",
    answer: "5인 미만 사업장은 일부 가산수당 규정 적용이 달라질 수 있습니다. 다만 야간근로 등 쟁점이 남을 수 있어 사업장 규모와 근로 형태를 함께 확인해야 합니다.",
  },
  {
    question: "이 리포트의 지급률은 공식 통계인가요?",
    answer: "아닙니다. 직종별 지급률과 포괄임금제 비율은 공개 자료와 현장 사례를 바탕으로 표준화한 추정값입니다. 공식 확정값처럼 사용하면 안 됩니다.",
  },
];

export const formatWon = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;
export const formatManwon = (value: number) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
