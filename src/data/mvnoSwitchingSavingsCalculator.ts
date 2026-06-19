// mvnoSwitchingSavingsCalculator.ts
// 알뜰폰 갈아타기 절약 계산기 — 데이터

export interface MvnoPreset {
  id: string;
  label: string;
  fee: number;
  dataDesc: string;
  callDesc: string;
  note: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  importance: "high" | "medium" | "low";
  conclusion: string;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const MVSS_META = {
  slug: "mvno-switching-savings-calculator",
  title: "알뜰폰 갈아타기 절약 계산기 2026 | 월·1년·2년 통신비 절감액 계산",
  description:
    "현재 요금제와 알뜰폰 예상 요금 입력하면 월·1년·2년 절감액 즉시 계산. 가족결합·선택약정 해지 시 손익분기점까지 한눈에 비교.",
  updatedAt: "2026년 6월 기준",
  caution:
    "실제 위약금·해지 조건은 현재 계약서와 해당 통신사 고객센터에서 확인하세요. 요금제 예시는 참고용입니다.",
};

export const MVSS_DEFAULT = {
  baseFee: 65000,
  familyDiscount: 0,
  contractDiscount: 0,
  earlyTermFee: 0,
  mvnoFee: 25000,
  familyLost: false,
  familyLossAmount: 0,
  period: 24,
};

export const MVSS_PRESETS: MvnoPreset[] = [
  {
    id: "ultra-cheap",
    label: "초저가",
    fee: 7700,
    dataDesc: "1GB+속도제한",
    callDesc: "기본 통화",
    note: "어르신·단순 통화용",
  },
  {
    id: "mid",
    label: "중간",
    fee: 15000,
    dataDesc: "10GB+속도제한",
    callDesc: "무제한",
    note: "가성비 추천",
  },
  {
    id: "data-heavy",
    label: "데이터 많이",
    fee: 25000,
    dataDesc: "30GB+속도제한",
    callDesc: "무제한",
    note: "유튜브·SNS 많이",
  },
  {
    id: "unlimited",
    label: "무제한",
    fee: 39000,
    dataDesc: "완전 무제한",
    callDesc: "무제한",
    note: "헤비유저용",
  },
  {
    id: "sub-phone",
    label: "서브폰",
    fee: 12000,
    dataDesc: "데이터 쉐어링",
    callDesc: "기본 통화",
    note: "자녀폰·보조폰용",
  },
];

export const MVSS_CHECKLIST: ChecklistItem[] = [
  {
    id: "network",
    title: "망 품질",
    detail: "이통3사(SKT·KT·LGU+) 망을 임차해 서비스합니다. 같은 기지국을 쓰기 때문에 일반적인 통화·데이터 품질은 거의 차이 없습니다.",
    importance: "high",
    conclusion: "일반 사용자는 체감 차이 없는 경우 많음",
  },
  {
    id: "cs",
    title: "고객센터",
    detail: "대형 이통사보다 불편합니다. 챗봇·앱 위주이고, 전화 상담이 제한적인 경우가 많습니다.",
    importance: "medium",
    conclusion: "앱·챗봇에 익숙하면 큰 문제 없음",
  },
  {
    id: "handset",
    title: "단말기 지원금",
    detail: "알뜰폰은 단말기 지원금이 없거나 미미합니다. 자급제 폰을 구매해 개통하는 방식이 유리합니다.",
    importance: "high",
    conclusion: "자급제 폰 보유 또는 구매 예정이면 문제없음",
  },
  {
    id: "family",
    title: "가족결합 불가",
    detail: "이통3사 가족결합 플랜은 알뜰폰 전환 시 해지됩니다. 알뜰폰끼리는 일부 결합이 가능합니다.",
    importance: "high",
    conclusion: "가족결합 할인이 크지 않으면 전환 유리",
  },
  {
    id: "5g",
    title: "5G 지원",
    detail: "LTE 전용 요금제가 많습니다. 5G 요금제는 일부 알뜰폰만 제공하므로 가입 전 확인이 필요합니다.",
    importance: "medium",
    conclusion: "5G 필요 없으면 LTE로도 충분",
  },
  {
    id: "roaming",
    title: "로밍 서비스",
    detail: "국제로밍 서비스가 제한적입니다. 해외 여행이 잦은 분은 유심 대여 또는 현지 유심 활용을 추천합니다.",
    importance: "low",
    conclusion: "해외 여행 잦으면 현지 유심 활용 병행",
  },
  {
    id: "membership",
    title: "멤버십 혜택",
    detail: "SKT T멤버십, KT 멤버십 등 이통3사 멤버십 혜택이 상실됩니다.",
    importance: "medium",
    conclusion: "멤버십을 적극 활용 중이라면 혜택 가치를 먼저 계산",
  },
  {
    id: "mnp",
    title: "번호이동 절차",
    detail: "알뜰폰 홈페이지 또는 앱에서 온라인 신청 가능합니다. 신청 후 10~30분 내 개통 완료가 일반적입니다.",
    importance: "low",
    conclusion: "절차 복잡함 걱정은 기우. 30분이면 완료",
  },
];

export const MVSS_FAQ: PageFaqItem[] = [
  {
    question: "알뜰폰으로 갈아타면 가족결합 할인은 어떻게 되나요?",
    answer:
      "이통3사(SKT·KT·LGU+)의 가족결합 플랜은 알뜰폰 전환 시 해지됩니다. 가족 구성원 전체의 결합 할인이 사라지므로, 가족결합 할인 총액과 알뜰폰 전환으로 절약되는 금액을 비교해 결정해야 합니다. 이 계산기의 '가족결합 상실 추가 부담' 항목에 상실되는 할인금액을 입력하면 실질 절감액을 함께 계산할 수 있습니다.",
  },
  {
    question: "선택약정 24개월 약정 중 해지하면 위약금이 얼마나 나오나요?",
    answer:
      "선택약정 위약금은 잔여 약정 기간과 할인받은 금액을 기준으로 계산됩니다. 통신사·요금제·잔여 개월수에 따라 다르므로, 해당 통신사 고객센터(114) 또는 공식 앱에서 '위약금 조회'로 정확한 금액을 확인한 뒤 이 계산기의 '잔여 위약금' 항목에 입력하면 됩니다.",
  },
  {
    question: "알뜰폰이 이통3사보다 통화·데이터 품질이 나쁜가요?",
    answer:
      "알뜰폰은 이통3사(SKT·KT·LGU+)의 망을 임차해 서비스합니다. 같은 물리적 기지국을 쓰기 때문에 일반적인 통화·데이터 품질은 크게 다르지 않습니다. 다만 네트워크 혼잡 시 우선순위가 낮을 수 있고, 일부 알뜰폰은 5G 대신 LTE 망만 제공합니다.",
  },
  {
    question: "번호이동은 어떻게 하나요? 절차가 복잡한가요?",
    answer:
      "알뜰폰 통신사 홈페이지 또는 앱에서 온라인으로 신청할 수 있습니다. 기존 번호를 이동(MNP)하는 방식으로, 보통 신청 후 10~30분 내 개통이 완료됩니다. 서류 준비·대리점 방문 없이 온라인으로 처리가 가능해 절차가 간단한 편입니다.",
  },
  {
    question: "알뜰폰에서도 5G를 쓸 수 있나요?",
    answer:
      "일부 알뜰폰 통신사는 5G 요금제를 제공합니다. 단, 모든 알뜰폰이 5G를 지원하는 건 아니며 LTE 전용 요금제가 더 많습니다. 5G가 반드시 필요한 사용자라면 가입 전 해당 알뜰폰 통신사의 5G 지원 여부를 확인하세요.",
  },
];

export const MVSS_RELATED_LINKS = [
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
  { href: "/tools/couple-salary-rank-calculator/", label: "맞벌이 가구소득 계산기" },
];
