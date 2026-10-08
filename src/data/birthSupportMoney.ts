// 2027 출산지원금 계산기 데이터 (기획: docs/plan/202610/birth-support-money.md, 설계: docs/design/202610/birth-support-money-design.md)
// 금액은 원 단위 정수. 공식 원자료를 런타임에서 비율·곱셈으로 재생성하지 않는다.

export type DataBadge = "공식" | "참고" | "시뮬레이션" | "추정";
export type SystemId = "current" | "reform2027";
export type BirthOrder = 1 | 2 | 3;
export type RegionTier = "capital" | "nonCapital" | "depopPreferred" | "depopSpecial";
export type PreferredChoice = "no" | "yes" | "unknown";
export type CareMode = "home" | "daycare" | "switch12";
export type PeriodMonths = 12 | 24 | 156;

export interface PolicySource {
  id: string;
  org: string;
  title: string;
  url: string;
  publishedAt: string;
  checkedAt: string;
}

export interface MoneyCell {
  amount: number;
  badge: DataBadge;
  verified: boolean;
  sourceId: string;
  note?: string;
}

export interface PendingCheck {
  id: number;
  label: string;
  status: string;
  uiImpact: string;
}

export interface BsmConfig {
  schemaVersion: 2;
  checkedAt: string;
  reformCutoff: string;
  birthDateRange: { min: string; max: string };
  longTermMonths: number;
  sources: Record<string, PolicySource>;
  current: {
    firstMeeting: Record<BirthOrder, MoneyCell>;
    parentBenefit: { age0: MoneyCell; age1: MoneyCell };
    daycareFee: { age0: MoneyCell; age1: MoneyCell };
    childAllowance: Record<RegionTier, MoneyCell>;
  };
  reform2027: {
    welcomeGrant: Record<BirthOrder, MoneyCell>;
    welcomeGrantPreferredAddon: MoneyCell;
    welcomeGrantInstallments: { months: number[]; verified: boolean };
    childBasicAllowance: MoneyCell;
    childBasicAllowancePreferredAddon: MoneyCell;
    homeCareAddon: MoneyCell & { untilMonth: number };
  };
}

export interface LocalSupportRule {
  regionCode: string;
  label: string;
  birthOrder: BirthOrder;
  amount: number | null;
  paymentType: "현금" | "바우처" | "지역화폐";
  badge: "공식" | "참고";
  applicationChannel: string[];
  sourceUrl: string;
  checkedAt: string;
  note: string;
}

export interface BsmScenario {
  id: string;
  label: string;
  input: {
    birthDate: string;
    order: BirthOrder;
    tier: RegionTier;
    preferred: PreferredChoice;
    care: CareMode;
  };
  system: SystemId;
  birthSupport: number;
  total12: number;
  total24: number;
  badge: DataBadge;
}

const CHECKED_AT = "2026-10-07";

