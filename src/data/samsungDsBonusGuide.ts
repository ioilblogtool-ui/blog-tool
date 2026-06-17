export type HeroKpi = {
  label: string;
  value: string;
  description: string;
};

export type ComparisonRow = {
  label: string;
  tai: string;
  opi: string;
};

export type DivisionGuideRow = {
  division: string;
  area: string;
  interpretation: string;
  calculatorPreset: string;
  featured?: boolean;
};

export type SalaryPercentageRow = {
  salary: number;
  opi10: number;
  opi30: number;
  opi50: number;
  interpretation: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

const numberFormatter = new Intl.NumberFormat("ko-KR");

export const SAMSUNG_DS_BONUS_GUIDE_META = {
  slug: "samsung-ds-bonus-calculation-guide",
  title: "삼성전자 DS 성과급 얼마? TAI·OPI 계산법 완전 정리 2026",
  description:
    "DS부문 연봉 5000만원이면 TAI·OPI 합산 실수령은 얼마일까. 사업부별 지급률·세후 금액 계산법, DX·MX 비교까지 한번에 정리했습니다.",
  h1: "삼성전자 DS 성과급 TAI·OPI 계산 기준",
  eyebrow: "삼성전자 성과급 기준",
  dateModified: "2026-05-24",
};

export const HERO_KPIS: HeroKpi[] = [
  {
    label: "핵심 구분",
    value: "TAI / OPI",
    description: "반기 성과급과 연간 성과급을 분리해서 해석",
  },
  {
    label: "사업부 변수",
    value: "DS·DX·MX",
    description: "같은 회사라도 지급률과 체감액 차이",
  },
  {
    label: "다음 행동",
    value: "계산기로 확인",
    description: "내 연봉과 사업부 기준으로 재계산",
  },
];

export const TAI_OPI_ROWS: ComparisonRow[] = [
  { label: "성격", tai: "반기 단위 목표달성장려금", opi: "연간 초과이익성과급" },
  { label: "지급 주기", tai: "통상 상·하반기", opi: "통상 연 1회" },
  { label: "기준", tai: "사업부·조직 목표 달성도", opi: "사업부 연간 실적과 이익" },
  { label: "체감 포인트", tai: "짧은 주기로 변동", opi: "한 해 총보상에 큰 영향" },
  { label: "계산기 반영", tai: "직접 입력 또는 프리셋", opi: "사업부별 OPI 비율 선택" },
];

export const DIVISION_ROWS: DivisionGuideRow[] = [
  {
    division: "DS",
    area: "반도체·메모리·파운드리",
    interpretation: "반도체 업황과 영업이익 변동성이 커 성과급 체감 차이가 크게 나타날 수 있습니다.",
    calculatorPreset: "DS 프리셋",
    featured: true,
  },
  {
    division: "DX",
    area: "TV·가전·생활가전",
    interpretation: "제품군별 수익성과 조직별 목표 달성도를 함께 확인해야 합니다.",
    calculatorPreset: "DX 프리셋",
  },
  {
    division: "MX",
    area: "모바일·스마트폰",
    interpretation: "판매량, 마진, 플래그십 제품 성과가 성과급 기대치에 영향을 줍니다.",
    calculatorPreset: "MX 프리셋",
  },
  {
    division: "지원/공통",
    area: "지원 조직",
    interpretation: "공통 기준 또는 별도 기준이 적용될 수 있어 직접 입력으로 보는 편이 안전합니다.",
    calculatorPreset: "직접 입력",
  },
];

export const SALARY_PERCENTAGE_ROWS: SalaryPercentageRow[] = [
  {
    salary: 60000000,
    opi10: 6000000,
    opi30: 18000000,
    opi50: 30000000,
    interpretation: "초·중년차 체감 구간",
  },
  {
    salary: 80000000,
    opi10: 8000000,
    opi30: 24000000,
    opi50: 40000000,
    interpretation: "DS·MX 주요 검색 수요 구간",
  },
  {
    salary: 100000000,
    opi10: 10000000,
    opi30: 30000000,
    opi50: 50000000,
    interpretation: "총보상 비교가 필요한 구간",
  },
  {
    salary: 120000000,
    opi10: 12000000,
    opi30: 36000000,
    opi50: 60000000,
    interpretation: "세후 계산 필수 구간",
  },
];

export const AGREEMENT_FAQ: GuideFaq[] = [
  {
    question: "삼성전자 협의안은 성과급에 바로 반영되나요?",
    answer:
      "협의안, 잠정합의안, 최종 타결은 단계가 다릅니다. 실제 반영 시점과 대상은 회사 공지 기준을 확인해야 합니다.",
  },
  {
    question: "DS 특별성과급은 OPI와 같은 건가요?",
    answer:
      "OPI와 별도 항목으로 보도되거나 설명될 수 있습니다. 계산기에서는 OPI, 특별성과급, 복지성 항목을 분리해서 보는 것이 안전합니다.",
  },
  {
    question: "복지 변화는 연봉에 포함해서 봐도 되나요?",
    answer:
      "현금성 지급, 자사주, 포인트, 복지혜택은 체감 가치가 다릅니다. 총보상에는 참고로 넣되 현금 성과급과 구분해야 합니다.",
  },
  {
    question: "DS와 DX가 같은 협의안을 적용받나요?",
    answer:
      "공통 적용 항목과 사업부별 별도 항목이 나뉠 수 있습니다. 최종 공지와 적용 대상을 확인해야 합니다.",
  },
  {
    question: "삼성 성과급 계산기에서는 협의안을 어떻게 반영하나요?",
    answer:
      "계산기는 잠정합의안, 특별성과급, 사업부별 OPI 시나리오를 분리해 입력하도록 구성합니다.",
  },
];

export const SEO_INTRO = [
  "삼성전자 성과급은 단일 금액으로 보기보다 TAI, OPI, 특별성과급, 복지성 항목을 나눠 봐야 합니다.",
  "특히 DS, DX, MX는 같은 삼성전자 안에서도 사업부 실적과 지급 기준이 달라 연봉이 같아도 총보상 체감액이 달라질 수 있습니다.",
  "이 페이지는 검색에서 바로 들어온 사용자가 계산 기준을 이해하고, 삼성 성과급 계산기에서 본인 조건으로 이어가도록 구성했습니다.",
];

export const SEO_CRITERIA = [
  "공식 확정 지급액이 아닌 수치는 추정·시뮬레이션·보도 기준으로 표시합니다.",
  "TAI, OPI, 특별성과급, 복지성 항목은 서로 다른 성격의 보상입니다.",
  "연봉 대비 % 표는 이해를 돕기 위한 단순 예시이며 실제 기준급 산식과 다를 수 있습니다.",
  "세후 실수령액은 연봉, 공제, 4대보험, 연말정산 조건에 따라 달라집니다.",
];

export const RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/samsung-bonus/",
    label: "삼성전자 성과급 계산기",
    description: "사업부와 연봉 기준으로 예상 성과급 계산",
  },
  {
    href: "/tools/bonus-after-tax-calculator/?company=samsung",
    label: "성과급 세후 실수령액 계산기",
    description: "세전 성과급의 실제 체감액 확인",
  },
  {
    href: "/tools/bonus-simulator/",
    label: "대기업 성과급 시뮬레이터",
    description: "여러 회사 성과급 구조 비교",
  },
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "2026 대기업 성과급 비교",
    description: "삼성전자·SK하이닉스·현대차 비교",
  },
  {
    href: "/tools/sk-hynix-bonus/",
    label: "SK하이닉스 성과급 계산기",
    description: "반도체 성과급 구조 비교",
  },
];

export const formatWon = (value: number) => `${numberFormatter.format(Math.round(value / 10000))}만원`;
