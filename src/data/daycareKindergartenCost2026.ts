export type DataBadge = "공식" | "공개상한" | "추정" | "전략";

export type HeroStat = {
  label: string;
  value: string;
  note: string;
  badge: DataBadge;
};

export type CostRow = {
  type: string;
  age: string;
  gross: string;
  support: string;
  hidden: string;
  net: string;
  badge: DataBadge;
  note: string;
};

export type RegionRow = {
  region: string;
  daycareExtra: string;
  kindergartenExtra: string;
  pressure: string;
  read: string;
};

export type SupportRow = {
  name: string;
  target: string;
  amount: string;
  condition: string;
  channel: string;
};

export type StrategyRow = {
  timing: string;
  recommended: string;
  costImpact: string;
  caution: string;
};

export type OptionCostRow = {
  option: string;
  monthly: string;
  yearly: string;
  read: string;
  badge: DataBadge;
};

export type SourceLink = {
  label: string;
  href: string;
  note: string;
};

export const DKC_META = {
  slug: "daycare-kindergarten-cost-2026",
  seoTitle: "2026 어린이집·유치원 실비용 완전 비교 | 보육료·유아학비·숨은 비용 총정리",
  seoDescription:
    "2026년 어린이집과 유치원 비용 차이를 보육료, 유아학비, 특별활동비, 방과후, 지역별 격차, 맞벌이 시나리오까지 한 번에 비교합니다.",
  updatedAt: "2026-05",
  dataNote:
    "공식 지원금은 2026년 공개 기준을 반영했고, 기관별 특별활동비·방과후·급식·차량비는 지자체 수납한도와 공개 사례를 바탕으로 한 추정 범위입니다.",
};

export const DKC_HERO_STATS: HeroStat[] = [
  {
    label: "0~2세",
    value: "어린이집 중심",
    note: "보육료 58.4만·51.5만·42.6만 원 지원",
    badge: "공식",
  },
  {
    label: "3~5세",
    value: "유치원 비교 구간",
    note: "어린이집·유치원 모두 누리과정 지원 대상",
    badge: "공식",
  },
  {
    label: "사립 유치원",
    value: "월 30만~60만+",
    note: "지원 차감 후 추가 원비·방과후·급식비 차이",
    badge: "추정",
  },
  {
    label: "영어유치원",
    value: "월 100만+",
    note: "유치원이 아닌 유아 대상 영어학원 성격",
    badge: "추정",
  },
];

export const DKC_DAYCARE_ROWS: CostRow[] = [
  {
    type: "국공립 어린이집",
    age: "0~2세",
    gross: "58.4만 / 51.5만 / 42.6만 원",
    support: "보육료 전액 지원",
    hidden: "특별활동·차량·행사비 일부",
    net: "월 0~8만 원대",
    badge: "공식",
    note: "영아반은 기본 보육료 차액이 거의 없고 필요경비가 실부담의 핵심입니다.",
  },
  {
    type: "민간·가정 어린이집",
    age: "0~2세",
    gross: "공식 보육료 + 기관보육료 구조",
    support: "부모보육료 지원",
    hidden: "특별활동·차량·급간식·행사비",
    net: "월 5만~12만 원대",
    badge: "추정",
    note: "0~2세는 차액보다 필요경비와 연장보육 이용 여부가 실제 차이를 만듭니다.",
  },
  {
    type: "민간·가정 어린이집",
    age: "3~5세",
    gross: "누리과정 28만 원 + 차액보육료 가능",
    support: "월 28만 원",
    hidden: "차액보육료·특별활동·차량비",
    net: "월 10만~25만 원대",
    badge: "공개상한",
    note: "지자체별로 3~5세 차액보육료 지원 여부와 수납한도액이 달라집니다.",
  },
  {
    type: "직장 어린이집",
    age: "0~5세",
    gross: "회사 복지·운영 방식별 상이",
    support: "보육료 지원 + 사업장 지원",
    hidden: "차량비 적고 특별활동비 낮은 편",
    net: "월 0~10만 원대",
    badge: "추정",
    note: "이용 자격이 제한되지만 맞벌이 가정에는 시간·비용 효율이 높은 선택지입니다.",
  },
];

