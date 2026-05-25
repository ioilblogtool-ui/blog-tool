export type DataBadge = "확인됨" | "추정" | "참고";

export interface HynixShuttleZone {
  id: string;
  name: string;
  areas: string[];
  targetCampus: string[];
  commuteMin: number | null;
  commuteNote: string;
  badge: DataBadge;
}

export interface ApartmentArea {
  zoneId: string;
  district: string;
  priceJeonseManwon: number | null;
  priceMeomaeManwon: number | null;
  pricePerPyeong: number | null;
  note: string;
  sourceDate: string;
  badge: DataBadge;
}

export interface HynixShuttleFaq {
  question: string;
  answer: string;
}

export const SK_HYNIX_SHUTTLE_META = {
  title: "SK하이닉스 셔틀버스 노선별 아파트 시세 정리 2026",
  description: "이천 본사·청주·판교 캠퍼스별 주요 셔틀 권역 아파트 전세·매매 시세를 정리했습니다.",
  updatedAt: "2026년 1분기",
  caution:
    "셔틀 정류장 지역은 재직자 커뮤니티 기반 추정이며, 노선은 HAPPYROAD 앱 또는 사내 포털에서 확인 필요합니다. 아파트 시세는 국토부 실거래가 참고값입니다.",
};

export const SK_HYNIX_SHUTTLE_ZONES: HynixShuttleZone[] = [
  {
    id: "gangnam",
    name: "강남·양재권",
    areas: ["강남역 1번출구", "역삼역 2번출구", "양재역", "서초 우성아파트 앞"],
    targetCampus: ["이천 본사"],
    commuteMin: 80,
    commuteNote: "이천 본사 기준 약 80~100분 추정. 경부선 버스전용차선 경유.",
    badge: "확인됨",
  },
  {
    id: "pangyo_bundang",
    name: "판교·분당권",
    areas: ["판교역", "현대백화점 판교점", "정자역", "미금역", "수내역"],
    targetCampus: ["이천 본사", "판교 사무소"],
    commuteMin: 40,
    commuteNote: "판교 현백 기준 약 40분, 정자역 약 50분. 판교 사무소는 현지 출퇴근.",
    badge: "확인됨",
  },
  {
    id: "gwangju_gonjiam",
    name: "광주·곤지암권",
    areas: ["경기 광주시", "곤지암읍"],
    targetCampus: ["이천 본사"],
    commuteMin: 25,
    commuteNote: "이천 본사 기준 약 20~30분. 수도권 최근거리 외곽 거점.",
    badge: "추정",
  },
  {
    id: "icheon_local",
    name: "이천 현지",
    areas: ["이천시 부발읍", "이천시내", "증포동"],
    targetCampus: ["이천 본사 (M10·M14·M16·M17)"],
    commuteMin: 10,
    commuteNote: "본사 직근 5~15분. 생활 인프라와 자녀 교육 여건은 별도 확인 필요.",
    badge: "확인됨",
  },
  {
    id: "cheongju",
    name: "청주 M15권",
    areas: ["청주시 흥덕구", "오창읍", "청주시내"],
    targetCampus: ["청주 M15"],
    commuteMin: 15,
    commuteNote: "청주 M15 기준 10~20분. 수도권 발령자는 청주 왕복 통근이 현실적으로 어려움.",
    badge: "추정",
  },
];

