export interface DemandItem {
  id: string;
  title: string;
  unionPosition: string;
  companyPosition: string;
  gapNote: string;
}

export const DEMAND_ITEMS: DemandItem[] = [
  {
    id: "bonus-rate",
    title: "성과급 비율",
    unionPosition: "영업이익의 13~14% 수준 (1인당 약 1,000만원 보도)",
    companyPosition: "영업이익의 10% 수준",
    gapNote: "비율 자체는 3~4%p 차이지만 RSU 포함 여부에 따라 체감 격차는 더 커짐",
  },
  {
    id: "rsu",
    title: "RSU(양도제한조건부주식) 처리",
    unionPosition: "성과급 재원에서 제외하고 별도 지급",
    companyPosition: "성과 보상의 일부로 포함",
    gapNote: "같은 '성과급 10%'라도 RSU 포함 여부에 따라 실질 현금 보상이 크게 달라짐",
  },
  {
    id: "employment",
    title: "고용안정",
    unionPosition: "계열사 매각·분사·구조조정 시 고용안정 보장",
    companyPosition: "구조조정은 경영 판단 영역이라는 원칙적 입장",
    gapNote: "노조가 가장 강조하는 항목 — \"핵심은 성과급이 아니라 고용안정\"",
  },
  {
    id: "transparency",
    title: "보상 투명성",
    unionPosition: "보상 산정 기준과 의사결정 과정 공개 요구",
    companyPosition: "공식 입장 명확히 보도되지 않음",
    gapNote: "정보 비대칭 자체가 신뢰 문제로 이어지고 있음",
  },
];

export interface TimelineItem {
  date: string;
  label: string;
  sourceName: string;
  sourceUrl: string;
}