const SOURCES: Record<string, PolicySource> = {
  "mohw-2026-08-28": {
    id: "mohw-2026-08-28",
    org: "보건복지부",
    title: "아이 양육이 어렵지 않도록, 고립은둔 청년에 나아갈 힘이 되도록, 2027년 핵심 청년 예산 발표",
    url: "https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1491722&mid=a10503010100&nPage=1&tag=",
    publishedAt: "2026-08-28",
    checkedAt: CHECKED_AT,
  },
  "korea-2026-09-04-budget": {
    id: "korea-2026-09-04-budget",
    org: "대한민국 정책브리핑",
    title: "복지부 내년 예산 149조 원…생계급여 올리고 지역·필수의료 강화",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148971270",
    publishedAt: "2026-09-04",
    checkedAt: CHECKED_AT,
  },
  "mohw-2026-child-allowance": {
    id: "mohw-2026-child-allowance",
    org: "보건복지부",
    title: "아동수당 대상·금액 확대, 4월부터 지급 시작",
    url: "https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1490257&mid=a10503010100&nPage=1&tag=",
    publishedAt: "2026-04",
    checkedAt: CHECKED_AT,
  },
  "korea-parent-benefit": {
    id: "korea-parent-benefit",
    org: "대한민국 정책브리핑",
    title: "올해부터 부모급여 더 받는다…0세 월 100만 원, 1세 50만 원",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148924684",
    publishedAt: "2024-01",
    checkedAt: CHECKED_AT,
  },
  "korea-parent-benefit-daycare": {
    id: "korea-parent-benefit-daycare",
    org: "대한민국 정책브리핑",
    title: "복지부 “부모급여, 어린이집 이용 금액의 차액만큼 지급”",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148926478",
    publishedAt: "2024-01",
    checkedAt: CHECKED_AT,
  },
  "korea-2024-infant-support": {
    id: "korea-2024-infant-support",
    org: "대한민국 정책브리핑",
    title: "0∼1세 영아기 지원금 2000만원 + α…“저출산 지원 대폭 확대”",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148924447",
    publishedAt: "2024-01",
    checkedAt: CHECKED_AT,
  },
  "project-bgs-daycare": {
    id: "project-bgs-daycare",
    org: "비교계산소",
    title: "프로젝트 기존 2026 보육료 기준값(babyGovernmentSupport.ts)",
    url: "/tools/daycare-vs-babysitter-cost-2026/",
    publishedAt: "2026",
    checkedAt: CHECKED_AT,
  },
};

const official = (amount: number, sourceId: string, note?: string): MoneyCell => ({
  amount,
  badge: "공식",
  verified: true,
  sourceId,
  ...(note ? { note } : {}),
});

export const BSM_CONFIG: BsmConfig = {
  schemaVersion: 2,
  checkedAt: CHECKED_AT,
  reformCutoff: "2027-07-01",
  birthDateRange: { min: "2026-01-01", max: "2028-12-31" },
  longTermMonths: 156,
  sources: SOURCES,
  current: {
    firstMeeting: {
      1: official(2000000, "korea-2024-infant-support", "국민행복카드 바우처"),
      2: official(3000000, "korea-2024-infant-support", "둘째 이상"),
      3: official(3000000, "korea-2024-infant-support", "둘째 이상"),
    },
    parentBenefit: {
      age0: official(1000000, "korea-parent-benefit"),
      age1: official(500000, "korea-parent-benefit"),
    },
    daycareFee: {
      age0: { amount: 540000, badge: "참고", verified: false, sourceId: "project-bgs-daycare", note: "2027 보육료 단가 미고시" },
      age1: { amount: 475000, badge: "참고", verified: false, sourceId: "project-bgs-daycare", note: "2027 보육료 단가 미고시" },
    },
    childAllowance: {
      capital: official(100000, "mohw-2026-child-allowance"),
      nonCapital: official(105000, "mohw-2026-child-allowance"),
      depopPreferred: official(110000, "mohw-2026-child-allowance"),
      depopSpecial: official(120000, "mohw-2026-child-allowance", "인구감소지역 지역사랑상품권 수령 시 월 1만원 추가는 미반영"),
    },
  },
  reform2027: {
    welcomeGrant: {
      1: official(10000000, "mohw-2026-08-28", "2027년 예산안 발표 기준"),
      2: official(12000000, "mohw-2026-08-28", "2027년 예산안 발표 기준"),
      3: official(15000000, "mohw-2026-08-28", "2027년 예산안 발표 기준"),
    },
    welcomeGrantPreferredAddon: official(5000000, "mohw-2026-08-28", "우대지역 추가"),
    welcomeGrantInstallments: { months: [0, 3, 6, 9], verified: false },
    childBasicAllowance: official(200000, "mohw-2026-08-28", "현금 10만원 + 지역사랑상품권 10만원"),
    childBasicAllowancePreferredAddon: official(100000, "mohw-2026-08-28", "우대지역 월 30만원 발표값을 20만원 + 10만원으로 분해"),
    homeCareAddon: { ...official(300000, "mohw-2026-08-28", "0~1세 어린이집 미이용 시"), untilMonth: 23 },
  },
};

