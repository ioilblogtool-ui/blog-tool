export type GrantStage = "applying" | "confirmed" | "conditional" | "inProgress" | "drafting" | "paid";

export interface GrantMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  updatedAt: string;
  correctionNotice: string;
  dataNotice: string;
}

export const LGR_META: GrantMeta = {
  slug: "livelihood-grant-by-region-2026",
  title: "지자체 민생지원금 2026 완전 정리",
  seoTitle: "지자체 민생지원금 2026 완전 정리 | 우리 지역도 받을 수 있을까",
  seoDescription:
    "영동군 80만원, 보은군 60만원부터 속초·나주·고흥 추석 전 지급까지 2026년 지자체별 자체 민생지원금 19곳을 금액·대상·신청기간 기준으로 정리했습니다.",
  description:
    "중앙정부의 전국민 4차 민생지원금은 아직 확정되지 않았습니다. 대신 일부 지자체가 자체 예산으로 전 주민 지원금을 지급했거나 추진 중입니다. 진행중 5곳과 지급완료 11곳을 정리했습니다.",
  updatedAt: "2026-08-07",
  correctionNotice:
    "2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 민생지원금은 확정된 바 없습니다. 이 페이지가 다루는 것은 개별 지자체가 자체 예산(추경)으로 지급하는 지원금입니다.",
  dataNotice:
    "지역별 금액·시기는 각 지자체·언론 공식 발표를 기준으로 정리했으며, 추경 심의·조례 제정 결과에 따라 바뀔 수 있습니다. 신청 전 반드시 해당 지자체 공식 공고를 확인하세요.",
};

