export type DataBadge = "공식" | "참고" | "추정";

export type CareType = "center" | "helper" | "hybrid";

export type ComparisonRow = {
  label: string;
  center: string;
  helper: string;
  note?: string;
};

export type CostSummary = {
  id: string;
  label: string;
  period: string;
  costRange: string;
  support: string;
  outOfPocket: string;
  badge: DataBadge;
  note: string;
};

export type DecisionQuestion = {
  id: string;
  question: string;
  yesCareType: CareType;
  noCareType: CareType;
  weight: number;
};

export type RecommendationScenario = {
  id: string;
  title: string;
  recommended: CareType;
  summary: string;
  reasons: string[];
  cautions: string[];
};

export type HybridScenario = {
  id: string;
  title: string;
  composition: string;
  budgetDirection: string;
  suitableFor: string[];
};

export type SupportStep = {
  title: string;
  detail: string;
};

export type RelatedLink = {
  href: string;
  type: string;
  title: string;
  description: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export const PNC_META = {
  slug: "postnatal-care-comparison-2026",
  title: "2026 산후도우미 vs 산후조리원 완전 비교",
  seoTitle: "2026 산후도우미 vs 산후조리원 비교 | 비용·정부지원·추천 기준 총정리",
  seoDescription:
    "산후조리원 2주 비용과 산후도우미 정부지원 바우처, 첫째·둘째·쌍태아 상황별 추천 기준을 2026년 기준으로 비교합니다.",
  updatedAt: "2026-04",
  dataNote:
    "이 리포트는 공개 자료와 지자체 안내를 바탕으로 작성한 비교 목적 자료입니다. 실제 지원금과 요금은 거주지, 소득 구간, 출산 순위, 제공기관에 따라 달라집니다.",
};

export const PNC_HERO_STATS = [
  {
    label: "산후조리원",
    value: "2주 수백만 원대",
    note: "지역·등급별 편차 큼",
    badge: "참고" as DataBadge,
  },
  {
    label: "산후도우미",
    value: "5~20일 이상",
    note: "정부 바우처 적용 가능",
    badge: "공식" as DataBadge,
  },
  {
    label: "첫째 출산",
    value: "조리원 선호",
    note: "신생아 케어 학습 수요 높음",
    badge: "추정" as DataBadge,
  },
  {
    label: "둘째 이상",
    value: "도우미 선호",
    note: "가정 동선 유지가 중요",
    badge: "추정" as DataBadge,
  },
];

export const PNC_COMPARISON_ROWS: ComparisonRow[] = [
  { label: "이용 장소", center: "전문 시설 입소", helper: "자택 방문" },
  { label: "대표 기간", center: "보통 2주", helper: "5일~20일 이상" },
  { label: "비용 구조", center: "대부분 본인부담, 일부 지자체 지원", helper: "정부 바우처 + 본인부담금" },
  { label: "식사", center: "조리원 식사 제공", helper: "가정식 또는 일부 지원" },
  { label: "신생아 케어", center: "24시간 관리 체계", helper: "정해진 방문 시간 내 관리" },
  { label: "산모 회복", center: "휴식·마사지·수유교육 집중", helper: "집 환경과 가족 지원에 따라 차이" },
  { label: "배우자 역할", center: "상대적으로 적음", helper: "가정 돌봄 참여 가능" },
  { label: "주요 리스크", center: "고비용, 감염 우려, 예약 경쟁", helper: "매칭 품질 편차, 집안 환경 영향" },
];

export const PNC_COST_SUMMARY: CostSummary[] = [
  {
    id: "center-national",
    label: "산후조리원 전국 평균",
    period: "2주 기준",
    costRange: "약 370만 원대",
    support: "일부 지자체 지원 가능",
    outOfPocket: "대부분 본인부담",
    badge: "참고",
    note: "일반실 기준 공개 자료 기반 요약입니다.",
  },
  {
    id: "center-seoul",
    label: "서울 산후조리원",
    period: "2주 기준",
    costRange: "약 490만 원대 이상 가능",
    support: "공공·지자체 지원 여부 확인 필요",
    outOfPocket: "지역과 시설 등급별 차이 큼",
    badge: "참고",
    note: "민간 조리원은 강남권·특실에서 고가 사례가 많습니다.",
  },
  {
    id: "helper-standard",
    label: "산후도우미 표준형",
    period: "10일 예시",
    costRange: "서비스 가격은 정부 고시·지역별 기준 확인",
    support: "소득 구간·출산 순위별 차등",
    outOfPocket: "지원금 차감 후 부담",
    badge: "공식",
    note: "산모·신생아 건강관리 지원사업 기준입니다.",
  },
];

export const PNC_DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: "first_birth",
    question: "첫째 출산이고 신생아 돌봄 경험이 거의 없나요?",
    yesCareType: "center",
    noCareType: "helper",
    weight: 2,
  },
  {
    id: "budget_sensitive",
    question: "2주 조리원 비용이 예산에서 큰 부담인가요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 2,
  },
  {
    id: "family_support",
    question: "배우자나 가족이 낮 시간 돌봄을 함께 할 수 있나요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 1,
  },
  {
    id: "home_child",
    question: "집에 돌봐야 할 첫째 아이가 있나요?",
    yesCareType: "helper",
    noCareType: "center",
    weight: 2,
  },
  {
    id: "recovery_priority",
    question: "산모 휴식과 회복 공간을 최우선으로 두나요?",
    yesCareType: "center",
    noCareType: "helper",
    weight: 2,
  },
  {
    id: "hybrid_possible",
    question: "조리원 1주 + 도우미 2주처럼 병행할 예산과 일정이 있나요?",
    yesCareType: "hybrid",
    noCareType: "helper",
    weight: 1,
  },
];