export const BSM_TIER_OPTIONS: { value: RegionTier; label: string }[] = [
  { value: "capital", label: "수도권" },
  { value: "nonCapital", label: "비수도권" },
  { value: "depopPreferred", label: "인구감소지역(우대)" },
  { value: "depopSpecial", label: "인구감소지역(특별)" },
];

// 지자체 금액은 중앙정부 합계와 분리한다. amount=null은 0원이 아니라 '미반영'.
// 2026-10-07 재확인: 강동구 200만·300만원은 구청 원문으로 확인되지 않아(과거 보도자료는 20만~100만원) 미반영으로 내림.
export const BSM_LOCAL_RULES: LocalSupportRule[] = [
  {
    regionCode: "seoul-gangnam",
    label: "서울특별시 강남구",
    birthOrder: 1,
    amount: null,
    paymentType: "현금",
    badge: "참고",
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터", "구청"],
    sourceUrl: "https://www.gangnam.go.kr",
    checkedAt: CHECKED_AT,
    note: "구 자체 출산지원금은 최신 공고 확인 전이라 금액을 반영하지 않았습니다.",
  },
  {
    regionCode: "seoul-gangdong",
    label: "서울특별시 강동구",
    birthOrder: 1,
    amount: null,
    paymentType: "현금",
    badge: "참고",
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터"],
    sourceUrl: "https://www.gangdong.go.kr",
    checkedAt: CHECKED_AT,
    note: "출생순위별 출산축하금 금액을 구청 최신 공고로 확인하지 못해 반영하지 않았습니다.",
  },
  {
    regionCode: "gyeonggi-hwaseong",
    label: "경기도 화성시",
    birthOrder: 1,
    amount: null,
    paymentType: "현금",
    badge: "참고",
    applicationChannel: ["정부24 행복출산 원스톱", "읍면동 행정복지센터", "시청"],
    sourceUrl: "https://www.hscity.go.kr",
    checkedAt: CHECKED_AT,
    note: "시 조례와 공고 확인 전이라 금액을 반영하지 않았습니다.",
  },
  {
    regionCode: "gyeonggi-paju",
    label: "경기도 파주시",
    birthOrder: 1,
    amount: null,
    paymentType: "현금",
    badge: "참고",
    applicationChannel: ["정부24 행복출산 원스톱", "읍면동 행정복지센터", "시청"],
    sourceUrl: "https://www.paju.go.kr",
    checkedAt: CHECKED_AT,
    note: "전입일·출생일·신청일 기준을 함께 확인해야 해 금액을 반영하지 않았습니다.",
  },
];

export const BSM_LOCAL_OPTIONS = [
  { value: "none", label: "선택 안 함" },
  ...Array.from(new Map(BSM_LOCAL_RULES.map((rule) => [rule.regionCode, rule.label])).entries()).map(([value, label]) => ({ value, label })),
];

