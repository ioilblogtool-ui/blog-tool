export type GslaRegionKey = "dongtan" | "bundang" | "suji" | "yeongtong";

export interface GslaScore {
  priceLevel: number;
  transport: number;
  jobAccess: number;
  schoolLife: number;
  newness: number;
  momentum: number;
  riskControl: number;
}

export interface GslaRegion {
  key: GslaRegionKey;
  name: string;
  label: string;
  summary: string;
  representativeAreas: string[];
  leaderComplexes: string[];
  priceRange84: string;
  priceBasis: string;
  weeklyChange?: {
    value: string;
    label: string;
    sourceNote: string;
  };
  transport: string[];
  jobAccess: string[];
  schoolLife: string;
  newnessOrRedevelopment: string;
  mainRisk: string;
  whyExpensive: string[];
  buyerFit: string[];
  caution: string[];
  score: GslaScore;
}

export interface GslaRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface GslaFaqItem {
  question: string;
  answer: string;
}

export const GSLA_META = {
  slug: "gyeonggi-south-leader-apartment-comparison-2026",
  title: "동탄·분당·수지·영통 대장 아파트 가격 비교",
  seoTitle: "동탄·분당·수지·영통 대장 아파트 가격 비교｜2026 경기 남부 84㎡ 시세 순위",
  description:
    "동탄, 분당, 수지, 영통의 대장 아파트 84㎡ 가격대와 GTX·신분당선·삼성전자·판교 접근성, 학군, 신축성, 재건축 기대, 리스크를 한 표로 비교합니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "가격대와 상승률은 전용 84㎡ 기준 최근 실거래가, 주요 매물가, 한국부동산원 주간 동향 보도 수치를 함께 참고한 비교용 범위입니다. 단지, 동, 층, 향, 거래 시점에 따라 실제 가격은 달라질 수 있습니다.",
  caution:
    "이 리포트는 투자 권유가 아니라 지역별 가격 구조와 리스크를 비교하기 위한 정보 콘텐츠입니다. 매수 판단 전에는 최신 실거래가, 등기, 대출 가능액, 세금, 개인 현금흐름을 별도로 확인해야 합니다.",
} as const;

