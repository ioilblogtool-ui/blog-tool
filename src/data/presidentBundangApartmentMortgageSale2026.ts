export type FlowStep = { order: number; text: string };
export type ComparisonRow = { label: string; mortgage: string; rootMortgage: string };
export type ReverseExampleRow = { ratio: number; estimatedPrincipal: number };
export type LoanLimitRow = { priceRange: string; maxLoan: string };
export type FeasibilityRow = { item: string; verdict: string; note: string };
export type ChecklistGroup = { title: string; items: string[] };
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };
export type OwnershipRow = { right: string; holder: string; meaning: string };
export type LenderComparisonRow = { label: string; bank: string; sellerFinancing: string };
export type DifficultyReason = { title: string; body: string[] };
export type MisconceptionItem = { myth: string; reality: string };
export type SellerConditionRow = { condition: string; importance: "매우 높음" | "높음" };
export type RiskScenarioCase = {
  label: string;
  auctionPrice: number;
  seniorClaim: number;
  costs: number;
  recoverable: number;
  note: string;
};

export const PBAM_META = {
  slug: "president-bundang-apartment-mortgage-sale-2026",
  title: "대통령 분당 아파트 17억 7,700만원 근저당, 집주인이 은행이 됐다?",
  seoTitle: "대통령 분당 아파트 근저당 2026 완전 정리 | 나도 가능할까",
  seoDescription:
    "대통령 분당 아파트 29억 매도 과정에서 설정된 17억 7,700만원 근저당권을 쉽게 설명합니다. 셀러 파이낸싱 구조, 채권최고액의 진짜 의미, 세금·위험 시나리오, 일반인도 가능한지 팩트체크 포함.",
  description: "29억 매도 과정에서 등장한 낯선 거래방식, 매도인 근저당(셀러 파이낸싱)을 쉽게 설명합니다.",
  updatedAt: "2026-07-31",
  dataNote:
    "이 페이지는 보도된 사실 기준 설명이며 법률·세무 자문이 아닙니다. 채권최고액은 담보 한도이며 실제 대여 원금·이자 조건과 다를 수 있습니다. 예시 계산은 실제 거래조건이 아닌 이해를 돕기 위한 가상 예시입니다.",
} as const;

export const PBAM_KEY_FACTS = {
  salePrice: 2_900_000_000,
  salePriceLabel: "29억원",
  maxClaimAmount: 1_777_000_000,
  maxClaimAmountLabel: "17억 7,700만원",
  contractDate: "2026-07-14",
  registryDate: "2026-07-16",
  settlementLabel: "2026년 10월경",
  settlementCaption: "보도상 지급 의사",
} as const;

export const PBAM_KEY_FACTS_TABLE: { label: string; value: string }[] = [
  { label: "아파트 매매가격", value: "29억원" },
  { label: "매매계약일", value: "2026년 7월 14일" },
  { label: "소유권 이전일", value: "2026년 7월 16일" },
  { label: "근저당권자", value: "매도인 부부" },
  { label: "채무자", value: "매수인" },
  { label: "채권최고액", value: "17억 7,700만원" },
  { label: "채권최고액 ÷ 매매가", value: "약 61.3%" },
  { label: "잔금 지급 시점", value: "보도상 2026년 10월경" },
];

export const PBAM_SUMMARY_LINES: string[] = [
  "성남 분당구 아파트가 29억원에 매도됐고, 계약 이틀 만에 소유권이 이전됐습니다.",
  "동시에 매수인을 채무자로, 매도인 부부를 근저당권자로 하는 채권최고액 17억 7,700만원의 근저당권이 설정됐습니다.",
  "집을 먼저 넘기되 아직 지급되지 않은 대금을 보호하기 위해 매도인이 직접 담보를 잡은 거래구조로 볼 수 있습니다.",
];

export const PBAM_FLOW_NORMAL: string[] = ["매수인이 잔금 전액 지급", "매도인이 소유권 이전"];

export const PBAM_FLOW_THIS_CASE: FlowStep[] = [
  { order: 1, text: "매수인이 매매대금 일부 지급" },
  { order: 2, text: "매도인이 아파트 소유권을 먼저 이전" },
  { order: 3, text: "아직 받지 못한 잔금을 채권으로 남김" },
  { order: 4, text: "매도인이 해당 아파트에 근저당권 설정" },
  { order: 5, text: "매수인이 약정한 시점에 잔금 지급(보도상 2026년 10월경)" },
  { order: 6, text: "채무가 정리되면 매도인이 근저당권 말소" },
];