export const TIMELINE: TimelineItem[] = [
  {
    date: "2026-05-18",
    label: "경기지방노동위원회 조정 실패, 조정기일 5.27로 연장",
    sourceName: "다음뉴스",
    sourceUrl: "https://v.daum.net/v/20260525181741526",
  },
  {
    date: "2026-05-20",
    label: "본사 포함 5개 법인 파업 찬반투표 전부 가결",
    sourceName: "한국경제",
    sourceUrl: "https://www.hankyung.com/article/202605208898g",
  },
  {
    date: "2026-06-10",
    label: "카카오 창사 첫 파업 — 4시간 부분파업, 약 1,500명 참여",
    sourceName: "비즈워치",
    sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020",
  },
  {
    date: "2026-06-29(예정)",
    label: "노조, 대규모 총파업 카운트다운 예고",
    sourceName: "경기일보",
    sourceUrl: "https://www.kyeonggi.com/article/20260610580179",
  },
];

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  {
    label: "파업 형태",
    value: "창사 첫 파업, 4시간 부분파업 (2026.6.10)",
    sourceName: "비즈워치",
    sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020",
  },
  {
    label: "참여 법인",
    value: "본사·카카오페이·카카오엔터프라이즈·디케이테크인·엑스엘게임즈 5곳",
    sourceName: "ZDNet Korea",
    sourceUrl: "https://zdnet.co.kr/view/?no=20260610162159",
  },
  {
    label: "참여 인원",
    value: "약 1,500명",
    sourceName: "비즈워치",
    sourceUrl: "https://news.bizwatch.co.kr/article/mobile/2026/06/10/0020",
  },
  {
    label: "파업투표 결과",
    value: "5개 법인 모두 찬성 가결 (2026.5.20)",
    sourceName: "한국경제",
    sourceUrl: "https://www.hankyung.com/article/202605208898g",
  },
  {
    label: "조정 현황",
    value: "경기지노위 조정 실패, 조정기일 연장",
    sourceName: "다음뉴스",
    sourceUrl: "https://v.daum.net/v/20260525181741526",
  },
  {
    label: "노조 공식 입장",
    value: "\"성과급 집단 프레임 경계, 핵심은 고용안정\"",
    sourceName: "쿠키뉴스",
    sourceUrl: "https://www.kukinews.com/article/view/kuk202605130165",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const KKU_FAQ: FaqItem[] = [
  {
    question: "카카오는 왜 창사 첫 파업을 했나요?",
    answer:
      "성과급 비율, RSU 처리 방식, 고용안정, 보상 투명성을 둘러싼 노사 갈등이 봉합되지 않으면서 2026년 6월 10일 본사 포함 5개 법인이 4시간 부분파업에 들어갔습니다.",
  },
  {
    question: "카카오 성과급 비율은 얼마로 정해졌나요?",
    answer:
      "아직 확정되지 않았습니다. 회사는 영업이익의 10% 수준을 제안했고, 노조는 13~14% 수준(1인당 약 1,000만원)을 요구하고 있어 협상이 진행 중입니다.",
  },
  {
    question: "RSU가 왜 쟁점인가요?",
    answer:
      "회사는 RSU(양도제한조건부주식)를 성과 보상의 일부로 포함하자는 입장이고, 노조는 RSU를 성과급 재원에서 빼고 별도로 지급해야 한다는 입장입니다. 같은 비율의 성과급이라도 RSU 포함 여부에 따라 실질 현금 보상이 크게 달라집니다.",
  },
  {
    question: "카카오 노조가 가장 강조하는 요구는 무엇인가요?",
    answer:
      "노조는 스스로 '성과급 집단행동' 프레임을 경계하며, 계열사 매각·분사·구조조정 과정에서의 고용안정 보장이 핵심이라고 밝혔습니다.",
  },
  {
    question: "파업에 참여한 법인은 어디인가요?",
    answer:
      "카카오 본사, 카카오페이, 카카오엔터프라이즈, 디케이테크인, 엑스엘게임즈 등 5개 법인이 파업 찬반투표를 가결했고, 6월 10일 부분파업에 동참했습니다.",
  },
  {
    question: "노동위원회 조정은 어떻게 진행되고 있나요?",
    answer:
      "2026년 5월 18일 경기지방노동위원회 조정이 실패했고, 조정기일이 5월 27일로 연장됐습니다. 이후 진행 상황은 최신 보도로 확인이 필요합니다.",
  },
  {
    question: "앞으로 파업이 더 커질 수 있나요?",
    answer:
      "노조는 '부분 파업으로는 부족하다'는 입장을 밝히며 6월 29일 대규모 총파업을 예고했습니다. 협상 진전이 없으면 파업 시간 확대나 전면파업으로 이어질 가능성이 있습니다.",
  },
  {
    question: "현대차·삼성바이오로직스 갈등과 어떻게 다른가요?",
    answer:
      "현대차·삼바는 성과급 비율(%) 자체가 핵심 쟁점이었다면, 카카오는 비율 외에도 RSU 처리 방식과 고용안정 요구까지 얽혀 있어 단순 수치 비교만으로는 설명하기 어렵습니다.",
  },
];

export const SEO_CRITERIA: string[] = [
  "노조 요구와 회사 입장은 모두 공개 보도를 기준으로 인용",
  "성과급 1인당 금액(약 1,000만원)은 노조 측 주장 인용이며 확정치가 아님",
  "RSU 포함 여부에 따라 같은 비율(%)이라도 실질 현금 보상이 달라질 수 있음",
  "협상이 진행 중인 사안으로, 최종 합의 시 이 페이지 내용은 업데이트될 수 있음",
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/hyundai-motor-union-bonus-2026/", label: "현대차 성과급 30% 요구 계산" },
  { href: "/reports/samsung-biologics-union-bonus-2026/", label: "삼성바이오로직스 성과급 20% 요구 계산" },
  { href: "/tools/it-bigtech-bonus-comparison/", label: "IT 빅테크 성과급 비교" },
];

export const KKU_META = {
  slug: "kakao-union-bonus-2026",
  title: "카카오 성과급 갈등 2026 | 첫 부분파업, 무엇이 쟁점인가",
  seoTitle: "카카오 성과급 갈등 2026 | 첫 부분파업 핵심 쟁점 정리",
  description:
    "카카오 노조의 성과급 비율, RSU 처리, 고용안정, 투명성 요구를 회사 입장과 나란히 비교. 창사 첫 부분파업까지 이어진 갈등의 핵심을 정리합니다.",
  updatedAt: "2026-06-26",
};