export const BSM_SCENARIOS: BsmScenario[] = [
  { id: "s1", label: "2027-06-30 첫째 · 수도권 · 가정보육", input: { birthDate: "2027-06-30", order: 1, tier: "capital", preferred: "no", care: "home" }, system: "current", birthSupport: 2000000, total12: 15200000, total24: 22400000, badge: "추정" },
  { id: "s1b", label: "2027-06-30 첫째 · 비수도권 · 가정보육", input: { birthDate: "2027-06-30", order: 1, tier: "nonCapital", preferred: "no", care: "home" }, system: "current", birthSupport: 2000000, total12: 15260000, total24: 22520000, badge: "추정" },
  { id: "s2", label: "2027-07-01 첫째 · 일반지역 · 어린이집 이용", input: { birthDate: "2027-07-01", order: 1, tier: "capital", preferred: "no", care: "daycare" }, system: "reform2027", birthSupport: 10000000, total12: 12400000, total24: 14800000, badge: "시뮬레이션" },
  { id: "s3", label: "2027-07-01 둘째 · 일반지역 · 어린이집 이용", input: { birthDate: "2027-07-01", order: 2, tier: "capital", preferred: "no", care: "daycare" }, system: "reform2027", birthSupport: 12000000, total12: 14400000, total24: 16800000, badge: "시뮬레이션" },
  { id: "s4", label: "2027-07-01 셋째 이상 · 우대지역 · 어린이집 이용", input: { birthDate: "2027-07-01", order: 3, tier: "nonCapital", preferred: "yes", care: "daycare" }, system: "reform2027", birthSupport: 20000000, total12: 23600000, total24: 27200000, badge: "시뮬레이션" },
  { id: "s4b", label: "2027-07-01 셋째 이상 · 우대지역 · 가정보육", input: { birthDate: "2027-07-01", order: 3, tier: "nonCapital", preferred: "yes", care: "home" }, system: "reform2027", birthSupport: 20000000, total12: 27200000, total24: 34400000, badge: "시뮬레이션" },
  { id: "s5", label: "2027-07-01 첫째 · 일반지역 · 가정보육", input: { birthDate: "2027-07-01", order: 1, tier: "capital", preferred: "no", care: "home" }, system: "reform2027", birthSupport: 10000000, total12: 16000000, total24: 22000000, badge: "시뮬레이션" },
  { id: "s6", label: "2027-07-01 첫째 · 일반지역 · 12개월부터 어린이집", input: { birthDate: "2027-07-01", order: 1, tier: "capital", preferred: "no", care: "switch12" }, system: "reform2027", birthSupport: 10000000, total12: 16000000, total24: 18400000, badge: "추정" },
  { id: "s6b", label: "2027-06-30 첫째 · 수도권 · 12개월부터 어린이집", input: { birthDate: "2027-06-30", order: 1, tier: "capital", preferred: "no", care: "switch12" }, system: "current", birthSupport: 2000000, total12: 15200000, total24: 16700000, badge: "추정" },
];

// 장기 참고(만 13세 미만, 156개월) 검증값: 수도권·첫째·가정보육. 차이 1,280만원은 복지부 보도자료 예시와 일치.
export const BSM_LONG_TERM_CHECK = { current: 35600000, reform2027: 48400000, diff: 12800000 };

