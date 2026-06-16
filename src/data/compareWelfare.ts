export type WelfareCompareItemType = "calculator" | "report" | "comparison" | "anchor";
export type WelfareCompareBadgeTone = "default" | "popular" | "new" | "official" | "youth" | "family" | "housing";

export interface WelfareCompareBadge {
  label: string;
  tone: WelfareCompareBadgeTone;
}

export interface WelfareCompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: WelfareCompareItemType;
  criteria: string[];
  badges: WelfareCompareBadge[];
  ctaLabel: string;
  priority: number;
}

export interface WelfareCompareGuide {
  title: string;
  description: string;
}

export interface WelfareCompareFlowStep {
  title: string;
  description: string;
}

export interface WelfareCompareFaq {
  question: string;
  answer: string;
}

export const WELFARE_COMPARE_QUICK_LINKS: WelfareCompareItem[] = [
  {
    id: "quick-youth-savings",
    title: "청년 자산형성 비교",
    description: "청년미래적금, 청년도약계좌, 일반 적금의 만기 수령액을 같은 납입액 기준으로 비교합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
    type: "calculator",
    criteria: ["청년미래적금", "청년도약계좌", "일반 적금"],
    badges: [{ label: "청년", tone: "youth" }, { label: "인기", tone: "popular" }],
    ctaLabel: "만기 수령액 계산",
    priority: 1,
  },
  {
    id: "quick-welfare-benefit",
    title: "복지급여 가능성 확인",
    description: "가구원 수, 소득, 재산 기준으로 복지급여 수급 가능성을 간이 확인합니다.",
    href: "/tools/welfare-benefit-eligibility/",
    type: "calculator",
    criteria: ["가구원 수", "소득", "재산"],
    badges: [{ label: "복지급여", tone: "official" }],
    ctaLabel: "자격 확인",
    priority: 2,
  },
  {
    id: "quick-birth-support",
    title: "출산·육아 지원금 계산",
    description: "출산 직후부터 2세까지 받을 수 있는 지원금 흐름을 확인합니다.",
    href: "/tools/birth-support-total/",
    type: "calculator",
    criteria: ["출산", "아동수당", "부모급여"],
    badges: [{ label: "출산·육아", tone: "family" }],
    ctaLabel: "지원금 계산",
    priority: 3,
  },
  {
    id: "quick-postnatal-cost",
    title: "산후도우미 지원금 소득기준 확인",
    description: "가구원 수와 건강보험료로 산후도우미 정부지원 가능성을 먼저 판정합니다.",
    href: "/tools/postnatal-care-income-eligibility/",
    type: "calculator",
    criteria: ["건보료", "중위소득 150%", "예외지원"],
    badges: [{ label: "산후도우미", tone: "family" }, { label: "신규", tone: "new" }],
    ctaLabel: "소득기준 확인",
    priority: 4,
  },
];

export const WELFARE_COMPARE_YOUTH_ITEMS: WelfareCompareItem[] = [
  {
    id: "youth-savings-maturity",
    title: "청년 적금 만기 수령액 계산기",
    description: "청년미래적금, 청년도약계좌, 일반 적금을 월 납입액·금리·기여금 기준으로 비교합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
    type: "calculator",
    criteria: ["월 납입액", "정부기여금", "비과세"],
    badges: [{ label: "청년", tone: "youth" }, { label: "계산기", tone: "default" }],
    ctaLabel: "계산하기",
    priority: 1,
  },
  {
    id: "youth-future-savings",
    title: "청년미래적금 조건 정리",
    description: "가입 조건, 납입 한도, 정부기여금, 비과세 여부를 먼저 확인합니다.",
    href: "/reports/youth-future-savings-2026/",
    type: "report",
    criteria: ["가입 조건", "납입 한도", "정부기여금"],
    badges: [{ label: "리포트", tone: "default" }],
    ctaLabel: "조건 보기",
    priority: 2,
  },
  {
    id: "youth-savings-comparison",
    title: "청년미래적금 vs 청년도약계좌 비교",
    description: "두 제도의 만기, 납입 조건, 정부기여금 차이를 비교합니다.",
    href: "/reports/youth-savings-comparison-2026/",
    type: "comparison",
    criteria: ["만기", "납입 조건", "기여금"],
    badges: [{ label: "비교", tone: "popular" }],
    ctaLabel: "비교 보기",
    priority: 3,
  },
  {
    id: "savings-vs-etf",
    title: "월 적금 vs ETF 노후 계산기",
    description: "지원금 상품 이후 장기 자산형성 대안을 적금과 ETF 기준으로 비교합니다.",
    href: "/tools/savings-vs-etf-retirement/",
    type: "calculator",
    criteria: ["적금", "ETF", "장기 수익"],
    badges: [{ label: "확장", tone: "new" }],
    ctaLabel: "장기 비교",
    priority: 4,
  },
];