export const PBAM_OWNERSHIP_TABLE: OwnershipRow[] = [
  { right: "소유권", holder: "매수인", meaning: "아파트를 소유·사용·처분할 권리" },
  { right: "채권", holder: "매도인", meaning: "매수인에게 약정 금액의 지급을 요구할 권리" },
  { right: "근저당권", holder: "매도인", meaning: "채무가 이행되지 않을 때 부동산에서 우선변제받을 수 있는 담보권" },
];

export const PBAM_MORTGAGE_COMPARISON: ComparisonRow[] = [
  { label: "담보 채무", mortgage: "특정된 채무", rootMortgage: "일정 범위에서 변동 가능한 채무" },
  { label: "등기 금액", mortgage: "보통 확정 채무액", rootMortgage: "채권최고액(담보 한도)" },
  { label: "주로 쓰이는 곳", mortgage: "특정 단일 채무", rootMortgage: "은행 대출·지속적 거래, 이번 거래도 근저당권" },
];

export const PBAM_REVERSE_EXAMPLES: ReverseExampleRow[] = [
  { ratio: 110, estimatedPrincipal: 1_615_000_000 },
  { ratio: 118, estimatedPrincipal: 1_506_000_000 },
  { ratio: 120, estimatedPrincipal: 1_481_000_000 },
  { ratio: 130, estimatedPrincipal: 1_367_000_000 },
];

export const PBAM_LOAN_LIMIT_TABLE: LoanLimitRow[] = [
  { priceRange: "15억원 초과 ~ 25억원 이하", maxLoan: "4억원" },
  { priceRange: "25억원 초과", maxLoan: "2억원" },
];

export const PBAM_FEASIBILITY_TABLE: FeasibilityRow[] = [
  { item: "개인이 근저당권자가 될 수 있나", verdict: "가능", note: "근저당권자가 반드시 은행일 필요는 없음" },
  { item: "잔금 일부를 나중에 받을 수 있나", verdict: "가능", note: "매도인과 매수인의 합의로 결정 가능" },
  { item: "금융회사 허가가 필요한가", verdict: "통상 불필요", note: "자기 부동산 매매에 수반된 일회성 거래라는 전제" },
  { item: "반복적으로 돈을 빌려줘도 되나", verdict: "주의 필요", note: "영업성·반복성이 있으면 대부업 관련 검토 필요" },
  { item: "은행 주담대와 동일한 규제가 적용되나", verdict: "동일하지 않음", note: "금융회사의 주택담보대출과 사인 간 채권은 법적 구조가 다름" },
  { item: "일반 매도인이 실제로 할 수 있나", verdict: "현실적으로 어려움", note: "매도인이 매매대금 대부분을 즉시 받지 않아도 될 여력이 필요" },
];

export const PBAM_DIFFICULTY_REASONS: DifficultyReason[] = [
  {
    title: "매도인도 다음 집 잔금이 필요하다",
    body: [
      "대부분의 매도인은 기존 집의 매매대금으로 새로 살 집의 잔금을 지급합니다.",
      "매매가격 29억원 중 상당액을 몇 달 뒤에 받기로 했다면, 매도인이 당장 쓸 수 있는 현금은 크게 줄어듭니다. 이 구조를 쓰려면 매도인이 다음 집을 사지 않거나, 별도의 현금·금융자산을 충분히 보유하고 있어야 합니다.",
    ],
  },
  {
    title: "은행이 하던 신용심사를 매도인이 해야 한다",
    body: [
      "은행은 대출 전 매수인의 소득, 부채, 신용도, 담보가치와 상환 가능성을 심사합니다.",
      "매도인 금융에서는 매도인이 직접 매수인의 직업·소득, 기존 부채, 기존 주택 매각 가능성, 상환자금 출처, 체납·압류 여부까지 판단해야 합니다. 개인이 수십억원 규모의 신용위험을 직접 평가하는 것은 쉽지 않습니다.",
    ],
  },
  {
    title: "근저당이 있어도 바로 현금화되지 않는다",
    body: [
      "매수인이 약속한 날짜에 돈을 지급하지 않더라도 집이 자동으로 매도인에게 돌아오지 않습니다.",
      "채무이행 요구 → 기한이익 상실 확인 → 근저당권 실행 → 법원 경매 → 매각대금 배당 → 채권 회수 순서를 거쳐야 하며, 경매에는 상당한 기간과 비용이 들 수 있습니다.",
    ],
  },
  {
    title: "근저당권 순위가 중요하다",
    body: [
      "근저당권이 있다고 해서 항상 전액을 돌려받는 것은 아닙니다.",
      "부동산에 선순위 근저당권, 압류, 조세채권 등이 있다면 경매대금이 먼저 배당될 수 있어, 매도인은 예상 경매가격에서 선순위 채권·체납세금·집행비용을 뺀 금액이 실제 회수 가능액이라는 점을 확인해야 합니다.",
    ],
  },
];

