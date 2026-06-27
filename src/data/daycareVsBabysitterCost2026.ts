export type ChildAge = "age0" | "age1" | "age2" | "age3to5";
export type DaycareType = "public" | "private";
export type HomeCareMode = "sitterFull" | "sitterPart" | "shortWork";
export type CompanyPayMode = "AUTO" | "MANUAL";

export type Option<T extends string> = {
  id: T;
  label: string;
  note?: string;
};

export const DVB_CHILD_AGE_OPTIONS: Option<ChildAge>[] = [
  { id: "age0", label: "0세 (0~11개월)" },
  { id: "age1", label: "1세 (12~23개월)" },
  { id: "age2", label: "2세 (24~35개월)" },
  { id: "age3to5", label: "3~5세" },
];

// 어린이집 보육료 지원(바우처, 시설 직지급) — babyGovernmentSupport.ts BGS_DAYCARE_SUBSIDY와 동일 기준
export const DVB_DAYCARE_SUBSIDY: Record<ChildAge, number> = {
  age0: 540000,
  age1: 475000,
  age2: 394000,
  age3to5: 280000,
};

// 가정양육수당 — babyGovernmentSupport.ts BGS_HOME_CARE_ALLOWANCE 기준 (3세 이상은 가정양육수당 미지급)
export const DVB_HOME_CARE_ALLOWANCE: Record<ChildAge, number> = {
  age0: 200000,
  age1: 150000,
  age2: 100000,
  age3to5: 0,
};

export type DaycareExtraCostPreset = {
  type: DaycareType;
  label: string;
  defaultExtraCost: number;
  note: string;
};

export const DVB_DAYCARE_TYPE_OPTIONS: DaycareExtraCostPreset[] = [
  {
    type: "public",
    label: "국공립 어린이집",
    defaultExtraCost: 50000,
    note: "특별활동비·차량비가 상대적으로 낮은 편입니다.",
  },
  {
    type: "private",
    label: "민간 어린이집",
    defaultExtraCost: 90000,
    note: "특별활동비·현장학습비·차량비가 추가되는 경우가 많습니다.",
  },
];

export type SitterWagePreset = {
  id: string;
  label: string;
  hourlyWage: number;
  note: string;
};

export const DVB_SITTER_WAGE_PRESETS: SitterWagePreset[] = [
  { id: "gov", label: "정부 아이돌봄 단가", hourlyWage: 12180, note: "2026년 아이돌봄서비스 시간당 단가 추정" },
  { id: "private", label: "민간 평균 시세", hourlyWage: 15000, note: "민간 매칭 플랫폼 평균 시급 추정" },
  { id: "premium", label: "민간 상급 시세", hourlyWage: 20000, note: "경력·자격증 보유 베이비시터 평균 시급 추정" },
];

export const DVB_HOME_CARE_MODE_OPTIONS: Option<HomeCareMode>[] = [
  { id: "sitterFull", label: "베이비시터(전일)", note: "주 35~45시간 풀타임 돌봄" },
  { id: "sitterPart", label: "베이비시터(반일)", note: "주 15~25시간 반일 돌봄" },
  { id: "shortWork", label: "부모 단축근무", note: "육아기 근로시간 단축으로 부모가 직접 돌봄" },
];

// 육아기 근로시간 단축 급여 정책 — childcareShortTimePay.ts CHILDCARE_SHORT_TIME_PAY_POLICY와 동일 기준
export const DVB_SHORT_WORK_POLICY = {
  year: 2026,
  firstTenHoursCapWage: 2_500_000,
  extraHoursCapWage: 1_600_000,
  minimumBaseWage: 500_000,
  minWeeklyHoursAfter: 15,
  maxWeeklyHoursAfter: 35,
};

export interface DaycareVsBabysitterInput {
  childAge: ChildAge;
  daycareType: DaycareType;
  extraCostMonthly: number;
  homeCareMode: HomeCareMode;
  sitterHourlyWage: number;
  sitterWeeklyHours: number;
  monthlyOrdinaryWage: number;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  companyPayMode: CompanyPayMode;
  manualCompanyPay: number | null;
}

