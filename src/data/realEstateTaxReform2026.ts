export const RTR_META = {
  slug: "real-estate-tax-reform-2026",
  title: "2026 부동산 세제개편 전망",
  description:
    "2026년 부동산 세제개편 논의를 정리했습니다. 종부세 공정시장가액비율, 주택 수에서 보유가액 중심 과세 전환, 장기보유특별공제 개편 가능성과 1주택자·다주택자 영향을 확인하세요.",
  seoTitle: "2026 부동산 세제개편 전망 | 종부세·장특공제 변경 가능성",
  seoDescription:
    "2026년 부동산 세제개편 논의를 정리했습니다. 종부세 공정시장가액비율, 주택 수에서 보유가액 중심 과세 전환, 장기보유특별공제 개편 가능성과 1주택자·다주택자 영향을 확인하세요.",
  updatedAt: "2026-07-21",
  policyStatus: "GOVERNMENT_REVIEW" as const,
  policyStatusLabel: "정부 의견수렴 중",
  nextMilestone:
    "2026년 7월 23일 대통령 주재 부동산 국민 대토론회 등을 거쳐 정부 세제개편 방향이 공개될 예정 (구체적 발표일·내용 미확정)",
  dataNote:
    "이 페이지는 정부 확정안이 아니라 재정경제부 토론회, 대통령 발언, 주요 언론 보도를 바탕으로 정리한 사전 분석 자료입니다. 2026년 7월 21일 기준으로 작성했으며, 정부 발표 이후 갱신됩니다.",
};

export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};

export const RTR_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부·전문가 의견수렴", dateLabel: "2026년 7월 현재", isCurrent: true, isDone: false },
  { status: "GOVERNMENT_REVIEW", label: "대통령 주재 종합토론회", dateLabel: "2026년 7월 23일 예정", isCurrent: false, isDone: false },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부 세제개편안 발표", dateLabel: "정확한 날짜 미확정", isCurrent: false, isDone: false },
  { status: "BILL_SUBMITTED", label: "관련 세법·시행령 개정", dateLabel: "항목별 절차 상이", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 심의 및 의결", dateLabel: "법률 개정 사항에 한함", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "최종 개정안에서 결정", isCurrent: false, isDone: false },
];

/**
 * "전문가 제언" = 토론회 참석 전문가 개인 의견, 정부 확정 방침 아님
 * "정부·국회 논의" = 대통령·정부 인사가 방향성을 언급한 사안
 * "원칙 제시" = 구체안 없이 방향(원칙)만 언급된 사안
 * "전망 단계" = 언론·업계 예측 수준, 근거가 가장 약함
 */
export type PolicySourceType = "전문가 제언" | "정부·국회 논의" | "원칙 제시" | "전망 단계";

export type ReviewItem = {
  id: string;
  category: string;
  current: string;
  reviewDirection: string;
  sourceType: PolicySourceType;
  sourceLabel: string;
  sourceUrl: string;
};

