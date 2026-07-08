export type BabyMedicineCategory =
  | "temperature"
  | "fever"
  | "nose"
  | "stomach"
  | "skin"
  | "wound"
  | "dose"
  | "storage"
  | "emergency";

export type DangerSeverity = "urgent" | "consult";

export interface BabyMedicineChecklistItem {
  id: string;
  category: BabyMedicineCategory;
  categoryLabel: string;
  label: string;
  shortLabel: string;
  score: number;
  required: boolean;
  purpose: string;
  caution: string;
}

export interface BabyMedicineDangerSignal {
  id: string;
  label: string;
  severity: DangerSeverity;
  message: string;
}

export interface BabyMedicineAntipyreticRow {
  ingredient: string;
  useCase: string;
  checkPoint: string;
  caution: string;
}

export interface BabyMedicineFaq {
  question: string;
  answer: string;
}

export interface BabyMedicineRelatedLink {
  href: string;
  label: string;
}

export interface BabyMedicineReferenceLink {
  title: string;
  desc: string;
  url: string;
}

export const BABY_MEDICINE_META = {
  title: "아기 상비약 체크리스트 | 해열제·체온계·응급실 기준까지 한 번에",
  pageTitle: "아기 상비약 체크리스트",
  description:
    "아기 해열제, 체온계, 생리식염수, ORS, 상처 처치용품, 복약 기록표까지 집에 준비할 상비약을 체크하고 병원 상담이 필요한 신호를 확인하세요.",
  updatedAt: "2026년 7월 기준",
};