export const DKC_KINDERGARTEN_ROWS: CostRow[] = [
  {
    type: "국공립 유치원",
    age: "3~5세",
    gross: "교육과정 10만 원 + 방과후 5만 원 수준",
    support: "교육과정 10만 원, 방과후 5만 원",
    hidden: "급식·방과후 간식·재료비",
    net: "월 0~10만 원대",
    badge: "공식",
    note: "비용은 낮지만 통학, 방학, 방과후 정원, 추첨 경쟁이 변수입니다.",
  },
  {
    type: "사립 유치원",
    age: "3~5세",
    gross: "교육과정·방과후·특성화·급식비",
    support: "교육과정 28만 원, 방과후 7만 원",
    hidden: "특성화·교재·차량·행사비",
    net: "월 25만~60만 원대",
    badge: "추정",
    note: "지원금이 커도 원비와 선택경비가 높으면 어린이집보다 비싸질 수 있습니다.",
  },
  {
    type: "영어유치원",
    age: "4~7세",
    gross: "유아 대상 영어학원 교습비 + 기타경비",
    support: "유아학비 지원 대상 아님",
    hidden: "교재·급식·차량·입학금·방학특강",
    net: "월 100만~180만 원대",
    badge: "추정",
    note: "법적으로 유치원이 아니라 학원인 경우가 많아 지원 구조가 다릅니다.",
  },
];

export const DKC_REGION_ROWS: RegionRow[] = [
  {
    region: "서울",
    daycareExtra: "특별활동 8만~10만 원, 차량비 0~5만 원",
    kindergartenExtra: "사립 방과후·특성화·급식비 부담 큼",
    pressure: "국공립 대기·추첨 경쟁 높음",
    read: "비용보다 접근성·시간 공백이 선택을 좌우하는 경우가 많습니다.",
  },
  {
    region: "경기·인천",
    daycareExtra: "특별활동 5만~8만 원, 차량비 3만~4만 원",
    kindergartenExtra: "차량 이용 비중이 높아 실비 증가",
    pressure: "신도시 국공립·직장어린이집 수요 집중",
    read: "통학 차량과 하원 이후 돌봄 비용까지 같이 봐야 합니다.",
  },
  {
    region: "광역시",
    daycareExtra: "특별활동 5만~9만 원",
    kindergartenExtra: "사립 원비 편차가 지역별로 큼",
    pressure: "국공립 수요는 높지만 서울보다는 분산",
    read: "민간 어린이집과 사립 유치원 차액이 좁아지는 구간이 많습니다.",
  },
  {
    region: "지방 중소도시",
    daycareExtra: "특별활동 3만~8만 원",
    kindergartenExtra: "차량·급식·교재비가 변수",
    pressure: "기관 선택지는 적지만 대기 부담은 지역별 차이",
    read: "비용보다 집·직장·조부모 동선이 더 중요한 변수일 수 있습니다.",
  },
];

export const DKC_DUAL_INCOME_ROWS = [
  {
    family: "맞벌이, 만 2세",
    likelyChoice: "어린이집",
    monthlyFlow: "보육료 바우처로 기본료 차감, 연장보육·차량비가 추가",
    risk: "하원 이후 돌봄 공백과 병가 대응 비용",
  },
  {
    family: "맞벌이, 만 4세",
    likelyChoice: "어린이집 또는 유치원+방과후",
    monthlyFlow: "누리과정 지원 28만 원, 유치원은 방과후 지원 별도",
    risk: "방학·재량휴업일 돌봄 대체비",
  },
  {
    family: "외벌이, 만 4세",
    likelyChoice: "국공립 유치원 또는 국공립 어린이집",
    monthlyFlow: "기본 과정 중심이면 실부담 낮음",
    risk: "짧은 운영 시간과 통학 부담",
  },
];

export const DKC_WAITING_ROWS = [
  {
    item: "국공립 어린이집",
    signal: "대기순번·맞벌이·형제 재원·다자녀 점수",
    probability: "대기순번/모집예정 인원으로 추정",
    action: "3곳 이상 입소대기, 직장·집 근처를 나눠 등록",
  },
  {
    item: "국공립 유치원",
    signal: "처음학교로 모집, 우선모집·일반모집",
    probability: "모집정원과 지원자 수 공개 여부에 따라 확인",
    action: "방과후 과정 정원과 통학 가능 여부를 먼저 확인",
  },
  {
    item: "직장 어린이집",
    signal: "재직 사업장, 맞벌이, 사내 배점",
    probability: "회사 내부 정원·신청자 수 기준",
    action: "복직 예정일보다 6~12개월 먼저 확인",
  },
];