export const PNC_RESULT_COPY: Record<CareType, { title: string; copy: string; cta: string; href: string }> = {
  center: {
    title: "산후조리원 우선 검토",
    copy: "초기 회복, 신생아 케어 교육, 산모 휴식 확보가 중요한 조건입니다. 2주 비용과 추가비를 먼저 확인하세요.",
    cta: "산후조리원 비용 비교 보기",
    href: "/reports/postpartum-center-cost-2026/",
  },
  helper: {
    title: "산후도우미 우선 검토",
    copy: "가정 동선 유지와 비용 절감이 중요한 조건입니다. 정부지원 대상 여부와 제공기관 매칭 품질을 확인하세요.",
    cta: "출산 지원금 계산하기",
    href: "/tools/birth-support-total/",
  },
  hybrid: {
    title: "조리원 + 산후도우미 병행 검토",
    copy: "초기 회복과 퇴소 후 적응을 모두 고려해야 하는 조건입니다. 조리원 1주 + 도우미 2주 같은 절충안을 비교하세요.",
    cta: "육아휴직 현금흐름 보기",
    href: "/tools/parental-leave-pay/",
  },
};

export const PNC_RECOMMENDATION_SCENARIOS: RecommendationScenario[] = [
  {
    id: "first-birth",
    title: "첫째 출산, 돌봄 경험이 적은 가정",
    recommended: "center",
    summary: "산후조리원 2주 또는 조리원 1주 + 도우미 병행을 우선 검토합니다.",
    reasons: ["신생아 케어와 수유 교육을 집중적으로 받을 수 있음", "산모가 회복에 집중하기 쉬움"],
    cautions: ["시설별 감염관리와 추가비 항목을 확인해야 함", "예약 경쟁이 높을 수 있음"],
  },
  {
    id: "second-plus",
    title: "둘째 이상 출산, 첫째 돌봄이 필요한 가정",
    recommended: "helper",
    summary: "가정 동선을 유지하면서 산후도우미를 쓰는 방식이 현실적입니다.",
    reasons: ["첫째 아이와 분리되는 부담을 줄일 수 있음", "정부지원 적용 시 실부담금이 낮아질 수 있음"],
    cautions: ["도우미 매칭 품질과 교체 기준을 사전에 확인해야 함"],
  },
  {
    id: "twins",
    title: "쌍태아·다태아 출산",
    recommended: "hybrid",
    summary: "초기 회복은 조리원, 퇴소 후 적응은 산후도우미로 나누는 병행형을 검토합니다.",
    reasons: ["돌봄 강도가 높아 한 가지 방식만으로 부족할 수 있음", "서비스 기간과 지원금이 단태아와 다를 수 있음"],
    cautions: ["조리원 추가요금과 도우미 인력 기준을 별도로 확인해야 함"],
  },
  {
    id: "spouse-leave",
    title: "배우자 육아휴직 또는 재택 지원 가능",
    recommended: "helper",
    summary: "산후도우미와 배우자 돌봄을 조합하면 비용과 적응 측면의 균형이 좋습니다.",
    reasons: ["집에서 생활 루틴을 빠르게 만들 수 있음", "야간·주말 돌봄 공백을 가족이 보완할 수 있음"],
    cautions: ["배우자 역할 분담표를 출산 전에 정해야 함"],
  },
];

