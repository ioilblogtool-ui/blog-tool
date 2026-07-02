export type EvidenceBadge = "공식" | "확인 필요" | "참고";
export type ProgramId = "seoul" | "gyeonggi";

export interface YouthProgram {
  id: ProgramId;
  region: string;
  officialName: string;
  searchName: string;
  oneLine: string;
  targetCore: string;
  amountLabel: string;
  paymentMethod: string;
  ageLabel: string;
  residenceLabel: string;
  incomeLabel: string;
  jobStatusLabel: string;
  applicationRhythm: string;
  firstCheck: string;
  badge: EvidenceBadge;
  tone: "blue" | "green";
}

export interface SummaryCard {
  label: string;
  value: string;
  note: string;
  badge: EvidenceBadge;
}

export interface ComparisonRow {
  item: string;
  seoul: string;
  gyeonggi: string;
  takeaway: string;
  badge: EvidenceBadge;
}

export interface ScenarioCard {
  title: string;
  person: string;
  likelyProgram: string;
  reason: string;
  caution: string;
}

export interface MigrationPoint {
  title: string;
  desc: string;
}

export interface SourceLink {
  label: string;
  href: string;
  type: "공식" | "신청" | "참고";
}

export interface FaqItem {
  q: string;
  a: string;
}

export const SGYA_META = {
  seoTitle: "서울 vs 경기 청년수당 비교 2026 | 청년수당·청년기본소득 조건 차이 정리 — 비교계산소",
  seoDescription:
    "서울 청년수당과 경기도 청년기본소득을 나이, 거주, 소득, 취업 상태, 지급 방식 기준으로 비교합니다. 경기 청년수당 검색어와 공식 제도명의 차이까지 정리했습니다.",
  updatedAt: "2026-07-02",
  dataSourceLabel: "서울 청년몽땅정보통·경기도 청년기본소득·잡아바 어플라이 공식 안내",
  notice:
    "이 리포트는 서울 청년수당과 경기도 청년기본소득의 대표 구조를 비교하는 참고 자료입니다. 실제 신청 가능 여부는 신청 연도 공고, 주민등록 기준일, 소득·취업 상태, 중복수급 제한, 시군별 운영 여부에 따라 달라집니다.",
};

export const SGYA_PROGRAMS: YouthProgram[] = [
  {
    id: "seoul",
    region: "서울",
    officialName: "서울 청년수당",
    searchName: "서울 청년수당",
    oneLine: "서울 거주 미취업 청년의 구직·진로 탐색을 돕는 활동지원형 수당입니다.",
    targetCore: "서울 거주, 미취업 또는 단기근로 청년",
    amountLabel: "월 50만 원, 최대 6개월",
    paymentMethod: "체크카드성 포인트·현금성 사용 관리",
    ageLabel: "보통 만 19~34세",
    residenceLabel: "신청일 기준 서울시 주민등록",
    incomeLabel: "공고별 건강보험료 기준 확인",
    jobStatusLabel: "미취업·단기근로 등 공고 기준 확인",
    applicationRhythm: "연 1~2회 모집 공고 중심",
    firstCheck: "졸업·중퇴·제적 여부와 미취업 상태를 먼저 확인",
    badge: "공식",
    tone: "blue",
  },
  {
    id: "gyeonggi",
    region: "경기",
    officialName: "경기도 청년기본소득",
    searchName: "경기 청년수당",
    oneLine: "만 24세 경기도 청년에게 분기별 지역화폐를 지급하는 기본소득형 제도입니다.",
    targetCore: "경기도 거주 요건을 채운 만 24세 청년",
    amountLabel: "분기별 25만 원, 연 최대 100만 원",
    paymentMethod: "시군 지역화폐",
    ageLabel: "만 24세 생년월일 범위",
    residenceLabel: "최근 3년 계속 또는 합산 10년 이상 경기도 거주",
    incomeLabel: "소득·취업 상태 요건 없음",
    jobStatusLabel: "취업자·구직자 모두 가능",
    applicationRhythm: "분기별 신청 공고 중심",
    firstCheck: "만 24세 생년월일 범위와 주민등록 거주기간을 먼저 확인",
    badge: "공식",
    tone: "green",
  },
];

