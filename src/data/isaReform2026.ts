export type PolicyStatus =
  | "RUMOR"
  | "GOVERNMENT_REVIEW"
  | "GOVERNMENT_ANNOUNCED"
  | "BILL_SUBMITTED"
  | "ASSEMBLY_PASSED"
  | "EFFECTIVE";

export const ISA_REFORM_META = {
  slug: "isa-reform-2026",
  title: "2026 ISA 개편안 정리",
  description:
    "2026년 8월 발표된 ISA 세제개편안을 정리했습니다. 생산적금융 ISA 신설, 기존 ISA 이월 폐지·계약기간 5년 제한 내용과 투자 성향별 영향을 확인하세요.",
  seoTitle: "2026 ISA 개편안 정리 | 생산적금융 ISA·이월 폐지 총정리",
  seoDescription:
    "2026년 8월 3일 발표된 ISA 세제개편안을 정리했습니다. 생산적금융 ISA 신설과 기존 ISA 이월 폐지·계약기간 제한 내용을 확인하고 ISA 계산기로 바로 연결됩니다.",
  updatedAt: "2026-08-05",
  policyStatus: "GOVERNMENT_ANNOUNCED" as PolicyStatus,
  policyStatusLabel: "정부안 발표",
  nextMilestone:
    "국회 제출 및 통과 절차 예정 (구체적 일정 미확정). 시행 목표는 다수 보도에서 2027년 이후로 거론되나 확정 시행일 아님",
  dataNote:
    "이 페이지는 정부 확정 법률이 아니라 2026년 8월 3일 세제개편안 발표 내용과 재정경제부 문답자료, 언론 보도를 바탕으로 정리한 자료입니다. 일부 수치는 단일 언론 보도에만 근거해 '확인 필요' 배지로 표시했으며, 국회 심의 과정에서 내용이 달라질 수 있습니다.",
};

export type TimelineStep = {
  status: PolicyStatus;
  label: string;
  dateLabel: string;
  isCurrent: boolean;
  isDone: boolean;
};

export const ISA_REFORM_TIMELINE: TimelineStep[] = [
  { status: "GOVERNMENT_REVIEW", label: "정부 검토", dateLabel: "2026년 8월 이전", isCurrent: false, isDone: true },
  { status: "GOVERNMENT_ANNOUNCED", label: "정부 세제개편안 발표", dateLabel: "2026년 8월 3일", isCurrent: true, isDone: true },
  { status: "BILL_SUBMITTED", label: "국회 제출", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "ASSEMBLY_PASSED", label: "국회 심의·의결", dateLabel: "일정 미정", isCurrent: false, isDone: false },
  { status: "EFFECTIVE", label: "시행", dateLabel: "2027년 이후 거론 (미확정)", isCurrent: false, isDone: false },
];

export type ConfidenceLevel = "문답자료 확인" | "언론 보도" | "확인 필요";

export type CompareRow = {
  id: string;
  category: string;
  currentIsa: string;
  currentIsaAfterReform: string;
  productiveFinanceIsa: string;
  confidence: ConfidenceLevel;
  sourceLabel: string;
  sourceUrl: string;
};

