export type PensionPlanId = "db" | "dc" | "irp";

export type PensionPlanSummary = {
  id: PensionPlanId;
  name: string;
  shortName: string;
  oneLine: string;
  bestFor: string[];
  watchPoints: string[];
};

export type PensionComparisonRow = {
  label: string;
  db: string;
  dc: string;
  irp: string;
  note?: string;
};

export type PolicyUpdate = {
  title: string;
  badge: "공식" | "참고";
  summary: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type ReturnComparisonItem = {
  label: string;
  db: string;
  dc: string;
  irp: string;
  note: string;
};

export type TaxCreditExample = {
  id: string;
  incomeLabel: string;
  contribution: number;
  creditRate: number;
  expectedCredit: number;
  note: string;
};

export type ScenarioRecommendation = {
  id: string;
  title: string;
  userProfile: string;
  likelyFit: PensionPlanId[];
  reason: string;
  caution: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export const RP26_META = {
  slug: "retirement-pension-dc-db-irp-2026",
  title: "퇴직연금 DC·DB·IRP 비교 2026 | 수익률·세액공제·수수료·수령 전략",
  description:
    "퇴직연금 DB형, DC형, IRP의 구조 차이와 2026년 세액공제 한도, 수익률 비교, 수수료, 퇴직 후 일시금·연금 수령 전략을 한 번에 정리합니다.",
  eyebrow: "퇴직연금 비교 리포트",
  heroTitle: "퇴직연금 DB·DC·IRP, 2026년 기준 무엇이 유리할까",
  heroDescription: "구조 차이, 수익률 비교, 세액공제, 수수료, 퇴직 후 수령 전략까지 한 번에 정리합니다.",
};

export const RETIREMENT_PENSION_SUMMARIES: PensionPlanSummary[] = [
  {
    id: "db",
    name: "확정급여형 퇴직연금",
    shortName: "DB형",
    oneLine: "퇴직급여 산식이 먼저 정해지고 회사가 운용 책임을 지는 구조",
    bestFor: ["임금상승률이 높은 직장인", "장기근속 가능성이 큰 사용자", "운용 관리를 직접 하고 싶지 않은 사용자"],
    watchPoints: ["개인이 운용성과를 직접 가져가는 구조가 아님", "회사 제도 선택권이 제한될 수 있음"],
  },
  {
    id: "dc",
    name: "확정기여형 퇴직연금",
    shortName: "DC형",
    oneLine: "회사가 정해진 부담금을 넣고 근로자가 직접 운용하는 구조",
    bestFor: ["투자 경험이 있는 직장인", "이직 가능성이 높은 사용자", "장기 복리 운용을 원하는 사용자"],
    watchPoints: ["운용 손익이 본인에게 귀속", "방치하면 원리금보장형에 머물 수 있음"],
  },
  {
    id: "irp",
    name: "개인형 퇴직연금",
    shortName: "IRP",
    oneLine: "퇴직금 이전, 추가 납입, 세액공제, 연금 수령을 개인 계좌에서 관리하는 구조",
    bestFor: ["퇴직금 통합 관리가 필요한 사용자", "세액공제를 활용하려는 직장인", "은퇴 전후 연금 수령 전략이 필요한 사용자"],
    watchPoints: ["중도인출 제약", "상품·수수료·위험자산 비중 확인 필요"],
  },
];

export const RETIREMENT_PENSION_BRIEF = [
  {
    title: "임금상승·장기근속",
    conclusion: "DB형이 유리할 수 있습니다.",
    description: "퇴직급여 산식이 임금과 근속연수에 민감하기 때문에 임금상승률이 높을수록 먼저 검토할 축입니다.",
  },
  {
    title: "이직·직접운용",
    conclusion: "DC형과 IRP를 같이 봅니다.",
    description: "개인 운용성과와 계좌 연결성이 중요하다면 DC형 운용 방식과 IRP 이전 구조를 함께 확인해야 합니다.",
  },
  {
    title: "연말정산·수령전략",
    conclusion: "IRP가 핵심 보완축입니다.",
    description: "IRP는 추가납입 세액공제, 퇴직금 통합관리, 55세 이후 수령 전략을 연결하는 계좌입니다.",
  },
];

export const RETIREMENT_PENSION_COMPARISON_ROWS: PensionComparisonRow[] = [
  {
    label: "운용 책임",
    db: "회사",
    dc: "근로자",
    irp: "개인",
  },
  {
    label: "퇴직급여 결정 방식",
    db: "퇴직급여 산식 중심",
    dc: "부담금 + 운용성과",
    irp: "이전금 + 추가납입 + 운용성과",
  },
  {
    label: "개인 운용성과 반영",
    db: "낮음",
    dc: "높음",
    irp: "높음",
  },
  {
    label: "세액공제 활용",
    db: "일반적으로 해당 없음",
    dc: "근로자 추가납입분은 검토 가능",
    irp: "핵심 활용 영역",
    note: "DC형 사용자부담금은 세액공제 대상 납입액에서 제외합니다.",
  },
  {
    label: "이직·퇴직 후 연결성",
    db: "IRP 이전 필요",
    dc: "IRP 이전 가능",
    irp: "통합 관리 가능",
  },
  {
    label: "가장 중요한 판단 기준",
    db: "임금상승률·근속연수",
    dc: "운용능력·위험감수",
    irp: "세액공제·수령전략·수수료",
  },
];

export const RETIREMENT_PENSION_POLICY_UPDATES: PolicyUpdate[] = [
  {
    title: "연금계좌 세액공제 한도",
    badge: "공식",
    summary: "연금저축 600만 원, 퇴직연금 포함 합산 900만 원",
    detail: "총급여 5,500만 원 이하 공제율은 15%, 초과 구간은 12%입니다. 지방소득세까지 함께 보면 체감 공제율은 16.5%, 13.2%로 설명할 수 있습니다.",
    sourceLabel: "국세청",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=2238",
  },
  {
    title: "퇴직연금계좌 범위",
    badge: "공식",
    summary: "DC형, IRP 등이 퇴직연금계좌에 포함",
    detail: "세액공제 대상 연금계좌에는 DC형과 IRP 등이 포함됩니다. 다만 확정기여형퇴직연금 사용자부담금은 제외됩니다.",
    sourceLabel: "국세청",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=2238",
  },
  {
    title: "퇴직급여보장법 2026 개정",
    badge: "참고",
    summary: "2026년 7월 1일 시행 일부개정",
    detail: "퇴직급여 체불 법정형 상향, 중소기업퇴직연금기금제도 대상 사업장 확대 등 제도 환경 변화가 예정되어 있습니다.",
    sourceLabel: "국가법령정보센터",
    sourceUrl: "https://www.law.go.kr/LSW/lsRvsRsnListP.do?chrClsCd=010102&lsId=009883",
  },
  {
    title: "퇴직연금 비교공시 정비",
    badge: "참고",
    summary: "수익률·수수료를 제도별, 상품별, 기간별로 확인",
    detail: "통합연금포털 비교공시는 DB·DC·IRP, 원리금보장·비보장, 기간별 수익률과 수수료를 함께 보도록 정비되었습니다.",
    sourceLabel: "연합뉴스",
    sourceUrl: "https://www.yna.co.kr/view/AKR20250911087300002",
  },
];

export const RETIREMENT_PENSION_RETURN_COMPARISON: ReturnComparisonItem[] = [
  {
    label: "수익률 의미",
    db: "회사 부담금 운용성과",
    dc: "내 계좌 운용성과",
    irp: "내 계좌 운용성과",
    note: "DB형 수익률은 개인 퇴직급여 증가율과 바로 같지 않습니다.",
  },
  {
    label: "비교 단위",
    db: "퇴직연금사업자·회사 제도",
    dc: "사업자·상품·내 운용비중",
    irp: "사업자·상품·추가납입",
    note: "통합연금포털에서는 기간과 상품 구분을 맞춰 비교해야 합니다.",
  },
  {
    label: "방치 리스크",
    db: "개인 체감 낮음",
    dc: "높음",
    irp: "높음",
    note: "DC와 IRP는 방치하면 낮은 금리 상품에 장기간 머물 수 있습니다.",
  },
];

export const RETIREMENT_PENSION_DC_STRATEGIES = [
  {
    title: "원리금보장형",
    returnDirection: "낮음~중간",
    volatility: "낮음",
    bestFor: "손실 가능성이 부담스러운 사용자",
    risk: "장기 물가상승률을 못 따라갈 수 있습니다.",
  },
  {
    title: "TDF·밸런스형",
    returnDirection: "중간",
    volatility: "중간",
    bestFor: "직접 리밸런싱이 부담스러운 직장인",
    risk: "목표시점과 주식비중을 확인해야 합니다.",
  },
  {
    title: "ETF 중심",
    returnDirection: "중간~높음",
    volatility: "높음",
    bestFor: "장기투자 경험이 있는 사용자",
    risk: "시장 하락 구간을 버틸 수 있어야 합니다.",
  },
  {
    title: "혼합형",
    returnDirection: "중간",
    volatility: "중간",
    bestFor: "안정성과 성장성을 나누고 싶은 사용자",
    risk: "비중을 정하지 않으면 어정쩡한 포트폴리오가 됩니다.",
  },
];

export const RETIREMENT_PENSION_TAX_EXAMPLES: TaxCreditExample[] = [
  {
    id: "low-income-300",
    incomeLabel: "총급여 5,500만 원 이하",
    contribution: 3000000,
    creditRate: 0.165,
    expectedCredit: 495000,
    note: "소득세 15%와 지방소득세 1.5%를 합산한 체감 기준",
  },
  {
    id: "low-income-900",
    incomeLabel: "총급여 5,500만 원 이하",
    contribution: 9000000,
    creditRate: 0.165,
    expectedCredit: 1485000,
    note: "연금저축과 IRP 합산 세액공제 한도 900만 원을 모두 채운 경우",
  },
  {
    id: "high-income-900",
    incomeLabel: "총급여 5,500만 원 초과",
    contribution: 9000000,
    creditRate: 0.132,
    expectedCredit: 1188000,
    note: "소득세 12%와 지방소득세 1.2%를 합산한 체감 기준",
  },
];

export const RETIREMENT_PENSION_SCENARIOS: ScenarioRecommendation[] = [
  {
    id: "long-tenure-rising-wage",
    title: "대기업 장기근속·임금상승 기대형",
    userProfile: "근속 가능성이 높고 임금상승률이 예금 수익률보다 높을 가능성이 큰 직장인",
    likelyFit: ["db"],
    reason: "DB형은 퇴직급여 산식이 임금과 근속연수에 민감하므로 임금상승이 큰 직군에서 유리할 수 있습니다.",
    caution: "회사 제도 선택권과 전환 가능 여부를 먼저 확인해야 합니다.",
  },
  {
    id: "mobile-investor",
    title: "이직 가능성이 높은 투자형 직장인",
    userProfile: "업종 이동 가능성이 있고 ETF·TDF 운용에 익숙한 사용자",
    likelyFit: ["dc", "irp"],
    reason: "DC형과 IRP는 개인 운용성과가 직접 반영되고 이직 후 계좌 연결성이 좋습니다.",
    caution: "위험자산 비중과 수수료를 주기적으로 점검해야 합니다.",
  },
  {
    id: "tax-saving-focused",
    title: "연말정산 환급 중시형",
    userProfile: "퇴직연금보다 우선 연금계좌 세액공제 한도를 채우고 싶은 직장인",
    likelyFit: ["irp"],
    reason: "IRP 추가납입은 연금저축과 합산 900만 원 한도 안에서 세액공제 전략의 핵심 축이 됩니다.",
    caution: "세액공제만 보고 과도하게 납입하면 중도인출 제약이 부담이 될 수 있습니다.",
  },
];

export const RETIREMENT_PENSION_WITHDRAWAL_COMPARE = [
  {
    label: "현금 유동성",
    lumpSum: "높음",
    annuity: "낮음~중간",
  },
  {
    label: "과세 시점",
    lumpSum: "즉시 과세 중심",
    annuity: "과세이연 가능",
  },
  {
    label: "은퇴 현금흐름",
    lumpSum: "직접 관리 필요",
    annuity: "분할 수령 가능",
  },
  {
    label: "적합한 경우",
    lumpSum: "대출상환·주택자금 등 목적이 명확한 경우",
    annuity: "생활비 흐름과 절세를 함께 보는 경우",
  },
];

export const RETIREMENT_PENSION_CASES = [
  {
    title: "장기근속 40대 과장",
    bullets: ["임금상승 가능성 높음", "퇴직 가능성 낮음", "투자 관리 선호 낮음"],
    result: "DB 유지 + IRP 추가납입을 기본 검토안으로 봅니다.",
  },
  {
    title: "이직 많은 30대 개발자",
    bullets: ["이직 가능성 높음", "ETF·TDF 이해도 있음", "퇴직금 통합관리 필요"],
    result: "DC 운용 + IRP 통합관리 구조를 검토합니다.",
  },
  {
    title: "환급을 키우려는 40대 직장인",
    bullets: ["세액공제 한도 활용이 목적", "장기 납입 가능", "중도인출 가능성 낮음"],
    result: "연금저축 600만 원 + IRP 300만 원 조합으로 연결해 봅니다.",
  },
];

export const RETIREMENT_PENSION_FEE_CHECKLIST = [
  "제도 구분이 DB, DC, IRP 중 무엇인지 확인",
  "기간이 1년인지 3년·5년인지 확인",
  "원리금보장형인지 원리금비보장형인지 확인",
  "대면·비대면 가입 수수료 차이 확인",
  "내 계좌의 실제 상품 수익률과 비교",
];

export const RETIREMENT_PENSION_FAQ: FaqItem[] = [
  {
    q: "DB형과 DC형 중 어떤 것이 더 안전한가요?",
    a: "안전하다는 말의 의미가 다릅니다. DB형은 퇴직급여 산식이 먼저 정해지는 구조라 개인 운용 부담이 낮고, DC형은 개인 계좌의 운용성과가 직접 반영됩니다. 임금상승률, 근속연수, 투자성향을 같이 봐야 합니다.",
  },
  {
    q: "DC형은 ETF로만 운용하는 게 좋은가요?",
    a: "그렇지 않습니다. ETF 중심 운용은 장기 기대수익을 높일 수 있지만 변동성도 큽니다. 원리금보장형, TDF, 밸런스형, ETF를 자신의 위험감수 수준에 맞춰 조합하는 방식이 현실적입니다.",
  },
  {
    q: "IRP는 퇴직 후에만 만들 수 있나요?",
    a: "아닙니다. IRP는 퇴직금 이전뿐 아니라 재직 중 추가납입과 세액공제 전략에도 활용됩니다. 다만 중도인출 제약이 있으므로 단기 자금까지 무리하게 넣는 방식은 피해야 합니다.",
  },
  {
    q: "IRP 세액공제는 900만 원 전액을 돌려받는다는 뜻인가요?",
    a: "아닙니다. 900만 원은 연금저축과 퇴직연금계좌를 합산한 세액공제 대상 납입한도입니다. 실제 공제액은 공제율을 곱해 계산하며 소득 구간에 따라 달라집니다.",
  },
  {
    q: "퇴직금을 일시금으로 받으면 손해인가요?",
    a: "무조건 손해라고 볼 수 없습니다. 대출상환이나 주택자금처럼 목적이 명확하면 일시금이 필요할 수 있습니다. 다만 급한 목적이 없다면 IRP 이전 후 연금 수령을 통해 과세이연과 현금흐름을 함께 검토할 수 있습니다.",
  },
  {
    q: "통합연금포털 수익률은 제 계좌 수익률과 같은가요?",
    a: "같지 않을 수 있습니다. 비교공시는 사업자와 제도, 상품 구분, 기간별 평균 성격의 지표입니다. 내 실제 수익률은 내가 담은 상품, 납입 시점, 운용 비중에 따라 달라집니다.",
  },
  {
    q: "DB형에서 DC형으로 전환하면 다시 돌아갈 수 있나요?",
    a: "회사 제도와 규약에 따라 달라집니다. 전환 전에는 회사 인사·퇴직연금 담당 부서와 금융회사 안내를 확인하고, 전환 후 되돌릴 수 있는지 반드시 확인해야 합니다.",
  },
];

export const RETIREMENT_PENSION_RELATED_LINKS = [
  { href: "/tools/irp-pension-calculator/", label: "IRP 예상 수령액 계산하기" },
  { href: "/reports/pension-irp-comparison-2026/", label: "연금저축 vs IRP 비교 보기" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상 수령액 계산하기" },
  { href: "/tools/retirement/", label: "은퇴 계산기 보기" },
];
