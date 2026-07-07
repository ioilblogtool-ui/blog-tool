export type EvidenceBadge = "공식" | "보도 기준" | "분석" | "확인 필요";

export type StakeholderGroup = "대표팀" | "K리그" | "유소년" | "지도자·심판" | "팬";

export interface ReformTask {
  id: string;
  title: string;
  shortLabel: string;
  summary: string;
  currentProblem: string;
  whatToCheck: string[];
  affectedGroups: StakeholderGroup[];
  disclosureScore: number;
  feasibilityScore: number;
  fanImpactScore: number;
  longTermScore: number;
  kleagueLinkScore: number;
  statusLabel: string;
  evidenceBadge: EvidenceBadge;
}

export interface StakeholderImpact {
  group: StakeholderGroup;
  concern: string;
  expectedChange: string;
  relatedTaskIds: string[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  isChair: boolean;
  affiliation: string;
}

export interface VerificationItem {
  label: string;
  status: EvidenceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SIC_META = {
  slug: "soccer-innovation-committee-2026",
  title: "K축구 혁신위원회 2026｜박지성·이영표 위원 명단 총정리",
  h1: "K축구 혁신위원회 2026｜박지성·이영표 위원 명단 총정리",
  seoTitle: "K축구 혁신위원회 2026 | 박지성·이영표 위원 명단 완전 정리",
  seoDescription:
    "2026년 7월 6일 출범한 K축구 혁신위원회의 공동위원장·위원 전체 명단과 한국 축구 개혁 과제 7가지를 정리합니다. 대표팀·K리그·유소년 구조를 숫자로 함께 비교합니다.",
  description:
    "2026년 7월 6일 서울 올림픽파크텔에서 출범한 K축구 혁신위원회의 위원 명단과, 대표팀 성적·감독 선임·K리그 경쟁력·유소년 육성·심판 신뢰·협회 예산 공개까지 한국 축구가 실제로 바꿔야 할 항목을 정리합니다.",
  updatedAt: "2026-07-07",
  dataStatusLabel: "공식 출범 확인",
  dataNote:
    "이 페이지는 K축구 혁신위원회 출범과 한국 축구 개혁 과제를 정리한 해설 리포트입니다. 위원 명단과 출범일은 2026년 7월 6일 다수 언론 보도를 기준으로 확인했으며, 그 외 세부 안건·권한 범위·예산은 공식 발표가 나오는 대로 업데이트합니다.",
};

export const SIC_LAUNCH_INFO = {
  date: "2026년 7월 6일",
  location: "서울 올림픽파크텔",
  purpose:
    "2026 북중미 월드컵을 계기로 제기된 한국 축구 혁신 요구에 대응하고, 중장기 발전 방향을 마련하기 위해 출범했습니다. 출범식은 1차 회의를 겸해 진행됐습니다.",
  agenda: [
    "축구 거버넌스 개선",
    "유소년 선수 육성 체계",
    "지도자 양성·평가",
    "심판 신뢰 회복",
    "첨단 기술 시스템 도입",
    "선수 보호",
    "K리그-대표팀 연계",
  ],
  selectionCriteria: [
    "부당함에 맞서 정정당당하게 목소리를 낸 인물",
    "국민적 신뢰와 축구계 신망을 얻고 있는 인물",
    "차기 대한축구협회장 선거에 출마하지 않을 인물",
  ],
  chairStatement:
    "박지성 공동위원장은 출범식에서 \"축구인의 한 명으로 죄송하면서도 감사하게 생각한다\"며 \"한국 축구가 좋은 방향으로 개선돼 스포츠가 나아가야 할 선두 주자가 됐으면 한다\"고 소감을 밝혔습니다.",
};

export const SIC_COMMITTEE_MEMBERS: CommitteeMember[] = [
  { name: "최휘영", role: "공동위원장", isChair: true, affiliation: "문화체육관광부 장관" },
  { name: "박지성", role: "공동위원장", isChair: true, affiliation: "FIFA 분과위원회 위원" },
  { name: "이영표", role: "위원", isChair: false, affiliation: "축구 해설위원" },
  { name: "박주호", role: "위원", isChair: false, affiliation: "축구 해설위원" },
  { name: "유승민", role: "위원", isChair: false, affiliation: "대한체육회장" },
  { name: "김승희", role: "위원", isChair: false, affiliation: "대한축구협회 전무이사" },
  { name: "조연상", role: "위원", isChair: false, affiliation: "한국프로축구연맹 사무총장" },
  { name: "유영근", role: "위원", isChair: false, affiliation: "변호사" },
  { name: "김대희", role: "위원", isChair: false, affiliation: "부경대 교수" },
];

export const SIC_REFORM_TASKS: ReformTask[] = [
  {
    id: "manager-selection",
    title: "감독 선임 절차 공개",
    shortLabel: "감독 선임",
    summary: "후보군 기준, 평가 항목, 회의록 공개 범위, 이해충돌 여부를 분리해서 봐야 합니다.",
    currentProblem: "감독 선임 결과보다 과정이 불명확하다고 느끼는 팬 불신이 반복됩니다.",
    whatToCheck: ["후보 평가 기준", "회의록 공개 범위", "기술위원회 권한"],
    affectedGroups: ["대표팀", "팬"],
    disclosureScore: 2,
    feasibilityScore: 3,
    fanImpactScore: 5,
    longTermScore: 4,
    kleagueLinkScore: 3,
    statusLabel: "우선 개선",
    evidenceBadge: "분석",
  },
  {
    id: "association-governance",
    title: "협회 의사결정 투명성",
    shortLabel: "협회 구조",
    summary: "이사회, 기술위원회, 전력강화 조직의 역할과 책임 소재가 명확해야 합니다.",
    currentProblem: "어떤 조직이 어떤 기준으로 결정했는지 설명이 부족하면 논란이 반복됩니다.",
    whatToCheck: ["조직별 권한", "회의 공개 기준", "책임자와 일정"],
    affectedGroups: ["대표팀", "팬", "지도자·심판"],
    disclosureScore: 2,
    feasibilityScore: 3,
    fanImpactScore: 4,
    longTermScore: 5,
    kleagueLinkScore: 3,
    statusLabel: "구조 개선",
    evidenceBadge: "분석",
  },
  {
    id: "budget-disclosure",
    title: "예산 공개와 배분",
    shortLabel: "예산",
    summary: "대표팀, 유소년, 지도자 교육, 심판, 행정 비용의 배분 기준을 확인할 수 있어야 합니다.",
    currentProblem: "돈이 어디에 쓰이는지 보이지 않으면 개혁 실행 가능성을 판단하기 어렵습니다.",
    whatToCheck: ["대표팀 운영비", "유소년 투자", "행정비 공개 범위"],
    affectedGroups: ["대표팀", "K리그", "유소년", "팬"],
    disclosureScore: 1,
    feasibilityScore: 3,
    fanImpactScore: 5,
    longTermScore: 4,
    kleagueLinkScore: 4,
    statusLabel: "공개 필요",
    evidenceBadge: "확인 필요",
  },
  {
    id: "youth-development",
    title: "유소년·지도자 육성",
    shortLabel: "유소년",
    summary: "초중고, 대학, 프로 산하 유스, 지도자 라이선스가 끊기지 않고 연결되어야 합니다.",
    currentProblem: "대표팀 성과 논의가 장기 육성 시스템보다 단기 결과에 쏠리기 쉽습니다.",
    whatToCheck: ["유소년 투자 규모", "지도자 교육 체계", "프로 산하 유스 연계"],
    affectedGroups: ["유소년", "K리그", "지도자·심판"],
    disclosureScore: 2,
    feasibilityScore: 2,
    fanImpactScore: 3,
    longTermScore: 5,
    kleagueLinkScore: 5,
    statusLabel: "장기 과제",
    evidenceBadge: "분석",
  },
  {
    id: "kleague-national-team-link",
    title: "K리그 경쟁력과 대표팀 연계",
    shortLabel: "K리그",
    summary: "대표팀 경쟁력은 K리그 투자, 일정, 유소년 운영, 선수 연봉 구조와 함께 봐야 합니다.",
    currentProblem: "대표팀만 따로 보면 국내 리그의 기반과 선수 육성 문제를 놓치기 쉽습니다.",
    whatToCheck: ["구단 투자", "U22·유스 제도", "대표팀 차출·일정 조율"],
    affectedGroups: ["대표팀", "K리그", "유소년"],
    disclosureScore: 3,
    feasibilityScore: 3,
    fanImpactScore: 4,
    longTermScore: 5,
    kleagueLinkScore: 5,
    statusLabel: "연계 강화",
    evidenceBadge: "분석",
  },
  {
    id: "referee-discipline-trust",
    title: "심판·징계·규정 신뢰",
    shortLabel: "심판 신뢰",
    summary: "판정 논란 자체보다 판정 설명, 징계 기준, 이의제기 절차를 중심으로 봐야 합니다.",
    currentProblem: "기준 설명이 부족하면 경기 결과와 제도 신뢰가 함께 흔들립니다.",
    whatToCheck: ["판정 설명 방식", "징계 기준", "이의제기 절차"],
    affectedGroups: ["K리그", "지도자·심판", "팬"],
    disclosureScore: 2,
    feasibilityScore: 3,
    fanImpactScore: 4,
    longTermScore: 4,
    kleagueLinkScore: 4,
    statusLabel: "신뢰 회복",
    evidenceBadge: "분석",
  },
  {
    id: "fan-communication",
    title: "팬 커뮤니케이션",
    shortLabel: "팬 소통",
    summary: "발표문, 기자회견, 질의응답, 데이터 공개 방식이 팬 신뢰 회복의 핵심입니다.",
    currentProblem: "결정 이후 설명이 부족하면 같은 논란이 더 큰 불신으로 돌아옵니다.",
    whatToCheck: ["발표문 구체성", "질의응답 범위", "후속 일정 공개"],
    affectedGroups: ["팬", "대표팀", "K리그"],
    disclosureScore: 2,
    feasibilityScore: 4,
    fanImpactScore: 5,
    longTermScore: 3,
    kleagueLinkScore: 3,
    statusLabel: "즉시 개선",
    evidenceBadge: "분석",
  },
];

export const SIC_STAKEHOLDER_IMPACTS: StakeholderImpact[] = [
  {
    group: "대표팀",
    concern: "감독 선임과 전력 운영 기준이 명확한지",
    expectedChange: "감독 후보 평가, 기술위원회 역할, 월드컵 준비 로드맵을 더 투명하게 확인할 수 있어야 합니다.",
    relatedTaskIds: ["manager-selection", "association-governance"],
  },
  {
    group: "K리그",
    concern: "리그 일정과 선수 육성이 대표팀과 어떻게 연결되는지",
    expectedChange: "K리그 구단 투자, 유소년 운영, 대표팀 차출 구조를 함께 보는 논의가 필요합니다.",
    relatedTaskIds: ["kleague-national-team-link", "youth-development"],
  },
  {
    group: "유소년",
    concern: "초중고·대학·프로 산하 유스가 끊기지 않고 이어지는지",
    expectedChange: "단기 성적보다 지도자 교육, 유스 시스템, 지역별 접근성 같은 장기 과제가 중요해집니다.",
    relatedTaskIds: ["youth-development", "budget-disclosure"],
  },
  {
    group: "지도자·심판",
    concern: "교육과 평가 기준이 공개적이고 일관적인지",
    expectedChange: "지도자 라이선스, 심판 판정 설명, 징계 기준이 팬이 이해할 수 있는 방식으로 정리되어야 합니다.",
    relatedTaskIds: ["referee-discipline-trust", "association-governance"],
  },
  {
    group: "팬",
    concern: "결정 과정과 돈의 흐름을 확인할 수 있는지",
    expectedChange: "발표문 중심의 소통에서 벗어나 기준, 일정, 책임자, 예산 항목을 확인할 수 있어야 합니다.",
    relatedTaskIds: ["fan-communication", "budget-disclosure"],
  },
];

export const SIC_VERIFICATION_ITEMS: VerificationItem[] = [
  {
    label: "K축구 혁신위원회 출범",
    status: "보도 기준",
    sourceLabel: "머니투데이·서울신문·아주경제·한국일보 등 2026-07-03~07-06 보도",
    sourceUrl: "https://www.mt.co.kr/sports/2026/07/03/2026070314330384824",
    note: "2026년 7월 6일 서울 올림픽파크텔에서 출범. 문체부 장관 최휘영과 박지성이 공동위원장을 맡았습니다.",
  },
  {
    label: "위원 명단",
    status: "보도 기준",
    sourceLabel: "머니투데이·아주경제·이투데이 등 2026-07-03~07-06 보도",
    sourceUrl: "https://www.etoday.co.kr/news/view/2600102",
    note: "이영표·박주호(해설위원), 유승민(대한체육회장), 김승희(대한축구협회 전무이사), 조연상(한국프로축구연맹 사무총장), 유영근(변호사), 김대희(교수) 등 9인 체제로 보도됨. 공식 임명장·위촉 절차는 후속 공식 자료로 재확인 필요.",
  },
  {
    label: "위원 선정 기준",
    status: "보도 기준",
    sourceLabel: "뉴시스·뉴스핌 2026-07-06~07-07 보도",
    sourceUrl: "https://www.newsis.com/view/NISX20260706_0003697681",
    note: "최휘영 문체부 장관은 부당함에 목소리를 낸 인물, 국민적 신뢰와 축구계 신망이 있는 인물, 차기 축구협회장 선거에 출마하지 않을 인물이라는 3가지 기준으로 박지성·이영표·박주호를 선정했다고 밝혔습니다.",
  },
  {
    label: "개혁 과제 7가지",
    status: "분석",
    sourceLabel: "공개 자료 기반 자체 분류",
    note: "공식 안건이 아니라 한국 축구 개혁을 읽기 위한 분석용 체크리스트입니다.",
  },
  {
    label: "예산과 투자 규모",
    status: "확인 필요",
    sourceLabel: "공식 예산 자료 확인 전 수치 미사용",
    note: "확인되지 않은 금액은 '공개 필요' 항목으로 표시합니다.",
  },
];

export const SIC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/worldcup-manager-salary-comparison-2026/",
    label: "월드컵 감독 연봉 비교 2026",
    description: "대표팀 운영 비용을 감독 연봉 기준으로 봅니다.",
  },
  {
    href: "/reports/kleague-salary-comparison-2026/",
    label: "K리그1 구단순위·연봉순위 2026",
    description: "리그 투자와 대표팀 경쟁력 연결을 봅니다.",
  },
  {
    href: "/tools/worldcup-prize-money-calculator/",
    label: "월드컵 포상금 계산기",
    description: "성적별 협회 상금과 선수단 포상금을 계산합니다.",
  },
  {
    href: "/reports/korea-worldcup-squad-salary-2026/",
    label: "대한민국 월드컵 대표팀 연봉 순위",
    description: "대표팀 선수단의 추정 연봉 구조를 함께 확인합니다.",
  },
  {
    href: "/reports/worldcup-squad-salary-total-comparison-2026/",
    label: "월드컵 대표팀 연봉 총액 비교",
    description: "국가별 선수단 연봉 총액을 비교합니다.",
  },
  {
    href: "/reports/korea-football-legends-salary-comparison-2026/",
    label: "한국 축구 레전드 연봉 비교",
    description: "한국 축구 세대별 몸값 변화를 함께 봅니다.",
  },
];