export const RTR_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "fair-market-ratio",
    category: "종부세 공정시장가액비율",
    current: "주택분 60%",
    reviewDirection: "80% 수준으로 인상해야 한다는 전문가 의견 (정부 확정 수치 아님)",
    sourceType: "전문가 제언",
    sourceLabel: "연합뉴스 · 재정경제부 토론회 (2026-07-16)",
    sourceUrl: "https://www.yna.co.kr/view/AKR20260716101651002",
  },
  {
    id: "tax-base-standard",
    category: "종부세 과세 기준",
    current: "주택 수와 가액을 함께 반영",
    reviewDirection: "주택 수보다 전체 보유가액 중심으로 개편하자는 제안",
    sourceType: "전문가 제언",
    sourceLabel: "연합뉴스 · 재정경제부 토론회 (2026-07-16)",
    sourceUrl: "https://www.yna.co.kr/view/AKR20260716101651002",
  },
  {
    id: "long-term-deduction",
    category: "1세대 1주택 장기보유특별공제",
    current: "보유기간 최대 40% + 거주기간 최대 40%",
    reviewDirection: "단순 보유 공제는 축소, 실거주 공제 중심으로 재설계하는 방향 논의",
    sourceType: "정부·국회 논의",
    sourceLabel: "한겨레 · 대통령 발언 (2026-04-24)",
    sourceUrl: "https://www.hani.co.kr/arti/politics/politics_general/1255808.html",
  },
  {
    id: "one-house-protection",
    category: "실거주 1주택자 보호",
    current: "현행 공제 적용",
    reviewDirection: "실거주자 혜택은 유지하거나 강화해야 한다는 원칙이 반복적으로 언급됨",
    sourceType: "원칙 제시",
    sourceLabel: "한겨레 · 대통령 발언 (2026-04-24)",
    sourceUrl: "https://www.hani.co.kr/arti/politics/politics_general/1255808.html",
  },
  {
    id: "acquisition-transfer-tax",
    category: "취득세·양도세 중과",
    current: "주택 수·지역에 따라 적용",
    reviewDirection: "거래세 조정 가능성이 거론되지만 구체안은 아직 없음",
    sourceType: "전망 단계",
    sourceLabel: "관련 보도 종합 (2026-07)",
    sourceUrl: "https://www.newspim.com/news/view/20260720000983",
  },
];

/**
 * 2026년 세제개편 검토와는 별개로 이미 시행 중인 제도.
 * 인구감소지역 세컨드홈 특례는 2025-08 확대 시행됐으므로 위 RTR_REVIEW_ITEMS(검토 중 항목)에는 포함하지 않는다.
 */
export const RTR_CURRENT_POLICY = {
  title: "이미 시행 중인 제도 — 세제개편 검토안이 아닙니다",
  body:
    "비수도권 인구감소지역(및 인구감소 관심지역) 주택의 세컨드홈 특례 가액 기준은 2025년 8월 확대 시행되어 공시가격 9억 원 이하까지 적용됩니다. 수도권 일부 대상 지역은 4억 원 이하 기준이 유지됩니다. 이는 2026년 세제개편 검토와는 별개로, 이미 시행 중인 현행 제도입니다.",
  sourceLabel: "한국경제 (2025-08-17)",
  sourceUrl: "https://www.hankyung.com/article/2025081742506",
};

export type ImpactCard = {
  id: string;
  title: string;
  direction: "영향 제한 가능" | "부담 증가 가능" | "기준에 따라 다름" | "현재 특례 확인";
  summary: string;
};

export const RTR_IMPACT_BY_TYPE: ImpactCard[] = [
  {
    id: "one-house-resident",
    title: "실거주 1주택자",
    direction: "영향 제한 가능",
    summary:
      "실거주 1주택자를 보호해야 한다는 정책 방향이 반복적으로 언급되고 있습니다. 다만 공정시장가액비율이나 공제 구조가 변경되면 고가 1주택자는 일부 영향을 받을 수 있어, 최종 정부안을 확인해야 합니다. \"세금이 동결·감소된다\"고 확정된 것은 아닙니다.",
  },
  {
    id: "one-house-non-resident",
    title: "비거주 1주택자",
    direction: "부담 증가 가능",
    summary:
      "오래 보유했지만 실제 거주하지 않은 1주택자는 장기보유특별공제 개편의 직접적인 영향을 받을 수 있습니다. 단순 보유기간 공제를 줄이고 실거주기간 공제를 중심으로 재설계하는 방안이 논의되고 있습니다.",
  },
  {
    id: "low-price-multi-house",
    title: "저가주택 다주택자",
    direction: "기준에 따라 다름",
    summary:
      "종부세 기준이 주택 수에서 전체 보유가액 중심으로 바뀌면, 지방 저가주택을 여러 채 가진 경우 현재보다 부담이 줄어들 가능성도 있습니다. \"다주택자는 모두 증세\"라고 단정하기보다 보유 주택의 공시가격 합계를 확인해야 합니다.",
  },
  {
    id: "high-price-house",
    title: "고가주택 보유자",
    direction: "부담 증가 가능",
    summary:
      "주택 수가 적더라도 보유한 주택의 공시가격이 높다면 보유가액 중심 과세와 공정시장가액비율 인상의 영향을 받을 수 있습니다. 종부세 과세표준이 높을수록 세액 증가 폭이 상대적으로 커질 수 있습니다.",
  },
  {
    id: "population-decline-buyer",
    title: "인구감소지역 주택 매수자",
    direction: "현재 특례 확인",
    summary:
      "세컨드홈 특례 가액 기준(공시가격 9억 원 이하, 수도권 일부 4억 원 이하)은 이미 시행 중인 제도입니다. 2026년 세제개편 검토안이 아니므로, 매수 예정 지역이 특례 대상인지와 취득일 기준을 먼저 확인하세요.",
  },
];