export const BABY_MEDICINE_CHECKLIST: BabyMedicineChecklistItem[] = [
  {
    id: "digital-thermometer",
    category: "temperature",
    categoryLabel: "체온 확인",
    label: "디지털 체온계",
    shortLabel: "체온계",
    score: 12,
    required: true,
    purpose: "열이 있을 때 같은 방식으로 반복 측정해 변화를 기록합니다.",
    caution: "측정 부위와 방식에 따라 수치가 달라질 수 있으니 같은 방식으로 재는 것이 좋습니다.",
  },
  {
    id: "temperature-log",
    category: "temperature",
    categoryLabel: "체온 확인",
    label: "체온·증상 기록 메모",
    shortLabel: "기록 메모",
    score: 8,
    required: true,
    purpose: "체온, 측정 시간, 증상 변화를 진료나 약국 상담 때 전달합니다.",
    caution: "기억에만 의존하면 복용 시간과 체온 흐름이 헷갈릴 수 있습니다.",
  },
  {
    id: "acetaminophen",
    category: "fever",
    categoryLabel: "해열·통증",
    label: "아세트아미노펜 계열 해열제",
    shortLabel: "아세트아미노펜",
    score: 12,
    required: true,
    purpose: "발열이나 통증이 있을 때 제품 설명서와 전문가 안내에 따라 확인합니다.",
    caution: "감기약 등 복합제에 같은 성분이 들어 있을 수 있어 성분 중복을 확인하세요.",
  },
  {
    id: "ibuprofen-family",
    category: "fever",
    categoryLabel: "해열·통증",
    label: "이부프로펜 또는 덱시부프로펜 계열",
    shortLabel: "이부프로펜 계열",
    score: 8,
    required: false,
    purpose: "아세트아미노펜과 다른 계열로, 약사·의사 안내에 따라 준비 여부를 정합니다.",
    caution: "탈수, 반복 구토, 잘 먹지 못하는 상태, 기저질환이 있으면 상담을 우선하세요.",
  },
  {
    id: "saline",
    category: "nose",
    categoryLabel: "코막힘",
    label: "생리식염수 스프레이 또는 앰플",
    shortLabel: "생리식염수",
    score: 8,
    required: false,
    purpose: "코막힘이나 건조함이 있을 때 코 관리에 참고할 수 있습니다.",
    caution: "약 성분이 있는 코감기 제품과 구분하고, 사용 연령을 확인하세요.",
  },
  {
    id: "ors",
    category: "stomach",
    categoryLabel: "설사·구토",
    label: "경구수분보충액 ORS",
    shortLabel: "ORS",
    score: 10,
    required: true,
    purpose: "설사나 구토 때 수분 보충 흐름을 확인하는 데 도움이 됩니다.",
    caution: "탈수 신호가 보이거나 물도 못 마시면 집에서 버티지 말고 상담하세요.",
  },
  {
    id: "skin-care",
    category: "skin",
    categoryLabel: "피부",
    label: "보습제와 기저귀 발진 보호크림",
    shortLabel: "보습·발진 크림",
    score: 8,
    required: false,
    purpose: "건조함, 기저귀 발진처럼 흔한 피부 불편에 대비합니다.",
    caution: "스테로이드 성분 연고는 임의 사용하지 말고 상담 후 사용하세요.",
  },
  {
    id: "wound-kit",
    category: "wound",
    categoryLabel: "상처",
    label: "멸균 거즈, 밴드, 기본 소독용품",
    shortLabel: "상처 처치용품",
    score: 8,
    required: true,
    purpose: "작은 상처를 깨끗하게 덮고 관찰할 수 있게 준비합니다.",
    caution: "깊은 상처, 출혈 지속, 물린 상처는 진료를 우선하세요.",
  },
  {
    id: "dose-tools",
    category: "dose",
    categoryLabel: "투약 도구",
    label: "약 먹이는 주사기, 계량컵, 전용 스푼",
    shortLabel: "투약 도구",
    score: 10,
    required: true,
    purpose: "제품 설명서 기준의 계량을 돕는 전용 도구입니다.",
    caution: "일반 숟가락으로 임의 계량하지 않도록 합니다.",
  },
  {
    id: "medicine-log",
    category: "dose",
    categoryLabel: "투약 도구",
    label: "복약 기록표",
    shortLabel: "복약 기록",
    score: 12,
    required: true,
    purpose: "성분, 시간, 체온, 복용량을 남겨 중복 복용을 피합니다.",
    caution: "이 페이지는 복용량을 계산하지 않으며 기록 정리만 돕습니다.",
  },
  {
    id: "emergency-contact",
    category: "emergency",
    categoryLabel: "응급 정보",
    label: "119, 소아청소년과, 야간·휴일 진료기관 메모",
    shortLabel: "응급 연락처",
    score: 12,
    required: true,
    purpose: "밤이나 주말에 바로 확인할 연락처를 미리 저장합니다.",
    caution: "위험 신호가 있으면 체크리스트보다 진료·상담이 우선입니다.",
  },
  {
    id: "expiry-label",
    category: "storage",
    categoryLabel: "보관",
    label: "개봉일·유효기간 확인 라벨",
    shortLabel: "유효기간 라벨",
    score: 6,
    required: false,
    purpose: "시럽, 연고, 앰플의 개봉일과 유효기간을 확인합니다.",
    caution: "유효기간이 지난 약은 먹이지 말고 안전하게 폐기하세요.",
  },
];

