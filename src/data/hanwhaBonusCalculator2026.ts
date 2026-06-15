import type {
  BonusInputMode,
  TaxMode,
  FaqItem,
  RelatedLink,
  CompanyFact,
  CompanySourceRef,
  HistoricalBonusPreset,
} from "./doosanEnerbilityBonusCalculator2026";

export type { BonusInputMode, TaxMode, CompanyFact, CompanySourceRef, HistoricalBonusPreset };

export interface HanwhaCompanyConfig {
  code: string;
  label: string;
  fullName: string;
  description: string;
  industryNote: string;
  caution: string;
  defaultAnnualSalary: number;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  companyFacts: CompanyFact[];
  factsAsOf: string;
  factsSource: CompanySourceRef;
  historicalPresets: HistoricalBonusPreset[];
}

export const HANWHA_COMPANIES: HanwhaCompanyConfig[] = [
  {
    code: "hanwhaOcean",
    label: "한화오션",
    fullName: "한화오션 (구 대우조선해양)",
    description: "조선 부문 — LNG운반선·해양플랜트 등 수주 실적 기반 성과급",
    industryNote:
      "최근 조선업 수주 호황이 보도되고 있으나, 이는 일반 동향 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
    caution:
      "사업부, 직급, 평가 결과, 노사 협의에 따라 실제 금액이 달라질 수 있습니다.",
    defaultAnnualSalary: 60000000,
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 1.5,
    defaultFixedAmount: 0,
    companyFacts: [
      { label: "평균연봉", value: "약 8,300만원" },
      { label: "임직원수", value: "10,202명" },
      { label: "매출 (2024, 별도)", value: "12조 6,884억원" },
      { label: "비고", value: "2025년부터 한화에어로스페이스 연결 실적에 편입" },
    ],
    factsAsOf: "2024년 실적 기준",
    factsSource: {
      label: "한화그룹 뉴스룸 보도자료 기준",
      href: "https://www.hanwha.co.kr/newsroom/media_center/news/news_view.do?seq=15346",
    },
    historicalPresets: [
      {
        label: "2024년 실적 기준 지급",
        description: "기본급 기준 150% 성과급을 협력회사까지 동일한 비율로 지급",
        mode: "monthlyMultiple",
        value: 1.5,
        source: {
          label: "한화그룹 뉴스룸",
          href: "https://www.hanwha.co.kr/newsroom/media_center/news/news_view.do?seq=15346",
        },
        sourceDate: "2024년 보도",
      },
    ],
  },
  {
    code: "hanwhaAerospace",
    label: "한화에어로스페이스",
    fullName: "한화에어로스페이스",
    description: "방산 부문 — K9 자주포 등 방산 수출 실적 기반 성과급",
    industryNote:
      "최근 방산 수출 확대가 보도되고 있으나, 이는 일반 동향 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
    caution:
      "사업부, 직급, 평가 결과, 노사 협의에 따라 실제 금액이 달라질 수 있습니다.",
    defaultAnnualSalary: 65000000,
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2,
    defaultFixedAmount: 0,
    companyFacts: [
      { label: "평균연봉", value: "1억 1,816만원" },
      { label: "임직원수", value: "7,797명" },
      { label: "매출 (2024, 연결)", value: "11조 2,462억원" },
      { label: "영업이익 (2024, 연결)", value: "1조 7,247억원" },
    ],
    factsAsOf: "2024년 연결 기준",
    factsSource: {
      label: "한화그룹 뉴스룸 2024년 실적 발표",
      href: "https://www.hanwha.co.kr/newsroom/media_center/news/news_view.do?seq=13974",
    },
    historicalPresets: [
      {
        label: "2026년 지급 (2025년 실적 기준)",
        description: "3년 연속 사상 최대 실적 경신으로 지상방산(LS) 사업부 기준 최대 725% 성과급 지급",
        mode: "monthlyMultiple",
        value: 7.25,
        source: {
          label: "네이트뉴스 2026.02.13",
          href: "https://news.nate.com/view/20260213n16908",
        },
        sourceDate: "2026-02-13",
      },
    ],
  },
];

export const HANWHA_SIMPLE_TAX_RATE = 0.22;

export interface HanwhaScenarioRow {
  rate: number;
  label: string;
}

export const HANWHA_SCENARIO_RATES: HanwhaScenarioRow[] = [
  { rate: 10, label: "10%" },
  { rate: 15, label: "15%" },
  { rate: 20, label: "20% (기준)" },
  { rate: 25, label: "25%" },
  { rate: 30, label: "30%" },
];

export const HANWHA_BONUS_FAQ: FaqItem[] = [
  { question: "한화오션과 한화에어로스페이스 성과급은 어떻게 다른가요?", answer: "한화오션은 조선 부문, 한화에어로스페이스는 방산 부문으로 사업 영역과 실적 평가 기준이 다릅니다. 이 계산기는 두 회사를 탭으로 전환하며 각각 다른 기본 지급률(추정값)을 적용합니다." },
  { question: "이 계산기의 기본 지급률은 확정된 수치인가요?", answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요." },
  { question: "탭을 전환하면 입력값이 초기화되나요?", answer: "네. 회사 탭을 전환하면 연봉, 입력 방식, 지급률, 세금 모드가 해당 회사의 기본값으로 초기화됩니다." },
  { question: "조선업 수주 호황이나 방산 수출 확대가 성과급에 반영되나요?", answer: "관련 동향이 보도되고 있으나, 이 계산기는 해당 정보를 성과급 수치 산정에 직접 반영하지 않습니다. 일반 참고 정보로만 안내합니다." },
  { question: "세후로 얼마나 받게 되나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 계산기를 이용하세요." },
  { question: "월급 배수로도 계산할 수 있나요?", answer: "네. 입력 방식에서 '월급 × 배수'를 선택하면 월급에 배수를 곱한 금액으로 성과급을 계산할 수 있습니다." },
  { question: "다른 대기업과 비교하려면 어떻게 하나요?", answer: "대기업 성과급 시뮬레이터 또는 대기업 성과급 비교 리포트를 통해 여러 기업의 성과급을 동일 기준으로 비교해 볼 수 있습니다." },
];

export const HANWHA_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향을 한눈에 확인" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에 대한 세금을 정확히 계산" },
  { href: "/tools/doosan-enerbility-bonus-calculator/", label: "두산에너빌리티 성과급 계산기", description: "원전·에너지 업종 성과급 계산" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 성과급 비교" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급을 한 번에 비교" },
];