export const SGYA_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "서울 핵심",
    value: "구직활동 지원",
    note: "금액보다 미취업·졸업상태·소득 기준이 먼저입니다.",
    badge: "공식",
  },
  {
    label: "경기 핵심",
    value: "만 24세 기본소득",
    note: "검색어는 청년수당이어도 공식명은 청년기본소득입니다.",
    badge: "공식",
  },
  {
    label: "가장 큰 차이",
    value: "취업 상태",
    note: "서울은 구직활동 성격, 경기는 취업 여부와 무관한 연령·거주 중심입니다.",
    badge: "참고",
  },
  {
    label: "구현 기준일",
    value: "2026.07.02",
    note: "모집기간·시군별 운영 여부는 신청 직전 공식 공고 재확인이 필요합니다.",
    badge: "확인 필요",
  },
];

export const SGYA_COMPARISON_ROWS: ComparisonRow[] = [
  {
    item: "공식 제도명",
    seoul: "서울 청년수당",
    gyeonggi: "경기도 청년기본소득",
    takeaway: "경기 청년수당은 검색어로 쓰이지만 공식 제도명은 청년기본소득입니다.",
    badge: "공식",
  },
  {
    item: "지원 성격",
    seoul: "구직활동·진로 탐색 지원",
    gyeonggi: "청년 기본소득·지역화폐 지원",
    takeaway: "서울은 활동지원, 경기는 연령·거주 중심의 정기 지급에 가깝습니다.",
    badge: "참고",
  },
  {
    item: "지원 금액",
    seoul: "월 50만 원, 최대 6개월",
    gyeonggi: "분기별 25만 원, 연 최대 100만 원",
    takeaway: "총액만 보면 서울이 크지만, 대상 조건이 완전히 다릅니다.",
    badge: "공식",
  },
  {
    item: "나이",
    seoul: "보통 만 19~34세",
    gyeonggi: "만 24세 생년월일 범위",
    takeaway: "경기는 만 24세라는 좁은 창이 핵심입니다.",
    badge: "공식",
  },
  {
    item: "거주 요건",
    seoul: "서울시 주민등록",
    gyeonggi: "최근 3년 계속 또는 합산 10년 이상 경기도 거주",
    takeaway: "경기는 거주기간 계산이 가장 중요합니다.",
    badge: "공식",
  },
  {
    item: "소득 기준",
    seoul: "건강보험료·중위소득 등 공고 기준 확인",
    gyeonggi: "소득 기준 없음",
    takeaway: "서울은 소득 확인, 경기는 나이·거주 확인이 우선입니다.",
    badge: "확인 필요",
  },
  {
    item: "취업 상태",
    seoul: "미취업·단기근로 등 제한 확인",
    gyeonggi: "취업 여부와 무관",
    takeaway: "직장인이면 경기 쪽은 가능성이 있지만 서울은 제한될 수 있습니다.",
    badge: "공식",
  },
  {
    item: "지급 방식",
    seoul: "청년수당 전용 카드·사용 제한 관리",
    gyeonggi: "시군 지역화폐",
    takeaway: "사용처 제한의 성격이 다르므로 같은 제한으로 보면 안 됩니다.",
    badge: "공식",
  },
  {
    item: "신청 주기",
    seoul: "모집 공고 기간 내 신청",
    gyeonggi: "분기별 신청",
    takeaway: "서울은 모집 공고를 놓치지 않는 것이, 경기는 분기별 생년월일 범위 확인이 중요합니다.",
    badge: "확인 필요",
  },
];

