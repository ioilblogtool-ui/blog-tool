// 사회보험 기간별 규칙 — 4대보험 계산기와 (예정) 국민연금 보험료 계산기가 공유
// 설계: docs/design/202611/02_국민연금_보험료_계산기_상세설계.md, 04_4대보험_계산기_상세설계.md
//
// 원칙
// - 요율은 정수 분수(num/den)로 둔다. 소수 부동오차 없이 원 단위 절사를 하기 위해서다.
// - 값이 없거나 확인되지 않은 규칙은 null + status로 표시한다. 0이나 2026 값으로 대신 채우지 않는다.
// - 2026 요율표 리포트(employeeTaxInsuranceRates2026.ts)는 그대로 두고, 같은 값인지 검증 스크립트로 확인한다.

export type RuleStatus =
  /** 법령·고시·공단 안내로 시행 기준 확인 */
  | "verified"
  /** 위원회 의결·정부 발표까지 확인, 시행 고시 전 */
  | "announced"
  /** 정부안 등 미확정 — 사용자가 고른 경우에만 가정으로 사용 */
  | "scenario"
  /** 확인하지 못함 — 계산에 쓰지 않음 */
  | "unknown";

export interface Ratio {
  num: number;
  den: number;
}

export interface RuleSource {
  label: string;
  url: string;
}

export interface RuleMeta {
  id: string;
  status: RuleStatus;
  /** YYYY-MM, 포함 */
  from: string;
  /** YYYY-MM, 포함. null이면 다음 규칙이 나올 때까지 */
  to: string | null;
  sources: RuleSource[];
  note?: string;
}

export interface PensionRateRule extends RuleMeta {
  total: Ratio;
  employee: Ratio;
  employer: Ratio;
}

export interface PensionBasisRule extends RuleMeta {
  lowerWon: number;
  upperWon: number;
  /** 소득월액 절사 단위(원). 국민연금법 시행령: 천원 미만 버림 */
  incomeRoundingUnit: number;
}

export interface HealthRule extends RuleMeta {
  total: Ratio;
  employee: Ratio;
  employer: Ratio;
  /** 직장가입자 월 보수월액보험료(전체) 상·하한. 고시 전이면 null */
  lowerPremiumWon: number | null;
  upperPremiumWon: number | null;
}

export interface LongTermCareRule extends RuleMeta {
  /** 소득 대비 장기요양보험료율 */
  incomeRate: Ratio;
  /** 건강보험료 대비 비율 = 소득 대비 장기요양 요율 ÷ 건강보험료율 */
  linkedRatio: Ratio;
  /** 공단 안내 표기(예: 13.14%) */
  displayedLinkedRatio: string;
}

export interface EmploymentRule extends RuleMeta {
  /** 실업급여 계정 근로자 부담 */
  employee: Ratio;
  /** 실업급여 계정 사업주 부담(고용안정·직업능력개발 사업분 제외) */
  employerUnemployment: Ratio;
}

/** 단수 처리 — 공단 공식 산식 원문을 확인하지 못해 통용 방식을 추정으로 표시 */
export const ROUNDING_RULES = {
  pensionPremium: {
    id: "np-premium-floor-won",
    status: "scenario" as RuleStatus,
    unit: 1,
    note: "보험료 원 미만 버림으로 계산했습니다. 공단 고지액과 몇십 원 다를 수 있습니다.",
  },
  healthPremium: {
    id: "hi-premium-floor-10",
    status: "scenario" as RuleStatus,
    unit: 10,
    note: "가입자 부담분 10원 미만 버림(통용 방식)으로 계산했습니다.",
  },
  longTermCarePremium: {
    id: "ltc-premium-floor-10",
    status: "scenario" as RuleStatus,
    unit: 10,
    note: "건강보험료(10원 미만 버림 후)에 연동 비율을 곱하고 10원 미만을 버렸습니다.",
  },
  employmentPremium: {
    id: "ei-premium-floor-10",
    status: "scenario" as RuleStatus,
    unit: 10,
    note: "10원 미만 버림(통용 방식)으로 계산했습니다.",
  },
};

const NPS_RATE_SOURCE = { label: "국민연금공단 연도별 보험료율", url: "https://ma.nps.or.kr/pnsinfo/ntpsklg/getOHAF0016M0.do?menuId=MN24001108" };
const NPS_LAW_SOURCE = { label: "국민연금법 시행령(기준소득월액)", url: "https://www.law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=69614&chrClsCd=010202" };

export const PENSION_RATE_RULES: PensionRateRule[] = [
  {
    id: "np-rate-2026",
    status: "verified",
    from: "2026-01",
    to: "2026-12",
    total: { num: 950, den: 10000 },
    employee: { num: 475, den: 10000 },
    employer: { num: 475, den: 10000 },
    sources: [NPS_RATE_SOURCE],
    note: "연금개혁으로 2026년부터 매년 0.5%p씩 인상(2033년 13%).",
  },
  {
    id: "np-rate-2027",
    status: "verified",
    from: "2027-01",
    to: "2027-12",
    total: { num: 1000, den: 10000 },
    employee: { num: 500, den: 10000 },
    employer: { num: 500, den: 10000 },
    sources: [NPS_RATE_SOURCE],
  },
];

