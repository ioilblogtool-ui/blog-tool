import {
  averageCompensation,
  divisions,
  operatingProfitScenarios,
  rankPresets,
  unionDemandScenarios,
} from "./samsungCompensation";

export const SAMSUNG_BONUS_RANK_NET_META = {
  slug: "samsung-bonus-rank-net-comparison-2026",
  title: "삼성전자 성과급 직급별 실수령액 비교 2026",
  h1: "삼성전자 성과급 직급별 실수령액 비교",
  eyebrow: "Samsung Bonus Net Pay",
  description:
    "삼성전자 2026 노사 잠정합의안의 DS 특별경영성과급, 자사주 지급안을 반영해 직급별 성과급 세전·세후 실수령액을 비교합니다.",
  dateModified: "2026-06-11",
};

const NET_RATE = 0.72;
const TAI_MONTHS = 1;
const ELIGIBLE_EMPLOYEES = 120_000;
const agreementScenario = unionDemandScenarios[0];
const operatingProfit = operatingProfitScenarios[0].operatingProfit;
const agreementPool = operatingProfit * agreementScenario.payoutRatio;
const agreementPerHead = agreementPool / ELIGIBLE_EMPLOYEES;

const formatWon = (value: number) => {
  if (value >= 100000000) {
    const eok = value / 100000000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }

  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
};

const getDivision = (code: string) => divisions.find((division) => division.code === code);

const featuredDivisions = [
  { code: "DS", label: "DS 반도체", note: "2026 참고 OPI 47% 가정" },
  { code: "MX", label: "MX", note: "2026 참고 OPI 50% 가정" },
  { code: "SUPPORT", label: "공통/지원조직", note: "2026 참고 OPI 36% 가정" },
];

const calculateBonus = (salary: number, divisionCode: string) => {
  const division = getDivision(divisionCode);
  const opi = salary * (division?.actual2026Rate ?? 0);
  const tai = (salary / 12) * TAI_MONTHS;
  const gross = opi + tai;
  const net = gross * NET_RATE;

  return { opi, tai, gross, net };
};

const calculateAgreement = (salary: number) => {
  const salaryWeight = averageCompensation > 0 ? salary / averageCompensation : 1;
  const gross = agreementPerHead * salaryWeight;
  const net = gross * NET_RATE;

  return { salaryWeight, gross, net };
};

export const rankRows = rankPresets.map((rank) => {
  const ds = calculateBonus(rank.defaultSalary, "DS");
  const mx = calculateBonus(rank.defaultSalary, "MX");
  const support = calculateBonus(rank.defaultSalary, "SUPPORT");
  const agreement = calculateAgreement(rank.defaultSalary);

  return {
    rank: rank.label,
    salary: rank.defaultSalary,
    salaryText: formatWon(rank.defaultSalary),
    dsGrossText: formatWon(ds.gross),
    dsNetText: formatWon(ds.net),
    mxNetText: formatWon(mx.net),
    supportNetText: formatWon(support.net),
    agreementGrossText: formatWon(agreement.gross),
    agreementNetText: formatWon(agreement.net),
    agreementWeightText: `${Math.round(agreement.salaryWeight * 100)}%`,
    monthlyNetText: formatWon(ds.net / 12),
  };
});

export const scenarioCards = featuredDivisions.map((division) => {
  const managerSalary = rankPresets.find((rank) => rank.code === "MANAGER")?.defaultSalary ?? 110000000;
  const result = calculateBonus(managerSalary, division.code);

  return {
    label: division.label,
    note: division.note,
    opiText: formatWon(result.opi),
    taiText: formatWon(result.tai),
    grossText: formatWon(result.gross),
    netText: formatWon(result.net),
  };
});

export const agreementCards = [
  {
    label: "총 재원 구조",
    value: "최대 12%",
    desc: "기존 OPI 1.5%와 DS 특별경영성과급 10.5%를 합친 잠정합의안 기준입니다. 연봉의 12%가 아니라 성과 재원 환산값으로 봐야 합니다.",
  },
  {
    label: "DS 특별경영성과급",
    value: "10.5%",
    desc: "DS부문 초과 성과를 별도 재원으로 보는 구조입니다. 실제 지급은 최종 합의와 세부 산식에 따릅니다.",
  },
  {
    label: "환산 기준",
    value: formatWon(agreementPerHead),
    desc: `영업이익 가정 × 12%를 ${ELIGIBLE_EMPLOYEES.toLocaleString("ko-KR")}명으로 단순 나눈 1인 기준선입니다.`,
  },
  {
    label: "지급 형태",
    value: "자사주",
    desc: "세후 전액 자사주 지급안이며, 일부 물량은 보호예수 조건이 붙을 수 있습니다.",
  },
];

export const heroKpis = [
  { label: "노사 협의안", value: formatWon(agreementPerHead), desc: "영업이익 × 12% ÷ 12만명 단순 환산 기준" },
  { label: "비교 직급", value: "5개", desc: "사원·대리·과장·차장·부장 추천 연봉 기준" },
  { label: "세후 가정", value: "72%", desc: "근로소득세·4대보험 추가 부담을 단순 반영한 참고값" },
];

