export type DataBadge = "공식" | "확인 필요" | "시뮬레이션" | "참고";

export type RegionBirthSupport = {
  region: string;
  province: "서울" | "경기" | "지방";
  first: number | null;
  second: number | null;
  thirdOrMore: number | null;
  extra: string;
  residence: string;
  deadline: string;
  source: string;
  sourceUrl: string;
  badge: DataBadge;
  lastCheckedAt: string;
  note?: string;
};

export type BenefitCard = {
  name: string;
  amount: string;
  desc: string;
  apply: string;
  badge: DataBadge;
};

export type InsightCard = {
  title: string;
  body: string;
  value?: string;
};

export type ApplicationStep = {
  title: string;
  body: string;
};

export type Scenario = {
  title: string;
  area: string;
  firstYear: string;
  watch: string;
};

export const BSR_META = {
  slug: "birth-support-by-region-2026",
  title: "2026 지역별 출산지원금 완전 비교",
  description:
    "첫만남이용권·부모급여 같은 국가 공통 지원과 서울·경기·지방 지자체 출산장려금을 분리해 비교하고, 거주요건·신청기한·분할지급 조건까지 정리합니다.",
  updatedAt: "2026-05-10",
};

export const BSR_NATIONAL_BENEFITS: BenefitCard[] = [
  {
    name: "첫만남이용권",
    amount: "첫째 200만원, 둘째 이상 300만원",
    desc: "출생아 1인에게 국민행복카드 바우처로 지급되는 전국 공통 지원입니다.",
    apply: "출생신고 후 정부24·복지로·주민센터",
    badge: "공식",
  },
  {
    name: "부모급여",
    amount: "0세 월 100만원, 1세 월 50만원",
    desc: "어린이집 이용 여부에 따라 현금 또는 보육료 바우처와 차액 현금으로 지급됩니다.",
    apply: "정부24·복지로·주민센터",
    badge: "공식",
  },
  {
    name: "아동수당",
    amount: "만 8세 미만 월 10만원",
    desc: "소득과 무관하게 매월 지급되는 기본 양육 지원입니다.",
    apply: "정부24·복지로·주민센터",
    badge: "공식",
  },
];

export const BSR_METRO_BENEFITS: BenefitCard[] = [
  {
    name: "서울형 산후조리경비",
    amount: "첫째 100만원, 둘째 120만원, 셋째 이상 150만원",
    desc: "2026년 1월 1일 출생아부터 자녀 수에 따라 차등 지원됩니다. 2026년 3월 30일부터 신청기간 확대, 7월 1일부터 서울 거주요건 등 변경사항이 적용됩니다.",
    apply: "서울맘케어 또는 주소지 동주민센터",
    badge: "공식",
  },
  {
    name: "경기도 산후조리비",
    amount: "출생아 1인당 50만원 지역화폐",
    desc: "경기도 거주 출산 가정에 지급되며 다태아는 출생아 수에 따라 배수로 지급됩니다.",
    apply: "경기민원24 또는 주소지 행정복지센터",
    badge: "공식",
  },
  {
    name: "시군구 자체 출산장려금",
    amount: "지역별 0원~수천만원 이상",
    desc: "조례, 예산, 출생순위, 부모 거주기간, 전출 여부에 따라 실제 수령액이 달라집니다.",
    apply: "정부24 행복출산 또는 주소지 주민센터",
    badge: "확인 필요",
  },
];

