export interface AfterschoolCareInput {
  grade: "lower" | "third" | "upper";
  programCount: number;
  programMonthlyFee: number;
  careMonthlyFee: number;
  snackMonthlyFee: number;
  materialMonthlyFee: number;
  academyMonthlyFee: number;
  semesterMonths: number;
  voucherAmount: number;
}

export interface AfterschoolCareResult {
  monthlyProgramCost: number;
  monthlySchoolCost: number;
  monthlyTotalCost: number;
  semesterSchoolCost: number;
  semesterAcademyCost: number;
  semesterGrossCost: number;
  semesterProgramCost: number;
  semesterVoucher: number;
  remainingVoucher: number;
  semesterNetCost: number;
  monthlyNetCost: number;
  schoolShare: number;
  academyShare: number;
  voucherSavingRate: number;
  insight: string;
}

export const AFTERSCHOOL_CARE_META = {
  slug: "afterschool-care-cost-calculator-2026",
  title: "2학기 방과후·돌봄 비용 계산기",
  seoTitle: "2026 초등학교 방과후·돌봄 비용 계산기 | 초3 50만원 이용권 반영",
  seoDescription:
    "초등학교 2학기 방과후학교, 돌봄교실, 간식비, 교재비, 학원비를 합산해 월 비용과 학기 순부담을 계산합니다. 2026년 초3 방과후 프로그램 이용권 잔액도 반영할 수 있습니다.",
  updatedAt: "2026-07-22",
  dataNote:
    "2026년에는 방과후학교 참여를 희망하는 초등학교 3학년 학생에게 연 50만 원 이내 방과후 프로그램 이용권을 제공하는 계획이 발표됐습니다. 지급 방식, 신청 절차, 사용 가능한 프로그램은 교육청·학교별 안내를 확인해야 합니다.",
};

export const AFTERSCHOOL_CARE_DEFAULT_INPUT: AfterschoolCareInput = {
  grade: "third",
  programCount: 3,
  programMonthlyFee: 35_000,
  careMonthlyFee: 0,
  snackMonthlyFee: 30_000,
  materialMonthlyFee: 20_000,
  academyMonthlyFee: 180_000,
  semesterMonths: 5,
  voucherAmount: 0,
};

export const AFTERSCHOOL_CARE_PRESETS = [
  {
    id: "schoolOnly",
    label: "학교 방과후 중심",
    summary: "방과후 3개+간식, 학원 없음",
    input: { grade: "third", programCount: 3, programMonthlyFee: 35_000, careMonthlyFee: 0, snackMonthlyFee: 30_000, materialMonthlyFee: 20_000, academyMonthlyFee: 0, voucherAmount: 300_000 },
  },
  {
    id: "dual",
    label: "맞벌이 돌봄형",
    summary: "돌봄+방과후 3개+학원 1개",
    input: { grade: "third", programCount: 3, programMonthlyFee: 35_000, careMonthlyFee: 30_000, snackMonthlyFee: 45_000, materialMonthlyFee: 20_000, academyMonthlyFee: 150_000, voucherAmount: 200_000 },
  },
  {
    id: "academyMix",
    label: "학원 병행형",
    summary: "방과후 2개+학원 2개",
    input: { grade: "upper", programCount: 2, programMonthlyFee: 40_000, careMonthlyFee: 0, snackMonthlyFee: 0, materialMonthlyFee: 25_000, academyMonthlyFee: 320_000, voucherAmount: 0 },
  },
  {
    id: "minimal",
    label: "최소 비용형",
    summary: "방과후 1개+돌봄 중심",
    input: { grade: "lower", programCount: 1, programMonthlyFee: 30_000, careMonthlyFee: 0, snackMonthlyFee: 30_000, materialMonthlyFee: 10_000, academyMonthlyFee: 0, voucherAmount: 0 },
  },
  {
    id: "activity",
    label: "예체능 중심형",
    summary: "체육·미술·음악 3개",
    input: { grade: "upper", programCount: 3, programMonthlyFee: 45_000, careMonthlyFee: 0, snackMonthlyFee: 0, materialMonthlyFee: 35_000, academyMonthlyFee: 120_000, voucherAmount: 0 },
  },
];

export const AFTERSCHOOL_SUPPORT_ROWS = [
  { label: "초1~2", support: "학교 안 돌봄·교육 프로그램 중심 지원", note: "참여 가능 시간, 돌봄 정원, 방학 운영 여부 확인" },
  { label: "초3", support: "희망 학생 대상 방과후 프로그램 이용권 연 50만 원 이내 제공", note: "남은 이용권 잔액과 사용 가능한 강좌 확인" },
  { label: "초4~6", support: "학교와 지역 기관을 연계한 돌봄 사각지대 보완", note: "지역 돌봄기관, 야간·주말·긴급 돌봄 운영 여부 확인" },
];