export const sourceLinks = [
  {
    title: "삼성전자 DART 공시",
    desc: "사업보고서와 직원 보수 현황을 확인할 때 참고하는 공식 공시",
    url: "https://dart.fss.or.kr/dsab002/main.do?autoSearch=true&textCrpNm=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90",
  },
  {
    title: "삼성전자 IR",
    desc: "사업부 실적과 재무자료를 확인할 수 있는 공식 투자자 관계 페이지",
    url: "https://www.samsung.com/sec/ir/",
  },
  {
    title: "국세청 근로소득 원천징수 안내",
    desc: "성과급이 근로소득으로 과세되는 구조를 확인할 때 참고",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2227&cntntsId=7708",
  },
  {
    title: "삼성전자 성과급 잠정합의안 보도",
    desc: "2026년 노사 잠정합의안의 DS 특별경영성과급, 자사주 지급, 찬반투표 맥락을 확인할 때 참고",
    url: "https://www.yna.co.kr/view/AKR20260520151200003",
  },
];

export const seoIntro = [
  "삼성전자 성과급은 같은 회사 안에서도 사업부, 기준급, 평가, 지급 시점에 따라 체감 금액이 크게 달라집니다. 특히 2026년에는 노사 잠정합의안에 DS 특별경영성과급과 자사주 지급 구조가 포함되어, 기존 OPI·TAI만 보는 것보다 협의안 구조를 함께 봐야 합니다.",
  "이 리포트는 삼성전자 성과급 계산기에서 쓰는 추천 연봉 프리셋을 바탕으로 사원·대리·과장·차장·부장별 세전 성과급과 세후 실수령액을 비교합니다. 노사 협의안 금액은 최종 확정 지급액이 아니라 영업이익 재원, 환산 직원 수, 평균 보수 대비 연봉 가중치를 적용한 시뮬레이션입니다.",
];

export const seoCriteria = [
  "직급별 연봉은 비교계산소 운영용 추천값이며, 삼성전자 공식 직급별 연봉표가 아닙니다.",
  "기존 성과급 비교는 OPI와 TAI를 분리해 계산했습니다. OPI는 사업부별 참고 지급률, TAI는 연 1개월분 기준급으로 단순화했습니다.",
  "노사 잠정합의안 비교는 영업이익 가정에 기존 OPI 1.5%와 DS 특별경영성과급 10.5%를 합산한 12%를 곱해 총 재원을 만들고, 12만명으로 나눈 뒤 평균 보수 대비 연봉 가중치를 적용했습니다.",
  "세후 실수령액은 세전 성과급의 72%를 남는 금액으로 보는 단순 가정입니다. 실제 세율은 연봉, 가족 수, 공제, 지급 방식에 따라 달라집니다.",
  "자사주 지급안은 현금 입금과 체감 방식이 다를 수 있습니다. 지급 시점 주가, 매각 가능 시점, 보호예수 조건에 따라 실제 체감액이 달라질 수 있습니다.",
];

export const faq = [
  {
    question: "삼성전자 2026 노사 잠정합의안이 이 표에 반영되어 있나요?",
    answer:
      "네. 별도 표에서 기존 OPI 1.5%와 DS 특별경영성과급 10.5%를 합산한 12% 구조를 영업이익 재원 기준으로 환산했습니다. 다만 최종 확정 지급액이 아니라 보도된 잠정합의안 기준 시뮬레이션입니다.",
  },
  {
    question: "삼성전자 성과급 직급별 실수령액은 공식 금액인가요?",
    answer:
      "아닙니다. 이 페이지의 직급별 금액은 추천 연봉과 공개·보도 기반 지급률을 조합한 시뮬레이션입니다. 실제 지급액은 회사 기준, 사업부, 개인 평가, 세금 조건에 따라 달라집니다.",
  },
  {
    question: "왜 세후 72%로 계산하나요?",
    answer:
      "성과급은 근로소득으로 합산 과세되므로 세전 금액이 그대로 입금되지 않습니다. 이 페이지에서는 빠른 비교를 위해 세전 성과급의 72%를 세후 참고값으로 두었습니다.",
  },
  {
    question: "자사주 지급이면 현금 성과급과 같은가요?",
    answer:
      "같지 않습니다. 자사주는 지급 시점 주가와 매각 가능 시점에 따라 체감 가치가 달라질 수 있습니다. 이 페이지의 세후 금액은 자사주 지급 규모를 현금 가치처럼 단순 환산한 참고값입니다.",
  },
  {
    question: "내 연봉 기준으로 다시 계산할 수 있나요?",
    answer:
      "네. 삼성전자 성과급 계산기에서 직급, 사업부, 연봉, OPI·TAI 조건과 잠정합의안 모드를 직접 바꾸면 본인 조건에 가까운 세전 총보상과 월 체감액을 볼 수 있습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
  { href: "/tools/bonus-after-tax-calculator/?company=samsung", label: "성과급 세후 실수령액 계산기" },
  { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성전자 DS 성과급 계산 기준" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교 계산기" },
];
