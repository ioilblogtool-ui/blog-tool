export type BonusRankingIndustry =
  | "semiconductor"
  | "game"
  | "platform"
  | "finance"
  | "telecom"
  | "oilRefinery"
  | "steel"
  | "energy"
  | "defense"
  | "airline";

export type DataConfidence = "confirmed" | "estimated";

export interface BonusRankingEntry {
  id: string;
  name: string;
  industry: BonusRankingIndustry;
  salaryPercent: number;
  confidence: DataConfidence;
  basis: string;
  calculatorHref: string;
  note: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HubCard {
  href: string;
  label: string;
  description: string;
  category: "단독 계산기" | "업종 비교 계산기";
}

export const CBR_BASE_SALARY = 60_000_000;
export const CBR_TAX_RATE = 0.22;

export const BONUS_RANKING_INDUSTRY_LABELS: Record<BonusRankingIndustry, string> = {
  semiconductor: "반도체",
  game: "게임",
  platform: "IT 플랫폼",
  finance: "금융·증권",
  telecom: "통신",
  oilRefinery: "정유",
  steel: "철강",
  energy: "발전·중공업",
  defense: "방산",
  airline: "항공",
};

export const BONUS_RANKING_INDUSTRY_COLORS: Record<BonusRankingIndustry, string> = {
  semiconductor: "#1a56db",
  game: "#7c3aed",
  platform: "#0891b2",
  finance: "#059669",
  telecom: "#d97706",
  oilRefinery: "#dc2626",
  steel: "#64748b",
  energy: "#0369a1",
  defense: "#92400e",
  airline: "#be185d",
};

// 노사협의 확정·공개 보도 기반 실제 성과급률
// salaryPercent: 연봉 대비 성과급 비율(%)
export const BONUS_RANKING_ENTRIES: BonusRankingEntry[] = [
  {
    id: "skHynix",
    name: "SK하이닉스",
    industry: "semiconductor",
    salaryPercent: 150,
    confidence: "confirmed",
    basis: "2025.9 노사합의: 영업이익 10% 배분·상한선 폐지. 연봉 1억 기준 약 1억 4,820만원 지급 보도.",
    calculatorHref: "/tools/semiconductor-bonus-comparison/",
    note: "실제 지급액은 더 높을 수 있음 (상한선 없음). 차트 표시는 150% cap",
  },
  {
    id: "samsungMX",
    name: "삼성전자 MX",
    industry: "semiconductor",
    salaryPercent: 50,
    confidence: "confirmed",
    basis: "2025년 OPI MX(모바일경험) 50% 확정, 2026.1.30 지급.",
    calculatorHref: "/tools/semiconductor-bonus-comparison/",
    note: "모바일·갤럭시 사업부 해당. DS·VD 부문과 다름",
  },
  {
    id: "samsungDS",
    name: "삼성전자 DS",
    industry: "semiconductor",
    salaryPercent: 47,
    confidence: "confirmed",
    basis: "2025년 OPI DS(반도체) 47% 확정. 2024년 14%에서 3배↑ (HBM·범용D램 회복).",
    calculatorHref: "/tools/semiconductor-bonus-comparison/",
    note: "파운드리·메모리 포함 DS부문. MX와 별도 지급",
  },
  {
    id: "krafton",
    name: "크래프톤",
    industry: "game",
    salaryPercent: 35,
    confidence: "estimated",
    basis: "2025년 영업이익 1조 544억(역대 최고). 배그 글로벌 호조 지속.",
    calculatorHref: "/tools/game-industry-bonus-comparison/",
    note: "역대 최고 실적 기준 추정. 실제 PS 확정치는 미공개",
  },
  {
    id: "nexon",
    name: "넥슨",
    industry: "game",
    salaryPercent: 28,
    confidence: "estimated",
    basis: "2025년 영업이익 1조 1,765억(역대 최고). 마비노기모바일·메이플스토리 흥행.",
    calculatorHref: "/tools/game-industry-bonus-comparison/",
    note: "일본 상장 본사 포함 실적 기준 추정",
  },
  {
    id: "koreainv",
    name: "한국투자증권",
    industry: "finance",
    salaryPercent: 25,
    confidence: "estimated",
    basis: "증권업 IB 실적 상위권. 업계 최고 수준 인센티브 구조.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "성과 인센티브 비중 높은 증권사 구조",
  },
  {
    id: "mirae",
    name: "미래에셋증권",
    industry: "finance",
    salaryPercent: 22,
    confidence: "estimated",
    basis: "해외투자·ETF 수익 호조, 해외법인 실적 포함.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "글로벌 운용 실적 반영 추정",
  },
  {
    id: "samsung_sec",
    name: "삼성증권",
    industry: "finance",
    salaryPercent: 20,
    confidence: "estimated",
    basis: "브로커리지·자산관리 호조, 삼성그룹 계열 안정성.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "삼성그룹 계열 증권사 추정",
  },
  {
    id: "doosanEnerbility",
    name: "두산에너빌리티",
    industry: "energy",
    salaryPercent: 18,
    confidence: "estimated",
    basis: "SMR·원전 수주 증가, 체코 원전 수출 기대감.",
    calculatorHref: "/tools/doosan-enerbility-bonus-calculator/",
    note: "수주 증가 모멘텀 반영 추정",
  },
  {
    id: "skt",
    name: "SK텔레콤",
    industry: "telecom",
    salaryPercent: 17,
    confidence: "estimated",
    basis: "AI 인프라·데이터센터 수혜, 통신3사 중 최상위 실적.",
    calculatorHref: "/tools/telecom-bonus-comparison/",
    note: "통신3사 중 가장 높은 성과급 수준 추정",
  },
  {
    id: "kb",
    name: "KB국민은행",
    industry: "finance",
    salaryPercent: 16,
    confidence: "estimated",
    basis: "이자이익 개선, 리딩뱅크 그룹 실적.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "은행업 특성상 이익연동 성과급 구조",
  },
  {
    id: "shinhan",
    name: "신한은행",
    industry: "finance",
    salaryPercent: 15,
    confidence: "estimated",
    basis: "그룹 통합 실적 안정적.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "은행권 평균 상단 수준 추정",
  },
  {
    id: "naver",
    name: "네이버",
    industry: "platform",
    salaryPercent: 15,
    confidence: "estimated",
    basis: "커머스·클라우드 성장, 라인야후 수익 회복.",
    calculatorHref: "/tools/it-bigtech-bonus-comparison/",
    note: "현금 성과급 외 RSU 포함 시 실질 보상 더 높음",
  },
  {
    id: "skInnovation",
    name: "SK이노베이션",
    industry: "oilRefinery",
    salaryPercent: 15,
    confidence: "estimated",
    basis: "SK온 흑자 전환 기대 + 정유 마진 회복.",
    calculatorHref: "/tools/oil-refinery-bonus-comparison/",
    note: "배터리·정유 부문 통합 기준 추정",
  },
  {
    id: "netmarble",
    name: "넷마블",
    industry: "game",
    salaryPercent: 15,
    confidence: "estimated",
    basis: "2025년 상장 이래 역대 최대 매출, 흑자전환 성공.",
    calculatorHref: "/tools/game-industry-bonus-comparison/",
    note: "2024년 최소 지급에서 2025년 실적 반등",
  },
  {
    id: "hanwhaAerospace",
    name: "한화에어로스페이스",
    industry: "defense",
    salaryPercent: 13,
    confidence: "confirmed",
    basis: "2025.9 노사합의: 최대 1,250만원 (영업이익 달성 시 500만 + 생산목표 달성 시 750만). 연봉 1억 기준 약 12~13%.",
    calculatorHref: "/tools/hanwha-bonus-calculator/",
    note: "금액 상한 고정 방식. 고연봉일수록 비율은 낮아짐",
  },
  {
    id: "hana",
    name: "하나은행",
    industry: "finance",
    salaryPercent: 13,
    confidence: "estimated",
    basis: "은행권 평균 수준.",
    calculatorHref: "/tools/finance-bonus-comparison/",
    note: "하나금융그룹 통합 실적 연동",
  },
  {
    id: "kt",
    name: "KT",
    industry: "telecom",
    salaryPercent: 12,
    confidence: "estimated",
    basis: "구조조정 이후 안정화, 보수적 지급 기조.",
    calculatorHref: "/tools/telecom-bonus-comparison/",
    note: "통신3사 중 중간 수준 추정",
  },
  {
    id: "gsCaltex",
    name: "GS칼텍스",
    industry: "oilRefinery",
    salaryPercent: 12,
    confidence: "estimated",
    basis: "정유 마진 등락, 연간 평균.",
    calculatorHref: "/tools/oil-refinery-bonus-comparison/",
    note: "정유업 업황 변동성 반영",
  },
  {
    id: "posco",
    name: "포스코",
    industry: "steel",
    salaryPercent: 10,
    confidence: "estimated",
    basis: "철강 업황 부진 지속, 중국 공급과잉.",
    calculatorHref: "/tools/posco-bonus-calculator/",
    note: "PI·PS 구조이나 업황 부진으로 규모 축소",
  },
  {
    id: "lguplus",
    name: "LG유플러스",
    industry: "telecom",
    salaryPercent: 10,
    confidence: "estimated",
    basis: "통신3사 중 점유율·실적 열위.",
    calculatorHref: "/tools/telecom-bonus-comparison/",
    note: "통신3사 중 하단 수준 추정",
  },
  {
    id: "koreanair",
    name: "대한항공",
    industry: "airline",
    salaryPercent: 10,
    confidence: "estimated",
    basis: "코로나 이후 회복세, 아시아나 합병 비용 부담으로 상승 제한.",
    calculatorHref: "/tools/airline-bonus-comparison/",
    note: "아시아나 인수 비용으로 이익 배분 제한적",
  },
  {
    id: "kakao",
    name: "카카오",
    industry: "platform",
    salaryPercent: 7,
    confidence: "estimated",
    basis: "2024~2025 실적 부진 + 준법경영 이슈, 구조조정 진행.",
    calculatorHref: "/tools/it-bigtech-bonus-comparison/",
    note: "카카오뱅크 등 계열사 제외 본사 기준",
  },
  {
    id: "asianaair",
    name: "아시아나항공",
    industry: "airline",
    salaryPercent: 5,
    confidence: "estimated",
    basis: "대한항공 합병 완료 후 경영 불안정.",
    calculatorHref: "/tools/airline-bonus-comparison/",
    note: "합병 이후 브랜드 통합 과도기",
  },
  {
    id: "ncsoft",
    name: "엔씨소프트",
    industry: "game",
    salaryPercent: 4,
    confidence: "estimated",
    basis: "리니지 의존도 + 신작 부진, 대규모 인력 감축 진행.",
    calculatorHref: "/tools/game-industry-bonus-comparison/",
    note: "구조조정 중, 성과급 사실상 최소 수준",
  },
];

// 정렬된 전체 목록
export const BONUS_RANKING_SORTED = [...BONUS_RANKING_ENTRIES].sort(
  (a, b) => b.salaryPercent - a.salaryPercent
);

// TOP 10
export const BONUS_RANKING_TOP10 = BONUS_RANKING_SORTED.slice(0, 10);

export function formatCbrWon(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return eok % 1 === 0 ? `${eok}억원` : `${eok.toFixed(1)}억원`;
  }
  if (amount >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export const CBR_KPI = {
  topCompany: "SK하이닉스",
  topPercent: 150,
  companiesCount: BONUS_RANKING_ENTRIES.length,
  avgPercent: Math.round(
    BONUS_RANKING_ENTRIES.reduce((s, e) => s + e.salaryPercent, 0) / BONUS_RANKING_ENTRIES.length
  ),
};

export const BONUS_HUB_CARDS: HubCard[] = [
  // 단독 계산기
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기", description: "OPI·TAI 구조, DS·MX 부문별 시뮬레이션", category: "단독 계산기" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", description: "PS·PI 구조, 영업이익 연동 시뮬레이션", category: "단독 계산기" },
  { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기", description: "월급 배수 방식, 현대·기아·모비스 비교", category: "단독 계산기" },
  { href: "/tools/lg-bonus/", label: "LG 성과급 계산기", description: "LG전자·LG화학·LG에너지솔루션", category: "단독 계산기" },
  { href: "/tools/posco-bonus-calculator/", label: "포스코 성과급 계산기", description: "PI·PS 구조, 철강 업황 연동 추정", category: "단독 계산기" },
  { href: "/tools/hanwha-bonus-calculator/", label: "한화 성과급 계산기", description: "한화에어로스페이스·한화오션 비교", category: "단독 계산기" },
  { href: "/tools/doosan-enerbility-bonus-calculator/", label: "두산에너빌리티 성과급 계산기", description: "원전·SMR 수주 기반 추정", category: "단독 계산기" },
  // 비교 계산기
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스·LG디스플레이 등 8사", category: "업종 비교 계산기" },
  { href: "/tools/auto-bonus-comparison/", label: "자동차 성과급 비교", description: "현대차·기아·현대모비스 등", category: "업종 비교 계산기" },
  { href: "/tools/shipbuilding-bonus-comparison/", label: "조선 성과급 비교", description: "HD현대중공업·한화오션·삼성중공업", category: "업종 비교 계산기" },
  { href: "/tools/finance-bonus-comparison/", label: "금융·증권 성과급 비교", description: "KB·신한·하나·우리·NH·미래에셋·삼성증권 등", category: "업종 비교 계산기" },
  { href: "/tools/oil-refinery-bonus-comparison/", label: "정유 성과급 비교", description: "SK이노베이션·GS칼텍스·S-OIL·HD현대오일뱅크", category: "업종 비교 계산기" },
  { href: "/tools/telecom-bonus-comparison/", label: "통신 성과급 비교", description: "KT·SK텔레콤·LG유플러스", category: "업종 비교 계산기" },
  { href: "/tools/airline-bonus-comparison/", label: "항공사 성과급 비교", description: "대한항공·아시아나·제주항공·티웨이·진에어", category: "업종 비교 계산기" },
  { href: "/tools/game-industry-bonus-comparison/", label: "게임업계 성과급 비교", description: "넥슨·넷마블·엔씨소프트·크래프톤", category: "업종 비교 계산기" },
  { href: "/tools/it-bigtech-bonus-comparison/", label: "IT 빅테크 성과급 비교", description: "카카오·네이버·토스·라인·쿠팡", category: "업종 비교 계산기" },
];

export const BONUS_RANKING_FAQ: FaqItem[] = [
  {
    question: "이 순위는 실제 성과급 순위인가요?",
    answer: "아닙니다. 노사협의 확정·공개 보도 기반 성과급률(%)을 정리한 참고용 순위입니다. '확정' 항목은 노사합의문·언론 복수 보도로 확인한 값이고, '추정' 항목은 실적 기반 업계 추정치입니다. 실제 개인 지급액은 소속 부문, 직급, 평가등급, 지급 기준 연도에 따라 크게 달라집니다.",
  },
  {
    question: "SK하이닉스가 왜 압도적 1위인가요?",
    answer: "2025년 9월 노사가 '영업이익의 10% 성과급 재원으로 배분·상한선 폐지'에 합의했습니다. HBM3E 독주로 역대 최고 실적을 기록하면서 연봉 1억원 직원 기준 약 1억 4,820만원, 평균 6억 3,000만원 지급이 전망된다고 보도되었습니다. 다른 기업과 구조 자체가 다릅니다.",
  },
  {
    question: "삼성전자가 MX와 DS로 나뉘어 있는 이유는?",
    answer: "삼성전자는 OPI(초과이익성과급)를 사업부별로 별도 지급합니다. 2025년 MX(모바일) 50%, DS(반도체) 47%로 확정되었고 두 부문의 격차가 큰 편입니다. VD/DA(가전) 부문은 12%로 별도입니다. 삼성전자 직원이라도 어느 사업부 소속이냐에 따라 받는 금액이 완전히 다릅니다.",
  },
  {
    question: "자동차·조선 회사는 왜 순위에 없나요?",
    answer: "현대자동차, 기아, HD현대중공업 등은 성과급을 연봉 대비 비율(%)이 아닌 월급 배수(예: 4~6개월치) 방식으로 지급합니다. 이 방식은 연봉 % 비교 시 왜곡이 발생해 같은 기준으로 비교하기 어렵습니다. 각 업종별 비교 계산기에서 월급 배수 방식으로 확인하세요.",
  },
  {
    question: "게임업계가 상위권인 이유는?",
    answer: "크래프톤·넥슨은 2025년 영업이익 1조원 이상을 기록하며 역대 최고 실적을 달성했습니다. 게임사는 실적 연동 PS(이익배분) 구조가 일반적이어서 흑자 규모가 클수록 성과급 비율도 높아집니다. 반면 넷마블·엔씨소프트는 실적 격차가 크게 벌어지면서 업계 내 양극화가 심화되고 있습니다.",
  },
  {
    question: "연봉 6,000만원 기준으로 계산한 이유는?",
    answer: "대졸 신입 3~5년차 대기업 직원의 평균 연봉에 해당하는 6,000만원을 기준점으로 삼았습니다. 실제 개인 연봉에 따라 추정 금액이 달라지므로, 각 회사별 상세 계산기에서 나의 실제 연봉을 입력해보세요.",
  },
  {
    question: "세후 금액은 어떻게 계산하나요?",
    answer: "22% 단순 세율(소득세+지방소득세 근사값)을 적용합니다. 실제 세금은 과세표준, 부양가족, 연간 총소득, 성과급 지급 시점에 따라 달라집니다. 성과급이 클수록 세율 구간이 높아져 세후 실수령 비율이 낮아지므로 참고용으로만 활용하세요.",
  },
];

export const CBR_META = {
  slug: "corporate-bonus-ranking-top10-2026",
  title: "2026 대기업 성과급 순위 TOP 10",
  seoTitle: "2026 대기업 성과급 순위 TOP 10 | 성과급 많이 주는 회사 비교",
  description: "SK하이닉스·삼성전자·크래프톤 등 25개사 성과급률을 노사협의 확정·실적 기반으로 비교한 순위입니다. 성과급 많이 주는 회사는 어디일까요?",
  updatedAt: "2026-06-16",
};