export const AFTERSCHOOL_VOUCHER_QUICK_VALUES = [
  { label: "이용권 없음", value: 0 },
  { label: "20만원 남음", value: 200_000 },
  { label: "30만원 남음", value: 300_000 },
  { label: "전액 남음", value: 500_000 },
];

export const AFTERSCHOOL_CHECKLIST = [
  "학교 안내문에 나온 방과후 과목별 월 수강료와 재료비 포함 여부",
  "돌봄교실 모집 정원, 운영 시간, 방학 중 운영 여부",
  "간식비·급식비·귀가 차량비처럼 매월 붙는 부대비용",
  "초3 방과후 이용권 신청 여부, 남은 잔액, 사용 가능한 프로그램",
  "교육비 지원·자유수강권 등 다른 지원과 중복 적용 가능 여부",
  "학원·학습지 병행 시 월 고정비와 학기 중단 가능 여부",
];

export function calcAfterschoolCareCost(input: AfterschoolCareInput): AfterschoolCareResult {
  const monthlyProgramCost = input.programCount * input.programMonthlyFee;
  const monthlySchoolCost = monthlyProgramCost + input.careMonthlyFee + input.snackMonthlyFee + input.materialMonthlyFee;
  const monthlyTotalCost = monthlySchoolCost + input.academyMonthlyFee;
  const semesterSchoolCost = monthlySchoolCost * input.semesterMonths;
  const semesterAcademyCost = input.academyMonthlyFee * input.semesterMonths;
  const semesterGrossCost = monthlyTotalCost * input.semesterMonths;
  const semesterProgramCost = monthlyProgramCost * input.semesterMonths;
  const semesterVoucher = Math.min(input.voucherAmount, semesterProgramCost);
  const remainingVoucher = Math.max(input.voucherAmount - semesterVoucher, 0);
  const semesterNetCost = Math.max(semesterGrossCost - semesterVoucher, 0);
  const monthlyNetCost = input.semesterMonths > 0 ? semesterNetCost / input.semesterMonths : 0;
  const schoolShare = monthlyTotalCost > 0 ? (monthlySchoolCost / monthlyTotalCost) * 100 : 0;
  const academyShare = monthlyTotalCost > 0 ? input.academyMonthlyFee / monthlyTotalCost * 100 : 0;
  const voucherSavingRate = semesterGrossCost > 0 ? (semesterVoucher / semesterGrossCost) * 100 : 0;
  const insight =
    academyShare >= 50
      ? "현재 예산에서는 학원·학습지 비용 비중이 큽니다. 전체 부담을 줄이려면 방과후 과목 수보다 학원비 조정이 더 큰 영향을 줄 수 있습니다."
      : schoolShare >= 70
        ? "현재 예산에서는 학교 방과후·돌봄 비용 비중이 큽니다. 과목별 수강료와 재료비 포함 여부를 학교 안내문에서 다시 확인하세요."
        : "학교 비용과 학원비가 비교적 균형 있게 섞여 있습니다. 이용권 적용 후 남는 학기 순부담을 기준으로 신청 조합을 비교해 보세요.";
  return {
    monthlyProgramCost,
    monthlySchoolCost,
    monthlyTotalCost,
    semesterSchoolCost,
    semesterAcademyCost,
    semesterGrossCost,
    semesterProgramCost,
    semesterVoucher,
    remainingVoucher,
    semesterNetCost,
    monthlyNetCost,
    schoolShare,
    academyShare,
    voucherSavingRate,
    insight,
  };
}

