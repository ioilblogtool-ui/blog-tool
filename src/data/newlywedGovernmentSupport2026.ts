export type SupportBadge = "official" | "official-check" | "local-check" | "estimate" | "reference";

export type SupportCategory =
  | "tax"
  | "rentLoan"
  | "purchaseLoan"
  | "subscription"
  | "birthChildcare"
  | "local";

export type ScenarioId =
  | "marriageRegistration"
  | "rentHome"
  | "buyFirstHome"
  | "subscription"
  | "pregnancyBirth"
  | "localSupport";

export type SupportItem = {
  id: string;
  category: SupportCategory;
  title: string;
  shortTitle: string;
  summary: string;
  target: string;
  benefit: string;
  timing: string;
  keyConditions: string[];
  applyWhere: string[];
  badge: SupportBadge;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  caution?: string;
};

export type ScenarioGuide = {
  id: ScenarioId;
  label: string;
  shortLabel: string;
  description: string;
  recommendedSupportIds: string[];
  ctaLabel: string;
  ctaHref: string;
  caution: string;
};

export type ComparisonRow = {
  label: string;
  columns: {
    label: string;
    value: string;
    badge?: SupportBadge;
  }[];
};

export type CheckCard = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

export const NGS_META = {
  slug: "newlywed-government-support-2026",
  title: "2026 신혼부부 정부지원 완전정리",
  seoTitle: "2026 신혼부부 정부지원 총정리 - 혼인세액공제·전세대출·특별공급·출산지원금 | 비교계산소",
  seoDescription:
    "2026년 신혼부부가 확인해야 할 정부지원을 한눈에 정리했습니다. 혼인세액공제, 신혼부부 전세대출, 신생아 특례대출, 신혼부부 특별공급, 생애최초 취득세 감면, 출산·육아 지원금과 지역별 지원 확인법까지 비교하세요.",
  description:
    "결혼신고부터 신혼집, 출산, 청약, 세금까지 신혼부부가 먼저 확인해야 할 정부지원을 한 페이지에서 비교합니다.",
  updatedAt: "2026-07-08",
  기준일: "2026년 7월 기준",
  dataNote:
    "정책대출 금리, 소득 기준, 특별공급 요건, 지자체 지원금은 신청 시점과 공고에 따라 달라질 수 있습니다. 이 리포트는 2026년 기준 확인용 가이드이며 신청 전 공식 기관 공고를 반드시 확인해야 합니다.",
};

export const NGS_BADGE_LABEL: Record<SupportBadge, string> = {
  official: "공식",
  "official-check": "공식 확인",
  "local-check": "지역별 확인",
  estimate: "추정",
  reference: "참고",
};

export const NGS_OVERVIEW_CARDS = [
  {
    category: "tax",
    title: "세금",
    summary: "혼인세액공제, 생애최초·출산가구 취득세 감면",
    target: "혼인신고·첫 집 구입 예정",
  },
  {
    category: "rentLoan",
    title: "전세",
    summary: "신혼부부전용 전세자금, 신생아 특례 버팀목",
    target: "전세 계약 예정",
  },
  {
    category: "purchaseLoan",
    title: "매매",
    summary: "신혼부부 구입자금, 신생아 특례 디딤돌",
    target: "주택 매수 예정",
  },
  {
    category: "subscription",
    title: "청약",
    summary: "신혼부부·생애최초·신생아 공급",
    target: "분양 청약 준비",
  },
  {
    category: "birthChildcare",
    title: "출산·지역",
    summary: "첫만남이용권, 부모급여, 지자체 지원금",
    target: "임신·출산 예정",
  },
] as const;