export const DKC_STRATEGY_ROWS: StrategyRow[] = [
  {
    timing: "만 2세까지",
    recommended: "어린이집 유지",
    costImpact: "보육료 지원이 커서 기본료 부담이 낮음",
    caution: "특별활동·연장보육·차량비는 별도 확인",
  },
  {
    timing: "만 3세 전환",
    recommended: "국공립 유치원 가능하면 비용 절감",
    costImpact: "국공립은 실부담이 낮지만 방과후 정원이 변수",
    caution: "방학 돌봄과 하원 시간이 맞벌이에 맞는지 확인",
  },
  {
    timing: "만 4~5세",
    recommended: "교육과정·방과후·특성화비까지 비교",
    costImpact: "사립유치원은 지원금 이후에도 월 30만 원 이상 차이 가능",
    caution: "영어·예체능 특성화 추가 시 비용이 급증",
  },
  {
    timing: "취학유예·만 6~7세",
    recommended: "기관별 지원 가능 여부 재확인",
    costImpact: "지원기간 제한이 있어 실비가 달라질 수 있음",
    caution: "초등 돌봄·방과후 대체비와 비교 필요",
  },
];

export const DKC_OPTION_COST_ROWS: OptionCostRow[] = [
  {
    option: "어린이집 특별활동",
    monthly: "월 3만~10만 원",
    yearly: "연 36만~120만 원",
    read: "지자체 수납한도 내에서 기관별 편차가 큽니다.",
    badge: "공개상한",
  },
  {
    option: "유치원 방과후·특성화",
    monthly: "월 5만~25만 원",
    yearly: "연 60만~300만 원",
    read: "지원금 차감 후 특성화 프로그램이 실제 차이를 만듭니다.",
    badge: "추정",
  },
  {
    option: "차량비",
    monthly: "월 2만~5만 원",
    yearly: "연 24만~60만 원",
    read: "도보권 국공립은 0원, 광역 통학은 비용과 시간이 함께 듭니다.",
    badge: "공개상한",
  },
  {
    option: "영어유치원",
    monthly: "월 100만~180만 원",
    yearly: "연 1,200만~2,100만 원+",
    read: "교재·급식·차량·입학금까지 더하면 첫해 부담이 더 커집니다.",
    badge: "추정",
  },
];

export const DKC_SUPPORT_ROWS: SupportRow[] = [
  {
    name: "어린이집 보육료",
    target: "0~5세 어린이집 이용 아동",
    amount: "0세 58.4만, 1세 51.5만, 2세 42.6만, 3~5세 28만 원",
    condition: "어린이집 이용, 보육료 자격 신청",
    channel: "복지로·주민센터·아이행복카드",
  },
  {
    name: "유아학비",
    target: "3~5세 유치원 재원 아동",
    amount: "국공립 10만, 사립 28만 원",
    condition: "유치원 이용, 유아학비 자격 신청",
    channel: "복지로·주민센터·유치원 안내",
  },
  {
    name: "방과후 과정비",
    target: "유치원 방과후 과정 이용 아동",
    amount: "국공립 5만, 사립 7만 원",
    condition: "방과후 과정 이용",
    channel: "유치원·복지로",
  },
  {
    name: "저소득층 유아학비 추가지원",
    target: "사립유치원 재원 법정 저소득층",
    amount: "월 최대 20만 원 범위",
    condition: "기초생활수급·차상위·한부모 등",
    channel: "복지로·주민센터",
  },
  {
    name: "직장 어린이집",
    target: "사업장 근로자 자녀",
    amount: "회사·기관 운영 규정별 상이",
    condition: "재직, 신청 순위, 사내 배점",
    channel: "회사 복지·인사 부서",
  },
];

export const DKC_SELECTION_CRITERIA = [
  "월 비용만 보지 말고 하원 시간, 방학 돌봄, 통학 시간을 같이 비교합니다.",
  "국공립은 저렴하지만 대기·추첨 변수가 크므로 2순위 선택지를 반드시 준비합니다.",
  "사립유치원은 유아학비 지원금보다 실제 선택경비가 얼마인지가 더 중요합니다.",
  "영어유치원은 유치원 비용 비교가 아니라 사교육비 비교로 따로 판단해야 합니다.",
  "직장 어린이집은 비용보다 복직 시점과 등하원 동선이 맞는지 먼저 확인합니다.",
];