export const AFTERSCHOOL_CARE_FAQ = [
  {
    question: "초3 방과후 이용권은 얼마로 계산하나요?",
    answer:
      "2026년에는 방과후학교 참여를 희망하는 초등학교 3학년 학생에게 연 50만 원 이내 방과후 프로그램 이용권을 제공하는 계획이 발표됐습니다. 2학기 계산에는 연 50만 원 전체가 아니라 1학기에 사용한 금액을 제외한 남은 이용권 잔액을 입력하는 편이 안전합니다.",
  },
  {
    question: "초3이면 모두 자동으로 받을 수 있나요?",
    answer:
      "희망 학생을 대상으로 운영되는 지원이지만 신청 방식, 지급 절차, 사용 가능한 강좌는 교육청과 학교별 안내가 다를 수 있습니다. 학교 가정통신문이나 교육청 공지에서 신청 여부와 지급 방식을 확인하세요.",
  },
  {
    question: "이용권으로 일반 학원비도 뺄 수 있나요?",
    answer:
      "일반 학원비에 자유롭게 사용할 수 있다고 가정하면 안 됩니다. 이 계산기는 이용권을 방과후 프로그램 수강료 한도 안에서만 차감하도록 계산합니다. 실제 사용처와 결제 방식은 학교 안내를 확인해야 합니다.",
  },
  {
    question: "돌봄교실은 무료인가요?",
    answer:
      "돌봄 자체는 학교와 지역 여건에 따라 부담이 낮을 수 있지만, 간식비·프로그램 재료비·방학 중 추가 운영비가 붙을 수 있습니다. 그래서 이 계산기는 돌봄 비용과 간식비를 별도 입력으로 분리했습니다.",
  },
  {
    question: "학원비도 같이 넣어야 하나요?",
    answer:
      "2학기 예산을 짤 때는 학교 방과후만 보는 것보다 학원·학습지·교재비를 함께 넣는 편이 현실적입니다. 결과에서 학교 비용과 전체 비용을 나눠 보여줍니다.",
  },
  {
    question: "방과후 수강료 기본값은 공식 금액인가요?",
    answer:
      "아닙니다. 학교·강좌·지역에 따라 달라지는 참고 입력값입니다. 실제 수강 신청 안내문에 나온 월 수강료로 바꿔 계산해야 합니다.",
  },
  {
    question: "방학 중 돌봄 비용도 포함되나요?",
    answer:
      "기본은 2학기 5개월 기준입니다. 방학 중 별도 돌봄·캠프·학원비가 있다면 학기 개월 수나 월 비용을 직접 조정해 포함할 수 있습니다.",
  },
  {
    question: "방과후 자유수강권과 초3 이용권은 같은 제도인가요?",
    answer:
      "별개의 지원 제도로 보는 것이 안전합니다. 자유수강권은 교육비 지원 대상 학생을 위한 제도이고, 초3 방과후 프로그램 이용권은 2026년 방과후 참여 확대를 위해 추진되는 지원입니다. 중복 적용과 사용 순서는 학교 또는 교육청에 확인하세요.",
  },
];

export const AFTERSCHOOL_CARE_SEO_CONTENT = {
  introTitle: "2학기 방과후와 돌봄, 월 비용보다 학기 총액을 봐야 합니다",
  intro: [
    "초등학교 2학기가 시작되면 방과후학교, 돌봄교실, 학원, 학습지 비용이 한꺼번에 다시 잡힙니다. 한 과목 수강료만 보면 부담이 작아 보여도 여러 과목을 신청하고 간식비와 교재비, 학원비를 더하면 학기 총액은 꽤 커질 수 있습니다.",
    "2026년에는 온동네 초등돌봄·교육 정책으로 초등 3학년 방과후 프로그램 선택권을 강화하고 연 50만 원 이내 이용권을 제공하는 계획이 발표됐습니다. 초1~2는 돌봄 공백 해소, 초3은 방과후 교육 선택권, 초4 이상은 지역 여건에 따른 사각지대 해소가 중요한 구조입니다.",
    "이 계산기는 방과후 과목 수와 과목당 수강료, 돌봄·간식·교재비, 민간 학원비를 나눠 입력하게 해 월 비용과 2학기 순부담을 함께 보여줍니다. 초3 이용권은 1학기 사용분을 제외한 남은 잔액을 입력하고, 방과후 프로그램 수강료 한도 안에서만 차감하도록 계산합니다.",
    "결과는 학교 선택을 대신해주는 확정 판단이 아니라 예산표입니다. 학교별 프로그램 개설 여부, 돌봄 정원, 귀가 시간, 방학 운영, 교육비 지원 대상 여부가 모두 다르므로 실제 신청 전에는 학교 안내문과 교육청 공지를 함께 확인해야 합니다.",
  ],
  criteria: [
    "방과후 수강료는 과목 수 × 과목당 월 수강료로 계산합니다.",
    "돌봄비, 간식비, 재료비, 학원비는 별도 입력값으로 합산합니다.",
    "초3 이용권은 연간 지원 한도 전체가 아니라 2학기에 실제 사용할 수 있는 남은 잔액을 입력합니다.",
    "이용권은 학원비나 간식비 전체가 아니라 방과후 프로그램 수강료 범위 안에서만 차감합니다.",
    "결과는 학교·지역별 실제 고지액과 다를 수 있는 참고 예산입니다.",
  ],
};

export const AFTERSCHOOL_CARE_RELATED_LINKS = [
  { href: "/reports/elementary-school-ready-cost-2026/", label: "초등 입학 준비 비용", description: "준비물과 방과후 선택 기준을 함께 봅니다." },
  { href: "/tools/school-uniform-cost-calculator-2026/", label: "중학교 교복비 계산기", description: "학년 전환 준비 비용을 계산합니다." },
  { href: "/tools/ai-tutoring-vs-academy-cost/", label: "AI 학습 vs 학원비", description: "학원비 절감 시나리오를 비교합니다." },
];