export const PNC_HYBRID_SCENARIOS: HybridScenario[] = [
  {
    id: "center-2w",
    title: "산후조리원 2주",
    composition: "조리원 2주 + 퇴소 후 가족 돌봄",
    budgetDirection: "비용은 높지만 초기 회복과 교육 집중",
    suitableFor: ["첫째 출산", "회복 지원이 부족한 가정", "수유·목욕 교육이 필요한 가정"],
  },
  {
    id: "helper-3w",
    title: "산후도우미 3주",
    composition: "산후도우미 표준·연장형 + 배우자 또는 가족 지원",
    budgetDirection: "정부지원 적용 시 실부담금 절감 가능",
    suitableFor: ["둘째 이상", "집에서 회복하고 싶은 가정", "첫째 아이 동선 유지가 필요한 가정"],
  },
  {
    id: "hybrid-1w-2w",
    title: "조리원 1주 + 산후도우미 2주",
    composition: "초기 회복은 시설, 퇴소 후 적응은 자택",
    budgetDirection: "회복과 비용 절감의 절충안",
    suitableFor: ["예산 부담이 있는 첫째 출산", "쌍태아·다태아", "퇴소 후 돌봄 공백이 걱정되는 가정"],
  },
];

export const PNC_SUPPORT_STEPS: SupportStep[] = [
  {
    title: "신청 시점",
    detail: "보통 출산예정일 전부터 신청할 수 있으므로 임신 후기에는 거주지 보건소 기준을 먼저 확인합니다.",
  },
  {
    title: "지원 기준",
    detail: "소득 구간, 출산 순위, 태아 유형, 예외지원 여부에 따라 정부지원금과 본인부담금이 달라집니다.",
  },
  {
    title: "이용 기간",
    detail: "단축·표준·연장형 선택에 따라 5일, 10일, 15일, 20일 이상으로 달라질 수 있습니다.",
  },
  {
    title: "제공기관",
    detail: "가격보다 관리사 교체 기준, 후기, 매칭 속도, 쌍태아 대응 가능 여부를 함께 봐야 합니다.",
  },
];

export const PNC_CHECKLIST = [
  "조리원 기본요금과 추가요금을 분리해서 확인했다",
  "보호자 식사, 마사지, 신생아 추가 케어 비용을 확인했다",
  "산후도우미 바우처 신청 가능 기간을 확인했다",
  "소득 구간과 예외지원 대상 여부를 확인했다",
  "도우미 제공기관의 교체 기준과 후기 기준을 확인했다",
  "배우자 육아휴직 또는 가족 지원 일정을 정했다",
  "퇴소 후 첫 1주일의 식사·청소·야간 돌봄 계획을 세웠다",
];

export const PNC_SAVING_TIPS = [
  "산후조리원은 기본요금보다 추가 마사지, 보호자 식사, 신생아 추가 케어 비용을 먼저 확인합니다.",
  "서울 고가 조리원이 부담되면 공공 산후조리원, 수도권 대체권, 조리원 1주 조합을 함께 비교합니다.",
  "산후도우미는 정부지원 대상 여부를 먼저 확인하고, 민간 프리미엄 서비스와 구분해서 견적을 봅니다.",
  "배우자 육아휴직이나 가족 지원이 가능하면 산후도우미 기간을 늘리는 방식이 비용 대비 효율적일 수 있습니다.",
  "쌍태아·다태아는 조리원 추가요금과 도우미 인력 기준이 달라질 수 있으므로 단태아 견적으로 판단하지 않습니다.",
];

