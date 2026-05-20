export type SilsonGenerationId = "gen1" | "gen2" | "gen3" | "gen4";
export type AgeGroup = "20s" | "30s" | "40s" | "50s";
export type UsageLevel = "low" | "medium" | "high";
export type DecisionTone = "positive" | "neutral" | "caution";

export interface SilsonGenerationSummary {
  id: SilsonGenerationId;
  label: string;
  salePeriod: string;
  structure: string;
  coveredCoinsurance: string;
  nonCoveredCoinsurance: string;
  outpatientDeductible: string;
  premiumIncrease2026: string;
  mainFeature: string;
  pros: string[];
  cons: string[];
}

export interface PremiumComparisonRow {
  generation: SilsonGenerationId;
  label: string;
  increaseRate2026: string;
  monthlyPremium30s: string;
  interpretation: string;
}

export interface CoverageComparisonRow {
  item: string;
  gen1: string;
  gen2: string;
  gen3: string;
  gen4: string;
}

export interface RefundScenario {
  id: string;
  label: string;
  medicalCost: number;
  category: string;
  description: string;
}

export interface RefundSimulationRow {
  scenarioId: string;
  generation: SilsonGenerationId;
  estimatedRefund: number;
  outOfPocket: number;
  limitNote: string;
  renewalImpact: string;
}

export interface AgeMatrixRow {
  ageGroup: AgeGroup;
  label: string;
  low: string;
  medium: string;
  high: string;
}

export interface PremiumTrendRow {
  year: number;
  overall: number | null;
  gen1: number | null;
  gen2: number | null;
  gen3: number | null;
  gen4: number | null;
  sourceLabel: string;
}

