import {
  semiconductorForecasts,
  getCompanyForecasts,
  type SemiconductorForecast,
} from "./semiconductorStocksForecast2026_2028";
import {
  rankPresets as samsungRankPresets,
  divisions as samsungDivisions,
  factAnchors as samsungFactAnchors,
  type RankCode as SamsungRankCode,
  type ScenarioCode as SamsungScenarioCode,
  type DivisionCode as SamsungDivisionCode,
} from "./samsungCompensation";
import {
  rankPresets as hynixRankPresets,
  psMultipliersByYear,
  factAnchors as hynixFactAnchors,
  type RankCode as HynixRankCode,
  type TargetYear,
  type ScenarioCode as HynixScenarioCode,
} from "./skHynixCompensation";

export type CompanySlugSEVB = "samsung-electronics" | "sk-hynix";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SEVB_META = {
  slug: "samsung-vs-skhynix-earnings-bonus-2026",
  title: "삼성전자 vs SK하이닉스 2026~2028 실적·성과급 비교",
  seoTitle: "삼성전자 vs SK하이닉스 성과급 2026 | 실적 늘면 얼마 더 받을까",
  seoDescription:
    "삼성전자·SK하이닉스의 2026~2028년 영업이익 전망과 직급별 성과급 환산을 한 화면에서 비교합니다. 매출은 삼성, 영업이익률은 SK하이닉스가 앞서는데 성과급 체감은 어떻게 다를까요?",
  description:
    "삼성전자와 SK하이닉스의 2026~2028년 실적 전망(기존 반도체 실적 리포트 인용)과 직급별 성과급 환산을 연도·시나리오별로 비교하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "매출·영업이익·영업이익률은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 출처(2026-05-31 기준 컨센서스·시나리오 재구성)를 그대로 인용합니다. 성과급 비율은 각 회사 성과급 계산기에 쓰인 보도 기준 비율이며, 실적 섹션과는 산출 시점·기준이 다른 별도 자료이므로 서로 곱해 새로운 숫자를 만들지 않습니다.",
};

export function getEarningsCompareRows(): Array<{
  year: 2026 | 2027 | 2028;
  samsung: SemiconductorForecast;
  hynix: SemiconductorForecast;
}> {
  const samsung = getCompanyForecasts("samsung-electronics");
  const hynix = getCompanyForecasts("sk-hynix");
  return [2026, 2027, 2028].map((year) => ({
    year: year as 2026 | 2027 | 2028,
    samsung: samsung.find((f) => f.year === year)!,
    hynix: hynix.find((f) => f.year === year)!,
  }));
}

export interface BonusEstimateResult {
  company: CompanySlugSEVB;
  rankLabel: string;
  baseSalary: number;
  ratePercent: number;
  rateLabel: string;
  estimatedBonus: number;
  scenarioLabel: string;
}

const scenarioLabelOf = (scenario: HynixScenarioCode | SamsungScenarioCode) =>
  scenario === "CONSERVATIVE" ? "보수적" : scenario === "BASE" ? "기준" : "공격적";

export function estimateHynixBonus(
  rankCode: HynixRankCode,
  year: TargetYear,
  scenario: HynixScenarioCode,
): BonusEstimateResult {
  const rank = hynixRankPresets.find((r) => r.code === rankCode)!;
  const yearData = psMultipliersByYear[year];
  const ratePercent =
    scenario === "CONSERVATIVE" ? yearData.conservative : scenario === "BASE" ? yearData.base : yearData.aggressive;
  return {
    company: "sk-hynix",
    rankLabel: rank.label,
    baseSalary: rank.defaultSalary,
    ratePercent,
    rateLabel: `PS ${ratePercent}%`,
    estimatedBonus: Math.round((rank.defaultSalary * ratePercent) / 100),
    scenarioLabel: scenarioLabelOf(scenario),
  };
}

export function estimateSamsungBonus(
  rankCode: SamsungRankCode,
  divisionCode: SamsungDivisionCode,
  scenario: SamsungScenarioCode,
): BonusEstimateResult {
  const rank = samsungRankPresets.find((r) => r.code === rankCode)!;
  const division = samsungDivisions.find((d) => d.code === divisionCode)!;
  const rateFraction =
    scenario === "CONSERVATIVE"
      ? division.scenarioRates.CONSERVATIVE
      : scenario === "BASE"
        ? division.scenarioRates.BASE
        : division.scenarioRates.AGGRESSIVE;
  const ratePercent = rateFraction * 100;
  return {
    company: "samsung-electronics",
    rankLabel: `${rank.label} · ${division.label}`,
    baseSalary: rank.defaultSalary,
    ratePercent,
    rateLabel: `OPI ${ratePercent.toFixed(1)}%`,
    estimatedBonus: Math.round((rank.defaultSalary * ratePercent) / 100),
    scenarioLabel: scenarioLabelOf(scenario),
  };
}