export const PBAM_MISCONCEPTIONS: MisconceptionItem[] = [
  {
    myth: "잔금을 안 주면 집을 다시 가져온다",
    reality: "자동으로 소유권이 매도인에게 복귀하지 않습니다. 이미 소유권 이전이 완료됐다면 매수인이 소유자이며, 매도인은 채권자이자 근저당권자로서 변제를 요구하거나 담보권 실행 절차를 밟아야 합니다.",
  },
  {
    myth: "채권최고액 전액을 받을 수 있다",
    reality: "채권최고액은 자동 지급액이 아닙니다. 실제 남은 채권 원금, 약정 이자, 연체이자, 담보권 순위, 경매 낙찰가격, 선순위 권리, 집행비용에 따라 실제 회수 금액이 달라집니다.",
  },
];

export const PBAM_LENDER_COMPARISON: LenderComparisonRow[] = [
  { label: "채권자", bank: "은행·금융회사", sellerFinancing: "부동산 매도인" },
  { label: "근저당권자", bank: "은행", sellerFinancing: "매도인" },
  { label: "자금 지급", bank: "은행이 대출금 지급", sellerFinancing: "매도인이 대금 지급을 유예" },
  { label: "심사 주체", bank: "금융회사", sellerFinancing: "매도인" },
  { label: "금리·상환기간", bank: "금융상품 기준", sellerFinancing: "당사자 계약" },
  { label: "DSR·LTV", bank: "금융규제 적용", sellerFinancing: "은행 대출과 동일한 직접 적용 구조는 아님" },
  { label: "연체 관리", bank: "은행의 표준 절차", sellerFinancing: "매도인이 직접 관리" },
  { label: "담보 실행", bank: "은행이 경매 신청", sellerFinancing: "매도인이 경매 신청" },
  { label: "표준화 수준", bank: "높음", sellerFinancing: "낮음" },
  { label: "일반인 이용 가능성", bank: "비교적 높음", sellerFinancing: "매우 제한적" },
];

export const PBAM_FUNDING_DISCLOSURE_ITEMS: string[] = [
  "부동산 매매계약서",
  "잔금 지급 유예 약정",
  "금전소비대차계약서 또는 채무확인서",
  "근저당권 설정계약서",
  "상환기일과 지급방법",
  "계약금·중도금 이체내역",
  "실제 자금조달계획서 기재내용",
];

export const PBAM_TAX_NOTES = {
  intro:
    "이자 조건은 공개된 계약서가 확인되지 않으므로 이번 거래가 무이자라고 단정하면 안 됩니다. 일반적인 개인 간 거래에서는 다음 세무 쟁점을 확인해야 합니다.",
  points: [
    { title: "매도인이 이자를 받는 경우", body: "매도인이 수령하는 이자는 소득세상 이자소득 해당 여부와 원천징수·신고방법을 검토해야 합니다." },
    { title: "무이자 또는 현저히 낮은 이자인 경우", body: "거래 당사자의 관계, 대여 규모, 거래의 경제적 합리성과 실제 이익 규모에 따라 증여세 문제가 제기될 수 있습니다. 특수관계인이 아닌 당사자 사이에서도 거래 관행상 정당한 사유 없이 시가와 현저히 다른 조건으로 경제적 이익을 이전했다면 세법상 검토 대상이 될 수 있습니다." },
  ],
  checklist: ["적용 이자율", "이자 지급일", "원천징수 여부", "무이자 이익의 증여 해당 여부", "매매가격의 시가 적정성", "양도소득세 신고금액", "취득자금 출처"],
} as const;