export const DKC_CHECKLIST = [
  "기관별 월 고지서 예시를 받았다",
  "보육료·유아학비 자격 전환 신청 시점을 확인했다",
  "특별활동비와 방과후 과정비를 월/연 단위로 환산했다",
  "급식비, 차량비, 교재비, 현장학습비를 별도 항목으로 적었다",
  "방학 중 돌봄 공백 비용을 계산했다",
  "국공립 대기순번과 사립 대체안을 함께 확인했다",
  "맞벌이 기준 하원 이후 돌봄 대안을 정했다",
  "계산기로 우리 집 조건을 다시 넣어봤다",
];

export const DKC_FAQ = [
  {
    q: "2026년 기준 어린이집과 유치원 중 어디가 더 저렴한가요?",
    a: "0~2세는 어린이집이 현실적인 기본 선택지이고, 3~5세는 국공립 유치원이 가장 저렴한 경우가 많습니다. 다만 맞벌이 가정은 방과후와 방학 돌봄 비용까지 합치면 어린이집이 더 편하고 저렴할 수도 있습니다.",
  },
  {
    q: "사립유치원은 지원금이 있는데도 왜 비싼가요?",
    a: "사립유치원은 교육과정비 28만 원과 방과후 과정비 7만 원을 지원받아도 추가 원비, 특성화 활동, 교재비, 급식비, 차량비가 붙을 수 있습니다. 그래서 실제 학부모 부담금은 기관별 편차가 큽니다.",
  },
  {
    q: "어린이집 보육료와 유아학비를 동시에 받을 수 있나요?",
    a: "동시에 받을 수 없습니다. 실제 이용 기관에 맞춰 보육료 또는 유아학비 중 하나의 자격을 선택해야 하며, 기관을 옮길 때는 자격 전환 신청이 필요할 수 있습니다.",
  },
  {
    q: "영어유치원도 유아학비 지원을 받을 수 있나요?",
    a: "일반적으로 영어유치원이라고 불리는 곳은 유치원이 아니라 유아 대상 영어학원인 경우가 많습니다. 이 경우 유아학비 지원 대상이 아니며 사교육비로 따로 계산해야 합니다.",
  },
  {
    q: "국공립 어린이집 당첨 확률은 어떻게 계산하나요?",
    a: "공식 확률표가 있는 것은 아니므로 대기순번, 모집 예정 인원, 형제 재원 여부, 맞벌이·다자녀 배점 등을 보고 추정해야 합니다. 대기순번이 모집예정 인원의 2~3배 안쪽인지가 1차 판단 기준입니다.",
  },
  {
    q: "만 6~7세도 유치원 지원을 받을 수 있나요?",
    a: "취학유예 등 예외 상황에서는 지원 가능성이 있지만 지원기간 제한이 있어 기관과 주민센터 확인이 필요합니다. 일반적인 3~5세 비용 비교와 분리해 봐야 합니다.",
  },
];

export const DKC_SOURCE_LINKS: SourceLink[] = [
  {
    label: "찾기쉬운 생활법령정보 보육료 지원",
    href: "https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=2&cciNo=3&cnpClsNo=1&csmSeq=626&popMenu=ov",
    note: "2026년도 보육사업안내 기준 보육료 지원 대상과 지원액 확인",
  },
  {
    label: "인천시 0~2세 영유아보육료 지원",
    href: "https://www.incheon.go.kr/earlychild/EC030301",
    note: "2026년 0~2세 기본보육료 단가 확인",
  },
  {
    label: "유아학비 지원 안내",
    href: "https://www.moneytogether.co.kr/welfare/national/WLF00000969",
    note: "3~5세 유아학비·방과후 과정비 지원 단가 확인",
  },
  {
    label: "부산광역시 보육료 및 필요경비 수납한도액",
    href: "https://central.childcare.go.kr/lbusan/d3_30000/d3_20032.jsp",
    note: "2026년 지자체 필요경비 수납한도액 공개 사례",
  },
];