export const WELFARE_COMPARE_FAMILY_ITEMS: WelfareCompareItem[] = [
  {
    id: "birth-support-total",
    title: "출산~2세 지원금 계산기",
    description: "출산 직후부터 2세까지 받을 수 있는 총지원금을 계산합니다.",
    href: "/tools/birth-support-total/",
    type: "calculator",
    criteria: ["부모급여", "아동수당", "첫만남이용권"],
    badges: [{ label: "출산", tone: "family" }, { label: "인기", tone: "popular" }],
    ctaLabel: "총지원금 계산",
    priority: 1,
  },
  {
    id: "birth-support-money",
    title: "출산지원금 총수령액 계산기",
    description: "국가 공통 지원금과 지자체 출산지원금을 함께 합산합니다.",
    href: "/tools/birth-support-money/",
    type: "calculator",
    criteria: ["국가 지원", "지자체", "총수령액"],
    badges: [{ label: "신규", tone: "new" }],
    ctaLabel: "지역 지원금 계산",
    priority: 2,
  },
  {
    id: "parental-leave-pay",
    title: "육아휴직 급여 계산기",
    description: "육아휴직 기간별 급여 상한과 월별 수령 구조를 확인합니다.",
    href: "/tools/parental-leave-pay/",
    type: "calculator",
    criteria: ["휴직 기간", "급여 상한", "월별 수령"],
    badges: [{ label: "육아휴직", tone: "family" }],
    ctaLabel: "급여 계산",
    priority: 3,
  },
  {
    id: "single-parental-leave-total",
    title: "한 명만 육아휴직 총수령액 계산기",
    description: "한쪽 부모 기준 육아휴직 총수령액 흐름을 계산합니다.",
    href: "/tools/single-parental-leave-total/",
    type: "calculator",
    criteria: ["외벌이", "총수령액", "기간"],
    badges: [{ label: "육아휴직", tone: "family" }],
    ctaLabel: "총수령액 보기",
    priority: 4,
  },
  {
    id: "parental-leave-short-work",
    title: "육아휴직+단축근무 계산기",
    description: "육아휴직과 단축근무를 섞어 쓸 때 남는 기간과 월급을 함께 봅니다.",
    href: "/tools/parental-leave-short-work-calculator/",
    type: "calculator",
    criteria: ["단축근무", "휴직 잔여", "월급"],
    badges: [{ label: "근무시간", tone: "family" }],
    ctaLabel: "소득 흐름 계산",
    priority: 5,
  },
  {
    id: "postnatal-care-cost",
    title: "산후도우미 비용 계산기",
    description: "산후도우미 본인부담금과 지원금 영향을 확인합니다.",
    href: "/tools/postnatal-care-cost/",
    type: "calculator",
    criteria: ["본인부담금", "정부지원", "기간"],
    badges: [{ label: "산후", tone: "family" }],
    ctaLabel: "비용 계산",
    priority: 6,
  },
  {
    id: "postnatal-care-income-eligibility",
    title: "산후도우미 지원금 소득기준 계산기",
    description: "가구원 수와 건강보험료를 입력해 기준중위소득 150% 해당 여부와 예외지원 확인 포인트를 계산합니다.",
    href: "/tools/postnatal-care-income-eligibility/",
    type: "calculator",
    criteria: ["건강보험료", "150% 기준", "맞벌이"],
    badges: [{ label: "신규", tone: "new" }, { label: "소득기준", tone: "family" }],
    ctaLabel: "소득기준 확인",
    priority: 6.5,
  },
  {
    id: "pregnancy-birth-cost",
    title: "임신·출산 비용 계산기",
    description: "임신부터 출산 전후까지 들어가는 비용 흐름을 확인합니다.",
    href: "/tools/pregnancy-birth-cost/",
    type: "calculator",
    criteria: ["임신", "출산", "비용"],
    badges: [{ label: "비용", tone: "family" }],
    ctaLabel: "비용 보기",
    priority: 7,
  },
  {
    id: "pregnancy-checkup-cost",
    title: "임신 주수별 검사 비용 계산기",
    description: "임신 검사비를 주수별로 확인하고 출산 전 비용을 준비합니다.",
    href: "/tools/pregnancy-checkup-cost/",
    type: "calculator",
    criteria: ["검사비", "주수", "준비금"],
    badges: [{ label: "임신", tone: "family" }],
    ctaLabel: "검사비 확인",
    priority: 8,
  },
];