export const SGYA_SCENARIOS: ScenarioCard[] = [
  {
    title: "서울 거주 취업준비생",
    person: "만 27세, 서울 거주, 졸업 후 미취업",
    likelyProgram: "서울 청년수당 우선 확인",
    reason: "서울 청년수당은 구직활동과 진로 탐색을 지원하는 구조라 미취업 상태가 핵심 조건입니다.",
    caution: "건강보험료 기준, 최종학력 상태, 국민취업지원제도 등 중복 제한을 같이 확인해야 합니다.",
  },
  {
    title: "경기도 거주 직장인",
    person: "만 24세, 수원 거주, 재직 중",
    likelyProgram: "경기도 청년기본소득 우선 확인",
    reason: "경기도 청년기본소득은 취업 여부가 핵심 제한이 아니고, 만 24세와 거주기간이 먼저입니다.",
    caution: "분기별 생년월일 범위와 시군별 운영 여부, 지역화폐 수령 방식을 확인해야 합니다.",
  },
  {
    title: "서울에서 경기로 이사 예정",
    person: "만 23세, 서울 거주 중이나 경기 이사 예정",
    likelyProgram: "주민등록 기준일 확인",
    reason: "두 제도 모두 신청일 또는 기준일의 주민등록이 중요합니다. 이사 시점에 따라 대상 지역이 달라질 수 있습니다.",
    caution: "경기 청년기본소득은 단순 전입만으로 부족할 수 있고, 최근 3년 계속 또는 합산 10년 거주 요건을 따져야 합니다.",
  },
  {
    title: "만 30세 경기 거주 구직자",
    person: "만 30세, 경기도 거주, 미취업",
    likelyProgram: "두 제도 모두 직접 대상은 아닐 수 있음",
    reason: "서울 청년수당은 서울 거주가 필요하고, 경기도 청년기본소득은 만 24세가 핵심입니다.",
    caution: "경기도·시군 청년면접수당, 취업지원, 청년월세지원 등 별도 제도를 함께 찾아야 합니다.",
  },
];

export const SGYA_MIGRATION_POINTS: MigrationPoint[] = [
  {
    title: "주민등록 기준일",
    desc: "서울 청년수당은 서울 거주 여부, 경기 청년기본소득은 경기도 거주기간이 핵심입니다. 신청 전 전입일과 기준일을 먼저 확인하세요.",
  },
  {
    title: "거주기간 계산",
    desc: "경기도 청년기본소득은 최근 3년 계속 거주 또는 합산 10년 이상 거주 요건을 봅니다. 단기 전입만으로는 부족할 수 있습니다.",
  },
  {
    title: "중복수급 제한",
    desc: "서울 청년수당은 고용·구직지원 제도와의 중복 제한이 생길 수 있습니다. 참여 중인 사업이 있다면 공고의 제외 대상부터 확인하세요.",
  },
  {
    title: "시군별 운영",
    desc: "경기도 청년기본소득은 시군 운영 상황과 지역화폐 정책 영향을 받습니다. 주소지 시군 공고까지 같이 보는 것이 안전합니다.",
  },
];

export const SGYA_SOURCE_LINKS: SourceLink[] = [
  {
    label: "서울 청년몽땅정보통",
    href: "https://youth.seoul.go.kr/",
    type: "공식",
  },
  {
    label: "경기도 청년기본소득 안내",
    href: "https://apply.jobaba.net/special/gibon/main.do",
    type: "공식",
  },
  {
    label: "잡아바 어플라이",
    href: "https://apply.jobaba.net/",
    type: "신청",
  },
  {
    label: "복지로 청년 지원 검색",
    href: "https://www.bokjiro.go.kr/",
    type: "참고",
  },
];

export const SGYA_FAQ: FaqItem[] = [
  {
    q: "경기 청년수당과 경기도 청년기본소득은 같은 말인가요?",
    a: "검색에서는 경기 청년수당이라고 많이 찾지만, 대표 공식 제도명은 경기도 청년기본소득입니다. 그래서 이 페이지에서는 검색어는 설명하되, 표와 비교 항목에는 공식명인 경기도 청년기본소득을 기준으로 정리했습니다.",
  },
  {
    q: "서울 청년수당과 경기도 청년기본소득 중 어느 쪽이 더 유리한가요?",
    a: "금액만으로 유리함을 판단하기 어렵습니다. 서울 청년수당은 미취업 청년의 활동지원 성격이고, 경기도 청년기본소득은 만 24세와 거주기간을 중심으로 보는 제도라 대상자가 거의 다릅니다.",
  },
  {
    q: "직장인도 신청할 수 있나요?",
    a: "경기도 청년기본소득은 취업 여부가 핵심 제한이 아니므로 만 24세와 거주기간 요건을 먼저 봅니다. 반면 서울 청년수당은 미취업 또는 단기근로 등 공고 기준을 확인해야 하므로 일반 재직자는 제한될 가능성이 큽니다.",
  },
  {
    q: "서울에서 경기도로 이사하면 바로 경기 청년기본소득을 받을 수 있나요?",
    a: "바로 가능하다고 보기 어렵습니다. 경기도 청년기본소득은 최근 3년 계속 거주 또는 합산 10년 이상 거주 요건을 확인하므로, 단순 전입 여부보다 주민등록 이력과 기준일이 중요합니다.",
  },
  {
    q: "두 제도를 동시에 받을 수 있나요?",
    a: "현실적으로 동시에 대상이 되는 경우는 제한적입니다. 서울 청년수당은 서울 거주, 경기도 청년기본소득은 경기도 거주가 기본 전제라 같은 기준일에는 주소지가 갈립니다. 다른 청년 지원사업과의 중복 제한은 각 공고에서 다시 확인해야 합니다.",
  },
  {
    q: "2026년 모집기간은 어디서 확인해야 하나요?",
    a: "서울 청년수당은 서울 청년몽땅정보통, 경기도 청년기본소득은 경기도 안내 또는 잡아바 어플라이 공고를 확인하는 것이 가장 안전합니다. 모집기간과 생년월일 범위는 분기·회차별로 달라질 수 있어 신청 직전에 확인해야 합니다.",
  },
];