export const BABY_MEDICINE_DANGER_SIGNALS: BabyMedicineDangerSignal[] = [
  {
    id: "hard-to-wake",
    label: "아이가 축 처져 있거나 깨우기 어렵나요?",
    severity: "urgent",
    message: "의식 저하처럼 보일 수 있어 즉시 진료 또는 응급 상담을 권장합니다.",
  },
  {
    id: "breathing",
    label: "숨쉬기 힘들어 보이거나 호흡이 평소와 다른가요?",
    severity: "urgent",
    message: "호흡 문제는 집에서 지켜보기보다 즉시 상담이 필요한 신호입니다.",
  },
  {
    id: "seizure",
    label: "경련이 있었나요?",
    severity: "urgent",
    message: "경련이 있었다면 진료 또는 응급 상담을 우선하세요.",
  },
  {
    id: "blue-pale",
    label: "입술이나 얼굴색이 푸르거나 창백한가요?",
    severity: "urgent",
    message: "순환이나 호흡 상태 확인이 필요할 수 있어 즉시 상담을 권장합니다.",
  },
  {
    id: "repeated-vomit",
    label: "반복 구토로 물도 잘 마시지 못하나요?",
    severity: "consult",
    message: "탈수 위험이 커질 수 있어 소아청소년과나 응급 상담을 권장합니다.",
  },
  {
    id: "dehydration",
    label: "소변량이 줄고 입이 마르거나 눈물이 거의 없나요?",
    severity: "consult",
    message: "탈수 신호일 수 있어 수분 섭취 기록과 함께 상담하세요.",
  },
  {
    id: "under-three-months-fever",
    label: "생후 3개월 미만인데 고열이 의심되나요?",
    severity: "urgent",
    message: "어린 영아의 발열은 진료 상담을 미루지 않는 것이 안전합니다.",
  },
  {
    id: "under-two-cold-medicine",
    label: "2세 미만 감기 증상에 임의로 감기약을 먹이려 하나요?",
    severity: "consult",
    message: "임의 복용보다 의사 진료나 약사 상담을 먼저 확인하세요.",
  },
];

export const BABY_MEDICINE_ANTIPYRETICS: BabyMedicineAntipyreticRow[] = [
  {
    ingredient: "아세트아미노펜",
    useCase: "발열, 통증",
    checkPoint: "성분명, 제품 농도, 복합제 중복 여부",
    caution: "다른 감기약이나 해열제에 같은 성분이 들어 있을 수 있어 성분표를 확인하세요.",
  },
  {
    ingredient: "이부프로펜",
    useCase: "발열, 통증, 염증",
    checkPoint: "사용 가능 연령, 탈수·구토 여부, 기저질환",
    caution: "잘 먹지 못하거나 탈수가 의심되면 임의 복용보다 상담을 우선하세요.",
  },
  {
    ingredient: "덱시부프로펜",
    useCase: "발열, 통증",
    checkPoint: "이부프로펜 계열과의 중복 여부",
    caution: "같은 계열 성분을 동시에 먹이지 않도록 복약 기록을 남기세요.",
  },
  {
    ingredient: "아스피린",
    useCase: "성인 진통·해열 등",
    checkPoint: "소아 사용 제한",
    caution: "의사 처방 없이 어린이에게 먹이지 않도록 안내합니다.",
  },
];

export const BABY_MEDICINE_STORAGE_TIPS = [
  "아이 손이 닿지 않는 높은 곳이나 잠금장치가 있는 곳에 보관하세요.",
  "원래 용기와 제품 설명서를 함께 보관해 성분명과 유효기간을 확인하세요.",
  "시럽, 연고, 앰플은 개봉일을 적어 두고 제품별 보관 방법을 따르세요.",
  "유효기간이 지난 약은 임의로 먹이지 말고 약국 수거함 등 안전한 폐기 방법을 확인하세요.",
  "성인용 약과 아이 약을 분리해 보관해 혼동을 줄이세요.",
];