export const WELFARE_COMPARE_BENEFIT_ITEMS: WelfareCompareItem[] = [
  {
    id: "welfare-benefit-eligibility",
    title: "복지급여 수급 자격 계산기",
    description: "가구원 수, 소득, 재산을 입력해 급여별 가능성을 간이 확인합니다.",
    href: "/tools/welfare-benefit-eligibility/",
    type: "calculator",
    criteria: ["가구원 수", "소득", "재산"],
    badges: [{ label: "자격 확인", tone: "official" }, { label: "계산기", tone: "default" }],
    ctaLabel: "자격 계산",
    priority: 1,
  },
  {
    id: "livelihood-benefit-income-recognition",
    title: "생계급여 소득인정액 계산기",
    description: "가구원 수, 월소득, 재산을 입력해 생계급여 선정기준 대비 소득인정액과 예상 급여액을 확인합니다.",
    href: "/tools/livelihood-benefit-income-recognition/",
    type: "calculator",
    criteria: ["소득인정액", "생계급여", "선정기준"],
    badges: [{ label: "신규", tone: "new" }, { label: "복지급여", tone: "official" }],
    ctaLabel: "소득인정액 계산",
    priority: 1.5,
  },
  {
    id: "basic-livelihood-recipient-asset-standard",
    title: "기초생활수급자 재산 기준 계산기",
    description: "전세보증금, 예금, 부채, 자동차를 입력해 재산의 월 소득환산액 영향을 점검합니다.",
    href: "/tools/basic-livelihood-recipient-asset-standard/",
    type: "calculator",
    criteria: ["재산 기준", "소득환산액", "자동차"],
    badges: [{ label: "신규", tone: "new" }, { label: "재산 기준", tone: "official" }],
    ctaLabel: "재산 기준 확인",
    priority: 1.6,
  },
  {
    id: "government-welfare-benefits",
    title: "2026 정부 복지지원금 완전 정복",
    description: "청년, 저소득, 가족, 노인, 장애, 바우처 지원제도를 한 번에 훑어봅니다.",
    href: "/reports/2026-government-welfare-benefits/",
    type: "report",
    criteria: ["청년", "저소득", "가족"],
    badges: [{ label: "정부지원", tone: "official" }],
    ctaLabel: "지원제도 보기",
    priority: 2,
  },
];

export const WELFARE_COMPARE_HOUSING_ITEMS: WelfareCompareItem[] = [
  {
    id: "salaried-loan-comparison",
    title: "2026 직장인 대출 비교",
    description: "정책금융과 대출 비교 흐름을 지원금 탐색 이후로 연결합니다.",
    href: "/reports/2026-salaried-loan-comparison/",
    type: "report",
    criteria: ["정책금융", "대출", "직장인"],
    badges: [{ label: "주거·금융", tone: "housing" }],
    ctaLabel: "대출 비교",
    priority: 1,
  },
  {
    id: "home-purchase-fund",
    title: "내집마련 자금 계산기",
    description: "필요한 자기자본과 대출 규모를 계산합니다.",
    href: "/tools/home-purchase-fund/",
    type: "calculator",
    criteria: ["자기자본", "대출", "매매가"],
    badges: [{ label: "주거", tone: "housing" }],
    ctaLabel: "자금 계산",
    priority: 2,
  },
  {
    id: "newlywed-rent-vs-buy",
    title: "신혼부부 전세 vs 매매",
    description: "신혼부부 주거 선택 비용을 전세와 매매 기준으로 비교합니다.",
    href: "/tools/newlywed-rent-vs-buy/",
    type: "comparison",
    criteria: ["신혼부부", "전세", "매매"],
    badges: [{ label: "신혼", tone: "housing" }],
    ctaLabel: "주거 비교",
    priority: 3,
  },
];