export const SIC_SEO_INTRO = [
  "2026년 7월 6일, 문화체육관광부 장관 최휘영과 박지성이 공동위원장을 맡은 K축구 혁신위원회가 서울 올림픽파크텔에서 공식 출범했습니다. 이영표·박주호 등 축구계 인사와 대한체육회장, 대한축구협회 전무이사, 한국프로축구연맹 사무총장까지 총 9인 체제로 보도됐습니다. 축구혁신위원회를 검색하는 사람은 단순히 위원 명단만 궁금한 것이 아니라, 무엇을 바꾸기 위해 필요한 조직인지, 실제 권한이 있는지, 팬이 체감할 변화가 있는지를 알고 싶어 합니다. 이 페이지는 그 질문을 위원 명단, 대표팀, K리그, 유소년, 심판, 예산, 팬 소통이라는 구조로 나눠 정리합니다.",
  "한국 축구 개혁은 감독 선임 하나로 끝나지 않습니다. 감독 후보를 어떻게 평가하는지, 기술위원회와 이사회가 어떤 기준으로 결정하는지, 유소년과 지도자 교육에 얼마나 투자하는지, K리그 일정과 대표팀 운영이 어떻게 연결되는지까지 함께 봐야 합니다. 그래서 이 리포트는 특정 인물 평가보다 제도와 책임 구조를 중심에 둡니다.",
  "비교계산소에는 이미 월드컵 감독 연봉 비교, K리그 구단 연봉 순위, 월드컵 포상금 계산기처럼 스포츠를 숫자로 읽는 콘텐츠가 있습니다. 축구혁신위원회 콘텐츠는 이 숫자형 콘텐츠를 제도 해설과 연결하는 허브입니다. 대표팀 운영 비용이 궁금하면 감독 연봉 리포트로, 리그 투자 구조가 궁금하면 K리그 연봉 리포트로, 국제대회 보상 구조가 궁금하면 포상금 계산기로 이어서 볼 수 있습니다.",
  "개혁 점수표는 공식 평가가 아니라 공개성, 실행 가능성, 팬 체감, 장기 효과, K리그 연계를 보는 분석용 체크리스트입니다. 점수가 높다고 반드시 좋은 제도라는 뜻은 아니며, 공개된 자료를 바탕으로 어떤 항목을 먼저 확인해야 하는지 보여주는 읽기 도구에 가깝습니다. 공식 발표가 나오면 실제 안건과 비교해 업데이트해야 합니다.",
  "위원회 명칭, 출범일, 위원 명단은 2026년 7월 6일 다수 언론 보도를 기준으로 확인했지만, 세부 권한 범위와 예산은 아직 공식 발표 전입니다. 확인되지 않은 항목은 임의로 추정하지 않고 '확인 필요'로 표시합니다. 이 원칙을 지켜야 검색 유입뿐 아니라 페이지 신뢰도도 오래 유지됩니다.",
  "박지성·이영표·박주호가 위원으로 선정된 배경도 눈여겨볼 지점입니다. 최휘영 문체부 장관은 부당함에 목소리를 낸 인물, 국민적 신뢰와 축구계 신망이 있는 인물, 차기 축구협회장 선거에 출마하지 않을 인물이라는 3가지 기준을 제시했습니다. 협회장 선거와 거리를 둔 인사들에게 개혁을 맡긴 것은 논의의 독립성을 확보하려는 의도로 풀이됩니다. 박지성 공동위원장은 출범식에서 '한국 축구가 좋은 방향으로 개선돼 스포츠가 나아가야 할 선두 주자가 됐으면 한다'고 소감을 밝혔습니다.",
];