export type ExplainerCard = {
  id: string;
  question: string;
  answer: string;
};

export const RTR_EXPLAINERS: ExplainerCard[] = [
  {
    id: "fair-market-ratio-explainer",
    question: "공정시장가액비율이란? (재산세 vs 종부세 구분)",
    answer:
      "공정시장가액비율은 공시가격에서 과세표준을 계산할 때 곱하는 비율입니다. 지방세인 재산세와 국세인 종합부동산세에 각각 별도의 공정시장가액비율이 있어 혼동하기 쉽습니다. 재산세는 주택 기본 60%에 1세대 1주택 특례 비율이 별도로 있고, 종부세도 주택분 기준 60%입니다. 이번 논의에서 \"80%로 인상\"이 거론되는 대상은 종부세 공정시장가액비율이며, 80%는 정부가 확정한 수치가 아니라 토론회에서 나온 전문가 제언·언론 시뮬레이션 수치입니다.",
  },
  {
    id: "tax-base-explainer",
    question: "\"주택 수\" 기준과 \"보유가액\" 기준은 뭐가 다른가?",
    answer:
      "현재는 보유한 주택 수가 늘어나면 종부세 부담이 커지는 구조입니다. \"보유가액\" 중심으로 바뀌면 주택 수보다 전체 보유 부동산 가치를 기준으로 과세하게 되어, 지방 저가주택을 여러 채 가진 경우와 수도권 고가주택 한 채를 가진 경우의 형평성 문제를 다르게 다룰 수 있습니다. 이는 7월 16일 토론회에서 나온 전문가 제언이며, 정부가 채택을 확정한 것은 아닙니다.",
  },
  {
    id: "long-term-deduction-explainer",
    question: "장기보유특별공제는 왜 개편이 거론되나?",
    answer:
      "현재는 오래 보유하기만 해도 공제를 받을 수 있어, 실거주 없이 장기 보유한 고가주택도 상당한 공제를 받는 경우가 있었습니다. 개편 논의는 이 중 실거주 요건이 없는 단순 보유기간 공제를 줄이고, 실제 거주한 기간에 대한 공제는 유지하거나 강화하는 방향입니다. 다만 구체적인 공제율과 시행일은 확정되지 않았습니다.",
  },
];

export type SimulationRow = {
  baseAmount: string;
  at60: string;
  at70: string;
  at80: string;
  increaseVs60: string;
};

export const RTR_FAIR_MARKET_SIMULATION: SimulationRow[] = [
  { baseAmount: "3억 원", at60: "1.8억 원", at70: "2.1억 원", at80: "2.4억 원", increaseVs60: "+33.3%" },
  { baseAmount: "5억 원", at60: "3억 원", at70: "3.5억 원", at80: "4억 원", increaseVs60: "+33.3%" },
  { baseAmount: "10억 원", at60: "6억 원", at70: "7억 원", at80: "8억 원", increaseVs60: "+33.3%" },
  { baseAmount: "20억 원", at60: "12억 원", at70: "14억 원", at80: "16억 원", increaseVs60: "+33.3%" },
];