export const BABY_MEDICINE_FAQ: BabyMedicineFaq[] = [
  {
    question: "아기 상비약은 꼭 준비해야 하나요?",
    answer:
      "밤이나 주말에 갑자기 열이 나거나 설사·구토가 생기면 바로 움직이기 어렵습니다. 체온계, 투약 도구, 복약 기록표, 기본 상비용품을 미리 정리해 두면 병원이나 약국 상담 때 훨씬 정확히 설명할 수 있습니다.",
  },
  {
    question: "아기 상비약 리스트에는 무엇이 들어가나요?",
    answer:
      "체온계, 아기 해열제, 생리식염수, 경구수분보충액, 보습제, 상처 처치용품, 투약 도구, 복약 기록표, 응급 연락처가 기본 항목입니다. 다만 실제 사용 가능 여부는 아이의 나이와 상태, 제품 설명서를 기준으로 확인해야 합니다.",
  },
  {
    question: "이 페이지에서 아기 해열제 용량을 계산해 주나요?",
    answer:
      "아니요. 제품별 농도, 체중, 나이, 기존 질환, 복용 이력에 따라 달라질 수 있어 용량을 자동 계산하지 않습니다. 제품 설명서와 약사·의사 안내를 기준으로 확인하세요.",
  },
  {
    question: "아기 해열제 교차복용은 어떻게 봐야 하나요?",
    answer:
      "이 페이지는 교차복용 방법을 안내하지 않습니다. 대신 성분명과 복용 시간을 기록해 중복 복용을 피하도록 돕습니다. 교차복용이 필요한 상황인지 여부는 약사나 의사에게 확인하는 것이 안전합니다.",
  },
  {
    question: "2세 미만 감기약은 집에서 먹여도 되나요?",
    answer:
      "어린 영유아는 감기 증상에 임의로 약을 먹이기보다 진료 상담을 먼저 확인하는 편이 안전합니다. 특히 기침, 호흡 곤란, 처짐, 수유 저하가 있으면 상담을 미루지 마세요.",
  },
  {
    question: "아스피린을 아이에게 먹여도 되나요?",
    answer:
      "의사 처방 없이 어린이에게 아스피린을 먹이지 않도록 안내합니다. 집에 성인용 약이 있다면 아기 약과 분리해 혼동을 줄이세요.",
  },
  {
    question: "아기가 설사나 구토를 할 때 무엇을 준비해야 하나요?",
    answer:
      "경구수분보충액, 수분 섭취 기록, 소변량 관찰, 체온 기록이 도움이 됩니다. 반복 구토로 물도 못 마시거나 탈수가 의심되면 집에서 버티기보다 상담을 우선하세요.",
  },
  {
    question: "언제 병원 상담을 받아야 하나요?",
    answer:
      "아이가 축 처지거나 숨쉬기 힘들어 보이는 경우, 경련, 얼굴색 변화, 반복 구토, 탈수 의심, 생후 3개월 미만 고열 의심 같은 신호가 있으면 즉시 진료 또는 응급 상담을 권장합니다.",
  },
  {
    question: "유효기간 지난 약은 어떻게 하나요?",
    answer:
      "유효기간이 지난 약은 임의로 사용하지 않는 것이 안전합니다. 원래 용기와 설명서를 확인하고, 약국 수거함 등 지역에서 안내하는 안전한 폐기 방법을 이용하세요.",
  },
];

export const BABY_MEDICINE_REFERENCES: BabyMedicineReferenceLink[] = [
  {
    title: "식품의약품안전처 어린이 약 복용지침",
    desc: "어린이 약 복용, 보관, 성분 확인에 대한 공식 안내",
    url: "https://www.mfds.go.kr/webzine/202301/sub05.html",
  },
  {
    title: "달빛어린이병원",
    desc: "야간·휴일 소아 진료기관을 확인할 때 참고",
    url: "https://www.e-gen.or.kr/moonlight/main.do",
  },
  {
    title: "의약품안전나라",
    desc: "의약품 제품명과 성분 정보를 확인할 때 참고",
    url: "https://nedrug.mfds.go.kr/",
  },
];

export const BABY_MEDICINE_RELATED: BabyMedicineRelatedLink[] = [
  { href: "/tools/baby-growth-percentile-calculator/", label: "아기 성장 백분위 계산기" },
  { href: "/reports/baby-formula-brand-cost-comparison-2026/", label: "분유 브랜드 가격 비교" },
  { href: "/reports/baby-cost-guide-first-year/", label: "첫해 육아비 가이드" },
  { href: "/tools/medical-expense-claim-worth-calculator/", label: "병원비 실손 청구 판단 계산기" },
  { href: "/tools/baby-government-support/", label: "영아 정부지원금 계산기" },
];