export const APARTMENT_AREAS: ApartmentArea[] = [
  {
    zoneId: "gangnam",
    district: "서초구 반포·방배동, 강남구 역삼동",
    priceJeonseManwon: 75000,
    priceMeomaeManwon: 230000,
    pricePerPyeong: 7200,
    note: "이천 셔틀 강남권. 탑승 시간 80~100분으로 가장 길다.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  {
    zoneId: "pangyo_bundang",
    district: "성남시 분당구 판교동·백현동",
    priceJeonseManwon: 62000,
    priceMeomaeManwon: 155000,
    pricePerPyeong: 4800,
    note: "이천 셔틀 약 40분. 판교 사무소 발령 시 현지 통근 가능.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  {
    zoneId: "pangyo_bundang",
    district: "성남시 분당구 정자·수내·이매동",
    priceJeonseManwon: 45000,
    priceMeomaeManwon: 100000,
    pricePerPyeong: 3100,
    note: "판교보다 저렴한 분당 구축. 이천·판교 모두 접근 가능한 중간 거점.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  {
    zoneId: "gwangju_gonjiam",
    district: "경기 광주시 곤지암읍·초월읍",
    priceJeonseManwon: 20000,
    priceMeomaeManwon: 35000,
    pricePerPyeong: 1100,
    note: "이천 30분 권역. 신혼·초기 거주 선택지. 생활 인프라 수원·판교 대비 부족.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  {
    zoneId: "icheon_local",
    district: "경기 이천시 부발읍·증포동",
    priceJeonseManwon: 15000,
    priceMeomaeManwon: 28000,
    pricePerPyeong: 880,
    note: "본사 직근 최저가. 생활·교육 인프라 수도권 대비 제한적.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
  {
    zoneId: "cheongju",
    district: "충북 청주시 흥덕구 오창읍",
    priceJeonseManwon: 18000,
    priceMeomaeManwon: 32000,
    pricePerPyeong: 1000,
    note: "청주 M15 발령 기준. 오창지구 신축 단지 증가 중.",
    sourceDate: "2026년 1분기",
    badge: "추정",
  },
];

export const SK_HYNIX_SHUTTLE_FAQ: HynixShuttleFaq[] = [
  {
    question: "이천 발령을 받으면 꼭 이천에 살아야 하나요?",
    answer:
      "이천 거주가 필수는 아닙니다. 강남권과 판교·분당권에서 셔틀버스를 이용하는 선택지도 있습니다. 다만 강남권은 편도 80~100분으로 피로도가 높고, 판교·분당은 40~50분 수준이라 중간 거점으로 많이 검토됩니다. 이천 현지는 출퇴근 시간이 짧지만 생활 인프라와 교육 여건을 별도로 확인해야 합니다.",
  },
  {
    question: "SK하이닉스 셔틀버스 노선은 어디서 확인하나요?",
    answer:
      "실제 운행 노선은 HAPPYROAD 앱 또는 사내 포털에서 확인하는 것이 가장 정확합니다. 공개 커뮤니티에서는 강남역, 역삼역, 양재역, 판교역 등 주요 정류장이 언급되지만, 정류장과 운행 시간은 회사 정책과 수요에 따라 바뀔 수 있습니다.",
  },
  {
    question: "판교 발령과 이천 발령은 주거 선택이 어떻게 다른가요?",
    answer:
      "판교 사무소 발령은 판교·분당 현지 거주가 가능하고 이천 셔틀 의존도가 낮습니다. 이천 본사 발령은 셔틀 이용을 전제로 판교·분당을 중간 거점으로 보거나, 통근 시간을 줄이기 위해 이천·광주·곤지암권을 검토하는 식으로 나뉩니다.",
  },
  {
    question: "강남에서 이천까지 셔틀로 얼마나 걸리나요?",
    answer:
      "교통 상황에 따라 달라지지만 강남권에서 이천 본사까지는 약 80~100분으로 보는 것이 보수적입니다. 판교 현백 기준은 약 40분, 정자역은 약 50분 수준으로 알려져 있어 강남권과 체감 피로도 차이가 큽니다.",
  },
  {
    question: "SK하이닉스 PS 성과급으로 이천 아파트를 살 수 있나요?",
    answer:
      "성과급은 업황과 개인 조건에 따라 크게 달라집니다. 이천 시내 30평대 매매가를 약 2억 8천만원, LTV 70%를 단순 적용하면 자기자본은 약 8천만원대부터 계산할 수 있습니다. 다만 세금, 대출금리, 생활비, 성과급 변동성을 함께 봐야 합니다.",
  },
  {
    question: "용인 반도체 클러스터 착공 이후 어느 지역이 주목받나요?",
    answer:
      "용인 처인구 일대는 장기적으로 반도체 클러스터 영향권으로 거론됩니다. 다만 현재 단계에서 거주지를 투자 목적으로 고르는 것은 위험할 수 있으므로, 실제 근무지와 셔틀 노선이 확정된 뒤 주거 편의성 중심으로 판단하는 것이 안전합니다.",
  },
];

export const SK_HYNIX_SHUTTLE_RELATED = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/reports/samsung-shuttle-real-estate-2026/", label: "삼성전자 셔틀권 부동산 정리" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];