export const WELFARE_COMPARE_REPORT_ITEMS: WelfareCompareItem[] = [
  {
    id: "birth-support-region",
    title: "2026 지역별 출산지원금 비교",
    description: "지역별 출산지원금 차이를 리포트로 확인합니다.",
    href: "/reports/birth-support-by-region-2026/",
    type: "report",
    criteria: ["지역", "출산지원금", "2026"],
    badges: [{ label: "지역별", tone: "family" }],
    ctaLabel: "지역 비교",
    priority: 1,
  },
  {
    id: "postnatal-care-comparison",
    title: "산후도우미 vs 산후조리원 비교",
    description: "출산 직후 돌봄 비용과 선택지를 비교합니다.",
    href: "/reports/postnatal-care-comparison-2026/",
    type: "report",
    criteria: ["산후도우미", "산후조리원", "비용"],
    badges: [{ label: "출산", tone: "family" }],
    ctaLabel: "비교 보기",
    priority: 2,
  },
  {
    id: "postnatal-care-income-link",
    title: "산후도우미 지원금 소득기준 먼저 확인",
    description: "산후도우미 비용 계산 전, 우리 가구가 정부지원 대상인지 건강보험료 기준으로 먼저 확인합니다.",
    href: "/tools/postnatal-care-income-eligibility/",
    type: "calculator",
    criteria: ["건보료", "가구원 수", "지원 대상"],
    badges: [{ label: "산후도우미", tone: "family" }, { label: "계산기", tone: "default" }],
    ctaLabel: "소득기준 계산",
    priority: 2.5,
  },
  {
    id: "pregnancy-checkup-report",
    title: "2026 임신 주수별 검사 비용 정리",
    description: "임신 검사 비용과 준비 시점을 리포트로 정리합니다.",
    href: "/reports/pregnancy-checkup-cost-2026/",
    type: "report",
    criteria: ["검사비", "임신", "2026"],
    badges: [{ label: "임신", tone: "family" }],
    ctaLabel: "비용 정리 보기",
    priority: 3,
  },
];

export const WELFARE_COMPARE_GUIDES: WelfareCompareGuide[] = [
  {
    title: "나이 기준 확인",
    description: "청년 지원금은 만 나이와 가입 시점 기준이 중요합니다. 생년월일과 신청일 기준을 함께 확인하세요.",
  },
  {
    title: "소득 기준 구분",
    description: "개인소득, 가구소득, 중위소득 기준이 각각 다를 수 있어 같은 지원금이라도 판정 방식이 달라집니다.",
  },
  {
    title: "거주지 기준 확인",
    description: "출산지원금과 일부 복지제도는 지자체별 차이가 큽니다. 주민등록지와 거주 기간 조건을 함께 봐야 합니다.",
  },
  {
    title: "중복 수급 확인",
    description: "비슷한 목적의 지원금은 중복 제한이나 선택 조건이 있을 수 있습니다. 신청 전 공식 공고를 확인하세요.",
  },
];

export const WELFARE_COMPARE_FLOW: WelfareCompareFlowStep[] = [
  {
    title: "내 상황 선택",
    description: "청년, 출산·육아, 복지급여, 주거 지원 중 지금 확인해야 하는 상황을 먼저 고릅니다.",
  },
  {
    title: "조건 확인",
    description: "나이, 소득, 가구원 수, 거주지, 건강보험료, 신청 기간처럼 지원금별 핵심 조건을 확인합니다.",
  },
  {
    title: "예상 금액 계산",
    description: "월 납입액, 정부기여금, 급여, 지원금 총액을 계산기로 먼저 추정합니다.",
  },
  {
    title: "공식 공고 확인",
    description: "신청 전 정부 공고, 지자체 안내, 금융기관 상품설명서, 개인별 심사 결과를 최종 기준으로 확인합니다.",
  },
];