export const DVB_DEFAULT_INPUT: DaycareVsBabysitterInput = {
  childAge: "age1",
  daycareType: "public",
  extraCostMonthly: 50000,
  homeCareMode: "sitterFull",
  sitterHourlyWage: 12180,
  sitterWeeklyHours: 40,
  monthlyOrdinaryWage: 3_000_000,
  weeklyHoursBefore: 40,
  weeklyHoursAfter: 30,
  companyPayMode: "AUTO",
  manualCompanyPay: null,
};

export const DVB_META = {
  slug: "daycare-vs-babysitter-cost-2026",
  title: "어린이집 vs 가정보육 비용 비교 계산기 2026",
  seoTitle: "어린이집 vs 가정보육 비용 비교 계산기 2026 | 정부지원 반영 실질비용 바로 계산",
  description:
    "자녀 나이와 보육 형태를 입력하면 어린이집 순부담액과 베이비시터·단축근무 가정보육 비용을 정부지원금까지 반영해 바로 비교합니다. 월별 비용표 제공.",
  updatedAt: "2026-06-27",
};

export const DVB_FAQ = [
  {
    question: "어린이집 보육료는 부모가 안 내나요?",
    answer:
      "국공립·민간 어린이집 모두 정부 보육료 지원이 시설에 직접 지급되는 구조라 표준 보육료는 부모가 별도로 내지 않는 경우가 많습니다. 다만 특별활동비, 현장학습비, 차량비 등 추가비용은 시설별로 다르게 청구될 수 있습니다.",
  },
  {
    question: "베이비시터 비용이 가정양육수당보다 항상 비싼가요?",
    answer:
      "대체로 그렇습니다. 가정양육수당은 월 10~20만 원 수준인 반면, 풀타임 베이비시터 인건비는 시세에 따라 월 150만 원 이상이 될 수 있어 순부담액이 어린이집보다 훨씬 큰 경우가 많습니다.",
  },
  {
    question: "단축근무와 베이비시터 중 어느 쪽이 유리한가요?",
    answer:
      "부모의 통상임금, 단축 후 임금손실액, 베이비시터 시세에 따라 달라집니다. 통상임금이 높을수록 단축근무 임금손실이 커질 수 있어, 두 시나리오를 모두 입력해 비교하는 것이 안전합니다.",
  },
  {
    question: "가정양육수당은 몇 세까지 받을 수 있나요?",
    answer:
      "가정양육수당은 어린이집·유치원을 이용하지 않는 0~2세 아동에게 지급되며, 3세 이상은 보육료·유아학비 지원 체계로 전환되어 가정양육수당이 지급되지 않습니다.",
  },
  {
    question: "이 계산기의 비용은 정확한 금액인가요?",
    answer:
      "아니요. 어린이집 추가비용과 베이비시터 시급은 지역·기관·개인별 편차가 큰 평균값 기준 추정입니다. 실제 비용은 거주 지역, 이용 기관, 계약 조건에 따라 달라질 수 있습니다.",
  },
];

export const DVB_RELATED_LINKS = [
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직 + 육아기 단축근무 계산기" },
  { href: "/tools/childcare-short-time-pay-calculator/", label: "육아기 근로시간 단축 급여 계산기" },
  { href: "/tools/daycare-vs-kindergarten-cost/", label: "어린이집 vs 유치원 비용 계산기" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
];

export type DvbCta = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export const DVB_DAYCARE_CTA: DvbCta = {
  id: "daycare-waitlist",
  label: "우리 동네 어린이집 대기 확인하기",
  href: "/tools/daycare-waitlist-checklist/",
};

export const DVB_SITTER_CTA: DvbCta = {
  id: "sitter-matching",
  label: "믿을 수 있는 육아도우미 찾기",
  href: "https://www.idolbom.go.kr/",
  external: true,
};

export const DVB_SHORT_WORK_CTA: DvbCta = {
  id: "short-work-detail",
  label: "단축근무 급여 자세히 계산하기",
  href: "/tools/childcare-short-time-pay-calculator/",
};