export const SGYA_SEO_INTRO = [
  "서울 청년수당과 경기도 청년기본소득은 모두 청년에게 현금성 지원을 제공한다는 점 때문에 자주 함께 검색됩니다. 하지만 실제로는 신청 대상, 제도 목적, 지급 방식이 꽤 다릅니다. 서울 청년수당은 서울에 거주하는 미취업 청년의 구직활동과 진로 탐색을 돕는 성격이 강하고, 경기도 청년기본소득은 만 24세 청년의 거주 요건을 중심으로 분기별 지역화폐를 지급하는 구조입니다.",
  "이 리포트는 두 제도를 금액만으로 비교하지 않고 나이, 거주지, 소득, 취업 상태, 지급 방식, 신청 주기를 같은 표로 맞춰 정리했습니다. 특히 사용자가 많이 검색하는 ‘경기 청년수당’이라는 표현은 공식 제도명과 다를 수 있으므로, 경기도 청년기본소득이라는 공식명과 검색어 맥락을 분리해서 설명했습니다. 덕분에 내가 봐야 할 공고가 서울인지 경기인지 먼저 걸러낼 수 있습니다.",
  "결과를 읽을 때는 지원금 총액보다 ‘내가 대상자 조건에 들어가는가’를 먼저 보는 것이 좋습니다. 서울은 미취업 상태, 졸업 여부, 건강보험료 기준, 중복 참여 제한이 판단을 좌우하고, 경기는 만 24세 생년월일 범위와 경기도 거주기간이 핵심입니다. 서울과 경기 사이로 이사했거나 예정이라면 신청 기준일의 주민등록과 과거 거주기간을 함께 확인해야 합니다.",
  "정책 지원금은 해마다 공고 문구와 운영 시군, 모집기간이 바뀔 수 있습니다. 이 페이지의 금액과 구조는 대표 공식 안내 기준으로 정리했지만, 실제 신청 가능 여부를 확정해주는 계산기는 아닙니다. 신청 전에는 반드시 서울 청년몽땅정보통, 경기도 청년기본소득 안내, 잡아바 어플라이의 최신 공고에서 모집기간, 생년월일 범위, 제외 대상, 제출서류를 다시 확인하세요.",
];

export const SGYA_SEO_CRITERIA = [
  "서울 청년수당은 서울 거주 미취업 청년 대상 활동지원형 제도로 정리했습니다.",
  "경기 청년수당 검색어는 공식명 경기도 청년기본소득과 구분해 표시했습니다.",
  "지원 금액은 대표 안내 기준이며 모집 회차와 예산에 따라 달라질 수 있습니다.",
  "신청 가능 여부는 주민등록 기준일, 소득·취업 상태, 중복수급 제한, 시군별 운영 여부를 공식 공고에서 최종 확인해야 합니다.",
];

export const SGYA_RELATED_LINKS = [
  {
    href: "/reports/youth-savings-comparison-2026/",
    label: "청년미래적금 vs 청년도약계좌 비교",
  },
  {
    href: "/reports/youth-future-savings-2026/",
    label: "청년미래적금 금리 비교 2026",
  },
  {
    href: "/tools/youth-rent-support-calculator/",
    label: "청년월세지원 자격 계산기",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 총정리",
  },
];