export const GSLA_REGIONS: GslaRegion[] = [
  {
    key: "dongtan",
    name: "동탄",
    label: "상승 탄력형",
    summary: "GTX-A, SRT, 동탄역 생활권, 반도체 벨트 기대감이 신축 대단지 가격을 빠르게 끌어올린 지역입니다.",
    representativeAreas: ["동탄역", "동탄2신도시", "여울공원·센트럴파크 생활권"],
    leaderComplexes: ["동탄역롯데캐슬", "동탄역시범우남퍼스트빌", "동탄역더샵센트럴시티", "동탄역반도유보라아이비파크"],
    priceRange84: "15억~20억대",
    priceBasis: "동탄역 인근 신축·준신축 대장 단지 84㎡ 실거래와 매물가를 함께 보는 범위",
    weeklyChange: {
      value: "2.22%",
      label: "최근 보도 기준 주간 상승률",
      sourceNote: "동탄 권역 집계 또는 기사 인용 수치로, 구현 후 공식 통계 단위 확인 필요",
    },
    transport: ["GTX-A", "SRT", "동탄역", "경부고속도로 접근"],
    jobAccess: ["삼성전자 화성·기흥", "용인 반도체 클러스터", "평택 삼성캠퍼스"],
    schoolLife: "보통~양호",
    newnessOrRedevelopment: "신축·준신축 대단지 프리미엄",
    mainRisk: "단기 급등, 동탄역과 비역세권 가격 차이",
    whyExpensive: ["GTX-A 개통 효과", "반도체 직주근접 수요", "신축 대단지 희소성"],
    buyerFit: ["신축을 선호하는 맞벌이", "동탄역 접근성을 중시하는 수요", "반도체 벨트 출퇴근 수요"],
    caution: ["최근 상승률이 높을수록 추격 매수 부담이 커집니다.", "동탄 안에서도 역세권, 학교, 상권 접근성에 따라 가격 차이가 큽니다."],
    score: {
      priceLevel: 4,
      transport: 4.5,
      jobAccess: 4.5,
      schoolLife: 3.5,
      newness: 4.5,
      momentum: 5,
      riskControl: 2.5,
    },
  },
  {
    key: "bundang",
    name: "분당",
    label: "상급지 안정형",
    summary: "판교·강남 접근성, 학군, 생활 인프라, 1기 신도시 재건축 기대가 가격을 지지하는 경기 남부 대표 상급지입니다.",
    representativeAreas: ["서현", "수내", "정자", "이매", "야탑"],
    leaderComplexes: ["분당 시범단지", "정자동 파크뷰", "정자동 아이파크", "수내·서현 주요 대단지"],
    priceRange84: "18억~25억+",
    priceBasis: "정자동·수내·서현 주요 단지 84㎡ 상단 거래와 매물가를 함께 보는 범위",
    weeklyChange: {
      value: "0.49%",
      label: "최근 보도 기준 주간 상승률",
      sourceNote: "분당구 또는 기사 인용 수치 기준 재확인 필요",
    },
    transport: ["신분당선", "수인분당선", "분당내곡로", "경부고속도로 접근"],
    jobAccess: ["판교 테크노밸리", "강남 업무지구", "성남·수원 업무권"],
    schoolLife: "강함",
    newnessOrRedevelopment: "1기 신도시 재건축 기대",
    mainRisk: "절대 가격 부담, 재건축 속도, 구축 관리비",
    whyExpensive: ["판교·강남 접근성", "학군과 생활 인프라", "재건축 기대감"],
    buyerFit: ["학군과 생활 편의성을 중시하는 가족", "판교·강남 출퇴근 수요", "상급지 갈아타기 수요"],
    caution: ["가격 레벨이 높아 금리와 대출 규제에 민감합니다.", "재건축 기대는 단지별 사업 속도와 정책 변수에 따라 달라집니다."],
    score: {
      priceLevel: 5,
      transport: 4.5,
      jobAccess: 5,
      schoolLife: 5,
      newness: 2.5,
      momentum: 3.5,
      riskControl: 3,
    },
  },
  {
    key: "suji",
    name: "수지",
    label: "균형 실거주형",
    summary: "신분당선, 학군, 판교·강남 접근성을 함께 보는 실거주 수요가 강한 지역입니다.",
    representativeAreas: ["성복", "상현", "동천", "풍덕천"],
    leaderComplexes: ["성복역롯데캐슬골드타운", "e편한세상수지", "래미안수지이스트파크", "동천자이"],
    priceRange84: "12억~18억",
    priceBasis: "성복·상현·동천 역세권 및 준신축 단지 84㎡ 가격대를 함께 보는 범위",
    transport: ["신분당선", "용인서울고속도로", "수지구청·성복역 생활권"],
    jobAccess: ["판교", "강남", "광교·수원 업무권"],
    schoolLife: "강함",
    newnessOrRedevelopment: "준신축과 구축 혼재",
    mainRisk: "역세권과 비역세권 교통 체감 차이",
    whyExpensive: ["신분당선 서울 접근성", "학군과 주거 선호", "분당 대비 낮은 가격 부담"],
    buyerFit: ["분당 가격이 부담스러운 실거주자", "신분당선 출퇴근 수요", "학군과 생활 편의성을 함께 보는 가족"],
    caution: ["성복, 상현, 동천은 같은 수지 안에서도 교통 체감이 다릅니다.", "도로 정체와 역 접근 시간을 실제 출퇴근 기준으로 확인해야 합니다."],
    score: {
      priceLevel: 3.5,
      transport: 4,
      jobAccess: 4,
      schoolLife: 4.5,
      newness: 3.5,
      momentum: 3.5,
      riskControl: 3.5,
    },
  },
  {
    key: "yeongtong",
    name: "영통",
    label: "직주근접 현실형",
    summary: "삼성전자 직주근접, 수원·광교 생활권, 상대적으로 접근 가능한 가격대가 장점인 실수요권입니다.",
    representativeAreas: ["영통", "망포", "광교", "원천"],
    leaderComplexes: ["광교중흥S클래스", "광교자연앤힐스테이트", "힐스테이트영통", "영통아이파크캐슬"],
    priceRange84: "10억~16억",
    priceBasis: "영통·망포·광교권 대표 단지 84㎡ 가격대를 함께 보는 범위",
    weeklyChange: {
      value: "0.34%",
      label: "최근 보도 기준 주간 상승률",
      sourceNote: "수원 영통구 또는 기사 인용 수치 기준 재확인 필요",
    },
    transport: ["수인분당선", "광교중앙역", "GTX 기대", "용인서울고속도로 접근"],
    jobAccess: ["삼성전자 수원·기흥", "광교 업무권", "수원 산업·행정 업무권"],
    schoolLife: "양호",
    newnessOrRedevelopment: "입지별 신축·준신축 차이",
    mainRisk: "지역 내 가격 격차, 동탄 대비 약한 검색 후킹",
    whyExpensive: ["삼성전자 직주근접", "광교·수원 생활 인프라", "상대적 가격 접근성"],
    buyerFit: ["삼성전자 출퇴근 수요", "광교·수원 생활권 선호자", "동탄·수지보다 예산을 낮추려는 수요"],
    caution: ["광교, 망포, 영통은 생활권과 가격대가 다릅니다.", "GTX 기대는 노선과 개통 시점에 따라 가격 반영 정도가 달라질 수 있습니다."],
    score: {
      priceLevel: 3,
      transport: 3.5,
      jobAccess: 4,
      schoolLife: 4,
      newness: 3.5,
      momentum: 3,
      riskControl: 3.5,
    },
  },
];

