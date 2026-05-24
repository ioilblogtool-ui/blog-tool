import {
  averageCompensation,
  futurePiRatioByYear,
  psMultipliersByYear,
  rankPresets,
} from "./skHynixCompensation";

type ScenarioId = "conservative" | "base" | "aggressive";

interface ScenarioRow {
  id: ScenarioId;
  label: string;
  subtitle: string;
  operatingProfitLabel: string;
  psMultiplier: number;
  piRatio: number;
  summary: string;
  interpretation: string;
}

interface RankBonusRow {
  rankId: string;
  rankLabel: string;
  annualSalary: number;
  conservativeBonus: number;
  baseBonus: number;
  aggressiveBonus: number;
  baseMonthlyImpact: number;
  note: string;
}

const multipliers2027 = psMultipliersByYear["2027"];
const piRatio2027 = futurePiRatioByYear["2027"] ?? 1.5;

const calculateBonus = (annualSalary: number, multiplier: number) => {
  const baseSalary = annualSalary / 20;
  return Math.round(baseSalary * multiplier + baseSalary * piRatio2027);
};

const formatNumber = new Intl.NumberFormat("ko-KR");

export const SK_HYNIX_BONUS_2027_META = {
  slug: "sk-hynix-bonus-2027",
  title: "하이닉스 2027 성과급 전망",
  description:
    "SK하이닉스 PS·PI 구조를 기준으로 2027 성과급 전망을 영업이익별 시나리오와 직급별 예상 금액으로 정리했습니다.",
  dateModified: "2026-05-24",
};

export const SK_HYNIX_BONUS_2027_KPIS = [
  {
    label: "2027 PS 전망",
    value: "기준급 5,400~6,600%",
    description: "보수·기준·낙관 시나리오 범위",
  },
  {
    label: "PI 가정",
    value: "기준급 150%",
    description: "반기 성과급을 합산한 단순 전망",
  },
  {
    label: "평균 보수 앵커",
    value: `약 ${formatNumber.format(Math.round(averageCompensation / 10000))}만원`,
    description: "기존 하이닉스 계산기 기준 참고값",
  },
];

export const SK_HYNIX_BONUS_STRUCTURE = [
  {
    label: "PS",
    value: "연간 실적 성과급",
    description: "연간 영업이익과 성과 배분 구조에 따라 크게 달라지는 핵심 변수입니다.",
  },
  {
    label: "PI",
    value: "반기 성과급",
    description: "본 리포트에서는 2027년 합산 기준급 150%를 참고 가정으로 사용했습니다.",
  },
  {
    label: "기준급",
    value: "연봉÷20 가정",
    description: "개인별 실제 기준급은 다를 수 있어 계산기에서 직접 조정하는 것이 좋습니다.",
  },
];

export const SK_HYNIX_BONUS_2027_SCENARIOS: ScenarioRow[] = [
  {
    id: "conservative",
    label: "보수적",
    subtitle: "컨센서스 하회",
    operatingProfitLabel: "업황 둔화 또는 가격 조정",
    psMultiplier: multipliers2027.conservative,
    piRatio: piRatio2027,
    summary: "PS 기준급 5,400% + PI 150%",
    interpretation: "높은 성과급은 유지하지만 기대치를 낮춰 보는 방어적 가정입니다.",
  },
  {
    id: "base",
    label: "기준",
    subtitle: "강한 실적 지속",
    operatingProfitLabel: "AI 메모리 수요와 수익성 유지",
    psMultiplier: multipliers2027.base,
    piRatio: piRatio2027,
    summary: "PS 기준급 6,000% + PI 150%",
    interpretation: "현재 하이닉스 성과급 검색 수요에 가장 잘 맞는 중심 시나리오입니다.",
  },
  {
    id: "aggressive",
    label: "낙관",
    subtitle: "업황 추가 개선",
    operatingProfitLabel: "HBM·고부가 제품 기여 확대",
    psMultiplier: multipliers2027.aggressive,
    piRatio: piRatio2027,
    summary: "PS 기준급 6,600% + PI 150%",
    interpretation: "실적과 배분 기대가 동시에 높아지는 경우의 상단 참고값입니다.",
  },
];

export const SK_HYNIX_BONUS_2027_RANK_ROWS: RankBonusRow[] = rankPresets.map((rank) => {
  const conservativeBonus = calculateBonus(rank.defaultSalary, multipliers2027.conservative);
  const baseBonus = calculateBonus(rank.defaultSalary, multipliers2027.base);
  const aggressiveBonus = calculateBonus(rank.defaultSalary, multipliers2027.aggressive);

  return {
    rankId: rank.code,
    rankLabel: rank.label,
    annualSalary: rank.defaultSalary,
    conservativeBonus,
    baseBonus,
    aggressiveBonus,
    baseMonthlyImpact: Math.round(baseBonus / 12),
    note: `기준급 약 ${formatNumber.format(Math.round(rank.defaultSalary / 20 / 10000))}만원 가정`,
  };
});

