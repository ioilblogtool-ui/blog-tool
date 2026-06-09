// ── 2026 광역단체장 재산 격차 분석 데이터 ──────────────────────────
// 출처: 중앙선거관리위원회 후보자 재산신고 (2026년 5~6월 선관위 공개 자료)
// 단위: 만원 (totalAsset)
// 주의: 선관위 후보 등록 기준 신고액. 취임 후 공직자윤리위원회 공시와 다를 수 있음.

export const LWG_META = {
  slug: "local-leaders-wealth-gap-2026",
  title: "2026 광역단체장 재산 순위 — 오세훈 72.9억 vs 위성곤 5.7억, 격차 13배",
  seoTitle: "2026 광역단체장 재산 순위 비교 | 시도지사 16명 재산 격차 분석",
  seoDescription:
    "2026 지방선거 당선 광역단체장 16명 재산 순위를 한눈에 비교. 오세훈(72.9억)·추경호(47.1억) vs 위성곤(5.7억)·허태정(5.9억) — 재산 격차 13배. 국민의힘·민주당 평균 재산 비교 포함.",
  dataNote:
    "선관위 후보 등록 기준 재산신고액 (2026년 5~6월). 선관위 원문 및 보도 기준 수치.",
  publishedDate: "2026-06-09",
};

export interface LeaderWealth {
  rank: number;
  regionId: string;
  regionNameKo: string;
  name: string;
  party: "국민의힘" | "더불어민주당";
  position: string;
  totalAsset: number; // 만원
  noteText?: string;
}

// 재산 순위 (내림차순 정렬)
export const LWG_RANKINGS: LeaderWealth[] = [
  {
    rank: 1,
    regionId: "seoul",
    regionNameKo: "서울",
    name: "오세훈",
    party: "국민의힘",
    position: "서울시장",
    totalAsset: 728960,
    noteText: "보도 기준 약 72.9억",
  },
  {
    rank: 2,
    regionId: "daegu",
    regionNameKo: "대구",
    name: "추경호",
    party: "국민의힘",
    position: "대구시장",
    totalAsset: 471069,
    noteText: "선관위 후보 등록 기준 약 47.1억",
  },
  {
    rank: 3,
    regionId: "chungbuk",
    regionNameKo: "충북",
    name: "신용한",
    party: "더불어민주당",
    position: "충북도지사",
    totalAsset: 339874,
    noteText: "선관위 후보 등록 기준 약 34.0억",
  },
  {
    rank: 4,
    regionId: "incheon",
    regionNameKo: "인천",
    name: "박찬대",
    party: "더불어민주당",
    position: "인천시장",
    totalAsset: 307610,
    noteText: "선관위 후보 등록 기준 약 30.8억",
  },
  {
    rank: 5,
    regionId: "gyeonggi",
    regionNameKo: "경기",
    name: "추미애",
    party: "더불어민주당",
    position: "경기도지사",
    totalAsset: 279641,
    noteText: "선관위 후보 등록 기준 약 28.0억",
  },
  {
    rank: 6,
    regionId: "gyeongnam",
    regionNameKo: "경남",
    name: "박완수",
    party: "국민의힘",
    position: "경남도지사",
    totalAsset: 198774,
    noteText: "선관위 후보 등록 기준 약 19.9억",
  },
  {
    rank: 7,
    regionId: "ulsan",
    regionNameKo: "울산",
    name: "김상욱",
    party: "더불어민주당",
    position: "울산시장",
    totalAsset: 196763,
    noteText: "선관위 후보 등록 기준 약 19.7억",
  },
  {
    rank: 8,
    regionId: "gyeongbuk",
    regionNameKo: "경북",
    name: "이철우",
    party: "국민의힘",
    position: "경북도지사",
    totalAsset: 190260,
    noteText: "선관위 후보 등록 기준 약 19.0억",
  },
  {
    rank: 9,
    regionId: "gwangju-jeonnam",
    regionNameKo: "광주·전남",
    name: "민형배",
    party: "더불어민주당",
    position: "광주전남특별시장",
    totalAsset: 183026,
    noteText: "광주·전남 통합특별시 초대시장. 약 18.3억",
  },
  {
    rank: 10,
    regionId: "gangwon",
    regionNameKo: "강원",
    name: "우상호",
    party: "더불어민주당",
    position: "강원도지사",
    totalAsset: 176490,
    noteText: "선관위 후보 등록 기준 약 17.6억",
  },
  {
    rank: 11,
    regionId: "jeonbuk",
    regionNameKo: "전북",
    name: "이원택",
    party: "더불어민주당",
    position: "전북도지사",
    totalAsset: 136304,
    noteText: "선관위 후보 등록 기준 약 13.6억",
  },
  {
    rank: 12,
    regionId: "sejong",
    regionNameKo: "세종",
    name: "조상호",
    party: "더불어민주당",
    position: "세종시장",
    totalAsset: 87810,
    noteText: "선관위 후보 등록 기준 약 8.8억",
  },
  {
    rank: 13,
    regionId: "chungnam",
    regionNameKo: "충남",
    name: "박수현",
    party: "더불어민주당",
    position: "충남도지사",
    totalAsset: 74419,
    noteText: "선관위 후보 등록 기준 약 7.4억",
  },
  {
    rank: 14,
    regionId: "busan",
    regionNameKo: "부산",
    name: "전재수",
    party: "더불어민주당",
    position: "부산시장",
    totalAsset: 71724,
    noteText: "선관위 후보 등록 기준 약 7.2억",
  },
  {
    rank: 15,
    regionId: "daejeon",
    regionNameKo: "대전",
    name: "허태정",
    party: "더불어민주당",
    position: "대전시장",
    totalAsset: 59361,
    noteText: "선관위 후보 등록 기준 약 5.9억",
  },
  {
    rank: 16,
    regionId: "jeju",
    regionNameKo: "제주",
    name: "위성곤",
    party: "더불어민주당",
    position: "제주도지사",
    totalAsset: 57087,
    noteText: "선관위 후보 등록 기준 약 5.7억",
  },
];

