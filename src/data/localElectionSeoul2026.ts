export type SeoulElectionParty = "더불어민주당" | "국민의힘" | "무소속" | "기타";
export type SeoulElectionBadge = "확정" | "확정대기" | "초박빙";

export interface SeoulElectionCandidate {
  name: string;
  party: SeoulElectionParty;
  voteShare: number | null;
  badge: SeoulElectionBadge;
}

export interface SeoulElectionSource {
  label: string;
  url: string;
}

export interface SeoulElectionPledge {
  category: string;
  title: string;
  description: string;
}

export interface SeoulElectionDistrict {
  districtId: string;
  districtName: string;
  districtShort: string;
  elected: SeoulElectionCandidate;
  runner: SeoulElectionCandidate | null;
  previousParty: SeoulElectionParty;
  isPartyFlip: boolean;
  tags: string[];
  career: string[];
  pledges: SeoulElectionPledge[];
  population: string;
  noteDate: string;
  sources: SeoulElectionSource[];
}

export interface SeoulElectionPageData {
  electionName: string;
  electionDate: string;
  dataAsOf: string;
  totalDistricts: number;
  demCount: number;
  pppCount: number;
  previousDemCount: number;
  previousPppCount: number;
  districts: SeoulElectionDistrict[];
  faq: { question: string; answer: string }[];
  seoIntro: string[];
  seoCriteria: string[];
  relatedLinks: { href: string; label: string }[];
}

const SOURCES: SeoulElectionSource[] = [
  { label: "중앙선거관리위원회 선거통계시스템", url: "https://info.nec.go.kr" },
  { label: "정책공약마당", url: "https://policy.nec.go.kr" },
];

const dem = "더불어민주당" as const;
const ppp = "국민의힘" as const;