export const PNC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/postpartum-center-cost-2026/",
    type: "관련 리포트",
    title: "2026 산후조리원 비용 완전 비교",
    description: "전국 평균, 서울, 공공·민간, 일반실·특실 비용을 더 자세히 비교합니다.",
  },
  {
    href: "/tools/birth-support-total/",
    type: "계산기",
    title: "출산~2세 총지원금 계산기",
    description: "거주지와 출생 시점을 기준으로 받을 수 있는 지원금 흐름을 확인합니다.",
  },
  {
    href: "/tools/parental-leave-pay/",
    type: "계산기",
    title: "육아휴직 급여 계산기",
    description: "산후조리 이후 이어지는 월별 현금흐름을 함께 계산합니다.",
  },
  {
    href: "/reports/baby-cost-guide-first-year/",
    type: "관련 리포트",
    title: "신생아~돌까지 육아 비용 총정리",
    description: "조리원 이후 1년 동안 이어지는 분유, 기저귀, 병원비까지 봅니다.",
  },
];

export const PNC_FAQ: FaqItem[] = [
  {
    q: "산후조리원과 산후도우미 중 어느 쪽이 더 저렴한가요?",
    a: "대체로 산후도우미가 더 저렴합니다. 산후조리원은 2주 기준 수백만 원대 비용이 발생하는 반면, 산후도우미는 정부 바우처 지원을 받을 수 있어 실부담금이 낮아질 수 있습니다. 다만 거주지, 소득 구간, 출산 순위, 서비스 기간에 따라 달라집니다.",
  },
  {
    q: "첫째 출산이면 산후조리원이 꼭 필요한가요?",
    a: "꼭 필요한 것은 아니지만, 신생아 케어 경험이 적고 산모 회복 지원이 부족하다면 산후조리원이 도움이 될 수 있습니다. 비용 부담이 크다면 조리원 1주 + 산후도우미 2주 조합도 검토할 수 있습니다.",
  },
  {
    q: "둘째 이상 출산이면 산후도우미가 더 나은가요?",
    a: "첫째 아이 돌봄과 가정 동선 유지가 중요하다면 산후도우미가 현실적인 선택이 될 수 있습니다. 다만 산모가 충분히 쉴 수 있는 공간과 가족의 역할 분담이 준비되어 있어야 합니다.",
  },
  {
    q: "산후도우미 정부지원은 누구나 받을 수 있나요?",
    a: "산모·신생아 건강관리 지원사업은 소득 구간, 출산 순위, 태아 유형, 예외지원 여부에 따라 지원금이 달라집니다. 신청 전 거주지 보건소, 복지로, 지자체 안내에서 최신 기준을 확인해야 합니다.",
  },
  {
    q: "산후조리원 비용은 정부지원으로 차감되나요?",
    a: "중앙정부 바우처가 산후조리원 기본 이용료를 직접 차감하는 구조는 제한적입니다. 일부 지자체 산후조리비 지원이나 공공 산후조리원 이용 가능 여부를 별도로 확인해야 합니다.",
  },
  {
    q: "산후도우미는 야간에도 이용할 수 있나요?",
    a: "정부지원 서비스는 정해진 방문 시간과 서비스 유형을 기준으로 운영됩니다. 야간·입주형·프리미엄 서비스는 민간 업체 별도 상품일 수 있으므로 비용과 지원 적용 여부를 구분해야 합니다.",
  },
  {
    q: "쌍둥이 출산은 어떤 방식을 추천하나요?",
    a: "쌍둥이·다태아는 돌봄 강도가 높아 조리원과 산후도우미 병행을 검토하는 것이 현실적입니다. 조리원 추가요금, 신생아실 기준, 도우미 인력 배치 기준을 사전에 확인해야 합니다.",
  },
  {
    q: "산후우울감이 걱정되면 어떤 기준을 우선해야 하나요?",
    a: "비용보다 산모의 수면, 정서적 지지, 돌봄 공백을 우선해야 합니다. 우울감이 지속되거나 일상 기능에 영향을 준다면 산부인과, 정신건강복지센터, 보건소 등 전문기관 상담을 권장합니다.",
  },
];