export const BSR_REGIONS: RegionBirthSupport[] = [
  {
    region: "서울 강남구",
    province: "서울",
    first: 2000000,
    second: 2000000,
    thirdOrMore: 3000000,
    extra: "넷째 이상 500만원, 현금 1회 지급",
    residence: "보호자 1년 이상 강남구 거주, 아이와 동일 세대",
    deadline: "출생신고 후 신청, 1년 미만 거주자는 1년 경과 후 지급",
    source: "강남구청 출산양육지원금",
    sourceUrl: "https://www.gangnam.go.kr/board/B_000060/14890/view.do?mid=ID03_010104",
    badge: "공식",
    lastCheckedAt: "2026-05-10",
    note: "서울형 산후조리경비는 별도 항목으로 더해 볼 수 있습니다.",
  },
  {
    region: "서울 송파구",
    province: "서울",
    first: null,
    second: null,
    thirdOrMore: null,
    extra: "2022년 이후 출생아는 첫만남이용권 중심, 서울형 산후조리경비 별도",
    residence: "서울형 지원은 신청일 기준 서울 거주요건 확인",
    deadline: "서울형 산후조리경비는 2026년 변경 기준 확인",
    source: "송파구청·송파구보건소",
    sourceUrl: "https://www.songpa.go.kr/ehealth/contents.do?key=6007",
    badge: "참고",
    lastCheckedAt: "2026-05-10",
    note: "구 자체 현금 출산축하금보다 서울시 광역 지원 확인이 우선입니다.",
  },
  {
    region: "경기 화성시",
    province: "경기",
    first: 1000000,
    second: 2000000,
    thirdOrMore: 2000000,
    extra: "넷째 이상 300만원, 경기도 산후조리비 50만원 별도",
    residence: "부 또는 모가 출생일 기준 180일 전부터 화성시 거주",
    deadline: "출생일로부터 1년 이내",
    source: "화성특례시 출산지원",
    sourceUrl: "https://www.hscity.go.kr/www/partInfo/femaleFamily/Welfare1/Welfare1_2.jsp",
    badge: "공식",
    lastCheckedAt: "2026-05-10",
    note: "180일 미만 거주자는 출생 후 180일 경과 시점까지 계속 거주해야 합니다.",
  },
  {
    region: "경기 파주시",
    province: "경기",
    first: 1000000,
    second: 2000000,
    thirdOrMore: 3000000,
    extra: "최초 일부 지급 후 1년 뒤 잔액 지급, 경기도 산후조리비 별도",
    residence: "출생일 현재 파주시 거주, 아이와 동일 세대",
    deadline: "자녀 출생일부터 1년 이내",
    source: "파주시청 출생축하금",
    sourceUrl: "https://www.paju.go.kr/www/open_info/open_info_12.jsp",
    badge: "공식",
    lastCheckedAt: "2026-05-10",
    note: "첫째 10만원+1년 뒤 90만원처럼 분할 지급 구조를 확인해야 합니다.",
  },
  {
    region: "충북 괴산군",
    province: "지방",
    first: 20000000,
    second: 30000000,
    thirdOrMore: 50000000,
    extra: "첫만남이용권·충북 출산육아수당·군 자체 장려금 포함 총액",
    residence: "부모 모두 출생일 기준 12개월 전부터 괴산군 거주",
    deadline: "출생신고 시 1회차 신청, 이후 보건소 등에서 회차별 신청",
    source: "괴산군보건소 출산장려금",
    sourceUrl: "https://www.goesan.go.kr/hc/contents.do?key=552",
    badge: "공식",
    lastCheckedAt: "2026-05-10",
    note: "총액은 6~7년 분할 지급이 섞여 있어 출생 직후 현금으로 한 번에 받는 금액이 아닙니다.",
  },
  {
    region: "인구감소지역 일반",
    province: "지방",
    first: null,
    second: null,
    thirdOrMore: null,
    extra: "군 단위 장기 분할 장려금, 양육수당형 지원, 전입 조건 확인",
    residence: "부모 모두 장기 거주요건을 두는 경우가 많음",
    deadline: "출생신고 시점과 회차별 신청시점 모두 확인",
    source: "지자체 조례·보건소 공고",
    sourceUrl: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001",
    badge: "확인 필요",
    lastCheckedAt: "2026-05-10",
    note: "큰 총액일수록 전출 시 중단, 회차별 신청, 유사사업 조정 조건을 같이 봐야 합니다.",
  },
];