export const GSLA_SCORE_LABELS: { key: keyof GslaScore; label: string; note: string }[] = [
  { key: "priceLevel", label: "가격 레벨", note: "비쌀수록 높은 점수" },
  { key: "transport", label: "교통", note: "철도·광역 접근성" },
  { key: "jobAccess", label: "직주근접", note: "주요 업무지구 접근" },
  { key: "schoolLife", label: "학군·생활", note: "교육·상권·생활 인프라" },
  { key: "newness", label: "신축성", note: "신축·준신축 또는 재건축 기대" },
  { key: "momentum", label: "상승 탄력", note: "거래 열기와 호재 집중도" },
  { key: "riskControl", label: "리스크 관리", note: "점수가 높을수록 리스크가 낮음" },
];

export const GSLA_RELATED_LINKS: GslaRelatedLink[] = [
  {
    href: "/tools/home-purchase-fund/",
    label: "주택구입자금 계산기",
    description: "목표 아파트 가격을 넣고 필요한 현금, 대출 규모, 취득 부대비용을 계산합니다.",
  },
  {
    href: "/tools/couple-monthly-cashflow-calculator/",
    label: "부부 월 현금흐름 계산기",
    description: "연봉, 대출, 육아비, 생활비를 넣고 매달 실제로 얼마가 남는지 확인합니다.",
  },
  {
    href: "/tools/jeonwolse-conversion/",
    label: "전월세 전환 계산기",
    description: "매수 대신 전세나 월세를 선택할 때 체감 비용이 어떻게 달라지는지 비교합니다.",
  },
  {
    href: "/reports/seoul-housing-2016-vs-2026/",
    label: "서울 집값 2016 vs 2026",
    description: "10년 동안 서울 주거비가 어떻게 달라졌는지 장기 흐름으로 비교합니다.",
  },
];

export const GSLA_SOURCE_LINKS: GslaRelatedLink[] = [
  {
    href: "https://www.reb.or.kr/",
    label: "한국부동산원",
    description: "주간 아파트가격 동향과 지역별 시장 흐름 확인에 사용합니다.",
  },
  {
    href: "https://rt.molit.go.kr/",
    label: "국토교통부 실거래가 공개시스템",
    description: "단지별 전용 84㎡ 최근 실거래가를 확인하는 1차 기준입니다.",
  },
  {
    href: "https://new.land.naver.com/",
    label: "네이버부동산",
    description: "현재 매물가와 실거래가 사이의 괴리를 보조적으로 확인합니다.",
  },
];