export const BSM_PENDING_CHECKS: PendingCheck[] = [
  { id: 1, label: "2027년 7월 1일 적용 기준의 최종 법적 확정", status: "예산안·제도개편안 발표 단계이며 국회 의결과 법 개정은 확인되지 않았습니다.", uiImpact: "개편안 결과에 예산안 기준 예상임을 함께 표시합니다." },
  { id: 2, label: "2027년 6월 30일까지 출생아 경과규정", status: "현행 제도가 그대로 지급된다는 발표는 있으나 법 부칙과 이후 아동기본수당 전환 여부는 확인되지 않았습니다.", uiImpact: "2027년 상반기 출생아 결과는 추정으로 표시합니다." },
  { id: 3, label: "2026년 출생아가 2027년에 받는 부모급여·아동수당", status: "출생일 기준 현행 체계 적용이 예정돼 있으나 2027년 아동수당 지역별 금액 유지 여부는 확인이 필요합니다.", uiImpact: "2026년 금액이 유지된다고 가정해 계산합니다." },
  { id: 4, label: "아이맞이지원금 지급 시기와 분할 방식", status: "출생 후 1년 동안 분기별 4회 지급만 발표됐습니다.", uiImpact: "0·3·6·9개월차 균등 지급으로 가정하고 회차 금액은 추정으로 표시합니다." },
  { id: 5, label: "우대지역의 정확한 범위", status: "행정안전부 지방우대지수를 고려한다는 설명만 있고 명단은 공개되지 않았습니다.", uiImpact: "우대지역 여부를 직접 고르게 하고 모르면 두 결과를 함께 보여줍니다." },
  { id: 6, label: "가정보육 추가지원 요건", status: "0~1세 어린이집 미이용 아동이라는 기준만 발표됐습니다.", uiImpact: "월 단위로 가정보육 여부를 판단한다고 가정하며 중간 전환 결과는 추정입니다." },
  { id: 7, label: "아동기본수당 지급연령", status: "0세부터 13세 미만까지로 발표됐으나 연령 확대 일정과의 관계는 확인이 필요합니다.", uiImpact: "두 돌까지 결과에는 영향이 없고 장기 참고 결과만 추정으로 표시합니다." },
  { id: 8, label: "현금·지역사랑상품권 지급 비율", status: "기본 월 20만원은 현금 10만원과 상품권 10만원으로 발표됐고 우대지역·가정보육 추가분 비율은 확인되지 않았습니다.", uiImpact: "금액만 합산하고 비율은 기본지역만 표시합니다." },
  { id: 9, label: "지자체 출산지원금 중복 가능 여부", status: "개편안과 지자체 지원의 중복 여부는 발표되지 않았습니다.", uiImpact: "지자체 금액은 중앙정부 예상액과 따로 표시합니다." },
  { id: 10, label: "최종 예산과 관련 법령 확정", status: "국회 심의 전 단계입니다.", uiImpact: "확정 발표 후 금액과 배지를 다시 맞춥니다." },
];

export const BSM_META = {
  slug: "birth-support-money",
  title: "출산지원금 계산기 2027 | 부모급여·아동수당 총액 바로 계산",
  description:
    "출생일·출생순위·거주지역을 입력하면 2027 출산지원금과 부모급여·아동수당 예상 총액을 바로 계산. 첫 1년·두 돌까지 합계와 7월 출생아부터 적용 예정인 개편안 비교 포함.",
  h1: "2027 출산지원금 계산기",
  heroDescription:
    "출생일만 넣으면 2027년 6월 이전·7월 이후 적용 예정 제도를 나눠 부모급여·아동수당·출생 직후 지원 예상액을 계산합니다.",
  updatedAt: "2026-10-07",
};

export const BSM_NOTICE_LINES = [
  "2027년 7월 1일 이후 출생아 대상 아이맞이지원금·아동기본수당은 2027년 정부 예산안·제도개편안 발표 기준이며 국회 심의와 법 개정 과정에서 달라질 수 있습니다.",
  "2027년 6월 30일까지 출생아는 현행 첫만남이용권·부모급여·아동수당이 유지되는 것으로 안내됐습니다.",
  "중앙정부 현금성 지원 중심 계산이며 보육료 바우처 자체와 지자체 출산지원금은 중앙정부 합계에 넣지 않습니다.",
  "자료 조사일 2026년 10월 7일. 신청 전 복지로·정부24·주소지 행정복지센터에서 최신 기준을 확인하세요.",
];