export const BSR_INSIGHTS: InsightCard[] = [
  {
    title: "서울은 구 자체 현금보다 광역 지원 확인이 먼저입니다",
    value: "산후조리경비 100만~150만원",
    body: "서울 자치구별 현금 출산축하금은 차이가 크고, 일부 구는 첫만남이용권 중심으로 안내합니다. 2026년에는 서울형 산후조리경비가 자녀 수별 차등으로 바뀌므로 구 자체 장려금과 별도 합산해야 합니다.",
  },
  {
    title: "경기는 시군 현금과 도 산후조리비를 따로 더합니다",
    value: "도 공통 50만원",
    body: "화성·파주처럼 시 자체 출산지원금이 있는 지역은 경기도 산후조리비 50만원을 별도 항목으로 볼 수 있습니다. 단, 시군 장려금은 거주기간과 신청기한이 서로 다릅니다.",
  },
  {
    title: "지방 고액 지원은 총액보다 지급기간이 핵심입니다",
    value: "최대 수천만원",
    body: "괴산군처럼 총액이 큰 지역은 첫만남이용권, 광역 수당, 군 자체 장려금이 합산된 장기 분할 구조일 수 있습니다. 이사 계획이 있으면 전출 시 중단 조건을 먼저 확인해야 합니다.",
  },
];

export const BSR_SCENARIOS: Scenario[] = [
  {
    title: "서울 거주 첫째 출산",
    area: "강남구 예시",
    firstYear: "구 출산양육지원금 200만원 + 첫만남이용권 200만원 + 부모급여·아동수당",
    watch: "보호자 1년 거주요건과 서울형 산후조리경비 신청기간을 따로 확인",
  },
  {
    title: "경기 거주 둘째 출산",
    area: "화성시 예시",
    firstYear: "시 출산지원금 200만원 + 경기도 산후조리비 50만원 + 첫만남이용권 300만원",
    watch: "출생일 기준 180일 거주요건, 출생일로부터 1년 이내 신청",
  },
  {
    title: "지방 고액 장려금 지역",
    area: "괴산군 예시",
    firstYear: "총액은 크지만 첫 지급과 이후 회차 지급이 나뉨",
    watch: "부모 모두 12개월 거주, 출생 후 전입은 지원 제한 가능",
  },
];

export const BSR_APPLICATION_STEPS: ApplicationStep[] = [
  {
    title: "1. 출생신고와 행복출산 원스톱을 먼저 진행",
    body: "정부24 또는 주소지 주민센터에서 첫만남이용권, 부모급여, 아동수당 등 전국 공통 항목을 한 번에 확인합니다.",
  },
  {
    title: "2. 광역 지원을 별도로 체크",
    body: "서울형 산후조리경비, 경기도 산후조리비처럼 시도 단위 지원은 신청 채널과 사용처가 별도로 정해질 수 있습니다.",
  },
  {
    title: "3. 시군구 자체 장려금 조건 확인",
    body: "금액표보다 출생일, 전입일, 동일 세대, 부모 거주기간, 신청기한, 분할 지급 중 전출 제한을 먼저 확인합니다.",
  },
  {
    title: "4. 지급수단과 사용기한 기록",
    body: "현금, 지역화폐, 국민행복카드 바우처는 사용처와 만료일이 다릅니다. 신청 후 문자와 지급 결정일을 따로 저장해 두는 것이 안전합니다.",
  },
];

export const BSR_CHECKLIST = [
  "출생아 주민등록지가 지원 지역에 있는지 확인",
  "부 또는 모의 전입일이 거주요건을 충족하는지 확인",
  "첫째·둘째·셋째 판정이 가족관계증명서 기준인지 주민등록 세대 기준인지 확인",
  "첫 지급과 잔여 지급이 나뉘는지 확인",
  "지역화폐·바우처 사용기한과 사용처 제한 확인",
  "이사 예정이 있으면 전출 시 중단 또는 환수 조건 확인",
];