// ── 분석 통계 ──────────────────────────────────────────────────
export const LWG_STATS = {
  totalCount: 16,
  totalSum: 3559172, // 만원 합계
  avgAsset: 222448, // 만원 평균 ≈ 22.2억
  maxAsset: 728960, // 오세훈
  minAsset: 57087, // 위성곤
  gapRatio: 12.8, // 최고/최저 배율

  // 정당별
  ppp: {
    label: "국민의힘",
    count: 4,
    avgAsset: 397266, // (728960+471069+198774+190260)/4
    totalSum: 1589063,
    members: ["오세훈", "추경호", "박완수", "이철우"],
  },
  dp: {
    label: "더불어민주당",
    count: 12,
    avgAsset: 164176, // 1970109/12
    totalSum: 1970109,
    members: [
      "신용한",
      "박찬대",
      "추미애",
      "김상욱",
      "민형배",
      "우상호",
      "이원택",
      "조상호",
      "박수현",
      "전재수",
      "허태정",
      "위성곤",
    ],
  },
};

// ── 재산 구간 분포 ─────────────────────────────────────────────
export const LWG_BRACKETS = [
  { label: "50억 이상", min: 5000000, max: Infinity, count: 1, members: ["오세훈"] },
  { label: "30~50억", min: 3000000, max: 5000000, count: 1, members: ["추경호"] },
  { label: "20~30억", min: 2000000, max: 3000000, count: 3, members: ["신용한", "박찬대", "추미애"] },
  { label: "10~20억", min: 1000000, max: 2000000, count: 6, members: ["박완수", "김상욱", "이철우", "민형배", "우상호", "이원택"] },
  { label: "5~10억", min: 500000, max: 1000000, count: 5, members: ["조상호", "박수현", "전재수", "허태정", "위성곤"] },
];

// ── FAQ ───────────────────────────────────────────────────────
export const LWG_FAQ = [
  {
    q: "재산 신고액은 어떤 기준인가요?",
    a: "선거 후보 등록 시 선관위에 의무적으로 신고하는 재산입니다. 본인·배우자·직계 존비속 합산 재산을 신고하며, 부동산·예금·주식·채무 등을 포함합니다. 취임 후에는 공직자윤리위원회에 별도로 재산 변동 신고를 하게 됩니다.",
  },
  {
    q: "국민의힘 평균이 더 높은 이유는 무엇인가요?",
    a: "2026 지방선거에서 국민의힘이 당선된 4개 지역은 서울·대구·경북·경남입니다. 특히 오세훈 서울시장(72.9억)과 추경호 대구시장(47.1억)의 재산이 국민의힘 평균을 높이고 있습니다. 정당보다는 개인 재산 차이가 크게 작용합니다.",
  },
  {
    q: "재산이 많은 단체장이 더 잘 일하나요?",
    a: "재산 규모와 행정 역량은 직접적인 관계가 없습니다. 재산 공개는 공직자 투명성 확보와 이해충돌 방지를 위한 제도입니다. 단체장의 재산이 많다고 해서 행정 성과가 좋거나, 적다고 낮은 것은 아닙니다.",
  },
  {
    q: "광주·전남 통합특별시란 무엇인가요?",
    a: "광주광역시와 전라남도를 통합해 출범하는 특별시로, 2026년 7월 1일 출범 예정입니다. 민형배 초대 광주전남특별시장이 2026 지방선거에서 당선되었습니다.",
  },
  {
    q: "이 재산 순위는 공식 자료인가요?",
    a: "선관위 후보 등록 신고액 기준이며, 당선 후 공직자 재산공시는 정부공직자윤리위원회를 통해 별도로 발표됩니다. 이 페이지는 선관위 공개 자료 및 보도를 기반으로 작성되었으며 취임 후 공시와는 차이가 있을 수 있습니다.",
  },
];

// ── Related Links ──────────────────────────────────────────────
export const LWG_RELATED_LINKS = [
  {
    href: "/reports/local-election-winners-assets-2026/",
    label: "2026 시도지사 당선자 재산 공개",
    desc: "16명 개별 재산·이력 카드 보기",
  },
  {
    href: "/reports/governor-mayor-candidate-assets-comparison-2026/",
    label: "시장·도지사 후보 재산 비교",
    desc: "여야 후보별 재산 비교 리포트",
  },
  {
    href: "/tools/gift-tax-calculator/",
    label: "증여세 계산기",
    desc: "가족 간 재산 이전 시 세금 계산",
  },
  {
    href: "/tools/capital-gains-tax-calculator/",
    label: "양도소득세 계산기",
    desc: "부동산 매도 시 양도세 계산",
  },
];