export const PENSION_BASIS_RULES: PensionBasisRule[] = [
  {
    id: "np-basis-2025-07",
    status: "verified",
    from: "2025-07",
    to: "2026-06",
    lowerWon: 400_000,
    upperWon: 6_370_000,
    incomeRoundingUnit: 1000,
    sources: [NPS_LAW_SOURCE, { label: "사업장 실무안내 2026(국민연금공단)", url: "https://edi.nps.or.kr/cm/main/guide/edi_workguide_new.pdf" }],
  },
  {
    id: "np-basis-2026-07",
    status: "verified",
    from: "2026-07",
    to: "2027-06",
    lowerWon: 410_000,
    upperWon: 6_590_000,
    incomeRoundingUnit: 1000,
    sources: [NPS_LAW_SOURCE, { label: "경향신문: 상한 659만원 조정 보도", url: "https://www.khan.co.kr/article/202606090740001" }],
    note: "2027년 7월부터 적용할 상·하한은 아직 고시 전입니다.",
  },
];

export const HEALTH_RULES: HealthRule[] = [
  {
    id: "hi-2026",
    status: "verified",
    from: "2026-01",
    to: "2026-12",
    total: { num: 719, den: 10000 },
    employee: { num: 3595, den: 100000 },
    employer: { num: 3595, den: 100000 },
    lowerPremiumWon: 20_160,
    upperPremiumWon: 9_183_480,
    sources: [{ label: "SBS: 2026 건보료 상한 보도", url: "https://news.sbs.co.kr/amp/news.amp?news_id=N1008391848" }],
  },
  {
    id: "hi-2027",
    status: "announced",
    from: "2027-01",
    to: "2027-12",
    total: { num: 719, den: 10000 },
    employee: { num: 3595, den: 100000 },
    employer: { num: 3595, den: 100000 },
    lowerPremiumWon: null,
    upperPremiumWon: null,
    sources: [{ label: "세계일보: 2027 건보료율 7.19% 동결 의결", url: "https://www.segye.com/newsView/20260908511434" }],
    note: "2026년 9월 건강보험정책심의위원회 의결. 2027년 보험료 상·하한은 아직 고시 전입니다.",
  },
];

export const LONG_TERM_CARE_RULES: LongTermCareRule[] = [
  {
    id: "ltc-2026",
    status: "verified",
    from: "2026-01",
    to: "2026-12",
    incomeRate: { num: 9448, den: 1_000_000 },
    linkedRatio: { num: 9448, den: 71_900 },
    displayedLinkedRatio: "13.14%",
    sources: [],
  },
  {
    id: "ltc-2027",
    status: "announced",
    from: "2027-01",
    to: "2027-12",
    incomeRate: { num: 9994, den: 1_000_000 },
    linkedRatio: { num: 9994, den: 71_900 },
    displayedLinkedRatio: "13.90%",
    sources: [
      { label: "오마이뉴스: 2027 장기요양보험료율 0.9994%", url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003280284&PAGE_CD=N0002&BLCK_NO=&CMPT_CD=M0147" },
      { label: "병원신문: 제5차 장기요양위원회 의결", url: "http://www.khanews.com/news/articleView.html?idxno=252013" },
    ],
    note: "2026년 10월 30일 장기요양위원회 의결. 건강보험료 대비 13.90%.",
  },
];

export const EMPLOYMENT_RULES: EmploymentRule[] = [
  {
    id: "ei-2026",
    status: "verified",
    from: "2026-01",
    to: "2026-12",
    employee: { num: 9, den: 1000 },
    employerUnemployment: { num: 9, den: 1000 },
    sources: [],
  },
  {
    id: "ei-2027-proposal",
    status: "scenario",
    from: "2027-01",
    to: "2027-12",
    employee: { num: 10, den: 1000 },
    employerUnemployment: { num: 10, den: 1000 },
    sources: [{ label: "고용노동부 제도개편 방안", url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19866" }],
    note: "2026년 9월 고용보험위원회 보고 정부안(실업급여 1.8%→2.0%). 법령 개정·시행일 미확정.",
  },
];

export const SOCIAL_INSURANCE_RULES = {
  pensionRates: PENSION_RATE_RULES,
  pensionBasis: PENSION_BASIS_RULES,
  health: HEALTH_RULES,
  longTermCare: LONG_TERM_CARE_RULES,
  employment: EMPLOYMENT_RULES,
  rounding: ROUNDING_RULES,
  checkedAt: "2026-11-10",
};

export type SocialInsuranceRules = typeof SOCIAL_INSURANCE_RULES;