export interface InsurerClauseRow {
  insurer: string;
  coveredLimit: string;
  nonCoveredLimit: string;
  specialRider: string;
  appClaim: string;
  note: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const SIGC_META = {
  title: "2026 실손보험 세대별 완전 비교",
  seoTitle: "2026 실손보험 세대별 완전 비교 | 1세대·2세대·3세대·4세대 보험료와 보장 차이",
  description:
    "2026년 기준 실손보험 1세대·2세대·3세대·4세대의 보험료, 자기부담률, 급여·비급여 보장, 도수치료·MRI 환급액, 4세대 전환 손익분기점을 비교합니다.",
  subtitle:
    "1세대부터 4세대까지 실손보험은 보험료, 자기부담률, 비급여 보장 방식이 모두 다릅니다. 내 병원 이용 패턴에 맞춰 유지·전환 여부를 숫자로 비교해보세요.",
  updatedAt: "2026년 5월 기준",
  methodology:
    "금융당국·보험협회 안내, 보험사 상품공시실, 2026년 실손보험료 인상률 보도 자료를 함께 참고해 구성했습니다.",
  caution:
    "실제 보험료와 보험금은 보험회사, 가입 시기, 특약, 선택형 여부, 심사 결과에 따라 달라질 수 있습니다.",
};

export const SIGC_KPI = [
  { label: "2026 평균 인상률", value: "약 7.8%", note: "전체 평균 보도 기준" },
  { label: "인상률 최고 세대", value: "4세대", note: "20%대 인상 구간" },
  { label: "4세대 비급여 자기부담", value: "30%", note: "대표 기본값" },
  { label: "전환 판단 변수", value: "비급여 이용액", note: "최근 1년 기준" },
];

export const SILSON_GENERATIONS: SilsonGenerationSummary[] = [
  {
    id: "gen1",
    label: "1세대",
    salePeriod: "2009년 9월 이전",
    structure: "표준화 이전 회사별 약관",
    coveredCoinsurance: "상품별 상이",
    nonCoveredCoinsurance: "상품별 상이",
    outpatientDeductible: "상품별 상이",
    premiumIncrease2026: "3%대",
    mainFeature: "보장 폭은 넓지만 보험료 부담이 큰 편",
    pros: ["보장 범위가 넓은 경우가 많음", "비급여 이용이 많으면 유리할 수 있음"],
    cons: ["월 보험료 부담이 큼", "약관 차이가 커 직접 확인 필요"],
  },
  {
    id: "gen2",
    label: "2세대",
    salePeriod: "2009년 10월~2017년 3월",
    structure: "표준화 실손",
    coveredCoinsurance: "10~20%",
    nonCoveredCoinsurance: "대체로 20%",
    outpatientDeductible: "병원급별 공제",
    premiumIncrease2026: "5%대",
    mainFeature: "보험료와 보장 사이 균형형",
    pros: ["표준화 이후 구조라 비교가 쉬움", "기존 보장 유지 가치가 있음"],
    cons: ["선택형 여부에 따라 차이 존재", "갱신 보험료 부담 가능"],
  },
  {
    id: "gen3",
    label: "3세대",
    salePeriod: "2017년 4월~2021년 6월",
    structure: "기본형 + 3대 비급여 특약",
    coveredCoinsurance: "10~20%",
    nonCoveredCoinsurance: "대체로 20%",
    outpatientDeductible: "병원급별 공제",
    premiumIncrease2026: "16%대",
    mainFeature: "3대 비급여 특약 가입 여부가 핵심",
    pros: ["4세대보다 비급여 부담이 낮을 수 있음", "특약 구조가 비교적 명확"],
    cons: ["3대 비급여 특약 미가입 시 보장 공백 가능", "2026 인상률 부담"],
  },
  {
    id: "gen4",
    label: "4세대",
    salePeriod: "2021년 7월 이후",
    structure: "급여 주계약 + 비급여 특약",
    coveredCoinsurance: "20%",
    nonCoveredCoinsurance: "30%",
    outpatientDeductible: "급여/비급여별 최소 공제",
    premiumIncrease2026: "20%대",
    mainFeature: "보험료는 낮지만 비급여 이용액 관리가 중요",
    pros: ["월 보험료가 상대적으로 낮음", "병원 이용이 적으면 효율적"],
    cons: ["비급여 자기부담률 높음", "비급여 보험료 차등제 영향 가능"],
  },
];

export const SIGC_PREMIUM_ROWS: PremiumComparisonRow[] = [
  { generation: "gen1", label: "1세대", increaseRate2026: "3%대", monthlyPremium30s: "공시 수집 필요", interpretation: "인상률은 낮아도 절대 보험료가 높은 편입니다." },
  { generation: "gen2", label: "2세대", increaseRate2026: "5%대", monthlyPremium30s: "공시 수집 필요", interpretation: "보험료와 보장 범위의 균형을 확인해야 합니다." },
  { generation: "gen3", label: "3세대", increaseRate2026: "16%대", monthlyPremium30s: "공시 수집 필요", interpretation: "3대 비급여 특약 가입 여부가 환급 체감에 큽니다." },
  { generation: "gen4", label: "4세대", increaseRate2026: "20%대", monthlyPremium30s: "공시 수집 필요", interpretation: "월 보험료는 낮지만 비급여 이용이 많으면 불리할 수 있습니다." },
];

export const SIGC_COVERAGE_ROWS: CoverageComparisonRow[] = [
  { item: "급여 본인부담", gen1: "낮음 또는 상품별 상이", gen2: "10~20%", gen3: "10~20%", gen4: "20%" },
  { item: "일반 비급여", gen1: "상품별 상이", gen2: "대체로 20%", gen3: "대체로 20%", gen4: "30%" },
  { item: "3대 비급여", gen1: "기본 보장 또는 상품별 상이", gen2: "기본 보장 또는 상품별 상이", gen3: "특약 분리", gen4: "특약 분리" },
  { item: "통원 공제", gen1: "상품별 상이", gen2: "병원급별 공제", gen3: "병원급별 공제", gen4: "급여 1~2만 원, 비급여 3만 원 또는 비율 공제" },
  { item: "비급여 보험료 차등제", gen1: "없음", gen2: "없음", gen3: "없음", gen4: "적용" },
];

export const SIGC_REFUND_SCENARIOS: RefundScenario[] = [
  { id: "manual", label: "도수치료 1회", medicalCost: 120000, category: "3대 비급여", description: "비급여 통원 치료에서 세대별 체감 차이가 큽니다." },
  { id: "mri", label: "MRI 검사", medicalCost: 600000, category: "3대 비급여", description: "고액 검사비라 자기부담률 차이가 크게 보입니다." },
  { id: "injection", label: "비급여 주사", medicalCost: 150000, category: "3대 비급여", description: "특약 가입 여부를 먼저 확인해야 합니다." },
  { id: "bundle", label: "세 항목 합산", medicalCost: 870000, category: "고액 비급여 묶음", description: "최근 1년 비급여 누적액을 가늠하는 예시입니다." },
];

export const SIGC_REFUND_SIMULATION_ROWS: RefundSimulationRow[] = [
  { scenarioId: "bundle", generation: "gen1", estimatedRefund: 783000, outOfPocket: 87000, limitNote: "상품별 한도 확인", renewalImpact: "없음" },
  { scenarioId: "bundle", generation: "gen2", estimatedRefund: 696000, outOfPocket: 174000, limitNote: "병원급별 공제 확인", renewalImpact: "없음" },
  { scenarioId: "bundle", generation: "gen3", estimatedRefund: 696000, outOfPocket: 174000, limitNote: "3대 비급여 특약 확인", renewalImpact: "없음" },
  { scenarioId: "bundle", generation: "gen4", estimatedRefund: 609000, outOfPocket: 261000, limitNote: "비급여 특약과 통원 공제 확인", renewalImpact: "비급여 누적액 영향 가능" },
];

export const SIGC_BREAK_EVEN_ROWS = [
  { nonCoveredCost: "0원", decision: "전환 검토 가능", interpretation: "보험료 절감 효과가 크게 보일 수 있습니다." },
  { nonCoveredCost: "50만 원", decision: "조건부 검토", interpretation: "통원 횟수와 공제금액을 함께 봐야 합니다." },
  { nonCoveredCost: "100만 원", decision: "신중", interpretation: "비급여 누적 구간과 환급 감소를 비교해야 합니다." },
  { nonCoveredCost: "300만 원 이상", decision: "유지 우선 검토", interpretation: "보험료 할증과 환급 감소가 동시에 부담될 수 있습니다." },
];

export const SIGC_AGE_MATRIX: AgeMatrixRow[] = [
  { ageGroup: "20s", label: "20대", low: "4세대/신규세대 검토", medium: "4세대 유지 검토", high: "특약 확인 후 판단" },
  { ageGroup: "30s", label: "30대", low: "보험료 절감 중심 검토", medium: "손익분기 계산 필요", high: "3대 비급여 이용액 확인" },
  { ageGroup: "40s", label: "40대", low: "기존 세대 유지도 검토", medium: "유지·전환 비교 필수", high: "기존 세대 유지 쪽 유리 가능" },
  { ageGroup: "50s", label: "50대", low: "신중", medium: "유지 우선 검토", high: "전환 신중, 약관 확인 우선" },
];

export const SIGC_PREMIUM_TRENDS: PremiumTrendRow[] = [
  { year: 2022, overall: 14.2, gen1: 6.0, gen2: 16.0, gen3: 8.9, gen4: null, sourceLabel: "보도·협회 발표 참고" },
  { year: 2023, overall: 8.9, gen1: 6.0, gen2: 9.0, gen3: 14.0, gen4: null, sourceLabel: "보도·협회 발표 참고" },
  { year: 2024, overall: 1.5, gen1: 4.0, gen2: 1.0, gen3: 18.0, gen4: null, sourceLabel: "보도·협회 발표 참고" },
  { year: 2025, overall: 7.5, gen1: 2.0, gen2: 6.0, gen3: 20.0, gen4: 13.0, sourceLabel: "보도·협회 발표 참고" },
  { year: 2026, overall: 7.8, gen1: 3.0, gen2: 5.0, gen3: 16.0, gen4: 20.0, sourceLabel: "보도 기준, 세부 값 재확인 필요" },
];

export const SIGC_DUPLICATE_TIPS = [
  "실손보험은 실제 부담한 의료비를 기준으로 보상하므로 여러 개를 가입해도 중복으로 전액을 받을 수 없습니다.",
  "단체 실손과 개인 실손을 함께 갖고 있다면 중지·재개 가능 여부와 보장 공백을 먼저 확인해야 합니다.",
  "정액형 진단비, 수술비, 입원일당은 실손과 성격이 다르므로 중복 가입 여부만으로 해지 판단을 하면 안 됩니다.",
];

export const SIGC_DENIAL_REASONS = [
  { title: "치료 목적 불명확", detail: "미용·예방·건강관리 성격으로 판단되면 보장 대상에서 제외될 수 있습니다." },
  { title: "3대 비급여 특약 미가입", detail: "도수치료·비급여 주사·MRI는 세대와 특약 가입 여부가 핵심입니다." },
  { title: "서류 누락", detail: "진료비 영수증, 세부내역서, 진단서 또는 소견서가 필요한 경우가 있습니다." },
  { title: "면책·감액 기간", detail: "가입 직후 또는 특정 질환은 약관상 제한 기간이 있을 수 있습니다." },
  { title: "한도 초과", detail: "통원 횟수, 회당 한도, 연간 한도, 특약 한도를 넘으면 환급액이 줄어듭니다." },
];

export const SIGC_COMBINATION_ROWS = [
  { type: "실손 + 종신보험", monthlyCost: "높음", fit: "사망보장과 상속·가족 부양 목적이 함께 있을 때", caution: "저축성·사망보장 목적과 의료비 보장을 분리해서 봐야 합니다." },
  { type: "실손 + 정기보험", monthlyCost: "중간", fit: "부양가족이 있는 기간만 사망보장을 보완할 때", caution: "보장 기간 종료 후 공백을 확인해야 합니다." },
  { type: "실손 단독", monthlyCost: "낮음", fit: "의료비 보장만 간단히 유지하려는 경우", caution: "사망·진단비 보장은 별도 준비가 필요합니다." },
];

export const SIGC_POLICY_CHANGES = [
  { title: "5세대 실손 등장", detail: "2026년 5월 6일 이후 신규 가입 시장에는 5세대 실손보험이 등장했습니다. 이 리포트는 기존 1~4세대 보유계약 비교에 초점을 둡니다." },
  { title: "비급여 관리 강화", detail: "비급여 이용액은 4세대 보험료 차등제와 다음 갱신 보험료 판단에 영향을 줄 수 있습니다." },
  { title: "약관 확인 중요도 상승", detail: "세대명만으로 보장을 단정하기 어렵고, 선택형·특약·가입 시점별 약관 확인이 필요합니다." },
];

export const SIGC_INSURER_CLAUSES: InsurerClauseRow[] = [
  { insurer: "손해보험사 공통 확인", coveredLimit: "급여 주계약 한도", nonCoveredLimit: "비급여 특약 한도", specialRider: "3대 비급여", appClaim: "모바일 청구 가능 여부", note: "상품공시실 약관 원문 확인" },
  { insurer: "생명보험사 공통 확인", coveredLimit: "질병·상해 구분", nonCoveredLimit: "통원·입원 한도", specialRider: "특약 가입 여부", appClaim: "앱/팩스/방문", note: "단독 실손 여부와 갱신주기 확인" },
  { insurer: "단체 실손", coveredLimit: "회사 단체계약 기준", nonCoveredLimit: "단체계약 특약 기준", specialRider: "회사별 상이", appClaim: "회사 안내 확인", note: "개인 실손 중지·재개 가능성 확인" },
];

export const SIGC_ACTION_PLAN = [
  { step: "1", title: "내 세대 확인", detail: "가입일과 약관명으로 1~4세대 중 어디에 해당하는지 먼저 확인합니다." },
  { step: "2", title: "최근 1년 의료비 분류", detail: "급여, 일반 비급여, 3대 비급여를 나눠 실제 청구액을 정리합니다." },
  { step: "3", title: "전환 손익 계산", detail: "월 보험료 절감액과 추가 본인부담액을 같은 연간 기준으로 비교합니다." },
  { step: "4", title: "약관 원문 확인", detail: "전환 전에는 통원 공제, 한도, 특약, 비급여 차등제 조건을 보험사에서 확인합니다." },
];

export const SIGC_FAQ: FaqItem[] = [
  { q: "1세대 실손보험은 무조건 유지하는 것이 좋나요?", a: "무조건은 아닙니다. 보장 폭이 넓은 경우가 많지만 보험료가 높을 수 있어 최근 1년 의료 이용액과 월 보험료를 함께 비교해야 합니다." },
  { q: "4세대 실손보험 전환은 언제 유리한가요?", a: "병원 이용이 적고 비급여 청구가 거의 없다면 보험료 절감 효과가 클 수 있습니다. 반대로 도수치료, MRI, 비급여 주사가 잦다면 신중해야 합니다." },
  { q: "3대 비급여는 무엇인가요?", a: "도수치료·체외충격파·증식치료, 비급여 주사료, MRI/MRA처럼 별도 특약 확인이 중요한 비급여 항목을 말합니다." },
  { q: "실손보험을 여러 개 들면 더 많이 받을 수 있나요?", a: "아닙니다. 실손보험은 실제 부담한 의료비를 기준으로 비례 보상되는 구조라 중복 가입해도 실제 손해를 초과해 받을 수 없습니다." },
  { q: "이 리포트의 보험료 인상률은 확정값인가요?", a: "전체 평균과 세대별 인상률은 보도·협회 발표 기준을 참고한 값입니다. 개인 보험료는 보험회사, 나이, 성별, 갱신주기, 특약에 따라 달라집니다." },
];

export const SIGC_RELATED: RelatedLink[] = [
  { href: "/reports/fetal-insurance-guide-2026/", label: "태아보험 가입 시기 가이드" },
  { href: "/tools/fetal-insurance-calculator/", label: "태아보험 비용 계산기" },
  { href: "/reports/postnatal-care-comparison-2026/", label: "산후도우미 vs 산후조리원 비교" },
  { href: "/reports/2026-year-end-tax-saving-guide/", label: "2026 연말정산 절세 전략" },
];