export const WELFARE_COMPARE_SEO_INTRO = [
  "지원금 비교표는 청년, 출산·육아, 복지급여, 주거 지원처럼 조건이 다른 지원금 콘텐츠를 상황별로 묶은 허브입니다. 청년미래적금, 청년도약계좌, 복지급여, 출산지원금, 육아휴직 급여처럼 검색 의도가 다른 주제를 한 화면에서 빠르게 고를 수 있게 구성했습니다.",
  "청년 지원금은 나이·소득 기준이 핵심입니다. 청년도약계좌는 만 19~34세, 연 소득 7,500만 원 이하가 기본 조건이며 정부기여금 포함 5년 만기 시 최대 5,000만 원 형성이 가능합니다. 청년미래적금은 가입 조건과 납입 한도를 함께 확인해야 이중 혜택 여부를 알 수 있습니다.",
  "출산·육아 지원금은 출산지원금, 부모급여, 아동수당, 육아휴직 급여뿐 아니라 산후도우미 정부지원 여부까지 함께 봐야 합니다. 산후도우미 지원은 가구원 수와 건강보험료, 맞벌이 여부에 따라 소득기준 판정이 달라질 수 있으므로 비용 계산 전에 소득기준을 먼저 확인하는 흐름이 좋습니다.",
  "지원금은 나이, 소득, 가구원 수, 거주지, 건강보험료, 재산, 신청 기간, 중복 수급 조건에 따라 받을 수 있는지와 금액이 달라집니다. 특히 복지급여는 중위소득 기준과 소득인정액, 재산의 소득환산액이 함께 작동하므로 소득·재산 기준을 나눠 확인하는 것이 중요합니다.",
  "이 페이지의 비교표와 계산 결과는 공개 공고와 계산 모델을 바탕으로 정리한 참고용 콘텐츠입니다. 실제 신청 가능 여부와 지급액은 정부 공고, 지자체 안내, 금융기관 상품설명서, 개인별 심사 결과를 기준으로 확인해야 합니다.",
];

export const WELFARE_COMPARE_SEO_CRITERIA = [
  "청년 지원금은 청년미래적금, 청년도약계좌, 일반 적금의 만기, 납입액, 정부기여금, 비과세 여부를 함께 봅니다.",
  "출산·육아 지원금은 출산지원금, 부모급여, 아동수당, 육아휴직 급여, 산후도우미 소득기준, 산후도우미 비용을 같은 흐름에서 확인합니다.",
  "복지급여는 가구원 수, 소득, 재산, 중위소득 기준, 소득인정액, 재산의 월 소득환산액을 입력해 가능성을 간이 확인하되 실제 심사 결과가 우선입니다.",
  "주거·정책금융 지원은 지원금과 대출 조건이 함께 움직일 수 있어 별도 계산기와 리포트로 이어서 확인합니다.",
];

export const WELFARE_COMPARE_FAQ: WelfareCompareFaq[] = [
  {
    question: "지원금 비교표와 복지급여 계산기는 무엇이 다른가요?",
    answer: "지원금 비교표는 청년, 출산·육아, 복지급여, 주거 지원처럼 여러 제도와 계산기를 고르는 허브입니다. 복지급여 계산기는 사용자의 가구원 수, 소득, 재산을 입력해 급여별 가능성을 간이 확인하는 도구입니다.",
  },
  {
    question: "청년미래적금과 청년도약계좌는 같이 가입할 수 있나요?",
    answer: "중복 가입 가능 여부와 전환 조건은 운영 시점의 공식 공고에 따라 달라질 수 있습니다. 신청 전 정부 공고와 금융기관 상품설명서를 반드시 확인해야 합니다.",
  },
  {
    question: "지원금 계산 결과가 실제 수급 가능성을 의미하나요?",
    answer: "아닙니다. 계산 결과는 참고용 추정입니다. 실제 신청 가능 여부와 지급액은 정부 공고, 지자체 안내, 복지로, 주민센터, 금융기관 심사 결과가 우선입니다.",
  },
  {
    question: "출산지원금은 지역마다 다른가요?",
    answer: "네. 국가 공통 지원금 외에 지자체별 출산지원금은 지역, 거주 기간, 출생 순위, 예산 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지원금은 어떤 순서로 확인하면 좋나요?",
    answer: "먼저 내 상황을 청년, 출산·육아, 복지급여, 주거 지원 중 하나로 고르고, 나이·소득·거주지·신청 기간을 확인한 뒤 계산기로 예상 금액을 보고 마지막에 공식 공고를 확인하는 순서가 좋습니다.",
  },
];