export const RTR_SIMULATION_NOTE =
  "위 표는 과세표준(공시가격 반영분)만 계산한 값입니다. 과세표준은 33.3% 증가하지만, 최종 세액이 그대로 33.3% 오르는 것은 아닙니다. 세율 구간, 세부담 상한, 세액공제에 따라 실제 증가율은 달라집니다. 연합뉴스 보도에 따르면 특정 고가 단독주택 사례에서 비율 60%→80% 가정 시 보유세가 약 697만 원에서 808만 원으로 약 15.9% 증가하는 것으로 분석됐습니다.";

export type ProcedureRow = { item: string; procedure: string; speed: string };

export const RTR_LAW_VS_DECREE: ProcedureRow[] = [
  { item: "종부세 공정시장가액비율", procedure: "시행령 개정", speed: "비교적 빠름" },
  { item: "장기보유특별공제율", procedure: "소득세법 개정", speed: "국회 통과 필요" },
  { item: "종부세 주택 수 기준 개편", procedure: "종합부동산세법 개정 가능성", speed: "국회 통과 필요" },
  { item: "취득세 중과 구조", procedure: "지방세법 개정", speed: "국회 통과 필요" },
  { item: "재산세 공정시장가액비율", procedure: "지방세법 시행령 개정", speed: "정부 개정 가능" },
];

export type LtdRow = { period: string; holdingRate: string; residenceRate: string; total: string };

export const RTR_LTD_CURRENT: LtdRow[] = [
  { period: "3년", holdingRate: "12%", residenceRate: "12%", total: "24%" },
  { period: "5년", holdingRate: "20%", residenceRate: "20%", total: "40%" },
  { period: "7년", holdingRate: "28%", residenceRate: "28%", total: "56%" },
  { period: "10년 이상", holdingRate: "40%", residenceRate: "40%", total: "최대 80%" },
];

export const RTR_CHECKLIST: string[] = [
  "내 주택이 종부세 과세 대상인지 확인",
  "2026년 공시가격 확인",
  "전체 보유주택 공시가격 합계 계산",
  "1세대 1주택 여부 확인",
  "실제 거주기간과 보유기간 구분",
  "양도 예정이라면 현재 장특공제율 계산",
  "정부안 발표 후 시행일·경과규정 확인",
  "국회 통과 전에는 확정 세법으로 판단하지 않기",
];

export type FaqItem = { question: string; answer: string };

export const RTR_FAQ: FaqItem[] = [
  {
    question: "2026 부동산 세제개편은 확정된 건가요?",
    answer:
      "아니요. 2026년 7월 21일 기준으로 정부가 확정한 개편안은 없습니다. 재정경제부 등 부처별 토론회에 이어 7월 23일 대통령 주재 부동산 국민 대토론회를 거쳐 세제개편 방향이 공개될 예정이며, 구체적인 발표일과 최종 내용은 아직 확정되지 않았습니다.",
  },
  {
    question: "공정시장가액비율이 60%에서 80%로 오르면 세금도 33% 오르나요?",
    answer:
      "반드시 그렇지는 않습니다. 공정시장가액비율이 60%에서 80%로 오르면 과세표준 자체는 33.3% 늘어나지만, 최종 세금은 과세표준 구간, 적용 세율, 세부담 상한, 고령자·장기보유 세액공제 등에 따라 달라집니다. 애초에 종부세 과세 대상이 아닌 주택은 이 비율 인상의 직접적인 영향을 받지 않습니다.",
  },
  {
    question: "실거주 1주택자도 세금이 오르나요?",
    answer:
      "실거주 1주택자를 보호한다는 방향이 거론되고 있지만, 모든 실거주 1주택자의 세금이 동결된다고 확정된 것은 아닙니다. 고가 1주택자는 공정시장가액비율이 오를 경우 종부세 부담이 늘어날 수 있으며, 구체적인 공제와 세부담 상한은 최종 정부안을 확인해야 합니다.",
  },
  {
    question: "다주택자는 무조건 불리해지나요?",
    answer:
      "아닙니다. 주택 수 중심 과세가 보유가액 중심으로 바뀐다면 저가주택을 여러 채 보유한 경우 부담이 줄어들 수 있고, 고가주택 보유자는 주택 수가 적더라도 부담이 늘어날 수 있습니다. 아직 정부안이 확정되지 않았으므로 보유가액 전환이 실제로 도입될지부터 확인해야 합니다.",
  },
  {
    question: "장기보유특별공제는 바로 바뀌나요?",
    answer:
      "장기보유특별공제 변경은 소득세법 개정이 필요한 사안입니다. 정부안에 포함되더라도 국회 심의와 의결을 거쳐야 하므로 발표 즉시 바뀌지 않습니다. 시행일과 기존 보유자에 대한 경과규정도 최종 개정안을 확인해야 합니다.",
  },
  {
    question: "2026년에 집을 팔 계획이면 기다리는 게 좋나요?",
    answer:
      "세제개편 전망만으로 매도 시점을 결정하기는 어렵습니다. 취득가액, 예상 양도가액, 실제 거주기간, 보유기간, 필요경비에 따라 현재 제도에서도 세액 차이가 크게 발생합니다. 현행 기준 양도세를 먼저 계산한 뒤 개편안과 경과규정을 비교하는 것이 안전합니다.",
  },
];