export const SEVB_HYNIX_PS_BY_YEAR = psMultipliersByYear;

export const SEVB_CONSENSUS_REFERENCE_CARDS = [
  {
    company: "sk-hynix" as CompanySlugSEVB,
    label: "PS 비율 산정 시점 참고 컨센서스",
    value: hynixFactAnchors.find((a) => a.label === "2026 영업이익 컨센서스")?.value ?? "약 77.1조 원",
    note: "FnGuide 2026/12(E), 2026-05-20 확인 — 위 실적 비교 섹션의 228조원(2026-05-31 재구성)과는 별도 출처입니다.",
  },
  {
    company: "samsung-electronics" as CompanySlugSEVB,
    label: "OPI/TAI 시나리오 참고 영업이익",
    value: "297.5조원 (2026 컨센서스) / 317조원 (2027 슈퍼사이클)",
    note: "samsungCompensation.ts operatingProfitScenarios 인용 — 위 실적 비교 섹션의 145조원(2026E)과는 별도 출처입니다.",
  },
];

export const SEVB_FAQ: FaqItem[] = [
  {
    question: "삼성전자와 SK하이닉스 중 어느 쪽 성과급이 더 많나요?",
    answer:
      "직급과 시나리오에 따라 다릅니다. SK하이닉스는 PS 비율이 기준급의 24~70%(연도·시나리오별)로 책정되는 구조이고, 삼성전자는 사업부별 OPI 비율(DS 47% 등)에 특별성과급(TAI, 잠정합의안 기준 추가 10.5%)이 더해지는 구조입니다. 같은 기준급이라도 시나리오에 따라 우위가 바뀔 수 있어 이 페이지에서 직급·시나리오를 선택해 직접 비교해야 합니다.",
  },
  {
    question: "이 페이지의 영업이익 수치는 성과급 비율과 같은 자료에서 나온 건가요?",
    answer:
      "아닙니다. 실적 비교 섹션의 매출·영업이익은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 2026-05-31 기준 재구성 자료이고, 성과급 비율(PS/OPI)은 각 회사 성과급 계산기에 쓰인 보도 기준 비율로 산출 시점과 기준이 다릅니다. 두 수치를 곱해서 새로운 총액을 만들면 안 됩니다.",
  },
  {
    question: "2027년, 2028년 성과급도 확정된 건가요?",
    answer:
      "아닙니다. 2026년 지급분만 일부 확정·보도된 실제값(SK하이닉스 PS 2,964%, 삼성전자 잠정합의안 총 12%)이 있고, 2027·2028년은 모두 보수·기준·공격적 시나리오로 제공되는 추정값입니다.",
  },
  {
    question: "직급별 기준급은 어떻게 정해졌나요?",
    answer:
      "각 회사의 기존 성과급 계산기(삼성전자 성과급 계산기, SK하이닉스 성과급 계산기)에서 쓰는 사원~부장 기준급 프리셋을 그대로 가져왔습니다. 실제 개인별 기준급은 입사 연차, 평가 등급에 따라 달라질 수 있어 참고용으로만 사용해야 합니다.",
  },
  {
    question: "이 리포트는 이직이나 투자를 추천하나요?",
    answer:
      "아닙니다. 공개된 실적 전망과 보도된 성과급 비율을 비교해서 보여주는 정보 제공용 리포트이며, 이직·투자 추천이 아닙니다. 실제 의사결정은 최신 공시와 본인 상황을 기준으로 별도 판단해야 합니다.",
  },
  {
    question: "삼성전자 TAI(특별성과급)는 매년 나오나요?",
    answer:
      "아닙니다. TAI는 사업 성과에 따라 지급 여부와 규모가 달라지는 별도 재원입니다. 이 페이지에 표시된 2026년 잠정합의안(총 12%, DS 특별경영성과급 10.5% 포함)은 2026년 노사 합의 기준이며, 향후 연도에 동일하게 반복된다고 가정할 수 없습니다.",
  },
];