export const SK_HYNIX_BONUS_2027_REASON_CARDS = [
  {
    title: "AI 메모리 수요",
    description: "HBM과 고부가 메모리 수요가 유지되면 PS 기대치가 높게 형성될 수 있습니다.",
  },
  {
    title: "영업이익 민감도",
    description: "성과급은 매출보다 이익률과 영업이익의 방향성에 더 크게 반응합니다.",
  },
  {
    title: "지급 기준 확정 전 변동",
    description: "전망치는 노사 협의, 회사 확정안, 개인 기준급에 따라 실제 지급액과 달라집니다.",
  },
];

export const SK_HYNIX_BONUS_2027_TAX_NOTES = [
  "성과급은 근로소득으로 합산되어 원천징수와 연말정산 영향을 받습니다.",
  "고액 성과급은 세전 headline보다 세후 체감액이 크게 줄어들 수 있습니다.",
  "주거비, 대출 상환, 투자 계획은 세후 실수령액 기준으로 다시 계산하는 것이 안전합니다.",
];

export const SK_HYNIX_BONUS_2027_INVESTMENT_NOTES = [
  "성과급 전액을 한 번에 투자하기보다 6~12개월로 나눠 넣는 DCA 전략을 비교해볼 수 있습니다.",
  "비상금과 세금 정산 여지를 먼저 남긴 뒤 장기 투자 금액을 정하면 이탈 가능성이 줄어듭니다.",
  "반도체 업황과 회사 성과급은 같은 사이클에 묶일 수 있어 투자 자산은 분산해서 보는 편이 좋습니다.",
];

export const SK_HYNIX_BONUS_2027_FAQ = [
  {
    question: "하이닉스 2027 성과급 전망은 확정 금액인가요?",
    answer:
      "아닙니다. 이 페이지의 금액은 PS·PI 구조를 단순화한 전망 시나리오입니다. 실제 지급액은 회사 확정안, 개인 기준급, 직급, 재직 조건에 따라 달라질 수 있습니다.",
  },
  {
    question: "PS 기준급 6,000%는 무슨 뜻인가요?",
    answer:
      "기준급을 1로 봤을 때 PS가 60배라는 뜻입니다. 이 리포트에서는 이해를 돕기 위해 기준급을 연봉의 20분의 1로 단순 가정했습니다.",
  },
  {
    question: "PI까지 포함한 금액인가요?",
    answer:
      "직급별 예상 표는 PS와 PI를 함께 더한 금액입니다. PI는 2027년 합산 기준급 150%를 참고 가정으로 넣었습니다.",
  },
  {
    question: "세후 금액은 어떻게 확인하나요?",
    answer:
      "성과급은 근로소득으로 과세되므로 세후 체감액은 개인별 연봉과 공제 조건에 따라 다릅니다. 성과급 세후 계산기에서 연봉과 성과급을 넣어 다시 확인하는 것이 좋습니다.",
  },
  {
    question: "내 연봉 기준으로 다시 계산할 수 있나요?",
    answer:
      "가능합니다. SK하이닉스 성과급 계산기에서 연봉, 기준급, PS·PI 시나리오를 직접 조정하면 개인 조건에 더 가까운 금액을 볼 수 있습니다.",
  },
];

export const SK_HYNIX_BONUS_2027_RELATED = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/bonus-after-tax-calculator/?company=sk-hynix", label: "성과급 세후 실수령 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교" },
  { href: "/reports/semiconductor-etf-2026/", label: "반도체 ETF 비교 리포트" },
];

export const SK_HYNIX_BONUS_2027_SEO_INTRO = [
  "하이닉스 성과급은 PS와 PI 구조를 함께 봐야 실제 체감 규모를 이해할 수 있습니다.",
  "특히 2027년 전망은 AI 메모리 수요, 영업이익 흐름, 회사 확정 기준에 따라 크게 달라질 수 있어 단일 금액보다 시나리오 범위로 보는 편이 현실적입니다.",
  "이 페이지는 검색에서 바로 들어온 사용자가 2026 지급 구조를 빠르게 이해하고, 2027년 PS 전망을 직급별 금액으로 확인한 뒤 계산기에서 본인 조건으로 이어가도록 구성했습니다.",
];

export const SK_HYNIX_BONUS_2027_CRITERIA = [
  "본 리포트의 금액은 공식 확정 지급액이 아니라 추정 시나리오입니다.",
  "기준급은 설명 편의를 위해 연봉의 20분의 1로 단순 가정했습니다.",
  "직급별 표는 PS와 PI를 합산한 세전 예상 성과급입니다.",
  "세후 실수령액은 연봉, 공제, 4대보험, 연말정산 조건에 따라 달라집니다.",
];

export const formatWon = (value: number) => `${formatNumber.format(Math.round(value / 10000))}만원`;