export const BSM_INTRO = [
  "2027년에는 출산 지원 체계가 크게 바뀔 예정입니다. 정부는 2027년 예산안에서 첫만남이용권과 부모급여를 ‘아이맞이지원금’으로, 아동수당을 ‘아동기본수당’으로 개편해 2027년 7월 1일 이후 출생아부터 적용하겠다고 발표했습니다. 2027년 6월 30일까지 태어나는 아이는 지금의 첫만남이용권·부모급여·아동수당을 그대로 받는 것으로 안내됐기 때문에, 같은 해에 태어나도 출생일에 따라 받는 지원의 구조가 달라질 수 있습니다.",
  "현행 체계는 출생 직후 첫만남이용권 바우처 200만~300만원을 받고, 만 2세 전까지 부모급여를 매달 크게 받는 구조입니다. 개편안은 출생 후 1년 동안 아이맞이지원금 1,000만~1,500만원을 네 번에 나눠 현금으로 주고, 아동기본수당 월 20만원을 13세 미만까지 지급하는 방식입니다. 둘째·셋째와 우대지역은 지원이 더 늘고, 0~1세 아이를 집에서 돌보면 월 30만원을 추가로 받는 안이 함께 발표됐습니다.",
  "계산 결과는 첫 1년과 두 돌까지 합계를 함께 보는 것이 좋습니다. 같은 첫째·가정보육 조건이라도 첫 1년은 개편안이 많고 두 돌까지는 현행 체계와 비슷하거나 적게 나올 수 있으며, 아동기본수당이 길게 이어지면서 장기 합계 차이가 커지는 구조입니다. 어린이집을 이용하면 현행은 부모급여 중 보육료와의 차액만 현금으로 받고, 개편안은 가정보육 추가지원이 빠지므로 양육 방식을 바꿔 가며 비교해 보세요.",
  "2027년 개편 내용은 예산안과 제도개편안 단계의 발표이며 국회 심의와 관련 법 개정 과정에서 금액, 대상, 지급 시기가 달라질 수 있습니다. 우대지역 명단, 분기별 지급 시점, 가정보육 추가지원 요건, 지자체 출산지원금과의 중복 여부는 아직 확인이 필요합니다. 결과는 공개 발표를 바탕으로 한 예상치이므로 출생신고 전후에는 복지로, 정부24, 주소지 행정복지센터에서 최신 기준을 꼭 확인하세요.",
];

export const BSM_INPUT_POINTS = [
  "출생일만 넣으면 2027년 6월 30일 이전·7월 1일 이후 적용 예정 제도를 자동으로 구분합니다.",
  "출생순위·지역·양육 방식에 따라 첫 1년과 두 돌까지 예상 지원금을 비교합니다.",
  "우대지역 여부를 모르면 일반지역과 우대지역 결과를 함께 보여줍니다.",
];

export const BSM_CRITERIA = [
  "현행: 첫만남이용권 첫째 200만·둘째 이상 300만원, 부모급여 0세 월 100만·1세 월 50만원, 아동수당 2026년 지역별 월 10만~12만원(공식).",
  "개편안: 아이맞이지원금 1,000만·1,200만·1,500만원(우대지역 +500만원), 아동기본수당 월 20만원(우대지역 30만원), 0~1세 가정보육 월 30만원 추가(2027년 예산안 발표 기준).",
  "어린이집 이용 월의 현행 부모급여는 2026년 보육료 단가(참고)를 뺀 차액만 현금으로 계산합니다.",
  "합계는 시뮬레이션, 경과규정·분할 시점·보육 전환 처리 등 가정이 들어간 값은 추정으로 표시합니다.",
];