const districtTopics: Record<string, { tags: string[]; pledges: SeoulElectionPledge[]; population: string }> = {
  jongno: { tags: ["구도심", "문화", "관광"], population: "약 14만 명", pledges: [
    { category: "도심 정비", title: "역사문화권 보행 환경 개선", description: "궁궐·박물관·상권을 잇는 보행축과 생활도로 정비가 핵심 쟁점입니다." },
    { category: "상권", title: "전통상권 체류 시간 확대", description: "서촌·익선동·대학로 상권의 임대료, 주차, 관광 동선 관리가 함께 다뤄집니다." },
  ] },
  jung: { tags: ["상권", "관광", "업무지구"], population: "약 12만 명", pledges: [
    { category: "상권", title: "명동·동대문 상권 회복", description: "관광 수요 회복 이후 임대료와 소상공인 지원 정책이 주요 비교 포인트입니다." },
    { category: "도시관리", title: "도심 업무지구 생활 인프라", description: "주거 인구와 유동 인구가 함께 쓰는 교통·청소·안전 행정 수요가 큽니다." },
  ] },
  yongsan: { tags: ["개발", "역세권", "용산공원"], population: "약 21만 명", pledges: [
    { category: "개발", title: "용산국제업무지구 연계 관리", description: "대형 개발과 기존 주거지 생활권을 어떻게 연결할지가 핵심 쟁점입니다." },
    { category: "공원", title: "용산공원 접근성 확대", description: "공원 개방, 보행 연결, 주변 상권 변화 대응이 함께 논의됩니다." },
  ] },
  seongdong: { tags: ["성수", "청년", "상권"], population: "약 28만 명", pledges: [
    { category: "상권", title: "성수동 과밀·젠트리피케이션 대응", description: "상권 성장과 주거 안정의 균형이 주요 정책 쟁점입니다." },
    { category: "교통", title: "한강·중랑천 생활권 연결", description: "자전거, 보행, 대중교통 환승 편의 개선 요구가 높습니다." },
  ] },
  gwangjin: { tags: ["청년", "대학가", "한강"], population: "약 33만 명", pledges: [
    { category: "청년", title: "대학가 청년 주거 지원", description: "건국대·세종대 주변 월세 부담과 생활 인프라가 비교 포인트입니다." },
    { category: "교통", title: "강변·구의역세권 재정비", description: "동서울터미널, 강변역, 구의역 일대 변화가 구정 핵심 이슈입니다." },
  ] },
  dongdaemun: { tags: ["교통", "청량리", "재개발"], population: "약 34만 명", pledges: [
    { category: "역세권", title: "청량리 광역교통 거점 정비", description: "GTX·철도 환승 수요와 주변 주거지 정비가 함께 다뤄집니다." },
    { category: "복지", title: "고령층 생활 돌봄 강화", description: "전통 주거지와 상권을 가진 구 특성상 돌봄 접근성이 중요한 이슈입니다." },
  ] },
  jungnang: { tags: ["교통", "주거", "중랑천"], population: "약 38만 명", pledges: [
    { category: "교통", title: "동북권 교통 접근성 개선", description: "면목선, 버스 환승, 중랑천 축 이동 편의가 주요 관심사입니다." },
    { category: "주거", title: "노후 주거지 생활환경 개선", description: "소규모 정비와 공공시설 보강이 구청장 공약 비교의 핵심입니다." },
  ] },
  seongbuk: { tags: ["교육", "대학가", "주거"], population: "약 42만 명", pledges: [
    { category: "교육", title: "대학·지역 연계 생활권", description: "대학가 상권과 주민 생활권을 함께 살리는 정책이 중요합니다." },
    { category: "주거", title: "구릉지·노후 주거지 정비", description: "보행 안전, 주차, 소규모 정비가 반복적으로 제기되는 쟁점입니다." },
  ] },
  gangbuk: { tags: ["북한산", "교통", "재개발"], population: "약 28만 명", pledges: [
    { category: "교통", title: "동북권 철도·버스 연결 강화", description: "출퇴근 이동 시간을 줄이는 광역·간선 교통망 공약이 중요합니다." },
    { category: "관광", title: "북한산 생활관광 활성화", description: "자연자원과 지역상권을 연결하는 운영 전략이 비교 포인트입니다." },
  ] },
  dobong: { tags: ["교통", "창동", "문화"], population: "약 31만 명", pledges: [
    { category: "개발", title: "창동 신경제 중심지 연계", description: "창동역 일대 복합개발과 일자리 유입 효과가 핵심 관심사입니다." },
    { category: "복지", title: "고령친화 생활 인프라", description: "고령 인구 비중을 고려한 의료·돌봄·이동 지원이 중요합니다." },
  ] },
  nowon: { tags: ["교육", "재건축", "동북권"], population: "약 49만 명", pledges: [
    { category: "주거", title: "노후 아파트 재건축 지원", description: "상계·중계권 대단지 재건축과 기반시설 확충이 큰 쟁점입니다." },
    { category: "교육", title: "교육·돌봄 인프라 유지", description: "학원가와 학교 밀집 지역의 교육 경쟁력이 정책 비교 포인트입니다." },
  ] },
  eunpyeong: { tags: ["교통", "수색", "은평뉴타운"], population: "약 46만 명", pledges: [
    { category: "교통", title: "서북권 광역교통 개선", description: "GTX-A, 수색역세권, 버스 환승 편의가 함께 다뤄집니다." },
    { category: "주거", title: "뉴타운·구도심 균형", description: "은평뉴타운과 기존 주거지의 생활 편차를 줄이는 정책이 중요합니다." },
  ] },
  seodaemun: { tags: ["대학가", "교통", "주거"], population: "약 30만 명", pledges: [
    { category: "청년", title: "신촌·홍제 청년 생활권", description: "대학가 상권 회복과 청년 주거 지원이 핵심 쟁점입니다." },
    { category: "교통", title: "서북권 연결 도로·보행 정비", description: "언덕길, 버스 노선, 보행 안전 개선 요구가 큽니다." },
  ] },
  mapo: { tags: ["상권", "한강", "청년"], population: "약 36만 명", pledges: [
    { category: "상권", title: "홍대·합정·상암 상권 관리", description: "관광·문화 상권 성장과 주민 생활환경의 균형이 주요 이슈입니다." },
    { category: "산업", title: "상암 DMC·콘텐츠 산업 연계", description: "미디어·콘텐츠 기업 집적 효과를 지역 일자리로 연결하는 전략이 비교됩니다." },
  ] },
  gangseo: { tags: ["마곡", "공항", "교통"], population: "약 56만 명", pledges: [
    { category: "산업", title: "마곡 연구개발지구 생활권 완성", description: "일자리 유입과 주거·교통 수요 증가에 대응하는 행정이 중요합니다." },
    { category: "교통", title: "김포공항·서남권 연결 개선", description: "공항 접근성과 주거지 교통 혼잡 관리가 핵심 쟁점입니다." },
  ] },
  yangcheon: { tags: ["목동", "재건축", "교육"], population: "약 43만 명", pledges: [
    { category: "주거", title: "목동 아파트 재건축 지원", description: "대단지 재건축, 학교·도로·공원 수용력이 함께 검토됩니다." },
    { category: "교육", title: "교육특구 생활 인프라", description: "학원가, 도서관, 돌봄 정책의 균형이 주민 관심사입니다." },
  ] },
  guro: { tags: ["산업", "교통", "구로디지털"], population: "약 39만 명", pledges: [
    { category: "산업", title: "G밸리 일자리·창업 지원", description: "디지털 산업단지와 주변 주거지의 교통·상권 연결이 중요합니다." },
    { category: "생활", title: "다문화·근로자 생활 지원", description: "다양한 생활권을 포괄하는 행정 서비스 접근성이 비교 포인트입니다." },
  ] },
  geumcheon: { tags: ["G밸리", "교통", "재개발"], population: "약 23만 명", pledges: [
    { category: "교통", title: "금천구청역·시흥권 연결", description: "서남권 내부 이동과 광역 접근성 개선 요구가 큽니다." },
    { category: "산업", title: "제조·디지털 산업 전환 지원", description: "기존 산업 기반을 유지하면서 신산업을 유치하는 전략이 중요합니다." },
  ] },
  yeongdeungpo: { tags: ["여의도", "준공업", "한강"], population: "약 38만 명", pledges: [
    { category: "개발", title: "여의도 금융·주거 정비", description: "금융 중심지 경쟁력과 노후 아파트 정비가 동시에 다뤄집니다." },
    { category: "도시관리", title: "준공업지역 생활환경 개선", description: "산업·주거 혼재 지역의 안전, 보행, 환경 개선이 쟁점입니다." },
  ] },
  dongjak: { tags: ["교통", "상권", "한강"], population: "약 38만 명", pledges: [
    { category: "교통", title: "노량진·사당 환승축 개선", description: "지하철·버스 환승 혼잡과 보행 동선을 줄이는 정책이 중요합니다." },
    { category: "청년", title: "노량진 청년 생활권 재정비", description: "고시촌 변화 이후 상권과 청년 주거를 어떻게 재편할지가 쟁점입니다." },
  ] },
  gwanak: { tags: ["청년", "대학가", "교통"], population: "약 48만 명", pledges: [
    { category: "청년", title: "1인가구·청년 주거 안전", description: "1인가구 비중이 높은 지역 특성상 안전·주거·복지 정책이 중요합니다." },
    { category: "교통", title: "서남권 철도·버스망 보강", description: "신림선 이후 환승, 버스, 관악산 생활권 연결이 비교 포인트입니다." },
  ] },
  seocho: { tags: ["재건축", "법조", "교통"], population: "약 40만 명", pledges: [
    { category: "주거", title: "재건축·정비사업 지원", description: "강남권 정비사업 속도와 공공기여 활용 방식이 핵심입니다." },
    { category: "교통", title: "강남대로·양재권 혼잡 완화", description: "업무·법조·주거 수요가 겹치는 축의 교통 관리가 중요합니다." },
  ] },
  gangnam: { tags: ["재건축", "업무지구", "교육"], population: "약 54만 명", pledges: [
    { category: "주거", title: "대치·압구정·개포 정비 관리", description: "대규모 재건축과 기반시설 부담을 함께 관리하는 정책이 쟁점입니다." },
    { category: "경제", title: "테헤란로 업무지구 경쟁력", description: "기업 유치, 교통, 보행환경 개선이 지역 경제 공약의 중심입니다." },
  ] },
  songpa: { tags: ["잠실", "재건축", "체육문화"], population: "약 65만 명", pledges: [
    { category: "개발", title: "잠실권 복합개발 대응", description: "잠실 스포츠·마이스, 재건축, 교통 수요가 함께 묶이는 지역입니다." },
    { category: "교통", title: "동남권 광역교통 혼잡 완화", description: "위례·문정·잠실 이동축의 혼잡 관리가 핵심 쟁점입니다." },
  ] },
  gangdong: { tags: ["고덕", "교통", "주거"], population: "약 46만 명", pledges: [
    { category: "교통", title: "고덕·강일권 교통 보강", description: "입주 이후 늘어난 통근 수요와 광역버스·철도 접근성이 중요합니다." },
    { category: "생활", title: "신규 주거지 생활 인프라", description: "학교, 보육, 공원, 생활체육 시설 확충 요구가 큽니다." },
  ] },
};