export const BSR_FAILURE_CASES = [
  "신청기한을 놓쳐 소급 지급이 제한되는 경우",
  "전입일 또는 거주요건을 충족하지 못한 경우",
  "가족관계증명서, 통장사본 등 필수 서류를 빠뜨린 경우",
  "분할 지급 중 전출 조건을 확인하지 않은 경우",
  "총액만 보고 실제 첫해 입금액과 바우처 사용기한을 놓치는 경우",
  "국가 공통 지원을 지자체 현금 지원으로 중복 계산하는 경우",
];

export const BSR_FAQ = [
  {
    question: "첫만남이용권과 지자체 출산지원금은 중복 가능한가요?",
    answer: "대체로 별도 제도라 함께 받을 수 있지만 지자체별 중복 제한이나 유사사업 조정 조항이 있을 수 있습니다. 신청 전 주소지 주민센터에서 첫만남이용권, 광역 지원, 시군구 자체 장려금을 따로 확인하는 것이 안전합니다.",
  },
  {
    question: "이사하면 더 많이 받을 수 있나요?",
    answer: "단순히 금액이 큰 지역으로 이사한다고 바로 받을 수 있는 구조는 아닙니다. 많은 지자체가 출생일 전 6개월, 12개월 같은 거주요건을 두고, 분할 지급 중 전출하면 남은 회차가 중단될 수 있습니다.",
  },
  {
    question: "둘째부터 지원금이 커지나요?",
    answer: "국가 공통 첫만남이용권은 둘째 이상이 300만원으로 커지고, 지자체도 둘째·셋째 이상을 우대하는 경우가 많습니다. 다만 서울형 산후조리경비처럼 광역 지원이 자녀 수별로 차등되는 항목도 따로 봐야 합니다.",
  },
  {
    question: "출산지원금은 어디에서 신청하나요?",
    answer: "전국 공통 항목은 정부24 행복출산 원스톱, 복지로, 주소지 주민센터에서 확인합니다. 서울형·경기도형 지원이나 시군구 자체 장려금은 지자체 신청 페이지, 보건소, 행정복지센터에서 추가 신청이 필요할 수 있습니다.",
  },
  {
    question: "표의 확인 필요는 무슨 뜻인가요?",
    answer: "2026년 기준 공식 금액을 확정 입력하지 않았거나 지역별 세부 조건이 변동될 수 있는 항목입니다. 계산이나 비교에서 공식 확정 금액처럼 보지 말고, 링크된 공식 페이지와 주민센터 확인을 거쳐야 합니다.",
  },
  {
    question: "고액 지원 지역은 출생 직후 바로 전액을 받을 수 있나요?",
    answer: "대부분 그렇지 않습니다. 총액이 큰 지역은 첫만남이용권, 광역 수당, 자체 장려금이 합산되어 있고 여러 해에 걸쳐 분할 지급되는 경우가 많습니다. 실제 현금흐름은 첫해 입금액과 회차별 지급일로 다시 계산해야 합니다.",
  },
];

export const BSR_SOURCE_LINKS = [
  { href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001", label: "정부24 행복출산 원스톱" },
  { href: "https://www.gangnam.go.kr/board/B_000060/14890/view.do?mid=ID03_010104", label: "강남구 출산양육지원금" },
  { href: "https://www.songpa.go.kr/ehealth/contents.do?key=6007", label: "송파구보건소 서울형 산후조리경비" },
  { href: "https://www.hscity.go.kr/www/partInfo/femaleFamily/Welfare1/Welfare1_2.jsp", label: "화성특례시 출산지원" },
  { href: "https://www.paju.go.kr/www/open_info/open_info_12.jsp", label: "파주시 출생축하금" },
  { href: "https://www.goesan.go.kr/hc/contents.do?key=552", label: "괴산군 출산장려금" },
];

export const BSR_RELATED_LINKS = [
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/birth-support-money/", label: "출산지원금 총수령액 계산기" },
  { href: "/tools/postnatal-care-cost/", label: "산후도우미 비용 계산기" },
  { href: "/reports/postnatal-care-comparison-2026/", label: "산후도우미 vs 산후조리원 비교" },
];
