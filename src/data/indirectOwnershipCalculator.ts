export type OwnershipCalcMode = "single" | "multi" | "circular";

export interface OwnershipCalcStep {
  label: string;
  rate: number;
}

export interface OwnershipCalcPreset {
  id: string;
  label: string;
  mode: OwnershipCalcMode;
  structureType: string;
  baseDate: string;
  reportHref: string;
  companies: string[];
  steps: OwnershipCalcStep[];
  directRate?: number;
}

export const IOC_PRESETS: OwnershipCalcPreset[] = [
  {
    id: "samsung",
    label: "삼성물산 → 삼성생명 → 삼성전자",
    mode: "single",
    structureType: "복합 연결 중 한 경로",
    baseDate: "2026-07-20",
    reportHref: "/reports/samsung-group-ownership-2026/",
    companies: ["삼성물산", "삼성생명", "삼성전자"],
    steps: [
      { label: "삼성물산 → 삼성생명", rate: 19.34 },
      { label: "삼성생명 → 삼성전자", rate: 8.51 },
    ],
  },
  {
    id: "sk",
    label: "SK㈜ → SK스퀘어 → SK하이닉스",
    mode: "single",
    structureType: "중간지주 경로",
    baseDate: "2026-07-20",
    reportHref: "/reports/sk-group-ownership-2026/",
    companies: ["SK㈜", "SK스퀘어", "SK하이닉스"],
    steps: [
      { label: "SK㈜ → SK스퀘어", rate: 32.14 },
      { label: "SK스퀘어 → SK하이닉스", rate: 20.5 },
    ],
  },
  {
    id: "lg",
    label: "㈜LG → LG화학 → LG에너지솔루션",
    mode: "single",
    structureType: "상장 손자회사",
    baseDate: "2026-07-20",
    reportHref: "/reports/lg-group-ownership-2026/",
    companies: ["㈜LG", "LG화학", "LG에너지솔루션"],
    steps: [
      { label: "㈜LG → LG화학", rate: 34.95 },
      { label: "LG화학 → LG에너지솔루션", rate: 79.38 },
    ],
  },
  {
    id: "hd-hyundai",
    label: "HD현대 → HD한국조선해양 → HD현대중공업",
    mode: "single",
    structureType: "상장 중간지주",
    baseDate: "2026-07-20",
    reportHref: "/reports/hd-hyundai-group-ownership-2026/",
    companies: ["HD현대", "HD한국조선해양", "HD현대중공업"],
    steps: [
      { label: "HD현대 → HD한국조선해양", rate: 37.9 },
      { label: "HD한국조선해양 → HD현대중공업", rate: 69.3 },
    ],
  },
  {
    id: "hyundai-circular",
    label: "현대모비스 → 현대차 → 기아 → 현대모비스",
    mode: "circular",
    structureType: "순환출자 한 바퀴",
    baseDate: "2026-07-20",
    reportHref: "/reports/hyundai-motor-group-ownership-2026/",
    companies: ["현대모비스", "현대차", "기아", "현대모비스"],
    steps: [
      { label: "현대모비스 → 현대차", rate: 21.43 },
      { label: "현대차 → 기아", rate: 35.17 },
      { label: "기아 → 현대모비스", rate: 17.54 },
    ],
  },
];

export const IOC_DEFAULT_COMPANIES = ["출발 회사", "중간 회사", "최종 회사"];

export const IOC_DEFAULT_STEPS: OwnershipCalcStep[] = [
  { label: "출발 회사 → 중간 회사", rate: 40 },
  { label: "중간 회사 → 최종 회사", rate: 50 },
];

export const IOC_META = {
  slug: "indirect-ownership-calculator",
  title: "간접 지분율·다중 지분 경로 계산기 2026 | 직접 지분·순환출자 연결값 계산",
  description:
    "회사 간 지분 연결을 단일 경로, 다중 경로, 순환출자로 나눠 계산합니다. 직접 지분과 간접 연결값을 함께 비교하고 단계별 누적 지분율을 확인하세요.",
  updatedAt: "2026-07-20",
  notice:
    "이 계산기는 지분율을 단순 곱셈으로 연결한 참고값을 제공합니다. 직접 지분, 간접 경로, 순환 연결값은 법적 의결권·특수관계인 합산·실질 지배력 판정과 다를 수 있습니다.",
};