// TODO: 5개 국힘 구 선관위 최종 확인 필요 — 마포구 포함 여부 특히 재확인
const pppDistricts = new Set(["gangnam", "seocho", "songpa", "yongsan", "mapo"]);

const districtNames: { id: string; name: string; short: string; previousParty?: SeoulElectionParty; electedName?: string; voteShare?: number | null; badge?: SeoulElectionBadge }[] = [
  { id: "jongno", name: "종로구", short: "종로", previousParty: dem },
  { id: "jung", name: "중구", short: "중구", previousParty: dem },
  { id: "yongsan", name: "용산구", short: "용산", previousParty: ppp },
  { id: "seongdong", name: "성동구", short: "성동", previousParty: dem },
  { id: "gwangjin", name: "광진구", short: "광진", previousParty: dem },
  { id: "dongdaemun", name: "동대문구", short: "동대문", previousParty: dem },
  { id: "jungnang", name: "중랑구", short: "중랑", previousParty: dem },
  { id: "seongbuk", name: "성북구", short: "성북", previousParty: dem },
  { id: "gangbuk", name: "강북구", short: "강북", previousParty: dem },
  { id: "dobong", name: "도봉구", short: "도봉", previousParty: dem },
  { id: "nowon", name: "노원구", short: "노원", previousParty: dem },
  { id: "eunpyeong", name: "은평구", short: "은평", previousParty: dem },
  { id: "seodaemun", name: "서대문구", short: "서대문", previousParty: dem },
  { id: "mapo", name: "마포구", short: "마포", previousParty: ppp },
  { id: "gangseo", name: "강서구", short: "강서", previousParty: dem },
  { id: "yangcheon", name: "양천구", short: "양천", previousParty: dem },
  { id: "guro", name: "구로구", short: "구로", previousParty: dem },
  { id: "geumcheon", name: "금천구", short: "금천", previousParty: dem },
  { id: "yeongdeungpo", name: "영등포구", short: "영등포", previousParty: dem },
  { id: "dongjak", name: "동작구", short: "동작", previousParty: dem },
  { id: "gwanak", name: "관악구", short: "관악", previousParty: dem },
  { id: "seocho", name: "서초구", short: "서초", previousParty: ppp },
  { id: "gangnam", name: "강남구", short: "강남", previousParty: ppp, electedName: "조성명", voteShare: null, badge: "확정" },
  { id: "songpa", name: "송파구", short: "송파", previousParty: ppp },
  { id: "gangdong", name: "강동구", short: "강동", previousParty: dem },
];