export const ISA_REFORM_COMPARE_ROWS: CompareRow[] = [
  {
    id: "annual-limit",
    category: "연간 납입한도",
    currentIsa: "2,000만원",
    currentIsaAfterReform: "2,000만원 유지",
    productiveFinanceIsa: "2,000만원",
    confidence: "문답자료 확인",
    sourceLabel: "재정경제부 문답자료",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "total-limit",
    category: "총 납입한도",
    currentIsa: "1억원",
    currentIsaAfterReform: "1억원 유지 (이월 폐지·5년 제한과 결합 시 사실상 매년 풀납입 필요)",
    productiveFinanceIsa: "2억원",
    confidence: "언론 보도",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "carryover",
    category: "미사용 한도 이월",
    currentIsa: "다음 연도로 이월 가능",
    currentIsaAfterReform: "이월 폐지",
    productiveFinanceIsa: "해당 없음 (연 한도 고정)",
    confidence: "문답자료 확인",
    sourceLabel: "재정경제부 문답자료",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    id: "contract-period",
    category: "계약기간",
    currentIsa: "3년 이후 계속 유지 가능",
    currentIsaAfterReform: "총 5년 이내로 제한 (기존 가입자 소급 기산점 확인 필요)",
    productiveFinanceIsa: "최대 10년",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "tax-free-limit",
    category: "비과세 한도",
    currentIsa: "일반 200만원 / 서민형 400만원",
    currentIsaAfterReform: "기존 수준 유지",
    productiveFinanceIsa: "대상 이자·배당 전액",
    confidence: "언론 보도",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "excess-tax",
    category: "초과분 과세",
    currentIsa: "9.9% 분리과세",
    currentIsaAfterReform: "유지",
    productiveFinanceIsa: "전액 비과세 대상 외 항목은 확인 필요",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "investment-target",
    category: "투자 대상",
    currentIsa: "국내주식·ETF(해외지수 추종 국내 상장 ETF 포함)·채권·RP·예적금 등",
    currentIsaAfterReform: "기존과 유사",
    productiveFinanceIsa: "국내주식·국내주식형 펀드·국민성장펀드 등 (해외 상품 원칙적 제외, BDC 포함 여부 확인 필요)",
    confidence: "확인 필요",
    sourceLabel: "뉴스핌 2026-07-31",
    sourceUrl: "https://www.newspim.com/news/view/20260731001283",
  },
  {
    id: "dual-holding",
    category: "기존 ISA 동시 가입",
    currentIsa: "-",
    currentIsaAfterReform: "-",
    productiveFinanceIsa: "기존 ISA와 별도로 동시 가입 가능한지 확인 필요",
    confidence: "확인 필요",
    sourceLabel: "원문 대조 전",
    sourceUrl: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
];

export type CarryoverRow = {
  scenario: "before" | "after";
  year: string;
  actualDeposit: string;
  nextYearAvailableLimit: string;
};

export const ISA_REFORM_CARRYOVER_EXAMPLE: CarryoverRow[] = [
  { scenario: "before", year: "2026년 500만원 납입", actualDeposit: "500만원", nextYearAvailableLimit: "2027년 최대 3,500만원" },
  { scenario: "before", year: "2026년 0원 납입", actualDeposit: "0원", nextYearAvailableLimit: "2027년 최대 4,000만원" },
  { scenario: "after", year: "2026년 500만원 납입", actualDeposit: "500만원", nextYearAvailableLimit: "2027년 최대 2,000만원" },
  { scenario: "after", year: "2026년 0원 납입", actualDeposit: "0원", nextYearAvailableLimit: "2027년 최대 2,000만원" },
];

export const ISA_REFORM_CARRYOVER_INSIGHT =
  "매년 2,000만원 한도를 다 채우지 않으면 남은 한도가 그대로 사라지는 구조입니다. 총 납입한도 1억원은 형식상 유지되지만, 이월이 폐지되고 계약기간이 5년으로 제한되면 이 한도를 실제로 채우려면 5년 동안 매년 빠짐없이 2,000만원을 납입해야 합니다. 결과적으로 총한도 자체의 실효성이 약해지는 구조입니다.";

export type ExplainerCard = {
  id: string;
  question: string;
  answer: string;
};

export const ISA_REFORM_EXPLAINERS: ExplainerCard[] = [
  {
    id: "productive-finance-isa-explainer",
    question: "생산적금융 ISA란?",
    answer:
      "국내 주식시장과 국내 기업에 투자하는 사람에게 세제 혜택을 집중하기 위해 신설이 검토되는 별도의 ISA 계좌입니다. 기존 ISA(연 2,000만원·총 1억원)와 별도로, 연 2,000만원씩 최대 10년간 총 2억원까지 납입하는 구조로 보도됐습니다. 국내주식·국내주식형 펀드 등 국내 투자 대상에만 적용되며, 해외 상품은 원칙적으로 제외되는 방향입니다.",
  },
  {
    id: "bdc-explainer",
    question: "BDC란?",
    answer:
      "Business Development Company(비상장기업투자회사)의 약자로, 비상장 기업에 투자하는 회사형 투자기구입니다. 생산적금융 ISA의 투자 대상에 포함될 수 있다고 보도됐으나, 일반 개인투자자에게는 생소한 상품이므로 최종 포함 여부와 상품 구조를 시행 전 반드시 확인해야 합니다.",
  },
  {
    id: "growth-fund-explainer",
    question: "국민성장펀드란?",
    answer:
      "이번 개편안에서 국내 투자를 유도하기 위해 정부가 새로 지정하는 펀드 유형으로 거론되고 있습니다. 아직 구체적인 운용 방식과 상품 라인업이 확정되지 않았으므로, 정부안·시행령이 확정된 뒤 실제 상품 정보를 다시 확인해야 합니다.",
  },
  {
    id: "tax-free-meaning-explainer",
    question: "\"전액 비과세\"가 정확히 무엇을 의미하나?",
    answer:
      "생산적금융 ISA의 \"전액 비과세\"를 모든 투자수익이 비과세라는 뜻으로 오해하기 쉽습니다. 일반 개인투자자는 현재도 국내 상장주식 매매차익 대부분이 비과세이므로, 실질적인 추가 혜택은 국내 배당주 배당금, 국내주식형 ETF 분배금, 펀드·BDC 등에서 발생하는 배당·이자소득에 있습니다. 예를 들어 일반 계좌에서 국내 배당금 1,000만원을 받으면 통상 15.4%(154만원)가 원천징수되는데, 생산적금융 ISA에서 비과세 대상이 되면 이 세금을 줄일 수 있습니다.",
  },
  {
    id: "comprehensive-tax-explainer",
    question: "배당소득이 많으면 원천징수만으로 끝나지 않나?",
    answer:
      "이자·배당 등 금융소득 합계가 연 2천만원을 넘으면 원천징수(15.4%)로 끝나지 않고 다른 소득과 합산해 종합과세되며, 세율 구간에 따라 최대 49.5%까지 올라갈 수 있습니다. 배당소득이 큰 투자자일수록 생산적금융 ISA의 비과세 혜택이 상대적으로 더 클 수 있습니다.",
  },
];

export type PersonaCard = {
  id: string;
  persona: string;
  direction: "기존 ISA 유리" | "생산적금융 ISA 유리" | "혜택 제한적" | "확인 필요";
  summary: string;
};

export const ISA_REFORM_PERSONA_SCENARIOS: PersonaCard[] = [
  {
    id: "overseas-index-etf",
    persona: "해외지수 ETF(S&P500·나스닥100 등 국내 상장) 중심 투자자",
    direction: "기존 ISA 유리",
    summary:
      "생산적금융 ISA는 해외 상품을 원칙적으로 제외하는 방향이므로, 국내 상장된 해외지수 추종 ETF에 투자한다면 기존 ISA를 계속 활용하는 편이 유리할 수 있습니다.",
  },
  {
    id: "domestic-dividend",
    persona: "국내 배당주·금융지주 장기 배당투자자",
    direction: "생산적금융 ISA 유리",
    summary:
      "배당·이자소득 전액 비과세 혜택이 검토되고 있어, 국내 배당주를 장기 보유하며 배당소득이 큰 투자자에게 상대적으로 유리한 구조로 거론됩니다.",
  },
  {
    id: "short-term-stock-trading",
    persona: "국내 개별주식 단기 매매 중심 투자자",
    direction: "혜택 제한적",
    summary:
      "국내 상장주식 매매차익은 일반 계좌에서도 대부분 비과세이므로, 매매 위주 투자자는 생산적금융 ISA의 추가 혜택이 상대적으로 크지 않을 수 있습니다.",
  },
  {
    id: "youth-investor",
    persona: "청년 투자자 (소득공제 대상 여부 확인 필요)",
    direction: "확인 필요",
    summary:
      "납입액의 10% 소득공제가 검토되고 있으나 연령·소득 요건, 공제한도, 중도해지 추징 여부가 아직 확정되지 않았습니다. 시행령 확정 후 대상 여부를 다시 확인해야 합니다.",
  },
];

export type FaqItem = { question: string; answer: string };

export const ISA_REFORM_FAQ: FaqItem[] = [
  {
    question: "2026 ISA 개편안은 확정된 건가요?",
    answer:
      "아니요. 2026년 8월 3일 정부가 세제개편안을 발표했지만, 국회 제출과 심의·의결을 거쳐야 실제 시행됩니다. 이 페이지는 정부안 발표 내용을 정리한 자료이며 확정 법률이 아닙니다.",
  },
  {
    question: "생산적금융 ISA와 기존 ISA를 동시에 가입할 수 있나요?",
    answer:
      "현재 공개된 자료만으로는 명확하지 않습니다. 원문 대조가 끝나는 대로 이 페이지를 갱신할 예정이며, 그 전까지는 '확인 필요' 항목으로 표시합니다.",
  },
  {
    question: "기존 ISA에 넣어둔 돈은 어떻게 되나요?",
    answer:
      "이월 폐지와 계약기간 5년 제한이 기존 가입자에게도 적용되는 방향으로 보도됐지만, 정확한 소급 기산점(개편 시행일 기준인지 최초 가입일 기준인지)은 아직 확정되지 않았습니다.",
  },
  {
    question: "생산적금융 ISA는 정말 세금이 하나도 없나요?",
    answer:
      "국내 상장주식 매매차익은 일반 계좌에서도 대부분 비과세이므로, 생산적금융 ISA의 실질적인 추가 혜택은 배당·분배금·이자소득에 있습니다. 모든 수익이 새롭게 비과세로 바뀐다는 뜻은 아닙니다.",
  },
  {
    question: "청년 소득공제는 누가 받을 수 있나요?",
    answer:
      "납입액의 10% 소득공제가 검토되고 있으나, 연령·소득 요건과 공제한도, 중도해지 추징 여부는 아직 확정되지 않았습니다. 시행령이 나오면 대상 여부를 다시 확인해야 합니다.",
  },
  {
    question: "지금 기존 ISA에 얼마나 넣어야 하나요?",
    answer:
      "일률적으로 답하기는 어렵습니다. 이월 폐지가 예정대로 시행되면 매년 한도를 채우지 않을 경우 남은 한도가 사라지므로, 여유 자금이 있다면 연간 한도 내에서 납입하는 것을 고려할 수 있습니다. 다만 개인의 자금 상황과 투자 계획에 따라 다르므로 세무 전문가·증권사 상담을 권장합니다.",
  },
];

export type RelatedLink = { label: string; href: string; desc: string };

export const ISA_REFORM_RELATED_LINKS: RelatedLink[] = [
  {
    label: "ISA 계좌 절세 시뮬레이터",
    href: "/tools/isa-tax-calculator/",
    desc: "일반형·서민형·농어민형 비과세 혜택을 현재 기준으로 계산합니다.",
  },
  {
    label: "ETF 분배금 세후 비교 계산기",
    href: "/tools/etf-distribution-tax-calculator/",
    desc: "국내 ETF·미국 ETF·ISA 계좌 분배금 세후 실수령을 비교합니다.",
  },
  {
    label: "배당 목표 역산 계산기",
    href: "/tools/dividend-target-calculator/",
    desc: "월 배당금 목표에 필요한 투자금을 세전·세후로 계산합니다.",
  },
  {
    label: "2026 부동산 세제개편 전망",
    href: "/reports/real-estate-tax-reform-2026/",
    desc: "같은 8월 세제개편안의 부동산 파트를 정리한 리포트입니다.",
  },
];

export type SourceTableRow = {
  date: string;
  source: string;
  content: string;
  nature: string;
  url: string;
};

export const ISA_REFORM_SOURCE_TABLE: SourceTableRow[] = [
  {
    date: "2026-08-03",
    source: "재정경제부 2026년 세제개편안 문답자료",
    content: "기존 ISA 이월 폐지, 계약기간 제한 관련 정부 공식 문답",
    nature: "정부 공식 자료",
    url: "https://mofe.go.kr/com/cmm/fms/FileDown.do?atchFileId=ATCH_000000000032335&fileSn=8",
  },
  {
    date: "2026-07-31",
    source: "뉴스핌",
    content: "\"생산적금융 ISA 신설...국내 투자 땐 이자·배당 전액 '비과세'\" 보도",
    nature: "언론 보도",
    url: "https://www.newspim.com/news/view/20260731001283",
  },
];