export const SIC_SEO_CRITERIA = [
  "공식 발표와 보도 기준을 분리합니다.",
  "공개되지 않은 위원 명단이나 예산은 추정하지 않습니다.",
  "점수표는 자체 분석이며 공식 평가가 아닙니다.",
  "금액이 들어가는 경우 공식, 보도 기준, 추정, 확인 필요 배지를 붙입니다.",
];

export const SIC_FAQ: FaqItem[] = [
  {
    question: "K축구 혁신위원회는 공식 조직인가요?",
    answer:
      "네, 2026년 7월 6일 서울 올림픽파크텔에서 공식 출범했습니다. 문화체육관광부 장관 최휘영과 박지성이 공동위원장을 맡았으며, 2026 북중미 월드컵을 계기로 제기된 한국 축구 혁신 요구에 대응하기 위해 구성됐습니다.",
  },
  {
    question: "위원회 멤버는 누구인가요?",
    answer:
      "공동위원장은 최휘영 문체부 장관과 박지성(FIFA 분과위원회 위원)입니다. 위원으로는 이영표·박주호(축구 해설위원), 유승민(대한체육회장), 김승희(대한축구협회 전무이사), 조연상(한국프로축구연맹 사무총장), 유영근(변호사), 김대희(교수)가 보도됐습니다.",
  },
  {
    question: "박지성·이영표·박주호는 왜 위원으로 선정됐나요?",
    answer:
      "최휘영 문체부 장관은 부당함에 맞서 목소리를 낸 인물, 국민적 신뢰와 축구계 신망이 있는 인물, 차기 축구협회장 선거에 출마하지 않을 인물이라는 3가지 기준으로 이들을 선정했다고 밝혔습니다. 협회장 선거와 거리를 두게 해 개혁 논의의 독립성을 확보하려는 의도로 해석됩니다.",
  },
  {
    question: "축구혁신위원회는 무엇을 바꾸나요?",
    answer:
      "대표팀 운영, 감독 선임 절차, 협회 의사결정, 유소년 육성, K리그 연계, 심판 신뢰, 팬 소통 같은 구조적 과제를 다룰 수 있습니다. 실제 안건은 공식 발표가 나오면 그 기준으로 업데이트해야 합니다.",
  },
  {
    question: "감독 선임 문제가 핵심인가요?",
    answer:
      "중요한 축이지만 전부는 아닙니다. 감독 선임은 협회 의사결정, 기술위원회 운영, 예산과 책임 구조가 드러나는 대표 사례로 봐야 합니다.",
  },
  {
    question: "축구협회 예산도 공개되나요?",
    answer:
      "공개 범위는 공식 자료를 확인해야 합니다. 이 페이지에서는 공식 확인 가능한 항목과 공개가 필요한 항목을 나눠 표시하며, 확인되지 않은 금액은 임의로 추정하지 않습니다.",
  },
  {
    question: "K리그와 축구혁신위원회는 어떤 관련이 있나요?",
    answer:
      "대표팀 경쟁력은 K리그 경기력, 구단 투자, 유소년 육성, 선수 연봉 구조와 연결됩니다. 따라서 대표팀만 따로 보는 것보다 리그 구조와 함께 봐야 합니다.",
  },
  {
    question: "개혁 점수표는 공식 평가인가요?",
    answer:
      "아닙니다. 공개성, 실행 가능성, 팬 체감, 장기 효과, K리그 연계를 기준으로 한 분석용 체크리스트입니다. 실제 제도 변화 여부는 공식 발표와 후속 실행 결과를 기준으로 봐야 합니다.",
  },
  {
    question: "해외 사례는 어떻게 비교하나요?",
    answer:
      "일본, 독일, 잉글랜드처럼 유소년·지도자·리그 구조가 자주 언급되는 국가를 참고하되, 구체 수치는 공식자료나 신뢰 가능한 보도 기준으로만 사용합니다. 협회와 리그 구조가 다르기 때문에 단순 복제처럼 설명하지 않습니다.",
  },
  {
    question: "이 페이지는 특정 인물을 비판하는 글인가요?",
    answer:
      "아닙니다. 특정 인물보다 한국 축구의 의사결정 구조와 예산·제도 개선 과제를 정리하는 해설 리포트입니다. 비판이 필요한 지점도 인물 공격보다 기준과 책임 구조 중심으로 다룹니다.",
  },
];