export const seoulElectionDistricts: SeoulElectionDistrict[] = districtNames.map((district) => {
  const party = pppDistricts.has(district.id) ? ppp : dem;
  const topics = districtTopics[district.id];
  return {
    districtId: district.id,
    districtName: district.name,
    districtShort: district.short,
    elected: {
      name: district.electedName ?? "확정대기",
      party,
      voteShare: district.voteShare ?? null,
      badge: district.badge ?? "확정대기",
    },
    runner: null,
    previousParty: district.previousParty ?? dem,
    isPartyFlip: (district.previousParty ?? dem) !== party,
    tags: topics.tags,
    career: district.electedName ? ["현직·후보 이력은 선관위 최종 공개 기준으로 확인 중"] : ["후보 이력 확정대기"],
    pledges: topics.pledges,
    population: topics.population,
    noteDate: "2026-06-04",
    sources: SOURCES,
  };
});

export const seoulElectionPageData: SeoulElectionPageData = {
  electionName: "2026 서울 구청장 선거",
  electionDate: "2026-06-03",
  dataAsOf: "2026-06-04 14:00 개표율 99.92% 기준",
  totalDistricts: 25,
  demCount: 20,
  pppCount: 5,
  previousDemCount: 14,
  previousPppCount: 11,
  districts: seoulElectionDistricts,
  faq: [
    {
      question: "서울 구청장 선거 결과는 어디까지 확정된 자료인가요?",
      answer: "이 페이지는 2026년 6월 4일 개표율 99.79% 기준의 판세와 정당별 당선 구도를 우선 정리했습니다. 이름과 득표율은 선관위 최종 확정 화면 확인 후 순차 보강합니다.",
    },
    {
      question: "지도 색상은 무엇을 의미하나요?",
      answer: "파란색은 더불어민주당, 빨간색은 국민의힘 당선 구를 뜻합니다. 마포·용산·서초·강남·송파 5개 구가 국민의힘, 나머지 20개 구가 더불어민주당으로 분류되어 있습니다.",
    },
    {
      question: "공약 정보는 후보 공식 공약인가요?",
      answer: "구별 쟁점 카드는 정책공약마당과 지역 현안을 바탕으로 정리한 참고 항목입니다. 후보별 원문 공약은 정책공약마당에서 확인하는 것이 가장 안전합니다.",
    },
    {
      question: "실제 행정구역 경계와 SVG 지도가 완전히 일치하나요?",
      answer: "아닙니다. 이 지도는 모바일에서 클릭과 비교가 쉽도록 단순화한 SVG 다이어그램입니다. 실제 법정 경계 확인에는 서울시·선관위 공식 지도를 함께 봐야 합니다.",
    },
  ],
  seoIntro: [
    "2026 서울 구청장 선거 결과를 25개 자치구 단위로 비교할 수 있도록 정리했습니다. 지도에서 구를 누르면 정당, 당선자 확인 상태, 2022년 대비 정당 교체 여부, 지역별 핵심 쟁점을 한 화면에서 볼 수 있습니다.",
    "서울 구청장 선거는 시장 선거보다 생활 행정과 더 직접적으로 연결됩니다. 재건축, 구도심 정비, 청년 주거, 상권 회복, 돌봄, 교통망 같은 이슈는 구청장 권한과 예산 집행 방향에 따라 체감 차이가 커질 수 있습니다.",
    "현재 페이지는 빠른 판세 확인에 초점을 둔 버전입니다. 최종 확정 당선자명, 득표율, 후보별 공약 원문이 확인되는 순서대로 업데이트하며, 확정 전 항목은 임의 숫자를 넣지 않고 확정대기로 표시합니다.",
  ],
  seoCriteria: [
    "정당별 구도는 2026년 6월 4일 개표율 99.79% 기준으로 정리했습니다.",
    "당선자명과 득표율이 최종 확인되지 않은 구는 확정대기로 표시했습니다.",
    "구별 쟁점은 공식 공약 원문과 지역 현안을 함께 보기 위한 참고 정보이며, 공식 수치로 오해되지 않도록 후보별 득표율과 분리했습니다.",
    "SVG 지도는 정보 탐색용 단순화 지도입니다. 행정구역 면적과 실제 경계 비율은 반영하지 않았습니다.",
  ],
  relatedLinks: [
    { href: "/reports/local-election-governor-2026/",       label: "2026 시도지사 당선자 지도" },
    { href: "/reports/local-election-byeollection-2026/",   label: "재보궐 14개 지역구 당선자" },
    { href: "/reports/local-election-superintendent-2026/", label: "17개 시도 교육감 당선자" },
    { href: "/reports/seoul-mayor-candidate-assets-2026/",  label: "서울시장 후보 재산 비교" },
  ],
};

export const getPartyClass = (party: SeoulElectionParty) => {
  if (party === "더불어민주당") return "dem";
  if (party === "국민의힘") return "ppp";
  return "other";
};

export const formatVoteShare = (voteShare: number | null) => (
  typeof voteShare === "number" && voteShare > 0 ? `${voteShare.toFixed(2)}%` : "확정대기"
);