export const NGS_SUPPORT_ITEMS: SupportItem[] = [
  {
    id: "marriage-tax-credit",
    category: "tax",
    title: "혼인세액공제",
    shortTitle: "혼인세액공제",
    summary: "혼인신고 후 연말정산에서 확인할 수 있는 세액공제 항목입니다.",
    target: "혼인신고를 한 부부",
    benefit: "연말정산 세액공제",
    timing: "혼인신고 연도와 연말정산 시점 확인",
    keyConditions: ["혼인신고", "적용 연도", "부부 각각 적용 여부", "국세청 최신 안내"],
    applyWhere: ["국세청 홈택스", "연말정산 간소화", "회사 연말정산 담당"],
    badge: "official-check",
    sourceName: "국세청",
    sourceUrl: "https://www.nts.go.kr",
    updatedAt: "2026-07-08",
    caution: "공제 금액과 적용 기간은 구현·신청 시점의 국세청 연말정산 안내로 재확인해야 합니다.",
  },
  {
    id: "newlywed-rent-loan",
    category: "rentLoan",
    title: "신혼부부전용 전세자금",
    shortTitle: "신혼 전세대출",
    summary: "무주택 신혼부부의 전세보증금 마련을 돕는 주택도시기금 상품입니다.",
    target: "혼인 기간 요건을 충족한 무주택 신혼부부",
    benefit: "전세자금 대출",
    timing: "임대차계약 후 대출 신청 기한 확인",
    keyConditions: ["혼인 기간", "부부합산 소득", "순자산", "임차보증금", "전용면적"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newborn-rent-loan",
    category: "rentLoan",
    title: "신생아 특례 버팀목대출",
    shortTitle: "신생아 전세대출",
    summary: "출산가구의 전세자금을 지원하는 주택도시기금 특례 상품입니다.",
    target: "일정 기간 내 출산한 무주택 가구",
    benefit: "전세자금 특례대출",
    timing: "대출 신청일과 출산일 기준 확인",
    keyConditions: ["출산 요건", "부부합산 소득", "순자산", "임차보증금", "우대금리"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newlywed-purchase-loan",
    category: "purchaseLoan",
    title: "신혼부부전용 구입자금",
    shortTitle: "신혼 구입대출",
    summary: "무주택 신혼부부의 주택 구입을 지원하는 정책대출입니다.",
    target: "주택 매수를 준비하는 무주택 신혼부부",
    benefit: "주택구입자금 대출",
    timing: "매매계약과 소유권 이전 전후 신청 기한 확인",
    keyConditions: ["혼인 기간", "부부합산 소득", "순자산", "주택가격", "대출한도"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "newborn-didimdol-loan",
    category: "purchaseLoan",
    title: "신생아 특례 디딤돌대출",
    shortTitle: "신생아 구입대출",
    summary: "출산가구의 주택 구입을 지원하는 특례 디딤돌대출입니다.",
    target: "일정 기간 내 출산한 무주택 가구",
    benefit: "주택구입자금 특례대출",
    timing: "대출 신청일과 출산일 기준 확인",
    keyConditions: ["출산 요건", "소득", "순자산", "주택가격", "특례금리"],
    applyWhere: ["주택도시기금", "수탁은행"],
    badge: "official",
    sourceName: "주택도시기금",
    sourceUrl: "https://nhuf.molit.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "first-home-acquisition-tax",
    category: "tax",
    title: "생애최초 주택 취득세 감면",
    shortTitle: "생애최초 취득세",
    summary: "첫 주택 구입 시 취득세 부담을 줄일 수 있는 지방세 감면 제도입니다.",
    target: "본인·배우자 기준 첫 주택 구입자",
    benefit: "취득세 감면",
    timing: "주택 취득일과 감면 신청 시점 확인",
    keyConditions: ["생애최초 여부", "주택가격", "세대 기준", "실거주", "추징 요건"],
    applyWhere: ["위택스", "시군구 세무부서"],
    badge: "official-check",
    sourceName: "위택스·행정안전부",
    sourceUrl: "https://www.wetax.go.kr",
    updatedAt: "2026-07-08",
    caution: "같은 세목 감면은 중복·택일 규정이 있을 수 있으므로 관할 지자체 확인이 필요합니다.",
  },
  {
    id: "newlywed-special-supply",
    category: "subscription",
    title: "신혼부부 특별공급",
    shortTitle: "신혼부부 특공",
    summary: "신혼부부에게 별도 물량을 배정하는 청약 특별공급 유형입니다.",
    target: "혼인 기간·무주택·소득·자산 요건을 충족한 신혼부부",
    benefit: "청약 특별공급 기회",
    timing: "모집공고일 기준 자격 확인",
    keyConditions: ["혼인 기간", "무주택", "청약통장", "소득", "자산", "자녀"],
    applyWhere: ["청약홈", "LH", "마이홈"],
    badge: "official-check",
    sourceName: "청약홈·마이홈",
    sourceUrl: "https://www.applyhome.co.kr",
    updatedAt: "2026-07-08",
    caution: "특별공급 자격과 배점은 모집공고별로 달라질 수 있습니다.",
  },
  {
    id: "birth-childcare-support",
    category: "birthChildcare",
    title: "출산·육아 지원금",
    shortTitle: "출산·육아 지원",
    summary: "첫만남이용권, 부모급여, 아동수당 등 출산 후 바로 확인할 지원입니다.",
    target: "임신·출산 예정 또는 영유아 양육 가구",
    benefit: "바우처·현금성 양육 지원",
    timing: "임신 확인, 출생신고, 출생 후 신청 기한 확인",
    keyConditions: ["출생아 기준", "아동 연령", "신청 기한", "사용처"],
    applyWhere: ["복지로", "정부24", "주민센터"],
    badge: "official-check",
    sourceName: "복지로·정부24",
    sourceUrl: "https://www.bokjiro.go.kr",
    updatedAt: "2026-07-08",
  },
  {
    id: "local-newlywed-support",
    category: "local",
    title: "지역별 결혼·출산·주거 지원",
    shortTitle: "지역별 지원",
    summary: "결혼축하금, 임차보증금 이자지원, 출산지원금처럼 지자체별로 다른 지원입니다.",
    target: "거주지 지자체 요건을 충족한 신혼·출산 가구",
    benefit: "지역별 현금·이자·바우처 지원",
    timing: "혼인신고일, 전입일, 출생신고일, 공고 기간 확인",
    keyConditions: ["주소지", "거주 기간", "혼인신고일", "출생신고일", "예산 소진 여부"],
    applyWhere: ["정부24 보조금24", "지자체 홈페이지", "주민센터"],
    badge: "local-check",
    sourceName: "정부24·지자체",
    sourceUrl: "https://www.gov.kr",
    updatedAt: "2026-07-08",
    caution: "지역 지원은 예산 소진과 공고 기간에 따라 달라지므로 신청 전 지자체 공고를 확인하세요.",
  },
];

export const NGS_SCENARIOS: ScenarioGuide[] = [
  {
    id: "marriageRegistration",
    label: "혼인신고 예정",
    shortLabel: "혼인신고",
    description: "혼인신고일 기준으로 받을 수 있는 세금·지역 지원을 먼저 확인합니다.",
    recommendedSupportIds: ["marriage-tax-credit", "local-newlywed-support", "birth-childcare-support"],
    ctaLabel: "연말정산 환급액 계산하기",
    ctaHref: "/tools/year-end-tax-refund-calculator/",
    caution: "결혼식 날짜가 아니라 가족관계등록부상 혼인신고일이 기준이 되는 경우가 많습니다.",
  },
  {
    id: "rentHome",
    label: "전세집 계약 예정",
    shortLabel: "전세 예정",
    description: "전세보증금, 소득, 자녀 유무에 따라 신혼 전세대출과 신생아 특례를 비교합니다.",
    recommendedSupportIds: ["newlywed-rent-loan", "newborn-rent-loan", "local-newlywed-support"],
    ctaLabel: "전세와 월세 비용 비교하기",
    ctaHref: "/tools/jeonse-vs-wolse-calculator/",
    caution: "대출 금리보다 대출 한도, 보증금 기준, 신청 기한을 함께 봐야 합니다.",
  },
  {
    id: "buyFirstHome",
    label: "첫 집 매수 예정",
    shortLabel: "첫 집 매수",
    description: "정책대출, 취득세 감면, 생애최초 요건을 한 번에 확인합니다.",
    recommendedSupportIds: ["newlywed-purchase-loan", "newborn-didimdol-loan", "first-home-acquisition-tax"],
    ctaLabel: "취득세 감면 전후 계산하기",
    ctaHref: "/tools/real-estate-acquisition-tax/",
    caution: "생애최초 여부는 본인뿐 아니라 배우자와 세대 기준까지 확인해야 합니다.",
  },
  {
    id: "subscription",
    label: "청약 준비 중",
    shortLabel: "청약",
    description: "신혼부부·생애최초·신생아 공급 중 공고별로 유리한 유형을 확인합니다.",
    recommendedSupportIds: ["newlywed-special-supply", "first-home-acquisition-tax", "birth-childcare-support"],
    ctaLabel: "청약 가점 계산하기",
    ctaHref: "/tools/apt-cheonyak-gajum-calculator/",
    caution: "특별공급은 모집공고일 기준 요건과 중복 청약 제한을 반드시 확인해야 합니다.",
  },
  {
    id: "pregnancyBirth",
    label: "임신·출산 예정",
    shortLabel: "출산 예정",
    description: "출산 이후 바로 신청해야 하는 중앙정부·지자체 지원을 정리합니다.",
    recommendedSupportIds: ["birth-childcare-support", "newborn-rent-loan", "newborn-didimdol-loan"],
    ctaLabel: "지역별 출산지원금 보기",
    ctaHref: "/reports/birth-support-by-region-2026/",
    caution: "출생신고 후 신청 기한이 짧은 지자체 지원이 있을 수 있습니다.",
  },
  {
    id: "localSupport",
    label: "지역 지원금 찾는 중",
    shortLabel: "지역지원",
    description: "결혼축하금, 임차보증금 이자지원, 산후조리비 등 지역별 지원 확인 경로를 봅니다.",
    recommendedSupportIds: ["local-newlywed-support", "birth-childcare-support", "newlywed-rent-loan"],
    ctaLabel: "보조금24에서 확인하기",
    ctaHref: "https://www.gov.kr",
    caution: "지자체 지원은 전입 기간, 거주 기간, 예산 소진 여부가 특히 중요합니다.",
  },
];

export const NGS_RENT_LOAN_COMPARE: ComparisonRow[] = [
  {
    label: "핵심 대상",
    columns: [
      { label: "신혼부부전용 전세자금", value: "혼인 기간 요건을 충족한 무주택 신혼부부", badge: "official" },
      { label: "신생아 특례 버팀목", value: "일정 기간 내 출산한 무주택 출산가구", badge: "official" },
    ],
  },
  {
    label: "자녀 요건",
    columns: [
      { label: "신혼부부전용 전세자금", value: "자녀 없음도 가능" },
      { label: "신생아 특례 버팀목", value: "출산 요건 핵심" },
    ],
  },
  {
    label: "먼저 볼 항목",
    columns: [
      { label: "신혼부부전용 전세자금", value: "혼인 기간, 부부합산 소득, 임차보증금, 전용면적" },
      { label: "신생아 특례 버팀목", value: "출산일, 대출 신청일, 맞벌이 기준, 우대금리" },
    ],
  },
  {
    label: "추천 상황",
    columns: [
      { label: "신혼부부전용 전세자금", value: "결혼 초기 전세 진입, 자녀 없는 신혼부부" },
      { label: "신생아 특례 버팀목", value: "출산 후 전세 갈아타기 또는 보증금 증액" },
    ],
  },
];

export const NGS_PURCHASE_LOAN_COMPARE: ComparisonRow[] = [
  {
    label: "핵심 대상",
    columns: [
      { label: "신혼부부전용 구입자금", value: "주택 매수를 준비하는 무주택 신혼부부", badge: "official" },
      { label: "신생아 특례 디딤돌", value: "일정 기간 내 출산한 무주택 가구", badge: "official" },
    ],
  },
  {
    label: "확인 항목",
    columns: [
      { label: "신혼부부전용 구입자금", value: "소득, 순자산, 주택가격, 대출한도" },
      { label: "신생아 특례 디딤돌", value: "출산 요건, 맞벌이 기준, 특례금리, 우대금리" },
    ],
  },
  {
    label: "추천 상황",
    columns: [
      { label: "신혼부부전용 구입자금", value: "자녀 없는 신혼 첫 집 구입" },
      { label: "신생아 특례 디딤돌", value: "출산가구 첫 집 또는 아이가 생긴 뒤 이사" },
    ],
  },
  {
    label: "주의",
    columns: [
      { label: "신혼부부전용 구입자금", value: "금리만 보지 말고 필요 현금까지 계산" },
      { label: "신생아 특례 디딤돌", value: "출산가구라도 주택가격·소득 기준 초과 시 제한" },
    ],
  },
];

export const NGS_TAX_CHECKS: CheckCard[] = [
  { title: "주택 보유 이력", body: "본인과 배우자가 과거 주택, 분양권, 입주권을 보유한 적이 있는지 확인합니다." },
  { title: "세대 기준", body: "부모와 같은 세대인지, 세대분리 상태인지에 따라 무주택 판단이 달라질 수 있습니다." },
  { title: "취득 시점", body: "계약일, 잔금일, 등기일 중 어떤 날짜를 기준으로 보는지 관할 지자체에 확인합니다." },
  { title: "추징 요건", body: "감면 후 실거주, 전입, 매도 제한 등 추징 요건이 있는지 확인합니다." },
];

export const NGS_SUBSCRIPTION_COMPARE = [
  {
    title: "신혼부부 특별공급",
    bestFor: "혼인 기간 요건을 충족하고 자녀가 있거나 계획이 있는 부부",
    checks: ["혼인 기간", "무주택", "소득·자산", "자녀", "청약통장"],
  },
  {
    title: "생애최초 특별공급",
    bestFor: "부부 모두 주택 보유 이력이 없고 첫 집 청약을 노리는 가구",
    checks: ["무주택 이력", "소득세 납부", "청약통장", "혼인·자녀 요건"],
  },
  {
    title: "신생아 특별·우선공급",
    bestFor: "최근 출산한 가구",
    checks: ["출산일", "모집공고일", "무주택", "소득·자산"],
  },
];

export const NGS_BIRTH_SUPPORTS = [
  { title: "임신·출산 진료비 지원", type: "의료비 바우처", check: "임신 확인 후 신청" },
  { title: "첫만남이용권", type: "출생 초기 바우처", check: "출생아 기준 금액과 사용처 확인" },
  { title: "부모급여", type: "영아기 월 지원", check: "만 0세·1세 기준 금액 확인" },
  { title: "아동수당", type: "아동 양육 지원", check: "지급 연령과 신청 시점 확인" },
  { title: "산후조리비 지원", type: "지역별 차이 큼", check: "지자체 공고 확인" },
  { title: "출산지원금", type: "지역별 차이 큼", check: "출생신고 주소지 기준 확인" },
];

export const NGS_LOCAL_SUPPORTS = [
  { title: "결혼축하금", example: "혼인신고 또는 전입 조건 충족 시 지급", where: "지자체 홈페이지, 정부24" },
  { title: "신혼부부 임차보증금 이자지원", example: "전세대출 이자 일부 지원", where: "광역·기초 지자체 주거복지 공고" },
  { title: "출산지원금", example: "첫째·둘째·셋째 이상 차등 지급", where: "지자체 출산장려금 공고" },
  { title: "산후조리비", example: "지역화폐·바우처 형태", where: "보건소, 지자체 복지포털" },
  { title: "이사비·중개보수 지원", example: "청년·신혼·저소득 가구 대상", where: "지자체 청년정책·주거정책 페이지" },
];

export const NGS_OVERLAP_ROWS = [
  { combo: "혼인세액공제 + 전세대출", likelihood: "가능성 높음", caution: "세금과 대출은 성격이 다릅니다." },
  { combo: "신혼부부 대출 + 지자체 이자지원", likelihood: "가능성 있음", caution: "지자체가 인정하는 대출 상품인지 확인합니다." },
  { combo: "신생아 특례대출 + 부모급여", likelihood: "가능성 높음", caution: "주거대출과 양육지원은 성격이 다릅니다." },
  { combo: "생애최초 취득세 + 출산가구 취득세", likelihood: "중복 제한 확인", caution: "같은 세목 감면은 중복·택일 규정이 있을 수 있습니다." },
  { combo: "신혼부부 특공 + 생애최초 특공", likelihood: "공고문 확인", caution: "같은 모집공고 내 중복 청약 제한을 확인합니다." },
];

export const NGS_TIMELINE_CHECKS = [
  { time: "결혼 3~6개월 전", checks: ["혼인신고 예정일", "주거 계약 계획", "부모 세대분리 여부"] },
  { time: "혼인신고 직후", checks: ["혼인세액공제", "지자체 결혼축하금", "가족관계·주민등록 정리"] },
  { time: "전세 계약 전", checks: ["정책대출 가능 여부", "보증금 기준", "대출 신청 기한"] },
  { time: "매매 계약 전", checks: ["취득세 감면", "정책대출", "DSR", "필요 현금"] },
  { time: "청약 공고 전", checks: ["청약통장", "무주택 이력", "소득·자산", "특별공급 유형"] },
  { time: "출생신고 후", checks: ["첫만남이용권", "부모급여", "아동수당", "지자체 출산지원금"] },
];

export const NGS_MISTAKES = [
  "혼인신고일과 결혼식 날짜를 혼동한다.",
  "신혼부부 대출의 혼인 기간과 청약의 신혼 기간을 같다고 생각한다.",
  "부부합산 소득 기준을 세전·세후로 혼동한다.",
  "부모와 같은 세대라 무주택·생애최초 판단이 달라질 수 있다는 점을 놓친다.",
  "지자체 지원금의 전입 기간·거주 기간 조건을 늦게 확인한다.",
  "출산가구 혜택의 기준일이 출생일, 신청일, 공고일 중 무엇인지 확인하지 않는다.",
  "정책대출 금리만 보고 취득세·중개보수·이사비·인테리어비를 빼먹는다.",
];

export const NGS_SOURCE_LINKS = [
  { title: "주택도시기금", source: "정책대출", href: "https://nhuf.molit.go.kr" },
  { title: "청약홈", source: "특별공급", href: "https://www.applyhome.co.kr" },
  { title: "마이홈", source: "주거복지", href: "https://www.myhome.go.kr" },
  { title: "국세청", source: "혼인세액공제", href: "https://www.nts.go.kr" },
  { title: "위택스", source: "취득세 감면", href: "https://www.wetax.go.kr" },
  { title: "복지로", source: "출산·육아 지원", href: "https://www.bokjiro.go.kr" },
  { title: "정부24", source: "보조금24·지역지원", href: "https://www.gov.kr" },
];

export const NGS_FAQ: FaqItem[] = [
  {
    question: "신혼부부 정부지원은 혼인신고를 해야 받을 수 있나요?",
    answer:
      "대부분의 신혼부부 지원은 혼인신고일을 기준으로 판단합니다. 결혼식 날짜가 아니라 가족관계등록부상 혼인신고일, 모집공고일, 대출 신청일을 기준으로 보는 경우가 많으므로 신청 전 기준일을 확인해야 합니다.",
  },
  {
    question: "결혼식만 하고 혼인신고를 안 하면 혼인세액공제를 받을 수 있나요?",
    answer:
      "혼인세액공제는 혼인신고 여부와 적용 연도를 확인해야 하는 세금 혜택입니다. 실제 적용 여부와 공제 금액은 국세청 최신 연말정산 안내를 기준으로 확인해야 합니다.",
  },
  {
    question: "신혼부부 전세대출과 신생아 특례 버팀목대출은 무엇이 다른가요?",
    answer:
      "신혼부부전용 전세자금은 혼인 기간 요건을 중심으로 보고, 신생아 특례 버팀목대출은 출산 요건이 핵심입니다. 실제 유불리는 소득, 보증금, 대출 한도, 금리, 우대금리에 따라 달라집니다.",
  },
  {
    question: "신혼부부 구입자금과 신생아 특례 디딤돌 중 무엇이 유리한가요?",
    answer:
      "최근 출산한 가구라면 신생아 특례 디딤돌을 먼저 비교할 가치가 있습니다. 다만 신혼부부전용 구입자금과 신생아 특례 모두 주택가격, 소득, 자산, 대출한도 조건을 따로 충족해야 합니다.",
  },
  {
    question: "신혼부부 특별공급은 자녀가 없어도 신청할 수 있나요?",
    answer:
      "공급 유형과 공고에 따라 자녀 여부, 혼인 기간, 소득, 자산, 청약통장 요건이 달라집니다. 자녀가 없더라도 가능한 유형이 있을 수 있지만 모집공고문 확인이 필수입니다.",
  },
  {
    question: "지역별 결혼축하금은 어디서 확인하나요?",
    answer:
      "정부24 보조금24, 거주 지자체 홈페이지, 읍면동 주민센터, 지자체 청년·인구정책 페이지에서 확인하는 것이 가장 정확합니다.",
  },
  {
    question: "출산지원금은 중앙정부 지원과 지자체 지원을 둘 다 받을 수 있나요?",
    answer:
      "첫만남이용권, 부모급여, 아동수당 같은 중앙정부 지원과 지자체 출산지원금은 성격이 달라 함께 받을 수 있는 경우가 많습니다. 다만 지자체 지원은 거주 기간과 신청 기한을 확인해야 합니다.",
  },
];

export const NGS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/newlywed-cost-2026/",
    label: "신혼부부 결혼·신혼집 비용 완전 분석",
    description: "신혼집, 혼수, 초기 생활비를 먼저 파악합니다.",
  },
  {
    href: "/reports/first-home-buyer-benefits-2026/",
    label: "생애최초 주택 구입 혜택 완전 분석",
    description: "취득세 감면, 정책대출, 특별공급을 더 자세히 봅니다.",
  },
  {
    href: "/reports/birth-support-by-region-2026/",
    label: "지역별 출산지원금 비교",
    description: "출산 후 받을 수 있는 지역별 지원금을 비교합니다.",
  },
  {
    href: "/tools/jeonse-vs-wolse-calculator/",
    label: "전세 vs 월세 비용 비교 계산기",
    description: "전세대출 전 실제 비용 차이를 계산합니다.",
  },
];