export const GSLA_FAQ: GslaFaqItem[] = [
  {
    question: "동탄, 분당, 수지, 영통 중 어디가 가장 비싼가요?",
    answer:
      "전용 84㎡ 대장 단지 가격대만 보면 분당이 가장 높은 가격 레벨을 형성하는 경우가 많습니다. 다만 동탄역 인근 신축 대장 단지는 GTX-A와 반도체 수요가 반영되면서 분당과 직접 비교되는 가격대까지 올라온 구간이 있습니다.",
  },
  {
    question: "동탄은 왜 최근 상승세가 강한가요?",
    answer:
      "동탄은 GTX-A, SRT, 동탄역 생활권, 삼성전자와 반도체 벨트 수요, 신축 대단지 선호가 함께 작용합니다. 다만 단기 상승률이 높을수록 매수자는 실거래가와 매물가 차이, 대출 부담, 입주 물량을 함께 봐야 합니다.",
  },
  {
    question: "분당은 구축이 많은데도 왜 비싼가요?",
    answer:
      "분당은 판교와 강남 접근성, 학군, 생활 인프라, 1기 신도시 재건축 기대가 가격을 지지합니다. 신축성은 동탄보다 약할 수 있지만 입지 안정성과 수요층의 두께가 강점입니다.",
  },
  {
    question: "수지는 분당 대체지가 될 수 있나요?",
    answer:
      "수지는 신분당선, 학군, 판교·강남 접근성을 갖춘 지역이어서 분당보다 가격 부담을 낮추고 싶은 실거주자에게 대체지로 검토됩니다. 다만 성복, 상현, 동천 등 세부 입지에 따라 교통 체감과 가격대가 다릅니다.",
  },
  {
    question: "영통은 동탄이나 수지보다 저평가인가요?",
    answer:
      "영통은 삼성전자 직주근접과 수원·광교 생활권이라는 강점이 있습니다. 다만 동탄의 GTX-A 후킹이나 수지의 신분당선 후킹에 비해 전국 검색 화제성은 약할 수 있어, 세부 단지와 출퇴근 동선을 기준으로 봐야 합니다.",
  },
  {
    question: "15억 예산이면 어느 지역을 봐야 하나요?",
    answer:
      "15억 예산은 동탄, 수지, 영통의 주요 단지와 분당 일부 단지를 함께 비교할 수 있는 구간입니다. 하지만 취득세, 중개보수, 대출 이자, 관리비, 자녀 교육비를 고려하면 단순 매매가보다 월 현금흐름이 더 중요합니다.",
  },
  {
    question: "대장 아파트만 보면 안 되는 이유는 무엇인가요?",
    answer:
      "대장 아파트는 지역의 상단 가격을 보여주는 기준점입니다. 실제 매수 가능성은 예산, 대출, 층·향·동, 역세권 여부에 따라 달라지므로 같은 생활권의 2군 단지까지 함께 비교하는 것이 현실적입니다.",
  },
];

export const GSLA_SEO_INTRO = [
  "2026년 경기 남부 아파트 시장에서 가장 많이 비교되는 지역은 동탄, 분당, 수지, 영통입니다. 동탄은 GTX-A와 반도체 벨트 기대감으로 상승 탄력이 강하고, 분당은 판교·강남 접근성과 1기 신도시 재건축 기대가 가격을 받칩니다. 수지는 신분당선과 학군, 영통은 삼성전자 직주근접과 광교·수원 생활권이 강점입니다.",
  "하지만 단순히 어디가 올랐는지만 보면 판단이 어렵습니다. 같은 전용 84㎡라도 동탄은 신축·교통 호재가, 분당은 입지·학군·재건축 기대가, 수지는 신분당선과 생활권이, 영통은 삼성전자 직주근접이 가격에 반영됩니다.",
  "이 리포트는 네 지역의 대장 아파트 가격대를 같은 표로 놓고, 왜 비싼지와 어떤 리스크가 있는지까지 비교합니다. 관심 지역을 고른 뒤에는 주택구입자금 계산기와 부부 월 현금흐름 계산기로 실제 부담 가능한 가격인지 함께 확인하는 흐름을 권장합니다.",
];

export const GSLA_CRITERIA = [
  "가격대는 전용 84㎡ 기준 최근 실거래가와 주요 매물가를 함께 참고한 범위입니다.",
  "주간 상승률은 보도 인용 수치를 출발점으로 삼되, 지역 단위는 한국부동산원 원문 기준 확인이 필요합니다.",
  "점수표는 비교계산소 자체 평가 기준이며 매수 추천 점수가 아닙니다.",
  "광교와 영통은 행정구역과 생활권이 겹치는 구간이 있어 본문에서는 영통·광교권으로 함께 설명합니다.",
  "실제 매수 판단은 대출 가능액, DSR, 세금, 보유 현금, 자녀 계획, 출퇴근 동선에 따라 달라집니다.",
];

export function formatScore(score: number): string {
  return `${score.toFixed(score % 1 === 0 ? 0 : 1)} / 5`;
}

export function scoreWidth(score: number): string {
  return `${Math.max(0, Math.min(100, (score / 5) * 100))}%`;
}