export const PBAM_RISK_SCENARIOS: RiskScenarioCase[] = [
  {
    label: "낙찰가가 예상보다 높을 때",
    auctionPrice: 2_400_000_000,
    seniorClaim: 800_000_000,
    costs: 100_000_000,
    recoverable: 1_500_000_000,
    note: "실제 채권 원금이 15억원이라면 원금 수준의 회수가 가능할 수 있습니다.",
  },
  {
    label: "낙찰가가 예상보다 낮을 때",
    auctionPrice: 2_000_000_000,
    seniorClaim: 800_000_000,
    costs: 100_000_000,
    recoverable: 1_100_000_000,
    note: "실제 채권이 15억원이라면 약 4억원을 회수하지 못할 수 있습니다.",
  },
];

export const PBAM_SELLER_CONDITIONS: SellerConditionRow[] = [
  { condition: "다음 주택 잔금이 당장 필요하지 않음", importance: "매우 높음" },
  { condition: "별도의 현금·금융자산이 충분함", importance: "매우 높음" },
  { condition: "매수인의 상환재원이 명확함", importance: "매우 높음" },
  { condition: "매도인 근저당이 선순위임", importance: "매우 높음" },
  { condition: "유예기간이 짧음", importance: "높음" },
  { condition: "이자·연체조건이 계약서에 명확함", importance: "높음" },
  { condition: "법무사·변호사·세무사 검토를 받음", importance: "높음" },
  { condition: "경매가 진행돼도 생활자금에 문제가 없음", importance: "높음" },
];

export const PBAM_CHECKLISTS: ChecklistGroup[] = [
  {
    title: "매도인 체크리스트",
    items: [
      "매수인의 실제 상환재원을 확인했는가",
      "기존 주택 매도계약서 등 상환 근거가 있는가",
      "상환기일을 날짜로 명확히 정했는가",
      "원금·이자·연체이자를 구분했는가",
      "기한이익 상실 조건을 넣었는가",
      "근저당권 순위를 확인했는가",
      "추가 담보 설정 제한 약정이 있는가",
      "채권최고액과 실제 채권액을 구분했는가",
      "채무불이행 시 경매비용을 감당할 수 있는가",
      "법무사·변호사·세무사의 검토를 받았는가",
    ],
  },
  {
    title: "매수인 체크리스트",
    items: [
      "상환기일까지 마련할 자금이 확정돼 있는가",
      "기존 주택이 제때 팔리지 않을 경우 대안이 있는가",
      "이자 및 연체이자 조건을 확인했는가",
      "채무가 향후 금융기관 심사에 미칠 영향을 확인했는가",
      "자금조달계획서에 사실대로 기재했는가",
      "추가 담보대출이 제한되는지 확인했는가",
      "전액 상환 후 근저당 말소 절차가 정해져 있는가",
      "채무불이행 시 경매 가능성을 이해했는가",
    ],
  },
];