export const IOC_CONCEPT_ROWS = [
  { concept: "직접 지분", meaning: "해당 회사 주식을 직접 보유", provided: "선택 입력" },
  { concept: "간접 지분", meaning: "다른 회사를 거쳐 연결되는 지분", provided: "제공" },
  { concept: "단순 경제적 연결값", meaning: "경로별 지분율을 곱한 참고값", provided: "제공" },
  { concept: "의결권", meaning: "주주총회에서 행사 가능한 권리", provided: "제공하지 않음" },
  { concept: "특수관계인 합산", meaning: "친족·계열회사 등 보유분 합산", provided: "제공하지 않음" },
  { concept: "실질 지배력", meaning: "지분·이사회·계약 등을 종합한 판단", provided: "판정하지 않음" },
];

export const IOC_SEO_INTRO = [
  "회사 간 지분 연결은 최종 숫자 하나만 보면 오해하기 쉽습니다. 직접 보유 지분, 자회사를 거친 간접 경로, 여러 계열사가 동시에 보유하는 다중 경로, 다시 출발 회사로 돌아오는 순환출자를 구분해야 합니다.",
  "이 계산기는 각 단계 지분율을 퍼센트에서 소수로 바꾼 뒤 순서대로 곱합니다. 예를 들어 40%는 0.4, 50%는 0.5로 바꾸고 0.4 × 0.5 = 0.2, 다시 100을 곱해 20%로 표시합니다.",
  "다중 경로 모드에서는 경로별 간접 연결값을 따로 계산한 뒤 단순 합계를 보여줍니다. 다만 같은 지분관계가 중복 포함되거나 순환출자가 섞이면 합계가 실제 경제적 권리와 다를 수 있습니다.",
];

export const IOC_SEO_CRITERIA = [
  "최종 간접 연결값 = (지분율1 ÷ 100) × (지분율2 ÷ 100) × ... × 100입니다.",
  "직접+간접 합계는 직접 보유 지분율과 경로별 간접 연결값을 단순 합산한 참고값입니다.",
  "다중 경로 합계는 경로들이 서로 독립적이고 같은 지분을 중복 포함하지 않는다는 가정 아래 계산합니다.",
  "순환출자 모드는 한 바퀴 순환 연결값만 제공합니다. 특정 회사의 최종 보유 지분율이나 자기주식 비율을 뜻하지 않습니다.",
  "의결권, 특수관계인 합산, 법적 자회사 여부, 실질 지배력은 계산하지 않습니다.",
];

export const IOC_FAQ = [
  {
    question: "여러 경로로 지분을 보유하면 어떻게 계산하나요?",
    answer:
      "각 경로의 지분율을 먼저 별도로 계산합니다. 경로들이 서로 독립적이고 같은 지분을 중복 포함하지 않는다면 경로별 결과를 단순 합산해 참고할 수 있습니다. 다만 교차지분이나 순환출자가 있으면 단순 합산이 정확하지 않을 수 있습니다.",
  },
  {
    question: "간접 지분율이 의결권과 같은 의미인가요?",
    answer:
      "아닙니다. 의결권은 각 단계에서 주식을 직접 보유한 회사가 행사합니다. 간접 지분율은 지분 연결의 경제적 관계를 단순화한 참고값입니다.",
  },
  {
    question: "순환출자가 있으면 계산이 달라지나요?",
    answer:
      "예. 순환출자는 지분 연결이 다시 출발점으로 돌아오므로 일반적인 시작점→최종회사 구조와 다릅니다. 이 계산기에서는 한 바퀴의 지분율을 곱한 순환 연결값만 참고용으로 계산합니다.",
  },
  {
    question: "직접 지분과 간접 지분을 더해도 되나요?",
    answer:
      "참고 목적으로 단순 합산할 수 있지만, 직접 지분과 간접 경로의 의결권 행사 주체가 다를 수 있습니다. 따라서 합산값을 법적 보유지분이나 직접 의결권으로 해석하면 안 됩니다.",
  },
  {
    question: "간접 지분율이 높으면 지배력이 높은가요?",
    answer:
      "반드시 그렇지는 않습니다. 경영권은 다른 주주의 지분 분포, 특수관계인, 이사회 구성, 주주 간 계약, 규제 등을 함께 봐야 합니다.",
  },
  {
    question: "실제 사례로 확인하고 싶어요.",
    answer:
      "삼성·SK·LG·HD현대 등은 일반 다단계 지분 사례로 볼 수 있고, 현대차그룹은 순환출자 사례로 별도 확인하는 게 적절합니다. 각 프리셋의 지분율과 기준일은 그룹별 상세 리포트에서 확인할 수 있습니다.",
  },
];