export const BSM_FAQ = [
  {
    question: "2027년에 아이를 낳으면 출산지원금 얼마 받나요?",
    answer:
      "출생일에 따라 다릅니다. 2027년 6월 30일까지 출생하면 첫만남이용권·부모급여·아동수당 체계로 첫째·수도권·가정양육 기준 두 돌까지 약 2,240만원, 7월 1일 이후 출생하면 개편안 기준 첫째·일반지역·가정보육으로 약 2,200만원이 예상됩니다. 개편안은 예산안 단계라 최종 금액은 달라질 수 있습니다.",
  },
  {
    question: "2027 부모급여는 얼마인가요?",
    answer:
      "2027년 6월 30일까지 태어난 아이는 현행처럼 0세 월 100만원, 1세 월 50만원을 받는 것으로 안내됐습니다. 7월 1일 이후 출생아는 부모급여 대신 아이맞이지원금과 아동기본수당·가정보육 추가지원으로 바뀔 예정입니다.",
  },
  {
    question: "2027 아동수당은 얼마인가요?",
    answer:
      "현행 아동수당은 2026년 기준 수도권 월 10만원, 비수도권 10만 5천원, 인구감소지역 11만~12만원이며 대상 연령은 해마다 한 살씩 늘어납니다. 2027년 7월 1일 이후 출생아는 아동기본수당 월 20만원(우대지역 30만원)으로 개편될 예정입니다.",
  },
  {
    question: "2027년 6월생과 7월생은 지원금이 다른가요?",
    answer:
      "6월 30일 출생까지는 현행 제도, 7월 1일 출생부터는 개편안이 적용될 예정이라 구조가 다릅니다. 첫째·가정보육 기준 첫 1년은 7월생이 약 80만원 많고 두 돌까지는 약 40만원 적지만, 장기적으로는 아동기본수당 차이로 개편안 합계가 커집니다. 출산 시기는 건강과 의료 판단이 우선이며 지원금만으로 결정할 일이 아닙니다.",
  },
  {
    question: "아이맞이지원금은 언제부터 받을 수 있나요?",
    answer:
      "정부 발표 기준으로 2027년 7월 1일 이후 태어난 아이부터 적용되며 출생 후 1년 동안 분기별로 4번 나눠 현금으로 지급될 예정입니다. 회차별 지급 시점과 신청 방법은 아직 공개되지 않았습니다.",
  },
  {
    question: "첫째·둘째·셋째 지원금은 얼마나 다른가요?",
    answer:
      "개편안 아이맞이지원금은 첫째 1,000만원, 둘째 1,200만원, 셋째 이상 1,500만원입니다. 현행 첫만남이용권은 첫째 200만원, 둘째 이상 300만원이며 부모급여·아동수당은 출생순위와 관계없이 같습니다.",
  },
  {
    question: "인구감소지역이면 더 받나요?",
    answer:
      "개편안은 지방우대지수에 따른 우대지역에 아이맞이지원금 500만원과 아동기본수당 월 10만원을 더 주는 안입니다. 우대지역 명단은 아직 공개되지 않아 현행 아동수당의 인구감소지역과 같다고 단정할 수 없으므로 계산기에서 우대지역 여부를 직접 선택하세요.",
  },
  {
    question: "가정보육하면 지원금이 더 나오나요?",
    answer:
      "개편안에서는 0~1세 아이가 어린이집을 이용하지 않으면 월 30만원을 추가로 받는 안이 발표됐습니다. 현행 제도에서는 어린이집을 이용하면 부모급여 중 보육료를 뺀 차액만 현금으로 받습니다. 중간에 어린이집으로 옮기는 경우의 처리 기준은 아직 확인이 필요합니다.",
  },
];

export const BSM_REFERENCE_LINKS = [
  {
    title: "정부24 행복출산 원스톱",
    source: "정부24",
    href: "https://www.gov.kr",
    desc: "출생신고와 첫만남이용권·부모급여·아동수당 신청을 한 번에 확인하는 출발점입니다.",
  },
  {
    title: "복지로 부모급여·아동수당",
    source: "복지로",
    href: "https://www.bokjiro.go.kr",
    desc: "국가 공통 급여의 대상, 신청 방법, 최신 안내를 확인합니다.",
  },
  {
    title: "2027년 아이맞이지원금·아동기본수당 발표 원문",
    source: "보건복지부",
    href: SOURCES["mohw-2026-08-28"].url,
    desc: "2026년 8월 28일 보건복지부 보도자료입니다. 예산안 단계 발표입니다.",
  },
];

export const BSM_RELATED_LINKS = [
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
  { href: "/tools/postnatal-care-cost/", label: "산후도우미 비용 계산기" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직 + 육아기 단축근무 계산기" },
  { href: "/reports/birth-support-by-region-2026/", label: "2026 지역별 출산지원금 비교" },
  { href: "/reports/childbirth-benefits-changes-2027/", label: "2027 부모급여·아동수당 변경 정리" },
];