export const PBAM_FAQ: FaqItem[] = [
  { question: "근저당권자는 은행만 될 수 있나요?", answer: "아닙니다. 개인이나 일반 법인도 유효한 채권을 담보하기 위해 근저당권자가 될 수 있습니다." },
  { question: "채권최고액 17억 7,700만원이 실제 대출금인가요?", answer: "반드시 그렇지는 않습니다. 채권최고액은 근저당권으로 우선변제를 받을 수 있도록 정한 담보 한도입니다. 실제 원금은 별도의 계약서와 채무관계를 확인해야 합니다." },
  { question: "매도인이 17억 7,700만원을 현금으로 빌려준 것인가요?", answer: "공개된 정보만으로는 그렇게 단정할 수 없습니다. 새로 현금을 지급한 대출이라기보다, 매매대금 중 아직 받지 않은 부분의 지급을 미루고 이를 채권으로 남긴 구조일 가능성이 큽니다." },
  { question: "무이자 거래인가요?", answer: "전체 계약서가 공개되지 않았기 때문에 무이자 여부를 확정할 수 없습니다. 보도되지 않은 내용을 사실처럼 단정해서는 안 됩니다." },
  { question: "매도인이 잔금을 빌려주면 불법 사금융인가요?", answer: "자기 부동산 매매에 수반해 일회성으로 잔금 지급을 유예한 행위가 곧바로 불법 대부업이 되지는 않습니다. 다만 이를 반복적·영업적으로 운영하면 대부업법 등 별도 규제를 검토해야 합니다." },
  { question: "매수인이 돈을 갚지 않으면 집을 다시 가져오나요?", answer: "자동으로 소유권이 돌아오지 않습니다. 매도인은 채무 변제를 요구하고, 필요한 경우 근저당권을 실행해 법원 경매 절차를 거쳐야 합니다." },
  { question: "은행의 주택담보대출 규제를 받지 않나요?", answer: "금융회사가 실행하는 주택담보대출과 개인 간 매매대금 채권은 동일한 구조가 아닙니다. 다만 경제적으로 은행대출을 대체하는 효과가 발생할 수 있어 규제 취지 우회 논란이 제기될 수 있습니다." },
  { question: "일반인도 이 방식을 쓸 수 있나요?", answer: "법적으로는 가능합니다. 그러나 매도인이 거액의 매매대금을 즉시 받지 않고도 생활이나 다음 주택 구입에 문제가 없어야 하므로 현실적으로 사용할 수 있는 사람은 제한적입니다." },
];

export const PBAM_FINAL_SUMMARY =
  "이번 거래의 핵심은 매도인이 단순히 집을 판 뒤 돈을 빌려준 것이 아니라, 소유권을 먼저 이전하면서 아직 지급되지 않은 매매대금과 관련된 채권을 보호하기 위해 직접 근저당권자가 됐다는 점입니다. 개인이 근저당권자가 되는 것은 법률상 가능하지만, 매도인이 사실상 금융기관처럼 매수인의 신용위험과 상환위험을 부담해야 하므로 일반적인 아파트 거래방식이라고 보기는 어렵습니다.";

export const PBAM_USAGE_NOTES: string[] = [
  "정확한 실제 채무 원금은 공개 자료만으로 확인할 수 없습니다.",
  "채권최고액은 실제 대여 원금과 다를 수 있습니다.",
  "이자율과 세부 상환조건은 공개되지 않았습니다.",
  "본문의 역산표와 위험 시뮬레이션은 이해를 위한 가상 예시입니다.",
  "실제 거래 전에는 변호사·법무사·세무사의 검토가 필요합니다.",
];

export const PBAM_SEO_INTRO: string[] = [
  "2026년 7월 14일 성남 분당구 수내동 아파트가 29억원에 매매계약을 체결했고, 이틀 뒤인 16일 소유권이 이전됐습니다. 동시에 매수인을 채무자로, 매도인 부부를 근저당권자로 하는 채권최고액 17억 7,700만원의 근저당권이 등기됐습니다.",
  "통상 근저당권자는 대출을 내준 은행인데, 이번엔 매도인이 직접 근저당권자가 됐습니다. 통상 '매도인 근저당' 또는 '셀러 파이낸싱'으로 불리는 구조로, 은행 주택담보대출 한도가 제한된 고가주택 거래에서 매도인이 사실상 잔금 지급을 유예해준 셈입니다.",
];

export const PBAM_SEO_CRITERIA: string[] = [
  "매매가 29억원, 채권최고액 17억 7,700만원(매매가의 약 61.3%) — 실제 원금과 반드시 같지 않음",
  "25억원 초과 주택은 은행 주담대 최대 2억원까지만 가능(2025-10-16 시행 규제)",
  "법적으로는 개인도 근저당권자가 될 수 있으나, 매도인의 자금 여력·위험관리 능력이 필요해 현실적으로는 드문 방식",
];

export const PBAM_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기(LTV 기반)" },
  { href: "/tools/income-home-affordability/", label: "소득 대비 집값 부담 계산기(DSR·LTV)" },
  { href: "/tools/real-estate-acquisition-tax/", label: "부동산 취득세 계산기" },
  { href: "/reports/seoul-84-apartment-prices/", label: "서울 국평 아파트 가격 비교 리포트" },
  { href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/", label: "이재명 정부 핵심 공직자 재산·보수 비교" },
];
