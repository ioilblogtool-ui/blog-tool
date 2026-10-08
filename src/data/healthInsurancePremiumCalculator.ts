export type RuleValue<T> = { value: T | null; status: "verified" | "pending"; sourceIds: string[]; checkedAt: string; effectiveFrom: string | null };
export interface HealthLimits { basis: "combinedMonthlyHealth"; lower: number; upper: number }
export interface RoundingPolicy { healthUnitWon: number; careUnitWon: number; method: "floor"; healthStage: "beforeSplit" | "afterSplit"; careBase: "rawHealth" | "chargedHealth"; careFactor: "incomeRateRatio" | "publishedHealthRatio" }
export interface RegionalPolicy { lowIncomeThresholdAnnual: number; minimumIncomePremium: number; totalHealthLower: number; totalHealthUpper: number; lowIncomeBasis: "assessedAnnualIncome" }
export interface HipYearRules {
  year: 2026 | 2027;
  healthRate: RuleValue<number>; employeeShare: RuleValue<number>; employerShare: RuleValue<number>;
  careIncomeRate: RuleValue<number>; carePublishedHealthRatio: RuleValue<number>;
  employeeLimits: RuleValue<HealthLimits>; rounding: RuleValue<RoundingPolicy>;
  regionalPointPrice: RuleValue<number>; regionalPolicy: RuleValue<RegionalPolicy>; otherIncomeThreshold: RuleValue<number>;
}
export interface HipState {
  version: 2; mode: "employee" | "regional" | "transition"; year: 2026 | 2027;
  employee: { incomeMode: "monthlyWage" | "annualSalary"; monthlyWage: number | null; annualSalary: number | null; excludedAnnualPay: number | null; otherAnnualIncome: number | null; showEmployerShare: boolean };
  comparison: { enabled: boolean; previousBasis: "same" | "custom"; previousMonthlyWage: number | null; previousAnnualSalary: number | null; previousExcludedAnnualPay: number | null };
  regional: { assessedMonthlyIncome: number | null; assessedAnnualIncomeForThreshold: number | null; propertyPoints: number | null; standardConditionsConfirmed: boolean };
  transition: { beforeMonthlyWage: number | null; afterRegionalTotal: number | null; showContinuation: boolean; continuationTotal: number | null };
}
const checkedAt = "2026-10-08";
const verified = <T>(value: T, sourceIds: string[], year: number): RuleValue<T> => ({ value, status: "verified", sourceIds, checkedAt, effectiveFrom: `${year}-01-01` });
const pending = <T>(): RuleValue<T> => ({ value: null, status: "pending", sourceIds: [], checkedAt, effectiveFrom: null });
export const HEALTH_INSURANCE_SOURCES = [
  { id: "2027decision", label: "공공보건포털·보건복지부 — 2027 건강보험료율 동결", url: "https://e-health.go.kr/gh/heNws/selectBbsDtlViewInfo.do?bbsId=U00186&bbsNo=421870&menuId=200048" },
  { id: "2026edi", label: "국민건강보험 EDI — 2026 요율과 장기요양 산식", url: "https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html" },
  { id: "2026limits", label: "국가법령정보센터 — 월별 건강보험료액 상하한 고시", url: "https://www.law.go.kr/행정규칙/월별건강보험료액의상한과하한에관한고시" },
  { id: "2026regional", label: "국민건강보험공단 — 2026 제도 안내·지역 상하한", url: "https://www.nhis.or.kr/renewal_popup/poster/20260204_poster_longdesc_1.html" },
  { id: "careDecision", label: "보건복지부 — 2027 장기요양보험료율 결정 일정", url: "https://www.mohw.go.kr/gallery.es?act=view&bid=0003&list_no=380368&mid=a10505000000&tag=" },
  { id: "assessment", label: "법제처 생활법령정보 — 보수와 보수 외 소득 보험료", url: "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=1063" },
];
// 확인하지 못한 세부 기준은 null 유지. 기존 계산 방식의 존재는 공식 확인 근거가 아니다.
export const HEALTH_INSURANCE_RULES_BY_YEAR: Record<2026 | 2027, HipYearRules> = {
  2026: {
    year: 2026, healthRate: verified(0.0719, ["2026edi"], 2026), employeeShare: verified(0.5, ["2026edi"], 2026), employerShare: verified(0.5, ["2026edi"], 2026),
    careIncomeRate: verified(0.009448, ["2026edi"], 2026), carePublishedHealthRatio: verified(0.1314, ["2026edi"], 2026),
    employeeLimits: verified({ basis: "combinedMonthlyHealth", lower: 20_160, upper: 9_183_480 }, ["2026limits"], 2026),
    rounding: pending<RoundingPolicy>(), regionalPointPrice: verified(211.5, ["2026edi"], 2026), regionalPolicy: pending<RegionalPolicy>(), otherIncomeThreshold: verified(20_000_000, ["assessment"], 2026),
  },
  2027: {
    year: 2027, healthRate: verified(0.0719, ["2027decision"], 2027), employeeShare: verified(0.5, ["2026edi", "assessment"], 2027), employerShare: verified(0.5, ["2026edi", "assessment"], 2027),
    careIncomeRate: pending<number>(), carePublishedHealthRatio: pending<number>(), employeeLimits: pending<HealthLimits>(), rounding: pending<RoundingPolicy>(),
    regionalPointPrice: verified(211.5, ["2027decision"], 2027), regionalPolicy: pending<RegionalPolicy>(), otherIncomeThreshold: pending<number>(),
  },
};
export const HEALTH_INSURANCE_DEFAULT_INPUT: HipState = {
  version: 2, mode: "employee", year: 2027,
  employee: { incomeMode: "monthlyWage", monthlyWage: 3_000_000, annualSalary: 36_000_000, excludedAnnualPay: 0, otherAnnualIncome: 0, showEmployerShare: true },
  comparison: { enabled: true, previousBasis: "same", previousMonthlyWage: null, previousAnnualSalary: null, previousExcludedAnnualPay: 0 },
  regional: { assessedMonthlyIncome: null, assessedAnnualIncomeForThreshold: null, propertyPoints: null, standardConditionsConfirmed: false },
  transition: { beforeMonthlyWage: 4_000_000, afterRegionalTotal: null, showContinuation: false, continuationTotal: null },
};
export const HEALTH_INSURANCE_PRESETS = [
  { id: "wage300", label: "월 300만원", wage: 3_000_000 }, { id: "wage400", label: "월 400만원", wage: 4_000_000 },
  { id: "wage500", label: "월 500만원", wage: 5_000_000 }, { id: "wage700", label: "월 700만원", wage: 7_000_000 },
  { id: "raise", label: "연봉 5천만 → 5,500만", wage: null },
];
export const HEALTH_INSURANCE_FAQ = [
  { question: "2027 건강보험료율은 몇 %인가요?", answer: "2027 건강보험료율은 7.19%로 2026년과 같습니다. 일반 직장가입자는 보수월액보험료를 근로자와 회사가 절반씩 부담합니다." },
  { question: "2027 건강보험료가 인상되나요?", answer: "건강보험료율은 동결됐습니다. 보수월액·상하한·정산이 달라지면 실제 부담 금액은 달라질 수 있고, 장기요양보험료 기준도 따로 확인해야 합니다." },
  { question: "보험료율이 동결됐는데 왜 보험료가 올랐나요?", answer: "보수월액이 늘면 같은 요율이어도 건강보험료가 증가할 수 있습니다. 작년과 올해 보수를 비교하고, 정산이나 감면 변경은 급여명세서·공단 고지 내역에서 확인하세요." },
  { question: "월 보수 300만원이면 건강보험료가 얼마인가요?", answer: "7.19% 요율과 본인 부담 50%만 적용한 건강보험 이론값은 월 107,850원입니다. 이 값은 상하한·단수처리·감면·정산을 반영하지 않은 시뮬레이션이며 장기요양보험료가 포함되지 않습니다." },
  { question: "연봉 5천만원이면 건강보험료가 얼마인가요?", answer: "산정 제외 급여 없이 연봉을 12개월로 나누면 본인 건강보험 이론값은 월 약 149,792원입니다. 실제 신고 보수월액과 단수처리·정산에 따라 급여명세서 금액은 달라질 수 있습니다." },
  { question: "건강보험료는 회사와 직원이 절반씩 내나요?", answer: "일반 직장가입자의 보수월액보험료는 근로자와 회사가 절반씩 부담합니다. 보수 외 소득월액보험료와 공무원·사립학교 교원 등 다른 부담 구조의 대상은 별도로 확인해야 합니다." },
  { question: "장기요양보험료는 어떻게 계산하나요?", answer: "건강보험료에 해당 연도 장기요양보험료율을 건강보험료율로 나눈 비율을 적용합니다. 2026년 소득 대비 요율은 0.9448%이며, 2027 확정 요율은 2026-10-08 확인 기준 확보하지 못해 합계를 표시하지 않습니다." },
  { question: "성과급에도 건강보험료가 붙나요?", answer: "근로 대가인 상여 등 보수에 포함되는 금품은 보험료 산정에 반영될 수 있습니다. 지급 시점과 보수 신고·정산에 따라 공제 시점이 달라질 수 있으므로 회사 급여 담당자에게 확인하세요." },
  { question: "직장가입자도 다른 소득이 있으면 더 내나요?", answer: "보수 외 소득이 일정 기준을 초과하면 별도 소득월액보험료 대상이 될 수 있습니다. 소득 종류별 평가가 필요하므로 급여 공제 결과에 자동 합산하지 않으며 공단 확인을 안내합니다." },
  { question: "퇴사하면 건강보험료가 왜 비싸지나요?", answer: "지역가입자로 전환되면 회사와 분담하던 방식이 달라지고 소득·재산 기준의 세대 보험료가 적용될 수 있습니다. 피부양자나 임의계속가입 조건에 따라 달라지므로 공단에서 확인한 납부액과 비교하세요." },
  { question: "지역가입자는 재산점수만 입력하면 되나요?", answer: "재산 부과점수에 따른 보험료와 소득 보험료를 함께 확인해야 합니다. 자동차 부과는 폐지됐으며 저소득 기준·감면·상하한까지 확인되지 않은 상태에서는 공단 공식 조회를 이용하세요." },
];
export const HEALTH_INSURANCE_SEO = {
  title: "건강보험료 계산기 2027 | 월급·연봉 기준 바로 계산",
  description: "월급·연봉으로 2027 건강보험 요율 기반 이론값과 연봉 인상에 따른 부담 변화를 비교하세요. 근로자·회사 부담을 구분하고, 장기요양·상하한 등 미확인 기준과 공식 조회 경로를 안내합니다.",
  intro: [
    "2027년 건강보험료율은 2026년과 같은 7.19%로 결정됐습니다. 새해 첫 급여명세서를 확인하거나 이직 후 월급을 예상할 때는 보험료율과 실제 보수월액을 함께 확인해야 합니다. 이 계산기는 월 보수월액 또는 연봉을 입력해 본인이 부담하는 건강보험 요율 기반 이론값을 살펴보고 회사 부담분과 구분해 읽도록 돕습니다. 연봉 협상 전후에 매달 건강보험 관련 부담이 얼마나 달라질 수 있는지 비교할 때도 활용할 수 있습니다.",
    "보험료율이 동결됐다는 것은 같은 산정 조건에서 건강보험에 적용하는 비율이 유지된다는 뜻입니다. 연봉이나 보수월액이 늘면 비율이 같아도 건강보험료 금액은 증가할 수 있습니다. 따라서 작년과 올해 보험료를 비교할 때는 같은 급여를 가정한 비교와 실제 인상된 급여를 적용한 비교를 나눠 보는 것이 좋습니다. 보수 신고 금액이나 정산분이 달라진 경우에도 급여명세서 금액이 바뀔 수 있어 요율만으로 증가 원인을 단정하기는 어렵습니다.",
    "일반 직장가입자의 보수월액보험료는 보수월액에 건강보험료율을 곱한 뒤 근로자와 회사가 절반씩 나누어 부담하는 구조입니다. 월급에서 빠지는 본인 부담액은 회사 부담액과 따로 읽어야 하며, 장기요양보험료까지 더해야 건강보험 관련 월 공제 합계를 알 수 있습니다. 장기요양보험료는 별도로 정해지는 요율을 건강보험료에 연동해 계산하므로 건강보험료율 동결만으로 합계까지 같다고 판단하지 말고 해당 연도의 기준을 함께 확인하세요.",
    "연봉을 12개월로 나눈 값은 실제 회사가 신고한 보수월액과 다를 수 있습니다. 상하한·단수처리 등 확인되지 않은 세부 기준을 반영한 고지액은 표시하지 않으며, 단순 요율 계산은 별도의 이론값으로 안내합니다. 보수 외 소득이 있는 직장가입자와 지역가입자는 소득 종류, 재산, 세대 조건과 감면을 추가로 확인해야 합니다. 퇴직 이후 자격과 실제 납부액은 국민건강보험공단에서 확인하고 계산 결과는 입력 조건에 따른 시뮬레이션으로 활용하세요.",
  ],
  inputPoints: ["월 보수 또는 연봉으로 본인·회사 건강보험 이론값을 비교합니다.", "같은 보수의 연도 비교와 연봉 인상 효과를 나눠 확인합니다.", "지역·퇴직 전환은 공단 확인 자료와 함께 살펴보세요."],
  criteria: ["공식자료 확인일: 2026-10-08, 적용 연도 2026·2027을 구분합니다.", "이론값은 상하한·단수처리·감면·정산을 반영하지 않습니다.", "2027 장기요양과 상하한은 확인 후 반영하며 이전 연도 값으로 대체하지 않습니다.", "연간값은 같은 조건 12개월 환산이며 실제 연간 고지액이 아닙니다."],
  related: [
    { href: "/tools/four-insurance-calculator/", label: "4대보험 계산기 2026" }, { href: "/tools/salary/", label: "연봉 인상 계산기" },
    { href: "/tools/minimum-wage-2027/", label: "2027 최저임금 계산기" }, { href: "/tools/unemployment-benefit-calculator/", label: "실업급여 계산기 2026" },
  ],
};