export interface GrantRegion {
  id: string;
  regionName: string;
  amountLabel: string;
  amountManwon: number | null;
  stage: GrantStage;
  stageLabel: string;
  timing: string;
  method: string;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const LGR_IN_PROGRESS: GrantRegion[] = [
  {
    id: "sokcho",
    regionName: "강원 속초시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "applying",
    stageLabel: "신청중",
    timing: "신청 7/20~9/11 · 사용기한 11/30",
    method: "무기명 선불카드 · 속초사랑상품권",
    sourceLabel: "서울신문",
    sourceUrl: "https://www.seoul.co.kr/news/society/2026/07/16/20260716500184",
  },
  {
    id: "yeongdong-2",
    regionName: "충북 영동군 (2차)",
    amountLabel: "1인당 30만원 · 1차 포함 누적 80만원",
    amountManwon: 30,
    stage: "confirmed",
    stageLabel: "추경 확정",
    timing: "추석 전 9월 지급 · 사용기한 12/31",
    method: "레인보우영동페이",
    note: "1차 50만원은 상반기 지급 완료. 2차 30만원은 3회 추경 의결로 확정.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260714_0003708487",
  },
  {
    id: "naju",
    regionName: "전남 나주시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "conditional",
    stageLabel: "추경 전제",
    timing: "9월 제2회 추경 통과 시 9/14부터 신청 · 사용기한 11/30",
    method: "나주사랑상품권 (모바일 앱 충전 · 선불카드)",
    note: "총사업비 약 238억원. 추경이 시의회를 통과해야 지급이 시작됩니다.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260716_0003712472",
  },
  {
    id: "goheung",
    regionName: "전남 고흥군",
    amountLabel: "1인당 30만원",
    amountManwon: 30,
    stage: "inProgress",
    stageLabel: "추진중",
    timing: "추석(9/24) 전 목표",
    method: "고흥사랑상품권(지류)",
    note: "인구 약 5만9천명 기준 예산 약 180억원 추산. 추경·군의회 심의가 남아 있습니다.",
    sourceLabel: "더팩트",
    sourceUrl: "https://news.tf.co.kr/read/releasecopy/2339370.htm",
  },
  {
    id: "hamyang",
    regionName: "경남 함양군",
    amountLabel: "금액 미정",
    amountManwon: null,
    stage: "drafting",
    stageLabel: "조례 단계",
    timing: "조례 입법예고 7/15~8/4 종료",
    method: "미정",
    note: "민생안정지원금 지원 조례안 입법예고 단계로, 지급액·시기가 아직 정해지지 않았습니다.",
    sourceLabel: "국민참여입법센터",
    sourceUrl: "https://opinion.lawmaking.go.kr/gcom/sgLmPp/342529",
  },
];

export const LGR_COMPLETED: GrantRegion[] = [
  {
    id: "boeun",
    regionName: "충북 보은군",
    amountLabel: "1인당 60만원 (30만원×2회)",
    amountManwon: 60,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "4월 마무리",
    method: "선불카드 · 지역화폐",
    note: "민생안정지원금 30만원 + 고유가 피해지원금 30만원, 2개 사업 합산액입니다.",
    sourceLabel: "충북일보",
    sourceUrl: "https://www.inews365.com/news/article.html?no=920884",
  },
  {
    id: "gunwi",
    regionName: "대구 군위군",
    amountLabel: "1인당 54만원",
    amountManwon: 54,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/20~3/23",
    method: "군위사랑상품권(지류)",
    sourceLabel: "군위군청",
    sourceUrl: "https://www.gunwi.go.kr/ko/page.do?board_code=&cmd=2&mnu_uid=666&not_ancmt_mgt_no=25575",
  },
  {
    id: "yeongdong-1",
    regionName: "충북 영동군 (1차)",
    amountLabel: "1인당 50만원",
    amountManwon: 50,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "상반기",
    method: "레인보우영동페이",
    note: "2차 30만원은 진행중 목록을 참고하세요. 누적 80만원.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260714_0003708487",
  },
  {
    id: "goesan",
    regionName: "충북 괴산군",
    amountLabel: "1인당 50만원",
    amountManwon: 50,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/19~2/27 · 사용기한 5/31",
    method: "괴산사랑카드",
    note: "예산 총 180억원.",
    sourceLabel: "뉴스1",
    sourceUrl: "https://www.news1.kr/local/sejong-chungbuk/6001462",
  },
  {
    id: "uiseong",
    regionName: "경북 의성군",
    amountLabel: "일반세대 2인이상 60만원 (최대 200만원)",
    amountManwon: 60,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "6월 20일 일괄 지급",
    method: "업종별 상이",
    note: "일반세대 1인 30만/2인이상 60만, 소상공인 최대 200만, 농업인 60~150만 등 업종별 차등. 총 312억원, 중복 지원 불가.",
    sourceLabel: "경북매일",
    sourceUrl: "https://www.kbmaeil.com/article/20260619500081",
  },
  {
    id: "jeongeup",
    regionName: "전북 정읍시",
    amountLabel: "1인당 30만원 (2차분)",
    amountManwon: 30,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/19~2/13 · 사용기한 5/31",
    method: "무기명 선불카드 · 정읍사랑상품권",
    note: "3차 고유가 피해 지원금이 별도로 추진 중이며 금액은 아직 미정입니다.",
    sourceLabel: "프레시안",
    sourceUrl: "https://www.pressian.com/pages/articles/2026011216530183077",
  },
  {
    id: "boseong",
    regionName: "전남 보성군",
    amountLabel: "1인당 30만원",
    amountManwon: 30,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/2~3/6",
    method: "보성사랑상품권",
    note: "가맹점 2,251개.",
    sourceLabel: "스포츠서울",
    sourceUrl: "https://www.sportsseoul.com/news/read/1581541",
  },
  {
    id: "namwon",
    regionName: "전북 남원시",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 2/2~2/27 · 사용기한 6/30",
    method: "무기명 선불카드",
    sourceLabel: "남원시청",
    sourceUrl: "https://www.namwon.go.kr/board/post/view.do?boardUid=ff8080818ea1b850018ea1e3e9ad0081",
  },
  {
    id: "imsil",
    regionName: "전북 임실군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/12~2/6 · 사용기한 6/30",
    method: "무기명 선불카드",
    note: "총 51억원. 신청 2주 만에 지급률 94%.",
    sourceLabel: "문화일보",
    sourceUrl: "https://www.munhwa.com/article/11560024",
  },
  {
    id: "danyang",
    regionName: "충북 단양군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 1/12~2/13",
    method: "단양사랑상품권(지류)",
    sourceLabel: "아시아투데이",
    sourceUrl: "https://www.asiatoday.co.kr/kn/view.php?key=20260105010001259",
  },
  {
    id: "sancheong",
    regionName: "경남 산청군",
    amountLabel: "1인당 20만원",
    amountManwon: 20,
    stage: "paid",
    stageLabel: "지급완료",
    timing: "신청 3/30~4/30 · 사용기한 9/30",
    method: "선불카드",
    sourceLabel: "잡포스트",
    sourceUrl: "https://www.job-post.co.kr/news/articleView.html?idxno=211118",
  },
];

export interface KpiCardItem {
  label: string;
  value: string;
  note: string;
}

export const LGR_KPI_CARDS: KpiCardItem[] = [
  {
    label: "전국민 4차 지원금",
    value: "확정 아님",
    note: "2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 지원금은 없습니다.",
  },
  {
    label: "누적 최고액",
    value: "80만원",
    note: "충북 영동군 · 1차 50만원 + 2차 30만원 합산 기준.",
  },
  {
    label: "지금 진행중인 지역",
    value: "5곳",
    note: "속초·영동(2차)·나주·고흥·함양 — 단계는 지역마다 다릅니다.",
  },
  {
    label: "이미 지급 완료된 지역",
    value: "11곳",
    note: "2026년 상반기~7월 기준으로 확인된 지역입니다.",
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const LGR_FAQ: FaqItem[] = [
  {
    q: "4차 민생지원금이 전국적으로 확정된 게 맞나요?",
    a: "아닙니다. 2026-08-07 현재 중앙정부 차원의 전국민 대상 4차 지원금은 확정되지 않았습니다. 이 페이지가 다루는 것은 일부 기초자치단체가 자체 예산으로 지급하는 지원금입니다.",
  },
  {
    q: "지금 신청 가능한 지역은 어디인가요?",
    a: "2026-08-07 기준 속초시가 신청을 받고 있습니다(9/11까지). 영동군 2차는 추석 전 지급이 확정됐고, 나주시·고흥군은 추경·심의를 앞두고 있어 아직 신청 시작 전입니다.",
  },
  {
    q: "나주시·고흥군은 확정된 건가요?",
    a: "아직 확정 단계는 아닙니다. 나주시는 9월 추경이 시의회를 통과해야 지급이 시작되고, 고흥군은 추경 편성과 군의회 심의가 남아 있습니다. 확정되면 이 페이지를 업데이트합니다.",
  },
  {
    q: "우리 지역이 목록에 없으면 지원금이 없는 건가요?",
    a: "이 페이지에 없다고 해서 앞으로도 없다는 뜻은 아닙니다. 다만 2026-08-07 기준으로 확인된 지자체만 정리했으며, 새로운 지역이 발표되면 추가할 예정입니다.",
  },
  {
    q: "보은군은 왜 60만원이 두 번 나오나요?",
    a: "보은군의 60만원은 단일 지급이 아니라 민생안정지원금 30만원과 고유가 피해지원금 30만원, 서로 다른 두 사업을 합산한 금액입니다.",
  },
  {
    q: "이 페이지 정보는 얼마나 최신인가요?",
    a: "2026-08-07 기준으로 각 지자체·언론 공식 발표를 확인해 정리했습니다. 추경 심의 결과나 조례 제정 여부에 따라 내용이 바뀔 수 있어 신청 전 해당 지자체 공식 공고를 다시 확인해야 합니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const LGR_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/welfare-benefit-eligibility/", label: "정부 지원금 대상 조회" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지 지원금 총정리" },
  { href: "/reports/birth-support-by-region-2026/", label: "2026 지역별 출산지원금 완전 비교" },
  { href: "/reports/seoul-gyeonggi-youth-allowance-comparison-2026/", label: "서울 vs 경기 청년수당 비교 2026" },
];