export const SEVB_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 4대장 2026~2028 실적 전망 비교", description: "삼성전자·SK하이닉스·마이크론·TSMC 매출·영업이익 전망 원본 리포트" },
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기", description: "사업부·직급별 OPI·TAI 상세 계산" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기", description: "연도·시나리오별 PS 상세 계산" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교 계산기", description: "삼성전자·SK하이닉스·DB하이텍 동시 비교" },
];

export const SEVB_SEO_INTRO: string[] = [
  "삼성전자와 SK하이닉스는 같은 한국 반도체 양강이지만 돈 버는 구조가 다릅니다. 'semiconductor-stocks-forecast-2026-2028' 리포트 기준으로 2026년 삼성전자 매출은 585조원, SK하이닉스는 300조원으로 삼성전자가 규모는 더 크지만, 영업이익률은 SK하이닉스가 76.0%로 삼성전자(24.8%)를 크게 앞섭니다. 이 리포트는 이 실적 격차가 실제로 직원 성과급 체감으로 어떻게 이어지는지를 직급별로 환산해서 보여줍니다.",
  "성과급 환산은 각 회사의 기존 성과급 계산기에 쓰이는 보도 기준 비율을 그대로 사용합니다. SK하이닉스는 PS(생산성격려금) 비율로 2026년 보수적 24%부터 공격적 33%까지, 2027년에는 54~66%, 2028년에는 58~70%까지 시나리오별로 제시됩니다. 삼성전자는 사업부별 OPI 비율(예: DS부문 47%)에 2026년 잠정합의안 기준 특별성과급(TAI) 최대 10.5%가 더해지는 구조입니다.",
  "한 가지 꼭 짚어야 할 점이 있습니다. 이 페이지의 실적 비교 섹션(매출·영업이익)과 성과급 비율 산정에 참고된 컨센서스는 출처와 산출 시점이 다릅니다. 예를 들어 SK하이닉스의 2026년 영업이익은 실적 비교 섹션에서 228조원으로 표시되지만, PS 비율이 책정될 당시 참고된 FnGuide 컨센서스는 약 77.1조원으로 다른 자료입니다. 두 수치를 곱해 새로운 회사 전체 성과급 총액을 계산하는 것은 이 페이지의 목적이 아니며, 그렇게 계산하면 잘못된 숫자가 나옵니다.",
  "이 페이지가 실제로 답하는 질문은 '내 직급이면 얼마를 받을까'입니다. 직급(사원~부장)과 연도(2026~2028), 시나리오(보수적·기준·공격적)를 선택하면 두 회사의 예상 성과급을 같은 화면에서 비교할 수 있습니다. 2026년은 SK하이닉스 PS 2,964%, 삼성전자 잠정합의안 총 12%처럼 일부 실제 발표값이 있고, 2027·2028년은 모두 시나리오 추정값입니다.",
  "이 리포트는 이직이나 투자를 추천하지 않습니다. 두 회사의 성과급 구조와 실적 전망을 비교해서 보여주는 정보 제공용 콘텐츠이며, 실제 성과급은 회사 전체 실적, 사업부 성과, 개인 평가 등급, 노사 협의 결과에 따라 달라집니다. 정확한 개인별 계산은 삼성전자 성과급 계산기, SK하이닉스 성과급 계산기에서 더 상세한 입력값으로 확인할 수 있습니다.",
];

export const SEVB_SEO_CRITERIA: string[] = [
  "매출·영업이익·영업이익률은 'semiconductor-stocks-forecast-2026-2028' 리포트와 동일한 2026-05-31 기준 컨센서스·시나리오 재구성 자료입니다.",
  "성과급 비율(PS/OPI/TAI)은 각 회사 성과급 계산기에 쓰이는 보도 기준 비율로, 실적 비교 섹션과 출처·시점이 다릅니다.",
  "실적 수치와 성과급 비율을 곱해 회사 전체 성과급 총액을 추정하지 않습니다 — 이 페이지는 개인 직급 기준 환산만 제공합니다.",
  "2026년 일부 수치는 실제 발표·보도 기준이며, 2027·2028년은 모두 시나리오 기반 추정입니다.",
  "이 리포트는 투자·이직 추천이 아닙니다.",
];

export { semiconductorForecasts, samsungFactAnchors };
