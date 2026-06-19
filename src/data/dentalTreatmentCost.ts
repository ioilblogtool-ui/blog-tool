export const DTC_META = {
  slug: "dental-treatment-cost-calculator",
  title: "치과 치료비 비교 계산기",
  seoTitle: "치과 치료비 적정할까? 임플란트·크라운·충치 비용 비교 계산기 2026",
  description:
    "임플란트·크라운·충치·교정 견적을 입력하면 전국 평균 대비 낮음·보통·높음을 즉시 판단합니다. 건강보험 적용 조건과 연말정산 의료비 공제 안내 포함.",
} as const;

export interface DentalOption {
  id: string;
  label: string;
  low: number;
  avg: number;
  high: number;
  insuranceLow?: number;
  insuranceHigh?: number;
  insuranceCondition?: string;
}

export interface DentalTreatment {
  id: string;
  label: string;
  perTooth: boolean;
  insuranceAvailable: boolean;
  insuranceNote?: string;
  options: DentalOption[];
}

export const DTC_TREATMENTS: DentalTreatment[] = [
  {
    id: "implant",
    label: "임플란트",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "만 65세 이상은 건강보험 적용 (본인부담 30%, 평생 2개 한도)",
    options: [
      {
        id: "domestic",
        label: "국산 임플란트",
        low: 80, avg: 100, high: 130,
        insuranceLow: 25, insuranceHigh: 45,
        insuranceCondition: "만 65세 이상, 평생 2개 한도",
      },
      {
        id: "imported",
        label: "수입 임플란트",
        low: 130, avg: 160, high: 200,
      },
    ],
  },
  {
    id: "crown",
    label: "크라운",
    perTooth: true,
    insuranceAvailable: false,
    options: [
      { id: "pfm",      label: "PFM (도자기+금속)", low: 15, avg: 25, high: 35 },
      { id: "zirconia", label: "지르코니아",         low: 25, avg: 40, high: 60 },
      { id: "ceramic",  label: "올세라믹",           low: 30, avg: 55, high: 80 },
      { id: "gold",     label: "금 크라운",          low: 40, avg: 60, high: 80 },
      {
        id: "resin", label: "레진 (보험)",
        low: 7, avg: 11, high: 15,
        insuranceLow: 7, insuranceHigh: 15,
        insuranceCondition: "건강보험 적용 가능",
      },
    ],
  },
  {
    id: "inlay",
    label: "인레이",
    perTooth: true,
    insuranceAvailable: false,
    options: [
      { id: "resin",   label: "레진 인레이",   low: 8,  avg: 13, high: 20 },
      { id: "ceramic", label: "세라믹 인레이", low: 15, avg: 25, high: 35 },
      { id: "gold",    label: "금 인레이",     low: 30, avg: 45, high: 60 },
    ],
  },
  {
    id: "filling",
    label: "충치 치료",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "건강보험 적용 가능 (레진 직접 수복, 본인부담 30%)",
    options: [
      {
        id: "small",  label: "소 (1면)",      low: 3,  avg: 5,  high: 8,
        insuranceLow: 1, insuranceHigh: 3,
      },
      {
        id: "medium", label: "중 (2면)",      low: 6,  avg: 10, high: 15,
        insuranceLow: 2, insuranceHigh: 5,
      },
      {
        id: "large",  label: "대 (3면 이상)", low: 10, avg: 15, high: 20,
        insuranceLow: 3, insuranceHigh: 6,
      },
    ],
  },
  {
    id: "rootcanal",
    label: "신경치료",
    perTooth: true,
    insuranceAvailable: true,
    insuranceNote: "건강보험 적용 (본인부담 30%). 치아 종류별 차등 적용.",
    options: [
      {
        id: "anterior",  label: "전치부 (앞니)",       low: 10, avg: 17, high: 25,
        insuranceLow: 3, insuranceHigh: 8,
      },
      {
        id: "premolar",  label: "소구치 (작은어금니)", low: 15, avg: 25, high: 35,
        insuranceLow: 5, insuranceHigh: 11,
      },
      {
        id: "molar",     label: "대구치 (큰어금니)",   low: 20, avg: 35, high: 50,
        insuranceLow: 7, insuranceHigh: 15,
      },
    ],
  },
  {
    id: "scaling",
    label: "스케일링",
    perTooth: false,
    insuranceAvailable: true,
    insuranceNote: "연 1회 건강보험 적용 (본인부담 20~30%)",
    options: [
      {
        id: "insured",   label: "보험 스케일링 (연 1회)", low: 15, avg: 18, high: 20,
        insuranceLow: 15, insuranceHigh: 20,
        insuranceCondition: "연 1회 한도",
      },
      { id: "uninsured", label: "비보험 스케일링",        low: 50, avg: 75, high: 120 },
    ],
  },
  {
    id: "braces",
    label: "치아교정",
    perTooth: false,
    insuranceAvailable: false,
    options: [
      { id: "metal",   label: "메탈 교정",           low: 250, avg: 350, high: 450 },
      { id: "ceramic", label: "세라믹 교정",         low: 350, avg: 480, high: 600 },
      { id: "lingual", label: "설측 교정",           low: 500, avg: 700, high: 900 },
      { id: "clear",   label: "투명 교정 (인비절라인)", low: 400, avg: 600, high: 800 },
    ],
  },
  {
    id: "denture",
    label: "틀니",
    perTooth: false,
    insuranceAvailable: true,
    insuranceNote: "만 65세 이상 건강보험 적용 (본인부담 30%)",
    options: [
      {
        id: "full-insured",    label: "완전틀니 (보험)",  low: 50,  avg: 75,  high: 100,
        insuranceLow: 50, insuranceHigh: 100, insuranceCondition: "만 65세 이상",
      },
      {
        id: "partial-insured", label: "부분틀니 (보험)",  low: 40,  avg: 60,  high: 80,
        insuranceLow: 40, insuranceHigh: 80, insuranceCondition: "만 65세 이상",
      },
      { id: "uninsured",       label: "비보험 틀니",      low: 100, avg: 200, high: 300 },
    ],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const DTC_FAQS: FaqItem[] = [
  {
    question: "임플란트 비용이 병원마다 차이나는 이유는 무엇인가요?",
    answer:
      "임플란트 비용은 사용하는 픽스처(나사) 브랜드, 어버트먼트·크라운 재료, 뼈이식 여부, 병원 위치와 규모에 따라 크게 달라집니다. 이 계산기의 참고 범위는 국내 다수 병원의 비용 조사를 바탕으로 한 추정치입니다.",
  },
  {
    question: "임플란트 건강보험 적용 조건이 뭔가요?",
    answer:
      "만 65세 이상이면 임플란트 2개(평생)까지 건강보험이 적용됩니다. 본인부담률은 30%이며, 치아 상실 부위와 턱뼈 상태 등 조건이 맞아야 합니다. 정확한 적용 여부는 치과에서 확인하세요.",
  },
  {
    question: "크라운 재료 중 어느 게 가성비가 좋나요?",
    answer:
      "앞니는 심미성 때문에 지르코니아나 올세라믹을 많이 선택합니다. 어금니는 저작력이 중요해 금 크라운이나 지르코니아를 추천하는 경우가 많습니다. PFM은 비용이 저렴하지만 금속 테두리가 보일 수 있습니다. 재료 선택은 위치·기능·예산을 함께 고려하세요.",
  },
  {
    question: "치과 치료비를 실손보험으로 청구할 수 있나요?",
    answer:
      "일반 치과 치료(임플란트·교정 등)는 실손보험 적용 제외입니다. 다만 상해(사고)로 인한 치아 치료는 실손보험 청구가 가능할 수 있습니다. 별도 치과보험에 가입된 경우 약관을 확인하세요.",
  },
  {
    question: "치과 치료비 연말정산 의료비 공제를 받을 수 있나요?",
    answer:
      "네. 임플란트·크라운·교정 등 비보험 치과 치료비도 연말정산 의료비 세액공제 대상입니다. 총급여의 3% 초과분에 대해 15% 세액공제를 받을 수 있으며, 실손보험 수령액은 제외됩니다. 영수증을 꼭 챙겨두세요.",
  },
  {
    question: "스케일링은 보험 적용이 되나요?",
    answer:
      "연 1회에 한해 건강보험이 적용됩니다. 본인부담률은 20~30% 수준이며 1.5만~2만원 정도입니다. 연 1회 이후 추가 스케일링은 비보험으로 적용됩니다.",
  },
  {
    question: "견적이 높다고 나오면 어떻게 해야 하나요?",
    answer:
      "이 계산기의 참고 범위는 추정치입니다. 견적이 높다고 판단된다면 다른 치과에서 2~3곳 추가 상담을 받아보는 것을 권장합니다. 단, 재료 품질·술식 방법·의사 경력 등도 함께 고려해야 합니다.",
  },
  {
    question: "치아교정비도 연말정산 의료비 공제가 되나요?",
    answer:
      "기능적 목적(저작·발음 개선)의 교정은 의료비 공제 대상입니다. 단순 심미 목적의 교정은 공제 대상에서 제외될 수 있어 치과 영수증의 진료 내역을 확인하는 것이 좋습니다.",
  },
];

export const DTC_INSURANCE_TABLE = [
  { treatment: "임플란트",       condition: "만 65세 이상, 평생 2개 한도", rate: "30%" },
  { treatment: "완전틀니",       condition: "만 65세 이상",                rate: "30%" },
  { treatment: "부분틀니",       condition: "만 65세 이상",                rate: "30%" },
  { treatment: "스케일링",       condition: "연 1회",                      rate: "20~30%" },
  { treatment: "충치 치료",      condition: "레진·아말감 직접 수복",        rate: "30%" },
  { treatment: "신경치료",       condition: "조건 없음",                   rate: "30%" },
  { treatment: "파노라마 X-ray", condition: "조건 없음",                   rate: "30%" },
];