export type RelatedLink = { label: string; href: string; desc: string };

export const RTR_RELATED_LINKS: RelatedLink[] = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공정시장가액비율을 직접 조정해 재산세·종부세를 계산합니다.",
  },
  {
    label: "양도소득세 계산기",
    href: "/tools/capital-gains-tax-calculator/",
    desc: "장기보유특별공제를 반영한 양도세를 계산합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "매수 시 취득세를 미리 계산합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·보유세·양도세 구조를 단계별로 정리한 심층 리포트입니다.",
  },
  {
    label: "2026 재산세 납부기간 총정리",
    href: "/reports/property-tax-payment-2026/",
    desc: "재산세 납부 일정과 6월 1일 과세기준일을 확인합니다.",
  },
];

export type SourceTableRow = {
  date: string;
  source: string;
  content: string;
  nature: string;
  url: string;
};

export const RTR_SOURCE_TABLE: SourceTableRow[] = [
  {
    date: "2026-07-16",
    source: "재정경제부 부동산 세제 국민 의견 경청 토론회",
    content: "종부세 가액 기준 전환, 장특공제 실거주 중심 개편 관련 전문가 제언",
    nature: "공식 토론회",
    url: "https://moef.go.kr/nw/nes/nesdta.do?bbsId=MOSFBBS_000000000028&menuNo=4010100",
  },
  {
    date: "2026-07-16",
    source: "연합뉴스",
    content: "\"종부세, 주택수 아닌 가액으로…장특공제는 거주 중심\" 토론회 보도",
    nature: "언론 보도",
    url: "https://www.yna.co.kr/view/AKR20260716101651002",
  },
  {
    date: "2026-06-25",
    source: "연합뉴스",
    content: "공정시장가액비율 60%→80% 가정 시 보유세 시뮬레이션",
    nature: "언론·전문가 분석",
    url: "https://www.yna.co.kr/view/AKR20260625043700003",
  },
  {
    date: "2026-07-10",
    source: "파이낸셜뉴스 등",
    content: "7월 23일 대통령 주재 부동산 대토론회, 8월 초 세제개편안 공개 계획 보도",
    nature: "언론 보도",
    url: "https://www.fnnews.com/news/202607101151492797",
  },
  {
    date: "2026-04-24",
    source: "한겨레",
    content: "대통령 \"실거주 기간 양도세 감면 확대, 비거주는 축소\" 발언",
    nature: "정책 발언",
    url: "https://www.hani.co.kr/arti/politics/politics_general/1255808.html",
  },
  {
    date: "현행",
    source: "국가법령정보센터 (지방세법 시행령)",
    content: "재산세 공정시장가액비율 규정",
    nature: "현행 법령",
    url: "https://www.law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=120262",
  },
  {
    date: "2025-08-17",
    source: "한국경제",
    content: "인구감소지역 세컨드홈 특례 공시가격 9억 원으로 확대 시행",
    nature: "현행 제도 (시행 완료)",
    url: "https://www.hankyung.com/article/2025081742506",
  },
];
